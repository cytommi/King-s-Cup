const fs = require("fs");
const express = require("express");
const cors = require("cors");
const redis = require("async-redis");
const http = require("http");
const https = require("https");
const socketIO = require("socket.io");
const path = require("path");
const bodyParser = require("body-parser");
const compression = require("compression");
const NODE_ENV = process.env.NODE_ENV || "development";

require("dotenv").config({
  path: path.join(__dirname, `../.env.${NODE_ENV}`),
});

const { SERVER_PORT, REDIS_PORT } = process.env;

const setupServer = async () => {
  const app = express();
  app.use(cors());
  app.use(compression());
  app.set("view engine", "pug");
  app.set("views", path.join(__dirname, `../dist`));
  app.use(express.static(path.join(__dirname, "../dist")));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.json());

  app.redisClient = redis.createClient(REDIS_PORT);
  app.redisClient.on("ready", () => {
    console.log("Redis Connected!");
  });

  app.redisClient.on("error", (err) => {
    console.log(err);
    process.exit(-1);
  });

  /** Import custom Redis utilities */
  require("./game")(app);

  /** Import api endpoints */
  require("./api")(app);

  app.get("*", async (req, res) => {
    res.render("base.pug");
  });

  let server;
  if (NODE_ENV === "production") {
    const options = {
      key: fs.readFileSync(process.env.HTTPS_KEY_PATH, "utf8"),
      cert: fs.readFileSync(process.env.HTTPS_CERT_PATH, "utf8"),
      ca: fs.readFileSync(process.env.HTTPS_CA_PATH, "utf8"),
    };

    // Listen for HTTPS requests
    server = https.createServer(options, app);

    // Redirect HTTP to HTTPS
    http
      .createServer((req, res) => {
        const location = `https://www.cytommigames.com`;
        res.writeHead(302, { Location: location });
        res.end();
      })
      .listen(80, () => {
        console.log(`King's Cup server listening on 80 for HTTPS redirect`);
      });
  } else {
    server = http.createServer(app);
  }
  const io = socketIO(server);
  app.io = io;
  require("./io-handler")(app);
  server.listen(SERVER_PORT, () =>
    console.log(`King's Cup server listening on ${SERVER_PORT}`)
  );
};

setupServer();

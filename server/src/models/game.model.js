const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const GameSchema = new Schema({
	players: {
		type: [ ObjectId ]
	}
});
const adf = {
	asdf: String,
	asdf: Number
};

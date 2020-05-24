const path = require('path');
require('babel-polyfill');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin');
const WebpackBar = require('webpackbar');
const Dotenv = require('dotenv-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

module.exports = {
  context: path.join(__dirname, '/src'),
  mode: 'production',
  entry: ['babel-polyfill', './App.jsx'],
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(js|jsx)$/,
        use: ['source-map-loader'],
        exclude: /node_modules/,
        enforce: 'pre',
      },
      {
        test: /\.(jpg|png|svg)$/,
        use: {
          loader: 'url-loader',
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            // This loader resolves url() and @imports inside CSS
            loader: 'css-loader',
          },
          {
            // First we transform SASS to standard CSS
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.join(__dirname, '../server/dist'),
    sourceMapFilename: '[name].js.map',
  },
  plugins: [
    new Dotenv({ path: path.join(__dirname, `.env.production`) }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[name].[contenthash].css',
    }),
    new HtmlWebpackPlugin({
      base: '/',
      template: `base.pug`,
      filename: `base.pug`,
      meta: {
        charset: 'utf-8',
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
        title: `King's cup | Play Online Free`,
        description:
          'Play the famous drinking game online for free with your friends! No registration required!',
        robots: 'index, nofollow',
        'og:title': `Play King's Cup!`,
        'og:description':
          'Play the famous drinking game online with friends for free. No registration required!',
        'og:url': 'https://www.cytommigames.com',
        'og:type': 'website',
        'og:image': path.join(__dirname, './src/assets/images/Kings_Cup.png'),
      },
      favicon: path.join(__dirname, './src/assets/icons/favicon.ico'),
    }),
    new HtmlWebpackPugPlugin(),
    new WebpackBar(),
    new BundleAnalyzerPlugin(),
  ],
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};

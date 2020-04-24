const path = require('path');
require('babel-polyfill');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin');
const WebpackBar = require('webpackbar');
const Dotenv = require('dotenv-webpack');
const AutoPrefixer = require('autoprefixer');
const CssNano = require('cssnano');

module.exports = {
	context: path.join(__dirname, '/src'),
	mode: 'production',
	entry: [ 'babel-polyfill', './App.jsx' ],
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: /\.(sa|sc|c)ss$/,
				use: [
					{
						// This loader resolves url() and @imports inside CSS
						loader: 'css-loader'
					},
					{
						// Then we apply postCSS fixes like autoprefixer and minifying
						loader: 'postcss-loader'
					},
					{
						// First we transform SASS to standard CSS
						loader: 'sass-loader',
						options: {
							implementation: require('sass')
						}
					}
				]
			}
		]
	},
	resolve: {
		extensions: [ '*', '.js', '.jsx' ]
	},
	output: {
		filename: '[name].[contenthash].js',
		chunkFilename: '[name].[contenthash].js',
		path: path.join(__dirname, '../server/public'),
		sourceMapFilename: '[name].js.map'
	},
	plugins: [
		new Dotenv({ path: path.join(__dirname, `../.env.development`) }),
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: `base.pug`,
			filename: `base.pug`
		}),
		new HtmlWebpackPugPlugin(),
		new WebpackBar(),
		AutoPrefixer,
		CssNano
		// More postCSS modules here if needed
	],
	optimization: {
		runtimeChunk: 'single',
		splitChunks: {
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'all'
				}
			}
		}
	}
};

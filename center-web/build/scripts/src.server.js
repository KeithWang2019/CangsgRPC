const webpack = require("webpack");
const init = require('../webpack.src.conf.js');

process.env = require("../../config/dev.env");

module.exports = init(process.env)
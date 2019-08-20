'use strict'

const webpack = require('webpack');
const merge = require('webpack-merge');
const resolveApp = require('./common');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('./webpack.base.conf');

function init(env) {
    const webpackConfig = merge(config, {
        devtool: env.devtool,
        mode: env.mode,
        entry: {
            "index": resolveApp("src/main.js")
        },
        output: {
            path: resolveApp('dist'),
            filename: '[name]_[hash].js',
            publicPath: "/"
        },
        optimization: {
            minimize: env.mode == "development" ? false : true
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': env
            }),
            new HtmlWebpackPlugin({
                filename: './index.html',
                template: resolveApp('index.html'),
                inject: true,
                chunks: ['index']
            }),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.DllReferencePlugin({
                manifest: require(resolveApp('dist/vendor_manifest.json'))
            })
        ],
        devServer: {
            port: 7001,
            contentBase: resolveApp('dist'),
            disableHostCheck: false,
            inline: true,
            hot: true,
            open: true,
            publicPath: "/",
            historyApiFallback: {
                index: '/index.html'//index.html为当前目录创建的template.html
            },
            host: '127.0.0.1'
        },
    });
    return webpackConfig;
}

module.exports = init;
'use strict'

const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const resolveApp = require('./common');

const config = require('./webpack.base.conf');


function init(env) {
    const webpackConfig = merge(config, {
        devtool: env.devtool,
        mode: env.mode,
        entry: {
            vendor: ['core-js/stable', 'react', 'react-dom', 'react-redux', 'react-router-dom', 'redux', 'redux-thunk']
        },
        output: {
            path: resolveApp('dist'),
            filename: '[name].dll.js',
            library: '[name]_[hash]'
        },
        optimization: {
            minimize: env.mode == "development" ? false : true
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': env
            }),
            new webpack.DllPlugin({
                name: '[name]_[hash]',
                path: path.join(resolveApp('dist'), '[name]_manifest.json'),
            })
        ]
    });
    return webpackConfig;
}

module.exports = init;
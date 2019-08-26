'use strict'

const resolveApp = require('./common');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    bail: false,
    devtool: "development",
    mode: "source-map",
    entry: {
    },
    output: {
    },
    resolve: {
        alias: {
            'store': resolveApp('src/store'),
            'css': resolveApp('src/components/css'),
            'components': resolveApp('src/components'),
            'common': resolveApp('src/common'),
            'keith-ui': resolveApp('src/components/base/keith-ui'),
            'views': resolveApp('src/components/views')
        },
        extensions: ['.js', '.json', '.jsx', '.css']
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            babelrc: false,
                            presets: [
                                ['@babel/preset-env'],
                                ['@babel/preset-react']
                            ],
                            plugins: ["@babel/plugin-syntax-dynamic-import", "@babel/plugin-proposal-class-properties"]
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/i,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1,
                            name: 'img/[name].[hash:7].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1,
                            name: 'img/[name].[hash:7].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        },

                    }
                ]
            },
            {
                test: /\.css$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].dll.css",
            chunkFilename: "[id].css"
        })
    ],
    node: {
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty',
    }
}
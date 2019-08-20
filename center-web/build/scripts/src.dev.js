const webpack = require("webpack");
const init = require('../webpack.src.conf.js');

process.env = require("../../config/dev.env");

const compiler = webpack(init(process.env));

compiler.run((err, stats) => {
    if (err) {
        console.error(err);
        return;
    }

    console.log(stats.toString({
        chunks: false,  // Makes the build much quieter
        colors: true   // Shows colors in the console
    }));
    // console.log('\u001b[1m\u001b[32m');
    console.log('===== [ Dll文件打包 ] =====');
    // console.log('\u001b[39m\u001b[22m');
});
const webpack = require("webpack");
const init = require('../webpack.src.conf.js');

process.env = require("../../config/dev.env");

const resolveApp = require('../common');
const compiler = webpack(init(process.env));

var child_process = require('child_process');

function copyIt(from, to) {
    child_process.spawn('xcopy', [from, to, '/e', '/y']);
}

compiler.watch(null, (err, stats) => {
    if (err) {
        console.error(err);
        return;
    }

    console.log(stats.toString({
        chunks: false,  // Makes the build much quieter
        colors: true   // Shows colors in the console
    }));
    // console.log('\u001b[1m\u001b[32m');
    console.log('===== [ SRC文件打包watch ] =====');
    // console.log('\u001b[39m\u001b[22m');
    copyIt(resolveApp(".\\dist\\*.*"), resolveApp("..\\center\\src\\main\\resources\\WEB-INF\\html"));
});
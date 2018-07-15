const util = require('util');
const readline = require('readline')

function formatData(data){
    let string = "";
    let urls = Object.keys(data.urls);
    urls.forEach(u => {
        let methods = Object.keys(data.urls[u]);
        methods.forEach(m => {
            let record = data.urls[u][m];
            string += `(${m})${u} ${record.rx}/${record.tx} (${((record.expected/record.tx)*100).toFixed(3)}%) - Responses: ${JSON.stringify(record.responses)} - MIN: ${record.times.min.toFixed(4)} MAX: ${record.times.max.toFixed(4)} AVG: ${((record.times.sum/record.rx)*100).toFixed(4)}\n`
        })
    })
    return string;
}

module.exports = {
    log: function(log) {
        return util.inspect(log, false, null)
    },
    writeData: function (data) {
        readline.cursorTo(process.stdout, 0, 0)
        readline.clearScreenDown(process.stdout)
        console.log(formatData(data));
    }
}
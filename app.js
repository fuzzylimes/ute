const express = require('express');
const request = require('request');
const config = require('./src/config');
const payload = require('./scenarios/dummy');
var program = require('commander');
const app = express();
// Express Management Stuff...
// Import Routes
const dummy = require('./routes/dummy');

program
    .version('0.0.1')
    .option('-p --parallel', '[optional] Run all calls defined in scenario file in parallel, based on provided execution cycle.\nThis will effectively multiply the rate "-r" by the number of scenarios defined in your scenario file\nDefault is running scenario list sequentially.', false)
    .option('-s --scenario <file>', '[REQUIRED] Scenario traffic file to use (from scenarios folder).')
    .option('-r --rate <rate>', '[REQUIRED] Number of calls to be sent per period. Period defaults to 60 seconds. Use "-P" to change the period', parseInt)
    .option('-P --period <period>', '[optional] Period in which "-r" number of messages will be sent. Default (60 second) defined in config file (period)', parseInt, config.period)
    .option('-l --port <port>', '[optional] Listening port for the server (needed for receiving commands/connecting to ute-visor). Default (5000) defined in config file (port).', parseInt, config.port)
    .option('-d --delay', '[optional] Tells ute not to fire on startup', false)
program.parse(process.argv);

if (!program.scenario || !program.rate){
    console.log("-s and -r are both required parameters. Please see -h for more information.")
    process.exit(1);
}

console.log(program);
console.log(program.parallel);
console.log(program.scenario);
console.log(program.rate);
console.log(program.period);
console.log(program.port);
const parallel = program.parallel;
const scenario = require('./'+program.scenario);
const rate = program.rate;
const period = program.period;
const port = program.port;
const delay = program.delay;

let results = {};
let success = 0;
let failures = 0;
let pointer = 0;
// console.log(payload);

app.use('/dummy/server', dummy);

app.listen(port, (err) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    console.log(`Server started on port: ${port}`);
});

// Traffic Generator

function fire(payload) {
    let normalized = payload.method.toUpperCase();
    switch (normalized) {
        case 'GET':
        case 'POST':
        case 'PUT':
        case 'DELETE':
            request({
                method: normalized,
                url: payload.url,
                body: payload.body
            }, (error, response, body) => {
                if (error){
                    console.log(error);
                } else {
                    !results.hasOwnProperty(response.statusCode) ?
                        results[response.statusCode] = 1 :
                        ++results[response.statusCode];
                    console.log(results);
                    console.log(response.request.body);
                    if (response.statusCode === payload.expected) {
                        console.log(body);
                        console.log(response.request.uri.path);
                    }
                    console.log(response.statusCode);
                }
            });
            break;
    
        default:
            console.log('Not a supported method!');
            break;
    }
}
if (!delay){
    setInterval(() => {
        let now = scenario[pointer];
        ++pointer < scenario.length ? pointer : pointer = 0;
        fire(now)}, (period / rate)
    );
}
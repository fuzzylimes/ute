const express = require('express');
const request = require('request');
const config = require('./src/config');
const payload = require('./scenarios/dummy');
var program = require('commander');
const helper = require('./src/helper');
const app = express();

// Express Management Stuff...
// Import Routes
const dummy = require('./routes/dummy');

// CLI Options
program
    .version('0.0.1')
    .option('-p --parallel', '[optional] Run all calls defined in scenario file in parallel, based on provided execution cycle.\nThis will effectively multiply the rate "-r" by the number of scenarios defined in your scenario file\nDefault is running scenario list sequentially.', false)
    .option('-s --scenario <file>', '[REQUIRED] Scenario traffic file to use (from scenarios folder).')
    .option('-r --rate <rate>', '[REQUIRED] Number of calls to be sent per period. Period defaults to 60 seconds. Use "-P" to change the period', parseInt)
    .option('-P --period <period>', '[optional] Period in which "-r" number of messages will be sent. Default (60 second) defined in config file (period)', parseInt, config.period)
    .option('-l --port <port>', '[optional] Listening port for the server (needed for receiving commands/connecting to ute-visor). Default (5000) defined in config file (port).', parseInt, config.port)
    .option('-d --delay', '[optional] Tells ute not to delay fire on startup', false)
program.parse(process.argv);

// Mandate Require parameters
if (!program.scenario || !program.rate){
    console.log("-s and -r are both required parameters. Please see -h for more information.")
    process.exit(1);
}

// Set Variables
const parallel = program.parallel;
const scenario = require('./'+program.scenario);
const rate = program.rate;
const period = program.period;
let runId;
let pointer = 0;
const port = program.port;
const delay = program.delay;
let results = {state: false};


// Build logging object
scenario.forEach(element => {
    if (!results.hasOwnProperty(element.url)) results[element.url] = {};
    if (!results[element.url].hasOwnProperty(element.method)) results[element.url][element.method.toUpperCase()] = {
        responses: {}, tx: 0, rx: 0, times: { min: 10000, max: 0, sum: 0 }, expected: 0
    };
});

// Set the routes
app.use('/dummy/server', dummy);
app.get('/controls/stats', (req, res) => {
    res.set('Content-Type', 'application/json')
    res.send(JSON.stringify(req.app.get('results')));
});
app.put('/controls/stop', (req, res) => {
    if (!req.get('ute') == 'ute-controller') {
        res.status(406);
        res.send("Invalid header");
    } else {
        res.status(201);
        res.send('Cease fire!');
        console.log(`Ceasing fire!`);
        clearInterval(runId);
        results.state = false;
    }
});
app.put('/controls/ute', (req, res) => {
    if (!req.get('ute') == 'ute-controller') {
        res.status(406);
        res.send("Invalid header");
    } else {
        res.status(200);
        res.send('UTE!');
        console.log(`UTE!`);
        ute();
    }
});

// Start up server interface
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
    ++results[payload.url][normalized].tx;
    switch (normalized) {
        case 'GET':
        case 'POST':
        case 'PUT':
        case 'DELETE':
            request({
                method: normalized,
                url: payload.url,
                body: payload.body,
                time: true
            }, (error, response, body) => {
                if (error){
                    response.statusCode = "ERROR";
                }
                let path = response.request.uri.href;
                let method = response.request.method.toUpperCase();
                let time = response.timings.end;
                if (time > results[path][method].times.max) results[path][method].times.max = time;
                if (time < results[path][method].times.min) results[path][method].times.min = time;
                results[path][method].times.sum += time
                ++results[path][method].rx;
                
                !results[path][method].responses.hasOwnProperty(response.statusCode) ?
                    results[path][method].responses[response.statusCode] = 1 :
                    ++results[path][method].responses[response.statusCode];

                if (response.statusCode === payload.expected) {
                    ++results[path][method].expected;
                }
                app.set('results', results);
                console.log(helper.log(results));
            });
            break;
    
        default:
            console.log('Not a supported method!');
            break;
    }
}

function ute() {
    results.state = true;
    runId = setInterval(() => {
        let now = scenario[pointer];
        ++pointer < scenario.length ? pointer : pointer = 0;
        fire(now)
    }, (period / rate)
    );
}

if (delay){
    console.log('UTE!');
    ute();
}
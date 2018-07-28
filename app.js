const express = require('express');
const request = require('request');
const config = require('./src/config');
const program = require('commander');
const helper = require('./src/helper');
const app = express();
const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
const blank = '\n'.repeat(process.stdout.rows)
// Express Management Stuff...
// Import Routes
const dummy = require('./routes/dummy');

// CLI Options
program
    .version('0.0.1')
    .option('-p --parallel', '[optional] Run all calls defined in scenario file in parallel, based on provided execution cycle.\nThis will effectively multiply the rate "-r" by the number of scenarios defined in your scenario file\nDefault is running scenario list sequentially.', false)
    .option('-s --scenario <file>', '[REQUIRED] Scenario traffic file to use (from scenarios folder).')
    .option('-r --rate <rate>', '[REQUIRED] Number of calls to be sent per period. Period defaults to 60 seconds. Use "-P" to change the period')
    .option('-P --period <period>', '[optional] Period in which "-r" number of messages will be sent. Default (60 second) defined in config file (period)', config.period)
    .option('-l --port <port>', '[optional] Listening port for the server (needed for receiving commands/connecting to ute-visor). Default (5000) defined in config file (port).', config.port)
    .option('-d --delay', '[optional] Tells ute not to delay fire on startup', false)
program.parse(process.argv);

// Mandate Require parameters
if (!program.scenario || !program.rate){
    console.log("-s and -r are both required parameters. Please see -h for more information.")
    process.exit(1);
}

// Set Variables
const scenario = require('./'+program.scenario);
const { rate, period, port, delay, parallel} = program;
let pointer = 0;
let runId;
let logId;
let results;
buildLogging();

// Build logging object
function buildLogging(){
    results = { state: 'off', rate: `${rate}/${period/1000}sec`, urls: { } };
    scenario.forEach(element => {
        if (!results.urls.hasOwnProperty(element.url)){
            results.urls[element.url] = {};
        } 
        if (!results.urls[element.url].hasOwnProperty(element.method)){
            results.urls[element.url][element.method.toUpperCase()] = {
                responses: {}, tx: 0, rx: 0, times: { min: 10000, max: 0, sum: 0 }, expected: 0
            } 
        };
    });
    app.set('results', results);
}

// Set the routes
app.use('/dummy/server', dummy);
app.get('/controls/stats', (req, res) => {
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(req.app.get('results')));
});
app.put('/controls/reset', (req, res) => {
    if (checkHeader(req,res)) {
        res.status(200);
        res.send('Resetting stats...');
        clearStats();
    } 
});
app.put('/controls/stop', (req, res) => {
    if (checkHeader(req, res)) {
        res.status(200);
        res.send('Cease fire!');
        stopInstance();
    } 
});
app.put('/controls/ute', (req, res) => {
    if (checkHeader(req, res)) {
        res.status(200);
        res.send('UTE!');
        startInstance();
    } 
});

// Start up server interface
app.listen(port, (err) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    console.log(`Server started on port: ${port}`);
    checkDelay();
});

// Validate Header
function checkHeader(req, res){
    if (!(req.get('ute') == 'ute-controller')) {
        res.status(406);
        res.send("Invalid header");
        return false;
    } else return true;
}

// Clear running stats
function clearStats() {
    console.log(`Resetting stats...`);
    buildLogging();
}

// Stop Instance
function stopInstance() {
    console.log(`Ceasing fire! Press ctrl + f to resume!`);
    clearInterval(runId);
    clearInterval(logId);
    results.state = 'off';
}

// Start Instance
function startInstance() {
    console.log(`Open fire! UTE! UTE! UTE!`);
    ute();
}

// Handle stdin key commands
process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
        process.exit();
    } else if (key.ctrl && key.name === 'p'){
        if (results.state == 'off') {
            console.log('We\'re holding fire! Press ctrl + f to resume!')
        } else {
            stopInstance();
        }
    } else if (key.ctrl && key.name === 'f') {
        if (results.state == 'on') {
            console.log('We\'re already firing!');
        } else {
            startInstance()
        }
    } else if (key.shift && key.name === 'r') {
        if (results.state == 'on') {
            console.log('You must stop firing before you can reset the stats!')
        } else {
            clearStats();
        }
    }
});

// Traffic Generator

function fire(payload) {
    let normalized = payload.method.toUpperCase();
    results.urls[payload.url][normalized].tx += 1;
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
                let responseCode;
                if (error){
                    responseCode = "ERROR";
                } else {
                    responseCode = response.statusCode;
                }
                let path = response.request.uri.href;
                let method = response.request.method.toUpperCase();
                let time = response.timings.end;
                let method_record = results.urls[path][method];
                if (time > method_record.times.max) method_record.times.max = time;
                if (time < method_record.times.min) method_record.times.min = time;
                method_record.times.sum += time
                method_record.rx += 1;
                
                if (!method_record.responses.hasOwnProperty(responseCode)) {
                    method_record.responses[responseCode] = 1;
                } else {
                    method_record.responses[responseCode] += 1;
                }

                if (responseCode === payload.expected) {
                    method_record.expected += 1;
                }
                app.set('results', results);
            });
            break;
    
        default:
            console.log('Not a supported method!');
            break;
    }
}

// Start Traffic
function ute() {
    results.state = 'on';
    runId = setInterval(() => {
        let now = scenario[pointer];
        (pointer += 1) < scenario.length ? pointer : pointer = 0;
        fire(now)
    }, (period / rate)
    );
    schLog();
}

// Logging schedular
function schLog() {
    logId = setInterval(() => {
        helper.writeData(results, rate, period);
    }, config.refresh);
}

function checkDelay() {
    console.log(blank);
    if (delay){
        ute();
    } else {
        console.log('Traffic paused. Press ctrl + f to start firing!')
    }
}
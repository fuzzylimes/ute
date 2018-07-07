const express = require('express');
const request = require('request');
const config = require('./src/config');
const payload = require('./scenarios/dummy');
const app = express();
// Express Management Stuff...
// Import Routes
const dummy = require('./routes/dummy');

let results = {};
let success = 0;
let failures = 0;
let pointer = 0;
console.log(payload);

app.use('/dummy/server', dummy);

app.listen(config.port, (err) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    console.log(`Server started on port: ${config.port}`);
});

// Traffic Generator

// Helper Functions
function validation(response, body){
    !results.hasOwnProperty(response.statusCode) ?
        results[response.statusCode] = 1 :
        ++results[response.statusCode];
    console.log(results);
    if (response.statusCode === payload.expected) {
        console.log(response.body);
        console.log(response.request.uri.path);
    }
    console.log(response.statusCode);
}

function fire(payload) {
    let normalized = payload.method.toUpperCase();
    switch (normalized) {
        case 'GET':
        case 'POST':
        case 'PUT':
        case 'DELETE':
            request({
                method: normalized,
                url: payload.url
            }, (error, response, body) => {
                if (error){
                    console.log(error);
                } else {
                    validation(response, body);
                }
            });
            break;
    
        default:
            console.log('Not a supported method!');
            break;
    }
}
// let payload = {
//     method: "Get",
//     url: `http://localhost:${config.port}/dummy/server`,
//     expected: 200
// }
setInterval(() => {
    let now = payload[pointer];
    ++pointer < payload.length ? pointer : pointer = 0;
    fire(now)}, 1000
);
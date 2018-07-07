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
function fire(payload) {
    switch (payload.method.toLowerCase()) {
        case 'get':
            request.get({
                url: payload.url
            }, (error, response, body) => {
                if (error){
                    console.log(error);
                } else {
                    !results.hasOwnProperty(response.statusCode) ?
                        results[response.statusCode] = 1 :
                        ++results[response.statusCode];
                    console.log(results);
                    if (response.statusCode === payload.expected){
                        console.log(response.body);
                        console.log(response.request.uri.path);
                    }
                    console.log(response.statusCode);
                }
            });
            break;

        case 'post':
            request.post({
                url: payload.url
            }, (error, response, body) => {
                if (error){
                    console.log(error);
                } else {
                    !results.hasOwnProperty(response.statusCode) ?
                        results[response.statusCode] = 1 :
                        ++results[response.statusCode];
                    console.log(results);
                    if (response.statusCode === payload.expected){
                        console.log(response.body);
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
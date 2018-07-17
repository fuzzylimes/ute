## Overview
UTE is a HTTP traffic simulator template project for simulating interactions with your REST endpoints. It provides an out of the box sandbox to get you quickly up and running with testing.

The goal with UTE was to put together a set of features I found myself needing when attempting to do performance benchmarking for one of my other projects. There are various traffic simulator tools out there, but none of them seemed to fit exactly what I needed.

UTE will most likley not solve all of your problems right out of the box, in fact I'd be amazed if it did. But it should provide a good foundation to get the boring stuff out of the way and get you on to your testing faster.

With UTE you will be able to:
* Send various CRUD commands to your endpoints at a desired interval
* Get real time stats on your performance runs
* Specify run duration or allow to run indefinitely

## Usage
Start by cloning or forking this repo.

Install all of the dependent node packages by running `npm install` from within the cloned folder.

To run, you must provide both a scenario file and a rate. By default, `ute` comes built in with debugging server in the running app. You can use the `/scenarios/dummy.json` file to get up and going right away.

Run the following to start sending your first commands:

```
node app.js --scenario ./scenarios/dummy.json --rate 20 -d
```

This example will start traffic based on the scenario file at a rate of 20 messages per minute.

## CLI Parameters
```
node app.js -h

  Usage: app [options]

  Options:

    -V, --version         output the version number
    -p --parallel         [optional] Run all calls defined in scenario file in parallel, based on provided execution cycle.
    This will effectively multiply the rate "-r" by the number of scenarios defined in your scenario file
    Default is running scenario list sequentially.
    -s --scenario <file>  [REQUIRED] Scenario traffic file to use (from scenarios folder).
    -r --rate <rate>      [REQUIRED] Number of calls to be sent per period. Period defaults to 60 seconds. Use "-P" to change the period
    -P --period <period>  [optional] Period in which "-r" number of messages will be sent. Default (60 second) defined in config file (period) (default: 60000)
    -l --port <port>      [optional] Listening port for the server (needed for receiving commands/connecting to ute-visor). Default (5000) defined in config file (port). (default: 5000)
    -d --delay            [optional] Tells ute not to delay fire on startup
    -h, --help            output usage information
```

## Config File
`ute` has a small config file located under the `/src` folder with some default values that you can tweak:
```json
{
    "timeout": 1000,
    "port": 5000,
    "period": 60000,
    "refresh": 2000
}
```

## Controls
`ute` provides two different way to control the application: 1) via CLI and 2) via built in REST interface.

By default, ute will not start firing off until you tell it to (overwritten with the `-d` flag). To start, you'll need to send a command to start up the traffic.

### Starting Traffic
#### CLI
To start or resume traffic, you can press `ctrl + f` on the cli.

#### REST API
You'll need to send a `PUT` request to the `/controls/ute` endpoint.

For basic security reasons, you need to include the following header and value:
```json
{
    "ute": "ute-controller"
}
```

### Pausing Traffic
#### CLI
To pause, you can press `ctrl + p` to pause the currently running traffic.

This will not kill the instance, only stop the traffic from being sent.

To resume, you can press `ctrl + f`

#### REST API
You'll need to send a `PUT` request to the `/controls/stop` endpoint.

For basic security reasons, you need to include the following header and value:
```json
{
    "ute": "ute-controller"
}
```

### Resetting Stats
#### CLI
To reset the stats, you must first pause the traffic. This ensures that you really want to be resetting the traffic.

With traffic paused, press `shift + r` to issue the reset command.

#### REST API
You'll need to send a `PUT` request to the `/controls/reset` endpoint.

For basic security reasons, you need to include the following header and value:
```json
{
    "ute": "ute-controller"
}
```

### Retrieving Stats
To retrieve the current run stats, send a `GET` request to `/stats`. This will return back an object like the following:
```json
{
    "http://localhost:5000/dummy/server": {
        "GET": {
            "responses": {
                "200": 1
            },
            "tx": 1,
            "rx": 1,
            "times": {
                "min": 19.19597100000101,
                "max": 19.19597100000101,
                "sum": 19.19597100000101
            },
            "expected": 1
        },
        "POST": {
            "responses": {
                "201": 1
            },
            "tx": 1,
            "rx": 1,
            "times": {
                "min": 4.492418000001635,
                "max": 4.492418000001635,
                "sum": 4.492418000001635
            },
            "expected": 1
        },
        "PUT": {
            "responses": {
                "201": 1
            },
            "tx": 1,
            "rx": 1,
            "times": {
                "min": 4.41111600000113,
                "max": 4.41111600000113,
                "sum": 4.41111600000113
            },
            "expected": 1
        },
        "DELETE": {
            "responses": {},
            "tx": 0,
            "rx": 0,
            "times": {
                "min": 10000,
                "max": 0,
                "sum": 0
            },
            "expected": 0
        }
    }
}
```

## CLI Stats
By default, stats are displayed out to the user on the CLI, grouped by the endpoints with their specific methods. Here's an example of what that looks like:
```
(GET) http://localhost:5000/dummy/server/get 2/2 (100.000%) - Responses: {"200":2} - MIN: 5.7364, MAX: 27.8719, AVG: 16.8041
(POST) http://localhost:5000/dummy/server/post 2/2 (100.000%) - Responses: {"201":2} - MIN: 11.6150, MAX: 12.1021, AVG: 11.8585
(PUT) http://localhost:5000/dummy/server/put 2/2 (100.000%) - Responses: {"301":2} - MIN: 5.6019, MAX: 5.9458, AVG: 5.7739
(DELETE) http://localhost:5000/dummy/server/delete 2/2 (100.000%) - Responses: {"400":2} - MIN: 3.4981, MAX: 7.6706, AVG: 5.5843
```

## Disclaimer
I'm well aware of what this could be used for. __Please do not be that person__. The intention of this tool is to help you tax _your own project_ and detect any possible performance issues _you_ might have.

## ISC License

Copyright (c) 2018, Zach Cochran

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
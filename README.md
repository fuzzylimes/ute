## Overview
UTE is a HTTP traffic simulator template project for simulating interactions with your REST endpoints. It provides an out of the box sandbox to get you quickly up and running with testing.

The goal with UTE was to put together a set of features I found myself needing when attempting to do performance benchmarking for one of my other projects. There are various traffic simulator tools out there, but none of them seemed to fit exactly what I needed.

UTE will most likley not solve all of your problems right out of the box, in fact I'd be amazed if it did. But it should provide a good foundation to get the boring stuff out of the way and get you on to your testing faster.

With UTE you will be able to:
* Send various CRUD commands to your endpoints at a desired interval
* Get real time stats on your performance runs
* Specify run duration or allow to run indefinitely

## Controls
By default, ute will not start firing off until you tell it to (overwritten with the `-d` flag). To start, you'll need to send a REST call to start up the traffic.

### Starting Traffic
You'll need to send a `PUT` request to the `/controls/ute` endpoint.

For basic security reasons, you need to include the following header and value:
```json
{
    "ute": "ute-controller"
}
```

### Stopping Traffic
You'll need to send a `PUT` request to the `/controls/stop` endpoint.

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
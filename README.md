## Overview
UTE is a HTTP traffic simulator template project for simulating interactions with your REST endpoints. It provides an out of the box sandbox to get you quickly up and running with testing.

The goal with UTE was to put together a set of features I found myself needing when attempting to do performance benchmarking for one of my other projects. There are various traffic simulator tools out there, but none of them seemed to fit exactly what I needed.

UTE will most likley not solve all of your problems right out of the box, in fact I'd be amazed if it did. But it should provide a good foundation to get the boring stuff out of the way and get you on to your testing faster.

With UTE you will be able to:
* Send various CRUD commands to your endpoints at a desired interval
* Get real time stats on your performance runs
* Specify run duration or allow to run indefinitely

## Disclaimer
I'm well aware of what this could be used for. __Please do not be that person__. The intention of this tool is to help you tax _your own project_ and detect any possible performance issues _you_ might have.
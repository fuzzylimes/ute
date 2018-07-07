// Dummy path used for testing application
const express = require('express');
const router = express.Router();

count = 0;
lastCount = 0;

router
    .get('/', (req, res) => {
        [lastCount, count] = [count, ++count];
        let body = {
            time: Date.now(),
            count,
            lastCount
        }
        res.status(200);
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(body));
    })
    .post('/', (req, res) => {
        [lastCount, count] = [count, ++count];
        let body = {
            time: Date.now(),
            count,
            lastCount
        }
        res.status(201);
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(body));
    })
    .put('/', (req, res) => {
        [lastCount, count] = [count, ++count];
        let body = {
            time: Date.now(),
            count,
            lastCount
        }
        res.status(200);
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(body));
    })
    .delete('/', (req, res) => {
        [lastCount, count] = [count, ++count];
        let body = {
            time: Date.now(),
            count,
            lastCount
        }
        res.status(200);
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(body));
    });


module.exports = router;
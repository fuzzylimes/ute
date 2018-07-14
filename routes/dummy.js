// Dummy path used for testing application
const express = require('express');
const router = express.Router();

count = 0;
lastCount = 0;

router
    .get('/get/', (req, res) => {
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
    .post('/post/', (req, res) => {
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
    .put('/put/', (req, res) => {
        [lastCount, count] = [count, ++count];
        let body = {
            time: Date.now(),
            count,
            lastCount
        }
        res.status(301);
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(body));
    })
    .delete('/delete/', (req, res) => {
        [lastCount, count] = [count, ++count];
        let body = {
            time: Date.now(),
            count,
            lastCount
        }
        res.status(400);
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(body));
    });


module.exports = router;
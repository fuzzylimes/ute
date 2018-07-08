// This file has driven me insane, I gave up.

// Dummy path used for testing application
const express = require('express');
const router = express.Router();

function ute() {
    runId = setInterval(() => {
        let now = scenario[pointer];
        ++pointer < scenario.length ? pointer : pointer = 0;
        fire(now)
    }, (period / rate)
    );
}

router
    .get('/stats', (req, res) => {
        res.set('Content-Type', 'application/json')
        res.send(JSON.stringify(req.app.get('results')));
    })
    .post('/stop', (req, res) => {
        if (!req.get('ute') == 'ute-controller'){
            res.status(406);
            res.send("Invalid header");
        } else {
            res.status(201);
            res.send('Cease fire!');
            console.log(`Ceasing fire on ${runId}`);
            clearInterval(runId);
        }
    })
    .post('/ute', (req, res) => {
        if (!req.get('ute') == 'ute-controller'){
            res.status(406);
            res.send("Invalid header");
        } else {
            res.status(200);
            res.send('UTE!'); 
            console.log(`UTE!`);
            ute();
        }
    });

module.exports = router;
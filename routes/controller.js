// Dummy path used for testing application
const express = require('express');
const router = express.Router();

router
    .get('/stats', (req, res, stats) => {
        res.send(JSON.stringify(stats));
    });

module.exports = router;
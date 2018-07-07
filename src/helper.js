const util = require('util');

module.exports = {
    log: function(log) {
        return util.inspect(log, false, null)
    }
}
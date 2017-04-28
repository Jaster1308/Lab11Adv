var moment = require('moment');

function dateFormat(date) {
    // Gets the UTC format of passed date.
    m = moment.utc(date);
    // Follows specified date format and returns value.
    return m.parseZone().format("ddd, MMM DD, YYYY");
}
// Creates a helper
var helpers = {
    dateFormatter: dateFormat
};

module.exports = helpers;

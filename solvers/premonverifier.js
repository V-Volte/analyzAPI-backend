const fs = require('fs');

// Load JSON data from sets.json
const sets = JSON.parse(fs.readFileSync('../datasetsjson/dataPreMonsoon.json', 'utf8'));

let results = sets.results;

let totalNo3 = 0;
let count = 0

for (let item in results) {
    if (results[item].district == "HYDERABAD") {
        totalNo3 += parseFloat(results[item].no3);
        count++;
    }
}

let avg = totalNo3 / count;

module.exports = avg
const db = require('../utils/db')
const verifier = require('../solvers/premonverifier')
let assert = require('assert');

async function v() {
    let data = await db.collection('PreMonsoonWaterData').find().toArray();
    let count = 0;

    //Find the average value of the no3 field in the items in data
    let avg = data.reduce((acc, item) => {
        if (item.district == 'HYDERABAD') count++;
        return acc + (item.district == 'HYDERABAD' ? parseFloat(item.no3) : 0);
    }, 0) / count;

    assert(avg == verifier, "The average value of the no3 field in the items in data is not equal to the value returned by the verifier function.")
}

v()
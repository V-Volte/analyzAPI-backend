const axios = require('axios')
const fs = require('fs')

const url = 'https://data.telangana.gov.in/api/1/datastore/query/b1b18cf8-a103-4f42-b569-42ee629e7dbd/1'

const PORT = 5500;

axios.post(url, {
    "count": "true",
    "results": "true",
    "schema": "false",
    "keys": "true",
    "format": "json"
}, {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    }
}).then(async (response) => {
    let data = response.data;
    fs.writeFile('../datasetsjson/dataPostMonsoon.json', JSON.stringify(data), (err) => {
        if (err) {
            console.log(err);
        }
    })
}).catch((err) => {
    console.log(err);
})

// async function connect() {
//     try {
//         await mongoose.connect("mongodb://volte:qwertyuiop@194.195.117.230:27017/mrits");
//         console.log("Connected to MongoDB");
//     } catch (err) {
//         console.log("Error connecting to MongoDB");
//         console.log(err);
//     }
// }

//connect();
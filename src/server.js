require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const db = require('../utils/db')
const jwt = require('jsonwebtoken')
const questionsets = require('../src/questionsets')
const {
    nanoid
} = require('nanoid')
const axios = require('axios')

const PORT = 5500

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use((err, req, res, next) => {
    res.send("Error: invalid JSON object sent.");
})

app.get('/', (req, res) => {
    res.send("Hello, world!")
})

app.post('/', (req, res) => {
    console.log(req.body)
    let creds = req.body;

})

app.get('/requestdata', async (req, res) => {
    let token = req.headers.authorization;
    if (!token.startsWith("Bearer ")) {
        res.status(400).json({
            status: "error",
            message: "Unauthorized request."
        })
        return
    }
    token = token.split(' ')[1];
    if (!token) {
        res.status(400).json({
            status: "error",
            message: "Unauthorized request."
        })
        return
    }
    let user = await db.collection('users').findOne({
        jwt: token
    });
    if (!user) {
        res.status(400).json({
            status: "error",
            message: "Unauthorized request."
        })
        return
    }

    let questionSet = user.questionSet;

    let data = await db.collection(questionsets(questionSet)['name']).find().toArray();
    res.status(200).json({
        status: "success",
        data: data
    });
})

app.post('/adduser', async (req, res) => {
    let token = "ab69cf"
    let data = req.body;
    console.log(data)
    let user = await db.collection('users').findOne({
        teamNumber: data.teamNumber
    });
    if (data.token != token) {
        res.status(400).json({
            status: "error",
            message: "Unauthorized request."
        })
    } else if (user) {
        res.status(400).json({
            status: "error",
            message: "User already exists."
        })
    } else {
        let teamNumber = data.teamNumber;
        let password = data.password;
        let questionSet = data.questionSet ? data.questionSet : "null";
        let setRandom = data.setRandom ? data.setRandom : "true";
        let jwttoken = jwt.sign({
            teamNumber: data.teamNumber,
        }, "" + process.env.JWT_SECRET, {
            expiresIn: "30d"
        });


        if (setRandom == "true") questionSet = Math.floor(Math.random() * 3) + 1;

        if (!teamNumber || !password) {
            res.status(400).json({
                status: "error",
                message: "Invalid data."
            })
            return
        }
        await db.collection('users').insertOne({
            teamNumber: teamNumber,
            password: password,
            questionSet: questionSet,
            jwt: jwttoken
        });
        res.status(200).json({
            status: "success",
            message: "User added successfully.",
            jwt: jwttoken
        })
    }
})

app.post('/register', async (req, res) => {
    let teamNumber = nanoid(3);
    while (await db.collection('users').findOne({
            teamNumber: teamNumber
        })) {
        teamNumber = nanoid(3);
    }
    let password = nanoid(8);

    let jwttoken = jwt.sign({
        teamNumber: teamNumber,
        password: password
    }, "" + process.env.JWT_SECRET, {
        expiresIn: "30d"
    });

    await db.collection('users').insertOne({
        teamNumber: teamNumber,
        password: password,
        questionSet: Math.floor(Math.random() * 3) + 1,
        jwt: jwttoken
    });
    res.status(200).json({
        status: "success",
        message: "User added successfully.",
        teamNumber: teamNumber,
        password: password,
        jwt: jwttoken
    })
})

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
});
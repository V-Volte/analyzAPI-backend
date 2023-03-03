import { Request, Response } from "express";

import { collections } from "../utils/collections";
import { user } from "../interface";
import { db } from "../utils/db";
import * as jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { getQuestionSet } from "../src/questionsets";

export const requestData = async (req: Request, res: Response) => {
    try {
        console.log(req.body);
        let token: any = "";
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        )
            token = req.headers.authorization.split(" ").pop();
        if (!token) throw new Error("Token not found");
        let userId = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as jwt.JwtPayload;
        if (userId.id) {
            let userData = await db
                .collection<user>(collections.users)
                .findOne({ _id: new ObjectId(userId.id) });
            if (userData) {
                let questionSetData = getQuestionSet(userData.questionSet);
                let dbName = questionSetData?.name;
                if (!dbName) throw new Error("Database not found");
                let data = await db.collection(dbName).find().toArray();

                //console.log(data);
                //if (!data) throw new Error("Data not found");
                res.status(200).json({
                    status: "success",
                    data,
                });
            } else throw new Error("User not found");
        }
    } catch (err: unknown) {
        return res.status(500).json({
            status: "failed",
            msg: err,
        });
    }
};

export const requestQuestions = async (req: Request, res: Response) => {
    try {
        console.log(req.body);
        let token: any = "";
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        )
            token = req.headers.authorization.split(" ").pop();
        if (!token) throw new Error("Token not found");
        let userId = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as jwt.JwtPayload;
        if (userId.id) {
            let userData = await db
                .collection<user>(collections.users)
                .findOne({ _id: new ObjectId(userId.id) });
            if (userData) {
                let questionSetData = getQuestionSet(userData.questionSet);
                let data = questionSetData?.questions;

                //console.log(data);
                //if (!data) throw new Error("Data not found");
                res.status(200).json({
                    status: "success",
                    data,
                });
            } else throw new Error("User not found");
        }
    } catch (err: unknown) {
        return res.status(500).json({
            status: "failed",
            msg: err,
        });
    }
};

export const submit = async (req: Request, res: Response) => {
    try {
        console.log(req.body);
        let token: any = "";
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        )
            token = req.headers.authorization.split(" ").pop();
        if (!token) throw new Error("Token not found");
        let userId = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as jwt.JwtPayload;
        if (userId.id) {
            let userData = await db
                .collection<user>(collections.users)
                .findOne({ _id: new ObjectId(userId.id) });
            if (userData) {
                // let questionSetData = getQuestionSet(userData.questionSet);
                // let dbName = questionSetData?.name;
                // if (!dbName) throw new Error("Database not found");
                let answers = req.body.answers;
                console.log(answers);
                let result = await db
                    .collection("userSubmission")
                    .updateOne(
                        { _id: userId.id },
                        { $set: { answers: answers } },
                        { upsert: true }
                    );
                console.log(result);
                res.status(200).json({
                    status: "success",
                    data: result,
                });
            }
        }
    } catch (err: unknown) {
        return res.status(500).json({
            status: "failed",
            msg: err,
        });
    }
};

import { Request, Response } from "express";

import { collections } from "../utils/collections";
import { user } from "../interface";
import { db } from "../utils/db";
import {
    uniqueNamesGenerator,
    adjectives,
    colors,
    animals,
} from "unique-names-generator";

import * as jwt from "jsonwebtoken";

export const createUser = async (req: Request, res: Response) => {
    try {
        console.log(req.body);
        let userID = Math.floor(Math.random() * 100000) + 1;
        let password = uniqueNamesGenerator({
            dictionaries: [adjectives],
        });
        let userData = await db.collection<user>(collections.users).insertOne({
            ...req.body,
            userID,
            password,
            questionSet: Math.floor(Math.random() * 3) + 1,
        });
        let token = jwt.sign(
            { id: userData.insertedId.toString() },
            ("" + process.env.JWT_SECRET) as string,
            {
                expiresIn: "3h",
            }
        );
        res.status(200).json({
            status: "success",
            data: {userID,password},
            token,
        });
    } catch (err: unknown) {
        console.log(err);
        res.status(500).json({
            status: "error",
            msg: err,
        });
    }
};
export const login = async (req: Request, res: Response) => {
    try {
        let { userID, password } = req.body;
        let userData = await db
            .collection<user>(collections.users)
            .findOne({ userID, password });
        if (!userData) {
            return res.status(401).json({
                status: "unauthorized",
                data: "Kindly check your username and password",
            });
        }
        let token = jwt.sign(
            { id: userData._id },
            process.env.JWT_SECRET as string,
            {
                expiresIn: "1h",
            }
        );

        //store current time in a variable called t
        let t = new Date().getTime();

        let id = await db.collection("userSubmissionData").insertOne({
            userID: userData._id,
            questionSet: userData.questionSet,
            startTime: t,
        });

        console.log(id);

        res.status(200).json({
            status: "success",
            data: token,
        });
    } catch (err: unknown) {
        console.log(err);
        res.status(500).json({
            status: "error",
            msg: err,
        });
    }
};
export const check = async (req: Request, res: Response) => {
    res.status(200).json({
        status: "sucess",
        msg: "This is a protected route",
    });
};

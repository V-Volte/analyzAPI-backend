import { Request, Response } from 'express';

import { collections } from '../utils/collections';
import { user } from '../interface';
import { db } from '../utils/db';
import * as jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { getQuestionSet } from '../src/questionsets';

export const requestData = async (req: Request, res: Response) => {
	try {
		let token = req.headers.authorization!.split(' ').pop() as string;

		let userId = jwt.verify(
			token,
			process.env.JWT_SECRET as string
		) as jwt.JwtPayload;

		let userData = await db
			.collection<user>(collections.users)
			.findOne({ _id: new ObjectId(userId.id) });
		if (userData) {
			let questionSetData = getQuestionSet(userData.questionSet);
			let dbName = questionSetData!.name;
			if (!dbName) throw new Error('Database not found');
			let data = await db.collection(dbName).find().toArray();

			//console.log(data);
			//if (!data) throw new Error("Data not found");
			res.status(200).json({
				status: 'success',
				data,
			});
		} else throw new Error('User not found');
	} catch (err: unknown) {
		res.status(500).json({
			status: 'failed',
			msg: err,
		});
	}
};

export const requestQuestions = async (req: Request, res: Response) => {
	try {
		let token = req.headers.authorization!.split(' ').pop() as string;

		let userId = jwt.verify(
			token,
			process.env.JWT_SECRET as string
		) as jwt.JwtPayload;

		let userData = await db
			.collection<user>(collections.users)
			.findOne({ _id: new ObjectId(userId.id) });
		if (userData) {
			let questionSetData = getQuestionSet(userData.questionSet);
			let data = questionSetData?.questions;

			res.status(200).json({
				status: 'success',
				data,
			});
		} else throw new Error('User not found');
	} catch (err: unknown) {
		res.status(500).json({
			status: 'failed',
			msg: err,
		});
	}
};

export const submit = async (req: Request, res: Response) => {
	try {
		let token = req.headers.authorization!.split(' ').pop() as string;

		let userId = jwt.verify(
			token,
			process.env.JWT_SECRET as string
		) as jwt.JwtPayload;

		let userData = await db
			.collection<user>(collections.users)
			.findOne({ _id: userId.id });
		if (userData) {
			let { answers } = req.body;

			let result = await db
				.collection('userSubmission')
				.updateOne(
					{ _id: new ObjectId(userId.id) },
					{ $set: { answers: answers, finalSubmissionTime: new Date().getTime() } },
					{ upsert: true }
					
				);

			res.status(200).json({
				status: 'success',
				data: result,
			});
		} else throw new Error('User not found');
	} catch (err: unknown) {
		return res.status(500).json({
			status: 'failed',
			msg: err,
		});
	}
};

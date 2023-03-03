import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { db } from '../utils/db';
import { user } from '../interface';
import { collections } from '../utils/collections';
import { ObjectId } from 'mongodb';

export const protect = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith('Bearer')
		) {
			let token = req.headers.authorization.split(' ').pop() as string;
			let userId = jwt.verify(
				token,
				process.env.JWT_SECRET as string
			) as jwt.JwtPayload;
			if (userId.id) {
				let userData = await db
					.collection<user>(collections.users)
					.findOne({ _id: new ObjectId(userId.id) });
				if (userData) next();
				else throw new Error('User not found');
			} else throw new Error('Malformed JWT');
		} else {
			throw new Error('Missing authorization headers');
		}
	} catch (err: unknown) {
		res.status(500).json({
			status: 'failed',
			msg: err,
		});
	}
};

import { Router } from 'express';
import { protect } from '../Controller/auth';
import { requestData, requestQuestions, submit } from '../Controller/data';
import { login, createUser, check } from '../Controller/user';

const router = Router();

router.route('/check').get(protect, check);
router.route('/login').post(login);
router.route('/register').post(createUser);
router.route('/requestdata').get(protect, requestData);
router.route('/requestquestions').get(protect, requestQuestions);
router.route('/submit').post(protect, submit)
export default router;

import { Router } from "express";
import { protect } from "../Controller/auth";
import { requestData, requestQuestions } from "../Controller/data";
import { login, createUser, check } from "../Controller/user";

const router = Router();

router.route("/check").get(protect, check);
router.route("/login").post(login);
router.route("/register").post(createUser);
router.route("/requestdata").get(requestData);
router.route("/requestquestions").get(requestQuestions);
export default router;

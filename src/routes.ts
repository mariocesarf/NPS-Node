import { Router } from "express";
import { SurveysController } from "./controllers/surveyController";
import { UserController } from "./controllers/UserController";
import { SendMailController } from "./controllers/SendMailController"
import { AnswerController } from "./controllers/AnswerController";
import { NpsController } from "./controllers/NpsController";
const router = Router();
const userController = new UserController();
const surveyController = new SurveysController();
const sendMailController = new SendMailController();
const answerController = new AnswerController();
const npsController = new NpsController();
// Users
router.post("/users", userController.create);


// Surveys
router.post("/surveys", surveyController.create);
router.get("/surveys", surveyController.show);

// SurveyUser/SendMail
router.post("/sendMail", sendMailController.execute);
router.get("/answers/:value", answerController.execute);

router.get("/nps/:survey_id", npsController.execute);
export { router }
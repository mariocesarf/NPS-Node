import {Request, Response} from "express"
import { getCustomRepository, Not, IsNull } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class NpsController{
    async execute(request: Request, response: Response){
        const {survey_id} = request.params;
        const surveyUserRepository = getCustomRepository(SurveysUsersRepository);

        const  surveyUsers = await surveyUserRepository.find({
            survey_id,
            value: Not(IsNull())
        });
        

        const detractor = surveyUsers.filter((survey) => 
            survey.value <= 6
            ).length;
        const promoters = surveyUsers.filter(
            (surveyUsers) => 
            surveyUsers.value >= 9 && surveyUsers.value <=10
        ).length;
        console.log(surveyUsers)
        const passive = surveyUsers.filter((survey) =>
            survey.value >=7 && survey.value <= 8
        ).length;
        const totalAnswers = surveyUsers.length;
        const npsScore = Number(
            (100*((promoters - detractor) / totalAnswers)).toFixed(2)
        );

        return response.json({
            detractor,
            passive,
            promoters,
            totalAnswers,
            nps: npsScore
        })
    }
}

export {NpsController};
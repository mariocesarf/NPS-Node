import { Request, Response} from "express"
import { getCustomRepository } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";


class AnswerController{
async execute(request: Request, response: Response){

    const {value} = request.params;
    const {u} = request.query;
    
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);
    const SurveyUser = await surveysUsersRepository.findOne({
        id: String(u)
    });
    if(!SurveyUser){
        return response.status(400).json({
            error: "Survey-User does not exists."
        })
    }

    SurveyUser.value = Number(value);

    await surveysUsersRepository.save(SurveyUser);
    return response.status(200).json(SurveyUser);


}   
}
export {AnswerController};
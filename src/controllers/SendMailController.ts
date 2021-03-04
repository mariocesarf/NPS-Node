import{ Request, Response } from "express"
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/surveyRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UserRepository } from "../repositories/userRepository";
import SendMailService from "../services/SendMailService";
import { resolve } from 'path'
import { AppError } from "../errors/AppError";


class SendMailController{
async execute(request: Request, response: Response){


    const {email, survey_id} = request.body;
    const userRepository = getCustomRepository(UserRepository);
    const surveyRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const userExists = await userRepository.findOne({email});
    const surveyExists = await surveyRepository.findOne({id: survey_id});

    if(!surveyExists){
        throw new AppError("Survey does not exists.", 400);
    }
    if(!userExists){
        throw new AppError("User does not exists.", 400);
    }



    const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

    const surveyUserExists = await surveysUsersRepository.findOne({
        where: 
            {
            user_id: userExists.id,
            value: null
        },
        relations: ["user", "survey"]
    });


    const variables = {
        name:        userExists.name,
        title:       surveyExists.title,
        description: surveyExists.description,
        id: "defaultId",
        link: process.env.URL_MAIL,
    }


    if(surveyUserExists){
        variables.id = surveyUserExists.id;
        await SendMailService.execute(email, surveyExists.title,variables,npsPath);
        return response.json(surveyUserExists);
    
    }

    const surveyUser = surveysUsersRepository.create({
        user_id: userExists.id,
        survey_id: surveyExists.id
    });
    
    await surveysUsersRepository.save(surveyUser);

    variables.id = surveyUser.id;
    await SendMailService.execute(email,surveyExists.title, variables , npsPath);


    
    return response.json(surveyUser);
}
}

export {SendMailController}
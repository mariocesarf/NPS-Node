import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/surveyRepository";
import * as yup from "yup";
import { AppError } from "../errors/AppError";

class SurveysController{
    async create(request: Request, response: Response){

        const schema = yup.object().shape({
            title: yup.string().required(),
            description: yup.string().required()
        });

        try{    
            await schema.validate(request.body)
        }catch(err){
            throw new AppError(err);
        };

        const {title, description} = request.body;
        const surveysRepository = getCustomRepository(SurveysRepository);
        const survey = surveysRepository.create({
            title,
            description
        });

        await surveysRepository.save(survey);
        
        return response.status(201).json(survey);
    }
    async show(request: Request, response: Response){
        const surveysRepository = getCustomRepository(SurveysRepository);

        const all = await surveysRepository.find();

        return response.json(all);
    }
}


export { SurveysController };

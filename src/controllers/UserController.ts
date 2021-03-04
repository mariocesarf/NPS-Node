import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../repositories/userRepository";
import * as yup from "yup"
import { AppError } from "../errors/AppError";
 
class UserController{

    async create(request: Request, response: Response){
        const {name, email} = request.body;
        const schema = yup.object().shape({
            name: yup.string().required(),
            email: yup.string().email().required()
        }); 

        try{
            await schema.validate(request.body)
        }catch(err){
            response.status(400).json({
                error:err
            })
        };


        const userRepository = getCustomRepository(UserRepository);

        const userAlreadyExist = await userRepository.findOne({
            email,
        });

        if(userAlreadyExist){
            throw new AppError("User already exists.", 400);
        }

        const user = userRepository.create({name,email})

        await userRepository.save(user);

        return response.status(201).json(user); 

    }    
}

export { UserController };

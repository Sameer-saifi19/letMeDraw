import express from "express";
import { middleware } from "./middleware";
import bcrypt from "bcrypt";
import { prismaClient } from "@repo/db/prismaClient"
import jwt from "jsonwebtoken"
import { signupSchema, signinSchema, roomSchema } from "@repo/common/validation"
import { JWT_SECRET } from "@repo/backend-common/config";


const app = express();

app.post('/signup',async function(req, res){

    const safeParsedData = signupSchema.safeParse(req.body);

    if(!safeParsedData.success){
        res.json({
            message: "Incorrect Input Format",
            error: safeParsedData.error
        })
        return;
    }

    const { name, email, password } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 12)
    
    try {
        await prismaClient.user.create({
            data: {
                name: safeParsedData.data.name,
                email: safeParsedData.data.email,
                password: hashedPassword
            }
        })
        res.json({
            message: "Sign up Successful"
        })
    } catch (error) {
        res.json({
            message: "user already exists"
        })
    }
})

app.post('/signin', async function (req, res){

    const safeParsedData = signinSchema.safeParse(req.body);

    if (!safeParsedData.success){
        res.json({
            message:"Incorrect Input Format",
            error: safeParsedData.error
        });
        return;
    }

    const { email, password } = req.body;

    try {
        const user = await user.findOne({ email });

        if (!user) {
            res.status(401).json({ message: "User not found or wrong email" });
            return;
        }


        const isPasswordCorrect = bcrypt.compare(password, user.password as string);

        if (!isPasswordCorrect) {
            res.status(401).json({ message: "Incorrect Email or password" });
            return;
        }else{
            const token = jwt.sign({
                id: user._id,
            }, JWT_SECRET);
    
            res.json({
                token:token,
                message: "sign in successful"
            })
        }

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong"
        });
    }

})

app.post('/create-room',middleware, function(req,res){
    
})

app.listen(3002);

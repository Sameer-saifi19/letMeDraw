import express from "express";
import { middleware } from "./middleware";
import { z } from "zod"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const app = express();

app.post('/signup',async function(req, res){

    const requiredbody = z.object({
        username: z.string().min(3).max(10),
        password: z.string().min(8).max(20).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/).regex(/[^A-Za-z0-9]/)
    })

    const safeParsedData = requiredbody.safeParse(req.body);

    if(!safeParsedData.success){
        res.json({
            message: "Incorrect Input Format",
            error: safeParsedData.error
        })
        return;
    }

    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12)

    try {
        await userModel.create({
            username: username,
            password: hashedPassword
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

    const requiredbody = z.object({
        username: z.string(),
        password: z.string()
    })

    const safeParsedData = requiredbody.safeParse(req.body);

    if (!safeParsedData.success){
        res.json({
            message:"Incorrect Input Format",
            error: safeParsedData.error
        });
        return;
    }

    const { username, password } = req.body;

    try {
        const user = await userModel.findOne({ username });

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
            },process.env.JWT_SECRET!);
    
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

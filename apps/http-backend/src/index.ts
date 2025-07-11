import express from "express";
import { middleware } from "./middleware";
import bcrypt from "bcrypt";
import { prismaClient } from "@repo/db/prismaClient";
import jwt from "jsonwebtoken";
import {
  signupSchema,
  signinSchema,
  roomSchema,
} from "@repo/common/validation";
import { JWT_SECRET } from "@repo/backend-common/config";

const app = express();

app.use(express.json());

app.post("/signup", async function (req, res) {
  const safeParsedData = signupSchema.safeParse(req.body);

  if (!safeParsedData.success) {
    res.json({
      message: "Incorrect Input Format",
      error: safeParsedData.error,
    });
    return;
  }

  const { password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    const user = await prismaClient.user.create({
      data: {
        name: safeParsedData.data.name,
        email: safeParsedData.data.email,
        password: hashedPassword,
      },
    });
    res.json({
      message: "Sign up Successful",
      userId: user.id,
    });
  } catch (error) {
    res.json({
      message: "user already exists",
    });
  }
});

app.post("/signin", async function (req, res) {
  const safeParsedData = signinSchema.safeParse(req.body);

  if (!safeParsedData.success) {
    res.json({
      message: "Incorrect Input Format",
      error: safeParsedData.error,
    });
    return;
  }

  const { password } = req.body;

  try {
    const user = await prismaClient.user.findUnique({
      where: { email: safeParsedData.data.email
       },
    });

    if (!user) {
      res.status(401).json({ message: "User not found or wrong email" });
      return;
    }

    const isPasswordCorrect = bcrypt.compare(password, user.password as string);

    if (!isPasswordCorrect) {
      res.status(401).json({ message: "Incorrect Email or password" });
      return;
    } else {
      const token = jwt.sign(
        {
          userId: user?.id,
        },
        JWT_SECRET
      );

      res.json({
        token: token,
        message: "sign in successful",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

app.post("/create-room", middleware, async function (req, res) {
  const parsedData = roomSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "Incorrect Input Format",
    });
    return;
  }

  //   @ts-ignore
  const userId = req.userId;

  try {
    const room = await prismaClient.room.create({
      data: {
        slug: parsedData.data.name,
        adminId: userId,
      },
    });
    res.json({
      message: "Room created successfully",
      roomId: room.id,
    });
  } catch (error) {
    res.status(411).json({
      message: "Failed to create room",
      error: error,
    });
  }
});


app.get('/chats/:roomId', async function (req, res){
  const roomId = Number(req.params.roomId);
  const messages = prismaClient.chat.findMany({
    where:{
      roomId: roomId
    },
    orderBy: {
      id: "desc"
    },
    take: 50
  });

  res.json({
    messages
  })
})

app.listen(3002);

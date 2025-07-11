import { email, z } from "zod"

export const signupSchema = z.object({
    name: z.string().min(3).max(20),
    email: z.email(),
    password: z.string().min(8).max(20).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/).regex(/[^A-Za-z0-9]/)
})

export const signinSchema = z.object({
    email: z.email(),
    password: z.string().min(8).max(20).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/).regex(/[^A-Za-z0-9]/)
})

export const roomSchema = z.object({
    name: z.string().min(3).max(20)
})


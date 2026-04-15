import {z} from 'zod';

export const registerModel = z.object({
    username: z.string().min(3, "Name is required"),
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be atleast 6 characters")
});

export const loginModel = z.object({
    identifier: z.string().min(3, "Username or Email is required"),
    password: z.string().min(1, "Password is required")
});
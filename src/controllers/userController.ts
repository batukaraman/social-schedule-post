import { Request, Response } from "express";
import { createUser, authenticateUser } from "../services/userService";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await createUser(email, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const token = await authenticateUser(email, password);
    res.status(200).json({ token });
  } catch (error) {
    res.status(401).json({ error: (error as Error).message });
  }
};

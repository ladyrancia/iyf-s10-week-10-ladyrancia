import { Request, Response } from 'express';
import store from '../data/store';

export const getAllUsers = (req: Request, res: Response) => {
  const users = store.getAllUsers();
  res.json(users);
};

export const getUserById = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const user = store.getUserById(id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
};

export const createUser = (req: Request, res: Response) => {
  const { name, email } = req.body;
  const newUser = store.createUser({ name, email });
  res.status(201).json(newUser);
};

export const updateUser = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;
  const updatedUser = store.updateUser(id, { name, email });
  if (!updatedUser) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(updatedUser);
};

export const deleteUser = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const success = store.deleteUser(id);
  if (!success) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.status(204).send();
};

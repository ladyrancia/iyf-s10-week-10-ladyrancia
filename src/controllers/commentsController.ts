import { Request, Response } from 'express';
import store from '../data/store';

export const getComments = (req: Request, res: Response) => {
  const { postId } = req.query;
  let comments = store.getAllComments();

  if (postId) {
    comments = comments.filter(c => c.postId === parseInt(postId as string));
  }

  res.json(comments);
};

export const getCommentById = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const comment = store.getCommentById(id);
  if (!comment) {
    return res.status(404).json({ error: 'Comment not found' });
  }
  res.json(comment);
};

export const createComment = (req: Request, res: Response) => {
  const { postId, author, content } = req.body;

  if (!postId || !author || !content) {
    return res.status(400).json({ error: 'postId, author, and content are required' });
  }

  const newComment = store.createComment({
    postId: parseInt(postId),
    author,
    content
  });

  res.status(201).json(newComment);
};

export const updateComment = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { author, content } = req.body;
  const updatedComment = store.updateComment(id, { author, content });
  if (!updatedComment) {
    return res.status(404).json({ error: 'Comment not found' });
  }
  res.json(updatedComment);
};

export const deleteComment = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const success = store.deleteComment(id);
  if (!success) {
    return res.status(404).json({ error: 'Comment not found' });
  }
  res.status(204).send();
};

import mongoose from 'mongoose';
import Task from '../models/Task.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function checkId(id) {
  if (!mongoose.isValidObjectId(id)) throw new AppError('Invalid task ID', 400);
}

export const listTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, tasks });
});

export const getTask = asyncHandler(async (req, res) => {
  checkId(req.params.id);
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  if (!task) throw new AppError('Task not found', 404);
  res.json({ success: true, task });
});

export const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create({ ...req.body, user: req.user._id });
  res.status(201).json({ success: true, task });
});

export const updateTask = asyncHandler(async (req, res) => {
  checkId(req.params.id);
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { $set: req.body },
    { new: true, runValidators: true }
  );
  if (!task) throw new AppError('Task not found', 404);
  res.json({ success: true, task });
});

export const deleteTask = asyncHandler(async (req, res) => {
  checkId(req.params.id);
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!task) throw new AppError('Task not found', 404);
  res.json({ success: true, message: 'Task deleted' });
});

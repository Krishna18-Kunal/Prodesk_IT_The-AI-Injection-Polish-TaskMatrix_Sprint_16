import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(60),
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(72)
}).strict();

export const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(72)
}).strict();

export const taskSchema = z.object({
  title: z.string().trim().min(2).max(150),
  description: z.string().max(2000).optional().default(''),
  status: z.enum(['Todo', 'In Progress', 'Done']).optional().default('Todo'),
  priority: z.enum(['Low', 'Medium', 'High']).optional().default('Medium'),
  dueDate: z.string().datetime().nullable().optional(),
  subtasks: z.array(z.object({
    title: z.string().trim().min(1).max(160),
    completed: z.boolean().optional().default(false)
  }).strict()).max(20).optional().default([])
}).strict();

export const taskUpdateSchema = taskSchema.partial().strict();

export const aiSchema = z.object({
  taskTitle: z.string().trim().min(2).max(150),
  description: z.string().max(1000).optional().default(''),
  count: z.number().int().min(3).max(5).optional().default(5)
}).strict();

export const createOrderSchema = z.object({
  amount: z.number().int().min(100).max(1000000)
}).strict();

export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1).max(100),
  razorpay_payment_id: z.string().min(1).max(100),
  razorpay_signature: z.string().min(1).max(300)
}).strict();

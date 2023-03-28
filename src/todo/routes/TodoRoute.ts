import express from 'express';
import { alltodos, createtodo, deletetodo, onetodo, upgradetodo } from '../controller/TodoController';
import { createtodoValidator, updateTodoValidator } from '../validator/todoValidator';

const router = express.Router();
router.get('', alltodos);
router.get('/:id', onetodo);
router.post('/create', createtodoValidator, createtodo);
router.delete('/delete/:id', deletetodo);
router.patch('/update/:id', updateTodoValidator, upgradetodo);

module.exports = router;

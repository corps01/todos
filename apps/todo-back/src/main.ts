import * as express from 'express';
import mongoose = require('mongoose');
import cors = require('cors');

import { Todo } from "./model/Todo"

mongoose.connect(`mongodb+srv://omar_corpus:admin123@cluster0.scr5fne.mongodb.net/todoDB?retryWrites=true&w=majority`).then(()=>{
  console.log("conected to db")
}).catch((e)=>{
  console.log(e)
})

const app = express();
app.use(express.json());
app.use(cors());

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to todo-back!' });
});


const paginatedResults = () => {
  return async (req, res, next) => {

    const page = parseInt(req.query.page);
    const limit = 15
    const skipIndex = (page - 1) * limit;
    const results = {todos: {}, totalTodos: {}};

    try {
      results.todos = await Todo.find()
      .limit(limit)
      .skip(skipIndex)
      .exec();
      results.totalTodos = await Todo.find().count()
      res.paginatedResults = results;
      next();
    } catch (e) {
      res.status(500).json({ message: "Error Occured" });
    }
  };
}

app.get("/todos", paginatedResults(), (req, res:any) => {
  res.json(res.paginatedResults);
});

app.post('/todo/new', (req, res) => {
   const todo = new Todo({
     title: req.body.title,
     desc: req.body.desc
   });
   res.json(todo);
   todo.save().catch((e)=>{console.log(e)});
 });

 app.delete('/todo/delete/:id', async(req,res)=>{
   const result = await Todo.findByIdAndDelete(req.params.id)
   res.json(result)
 })

 app.put('/todo/edit/:id', async(req,res)=>{
   const todo = await Todo.findByIdAndUpdate(req.params.id)
   todo.title = req.body.title
   todo.desc = req.body.desc
   todo.status = req.body.status

   todo.save().catch((e)=>{console.log(e)})
   res.json(todo)
 })


const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);

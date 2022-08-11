import mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
  title: {
    type: String,
    required: true,
    default: "to-do"
  },
  desc: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    default: "pending"
  },
  timeStamp: {
    type: String,
    default: Date.now()
  }
})

export const Todo = mongoose.model("Todo", TodoSchema);

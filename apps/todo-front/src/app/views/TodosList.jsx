import { Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import TodoCard from '../components/todo-card/TodoCard';

const TodoList = () => {
  const [todos, setTodos] = useState([]);

  const fetchData = async () => {
    const response = await fetch('http://localhost:3333/todos').then(
      (response) => response.json()
    );
    setTodos(response);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Stack spacing={3} margin="auto">
      {todos.map((todo)=>{
       return(<TodoCard data={todo}/>)
      })}
    </Stack>
  );
};

export default TodoList;

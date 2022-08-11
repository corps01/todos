import { Button, Stack, Box, TextField, Card, TextareaAutosize, Modal, FormLabel } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
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

  const [newTodoTitle,setNewTodoTitle] = useState()
  const [newTodoDesc,setNewTodoDesc] = useState()

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleNewTodo = () => {
    fetch(`http://localhost:3333/todo/new`, {
       method: 'POST',
       headers: {
         'Content-type': 'application/json',
       },
       body: JSON.stringify({title: newTodoTitle, desc: newTodoDesc })
    }).catch((e)=>{console.log(e)});
    fetchData();
    handleClose()
  };

  const handleNewTodoTitle = (e) => {
    setNewTodoTitle(e.target.value)
  }

  const handleNewTodoDesc = (e) => {
    setNewTodoDesc(e.target.value)
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Stack spacing={5} margin="auto" alignItems="flex-start">
        <form>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{ 'z-index': '0' }}
        >
          <Box sx={style}>
          <FormLabel>Title</FormLabel>
              <TextField
                style={{
                  width: '390px',
                  padding: '5px',
                }}
                onChange={handleNewTodoTitle}
              />
              <FormLabel>Description</FormLabel>
            <TextareaAutosize
              style={{
                width: '390px',
                height: '100px',
                marginTop: '10px',
                padding: '5px',
              }}
              onChange={handleNewTodoDesc}
            />
            <Stack
              direction={'row'}
              justifyContent={'flex-end'}
              spacing={1}
              marginTop="20px"
            >
              <Button variant="contained" color="info" onClick={handleNewTodo}>
                <SaveIcon />
              </Button>
            </Stack>
          </Box>
        </Modal>
      </form>
      <Card sx={{ width: '450px', padding: '10px 10px', 'marginBottom': '50px' }}>
        <h1 style={{'textAlign': 'center'}}>Create new to-do</h1>
        <Stack><Button sx={{'marginTop': '8px'}} variant="contained" color="info" onClick={handleOpen}>Create</Button></Stack>
      </Card>
      <Stack spacing={1}>
      {todos.map((todo)=>{
       return(<TodoCard data={todo} key={todo._id}/>)
      })}
      </Stack>
    </Stack>
  );
};

export default TodoList;

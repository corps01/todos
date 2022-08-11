import {
  Button,
  Stack,
  Box,
  TextField,
  Card,
  TextareaAutosize,
  Modal,
  FormLabel,
  Select,
  MenuItem,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useEffect, useState } from 'react';
import TodoCard from '../components/todo-card/TodoCard';
import Pagination from '@mui/material/Pagination';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState();
  const [newTodoDesc, setNewTodoDesc] = useState();

  const [page, setPage] = useState(1);
  const [todosCount, setTodosCount] = useState(0);

  const [todoFilter, setTodoFilter] = useState('all');
  const [filteredTodos, setFilteredTodos] = useState([]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    fetchData();
  };

  const fetchData = async () => {
    const response = await fetch(`http://localhost:3333/todos?page=${page}`).then(
      (response) => response.json()
    );
    const responseData = await response;
    setTodos(responseData.todos);
    setFilteredTodos(responseData.todos);
    setTodosCount(Math.ceil(responseData.totalTodos / 15));
  };

  const handleNewTodo = () => {
    fetch(`http://localhost:3333/todo/new`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ title: newTodoTitle, desc: newTodoDesc }),
    }).catch((e) => {
      console.log(e);
    });
    handleClose();
    fetchData();
    setTodoFilter('');
  };

  const handleSelectChange = (e) => {
    setTodoFilter(e.target.value);
    if (e.target.value === 'all') {
      setFilteredTodos(todos);
      setPage(1)
      return;
    }
    let filteredTodostemp = todos.filter((todo) => {
      return todo.status === e.target.value;
    });
    setFilteredTodos(filteredTodostemp);
    setPage(1)
  };

  const handleNewTodoTitle = (e) => {
    setNewTodoTitle(e.target.value);
  };

  const handleNewTodoDesc = (e) => {
    setNewTodoDesc(e.target.value);
  };

  const handlePageChange = (e, p) => {
    setPage(p);
  };

  useEffect(() => {
    fetchData();
  }, [page]);

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
    <Stack
      spacing={5}
      margin="auto"
      alignItems="flex-start"
      style={{ padding: '40px' }}
    >
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
      <Stack sx={{ marginBottom: '50px' }}>
        <Card
          sx={{ width: '450px', padding: '10px 10px', marginBottom: '10px' }}
        >
          <h1 style={{ textAlign: 'center' }}>Create new to-do</h1>
          <Stack>
            <Button
              sx={{ marginTop: '8px' }}
              variant="contained"
              color="info"
              onClick={handleOpen}
            >
              Create
            </Button>
          </Stack>
        </Card>
        <Stack>
          {' '}
          <Select
            value={todoFilter}
            onChange={handleSelectChange}
            label="Filter by"
          >
            <MenuItem value={'all'}>All</MenuItem>
            <MenuItem value={'pending'}>Pending</MenuItem>
            <MenuItem value={'in progress'}>In Progress</MenuItem>
            <MenuItem value={'done'}>Done</MenuItem>
          </Select>
        </Stack>
      </Stack>
      <Stack spacing={1}>
        {filteredTodos.map((todo) => {
          return <TodoCard data={todo} key={todo._id} />;
        })}
      </Stack>
      <Stack alignItems={'center'} width={"100%"}>
      <Pagination
        count={todosCount}
        size="large"
        page={page}
        variant="outlined"
        shape="rounded"
        onChange={handlePageChange}
      />
      </Stack>
    </Stack>
  );
};

export default TodoList;

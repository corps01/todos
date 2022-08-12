import {
  Button,
  Stack,
  Box,
  TextField,
  Card,
  TextareaAutosize,
  Modal,
  Select,
  MenuItem,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useEffect, useState } from 'react';
import TodoCard from '../components/todo-card/TodoCard';
import Pagination from '@mui/material/Pagination';
import CloseIcon from '@mui/icons-material/Close';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState();
  const [newTodoDesc, setNewTodoDesc] = useState();

  const [page, setPage] = useState(1);
  const [todosCount, setTodosCount] = useState(0);

  const [todoFilter, setTodoFilter] = useState('');
  const [filteredTodos, setFilteredTodos] = useState([]);

  const [titleError, setTitleError] = useState();
  const [descError, setDescError] = useState();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    fetchData();
    setTitleError(undefined);
    setDescError(undefined);
  };

  const fetchData = async () => {
    const response = await fetch(
      `http://localhost:3333/todos?page=${page}`
    ).then((response) => response.json());
    const responseData = await response;
    setTodos(responseData.todos);
    setFilteredTodos(responseData.todos);
    setTodosCount(Math.ceil(responseData.totalTodos / 15));
  };

  const handleNewTodo = () => {
    if (titleError || descError || newTodoTitle === '' || newTodoDesc === '') {
      return;
    }

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
  };

  const handleSelectChange = (e) => {
    setTodoFilter(e.target.value);
    if (e.target.value === 'all') {
      setFilteredTodos(todos);
      return;
    }
    const filteredTodostemp = todos.filter((todo) => {
      return todo.status === e.target.value;
    });
    setFilteredTodos(filteredTodostemp);
  };

  const handleNewTodoTitle = (e) => {
    if (e.target.value === '') {
      setTitleError('Please fill the title');
      return;
    }

    if (e.target.value.length < 10 || e.target.value.length > 120) {
      setTitleError('Title should be between 10 and 120 characters');
      return;
    }

    setTitleError(undefined);
    setNewTodoTitle(e.target.value);
  };

  const handleNewTodoDesc = (e) => {
    if (e.target.value === '') {
      setDescError('Please fill the description');
      return;
    }
    if (e.target.value.length > 1000 || e.target.value.length < 100 ) {
      setDescError('Description should be between 100 and 1000 characters');
      return;
    }
    setDescError(undefined);
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
    padding: '0px 20px 20px 20px',
    borderRadius: '15px',
  };

  return (
    <Stack
      spacing={5}
      margin="auto"
      style={{ display: 'flex', justifyContent: 'stretch' }}
      height={'100%'}
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
            <p
              style={{ paddingBottom: '10px', textAlign: 'end', color: 'red' }}
            >
              <CloseIcon onClick={handleClose} sx={{ cursor: 'pointer' }} />
            </p>
            <p>Create New Todo</p>
            <TextField
              label="Title"
              style={{
                width: '390px',
                padding: '5px',
              }}
              onBlur={handleNewTodoTitle}
              onChange={handleNewTodoTitle}
              error={titleError?.length > 0}
              helperText={titleError}
            />
            <TextField
              label="Description"
              style={{
                width: '390px',
                height: '250px',
                marginTop: '10px',
                padding: '5px',
              }}
              onChange={handleNewTodoDesc}
              onBlur={handleNewTodoDesc}
              InputProps={{
                inputComponent: TextareaAutosize,
              }}
              error={descError?.length > 0}
              helperText={descError}
            />
            <Stack
              direction={'row'}
              justifyContent={'flex-end'}
              spacing={1}
              marginTop="20px"
            >
              <Button variant="contained" color="error" onClick={handleClose}>
                Cancel X
              </Button>
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
              sx={{ marginTop: '8px', borderRadius: '10px' }}
              variant="contained"
              color="primary"
              onClick={handleOpen}
            >
              Create +
            </Button>
          </Stack>
        </Card>
        <Stack>
          <Select value={todoFilter} onChange={handleSelectChange}>
            <MenuItem value={'pending'}>Pending</MenuItem>
            <MenuItem value={'in progress'}>In Progress</MenuItem>
            <MenuItem value={'done'}>Done</MenuItem>
            <MenuItem value={'all'}>All</MenuItem>
          </Select>
        </Stack>
      </Stack>
      <Stack spacing={1}>
        {filteredTodos.map((todo) => {
          return (
            <TodoCard
              data={todo}
              key={todo._id}
              rerender={() => {
                fetchData();
              }}
            />
          );
        })}
      </Stack>
      <Stack alignItems={'center'} width={'100%'} paddingBottom={'20px'}>
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

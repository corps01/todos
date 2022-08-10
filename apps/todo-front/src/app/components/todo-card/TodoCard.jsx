import {
  Card,
  Chip,
  Stack,
  Modal,
  Box,
  Select,
  MenuItem,
  Button,
  TextField,
  TextareaAutosize,
} from '@mui/material';
import Swal from 'sweetalert2';
import React, { useEffect, useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

const TodoCard = ({ data }) => {
  const [todo, setTodo] = useState();
  const [todoStatus, setTodoStatus] = useState('');
  const [todoTitle, setTodoTitle] = useState('');
  const [todoDesc, setTodoDesc] = useState('');

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSelectChange = (e) => {
    setTodoStatus(e.target.value);
  };

  const handleTodoTitle = (e) => {
    setTodoTitle(e.target.value);
  };

  const handleTodoDesc = (e) => {
    setTodoDesc(e.target.value);
  };

  const handleEdit = () => {
    if (todoTitle === '' && todoDesc === '') {
      setTodo({ ...todo, status: todoStatus });
      handleClose();
      return;
    }

    if (todoDesc === '') {
      setTodo({ ...todo, status: todoStatus, title: todoTitle });
      handleClose();
      return;
    }

    if (todoTitle === '') {
      setTodo({ ...todo, status: todoStatus, desc: todoDesc });
      handleClose();
      return;
    }

    // setTodo({ ...todo, title: todoTitle, status: todoStatus, desc: todoDesc });
    // fetch(`http://localhost:3333/todo/edit/${todo._id}`, {
    //   method: 'PUT',
    //   headers: {
    //     'Content-type': 'application/json',
    //   },
    //   body: JSON.stringify(todo),
    // }).catch((e)=>{console.log(e)});

    handleClose();
  };

  const getStatusColor = () => {
    if (todo?.status === 'pending') return 'error';
    if (todo?.status === 'in progress') return 'secondary';
    if (todo?.status === 'donde') return 'success';
  };

  useEffect(() => {
    setTodo(data);
    setTodoStatus(data.status);
  }, [data]);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <div>
      <form>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{ 'z-index': '0' }}
        >
          <Box sx={style}>
            <Stack
              direction="row"
              justifyContent={'space-between'}
              marginBottom={'10px'}
            >
              <TextField
                defaultValue={todo?.title}
                padding="0"
                label="Title"
                onChange={handleTodoTitle}
              />
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={todoStatus}
                label="Status"
                onChange={handleSelectChange}
              >
                <MenuItem value={'pending'}>Pending</MenuItem>
                <MenuItem value={'in progress'}>In Progress</MenuItem>
                <MenuItem value={'done'}>Done</MenuItem>
              </Select>
            </Stack>
            <TextareaAutosize
              style={{
                width: '390px',
                height: '100px',
                marginTop: '10px',
                padding: '5px',
              }}
              defaultValue={todo?.desc}
              onChange={handleTodoDesc}
            />
            <Stack
              direction={'row'}
              justifyContent={'flex-end'}
              spacing={1}
              marginTop="20px"
            >
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!',
                  }).then((result) => {
                    if (result.isConfirmed) {
                      Swal.fire(
                        'Deleted!',
                        'Your file has been deleted.',
                        'success'
                      );
                      handleClose();
                    }
                  });
                }}
              >
                <DeleteIcon />
              </Button>
              <Button onClick={handleEdit} variant="contained" color="info">
                <SaveIcon />
              </Button>
            </Stack>
          </Box>
        </Modal>
      </form>
      <Card sx={{ width: '450px', padding: '10px 10px' }} onClick={handleOpen}>
        <Stack
          direction="row"
          alignItems="center"
          spacing="space-between"
          justifyContent="space-between"
          sx={{ paddingTop: '10px' }}
        >
          <h3 style={{ margin: 0 }}>{todo?.title}</h3>
          <Chip label={todo?.status} color={getStatusColor()} />
        </Stack>
        <p style={{ marginBottom: '0' }}>{todo?.desc}</p>
      </Card>
    </div>
  );
};

export default TodoCard;

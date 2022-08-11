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
  const [tempTodo, setTempTodo] = useState();
  const [todoStatus, setTodoStatus] = useState('');

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSelectChange = (e) => {
    let tempTodo = {...todo}
    tempTodo.status = e.target.value
    setTodoStatus(e.target.value)
    setTempTodo(tempTodo);
  };

  const handleTodoTitle = (e) => {
    let tempTodo = {...todo}
    tempTodo.title = e.target.value
    setTempTodo(tempTodo);
  };

  const handleTodoDesc = (e) => {
    let tempTodo = {...todo}
    tempTodo.desc = e.target.value
    setTempTodo(tempTodo);
  };

  const handleEdit = () => {
    fetch(`http://localhost:3333/todo/edit/${todo._id}`, {
       method: 'PUT',
       headers: {
         'Content-type': 'application/json',
       },
       body: JSON.stringify({title: tempTodo.title, desc: tempTodo.desc, status: todoStatus})
    }).catch((e)=>{console.log(e)});
    setTodo(tempTodo)
    handleClose();
    window.location.reload(false);
  };


  const handleDelete = () => {
    fetch(`http://localhost:3333/todo/delete/${todo._id}`, {
       method: 'DELETE',
       headers: {
         'Content-type': 'application/json',
       }
    }).catch((e)=>{console.log(e)});
    window.location.reload(false);
  };



  const getStatusColor = () => {
    if (todo?.status === 'pending') return 'error';
    if (todo?.status === 'in progress') return 'secondary';
    if (todo?.status === 'donde') return 'success';
  };

  useEffect(() => {
    setTodo(data);
    setTodoStatus(data.status);
  }, []);

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
                    text: "Note " + todo?.title + " will be lost",
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
                      handleDelete();
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

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
import CloseIcon from '@mui/icons-material/Close';

const TodoCard = ({ data, rerender }) => {
  const [todo, setTodo] = useState();
  const [tempTodo, setTempTodo] = useState();
  const [todoStatus, setTodoStatus] = useState('');

  const [titleError, setTitleError] = useState();
  const [descError, setDescError] = useState();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false)
    rerender();
    setTitleError(undefined);
    setDescError(undefined);
  };

  const handleSelectChange = (e) => {
    let tempTodo = { ...todo };
    tempTodo.status = e.target.value;
    setTodoStatus(e.target.value);
    setTempTodo(tempTodo);
  };

  const handleTodoTitle = (e) => {
    if (e.target.value === '') {
      setTitleError('Please fill the title');
      return;
    }

    if (e.target.value.length < 10 || e.target.value.length > 120) {
      setTitleError('the title should be between 10 and 120 characters');
      return;
    }

    setTitleError(undefined);
    const tempTodoDestruc = { ...todo };
    tempTodoDestruc.title = e.target.value;
    setTempTodo(tempTodoDestruc);
  };

  const handleTodoDesc = (e) => {
    if (e.target.value === '') {
      setDescError('Please fill the description');
      return;
    }

    if (e.target.value.length < 100 || e.target.value.length > 1000) {
      setDescError('Description should be between 100 and 1000 characters');
      return;
    }

    setDescError(undefined);
    const tempTodoDestruc = { ...todo };
    tempTodoDestruc.desc = e.target.value;
    setTempTodo(tempTodoDestruc);
  };

  const handleEdit = () => {
    if (titleError || descError || tempTodo.title === '' || tempTodo.desc === '') {
      return;
    }

    fetch(`http://localhost:3333/todo/edit/${todo._id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        title: tempTodo.title,
        desc: tempTodo.desc,
        status: todoStatus,
      }),
    }).catch((e) => {
      console.log(e);
    });
    setTodo(tempTodo);
    handleClose();
    rerender();
  };

  const handleDelete = () => {
    fetch(`http://localhost:3333/todo/delete/${todo._id}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
      },
    }).catch((e) => {
      console.log(e);
    });
    handleClose();
    rerender();
  };

  const getStatusColor = () => {
    if (todo?.status === 'pending') return 'error';
    if (todo?.status === 'in progress') return 'primary';
    if (todo?.status === 'done') return 'secondary';
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
    padding: '0px 20px 20px 20px',
    borderRadius: '15px',
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
            <p
              style={{ paddingBottom: '10px', textAlign: 'end', color: 'red' }}
            >
              <CloseIcon onClick={handleClose} sx={{ cursor: 'pointer' }} />
            </p>
            <Stack
              direction="row"
              justifyContent={'space-between'}
              marginBottom={'10px'}
            >
              <TextField
                defaultValue={todo?.title}
                label="Title"
                onChange={handleTodoTitle}
                error={titleError?.length > 0}
                helperText={titleError}
                onBlur={handleTodoTitle}
              />
              {todo?.status === 'done' ? (
                <Select value={todoStatus} onChange={handleSelectChange}>
                  <MenuItem disabled={true} value={'done'}>
                    Done
                  </MenuItem>
                </Select>
              ) : (
                <Select value={todoStatus} onChange={handleSelectChange}>
                  <MenuItem disabled={true} value={'pending'}>
                    Pending
                  </MenuItem>
                  <MenuItem value={'in progress'}>In Progress</MenuItem>
                  <MenuItem value={'done'}>Done</MenuItem>
                </Select>
              )}
            </Stack>
            <TextField
              label="Description"
              style={{
                width: '400px',
                height: '250px',
                marginTop: '10px',
              }}
              defaultValue={todo?.desc}
              onChange={handleTodoDesc}
              InputProps={{
                inputComponent: TextareaAutosize,
              }}
              error={descError?.length > 0}
              helperText={descError}
              onBlur={handleTodoDesc}
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
                    text: 'Note ' + todo?.title + ' will be lost',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!',
                  }).then((result) => {
                    if (result.isConfirmed) {
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
          <h3
            style={{ margin: 0, textOverflow: 'ellipsis', overflow: 'hidden' }}
          >
            {todo?.title}
          </h3>
          <Chip label={todo?.status} color={getStatusColor()} />
        </Stack>
        <p
          style={{
            marginBottom: '0',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxHeight: '20px',
            maxWidth: '450px',
          }}
        >
          {todo?.desc}
        </p>
      </Card>
    </div>
  );
};

export default TodoCard;

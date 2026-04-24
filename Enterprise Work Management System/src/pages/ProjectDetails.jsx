import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  Box,
  Typography,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import ProjectService from '../api/project.service';
import TaskService from '../api/task.service';
import UserService from '../api/user.service';
import TaskDetailsModal from '../components/TaskDetailsModal';

const COLUMNS = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  REVIEW: 'Review',
  DONE: 'Done',
};

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState({
    TODO: [],
    IN_PROGRESS: [],
    REVIEW: [],
    DONE: [],
  });
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  const fetchProjectData = () => {
    ProjectService.getProjectById(id).then((res) => setProject(res.data)).catch(console.error);
    TaskService.getTasksByProject(id).then((res) => {
      const groupedTasks = {
        TODO: [],
        IN_PROGRESS: [],
        REVIEW: [],
        DONE: [],
      };
      res.data.forEach((task) => {
        if (groupedTasks[task.status]) {
          groupedTasks[task.status].push(task);
        } else {
          groupedTasks.TODO.push(task); // Fallback
        }
      });
      // Sort by position
      Object.keys(groupedTasks).forEach(col => {
        groupedTasks[col].sort((a, b) => a.position - b.position);
      });
      setTasks(groupedTasks);
    }).catch(console.error);
  };

  useEffect(() => {
    fetchProjectData();
    UserService.getAllUsers().then(res => setUsers(res.data)).catch(console.error);
  }, [id]);

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    const sourceTasks = [...tasks[sourceCol]];
    const destTasks = sourceCol === destCol ? sourceTasks : [...tasks[destCol]];

    const [removed] = sourceTasks.splice(source.index, 1);
    removed.status = destCol; // Update status if changed

    destTasks.splice(destination.index, 0, removed);

    // Update positions
    destTasks.forEach((t, idx) => t.position = idx);

    setTasks((prev) => ({
      ...prev,
      [sourceCol]: sourceTasks,
      [destCol]: destTasks,
    }));

    // Save to backend
    TaskService.updateTask(draggableId, {
      ...removed,
      status: destCol,
      position: destination.index,
    }).catch(console.error);
  };

  const onSubmitTask = (data) => {
    TaskService.createTask(id, data).then(() => {
      setOpenDialog(false);
      reset();
      fetchProjectData();
    }).catch(console.error);
  };

  if (!project) return <div>Loading...</div>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">{project.name} Board</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
          Add Task
        </Button>
      </Box>

      <DragDropContext onDragEnd={onDragEnd}>
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2, height: 'calc(100vh - 200px)' }}>
          {Object.entries(COLUMNS).map(([columnId, columnName]) => (
            <Box key={columnId} sx={{ minWidth: 300, flex: 1 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>{columnName}</Typography>
              <Droppable droppableId={columnId}>
                {(provided) => (
                  <Paper
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    sx={{ p: 2, minHeight: 150, bgcolor: '#f4f5f7' }}
                  >
                    {tasks[columnId].map((task, index) => (
                      <Draggable key={task.id.toString()} draggableId={task.id.toString()} index={index}>
                        {(provided) => (
                          <Paper
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{ p: 2, mb: 2, bgcolor: 'white', cursor: 'pointer' }}
                            onClick={() => setSelectedTask(task)}
                          >
                            <Typography variant="subtitle1">{task.title}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {task.type} • {task.priority}
                            </Typography>
                          </Paper>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Paper>
                )}
              </Droppable>
            </Box>
          ))}
        </Box>
      </DragDropContext>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <form onSubmit={handleSubmit(onSubmitTask)}>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus margin="dense" id="title" label="Task Title" type="text"
              fullWidth variant="standard" {...register('title', { required: true })}
            />
            <TextField
              margin="dense" id="description" label="Description" type="text"
              fullWidth multiline rows={3} variant="standard" {...register('description')}
            />
            <TextField
              select margin="dense" id="type" label="Type"
              fullWidth variant="standard" defaultValue="FEATURE" {...register('type')}
            >
              <MenuItem value="FEATURE">Feature</MenuItem>
              <MenuItem value="BUG">Bug</MenuItem>
              <MenuItem value="IMPROVEMENT">Improvement</MenuItem>
            </TextField>
            <TextField
              select margin="dense" id="priority" label="Priority"
              fullWidth variant="standard" defaultValue="MEDIUM" {...register('priority')}
            >
              <MenuItem value="LOW">Low</MenuItem>
              <MenuItem value="MEDIUM">Medium</MenuItem>
              <MenuItem value="HIGH">High</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button type="submit">Add Task</Button>
          </DialogActions>
        </form>
      </Dialog>

      <TaskDetailsModal
        open={Boolean(selectedTask)}
        handleClose={() => setSelectedTask(null)}
        task={selectedTask}
      />
    </Box>
  );
};

export default ProjectDetails;

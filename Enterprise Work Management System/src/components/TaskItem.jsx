import React from 'react';
import { Paper, Typography } from '@mui/material';

const TaskItem = ({ task, provided, onClick }) => {
  return (
    <Paper
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      sx={{ 
        p: 2, 
        mb: 2, 
        bgcolor: 'background.paper', 
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 3,
        }
      }}
      onClick={onClick}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{task.title}</Typography>
      <Typography variant="body2" color="text.secondary">
        {task.type} • {task.priority}
      </Typography>
      {task.assignee && (
        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
          Assigned to: {task.assignee.name}
        </Typography>
      )}
    </Paper>
  );
};

export default React.memo(TaskItem);

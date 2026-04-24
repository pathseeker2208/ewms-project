import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  Link
} from '@mui/material';
import api from '../api/axios';
import { toast } from 'react-toastify';

const TaskDetailsModal = ({ open, handleClose, task }) => {
  const [comments, setComments] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newAttachmentUrl, setNewAttachmentUrl] = useState('');
  const [newAttachmentName, setNewAttachmentName] = useState('');

  const fetchDetails = () => {
    if (!task) return;
    api.get(`/comments/task/${task.id}`).then(res => setComments(res.data)).catch(console.error);
    api.get(`/attachments/task/${task.id}`).then(res => setAttachments(res.data)).catch(console.error);
  };

  useEffect(() => {
    if (open && task) {
      fetchDetails();
    }
  }, [open, task]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    api.post(`/comments/task/${task.id}`, { text: newComment })
      .then(() => {
        setNewComment('');
        fetchDetails();
        toast.success('Comment added');
      })
      .catch(() => toast.error('Failed to add comment'));
  };

  const handleAddAttachment = () => {
    if (!newAttachmentUrl.trim() || !newAttachmentName.trim()) return;
    api.post(`/attachments/task/${task.id}`, { fileName: newAttachmentName, fileUrl: newAttachmentUrl })
      .then(() => {
        setNewAttachmentName('');
        setNewAttachmentUrl('');
        fetchDetails();
        toast.success('Attachment added');
      })
      .catch(() => toast.error('Failed to add attachment'));
  };

  if (!task) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{task.title}</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1" paragraph>
          {task.description || 'No description provided.'}
        </Typography>

        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', gap: 4 }}>
          {/* Comments Section */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6">Comments</Typography>
            <List sx={{ maxHeight: 300, overflow: 'auto', mb: 2 }}>
              {comments.map((comment) => (
                <ListItem key={comment.id} alignItems="flex-start" divider>
                  <ListItemText
                    primary={comment.author?.name}
                    secondary={
                      <React.Fragment>
                        <Typography component="span" variant="body2" color="text.primary">
                          {new Date(comment.createdAt).toLocaleString()}
                        </Typography>
                        {` — ${comment.text}`}
                      </React.Fragment>
                    }
                  />
                </ListItem>
              ))}
            </List>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                fullWidth
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button variant="contained" onClick={handleAddComment}>Post</Button>
            </Box>
          </Box>

          {/* Attachments Section */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6">Attachments</Typography>
            <List sx={{ maxHeight: 300, overflow: 'auto', mb: 2 }}>
              {attachments.map((att) => (
                <ListItem key={att.id} divider>
                  <ListItemText
                    primary={
                      <Link href={att.fileUrl} target="_blank" rel="noopener noreferrer">
                        {att.fileName}
                      </Link>
                    }
                    secondary={`By ${att.uploadedBy?.name}`}
                  />
                </ListItem>
              ))}
            </List>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <TextField
                size="small"
                fullWidth
                placeholder="File Name"
                value={newAttachmentName}
                onChange={(e) => setNewAttachmentName(e.target.value)}
              />
              <TextField
                size="small"
                fullWidth
                placeholder="File URL"
                value={newAttachmentUrl}
                onChange={(e) => setNewAttachmentUrl(e.target.value)}
              />
              <Button variant="contained" onClick={handleAddAttachment}>Attach Link</Button>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDetailsModal;

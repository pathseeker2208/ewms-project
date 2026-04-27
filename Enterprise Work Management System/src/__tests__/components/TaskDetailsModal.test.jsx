import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskDetailsModal from '../TaskDetailsModal';
import api from '../api/axios';
import { toast } from 'react-toastify';

jest.mock('../api/axios');
jest.mock('react-toastify');

const mockTask = {
  id: 1,
  title: 'Test Task',
  description: 'Task description',
};

const mockComments = [
  { id: 1, text: 'Nice work', createdAt: new Date().toISOString(), author: { name: 'John Doe' } }
];

const mockAttachments = [
  { id: 1, fileName: 'spec.pdf', fileUrl: 'http://test.com/spec.pdf', uploadedBy: { name: 'Jane Doe' } }
];

describe('TaskDetailsModal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.get.mockImplementation((url) => {
      if (url.includes('/comments/task')) return Promise.resolve({ data: mockComments });
      if (url.includes('/attachments/task')) return Promise.resolve({ data: mockAttachments });
      return Promise.resolve({ data: [] });
    });
  });

  it('renders nothing when task is null', () => {
    const { container } = render(<TaskDetailsModal open={true} handleClose={() => {}} task={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders task details and fetches comments/attachments', async () => {
    render(<TaskDetailsModal open={true} handleClose={() => {}} task={mockTask} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Task description')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText(/Nice work/i)).toBeInTheDocument();
      expect(screen.getByText('spec.pdf')).toBeInTheDocument();
    });
  });

  it('adds a new comment', async () => {
    api.post.mockResolvedValue({ data: {} });
    render(<TaskDetailsModal open={true} handleClose={() => {}} task={mockTask} />);
    
    const input = screen.getByPlaceholderText(/write a comment/i);
    const postBtn = screen.getByText('Post');
    
    fireEvent.change(input, { target: { value: 'New comment text' } });
    fireEvent.click(postBtn);
    
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/comments/task/1', { text: 'New comment text' });
      expect(toast.success).toHaveBeenCalledWith('Comment added');
    });
  });

  it('adds a new attachment', async () => {
    api.post.mockResolvedValue({ data: {} });
    render(<TaskDetailsModal open={true} handleClose={() => {}} task={mockTask} />);
    
    const nameInput = screen.getByPlaceholderText(/file name/i);
    const urlInput = screen.getByPlaceholderText(/file url/i);
    const attachBtn = screen.getByText('Attach Link');
    
    fireEvent.change(nameInput, { target: { value: 'Design.png' } });
    fireEvent.change(urlInput, { target: { value: 'http://img.com/d.png' } });
    fireEvent.click(attachBtn);
    
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/attachments/task/1', { fileName: 'Design.png', fileUrl: 'http://img.com/d.png' });
      expect(toast.success).toHaveBeenCalledWith('Attachment added');
    });
  });

  it('handles API errors gracefully when adding content', async () => {
    api.post.mockRejectedValue(new Error('API Error'));
    render(<TaskDetailsModal open={true} handleClose={() => {}} task={mockTask} />);
    
    fireEvent.change(screen.getByPlaceholderText(/write a comment/i), { target: { value: 'fail' } });
    fireEvent.click(screen.getByText('Post'));
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to add comment');
    });
  });
});

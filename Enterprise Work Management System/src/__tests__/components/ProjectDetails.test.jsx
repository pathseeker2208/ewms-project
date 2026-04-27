import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProjectDetails from '../../pages/ProjectDetails';
import ProjectService from '../../api/project.service';
import TaskService from '../../api/task.service';
import UserService from '../../api/user.service';

jest.mock('../../api/project.service');
jest.mock('../../api/task.service');
jest.mock('../../api/user.service');
jest.mock('@hello-pangea/dnd', () => ({
  DragDropContext: ({ children }) => <div>{children}</div>,
  Droppable: ({ children }) => children({
    droppableProps: {},
    innerRef: jest.fn(),
    placeholder: null
  }),
  Draggable: ({ children }) => children({
    draggableProps: {},
    dragHandleProps: {},
    innerRef: jest.fn()
  })
}));

const mockProject = { id: 1, name: 'Project Board' };
const mockTasks = [
  { id: 1, title: 'Task 1', status: 'TODO', position: 0 },
  { id: 2, title: 'Task 2', status: 'IN_PROGRESS', position: 0 }
];

describe('ProjectDetails Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    ProjectService.getProjectById.mockResolvedValue({ data: mockProject });
    TaskService.getTasksByProject.mockResolvedValue({ data: mockTasks });
    UserService.getAllUsers.mockResolvedValue({ data: [] });
  });

  const renderWithRouter = () => {
    render(
      <MemoryRouter initialEntries={['/projects/1']}>
        <Routes>
          <Route path="/projects/:id" element={<ProjectDetails />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders loading state initially', () => {
    ProjectService.getProjectById.mockReturnValue(new Promise(() => {}));
    renderWithRouter();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders project name and task columns', async () => {
    renderWithRouter();
    await waitFor(() => {
      expect(screen.getByText('Project Board Board')).toBeInTheDocument();
      expect(screen.getByText('To Do')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
    });
  });

  it('renders tasks in their respective columns', async () => {
    renderWithRouter();
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });
  });

  it('opens add task dialog and submits new task', async () => {
    TaskService.createTask.mockResolvedValue({});
    renderWithRouter();
    
    await waitFor(() => screen.getByText('Add Task'));
    fireEvent.click(screen.getByText('Add Task'));
    
    expect(screen.getByText('Add New Task')).toBeInTheDocument();
    
    fireEvent.change(screen.getByLabelText(/task title/i), { target: { value: 'New Task' } });
    const submitButtons = screen.getAllByRole('button', { name: /add task/i });
    fireEvent.click(submitButtons[1]); // The one inside the dialog
    
    await waitFor(() => {
      expect(TaskService.createTask).toHaveBeenCalledWith('1', expect.objectContaining({ title: 'New Task' }));
    });
  });

  it('handles API errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    ProjectService.getProjectById.mockRejectedValue(new Error('Error'));
    renderWithRouter();
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
    consoleSpy.mockRestore();
  });
});

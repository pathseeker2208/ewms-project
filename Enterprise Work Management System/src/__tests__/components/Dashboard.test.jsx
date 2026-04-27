import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from '../../pages/Dashboard';
import ProjectService from '../../api/project.service';
import api from '../../api/axios';

jest.mock('../../api/project.service');
jest.mock('../../api/axios');
jest.mock('recharts', () => {
  const Original = jest.requireActual('recharts');
  return { ...Original, ResponsiveContainer: ({ children }) => <div style={{ width: '800px', height: '400px' }}>{children}</div> };
});

const dashboardMetricsMock = {
  totalProjects: 4,
  totalTasks: 20,
  completedTasks: 8,
  pendingTasks: 12,
  projectProgress: [
    { name: 'Project A', Tasks: 10, Completed: 4 },
    { name: 'Project B', Tasks: 10, Completed: 4 },
  ],
  statusBreakdown: [
    { name: 'TODO', value: 12 },
    { name: 'DONE', value: 8 },
  ],
};

const activityMock = [
  { id: 1, action: 'Created', entityType: 'Task', timestamp: new Date().toISOString(), user: { name: 'Alice' } },
  { id: 2, action: 'Updated', entityType: 'Project', timestamp: new Date().toISOString(), user: { name: 'Bob' } },
];

beforeEach(() => {
  api.get.mockImplementation((url) => {
    if (url === '/dashboard/metrics') return Promise.resolve({ data: dashboardMetricsMock });
    if (url === '/activity') return Promise.resolve({ data: activityMock });
    return Promise.resolve({ data: [] });
  });
  ProjectService.getAllProjects.mockResolvedValue({ data: [] });
});

afterEach(() => jest.clearAllMocks());

describe('Dashboard Component', () => {
  it('renders all four metric cards with correct labels', async () => {
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText('Total Projects')).toBeInTheDocument();
      expect(screen.getByText('Total Tasks')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });
  });

  it('displays correct numeric values from API metrics', async () => {
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText('4')).toBeInTheDocument(); // totalProjects
      expect(screen.getByText('20')).toBeInTheDocument(); // totalTasks
    });
  });

  it('renders recent activity list with correct items', async () => {
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText(/Alice Created Task/i)).toBeInTheDocument();
      expect(screen.getByText(/Bob Updated Project/i)).toBeInTheDocument();
    });
  });

  it('renders the Project Progress chart section', async () => {
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText('Project Progress')).toBeInTheDocument();
    });
  });

  it('renders the Task Status Breakdown chart section', async () => {
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText('Task Status Breakdown')).toBeInTheDocument();
    });
  });
});

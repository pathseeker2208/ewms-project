import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from '../../pages/Dashboard';
import ProjectService from '../../api/project.service';
import api from '../../api/axios';

// Mock dependencies
jest.mock('../../api/project.service');
jest.mock('../../api/axios');

// Mock recharts to avoid responsive container issues in jsdom
jest.mock('recharts', () => {
  const OriginalRecharts = jest.requireActual('recharts');
  return {
    ...OriginalRecharts,
    ResponsiveContainer: ({ children }) => (
      <div style={{ width: '800px', height: '400px' }}>{children}</div>
    ),
  };
});

describe('Dashboard Component', () => {
  beforeEach(() => {
    ProjectService.getAllProjects.mockResolvedValue({
      data: [
        { id: 1, name: 'Project 1' },
        { id: 2, name: 'Project 2' }
      ]
    });

    api.get.mockImplementation((url) => {
      if (url === '/activity') {
        return Promise.resolve({
          data: [
            { id: 1, action: 'Created', entityType: 'Task', timestamp: new Date().toISOString(), user: { name: 'Admin' } }
          ]
        });
      }
      return Promise.resolve({ data: [] });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders metric cards correctly', async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Total Projects')).toBeInTheDocument();
      expect(screen.getByText('Total Tasks')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });
    
    // We expect 2 total projects based on our mock
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders recent activity correctly', async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Admin Created Task/i)).toBeInTheDocument();
    });
  });
});

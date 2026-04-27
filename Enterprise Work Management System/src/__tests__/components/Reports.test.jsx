import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Reports from '../../pages/Reports';
import api from '../../api/axios';

jest.mock('../../api/axios');
jest.mock('recharts', () => {
  const Original = jest.requireActual('recharts');
  return {
    ...Original,
    ResponsiveContainer: ({ children }) => <div>{children}</div>,
    BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
    PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
    XAxis: () => <div />,
    YAxis: () => <div />,
    CartesianGrid: () => <div />,
    Tooltip: () => <div />,
    Legend: () => <div />,
    Bar: () => <div />,
    Pie: () => <div />,
    Cell: () => <div />,
  };
});

const mockReportData = {
  projectProgress: [
    { name: 'Project A', Tasks: 10, Completed: 5 }
  ],
  statusBreakdown: [
    { name: 'TODO', value: 5 },
    { name: 'DONE', value: 5 }
  ]
};

describe('Reports Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.get.mockResolvedValue({ data: mockReportData });
  });

  it('renders loading state initially', () => {
    render(<Reports />);
    expect(screen.getByText(/loading reports/i)).toBeInTheDocument();
  });

  it('renders report content after fetching data', async () => {
    render(<Reports />);
    await waitFor(() => {
      expect(screen.getByText('Reporting & Analytics')).toBeInTheDocument();
      expect(screen.getByText('Project Completion Status')).toBeInTheDocument();
      expect(screen.getByText('Project A')).toBeInTheDocument();
    });
  });

  it('renders charts and table data', async () => {
    render(<Reports />);
    await waitFor(() => {
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
      expect(screen.getByText('50%')).toBeInTheDocument(); // Completion percentage
    });
  });

  it('handles CSV export click', async () => {
    window.alert = jest.fn();
    render(<Reports />);
    await waitFor(() => screen.getByText('Export CSV'));
    
    fireEvent.click(screen.getByText('Export CSV'));
    expect(window.alert).toHaveBeenCalledWith('Exporting report as CSV...');
  });

  it('handles API error gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    api.get.mockRejectedValue(new Error('Fetch Error'));
    render(<Reports />);
    
    await waitFor(() => {
      expect(screen.getByText(/loading reports/i)).toBeInTheDocument();
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching report data', expect.any(Error));
    });
    consoleSpy.mockRestore();
  });
});

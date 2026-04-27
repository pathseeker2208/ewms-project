import React from 'react';
import { render, screen } from '@testing-library/react';
import TaskItem from '../../components/TaskItem';

const mockTask = {
  id: 1,
  title: 'Fix Login Bug',
  type: 'BUG',
  priority: 'HIGH',
  assignee: { name: 'Alice' },
};

const mockProvided = {
  innerRef: jest.fn(),
  draggableProps: {},
  dragHandleProps: {},
};

const renderTaskItem = (task = mockTask, provided = mockProvided) =>
  render(<TaskItem task={task} provided={provided} onClick={jest.fn()} />);

describe('TaskItem Component', () => {
  it('renders the task title', () => {
    renderTaskItem();
    expect(screen.getByText('Fix Login Bug')).toBeInTheDocument();
  });

  it('renders the task type and priority', () => {
    renderTaskItem();
    // Type and priority appear as "BUG • HIGH" in a single element
    expect(screen.getByText((content) => content.includes('BUG') && content.includes('HIGH'))).toBeInTheDocument();
  });

  it('renders the assignee name when provided', () => {
    renderTaskItem();
    expect(screen.getByText(/Alice/i)).toBeInTheDocument();
  });

  it('does not render assignee section when no assignee', () => {
    const taskWithoutAssignee = { ...mockTask, assignee: null };
    renderTaskItem(taskWithoutAssignee);
    expect(screen.queryByText(/Assigned to:/i)).not.toBeInTheDocument();
  });

  it('calls onClick when the card is clicked', () => {
    const handleClick = jest.fn();
    render(<TaskItem task={mockTask} provided={mockProvided} onClick={handleClick} />);
    screen.getByText('Fix Login Bug').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

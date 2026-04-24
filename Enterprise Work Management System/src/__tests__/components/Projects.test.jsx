import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Projects from '../../pages/Projects';
import ProjectService from '../../api/project.service';

jest.mock('../../api/project.service');

const mockStore = configureStore([]);

const renderProjectsWithStore = (storeState) => {
  const store = mockStore(storeState);
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Projects />
      </MemoryRouter>
    </Provider>
  );
};

describe('Projects Component', () => {
  beforeEach(() => {
    ProjectService.getAllProjects.mockResolvedValue({
      data: [
        { id: 1, name: 'Project Alpha', description: 'Desc Alpha', status: 'IN_PROGRESS' },
      ]
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders project list correctly', async () => {
    renderProjectsWithStore({ auth: { user: { roles: ['ROLE_EMPLOYEE'] } } });

    await waitFor(() => {
      expect(screen.getByText('Project Alpha')).toBeInTheDocument();
      expect(screen.getByText('Desc Alpha')).toBeInTheDocument();
    });
  });

  it('hides New Project button for employees', async () => {
    renderProjectsWithStore({ auth: { user: { roles: ['ROLE_EMPLOYEE'] } } });

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /New Project/i })).not.toBeInTheDocument();
    });
  });

  it('shows New Project button for managers', async () => {
    renderProjectsWithStore({ auth: { user: { roles: ['ROLE_MANAGER'] } } });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /New Project/i })).toBeInTheDocument();
    });
  });
});

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Projects from '../../pages/Projects';
import ProjectService from '../../api/project.service';

jest.mock('../../api/project.service');

const mockStore = configureStore([]);

const renderProjects = (roles = ['ROLE_EMPLOYEE']) => {
  const store = mockStore({
    auth: { user: { id: 1, name: 'Test User', roles } },
  });
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Projects />
      </MemoryRouter>
    </Provider>
  );
};

const projectsMock = [
  { id: 1, name: 'Alpha Project', description: 'First project', status: 'IN_PROGRESS' },
  { id: 2, name: 'Beta Project', description: 'Second project', status: 'COMPLETED' },
];

beforeEach(() => {
  ProjectService.getAllProjects.mockResolvedValue({ data: projectsMock });
});

afterEach(() => jest.clearAllMocks());

describe('Projects Component', () => {
  it('renders the Projects page heading', async () => {
    renderProjects();
    const heading = await screen.findByText(/projects/i);
    expect(heading).toBeInTheDocument();
  });

  it('displays list of projects fetched from API', async () => {
    renderProjects();
    expect(await screen.findByText('Alpha Project')).toBeInTheDocument();
    expect(await screen.findByText('Beta Project')).toBeInTheDocument();
  });

  it('shows project description', async () => {
    renderProjects();
    expect(await screen.findByText('First project')).toBeInTheDocument();
  });

  it('hides "New Project" button for Employee role', async () => {
    renderProjects(['ROLE_EMPLOYEE']);
    await screen.findByText('Alpha Project');
    expect(screen.queryByRole('button', { name: /new project/i })).not.toBeInTheDocument();
  });

  it('shows "New Project" button for Manager role', async () => {
    renderProjects(['ROLE_MANAGER']);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /new project/i })).toBeInTheDocument();
    });
  });
});

import api from './axios';

const getAllProjects = () => {
  return api.get('/projects');
};

const getProjectById = (id) => {
  return api.get(`/projects/${id}`);
};

const createProject = (data) => {
  return api.post('/projects', data);
};

const updateProject = (id, data) => {
  return api.put(`/projects/${id}`, data);
};

const deleteProject = (id) => {
  return api.delete(`/projects/${id}`);
};

const ProjectService = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};

export default ProjectService;

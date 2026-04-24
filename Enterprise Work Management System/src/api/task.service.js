import api from './axios';

const getTasksByProject = (projectId) => {
  return api.get(`/tasks/project/${projectId}`);
};

const createTask = (projectId, data) => {
  return api.post(`/tasks/project/${projectId}`, data);
};

const updateTask = (id, data) => {
  return api.put(`/tasks/${id}`, data);
};

const deleteTask = (id) => {
  return api.delete(`/tasks/${id}`);
};

const TaskService = {
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask,
};

export default TaskService;

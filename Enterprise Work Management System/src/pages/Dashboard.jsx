import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box, List, ListItem, ListItemText, Divider, useTheme, useMediaQuery } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import ProjectService from '../api/project.service';
import api from '../api/axios';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [metrics, setMetrics] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [activities, setActivities] = useState([]);
  const [pieData, setPieData] = useState([]);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    api.get('/dashboard/metrics').then((response) => {
      const data = response.data;
      setMetrics({
        totalProjects: data.totalProjects,
        totalTasks: data.totalTasks,
        completedTasks: data.completedTasks,
        pendingTasks: data.pendingTasks,
      });
      setChartData(data.projectProgress);
      setPieData(data.statusBreakdown);
    }).catch(error => console.error("Error fetching dashboard metrics", error));

    api.get('/activity').then((res) => {
      setActivities(res.data);
    }).catch(console.error);
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Metrics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography color="text.secondary" gutterBottom>
              Total Projects
            </Typography>
            <Typography variant="h4">{metrics.totalProjects}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography color="text.secondary" gutterBottom>
              Total Tasks
            </Typography>
            <Typography variant="h4">{metrics.totalTasks}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography color="text.secondary" gutterBottom>
              Completed
            </Typography>
            <Typography variant="h4" color="success.main">{metrics.completedTasks}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography color="text.secondary" gutterBottom>
              Pending
            </Typography>
            <Typography variant="h4" color="error.main">{metrics.pendingTasks}</Typography>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: isMobile ? 300 : 400 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <List sx={{ overflow: 'auto' }}>
              {activities.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No recent activity.</Typography>
              ) : (
                activities.map((activity) => (
                  <React.Fragment key={activity.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={`${activity.user?.name || 'Someone'} ${activity.action} ${activity.entityType}`}
                        secondary={
                          <React.Fragment>
                            <Typography component="span" variant="body2" color="text.primary">
                              {new Date(activity.timestamp).toLocaleString()}
                            </Typography>
                            {activity.description && ` — ${activity.description}`}
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))
              )}
            </List>
          </Paper>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} lg={8}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={isMedium ? 12 : 7}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: isMobile ? 300 : 400 }}>
                <Typography variant="h6" gutterBottom>
                  Project Progress
                </Typography>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: isMobile ? 60 : 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      interval={0} 
                      angle={isMobile ? -45 : 0} 
                      textAnchor={isMobile ? "end" : "middle"}
                      height={isMobile ? 80 : 30}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend verticalAlign="top" height={36}/>
                    <Bar dataKey="Tasks" fill="#8884d8" />
                    <Bar dataKey="Completed" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12} md={isMedium ? 12 : 5}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: isMobile ? 300 : 400 }}>
                <Typography variant="h6" gutterBottom>
                  Task Status Breakdown
                </Typography>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={isMobile ? 40 : 60}
                      outerRadius={isMobile ? 60 : 80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={!isMobile}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

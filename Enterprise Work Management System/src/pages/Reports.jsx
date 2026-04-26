import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
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
import api from '../api/axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/metrics')
      .then((res) => {
        setReportData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching report data', err);
        setLoading(false);
      });
  }, []);

  const handleExport = () => {
    // Simulated export
    alert('Exporting report as CSV...');
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Project Name,Tasks,Completed\n"
      + reportData.projectProgress.map(p => `${p.name},${p.Tasks},${p.Completed}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ewms_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading || !reportData) return <Typography>Loading reports...</Typography>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AssessmentIcon color="primary" /> Reporting & Analytics
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<DownloadIcon />} 
          onClick={handleExport}
        >
          Export CSV
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Project Status Summary */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 450 }}>
            <Typography variant="h6" gutterBottom>Project Completion Status</Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={reportData.projectProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Tasks" fill="#8884d8" name="Total Tasks" />
                <Bar dataKey="Completed" fill="#82ca9d" name="Completed Tasks" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Task Distribution */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 450 }}>
            <Typography variant="h6" gutterBottom>Task Status Distribution</Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={reportData.statusBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {reportData.statusBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Detailed Table */}
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Typography variant="h6" sx={{ p: 2 }}>Project Details Breakdown</Typography>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell>Project Name</TableCell>
                  <TableCell align="right">Total Tasks</TableCell>
                  <TableCell align="right">Completed Tasks</TableCell>
                  <TableCell align="right">Completion %</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.projectProgress.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell component="th" scope="row">{row.name}</TableCell>
                    <TableCell align="right">{row.Tasks}</TableCell>
                    <TableCell align="right">{row.Completed}</TableCell>
                    <TableCell align="right">
                      {row.Tasks > 0 ? Math.round((row.Completed / row.Tasks) * 100) : 0}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;

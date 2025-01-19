import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Button,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    CircularProgress,
} from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ReportsPage = () => {
    const [projectsReport, setProjectsReport] = useState([]);
    const [tasksReport, setTasksReport] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const [projectsRes, tasksRes] = await Promise.all([
                    axios.get('/api/reports/projects'),
                    axios.get('/api/reports/tasks'),
                ]);
                setProjectsReport(projectsRes.data);
                setTasksReport(tasksRes.data);
            } catch (error) {
                console.error('Error fetching reports:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    const downloadPDF = (data, title) => {
        const doc = new jsPDF();
        doc.text(title, 14, 10);
        doc.autoTable({
            head: [Object.keys(data[0])],
            body: data.map(item => Object.values(item)),
        });
        doc.save(`${title}.pdf`);
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    backgroundColor: '#f5f5f5',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            {/* Hero Section */}
            <Box
                sx={{
                    textAlign: 'center',
                    mb: 4,
                    borderRadius: 2,
                    p: 3,
                    background: 'linear-gradient(90deg, #1976d2 0%, #512da8 100%)',
                    color: '#fff',
                    boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)',
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        fontFamily: 'Poppins, sans-serif',
                    }}
                >
                    Reports
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        opacity: 0.9,
                        fontFamily: 'Inter, sans-serif',
                    }}
                >
                    Generate reports and download them as tables or PDFs.
                </Typography>
            </Box>

            {/* Projects Report Section */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                        fontWeight: 700,
                        color: '#1976d2',
                        mb: 2,
                        fontFamily: 'Poppins, sans-serif',
                    }}
                >
                    Project Status Report
                </Typography>
                <Paper
                    sx={{
                        p: 2,
                        mb: 4,
                        borderRadius: 2,
                        boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.1)',
                        background: '#fff',
                    }}
                >
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow
                                sx={{
                                    background: '#1976d2',
                                    '& th': {
                                        color: '#fff',
                                        fontWeight: 700,
                                        fontFamily: 'Poppins, sans-serif',
                                        textAlign: 'center', // Center align headers
                                    },
                                }}
                            >
                                <TableCell>Title</TableCell>
                                <TableCell>Start Date</TableCell>
                                <TableCell>End Date</TableCell>
                                <TableCell>Tasks Count</TableCell>
                                <TableCell>Comments Count</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {projectsReport.map((project, index) => (
                                <TableRow
                                    key={index}
                                    sx={{
                                        '&:hover': {
                                            background: '#f9f9f9',
                                        },
                                        '& td': {
                                            textAlign: 'center', // Center align table cells
                                            padding: '12px 16px',
                                            fontFamily: 'Inter, sans-serif',
                                            fontSize: '0.9rem',
                                        },
                                    }}
                                >
                                    <TableCell>{project.title}</TableCell>
                                    <TableCell>
                                        {new Date(project.startDate).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(project.endDate).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell sx={{ color: '#1976d2', fontWeight: 600 }}>
                                        {project.tasksCount}
                                    </TableCell>
                                    <TableCell sx={{ color: '#f57c00', fontWeight: 600 }}>
                                        {project.commentsCount}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Button
                        variant="contained"
                        onClick={() => downloadPDF(projectsReport, 'Project Status Report')}
                        sx={{
                            mt: 2,
                            backgroundColor: '#ffca28',
                            color: '#333',
                            fontWeight: 600,
                            textTransform: 'none',
                            '&:hover': { backgroundColor: '#ffc107' },
                        }}
                    >
                        Download PDF
                    </Button>
                </Paper>
            </Box>

            {/* Tasks Report Section */}
            <Box>
                <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                        fontWeight: 700,
                        color: '#1976d2',
                        mb: 2,
                        fontFamily: 'Poppins, sans-serif',
                    }}
                >
                    Task Completion Report
                </Typography>
                <Paper
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.1)',
                        background: '#fff',
                    }}
                >
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow
                                sx={{
                                    background: '#1976d2',
                                    '& th': {
                                        color: '#fff',
                                        fontWeight: 700,
                                        fontFamily: 'Poppins, sans-serif',
                                        textAlign: 'center', // Center align headers
                                    },
                                }}
                            >
                                <TableCell>Title</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Assigned To</TableCell>
                                <TableCell>Due Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tasksReport.map((task, index) => (
                                <TableRow
                                    key={index}
                                    sx={{
                                        '&:hover': {
                                            background: '#f9f9f9',
                                        },
                                        '& td': {
                                            textAlign: 'center', // Center align table cells
                                            padding: '12px 16px',
                                            fontFamily: 'Inter, sans-serif',
                                            fontSize: '0.9rem',
                                        },
                                    }}
                                >
                                    <TableCell>{task.title}</TableCell>
                                    <TableCell>{task.status}</TableCell>
                                    <TableCell>{task.assignedTo || 'Unassigned'}</TableCell>
                                    <TableCell>
                                        {new Date(task.dueDate).toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Button
                        variant="contained"
                        onClick={() => downloadPDF(tasksReport, 'Task Completion Report')}
                        sx={{
                            mt: 2,
                            backgroundColor: '#ffca28',
                            color: '#333',
                            fontWeight: 600,
                            textTransform: 'none',
                            '&:hover': { backgroundColor: '#ffc107' },
                        }}
                    >
                        Download PDF
                    </Button>
                </Paper>
            </Box>
        </Box>
    );
};

export default ReportsPage;

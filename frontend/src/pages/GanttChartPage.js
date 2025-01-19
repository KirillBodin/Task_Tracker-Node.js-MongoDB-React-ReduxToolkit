// GanttChartPage.jsx

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Chart } from 'react-google-charts';
import { fetchProjects } from '../redux/projectSlice';
import { fetchTasks } from '../redux/taskSlice';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Select,
    MenuItem,
    TextField,
    Button,
    Typography,
    Paper,
} from '@mui/material';
import { format } from 'date-fns';

const GanttChartPage = () => {
    const dispatch = useDispatch();
    const projects = useSelector((state) => state.projects.projects);
    const tasks = useSelector((state) => state.tasks.tasks);
    const navigate = useNavigate();

    const [selectedProject, setSelectedProject] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        dispatch(fetchProjects());
        dispatch(fetchTasks());
    }, [dispatch]);

    const calculateCompletionPercentage = (projectId) => {
        const projectTasks = tasks.filter(
            (task) =>
                task.project && task.project._id.toString() === projectId.toString()
        );
        if (projectTasks.length === 0) return 0;

        const completedTasks = projectTasks.filter((task) => task.status === 'Done');
        return Math.round((completedTasks.length / projectTasks.length) * 100);
    };

    const filteredProjects = projects.filter((project) => {
        const projectStart = new Date(project.startDate);
        const projectEnd = new Date(project.endDate);
        const filterStart = startDate ? new Date(startDate) : null;
        const filterEnd = endDate ? new Date(endDate) : null;

        return (
            (!filterStart || projectEnd >= filterStart) &&
            (!filterEnd || projectStart <= filterEnd) &&
            (!selectedProject || project._id === selectedProject)
        );
    });

    const ganttData = [
        [
            { type: 'string', label: 'Task ID' },
            { type: 'string', label: 'Task Name' },
            { type: 'string', label: 'Resource' },
            { type: 'date', label: 'Start Date' },
            { type: 'date', label: 'End Date' },
            { type: 'number', label: 'Duration' },
            { type: 'number', label: 'Percent done' },
            { type: 'string', label: 'Dependencies' },
        ],
        ...filteredProjects.map((project) => [
            project._id,
            `${project.title} (${format(new Date(project.startDate), 'dd MMM yyyy')} - ${format(new Date(project.endDate), 'dd MMM yyyy')})`,
            'Project',
            new Date(project.startDate),
            new Date(project.endDate),
            null,
            calculateCompletionPercentage(project._id),
            null,
        ]),
    ];

    const handleChartSelect = (chartWrapper) => {
        const chart = chartWrapper.getChart();
        const selection = chart.getSelection();
        if (selection.length > 0) {
            const { row } = selection[0];
            const taskOrProjectId = ganttData[row + 1][0];
            const isProject = ganttData[row + 1][2] === 'Project';

            if (isProject) {
                navigate(`/projects/${taskOrProjectId}`);
            } else {
                navigate(`/tasks/${taskOrProjectId}`);
            }
        }
    };

    const renderHeroSection = () => (
        <Box
            sx={{
                borderRadius: 2,
                p: 3,
                mb: 4,
                background: 'linear-gradient(90deg, #1976d2 0%, #512da8 100%)',
                color: '#fff',
                textAlign: 'center',
                boxShadow: '0px 4px 15px rgba(0,0,0,0.2)',
            }}
        >
            <Typography
                variant="h4"
                sx={{ fontWeight: 700, fontFamily: 'Poppins, sans-serif', mb: 1 }}
            >
                Gantt Chart Overview
            </Typography>
            <Typography
                variant="body1"
                sx={{ fontFamily: 'Inter, sans-serif', opacity: 0.9 }}
            >
                Visualize your projects and tasks on a timeline.
            </Typography>
        </Box>
    );

    return (
        <Box
            sx={{
                p: 3,
                fontFamily: 'Poppins, sans-serif',
                backgroundColor: '#f5f5f5',
                minHeight: '100vh',
            }}
        >
            {renderHeroSection()}

            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    mb: 4,
                    background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
                    borderRadius: '12px',
                    boxShadow: '0px 6px 20px rgba(0,0,0,0.1)',
                }}
            >
                <Select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    displayEmpty
                    sx={{ minWidth: 200, fontFamily: 'Poppins, sans-serif' }}
                >
                    <MenuItem value="">
                        <em>All Projects</em>
                    </MenuItem>
                    {projects.map((project) => (
                        <MenuItem key={project._id} value={project._id}>
                            {project.title}
                        </MenuItem>
                    ))}
                </Select>

                <TextField
                    type="date"
                    label="Start Date"
                    InputLabelProps={{ shrink: true }}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    sx={{ ml: 3, minWidth: 150 }}
                />

                <TextField
                    type="date"
                    label="End Date"
                    InputLabelProps={{ shrink: true }}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    sx={{ ml: 3, minWidth: 150 }}
                />

                <Button
                    variant="contained"
                    onClick={() => {
                        setStartDate('');
                        setEndDate('');
                        setSelectedProject('');
                    }}
                    sx={{
                        ml: 3,
                        backgroundColor: '#ffca28',
                        color: '#333',
                        fontWeight: 600,
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: '#ffc107',
                        },
                    }}
                >
                    Reset Filters
                </Button>
            </Paper>

            <Box
                sx={{
                    p: 3,
                    borderRadius: 3,
                    background: '#fff',
                    boxShadow: '0px 4px 15px rgba(0,0,0,0.1)',
                }}
            >
                <Chart
                    chartType="Gantt"
                    width="100%"
                    height="65vh"
                    data={ganttData}
                    options={{
                        gantt: {
                            criticalPathEnabled: true,
                            trackHeight: 42,
                        },
                    }}
                    chartEvents={[
                        {
                            eventName: 'select',
                            callback: ({ chartWrapper }) => handleChartSelect(chartWrapper),
                        },
                    ]}
                />
            </Box>
        </Box>
    );
};

export default GanttChartPage;

// DashboardAnalytics.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Grid,
    Paper,
    Button,
    useMediaQuery,
} from '@mui/material';
import {
    Bar,
    Pie,
    Line,
    Doughnut
} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    LineElement,
    PointElement
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    LineElement,
    PointElement
);

const DashboardAnalytics = () => {
    const [analytics, setAnalytics] = useState({
        totalProjects: 0,
        totalTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0,
    });

    const [extraStatusCounts] = useState({
        onHold: 3,
        cancelled: 4,
    });

    // Для адаптивности
    const isSmallScreen = useMediaQuery('(max-width: 600px)');

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await axios.get('/api/dashboard/analytics');
                setAnalytics(response.data);
            } catch (error) {
                console.error('Error fetching analytics data:', error);
            }
        };
        fetchAnalytics();
    }, []);

    // Пример данных для демонстрации Pie/Line:
    const pieData = {
        labels: ['Active', 'Completed', 'Pending'],
        datasets: [
            {
                data: [10, 5, 2],
                backgroundColor: ['#42a5f5', '#66bb6a', '#ffca28'],
                hoverBackgroundColor: ['#1e88e5', '#43a047', '#ffc107'],
            },
        ],
    };



    // Hero-блок: можно назвать «Welcome section» или «Overview»
    const renderHeroSection = () => (
        <Box
            sx={{
                borderRadius: 2,
                p: 3,
                mb: 3,
                mt: 0, // Устанавливаем верхний отступ в 0
                background: 'linear-gradient(90deg, #1976d2 0%, #512da8 100%)',
                color: '#fff',
                textAlign: 'center',
                boxShadow: '0px 4px 15px rgba(0,0,0,0.2)',
            }}
        >
            <Typography
                variant={isSmallScreen ? 'h5' : 'h4'}
                sx={{ fontWeight: 700, mb: 1, fontFamily: 'Poppins, sans-serif' }}
            >
                Welcome to Your Analytics Dashboard
            </Typography>
            <Typography
                variant="body1"
                sx={{ opacity: 0.9, mb: 2, fontFamily: 'Inter, sans-serif' }}
            >
                Get a quick overview of your projects and tasks.
            </Typography>
            <Button
                variant="contained"
                sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    backgroundColor: '#ffca28',
                    color: '#333',
                    '&:hover': {
                        backgroundColor: '#ffc107',
                    },
                }}
                onClick={() => window.alert('Go create a new project!')}
            >
                Create New Project
            </Button>
        </Box>
    );


    return (
        <Box
            sx={{
                p: 2,
                // Общий светлый фон
                backgroundColor: '#f5f5f5',
                minHeight: '100vh',
                fontFamily: 'Poppins, sans-serif',
            }}
        >
            {/* Hero Section */}
            {renderHeroSection()}

            {/* Основной контейнер для карточек и графиков */}
            <Grid container spacing={3}>
                {/* Левая часть (Cards + Doughnut) - займёт md=4, но можем менять */}
                <Grid item xs={12} md={4} order={{ xs: 2, md: 1 }}>
                    <Grid container spacing={3}>
                        {/* Карточка: Total Projects */}
                        <Grid item xs={12} sm={6} md={12}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 2,
                                    borderRadius: 3,
                                    mb: 1,
                                    // Лёгкий градиент в карточке
                                    background: 'linear-gradient(135deg, #e3f2fd 30%, #ede7f6 100%)',
                                    color: '#333',
                                    textAlign: 'center',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                }}
                            >
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#666' }}>
                                    Total Projects
                                </Typography>
                                <Typography variant="h3" sx={{ fontWeight: 800 }}>
                                    {analytics.totalProjects}
                                </Typography>
                            </Paper>
                        </Grid>

                        {/* Карточка: Total Tasks */}
                        <Grid item xs={12} sm={6} md={12}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 2,
                                    borderRadius: 3,
                                    mb: 1,
                                    background: 'linear-gradient(135deg, #e8f5e9 30%, #fffde7 100%)',
                                    color: '#333',
                                    textAlign: 'center',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                }}
                            >
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#666' }}>
                                    Total Tasks
                                </Typography>
                                <Typography variant="h3" sx={{ fontWeight: 800 }}>
                                    {analytics.totalTasks}
                                </Typography>
                            </Paper>
                        </Grid>

                        {/* Карточка: Completed Tasks */}
                        <Grid item xs={12}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 2,
                                    borderRadius: 3,
                                    background: 'linear-gradient(135deg, #ffecb3 30%, #fff9c4 100%)',
                                    color: '#333',
                                    textAlign: 'center',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                }}
                            >
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#666' }}>
                                    Completed Tasks
                                </Typography>
                                <Typography variant="h3" sx={{ fontWeight: 800 }}>
                                    {analytics.completedTasks}
                                </Typography>
                            </Paper>
                        </Grid>

                        {/* Doughnut: Task Distribution by Priority */}
                        <Grid item xs={12}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 2,
                                    borderRadius: 3,
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                    height: 280,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    background: 'linear-gradient(135deg, #fce4ec 0%, #f3e5f5 100%)',
                                }}
                            >
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        textAlign: 'center',
                                        fontWeight: 700,
                                        color: '#ad1457',
                                        mb: 1,
                                    }}
                                >
                                    Task Distribution by Priority
                                </Typography>
                                <Doughnut
                                    data={{
                                        labels: ['High', 'Medium', 'Low'],
                                        datasets: [
                                            {
                                                data: [30, 50, 20],
                                                backgroundColor: ['#ef5350', '#29b6f6', '#66bb6a'],
                                                hoverBackgroundColor: ['#e53935', '#039be5', '#43a047'],
                                            },
                                        ],
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: 'bottom',
                                                labels: {
                                                    font: {
                                                        size: 12,
                                                        family: 'Poppins',
                                                    },
                                                    color: '#333',
                                                    usePointStyle: true,
                                                    padding: 16,
                                                },
                                            },
                                        },
                                    }}
                                    style={{
                                        maxHeight: '200px',
                                        maxWidth: '200px',
                                        margin: '0 auto',
                                    }}
                                />
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Правая часть (Bar, Pie, Line) - займёт md=8 */}
                <Grid item xs={12} md={8} order={{ xs: 1, md: 2 }}>
                    {/* Бар: Tasks by Status (большая карточка) */}
                    <Paper
                        elevation={3}
                        sx={{
                            p: 2,
                            mb: 3,
                            borderRadius: 3,
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            background: '#fff',
                            height: 320,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography
                            variant="subtitle1"
                            sx={{
                                textAlign: 'center',
                                fontWeight: 700,
                                color: '#1976d2',
                                mb: 1,
                            }}
                        >
                            Tasks by Status
                        </Typography>
                        <Box sx={{ height: '100%' }}>
                            <Bar
                                data={{
                                    labels: ['Completed', 'In Progress', 'Backlog', 'On Hold', 'Cancelled'],
                                    datasets: [
                                        {
                                            label: 'Tasks by Status',
                                            data: [
                                                analytics.completedTasks,
                                                analytics.inProgressTasks,
                                                analytics.totalTasks -
                                                analytics.completedTasks -
                                                analytics.inProgressTasks,
                                                extraStatusCounts.onHold,
                                                extraStatusCounts.cancelled,
                                            ],
                                            backgroundColor: ['#66bb6a', '#29b6f6', '#ffa726', '#ab47bc', '#ef5350'],
                                            hoverBackgroundColor: ['#43a047', '#039be5', '#ff9800', '#8e24aa', '#e53935'],
                                        },
                                    ],
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    scales: {
                                        x: {
                                            ticks: { color: '#555' },
                                            grid: { display: false },
                                        },
                                        y: {
                                            ticks: { color: '#555' },
                                            grid: { color: 'rgba(200,200,200,0.2)' },
                                        },
                                    },
                                }}
                            />
                        </Box>
                    </Paper>

                    <Grid container spacing={3}>
                        {/* Pie: Projects Overview */}
                        <Grid item xs={12} md={6}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 2,
                                    borderRadius: 3,
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                    height: 240,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    background: '#fff',
                                }}
                            >
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        textAlign: 'center',
                                        fontWeight: 700,
                                        color: '#1976d2',
                                        mb: 1,
                                    }}
                                >
                                    Projects Overview
                                </Typography>
                                <Pie
                                    data={pieData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: 'bottom',
                                                labels: {
                                                    font: {
                                                        size: 12,
                                                        family: 'Poppins',
                                                    },
                                                    color: '#333',
                                                },
                                            },
                                        },
                                    }}
                                    style={{
                                        height: '140px',
                                        margin: '0 auto',
                                    }}
                                />
                            </Paper>
                        </Grid>

                        {/* Line: Task Completion Over Time */}
                        <Grid item xs={12} md={6}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 2,
                                    borderRadius: 3,
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                    height: 240,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    background: '#fff',
                                }}
                            >
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        textAlign: 'center',
                                        fontWeight: 700,
                                        color: '#1976d2',
                                        mb: 1,
                                    }}
                                >
                                    Task Completion Over Time
                                </Typography>
                                <Line
                                    data={{
                                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                                        datasets: [
                                            {
                                                label: 'Tasks Done',
                                                data: [10, 50, 30, 70, 40, 90],
                                                borderColor: '#1976d2',
                                                backgroundColor: 'rgba(25,118,210,0.2)',
                                                tension: 0.4,
                                                pointRadius: 4,
                                                pointHoverRadius: 6,
                                            },
                                        ],
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: { legend: { display: false } },
                                        scales: {
                                            x: {
                                                ticks: { color: '#555' },
                                                grid: { display: false },
                                            },
                                            y: {
                                                ticks: { color: '#555' },
                                                grid: { color: 'rgba(200,200,200,0.2)' },
                                            },
                                        },
                                    }}
                                    style={{
                                        height: '140px',
                                        margin: '0 auto',
                                    }}
                                />
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DashboardAnalytics;

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, Box } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { ThemeContextProvider } from './theme/ThemeContext';
import TopNavBar from './components/TopNavBar';
import SideNavBar from './components/SideNavBar';
import DashboardAnalytics from './components/DashboardAnalytics';

import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import TaskManagementPage from "./pages/TaskManagementPage";
import TasksByStatusPage from "./pages/TasksByStatusPage";
import GanttChartPage from "./pages/GanttChartPage";
import ProjectStatusReportPage from "./pages/ProjectStatusReportPage";
import TaskCompletionReportPage from "./pages/TaskCompletionReportPage";
import CalendarPage from "./pages/CalendarPage";
import NotificationList from "./components/NotificationList";
import ActivityBoardPage from "./pages/ActivityBoardPage";
import UserProfilePage from "./pages/UserProfilePage";
import KanbanBoardPage from "./pages/KanbanBoardPage";
import AssignProjectsPage from "./pages/AssignProjectsPage";
import AuthChoice from "./pages/AuthChoice";
import RegisterForm from "./pages/RegisterForm";
import LoginForm from "./pages/LoginForm";
import ReportsPage from "./pages/ReportsPage";
const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const theme = createTheme({
        palette: {
            primary: { main: '#4caf50' },
            secondary: { main: '#64b5f6' },
            background: { default: '#f0f4f8' },
            text: { primary: '#333', secondary: '#555' },
        },
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) setIsAuthenticated(true);
    }, []);

    return (
        <ThemeContextProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline />

                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    {/* TopNavBar */}
                    {isAuthenticated && (
                        <Box
                            sx={{
                                height: '64px',
                                width: '100%',
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                zIndex: 1201,
                                backgroundColor: '#1976d2',
                            }}
                        >
                            <TopNavBar onLogout={() => setIsAuthenticated(false)} />
                        </Box>
                    )}

                    {/* Layout for SideNavBar and main content */}
                    <Box sx={{ display: 'flex', flex: 1, marginTop: '64px' }}>
                        {/* SideNavBar */}
                        {isAuthenticated && (
                            <Box
                                sx={{
                                    width: '250px',
                                    height: 'calc(100vh - 64px)',
                                    position: 'fixed',
                                    top: '64px',
                                    left: 0,
                                    backgroundColor: '#1e88e5',
                                    zIndex: 1200,
                                }}
                            >
                                <SideNavBar />
                            </Box>
                        )}

                        {/* Main Content */}
                        <Box
                            sx={{
                                flex: 1,
                                marginLeft: isAuthenticated ? '250px' : '0px',
                                padding: '24px',
                                overflowY: 'auto',
                                backgroundColor: '#f5f5f5',
                            }}
                        >
                            <Routes>
                                {isAuthenticated ? (
                                    <>
                                        <Route path="/" element={<Navigate to="/dashboard" />} />
                                        <Route path="/dashboard" element={<DashboardAnalytics />} />
                                        <Route path="/projects" element={<ProjectsPage />} />
                                        <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
                                        <Route path="/task-management" element={<TaskManagementPage />} />
                                        <Route path="/assign-projects" element={<AssignProjectsPage />} />
                                        <Route path="/kanban-board" element={<KanbanBoardPage />} />
                                        <Route path="/tasks/status/:status" element={<TasksByStatusPage />} />
                                        <Route path="/profile" element={<UserProfilePage />} />
                                        <Route path="/gantt-chart" element={<GanttChartPage />} />
                                        <Route path="/activity-board" element={<ActivityBoardPage />} />
                                        <Route path="/reports/projects" element={<ProjectStatusReportPage />} />
                                        <Route path="/reports/tasks" element={<TaskCompletionReportPage />} />
                                        <Route path="/calendar" element={<CalendarPage />} />
                                        <Route path="/notifications" element={<NotificationList />} />
                                        <Route path="/reports" element={<ReportsPage />} />
                                    </>
                                ) : (
                                    <>
                                        <Route path="/" element={<Navigate to="/auth" />} />
                                        <Route path="/auth" element={<AuthChoice />} />
                                        <Route path="/register" element={<RegisterForm setIsAuthenticated={setIsAuthenticated} />} />
                                        <Route path="/login" element={<LoginForm setIsAuthenticated={setIsAuthenticated} />} />
                                    </>
                                )}
                            </Routes>
                        </Box>
                    </Box>
                </Box>

            </ThemeProvider>
        </ThemeContextProvider>
    );
};

export default App;


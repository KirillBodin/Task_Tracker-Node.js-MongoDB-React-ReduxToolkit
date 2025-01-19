import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Box,
    List,
    ListItemText,
    Collapse,
    ListItemIcon,
    Avatar,
    Typography,
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import TaskIcon from '@mui/icons-material/Task';
import DoneIcon from '@mui/icons-material/Done';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import LoopIcon from '@mui/icons-material/Loop';
import RateReviewIcon from '@mui/icons-material/RateReview';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ListIcon from '@mui/icons-material/List';
import TimelineIcon from '@mui/icons-material/Timeline';
import ActivityIcon from '@mui/icons-material/List'; // Icon for Activity Board
import axios from 'axios';

const SideNavBar = () => {
    const location = useLocation();
    const [openTasks, setOpenTasks] = useState(false);
    const [user, setUser] = useState({ username: '', profilePicture: '' });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/api/user/profile');
                setUser({
                    username: response.data.username,
                    profilePicture: response.data.profilePicture || 'https://via.placeholder.com/40x40',
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleTasksToggle = () => setOpenTasks(!openTasks);

    const isActive = (path) => location.pathname.startsWith(path);

    const navItemStyles = (active) => ({
        display: 'flex',
        alignItems: 'center',
        px: 2,
        py: 1,
        cursor: 'pointer',
        borderRadius: 2,
        mb: 0.5,
        backgroundColor: active ? '#ffca28' : 'transparent',
        color: active ? '#333' : '#fff',
        fontWeight: active ? 600 : 400,
        '&:hover': {
            backgroundColor: active ? '#ffc107' : 'rgba(255, 255, 255, 0.2)',
        },
    });

    return (
        <Box
            sx={{
                width: 250,
                height: 'calc(100vh - 64px)',
                position: 'fixed',
                top: 64,
                left: 0,
                background: 'linear-gradient(180deg, #1976d2 0%, #512da8 100%)',
                color: '#fff',
                overflowY: 'auto',
                fontFamily: 'Poppins, sans-serif',
                py: 2,
                boxShadow: '0 0 10px rgba(0,0,0,0.3)',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    px: 2,
                    mb: 2,
                }}
            >
                <Avatar
                    src={user.profilePicture}
                    alt="User Avatar"
                    sx={{ width: 40, height: 40, mr: 1 }}
                />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {user.username || 'Loading...'}
                </Typography>
            </Box>

            <List component="nav" sx={{ px: 1 }}>
                <Box component={Link} to="/dashboard" sx={navItemStyles(isActive('/dashboard'))}>
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Analytics Dashboard" />
                </Box>

                <Box component={Link} to="/projects" sx={navItemStyles(isActive('/projects'))}>
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                        <BarChartIcon />
                    </ListItemIcon>
                    <ListItemText primary="All Projects" />
                </Box>

                <Box onClick={handleTasksToggle} sx={{ ...navItemStyles(false), justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ListItemIcon sx={{ color: '#fff', minWidth: 36 }}>
                            <TaskIcon />
                        </ListItemIcon>
                        <ListItemText primary="Tasks" />
                    </Box>
                    {openTasks ? <ExpandLess /> : <ExpandMore />}
                </Box>

                <Collapse in={openTasks} timeout="auto" unmountOnExit>
                    <Box sx={{ pl: 4 }}>
                        <Box
                            component={Link}
                            to="/tasks/status/All"
                            sx={navItemStyles(isActive('/tasks/status/All'))}
                        >
                            <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                                <ListIcon />
                            </ListItemIcon>
                            <ListItemText primary="All Tasks" />
                        </Box>
                        <Box
                            component={Link}
                            to="/tasks/status/Backlog"
                            sx={navItemStyles(isActive('/tasks/status/Backlog'))}
                        >
                            <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                                <AssignmentLateIcon />
                            </ListItemIcon>
                            <ListItemText primary="Backlog" />
                        </Box>
                        <Box
                            component={Link}
                            to="/tasks/status/In_Progress"
                            sx={navItemStyles(isActive('/tasks/status/In_Progress'))}
                        >
                            <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                                <LoopIcon />
                            </ListItemIcon>
                            <ListItemText primary="In Progress" />
                        </Box>
                        <Box
                            component={Link}
                            to="/tasks/status/Done"
                            sx={navItemStyles(isActive('/tasks/status/Done'))}
                        >
                            <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                                <DoneIcon />
                            </ListItemIcon>
                            <ListItemText primary="Done" />
                        </Box>
                        <Box
                            component={Link}
                            to="/tasks/status/Review"
                            sx={navItemStyles(isActive('/tasks/status/Review'))}
                        >
                            <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                                <RateReviewIcon />
                            </ListItemIcon>
                            <ListItemText primary="Review" />
                        </Box>
                    </Box>
                </Collapse>

                <Box component={Link} to="/kanban-board" sx={navItemStyles(isActive('/kanban-board'))}>
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                        <ViewKanbanIcon />
                    </ListItemIcon>
                    <ListItemText primary="Kanban Board" />
                </Box>

                <Box component={Link} to="/calendar" sx={navItemStyles(isActive('/calendar'))}>
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                        <CalendarTodayIcon />
                    </ListItemIcon>
                    <ListItemText primary="Calendar" />
                </Box>

                <Box component={Link} to="/gantt-chart" sx={navItemStyles(isActive('/gantt-chart'))}>
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                        <TimelineIcon />
                    </ListItemIcon>
                    <ListItemText primary="Gantt Chart" />
                </Box>

                <Box component={Link} to="/activity-board" sx={navItemStyles(isActive('/activity-board'))}>
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                        <ActivityIcon />
                    </ListItemIcon>
                    <ListItemText primary="Activity Board" />
                </Box>

                <Box component={Link} to="/notifications" sx={navItemStyles(isActive('/notifications'))}>
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                        <NotificationsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Notifications" />
                </Box>

                <Box component={Link} to="/reports" sx={navItemStyles(isActive('/reports'))}>
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                        <BarChartIcon />
                    </ListItemIcon>
                    <ListItemText primary="Reports" />
                </Box>
            </List>
        </Box>
    );
};

export default SideNavBar;

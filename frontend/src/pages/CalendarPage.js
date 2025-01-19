import React, { useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchTasks } from '../redux/taskSlice';
import { fetchProjects } from '../redux/projectSlice';
import { fetchUsers, fetchUserProfile } from '../redux/userSlice';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import moment from 'moment';
import { Box, Typography, Paper, FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@mui/material';
import { ThemeContext } from '../theme/ThemeContext';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

const generateRandomColor = () => {
    const colors = ['#2d2d86', '#5c007a', '#4caf50', '#3e2723', '#607d8b', '#b71c1c', '#ff6f00', '#009688'];
    return colors[Math.floor(Math.random() * colors.length)];
};

const CalendarPage = () => {
    const dispatch = useDispatch();
    const tasks = useSelector((state) => state.tasks.tasks);
    const projects = useSelector((state) => state.projects.projects);
    const users = useSelector((state) => state.user.users);
    const [events, setEvents] = useState([]);
    const { theme } = useContext(ThemeContext);
    const [filter, setFilter] = useState('all');
    const [selectedUser, setSelectedUser] = useState('all');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [appliedFilter, setAppliedFilter] = useState('all');
    const [appliedUser, setAppliedUser] = useState('all');
    const [appliedStartDate, setAppliedStartDate] = useState(null);
    const [appliedEndDate, setAppliedEndDate] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchTasks());
        dispatch(fetchProjects());
        dispatch(fetchUsers());
        dispatch(fetchUserProfile());
    }, [dispatch]);

    useEffect(() => {
        let taskEvents = [];
        let projectEvents = [];

        if (appliedFilter === 'all' || appliedFilter === 'tasks') {
            taskEvents = tasks.filter(task => {
                if (appliedUser !== 'all' && task.assignedTo !== appliedUser) return false;
                const taskStart = moment(task.startDate);
                const taskEnd = moment(task.endDate);
                if (appliedStartDate && taskStart.isBefore(moment(appliedStartDate), 'day')) return false;
                if (appliedEndDate && taskEnd.isAfter(moment(appliedEndDate), 'day')) return false;
                return true;
            }).map(task => ({
                title: task.title,
                start: moment(task.startDate).format(),
                end: moment(task.endDate).format(),
                backgroundColor: generateRandomColor(),
                borderColor: generateRandomColor(),
                resourceType: 'task',
                allDay: false,
            }));
        }

        if (appliedFilter === 'all' || appliedFilter === 'projects') {
            projectEvents = projects.filter(project => {
                if (!project.developer) return false;
                if (appliedUser !== 'all' && project.developer._id.toString() !== appliedUser) return false;
                const projectStart = moment(project.startDate);
                const projectEnd = moment(project.endDate);
                if (appliedStartDate && projectStart.isBefore(moment(appliedStartDate), 'day')) return false;
                if (appliedEndDate && projectEnd.isAfter(moment(appliedEndDate), 'day')) return false;
                return true;
            }).map(project => ({
                title: project.title,
                start: moment(project.startDate).format(),
                end: moment(project.endDate).format(),
                backgroundColor: generateRandomColor(),
                borderColor: generateRandomColor(),
                resourceType: 'project',
                allDay: false,
            }));
        }

        setEvents([...taskEvents, ...projectEvents]);
    }, [tasks, projects, appliedFilter, appliedUser, appliedStartDate, appliedEndDate]);

    const applyFilters = () => {
        setAppliedFilter(filter);
        setAppliedUser(selectedUser);
        setAppliedStartDate(startDate);
        setAppliedEndDate(endDate);
    };

    const handleEventClick = (clickInfo) => {
        if (clickInfo.event.extendedProps.resourceType === 'task') {
            navigate(`/tasks/${clickInfo.event.extendedProps.resourceId}`);
        } else if (clickInfo.event.extendedProps.resourceType === 'project') {
            navigate(`/projects/${clickInfo.event.extendedProps.resourceId}`);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <Box
                sx={{
                    p: 4,
                    background: theme === 'dark' ? 'linear-gradient(to bottom, #303030, #424242)' : 'linear-gradient(to bottom, #e3f2fd, #ffffff)',
                    minHeight: '100vh',
                }}
            >
                <Box
                    sx={{
                        textAlign: 'center',
                        mb: 4,
                        borderRadius: 2,
                        p: 3,
                        background: 'linear-gradient(90deg, #1976d2 0%, #512da8 100%)',
                        color: '#fff',
                        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                    }}
                >
                    <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'Poppins, sans-serif', mb: 1 }}>
                        Calendar Overview
                    </Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'Inter, sans-serif', opacity: 0.9 }}>
                        Manage and visualize your tasks and projects with ease.
                    </Typography>
                </Box>

                <Box
                    sx={{
                        mb: 4,
                        p: 3,
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 3,
                        background: theme === 'dark' ? '#424242' : '#fff',
                        borderRadius: 2,
                        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <FormControl sx={{ minWidth: 150 }}>
                        <InputLabel>Filter</InputLabel>
                        <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="tasks">Tasks</MenuItem>
                            <MenuItem value="projects">Projects</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 150 }}>
                        <InputLabel>Assigned To</InputLabel>
                        <Select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                            <MenuItem value="all">All Users</MenuItem>
                            {users.map(user => (
                                <MenuItem key={user._id} value={user._id}>
                                    {user.username}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={setStartDate}
                        renderInput={(params) => <TextField {...params} />}
                    />

                    <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={setEndDate}
                        renderInput={(params) => <TextField {...params} />}
                    />

                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#ffca28',
                            color: '#333',
                            fontWeight: 600,
                            textTransform: 'none',
                            '&:hover': { backgroundColor: '#ffc107' },
                        }}
                        onClick={applyFilters}
                    >
                        Apply Filters
                    </Button>
                </Box>

                <Paper
                    elevation={3}
                    sx={{
                        p: 3,
                        borderRadius: 2,
                        background: theme === 'dark' ? '#303030' : '#fff',
                    }}
                >
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
                        initialView="dayGridMonth"
                        events={events}
                        eventClick={handleEventClick}
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,listWeek,listDay',
                        }}
                        height="75vh"
                        eventContent={(eventInfo) => (
                            <div
                                style={{
                                    padding: '5px',
                                    borderRadius: '5px',
                                    backgroundColor: eventInfo.event.backgroundColor,
                                    color: '#fff',
                                    textAlign: 'center',
                                }}
                            >
                                <b>{eventInfo.timeText}</b>
                                <div>{eventInfo.event.title}</div>
                            </div>
                        )}
                        themeSystem="standard"
                    />
                </Paper>
            </Box>
        </LocalizationProvider>
    );
};

export default CalendarPage;

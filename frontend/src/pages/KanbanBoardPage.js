import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchTasks, updateTask } from '../redux/taskSlice';
import { fetchProjects } from '../redux/projectSlice';
import TaskCard from '../components/TaskCard';
import { Box, Grid, Typography, Select, MenuItem, Paper, Button } from '@mui/material';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemTypes = {
    TASK: 'task',
};

const DraggableTaskCard = ({ task, onTaskClick }) => {
    const [, ref] = useDrag({
        type: ItemTypes.TASK,
        item: { id: task._id, status: task.status },
    });

    return (
        <Paper
            ref={ref}
            elevation={3}
            sx={{
                padding: 1.5,
                mb: 1.5,
                borderRadius: 2,
                backgroundColor: '#fff',
                cursor: 'pointer',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                },
            }}
            onClick={() => onTaskClick(task._id)}
        >
            <TaskCard task={task} />
        </Paper>
    );
};

const DroppableColumn = ({ status, tasks, onDropTask, color, onTaskClick }) => {
    const [, ref] = useDrop({
        accept: ItemTypes.TASK,
        drop: (item) => onDropTask(item.id, status),
    });

    return (
        <Box
            ref={ref}
            sx={{
                minHeight: '250px',
                background: color,
                padding: 2,
                borderRadius: 3,
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                    transform: 'scale(1.01)',
                    boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)',
                },
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    color: '#fff',
                    fontWeight: 700,
                    textAlign: 'center',
                    mb: 2,
                }}
            >
                {status.replace('_', ' ')}
            </Typography>
            {tasks.map((task) => (
                <DraggableTaskCard key={task._id} task={task} onTaskClick={onTaskClick} />
            ))}
        </Box>
    );
};

const KanbanBoardPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const tasks = useSelector((state) => state.tasks.tasks);
    const projects = useSelector((state) => state.projects.projects);
    const [selectedProject, setSelectedProject] = useState('');
    const [statuses, setStatuses] = useState(['Backlog', 'In_progress', 'Review', 'Done']);

    useEffect(() => {
        dispatch(fetchTasks());
        dispatch(fetchProjects());
    }, [dispatch]);

    const filteredTasks = selectedProject
        ? tasks.filter((task) => task.project && task.project._id === selectedProject)
        : tasks;

    const handleProjectChange = (event) => {
        setSelectedProject(event.target.value);
    };

    const handleDropTask = (taskId, newStatus) => {
        const task = tasks.find((task) => task._id === taskId);
        if (task) {
            const updatedTask = { ...task, status: newStatus };
            dispatch(updateTask({ id: task._id, updatedTask }));
        }
    };

    const handleTaskClick = (taskId) => {
        navigate(`/tasks/${taskId}`);
    };

    const handleAddCategory = () => {
        const newCategory = prompt('Enter the name of the new category:');
        if (newCategory && !statuses.includes(newCategory)) {
            setStatuses([...statuses, newCategory]);
        }
    };

    const statusColors = {
        Backlog: 'linear-gradient(135deg, #f57c00, #ffa726)',
        In_progress: 'linear-gradient(135deg, #1976d2, #42a5f5)',
        Review: 'linear-gradient(135deg, #6a1b9a, #ab47bc)',
        Done: 'linear-gradient(135deg, #2e7d32, #66bb6a)',
    };

    const tasksByStatus = statuses.reduce((acc, status) => {
        acc[status] = filteredTasks.filter((task) => task.status === status);
        return acc;
    }, {});

    return (
        <DndProvider backend={HTML5Backend}>
            <Box
                sx={{
                    p: 4,
                    backgroundColor: '#f5f5f5',
                    minHeight: '100vh',
                    fontFamily: 'Poppins, sans-serif',
                }}
            >
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
                    <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>
                        Kanban Board
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9, fontFamily: 'Inter, sans-serif' }}>
                        Organize and track your tasks efficiently.
                    </Typography>
                </Box>

                {/* Add Category Button */}
                <Button
                    variant="contained"
                    sx={{
                        mb: 3,
                        backgroundColor: '#ffca28',
                        color: '#333',
                        fontWeight: 600,
                        textTransform: 'none',
                        '&:hover': { backgroundColor: '#ffc107' },
                    }}
                    onClick={handleAddCategory}
                >
                    Add Category
                </Button>

                {/* Project Selector */}
                <Select
                    value={selectedProject}
                    onChange={handleProjectChange}
                    displayEmpty
                    fullWidth
                    sx={{
                        mb: 4,
                        background: '#fff',
                        borderRadius: 2,
                        padding: 1,
                        '& .MuiSelect-select': {
                            padding: '10px',
                        },
                    }}
                >
                    <MenuItem value="">
                        <em>Select Project</em>
                    </MenuItem>
                    {projects.map((project) => (
                        <MenuItem key={project._id} value={project._id}>
                            {project.title}
                        </MenuItem>
                    ))}
                </Select>

                {/* Kanban Columns */}
                <Grid container spacing={3}>
                    {statuses.map((status) => (
                        <Grid item xs={12} sm={6} md={3} key={status}>
                            <DroppableColumn
                                status={status}
                                tasks={tasksByStatus[status] || []}
                                onDropTask={handleDropTask}
                                color={statusColors[status] || 'linear-gradient(135deg, #424242, #616161)'}
                                onTaskClick={handleTaskClick}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </DndProvider>
    );
};

export default KanbanBoardPage;

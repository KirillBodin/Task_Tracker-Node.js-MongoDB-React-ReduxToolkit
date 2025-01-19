import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, addProject } from '../redux/projectSlice';
import { fetchUsers } from '../redux/userSlice';
import {
    Box,
    Typography,
    Grid,
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ProjectsPage = () => {
    const dispatch = useDispatch();
    const projects = useSelector((state) => state.projects.projects);
    const users = useSelector((state) => state.user.users);
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [developer, setDeveloper] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');
    const [selectedUser, setSelectedUser] = useState('');

    useEffect(() => {
        dispatch(fetchProjects());
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleCreateProject = () => {
        dispatch(
            addProject({
                title,
                description,
                startDate,
                endDate,
                developer: developer._id || developer,
            })
        );
        setOpen(false);
    };

    const filteredProjects = projects.filter((project) => {
        if (searchQuery && !project.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        if (selectedUser && project.developer !== selectedUser) return false;
        const projectStart = new Date(project.startDate);
        const projectEnd = new Date(project.endDate);
        if (filterStartDate && projectStart < new Date(filterStartDate)) return false;
        if (filterEndDate && projectEnd > new Date(filterEndDate)) return false;
        return true;
    });

    return (
        <Box
            sx={{
                p: 4,
                backgroundColor: '#f5f5f5',
                minHeight: '100vh',
                fontFamily: 'Poppins, sans-serif',
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
                    boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)',
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>
                    Projects
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, fontFamily: 'Inter, sans-serif' }}>
                    Manage your projects and developers effectively.
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                <TextField
                    label="Search Projects"
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ flex: 1, background: '#fff', borderRadius: 2 }}
                />
                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>Developer</InputLabel>
                    <Select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                        <MenuItem value="">All Developers</MenuItem>
                        {users.map((user) => (
                            <MenuItem key={user._id} value={user._id}>
                                {user.username}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Start Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={filterStartDate}
                    onChange={(e) => setFilterStartDate(e.target.value)}
                    sx={{ background: '#fff', borderRadius: 2 }}
                />
                <TextField
                    label="End Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={filterEndDate}
                    onChange={(e) => setFilterEndDate(e.target.value)}
                    sx={{ background: '#fff', borderRadius: 2 }}
                />
            </Box>

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
                onClick={handleClickOpen}
            >
                Add Project
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add a New Project</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Project Title"
                        type="text"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Project Description"
                        type="text"
                        fullWidth
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Start Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="End Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Developer</InputLabel>
                        <Select
                            value={developer}
                            onChange={(e) => setDeveloper(e.target.value)}
                        >
                            <MenuItem value="">Not Assigned</MenuItem>
                            {users.map((user) => (
                                <MenuItem key={user._id} value={user._id}>
                                    {user.username}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} sx={{ color: '#1976d2' }}>
                        Cancel
                    </Button>
                    <Button onClick={handleCreateProject} variant="contained" sx={{ backgroundColor: '#ffca28', color: '#333' }}>
                        Add Project
                    </Button>
                </DialogActions>
            </Dialog>

            <Grid container spacing={3}>
                {filteredProjects.map((project) => {
                    const assignedDeveloper = users.find(
                        (user) =>
                            user._id === project.developer?._id || project.developer
                    );
                    return (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={project._id}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 2,
                                    borderRadius: 3,
                                    background: 'linear-gradient(90deg, #1976d2 0%, #512da8 100%)',
                                    color: '#fff',
                                    '&:hover': {
                                        background: 'linear-gradient(90deg, #1565c0 0%, #4527a0 100%)',
                                        cursor: 'pointer',
                                    },
                                    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                        boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.2)',
                                    },
                                }}
                                onClick={() => navigate(`/projects/${project._id}`)}
                            >
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                                    {project.title}
                                </Typography>
                                <Typography sx={{ mb: 1 }}>
                                    {project.description}
                                </Typography>
                                <Typography sx={{ fontSize: '0.875rem' }}>
                                    Start Date: {new Date(project.startDate).toLocaleDateString()}
                                </Typography>
                                <Typography sx={{ fontSize: '0.875rem' }}>
                                    End Date: {new Date(project.endDate).toLocaleDateString()}
                                </Typography>
                                <Typography sx={{ fontSize: '0.875rem' }}>
                                    Developer: {assignedDeveloper?.username || 'Not Assigned'}
                                </Typography>
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
};

export default ProjectsPage;

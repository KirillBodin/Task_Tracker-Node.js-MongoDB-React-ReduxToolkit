import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActivities } from '../redux/activitySlice';
import { Box, Typography, List, ListItem, ListItemText, Paper, TextField, Pagination } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';

const ActivityBoardPage = () => {
    const dispatch = useDispatch();
    const { activities, status, error } = useSelector((state) => state.activities);

    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchActivities());
        }
    }, [dispatch, status]);

    const filterActivities = (activity) => {
        const userMatch = activity.user.username.toLowerCase().includes(searchTerm.toLowerCase());
        const actionMatch = activity.action.toLowerCase().includes(searchTerm.toLowerCase());
        const detailsMatch = activity.details.toLowerCase().includes(searchTerm.toLowerCase());
        return userMatch || actionMatch || detailsMatch;
    };

    const filterByDate = (activity) => {
        if (!dateFilter) return true;
        const activityDate = new Date(activity.createdAt);
        const selectedDate = new Date(dateFilter);
        return activityDate >= selectedDate;
    };

    const filteredActivities = activities.filter(filterActivities).filter(filterByDate);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentActivities = filteredActivities.slice(indexOfFirstItem, indexOfLastItem);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleDateFilterChange = (event) => {
        setDateFilter(event.target.value);
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    if (status === 'loading') {
        return <Typography>Loading...</Typography>;
    }

    if (status === 'failed') {
        return <Typography color="error">Error: {error}</Typography>;
    }

    if (!activities || activities.length === 0) {
        return <Typography>No activities found.</Typography>;
    }

    return (
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
                    Activity Board
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, fontFamily: 'Inter, sans-serif' }}>
                    View and track recent activities in your system.
                </Typography>
            </Box>

            {/* Filters Section */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                <TextField
                    label="Search by username, action, or task"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    fullWidth
                    sx={{
                        flex: 1,
                        background: '#fff',
                        borderRadius: 2,
                    }}
                />
                <TextField
                    label="Filter by date"
                    type="date"
                    value={dateFilter}
                    onChange={handleDateFilterChange}
                    fullWidth
                    sx={{
                        flex: 1,
                        background: '#fff',
                        borderRadius: 2,
                    }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </Box>

            {/* Activities List */}
            <List>
                {currentActivities.map((activity) => (
                    <React.Fragment key={activity._id}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 2,
                                mb: 3,
                                borderRadius: 2,
                                background: 'linear-gradient(135deg, #e3f2fd 30%, #ede7f6 100%)',
                                color: '#333',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #bbdefb 30%, #d1c4e9 100%)',
                                    cursor: 'pointer',
                                    transform: 'scale(1.02)',
                                    boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)',
                                },
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            }}
                        >
                            <ListItem alignItems="flex-start">
                                <ListItemText
                                    primary={
                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: 700, color: '#1976d2' }}
                                        >
                                            {`${activity.user.username || 'Unknown User'} (ID: ${activity.user._id}) ${activity.action}`}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body2" sx={{ color: '#616161' }}>
                                            {`${activity.details} - ${formatDistanceToNow(new Date(activity.createdAt))} ago`}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        </Paper>
                    </React.Fragment>
                ))}
            </List>

            {/* Pagination */}
            <Pagination
                count={Math.ceil(filteredActivities.length / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}
            />
        </Box>
    );
};

export default ActivityBoardPage;

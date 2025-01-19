import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markNotificationAsRead } from '../redux/notificationSlice';
import { Box, Typography, Paper, IconButton } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FiberNewIcon from '@mui/icons-material/FiberNew';

const NotificationList = () => {
    const dispatch = useDispatch();
    const notifications = useSelector((state) => state.notifications.items);

    useEffect(() => {
        dispatch(fetchNotifications());
    }, [dispatch]);

    if (!notifications || notifications.length === 0) {
        return (
            <Typography
                sx={{
                    textAlign: 'center',
                    color: '#757575',
                    fontSize: '1.2rem',
                    mt: 4,
                }}
            >
                No notifications found.
            </Typography>
        );
    }

    return (
        <Box
            sx={{
                padding: 4,
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
                    Notifications
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, fontFamily: 'Inter, sans-serif' }}>
                    Stay updated with recent activities and alerts.
                </Typography>
            </Box>

            {/* Notifications List */}
            {notifications.map((notification) => (
                <Paper
                    key={notification._id}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 2,
                        mb: 3,
                        borderRadius: 2,
                        background: notification.read
                            ? 'linear-gradient(135deg, #e0e0e0 30%, #f5f5f5 90%)'
                            : 'linear-gradient(135deg, #1976d2 30%, #42a5f5 90%)',
                        color: notification.read ? '#616161' : '#fff',
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)',
                        },
                    }}
                >
                    {/* Notification Content */}
                    <Box sx={{ flex: 1 }}>
                        <Typography
                            variant="body1"
                            sx={{
                                fontWeight: notification.read ? 'normal' : 'bold',
                                mb: 0.5,
                            }}
                        >
                            {notification.message}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                color: notification.read ? '#757575' : '#e3f2fd',
                                display: 'block',
                            }}
                        >
                            {notification.timestamp
                                ? new Date(notification.timestamp).toLocaleString()
                                : 'No Date Available'}
                        </Typography>
                    </Box>

                    {/* Action Icon */}
                    {!notification.read ? (
                        <IconButton
                            onClick={() => dispatch(markNotificationAsRead(notification._id))}
                            sx={{
                                color: '#fff',
                                backgroundColor: '#43a047',
                                '&:hover': {
                                    backgroundColor: '#2e7d32',
                                },
                                ml: 2,
                                p: 1.5,
                            }}
                        >
                            <CheckCircleOutlineIcon />
                        </IconButton>
                    ) : (
                        <IconButton
                            disabled
                            sx={{
                                color: '#9e9e9e',
                                backgroundColor: '#e0e0e0',
                                ml: 2,
                                p: 1.5,
                            }}
                        >
                            <FiberNewIcon />
                        </IconButton>
                    )}
                </Paper>
            ))}
        </Box>
    );
};

export default NotificationList;

import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Example icons
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

const TopNavBar = ({ onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        onLogout();
        navigate('/auth');
    };

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const handleNotificationsClick = () => {
        console.log('Notifications clicked');
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                background: 'linear-gradient(90deg, #1976d2 0%, #512da8 100%)',
                color: '#fff',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                zIndex: 1201, // Ensures it is above the SideNavBar
            }}
        >
            <Toolbar sx={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                {/* Logo and tagline */}
                <Box
                    sx={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', mr: 2 }}
                    onClick={() => navigate('/dashboard')}
                >
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Task Tracker
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.8rem' }}>
                        Plan. Execute. Succeed.
                    </Typography>
                </Box>

                {/* Spacer */}
                <Box sx={{ flexGrow: 1 }} />

                {/* Notifications */}
                <IconButton onClick={handleNotificationsClick} sx={{ color: '#fff', mr: 1 }}>
                    <NotificationsIcon />
                </IconButton>

                {/* Profile */}
                <IconButton onClick={handleProfileClick} sx={{ color: '#fff', mr: 1 }}>
                    <AccountCircleIcon />
                </IconButton>

                {/* Logout */}
                <IconButton onClick={handleLogout} sx={{ color: '#fff' }}>
                    <LogoutIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default TopNavBar;

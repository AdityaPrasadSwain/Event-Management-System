// Professional Profile Page
// Universal profile page for all user roles

import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    TextField,
    Button,
    Avatar,
    Tabs,
    Tab,
    Divider,
    IconButton,
    Alert,
    Chip,
    Card,
    CardContent,
    Switch,
    FormControlLabel,
} from '@mui/material';
import {
    Edit as EditIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    PhotoCamera as PhotoCameraIcon,
    Lock as LockIcon,
    Person as PersonIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Business as BusinessIcon,
    Settings,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import ImageUpload from '../../components/common/ImageUpload';
import PageHeader from '../../components/common/PageHeader';

const Profile = () => {
    const { user, refreshUser } = useAuth();
    const [activeTab, setActiveTab] = useState(0);
    const [editing, setEditing] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    // Profile form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        organizationName: '',
        bio: '',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/user/profile');
                const profileData = response.data;
                setFormData({
                    name: profileData.name || '',
                    email: profileData.email || '',
                    phone: profileData.phone || '',
                    organizationName: profileData.organizationName || '',
                    bio: profileData.bio || '',
                });
                // Also update user context with full data if needed
                refreshUser(profileData);
            } catch (err) {
                console.error("Failed to fetch profile", err);
                setError("Failed to load profile data");
            }
        };

        if (user) {
            fetchProfile();
        }
    }, [user?.email]);

    // Password form state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setEditing(false);
        setSuccess('');
        setError('');
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSaveProfile = async () => {
        try {
            setError('');
            setSuccess('');

            const response = await api.put('/user/profile', formData);

            // Update local state and context
            refreshUser(response.data);

            setSuccess('Profile updated successfully!');
            setEditing(false);

            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        }
    };

    const handleChangePassword = async () => {
        try {
            setError('');
            setSuccess('');

            if (passwordData.newPassword !== passwordData.confirmPassword) {
                setError('Passwords do not match');
                return;
            }

            if (passwordData.newPassword.length < 6) {
                setError('Password must be at least 6 characters');
                return;
            }

            await api.put('/user/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });

            setSuccess('Password changed successfully!');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });

            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change password');
        }
    };

    const handleAvatarUpload = async (file) => {
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            setError('File size exceeds 2MB limit');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await api.post('/user/upload-profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const newImageUrl = response.data.url;
            refreshUser({ ...user, profileImage: newImageUrl });

            setSuccess('Profile photo updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Upload error:', err);
            setError(err.response?.data?.message || 'Failed to upload profile photo');
        }
    };

    // Get role color
    const getRoleColor = () => {
        const roleColors = {
            ADMIN: 'error',
            ORGANIZER: 'secondary',
            USER: 'primary',
        };
        return roleColors[user?.role] || 'default';
    };

    return (
        <Box>
            {/* Page Header */}
            <PageHeader
                title="My Profile"
                subtitle="Manage your account settings and preferences"
            />

            {/* Success/Error Messages */}
            {success && (
                <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
                    {success}
                </Alert>
            )}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* Left Sidebar - Profile Card */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        {/* Avatar */}
                        <Box sx={{ mb: 2 }}>
                            <ImageUpload
                                onUpload={handleAvatarUpload}
                                value={user?.profileImage}
                                isAvatar={true}
                                title=""
                                maxSizeMB={2}
                            />
                        </Box>

                        {/* User Info */}
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            {user?.name || 'User'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            {user?.email || 'user@example.com'}
                        </Typography>

                        <Chip
                            label={user?.role || 'USER'}
                            color={getRoleColor()}
                            size="small"
                            sx={{ mt: 2, fontWeight: 600 }}
                        />

                        <Divider sx={{ my: 3 }} />

                        {/* Quick Stats */}
                        <Card variant="outlined" sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography variant="caption" color="text.secondary">
                                    Member Since
                                </Typography>
                                <Typography variant="body2" fontWeight="bold">
                                    January 2024
                                </Typography>
                            </CardContent>
                        </Card>

                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="caption" color="text.secondary">
                                    Account Status
                                </Typography>
                                <Typography variant="body2" fontWeight="bold" color="success.main">
                                    Active
                                </Typography>
                            </CardContent>
                        </Card>
                    </Paper>
                </Grid>

                {/* Right Content - Tabs */}
                <Grid item xs={12} md={8}>
                    <Paper>
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}
                        >
                            <Tab icon={<PersonIcon />} label="Personal Info" iconPosition="start" />
                            <Tab icon={<LockIcon />} label="Security" iconPosition="start" />
                            <Tab icon={<Settings />} label="Preferences" iconPosition="start" />
                        </Tabs>

                        <Box sx={{ p: 3 }}>
                            {/* Personal Info Tab */}
                            {activeTab === 0 && (
                                <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                        <Typography variant="h6" fontWeight="bold">
                                            Personal Information
                                        </Typography>
                                        {!editing ? (
                                            <Button
                                                startIcon={<EditIcon />}
                                                onClick={() => setEditing(true)}
                                                variant="outlined"
                                            >
                                                Edit Profile
                                            </Button>
                                        ) : (
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Button
                                                    startIcon={<CancelIcon />}
                                                    onClick={() => {
                                                        setEditing(false);
                                                        setFormData({
                                                            name: user?.name || '',
                                                            email: user?.email || '',
                                                            phone: user?.phone || '',
                                                            organization: user?.organization || '',
                                                            bio: user?.bio || '',
                                                        });
                                                    }}
                                                    variant="outlined"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    startIcon={<SaveIcon />}
                                                    onClick={handleSaveProfile}
                                                    variant="contained"
                                                >
                                                    Save Changes
                                                </Button>
                                            </Box>
                                        )}
                                    </Box>

                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Full Name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                disabled={!editing}
                                                InputProps={{
                                                    startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />,
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Email Address"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                disabled={!editing}
                                                InputProps={{
                                                    startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />,
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Phone Number"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                disabled={!editing}
                                                InputProps={{
                                                    startAdornment: <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />,
                                                }}
                                            />
                                        </Grid>

                                        {(user?.role === 'ORGANIZER' || user?.role === 'ADMIN') && (
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Organization"
                                                    name="organizationName"
                                                    value={formData.organizationName}
                                                    onChange={handleInputChange}
                                                    disabled={!editing}
                                                    InputProps={{
                                                        startAdornment: <BusinessIcon sx={{ mr: 1, color: 'action.active' }} />,
                                                    }}
                                                />
                                            </Grid>
                                        )}

                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Bio"
                                                name="bio"
                                                value={formData.bio}
                                                onChange={handleInputChange}
                                                disabled={!editing}
                                                multiline
                                                rows={4}
                                                placeholder="Tell us about yourself..."
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}

                            {/* Security Tab */}
                            {activeTab === 1 && (
                                <Box>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        Change Password
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                        Ensure your account is using a strong password to stay secure
                                    </Typography>

                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Current Password"
                                                name="currentPassword"
                                                type="password"
                                                value={passwordData.currentPassword}
                                                onChange={handlePasswordChange}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="New Password"
                                                name="newPassword"
                                                type="password"
                                                value={passwordData.newPassword}
                                                onChange={handlePasswordChange}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Confirm New Password"
                                                name="confirmPassword"
                                                type="password"
                                                value={passwordData.confirmPassword}
                                                onChange={handlePasswordChange}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Button
                                                variant="contained"
                                                startIcon={<LockIcon />}
                                                onClick={handleChangePassword}
                                                disabled={!passwordData.currentPassword || !passwordData.newPassword}
                                            >
                                                Update Password
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}

                            {/* Preferences Tab */}
                            {activeTab === 2 && (
                                <Box>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        User Preferences
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                        Customize your experience
                                    </Typography>

                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle2" gutterBottom>Interests</Typography>
                                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                {['Technology', 'Music', 'Health', 'Business', 'Art'].map((interest) => (
                                                    <Chip
                                                        key={interest}
                                                        label={interest}
                                                        onClick={() => { }}
                                                        variant="outlined"
                                                        clickable
                                                    />
                                                ))}
                                            </Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                                (Selection saving coming soon)
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Divider sx={{ my: 2 }} />
                                            <Typography variant="subtitle2" gutterBottom>Notifications</Typography>
                                            <FormControlLabel control={<Switch defaultChecked />} label="Email Notifications" />
                                            <FormControlLabel control={<Switch defaultChecked />} label="Push Notifications" />
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Profile;

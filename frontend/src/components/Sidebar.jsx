// Enhanced Professional Organizer Sidebar
// with Nested Menus, AI Tools, Framer Motion Animations

import React, { useState } from 'react';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    IconButton,
    Divider,
    alpha,
    useTheme,
    useMediaQuery,
    Tooltip,
    Avatar,
    Badge,
    Collapse,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Event as EventIcon,
    People as PeopleIcon,
    Category as CategoryIcon,
    BarChart as BarChartIcon,
    Person as PersonIcon,
    ChevronLeft as ChevronLeftIcon,
    Add as AddIcon,
    CheckCircle as CheckCircleIcon,
    BookOnline as BookOnlineIcon,
    Favorite as FavoriteIcon,
    CalendarMonth as CalendarIcon,
    TrendingUp as TrendingUpIcon,
    Notifications as NotificationsIcon,
    AutoAwesome as AIIcon,
    AttachMoney as RevenueIcon,
    Settings as SettingsIcon,
    Support as SupportIcon,
    Logout as LogoutIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    ManageAccounts as ManageIcon,
    Description as DescriptionIcon,
    LocalOffer as PriceIcon,
    Campaign as MarketingIcon,
    ConfirmationNumber as TicketIcon,
    QrCodeScanner,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

const DRAWER_WIDTH = 280;
const COLLAPSED_WIDTH = 80;

// Enhanced Navigation Configuration with Nested Menus
const navigationConfig = {
    ADMIN: [
        { label: 'Dashboard', icon: DashboardIcon, path: '/admin/dashboard', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        { label: 'Users', icon: PeopleIcon, path: '/admin/users', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
        { label: 'Organizers', icon: CheckCircleIcon, path: '/admin/organizers', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
        { label: 'Events', icon: EventIcon, path: '/admin/events', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
        { label: 'Categories', icon: CategoryIcon, path: '/admin/categories', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
        { label: 'Analytics', icon: BarChartIcon, path: '/admin/analytics', gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' },
        { label: 'Revenue', icon: RevenueIcon, path: '/admin/revenue', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
        { label: 'Scan Entry', icon: QrCodeScanner, path: '/admin/scan-entry', gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' },
    ],
    ORGANIZER: [
        {
            label: 'Dashboard',
            icon: DashboardIcon,
            path: '/organizer/dashboard',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },
        {
            label: 'My Events',
            icon: CalendarIcon,
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            submenu: [
                { label: 'Create Event', icon: AddIcon, path: '/organizer/create-event' },
                { label: 'Manage Events', icon: ManageIcon, path: '/organizer/events' },
            ]
        },
        {
            label: 'Bookings',
            icon: TicketIcon,
            path: '/organizer/bookings',
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        },
        {
            label: 'Attendance',
            icon: CheckCircleIcon,
            path: '/organizer/attendance',
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
        },
        {
            label: 'Revenue',
            icon: RevenueIcon,
            path: '/organizer/revenue',
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
        },
        {
            label: 'AI Tools',
            icon: AIIcon,
            gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            submenu: [
                { label: 'Event Description', icon: DescriptionIcon, path: '/organizer/ai/description' },
                { label: 'Price Suggestion', icon: PriceIcon, path: '/organizer/ai/pricing' },
                { label: 'Marketing Copy', icon: MarketingIcon, path: '/organizer/ai/marketing' },
            ]
        },
        {
            label: 'Analytics',
            icon: TrendingUpIcon,
            path: '/organizer/analytics',
            gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
        },
        {
            label: 'Profile',
            icon: PersonIcon,
            path: '/organizer/profile',
            gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
        },
        {
            label: 'Support',
            icon: SupportIcon,
            path: '/organizer/support',
            gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
        },
    ],
    USER: [
        { label: 'Dashboard', icon: DashboardIcon, path: '/user/dashboard', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        { label: 'Browse Events', icon: EventIcon, path: '/user/browse', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
        { label: 'My Wishlist', icon: FavoriteIcon, path: '/user/wishlist', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
        { label: 'My Bookings', icon: BookOnlineIcon, path: '/user/bookings', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
        { label: 'Profile', icon: PersonIcon, path: '/user/profile', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    ],
};

const Sidebar = ({ role = 'USER', mobileOpen, onMobileClose }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const { unreadCount } = useNotifications();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [collapsed, setCollapsed] = useState(false);
    const [openSubmenus, setOpenSubmenus] = useState({});

    const navItems = navigationConfig[role] || navigationConfig.USER;
    const drawerWidth = collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;

    // Role theme configuration
    const getRoleTheme = () => {
        const themes = {
            ADMIN: {
                color: '#f5576c',
                gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            },
            ORGANIZER: {
                color: '#43e97b',
                gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            },
            USER: {
                color: '#4facfe',
                gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            },
        };
        return themes[role] || themes.USER;
    };

    const roleTheme = getRoleTheme();

    const handleNavigation = (path) => {
        if (path) {
            navigate(path);
            if (isMobile && onMobileClose) {
                onMobileClose();
            }
        }
    };

    const toggleSubmenu = (label) => {
        setOpenSubmenus(prev => ({ ...prev, [label]: !prev[label] }));
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Check if current path matches item or its submenu
    const isItemActive = (item) => {
        if (item.path && location.pathname === item.path) return true;
        if (item.submenu) {
            return item.submenu.some(sub => location.pathname === sub.path);
        }
        return false;
    };

    // Framer Motion variants
    const menuItemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.3 }
        },
        exit: { opacity: 0, x: -20 }
    };

    const submenuVariants = {
        hidden: { opacity: 0, height: 0 },
        visible: {
            opacity: 1,
            height: 'auto',
            transition: { duration: 0.3 }
        }
    };

    const renderMenuItem = (item, index) => {
        const isActive = isItemActive(item);
        const Icon = item.icon;
        const hasSubmenu = item.submenu && item.submenu.length > 0;
        const isSubmenuOpen = openSubmenus[item.label];

        return (
            <motion.div
                key={item.label}
                variants={menuItemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                custom={index}
            >
                <Tooltip
                    title={collapsed ? item.label : ''}
                    placement="right"
                >
                    <ListItem disablePadding sx={{ mb: 1, flexDirection: 'column', alignItems: 'stretch' }}>
                        <ListItemButton
                            onClick={() => hasSubmenu ? toggleSubmenu(item.label) : handleNavigation(item.path)}
                            sx={{
                                borderRadius: 2,
                                justifyContent: collapsed ? 'center' : 'flex-start',
                                position: 'relative',
                                overflow: 'hidden',
                                py: 1.5,
                                px: collapsed ? 1 : 2,
                                background: isActive ? item.gradient : 'transparent',
                                color: isActive ? 'white' : 'text.primary',
                                transition: 'all 0.3s ease',
                                '&::before': isActive ? {
                                    content: '""',
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    bottom: 0,
                                    width: '4px',
                                    background: 'white',
                                    borderRadius: '0 4px 4px 0',
                                } : {},
                                '&:hover': {
                                    background: isActive ? item.gradient : alpha(roleTheme.color, 0.1),
                                    transform: 'translateX(4px)',
                                    boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: collapsed ? 0 : 40,
                                    color: 'inherit',
                                    justifyContent: 'center',
                                }}
                            >
                                {item.hasBadge ? (
                                    <Badge badgeContent={unreadCount} color="error">
                                        <Icon sx={{ fontSize: 22 }} />
                                    </Badge>
                                ) : (
                                    <Icon sx={{ fontSize: 22 }} />
                                )}
                            </ListItemIcon>
                            {!collapsed && (
                                <>
                                    <ListItemText
                                        primary={item.label}
                                        primaryTypographyProps={{
                                            fontWeight: isActive ? 600 : 500,
                                            fontSize: '0.95rem',
                                        }}
                                    />
                                    {hasSubmenu && (
                                        isSubmenuOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />
                                    )}
                                </>
                            )}
                        </ListItemButton>

                        {/* Submenu */}
                        {hasSubmenu && !collapsed && (
                            <AnimatePresence>
                                {isSubmenuOpen && (
                                    <motion.div
                                        variants={submenuVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                    >
                                        <List component="div" disablePadding>
                                            {item.submenu.map((subItem) => {
                                                const SubIcon = subItem.icon;
                                                const isSubActive = location.pathname === subItem.path;

                                                return (
                                                    <ListItemButton
                                                        key={subItem.path}
                                                        onClick={() => handleNavigation(subItem.path)}
                                                        sx={{
                                                            pl: 6,
                                                            py: 1,
                                                            borderRadius: 2,
                                                            mx: 1,
                                                            mb: 0.5,
                                                            background: isSubActive
                                                                ? alpha(roleTheme.color, 0.15)
                                                                : 'transparent',
                                                            color: isSubActive ? roleTheme.color : 'text.secondary',
                                                            '&:hover': {
                                                                background: alpha(roleTheme.color, 0.1),
                                                                transform: 'translateX(4px)',
                                                            },
                                                            transition: 'all 0.2s ease',
                                                        }}
                                                    >
                                                        <ListItemIcon
                                                            sx={{
                                                                minWidth: 36,
                                                                color: 'inherit',
                                                            }}
                                                        >
                                                            <SubIcon sx={{ fontSize: 18 }} />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={subItem.label}
                                                            primaryTypographyProps={{
                                                                fontSize: '0.875rem',
                                                                fontWeight: isSubActive ? 600 : 400,
                                                            }}
                                                        />
                                                    </ListItemButton>
                                                );
                                            })}
                                        </List>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        )}
                    </ListItem>
                </Tooltip>
            </motion.div>
        );
    };

    const drawerContent = (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)'
                    : 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
            }}
        >
            {/* Logo & Brand with Gradient Background */}
            <Box
                sx={{
                    p: 3,
                    background: roleTheme.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'space-between',
                    gap: 2,
                    position: 'relative',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                    },
                }}
            >
                {!collapsed && (
                    <Box>
                        <Typography variant="h5" fontWeight="800" color="white" sx={{ letterSpacing: 1 }}>
                            SEMS
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>
                            {role === 'ORGANIZER' ? 'Organizer' : role.charAt(0) + role.slice(1).toLowerCase()} Portal
                        </Typography>
                    </Box>
                )}
                {!isMobile && (
                    <IconButton
                        onClick={() => setCollapsed(!collapsed)}
                        size="small"
                        sx={{
                            color: 'white',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            '&:hover': {
                                backgroundColor: 'rgba(255,255,255,0.3)',
                            },
                        }}
                    >
                        <ChevronLeftIcon
                            sx={{
                                transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s',
                            }}
                        />
                    </IconButton>
                )}
            </Box>

            {/* User Profile Section */}
            {!collapsed && user && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <Box
                        sx={{
                            p: 2,
                            mx: 2,
                            mt: 2,
                            borderRadius: 2,
                            background: theme.palette.mode === 'dark'
                                ? 'rgba(255,255,255,0.05)'
                                : 'rgba(0,0,0,0.02)',
                            border: '1px solid',
                            borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 40,
                                height: 40,
                                background: roleTheme.gradient,
                                fontWeight: 'bold',
                            }}
                        >
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" fontWeight="600" noWrap>
                                {user.name || 'User'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap>
                                {user.email}
                            </Typography>
                        </Box>
                    </Box>
                </motion.div>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Navigation Items */}
            <List sx={{ flex: 1, px: 2, py: 1, overflow: 'auto' }}>
                {navItems.map((item, index) => renderMenuItem(item, index))}
            </List>

            <Divider sx={{ my: 1 }} />

            {/* Logout Button */}
            <Box sx={{ px: 2, pb: 2 }}>
                <ListItemButton
                    onClick={handleLogout}
                    sx={{
                        borderRadius: 2,
                        py: 1.5,
                        px: collapsed ? 1 : 2,
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
                        color: 'white',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #ee5a6f 0%, #ff6b6b 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(255,107,107,0.3)',
                        },
                        transition: 'all 0.3s ease',
                    }}
                >
                    <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40, color: 'white', justifyContent: 'center' }}>
                        <LogoutIcon />
                    </ListItemIcon>
                    {!collapsed && <ListItemText primary="Logout" />}
                </ListItemButton>
            </Box>
        </Box>
    );

    return (
        <>
            {/* Mobile Drawer */}
            {isMobile ? (
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={onMobileClose}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: DRAWER_WIDTH,
                            boxSizing: 'border-box',
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>
            ) : (
                /* Desktop Drawer */
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                            borderRight: '1px solid',
                            borderColor: 'divider',
                            transition: theme.transitions.create('width', {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.enteringScreen,
                            }),
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>
            )}
        </>
    );
};

export default Sidebar;

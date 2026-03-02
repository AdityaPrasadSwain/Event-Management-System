import React from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
} from '@mui/material';
import {
    Support as SupportIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Help as HelpIcon,
    LiveHelp as LiveHelpIcon,
} from '@mui/icons-material';

const OrganizerSupport = () => {
    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Support & Help
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Get help with your events and technical issues
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Contact Support */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <SupportIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                Contact Support
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                Our support team is available 24/7 to help you with any questions or issues.
                            </Typography>
                            <List>
                                <ListItem>
                                    <ListItemIcon>
                                        <EmailIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Email"
                                        secondary="support@sems.com"
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <PhoneIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Phone"
                                        secondary="+91 1234567890"
                                    />
                                </ListItem>
                            </List>
                            <Button variant="contained" fullWidth sx={{ mt: 2 }}>
                                Open Support Ticket
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* FAQs */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <HelpIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                Frequently Asked Questions
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                Find quick answers to common questions about event management.
                            </Typography>
                            <List>
                                <ListItem>
                                    <ListItemIcon>
                                        <LiveHelpIcon color="secondary" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="How do I create an event?"
                                        secondary="Go to Create Event from the sidebar"
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <LiveHelpIcon color="secondary" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="How do I track bookings?"
                                        secondary="Visit the Bookings section"
                                    />
                                </ListItem>
                            </List>
                            <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
                                View All FAQs
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Documentation */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h6" gutterBottom>
                            Documentation & Resources
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            Access guides, tutorials, and best practices for event organizers
                        </Typography>
                        <Button variant="contained" color="secondary">
                            View Documentation
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default OrganizerSupport;

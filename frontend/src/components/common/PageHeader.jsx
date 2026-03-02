// PageHeader Component
// Consistent page headers with title and optional actions

import React from 'react';
import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';

const PageHeader = ({
    title,
    subtitle,
    breadcrumbs = [],
    action,
}) => {
    return (
        <Box sx={{ mb: 4 }}>
            {breadcrumbs.length > 0 && (
                <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small" />}
                    sx={{ mb: 2 }}
                >
                    {breadcrumbs.map((crumb, index) => (
                        <Link
                            key={index}
                            underline="hover"
                            color={index === breadcrumbs.length - 1 ? 'text.primary' : 'inherit'}
                            href={crumb.href}
                            sx={{ cursor: crumb.href ? 'pointer' : 'default' }}
                        >
                            {crumb.label}
                        </Link>
                    ))}
                </Breadcrumbs>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                        {title}
                    </Typography>
                    {subtitle && (
                        <Typography variant="body1" color="text.secondary">
                            {subtitle}
                        </Typography>
                    )}
                </Box>

                {action && <Box>{action}</Box>}
            </Box>
        </Box>
    );
};

export default PageHeader;

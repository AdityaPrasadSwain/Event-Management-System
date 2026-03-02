import React from 'react';
import { Skeleton, Box, Paper, Grid } from '@mui/material';

const SkeletonLoader = ({ type = 'chart' }) => {
    if (type === 'stat') {
        return (
            <Paper sx={{ p: 3, height: '100%', minHeight: 140, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Skeleton variant="text" width="60%" height={30} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="40%" height={20} />
                <Skeleton variant="rectangular" width="100%" height={40} sx={{ mt: 2, borderRadius: 1 }} />
            </Paper>
        );
    }

    if (type === 'table') {
        return (
            <Paper sx={{ p: 2 }}>
                {[1, 2, 3, 4, 5].map((item) => (
                    <Box key={item} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                        <Box sx={{ width: '100%' }}>
                            <Skeleton variant="text" width="80%" />
                            <Skeleton variant="text" width="40%" />
                        </Box>
                    </Box>
                ))}
            </Paper>
        );
    }

    // Default chart skeleton
    return (
        <Paper sx={{ p: 3, height: 400 }}>
            <Skeleton variant="text" width="50%" height={30} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 2 }} />
        </Paper>
    );
};

export default SkeletonLoader;

// StatsCard Component
// Dashboard KPI cards with icon, value, and trend

import React from 'react';
import { Card, CardContent, Box, Typography, alpha } from '@mui/material';
import { TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon } from '@mui/icons-material';

const StatsCard = ({
    title,
    value,
    icon: Icon,
    color = 'primary',
    trend,
    trendLabel,
    loading = false,
}) => {
    const isPositiveTrend = trend && trend > 0;
    const isNegativeTrend = trend && trend < 0;

    return (
        <Card
            sx={{
                height: '100%',
                position: 'relative',
                overflow: 'visible',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.3s ease',
                },
            }}
        >
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            {title}
                        </Typography>
                        <Typography variant="h3" component="div" fontWeight="bold" sx={{ my: 1 }}>
                            {loading ? '...' : value}
                        </Typography>

                        {(trend !== undefined || trendLabel) && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                                {trend !== undefined && (
                                    <>
                                        {isPositiveTrend && (
                                            <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
                                        )}
                                        {isNegativeTrend && (
                                            <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />
                                        )}
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: isPositiveTrend ? 'success.main' : isNegativeTrend ? 'error.main' : 'text.secondary',
                                                fontWeight: 600,
                                            }}
                                        >
                                            {Math.abs(trend)}%
                                        </Typography>
                                    </>
                                )}
                                {trendLabel && (
                                    <Typography variant="caption" color="text.secondary">
                                        {trendLabel}
                                    </Typography>
                                )}
                            </Box>
                        )}
                    </Box>

                    {Icon && (
                        <Box
                            sx={{
                                width: 56,
                                height: 56,
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: (theme) => alpha(theme.palette[color].main, 0.1),
                                color: `${color}.main`,
                            }}
                        >
                            <Icon sx={{ fontSize: 28 }} />
                        </Box>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default StatsCard;

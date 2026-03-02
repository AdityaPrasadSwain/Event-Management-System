import React from 'react';
import { ResponsiveContainer, AreaChart as ReAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Paper, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

const CustomAreaChart = ({ title, data, dataKey, xAxisKey = "name", colorStart, colorEnd }) => {
    const theme = useTheme();
    const start = colorStart || theme.palette.primary.main;
    const end = colorEnd || theme.palette.primary.dark;
    const id = `gradient-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
        >
            <Paper sx={{ p: 3, height: '100%', minHeight: 400, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: theme.palette.text.secondary }}>
                    {title}
                </Typography>
                <Box sx={{ flexGrow: 1, width: '100%', minHeight: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <ReAreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={start} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={start} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                            <XAxis
                                dataKey={xAxisKey}
                                stroke={theme.palette.text.secondary}
                                tick={{ fill: theme.palette.text.secondary }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                stroke={theme.palette.text.secondary}
                                tick={{ fill: theme.palette.text.secondary }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: theme.palette.background.paper,
                                    border: `1px solid ${theme.palette.divider}`,
                                    borderRadius: 12,
                                    boxShadow: theme.shadows[4],
                                    color: theme.palette.text.primary
                                }}
                                itemStyle={{ color: theme.palette.text.primary }}
                            />
                            <Area
                                type="monotone"
                                dataKey={dataKey}
                                stroke={start}
                                fillOpacity={1}
                                fill={`url(#${id})`}
                                isAnimationActive={false}
                            />
                        </ReAreaChart>
                    </ResponsiveContainer>
                </Box>
            </Paper>
        </motion.div>
    );
};

export default CustomAreaChart;

import React from 'react';
import { ResponsiveContainer, LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Paper, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

const CustomLineChart = ({ title, data, dataKey, xAxisKey = "name", color }) => {
    const theme = useTheme();
    const chartColor = color || theme.palette.primary.main;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
        >
            <Paper sx={{ p: 3, height: '100%', minHeight: 400, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: theme.palette.text.secondary }}>
                    {title}
                </Typography>
                <Box sx={{ flexGrow: 1, width: '100%', minHeight: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <ReLineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis
                                dataKey={xAxisKey}
                                stroke={theme.palette.text.secondary}
                                tick={{ fill: theme.palette.text.secondary }}
                            />
                            <YAxis
                                stroke={theme.palette.text.secondary}
                                tick={{ fill: theme.palette.text.secondary }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(30, 30, 30, 0.9)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 12,
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                                    color: '#fff'
                                }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey={dataKey}
                                stroke={chartColor}
                                strokeWidth={4}
                                dot={{ r: 4, fill: '#1e1e1e', stroke: chartColor, strokeWidth: 2 }}
                                activeDot={{ r: 8, fill: chartColor }}
                                animationDuration={2000}
                            />
                        </ReLineChart>
                    </ResponsiveContainer>
                </Box>
            </Paper>
        </motion.div>
    );
};

export default CustomLineChart;

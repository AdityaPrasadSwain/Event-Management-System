import React from 'react';
import { ResponsiveContainer, BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Paper, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

const CustomBarChart = ({ title, data, dataKey, xAxisKey = "name", color }) => {
    const theme = useTheme();
    const chartColor = color || theme.palette.secondary.main;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
        >
            <Paper sx={{ p: 3, height: '100%', minHeight: 400, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: theme.palette.text.secondary }}>
                    {title}
                </Typography>
                <Box sx={{ flexGrow: 1, width: '100%', minHeight: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <ReBarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                                cursor={{ fill: theme.palette.action.hover }}
                                contentStyle={{
                                    backgroundColor: theme.palette.background.paper,
                                    border: `1px solid ${theme.palette.divider}`,
                                    borderRadius: 12,
                                    color: theme.palette.text.primary
                                }}
                                itemStyle={{ color: theme.palette.text.primary }}
                            />
                            <Legend />
                            <Bar
                                dataKey={dataKey}
                                fill={chartColor}
                                radius={[8, 8, 0, 0]}
                                barSize={40}
                                isAnimationActive={false}
                            >
                            </Bar>
                        </ReBarChart>
                    </ResponsiveContainer>
                </Box>
            </Paper>
        </motion.div>
    );
};

export default CustomBarChart;

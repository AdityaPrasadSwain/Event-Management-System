import React from 'react';
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Paper, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

const CustomPieChart = ({ title, data, dataKey = "value", nameKey = "name", colors }) => {
    const theme = useTheme();
    const defaultColors = [
        theme.palette.primary.main,
        theme.palette.secondary.main,
        theme.palette.error.main,
        theme.palette.warning.main,
        theme.palette.success.main
    ];
    const chartColors = colors || defaultColors;

    return (
        <motion.div
            initial={{ opacity: 0, rotate: -10 }}
            whileInView={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
        >
            <Paper sx={{ p: 3, height: '100%', minHeight: 400, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: theme.palette.text.secondary, alignSelf: 'flex-start' }}>
                    {title}
                </Typography>
                <Box sx={{ flexGrow: 1, width: '100%', minHeight: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <RePieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={120}
                                paddingAngle={5}
                                dataKey={dataKey}
                                nameKey={nameKey}
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: theme.palette.background.paper,
                                    borderRadius: 12,
                                    border: `1px solid ${theme.palette.divider}`,
                                    color: theme.palette.text.primary
                                }}
                                itemStyle={{ color: theme.palette.text.primary }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </RePieChart>
                    </ResponsiveContainer>
                </Box>
            </Paper>
        </motion.div>
    );
};

export default CustomPieChart;

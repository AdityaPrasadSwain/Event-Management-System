import { Card, CardContent, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

const AnimatedCard = ({ children, delay = 0, sx = {}, ...props }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
            <Card
                elevation={isDark ? 8 : 2}
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    ...sx,
                    background: isDark
                        ? 'rgba(30, 41, 59, 0.7)'
                        : 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'}`,
                    transition: 'all 0.3s ease'
                }}
                {...props}
            >
                <CardContent sx={{ width: '100%', p: '16px !important' }}>
                    {children}
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default AnimatedCard;

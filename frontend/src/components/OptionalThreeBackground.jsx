import React, { useRef } from 'react';
import { Box } from '@mui/material';
import useThreeBackground from '../hooks/useThreeBackground';

/**
 * Optional Three.js background - isolated from critical business logic
 * If this crashes, it won't affect the dashboard
 */
const OptionalThreeBackground = () => {
    const containerRef = useRef(null);

    // Initialize Three.js with safe hook
    useThreeBackground(containerRef);

    return (
        <Box
            ref={containerRef}
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)',
                pointerEvents: 'none'
            }}
        />
    );
};

export default OptionalThreeBackground;

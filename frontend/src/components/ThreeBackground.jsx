import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useTheme } from '@mui/material/styles';

function FloatingShape({ position, color, speed, rotationSpeed }) {
    const mesh = useRef();

    useFrame((state, delta) => {
        if (!mesh.current) return;
        mesh.current.rotation.x += delta * rotationSpeed;
        mesh.current.rotation.y += delta * rotationSpeed;
        mesh.current.position.y += Math.sin(state.clock.elapsedTime * speed) * 0.002;
    });

    return (
        <mesh ref={mesh} position={position}>
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color={color} roughness={0.5} metalness={0.8} opacity={0.6} transparent />
        </mesh>
    );
}

const ThreeBackground = ({ className = '', style = {} }) => {
    const theme = useTheme();
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;

    return (
        <div className={className} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none', background: 'radial-gradient(circle at 50% 50%, #1a1a2e 0%, #0f0f1a 100%)', ...style }}>
            <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <FloatingShape position={[-2, 1, -2]} color={primary} speed={1} rotationSpeed={0.2} />
                <FloatingShape position={[2, -1, -3]} color={secondary} speed={1.5} rotationSpeed={0.1} />
                <FloatingShape position={[0, 2, -5]} color="#ffffff" speed={0.5} rotationSpeed={0.05} />
                <FloatingShape position={[-3, -2, -4]} color={primary} speed={0.8} rotationSpeed={0.15} />
                <FloatingShape position={[3, 2, -6]} color={secondary} speed={1.2} rotationSpeed={0.1} />
            </Canvas>
        </div>
    );
};

export default ThreeBackground;

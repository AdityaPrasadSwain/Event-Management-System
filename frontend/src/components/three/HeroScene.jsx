import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

import { useState, useRef, Suspense } from 'react';

const Stars = (props) => {
    const ref = useRef();

    const [sphere] = useState(() => {
        const positions = new Float32Array(5000 * 3);
        const radius = 1.5;
        for (let i = 0; i < 5000; i++) {
            const r = radius * Math.cbrt(Math.random());
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);

            // Safety check for NaNs
            if (isNaN(x) || isNaN(y) || isNaN(z)) {
                positions[i * 3] = 0;
                positions[i * 3 + 1] = 0;
                positions[i * 3 + 2] = 0;
            } else {
                positions[i * 3] = x;
                positions[i * 3 + 1] = y;
                positions[i * 3 + 2] = z;
            }
        }
        return positions;
    });

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#f272c8"
                    size={0.005}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
};

const HeroScene = () => {
    return (
        <div className="w-full h-[500px] md:h-[600px] relative" style={{ pointerEvents: 'none' }}>
            <Canvas camera={{ position: [0, 0, 1] }} style={{ pointerEvents: 'none' }}>
                <Suspense fallback={null}>
                    <Stars />
                </Suspense>
            </Canvas>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-4 animate-pulse">
                    Discover Amazing Events
                </h1>
                <p className="text-xl md:text-2xl text-gray-300">
                    Book tickets for concerts, workshops, and more.
                </p>
            </div>
        </div>
    );
};

export default HeroScene;

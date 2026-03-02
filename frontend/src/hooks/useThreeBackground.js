import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Safe Three.js background hook with proper cleanup
 * Prevents WebGL context loss and memory leaks
 */
export const useThreeBackground = (containerRef) => {
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const animationIdRef = useRef(null);
    const particlesRef = useRef(null);
    const initializedRef = useRef(false);

    useEffect(() => {
        // Prevent double initialization in StrictMode
        if (initializedRef.current) return;
        if (!containerRef.current) return;

        const container = containerRef.current;
        let mounted = true;

        try {
            // Scene
            const scene = new THREE.Scene();
            sceneRef.current = scene;

            // Camera
            const camera = new THREE.PerspectiveCamera(
                75,
                container.clientWidth / container.clientHeight,
                0.1,
                1000
            );
            camera.position.z = 5;
            cameraRef.current = camera;

            // Renderer with proper settings
            const renderer = new THREE.WebGLRenderer({
                alpha: true,
                antialias: true,
                powerPreference: 'high-performance'
            });
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit for performance
            container.appendChild(renderer.domElement);
            rendererRef.current = renderer;

            // Particles
            const geometry = new THREE.BufferGeometry();
            const vertices = [];
            const particleCount = 1000;

            for (let i = 0; i < particleCount; i++) {
                vertices.push(
                    (Math.random() - 0.5) * 10,
                    (Math.random() - 0.5) * 10,
                    (Math.random() - 0.5) * 10
                );
            }

            geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

            const material = new THREE.PointsMaterial({
                color: 0x00ffff,
                size: 0.05,
                transparent: true,
                opacity: 0.6
            });

            const particles = new THREE.Points(geometry, material);
            scene.add(particles);
            particlesRef.current = particles;

            // Animation loop
            const animate = () => {
                if (!mounted) return;

                animationIdRef.current = requestAnimationFrame(animate);

                if (particles) {
                    particles.rotation.x += 0.0005;
                    particles.rotation.y += 0.001;
                }

                renderer.render(scene, camera);
            };

            animate();
            initializedRef.current = true;

            // Handle window resize
            const handleResize = () => {
                if (!container || !camera || !renderer) return;

                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            };

            window.addEventListener('resize', handleResize);

            // Cleanup function
            return () => {
                mounted = false;

                // Cancel animation frame
                if (animationIdRef.current) {
                    cancelAnimationFrame(animationIdRef.current);
                }

                // Remove event listener
                window.removeEventListener('resize', handleResize);

                // Dispose Three.js resources
                if (particlesRef.current) {
                    const particles = particlesRef.current;
                    if (particles.geometry) particles.geometry.dispose();
                    if (particles.material) particles.material.dispose();
                    scene?.remove(particles);
                }

                if (rendererRef.current) {
                    rendererRef.current.dispose();
                    if (container.contains(rendererRef.current.domElement)) {
                        container.removeChild(rendererRef.current.domElement);
                    }
                }

                // Clear refs
                sceneRef.current = null;
                cameraRef.current = null;
                rendererRef.current = null;
                particlesRef.current = null;
                initializedRef.current = false;
            };

        } catch (error) {
            console.error('❌ Three.js initialization failed:', error);
            mounted = false;
        }
    }, [containerRef]);

    return {
        scene: sceneRef.current,
        camera: cameraRef.current,
        renderer: rendererRef.current
    };
};

export default useThreeBackground;

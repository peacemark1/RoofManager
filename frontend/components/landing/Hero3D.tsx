'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
    OrbitControls, 
    Stars,
    Environment,
    PerspectiveCamera,
    ContactShadows,
    RoundedBox,
    Float,
    Sphere
} from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

interface RoofModelProps {
    mousePosition: { x: number; y: number };
}

function Roof({ mousePosition }: RoofModelProps) {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            // Smooth mouse follow with lerp
            groupRef.current.rotation.y = THREE.MathUtils.lerp(
                groupRef.current.rotation.y,
                mousePosition.x * 0.3,
                0.05
            );
            groupRef.current.rotation.x = THREE.MathUtils.lerp(
                groupRef.current.rotation.x,
                mousePosition.y * 0.2,
                0.05
            );
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <group ref={groupRef} position={[0, 0.5, 0]}>
                {/* Main roof structure - triangular prism */}
                <mesh position={[0, 1.5, 0]} castShadow>
                    <cylinderGeometry args={[0, 1.5, 3, 4, 1]} />
                    <meshStandardMaterial 
                        color="#EF2B2D" 
                        metalness={0.6}
                        roughness={0.3}
                        emissive="#EF2B2D"
                        emissiveIntensity={0.1}
                    />
                </mesh>

                {/* Roof tiles texture effect */}
                <mesh position={[0, 1.5, 0]} scale={[1.02, 0.95, 1.02]} castShadow>
                    <cylinderGeometry args={[0, 1.45, 2.9, 4, 1]} />
                    <meshStandardMaterial 
                        color="#D42020" 
                        metalness={0.5}
                        roughness={0.4}
                    />
                </mesh>

                {/* Peak cap */}
                <mesh position={[0, 2.8, 0]}>
                    <coneGeometry args={[0.15, 0.4, 32]} />
                    <meshStandardMaterial 
                        color="#FFD700" 
                        metalness={0.8}
                        roughness={0.2}
                        emissive="#FFD700"
                        emissiveIntensity={0.2}
                    />
                </mesh>

                {/* House base */}
                <RoundedBox args={[2.5, 2, 2]} radius={0.1} smoothness={4} position={[0, 0, 0]} castShadow>
                    <meshStandardMaterial 
                        color="#1a1a24"
                        metalness={0.1}
                        roughness={0.8}
                    />
                </RoundedBox>

                {/* Windows */}
                <mesh position={[0.6, 0.3, 1.01]}>
                    <planeGeometry args={[0.6, 0.5]} />
                    <meshStandardMaterial 
                        color="#3b82f6"
                        metalness={0.9}
                        roughness={0.1}
                        emissive="#3b82f6"
                        emissiveIntensity={0.3}
                    />
                </mesh>
                <mesh position={[-0.6, 0.3, 1.01]}>
                    <planeGeometry args={[0.6, 0.5]} />
                    <meshStandardMaterial 
                        color="#3b82f6"
                        metalness={0.9}
                        roughness={0.1}
                        emissive="#3b82f6"
                        emissiveIntensity={0.3}
                    />
                </mesh>

                {/* Door */}
                <mesh position={[0, -0.4, 1.01]}>
                    <planeGeometry args={[0.5, 0.8]} />
                    <meshStandardMaterial 
                        color="#8B4513"
                        metalness={0.3}
                        roughness={0.6}
                    />
                </mesh>

                {/* Ground shadow */}
                <ContactShadows 
                    position={[0, -1.2, 0]} 
                    opacity={0.4} 
                    scale={10} 
                    blur={2.5} 
                    far={4}
                    color="#000000"
                />
            </group>
        </Float>
    );
}

function Particles() {
    const particleRefs = useRef<THREE.Mesh[]>([]);
    
    const particleData = useMemo(() => {
        return Array.from({ length: 30 }).map(() => ({
            position: [
                (Math.random() - 0.5) * 6,
                (Math.random() - 0.5) * 6,
                (Math.random() - 0.5) * 6,
            ] as [number, number, number],
            scale: Math.random() * 0.1 + 0.05,
            speed: Math.random() * 0.5 + 0.2,
            offset: Math.random() * Math.PI * 2,
            color: Math.random() > 0.66 ? '#FFD700' : Math.random() > 0.33 ? '#009E49' : '#EF2B2D',
        }));
    }, []);

    useFrame((state) => {
        const time = state.clock.elapsedTime;
        particleRefs.current.forEach((mesh, i) => {
            if (mesh) {
                const data = particleData[i];
                mesh.position.y = data.position[1] + Math.sin(time * data.speed + data.offset) * 0.5;
                mesh.position.x = data.position[0] + Math.cos(time * data.speed * 0.5 + data.offset) * 0.3;
            }
        });
    });

    return (
        <group>
            {particleData.map((data, i) => (
                <mesh
                    key={i}
                    ref={(el) => {
                        if (el) particleRefs.current[i] = el;
                    }}
                    position={data.position}
                    scale={data.scale}
                >
                    <sphereGeometry args={[1, 16, 16]} />
                    <meshStandardMaterial 
                        color={data.color}
                        emissive={data.color}
                        emissiveIntensity={0.5}
                        transparent
                        opacity={0.6}
                    />
                </mesh>
            ))}
        </group>
    );
}

function AnimatedRing() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
            meshRef.current.rotation.z = state.clock.elapsedTime * 0.1;
        }
    });

    return (
        <mesh ref={meshRef} rotation={[Math.PI / 3, 0, 0]} position={[0, 0, -1]}>
            <torusGeometry args={[3, 0.015, 16, 100]} />
            <meshStandardMaterial 
                color="#FFD700"
                transparent
                opacity={0.2}
                metalness={0.8}
                roughness={0.2}
            />
        </mesh>
    );
}

interface Hero3DProps {
    className?: string;
}

export default function Hero3D({ className = '' }: Hero3DProps) {
    const mousePosition = useRef({ x: 0, y: 0 });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        mousePosition.current = {
            x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
            y: ((event.clientY - rect.top) / rect.height) * 2 - 1,
        };
    };

    if (!mounted) {
        return (
            <div className={`relative w-full h-[400px] md:h-[500px] ${className} flex items-center justify-center`}>
                <div className="w-full h-full premium-bg rounded-3xl flex items-center justify-center">
                    <div className="text-white/60">Loading 3D...</div>
                </div>
            </div>
        );
    }

    return (
        <div 
            className={`relative w-full h-[400px] md:h-[500px] ${className}`}
            onMouseMove={handleMouseMove}
        >
            <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
                <PerspectiveCamera makeDefault position={[0, 2, 6]} fov={50} />
                
                {/* Lighting */}
                <ambientLight intensity={0.4} />
                <directionalLight 
                    position={[5, 5, 5]} 
                    intensity={1} 
                    castShadow 
                    shadow-mapSize={[1024, 1024]}
                />
                <pointLight position={[-3, 2, 3]} intensity={0.5} color="#FFD700" />
                <pointLight position={[3, -2, 3]} intensity={0.3} color="#009E49" />
                
                {/* Environment */}
                <Environment preset="night" />
                <Stars radius={100} depth={50} count={500} factor={4} saturation={0} fade speed={1} />
                
                {/* Animated elements */}
                <AnimatedRing />
                <Particles />
                
                {/* Main roof model */}
                <Roof mousePosition={mousePosition.current} />
                
                {/* Controls */}
                <OrbitControls 
                    enableZoom={false} 
                    enablePan={false}
                    maxPolarAngle={Math.PI / 1.5}
                    minPolarAngle={Math.PI / 3}
                />
            </Canvas>

            {/* Decorative elements */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Floating UI elements */}
                <motion.div
                    className="absolute top-10 left-10 w-14 h-14 premium-card rounded-2xl flex items-center justify-center"
                    animate={{
                        y: [0, -15, 0],
                        rotate: [0, 5, 0, -5, 0],
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                >
                    <span className="text-2xl">📊</span>
                </motion.div>

                <motion.div
                    className="absolute top-20 right-10 w-14 h-14 premium-card rounded-2xl flex items-center justify-center"
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, -5, 0, 5, 0],
                    }}
                    transition={{ duration: 6, repeat: Infinity }}
                >
                    <span className="text-2xl">📅</span>
                </motion.div>

                <motion.div
                    className="absolute bottom-20 left-16 w-14 h-14 premium-card rounded-2xl flex items-center justify-center"
                    animate={{
                        y: [0, -10, 0],
                        rotate: [0, 3, 0, -3, 0],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                >
                    <span className="text-2xl">💰</span>
                </motion.div>

                <motion.div
                    className="absolute bottom-10 right-16 w-14 h-14 premium-card rounded-2xl flex items-center justify-center"
                    animate={{
                        y: [0, -18, 0],
                        rotate: [0, -3, 0, 3, 0],
                    }}
                    transition={{ duration: 5.5, repeat: Infinity }}
                >
                    <span className="text-2xl">📱</span>
                </motion.div>

                {/* Ghana colors accent */}
                <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    <div className="w-4 h-4 rounded-full bg-ghana-red animate-pulse" />
                    <div className="w-4 h-4 rounded-full bg-ghana-gold animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="w-4 h-4 rounded-full bg-ghana-green animate-pulse" style={{ animationDelay: '0.4s' }} />
                </motion.div>
            </div>
        </div>
    );
}

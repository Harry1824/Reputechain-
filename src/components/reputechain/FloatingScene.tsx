import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, MeshDistortMaterial, Float, Stars, Sparkles, MeshTransmissionMaterial } from '@react-three/drei';
import { useRef, useMemo, Suspense, useState } from 'react';
import * as THREE from 'three';

/* ── Pulsing Energy Core ── */
function EnergyCore() {
  const mesh = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  const outerRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    mesh.current.rotation.x = t * 0.15;
    mesh.current.rotation.z = t * 0.1;
    const pulse = 1 + Math.sin(t * 2) * 0.05;
    mesh.current.scale.setScalar(pulse);
    glowRef.current.scale.setScalar(pulse * 1.8);
    outerRef.current.rotation.y = t * 0.08;
    outerRef.current.rotation.x = t * 0.05;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.6}>
      <group>
        {/* Inner core */}
        <mesh ref={mesh}>
          <icosahedronGeometry args={[1.4, 20]} />
          <MeshDistortMaterial
            color="#8b5cf6"
            attach="material"
            distort={0.4}
            speed={2.5}
            roughness={0.1}
            metalness={0.95}
            emissive="#6d28d9"
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* Inner glow shell */}
        <mesh ref={glowRef}>
          <icosahedronGeometry args={[1.4, 8]} />
          <meshBasicMaterial color="#7c3aed" transparent opacity={0.03} wireframe />
        </mesh>

        {/* Outer wireframe shell */}
        <mesh ref={outerRef} scale={2.2}>
          <icosahedronGeometry args={[1.4, 3]} />
          <meshBasicMaterial color="#a78bfa" transparent opacity={0.06} wireframe />
        </mesh>
      </group>
    </Float>
  );
}

/* ── DNA Helix Orbit ── */
function DNAHelix() {
  const group = useRef<THREE.Group>(null!);
  const count = 40;

  const points = useMemo(() => {
    const pts: { pos1: THREE.Vector3; pos2: THREE.Vector3; color: string }[] = [];
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 4;
      const y = (i / count) * 8 - 4;
      const r = 2.8;
      pts.push({
        pos1: new THREE.Vector3(Math.cos(t) * r, y, Math.sin(t) * r),
        pos2: new THREE.Vector3(Math.cos(t + Math.PI) * r, y, Math.sin(t + Math.PI) * r),
        color: i % 2 === 0 ? '#a78bfa' : '#60a5fa',
      });
    }
    return pts;
  }, []);

  const connectorGeometry = useMemo(() => {
    const positions: number[] = [];
    for (let i = 0; i < count; i += 3) {
      const p = points[i];
      positions.push(p.pos1.x, p.pos1.y, p.pos1.z);
      positions.push(p.pos2.x, p.pos2.y, p.pos2.z);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, [points]);

  useFrame(({ clock }) => {
    group.current.rotation.y = clock.elapsedTime * 0.08;
  });

  return (
    <group ref={group}>
      {points.map((p, i) => (
        <group key={i}>
          <mesh position={p.pos1}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial
              color={p.color}
              emissive={p.color}
              emissiveIntensity={0.6}
              toneMapped={false}
            />
          </mesh>
          <mesh position={p.pos2}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#60a5fa' : '#38bdf8'}
              emissive={i % 2 === 0 ? '#3b82f6' : '#0ea5e9'}
              emissiveIntensity={0.6}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
      <lineSegments geometry={connectorGeometry}>
        <lineBasicMaterial color="#7c3aed" transparent opacity={0.12} />
      </lineSegments>
    </group>
  );
}

/* ── Orbiting Blockchain Nodes ── */
function OrbitalNodes() {
  const group = useRef<THREE.Group>(null!);

  const nodes = useMemo(() => {
    const pts: { pos: THREE.Vector3; size: number; speed: number; color: string; emissive: string }[] = [];
    for (let i = 0; i < 24; i++) {
      const theta = (i / 24) * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3.5 + Math.random() * 1.5;
      const colorIdx = i % 4;
      const colors = ['#a78bfa', '#60a5fa', '#38bdf8', '#c084fc'];
      const emissives = ['#7c3aed', '#3b82f6', '#0ea5e9', '#9333ea'];
      pts.push({
        pos: new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi),
        ),
        size: 0.05 + Math.random() * 0.08,
        speed: 0.5 + Math.random() * 1.5,
        color: colors[colorIdx],
        emissive: emissives[colorIdx],
      });
    }
    return pts;
  }, []);

  const lineGeometry = useMemo(() => {
    const positions: number[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].pos.distanceTo(nodes[j].pos) < 3.5) {
          positions.push(nodes[i].pos.x, nodes[i].pos.y, nodes[i].pos.z);
          positions.push(nodes[j].pos.x, nodes[j].pos.y, nodes[j].pos.z);
        }
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, [nodes]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    group.current.rotation.y = t * 0.04;
    group.current.rotation.x = Math.sin(t * 0.02) * 0.08;
  });

  return (
    <group ref={group}>
      {nodes.map((node, i) => (
        <Float key={i} speed={node.speed} floatIntensity={0.2}>
          <mesh position={node.pos}>
            <octahedronGeometry args={[node.size]} />
            <meshStandardMaterial
              color={node.color}
              emissive={node.emissive}
              emissiveIntensity={1}
              toneMapped={false}
            />
          </mesh>
        </Float>
      ))}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="#7c3aed" transparent opacity={0.1} />
      </lineSegments>
    </group>
  );
}

/* ── Triple Holographic Rings ── */
function HoloRings() {
  const ring1 = useRef<THREE.Mesh>(null!);
  const ring2 = useRef<THREE.Mesh>(null!);
  const ring3 = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    ring1.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.2) * 0.15;
    ring1.current.rotation.z = t * 0.12;
    ring2.current.rotation.y = t * 0.08;
    ring2.current.rotation.x = Math.PI / 3;
    ring3.current.rotation.z = -t * 0.06;
    ring3.current.rotation.x = Math.PI / 4 + Math.cos(t * 0.15) * 0.1;
  });

  return (
    <>
      <mesh ref={ring1}>
        <torusGeometry args={[3, 0.012, 16, 120]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.35} toneMapped={false} />
      </mesh>
      <mesh ref={ring2}>
        <torusGeometry args={[3.6, 0.008, 16, 120]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.2} toneMapped={false} />
      </mesh>
      <mesh ref={ring3}>
        <torusGeometry args={[4.2, 0.006, 16, 120]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.12} toneMapped={false} />
      </mesh>
    </>
  );
}

/* ── Floating Data Particles ── */
function DataParticles() {
  const ref = useRef<THREE.Points>(null!);
  const count = 500;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const purple = new THREE.Color('#a78bfa');
    const blue = new THREE.Color('#60a5fa');
    const cyan = new THREE.Color('#38bdf8');
    const palette = [purple, blue, cyan];

    for (let i = 0; i < count; i++) {
      const r = 5 + Math.random() * 15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      const c = palette[Math.floor(Math.random() * 3)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, []);

  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.elapsedTime * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

export default function FloatingScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <color attach="background" args={['#020010']} />
          <fog attach="fog" args={['#020010', 10, 28]} />

          <ambientLight intensity={0.15} />
          <pointLight position={[5, 5, 5]} intensity={2} color="#a78bfa" />
          <pointLight position={[-5, -3, 3]} intensity={1} color="#3b82f6" />
          <pointLight position={[0, -5, -5]} intensity={0.6} color="#0ea5e9" />
          <pointLight position={[3, -2, 4]} intensity={0.4} color="#c084fc" />

          <EnergyCore />
          <DNAHelix />
          <OrbitalNodes />
          <HoloRings />
          <DataParticles />
          
          <Sparkles count={100} scale={12} size={1.5} speed={0.3} color="#a78bfa" opacity={0.3} />
          <Stars radius={60} depth={50} count={2000} factor={3} saturation={0.6} fade speed={0.8} />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.25}
            maxPolarAngle={Math.PI}
            minPolarAngle={0}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

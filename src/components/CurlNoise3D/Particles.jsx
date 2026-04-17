"use client";

import * as THREE from 'three'
import { useMemo, useState, useRef } from 'react'
import { createPortal, useFrame } from '@react-three/fiber'
import { useFBO } from '@react-three/drei'
import './materials'

export function Particles({ speed = 100, fov = 20, aperture = 1.8, focus = 5.1, curl = 0.25, size = 512, scroll = 0, ...props }) {
  const simRef = useRef()
  const renderRef = useRef()
  // Set up FBO
  const [scene] = useState(() => new THREE.Scene())
  const [camera] = useState(() => new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1))
  const [positions] = useState(() => new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0]))
  const [uvs] = useState(() => new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0]))
  const target = useFBO(size, size, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType
  })
  
  // Create an invisible plane to intercept the mouse raycast
  const dummyPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const intersectPoint = useMemo(() => new THREE.Vector3(), []);
  // Normalize points
  const particles = useMemo(() => {
    const length = size * size
    const particles = new Float32Array(length * 3)
    for (let i = 0; i < length; i++) {
      let i3 = i * 3
      particles[i3 + 0] = (i % size) / size
      particles[i3 + 1] = Math.floor(i / size) / size
    }
    return particles
  }, [size])
  const frames = useRef(0)
  const signaled = useRef(false)

  // Update FBO and pointcloud every frame
  useFrame((state) => {
    // Warm up logic: wait for a few frames to ensure shaders are compiled
    if (frames.current < 15) {
      frames.current++
    } else if (!signaled.current) {
      signaled.current = true
      window.dispatchEvent(new CustomEvent('tinarra-3d-ready'))
    }

    state.gl.setRenderTarget(target)
    state.gl.clear()
    state.gl.render(scene, camera)
    state.gl.setRenderTarget(null)
    renderRef.current.uniforms.positions.value = target.texture
    renderRef.current.uniforms.uTime.value = state.clock.elapsedTime
    renderRef.current.uniforms.uFocus.value = THREE.MathUtils.lerp(renderRef.current.uniforms.uFocus.value, focus, 0.1)
    renderRef.current.uniforms.uFov.value = THREE.MathUtils.lerp(renderRef.current.uniforms.uFov.value, fov, 0.1)
    renderRef.current.uniforms.uBlur.value = THREE.MathUtils.lerp(renderRef.current.uniforms.uBlur.value, (5.6 - aperture) * 9, 0.1)
    simRef.current.uniforms.uTime.value = state.clock.elapsedTime * speed
    simRef.current.uniforms.uCurlFreq.value = THREE.MathUtils.lerp(simRef.current.uniforms.uCurlFreq.value, curl, 0.1)
    simRef.current.uniforms.uScroll.value = THREE.MathUtils.lerp(simRef.current.uniforms.uScroll.value, scroll, 0.1)
    
    // Sinkronisasi posisi kamera untuk kalkulasi raycast shader 3D
    simRef.current.uniforms.uCameraPos.value.copy(state.camera.position)

    // Interactive Mouse Scattering
    state.raycaster.setFromCamera(state.pointer, state.camera);
    // Align normal plane to camera relative rotation
    dummyPlane.normal.set(0, 0, 1).applyQuaternion(state.camera.quaternion);
    state.raycaster.ray.intersectPlane(dummyPlane, intersectPoint);

    if (intersectPoint) {
      // Pergerakan target mouse dibuat mengambang (trailing effect) layaknya momentum scroll Lenis
      // Tidak instan/mentah ke kursor, tapi mengikuti perlahan dari kejauhan
      simRef.current.uniforms.uMouse.value.lerp(intersectPoint, 0.015);

      const isHovering = (Math.abs(state.pointer.x) > 0.01 || Math.abs(state.pointer.y) > 0.01) ? 1.0 : 0.0;

      // Transition drag dan kecepatan hover di-set ultra-smooth
      const currentHover = simRef.current.uniforms.uHover.value;
      if (isHovering === 1.0) {
        // Naik ke bentuk menyebar dengan kurva yang lebih lambat, bukan seketika teracak liar
        simRef.current.uniforms.uHover.value = THREE.MathUtils.lerp(currentHover, 1.0, 1.0);
      } else {
        // Sangat pelan kembali ke shape awal saat pointer pergi (floaty)
        simRef.current.uniforms.uHover.value = THREE.MathUtils.lerp(currentHover, 0.0, 0.01);
      }
    } else {
      simRef.current.uniforms.uHover.value = THREE.MathUtils.lerp(simRef.current.uniforms.uHover.value, 0.0, 0.01);
    }
  })
  return (
    <>
      {/* Simulation goes into a FBO/Off-buffer */}
      {createPortal(
        <mesh>
          <simulationMaterial ref={simRef} />
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
            <bufferAttribute attach="attributes-uv" count={uvs.length / 2} array={uvs} itemSize={2} />
          </bufferGeometry>
        </mesh>,
        scene
      )}
      {/* The result of which is forwarded into a pointcloud via data-texture */}
      <points {...props}>
        <dofPointsMaterial ref={renderRef} />
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particles.length / 3} array={particles} itemSize={3} />
        </bufferGeometry>
      </points>
    </>
  )
}

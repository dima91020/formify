'use client'

import { useEffect, useRef } from "react";

interface Particle {
  angle: number;
  orbitRadius: number;
  width: number;
  height: number;
  pulsePhase: number;
}

const CONFIG = {
  particleCount: 400,
  radiusFactor: 0.5,
  speedTime: 0.007,
  mouseSpeed: 0.02,
  particleSize: {
    widthMax: 9,
    heightMax: 4,
    widthMin: 3,
    heightMin: 1,
  },
};

const GRADIENT_STOPS = [
  { p: 0.00, c: { r: 23, g: 78, b: 166 } },
  { p: 0.45, c: { r: 23, g: 78, b: 166 } },
  { p: 0.52, c: { r: 160, g: 50, b: 200 } },
  { p: 0.58, c: { r: 234, g: 43, b: 53 } },
  { p: 0.64, c: { r: 250, g: 120, b: 20 } },
  { p: 0.70, c: { r: 251, g: 188, b: 5 } },
  { p: 0.76, c: { r: 140, g: 190, b: 40 } },
  { p: 0.82, c: { r: 52, g: 168, b: 83 } },
  { p: 0.90, c: { r: 30, g: 190, b: 200 } },
  { p: 0.96, c: { r: 23, g: 78, b: 166 } },
  { p: 1.00, c: { r: 23, g: 78, b: 166 } },
];

const getColor = (progress: number) => {
  let p = progress % 1;
  if (p < 0) p += 1;

  for (let i = 0; i < GRADIENT_STOPS.length - 1; i++) {
    const curr = GRADIENT_STOPS[i];
    const next = GRADIENT_STOPS[i + 1];

    if (p >= curr.p && p <= next.p) {
      const t = (p - curr.p) / (next.p - curr.p);
      const easeT = t * t * (3 - 2 * t);

      return {
        r: Math.round(curr.c.r + (next.c.r - curr.c.r) * easeT),
        g: Math.round(curr.c.g + (next.c.g - curr.c.g) * easeT),
        b: Math.round(curr.c.b + (next.c.b - curr.c.b) * easeT),
      };
    }
  }

  return GRADIENT_STOPS[0].c;
};

const COLOR_LUT_SIZE = 512;
const COLOR_LUT: string[] = Array.from({ length: COLOR_LUT_SIZE }, (_, i) => {
  const color = getColor(i / COLOR_LUT_SIZE);
  return `rgb(${color.r},${color.g},${color.b})`;
});

const getFastColor = (progress: number): string => {
  let p = progress % 1;
  if (p < 0) p += 1;
  const index = (p * COLOR_LUT_SIZE) | 0;
  return COLOR_LUT[index % COLOR_LUT_SIZE];
};

const createParticles = (maxRadius: number) => {
  const particles: Particle[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < CONFIG.particleCount; i++) {
    const angle = i * goldenAngle;
    const t = (i + 1) / CONFIG.particleCount;
    const orbitRadius = maxRadius * Math.pow(t, 0.4);

    particles.push({
      angle,
      orbitRadius,
      width: CONFIG.particleSize.widthMin + (CONFIG.particleSize.widthMax - CONFIG.particleSize.widthMin) * Math.random(),
      height: CONFIG.particleSize.heightMin + (CONFIG.particleSize.heightMax - CONFIG.particleSize.heightMin) * Math.random(),
      pulsePhase: Math.PI * 2 * Math.random(),
    });
  }

  return particles;
};

const drawParticle = (
  ctx: CanvasRenderingContext2D,
  p: Particle,
  time: number,
  center: { x: number, y: number },
  maxRadius: number,
  mouseDx: number,
  mouseDy: number,
  mouseSpeed: number,
) => {
  const currentAngle = p.angle + Math.sin(time + p.pulsePhase) * 0.04;
  const breathing =
    1 +
    0.18 * Math.sin(currentAngle * 2 + time * 0.9) +
    0.12 * Math.cos(currentAngle * 3 - time * 0.7) +
    0.08 * Math.sin(currentAngle * 5 + time * 1.2);

  const dynamicRadius = p.orbitRadius * breathing;
  const moveAngle = Math.atan2(mouseDx, mouseDy);
  const angleDiff = Math.cos(currentAngle - moveAngle);
  const stretch = mouseSpeed > 1 ? angleDiff * mouseSpeed * 0.35 : 0;
  const finalRadius = Math.max(10, dynamicRadius + stretch);

  const x = center.x + Math.cos(currentAngle) * finalRadius;
  const y = center.y + Math.sin(currentAngle) * finalRadius;

  const currentDistRatio = Math.max(0, Math.min(1, finalRadius / (maxRadius * 1.2)));

  const sinVal = Math.sin(currentDistRatio * Math.PI);
  const sin2 = sinVal * sinVal;
  const shapeCurve = sin2 * sin2 * sin2;

  const sizeScale = 0.12 + 0.88 * shapeCurve;
  const heightScale = 0.2 + 0.8 * shapeCurve;
  const thicknessPulse = 1 + Math.sin(time * 3 + p.pulsePhase) * 0.25;

  const finalWidth = Math.max(1.5, p.width * sizeScale);
  let finalHeight = Math.max(1.5, p.height * heightScale * thicknessPulse);
  if (finalWidth < finalHeight) finalHeight = finalWidth;

  const normalizedAngle = (currentAngle + Math.PI * 2) / (Math.PI * 2);
  const globalProgress = normalizedAngle + time * 0.15 + currentDistRatio * 0.1;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(currentAngle);
  ctx.fillStyle = getFastColor(globalProgress);
  ctx.beginPath();
  ctx.roundRect(-finalWidth / 2, -finalHeight / 2, finalWidth, finalHeight, finalWidth);
  ctx.fill();
  ctx.restore();
};

export default function LiquidMateria() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
  const materiaCenterRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const initialPosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    mouseRef.current = { ...initialPosition };
    materiaCenterRef.current = { ...initialPosition };

    let animationFrameId: number;
    let particles: Particle[] = [];
    let maxRadius = 0;
    let time = 0;

    const handleResize = () => {
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * pixelRatio;
      canvas.height = window.innerHeight * pixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(pixelRatio, pixelRatio);

      maxRadius = Math.min(window.innerWidth, window.innerHeight) * CONFIG.radiusFactor;
      particles = createParticles(maxRadius);
    };

    const animate = () => {
      time += CONFIG.speedTime;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const dx = mouseRef.current.x - materiaCenterRef.current.x;
      const dy = mouseRef.current.y - materiaCenterRef.current.y;
      const speed = Math.hypot(dx, dy);

      materiaCenterRef.current.x += dx * CONFIG.mouseSpeed;
      materiaCenterRef.current.y += dy * CONFIG.mouseSpeed;

      const center = materiaCenterRef.current;

      for (let i = 0; i < particles.length; i++) {
        drawParticle(
          ctx,
          particles[i],
          time,
          center,
          maxRadius,
          dx,
          dy,
          speed
        );
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current = { x: event.clientX, y: event.clientY };
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    handleResize();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        backgroundColor: "transparent",
        opacity: 0.85,
        zIndex: 1,
        filter: "blur(0.3)",
      }}
    />
  );
}
// src/logic/neuroLogic.js
export const calculatePulse = (vp, p, n, d, vd) => {
  // Weights: Very Productive (1.0) to Very Distracting (-0.5) [cite: 78]
  const pulse = ( (vp * 1.0) + (p * 0.7) + (n * 0.4) + (d * 0.0) + (vd * -0.5) );
  return Math.min(100, Math.max(0, pulse));
};

export const getBreakDuration = (workSeconds) => Math.floor(workSeconds * 0.20); // 20% Ratio [cite: 15]
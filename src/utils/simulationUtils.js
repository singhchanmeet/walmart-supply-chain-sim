// Shared simulation constants and utilities
export const WALMART_BLUE = '#0071ce';
export const WALMART_YELLOW = '#ffc220';
export const WALMART_ORANGE = '#ff6900';
export const TRUCK_SPEED = 0.02;
export const FORKLIFT_SPEED = 0.015;
export const WORKER_SPEED = 0.008;

export const lerp = (start, end, t) => start + (end - start) * t;
export const generateId = () => Date.now() + Math.random(); 
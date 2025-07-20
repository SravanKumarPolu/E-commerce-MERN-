import { useState, useEffect } from 'react';

interface PerformanceMode {
  isLowPerformance: boolean;
  reducedAnimations: boolean;
  particleCount: number;
}

export const usePerformanceMode = (): PerformanceMode => {
  const [performanceMode, setPerformanceMode] = useState<PerformanceMode>({
    isLowPerformance: false,
    reducedAnimations: false,
    particleCount: 20
  });

  useEffect(() => {
    const detectPerformance = () => {
      // Check for hardware concurrency (CPU cores)
      const cores = navigator.hardwareConcurrency || 4;
      
      // Check for device memory
      const memory = (navigator as any).deviceMemory || 4;
      
      // Check for connection speed
      const connection = (navigator as any).connection;
      const isSlowConnection = connection && (
        connection.effectiveType === 'slow-2g' ||
        connection.effectiveType === '2g' ||
        connection.effectiveType === '3g'
      );
      
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // Determine if device is low performance
      const isLowPerformance = cores <= 2 || memory <= 2 || isSlowConnection || prefersReducedMotion;
      
      setPerformanceMode({
        isLowPerformance,
        reducedAnimations: isLowPerformance || prefersReducedMotion,
        particleCount: isLowPerformance ? 8 : 20
      });
    };

    detectPerformance();
    
    // Listen for changes in reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => detectPerformance();
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return performanceMode;
}; 
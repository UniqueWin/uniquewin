import React, { useState, useEffect, useRef } from 'react';

interface CustomSliderProps {
  min: number;
  max: number;
  steps: number[];
  value: number;
  onChange: (value: number) => void;
}

export const CustomSlider: React.FC<CustomSliderProps> = ({ min, max, steps, value, onChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const getPositionFromIndex = (index: number) => {
    return (index / (steps.length - 1)) * 100;
  };

  const getIndexFromPosition = (position: number) => {
    const index = Math.round((position / 100) * (steps.length - 1));
    return Math.max(0, Math.min(steps.length - 1, index));
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    updateValue(event);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (isDragging) {
      updateValue(event);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateValue = (event: MouseEvent | React.MouseEvent) => {
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const position = ((event.clientX - rect.left) / rect.width) * 100;
      const index = getIndexFromPosition(position);
      onChange(steps[index]);
    }
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const currentIndex = steps.indexOf(value);

  return (
    <div className="relative w-full h-6 mb-10">
      <div
        ref={sliderRef}
        className="absolute top-2 left-0 right-0 h-2 bg-gray-200 rounded-full cursor-pointer"
        onMouseDown={handleMouseDown}
      >
        <div
          className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
          style={{ width: `${getPositionFromIndex(currentIndex)}%` }}
        ></div>
        <div
          className="absolute top-1/2 w-4 h-4 bg-blue-600 rounded-full -mt-2 -ml-2"
          style={{ left: `${getPositionFromIndex(currentIndex)}%` }}
        ></div>
      </div>
      {steps.map((step, index) => (
        <div
          key={step}
          className="absolute top-6 transform -translate-x-1/2"
          style={{ left: `${getPositionFromIndex(index)}%` }}
        >
          <div className="w-0.5 h-2 bg-gray-300 mx-auto"></div>
          <span className={`text-xs ${step % 1000 === 0 ? "font-bold" : ""}`}>
            £{step}
          </span>
        </div>
      ))}
    </div>
  );
};
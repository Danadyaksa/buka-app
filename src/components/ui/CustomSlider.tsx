"use client";

import React from 'react';

interface CustomSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  valueDisplay?: string | number;
  onChange: (value: number) => void;
  onConfirm?: () => void;
  className?: string;
}

export const CustomSlider: React.FC<CustomSliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  valueDisplay,
  onChange,
  onConfirm,
  className = '',
}) => {
  return (
    <div className={`w-full flex flex-col gap-2.5 px-4 py-2 ${className}`}>
      {/* Title & Numeric Display & Confirm Checkmark */}
      <div className="flex items-center justify-between text-xs font-bold tracking-wider text-neutral-800 uppercase">
        <div className="flex items-center gap-2">
          <span>{label}</span>
          {valueDisplay !== undefined && (
            <span className="text-[#ff2b6d] font-semibold lowercase">
              {valueDisplay}
            </span>
          )}
        </div>

        {onConfirm && (
          <button
            type="button"
            onClick={onConfirm}
            className="w-7 h-7 rounded-full bg-[#ff2b6d] text-white flex items-center justify-center shadow-sm hover:bg-[#e0245e] active:scale-95 transition-all"
            title="Confirm"
          >
            <svg
              className="w-4 h-4 stroke-[3]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Slider Range */}
      <div className="relative flex items-center py-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="ios-slider w-full cursor-pointer"
        />
      </div>
    </div>
  );
};

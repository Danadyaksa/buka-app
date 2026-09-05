"use client";

import React from 'react';
import { useCollage } from '@/context/CollageContext';

export const TextOverlay: React.FC = () => {
  const { textElements, updateTextElement, deleteTextElement } = useCollage();

  if (textElements.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {textElements.map((item) => (
        <div
          key={item.id}
          style={{
            position: 'absolute',
            left: `${item.x}%`,
            top: `${item.y}%`,
            transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
            fontFamily: item.font,
            fontSize: `${item.fontSize}px`,
            color: item.color,
            letterSpacing: `${item.letterSpacing}px`,
            lineHeight: item.lineHeight,
            textAlign: item.align,
          }}
          className="pointer-events-auto cursor-move select-none p-1.5"
        >
          <span
            style={{
              backgroundColor: item.bgStyle === 'pill' || item.bgStyle === 'box' ? item.bgColor : 'transparent',
              padding: item.bgStyle === 'pill' ? '4px 14px' : item.bgStyle === 'box' ? '4px 8px' : '0',
              borderRadius: item.bgStyle === 'pill' ? '9999px' : item.bgStyle === 'box' ? '6px' : '0',
            }}
            className="inline-block whitespace-pre font-bold"
          >
            {item.text}
          </span>
        </div>
      ))}
    </div>
  );
};

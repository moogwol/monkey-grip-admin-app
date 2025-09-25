import React from 'react';
import styled from 'styled-components';

const BeltSvgContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`;

const BeltSvg = styled.svg`
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
`;

interface BeltGraphicProps {
  beltColor: string;
  stripes: number;
  size?: 'small' | 'medium' | 'large';
}

const sizeMap = {
  small: { width: 60, height: 20, stripeWidth: 3 },
  medium: { width: 80, height: 25, stripeWidth: 4 },
  large: { width: 100, height: 30, stripeWidth: 5 }
};

export const BeltGraphic: React.FC<BeltGraphicProps> = ({ 
  beltColor, 
  stripes, 
  size = 'medium' 
}) => {
  const { width, height, stripeWidth } = sizeMap[size];
  
  // Belt colors mapping
  const beltColors = {
    white: '#ffffff',
    blue: '#0066cc',
    purple: '#800080',
    brown: '#8b4513',
    black: '#000000'
  };

  const color = beltColors[beltColor as keyof typeof beltColors] || beltColor;
  const strokeColor = beltColor === 'white' ? '#ccc' : 'none';
  
  // Panel color: red for black belts, black for all others
  const panelColor = beltColor === 'black' ? '#cc0000' : '#000000';
  
  // Black panel dimensions (where stripes go) - always present
  const panelWidth = Math.min(width * 0.35, 30); // 35% of belt width, max 30px
  const panelStart = width - panelWidth - 6; // Leave some space from the end
  
  // Calculate stripe positions within the panel
  const stripeSpacing = panelWidth / (stripes + 1);
  
  return (
    <BeltSvgContainer>
      <BeltSvg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Main belt rectangle */}
        <rect
          x="2"
          y="2"
          width={width - 4}
          height={height - 4}
          fill={color}
          stroke={strokeColor}
          strokeWidth={strokeColor ? 1 : 0}
          rx="2"
        />
        
        {/* Panel for stripes (always present) */}
        <rect
          x={panelStart}
          y="2"
          width={panelWidth}
          height={height - 4}
          fill={panelColor}
          rx="2"
        />
        
        {/* Stripes on the black panel */}
        {Array.from({ length: stripes }, (_, i) => (
          <rect
            key={i}
            x={panelStart + (stripeSpacing * (i + 1)) - (stripeWidth / 2)}
            y="4"
            width={stripeWidth}
            height={height - 8}
            fill="#ffffff"
            rx="0.5"
          />
        ))}
        
        {/* Belt texture/stitching lines */}
        <line
          x1="4"
          y1="4"
          x2={width - 4}
          y2="4"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="0.5"
        />
        <line
          x1="4"
          y1={height - 4}
          x2={width - 4}
          y2={height - 4}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="0.5"
        />
        
        {/* Stitching around black panel */}
        {stripes > 0 && (
          <>
            <line
              x1={panelStart}
              y1="4"
              x2={panelStart}
              y2={height - 4}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="0.5"
            />
            <line
              x1={panelStart + panelWidth}
              y1="4"
              x2={panelStart + panelWidth}
              y2={height - 4}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="0.5"
            />
          </>
        )}
      </BeltSvg>
    </BeltSvgContainer>
  );
};

// Alternative: Simple stripe-only component for compact display
export const BeltStripes: React.FC<{ stripes: number; color?: string }> = ({ 
  stripes, 
  color = '#ffffff' 
}) => (
  <BeltSvgContainer>
    {Array.from({ length: stripes }, (_, i) => (
      <BeltSvg key={i} width="8" height="20" viewBox="0 0 8 20">
        <rect
          x="1"
          y="2"
          width="6"
          height="16"
          fill={color}
          rx="1"
          stroke="rgba(0,0,0,0.2)"
          strokeWidth="0.5"
        />
      </BeltSvg>
    ))}
  </BeltSvgContainer>
);
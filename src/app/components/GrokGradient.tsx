import React from 'react';

interface RadialGradientProps {
  title?: string;
  className?: string;
}

const RadialGradient: React.FC<RadialGradientProps> = ({ 
  title = "", 
  className = "" 
}) => {
  const gradientStyle: React.CSSProperties = {
    margin: 0,
    padding: 0,
    height: '100vh',
    background: `radial-gradient(
      ellipse 800px 600px at 95% 50%,
      rgba(255, 220, 150, 0.8) 0%,
      rgba(255, 180, 80, 0.6) 15%,
      rgba(255, 140, 60, 0.4) 30%,
      rgba(100, 60, 40, 0.3) 50%,
      rgba(40, 30, 25, 0.8) 70%,
      rgba(20, 15, 12, 0.95) 85%,
      rgba(0, 0, 0, 1) 100%
    )`,
    overflow: 'hidden'
  };

  const contentStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'var(--font-instrument-serif), serif',
    textAlign: 'center',
    zIndex: 10
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '4rem',
    fontWeight: 300,
    margin: 0,
    opacity: 0.7,
    letterSpacing: '0.1em',
    fontFamily: 'var(--font-geist-mono), monospace'
  };

  return (
    <div style={gradientStyle} className={className}>
      <div style={contentStyle}>
        <h1 style={titleStyle}>{title}</h1>
      </div>
    </div>
  );
};

export default RadialGradient;
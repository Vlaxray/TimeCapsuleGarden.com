import React from 'react';

const Nebbia = () => {
  return (
    <div style={{
      position: 'absolute',
      width: '100%',
      height: '100%',
      zIndex: -2,
      overflow: 'hidden',
      pointerEvents: 'none',
    }}>
      <svg width="100%" height="100%">
        <defs>
          <filter id="blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="30" />
          </filter>
        </defs>
        <circle cx="30%" cy="40%" r="200" fill="#ffffff0f" filter="url(#blur)">
          <animate attributeName="cx" values="30%;35%;30%" dur="25s" repeatCount="indefinite" />
        </circle>
        <circle cx="70%" cy="60%" r="300" fill="#ffffff0a" filter="url(#blur)">
          <animate attributeName="cy" values="60%;65%;60%" dur="35s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
};

export default Nebbia;

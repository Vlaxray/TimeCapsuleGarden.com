import React from 'react';
import './Lucciole.css';

const Lucciole = () => {
  const count = 20;
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const style = {
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 10}s`,
        };
        return <div key={i} className="firefly" style={style}></div>;
      })}
    </>
  );
};

export default Lucciole;

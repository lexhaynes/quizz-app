import React from 'react';
import './ProgressIndicator.scss';

export default function ProgressIndicator({progress}) {
  const scale = progress/100;
  return (
    <div className="progress-indicator">
      <div className="progress-indicator-track">
        <div className={`progress-indicator-fill`} style={{transform: "scaleX("+scale+")"}}></div>
      </div>
    </div>
  )
};


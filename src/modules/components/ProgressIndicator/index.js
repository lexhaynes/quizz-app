import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import './ProgressIndicator.scss';

export default function ProgressIndicator({progress}) {
  return <ProgressBar 
    animated now={progress} 
    variant="secondary"
    className="progress-indicator fixed-top"
  />    
};


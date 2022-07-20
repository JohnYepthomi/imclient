import React from 'react';
import '../styles/loadingspinner.css'

export default function LoadingSpiner({submitted}) {
  return (
    submitted ? 
        <div style={{visibility: 'visible'}}><div className="lds-ripple"><div></div><div></div></div></div>
    : 
        <div style={{visibility: 'hidden'}}><div className="lds-ripple"><div></div><div></div></div></div>
  )
}

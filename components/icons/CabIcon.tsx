
import React from 'react';

const CabIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25H16.5M5.25 12.75H18.75M3 17.25H21M3.75 12.75c0-1.5 1.5-2.25 3-2.25h6.75c1.5 0 3 .75 3 2.25M3.75 12.75v3.75c0 .621.504 1.125 1.125 1.125h14.25c.621 0 1.125-.504 1.125-1.125V12.75M3.75 12.75L3 17.25h18l-.75-4.5M6 12.75h.008v.008H6v-.008zm12 0h.008v.008H18v-.008z" />
  </svg>
);

export default CabIcon;

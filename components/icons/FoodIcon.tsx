
import React from 'react';

const FoodIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 12.25c0 .414-.336.75-.75.75H3c-.414 0-.75-.336-.75-.75S2.586 11.5 3 11.5h18c.414 0 .75.336.75.75zM2.25 12.25a.75.75 0 010-1.5M4.5 5.25a.75.75 0 010-1.5M19.5 5.25a.75.75 0 010-1.5M2.25 7.25a.75.75 0 010-1.5M4.5 17.25a.75.75 0 010-1.5M19.5 17.25a.75.75 0 010-1.5M2.25 15.25a.75.75 0 010-1.5M4.5 9.25a.75.75 0 010-1.5M19.5 9.25a.75.75 0 010-1.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.75c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z" />
  </svg>
);

export default FoodIcon;

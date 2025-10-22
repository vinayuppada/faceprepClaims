
import React from 'react';

const LaundryIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 5.182a4.5 4.5 0 016.364 0 4.5 4.5 0 010 6.364l-7.5 7.5a4.5 4.5 0 01-6.364-6.364l7.5-7.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.818 15.818a4.5 4.5 0 01-6.364 0 4.5 4.5 0 010-6.364l.5-.5M15.182 5.182l-6.364 6.364" />
    </svg>
);

export default LaundryIcon;

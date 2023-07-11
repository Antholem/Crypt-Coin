import { Box } from '@mui/material';
import React from 'react';

const Loading = () => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
                <linearGradient id="gradient" gradientTransform="rotate(25)">
                    <stop offset="0%" stopColor="#2600fc" />
                    <stop offset="100%" stopColor="#ff00ea" />
                </linearGradient>
                <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                >
                    <animate attributeName="stroke-dashoffset" repeatCount="indefinite" dur="1.5s" keyTimes="0;1" values="0;256" />
                    <animateTransform
                        attributeName="transform"
                        attributeType="XML"
                        type="rotate"
                        from="0 12 12"
                        to="360 12 12"
                        repeatCount="indefinite"
                        dur="1.5s"
                    />
                </circle>
            </svg>
        </Box>
    );
};

export default Loading;

import React, { useState } from 'react';

export const TrackerToggle: React.FC = () => {
    const [enabled, setEnabled] = useState(true);

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 12px',
                backgroundColor: enabled ? '#e8f0fe' : '#f1f3f4',
                border: `1px solid ${enabled ? '#1a73e8' : '#dadce0'}`,
                borderRadius: '18px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500',
                color: enabled ? '#1a73e8' : '#5f6368',
                transition: 'all 0.2s ease-in-out',
                userSelect: 'none',
                height: '24px'
            }}
            onClick={() => setEnabled(!enabled)}
        >
            <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: enabled ? '#1a73e8' : '#5f6368',
            }} />
            <span>{enabled ? 'Tracking ON' : 'Tracking OFF'}</span>
        </div>
    );
};

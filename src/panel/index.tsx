import React from 'react';
import { createRoot } from 'react-dom/client';
import Panel from './Panel.tsx';

console.log('Panel script loading...');

const container = document.getElementById('root');
console.log('Root container:', container);

if (container) {
    try {
        const root = createRoot(container);
        console.log('React root created');
        root.render(<Panel />);
        console.log('Panel rendered');
    } catch (error) {
        console.error('Error rendering panel:', error);
    }
} else {
    console.error('Root container not found!');
}

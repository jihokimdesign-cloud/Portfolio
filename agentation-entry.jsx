import React from 'react';
import { createRoot } from 'react-dom/client';
import { Agentation } from 'agentation';

const container = document.getElementById('agentation-root');
const root = createRoot(container);
root.render(React.createElement(Agentation));

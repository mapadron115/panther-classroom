import React from 'react';
import { createRoot } from 'react-dom/client';
import Classroom from '../app/page';
import '../app/globals.css';

createRoot(document.getElementById('root')!).render(<React.StrictMode><Classroom /></React.StrictMode>);

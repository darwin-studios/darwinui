import React from 'react';
import { DarwinUICatalog } from '@darwinui/catalog';
import { createRoot } from 'react-dom/client';

import '@darwinui/react/styles.css';

createRoot(document.getElementById('root')!).render(<DarwinUICatalog />);

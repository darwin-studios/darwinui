import { createRoot } from 'react-dom/client';
import { DarwinUIProvider } from '@darwinui/react';
import { GenerativeThreadDemo } from '@darwinui/catalog/generative';
import '@darwinui/react/styles.css';
createRoot(document.getElementById('root')!).render(<DarwinUIProvider><main className="dui-catalog"><h1>Generative agent thread</h1><GenerativeThreadDemo userId="joanne"/></main></DarwinUIProvider>);

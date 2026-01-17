import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import './index.css';
import { router } from './routes/router';
import { Provider } from 'react-redux';
import store from './store/store';
import { AuthProvider } from './auth/authContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ReactFlowProvider } from '@xyflow/react';
import { DnDProvider } from './features/flowCrafter/context/DnDContext';
import { ToastProvider } from './contexts/toastContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SettingsProvider } from './contexts/SettingsContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <Provider store={store}>
          <AuthProvider>
            <SettingsProvider>
              <ReactFlowProvider>
                <DndProvider backend={HTML5Backend}>
                  <DnDProvider>
                    <RouterProvider router={router} />
                  </DnDProvider>
                </DndProvider>
              </ReactFlowProvider>
            </SettingsProvider>
          </AuthProvider>
        </Provider>
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
);

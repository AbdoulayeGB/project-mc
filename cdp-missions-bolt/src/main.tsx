import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Configuration pour désactiver les avertissements React Router
const originalWarn = console.warn;
console.warn = (...args) => {
  const warningMessage = args.join(' ');
  
  // Ignorer les avertissements React Router
  if (warningMessage.includes('React Router Future Flag Warning') ||
      warningMessage.includes('v7_startTransition') ||
      warningMessage.includes('v7_relativeSplatPath')) {
    return;
  }
  
  // Afficher les autres avertissements normalement
  originalWarn.apply(console, args);
};

// Gestionnaire d'erreurs global pour filtrer les erreurs des extensions
const originalError = console.error;
console.error = (...args) => {
  const errorMessage = args.join(' ');
  
  // Ignorer les erreurs des extensions Chrome
  if (errorMessage.includes('chrome-extension://') || 
      errorMessage.includes('i18next:') ||
      errorMessage.includes('message port closed') ||
      errorMessage.includes('runtime.lastError')) {
    return;
  }
  
  // Afficher les autres erreurs normalement
  originalError.apply(console, args);
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
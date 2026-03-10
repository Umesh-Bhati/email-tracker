import React from 'react';
import { createRoot } from 'react-dom/client';
import { TrackerToggle } from './components/TrackerToggle';

/**
 * This is the Content Script that runs inside mail.google.com
 */

console.log('[Email Tracker] Content Script Initialized');

// The MutationObserver allows us to watch for changes in the Gmail DOM.
// Gmail is a Single Page App (SPA), so we need to watch for the "Compose" window appearing.
const observer = new MutationObserver(() => {
    checkForComposeWindow();
});

function checkForComposeWindow() {
    // Gmail's compose window container
    const composeWindows = document.querySelectorAll('div[role="dialog"][aria-label]');

    composeWindows.forEach((win) => {
        // Check if we already injected our UI into this specific window
        if (!win.hasAttribute('data-tracker-injected')) {
            const toolbar = win.querySelector('div.btC'); // Gmail's bottom toolbar class
            if (toolbar) {
                win.setAttribute('data-tracker-injected', 'true');
                console.log('[Email Tracker] Injecting React UI into Compose Window');
                injectReactUI(toolbar as HTMLElement);
            }
        }
    });
}

function injectReactUI(toolbar: HTMLElement) {
    // 1. Create a container for our Shadow DOM
    const container = document.createElement('div');
    container.id = 'email-tracker-root-container';
    container.style.display = 'inline-block';

    // 2. Attach Shadow Root to isolate styles
    const shadowRoot = container.attachShadow({ mode: 'open' });

    // 3. Create a wrapper inside the shadow root where React will mount
    const reactRoot = document.createElement('div');
    shadowRoot.appendChild(reactRoot);

    // 4. Prepend to the Gmail toolbar
    toolbar.prepend(container);

    // 5. Initialize React
    const root = createRoot(reactRoot);
    root.render(<TrackerToggle />);
}

// Start watching the document body for changes
observer.observe(document.body, {
    childList: true,
    subtree: true
});

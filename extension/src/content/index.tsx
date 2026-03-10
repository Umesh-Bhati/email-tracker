import { createRoot } from 'react-dom/client';
import { TrackerToggle } from './components/TrackerToggle';

/**
 * This is the Content Script that runs inside mail.google.com
 */

console.log('[Email Tracker] Content Script Initialized');

const observer = new MutationObserver(() => {
    checkForComposeWindow();
});

function checkForComposeWindow() {
    const composeWindows = document.querySelectorAll('div[role="dialog"][aria-label]');

    composeWindows.forEach((win) => {
        if (!win.hasAttribute('data-tracker-injected')) {
            const toolbar = win.querySelector('div.btC');
            if (toolbar) {
                win.setAttribute('data-tracker-injected', 'true');
                console.log('[Email Tracker] Injecting React UI and attaching listeners');

                injectReactUI(toolbar as HTMLElement);
                attachSendListener(win as HTMLElement);
            }
        }
    });
}

function injectReactUI(toolbar: HTMLElement) {
    const container = document.createElement('div');
    container.id = 'email-tracker-root-container';
    container.style.display = 'inline-block';

    const shadowRoot = container.attachShadow({ mode: 'open' });
    const reactRoot = document.createElement('div');
    shadowRoot.appendChild(reactRoot);

    toolbar.prepend(container);

    const root = createRoot(reactRoot);
    root.render(<TrackerToggle />);
}

function attachSendListener(composeWin: HTMLElement) {
    // Find the Send button - it usually has the string "Send" in a tooltip or aria-label
    // Or it's the primary button in the toolbar
    const sendButton = composeWin.querySelector('div[role="button"][data-tooltip*="Send"]');

    if (sendButton) {
        sendButton.addEventListener('click', async () => {
            // Check if tracking is enabled via chrome.storage
            const { trackingEnabled } = await chrome.storage.local.get(['trackingEnabled']);

            if (trackingEnabled === false) {
                console.log('[Email Tracker] Tracking is disabled, skipping...');
                return;
            }

            console.log('[Email Tracker] Intercepting Send...');
            handleEmailSent(composeWin);
        });
    }
}

async function handleEmailSent(composeWin: HTMLElement) {
    // 1. Scrape standard Gmail fields
    const recipient = (composeWin.querySelector('input[name="to"]') as HTMLInputElement)?.value || 'unknown@example.com';
    const subject = (composeWin.querySelector('input[name="subjectbox"]') as HTMLInputElement)?.value || '(No Subject)';
    const body = composeWin.querySelector('div[role="textbox"][aria-label="Message Body"]');

    if (!body) return;

    // 2. Generate unique tracking ID
    const emailId = crypto.randomUUID();

    // 3. Inject Tracking Pixel (1x1 transparent GIF)
    // IMPORTANT: Our backend URL needs to be dynamic or configured.
    // We'll use localhost:3000 for development.
    const trackingPixelUrl = `http://localhost:3000/api/t.gif?email_id=${emailId}`;
    const pixelImg = `<img src="${trackingPixelUrl}" width="1" height="1" style="display:none !important;" />`;

    // Append to body (Gmails body is contenteditable)
    body.innerHTML += pixelImg;

    // 4. Register with Backend
    // In a real app, you'd get the user_id from auth.
    // For now, we'll use a hardcoded dev user_id.
    try {
        await fetch('http://localhost:3000/api/emails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: '00000000-0000-0000-0000-000000000000', // Placeholder
                message_id: 'gmail-' + Date.now(),
                subject: subject,
                recipient: recipient
            })
        });
        console.log('[Email Tracker] Email registered and pixel injected!');
    } catch (err) {
        console.error('[Email Tracker] Failed to register email:', err);
    }
}

observer.observe(document.body, {
    childList: true,
    subtree: true
});

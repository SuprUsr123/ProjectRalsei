// Pixel UI enhancements adapted from the supplied working userscripts.
// Runs in the MAIN world so window.createNew(size) calls Pixel's app function.
(function () {
    'use strict';

    // Pixel Menu Button 2.0
    function injectGridToggle() {
        const menuBar = document.querySelector('.menu-bar');
        if (!menuBar || document.getElementById('tm-grid-toggle-btn')) return;

        const button = document.createElement('button');
        button.id = 'tm-grid-toggle-btn';
        button.className = 'menu-btn';
        button.type = 'button';
        button.textContent = 'Hide Grid';

        button.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();

            const gridCanvas = document.getElementById('grid-canvas');
            if (!gridCanvas) return;

            if (gridCanvas.style.visibility === 'hidden') {
                gridCanvas.style.visibility = 'visible';
                button.textContent = 'Hide Grid';
            } else {
                gridCanvas.style.visibility = 'hidden';
                button.textContent = 'Show Grid';
            }
        });

        menuBar.appendChild(button);
    }

    // Pixel Drawer 128x128 Support 0.1, made resilient to KindleChat mode.
    function addDrawingSizes() {
        const modal = document.getElementById('new-drawing-modal');
        if (!modal) return;

        // Pixel's ?source=kindlechat mode deliberately hides the 64x64 button.
        // Restore it so all supported sizes are available from that entry point.
        const size64Button = document.getElementById('new-64-btn');
        if (size64Button) {
            size64Button.style.display = 'inline-block';
            size64Button.hidden = false;
        }

        // Do not use #new-64-btn as the insertion anchor: the app can hide it
        // for KindleChat links, and future app versions may omit that button.
        const sizeRow = modal.querySelector('.modal-box > div');
        if (!sizeRow) return;

        [128, 256].forEach((size) => {
            const id = `new-${size}-btn`;
            let button = document.getElementById(id);

            if (!button) {
                button = document.createElement('button');
                button.id = id;
                button.className = 'sys-btn';
                button.style.marginLeft = '10px';
                button.textContent = `${size}x${size}`;
                button.type = 'button';
                button.addEventListener('click', (event) => {
                    event.preventDefault();
                    if (typeof window.createNew === 'function') {
                        window.createNew(size);
                    }
                });
                sizeRow.appendChild(button);
            }

            button.style.display = 'inline-block';
            button.hidden = false;
        });
    }

    function applyEnhancements() {
        injectGridToggle();
        addDrawingSizes();
    }

    // Match the original menu userscript's retry period.
    const retryInterval = setInterval(applyEnhancements, 500);
    setTimeout(() => clearInterval(retryInterval), 10000);

    // Also handle Pixel creating/rebuilding the modal after async initialization.
    const observePage = () => {
        if (!document.body || window.__projectRalseiUiObserver) return;
        const observer = new MutationObserver(applyEnhancements);
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });
        window.__projectRalseiUiObserver = observer;
        applyEnhancements();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', observePage, { once: true });
    } else {
        observePage();
    }
})();

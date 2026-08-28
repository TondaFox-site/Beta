// foxbrowser.js - Jádro prohlížeče pro GitHub Pages

const urlInput = document.getElementById('urlInput');
const webFrame = document.getElementById('webFrame');
const loader = document.getElementById('loader');
const reloadBtn = document.getElementById('reloadBtn');

// Odchytání Enteru v adresním řádku
urlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        let input = urlInput.value.trim();
        if (!input) return;

        // Pokud to není přímo URL, udělám z toho hledání
        if (!input.includes('.') || input.includes(' ')) {
            input = `https://www.google.com/search?q=${encodeURIComponent(input)}`;
        } else if (!input.startsWith('http://') && !input.startsWith('https://')) {
            input = 'https://' + input;
        }

        loadPage(input);
    }
});

reloadBtn.addEventListener('click', () => {
    if (urlInput.value) loadPage(urlInput.value);
});

async function loadPage(targetUrl) {
    urlInput.value = targetUrl;
    loader.style.display = 'flex';

    try {
        // Stáhnutí kódu stránek přes CORS proxy
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`);
        const data = await response.json();

        if (data.contents) {
            let html = data.contents;

            // Oprava relativních cest (aby fungovaly obrázky a CSS)
            html = html.replace(/<head>/i, `<head><base href="${targetUrl}">`);

            // Odstranění skriptů, které by se snažily vyskočit z iframe (Frame busting)
            html = html.replace(/top\.location\s*=/gi, 'console.log=');
            html = html.replace(/parent\.location\s*=/gi, 'console.log=');

            // Vložení čistého kódu do okna
            webFrame.srcdoc = html;
        } else {
            showError("Stránka neposkytla žádná data.");
        }
    } catch (err) {
        showError("Chyba při načítání. Web blokuje veřejné přístupy.");
    } finally {
        loader.style.display = 'none';
    }
}

function showError(msg) {
    webFrame.srcdoc = `
        <body style="background:#121214; color:#fff; font-family:sans-serif; padding:40px; text-align:center;">
            <h2 style="color:#ff6000;">FoxBrowser Error</h2>
            <p style="margin-top:10px; color:#aaa;">${msg}</p>
        </body>
    `;
}

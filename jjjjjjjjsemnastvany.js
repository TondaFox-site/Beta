// jjjjjjjjsemnastvany.js - JádrO a Ochrana FoxOS

console.log("FoxOS Core: jjjjjjjjsemnastvany.js úspěšně načten!");

window.FoxOS = {
    // Systémový spouštěč aplikací
    openApp: function(appName, appUrl) {
        console.log(`Spouštím aplikaci: ${appName}`);
        const iframe = document.getElementById('foxbrowser-frame');
        if (iframe) {
            iframe.src = appUrl;
        }
    },
    
    // Ochrana před pádem systému
    handleError: function(msg) {
        console.warn("FoxOS zachytil chybový stav:", msg);
        const status = document.getElementById('fox-status');
        if (status) {
            status.innerText = "FoxOS Ochrana: Zamezeno pádu aplikace.";
            status.style.color = "#ff6000";
        }
    }
};

// Globální zachytávání chyb
window.onerror = function(message, source, lineno, colno, error) {
    FoxOS.handleError(message);
    return true; // Zamezí zobrazení chyby v konzoli a pádu okna
};

# Fox Windows App

Plnohodnotný desktopový Windows program, jehož rozhraní je vytvořené v HTML/CSS/JS a běží v Electronu.

## Co umí
- samostatné desktopové okno a vlastní menu
- lokální poznámky
- nastavení motivu a názvu
- klávesová zkratka Ctrl+N
- Start menu + zástupce na plochu
- NSIS `.exe` instalátor
- přenosná `.exe` verze
- bezpečný Electron preload/context isolation

## Jak vytvořit Windows instalátor
Na Windows 10/11:

```powershell
npm install
npm run dist:setup
```

Výsledný instalátor bude ve složce `release/`.

Pro portable verzi:

```powershell
npm run dist:portable
```

## Jak spustit bez instalace

```powershell
npm install
npm start
```

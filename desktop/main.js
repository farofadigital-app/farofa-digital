const path = require('node:path');
const { app, BrowserWindow } = require('electron');

function criarJanela() {
  const janela = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 760,
    minHeight: 600,
    backgroundColor: '#121826',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  janela.loadFile(path.join(__dirname, 'web', 'index.html'));
}

app.whenReady().then(() => {
  criarJanela();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) criarJanela();
  });
}).catch(erro => {
  console.error('N foi possível iniciar o Farofa Digital:', erro);
  app.quit();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

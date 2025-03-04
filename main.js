const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const path = require("path");

let mainWindow;
let backendProcess;

app.whenReady().then(() => {
  // Создаём окно Electron
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // Запускаем FastAPI
  const backendPath = path.join(
    __dirname,
    "backend",
    "venv",
    "Scripts",
    "python.exe"
  );
  backendProcess = spawn(backendPath, ["server.py"], {
    cwd: path.join(__dirname, "backend"),
  });

  backendProcess.stdout.on("data", (data) => console.log(`Backend: ${data}`));
  backendProcess.stderr.on("data", (data) =>
    console.error(`Backend Error: ${data}`)
  );

  // Загружаем Next.js
  mainWindow.loadURL("http://localhost:3000");

  mainWindow.on("closed", () => {
    if (backendProcess) backendProcess.kill();
    mainWindow = null;
  });
});

app.on("window-all-closed", () => {
  if (backendProcess) backendProcess.kill();
  if (process.platform !== "darwin") app.quit();
});

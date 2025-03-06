const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const path = require("path");
const waitOn = require("wait-on");
const kill = require("tree-kill");
require("dotenv").config();

let mainWindow;
let backendProcess;
let frontendServer;

app.whenReady().then(async () => {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  console.log("env: ", process.env.NODE_ENV);

  if (process.env.NODE_ENV === "development") {
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
  } else {
    let backendPath = path.join(
      process.resourcesPath,
      "app.asar.unpacked",
      "backend",
      "dist",
      "server.exe"
    );
    console.log(`Opening backend: ${backendPath}`);
    backendProcess = spawn(backendPath, { shell: true });
  }

  backendProcess.stdout.on("data", (data) => console.log(`Backend: ${data}`));
  backendProcess.stderr.on("data", (data) =>
    console.error(`Backend Error: ${data}`)
  );

  console.log("Waiting for FastAPI...");
  try {
    await waitOn({ resources: ["http://127.0.0.1:5000"], timeout: 20000 });
    console.log("FastAPI started.");
  } catch (err) {
    console.error("FastAPI failed to start:", err);
  }

  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:3000");
  } else {
    let frontendPath = path.join(
      process.resourcesPath,
      "app.asar.unpacked",
      "out"
    );
    console.log(`Opening frontend: ${frontendPath}`);

    frontendServer = spawn("npx", ["serve", "-s", frontendPath, "-l", "4000"], {
      shell: true,
    });

    frontendServer.stdout.on("data", (data) =>
      console.log(`Frontend: ${data}`)
    );
    frontendServer.stderr.on("data", (data) =>
      console.error(`Frontend Error: ${data}`)
    );

    console.log("Waiting for static server...");
    try {
      await waitOn({ resources: ["http://127.0.0.1:4000"], timeout: 20000 });
      console.log("Static server started.");
    } catch (err) {
      console.error("Static server failed to start:", err);
    }

    mainWindow.loadURL("http://localhost:4000");
  }

  mainWindow.on("closed", () => {
    if (backendProcess) kill(backendProcess.pid);
    if (frontendServer) kill(frontendServer.pid);
    mainWindow = null;
  });
});

app.on("window-all-closed", () => {
  if (backendProcess) kill(backendProcess.pid);
  if (frontendServer) kill(frontendServer.pid);
  if (process.platform !== "darwin") app.quit();
});

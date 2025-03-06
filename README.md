# PasswordApp

PasswordApp is a password manager built with **Electron**, **FastAPI**, and **React**. It provides an easy-to-use interface for managing your passwords securely. The application includes both a frontend (React) and a backend (FastAPI), and can be packaged as a desktop application using Electron.

## Features

- Store and manage your passwords securely.
- React-based frontend with a modern UI powered by Material UI.
- Electron packaging for cross-platform desktop applications.
- Python-based FastAPI backend for handling server-side logic.

## Technologies Used

- **Electron**: Cross-platform desktop app framework.
- **React**: Frontend library for building the user interface.
- **FastAPI**: Backend framework for building the server.
- **Next.js**: React framework for server-side rendering.
- **PyInstaller**: Packaging tool for Python applications.
- **Material UI**: Component library for styling the app.

## Getting Started

### Prerequisites

Make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (for frontend and Electron)
- [Python](https://www.python.org/) (for backend)
- [Poetry](https://python-poetry.org/) or another Python virtual environment tool (optional)
- [Git](https://git-scm.com/) (for version control)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/passwordapp.git
   cd passwordapp
   ```

2. Install dependencies:

   - For the frontend (React + Next.js):

     ```bash
     npm install
     ```

   - For the backend (Python + FastAPI):

     Create a virtual environment and install dependencies:

     ```bash
     cd backend
     python -m venv venv
     venv\Scripts\activate  # Windows
     pip install -r requirements.txt
     ```

### Running the Application

1. Start the frontend and backend in development mode:

   ```bash
   npm run dev
   ```

   This will:

   - Start the React frontend on `http://localhost:3000`
   - Launch Electron, which will open the desktop app.

2. To run the backend independently, you can use:

   ```bash
   npm run backend
   ```

### Building the Application

1. Build everything for production:

   ```bash
   npm run build:all
   ```

2. Build the frontend:

   ```bash
   npm run frontend:build
   ```

3. Build the backend:

   ```bash
   npm run backend:build
   ```

4. Build the Electron app:

   ```bash
   npm run electron:build
   ```

### Running the app in prod. mode

To start the app in prod:

```bash
npm run dev
```

This will activate the app and create .db and .key files if not exist.

### Linting

To run the linter:

```bash
npm run lint
```

## Adding an Icon to the Application

To add an icon to your Electron app, follow these steps:

### Step 1: Prepare the Icon Files

- For **Windows**, prepare an `.ico` file.
- For **macOS**, prepare an `.icns` file.
- For **Linux**, you can use a `.png` or other image formats.

### Step 2: Update `package.json`

In your `package.json`, add the following configuration for the `icon` in the `build` section:

```json
"build": {
  "asarUnpack": [
    "out/**",
    "backend/dist/server.exe"
  ],
  "files": [
    "main.js",
    "out/**",
    "backend/dist/**"
  ],
  "win": {
    "icon": "path/to/your/icon.ico"
  },
  "mac": {
    "icon": "path/to/your/icon.icns"
  }
}
```

Make sure to replace `path/to/your/icon.ico` with the actual path to your `.ico` file and `path/to/your/icon.icns` for macOS if needed.

### Step 3: Set the Icon in the Electron Window

In the `main.js` (or the file that initializes Electron), specify the icon for the main window:

```javascript
mainWindow = new BrowserWindow({
  width: 1000,
  height: 700,
  webPreferences: {
    nodeIntegration: true,
  },
});
```

## Contributing

1. Fork the repository.
2. Create a new branch for your feature (`git checkout -b feature-name`).
3. Make changes and commit them (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request.

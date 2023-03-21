# Setli

This app can easily connect to OBS via WebSocket to create a list of song titles and other information.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en/)
- [Rust](https://www.rust-lang.org/tools/install)
- [Tauri CLI](https://tauri.studio/docs/getting-started/setup-windows)

### Installing

1. Clone the repository.

```bash
git clone https://github.com/averu/Setli.git
```

2. Install dependencies.

```bash
cd Setli
pnpm install
```

### Running the app

```
pnpm tauri:dev
```

This will start the app in development mode.

### Building the app

```
pnpm tauri:build
```

This will create a production build of the app.

## Built With

- [Tauri](https://tauri.studio/)
- [React](https://reactjs.org/)
- [Rust](https://www.rust-lang.org/)

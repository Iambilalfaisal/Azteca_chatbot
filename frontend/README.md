# Azteca Foods - Enterprise Chat Widget

Professional, enterprise-level chat widget for customer support.

## Features

- **Widget Design**: Floating chat button that opens a professional chat window
- **Enterprise UI**: Modern Material UI design with professional styling
- **Markdown Support**: Rich text formatting for responses (lists, headers, bold, etc.)
- **Response Formatting**: Automatically formats responses for better readability
- **Real-time Chat**: Instant messaging with loading states
- **Message History**: Conversation continuity with thread management
- **Responsive**: Works on desktop and mobile devices

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Start the development server:**
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Backend Setup

Make sure the Python API server is running:

```bash
# In the project root directory
uv run python api_server.py
```

The API server runs on `http://127.0.0.1:8000`

## Widget Features

- **Floating Button**: Click the chat bubble in the bottom-right corner
- **Professional Design**: Enterprise-level UI with Material UI
- **Formatted Responses**: Responses are automatically formatted with:
  - Markdown support (headers, lists, bold text)
  - Location formatting with icons
  - Structured information display
- **Smooth Animations**: Professional transitions and hover effects
- **Message Badge**: Shows unread message count on the button

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory and can be deployed to any static hosting service.

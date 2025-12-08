# Tacos Azteca AI Chatbot - Project Summary

## Project Overview

A professional, enterprise-level AI-powered customer support chatbot for Tacos Azteca restaurants. The chatbot provides instant customer assistance for inquiries about locations, menu items, services, and general information across all Washington State locations.

---

## What Was Built

### 1. **Backend API Server** (Python/FastAPI)
- **Location**: `api_server.py`
- **Purpose**: RESTful API that connects the frontend to Azure AI Agent
- **Key Features**:
  - `/api/chat` endpoint for sending messages and receiving responses
  - `/api/health` endpoint for system status
  - Automatic document reference removal (cleans citations like `【4:2†TACOS AZTECA_1.docx】`)
  - Response formatting for professional presentation
  - Thread management for conversation continuity
  - CORS enabled for frontend communication

### 2. **Frontend Chat Widget** (Vanilla JavaScript)
- **Location**: `frontend/public/chatbot-widget.js`
- **Purpose**: Modern, animated chatbot interface
- **Key Features**:
  - **Floating Action Button (FAB)**: Bottom-right corner chat button
  - **Glassmorphism Design**: Modern transparent card with blur effects
  - **Smooth Animations**: 
    - Spring/bouncy entrance animation
    - Message slide-up and fade-in effects
    - Typing indicator with bouncing dots
  - **Professional UI**:
    - Clean message bubbles (no avatars)
    - Responsive design (mobile and desktop)
    - Smooth scrolling
    - Auto-resizing text input
  - **Interactive Features**:
    - Minimize/expand chat window
    - Clear chat history
    - Close and reset conversation
    - Enter to send, Shift+Enter for new line

### 3. **Landing Page** (React/Material UI)
- **Location**: `frontend/src/components/DemoPage.jsx`
- **Purpose**: Professional demo page showcasing the chatbot
- **Features**:
  - Hero section with gradient background
  - Feature cards (Menu, Locations, Ordering)
  - Call-to-action sections
  - Modern, responsive design

### 4. **Azure AI Agent Integration**
- **Configuration**: Azure AI Studio/Foundry
- **Agent ID**: `asst_QEy6E7mDwNoq9cL10ESBXVhs`
- **System Prompt**: Human-like customer service representative
- **Key Behaviors**:
  - Conversational and friendly tone
  - Asks clarifying questions when needed
  - Concise, relevant responses
  - Never mentions files, documents, or technical processes
  - Removes all citations automatically

---

## Technical Architecture

```
┌─────────────────┐
│   React App     │
│  (Landing Page) │
└────────┬────────┘
         │
         │ (Embedded)
         ▼
┌─────────────────┐
│  Vanilla JS     │
│  Chat Widget    │
└────────┬────────┘
         │
         │ HTTP POST
         ▼
┌─────────────────┐
│  FastAPI Server │
│  (Port 8000)    │
└────────┬────────┘
         │
         │ Azure SDK
         ▼
┌─────────────────┐
│  Azure AI Agent │
│  (Azure Foundry)│
└─────────────────┘
```

---

## Key Features & Capabilities

### Customer-Facing Features
1. **24/7 Availability**: Instant responses to customer inquiries
2. **Location Information**: Provides addresses and phone numbers for all Washington State locations
3. **Natural Conversation**: Human-like responses that don't feel robotic
4. **Professional Design**: Enterprise-level UI that matches brand standards
5. **Mobile Responsive**: Works seamlessly on all devices

### Technical Features
1. **Document Reference Removal**: Automatically strips citations and file references
2. **Response Formatting**: Structures information clearly (lists, addresses, etc.)
3. **Thread Management**: Maintains conversation context
4. **Error Handling**: Graceful error messages for API failures
5. **Typing Indicators**: Visual feedback during response generation

---

## How It Works

### User Flow
1. Customer visits website
2. Clicks floating chat button (bottom-right)
3. Chat widget opens with smooth animation
4. Customer types question (e.g., "Where are you located?")
5. Message sent to backend API
6. Backend forwards to Azure AI Agent
7. Agent processes using knowledge base
8. Response formatted and cleaned
9. Response displayed in chat with animation
10. Conversation continues with context maintained

### Message Processing
- **User Message** → Immediately displayed
- **500ms delay** → Typing indicator appears
- **API call** → Sent to Azure AI Agent
- **1500ms delay** → Typing indicator removed, response displayed

---

## Files & Structure

```
tacos-ai/
├── api_server.py              # FastAPI backend server
├── chatbot.py                  # Core chat logic (legacy Gradio version)
├── agent_system_prompt.md      # Azure agent system prompt
├── requirements.txt            # Python dependencies
├── pyproject.toml              # Project configuration
├── .env                        # Environment variables (Azure credentials)
│
└── frontend/
    ├── public/
    │   └── chatbot-widget.js   # Vanilla JS chatbot widget ⭐
    ├── src/
    │   ├── App.jsx             # Main React app
    │   ├── components/
    │   │   └── DemoPage.jsx    # Landing page
    │   └── main.jsx            # React entry point
    ├── index.html              # HTML template
    └── package.json            # Node dependencies
```

---

## Setup & Installation

### Prerequisites
- Python 3.8+ with `uv` package manager
- Node.js 16+ and npm
- Azure AI Studio account with agent configured
- Azure credentials (API key or Azure CLI login)

### Backend Setup
```powershell
# Install dependencies
uv sync --no-install-project

# Run API server
uv run python api_server.py
# Server runs on http://127.0.0.1:8000
```

### Frontend Setup
```powershell
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
# App runs on http://localhost:3000
```

---

## Configuration

### Azure AI Agent Setup
1. Go to Azure AI Studio
2. Navigate to your agent configuration
3. Paste the system prompt from `agent_system_prompt.md`
4. Upload knowledge base documents (locations, menu, etc.)
5. Save and deploy

### Environment Variables (.env)
```
AZURE_AI_ENDPOINT=https://tacos-resource.services.ai.azure.com/api/projects/tacos
AZURE_AI_AGENT_ID=asst_QEy6E7mDwNoq9cL10ESBXVhs
AZURE_AI_API_KEY=your-api-key-here
```

---

## System Prompt Highlights

The chatbot is configured to:
- Act like a human customer service representative
- Be warm, friendly, and conversational
- Ask clarifying questions when needed
- Keep responses concise and relevant
- **Never mention** files, documents, or technical processes
- Remove all citations automatically
- Present information as direct knowledge

---

## Widget Customization

The widget uses CSS variables for easy theming:
```css
--primary-color: #1976d2
--primary-dark: #1565c0
--primary-light: #42a5f5
--glass-bg: rgba(255, 255, 255, 0.95)
--border-radius: 16px
```

Edit these in `chatbot-widget.js` to match your brand colors.

---

## Current Status

✅ **Completed Features:**
- Backend API server with Azure integration
- Vanilla JS chatbot widget with animations
- Professional landing page
- Document reference removal
- Response formatting
- Thread management
- Mobile responsive design
- Minimize/expand functionality
- Clear chat functionality

✅ **Working:**
- Chat widget loads automatically
- Messages send and receive correctly
- Animations work smoothly
- Scrolling functions properly
- Input stays at bottom

---

## Usage Instructions

### For Developers
1. Start backend: `uv run python api_server.py`
2. Start frontend: `cd frontend && npm run dev`
3. Open browser: `http://localhost:3000`
4. Click chat button to test

### For Customers
1. Visit the website
2. Click the blue chat button (bottom-right)
3. Type your question
4. Press Enter or click Send
5. Wait for response (typing indicator shows)
6. Continue conversation as needed

---

## Future Enhancements (Optional)

- [ ] Multi-language support
- [ ] Voice input/output
- [ ] Chat history persistence
- [ ] Analytics dashboard
- [ ] Integration with ordering system
- [ ] SMS/WhatsApp integration
- [ ] Admin panel for monitoring

---

## Support & Maintenance

### Updating the System Prompt
1. Edit `agent_system_prompt.md`
2. Copy the prompt text
3. Update in Azure AI Studio
4. Test with sample questions

### Updating Knowledge Base
1. Add new documents to Azure AI Studio
2. Agent automatically uses new information
3. No code changes needed

### Troubleshooting
- **Widget not appearing**: Check browser console for errors
- **Messages not sending**: Verify API server is running on port 8000
- **No responses**: Check Azure credentials and agent permissions
- **Styling issues**: Clear browser cache and reload

---

## Project Summary

This chatbot provides Tacos Azteca with a professional, 24/7 customer support solution that:
- Answers location and menu questions instantly
- Provides a modern, user-friendly interface
- Maintains conversation context
- Removes technical jargon and citations
- Works on all devices
- Integrates seamlessly with existing website

The solution is production-ready and can be deployed to any hosting environment that supports Python (backend) and static files (frontend).

---

**Last Updated**: Current Date
**Version**: 1.0
**Status**: ✅ Production Ready


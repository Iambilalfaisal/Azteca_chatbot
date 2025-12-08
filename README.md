# Azure OpenAI Chatbot with Gradio

A chatbot application built with Gradio that connects to your Azure OpenAI agent.

## Setup Instructions

1. Install `uv` (if not already installed):
   ```powershell
   # Using pip
   pip install uv
   # Or using the standalone installer
   # See https://github.com/astral-sh/uv for installation options
   ```

2. Create virtual environment and install dependencies:
   ```powershell
   uv sync --no-install-project
   ```
   This will automatically create the virtual environment (`.venv`) and install all dependencies from `pyproject.toml` without trying to build the project as a package.
   
   Alternatively, you can use:
   ```powershell
   uv venv
   uv pip install -r requirements.txt
   ```

3. (Optional) Activate the virtual environment:
   - On Windows (PowerShell):
   ```powershell
   .\.venv\Scripts\Activate.ps1
   ```
   - On Windows (Command Prompt):
   ```cmd
   .venv\Scripts\activate.bat
   ```
   Note: You can also use `uv run` commands without activating the environment.

4. Configure Azure AI:
   - Create a `.env` file in the project root
   - Add your Azure AI credentials to `.env`:
     ```
     AZURE_AI_ENDPOINT=https://tacos-resource.services.ai.azure.com/api/projects/tacos
     AZURE_AI_AGENT_ID=asst_QEy6E7mDwNoq9cL10ESBXVhs
     AZURE_AI_API_KEY=your-api-key-here
     ```
     - `AZURE_AI_ENDPOINT`: Your Azure AI Project endpoint URL (default: https://tacos-resource.services.ai.azure.com/api/projects/tacos)
     - `AZURE_AI_AGENT_ID`: Your agent ID (already configured: asst_QEy6E7mDwNoq9cL10ESBXVhs)
     - `AZURE_AI_API_KEY`: Your Azure AI API key (required for authentication)
   
   **Authentication Options**:
   - **Option 1 (Recommended)**: Set `AZURE_AI_API_KEY` in your `.env` file
   - **Option 2**: Install and login with Azure CLI: `az login`
   - **Option 3**: Use Visual Studio Code with Azure extension and sign in

## Running the Application

### Option 1: Gradio Interface (Original)

```powershell
# Using uv (recommended - no need to activate environment)
uv run python chatbot.py

# Or activate the environment first, then run
.\.venv\Scripts\Activate.ps1
python chatbot.py
```

The chatbot will be available at `http://127.0.0.1:7860`

### Option 2: React Frontend (Recommended)

1. **Start the API server:**
```powershell
uv run python api_server.py
```
The API server runs on `http://127.0.0.1:8000`

2. **Start the React frontend:**
```powershell
cd frontend
npm install
npm run dev
```
The frontend will be available at `http://localhost:3000`

The React frontend provides a more professional, modern interface with Material UI.

## Features

- **Gradio Interface**: Interactive chat interface (original)
- **React Widget**: Professional enterprise-level chat widget (recommended)
- **Azure Foundry Integration**: Connects to your Azure AI agent
- **Conversation Thread Management**: Maintains conversation context
- **Response Formatting**: Professional markdown-formatted responses
- **Enterprise Design**: Modern, professional UI with Material UI
- **Uses your configured Azure agent** (ID: asst_QEy6E7mDwNoq9cL10ESBXVhs)

## Frontend (React Widget)

The React frontend provides a professional widget chatbot that can be embedded in any website.

**Setup:**
```powershell
cd frontend
npm install
npm run dev
```

**Features:**
- Floating chat button widget
- Professional enterprise-level design
- Markdown-formatted responses
- Smooth animations and transitions
- Mobile-responsive design


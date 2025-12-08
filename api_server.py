"""
FastAPI server for the chatbot API
This provides REST API endpoints for the React frontend
"""
import os
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn

# Import chatbot functionality
from chatbot import project, AGENT_ID, chat as chat_function, clear_chat as clear_chat_function, get_thread_id, set_thread_id

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

app = FastAPI(title="Tacos AI Chatbot API", version="1.0.0")

# CORS middleware to allow React frontend to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response models
class ChatRequest(BaseModel):
    message: str
    thread_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    thread_id: Optional[str] = None

class ClearResponse(BaseModel):
    message: str

# Store thread IDs per session (in production, use a proper session management)
thread_storage = {}

@app.get("/")
async def root():
    return {"message": "Tacos AI Chatbot API", "status": "running"}

@app.get("/api/health")
async def health():
    return {"status": "healthy", "agent_id": AGENT_ID}

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Send a message to the chatbot and get a response
    """
    try:
        logger.info(f"📨 API: Received message: '{request.message[:50]}...'")
        
        # Use thread_id from request or use existing one
        if request.thread_id:
            set_thread_id(request.thread_id)
        
        # Call the chat function
        # The chat function expects (message, history) and returns (history, "")
        history = []
        history, _ = chat_function(request.message, history)
        
        # Extract the last assistant message
        assistant_response = ""
        for msg in reversed(history):
            if isinstance(msg, dict) and msg.get("role") == "assistant":
                assistant_response = msg.get("content", "")
                break
        
        # Format the response for better presentation
        formatted_response = format_response(assistant_response)
        
        # Get the current thread_id
        current_thread_id = get_thread_id()
        
        logger.info(f"✅ API: Response generated (length: {len(formatted_response)})")
        
        return ChatResponse(
            response=formatted_response or "No response from assistant.",
            thread_id=current_thread_id
        )
    
    except Exception as e:
        logger.error(f"❌ API Error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

def format_response(text: str) -> str:
    """
    Format the assistant response for better presentation
    Adds markdown formatting, bullet points, and structure for enterprise-level presentation
    Also removes document references and citations
    """
    if not text:
        return text
    
    import re
    
    formatted = text
    
    # Remove document references and citations (critical - must be first)
    # Remove patterns like 【4:2†TACOS AZTECA_1.docx】 or [document:...] or similar citations
    formatted = re.sub(r'【[^】]+】', '', formatted)  # Remove 【】 brackets with content
    formatted = re.sub(r'\[[^\]]*document[^\]]*\]', '', formatted, flags=re.IGNORECASE)  # Remove [document...] references
    formatted = re.sub(r'\[[^\]]*file[^\]]*\]', '', formatted, flags=re.IGNORECASE)  # Remove [file...] references
    formatted = re.sub(r'\[[^\]]*\d+:\d+[^\]]*\]', '', formatted)  # Remove [number:number] citation patterns
    formatted = re.sub(r'†[^\s]+', '', formatted)  # Remove † markers and following text
    formatted = re.sub(r'\([^)]*doc[^)]*\)', '', formatted, flags=re.IGNORECASE)  # Remove (doc...) references
    formatted = re.sub(r'\([^)]*source[^)]*\)', '', formatted, flags=re.IGNORECASE)  # Remove (source...) references
    
    # Remove any remaining citation patterns
    formatted = re.sub(r'\[[^\]]*\]', '', formatted)  # Remove any remaining [bracketed] content that looks like citations
    
    # Format location lists (City – Address — Phone pattern)
    # Example: "Burien – 153 SW 157th St, Burien, WA 98166 — (206) 243-2241"
    formatted = re.sub(
        r'^([A-Z][a-z\s]+)\s*–\s*([^—]+)\s*—\s*([^—]+)$',
        r'**\1**\n📍 \2\n📞 \3\n',
        formatted,
        flags=re.MULTILINE
    )
    
    # Format numbered lists
    formatted = re.sub(r'^(\d+\.\s+)(.+)$', r'\1\2', formatted, flags=re.MULTILINE)
    
    # Format bullet points (dash or bullet)
    formatted = re.sub(r'^([-•])\s+(.+)$', r'- \2', formatted, flags=re.MULTILINE)
    
    # Format section headers (lines ending with colon that are standalone)
    formatted = re.sub(r'^([A-Z][^:]+):\s*$', r'### \1', formatted, flags=re.MULTILINE)
    
    # Format bold text patterns (common phrases)
    formatted = re.sub(r'\*\*([^*]+)\*\*', r'**\1**', formatted)  # Preserve existing bold
    
    # Add spacing between sections
    formatted = re.sub(r'\n\n\n+', r'\n\n', formatted)
    
    # Format phone numbers for better visibility
    formatted = re.sub(r'\((\d{3})\)\s*(\d{3})-(\d{4})', r'(\1) \2-\3', formatted)
    
    # Clean up and ensure proper spacing
    formatted = formatted.strip()
    
    # Ensure double line breaks between major sections
    formatted = re.sub(r'(\n)([A-Z][a-z]+ –)', r'\n\n\2', formatted)
    
    # Remove any double spaces or extra whitespace
    formatted = re.sub(r'  +', ' ', formatted)
    formatted = re.sub(r'\n\s+\n', '\n\n', formatted)
    
    return formatted

@app.post("/api/clear", response_model=ClearResponse)
async def clear():
    """
    Clear the chat conversation
    """
    try:
        logger.info("🗑️ API: Clearing chat...")
        clear_chat_function()
        return ClearResponse(message="Chat cleared successfully")
    except Exception as e:
        logger.error(f"❌ API Error clearing chat: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    logger.info("🚀 Starting API server on http://127.0.0.1:8000")
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")


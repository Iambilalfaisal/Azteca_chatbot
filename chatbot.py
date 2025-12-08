import os
import logging
import gradio as gr
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential, ClientSecretCredential
from azure.ai.agents.models import ListSortOrder
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()

# ============================================================================
# CONFIGURATION - Read from .env file
# ============================================================================
# Azure AI Configuration
AZURE_AI_ENDPOINT = os.getenv("AZURE_AI_ENDPOINT", "https://tacos-resource.services.ai.azure.com/api/projects/tacos")
AZURE_AI_API_KEY = os.getenv("AZURE_AI_API_KEY")
AGENT_ID = os.getenv("AZURE_AI_AGENT_ID", "asst_QEy6E7mDwNoq9cL10ESBXVhs")

# Azure AD Credentials (for service principal authentication)
AZURE_CLIENT_ID = os.getenv("AZURE_CLIENT_ID")
AZURE_CLIENT_SECRET = os.getenv("AZURE_CLIENT_SECRET")
AZURE_TENANT_ID = os.getenv("AZURE_TENANT_ID")
# ============================================================================

# Validate required environment variables
if not AZURE_AI_ENDPOINT:
    raise ValueError("AZURE_AI_ENDPOINT is required in .env file")
if not AGENT_ID:
    raise ValueError("AZURE_AI_AGENT_ID is required in .env file")

# Use DefaultAzureCredential (Azure CLI) - this uses your logged-in account
# This is preferred because your user account likely has permissions
print("🔐 Attempting authentication...")
credential = DefaultAzureCredential()

# Get token to verify authentication and show who we're authenticated as
try:
    token = credential.get_token("https://cognitiveservices.azure.com/.default")
    print(f"✅ Authentication successful")
    print(f"✅ Using DefaultAzureCredential (Azure CLI)")
except Exception as auth_error:
    print(f"❌ Authentication failed: {auth_error}")
    print(f"💡 Trying service principal from .env file...")
    if AZURE_CLIENT_ID and AZURE_CLIENT_SECRET and AZURE_TENANT_ID:
        credential = ClientSecretCredential(
            tenant_id=AZURE_TENANT_ID,
            client_id=AZURE_CLIENT_ID,
            client_secret=AZURE_CLIENT_SECRET
        )
        print(f"✅ Using ClientSecretCredential from .env file")
    else:
        raise ValueError("No authentication method available. Please run 'az login' or set service principal credentials in .env")

# Initialize Azure AI Project Client (same as your working sample code)
project = AIProjectClient(
    credential=credential,
    endpoint=AZURE_AI_ENDPOINT
)

# Don't get agent at startup - get it when needed (like in your sample code)
# This matches your working sample code pattern
print(f"✅ Azure AI Project Client initialized")
print(f"📍 Endpoint: {AZURE_AI_ENDPOINT}")
print(f"🆔 Agent ID: {AGENT_ID}")

# Store thread ID for conversation continuity
thread_id = None

# Export for API server
def get_thread_id():
    """Get the current thread ID"""
    return thread_id

def set_thread_id(new_thread_id):
    """Set the thread ID"""
    global thread_id
    thread_id = new_thread_id

def chat(message, history):
    """
    Handle chat interactions with Azure AI Agents API
    Gradio expects history as list of dicts: [{"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}]
    """
    global thread_id
    
    # Trim whitespace and validate message
    message = message.strip()
    if not message:
        return history, ""
    
    # Normalize history to dict format if needed
    formatted_history = []
    if history:
        for item in history:
            if isinstance(item, dict):
                # Already in correct format
                formatted_history.append({
                    "role": item.get("role", "user"),
                    "content": str(item.get("content", ""))
                })
            elif isinstance(item, list) and len(item) >= 2:
                # Convert from list format [user_msg, assistant_msg] to dict format
                user_msg = str(item[0]) if item[0] else ""
                assistant_msg = str(item[1]) if item[1] else ""
                if user_msg:
                    formatted_history.append({"role": "user", "content": user_msg})
                if assistant_msg:
                    formatted_history.append({"role": "assistant", "content": assistant_msg})
    
    history = formatted_history
    
    # Add user message to history
    history.append({"role": "user", "content": message})
    
    try:
        logger.info(f"📨 User message received: '{message[:50]}...' (length: {len(message)})")
        
        # Create a new thread if one doesn't exist
        if thread_id is None:
            logger.info("🆕 Creating new thread...")
            thread = project.agents.threads.create()
            thread_id = thread.id
            logger.info(f"✅ Thread created: {thread_id}")
        else:
            logger.info(f"🔄 Using existing thread: {thread_id}")
        
        # Add user message to the thread
        logger.info(f"💬 Adding user message to thread...")
        project.agents.messages.create(
            thread_id=thread_id,
            role="user",
            content=message
        )
        logger.info("✅ User message added to thread")
        
        # Create and process the run using AGENT_ID directly (same as your sample code)
        logger.info(f"🚀 Starting run with agent: {AGENT_ID}")
        logger.info(f"⏳ Processing run (this may take a moment)...")
        run = project.agents.runs.create_and_process(
            thread_id=thread_id,
            agent_id=AGENT_ID
        )
        logger.info(f"✅ Run completed with status: {run.status}")
        
        # Check if run completed successfully
        if run.status == "failed":
            error_message = f"Run failed: {run.last_error}"
            logger.error(f"❌ Run failed: {run.last_error}")
            history.append({"role": "assistant", "content": str(error_message)})
        else:
            # Retrieve messages from the thread in ascending order (same as your sample code)
            logger.info(f"📥 Retrieving messages from thread...")
            messages = project.agents.messages.list(
                thread_id=thread_id,
                order=ListSortOrder.ASCENDING
            )
            
            # Find the LATEST assistant message (iterate through all to get the last one)
            # Your sample code pattern: message.text_messages[-1].text.value
            assistant_message = ""
            all_messages = list(messages)  # Convert to list to iterate multiple times
            logger.info(f"📋 Found {len(all_messages)} total messages in thread")
            
            # Log all messages for debugging
            for idx, msg in enumerate(all_messages):
                logger.info(f"   Message {idx+1}: role={msg.role}, has_text_messages={bool(msg.text_messages)}")
                if msg.text_messages:
                    logger.info(f"      Text messages count: {len(msg.text_messages)}")
                    if msg.text_messages and hasattr(msg.text_messages[-1], 'text'):
                        preview = msg.text_messages[-1].text.value[:100] if hasattr(msg.text_messages[-1].text, 'value') else "N/A"
                        logger.info(f"      Last text preview: {preview}...")
            
            logger.info("🔍 Searching for latest assistant message...")
            
            # Go through all messages and get the LAST assistant message (not the first)
            for msg in reversed(all_messages):  # Start from the end to get the latest
                if msg.role == "assistant" and msg.text_messages:
                    # Get the last text message from this message object
                    assistant_message = msg.text_messages[-1].text.value
                    logger.info(f"✅ Found latest assistant message (length: {len(assistant_message)})")
                    logger.info(f"📝 Message preview: {assistant_message[:100]}...")
                    break  # Found the latest assistant message
            
            # Add assistant response to history
            if assistant_message:
                history.append({"role": "assistant", "content": str(assistant_message)})
                logger.info("✅ Added assistant response to history")
            else:
                logger.warning("⚠️  No assistant message found, trying fallback...")
                # If no message found, try to get all assistant messages
                all_assistant_messages = []
                for msg in all_messages:
                    if msg.role == "assistant" and msg.text_messages:
                        for text_msg in msg.text_messages:
                            if hasattr(text_msg, 'text') and hasattr(text_msg.text, 'value'):
                                all_assistant_messages.append(text_msg.text.value)
                
                if all_assistant_messages:
                    # Get the last one
                    assistant_message = all_assistant_messages[-1]
                    logger.info(f"✅ Found assistant message via fallback (length: {len(assistant_message)})")
                    history.append({"role": "assistant", "content": str(assistant_message)})
                else:
                    logger.error("❌ No assistant message found at all")
                    history.append({"role": "assistant", "content": "No response from assistant."})
        
        return history, ""
    
    except Exception as e:
        error_message = f"Error: {str(e)}"
        logger.error(f"❌ Exception occurred: {type(e).__name__}: {str(e)}", exc_info=True)
        history.append({"role": "assistant", "content": str(error_message)})
        return history, ""

def clear_chat():
    """
    Clear conversation history and create a new thread
    Returns empty list in dict format for Gradio
    """
    global thread_id
    thread_id = None
    return [], ""

# Create Gradio interface with professional styling
# This will only be executed when running chatbot.py directly, not when imported
if __name__ != "__main__":
    # When imported, create a placeholder
    demo = None
else:
    # When run directly, create the Gradio interface
    with gr.Blocks(title="Customer Support Chatbot") as demo:
        
        # Header Section
        with gr.Row():
            gr.Markdown(
                """
                <div style="text-align: center; padding: 20px;">
                    <h1 style="margin: 0; color: #1f2937; font-size: 2.5em;">💬 Customer Support</h1>
                    <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 1.1em;">
                        How can we assist you today? Type your message and press Enter to send.
                    </p>
                </div>
            """
            )
        
        # Main Chat Interface
        with gr.Row():
            with gr.Column(scale=1):
                chatbot = gr.Chatbot(
                    label="",
                    height=600,
                    show_label=False
                )
        
        # Input Section
        with gr.Row():
            with gr.Column(scale=9):
                msg = gr.Textbox(
                    label="",
                    placeholder="Type your message here and press Enter to send...",
                    show_label=False,
                    lines=2,
                    max_lines=5,
                    container=False
                )
            with gr.Column(scale=1, min_width=100):
                submit_btn = gr.Button(
                    "Send",
                    variant="primary",
                    scale=1
                )
        
        # Action Buttons
        with gr.Row():
            clear_btn = gr.Button(
                "🗑️ Clear Conversation",
                variant="secondary"
            )
        
        # Footer
        gr.Markdown(
            """
            <div style="text-align: center; padding: 15px; color: #9ca3af; font-size: 0.9em; border-top: 1px solid #e5e7eb; margin-top: 20px;">
                <p style="margin: 0;">Powered by Azure OpenAI • Secure and Confidential</p>
            </div>
            """
        )
        
        # Event handlers - Enter key support and button click
        msg.submit(
            fn=chat,
            inputs=[msg, chatbot],
            outputs=[chatbot, msg],
            queue=True
        )
        submit_btn.click(
            fn=chat,
            inputs=[msg, chatbot],
            outputs=[chatbot, msg],
            queue=True
        )
        clear_btn.click(
            fn=clear_chat,
            inputs=None,
            outputs=[chatbot, msg],
            queue=False
        )

if __name__ == "__main__":
    print(f"✅ Using Agent ID: {AGENT_ID}")
    print(f"✅ Connected to Azure AI Project: {AZURE_AI_ENDPOINT}")
    print(f"✅ Configuration loaded from .env file")
    
    demo.launch(server_name="127.0.0.1", server_port=7860, share=False)


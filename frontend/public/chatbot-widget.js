// Chatbot Widget - Vanilla JavaScript
(function() {
    'use strict';

    // CSS Variables for theming
    const CSS_VARS = {
        '--primary-color': '#1976d2',
        '--primary-dark': '#1565c0',
        '--primary-light': '#42a5f5',
        '--text-color': '#333',
        '--shadow-color': 'rgba(0, 0, 0, 0.2)',
        '--glass-bg': 'rgba(255, 255, 255, 0.95)',
        '--border-radius': '16px',
        '--spacing': '16px'
    };

    // Inject CSS
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --primary-color: ${CSS_VARS['--primary-color']};
            --primary-dark: ${CSS_VARS['--primary-dark']};
            --primary-light: ${CSS_VARS['--primary-light']};
            --text-color: ${CSS_VARS['--text-color']};
            --shadow-color: ${CSS_VARS['--shadow-color']};
            --glass-bg: ${CSS_VARS['--glass-bg']};
            --border-radius: ${CSS_VARS['--border-radius']};
            --spacing: ${CSS_VARS['--spacing']};
        }

        .chat-fab {
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 64px;
            height: 64px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px var(--shadow-color);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            transform-origin: center;
        }

        .chat-fab:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px var(--shadow-color);
        }

        .chat-fab svg {
            width: 28px;
            height: 28px;
            fill: white;
            transition: all 0.3s ease;
        }

        .chat-container {
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 420px;
            max-width: calc(100vw - 48px);
            height: 600px;
            max-height: calc(100vh - 48px);
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: var(--border-radius);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transform: scale(0);
            transform-origin: bottom right;
            opacity: 0;
            pointer-events: none;
            transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            z-index: 999;
        }

        .chat-container.open {
            transform: scale(1);
            opacity: 1;
            pointer-events: all;
        }

        .chat-header {
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
            color: white;
            padding: var(--spacing);
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            flex-shrink: 0;
        }

        .chat-header-left {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .chat-header-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: var(--primary-light);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .chat-header-info h3 {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 2px;
        }

        .chat-header-info p {
            font-size: 12px;
            opacity: 0.9;
        }

        .chat-header-actions {
            display: flex;
            gap: 4px;
        }

        .chat-header-btn {
            width: 32px;
            height: 32px;
            border: none;
            background: transparent;
            color: white;
            cursor: pointer;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
        }

        .chat-header-btn:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        .chat-messages {
            flex: 1 1 auto;
            min-height: 0;
            overflow-y: auto;
            overflow-x: hidden;
            padding: var(--spacing);
            background: #f8f9fa;
            display: flex;
            flex-direction: column;
            gap: 12px;
            scroll-behavior: smooth;
        }

        .chat-messages::-webkit-scrollbar {
            width: 8px;
        }

        .chat-messages::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
        }

        .chat-messages::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
        }

        .chat-messages::-webkit-scrollbar-thumb:hover {
            background: #555;
        }

        .chat-welcome {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            text-align: center;
            color: #666;
            padding: var(--spacing);
        }

        .chat-welcome-icon {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            background: var(--primary-light);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
        }

        .message {
            display: flex;
            gap: 8px;
            max-width: 85%;
            animation: slideUpFadeIn 0.4s ease-out;
        }

        @keyframes slideUpFadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .message.user {
            align-self: flex-end;
        }

        .message-bubble {
            padding: 12px 16px;
            border-radius: 16px;
            word-wrap: break-word;
            line-height: 1.5;
            font-size: 14px;
        }

        .message.user .message-bubble {
            background: var(--primary-color);
            color: white;
            border-bottom-right-radius: 4px;
        }

        .message.bot .message-bubble {
            background: white;
            color: var(--text-color);
            border-bottom-left-radius: 4px;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .message-time {
            font-size: 11px;
            opacity: 0.7;
            margin-top: 4px;
        }

        .typing-indicator {
            display: flex;
            align-items: flex-start;
            max-width: 85%;
            animation: slideUpFadeIn 0.4s ease-out;
        }

        .typing-dots {
            display: flex;
            gap: 4px;
            padding: 12px 16px;
            background: white;
            border-radius: 16px;
            border-bottom-left-radius: 4px;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .typing-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #999;
            animation: bounce 1.4s infinite ease-in-out;
        }

        .typing-dot:nth-child(1) {
            animation-delay: -0.32s;
        }

        .typing-dot:nth-child(2) {
            animation-delay: -0.16s;
        }

        @keyframes bounce {
            0%, 80%, 100% {
                transform: scale(0);
            }
            40% {
                transform: scale(1);
            }
        }

        .chat-input-area {
            padding: var(--spacing);
            background: white;
            border-top: 1px solid #e0e0e0;
            box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
            flex-shrink: 0;
        }

        .chat-input-wrapper {
            display: flex;
            gap: 8px;
            align-items: flex-end;
        }

        .chat-input {
            flex: 1;
            padding: 10px 14px;
            border: 1px solid #e0e0e0;
            border-radius: 20px;
            font-size: 14px;
            font-family: inherit;
            resize: none;
            max-height: 100px;
            overflow-y: auto;
            transition: border-color 0.2s;
        }

        .chat-input:focus {
            outline: none;
            border-color: var(--primary-color);
        }

        .chat-send-btn {
            width: 40px;
            height: 40px;
            border: none;
            border-radius: 50%;
            background: var(--primary-color);
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            flex-shrink: 0;
        }

        .chat-send-btn:hover:not(:disabled) {
            background: var(--primary-dark);
            transform: scale(1.1);
        }

        .chat-send-btn:active:not(:disabled) {
            transform: scale(0.95);
        }

        .chat-send-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
        }

        .chat-input-hint {
            font-size: 11px;
            color: #999;
            margin-top: 6px;
            text-align: center;
        }

        @media (max-width: 480px) {
            .chat-container {
                width: calc(100vw - 24px);
                height: calc(100vh - 24px);
                bottom: 12px;
                right: 12px;
            }

            .chat-fab {
                bottom: 12px;
                right: 12px;
            }
        }
    `;
    document.head.appendChild(style);

    // State
    let isOpen = false;
    let isMinimized = false;
    let threadId = null;
    const API_BASE_URL = 'http://127.0.0.1:8000/api';

    // Create HTML structure
    const widgetHTML = `
        <button class="chat-fab" id="chatFab" aria-label="Open chat">
            <svg viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
        </button>
        <div class="chat-container" id="chatContainer">
            <div class="chat-header">
                <div class="chat-header-left">
                    <div class="chat-header-avatar">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                    </div>
                    <div class="chat-header-info">
                        <h3>Customer Support</h3>
                        <p>We're here to help</p>
                    </div>
                </div>
                <div class="chat-header-actions">
                    <button class="chat-header-btn" id="clearBtn" aria-label="Clear chat" title="Clear chat">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                    </button>
                    <button class="chat-header-btn" id="minimizeBtn" aria-label="Minimize" title="Minimize">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 13H5v-2h14v2z"/>
                        </svg>
                    </button>
                    <button class="chat-header-btn" id="closeBtn" aria-label="Close" title="Close">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="chat-messages" id="chatMessages">
                <div class="chat-welcome">
                    <div class="chat-welcome-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                    </div>
                    <h3>Welcome to Tacos AI Support</h3>
                    <p>How can we assist you today? Ask us anything about our services, locations, or products.</p>
                </div>
            </div>
            <div class="chat-input-area">
                <div class="chat-input-wrapper">
                    <textarea class="chat-input" id="chatInput" placeholder="Type your message..." rows="1"></textarea>
                    <button class="chat-send-btn" id="sendBtn" aria-label="Send message">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                        </svg>
                    </button>
                </div>
                <div class="chat-input-hint">Press Enter to send • Shift+Enter for new line</div>
            </div>
        </div>
    `;

    // Inject widget into page
    document.body.insertAdjacentHTML('beforeend', widgetHTML);

    // Get DOM elements
    const chatFab = document.getElementById('chatFab');
    const chatContainer = document.getElementById('chatContainer');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const clearBtn = document.getElementById('clearBtn');
    const minimizeBtn = document.getElementById('minimizeBtn');
    const closeBtn = document.getElementById('closeBtn');

    // Functions
    function toggleChat() {
        isOpen = !isOpen;
        chatContainer.classList.toggle('open', isOpen);
        if (isOpen) {
            chatInput.focus();
            // Reset minimize state when opening
            isMinimized = false;
            chatMessages.style.display = 'flex';
            document.querySelector('.chat-input-area').style.display = 'block';
        }
    }

    function minimizeChat() {
        isMinimized = !isMinimized;
        const inputArea = document.querySelector('.chat-input-area');
        if (isMinimized) {
            chatMessages.style.display = 'none';
            inputArea.style.display = 'none';
        } else {
            chatMessages.style.display = 'flex';
            inputArea.style.display = 'block';
        }
    }

    function clearChat() {
        chatMessages.innerHTML = `
            <div class="chat-welcome">
                <div class="chat-welcome-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                </div>
                <h3>Welcome to Tacos AI Support</h3>
                <p>How can we assist you today? Ask us anything about our services, locations, or products.</p>
            </div>
        `;
        threadId = null;
    }

    function scrollToBottom() {
        setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 100);
    }

    function removeWelcome() {
        const welcome = chatMessages.querySelector('.chat-welcome');
        if (welcome) welcome.remove();
    }

    function addMessage(text, isUser = false) {
        removeWelcome();
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const textNode = document.createTextNode(text);
        const tempDiv = document.createElement('div');
        tempDiv.appendChild(textNode);
        const escapedText = tempDiv.innerHTML;
        
        messageDiv.innerHTML = `
            <div class="message-bubble">
                <div>${escapedText}</div>
                <div class="message-time">${time}</div>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }

    function addTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const typing = document.getElementById('typingIndicator');
        if (typing) typing.remove();
    }

    async function sendMessage() {
        const message = chatInput.value.trim();
        if (!message || sendBtn.disabled) return;

        chatInput.disabled = true;
        sendBtn.disabled = true;
        chatInput.value = '';

        addMessage(message, true);

        setTimeout(() => {
            addTypingIndicator();
        }, 500);

        try {
            const response = await fetch(`${API_BASE_URL}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message, thread_id: threadId })
            });

            const data = await response.json();

            setTimeout(() => {
                removeTypingIndicator();
                if (data.response) addMessage(data.response, false);
                if (data.thread_id) threadId = data.thread_id;
                chatInput.disabled = false;
                sendBtn.disabled = false;
                chatInput.focus();
            }, 1500);
        } catch (error) {
            console.error('Error:', error);
            setTimeout(() => {
                removeTypingIndicator();
                addMessage('Sorry, I encountered an error. Please try again.', false);
                chatInput.disabled = false;
                sendBtn.disabled = false;
                chatInput.focus();
            }, 1500);
        }
    }

    // Event listeners
    chatFab.addEventListener('click', toggleChat);
    sendBtn.addEventListener('click', sendMessage);
    clearBtn.addEventListener('click', clearChat);
    minimizeBtn.addEventListener('click', minimizeChat);
    closeBtn.addEventListener('click', function() {
        clearChat();
        toggleChat();
    });

    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 100) + 'px';
    });

    chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
})();


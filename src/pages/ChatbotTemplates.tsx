import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const ChatbotTemplates = () => {
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);

  const copyToClipboard = async (code: string, templateName: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedTemplate(templateName);
      toast.success(`${templateName} template copied to clipboard!`);
      setTimeout(() => setCopiedTemplate(null), 2000);
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const templates = [
    {
      id: "react-basic",
      name: "React Basic Chatbot",
      description: "A simple React chatbot component with basic styling",
      code: `import React, { useState } from 'react';
import './Chatbot.css'; // Add your own styles

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Replace with your actual token from CogniDoc
  const SESSION_TOKEN = 'your_session_token_here';
  const API_BASE_URL = 'http://localhost:8000';

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(\`\${API_BASE_URL}/query/askQuery\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${SESSION_TOKEN}\`
        },
        body: JSON.stringify({ query: input })
      });

      const data = await response.json();
      
      if (response.ok) {
        const botMessage = { role: 'assistant', content: data.response || 'No response received' };
        setMessages(prev => [...prev, botMessage]);
      } else {
        const errorMessage = { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage = { role: 'assistant', content: 'Failed to connect to the server.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={\`message \${msg.role}\`}>
            <strong>{msg.role === 'user' ? 'You' : 'Bot'}:</strong> {msg.content}
          </div>
        ))}
        {isLoading && <div className="message assistant">Bot is typing...</div>}
      </div>
      <div className="input-section">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} disabled={isLoading}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;`
    },
    {
      id: "vanilla-js",
      name: "Vanilla JavaScript Chatbot",
      description: "Pure JavaScript implementation for any website",
      code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CogniDoc Chatbot</title>
    <style>
        .chatbot-widget {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 350px;
            height: 500px;
            border: 1px solid #ddd;
            border-radius: 10px;
            background: white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            display: flex;
            flex-direction: column;
        }
        .chat-header {
            background: #6c47ff;
            color: white;
            padding: 15px;
            border-radius: 10px 10px 0 0;
            font-weight: bold;
        }
        .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 10px;
        }
        .message {
            margin: 10px 0;
            padding: 8px 12px;
            border-radius: 8px;
            max-width: 80%;
        }
        .user-message {
            background: #e3f2fd;
            margin-left: auto;
            text-align: right;
        }
        .bot-message {
            background: #f5f5f5;
        }
        .chat-input {
            display: flex;
            padding: 10px;
            border-top: 1px solid #eee;
        }
        .chat-input input {
            flex: 1;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            margin-right: 10px;
        }
        .chat-input button {
            padding: 10px 15px;
            background: #6c47ff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="chatbot-widget">
        <div class="chat-header">CogniDoc Assistant</div>
        <div class="chat-messages" id="chatMessages"></div>
        <div class="chat-input">
            <input type="text" id="userInput" placeholder="Ask me anything...">
            <button onclick="sendMessage()">Send</button>
        </div>
    </div>

    <script>
        // Replace with your actual token from CogniDoc
        const SESSION_TOKEN = 'your_session_token_here';
        const API_BASE_URL = 'http://localhost:8000';

        function addMessage(content, isUser = false) {
            const messagesDiv = document.getElementById('chatMessages');
            const messageDiv = document.createElement('div');
            messageDiv.className = \`message \${isUser ? 'user-message' : 'bot-message'}\`;
            messageDiv.textContent = content;
            messagesDiv.appendChild(messageDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }

        async function sendMessage() {
            const input = document.getElementById('userInput');
            const message = input.value.trim();
            
            if (!message) return;

            addMessage(message, true);
            input.value = '';

            try {
                const response = await fetch(\`\${API_BASE_URL}/query/askQuery\`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': \`Bearer \${SESSION_TOKEN}\`
                    },
                    body: JSON.stringify({ query: message })
                });

                const data = await response.json();
                
                if (response.ok) {
                    addMessage(data.response || 'No response received');
                } else {
                    addMessage('Sorry, I encountered an error. Please try again.');
                }
            } catch (error) {
                addMessage('Failed to connect to the server.');
            }
        }

        // Allow Enter key to send message
        document.getElementById('userInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        // Initial greeting
        addMessage('Hello! I\'m your CogniDoc assistant. How can I help you today?');
    </script>
</body>
</html>`
    },
    {
      id: "nextjs-component",
      name: "Next.js Chatbot Component",
      description: "Modern Next.js component with TypeScript and Tailwind CSS",
      code: `'use client';

import { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const CogniDocChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I\'m your CogniDoc assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Replace with your actual token from CogniDoc
  const SESSION_TOKEN = 'your_session_token_here';
  const API_BASE_URL = 'http://localhost:8000';

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(\`\${API_BASE_URL}/query/askQuery\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${SESSION_TOKEN}\`
        },
        body: JSON.stringify({ query: input })
      });

      const data = await response.json();
      
      if (response.ok) {
        const botMessage: Message = { 
          role: 'assistant', 
          content: data.response || 'No response received' 
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        const errorMessage: Message = { 
          role: 'assistant', 
          content: 'Sorry, I encountered an error. Please try again.' 
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: Message = { 
        role: 'assistant', 
        content: 'Failed to connect to the server.' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-96 w-full max-w-md mx-auto border border-gray-200 rounded-lg shadow-lg">
      {/* Header */}
      <div className="bg-purple-600 text-white p-4 rounded-t-lg">
        <h3 className="font-semibold flex items-center gap-2">
          <Bot size={20} />
          CogniDoc Assistant
        </h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={\`flex items-start gap-2 \${
              message.role === 'user' ? 'flex-row-reverse' : ''
            }\`}
          >
            <div className={\`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center \${
              message.role === 'user' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-600'
            }\`}>
              {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={\`max-w-xs p-3 rounded-lg \${
              message.role === 'user'
                ? 'bg-blue-500 text-white rounded-br-none'
                : 'bg-gray-100 text-gray-800 rounded-bl-none'
            }\`}>
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <Bot size={16} className="text-gray-600" />
            </div>
            <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CogniDocChatbot;`
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Chatbot Templates</h1>
        <p className="text-muted-foreground">
          Copy and customize these chatbot templates for your projects. Remember to replace the session token with your actual token from the Create Token section.
        </p>
      </div>

      <div className="space-y-6">
        {templates.map((template) => (
          <Card key={template.id} className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </div>
                <Button
                  onClick={() => copyToClipboard(template.code, template.name)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {copiedTemplate === template.name ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Template
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{template.code}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Important Notes:</h3>
        <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
          <li>• Replace <code className="bg-amber-100 dark:bg-amber-900 px-1 rounded">your_session_token_here</code> with your actual session token</li>
          <li>• Get your session token from the "Create Token" section in this app</li>
          <li>• Make sure your server URL matches your CogniDoc deployment</li>
          <li>• These templates use the <code className="bg-amber-100 dark:bg-amber-900 px-1 rounded">/query/askQuery</code> endpoint</li>
        </ul>
      </div>
    </div>
  );
};

export default ChatbotTemplates;
import { useState } from "react";
import { Copy, Check, Bot, Smartphone, Globe, Code2, Palette, MapPin, User, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface TemplateConfig {
  position: string;
  theme: string;
  size: string;
}

const ChatbotTemplates = () => {
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [config, setConfig] = useState<TemplateConfig>({
    position: "bottom-right",
    theme: "purple",
    size: "medium"
  });

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

  const generateCustomizedCode = (baseCode: string, templateId: string) => {
    let customizedCode = baseCode;
    
    // Replace session token placeholder
    customizedCode = customizedCode.replace(/your_session_token_here/g, 'YOUR_SESSION_TOKEN');
    
    // Add configuration comments
    const configComment = `/*
 * Configuration Options:
 * Position: ${config.position}
 * Theme: ${config.theme}
 * Size: ${config.size}
 * 
 * To customize further, modify the CSS variables or props below
 */

`;
    
    // Inject position and theme configurations based on template type
    if (templateId === 'react-basic') {
      customizedCode = customizedCode.replace(
        "const Chatbot = () => {",
        `interface ChatbotProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
  theme?: 'purple' | 'blue' | 'green' | 'dark';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ 
  position = '${config.position}', 
  theme = '${config.theme}', 
  size = '${config.size}',
  className = ''
}) => {`
      );
      
      customizedCode = customizedCode.replace(
        'className="chatbot-container"',
        `className={\`chatbot-container chatbot-\${position} chatbot-\${theme} chatbot-\${size} \${className}\`}`
      );
    } else if (templateId === 'vanilla-js') {
      const positionStyles = {
        'bottom-right': 'bottom: 20px; right: 20px;',
        'bottom-left': 'bottom: 20px; left: 20px;',
        'top-right': 'top: 20px; right: 20px;',
        'top-left': 'top: 20px; left: 20px;',
        'center': 'top: 50%; left: 50%; transform: translate(-50%, -50%);'
      };
      
      customizedCode = customizedCode.replace(
        'bottom: 20px;\n            right: 20px;',
        positionStyles[config.position as keyof typeof positionStyles]
      );
    }
    
    return configComment + customizedCode;
  };

  const ChatbotPreview = ({ templateId, theme }: { templateId: string; theme: string }) => {
    const [messages, setMessages] = useState([
      { role: 'assistant', content: 'Hello! I\'m your CogniDoc assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');

    const themeColors = {
      purple: 'bg-purple-600',
      blue: 'bg-blue-600', 
      green: 'bg-green-600',
      dark: 'bg-gray-800'
    };

    const handleSend = () => {
      if (!input.trim()) return;
      setMessages(prev => [...prev, 
        { role: 'user', content: input },
        { role: 'assistant', content: 'This is a preview. In the real implementation, this would connect to your CogniDoc API.' }
      ]);
      setInput('');
    };

    if (templateId === 'vanilla-js') {
      return (
        <div className="w-72 h-80 border border-gray-200 rounded-lg shadow-lg bg-white text-sm">
          <div className={`${themeColors[theme as keyof typeof themeColors]} text-white p-3 rounded-t-lg font-semibold`}>
            🤖 CogniDoc Assistant
          </div>
          <div className="flex-1 p-3 h-48 overflow-y-auto bg-gray-50">
            {messages.slice(-3).map((msg, idx) => (
              <div key={idx} className={`mb-2 p-2 rounded text-xs ${
                msg.role === 'user' 
                  ? `${themeColors[theme as keyof typeof themeColors]} text-white ml-8` 
                  : 'bg-white border'
              }`}>
                {msg.content}
              </div>
            ))}
          </div>
          <div className="p-3 border-t flex gap-2">
            <input 
              className="flex-1 p-1 border rounded text-xs" 
              placeholder="Try me..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              className={`${themeColors[theme as keyof typeof themeColors]} text-white px-2 py-1 rounded text-xs`}
              onClick={handleSend}
            >
              Send
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="w-72 h-80 border border-gray-200 rounded-lg shadow-lg bg-white flex flex-col text-sm">
        <div className={`${themeColors[theme as keyof typeof themeColors]} text-white p-3 rounded-t-lg font-semibold flex items-center gap-2`}>
          <Bot size={16} />
          CogniDoc Assistant
        </div>
        <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
          {messages.slice(-3).map((msg, idx) => (
            <div key={idx} className={`flex items-start gap-2 mb-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                msg.role === 'user' 
                  ? `${themeColors[theme as keyof typeof themeColors]} text-white` 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
              </div>
              <div className={`max-w-40 p-2 rounded-lg text-xs ${
                msg.role === 'user'
                  ? `${themeColors[theme as keyof typeof themeColors]} text-white rounded-br-none`
                  : 'bg-white border rounded-bl-none'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 border-t flex gap-2">
          <input 
            className="flex-1 p-2 border rounded-lg text-xs" 
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            className={`${themeColors[theme as keyof typeof themeColors]} text-white p-2 rounded-lg`}
            onClick={handleSend}
          >
            <Send size={12} />
          </button>
        </div>
      </div>
    );
  };

  const templates = [
    {
      id: "react-basic",
      name: "React Component",
      description: "TypeScript React component with props for easy customization",
      icon: <Code2 className="h-6 w-6" />,
      features: ["TypeScript", "Customizable Props", "Modern Hooks"],
      difficulty: "Beginner",
      code: `import React, { useState } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

export default Chatbot;

/* Add this CSS file (Chatbot.css) */
/*
.chatbot-container {
  position: fixed;
  width: 350px;
  height: 500px;
  border: 1px solid #ddd;
  border-radius: 12px;
  background: white;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  z-index: 1000;
}

.chatbot-bottom-right { bottom: 20px; right: 20px; }
.chatbot-bottom-left { bottom: 20px; left: 20px; }
.chatbot-top-right { top: 20px; right: 20px; }
.chatbot-top-left { top: 20px; left: 20px; }
.chatbot-center { 
  top: 50%; left: 50%; 
  transform: translate(-50%, -50%); 
}

.chatbot-purple { --primary-color: #6c47ff; }
.chatbot-blue { --primary-color: #2563eb; }
.chatbot-green { --primary-color: #16a34a; }
.chatbot-dark { --primary-color: #1f2937; }

.chatbot-small { width: 300px; height: 400px; }
.chatbot-medium { width: 350px; height: 500px; }
.chatbot-large { width: 400px; height: 600px; }
*/`
    },
    {
      id: "vanilla-js",
      name: "Vanilla JavaScript",
      description: "Pure JavaScript widget that works on any website",
      icon: <Globe className="h-6 w-6" />,
      features: ["No Dependencies", "Easy Integration", "Lightweight"],
      difficulty: "Beginner",
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
            border-radius: 12px;
            background: white;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            display: flex;
            flex-direction: column;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            z-index: 1000;
        }
        .chat-header {
            background: var(--primary-color, #6c47ff);
            color: white;
            padding: 16px;
            border-radius: 12px 12px 0 0;
            font-weight: 600;
        }
        .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            background: #fafafa;
        }
        .message {
            margin: 12px 0;
            padding: 10px 14px;
            border-radius: 12px;
            max-width: 85%;
            font-size: 14px;
            line-height: 1.4;
        }
        .user-message {
            background: var(--primary-color, #6c47ff);
            color: white;
            margin-left: auto;
            border-bottom-right-radius: 4px;
        }
        .bot-message {
            background: white;
            border: 1px solid #e5e7eb;
            border-bottom-left-radius: 4px;
        }
        .chat-input {
            display: flex;
            padding: 16px;
            border-top: 1px solid #e5e7eb;
            background: white;
            border-radius: 0 0 12px 12px;
        }
        .chat-input input {
            flex: 1;
            padding: 10px 14px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            margin-right: 8px;
            font-size: 14px;
        }
        .chat-input button {
            padding: 10px 16px;
            background: var(--primary-color, #6c47ff);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            transition: opacity 0.2s;
        }
        .chat-input button:hover {
            opacity: 0.9;
        }
        .chat-input button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    </style>
</head>
<body>
    <div class="chatbot-widget">
        <div class="chat-header">
            🤖 CogniDoc Assistant
        </div>
        <div class="chat-messages" id="chatMessages"></div>
        <div class="chat-input">
            <input type="text" id="userInput" placeholder="Ask me anything...">
            <button onclick="sendMessage()" id="sendBtn">Send</button>
        </div>
    </div>

    <script>
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
            const sendBtn = document.getElementById('sendBtn');
            const message = input.value.trim();
            
            if (!message) return;

            addMessage(message, true);
            input.value = '';
            sendBtn.disabled = true;
            sendBtn.textContent = 'Sending...';

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
            } finally {
                sendBtn.disabled = false;
                sendBtn.textContent = 'Send';
            }
        }

        document.getElementById('userInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        // Initial greeting
        setTimeout(() => {
            addMessage('Hello! I\\'m your CogniDoc assistant. How can I help you today?');
        }, 500);
    </script>
</body>
</html>`
    },
    {
      id: "nextjs-component",
      name: "Next.js Component",
      description: "Modern Next.js component with Tailwind CSS and TypeScript",
      icon: <Smartphone className="h-6 w-6" />,
      features: ["Tailwind CSS", "TypeScript", "Server Components"],
      difficulty: "Intermediate",
      code: `'use client';

import { useState } from 'react';
import { Send, Bot, User, X, Minus } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface CogniDocChatbotProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme?: 'purple' | 'blue' | 'green' | 'dark';
  size?: 'small' | 'medium' | 'large';
  sessionToken: string;
  apiBaseUrl?: string;
  className?: string;
}

const CogniDocChatbot: React.FC<CogniDocChatbotProps> = ({
  position = 'bottom-right',
  theme = 'purple',
  size = 'medium',
  sessionToken,
  apiBaseUrl = 'http://localhost:8000',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'Hello! I\\'m your CogniDoc assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const themeClasses = {
    purple: 'bg-purple-600 hover:bg-purple-700 text-white',
    blue: 'bg-blue-600 hover:bg-blue-700 text-white',
    green: 'bg-green-600 hover:bg-green-700 text-white',
    dark: 'bg-gray-800 hover:bg-gray-900 text-white'
  };

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  };

  const sizeClasses = {
    small: 'w-80 h-96',
    medium: 'w-96 h-[500px]',
    large: 'w-[420px] h-[600px]'
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { 
      role: 'user', 
      content: input,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(\`\${apiBaseUrl}/query/askQuery\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${sessionToken}\`
        },
        body: JSON.stringify({ query: input })
      });

      const data = await response.json();
      
      const botMessage: Message = { 
        role: 'assistant', 
        content: response.ok ? (data.response || 'No response received') : 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = { 
        role: 'assistant', 
        content: 'Failed to connect to the server.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={\`fixed \${positionClasses[position]} \${themeClasses[theme]} w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 z-50 \${className}\`}
      >
        <Bot size={24} />
      </button>
    );
  }

  return (
    <div className={\`fixed \${positionClasses[position]} \${sizeClasses[size]} bg-white border border-gray-200 rounded-lg shadow-2xl flex flex-col z-50 \${className}\`}>
      {/* Header */}
      <div className={\`\${themeClasses[theme]} p-4 rounded-t-lg flex items-center justify-between\`}>
        <div className="flex items-center gap-2">
          <Bot size={20} />
          <h3 className="font-semibold">CogniDoc Assistant</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white/20 rounded"
          >
            <Minus size={16} />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/20 rounded"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={\`flex items-start gap-2 animate-fade-in \${
                  message.role === 'user' ? 'flex-row-reverse' : ''
                }\`}
              >
                <div className={\`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center \${
                  message.role === 'user' 
                    ? themeClasses[theme] 
                    : 'bg-gray-200 text-gray-600'
                }\`}>
                  {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={\`max-w-xs p-3 rounded-lg \${
                  message.role === 'user'
                    ? \`\${themeClasses[theme]} rounded-br-none\`
                    : 'bg-white border border-gray-200 rounded-bl-none'
                }\`}>
                  <p className="text-sm">{message.content}</p>
                  <span className={\`text-xs mt-1 block \${
                    message.role === 'user' ? 'text-white/70' : 'text-gray-500'
                  }\`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <Bot size={16} className="text-gray-600" />
                </div>
                <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-bl-none">
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
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className={\`\${themeClasses[theme]} p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200\`}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CogniDocChatbot;`
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Chatbot Templates
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Production-ready chatbot components that integrate seamlessly with your CogniDoc API. 
          Click on any template to customize and copy the code.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {templates.map((template) => (
          <Dialog key={template.id}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 hover-scale group border-2 hover:border-primary/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      {template.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {template.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="text-sm mb-4">
                    {template.description}
                  </CardDescription>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.features.map((feature) => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex justify-center mb-4">
                    <ChatbotPreview templateId={template.id} theme={config.theme} />
                  </div>
                  <Button className="w-full" variant="outline">
                    Customize & Copy Code
                  </Button>
                </CardContent>
              </Card>
            </DialogTrigger>
            
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {template.icon}
                  {template.name}
                </DialogTitle>
                <DialogDescription>
                  {template.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex-1 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
                  {/* Configuration Panel */}
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      Customize
                    </h3>
                    
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="position" className="text-sm font-medium">
                          Position
                        </Label>
                        <Select value={config.position} onValueChange={(value) => setConfig({...config, position: value})}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bottom-right">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-3 w-3" />
                                Bottom Right
                              </div>
                            </SelectItem>
                            <SelectItem value="bottom-left">Bottom Left</SelectItem>
                            <SelectItem value="top-right">Top Right</SelectItem>
                            <SelectItem value="top-left">Top Left</SelectItem>
                            <SelectItem value="center">Center</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="theme" className="text-sm font-medium">
                          Theme
                        </Label>
                        <Select value={config.theme} onValueChange={(value) => setConfig({...config, theme: value})}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="purple">Purple</SelectItem>
                            <SelectItem value="blue">Blue</SelectItem>
                            <SelectItem value="green">Green</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="size" className="text-sm font-medium">
                          Size
                        </Label>
                        <Select value={config.size} onValueChange={(value) => setConfig({...config, size: value})}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Small</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="large">Large</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <Button
                      onClick={() => copyToClipboard(generateCustomizedCode(template.code, template.id), template.name)}
                      className="w-full"
                      variant={copiedTemplate === template.name ? "secondary" : "default"}
                    >
                      {copiedTemplate === template.name ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Code
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {/* Code Panel */}
                  <div className="lg:col-span-3 flex flex-col min-h-0">
                    <h4 className="font-medium mb-2">Generated Code:</h4>
                    <div className="flex-1 min-h-0 border rounded-lg">
                      <pre className="bg-muted p-4 rounded-lg text-xs leading-relaxed h-full overflow-auto">
                        <code>{generateCustomizedCode(template.code, template.id)}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
        <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-3 flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Integration Guide
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-amber-700 dark:text-amber-300">
          <div>
            <h4 className="font-medium mb-2">Setup Steps:</h4>
            <ol className="space-y-1 list-decimal list-inside">
              <li>Get your session token from "Create Token" section</li>
              <li>Choose a template and customize it</li>
              <li>Replace <code className="bg-amber-100 dark:bg-amber-900 px-1 rounded">YOUR_SESSION_TOKEN</code></li>
              <li>Install in your project</li>
            </ol>
          </div>
          <div>
            <h4 className="font-medium mb-2">Features:</h4>
            <ul className="space-y-1 list-disc list-inside">
              <li>Responsive design with mobile support</li>
              <li>Customizable themes and positions</li>
              <li>Error handling and loading states</li>
              <li>TypeScript support included</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotTemplates;
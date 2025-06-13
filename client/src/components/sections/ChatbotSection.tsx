import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import { sendChatMessage, getChatHistory } from '@/lib/openai';
import { isUnauthorizedError } from '@/lib/authUtils';
import { Bot, User, Send, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  message: string;
  response?: string;
  timestamp: Date;
  isUser: boolean;
}

export function ChatbotSection() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      message: "Hi! I'm your AI fitness coach. I can help you with workout routines, nutrition advice, motivation, and answer any fitness-related questions. What would you like to know?",
      timestamp: new Date(),
      isUser: false,
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: chatHistory } = useQuery({
    queryKey: ['/api/chat/history'],
    queryFn: () => getChatHistory(20),
    enabled: isAuthenticated,
  });

  const sendMessageMutation = useMutation({
    mutationFn: sendChatMessage,
    onSuccess: (data) => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          message: data.response,
          timestamp: new Date(),
          isUser: false,
        }
      ]);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Chat Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (chatHistory && chatHistory.length > 0 && isAuthenticated) {
      const historyMessages = chatHistory.reverse().flatMap((chat: any) => [
        {
          id: `${chat.id}-user`,
          message: chat.message,
          timestamp: new Date(chat.timestamp),
          isUser: true,
        },
        {
          id: `${chat.id}-bot`,
          message: chat.response,
          timestamp: new Date(chat.timestamp),
          isUser: false,
        }
      ]);
      setMessages(prev => [prev[0], ...historyMessages]);
    }
  }, [chatHistory, isAuthenticated]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to chat with the AI coach.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }

    const userMessage = {
      id: Date.now().toString(),
      message: inputMessage,
      timestamp: new Date(),
      isUser: true,
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');

    sendMessageMutation.mutate(currentMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const askQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  const quickQuestions = [
    "How to lose weight effectively?",
    "Best muscle building exercises?",
    "Healthy meal prep ideas?",
    "Pre-workout nutrition tips?",
    "How to stay motivated?",
    "Recovery and rest days?"
  ];

  return (
    <section id="ai-chat" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Your Personal <span className="gradient-text">AI Coach</span>
          </h2>
          <p className="text-xl text-gray-300">Get instant answers about fitness, nutrition, and mental health</p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="glass-effect overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-electric to-neon-green p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <Bot className="h-6 w-6 text-electric" />
                </div>
                <div>
                  <div className="font-semibold text-dark-bg">FitBot AI</div>
                  <div className="text-sm text-dark-bg opacity-80">Your 24/7 fitness companion</div>
                </div>
                <div className="ml-auto">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            
            {/* Chat Messages */}
            <ScrollArea className="h-96 p-6">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 ${
                      message.isUser ? 'justify-end' : ''
                    }`}
                  >
                    {!message.isUser && (
                      <div className="w-8 h-8 bg-electric rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    )}
                    
                    <div
                      className={`rounded-2xl p-4 max-w-sm lg:max-w-lg ${
                        message.isUser
                          ? 'bg-gradient-to-r from-electric to-neon-green text-dark-bg rounded-tr-none'
                          : 'bg-gray-800 text-white rounded-tl-none'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                    </div>
                    
                    {message.isUser && (
                      <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Typing indicator */}
                {sendMessageMutation.isPending && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-electric rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-gray-800 rounded-2xl rounded-tl-none p-4">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            {/* Chat Input */}
            <div className="p-6 border-t border-gray-800">
              <div className="flex space-x-4">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about fitness, nutrition, or health..."
                  className="flex-1 bg-gray-800 border-gray-700 focus:ring-electric focus:border-transparent"
                  disabled={sendMessageMutation.isPending}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={sendMessageMutation.isPending || !inputMessage.trim()}
                  className="bg-gradient-to-r from-electric to-neon-green text-dark-bg hover:shadow-lg transition-all"
                >
                  {sendMessageMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {/* Quick Questions */}
              <div className="flex flex-wrap gap-2 mt-4">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => askQuickQuestion(question)}
                    className="text-xs bg-gray-800 hover:bg-gray-700 border-gray-700 transition-colors"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

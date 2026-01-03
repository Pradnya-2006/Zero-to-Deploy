import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Hi! 👋 I'm your Eco Assistant. I can help you understand your carbon footprint and suggest ways to reduce it. What would you like to know?",
    isBot: true,
    timestamp: new Date(),
  },
];

const suggestions = [
  "How can I reduce my footprint?",
  "What's my biggest emission source?",
  "Tips for saving energy",
  "Explain carbon offsets",
];

const botResponses: Record<string, string> = {
  "reduce": "Based on your dashboard, your highest emissions come from electricity usage. Here are 3 quick wins:\n\n1. 💡 Switch to LED bulbs - saves 75% energy\n2. 🌡️ Adjust thermostat by 2°C - saves 10% on heating\n3. 🔌 Unplug devices when not in use\n\nWould you like more specific tips?",
  "biggest": "Looking at your data, **electricity usage** accounts for 45% of your carbon footprint (1,800 kg CO₂/year). This is followed by transportation at 35% and lifestyle choices at 20%.\n\nWant me to suggest ways to reduce your electricity emissions?",
  "energy": "Here are my top energy-saving tips:\n\n• Use natural light during the day\n• Wash clothes in cold water\n• Run dishwasher only when full\n• Enable power-saving mode on devices\n• Consider smart power strips\n\nThese changes can reduce your energy footprint by up to 25%!",
  "offset": "Carbon offsets are credits that fund projects reducing CO₂ elsewhere (like planting trees or renewable energy). They help compensate for emissions you can't eliminate.\n\n**However**, reducing your actual footprint should always come first! Offsets are best used for unavoidable emissions like flights.\n\nWant to explore reduction strategies first?",
  "default": "That's a great question! I'd recommend checking your Dashboard for personalized insights, or exploring the Recommendations page for actionable tips.\n\nIs there something specific about reducing your carbon footprint I can help with?",
};

export function EcoAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('reduce') || lowerMessage.includes('lower') || lowerMessage.includes('decrease')) {
      return botResponses.reduce;
    }
    if (lowerMessage.includes('biggest') || lowerMessage.includes('highest') || lowerMessage.includes('source')) {
      return botResponses.biggest;
    }
    if (lowerMessage.includes('energy') || lowerMessage.includes('electricity') || lowerMessage.includes('power')) {
      return botResponses.energy;
    }
    if (lowerMessage.includes('offset') || lowerMessage.includes('credit') || lowerMessage.includes('compensate')) {
      return botResponses.offset;
    }
    
    return botResponses.default;
  };

  const handleSend = (text: string = input) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: text.trim(),
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate bot response delay
    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now() + 1,
        text: getBotResponse(text),
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gradient-emerald shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 glow-emerald',
          isOpen && 'rotate-90'
        )}
        aria-label="Toggle Eco Assistant"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-primary-foreground" />
        ) : (
          <MessageCircle className="w-6 h-6 text-primary-foreground" />
        )}
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          'fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] bg-card rounded-2xl shadow-lg border border-border overflow-hidden transition-all duration-300',
          isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
        )}
      >
        {/* Header */}
        <div className="gradient-emerald p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-primary-foreground">Eco Assistant</h3>
            <p className="text-xs text-primary-foreground/80">Always here to help</p>
          </div>
        </div>

        {/* Messages */}
        <div className="h-80 overflow-y-auto p-4 space-y-4 bg-background/50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex',
                message.isBot ? 'justify-start' : 'justify-end'
              )}
            >
              <div
                className={cn(
                  'chat-bubble animate-scale-in',
                  message.isBot ? 'chat-bubble-bot' : 'chat-bubble-user'
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="chat-bubble chat-bubble-bot">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 2 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border bg-card">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isTyping}
              className="gradient-emerald text-primary-foreground"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}

import { useState } from 'react';
import { Sparkles, Send, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
}

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Hello! 👋 I'm your Eco Assistant, here to help you understand and reduce your carbon footprint. Based on your dashboard data, I can see you're making great progress!\n\nWhat would you like to know about sustainability today?",
    isBot: true,
  },
];

const suggestions = [
  "How can I reduce my electricity usage?",
  "What's the impact of my diet?",
  "Should I buy carbon offsets?",
  "Tips for sustainable shopping",
  "How to reduce transport emissions?",
  "Explain renewable energy options",
];

const botResponses: Record<string, string> = {
  electricity: `Great question! Here are my top tips for reducing electricity usage:

**Quick Wins:**
• Switch to LED bulbs (saves 75% energy)
• Unplug devices when not in use
• Use power strips to eliminate phantom loads

**Medium Effort:**
• Upgrade to energy-efficient appliances
• Install a smart thermostat
• Use natural light during the day

**Big Impact:**
• Consider solar panels
• Improve home insulation
• Switch to a green energy provider

Based on your profile, focusing on appliance efficiency could save you about 200 kg CO₂/year!`,

  diet: `Your diet has a significant impact on your carbon footprint! Food production accounts for about 26% of global emissions.

**High Impact Changes:**
• Reduce beef and lamb consumption (highest emissions)
• Try plant-based alternatives
• Buy local and seasonal produce

**Your Personalized Tips:**
Looking at your profile, adding one meatless day per week could save ~340 kg CO₂/year.

**Easy Swaps:**
• Oat milk instead of dairy (3x lower emissions)
• Chicken instead of beef (10x lower emissions)
• Local vegetables instead of imported ones`,

  offset: `Carbon offsets can be part of your climate strategy, but they work best as a complement to reduction efforts, not a replacement.

**When Offsets Make Sense:**
• For unavoidable emissions (like essential flights)
• After you've reduced what you can
• As part of a broader sustainability plan

**Choosing Quality Offsets:**
Look for verified projects (Gold Standard, VCS) that offer:
• Additionality (wouldn't happen without funding)
• Permanence (long-term carbon storage)
• Transparency (clear monitoring and reporting)

**My Recommendation:**
Based on your 4,000 kg CO₂/year footprint, focus first on the recommendations I've provided - you could reduce by 30% before considering offsets!`,

  shopping: `Sustainable shopping can significantly reduce your footprint! Here's how:

**Before You Buy:**
• Ask: "Do I really need this?"
• Consider second-hand options
• Research brand sustainability practices

**When Buying:**
• Choose quality over quantity
• Look for eco-certifications
• Buy local when possible

**Packaging & Delivery:**
• Choose minimal packaging
• Consolidate orders to reduce shipping
• Opt for slower shipping (more efficient)

Based on typical consumption patterns, mindful shopping could save 200-400 kg CO₂/year!`,

  transport: `Transport is often the largest part of a personal carbon footprint. Here's how to reduce yours:

**Daily Commute:**
• Work from home when possible
• Use public transit (5x less emissions than driving)
• Carpool with colleagues

**Car Choices:**
• Consider an EV for your next vehicle
• Keep tires properly inflated (improves efficiency)
• Combine trips to reduce total driving

**Travel:**
• Choose trains over planes for shorter trips
• If flying, choose direct flights (takeoff/landing use most fuel)

Looking at your calculator data, switching your commute could be your biggest opportunity - potentially saving 400+ kg CO₂/year!`,

  renewable: `Switching to renewable energy is one of the most impactful changes you can make!

**Options Available:**
• **Green Energy Plans:** Many utilities offer 100% renewable options
• **Solar Panels:** Typical payback period of 6-10 years
• **Community Solar:** Share in a local solar project

**Benefits:**
• Eliminate most of your energy-related emissions
• Often competitive pricing with traditional energy
• Energy independence and stable costs

**Your Potential Impact:**
Based on your electricity usage, switching to renewables could eliminate ~1,200 kg CO₂/year - that's 30% of your total footprint!

Would you like me to calculate the specific impact for your situation?`,

  default: `That's a great topic to explore! While I don't have specific information on that, here are some general tips:

1. **Start with your biggest impact areas** - Check your Emissions Breakdown to see where to focus
2. **Take small, consistent steps** - Sustainable habits build over time
3. **Track your progress** - Use the Goals feature to stay motivated

Is there something specific about your carbon footprint I can help you with? I'm here to provide personalized advice based on your dashboard data!`,
};

export default function Assistant() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const getBotResponse = (userMessage: string): string => {
    const lower = userMessage.toLowerCase();
    
    if (lower.includes('electric') || lower.includes('power') || lower.includes('energy') || lower.includes('appliance')) {
      return botResponses.electricity;
    }
    if (lower.includes('diet') || lower.includes('food') || lower.includes('eat') || lower.includes('meat')) {
      return botResponses.diet;
    }
    if (lower.includes('offset') || lower.includes('credit') || lower.includes('compensate')) {
      return botResponses.offset;
    }
    if (lower.includes('shop') || lower.includes('buy') || lower.includes('purchase') || lower.includes('product')) {
      return botResponses.shopping;
    }
    if (lower.includes('transport') || lower.includes('car') || lower.includes('drive') || lower.includes('commute') || lower.includes('fly')) {
      return botResponses.transport;
    }
    if (lower.includes('renewable') || lower.includes('solar') || lower.includes('wind') || lower.includes('green energy')) {
      return botResponses.renewable;
    }
    
    return botResponses.default;
  };

  const handleSend = (text: string = input) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: text.trim(),
      isBot: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now() + 1,
        text: getBotResponse(text),
        isBot: true,
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 500);
  };

  return (
    <div className="page-container h-[calc(100vh-4rem)] lg:h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 gradient-emerald rounded-xl flex items-center justify-center shadow-glow">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="page-title">Eco Assistant</h1>
            <p className="text-sm text-muted-foreground">Your personal sustainability guide</p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col dashboard-card overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`chat-bubble animate-scale-in ${
                  message.isBot ? 'chat-bubble-bot' : 'chat-bubble-user'
                }`}
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
        </div>

        {/* Suggestions */}
        <div className="px-4 py-3 border-t border-border bg-muted/30">
          <p className="text-xs text-muted-foreground mb-2">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.slice(0, 3).map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSend(suggestion)}
                className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
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
              placeholder="Ask me about sustainability..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="gradient-emerald text-primary-foreground"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

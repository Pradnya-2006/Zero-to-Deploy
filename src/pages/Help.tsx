import { useState } from 'react';
import {
  HelpCircle,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Mail,
  ExternalLink,
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const faqs = [
  {
    question: 'How is my carbon footprint calculated?',
    answer: 'Your carbon footprint is calculated based on your energy usage, transportation habits, and lifestyle choices. We use scientifically validated emission factors from sources like the EPA and IPCC to convert your activities into CO₂ equivalent emissions.',
  },
  {
    question: 'How often should I update my calculator data?',
    answer: 'We recommend updating your data monthly for accurate tracking. Major life changes (new car, moving, dietary changes) should be updated immediately to reflect in your footprint calculation.',
  },
  {
    question: 'What is the average carbon footprint?',
    answer: 'The global average is about 4 tonnes CO₂ per person per year. However, this varies significantly by country - US residents average about 16 tonnes, while European averages are around 6-8 tonnes.',
  },
  {
    question: 'How do I reduce my carbon footprint effectively?',
    answer: 'Focus on the biggest impact areas first: energy efficiency, transportation choices, and dietary changes. Our Recommendations page provides personalized suggestions based on your specific footprint profile.',
  },
  {
    question: 'Can I export my data?',
    answer: 'Yes! You can download your data as a PDF report from the Reports page. You can also share your progress with others to inspire collective action.',
  },
  {
    question: 'Is my data private and secure?',
    answer: 'Absolutely. We take data privacy seriously. Your personal information is encrypted and never shared with third parties without your explicit consent. You can manage your privacy settings anytime.',
  },
];

export default function Help() {
  const { toast } = useToast();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [feedback, setFeedback] = useState({ name: '', email: '', message: '' });

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Feedback submitted',
      description: 'Thank you for your feedback! We\'ll get back to you soon.',
    });
    setFeedback({ name: '', email: '', message: '' });
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div>
        <h1 className="page-title">Help & Support</h1>
        <p className="page-subtitle">Find answers and get in touch</p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="dashboard-card text-center group hover:border-primary/30">
          <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <HelpCircle className="w-7 h-7 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">FAQs</h3>
          <p className="text-sm text-muted-foreground">
            Find answers to commonly asked questions below
          </p>
        </div>

        <div className="dashboard-card text-center group hover:border-primary/30">
          <div className="w-14 h-14 mx-auto rounded-xl bg-warning/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <MessageSquare className="w-7 h-7 text-warning" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Eco Assistant</h3>
          <p className="text-sm text-muted-foreground">
            Chat with our AI for personalized help
          </p>
        </div>

        <div className="dashboard-card text-center group hover:border-primary/30">
          <div className="w-14 h-14 mx-auto rounded-xl bg-success/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Mail className="w-7 h-7 text-success" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Contact Us</h3>
          <p className="text-sm text-muted-foreground">
            Send us feedback or report issues
          </p>
        </div>
      </div>

      {/* FAQs */}
      <div className="dashboard-card">
        <h2 className="font-semibold text-foreground mb-6 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary" />
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isExpanded = expandedFaq === index;

            return (
              <div
                key={index}
                className={cn(
                  'rounded-xl border transition-all',
                  isExpanded ? 'border-primary/30 bg-primary/5' : 'border-border'
                )}
              >
                <button
                  onClick={() => setExpandedFaq(isExpanded ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="font-medium text-foreground pr-4">{faq.question}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 animate-fade-in">
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Feedback Form */}
      <div className="dashboard-card">
        <h2 className="font-semibold text-foreground mb-6 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          Send Feedback
        </h2>

        <form onSubmit={handleSubmitFeedback} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="feedback-name">Name</Label>
              <Input
                id="feedback-name"
                value={feedback.name}
                onChange={(e) => setFeedback({ ...feedback, name: e.target.value })}
                placeholder="Your name"
                className="mt-1.5"
                required
              />
            </div>
            <div>
              <Label htmlFor="feedback-email">Email</Label>
              <Input
                id="feedback-email"
                type="email"
                value={feedback.email}
                onChange={(e) => setFeedback({ ...feedback, email: e.target.value })}
                placeholder="your@email.com"
                className="mt-1.5"
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="feedback-message">Message</Label>
            <Textarea
              id="feedback-message"
              value={feedback.message}
              onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
              placeholder="Tell us what you think, report a bug, or suggest a feature..."
              className="mt-1.5 min-h-32"
              required
            />
          </div>
          <Button type="submit" className="gradient-emerald text-primary-foreground">
            Send Feedback
          </Button>
        </form>
      </div>

      {/* About */}
      <div className="dashboard-card text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl gradient-emerald flex items-center justify-center mb-4 shadow-glow">
          <Heart className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="font-semibold text-foreground text-xl mb-2">About EcoTrack</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
          EcoTrack was created to help individuals and organizations understand and reduce their environmental impact.
          Our mission is to make sustainability accessible, actionable, and rewarding for everyone.
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Version 1.0.0 • Made with 💚 for the planet
        </p>
        <div className="flex justify-center gap-3">
          <Button variant="outline" className="gap-2" asChild>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
              GitHub
            </a>
          </Button>
          <Button variant="outline" className="gap-2" asChild>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
              Twitter
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

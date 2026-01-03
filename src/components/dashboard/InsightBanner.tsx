import { Lightbulb, ArrowRight, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface InsightBannerProps {
  message: string;
  actionText?: string;
  onAction?: () => void;
}

export function InsightBanner({
  message,
  actionText = 'View recommendations',
  onAction,
}: InsightBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-xl p-4 border border-primary/20 animate-fade-in">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3 pr-8">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Lightbulb className="w-5 h-5 text-primary" />
        </div>

        <div className="flex-1">
          <p className="text-sm font-medium text-foreground mb-1">Insight</p>
          <p className="text-sm text-muted-foreground mb-3">{message}</p>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onAction}
            className="text-primary hover:text-primary hover:bg-primary/10 -ml-3"
          >
            {actionText}
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}

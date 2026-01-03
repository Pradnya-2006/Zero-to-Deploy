import { ArrowRight, Zap, Car, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface RecommendationCardProps {
  title: string;
  description: string;
  impact: number;
  category: 'energy' | 'transport' | 'lifestyle';
  difficulty: 'easy' | 'medium' | 'hard';
}

const categoryConfig = {
  energy: {
    icon: Zap,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  transport: {
    icon: Car,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  lifestyle: {
    icon: Leaf,
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
};

const difficultyConfig = {
  easy: 'badge-success',
  medium: 'badge-warning',
  hard: 'badge-error',
};

export function RecommendationCard({
  title,
  description,
  impact,
  category,
  difficulty,
}: RecommendationCardProps) {
  const { icon: Icon, color, bgColor } = categoryConfig[category];

  return (
    <div className="dashboard-card group hover:border-primary/30 transition-all duration-200">
      <div className="flex items-start gap-4">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', bgColor)}>
          <Icon className={cn('w-5 h-5', color)} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-medium text-foreground line-clamp-1">{title}</h4>
            <span className={cn('flex-shrink-0', difficultyConfig[difficulty])}>
              {difficulty}
            </span>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{description}</p>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-success">
              Save {impact} kg CO₂/year
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary hover:bg-primary/10 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Learn more
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

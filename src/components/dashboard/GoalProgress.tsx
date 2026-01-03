import { Target, TrendingDown } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface GoalProgressProps {
  currentValue: number;
  targetValue: number;
  unit?: string;
}

export function GoalProgress({
  currentValue = 3200,
  targetValue = 4000,
  unit = 'kg CO₂',
}: GoalProgressProps) {
  const percentage = Math.round((1 - currentValue / targetValue) * 100);
  const progressValue = Math.round((currentValue / targetValue) * 100);

  return (
    <div className="dashboard-card">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Target className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Annual Goal Progress</h3>
          <p className="text-sm text-muted-foreground">Reduce to 3,000 kg by year end</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Progress value={100 - progressValue} className="h-4 bg-muted" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium text-primary-foreground mix-blend-difference">
              {percentage}% reduced
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-success" />
            <span className="text-muted-foreground">
              Current: <span className="font-medium text-foreground">{currentValue.toLocaleString()} {unit}</span>
            </span>
          </div>
          <span className="text-muted-foreground">
            Target: <span className="font-medium text-foreground">{targetValue.toLocaleString()} {unit}</span>
          </span>
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            You're <span className="font-medium text-success">on track</span> to meet your goal! 
            Keep reducing 66 kg/month to reach your target.
          </p>
        </div>
      </div>
    </div>
  );
}

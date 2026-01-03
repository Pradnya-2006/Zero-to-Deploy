import { Target, TrendingDown } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface GoalProgressProps {
  currentValue: number;
  targetValue: number;
  unit?: string;
  onClick?: () => void;
  subtitle?: string;
}

export function GoalProgress({
  currentValue = 0,
  targetValue = 0,
  unit = 'kg CO₂',
  onClick,
  subtitle = 'Reduce to your goal targets',
}: GoalProgressProps) {
  const isComplete = currentValue <= targetValue;
  // original intent: percentage reduced and a progress bar value, but clamp to 0-100
  const rawPercentage = Math.round((1 - currentValue / targetValue) * 100);
  const percentage = Math.max(0, Math.min(100, rawPercentage));
  const rawProgress = Math.round((currentValue / targetValue) * 100);
  const progressValue = Math.max(0, Math.min(100, rawProgress));

  return (
    <div
      role={onClick ? 'button' : undefined}
      onClick={onClick}
      className={onClick ? 'dashboard-card cursor-pointer' : 'dashboard-card'}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Target className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Your Progress from Goals</h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Progress value={Math.max(0, Math.min(100, 100 - progressValue))} className="h-4 bg-muted" />
          {/* removed centered percentage text per request */}
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
            {isComplete ? (
              <span>Goal <span className="font-medium text-success">completed</span>. Great work!</span>
            ) : (
              <span>You're <span className="font-medium text-success">on track</span> to meet your goal! Keep reducing 66 kg/month to reach your target.</span>
            )}
          </p>
          {isComplete && (
            <div className="absolute right-4 -mt-12">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center border border-green-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.172 4.707 7.879a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

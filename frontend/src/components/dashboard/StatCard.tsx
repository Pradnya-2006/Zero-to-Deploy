import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  accentColor?: 'primary' | 'success' | 'warning' | 'destructive';
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
  accentColor = 'primary',
}: StatCardProps) {
  const accentColors = {
    primary: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    destructive: 'bg-destructive',
  };

  return (
    <div className={cn('dashboard-card relative overflow-hidden group', className)}>
      {/* Accent bar */}
      <div className={cn('absolute top-0 left-0 w-1 h-full rounded-l-xl', accentColors[accentColor])} />

      {/* Background decoration */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full transition-transform duration-300 group-hover:scale-150" />

      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="metric-label">{title}</p>
          <p className="metric-value">{value}</p>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  'text-sm font-medium',
                  trend.isPositive ? 'text-success' : 'text-destructive'
                )}
              >
                {trend.isPositive ? '↓' : '↑'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>

        <div className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110',
          accentColor === 'primary' && 'bg-primary/10 text-primary',
          accentColor === 'success' && 'bg-success/10 text-success',
          accentColor === 'warning' && 'bg-warning/10 text-warning',
          accentColor === 'destructive' && 'bg-destructive/10 text-destructive',
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

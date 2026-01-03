import { useEffect, useState } from 'react';
import { Target, TrendingDown, Award, Check, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

interface Goal {
  _id: string;
  title: string;
  target: number; // target value (targetKgCO2)
  current: number; // current value
  unit?: string;
  deadline?: string | null;
}

// milestones are derived from current aggregate progress below

export default function Goals() {
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    target: [3000],
    unit: 'kg CO₂',
    deadline: '',
    current: '',
  });

  const handleAddGoal = async () => {
    if (!newGoal.title || !newGoal.deadline) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    const payload: Record<string, any> = {
      title: newGoal.title,
      targetKgCO2: Number(newGoal.target[0]),
      deadline: newGoal.deadline,
    };

    // include optional currentValue if provided
    if (newGoal.current !== '' && newGoal.current !== null && typeof newGoal.current !== 'undefined') {
      payload.currentValue = Number(newGoal.current);
    }

    try {
      const token = localStorage.getItem('token');
      const headers: Record<string,string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/goals', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to create goal');
      }

      const saved = await res.json();
      // refetch goals to keep UI in sync with DB
      await fetchGoals();
      setNewGoal({ title: '', target: [3000], unit: 'kg CO₂', deadline: '', current: '' });
      setIsDialogOpen(false);

      toast({
        title: 'Goal created!',
        description: 'Your new goal has been added. Good luck!',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.message || 'Could not create goal',
        variant: 'destructive',
      });
    }
  };

  const fetchGoals = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string,string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/goals', { headers });
      if (!res.ok) throw new Error('Failed to fetch goals');
      const data = await res.json();
      // map server shape to local Goal shape
      const mapped: Goal[] = data.map((g: any) => {
        const targetVal = Number(g.targetKgCO2 || 0);
        const currentVal = typeof g.currentValue !== 'undefined' && g.currentValue !== null
          ? Number(g.currentValue)
          : targetVal;

        return {
          _id: g._id,
          title: g.title,
          target: targetVal,
          current: currentVal,
          unit: 'kg CO₂',
          deadline: g.deadline ? new Date(g.deadline).toLocaleDateString() : '',
        } as Goal;
      });
      setGoals(mapped);
    } catch (err: any) {
      setFetchError(err?.message || 'Error fetching goals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  // Aggregate progress from goals
  const totalTarget = goals.reduce((s, g) => s + (g.target || 0), 0);
  const totalCurrent = goals.reduce((s, g) => s + (g.current || 0), 0);
  const reduction = totalTarget - totalCurrent;
  const reductionPercentage = totalTarget > 0 ? Math.round((reduction / totalTarget) * 100) : 0;

  // derive milestones dynamically
  const milestones = [
    { title: 'First calculation', description: 'Completed your first carbon footprint calculation', earned: goals.length > 0, icon: '🎯' },
    { title: '10% reduction', description: 'Reduced your footprint by 10%', earned: reductionPercentage >= 10, icon: '📉' },
    { title: '20% reduction', description: 'Reduced your footprint by 20%', earned: reductionPercentage >= 20, icon: '🔥' },
    { title: 'Carbon neutral', description: 'Achieve net-zero emissions', earned: totalCurrent <= 0, icon: '🌍' },
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="page-title">Goals & Progress</h1>
          <p className="page-subtitle">Track your sustainability goals and achievements</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 gradient-emerald text-primary-foreground">
              <Plus className="w-4 h-4" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
              <DialogDescription>
                Set a sustainability goal to track your progress.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Goal Title</label>
                <Input
                  placeholder="e.g., Reduce electricity usage"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Target ({newGoal.unit})
                </label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={newGoal.target}
                    onValueChange={(value) => setNewGoal({ ...newGoal, target: value })}
                    max={5000}
                    min={100}
                    step={100}
                    className="flex-1"
                  />
                  <span className="w-20 text-right font-semibold">{newGoal.target[0]}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Deadline</label>
                <Input
                  placeholder="e.g., Dec 2024"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Current value (optional)</label>
                <Input
                  type="number"
                  placeholder="e.g., 3200"
                  value={newGoal.current}
                  onChange={(e) => setNewGoal({ ...newGoal, current: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1">Optional: set the current baseline for this goal.</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddGoal} className="gradient-emerald text-primary-foreground">
                Create Goal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Before vs After Comparison */}
      <div className="dashboard-card">
        <h3 className="font-semibold text-foreground mb-6 flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-success" />
          Your Progress
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Before */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Starting Footprint</p>
            <p className="text-4xl font-bold text-foreground mb-1">{totalTarget.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">kg CO₂/year</p>
          </div>

          {/* Arrow */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full gradient-emerald flex items-center justify-center shadow-glow">
              <TrendingDown className="w-8 h-8 text-primary-foreground" />
            </div>
            <p className="mt-2 font-semibold text-success">-{reductionPercentage}%</p>
          </div>

          {/* After */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Current Footprint</p>
            <p className="text-4xl font-bold text-success mb-1">{totalCurrent.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">kg CO₂/year</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-muted-foreground">
            You've saved <span className="font-semibold text-success">{reduction} kg CO₂</span> since you started tracking!
          </p>
        </div>
      </div>

      {/* Active Goals */}
      <div>
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Active Goals
        </h3>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
          </div>
        ) : fetchError ? (
          <div className="dashboard-card text-destructive">Error: {fetchError}</div>
        ) : goals.length === 0 ? (
          <div className="dashboard-card">No goals yet. Create your first goal.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map((goal) => {
              const targetValue = goal.target || 1;
              const currentValue = goal.current ?? 0;
              const progressPercentage = Math.min(100, Math.round((currentValue / targetValue) * 100));
              const isCompleted = currentValue >= targetValue;

              return (
                <div
                  key={goal._id}
                  className={cn('dashboard-card', isCompleted && 'border-success/30 bg-success/5')}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-foreground">{goal.title}</h4>
                      <p className="text-sm text-muted-foreground">{goal.deadline}</p>
                    </div>
                    {isCompleted && (
                      <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center">
                        <Check className="w-5 h-5 text-success-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Progress value={progressPercentage} className={cn('h-3', isCompleted && '[&>div]:bg-success')} />

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Current: <span className="font-medium text-foreground">{currentValue} kg CO₂</span>
                      </span>
                      <span className="text-muted-foreground">
                        Target: <span className="font-medium text-foreground">{targetValue} kg CO₂</span>
                      </span>
                    </div>

                    {!isCompleted && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-primary">{Math.max(0, targetValue - currentValue)} kg CO₂</span> to go
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Milestones */}
      <div>
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-warning" />
          Milestones & Achievements
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {milestones.map((milestone) => (
            <div
              key={milestone.title}
              className={cn(
                'dashboard-card text-center py-4',
                !milestone.earned && 'opacity-50 grayscale'
              )}
            >
              <div className="text-4xl mb-2">{milestone.icon}</div>
              <h4 className="font-medium text-foreground text-sm mb-1">{milestone.title}</h4>
              <p className="text-xs text-muted-foreground line-clamp-2">{milestone.description}</p>
              {milestone.earned && (
                <span className="badge-success mt-2 inline-block">Earned</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

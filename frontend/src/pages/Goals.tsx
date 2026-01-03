import { useEffect, useState } from 'react';
import { Target, TrendingDown, Award, Check, Plus, Trash } from 'lucide-react';
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
  status?: 'active' | 'achieved' | 'missed';
  progress?: number;
  category?: string;
  description?: string;
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
    targetType: 'absolute',
    unit: 'kg CO₂',
    startDate: '',
    endDate: '',
    category: 'general',
    description: '',
    current: '',
  });
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleAddGoal = async () => {
    if (!newGoal.title || !newGoal.startDate || !newGoal.endDate) {
      toast({
        title: 'Missing information',
        description: 'Please fill in title, start and end dates.',
        variant: 'destructive',
      });
      return;
    }

    // validation: current must be greater than target
    const cur = Number(newGoal.current || 0);
    const targ = Number(newGoal.target[0]);
    if (!(cur > (newGoal.targetType === 'percentage' ? cur * (1 - Number(targ) / 100) : targ))) {
      toast({
        title: 'Invalid values',
        description: 'Current value must be greater than target value.',
        variant: 'destructive',
      });
      return;
    }

    const payload: Record<string, any> = {
      title: newGoal.title,
      targetValue: Number(newGoal.target[0]),
      targetType: newGoal.targetType || 'absolute',
      startDate: newGoal.startDate,
      endDate: newGoal.endDate,
      category: newGoal.category,
      description: newGoal.description,
      currentValue: Number(newGoal.current),
    };

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
      setNewGoal({ title: '', target: [3000], targetType: 'absolute', unit: 'kg CO₂', deadline: '', category: 'general', description: '', current: '' });
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
        const progress = typeof g.progressPercent === 'number' ? Number(g.progressPercent) : Math.min(100, Math.round((currentVal / (targetVal || 1)) * 100));
        const start = g.startDate ? new Date(g.startDate).toLocaleDateString() : '';
        const end = g.endDate ? new Date(g.endDate).toLocaleDateString() : '';

        return {
          _id: g._id,
          title: g.title,
          target: targetVal,
          current: currentVal,
          unit: 'kg CO₂',
          deadline: start && end ? `${start} — ${end}` : (g.endDate ? new Date(g.endDate).toLocaleDateString() : ''),
          // attach progress for UI if needed
          progress,
          category: g.category || 'general',
          description: g.description || '',
          status: g.status || 'active',
        } as any as Goal;
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
                <div className="flex items-center gap-4 mb-2">
                  <button
                    className={cn('px-2 py-1 rounded', newGoal.targetType === 'absolute' ? 'bg-primary text-white' : 'bg-muted/20')}
                    onClick={() => setNewGoal({ ...newGoal, targetType: 'absolute' })}
                  >Absolute</button>
                  <button
                    className={cn('px-2 py-1 rounded', newGoal.targetType === 'percentage' ? 'bg-primary text-white' : 'bg-muted/20')}
                    onClick={() => setNewGoal({ ...newGoal, targetType: 'percentage' })}
                  >Percentage</button>
                </div>
                {newGoal.targetType === 'absolute' ? (
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
                ) : (
                  <div className="flex items-center gap-4">
                    <Slider
                      value={newGoal.target}
                      onValueChange={(value) => setNewGoal({ ...newGoal, target: value })}
                      max={100}
                      min={1}
                      step={1}
                      className="flex-1"
                    />
                    <span className="w-20 text-right font-semibold">{newGoal.target[0]}%</span>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Start Date</label>
                  <Input
                    type="date"
                    min={(() => {
                      const d = new Date();
                      d.setDate(d.getDate() + 1);
                      return d.toISOString().slice(0, 10);
                    })()}
                    value={newGoal.startDate}
                    onChange={(e) => setNewGoal({ ...newGoal, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">End Date</label>
                  <Input
                    type="date"
                    min={newGoal.startDate || (() => { const d = new Date(); d.setDate(d.getDate()+1); return d.toISOString().slice(0,10); })()}
                    value={newGoal.endDate}
                    onChange={(e) => setNewGoal({ ...newGoal, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                  className="w-full p-2 rounded border"
                >
                  <option value="general">General</option>
                  <option value="electricity">Electricity</option>
                  <option value="transport">Transport</option>
                  <option value="lifestyle">Lifestyle</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Description (optional)</label>
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  className="w-full p-2 rounded border h-24"
                  placeholder="Describe your goal or actions you'll take"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Current value</label>
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
            <p className="text-sm text-muted-foreground mb-2">Targeted Footprint</p>
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
              const progressPercentage = typeof (goal as any).progress === 'number' ? (goal as any).progress : Math.min(100, Math.round(((targetValue - currentValue) / (targetValue || 1)) * 100));
              const isCompleted = currentValue <= targetValue;

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
                    {/* removed duplicate header check - status badge and progress bar indicate completion */}
                  </div>

                    <div className="space-y-3">
                      <Progress value={goal.status === 'achieved' ? 100 : progressPercentage} className={cn('h-3', goal.status === 'achieved' ? '[&>div]:bg-success' : isCompleted && '[&>div]:bg-success')} />

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

                    <div className="pt-2 flex items-center gap-2">
                      <span className={cn('text-xs font-medium px-2 py-1 rounded',
                        goal.status === 'achieved' ? 'bg-green-100 text-green-800' : goal.status === 'missed' ? 'bg-yellow-100 text-yellow-800' : 'bg-muted/10 text-muted-foreground')}
                      >{goal.status?.toUpperCase()}</span>

                      <Button
                        size="sm"
                        disabled={goal.status !== 'active'}
                        onClick={async () => {
                          // optimistic UI update: mark achieved visually immediately
                          setGoals((prev) => prev.map((pg) => (pg._id === goal._id ? { ...pg, status: 'achieved', progress: 100 } : pg)));
                          try {
                            const token = localStorage.getItem('token');
                            const headers: Record<string,string> = { 'Content-Type': 'application/json' };
                            if (token) headers['Authorization'] = `Bearer ${token}`;
                            const res = await fetch(`${API_URL}/api/goals/${goal._id}/complete`, { method: 'PATCH', headers });
                            if (!res.ok) {
                              const errBody = await res.json().catch(() => ({}));
                              throw new Error(errBody.message || 'Failed to mark complete');
                            }
                            // reconcile with server response
                            const updated = await res.json().catch(() => null);
                            if (updated && updated._id) {
                              await fetchGoals();
                              toast({ title: 'Goal updated', description: updated.status === 'achieved' ? 'Marked achieved' : 'Marked (may be missed)' });
                            } else {
                              await fetchGoals();
                              toast({ title: 'Goal updated', description: 'Marked as completed.' });
                            }
                          } catch (err: any) {
                            // revert optimistic change on error
                            await fetchGoals();
                            toast({ title: 'Error', description: err?.message || 'Could not update goal', variant: 'destructive' });
                          }
                        }}
                      >Mark as Completed</Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          const ok = window.confirm('Delete this goal? This cannot be undone.');
                          if (!ok) return;
                          try {
                            const token = localStorage.getItem('token');
                            const headers: Record<string,string> = { 'Content-Type': 'application/json' };
                            if (token) headers['Authorization'] = `Bearer ${token}`;
                            const res = await fetch(`${API_URL}/api/goals/${goal._id}`, { method: 'DELETE', headers });
                            if (!res.ok) {
                              const errBody = await res.json().catch(() => ({}));
                              throw new Error(errBody.message || 'Failed to delete goal');
                            }
                            await fetchGoals();
                            toast({ title: 'Deleted', description: 'Goal removed.' });
                          } catch (err: any) {
                            toast({ title: 'Error', description: err?.message || 'Could not delete goal', variant: 'destructive' });
                          }
                        }}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
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

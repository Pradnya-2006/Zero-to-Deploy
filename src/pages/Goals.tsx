import { useState } from 'react';
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
import { useToast } from '@/hooks/use-toast';

interface Goal {
  id: number;
  title: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  isCompleted: boolean;
}

const initialGoals: Goal[] = [
  {
    id: 1,
    title: 'Annual carbon reduction',
    target: 3000,
    current: 3200,
    unit: 'kg CO₂',
    deadline: 'Dec 2024',
    isCompleted: false,
  },
  {
    id: 2,
    title: 'Monthly electricity savings',
    target: 120,
    current: 135,
    unit: 'kWh',
    deadline: 'Monthly',
    isCompleted: false,
  },
  {
    id: 3,
    title: 'Switch to LED bulbs',
    target: 10,
    current: 10,
    unit: 'bulbs',
    deadline: 'Completed',
    isCompleted: true,
  },
];

const milestones = [
  { title: 'First calculation', description: 'Completed your first carbon footprint calculation', earned: true, icon: '🎯' },
  { title: 'Week streak', description: 'Tracked your footprint for 7 consecutive days', earned: true, icon: '🔥' },
  { title: '10% reduction', description: 'Reduced your footprint by 10%', earned: true, icon: '📉' },
  { title: 'Green commuter', description: 'Used public transport for a month', earned: false, icon: '🚌' },
  { title: 'Zero waste week', description: 'Went a week with minimal waste', earned: false, icon: '♻️' },
  { title: 'Carbon neutral', description: 'Achieve net-zero emissions', earned: false, icon: '🌍' },
];

export default function Goals() {
  const { toast } = useToast();
  const [goals, setGoals] = useState(initialGoals);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    target: [3000],
    unit: 'kg CO₂',
    deadline: '',
  });

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.deadline) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    const goal: Goal = {
      id: Date.now(),
      title: newGoal.title,
      target: newGoal.target[0],
      current: newGoal.target[0] + 500,
      unit: newGoal.unit,
      deadline: newGoal.deadline,
      isCompleted: false,
    };

    setGoals([...goals, goal]);
    setNewGoal({ title: '', target: [3000], unit: 'kg CO₂', deadline: '' });
    setIsDialogOpen(false);
    
    toast({
      title: 'Goal created!',
      description: 'Your new goal has been added. Good luck!',
    });
  };

  const beforeFootprint = 4000;
  const afterFootprint = 3200;
  const reduction = beforeFootprint - afterFootprint;
  const reductionPercentage = Math.round((reduction / beforeFootprint) * 100);

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
            <p className="text-4xl font-bold text-foreground mb-1">{beforeFootprint.toLocaleString()}</p>
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
            <p className="text-4xl font-bold text-success mb-1">{afterFootprint.toLocaleString()}</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => {
            const progress = goal.isCompleted
              ? 100
              : Math.max(0, Math.round(((goal.current - goal.target) / goal.current) * 100));
            const progressToTarget = goal.isCompleted
              ? 100
              : Math.round((1 - (goal.current - goal.target) / goal.current) * 100);

            return (
              <div
                key={goal.id}
                className={cn(
                  'dashboard-card',
                  goal.isCompleted && 'border-success/30 bg-success/5'
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-foreground">{goal.title}</h4>
                    <p className="text-sm text-muted-foreground">{goal.deadline}</p>
                  </div>
                  {goal.isCompleted && (
                    <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center">
                      <Check className="w-5 h-5 text-success-foreground" />
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Progress
                    value={progressToTarget}
                    className={cn('h-3', goal.isCompleted && '[&>div]:bg-success')}
                  />
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Current: <span className="font-medium text-foreground">{goal.current} {goal.unit}</span>
                    </span>
                    <span className="text-muted-foreground">
                      Target: <span className="font-medium text-foreground">{goal.target} {goal.unit}</span>
                    </span>
                  </div>

                  {!goal.isCompleted && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-primary">{goal.current - goal.target} {goal.unit}</span> to go
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
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

import { useState } from 'react';
import { Zap, Car, Leaf, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface Recommendation {
  id: number;
  title: string;
  description: string;
  whyHelps: string;
  impact: number;
  category: 'energy' | 'transport' | 'lifestyle';
  difficulty: 'easy' | 'medium' | 'hard';
}

const recommendations: Recommendation[] = [
  {
    id: 1,
    title: 'Switch to LED lighting',
    description: 'Replace all traditional incandescent and CFL bulbs with energy-efficient LED alternatives.',
    whyHelps: 'LED bulbs use up to 75% less energy than incandescent lighting and last 25 times longer. This reduces both your electricity bill and the CO₂ emissions from power generation.',
    impact: 150,
    category: 'energy',
    difficulty: 'easy',
  },
  {
    id: 2,
    title: 'Use public transportation',
    description: 'Take the bus, train, or subway for your daily commute instead of driving alone.',
    whyHelps: 'Public transit produces significantly fewer emissions per passenger mile than private vehicles. A full bus can replace up to 40 cars on the road.',
    impact: 420,
    category: 'transport',
    difficulty: 'medium',
  },
  {
    id: 3,
    title: 'Reduce meat consumption',
    description: 'Try meatless Mondays and explore delicious plant-based alternatives throughout the week.',
    whyHelps: 'Meat production, especially beef, generates significant greenhouse gases including methane. Reducing meat intake by just one day per week can save 340 kg CO₂ annually.',
    impact: 340,
    category: 'lifestyle',
    difficulty: 'easy',
  },
  {
    id: 4,
    title: 'Install a smart thermostat',
    description: 'Use programmable thermostats to optimize heating and cooling schedules automatically.',
    whyHelps: 'Smart thermostats learn your habits and adjust temperatures when you\'re away or asleep, reducing energy waste by 10-15% on heating and cooling costs.',
    impact: 280,
    category: 'energy',
    difficulty: 'medium',
  },
  {
    id: 5,
    title: 'Start carpooling',
    description: 'Share rides with colleagues, neighbors, or use rideshare apps to reduce single-occupancy trips.',
    whyHelps: 'Sharing a car with just one other person cuts your transportation emissions in half. It also reduces traffic congestion and parking demand.',
    impact: 380,
    category: 'transport',
    difficulty: 'easy',
  },
  {
    id: 6,
    title: 'Switch to renewable energy',
    description: 'Choose a green energy provider or install solar panels to power your home with clean energy.',
    whyHelps: 'Renewable energy sources produce little to no greenhouse gas emissions. Even partial adoption can significantly reduce your carbon footprint.',
    impact: 800,
    category: 'energy',
    difficulty: 'hard',
  },
  {
    id: 7,
    title: 'Buy local and seasonal',
    description: 'Choose locally grown, seasonal produce to reduce transportation emissions from food.',
    whyHelps: 'Imported food travels thousands of miles by ship, plane, and truck. Local food requires far less transportation, reducing associated emissions significantly.',
    impact: 200,
    category: 'lifestyle',
    difficulty: 'easy',
  },
  {
    id: 8,
    title: 'Switch to an electric vehicle',
    description: 'Consider an electric or hybrid vehicle for your next car purchase.',
    whyHelps: 'EVs produce zero direct emissions and even when accounting for electricity generation, they typically produce 50-70% less CO₂ than conventional cars.',
    impact: 1200,
    category: 'transport',
    difficulty: 'hard',
  },
  {
    id: 9,
    title: 'Reduce water heating',
    description: 'Lower your water heater temperature and take shorter showers to save energy.',
    whyHelps: 'Water heating accounts for about 18% of home energy use. Reducing the temperature by 10°F can save 3-5% on water heating costs.',
    impact: 120,
    category: 'energy',
    difficulty: 'easy',
  },
];

const categoryConfig = {
  energy: { icon: Zap, color: 'text-warning', bgColor: 'bg-warning/10', label: 'Energy' },
  transport: { icon: Car, color: 'text-primary', bgColor: 'bg-primary/10', label: 'Transport' },
  lifestyle: { icon: Leaf, color: 'text-success', bgColor: 'bg-success/10', label: 'Lifestyle' },
};

const difficultyConfig = {
  easy: { class: 'badge-success', label: 'Easy' },
  medium: { class: 'badge-warning', label: 'Medium' },
  hard: { class: 'badge-error', label: 'Hard' },
};

export default function Recommendations() {
  const [filter, setFilter] = useState<'all' | 'energy' | 'transport' | 'lifestyle'>('all');
  const [sortBy, setSortBy] = useState<'impact' | 'difficulty'>('impact');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filteredRecommendations = recommendations
    .filter((rec) => filter === 'all' || rec.category === filter)
    .sort((a, b) => {
      if (sortBy === 'impact') {
        return b.impact - a.impact;
      }
      const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
      return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
    });

  const totalPotentialSavings = filteredRecommendations.reduce((sum, rec) => sum + rec.impact, 0);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="page-title">Recommendations</h1>
          <p className="page-subtitle">
            Personalized actions to reduce your carbon footprint
          </p>
        </div>
        <div className="dashboard-card py-3 px-4 flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Potential savings:</span>
          <span className="font-bold text-success text-lg">
            {totalPotentialSavings.toLocaleString()} kg CO₂/year
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filter:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {(['all', 'energy', 'transport', 'lifestyle'] as const).map((cat) => (
            <Button
              key={cat}
              variant={filter === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(cat)}
              className="capitalize"
            >
              {cat === 'all' ? 'All' : categoryConfig[cat].label}
            </Button>
          ))}
        </div>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'impact' | 'difficulty')}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="impact">Highest Impact</SelectItem>
            <SelectItem value="difficulty">Easiest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecommendations.map((rec) => {
          const { icon: Icon, color, bgColor } = categoryConfig[rec.category];
          const isExpanded = expandedId === rec.id;

          return (
            <div
              key={rec.id}
              className="dashboard-card hover:border-primary/30 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', bgColor)}>
                  <Icon className={cn('w-6 h-6', color)} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-semibold text-foreground">{rec.title}</h4>
                    <span className={difficultyConfig[rec.difficulty].class}>
                      {difficultyConfig[rec.difficulty].label}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-success">
                      Save {rec.impact} kg CO₂/year
                    </span>
                  </div>

                  {/* Expandable section */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    Why this helps
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-border animate-fade-in">
                      <p className="text-sm text-muted-foreground">{rec.whyHelps}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

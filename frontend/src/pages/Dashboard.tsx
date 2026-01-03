import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Activity,
  TrendingDown,
  Zap,
  Leaf,
  ArrowDown,
  ArrowUp,
} from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { EmissionsChart } from '@/components/dashboard/EmissionsChart';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { GoalProgress } from '@/components/dashboard/GoalProgress';
import { RecommendationCard } from '@/components/dashboard/RecommendationCard';
import { InsightBanner } from '@/components/dashboard/InsightBanner';
import { ImpactStats } from '@/components/dashboard/ImpactStats';
import { Badge } from '@/components/ui/badge';

const recommendations = [
  {
    title: 'Switch to LED lighting',
    description: 'Replace traditional bulbs with energy-efficient LEDs throughout your home.',
    impact: 150,
    category: 'energy' as const,
    difficulty: 'easy' as const,
  },
  {
    title: 'Use public transportation',
    description: 'Take the bus or train for your daily commute instead of driving.',
    impact: 420,
    category: 'transport' as const,
    difficulty: 'medium' as const,
  },
  {
    title: 'Reduce meat consumption',
    description: 'Try meatless Mondays and explore plant-based alternatives.',
    impact: 300,
    category: 'lifestyle' as const,
    difficulty: 'easy' as const,
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [result, setResult] = useState<any | null>(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    // fetch latest saved result
    const fetchLatest = async () => {
      try {
        const res = await fetch(`${API_URL}/api/results/latest`);
        const data = await res.json();
        if (data?.found && data?.result) setResult(data.result);
      } catch (err) {
        console.error('Failed to fetch latest result', err);
      }
    };

    fetchLatest();
  }, []);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Track your carbon footprint and environmental impact</p>
        </div>
        <Badge className="w-fit badge-warning">
          <ArrowUp className="w-3 h-3 mr-1" />
          Above average (4,000 kg/year)
        </Badge>
      </div>

      {/* Insight Banner */}
      <InsightBanner
        message="Your highest emissions come from electricity usage. Switching to renewable energy could reduce your footprint by 40%."
        actionText="View recommendations"
        onAction={() => navigate('/recommendations')}
      />

      {!result && (
        <div className="dashboard-card my-6 text-center">
          <p className="text-sm text-muted-foreground">No data available – calculate your footprint first.</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Footprint"
          value={result ? String(result.emissions.total) : '—'}
          subtitle="kg CO₂/year"
          icon={Activity}
          trend={{ value: 0, isPositive: true }}
          accentColor="primary"
        />
        <StatCard
          title="Monthly Average"
          value={result ? String(Math.round((result.emissions.total || 0) / 12)) : '—'}
          subtitle="kg CO₂"
          icon={TrendingDown}
          trend={{ value: 0, isPositive: true }}
          accentColor="success"
        />
        <StatCard
          title="Energy Usage"
          value={result ? String(result.emissions.electricity) : '—'}
          subtitle="kg CO₂/year"
          icon={Zap}
          accentColor="warning"
        />
        <StatCard
          title="This Month"
          value={result ? String(Math.round((result.emissions.total || 0) / 12)) : '—'}
          subtitle="kg CO₂"
          icon={Leaf}
          trend={{ value: 0, isPositive: true }}
          accentColor="success"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrendChart
            data={
              result
                ? Array.from({ length: 12 }).map((_, i) => ({
                    month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
                    emissions: Math.round((result.emissions.total || 0) / 12),
                    average: Math.round((result.emissions.total || 0) / 12),
                  }))
                : undefined
            }
          />
        </div>
        <EmissionsChart
          data={
            result
              ? [
                  { name: 'Energy', value: result.emissions.electricity, color: 'hsl(160, 84%, 39%)' },
                  { name: 'Transport', value: result.emissions.transport, color: 'hsl(38, 92%, 50%)' },
                  { name: 'Lifestyle', value: result.emissions.lifestyle, color: 'hsl(215, 16%, 47%)' },
                ]
              : undefined
          }
        />
      </div>

      {/* Goal & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GoalProgress currentValue={3200} targetValue={4000} />
        <ImpactStats />
      </div>

      {/* Top Recommendations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Top Recommendations</h2>
          <button
            onClick={() => navigate('/recommendations')}
            className="text-sm text-primary hover:underline"
          >
            View all
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((rec) => (
            <RecommendationCard key={rec.title} {...rec} />
          ))}
        </div>
      </div>
    </div>
  );
}

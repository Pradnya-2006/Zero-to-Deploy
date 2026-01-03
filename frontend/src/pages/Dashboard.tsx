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
import { cn } from '@/lib/utils';

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
  const [history, setHistory] = useState<any | null>(null);
  const [view, setView] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    // fetch latest saved result
    const fetchLatest = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers: Record<string,string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${API_URL}/api/results/latest`, { headers });
        const data = await res.json();
        if (data?.found && data?.result) setResult(data.result);
      } catch (err) {
        console.error('Failed to fetch latest result', err);
      }
    };

    fetchLatest();
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers: Record<string,string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${API_URL}/api/results/history`, { headers });
        if (!res.ok) return setHistory(null);
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.error('Failed to fetch history', err);
      }
    };

    fetchHistory();
  }, []);

  // derive yearly comparisons for top stats
  const thisYear = history?.yearly?.length ? history.yearly[history.yearly.length - 1] : null;
  const prevYear = history?.yearly?.length > 1 ? history.yearly[history.yearly.length - 2] : null;
  const totalThisYear = thisYear?.total ?? (result?.emissions?.total ? result.emissions.total * 12 : 0);
  const totalPrevYear = prevYear?.total ?? 0;
  const totalPctChange = totalPrevYear ? Math.round(((totalThisYear - totalPrevYear) / totalPrevYear) * 100) : 0;

  const energyThisYear = thisYear?.electricity ?? 0;
  const energyPrevYear = prevYear?.electricity ?? 0;
  const energyPctChange = energyPrevYear ? Math.round(((energyThisYear - energyPrevYear) / energyPrevYear) * 100) : 0;

  const latestMonth = history?.monthly?.length ? history.monthly[history.monthly.length - 1] : null;
  const latestMonthTotal = latestMonth?.total ?? (result?.emissions?.total ?? 0);

  const monthlyAvg = history?.monthly?.length ? Math.round(history.monthly.reduce((s: number, m: any) => s + (m.total || 0), 0) / history.monthly.length) : (result?.emissions?.total ? Math.round(result.emissions.total / 12) : 0);
  const prevMonth = history?.monthly?.length > 1 ? history.monthly[history.monthly.length - 2] : null;
  const prevMonthTotal = prevMonth?.total ?? 0;
  const monthPctChange = prevMonthTotal ? Math.round(((latestMonthTotal - prevMonthTotal) / prevMonthTotal) * 100) : 0;

  // weekly comparisons when view === 'weekly'
  const latestWeek = history?.weekly?.length ? history.weekly[history.weekly.length - 1] : null;
  const prevWeek = history?.weekly?.length > 1 ? history.weekly[history.weekly.length - 2] : null;
  const latestWeekTotal = latestWeek?.total ?? (result?.emissions?.total ? (result.emissions.total / 52) : 0);
  const prevWeekTotal = prevWeek?.total ?? 0;
  const weekPctChange = prevWeekTotal ? Math.round(((latestWeekTotal - prevWeekTotal) / prevWeekTotal) * 100) : 0;
  const weeklyAvg = history?.weekly?.length ? Math.round(history.weekly.reduce((s: number, w: any) => s + (w.total || 0), 0) / history.weekly.length) : (result?.emissions?.total ? Math.round(result.emissions.total / 52) : 0);

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
          value={totalThisYear ? String(Math.round(totalThisYear)) : '—'}
          subtitle="kg CO₂/year"
          icon={Activity}
          trend={{ value: Math.abs(totalPctChange), isPositive: totalPctChange < 0 }}
          accentColor="primary"
        />
        <StatCard
          title={view === 'weekly' ? 'Weekly Average' : 'Monthly Average'}
          value={view === 'weekly' ? (weeklyAvg ? String(weeklyAvg) : '—') : (monthlyAvg ? String(monthlyAvg) : '—')}
          subtitle={view === 'weekly' ? 'kg CO₂/week' : 'kg CO₂'}
          icon={TrendingDown}
          trend={{ value: 0, isPositive: true }}
          accentColor="success"
        />
        <StatCard
          title="Energy Usage"
          value={energyThisYear ? String(Math.round(energyThisYear)) : '—'}
          subtitle="kg CO₂/year"
          icon={Zap}
          trend={{ value: Math.abs(energyPctChange), isPositive: energyPctChange < 0 }}
          accentColor="warning"
        />
        <StatCard
          title={view === 'weekly' ? 'This Week' : 'This Month'}
          value={view === 'weekly' ? (latestWeekTotal ? String(Math.round(latestWeekTotal)) : '—') : (latestMonthTotal ? String(Math.round(latestMonthTotal)) : '—')}
          subtitle={view === 'weekly' ? 'kg CO₂/week' : 'kg CO₂'}
          icon={Leaf}
          trend={{ value: Math.abs(view === 'weekly' ? weekPctChange : monthPctChange), isPositive: (view === 'weekly' ? weekPctChange : monthPctChange) < 0 }}
          accentColor="success"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">Trend</h3>
            <div className="flex items-center gap-2">
              <button className={cn('px-2 py-1 rounded', view === 'weekly' ? 'bg-primary text-white' : 'bg-muted/20')} onClick={() => setView('weekly')}>Weekly</button>
              <button className={cn('px-2 py-1 rounded', view === 'monthly' ? 'bg-primary text-white' : 'bg-muted/20')} onClick={() => setView('monthly')}>Monthly</button>
              <button className={cn('px-2 py-1 rounded', view === 'yearly' ? 'bg-primary text-white' : 'bg-muted/20')} onClick={() => setView('yearly')}>Yearly</button>
            </div>
          </div>

          <TrendChart
            title={view === 'weekly' ? 'Weekly Trend' : view === 'monthly' ? 'Monthly Trend' : 'Yearly Trend'}
            data={(() => {
              if (view === 'weekly') {
                if (history?.weekly && Array.isArray(history.weekly)) {
                  const dataPoints = history.weekly.map((w: any) => ({
                    month: `W${w.week} ${String(w.year).slice(-2)}`,
                    emissions: Math.round(w.total || 0),
                    average: Math.round((history.weekly.reduce((s: number, x: any) => s + (x.total || 0), 0) / (history.weekly.length || 1)) || 0),
                  }));

                  return dataPoints;
                }

                // fallback to single-result derived weekly average
                return result
                  ? Array.from({ length: 12 }).map((_, i) => ({
                      month: `W${i + 1}`,
                      emissions: Math.round((result.emissions.total || 0) / 52),
                      average: Math.round((result.emissions.total || 0) / 52),
                    }))
                  : undefined;
              }

              if (view === 'monthly') {
                if (history?.monthly && Array.isArray(history.monthly)) {
                  const monthsNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                  const dataPoints = history.monthly.map((m: any) => ({
                    month: monthsNames[(m.month - 1) % 12] + ` ${String(m.year).slice(-2)}`,
                    emissions: Math.round(m.total || 0),
                    average: Math.round((history.monthly.reduce((s: number, x: any) => s + (x.total || 0), 0) / 12) || 0),
                  }));

                  return dataPoints;
                }

                // fallback to single-result derived monthly average
                return result
                  ? Array.from({ length: 12 }).map((_, i) => ({
                      month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
                      emissions: Math.round((result.emissions.total || 0) / 12),
                      average: Math.round((result.emissions.total || 0) / 12),
                    }))
                  : undefined;
              }

              // yearly view
              if (view === 'yearly') {
                if (history?.yearly && Array.isArray(history.yearly)) {
                  return history.yearly.map((y: any) => ({
                    month: String(y.year),
                    emissions: Math.round(y.total || 0),
                    average: Math.round((history.yearly.reduce((s: number, x: any) => s + (x.total || 0), 0) / (history.yearly.length || 1)) || 0),
                  }));
                }

                // fallback: show current year total only
                return result
                  ? [{ month: String(new Date().getFullYear()), emissions: Math.round(result.emissions.total || 0), average: Math.round(result.emissions.total || 0) }]
                  : undefined;
              }

              return undefined;
            })()}
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

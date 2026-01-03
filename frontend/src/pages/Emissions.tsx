import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { Zap, Car, Utensils, Droplets, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// initial empty shapes; actual values come from backend (/api/results/latest and /api/results/history)

export default function Emissions() {
  const [view, setView] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [categoryData, setCategoryData] = useState<any[] | undefined>(undefined);
  const [monthlyData, setMonthlyData] = useState<any[] | undefined>(undefined);
  const [yearlyComparison, setYearlyComparison] = useState<any[] | undefined>(undefined);
  const [weeklyData, setWeeklyData] = useState<any[] | undefined>(undefined);


  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers: Record<string,string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        // latest result
        const latestRes = await fetch(`${API_URL}/api/results/latest`, { headers });
        const latestJson = await latestRes.json();
        const latest = latestJson?.found && latestJson?.result ? latestJson.result : null;

        // history
        const historyRes = await fetch(`${API_URL}/api/results/history`, { headers });
        const historyJson = historyRes.ok ? await historyRes.json() : null;

        // map category data (match visuals used elsewhere)
        if (latest && latest.emissions) {
          const cat = [
            { name: 'Electricity', value: Number(latest.emissions.electricity || 0), icon: Zap, color: 'hsl(38, 92%, 50%)' },
            { name: 'Transport', value: Number(latest.emissions.transport || 0), icon: Car, color: 'hsl(160, 84%, 39%)' },
            { name: 'Lifestyle', value: Number(latest.emissions.lifestyle || 0), icon: Utensils, color: 'hsl(280, 60%, 50%)' },
          ];
          setCategoryData(cat);
        } else {
          setCategoryData(undefined);
        }

        // weekly data: use history.weekly if available (last 12 weeks)
        if (historyJson?.weekly && Array.isArray(historyJson.weekly) && historyJson.weekly.length) {
          const dataPoints = historyJson.weekly.map((w: any) => ({
            weekLabel: `W${w.week} ${String(w.year).slice(-2)}`,
            current: Math.round(w.total || 0),
            previous: 0,
          }));
          setWeeklyData(dataPoints);
        } else if (latest && latest.emissions) {
          // fallback to 12 weeks derived from latest
          setWeeklyData(Array.from({ length: 12 }).map((_, i) => ({ weekLabel: `W${i + 1}`, current: Math.round((latest.emissions.total || 0) / 12), previous: 0 })));
        } else {
          setWeeklyData(undefined);
        }

        // monthly data: use history.monthly if available else derive from latest
        if (historyJson?.monthly && Array.isArray(historyJson.monthly) && historyJson.monthly.length) {
          const monthsNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
          const dataPoints = historyJson.monthly.map((m: any) => ({
            month: monthsNames[(m.month - 1) % 12],
            current: Math.round(m.total || 0),
            previous: Math.round(m.previousTotal || 0) || 0,
          }));
          setMonthlyData(dataPoints);
        } else if (latest && latest.emissions) {
          setMonthlyData(Array.from({ length: 12 }).map((_, i) => ({ month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i], current: Math.round((latest.emissions.total || 0) / 12), previous: 0 })));
        } else {
          setMonthlyData(undefined);
        }

        // yearly comparison
        if (historyJson?.yearly && Array.isArray(historyJson.yearly) && historyJson.yearly.length) {
          setYearlyComparison(historyJson.yearly.map((y: any) => ({ year: String(y.year), emissions: Math.round(y.total || 0) })));
        } else if (latest && latest.emissions) {
          setYearlyComparison([{ year: String(new Date().getFullYear()), emissions: Math.round(latest.emissions.total || 0) }]);
        } else {
          setYearlyComparison(undefined);
        }
      } catch (err) {
        console.error('Failed to fetch emissions data', err);
      }
    };

    fetchData();
  }, []);

  const totalEmissions = categoryData ? categoryData.reduce((sum, cat) => sum + (Number(cat.value) || 0), 0) : 0;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="page-title">Emissions Breakdown</h1>
          <p className="page-subtitle">Detailed analysis of your carbon emissions by category</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={view === 'monthly' ? 'default' : 'outline'}
            onClick={() => setView('monthly')}
            size="sm"
          >
            Monthly
          </Button>
          <Button
            variant={view === 'weekly' ? 'default' : 'outline'}
            onClick={() => setView('weekly')}
            size="sm"
          >
            Weekly
          </Button>
          <Button
            variant={view === 'yearly' ? 'default' : 'outline'}
            onClick={() => setView('yearly')}
            size="sm"
          >
            Yearly
          </Button>
        </div>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {(categoryData ?? [{ name: 'Electricity', value: 0, icon: Zap, color: 'hsl(38, 92%, 50%)' }, { name: 'Transport', value: 0, icon: Car, color: 'hsl(160, 84%, 39%)' }, { name: 'Lifestyle', value: 0, icon: Utensils, color: 'hsl(280, 60%, 50%)' }]).map((category) => {
          const Icon = category.icon;
          const percentage = totalEmissions ? Math.round((Number(category.value || 0) / totalEmissions) * 100) : 0;

          return (
            <div
              key={category.name}
              className="dashboard-card text-center group hover:border-primary/30"
            >
              <div
                className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${category.color}20` }}
              >
                <Icon className="w-6 h-6" style={{ color: category.color }} />
              </div>
              <p className="text-2xl font-bold text-foreground mb-1">
                {Number(category.value || 0).toLocaleString()
                }
              </p>
              <p className="text-sm text-muted-foreground mb-2">{category.name}</p>
              <p className="text-xs font-medium" style={{ color: category.color }}>
                {percentage}% of total
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="dashboard-card">
          <h3 className="font-semibold text-foreground mb-4">Emissions by Category</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData ?? []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  tickFormatter={(value) => `${value} kg`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '0.75rem',
                  }}
                  formatter={(value: number) => [`${value} kg CO₂`, 'Emissions']}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {(categoryData ?? []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="dashboard-card">
          <h3 className="font-semibold text-foreground mb-4">Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData ?? []}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {(categoryData ?? []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '0.75rem',
                  }}
                  formatter={(value: number) => [`${value} kg CO₂`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {(categoryData ?? []).map((cat) => (
              <div key={cat.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-sm text-muted-foreground">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Chart (weekly / monthly / yearly) */}
      <div className="dashboard-card">
        <h3 className="font-semibold text-foreground mb-4">
          {view === 'weekly' ? 'Weekly Comparison (Last 12 weeks)' : view === 'monthly' ? 'Monthly Comparison (This Year vs Last Year)' : 'Yearly Trend'}
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {view === 'weekly' ? (
              <LineChart data={weeklyData ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="weekLabel"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  tickFormatter={(value) => `${value} kg`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '0.75rem',
                  }}
                  formatter={(value: number, name: string) => [`${value} kg CO₂`, name === 'current' ? 'This Period' : 'Previous']}
                />
                <Legend formatter={(value) => (value === 'current' ? 'This Period' : 'Previous')} />
                <Line type="monotone" dataKey="previous" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                <Line type="monotone" dataKey="current" stroke="hsl(160, 84%, 39%)" strokeWidth={3} dot={{ fill: 'hsl(160, 84%, 39%)', strokeWidth: 0, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            ) : view === 'monthly' ? (
              <LineChart data={monthlyData ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  tickFormatter={(value) => `${value} kg`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '0.75rem',
                  }}
                  formatter={(value: number, name: string) => [`${value} kg CO₂`, name === 'current' ? 'This Year' : 'Last Year']}
                />
                <Legend formatter={(value) => (value === 'current' ? 'This Year' : 'Last Year')} />
                <Line type="monotone" dataKey="previous" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                <Line type="monotone" dataKey="current" stroke="hsl(160, 84%, 39%)" strokeWidth={3} dot={{ fill: 'hsl(160, 84%, 39%)', strokeWidth: 0, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            ) : (
              <BarChart data={yearlyComparison ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="year"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  tickFormatter={(value) => `${value} kg`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '0.75rem',
                  }}
                  formatter={(value: number) => [`${value} kg CO₂`, 'Emissions']}
                />
                <Bar dataKey="emissions" fill="hsl(160, 84%, 39%)" radius={[8, 8, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

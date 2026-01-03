import { useState } from 'react';
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

const categoryData = [
  { name: 'Electricity', value: 1200, icon: Zap, color: 'hsl(38, 92%, 50%)' },
  { name: 'Heating', value: 600, icon: Droplets, color: 'hsl(200, 80%, 50%)' },
  { name: 'Transport', value: 1400, icon: Car, color: 'hsl(160, 84%, 39%)' },
  { name: 'Food', value: 500, icon: Utensils, color: 'hsl(0, 70%, 50%)' },
  { name: 'Shopping', value: 300, icon: ShoppingBag, color: 'hsl(280, 60%, 50%)' },
];

const monthlyData = [
  { month: 'Jan', current: 380, previous: 420 },
  { month: 'Feb', current: 350, previous: 400 },
  { month: 'Mar', current: 340, previous: 390 },
  { month: 'Apr', current: 320, previous: 385 },
  { month: 'May', current: 310, previous: 370 },
  { month: 'Jun', current: 330, previous: 365 },
  { month: 'Jul', current: 290, previous: 350 },
  { month: 'Aug', current: 280, previous: 340 },
  { month: 'Sep', current: 270, previous: 330 },
  { month: 'Oct', current: 260, previous: 320 },
  { month: 'Nov', current: 250, previous: 310 },
  { month: 'Dec', current: 240, previous: 300 },
];

const yearlyComparison = [
  { year: '2022', emissions: 4800 },
  { year: '2023', emissions: 4200 },
  { year: '2024', emissions: 4000 },
];

export default function Emissions() {
  const [view, setView] = useState<'monthly' | 'yearly'>('monthly');

  const totalEmissions = categoryData.reduce((sum, cat) => sum + cat.value, 0);

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
        {categoryData.map((category) => {
          const Icon = category.icon;
          const percentage = Math.round((category.value / totalEmissions) * 100);
          
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
                {category.value.toLocaleString()}
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
              <BarChart data={categoryData} layout="vertical">
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
                  {categoryData.map((entry, index) => (
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
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {categoryData.map((entry, index) => (
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
            {categoryData.map((cat) => (
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

      {/* Comparison Chart */}
      <div className="dashboard-card">
        <h3 className="font-semibold text-foreground mb-4">
          {view === 'monthly' ? 'Monthly Comparison (This Year vs Last Year)' : 'Yearly Trend'}
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {view === 'monthly' ? (
              <LineChart data={monthlyData}>
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
                  formatter={(value: number, name: string) => [
                    `${value} kg CO₂`,
                    name === 'current' ? 'This Year' : 'Last Year',
                  ]}
                />
                <Legend
                  formatter={(value) => (value === 'current' ? 'This Year' : 'Last Year')}
                />
                <Line
                  type="monotone"
                  dataKey="previous"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="current"
                  stroke="hsl(160, 84%, 39%)"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(160, 84%, 39%)', strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            ) : (
              <BarChart data={yearlyComparison}>
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

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

type MonthPoint = { month: string; emissions: number; average: number };

const defaultData: MonthPoint[] = [
  { month: 'Jan', emissions: 380, average: 333 },
  { month: 'Feb', emissions: 350, average: 333 },
  { month: 'Mar', emissions: 340, average: 333 },
  { month: 'Apr', emissions: 320, average: 333 },
  { month: 'May', emissions: 310, average: 333 },
  { month: 'Jun', emissions: 330, average: 333 },
  { month: 'Jul', emissions: 290, average: 333 },
  { month: 'Aug', emissions: 280, average: 333 },
  { month: 'Sep', emissions: 270, average: 333 },
  { month: 'Oct', emissions: 260, average: 333 },
  { month: 'Nov', emissions: 250, average: 333 },
  { month: 'Dec', emissions: 240, average: 333 },
];

export function TrendChart({ data = defaultData, title = 'Monthly Trend' }: { data?: MonthPoint[]; title?: string }) {
  return (
    <div className="dashboard-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">Your emissions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
            <span className="text-muted-foreground">Average</span>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
            />
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
                boxShadow: 'var(--shadow-md)',
              }}
              formatter={(value: number, name: string) => [
                `${value} kg CO₂`,
                name === 'emissions' ? 'Your emissions' : 'Average',
              ]}
            />
            <Line
              type="monotone"
              dataKey="average"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="emissions"
              stroke="hsl(160, 84%, 39%)"
              strokeWidth={3}
              fill="url(#colorEmissions)"
              dot={{ fill: 'hsl(160, 84%, 39%)', strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, fill: 'hsl(160, 84%, 39%)' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

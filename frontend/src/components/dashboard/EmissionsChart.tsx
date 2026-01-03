import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

type Item = { name: string; value: number; color: string };

const defaultData: Item[] = [
  { name: 'Energy', value: 1800, color: 'hsl(160, 84%, 39%)' },
  { name: 'Transport', value: 1400, color: 'hsl(38, 92%, 50%)' },
  { name: 'Lifestyle', value: 800, color: 'hsl(215, 16%, 47%)' },
];

export function EmissionsChart({ data = defaultData }: { data?: Item[] }) {
  return (
    <div className="dashboard-card">
      <h3 className="font-semibold text-foreground mb-4">Emissions by Category</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="none"
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`${value} kg CO₂`, '']}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: '0.75rem',
                boxShadow: 'var(--shadow-md)',
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-sm text-muted-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend with values */}
      <div className="mt-4 space-y-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-muted-foreground">{item.name}</span>
            </div>
            <span className="text-sm font-medium text-foreground">
              {item.value.toLocaleString()} kg
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

import { TreePine, Car, Plane, Home } from 'lucide-react';

const stats = [
  {
    icon: TreePine,
    value: '180',
    label: 'Trees needed to offset',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  {
    icon: Car,
    value: '15,400',
    label: 'km driven equivalent',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Plane,
    value: '2.5',
    label: 'Flights to NYC equivalent',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  {
    icon: Home,
    value: '6',
    label: 'Months of home energy',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
  },
];

export function ImpactStats() {
  return (
    <div className="dashboard-card">
      <h3 className="font-semibold text-foreground mb-4">Your Impact in Perspective</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="font-semibold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

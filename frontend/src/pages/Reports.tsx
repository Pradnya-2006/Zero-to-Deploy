import { FileText, Download, Share2, Calendar, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const monthlyReports = [
  { month: 'December 2024', emissions: 240, change: -8 },
  { month: 'November 2024', emissions: 250, change: -4 },
  { month: 'October 2024', emissions: 260, change: 0 },
  { month: 'September 2024', emissions: 270, change: -4 },
  { month: 'August 2024', emissions: 280, change: -3 },
  { month: 'July 2024', emissions: 290, change: -12 },
];

const yearlyStats = {
  totalEmissions: 4000,
  monthlyAverage: 333,
  bestMonth: 'December',
  worstMonth: 'January',
  totalReduction: 800,
  treesEquivalent: 180,
};

export default function Reports() {
  const { toast } = useToast();
  const [selectedYear, setSelectedYear] = useState('2024');

  const handleDownload = () => {
    toast({
      title: 'Downloading report...',
      description: 'Your PDF report is being generated.',
    });
    // Simulate download
    setTimeout(() => {
      toast({
        title: 'Report ready!',
        description: 'Your carbon footprint report has been downloaded.',
      });
    }, 1500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Carbon Footprint Report',
        text: `I reduced my carbon footprint by ${yearlyStats.totalReduction} kg CO₂ this year!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copied!',
        description: 'Share link copied to clipboard.',
      });
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="page-subtitle">View and download your carbon footprint reports</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleShare} className="gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          <Button onClick={handleDownload} className="gap-2 gradient-emerald text-primary-foreground">
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Annual Summary Card */}
      <div className="dashboard-card gradient-emerald text-primary-foreground">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary-foreground/20 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{selectedYear} Annual Report</h2>
            <p className="text-primary-foreground/80">Summary of your carbon footprint</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-primary-foreground/70 text-sm mb-1">Total Emissions</p>
            <p className="text-3xl font-bold">{yearlyStats.totalEmissions.toLocaleString()}</p>
            <p className="text-sm text-primary-foreground/70">kg CO₂</p>
          </div>
          <div>
            <p className="text-primary-foreground/70 text-sm mb-1">Monthly Average</p>
            <p className="text-3xl font-bold">{yearlyStats.monthlyAverage}</p>
            <p className="text-sm text-primary-foreground/70">kg CO₂</p>
          </div>
          <div>
            <p className="text-primary-foreground/70 text-sm mb-1">Total Reduction</p>
            <p className="text-3xl font-bold">-{yearlyStats.totalReduction}</p>
            <p className="text-sm text-primary-foreground/70">kg CO₂ saved</p>
          </div>
          <div>
            <p className="text-primary-foreground/70 text-sm mb-1">Trees Equivalent</p>
            <p className="text-3xl font-bold">{yearlyStats.treesEquivalent}</p>
            <p className="text-sm text-primary-foreground/70">trees needed</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="dashboard-card">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Monthly Breakdown
          </h3>
          <div className="space-y-3">
            {monthlyReports.map((report) => (
              <div
                key={report.month}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div>
                  <p className="font-medium text-foreground">{report.month}</p>
                  <p className="text-sm text-muted-foreground">{report.emissions} kg CO₂</p>
                </div>
                <span
                  className={
                    report.change < 0
                      ? 'text-success font-medium'
                      : report.change > 0
                      ? 'text-destructive font-medium'
                      : 'text-muted-foreground'
                  }
                >
                  {report.change > 0 ? '+' : ''}{report.change}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-success" />
            Key Insights
          </h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-success/10 border border-success/20">
              <p className="font-medium text-success mb-1">Best Performance</p>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{yearlyStats.bestMonth}</span> was your lowest emission month with only 240 kg CO₂.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
              <p className="font-medium text-warning mb-1">Area for Improvement</p>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{yearlyStats.worstMonth}</span> had the highest emissions at 380 kg CO₂.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
              <p className="font-medium text-primary mb-1">Overall Progress</p>
              <p className="text-sm text-muted-foreground">
                You've reduced your footprint by <span className="font-semibold text-foreground">20%</span> compared to last year. Keep it up!
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted border border-border">
              <p className="font-medium text-foreground mb-1">Environmental Impact</p>
              <p className="text-sm text-muted-foreground">
                Your emissions are equivalent to planting <span className="font-semibold text-success">{yearlyStats.treesEquivalent} trees</span> to offset.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Share Stats */}
      <div className="dashboard-card text-center py-8">
        <h3 className="font-semibold text-foreground mb-2">Share Your Progress</h3>
        <p className="text-muted-foreground mb-4 max-w-md mx-auto">
          Inspire others by sharing your sustainability journey. Every action counts!
        </p>
        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share Report
          </Button>
          <Button onClick={handleDownload} className="gradient-emerald text-primary-foreground">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
}

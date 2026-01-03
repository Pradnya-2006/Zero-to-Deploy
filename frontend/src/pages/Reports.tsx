import { FileText, Download, Share2, Calendar, TrendingDown, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const initialMonthlyReports: { month: string; emissions: number; change: number }[] = [];

const initialYearlyStats = {
  totalEmissions: 0,
  monthlyAverage: 0,
  bestMonth: '',
  worstMonth: '',
  totalReduction: 0,
  treesEquivalent: 0,
};

/**
 * Dynamic PDF generator using jsPDF + autotable
 */
function generatePDF(selectedYear: string, monthlyReports: {month:string,emissions:number,change:number}[], yearlyStats: any) {
  const pdf = new jsPDF('p', 'mm', 'a4');
  // Use Times (Times New Roman) for all PDF text
  try {
    pdf.setFont('times', 'normal');
  } catch (e) {
    // If setting font fails, fall back to default
    console.warn('Could not set Times font for jsPDF', e);
  }
  let y = 20;

  pdf.setFontSize(18);
  pdf.text(`${selectedYear} Annual Carbon Report`, 14, y);
  y += 10;

  pdf.setFontSize(12);
  pdf.text(`Total Emissions: ${yearlyStats.totalEmissions} kg CO₂`, 14, y);
  y += 8;
  pdf.text(`Monthly Average: ${yearlyStats.monthlyAverage} kg CO₂`, 14, y);
  y += 8;
  pdf.text(`Total Reduction: -${yearlyStats.totalReduction} kg CO₂ saved`, 14, y);
  y += 8;
  pdf.text(`Trees Equivalent: ${yearlyStats.treesEquivalent} trees`, 14, y);
  y += 12;

  pdf.setFontSize(14);
  pdf.text('Monthly Breakdown', 14, y);
  y += 8;

  autoTable(pdf as any, {
    startY: y,
    head: [['Month', 'Emissions (kg CO₂)', 'Change (%)']],
    body: monthlyReports.map(r => [r.month, r.emissions.toString(), r.change.toString()]),
    theme: 'grid',
    headStyles: { fillColor: [0, 150, 136] },
    styles: { font: 'times', fontSize: 11 },
  });

  // lastAutoTable is set by autotable plugin
  const lastAuto = (pdf as any).lastAutoTable;
  const lastY = lastAuto && typeof lastAuto.finalY === 'number' ? lastAuto.finalY : y;
  y = lastY + 10;

  pdf.setFontSize(14);
  pdf.text('Key Insights', 14, y);
  y += 8;
  pdf.setFontSize(12);
  const best = monthlyReports.find(r => r.month.includes(yearlyStats.bestMonth));
  pdf.text(
    `Best Performance: ${yearlyStats.bestMonth} was your lowest emission month with only ${best?.emissions ?? '-'} kg CO₂.`,
    14,
    y
  );
  y += 8;
  pdf.text(`Area for Improvement: ${yearlyStats.worstMonth} had the highest emissions.`, 14, y);
  y += 8;
  const percent = Math.round((yearlyStats.totalReduction / yearlyStats.totalEmissions) * 100);
  pdf.text(`Overall Progress: Reduced footprint by ${percent}%.`, 14, y);
  y += 8;
  pdf.text(`Environmental Impact: Equivalent to planting ${yearlyStats.treesEquivalent} trees.`, 14, y);

  pdf.save(`${selectedYear}-carbon-report.pdf`);
}

export default function Reports() {
  const { toast } = useToast();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [selectedYear, setSelectedYear] = useState('2024');
  const reportRef = useRef<HTMLDivElement | null>(null);
  const [monthlyReports, setMonthlyReports] = useState(initialMonthlyReports);
  const [yearlyStats, setYearlyStats] = useState<any>(initialYearlyStats);
  const [availableYears, setAvailableYears] = useState<string[]>(['2024']);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers: Record<string,string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${API_URL}/api/results/history`, { headers });
        if (!res.ok) return;
        const data = await res.json();

        // populate available years from yearly data
        if (data?.yearly && Array.isArray(data.yearly)) {
          const years = data.yearly.map((y: any) => String(y.year)).sort();
          setAvailableYears(years.length ? years : [String(new Date().getFullYear())]);
          // if selectedYear is not in years, set to latest available
          if (!years.includes(selectedYear)) setSelectedYear(years[years.length - 1] || selectedYear);
        }

        // compute initial stats for the selected year
        computeForYear(data, selectedYear);
      } catch (err) {
        console.error('Failed to fetch history for reports', err);
      }
    };

    fetchHistory();
    // recompute when selectedYear changes
  }, []);

  useEffect(() => {
    // fetch history again and recompute for new year
    const fetchAndCompute = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers: Record<string,string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch(`${API_URL}/api/results/history`, { headers });
        if (!res.ok) return;
        const data = await res.json();
        computeForYear(data, selectedYear);
      } catch (err) {
        console.error('Failed to fetch history for reports', err);
      }
    };
    fetchAndCompute();
  }, [selectedYear]);

  function computeForYear(data: any, year: string) {
    if (!data) return;
    const months = Array.isArray(data.monthly) ? data.monthly.filter((m: any) => String(m.year) === String(year)) : [];
    // sort by month index
    const sorted = months.slice().sort((a: any, b: any) => (a.month || 0) - (b.month || 0));
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const reports = sorted.map((m: any, idx: number) => {
      const prev = sorted[idx - 1];
      const change = prev && prev.total ? Math.round(((m.total - prev.total) / (prev.total || 1)) * 100) : 0;
      return { month: `${monthNames[(m.month || 1) - 1]} ${m.year}`, emissions: Math.round(m.total || 0), change };
    });

    const yearlyEntry = Array.isArray(data.yearly) ? data.yearly.find((y: any) => String(y.year) === String(year)) : null;
    const totalEmissions = yearlyEntry ? Math.round(yearlyEntry.total || 0) : reports.reduce((s, r) => s + r.emissions, 0);
    const monthlyAverage = reports.length ? Math.round(totalEmissions / reports.length) : 0;
    const best = reports.length ? reports.reduce((a, b) => (a.emissions < b.emissions ? a : b)) : null;
    const worst = reports.length ? reports.reduce((a, b) => (a.emissions > b.emissions ? a : b)) : null;
    const prevYearEntry = Array.isArray(data.yearly) ? data.yearly.find((y: any) => String(y.year) === String(Number(year) - 1)) : null;
    const totalReduction = prevYearEntry ? Math.max(0, Math.round((prevYearEntry.total || 0) - totalEmissions)) : 0;
    const treesEquivalent = Math.round(totalEmissions / 22);

    setMonthlyReports(reports);
    setYearlyStats({
      totalEmissions,
      monthlyAverage,
      bestMonth: best ? best.month.split(' ')[0] : '',
      worstMonth: worst ? worst.month.split(' ')[0] : '',
      totalReduction,
      treesEquivalent,
    });
  }

  const handleDownload = () => {
    toast({
      title: 'Generating PDF...',
      description: 'Preparing your report for download.',
    });

    try {
      generatePDF(selectedYear, monthlyReports, yearlyStats);
      toast({ title: 'Download started', description: 'Your PDF has been downloaded.' });
    } catch (e) {
      console.error(e);
      toast({ title: 'Download failed', description: 'Could not generate PDF. Try again.' });
    }
  };

  const handleCopyLink = async () => {
    const url = window.location.href;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const ta = document.createElement('textarea');
        ta.value = url;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      toast({ title: 'Link copied!', description: 'Share link copied to clipboard.' });
    } catch (err) {
      console.error('copy failed', err);
      toast({ title: 'Copy failed', description: 'Could not copy link.' });
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `I reduced my carbon footprint by ${yearlyStats.totalReduction} kg CO₂ this year! ${window.location.href}`
    );
    const url = `https://api.whatsapp.com/send?text=${text}`;
    window.open(url, '_blank');
  };


  const handleNativeShare = async () => {
    if ((navigator as any).share) {
      try {
        await (navigator as any).share({
          title: `${selectedYear} Carbon Footprint Report`,
          text: `I reduced my carbon footprint by ${yearlyStats.totalReduction} kg CO₂ this year!`,
          url: window.location.href,
        });
      } catch (e) {
        // user cancelled or failed
      }
    } else {
      // Fallback: open Twitter intent or copy link
      const text = encodeURIComponent(
        `I reduced my carbon footprint by ${yearlyStats.totalReduction} kg CO₂ this year! ${window.location.href}`
      );
      const twitter = `https://twitter.com/intent/tweet?text=${text}`;
      try {
        window.open(twitter, '_blank');
      } catch (e) {
        handleCopyLink();
      }
    }
  };

  

  return (
    <div className="page-container" ref={reportRef}>
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
              {availableYears.map((y) => (
                <SelectItem key={y} value={y}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="flex flex-col gap-2">
                <Button variant="ghost" onClick={handleWhatsApp} className="justify-start gap-2">
                  <MessageSquare className="w-4 h-4" /> WhatsApp
                </Button>
                <Button variant="ghost" onClick={handleCopyLink} className="justify-start gap-2">
                  Copy link
                </Button>
                <Button variant="ghost" onClick={handleNativeShare} className="justify-start gap-2">
                  Native Share
                </Button>
              </div>
            </PopoverContent>
          </Popover>
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
              {monthlyReports.length === 0 ? (
                <div className="text-muted-foreground">No monthly data for {selectedYear}.</div>
              ) : (
                monthlyReports.map((report) => (
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
                ))
              )}
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
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share Report
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="flex flex-col gap-2">
                <Button variant="ghost" onClick={handleWhatsApp} className="justify-start gap-2">
                  <MessageSquare className="w-4 h-4" /> WhatsApp
                </Button>
                <Button variant="ghost" onClick={handleCopyLink} className="justify-start gap-2">
                  Copy link
                </Button>
                <Button variant="ghost" onClick={handleNativeShare} className="justify-start gap-2">
                  Native Share
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Button onClick={handleDownload} className="gradient-emerald text-primary-foreground">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
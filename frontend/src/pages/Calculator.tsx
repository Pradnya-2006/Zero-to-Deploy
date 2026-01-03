import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  Car,
  Utensils,
  ChevronRight,
  ChevronLeft,
  Check,
  Info,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

const steps = [
  { id: 1, title: 'Energy', icon: Zap },
  { id: 2, title: 'Transport', icon: Car },
  { id: 3, title: 'Lifestyle', icon: Utensils },
];

/* ---------- reusable info tooltip ---------- */
const InfoTip = ({ text }: { text: string }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="ml-1 cursor-help inline-flex items-center">
          <Info className="w-3.5 h-3.5 text-muted-foreground hover:text-primary" />
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-xs">
        {text}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export default function Calculator() {
  const navigate = useNavigate();
  const { toast } = useToast();

  /* ---------- STEP STATE ---------- */
  const [currentStep, setCurrentStep] = useState(1);

  /* ---------- RESULT STATE ---------- */
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<{
    electricity: number;
    transport: number;
    lifestyle: number;
    total: number;
  } | null>(null);

  /* ---------- ENERGY ---------- */
  const [electricity, setElectricity] = useState([150]);
  const [electricityUnit, setElectricityUnit] =
    useState<'monthly' | 'weekly'>('monthly');

  const [appliances, setAppliances] = useState({
    ac: true,
    heater: false,
    washer: true,
    dryer: true,
    dishwasher: false,
  });

  /* ---------- TRANSPORT ---------- */
  const [transportMode, setTransportMode] =
    useState<'car' | 'public' | 'bike' | 'walk'>('car');

  const [carFuel, setCarFuel] =
    useState<'petrol' | 'diesel' | 'ev'>('petrol');

  const [publicType, setPublicType] =
    useState<'bus' | 'metro' | 'train'>('bus');

  const [weeklyDistance, setWeeklyDistance] = useState([50]);

  /* ---------- LIFESTYLE ---------- */
  const [lifestyle, setLifestyle] = useState({
    vegetarian: false,
    localFood: false,
    recycling: true,
    composting: false,
    minimalPackaging: false,
  });

  const progressPercentage = (currentStep / steps.length) * 100;

  /* ---------- HANDLER ---------- */
  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep((s) => s + 1);
      return;
    }

    /* convert electricity to WEEKLY kWh */
    const electricityWeekly =
      electricityUnit === 'monthly'
        ? electricity[0] / 4
        : electricity[0];

    const payload = {
      electricityKwh: electricityWeekly,
      appliances,
      transport: {
        mode: transportMode,
        subtype: transportMode === 'car' ? carFuel : publicType,
        weeklyDistanceKm: weeklyDistance[0],
      },
      lifestyle,
    };

    fetch(`${API_URL}/api/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error('Calculation failed');

        setResult(data.emissions);
        setShowResult(true);
      })
      .catch(() =>
        toast({
          title: 'Error',
          description: 'Failed to calculate footprint',
        })
      );
  };

  return (
    <>
      <div className="page-container max-w-3xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="page-title">Carbon Calculator</h1>
          <p className="page-subtitle">Weekly carbon footprint estimation</p>
        </div>

        <Progress value={progressPercentage} className="h-2 mb-8" />

        {/* STEP INDICATORS */}
        <div className="flex justify-center gap-4 mb-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center',
                  currentStep > step.id
                    ? 'bg-success'
                    : currentStep === step.id
                    ? 'gradient-emerald shadow-glow'
                    : 'bg-muted'
                )}
              >
                {currentStep > step.id ? (
                  <Check className="text-success-foreground" />
                ) : (
                  <Icon className="text-muted-foreground" />
                )}
              </div>
            );
          })}
        </div>

        {/* CONTENT */}
        <div className="dashboard-card mb-8">

          {/* STEP 1: ENERGY */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <Label className="flex items-center">
                Electricity usage (kWh)
                <InfoTip text="India grid emission factor: 0.708 kg CO₂ per kWh (CEA average)" />
              </Label>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={electricityUnit === 'monthly' ? 'default' : 'outline'}
                  onClick={() => setElectricityUnit('monthly')}
                >
                  Monthly
                </Button>
                <Button
                  size="sm"
                  variant={electricityUnit === 'weekly' ? 'default' : 'outline'}
                  onClick={() => setElectricityUnit('weekly')}
                >
                  Weekly
                </Button>
              </div>

              <Slider
                value={electricity}
                onValueChange={setElectricity}
                min={20}
                max={600}
                step={10}
              />

              <span className="text-sm text-muted-foreground">
                {electricity[0]} kWh / {electricityUnit}
              </span>
            </div>
          )}

          {/* STEP 2: TRANSPORT */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <Label className="flex items-center">
                Transport mode
                <InfoTip text="Transport emissions = distance × mode-specific emission factor" />
              </Label>

              <RadioGroup
                value={transportMode}
                onValueChange={(v) => setTransportMode(v as any)}
                className="grid grid-cols-2 gap-4"
              >
                {[
                  { value: 'car', label: 'Car 🚗' },
                  { value: 'public', label: 'Public 🚌' },
                  { value: 'bike', label: 'Bike 🚲' },
                  { value: 'walk', label: 'Walk 🚶' },
                ].map((m) => (
                  <div key={m.value}>
                    <RadioGroupItem value={m.value} id={m.value} className="sr-only" />
                    <Label
                      htmlFor={m.value}
                      className={cn(
                        'block p-4 text-center border rounded cursor-pointer',
                        transportMode === m.value && 'border-primary bg-primary/10'
                      )}
                    >
                      {m.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {transportMode === 'car' && (
                <Label className="flex items-center">
                  Car fuel type
                  <InfoTip text="kg CO₂ per km: Petrol 0.192, Diesel 0.171, EV 0.05 (India-adjusted)" />
                </Label>
              )}

              {(transportMode === 'car' || transportMode === 'public') && (
                <div className="space-y-2">
                  <Label className="flex items-center">
                    Weekly distance (km)
                    <InfoTip text="Weekly distance × emission factor = weekly transport emissions" />
                  </Label>
                  <Slider
                    value={weeklyDistance}
                    onValueChange={setWeeklyDistance}
                    min={0}
                    max={400}
                    step={5}
                  />
                  <span className="text-sm text-muted-foreground">
                    {weeklyDistance[0]} km / week
                  </span>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: LIFESTYLE */}
          {currentStep === 3 && (
            <div className="space-y-4">
              {Object.entries(lifestyle).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between p-3 border rounded cursor-pointer"
                  onClick={() =>
                    setLifestyle((p) => ({ ...p, [key]: !value }))
                  }
                >
                  <span className="capitalize">{key}</span>
                  <Switch checked={value} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* NAVIGATION */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((s) => s - 1)}
          >
            <ChevronLeft /> Back
          </Button>
          <Button onClick={handleNext}>
            {currentStep === steps.length ? 'Calculate' : 'Next'}
            <ChevronRight />
          </Button>
        </div>
      </div>

      {/* RESULT DIALOG */}
      <Dialog open={showResult} onOpenChange={setShowResult}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Your Weekly Carbon Footprint</DialogTitle>
          </DialogHeader>

          {result && (
            <div className="space-y-4">
              <p className="text-center text-3xl font-bold">
                {result.total} kg CO₂ / week
              </p>

              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Electricity</span>
                  <span>{result.electricity}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transport</span>
                  <span>{result.transport}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lifestyle reduction</span>
                  <span>-{result.lifestyle}</span>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={() => {
                  setShowResult(false);
                  navigate('/dashboard');
                }}
              >
                View Dashboard
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

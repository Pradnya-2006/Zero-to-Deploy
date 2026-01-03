import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  Car,
  Utensils,
  ChevronRight,
  ChevronLeft,
  Check,
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

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

const steps = [
  { id: 1, title: 'Energy', icon: Zap },
  { id: 2, title: 'Transport', icon: Car },
  { id: 3, title: 'Lifestyle', icon: Utensils },
];

export default function Calculator() {
  const navigate = useNavigate();
  const { toast } = useToast();

  /* ---------------- STEP STATE ---------------- */
  const [currentStep, setCurrentStep] = useState(1);
<<<<<<< Updated upstream
  const [calculated, setCalculated] = useState(false);
  
  // Energy state
=======

  /* ---------------- RESULT STATE (FIX) ---------------- */
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<{
    electricity: number;
    transport: number;
    lifestyle: number;
    total: number;
  } | null>(null);

  /* ---------------- ENERGY ---------------- */
>>>>>>> Stashed changes
  const [electricity, setElectricity] = useState([150]);
  const [appliances, setAppliances] = useState({
    ac: true,
    heater: false,
    washer: true,
    dryer: true,
    dishwasher: false,
  });

  /* ---------------- TRANSPORT ---------------- */
  const [transportMode, setTransportMode] =
    useState<'car' | 'public' | 'bike' | 'walk'>('car');
  const [carFuel, setCarFuel] =
    useState<'petrol' | 'diesel' | 'ev'>('petrol');
  const [publicType, setPublicType] =
    useState<'bus' | 'metro' | 'train'>('bus');
  const [weeklyDistance, setWeeklyDistance] = useState([50]);

  /* ---------------- LIFESTYLE ---------------- */
  const [lifestyle, setLifestyle] = useState({
    vegetarian: false,
    localFood: false,
    recycling: true,
    composting: false,
    minimalPackaging: false,
  });

  const progressPercentage = (currentStep / steps.length) * 100;

  /* ---------------- HANDLER ---------------- */
  const handleNext = () => {
    if (currentStep < steps.length) {
<<<<<<< Updated upstream
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate and save results
      toast({
        title: 'Calculation complete!',
        description: 'Your carbon footprint has been calculated and saved.',
      });
      setCalculated(true);
=======
      setCurrentStep((s) => s + 1);
      return;
>>>>>>> Stashed changes
    }

    const payload = {
      electricityKwh: electricity[0],
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

        if (!res.ok || !data.success) {
          throw new Error('Backend returned failure');
        }

        setResult(data.emissions);
        setShowResult(true);
      })
      .catch((err) => {
        console.error('❌ FRONTEND ERROR:', err);
        toast({
          title: 'Error',
          description: 'Failed to calculate',
        });
      });
  };

  return (
    <>
      <div className="page-container max-w-3xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="page-title">Carbon Calculator</h1>
          <p className="page-subtitle">Track and reduce your footprint</p>
        </div>

        {/* PROGRESS */}
        <Progress value={progressPercentage} className="h-2 mb-8" />

        {/* STEP INDICATORS */}
        <div className="flex justify-center gap-4 mb-8">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div
                key={step.id}
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center',
                  isCompleted
                    ? 'bg-success'
                    : isActive
                    ? 'gradient-emerald shadow-glow'
                    : 'bg-muted'
                )}
              >
                {isCompleted ? (
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

          {/* STEP 1 */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <Label>Monthly electricity usage (kWh)</Label>
              <Slider
                value={electricity}
                onValueChange={setElectricity}
                min={50}
                max={600}
                step={10}
              />
              <span>{electricity[0]} kWh</span>
            </div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <Label>Primary transport mode</Label>
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
                    <RadioGroupItem value={m.value} id={m.value} className="sr-only peer" />
                    <Label
                      htmlFor={m.value}
                      className={cn(
                        'block text-center p-4 border rounded cursor-pointer',
                        transportMode === m.value && 'border-primary bg-primary/10'
                      )}
                    >
                      {m.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* STEP 3 */}
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
            <DialogTitle>Your Carbon Footprint</DialogTitle>
          </DialogHeader>

<<<<<<< Updated upstream
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="gap-2 gradient-emerald text-primary-foreground"
        >
          {currentStep === steps.length ? 'Calculate' : 'Next'}
          {currentStep < steps.length && <ChevronRight className="w-4 h-4" />}
        </Button>
      </div>

      {calculated && (
        <div className="mt-6 dashboard-card">
          <h3 className="text-lg font-semibold mb-2">Results</h3>
          <p className="text-sm text-muted-foreground">
            Estimated annual emissions: <span className="font-medium">— t CO₂</span>
          </p>
        </div>
      )}
    </div>
=======
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
                  <span>Lifestyle</span>
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
>>>>>>> Stashed changes
  );
}

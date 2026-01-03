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

const steps = [
  { id: 1, title: 'Energy', icon: Zap, description: 'Home energy consumption' },
  { id: 2, title: 'Transport', icon: Car, description: 'How you get around' },
  { id: 3, title: 'Lifestyle', icon: Utensils, description: 'Daily habits and choices' },
];

export default function Calculator() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [calculated, setCalculated] = useState(false);
  
  // Energy state
  const [electricity, setElectricity] = useState([150]);
  const [appliances, setAppliances] = useState({
    ac: true,
    heater: false,
    washer: true,
    dryer: true,
    dishwasher: false,
  });

  // Transport state
  const [transportMode, setTransportMode] = useState('car');
  const [weeklyDistance, setWeeklyDistance] = useState([50]);

  // Lifestyle state
  const [lifestyle, setLifestyle] = useState({
    vegetarian: false,
    localFood: false,
    recycling: true,
    composting: false,
    minimalPackaging: false,
  });

  const progressPercentage = (currentStep / steps.length) * 100;

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return electricity[0] > 0;
      case 2:
        return transportMode !== '';
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate and save results
      toast({
        title: 'Calculation complete!',
        description: 'Your carbon footprint has been calculated and saved.',
      });
      setCalculated(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="page-container max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="page-title mb-2">Carbon Calculator</h1>
        <p className="page-subtitle">
          Answer a few questions to calculate your carbon footprint
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            Step {currentStep} of {steps.length}
          </span>
          <span className="text-sm font-medium text-primary">
            {Math.round(progressPercentage)}% complete
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div key={step.id} className="flex items-center">
              <div
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300',
                  isActive && 'gradient-emerald shadow-glow',
                  isCompleted && 'bg-success',
                  !isActive && !isCompleted && 'bg-muted'
                )}
              >
                {isCompleted ? (
                  <Check className="w-6 h-6 text-success-foreground" />
                ) : (
                  <StepIcon
                    className={cn(
                      'w-6 h-6',
                      isActive ? 'text-primary-foreground' : 'text-muted-foreground'
                    )}
                  />
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'w-16 h-0.5 mx-2',
                    isCompleted ? 'bg-success' : 'bg-border'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="dashboard-card mb-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-1">
            {steps[currentStep - 1].title}
          </h2>
          <p className="text-muted-foreground">
            {steps[currentStep - 1].description}
          </p>
        </div>

        {/* Step 1: Energy */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <Label className="text-base font-medium mb-4 block">
                Monthly electricity usage (kWh)
              </Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={electricity}
                  onValueChange={setElectricity}
                  max={500}
                  min={50}
                  step={10}
                  className="flex-1"
                />
                <span className="w-20 text-right font-semibold text-foreground">
                  {electricity[0]} kWh
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                <Info className="w-4 h-4" />
                Average household uses 150-200 kWh/month
              </p>
            </div>

            <div>
              <Label className="text-base font-medium mb-4 block">
                Which appliances do you use regularly?
              </Label>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(appliances).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                  >
                    <Label htmlFor={key} className="capitalize cursor-pointer">
                      {key === 'ac' ? 'Air Conditioning' : key}
                    </Label>
                    <Switch
                      id={key}
                      checked={value}
                      onCheckedChange={(checked) =>
                        setAppliances((prev) => ({ ...prev, [key]: checked }))
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Transport */}
        {currentStep === 2 && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <Label className="text-base font-medium mb-4 block">
                Primary mode of transportation
              </Label>
              <RadioGroup
                value={transportMode}
                onValueChange={setTransportMode}
                className="grid grid-cols-2 gap-4"
              >
                {[
                  { value: 'car', label: 'Car', icon: '🚗' },
                  { value: 'public', label: 'Public Transit', icon: '🚌' },
                  { value: 'bike', label: 'Bicycle', icon: '🚲' },
                  { value: 'walk', label: 'Walking', icon: '🚶' },
                ].map((option) => (
                  <div key={option.value}>
                    <RadioGroupItem
                      value={option.value}
                      id={option.value}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={option.value}
                      className={cn(
                        'flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all',
                        transportMode === option.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <span className="text-3xl mb-2">{option.icon}</span>
                      <span className="font-medium">{option.label}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {(transportMode === 'car' || transportMode === 'public') && (
              <div>
                <Label className="text-base font-medium mb-4 block">
                  Weekly travel distance (km)
                </Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={weeklyDistance}
                    onValueChange={setWeeklyDistance}
                    max={300}
                    min={0}
                    step={5}
                    className="flex-1"
                  />
                  <span className="w-20 text-right font-semibold text-foreground">
                    {weeklyDistance[0]} km
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Lifestyle */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <Label className="text-base font-medium mb-4 block">
              Sustainable habits
            </Label>
            <div className="space-y-4">
              {[
                { key: 'vegetarian', label: 'I follow a vegetarian/vegan diet', icon: '🥗' },
                { key: 'localFood', label: 'I buy locally sourced food', icon: '🏪' },
                { key: 'recycling', label: 'I recycle regularly', icon: '♻️' },
                { key: 'composting', label: 'I compost food waste', icon: '🌱' },
                { key: 'minimalPackaging', label: 'I avoid single-use plastics', icon: '🛍️' },
              ].map((item) => (
                <div
                  key={item.key}
                  className={cn(
                    'flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer',
                    lifestyle[item.key as keyof typeof lifestyle]
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  )}
                  onClick={() =>
                    setLifestyle((prev) => ({
                      ...prev,
                      [item.key]: !prev[item.key as keyof typeof lifestyle],
                    }))
                  }
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <Switch
                    checked={lifestyle[item.key as keyof typeof lifestyle]}
                    onCheckedChange={(checked) =>
                      setLifestyle((prev) => ({ ...prev, [item.key]: checked }))
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>

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
  );
}

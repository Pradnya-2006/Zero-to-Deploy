import { EMISSION_FACTORS } from '../constants/emissionFactors';

interface InputData {
  electricityKwh: number;
  appliances: Record<string, boolean>;
  transport: {
    mode: string;
    subtype: string;
    weeklyDistanceKm: number;
  };
  lifestyle: Record<string, boolean>;
}

export const calculateFootprint = (data: InputData) => {
  let electricityEmission =
    data.electricityKwh * EMISSION_FACTORS.electricity;

  let applianceMultiplier = 1;
  if (data.appliances.ac) applianceMultiplier += 0.25;
  if (data.appliances.heater) applianceMultiplier += 0.3;
  if (data.appliances.dryer) applianceMultiplier += 0.15;

  electricityEmission *= applianceMultiplier;

  let transportEmission = 0;
  const annualKm = data.transport.weeklyDistanceKm * 52;

  if (data.transport.mode === 'car') {
    transportEmission =
      annualKm *
      EMISSION_FACTORS.transport.car[
        data.transport.subtype as 'petrol' | 'diesel' | 'ev'
      ];
  }

  if (data.transport.mode === 'public') {
    transportEmission =
      annualKm *
      EMISSION_FACTORS.transport.public[
        data.transport.subtype as 'bus' | 'metro' | 'train'
      ];
  }

  if (data.transport.mode === 'bike') {
    transportEmission =
      annualKm * EMISSION_FACTORS.transport.bike;
  }

  let lifestyleReduction = 0;
  if (data.lifestyle.vegetarian) lifestyleReduction += 0.2;
  if (data.lifestyle.localFood) lifestyleReduction += 0.05;
  if (data.lifestyle.recycling) lifestyleReduction += 0.05;

  const gross = electricityEmission + transportEmission;
  const total = gross * (1 - Math.min(lifestyleReduction, 0.35));

  return {
    electricity: +electricityEmission.toFixed(1),
    transport: +transportEmission.toFixed(1),
    lifestyle: +(gross - total).toFixed(1),
    total: +total.toFixed(1),
  };
};

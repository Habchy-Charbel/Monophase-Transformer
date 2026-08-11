export type TransformerGrade = 'COMMERCIAL' | 'MILITARY' | 'INDUSTRIAL' | 'MEDICAL';

export interface Lamination {
  a: number;
  b: number;
  weight: number;
  section: number;
  inStock: boolean;
}

export interface CopperWire {
  diameter_mm: number;
  diameter_mm_div10: number;
  weight_g_per_m: number;
  section_mm2: number;
  linear_resistance_ohm_per_m: number;
  max_current_amps: number;
  net_diameter_mm: number;
  inStock: boolean;
}

export interface CopperWireDatabase {
  COMMERCIAL: CopperWire[];
  MILITARY: CopperWire[];
  INDUSTRIAL: CopperWire[];
  MEDICAL: CopperWire[];
}

export interface CalculationInput {
  inputVoltage: number;
  outputVoltage: number;
  apparentPower: number;
  magneticFluxDensityGauss: number;
  frequency: number;
  grade: TransformerGrade;
  ironPricePerKg?: number;
  copperPricePerKg?: number;
  bobbinPrice?: number;
  accessoriesPrice?: number;
}

export interface CalculationResult {
  inputVoltage: number;
  outputVoltage: number;
  inputCurrent: number;
  outputCurrent: number;
  powerRating: number;
  magneticFluxDensityTesla: number;
  frequency: number;
  grade: TransformerGrade;

  fitFound: boolean;
  a: number;
  b: number;
  crossSectionArea: number;

  primaryTurns: number;
  primaryLayers: number;
  primaryWireDiameter: number;
  primaryWireNetDiameter: number;

  secondaryTurns: number;
  secondaryLayers: number;
  secondaryWireDiameter: number;
  secondaryWireNetDiameter: number;

  ironWeightKg: number;
  copperWeightKg: number;
  ironCost: number;
  copperCost: number;
  bobbinCost: number;
  accessoriesCost: number;
  totalCost: number;

  transformerType: 'Isolation' | 'Step-Down' | 'Step-Up';
}

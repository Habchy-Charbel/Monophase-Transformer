import type { CalculationInput, CalculationResult } from '../types/transformer';
import { getLaminations, getWiresByGrade } from '../data/storage';

export const COPPER_RESISTIVITY = 0.0217;
export const STACKING_FACTOR = 1.0;

export function calculateTransformer(input: CalculationInput): CalculationResult {
  const {
    inputVoltage,
    outputVoltage,
    apparentPower,
    magneticFluxDensityGauss,
    frequency,
    grade,
    ironPricePerKg = 0,
    copperPricePerKg = 0,
    bobbinPrice = 0,
    accessoriesPrice = 0
  } = input;

  const magneticFluxDensityTesla = magneticFluxDensityGauss / 10000.0;

  const inputCurrent = inputVoltage !== 0 ? apparentPower / inputVoltage : 0;
  const outputCurrent = outputVoltage !== 0 ? apparentPower / outputVoltage : 0;

  const myWires = getWiresByGrade(grade);
  const laminationList = getLaminations();

  let primaryDia = myWires.length > 0 ? myWires[myWires.length - 1].diameter_mm : 0;
  let primaryNetDia = myWires.length > 0 ? myWires[myWires.length - 1].net_diameter_mm : 0;

  if (myWires.length > 0) {
    for (const w of myWires) {
      if (w.max_current_amps >= inputCurrent && w.inStock) {
        primaryDia = w.diameter_mm;
        primaryNetDia = w.net_diameter_mm;
        break;
      }
    }
  }

  let secondaryDia = myWires.length > 0 ? myWires[myWires.length - 1].diameter_mm : 0;
  let secondaryNetDia = myWires.length > 0 ? myWires[myWires.length - 1].net_diameter_mm : 0;

  if (myWires.length > 0) {
    for (const w of myWires) {
      if (w.max_current_amps >= outputCurrent && w.inStock) {
        secondaryDia = w.diameter_mm;
        secondaryNetDia = w.net_diameter_mm;
        break;
      }
    }
  }

  const apparentPowerVA = inputCurrent * inputVoltage;
  const requiredAreaCm2 = 1.25 * Math.sqrt(apparentPowerVA);

  let fitFound = false;
  let selectedA = 0;
  let selectedB = 0;
  let primaryTurns = 0;
  let secondaryTurns = 0;
  let primaryLayers = 0;
  let secondaryLayers = 0;

  const aWire1 = Math.PI * Math.pow(primaryDia / 2.0, 2);
  const aWire2 = Math.PI * Math.pow(secondaryDia / 2.0, 2);

  for (let i = 0; i < laminationList.length; i++) {
    const lam = laminationList[i];
    if (!lam.inStock) {
      continue;
    }

    const a = lam.a;
    const b = lam.b;

    const grossAreaCm2 = a * b;
    const effectiveAreaCm2 = grossAreaCm2 * STACKING_FACTOR;

    const Ae = effectiveAreaCm2 / 10000.0;
    const k = 4.44 * frequency * magneticFluxDensityTesla * Ae;

    if (k === 0) continue;

    const windowHeightMm = 15.0 * a;
    const windowWidthMm = 5.0 * a;

    const usableWindowHeightMm = windowHeightMm - 2;
    const usableWindowWidthMm = windowWidthMm - 1.5;

    const turnsPerLayerPrimary = (usableWindowHeightMm / primaryNetDia) * 0.93;
    const turnsPerLayerSecondary = (usableWindowHeightMm / secondaryNetDia) * 0.93;

    if (turnsPerLayerPrimary <= 0 || turnsPerLayerSecondary <= 0) {
      continue;
    }

    const N1_est = Math.ceil(inputVoltage / k);

    const primaryLayers_est = Math.ceil(N1_est / turnsPerLayerPrimary);
    const secondaryLayers_est = Math.ceil(Math.ceil(outputVoltage / k) / turnsPerLayerSecondary);

    const t1_est = primaryLayers_est * primaryNetDia;
    const t2_est = secondaryLayers_est * secondaryNetDia;

    const P_core = 2.0 * (a + b) / 100.0;
    const mlt1_est = P_core + (Math.PI * t1_est / 1000.0);
    const mlt2_est = P_core + (Math.PI * (2.0 * t1_est + t2_est) / 1000.0);

    const N1 = Math.ceil(inputVoltage / (k + inputCurrent * COPPER_RESISTIVITY * mlt1_est / aWire1));
    const R1 = COPPER_RESISTIVITY * (N1 * mlt1_est) / aWire1;
    const E1 = inputVoltage - (inputCurrent * R1);

    const denomN2 = E1 - (N1 * outputCurrent * COPPER_RESISTIVITY * mlt2_est / aWire2);
    if (denomN2 <= 0) {
      continue;
    }

    const N2 = Math.ceil((N1 * outputVoltage) / denomN2);

    const pLayers = Math.ceil(N1 / turnsPerLayerPrimary);
    const sLayers = Math.ceil(N2 / turnsPerLayerSecondary);

    const t1 = pLayers * primaryNetDia;
    const t2 = sLayers * secondaryNetDia;

    const totalBuildThickness = t1 + t2 + 0.5;

    if (totalBuildThickness <= usableWindowWidthMm * 0.92 && effectiveAreaCm2 >= requiredAreaCm2) {
      selectedA = a;
      selectedB = b;
      primaryTurns = N1;
      secondaryTurns = N2;
      primaryLayers = pLayers;
      secondaryLayers = sLayers;
      fitFound = true;
      break;
    }
  }

  let ironWeightGrams = 0;
  for (const lam of laminationList) {
    if (selectedA === lam.a && selectedB === lam.b) {
      ironWeightGrams = lam.weight;
      break;
    }
  }
  const ironWeightKg = ironWeightGrams / 1000.0;

  let copperWeightGrams = 0;
  if (fitFound) {
    const P_core = 2.0 * (selectedA + selectedB) / 100.0;
    const t1 = primaryLayers * primaryNetDia;
    const t2 = secondaryLayers * secondaryNetDia;

    const mltPrimary = P_core + (Math.PI * t1 / 1000.0);
    const mltSecondary = P_core + (Math.PI * (2.0 * t1 + t2) / 1000.0);

    const epsilon = 0.001;
    for (const wire of myWires) {
      if (Math.abs(primaryDia - wire.diameter_mm) < epsilon) {
        copperWeightGrams += primaryTurns * mltPrimary * wire.weight_g_per_m;
      }
      if (Math.abs(secondaryDia - wire.diameter_mm) < epsilon) {
        copperWeightGrams += secondaryTurns * mltSecondary * wire.weight_g_per_m;
      }
    }
  }
  const copperWeightKg = copperWeightGrams / 1000.0;

  const ironCost = ironWeightKg * ironPricePerKg;
  const copperCost = copperWeightKg * copperPricePerKg;
  const totalCost = ironCost + copperCost + bobbinPrice + accessoriesPrice;

  let transformerType: 'Isolation' | 'Step-Down' | 'Step-Up' = 'Step-Down';
  if (Math.abs(inputVoltage - outputVoltage) < 0.01) {
    transformerType = 'Isolation';
  } else if (inputVoltage > outputVoltage) {
    transformerType = 'Step-Down';
  } else {
    transformerType = 'Step-Up';
  }

  return {
    inputVoltage,
    outputVoltage,
    inputCurrent,
    outputCurrent,
    powerRating: apparentPower,
    magneticFluxDensityTesla,
    frequency,
    grade,
    fitFound,
    a: selectedA,
    b: selectedB,
    crossSectionArea: selectedA * selectedB,
    primaryTurns,
    primaryLayers,
    primaryWireDiameter: primaryDia,
    primaryWireNetDiameter: primaryNetDia,
    secondaryTurns,
    secondaryLayers,
    secondaryWireDiameter: secondaryDia,
    secondaryWireNetDiameter: secondaryNetDia,
    ironWeightKg,
    copperWeightKg,
    ironCost,
    copperCost,
    bobbinCost: bobbinPrice,
    accessoriesCost: accessoriesPrice,
    totalCost,
    transformerType
  };
}

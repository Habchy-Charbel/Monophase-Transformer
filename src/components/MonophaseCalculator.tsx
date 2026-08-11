import React, { useState } from 'react';
import type { TransformerGrade, CalculationInput, CalculationResult } from '../types/transformer';
import { calculateTransformer } from '../logic/calculator';
import { Zap, DollarSign, Calculator, RotateCcw, AlertCircle, Cpu } from 'lucide-react';

interface MonophaseCalculatorProps {
  onCalculate: (result: CalculationResult) => void;
}

const GRADES: TransformerGrade[] = ['COMMERCIAL', 'INDUSTRIAL', 'MILITARY', 'MEDICAL'];

const GRADE_COLORS: Record<TransformerGrade, string> = {
  COMMERCIAL: '#3b82f6',
  INDUSTRIAL: '#f59e0b',
  MILITARY:   '#10b981',
  MEDICAL:    '#ec4899',
};

interface FieldProps {
  label: string;
  value: string;
  setter: (v: string) => void;
  placeholder: string;
  unit: string;
}

const handleFieldBlur = (val: string, setter: (v: string) => void) => {
  if (!val || val.trim() === '') return;
  const num = parseFloat(val);
  if (!isNaN(num)) setter(String(Math.round(num * 100) / 100));
};

const Field: React.FC<FieldProps> = ({
  label, value, setter, placeholder, unit,
}) => (
  <div className="ios-input-group">
    <label className="ios-label">{label}</label>
    <div className="input-wrap">
      <input
        type="number"
        step="any"
        inputMode="decimal"
        value={value}
        onChange={e => setter(e.target.value)}
        onBlur={() => handleFieldBlur(value, setter)}
        className="ios-input"
        placeholder={placeholder}
        style={{ paddingRight: unit.length > 4 ? 52 : 44, fontFamily: 'var(--font-mono)' }}
      />
      <span className="input-unit">{unit}</span>
    </div>
  </div>
);

export const MonophaseCalculator: React.FC<MonophaseCalculatorProps> = ({ onCalculate }) => {
  const [grade, setGrade] = useState<TransformerGrade>('COMMERCIAL');
  const [frequency, setFrequency] = useState<number>(50);

  const [inVoltage, setInVoltage]       = useState<string>('220');
  const [outVoltage, setOutVoltage]     = useState<string>('12');
  const [apparentPower, setApparentPower] = useState<string>('120');
  const [fluxDensity, setFluxDensity]   = useState<string>('14000');

  const [ironPrice, setIronPrice]           = useState<string>('2.5');
  const [copperPrice, setCopperPrice]       = useState<string>('12');
  const [bobbinPrice, setBobbinPrice]       = useState<string>('1.5');
  const [accessoriesPrice, setAccessoriesPrice] = useState<string>('2.0');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const inV  = parseFloat(inVoltage) || 0;
    const outV = parseFloat(outVoltage) || 0;
    const va   = parseFloat(apparentPower) || 0;
    const flux = parseFloat(fluxDensity) || 0;

    if (inV <= 0 || outV <= 0 || va <= 0 || flux <= 0) {
      setErrorMsg('Primary Voltage, Secondary Voltage, Apparent Power, and Magnetic Flux Density must be greater than 0.');
      return;
    }

    const inputData: CalculationInput = {
      inputVoltage: inV,
      outputVoltage: outV,
      apparentPower: va,
      magneticFluxDensityGauss: flux,
      frequency,
      grade,
      ironPricePerKg: parseFloat(ironPrice) || 0,
      copperPricePerKg: parseFloat(copperPrice) || 0,
      bobbinPrice: parseFloat(bobbinPrice) || 0,
      accessoriesPrice: parseFloat(accessoriesPrice) || 0,
    };

    onCalculate(calculateTransformer(inputData));
  };

  const handleReset = () => {
    setGrade('COMMERCIAL');
    setFrequency(50);
    setInVoltage('220');
    setOutVoltage('12');
    setApparentPower('120');
    setFluxDensity('14000');
    setIronPrice('2.5');
    setCopperPrice('12');
    setBobbinPrice('1.5');
    setAccessoriesPrice('2.0');
    setErrorMsg(null);
  };

  return (
    <div className="view-enter" style={{ maxWidth: 820, margin: '0 auto' }}>

      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 6 }}>
          Welcome, Charbel
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-tertiary)', fontWeight: 500 }}>
          Configure specifications and parameters to generate a full transformer design
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        <div className="glass-card" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

            <div style={{ gridColumn: '1 / -1' }}>
              <div className="section-header" style={{ marginBottom: 10, justifyContent: 'center' }}>
                <Cpu size={13} color="var(--accent)" />
                Transformer Grade
              </div>
              <div className="segmented-control" style={{ width: '100%', justifyContent: 'center' }}>
                {GRADES.map(g => (
                  <button
                    type="button"
                    key={g}
                    onClick={() => setGrade(g)}
                    className={`segmented-item ${grade === g ? 'active' : ''}`}
                    style={grade === g ? { background: `linear-gradient(135deg, ${GRADE_COLORS[g]}, ${GRADE_COLORS[g]}cc)` } : {}}
                  >
                    {g.charAt(0) + g.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="section-header" style={{ marginBottom: 10, justifyContent: 'center' }}>
                <Zap size={13} color="var(--teal)" />
                Frequency
              </div>
              <div className="segmented-control" style={{ justifyContent: 'center' }}>
                {[50, 60].map(f => (
                  <button
                    type="button"
                    key={f}
                    onClick={() => setFrequency(f)}
                    className={`segmented-item ${frequency === f ? 'active' : ''}`}
                  >
                    {f} Hz
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px 24px' }}>
          <div className="section-header">
            <Zap size={13} color="#60a5fa" />
            Electrical Specs & Flux Density
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }} className="mobile-stack">
            <Field label="Primary Voltage"    value={inVoltage}     setter={setInVoltage}     placeholder="220"   unit="V" />
            <Field label="Secondary Voltage"  value={outVoltage}    setter={setOutVoltage}    placeholder="12"    unit="V" />
            <Field label="Apparent Power"     value={apparentPower} setter={setApparentPower} placeholder="120"   unit="VA" />
            <Field label="Magnetic Flux"      value={fluxDensity}   setter={setFluxDensity}   placeholder="14000" unit="Gs" />
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px 24px' }}>
          <div className="section-header">
            <DollarSign size={13} color="#4ade80" />
            Material Unit Prices
            <span style={{ marginLeft: 6, fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 500, textTransform: 'none', letterSpacing: 0 }}>
              (optional)
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }} className="mobile-stack">
            <Field label="Iron Price"         value={ironPrice}        setter={setIronPrice}        placeholder="0.00" unit="$/kg" />
            <Field label="Copper Price"       value={copperPrice}      setter={setCopperPrice}      placeholder="0.00" unit="$/kg" />
            <Field label="Bobbin Price"       value={bobbinPrice}      setter={setBobbinPrice}      placeholder="0.00" unit="$" />
            <Field label="Accessories Price"  value={accessoriesPrice} setter={setAccessoriesPrice} placeholder="0.00" unit="$" />
          </div>
        </div>

        {errorMsg && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 16px',
            background: 'var(--danger-bg)',
            border: '1px solid var(--danger-border)',
            borderRadius: 12,
            color: 'var(--danger-text)',
            fontSize: 13,
            fontWeight: 500,
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            {errorMsg}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, flexWrap: 'wrap' }} className="mobile-btn-row">
          <button type="button" onClick={handleReset} className="ios-button ios-button-secondary">
            <RotateCcw size={15} />
            Reset
          </button>
          <button type="submit" className="ios-button ios-button-primary">
            <Calculator size={15} />
            Calculate Transformer
          </button>
        </div>

      </form>
    </div>
  );
};

import React, { useState } from 'react';
import type { CalculationResult } from '../types/transformer';
import { BlueprintModal } from './BlueprintModal';
import {
  ArrowLeft, FileText, Zap, Layers, Sparkles, DollarSign,
} from 'lucide-react';

interface ResultSummaryProps {
  result: CalculationResult;
  onReset: () => void;
}

const fmt2 = (n: number) => n.toFixed(2);
const fmt3 = (n: number) => n.toFixed(3);
const fmt4 = (n: number) => n.toFixed(4);

const money = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const TYPE_COLOR: Record<string, string> = {
  'Isolation': '#60a5fa',
  'Step-Down': '#818cf8',
  'Step-Up':   '#34d399',
};

const GRADE_COLOR: Record<string, string> = {
  COMMERCIAL: '#60a5fa',
  INDUSTRIAL: '#fbbf24',
  MILITARY:   '#34d399',
  MEDICAL:    '#f472b6',
};

export const ResultSummary: React.FC<ResultSummaryProps> = ({ result, onReset }) => {
  const [showBlueprint, setShowBlueprint] = useState(false);

  const typeColor  = TYPE_COLOR[result.transformerType] ?? '#60a5fa';
  const gradeColor = GRADE_COLOR[result.grade] ?? '#60a5fa';

  const StatCell = ({ label, value, accent }: { label: string; value: string; accent?: string }) => (
    <div className="stat-cell">
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={accent ? { color: accent } : {}}>{value}</div>
    </div>
  );

  return (
    <div className="view-enter" style={{ maxWidth: 820, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

      <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <button onClick={onReset} className="ios-button ios-button-secondary" style={{ fontSize: 13 }}>
          <ArrowLeft size={15} />
          Back to Inputs
        </button>
        <button onClick={() => setShowBlueprint(true)} className="ios-button ios-button-primary" style={{ fontSize: 13 }}>
          <FileText size={15} />
          Generate Blueprint
        </button>
      </div>

      <div className="glass-card" style={{
        padding: '24px',
        background: 'linear-gradient(135deg, rgba(17,24,39,0.9) 0%, rgba(30,27,75,0.85) 100%)',
        borderColor: 'rgba(99,102,241,0.25)',
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '4px 12px', borderRadius: 999,
                background: `${typeColor}1a`, border: `1px solid ${typeColor}44`,
                color: typeColor, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>
                {result.transformerType} Transformer
              </span>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '4px 12px', borderRadius: 999,
                background: `${gradeColor}1a`, border: `1px solid ${gradeColor}44`,
                color: gradeColor, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>
                {result.grade} Grade
              </span>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Calculation Summary
            </h2>
            <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 3 }}>
              {result.frequency} Hz · {result.fitFound ? 'Lamination fit found' : '⚠ No lamination fit found'}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 4 }}>
              Power Rating
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 800, color: '#fff', lineHeight: 1 }}>
              {fmt2(result.powerRating)}
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginLeft: 5 }}>VA</span>
            </div>
          </div>
        </div>

        {!result.fitFound && (
          <div style={{
            marginTop: 14, padding: '10px 14px',
            background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)',
            borderRadius: 10, color: '#fbbf24', fontSize: 12, fontWeight: 500,
          }}>
            ⚠ No in-stock lamination fit was found that meets window thickness and area requirements.
            Check lamination stock or select a different wire grade.
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        <div className="glass-card" style={{ padding: '18px 20px' }}>
          <div className="section-header" style={{ color: '#60a5fa' }}>
            <Zap size={13} color="#60a5fa" />
            Electrical
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <StatCell label="Primary Voltage"   value={`${fmt2(result.inputVoltage)} V`} />
            <StatCell label="Primary Current"   value={`${fmt2(result.inputCurrent)} A`} />
            <StatCell label="Secondary Voltage" value={`${fmt2(result.outputVoltage)} V`} />
            <StatCell label="Secondary Current" value={`${fmt2(result.outputCurrent)} A`} />
            <div className="stat-cell" style={{ gridColumn: '1 / -1' }}>
              <div className="stat-label">Magnetic Flux Density</div>
              <div className="stat-value" style={{ color: '#a78bfa' }}>{fmt4(result.magneticFluxDensityTesla)} T</div>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '18px 20px' }}>
          <div className="section-header" style={{ color: '#818cf8' }}>
            <Layers size={13} color="#818cf8" />
            Lamination Core
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <StatCell label="Tongue Width (a)" value={`${fmt2(result.a)} cm`} />
            <StatCell label="Stack Height (b)"  value={`${fmt2(result.b)} cm`} />
            <div className="stat-cell" style={{ gridColumn: '1 / -1' }}>
              <div className="stat-label">Cross Section Area</div>
              <div className="stat-value" style={{ color: '#818cf8' }}>{fmt2(result.crossSectionArea)} cm²</div>
            </div>
            <div className="stat-cell" style={{ gridColumn: '1 / -1' }}>
              <div className="stat-label">Iron Weight</div>
              <div className="stat-value">{fmt3(result.ironWeightKg)} kg</div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '18px 20px' }}>
        <div className="section-header">
          <Sparkles size={13} color="#34d399" />
          Winding Details
        </div>
        <div style={{ overflowX: 'auto', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-subtle)' }}>
                {['Winding', 'Turns (N)', 'Layers', 'Bare Ø', 'Net Ø'].map(h => (
                  <th key={h} style={{
                    padding: '10px 14px', textAlign: 'left', fontSize: 10,
                    fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
                    color: 'var(--text-tertiary)', whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-primary)' }}>Primary</td>
                <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#60a5fa' }}>{result.primaryTurns}</td>
                <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>{result.primaryLayers}</td>
                <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>{fmt2(result.primaryWireDiameter)} mm</td>
                <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{fmt2(result.primaryWireNetDiameter)} mm</td>
              </tr>
              <tr>
                <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-primary)' }}>Secondary</td>
                <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#818cf8' }}>{result.secondaryTurns}</td>
                <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>{result.secondaryLayers}</td>
                <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>{fmt2(result.secondaryWireDiameter)} mm</td>
                <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{fmt2(result.secondaryWireNetDiameter)} mm</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass-card" style={{
        padding: '20px 24px',
        background: 'linear-gradient(135deg, rgba(2,20,50,0.95) 0%, rgba(10,20,40,0.9) 100%)',
        borderColor: 'rgba(34,197,94,0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 18 }}>
          <div className="section-header" style={{ color: '#4ade80', marginBottom: 0 }}>
            <DollarSign size={14} color="#4ade80" />
            Cost Estimation
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 2 }}>
              Total Cost
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 800, color: '#4ade80' }}>
              ${money.format(result.totalCost)}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {[
            { label: 'Iron Core',    value: result.ironCost,       sub: `${fmt2(result.ironWeightKg)} kg`,   color: '#60a5fa' },
            { label: 'Copper Wire',  value: result.copperCost,     sub: `${fmt2(result.copperWeightKg)} kg`, color: '#818cf8' },
            { label: 'Bobbin',       value: result.bobbinCost,     sub: '',                                  color: '#fbbf24' },
            { label: 'Accessories',  value: result.accessoriesCost, sub: '',                                 color: '#f472b6' },
          ].map(item => (
            <div key={item.label} style={{
              padding: '12px 14px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12,
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 4 }}>
                {item.label}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700, color: item.color }}>
                ${money.format(item.value)}
              </div>
              {item.sub && (
                <div style={{ fontSize: 10, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                  {item.sub}
                </div>
              )}
            </div>
          ))}
        </div>

        {result.totalCost > 0 && (
          <div style={{ marginTop: 14 }}>
            <div style={{ display: 'flex', gap: 3, height: 6, borderRadius: 999, overflow: 'hidden' }}>
              {[
                { cost: result.ironCost,        color: '#60a5fa' },
                { cost: result.copperCost,      color: '#818cf8' },
                { cost: result.bobbinCost,      color: '#fbbf24' },
                { cost: result.accessoriesCost, color: '#f472b6' },
              ].filter(s => s.cost > 0).map((s, i) => (
                <div key={i} style={{
                  flex: s.cost / result.totalCost,
                  background: s.color,
                  opacity: 0.75,
                  borderRadius: 999,
                  transition: 'flex 0.4s ease',
                }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {showBlueprint && (
        <BlueprintModal result={result} onClose={() => setShowBlueprint(false)} />
      )}
    </div>
  );
};

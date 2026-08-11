import React from 'react';
import type { CopperWire } from '../types/transformer';
import { X, CheckCircle, XCircle } from 'lucide-react';

interface CopperWireDetailModalProps {
  commercial: CopperWire;
  military:   CopperWire;
  industrial: CopperWire;
  medical:    CopperWire;
  onToggleStock: (inStock: boolean) => void;
  onClose: () => void;
}

const GRADE_META = [
  { key: 'commercial', label: 'Commercial', color: '#3b82f6' },
  { key: 'military',   label: 'Military',   color: '#10b981' },
  { key: 'industrial', label: 'Industrial', color: '#f59e0b' },
  { key: 'medical',    label: 'Medical',    color: '#ec4899' },
] as const;

export const CopperWireDetailModal: React.FC<CopperWireDetailModalProps> = ({
  commercial, military, industrial, medical, onToggleStock, onClose,
}) => {
  const gradeData = { commercial, military, industrial, medical };
  const fv = (v: number, d = 5) => v.toFixed(d);

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="glass-card" style={{
        width: '100%', maxWidth: 520,
        maxHeight: '90dvh', overflowY: 'auto',
        display: 'flex', flexDirection: 'column', gap: 0,
      }}>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 22px', borderBottom: '1px solid var(--border-subtle)',
        }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>
              Wire Ø {(commercial.diameter_mm * 10).toFixed(2)} dixième
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
              {commercial.diameter_mm.toFixed(3)} mm bare · {commercial.net_diameter_mm.toFixed(3)} mm net
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 34, height: 34, borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: 'rgba(255,255,255,0.07)', color: 'var(--text-secondary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
          >
            <X size={17} />
          </button>
        </div>

        <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 18 }}>

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 16px', borderRadius: 12,
            background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)',
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
              Inventory Status
            </span>
            <button
              onClick={() => onToggleStock(!commercial.inStock)}
              className={`status-badge ${commercial.inStock ? 'status-instock' : 'status-outstock'}`}
              style={{ padding: '6px 14px' }}
            >
              {commercial.inStock
                ? <><CheckCircle size={13} /> In Stock</>
                : <><XCircle size={13} /> Out of Stock</>
              }
            </button>
          </div>

          <div>
            <div className="section-header" style={{ marginBottom: 10 }}>Physical Properties</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {[
                { label: 'Diameter',      value: `${fv(commercial.diameter_mm, 3)} mm` },
                { label: 'Section',       value: `${fv(commercial.section_mm2, 5)} mm²` },
                { label: 'Linear Weight', value: `${fv(commercial.weight_g_per_m, 5)} g/m` },
              ].map(s => (
                <div key={s.label} className="stat-cell">
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-value" style={{ fontSize: 12 }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="section-header" style={{ marginBottom: 10 }}>Linear Resistance</div>
            <div className="stat-cell" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="stat-label">Resistance</div>
              <div className="stat-value">{fv(commercial.linear_resistance_ohm_per_m, 5)} Ω/m</div>
            </div>
          </div>

          <div>
            <div className="section-header" style={{ marginBottom: 10 }}>Max Current by Grade</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {GRADE_META.map(gm => {
                const wire = gradeData[gm.key];
                return (
                  <div key={gm.key} style={{
                    padding: '10px 14px', borderRadius: 10,
                    background: `${gm.color}0d`, border: `1px solid ${gm.color}28`,
                    display: 'flex', flexDirection: 'column', gap: 3,
                  }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: gm.color, opacity: 0.8 }}>
                      {gm.label}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 14, color: gm.color }}>
                      {fv(wire.max_current_amps, 4)} A
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

import React from 'react';
import type { Lamination } from '../types/transformer';
import { X, CheckCircle, XCircle, Layers } from 'lucide-react';
import { ModalPortal } from './ModalPortal';

interface LaminationDetailModalProps {
  lamination: Lamination;
  onToggleStock: (inStock: boolean) => void;
  onClose: () => void;
}

export const LaminationDetailModal: React.FC<LaminationDetailModalProps> = ({
  lamination, onToggleStock, onClose,
}) => {
  const seriesName = `EL ${Math.round(lamination.a * 30)}`;

  return (
    <ModalPortal>
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: 440, maxHeight: '90dvh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 22px', borderBottom: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Layers size={17} color="#a78bfa" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>
                Lamination Core
              </div>
              <div style={{ fontSize: 11, color: '#a78bfa', fontWeight: 600, marginTop: 1 }}>
                {seriesName} Series
              </div>
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

        <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 16px', borderRadius: 12,
            background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)',
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
              Inventory Status
            </span>
            <button
              onClick={() => onToggleStock(!lamination.inStock)}
              className={`status-badge ${lamination.inStock ? 'status-instock' : 'status-outstock'}`}
              style={{ padding: '6px 14px' }}
            >
              {lamination.inStock
                ? <><CheckCircle size={13} /> In Stock</>
                : <><XCircle size={13} /> Out of Stock</>
              }
            </button>
          </div>

          <div>
            <div className="section-header" style={{ marginBottom: 10 }}>Core Specifications</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>

              <div className="stat-cell">
                <div className="stat-label">Tongue Width (a)</div>
                <div className="stat-value" style={{ color: '#a78bfa' }}>{lamination.a.toFixed(2)} cm</div>
              </div>

              <div className="stat-cell">
                <div className="stat-label">Stack Height (b)</div>
                <div className="stat-value" style={{ color: '#a78bfa' }}>{lamination.b.toFixed(2)} cm</div>
              </div>

              <div className="stat-cell" style={{ gridColumn: '1 / -1' }}>
                <div className="stat-label">Cross Section Area</div>
                <div className="stat-value" style={{ fontSize: 18, color: '#818cf8' }}>
                  {lamination.section.toFixed(2)} cm²
                </div>
              </div>

              <div className="stat-cell" style={{ gridColumn: '1 / -1' }}>
                <div className="stat-label">Unit Weight</div>
                <div className="stat-value">
                  {lamination.weight.toFixed(1)} g
                  <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500 }}>
                    ({(lamination.weight / 1000).toFixed(3)} kg)
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    </ModalPortal>
  );
};

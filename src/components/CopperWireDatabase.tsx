import React, { useState } from 'react';
import type { CopperWire, TransformerGrade } from '../types/transformer';
import { getCopperWireDatabase, saveWireStock } from '../data/storage';
import { CopperWireDetailModal } from './CopperWireDetailModal';
import { Search, Eye, CheckCircle, XCircle, Database } from 'lucide-react';

const GRADES: TransformerGrade[] = ['COMMERCIAL', 'INDUSTRIAL', 'MILITARY', 'MEDICAL'];

const GRADE_COLOR: Record<TransformerGrade, string> = {
  COMMERCIAL: '#3b82f6',
  INDUSTRIAL: '#f59e0b',
  MILITARY:   '#10b981',
  MEDICAL:    '#ec4899',
};

export const CopperWireDatabaseView: React.FC = () => {
  const [wireDb, setWireDb] = useState(getCopperWireDatabase());
  const [selectedGrade, setSelectedGrade] = useState<TransformerGrade>('COMMERCIAL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [detailItemIndex, setDetailItemIndex] = useState<number | null>(null);

  const refreshDb = () => setWireDb(getCopperWireDatabase());

  const handleStockToggle = (wire: CopperWire, newStockState: boolean) => {
    saveWireStock(wire.diameter_mm, newStockState);
    refreshDb();
  };

  const currentGradeList = wireDb[selectedGrade] || [];

  const filteredIndices = currentGradeList
    .map((wire, idx) => ({ wire, idx }))
    .filter(({ wire }) => {
      if (!searchQuery.trim()) return true;
      const dixStr = String(Math.round(wire.diameter_mm * 10));
      const diaStr = String(wire.diameter_mm);
      return dixStr.includes(searchQuery) || diaStr.includes(searchQuery);
    });

  const gradeColor = GRADE_COLOR[selectedGrade];

  return (
    <div className="view-enter" style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 14px rgba(59,130,246,0.3)',
        }}>
          <Database size={18} color="#fff" />
        </div>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Copper Wire Database
          </h2>
          <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
            Manage wire gauges and toggle in-stock availability
          </p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        <div className="segmented-control" style={{ width: '100%' }}>
          {GRADES.map(g => (
            <button
              key={g}
              onClick={() => setSelectedGrade(g)}
              className={`segmented-item ${selectedGrade === g ? 'active' : ''}`}
              style={selectedGrade === g ? { background: `linear-gradient(135deg, ${GRADE_COLOR[g]} 0%, ${GRADE_COLOR[g]}cc 100%)` } : {}}
            >
              {g.charAt(0) + g.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by diameter or dixieme (e.g. 0.35 or 35)…"
            className="ios-input"
            style={{ paddingLeft: 36, fontSize: 13 }}
          />
        </div>
      </div>

      <div style={{ fontSize: 12, color: 'var(--text-tertiary)', paddingLeft: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: gradeColor, fontWeight: 700 }}>{filteredIndices.length}</span>
        {' '}wire{filteredIndices.length !== 1 ? 's' : ''} found in
        <span style={{ color: gradeColor, fontWeight: 700 }}>{selectedGrade.charAt(0) + selectedGrade.slice(1).toLowerCase()}</span> grade
      </div>

      <div className="glass-card" style={{ padding: 6 }}>
        {filteredIndices.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 13 }}>
            No copper wires found matching "{searchQuery}"
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filteredIndices.map(({ wire, idx }) => (
              <div
                key={wire.diameter_mm}
                className="db-list-row"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  padding: '10px 12px',
                  borderRadius: 12,
                  transition: 'background 0.15s ease',
                  cursor: 'default',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: '1 1 auto' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: `${gradeColor}18`,
                    border: `1px solid ${gradeColor}33`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-mono)', fontWeight: 700,
                    color: gradeColor, fontSize: 12,
                  }}>
                    <span style={{ fontSize: 10, opacity: 0.7 }}>Ø</span>
                    <span>{Math.round(wire.diameter_mm * 10)}</span>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {wire.diameter_mm.toFixed(3)} mm
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                      Max {wire.max_current_amps.toFixed(4)} A
                    </div>
                  </div>
                </div>

                <div className="db-row-actions">
                  <button
                    type="button"
                    onClick={() => handleStockToggle(wire, !wire.inStock)}
                    className={`status-badge ${wire.inStock ? 'status-instock' : 'status-outstock'}`}
                  >
                    {wire.inStock
                      ? <><CheckCircle size={12} /><span>In Stock</span></>
                      : <><XCircle size={12} /><span>Out of Stock</span></>
                    }
                  </button>
                  <button
                    type="button"
                    onClick={() => setDetailItemIndex(idx)}
                    className="ios-button ios-button-secondary"
                    style={{ padding: '6px 12px', fontSize: 12 }}
                  >
                    <Eye size={13} />
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {detailItemIndex !== null && (
        <CopperWireDetailModal
          commercial={wireDb.COMMERCIAL[detailItemIndex]}
          military={wireDb.MILITARY[detailItemIndex]}
          industrial={wireDb.INDUSTRIAL[detailItemIndex]}
          medical={wireDb.MEDICAL[detailItemIndex]}
          onToggleStock={newStock => {
            handleStockToggle(wireDb.COMMERCIAL[detailItemIndex], newStock);
          }}
          onClose={() => setDetailItemIndex(null)}
        />
      )}
    </div>
  );
};

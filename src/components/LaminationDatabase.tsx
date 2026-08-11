import React, { useState } from 'react';
import type { Lamination } from '../types/transformer';
import { getLaminations, saveLaminationStock } from '../data/storage';
import { LaminationDetailModal } from './LaminationDetailModal';
import { Search, Eye, CheckCircle, XCircle, Layers, ChevronDown, ChevronRight } from 'lucide-react';

export const LaminationDatabaseView: React.FC = () => {
  const [laminations, setLaminations] = useState<Lamination[]>(getLaminations());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLamination, setSelectedLamination] = useState<Lamination | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const refreshList = () => setLaminations(getLaminations());

  const handleStockToggle = (lam: Lamination, newStockState: boolean) => {
    saveLaminationStock(lam.a, lam.b, newStockState);
    refreshList();
  };

  const toggleGroup = (name: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const groups: Record<string, Lamination[]> = {};
  laminations.forEach(lam => {
    const name = `EL ${Math.round(lam.a * 30)}`;
    if (!groups[name]) groups[name] = [];
    groups[name].push(lam);
  });

  const filteredGroups: Record<string, Lamination[]> = {};
  Object.entries(groups).forEach(([groupName, items]) => {
    const matched = items.filter(lam => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        groupName.toLowerCase().includes(q) ||
        `${lam.a}x${lam.b}`.includes(q) ||
        String(lam.a).includes(q) ||
        String(lam.b).includes(q)
      );
    });
    if (matched.length > 0) filteredGroups[groupName] = matched;
  });

  const totalShown = Object.values(filteredGroups).reduce((acc, g) => acc + g.length, 0);

  return (
    <div className="view-enter" style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 14px rgba(139,92,246,0.3)',
        }}>
          <Layers size={18} color="#fff" />
        </div>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Lamination Core Database
          </h2>
          <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
            Grouped by EL series · toggle in-stock status
          </p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '12px 16px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search cores (e.g. EL 84, 2.8)…"
            className="ios-input"
            style={{ paddingLeft: 36, fontSize: 13 }}
          />
        </div>
      </div>

      <div style={{ fontSize: 12, color: 'var(--text-tertiary)', paddingLeft: 4 }}>
        <span style={{ color: '#a78bfa', fontWeight: 700 }}>{totalShown}</span> lamination{totalShown !== 1 ? 's' : ''} across{' '}
        <span style={{ color: '#a78bfa', fontWeight: 700 }}>{Object.keys(filteredGroups).length}</span> EL series
      </div>

      {Object.keys(filteredGroups).length === 0 ? (
        <div className="glass-card" style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 13 }}>
          No lamination cores found matching "{searchQuery}"
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {Object.entries(filteredGroups).map(([groupTitle, items]) => {
            const collapsed = collapsedGroups.has(groupTitle);
            const inStockCount = items.filter(l => l.inStock).length;
            return (
              <div key={groupTitle} className="glass-card" style={{ overflow: 'hidden', padding: 0 }}>

                <button
                  onClick={() => toggleGroup(groupTitle)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 18px', background: 'transparent', border: 'none', cursor: 'pointer',
                    borderBottom: collapsed ? 'none' : '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: 8,
                      background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.25)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Layers size={14} color="#a78bfa" />
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{groupTitle}</span>
                    <span style={{
                      padding: '2px 8px', borderRadius: 999,
                      background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)',
                      fontSize: 11, fontWeight: 600, color: '#a78bfa',
                    }}>
                      {inStockCount}/{items.length} in stock
                    </span>
                  </div>
                  <div style={{ color: 'var(--text-tertiary)' }}>
                    {collapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                {!collapsed && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '6px' }}>
                    {items.map(lam => (
                      <div
                        key={`${lam.a}_${lam.b}`}
                        className="db-list-row"
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          gap: 8, padding: '10px 12px', borderRadius: 10,
                          transition: 'background 0.14s ease',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: '1 1 auto' }}>
                          <div style={{
                            padding: '6px 10px', borderRadius: 8,
                            background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)',
                            fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13,
                            color: '#a78bfa', whiteSpace: 'nowrap', flexShrink: 0,
                          }}>
                            {lam.a.toFixed(1)} <span style={{ opacity: 0.5, fontSize: 10 }}>×</span> {lam.b.toFixed(1)} cm
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {lam.section.toFixed(2)} cm² · {lam.weight.toFixed(1)} g
                          </div>
                        </div>

                        <div className="db-row-actions">
                          <button
                            type="button"
                            onClick={() => handleStockToggle(lam, !lam.inStock)}
                            className={`status-badge ${lam.inStock ? 'status-instock' : 'status-outstock'}`}
                          >
                            {lam.inStock
                              ? <><CheckCircle size={12} /><span>In Stock</span></>
                              : <><XCircle size={12} /><span>Out of Stock</span></>
                            }
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedLamination(lam)}
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
            );
          })}
        </div>
      )}

      {selectedLamination && (
        <LaminationDetailModal
          lamination={selectedLamination}
          onToggleStock={newStock => {
            handleStockToggle(selectedLamination, newStock);
            setSelectedLamination(prev => prev ? { ...prev, inStock: newStock } : null);
          }}
          onClose={() => setSelectedLamination(null)}
        />
      )}
    </div>
  );
};

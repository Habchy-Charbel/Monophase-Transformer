import { useState } from 'react';
import type { NavTab } from './components/Header';
import { MonophaseCalculator } from './components/MonophaseCalculator';
import { ResultSummary } from './components/ResultSummary';
import { CopperWireDatabaseView } from './components/CopperWireDatabase';
import { LaminationDatabaseView } from './components/LaminationDatabase';
import type { CalculationResult } from './types/transformer';
import { Cpu, Database, Layers } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('calculator');
  const [calcResult, setCalcResult] = useState<CalculationResult | null>(null);

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
  };

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <main className="app-main">
        {activeTab === 'calculator' && (
          <>
            {calcResult ? (
              <ResultSummary
                result={calcResult}
                onReset={() => setCalcResult(null)}
              />
            ) : (
              <MonophaseCalculator
                onCalculate={(res) => setCalcResult(res)}
              />
            )}
          </>
        )}
        {activeTab === 'wires' && <CopperWireDatabaseView />}
        {activeTab === 'laminations' && <LaminationDatabaseView />}
      </main>

      <nav className="no-print" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        display: 'flex',
        justifyContent: 'center',
        padding: '10px 16px 14px',
        background: 'rgba(10,15,30,0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
      }}>
        <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 999, padding: 4, width: '100%', maxWidth: 380 }}>
          {([
            { id: 'calculator', label: 'Calculator', icon: <Cpu size={15} /> },
            { id: 'wires',      label: 'Wire DB',    icon: <Database size={15} /> },
            { id: 'laminations',label: 'Laminations',icon: <Layers size={15} /> },
          ] as { id: NavTab; label: string; icon: React.ReactNode }[]).map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                padding: '8px 4px',
                borderRadius: 999,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                background: activeTab === tab.id
                  ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                  : 'transparent',
                color: activeTab === tab.id ? '#fff' : 'var(--text-tertiary)',
                boxShadow: activeTab === tab.id ? '0 2px 8px rgba(59,130,246,0.4)' : 'none',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.02em',
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default App;

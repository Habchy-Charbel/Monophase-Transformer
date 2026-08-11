import React, { useEffect, useRef } from 'react';
import type { CalculationResult } from '../types/transformer';
import { drawBlueprintOnCanvas } from '../utils/blueprint';
import { Download, Printer, X, FileText } from 'lucide-react';

interface BlueprintModalProps {
  result: CalculationResult;
  onClose: () => void;
}

export const BlueprintModal: React.FC<BlueprintModalProps> = ({ result, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) drawBlueprintOnCanvas(canvasRef.current, result);
  }, [result]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `Transformer_Blueprint_${result.inputVoltage}V_${result.outputVoltage}V.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div
      className="modal-backdrop"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: 860,
          maxHeight: '92dvh',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          overflow: 'hidden',
        }}
      >

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 22px', borderBottom: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <FileText size={17} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                Transformer Blueprint
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                {result.inputVoltage}V → {result.outputVoltage}V · {result.powerRating.toFixed(1)} VA
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: 34, height: 34, borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: 'rgba(255,255,255,0.07)', color: 'var(--text-secondary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
          >
            <X size={17} />
          </button>
        </div>

        <div style={{
          flex: 1, overflowY: 'auto', overflowX: 'hidden',
          padding: '18px 22px',
          display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
          background: 'rgba(0,0,0,0.25)',
        }}>
          <canvas
            ref={canvasRef}
            style={{
              maxWidth: '100%', height: 'auto',
              borderRadius: 12,
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
            }}
          />
        </div>

        <div className="no-print" style={{
          display: 'flex', justifyContent: 'flex-end', gap: 10,
          padding: '14px 22px', borderTop: '1px solid var(--border-subtle)',
        }}>
          <button onClick={handleDownload} className="ios-button ios-button-secondary" style={{ fontSize: 13 }}>
            <Download size={15} />
            Download PNG
          </button>
          <button onClick={() => window.print()} className="ios-button ios-button-primary" style={{ fontSize: 13 }}>
            <Printer size={15} />
            Print Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};

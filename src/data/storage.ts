import rawLaminations from './rawLaminations.json';
import rawCopperWires from './rawCopperWires.json';
import type { Lamination, CopperWireDatabase, TransformerGrade, CopperWire } from '../types/transformer';

const LAMINATION_STOCK_KEY = 'portable_transformer_lamination_stock';
const WIRE_STOCK_KEY = 'portable_transformer_wire_stock';

function getLaminationStockOverrides(): Record<string, boolean> {
  try {
    const saved = localStorage.getItem(LAMINATION_STOCK_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    return {};
  }
}

function getWireStockOverrides(): Record<number, boolean> {
  try {
    const saved = localStorage.getItem(WIRE_STOCK_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    return {};
  }
}

export function saveLaminationStock(a: number, b: number, inStock: boolean) {
  const overrides = getLaminationStockOverrides();
  overrides[`${a}_${b}`] = inStock;
  localStorage.setItem(LAMINATION_STOCK_KEY, JSON.stringify(overrides));
}

export function saveWireStock(diameter_mm: number, inStock: boolean) {
  const overrides = getWireStockOverrides();
  overrides[diameter_mm] = inStock;
  localStorage.setItem(WIRE_STOCK_KEY, JSON.stringify(overrides));
}

export function getLaminations(): Lamination[] {
  const overrides = getLaminationStockOverrides();
  return (rawLaminations as Lamination[]).map(item => {
    const key = `${item.a}_${item.b}`;
    return {
      ...item,
      inStock: overrides[key] !== undefined ? overrides[key] : (item.inStock ?? true)
    };
  });
}

export function getCopperWireDatabase(): CopperWireDatabase {
  const overrides = getWireStockOverrides();
  const rawDb = rawCopperWires as CopperWireDatabase;

  const processList = (list: CopperWire[]): CopperWire[] => {
    return (list || []).map(wire => ({
      ...wire,
      inStock: overrides[wire.diameter_mm] !== undefined ? overrides[wire.diameter_mm] : (wire.inStock ?? true)
    }));
  };

  return {
    COMMERCIAL: processList(rawDb.COMMERCIAL),
    MILITARY: processList(rawDb.MILITARY),
    INDUSTRIAL: processList(rawDb.INDUSTRIAL),
    MEDICAL: processList(rawDb.MEDICAL)
  };
}

export function getWiresByGrade(grade: TransformerGrade): CopperWire[] {
  const db = getCopperWireDatabase();
  return db[grade] || [];
}

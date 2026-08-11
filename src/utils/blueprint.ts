import type { CalculationResult } from '../types/transformer';

export function convertToDixieme(diameterMm: number): string {
  if (!diameterMm || isNaN(diameterMm)) return '0';
  return String(Math.round(diameterMm * 10));
}

export function formatLaminationDixieme(a: number, b: number): string {
  if (!a || !b) return '0x0';
  return `${Math.round(a * 10)}x${Math.round(b * 10)}`;
}

export function drawBlueprintOnCanvas(
  canvas: HTMLCanvasElement,
  result: CalculationResult
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = 850;
  const height = 450;
  canvas.width = width;
  canvas.height = height;

  const rootGrad = ctx.createLinearGradient(0, 0, 0, height);
  rootGrad.addColorStop(0, '#FAFBFB');
  rootGrad.addColorStop(0.5, '#F4F7FF');
  rootGrad.addColorStop(0.85, '#EAEFFC');
  ctx.fillStyle = rootGrad;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = 'rgba(28, 28, 30, 0.04)';
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  const arcX = 120;
  const arcWidth = 120;
  const arcHeight = 200;

  const topArcY = 15;
  const botArcY = 235;

  ctx.save();
  ctx.shadowColor = 'rgba(28, 28, 30, 0.15)';
  ctx.shadowBlur = 15;
  ctx.shadowOffsetY = 5;
  ctx.strokeStyle = '#1C1C1E';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  const topCenterX = arcX + arcWidth / 2;
  const topCenterY = topArcY + arcHeight / 2;
  ctx.ellipse(topCenterX, topCenterY, arcWidth / 2, arcHeight / 2, 0, 0, Math.PI);
  ctx.stroke();

  const botCenterX = arcX + arcWidth / 2;
  const botCenterY = botArcY + arcHeight / 2;
  ctx.beginPath();
  ctx.ellipse(botCenterX, botCenterY, arcWidth / 2, arcHeight / 2, 0, Math.PI, 2 * Math.PI);
  ctx.stroke();
  ctx.restore();

  const topTurnsY = topArcY + arcHeight * 0.75;
  const botTurnsY = botArcY + arcHeight * 0.25;

  ctx.save();
  ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
  ctx.shadowBlur = 1;
  ctx.shadowOffsetY = 1;
  ctx.font = 'bold 26px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
  ctx.fillStyle = '#1C1C1E';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillText(String(result.secondaryTurns), topCenterX, topTurnsY);
  ctx.fillText(String(result.primaryTurns), botCenterX, botTurnsY);
  ctx.restore();

  ctx.save();
  ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "SF Pro Text", monospace';
  ctx.fillStyle = '#1C1C1E';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  const wireLabelX = arcX + arcWidth + 30;
  const secDixieme = `Ø ${convertToDixieme(result.secondaryWireDiameter)}`;
  const priDixieme = `Ø ${convertToDixieme(result.primaryWireDiameter)}`;

  ctx.fillText(secDixieme, wireLabelX, topTurnsY);
  ctx.fillText(priDixieme, wireLabelX, botTurnsY);
  ctx.restore();

  const drawGlassCard = (
    x: number,
    y: number,
    w: number,
    h: number,
    borderRadius = 18
  ) => {
    ctx.save();
    ctx.shadowColor = 'rgba(15, 20, 70, 0.07)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 6;

    const cardGrad = ctx.createLinearGradient(x, y, x, y + h);
    cardGrad.addColorStop(0, 'rgba(255, 255, 255, 0.75)');
    cardGrad.addColorStop(1, 'rgba(215, 222, 240, 0.35)');

    ctx.fillStyle = cardGrad;

    ctx.beginPath();
    ctx.roundRect(x, y, w, h, borderRadius);
    ctx.fill();

    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  };

  const cardX = 490;
  const cardY = 25;
  const cardW = 320;
  const cardH = 160;

  drawGlassCard(cardX, cardY, cardW, cardH);

  ctx.save();
  ctx.textBaseline = 'middle';

  ctx.font = '600 14px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
  ctx.fillStyle = '#48484A';
  ctx.textAlign = 'left';
  ctx.fillText('Power Delivery', cardX + 20, cardY + 45);

  ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
  ctx.fillStyle = '#1C1C1E';
  ctx.textAlign = 'right';
  ctx.fillText(`${Math.round(result.powerRating)} VA`, cardX + cardW - 20, cardY + 45);

  ctx.strokeStyle = 'rgba(28, 28, 30, 0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cardX + 20, cardY + 80);
  ctx.lineTo(cardX + cardW - 20, cardY + 80);
  ctx.stroke();

  ctx.font = '600 14px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
  ctx.fillStyle = '#48484A';
  ctx.textAlign = 'left';
  ctx.fillText('In / Out Voltage', cardX + 20, cardY + 115);

  ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
  ctx.fillStyle = '#1C1C1E';
  ctx.textAlign = 'right';
  ctx.fillText(
    `${Math.round(result.inputVoltage)} V / ${Math.round(result.outputVoltage)} V`,
    cardX + cardW - 20,
    cardY + 115
  );
  ctx.restore();

  const lamX = 490;
  const lamY = 210;
  const lamW = 320;
  const lamH = 100;

  drawGlassCard(lamX, lamY, lamW, lamH);

  ctx.save();
  ctx.textBaseline = 'middle';

  ctx.font = '600 14px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
  ctx.fillStyle = '#48484A';
  ctx.textAlign = 'left';
  ctx.fillText('Lamination Core', lamX + 20, lamY + 50);

  ctx.font = '800 20px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
  ctx.fillStyle = '#1C1C1E';
  ctx.textAlign = 'right';
  ctx.fillText(
    formatLaminationDixieme(result.a, result.b),
    lamX + lamW - 20,
    lamY + 50
  );
  ctx.restore();
}

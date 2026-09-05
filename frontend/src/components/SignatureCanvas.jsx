import { useRef, useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function SignatureCanvas({ signatureDataUrl, onSignatureChange }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (signatureDataUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        setHasSignature(true);
      };
      img.src = signatureDataUrl;
    }
  }, [signatureDataUrl]);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : (e.changedTouches ? e.changedTouches[0] : e);
    const clientX = touch.clientX;
    const clientY = touch.clientY;
    const scaleX = canvas.width / (rect.width || 1);
    const scaleY = canvas.height / (rect.height || 1);
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e) => {
    if (e.cancelable) e.preventDefault();
    const pos = getPos(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setIsDrawing(true);
    setHasSignature(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    if (e.cancelable) e.preventDefault();
    const pos = getPos(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const endDraw = (e) => {
    if (isDrawing) {
      if (e && e.cancelable) e.preventDefault();
      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL('image/png');
      onSignatureChange(dataUrl);
    }
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onSignatureChange('');
  };

  return (
    <div className="space-y-1.5 w-full">
      <div className="relative border rounded-xl overflow-hidden bg-white shadow-2xs border-slate-300 w-full">
        <canvas
          ref={canvasRef}
          width={500}
          height={160}
          style={{ touchAction: 'none' }}
          className={`w-full max-w-full bg-slate-50/40 cursor-crosshair signature-canvas block ${!hasSignature ? 'border-dashed border-2 border-transparent' : ''}`}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
        {hasSignature ? (
          <button
            type="button"
            onClick={clearSignature}
            className="absolute top-2.5 right-2.5 bg-white/90 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-lg px-2 py-1 text-[11px] font-semibold transition flex items-center gap-1 shadow-2xs cursor-pointer"
          >
            <X size={12} /> Clear
          </button>
        ) : (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-400 text-xs font-medium text-center px-4">
            Sign here using your mouse, trackpad, or finger
          </div>
        )}
      </div>
      <p className="text-[11px] text-slate-400">Your digital signature validates this intake submission.</p>
    </div>
  );
}
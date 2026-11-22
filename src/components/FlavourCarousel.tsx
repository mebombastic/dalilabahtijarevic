import { useEffect, useRef, useState } from "react";

export type FlavourTin = { src: string; name: string; color: string; /** height relative to a shake tin */ scale?: number };

const TAU = Math.PI * 2;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeOutBack = (t: number) => {
  const c1 = 1.5, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

/**
 * 3D ring of shake tins.
 * Intro: the ring spins in while each tin drops onto it, one after another.
 * Then it steps to the next flavour every few seconds; drag / swipe to spin,
 * tap a tin to bring it to the front. Tins lean with the spin speed.
 */
export const FlavourCarousel = ({ tins, startDelay = 0.3 }: { tins: FlavourTin[]; startDelay?: number }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const tinRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [front, setFront] = useState(0);
  const ctrl = useRef({ angle: TAU * 1.25, vel: 0, target: 0, dragging: false, lastX: 0, lastInteract: -1e9, frontIdx: -1, jump: (_i: number) => {} });

  useEffect(() => {
    const n = tins.length;
    const step = TAU / n;
    const c = ctrl.current;
    const t0 = performance.now() + startDelay * 1000;
    const INTRO = 2.9; // seconds of spin-in
    const DROP = 0.75; // seconds per tin drop
    const STAGGER = 0.17;
    const AUTOPLAY = 3.2;
    let last = performance.now();
    let nextStep = INTRO + AUTOPLAY;
    let raf = 0;

    c.jump = (i: number) => {
      // shortest way to bring tin i to the front
      const k = Math.round(-c.target / step);
      let d = (i - (((k % n) + n) % n)) % n;
      if (d > n / 2) d -= n;
      if (d < -n / 2) d += n;
      c.target = -(k + d) * step;
      c.lastInteract = (performance.now() - t0) / 1000;
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const wrap = wrapRef.current;
      if (!wrap) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = (now - t0) / 1000;

      // autoplay: step to the next flavour unless the user touched it recently
      if (!c.dragging && t > nextStep && t - c.lastInteract > 5) {
        c.target -= step;
        nextStep = t + AUTOPLAY;
      }
      if (!c.dragging) {
        const prev = c.angle;
        const speed = t < INTRO ? 1.7 : 4.5;
        c.angle += (c.target - c.angle) * (1 - Math.exp(-dt * speed));
        c.vel = (c.angle - prev) / Math.max(dt, 1e-3);
      }

      const W = wrap.clientWidth;
      const H = wrap.clientHeight;
      const R = Math.min(W * (n > 8 ? 0.44 : 0.4), 470);
      const tilt = clamp(-c.vel * 4, -14, 14);
      let best = -2, bestI = 0;

      for (let i = 0; i < n; i++) {
        const el = tinRefs.current[i];
        if (!el) continue;
        const theta = c.angle + i * step;
        const sx = Math.sin(theta);
        const cz = Math.cos(theta); // 1 = front, -1 = back
        const depth = (cz + 1) / 2;
        if (cz > best) { best = cz; bestI = i; }

        const p = clamp((t - i * STAGGER) / DROP);
        const land = p <= 0 ? 0 : easeOutBack(p);
        const dropY = (1 - land) * -H * 1.1;
        const spin = (1 - clamp(p * 1.4)) * (i % 2 ? 1 : -1) * 35;

        const x = sx * R;
        const y = (1 - depth) * -H * 0.1 + dropY;
        const scale = 0.5 + 0.5 * Math.pow(depth, 1.4);
        el.style.transform = `translate3d(calc(-50% + ${x.toFixed(1)}px), ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)}) rotate(${(tilt * depth + spin).toFixed(2)}deg)`;
        el.style.zIndex = String(100 + Math.round(cz * 50));
        el.style.opacity = String(clamp(p * 4));
        el.style.filter = `brightness(${(0.42 + 0.58 * depth).toFixed(3)}) blur(${((1 - depth) * 1.6).toFixed(2)}px)`;
      }
      if (bestI !== c.frontIdx) { c.frontIdx = bestI; setFront(bestI); }
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [tins.length, startDelay]);

  // drag / swipe
  const onDown = (e: React.PointerEvent) => {
    const c = ctrl.current;
    c.dragging = true;
    c.lastX = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    const c = ctrl.current;
    if (!c.dragging || !wrapRef.current) return;
    const dx = e.clientX - c.lastX;
    c.lastX = e.clientX;
    const R = Math.min(wrapRef.current.clientWidth * 0.4, 430);
    c.angle += dx / R;
    c.vel = dx / R / 0.016;
  };
  const onUp = () => {
    const c = ctrl.current;
    if (!c.dragging) return;
    c.dragging = false;
    const step = TAU / tins.length;
    c.target = Math.round((c.angle + c.vel * 0.12) / step) * step;
    c.lastInteract = Infinity;
    setTimeout(() => { c.lastInteract = -1e9; }, 5000);
  };

  return (
    <div className="absolute inset-0 select-none">
      {/* floor glow */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[34px] md:bottom-[40px] w-[88%] h-[18%] rounded-[50%] bg-[radial-gradient(closest-side,hsl(var(--gold)/0.35),transparent)] blur-md" />
      <div
        ref={wrapRef}
        className="absolute inset-x-0 top-0 bottom-[40px] md:bottom-[48px] cursor-grab active:cursor-grabbing"
        style={{ touchAction: "pan-y" }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        {tins.map((tin, i) => (
          <div
            key={tin.name}
            ref={(el) => (tinRefs.current[i] = el)}
            className="absolute left-1/2 bottom-0 origin-bottom will-change-transform"
            style={{ opacity: 0, height: `${78 * (tin.scale ?? 1)}%` }}
            onClick={() => ctrl.current.jump(i)}
          >
            <img src={tin.src} alt={tin.name} draggable={false} className="h-full w-auto max-w-none drop-shadow-[0_26px_22px_rgba(0,0,0,0.55)] pointer-events-none" />
          </div>
        ))}
      </div>

      {/* front flavour name */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center z-[200] pointer-events-none">
        <div
          key={front}
          className="animate-blur-up inline-flex items-center gap-2 rounded-full bg-[hsl(40_33%_90%/0.08)] backdrop-blur-md border border-[hsl(var(--gold)/0.35)] px-4 py-1.5 font-body text-[10px] md:text-xs tracking-luxe uppercase"
          style={{ animationDuration: "0.6s" }}
        >
          <span className="h-2 w-2 rounded-full" style={{ background: tins[front].color, boxShadow: `0 0 10px ${tins[front].color}` }} />
          {tins[front].name}
        </div>
      </div>
    </div>
  );
};

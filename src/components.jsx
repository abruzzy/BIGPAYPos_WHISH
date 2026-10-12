/* global React */
const { createElement: h } = React;

/* ============================================================
   ICONS — clean 24px stroke set (currentColor)
   ============================================================ */
const S = (p) => ({ fill: 'none', stroke: 'currentColor', strokeWidth: p || 1.9, strokeLinecap: 'round', strokeLinejoin: 'round' });
function Svg(props) {
  const { children, vb, sw, ...rest } = props;
  return h('svg', { viewBox: vb || '0 0 24 24', ...S(sw), ...rest }, children);
}

const Icon = {
  contactless: (p) => h(Svg, p, [
    h('path', { key: 1, d: 'M8.5 7a8 8 0 0 1 0 10' }),
    h('path', { key: 2, d: 'M12 4.5a12 12 0 0 1 0 15' }),
    h('path', { key: 3, d: 'M15.5 2.5a16 16 0 0 1 0 19' }),
  ]),
  chip: (p) => h(Svg, p, [
    h('rect', { key: 1, x: 4, y: 6, width: 16, height: 12, rx: 2.5 }),
    h('path', { key: 2, d: 'M9 6v12M15 6v12M4 10h5M15 10h5M4 14h5M15 14h5' }),
  ]),
  swipe: (p) => h(Svg, p, [
    h('rect', { key: 1, x: 3, y: 5, width: 18, height: 14, rx: 2.5 }),
    h('path', { key: 2, d: 'M3 9h18' }),
    h('path', { key: 3, d: 'M7 14h5' }),
  ]),
  wallet: (p) => h(Svg, p, [
    h('rect', { key: 1, x: 3, y: 6, width: 18, height: 13, rx: 3 }),
    h('path', { key: 2, d: 'M3 10h18' }),
    h('circle', { key: 3, cx: 16.5, cy: 14.5, r: 1.3, fill: 'currentColor', stroke: 'none' }),
  ]),
  phone: (p) => h(Svg, p, [
    h('rect', { key: 1, x: 7, y: 2.5, width: 10, height: 19, rx: 2.6 }),
    h('path', { key: 2, d: 'M11 18.5h2' }),
  ]),
  qr: (p) => h(Svg, p, [
    h('rect', { key: 1, x: 3.5, y: 3.5, width: 6, height: 6, rx: 1 }),
    h('rect', { key: 2, x: 14.5, y: 3.5, width: 6, height: 6, rx: 1 }),
    h('rect', { key: 3, x: 3.5, y: 14.5, width: 6, height: 6, rx: 1 }),
    h('path', { key: 4, d: 'M14.5 14.5h2.5v2.5M20.5 14.5v6M14.5 20.5h2.5M20.5 20.5h0' }),
  ]),
  crypto: (p) => h(Svg, p, [
    h('circle', { key: 1, cx: 12, cy: 12, r: 9 }),
    h('path', { key: 2, d: 'M9.5 8h4a2 2 0 0 1 0 4h-4zM9.5 12h4.3a2 2 0 0 1 0 4H9.5zM9.5 8v8M11 6.3V8M11 16v1.7M13 6.3V8M13 16v1.7' }),
  ]),
  check: (p) => h(Svg, { ...p, className: 'draw' }, h('path', { d: 'M5 12.5l4.5 4.5L19 7' })),
  x: (p) => h(Svg, { ...p, className: 'draw' }, [
    h('line', { key: 1, x1: 7, y1: 7, x2: 17, y2: 17 }),
    h('line', { key: 2, x1: 17, y1: 7, x2: 7, y2: 17 }),
  ]),
  backspace: (p) => h(Svg, p, [
    h('path', { key: 1, d: 'M8 5h11a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8l-5-7z' }),
    h('path', { key: 2, d: 'M15 9.5l-4 5M11 9.5l4 5' }),
  ]),
  shift: (p) => h(Svg, p, [
    h('path', { key: 1, d: 'M12 3l8 9h-4.5v6h-7v-6H4z' }),
  ]),
  back: (p) => h(Svg, p, h('path', { d: 'M15 5l-7 7 7 7' })),
  chev: (p) => h(Svg, p, h('path', { d: 'M9 5l7 7-7 7' })),
  landmark: (p) => h(Svg, p, [
    h('path', { key: 1, d: 'M3 10l9-6 9 6H3z' }),
    h('path', { key: 2, d: 'M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 18h18M3 21h18' }),
  ]),
  grad: (p) => h(Svg, p, [
    h('path', { key: 1, d: 'M2 9l10-5 10 5-10 5z' }),
    h('path', { key: 2, d: 'M6 11.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5M22 9v5' }),
  ]),
  antenna: (p) => h(Svg, p, [
    h('circle', { key: 1, cx: 12, cy: 10, r: 2.2 }),
    h('path', { key: 2, d: 'M12 12.5V21M7.8 5.8a6 6 0 0 0 0 8.4M16.2 5.8a6 6 0 0 1 0 8.4M4.9 3a10 10 0 0 0 0 14M19.1 3a10 10 0 0 1 0 14' }),
  ]),
  bag: (p) => h(Svg, p, [
    h('path', { key: 1, d: 'M5 8h14l-1 12H6z' }),
    h('path', { key: 2, d: 'M9 11V7a3 3 0 0 1 6 0v4' }),
  ]),
  pencil: (p) => h(Svg, p, [
    h('path', { key: 1, d: 'M14.5 5.5l4 4L8 20l-4.5 1L4.5 16.5z' }),
    h('path', { key: 2, d: 'M13 7l4 4' }),
  ]),
  plus: (p) => h(Svg, p, h('path', { d: 'M12 5v14M5 12h14' })),
  settings: (p) => h(Svg, p, [
    h('circle', { key: 1, cx: 12, cy: 12, r: 3 }),
    h('path', { key: 2, d: 'M12 2.5v2.5M12 19v2.5M21.5 12H19M5 12H2.5M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8M18.7 18.7l-1.8-1.8M7.1 7.1L5.3 5.3' }),
  ]),
  refund: (p) => h(Svg, p, [
    h('path', { key: 1, d: 'M4 9a8 8 0 1 1-1.5 5' }),
    h('path', { key: 2, d: 'M2.5 5v4.5H7' }),
  ]),
  receipt: (p) => h(Svg, p, [
    h('path', { key: 1, d: 'M6 3h12v18l-2.2-1.4L13.5 21l-1.5-1.4L10.5 21l-2.3-1.4L6 21z' }),
    h('path', { key: 2, d: 'M9 8h6M9 12h6' }),
  ]),
  printer: (p) => h(Svg, p, [
    h('path', { key: 1, d: 'M7 9V3h10v6' }),
    h('path', { key: 2, d: 'M7 18H5a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2' }),
    h('rect', { key: 3, x: 7, y: 15, width: 10, height: 6, rx: 1 }),
  ]),
  mail: (p) => h(Svg, p, [
    h('rect', { key: 1, x: 3, y: 5, width: 18, height: 14, rx: 2.5 }),
    h('path', { key: 2, d: 'M4 7l8 6 8-6' }),
  ]),
  sms: (p) => h(Svg, p, h('path', { d: 'M21 11.5a8.5 8 0 0 1-12 7.3L3 20.5l1.8-4.5A8 8 0 1 1 21 11.5z' })),
  cash: (p) => h(Svg, p, [
    h('rect', { key: 1, x: 2.5, y: 6, width: 19, height: 12, rx: 2 }),
    h('circle', { key: 2, cx: 12, cy: 12, r: 2.6 }),
    h('path', { key: 3, d: 'M6 9v6M18 9v6' }),
  ]),
  lock: (p) => h(Svg, p, [
    h('rect', { key: 1, x: 5, y: 10, width: 14, height: 10, rx: 2.5 }),
    h('path', { key: 2, d: 'M8 10V7a4 4 0 0 1 8 0v3' }),
  ]),
  history: (p) => h(Svg, p, [
    h('path', { key: 1, d: 'M3.5 12a8.5 8.5 0 1 0 2.6-6.1' }),
    h('path', { key: 2, d: 'M3 4v3.5h3.5' }),
    h('path', { key: 3, d: 'M12 8v4l3 2' }),
  ]),
  shield: (p) => h(Svg, p, [
    h('path', { key: 1, d: 'M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z' }),
    h('path', { key: 2, d: 'M9 12l2 2 4-4' }),
  ]),
  bag: (p) => h(Svg, p, [
    h('path', { key: 1, d: 'M5 8h14l-1 12H6z' }),
    h('path', { key: 2, d: 'M8.5 8V6a3.5 3.5 0 0 1 7 0v2' }),
  ]),
  wifi: (p) => h(Svg, { ...p, sw: 1.8 }, [
    h('path', { key: 1, d: 'M2 8.5a15 15 0 0 1 20 0' }),
    h('path', { key: 2, d: 'M5 12a10.5 10.5 0 0 1 14 0' }),
    h('path', { key: 3, d: 'M8 15.3a6 6 0 0 1 8 0' }),
    h('circle', { key: 4, cx: 12, cy: 19, r: 1, fill: 'currentColor', stroke: 'none' }),
  ]),
  signal: (p) => h('svg', { viewBox: '0 0 24 24', ...p }, [
    h('rect', { key: 1, x: 2, y: 14, width: 3.5, height: 6, rx: 1, fill: 'currentColor' }),
    h('rect', { key: 2, x: 7, y: 10, width: 3.5, height: 10, rx: 1, fill: 'currentColor' }),
    h('rect', { key: 3, x: 12, y: 6, width: 3.5, height: 14, rx: 1, fill: 'currentColor' }),
    h('rect', { key: 4, x: 17, y: 2, width: 3.5, height: 18, rx: 1, fill: 'currentColor', opacity: 0.35 }),
  ]),
  user: (p) => h(Svg, p, [
    h('circle', { key: 1, cx: 12, cy: 8, r: 3.5 }),
    h('path', { key: 2, d: 'M5 20a7 7 0 0 1 14 0' }),
  ]),
  void: (p) => h(Svg, p, [
    h('circle', { key: 1, cx: 12, cy: 12, r: 9 }),
    h('path', { key: 2, d: 'M5.6 5.6l12.8 12.8' }),
  ]),
  settle: (p) => h(Svg, p, [
    h('path', { key: 1, d: 'M3 7h18M3 7l3-3M3 7l3 3' }),
    h('path', { key: 2, d: 'M21 17H3m18 0l-3-3m3 3l-3 3' }),
  ]),
  adjust: (p) => h(Svg, p, [
    h('path', { key: 1, d: 'M4 7h10M18 7h2M4 17h2M10 17h10' }),
    h('circle', { key: 2, cx: 16, cy: 7, r: 2.4 }),
    h('circle', { key: 3, cx: 8, cy: 17, r: 2.4 }),
  ]),
  reports: (p) => h(Svg, p, [
    h('path', { key: 1, d: 'M4 20V10M10 20V4M16 20v-7M22 20H2' }),
  ]),
  scan: (p) => h(Svg, p, [
    h('path', { key: 1, d: 'M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2' }),
    h('path', { key: 2, d: 'M4 12h16', opacity: 0.9 }),
  ]),
  globe: (p) => h(Svg, p, [
    h('circle', { key: 1, cx: 12, cy: 12, r: 9 }),
    h('path', { key: 2, d: 'M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18' }),
  ]),
  home: (p) => h(Svg, p, [
    h('path', { key: 1, d: 'M4 11l8-6.5L20 11' }),
    h('path', { key: 2, d: 'M6 9.5V19h12V9.5' }),
    h('path', { key: 3, d: 'M10 19v-5h4v5' }),
  ]),
  eye: (p) => h(Svg, p, [
    h('path', { key: 1, d: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z' }),
    h('circle', { key: 2, cx: 12, cy: 12, r: 3 }),
  ]),
  eyeOff: (p) => h(Svg, p, [
    h('path', { key: 1, d: 'M10.6 6.2A10.8 10.8 0 0 1 12 5c6.4 0 10 7 10 7a18 18 0 0 1-3.2 4M6.6 6.6A18 18 0 0 0 2 12s3.6 7 10 7a10.6 10.6 0 0 0 4.6-1' }),
    h('path', { key: 2, d: 'M9.9 9.9a3 3 0 0 0 4.2 4.2' }),
    h('line', { key: 3, x1: 3, y1: 3, x2: 21, y2: 21 }),
  ]),
  sun: (p) => h(Svg, p, [
    h('circle', { key: 1, cx: 12, cy: 12, r: 4 }),
    h('path', { key: 2, d: 'M12 2.5v2.4M12 19.1v2.4M21.5 12h-2.4M4.9 12H2.5M18.4 5.6l-1.7 1.7M7.3 16.7l-1.7 1.7M18.4 18.4l-1.7-1.7M7.3 7.3 5.6 5.6' }),
  ]),
  moon: (p) => h(Svg, p, h('path', { d: 'M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8z' })),
  clock: (p) => h(Svg, p, [
    h('circle', { key: 1, cx: 12, cy: 12, r: 9 }),
    h('path', { key: 2, d: 'M12 7.5V12l3 2' }),
  ]),
  tip: (p) => h(Svg, p, [
    h('circle', { key: 1, cx: 12, cy: 12, r: 8.5 }),
    h('path', { key: 2, d: 'M12 7.2c-1.4 0-2.4.8-2.4 2 0 2.6 4.8 1.6 4.8 4.1 0 1.2-1 2-2.4 2s-2.5-.8-2.5-2' }),
    h('path', { key: 3, d: 'M12 6v1.2M12 17.3V18.5' }),
  ]),
  volume: (p) => h(Svg, p, [
    h('path', { key: 1, d: 'M4 9v6h3.5L13 19V5L7.5 9H4z' }),
    h('path', { key: 2, d: 'M16.5 9a4 4 0 0 1 0 6M19 6.5a7.5 7.5 0 0 1 0 11' }),
  ]),
  download: (p) => h(Svg, p, [
    h('path', { key: 1, d: 'M12 3v12' }),
    h('path', { key: 2, d: 'M7.5 10.5L12 15l4.5-4.5' }),
    h('path', { key: 3, d: 'M4 20h16' }),
  ]),
  key: (p) => h(Svg, p, [
    h('circle', { key: 1, cx: 8, cy: 8, r: 4 }),
    h('path', { key: 2, d: 'M11 11l9 9M17 17l2-2M15 19l2-2' }),
  ]),
  sliders: (p) => h(Svg, p, [
    h('path', { key: 1, d: 'M5 5v6M5 15v4M12 5v3M12 12v7M19 5v8M19 17v2' }),
    h('circle', { key: 2, cx: 5, cy: 13, r: 2, fill: 'currentColor', stroke: 'none' }),
    h('circle', { key: 3, cx: 12, cy: 10, r: 2, fill: 'currentColor', stroke: 'none' }),
    h('circle', { key: 4, cx: 19, cy: 15, r: 2, fill: 'currentColor', stroke: 'none' }),
  ]),
  info: (p) => h(Svg, p, [
    h('circle', { key: 1, cx: 12, cy: 12, r: 9 }),
    h('path', { key: 2, d: 'M12 11v5' }),
    h('circle', { key: 3, cx: 12, cy: 7.6, r: 1, fill: 'currentColor', stroke: 'none' }),
  ]),
  link: (p) => h(Svg, p, [
    h('path', { key: 1, d: 'M9 15l6-6' }),
    h('path', { key: 2, d: 'M11 7l1-1a3.5 3.5 0 0 1 5 5l-1 1' }),
    h('path', { key: 3, d: 'M13 17l-1 1a3.5 3.5 0 0 1-5-5l1-1' }),
  ]),
  users: (p) => h(Svg, p, [
    h('circle', { key: 1, cx: 9, cy: 8, r: 3.2 }),
    h('path', { key: 2, d: 'M3.5 19a5.5 5.5 0 0 1 11 0' }),
    h('path', { key: 3, d: 'M16 5.2a3.2 3.2 0 0 1 0 5.6M16.5 13.4A5.5 5.5 0 0 1 20.5 19' }),
  ]),
};

/* image-based icons (tinted blue via CSS mask, from uploaded artwork) */
function maskIcon(key) {
  return (p) => {
    const uri = window[key];
    const st = Object.assign({
      display: 'inline-block', width: 24, height: 24, background: 'currentColor',
      WebkitMaskImage: `url("${uri}")`, maskImage: `url("${uri}")`,
      WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
      WebkitMaskPosition: 'center', maskPosition: 'center',
      WebkitMaskSize: 'contain', maskSize: 'contain',
    }, (p && p.style) || {});
    return h('span', { style: st });
  };
}
Icon.settings = maskIcon('BP_GEAR');
Icon.reports = maskIcon('BP_DOC');
Icon.tip = maskIcon('BP_TIP');
Icon.cash = maskIcon('BP_CASH');

/* ============================================================
   STATUS BAR
   ============================================================ */
function StatusBar({ merchant, battery = 86, onBattery }) {
  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(id);
  }, []);
  const t = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  const low = battery <= 25;
  const fillW = Math.max(1, Math.round(15 * battery / 100));
  return h('div', { className: 'statusbar' }, [
    h('span', { key: 1, className: 'sb-time' }, t),
    h('div', { key: 2, className: 'sb-right' }, [
      h(Icon.signal, { key: 1, style: { width: 15, height: 15 } }),
      h(Icon.wifi, { key: 2, style: { width: 16, height: 16 } }),
      h('button', { key: 3, className: 'sb-batt', title: 'Toggle battery (demo)', 'aria-label': 'Toggle battery level', onClick: onBattery, style: Object.assign({ background: 'none', border: 0, padding: '2px 4px', margin: '-2px -4px', borderRadius: 6, cursor: onBattery ? 'pointer' : 'default', font: 'inherit' }, low ? { color: 'var(--red)' } : {}) }, [
        h('span', { key: 'p', className: 'pct' }, battery + '%'),
        h('svg', { key: 's', width: 24, height: 13, viewBox: '0 0 24 13' }, [
          h('rect', { key: 1, x: 0.5, y: 0.5, width: 20, height: 12, rx: 3, fill: 'none', stroke: 'currentColor', strokeWidth: 1.3, opacity: 0.5 }),
          h('rect', { key: 2, x: 2, y: 2, width: fillW, height: 9, rx: 1.5, fill: 'currentColor' }),
          h('rect', { key: 3, x: 21.5, y: 4, width: 2, height: 5, rx: 1, fill: 'currentColor', opacity: 0.5 }),
        ]),
      ]),
    ]),
  ]);
}

/* ============================================================
   BRAND MARK — wordmark lockup (BIG navy/white + PAY blue)
   + abstract tile icon (nod to logo, not a copy)
   ============================================================ */
function BrandTile({ size = 34 }) {
  // rounded tile with two offset "flag" shapes echoing the logo geometry
  const r = size * 0.28;
  return h('div', {
    style: {
      width: size, height: size, borderRadius: r, position: 'relative',
      background: 'linear-gradient(150deg, var(--navy), #16264d)', flexShrink: 0,
      overflow: 'hidden', boxShadow: '0 4px 14px -4px rgba(24,164,232,0.5)',
    },
  }, [
    h('div', { key: 1, style: {
      position: 'absolute', left: '26%', top: '16%', width: '20%', height: '60%',
      background: '#fff', borderRadius: size * 0.08, transform: 'skewX(-9deg)',
    } }),
    h('div', { key: 2, style: {
      position: 'absolute', left: '46%', top: '30%', width: '30%', height: '40%',
      background: 'var(--blue)', borderRadius: size * 0.08, transform: 'skewX(-9deg)',
    } }),
  ]);
}
function Wordmark({ size = 18, light }) {
  return h('span', { style: { fontWeight: 800, fontSize: size, letterSpacing: '0.01em', whiteSpace: 'nowrap' } }, [
    h('span', { key: 1, style: { color: light ? '#fff' : 'var(--text)' } }, 'BIG'),
    h('span', { key: 2, style: { color: 'var(--blue-2)' } }, 'PAY'),
  ]);
}
function BrandLockup({ size = 34, word = 17 }) {
  return h('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } }, [
    h(BrandTile, { key: 1, size }),
    h(Wordmark, { key: 2, size: word }),
  ]);
}

/* ============================================================
   CURRENCY — dual USD / LBP
   ============================================================ */
const LBP_RATE = 89500;
function fmtUSD(cents) {
  return (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtLBP(cents) {
  const lbp = Math.round((cents / 100) * LBP_RATE);
  return lbp.toLocaleString('en-US');
}
/* currency-aware money — `units` is cents for USD, whole pounds for LBP */
function fmtMoney(units, currency) {
  if (currency === 'LBP') return Math.round(units).toLocaleString('en-US');
  return (units / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
/* convert a flow amount (in its own currency units) to USD cents — used by crypto/QR */
function toUSDcents(units, currency) {
  if (currency === 'LBP') return Math.round(units * 100 / LBP_RATE);
  return units;
}
/* single-currency amount display (no auto-conversion) */
function AmountDisplay({ units, currency = 'USD', size = 64, label }) {
  const isLbp = currency === 'LBP';
  return h('div', { className: 'amount-block' }, [
    label && h('div', { key: 0, className: 'amount-label', style: { marginBottom: 14 } }, label),
    h('div', { key: 1, className: 'amount-main', style: { fontSize: size } },
      isLbp
        ? [ fmtMoney(units, 'LBP'), h('span', { key: 'c', className: 'cur', style: { fontSize: size * 0.4, marginLeft: 10 } }, 'LBP') ]
        : [ h('span', { key: 'c', className: 'cur', style: { fontSize: size * 0.5 } }, '$'), fmtMoney(units, 'USD') ]
    ),
  ]);
}

/* ============================================================
   KEYPAD (amount entry — cents based)
   ============================================================ */
function MerchantKeypad({ onKey, triple }) {
  const last = triple ? ['00', '0', '000'] : ['00', '0', 'del'];
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', ...last];
  return h('div', { className: 'keypad' }, keys.map((k) =>
    h('button', {
      key: k, className: 'key' + (k === '00' || k === '000' ? ' sub' : ''), onClick: () => onKey(k),
    }, k === 'del' ? h(Icon.backspace, {}) : k)
  ));
}

/* expose */
Object.assign(window, {
  h, Icon, StatusBar, BrandTile, Wordmark, BrandLockup,
  AmountDisplay, MerchantKeypad, fmtUSD, fmtLBP, fmtMoney, toUSDcents, LBP_RATE,
});

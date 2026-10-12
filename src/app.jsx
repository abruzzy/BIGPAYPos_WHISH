/* global React, ReactDOM, StatusBar, HomeScreen, AmountScreen, MethodScreen,
   QRScreen, CryptoScreen, PinScreen, ManagerPinScreen, ChangePinScreen, SettlementScreen, ScreensaverScreen, ProcessingScreen, ResultScreen, ReceiptScreen,
   ReceiptEntryScreen, ThanksScreen, ReportsScreen, SettingsScreen, RefundListScreen, RefundConfirmScreen,
   TXNS, fmtMoney, toUSDcents, useTweaks, TweaksPanel, TweakSection, TweakSlider, TweakToggle, TweakColor, TweakText */

const { useState, useEffect, useRef, useCallback } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "merchant": "Breidy Naturals",
  "accent": ["#18a4e8", "#4cc0f7"],
  "roundness": 22,
  "speed": 1,
  "dark": false,
  "decline": false,
  "lowBattery": true
}/*EDITMODE-END*/;

/* ---- render a screen body by name ---- */
function ScreenBody({ name, ctx }) {
  switch (name) {
    case 'home': return <HomeScreen ctx={ctx} />;
    case 'category': return <CategoryScreen ctx={ctx} />;
    case 'amount': return <AmountScreen ctx={ctx} />;
    case 'method': return <MethodScreen ctx={ctx} />;
    case 'qr': return <QRScreen ctx={ctx} />;
    case 'crypto': return <CryptoScreen ctx={ctx} />;
    case 'pin': return <PinScreen ctx={ctx} />;
    case 'managerPin': return <ManagerPinScreen ctx={ctx} />;
    case 'changePin': return <ChangePinScreen ctx={ctx} />;
    case 'settlement': return <SettlementScreen ctx={ctx} />;
    case 'screensaver': return <ScreensaverScreen ctx={ctx} />;
    case 'processing':
    case 'refundProcessing': return <ProcessingScreen ctx={ctx} />;
    case 'result': return <ResultScreen ctx={ctx} />;
    case 'receipt': return <ReceiptScreen ctx={ctx} />;
    case 'receiptEntry': return <ReceiptEntryScreen ctx={ctx} />;
    case 'receiptQR': return <ReceiptQRScreen ctx={ctx} />;
    case 'thanks': return <ThanksScreen ctx={ctx} />;
    case 'reports': return <ReportsScreen ctx={ctx} />;
    case 'settings': return <SettingsScreen ctx={ctx} />;
    case 'merchantProfile': return <MerchantProfileScreen ctx={ctx} />;
    case 'connectivity': return <ConnectivityScreen ctx={ctx} />;
    case 'cellular': return <CellularScreen ctx={ctx} />;
    case 'wifiDetail': return <WifiDetailScreen ctx={ctx} />;
    case 'datetime': return <DateTimeScreen ctx={ctx} />;
    case 'display': return <DisplaySoundScreen ctx={ctx} />;
    case 'cardReaders': return <CardReadersScreen ctx={ctx} />;
    case 'language': return <LanguageScreen ctx={ctx} />;
    case 'cryptoSettings': return <CryptoSettingsScreen ctx={ctx} />;
    case 'batchSettings': return <BatchSettingsScreen ctx={ctx} />;
    case 'systemSettings': return <SystemSettingsScreen ctx={ctx} />;
    case 'sysTerminal': return <TerminalParamScreen ctx={ctx} />;
    case 'sysComm': return <CommunicationParamScreen ctx={ctx} />;
    case 'sysTxn': return <TransactionMgmtScreen ctx={ctx} />;
    case 'sysOther': return <OtherSettingsScreen ctx={ctx} />;
    case 'sysOperator': return <OperatorMgmtScreen ctx={ctx} />;
    case 'tellerMgmt': return <TellerMgmtScreen ctx={ctx} />;
    case 'supervisorChange': return <SupervisorChangeScreen ctx={ctx} />;
    case 'sysAbout': return <AboutScreen ctx={ctx} />;
    case 'exitGate': return <ExitGateScreen ctx={ctx} />;
    case 'androidHome': return <AndroidHomeScreen ctx={ctx} />;
    case 'refundList': return <RefundListScreen ctx={ctx} />;
    case 'refundConfirm': return <RefundConfirmScreen ctx={ctx} />;
    default: return <HomeScreen ctx={ctx} />;
  }
}

const SETTINGS_SCREENS = new Set([
  'settings', 'merchantProfile', 'connectivity', 'cellular', 'wifiDetail', 'datetime', 'display',
  'cardReaders', 'language', 'cryptoSettings', 'batchSettings', 'systemSettings',
  'sysTerminal', 'sysComm', 'sysTxn', 'sysOther', 'sysOperator', 'sysAbout',
  'tellerMgmt', 'supervisorChange',
]);

function SettingsFooter() {
  return (
    <div className="set-foot">
      <img className="l-dark" src={window.BP_WORD_DARK} alt="Big Pay" />
      <img className="l-light" src={window.BP_WORD} alt="Big Pay" />
      <div className="set-foot-sub">POS OS v3.2.1 · Terminal #BP-4471</div>
    </div>
  );
}

/* low-battery popup — shown on the home screen at ≤25% until dismissed */
function LowBatteryPopup({ battery, onClose }) {
  return (
    <div className="popup-back" onClick={onClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-ic">
          <svg width="46" height="26" viewBox="0 0 46 26">
            <rect x="1" y="1" width="39" height="24" rx="6" fill="none" stroke="currentColor" strokeWidth="2.2" />
            <rect x="4.5" y="4.5" width={Math.max(2, Math.round(32 * battery / 100))} height="17" rx="3" fill="currentColor" />
            <rect x="42" y="8" width="3.5" height="10" rx="1.5" fill="currentColor" opacity="0.6" />
          </svg>
        </div>
        <div className="popup-title">Low Battery</div>
        <div className="popup-pct num">{battery}%</div>
        <div className="popup-sub">Please Connect Charger</div>
        <button className="btn btn-primary btn-lg" style={{ width: '100%', fontSize: 24, fontWeight: 750 }} onClick={onClose}>OK</button>
      </div>
    </div>
  );
}

function Device({ name, ctx }) {
  const showNav = name !== 'screensaver' && name !== 'androidHome';
  const [battDismissed, setBattDismissed] = useState(false);
  useEffect(() => { setBattDismissed(false); }, [ctx.battery]);
  const showBatt = name === 'home' && ctx.battery <= 25 && !battDismissed;
  return (
    <div className="screen">
      {name !== 'screensaver' && name !== 'androidHome' && <StatusBar merchant={ctx.merchant} battery={ctx.battery} onBattery={ctx.toggleBattery} />}
      <ScreenBody name={name} ctx={ctx} />
      {showBatt && <LowBatteryPopup battery={ctx.battery} onClose={() => setBattDismissed(true)} />}
      {SETTINGS_SCREENS.has(name) && <SettingsFooter />}
      {showNav && <AndroidNav onBack={ctx.back} onExit={ctx.exitApp} onHome={() => ctx.reset('home')} />}
    </div>
  );
}

/* ============================================================
   PROTOTYPE (interactive)
   ============================================================ */
function Prototype({ t, toggleTheme, toggleBattery }) {
  const parseHash = () => { const h = location.hash || ''; if (!h.startsWith('#/')) return { s: null, q: new URLSearchParams() }; const [s, q] = h.slice(2).split('?'); return { s, q: new URLSearchParams(q || '') }; };
  const seed = parseHash().s;
  const start = window.BP_PARTNER ? 'category' : 'home';
  const [hashBatt, setHashBatt] = useState(() => { const b = parseHash().q.get('batt'); return b ? Number(b) : null; });
  const [screen, setScreen] = useState(seed || start);
  const [hist, setHist] = useState([seed || start]);
  const [amount, setAmount] = useState(seed ? 2450 : 0);
  const [currency, setCurrency] = useState('USD');
  const [tip, setTip] = useState({ id: null, cents: 0 });
  const [method, setMethod] = useState(seed ? { id: 'tap', label: 'Contactless', logos: [] } : null);
  const [flow, setFlow] = useState('sale');
  const [refundTxn, setRefundTxn] = useState(seed && window.TXNS ? window.TXNS[0] : null);
  const [detail, setDetail] = useState(false);
  const [receiptMode, setReceiptMode] = useState('email');
  const [failed, setFailed] = useState(false);
  const [online, setOnline] = useState(true);
  const [merchantInfo, setMerchantInfo] = useState({ name: window.BP_PARTNER ? window.BP_PARTNER.name : t.merchant, address: 'Beirut, Lebanon', phone: '+961 1 666 222', mid: '000422000006003' });
  const [failReason, setFailReason] = useState('');
  const [managerPin, setManagerPin] = useState(() => {
    try { return localStorage.getItem('bp_mgr_pin_v2') || '0000'; } catch (e) { return '0000'; }
  });
  const [pendingTarget, setPendingTarget] = useState(null);
  const saveManagerPin = (p) => { setManagerPin(p); try { localStorage.setItem('bp_mgr_pin_v2', p); } catch (e) {} };

  const go = useCallback((s) => { setScreen(s); setHist((h) => [...h, s]); }, []);
  const back = useCallback(() => {
    setHist((h) => {
      if (h.length <= 1) {
        if (window.BP_PARTNER && h[0] === 'home') { setScreen('category'); return ['category']; }
        return h;
      }
      const nh = h.slice(0, -1); setScreen(nh[nh.length - 1]); return nh;
    });
  }, []);
  const reset = useCallback((s) => { setScreen(s); setHist([s]); }, []);
  const [category, setCategory] = useState(null);

  const startSale = () => { setFlow('sale'); setAmount(0); setCurrency('USD'); setTip({ id: null, cents: 0 }); setMethod(null); setFailed(false); reset('home'); go('amount'); };
  const startPreauth = () => { setFlow('preauth'); setAmount(0); setCurrency('USD'); setTip({ id: null, cents: 0 }); setMethod(null); setFailed(false); reset('home'); go('amount'); };
  const startTip = () => { setFlow('tip'); setAmount(0); setCurrency('USD'); setTip({ id: null, cents: 0 }); setMethod(null); setFailed(false); reset('home'); go('amount'); };
  const startCash = () => { setFlow('cash'); setAmount(0); setCurrency('USD'); setMethod(null); setFailed(false); go('amount'); };
  const startVoid = () => { setFlow('void'); setFailed(false); go('refundList'); };
  const startAdjust = () => { setFlow('adjustment'); setFailed(false); go('refundList'); };
  const startSettlement = () => { go('settlement'); };
  const startRefund = () => { setFlow('refund'); setFailed(false); go('refundList'); };
  const cancel = () => reset('home');
  const finish = () => { setFlow('sale'); setAmount(0); setTip({ id: null, cents: 0 }); setFailed(false); setDetail(false); reset('home'); };
  const retry = () => { setFailed(false); setHist(['home', 'amount', 'method']); setScreen('method'); };
  const fail = (reason) => { setFailed(true); setFailReason(reason || ''); setScreen('result'); setHist((h) => [...h, 'result']); };

  /* manager-PIN gate */
  const gate = (targetFn) => { setPendingTarget(() => targetFn); go('managerPin'); };
  const pinOk = () => { back(); if (pendingTarget) pendingTarget(); };

  /* kiosk: exiting the app requires the manager PIN */
  const exitApp = () => go('exitGate');
  const relaunch = () => reset(window.BP_PARTNER ? 'category' : 'home');

  const selectRefund = (txn) => { setDetail(false); setRefundTxn(txn); go('refundConfirm'); };
  const viewTxn = (txn) => { setDetail(true); setRefundTxn(txn); go('refundConfirm'); };
  const sendReceipt = (mode) => { setReceiptMode(mode); go('receiptEntry'); };

  const refundMode = flow === 'refund';
  const closeMode = flow === 'refund' || flow === 'void' || flow === 'adjustment';
  const flowCurrency = closeMode ? 'USD' : currency;
  const total = closeMode ? (refundTxn ? refundTxn.cents : 0) : amount;

  /* auto-advance processing */
  useEffect(() => {
    if (screen === 'processing' || screen === 'refundProcessing') {
      const id = setTimeout(() => { setScreen('result'); setHist((h) => [...h, 'result']); }, 2400 * t.speed);
      return () => clearTimeout(id);
    }
  }, [screen, t.speed]);

  /* gallery deep-link: react to #/screen changes without reloading */
  useEffect(() => {
    const onHash = () => { const p = parseHash(); if (p.s) { const b = p.q.get('batt'); setHashBatt(b ? Number(b) : null); reset(p.s); } };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [reset]);

  const ctx = {
    merchant: merchantInfo.name, merchantInfo, setMerchantInfo, speed: t.speed, dark: t.dark, toggleTheme,
    amount, setAmount, tip, setTip, method, setMethod, total, flow,
    currency: flowCurrency, setCurrency, usdCents: toUSDcents(total, flowCurrency),
    approved: !t.decline && !failed, failReason, refundMode, closeMode, refundTxn,
    managerPin, saveManagerPin, gate, pinOk,
    detail, viewTxn,
    category, setCategory,
    online, setOnline,
    battery: hashBatt != null ? hashBatt : (t.lowBattery ? 22 : 86),
    toggleBattery,
    exitApp, relaunch,
    receiptMode, sendReceipt,
    go, back, reset, startSale, startPreauth, startTip, startCash, startVoid, startAdjust, startSettlement, startRefund, cancel, finish, retry, selectRefund, fail,
  };

  return (
    <div className="stage">
      <ScreenScaler><Device name={screen} ctx={ctx} /></ScreenScaler>
      <div className="stage-hint">
        <span>Tap the screen to walk the flow</span>
        <kbd>Esc</kbd><span>home</span>
      </div>
      <EscHandler onEsc={finish} />
    </div>
  );
}

function EscHandler({ onEsc }) {
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onEsc(); };
    window.addEventListener('keydown', fn); return () => window.removeEventListener('keydown', fn);
  }, [onEsc]);
  return null;
}

/* scale 432x912 to fit viewport */
function ScreenScaler({ children }) {
  const ref = useRef(null);
  useEffect(() => {
    let raf = 0;
    const fit = () => {
      const vp = window.visualViewport;
      const vw = (vp && vp.width) || window.innerWidth;
      const vh = (vp && vp.height) || window.innerHeight;
      if (!vw || !vh) return; // viewport not ready yet — wait for next event
      const pad = vw < 520 ? 10 : 40;
      const s = Math.min((vh - pad * 2) / 912, (vw - pad * 2) / 432, 1.18);
      if (ref.current) ref.current.style.transform = `scale(${s})`;
    };
    const fitSoon = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(fit); };
    fit(); fitSoon();
    window.addEventListener('resize', fitSoon);
    window.addEventListener('orientationchange', fitSoon);
    window.addEventListener('load', fitSoon);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', fitSoon);
      window.visualViewport.addEventListener('scroll', fitSoon);
    }
    // re-fit once fonts settle (metrics can shift the first measure)
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitSoon).catch(() => {});
    // observe the viewport element so late layout (restored tabs, devtools, zoom) re-fits
    let ro;
    if (window.ResizeObserver) { ro = new ResizeObserver(fitSoon); ro.observe(document.documentElement); }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', fitSoon);
      window.removeEventListener('orientationchange', fitSoon);
      window.removeEventListener('load', fitSoon);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', fitSoon);
        window.visualViewport.removeEventListener('scroll', fitSoon);
      }
      if (ro) ro.disconnect();
    };
  }, []);
  return <div className="screen-wrap" ref={ref}>{children}</div>;
}

/* ============================================================
   OVERVIEW (all screens)
   ============================================================ */
const OV_SECTIONS = [
  { title: 'Merchant', screens: [
    { name: 'screensaver', label: 'Screensaver / Lock' },
    { name: 'screensaver', label: 'Screensaver — Low Battery', battery: 22 },
    { name: 'home', label: 'Home / Idle — Normal Battery', battery: 86 },
    { name: 'home', label: 'Home / Idle — Low Battery', battery: 22 },
    { name: 'amount', label: 'Enter amount' },
    { name: 'amount', label: 'Pre-Auth', flow: 'preauth' },
    { name: 'reports', label: 'Reports' },
    { name: 'settings', label: 'Settings' },
  ]},
  { title: 'Take a payment', screens: [
    { name: 'amount', label: 'Add a Tip', flow: 'tip' },
    { name: 'method', label: 'New Payment (present)' },
    { name: 'pin', label: 'PIN entry' },
    { name: 'qr', label: 'Wallet Payment' },
    { name: 'crypto', label: 'Crypto pay' },
    { name: 'processing', label: 'Processing' },
  ]},
  { title: 'Result & receipt', screens: [
    { name: 'result', label: 'Approved', approved: true },
    { name: 'result', label: 'Declined', approved: false },
    { name: 'receipt', label: 'Receipt options' },
    { name: 'receiptEntry', label: 'Email receipt' },
    { name: 'receiptQR', label: 'QR receipt' },
    { name: 'thanks', label: 'Thank you' },
  ]},
  { title: 'Refund & void', screens: [
    { name: 'refundList', label: 'Select transaction' },
    { name: 'refundConfirm', label: 'Confirm refund' },
    { name: 'result', label: 'Refunded', approved: true, refund: true },
  ]},
];

function StaticScreen({ spec, t, onClick }) {
  const noop = () => {};
  const ctx = {
    merchant: t.merchant, speed: 0.0001,
    amount: 3380, currency: 'USD', usdCents: 3380, flow: spec.refund ? 'refund' : (spec.flow || 'sale'),
    tip: { id: 'p18', cents: 608 }, method: { id: 'tap', label: 'Contactless' },
    total: spec.refund ? 3380 : 3988,
    approved: spec.approved !== false, refundMode: !!spec.refund, refundTxn: TXNS[0],
    battery: spec.battery != null ? spec.battery : 86,
    go: noop, back: noop, reset: noop, startSale: noop, startPreauth: noop, startTip: noop, cancel: noop, finish: noop, retry: noop, selectRefund: noop, setAmount: noop, setTip: noop, setMethod: noop, setCurrency: noop,
  };
  return (
    <div className="ov-item">
      <div className="ov-frame" style={{ width: 432 * 0.46, height: 912 * 0.46 }} onClick={onClick}>
        <div style={{ width: 432, height: 912, transform: 'scale(0.46)', transformOrigin: 'top left' }}>
          <Device name={spec.name} ctx={ctx} />
        </div>
      </div>
      <div className="ov-cap"><span className="l">{spec.label}</span></div>
    </div>
  );
}

function Overview({ t, openFocus }) {
  let counter = 0;
  return (
    <div className="overview">
      <div className="ov-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          {React.createElement(window.BrandLockup, { size: 36, word: 19 })}
        </div>
        <h1>POS Terminal — full payment flow</h1>
        <p>Every screen of the Big Pay smart terminal, from idle to settled. Dark-mode premium fintech, dual-currency USD / LBP, accepting contactless, wallet, chip, swipe, QR and crypto. Click any screen to view it large — or switch to Prototype to tap through.</p>
      </div>
      {OV_SECTIONS.map((sec) => (
        <div className="ov-section" key={sec.title}>
          <h2>{sec.title}</h2>
          <div className="ov-grid">
            {sec.screens.map((spec) => {
              const n = String(++counter).padStart(2, '0');
              return <StaticScreen key={spec.label} spec={{ ...spec }} t={t} onClick={() => openFocus(spec)} />;
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* focus overlay for a single static screen */
function Focus({ spec, t, onClose }) {
  if (!spec) return null;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 80, background: 'rgba(3,5,11,0.86)', backdropFilter: 'blur(8px)', display: 'grid', placeItems: 'center', padding: 30 }}>
      <div onClick={(e) => e.stopPropagation()}>
        <ScreenScaler><Device name={spec.name} ctx={focusCtx(spec, t)} /></ScreenScaler>
      </div>
      <button onClick={onClose} style={{ position: 'fixed', top: 22, right: 24, color: '#fff', fontSize: 14, fontWeight: 600, background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: 999 }}>Close ✕</button>
    </div>
  );
}
function focusCtx(spec, t) {
  const noop = () => {};
  return {
    merchant: t.merchant, speed: t.speed,
    amount: 3380, currency: 'USD', usdCents: 3380, flow: spec.refund ? 'refund' : (spec.flow || 'sale'),
    tip: { id: 'p18', cents: 608 }, method: { id: 'tap', label: 'Contactless' },
    total: spec.refund ? 3380 : 3988,
    approved: spec.approved !== false, refundMode: !!spec.refund, refundTxn: TXNS[0],
    battery: spec.battery != null ? spec.battery : 86,
    go: noop, back: noop, reset: noop, startSale: noop, startPreauth: noop, startTip: noop, cancel: noop, finish: noop, retry: noop, selectRefund: noop, setAmount: noop, setTip: noop, setMethod: noop, setCurrency: noop,
  };
}

/* ============================================================
   ROOT
   ============================================================ */
function App() {
  const [t, setTweak] = useTweaks(window.BP_PARTNER ? { ...TWEAK_DEFAULTS, merchant: window.BP_PARTNER.name } : TWEAK_DEFAULTS);
  const [mode, setMode] = useState('prototype');
  const [focus, setFocus] = useState(null);

  /* apply tweaks to CSS vars */
  useEffect(() => {
    const r = document.documentElement.style;
    const acc = Array.isArray(t.accent) ? t.accent : [t.accent, t.accent];
    r.setProperty('--blue', acc[0]);
    r.setProperty('--blue-2', acc[1] || acc[0]);
    r.setProperty('--r', t.roundness + 'px');
    r.setProperty('--speed', String(t.speed));
    document.documentElement.classList.toggle('theme-light', !t.dark);
  }, [t]);

  return (
    <React.Fragment>
      <div className="modebar">
        <button className={mode === 'prototype' ? 'on' : ''} onClick={() => setMode('prototype')}>Prototype</button>
        <button className={mode === 'overview' ? 'on' : ''} onClick={() => setMode('overview')}>All screens</button>
        {window.BP_CD_URL && <a className="cdlink" href={window.BP_CD_URL} target="_blank" rel="noopener" title="Open the customer-facing second screen">Customer display ↗</a>}
      </div>

      <button className="themebtn" onClick={() => setTweak('dark', !t.dark)}
        title={t.dark ? 'Switch to light mode' : 'Switch to dark mode'} aria-label="Toggle theme">
        <span className={'tb-track' + (t.dark ? ' dark' : '')}>
          <span className="tb-knob">
            {t.dark
              ? <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8z" /></svg>
              : <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4.2" /><path d="M12 2v2.2M12 19.8V22M22 12h-2.2M4.2 12H2M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6M18.4 18.4l-1.6-1.6M7.2 7.2 5.6 5.6" /></svg>}
          </span>
        </span>
        <span className="tb-label">{t.dark ? 'Dark' : 'Light'}</span>
      </button>

      {mode === 'prototype'
        ? <Prototype t={t} toggleTheme={() => setTweak('dark', !t.dark)} toggleBattery={() => setTweak('lowBattery', !t.lowBattery)} />
        : <Overview t={t} openFocus={setFocus} />}

      <Focus spec={focus} t={t} onClose={() => setFocus(null)} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Brand" />
        <TweakText label="Merchant" value={t.merchant} onChange={(v) => setTweak('merchant', v)} />
        <TweakColor label="Accent" value={t.accent}
          options={[['#18a4e8', '#4cc0f7'], ['#1d3a70', '#3a6bd6'], ['#16b39a', '#46e0c4'], ['#7a5af0', '#a98bff'], ['#f0556b', '#ff8398']]}
          onChange={(v) => setTweak('accent', v)} />
        <TweakSection label="Shape & motion" />
        <TweakSlider label="Corner radius" value={t.roundness} min={6} max={34} step={2} unit="px" onChange={(v) => setTweak('roundness', v)} />
        <TweakSlider label="Animation speed" value={t.speed} min={0.4} max={2} step={0.1} unit="×" onChange={(v) => setTweak('speed', v)} />
        <TweakSection label="Theme & demo" />
        <TweakToggle label="Dark mode" value={t.dark} onChange={(v) => setTweak('dark', v)} />
        <TweakToggle label="Simulate decline" value={t.decline} onChange={(v) => setTweak('decline', v)} />
        <TweakToggle label="Low battery (22%)" value={t.lowBattery} onChange={(v) => setTweak('lowBattery', v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

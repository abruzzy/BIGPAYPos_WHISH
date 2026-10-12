/* global React, Icon, StatusBar, AmountDisplay, MerchantKeypad, BrandLockup, Wordmark, fmtUSD, fmtLBP, fmtMoney, toUSDcents */
/* Sale-flow screens. Loaded as text/babel. */

/* chosen-currency money string */
function money(units, currency) {
  return currency === 'LBP' ? fmtMoney(units, 'LBP') + ' LBP' : '$' + fmtMoney(units, 'USD');
}

/* ---- small shared bits ---- */
function Head({ title, sub, onBack, right }) {
  return (
    <div className="s-head">
      {onBack && (
        <button className="back" onClick={onBack} aria-label="Back"><Icon.back /></button>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="ttl">{title}</div>
        {sub && <div className="sub">{sub}</div>}
      </div>
      {right}
    </div>
  );
}

function FauxQR({ size = 184, fg = '#0b0f1c', bg = '#fff' }) {
  // deterministic pattern of simple squares (no real encoding)
  const n = 21, cell = size / (n + 4), pad = cell * 2;
  const cells = [];
  const seed = (i, j) => ((i * 73856093) ^ (j * 19349663) ^ ((i + 3) * (j + 7) * 83492791)) >>> 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const finder = (i < 7 && j < 7) || (i < 7 && j >= n - 7) || (i >= n - 7 && j < 7);
      if (finder) continue;
      if (seed(i, j) % 100 < 47) {
        cells.push(<rect key={i + '-' + j} x={pad + j * cell} y={pad + i * cell} width={cell * 0.92} height={cell * 0.92} rx={cell * 0.18} fill={fg} />);
      }
    }
  }
  const Finder = ({ x, y }) => (
    <g>
      <rect x={pad + x * cell} y={pad + y * cell} width={cell * 7} height={cell * 7} rx={cell * 1.4} fill={fg} />
      <rect x={pad + (x + 1) * cell} y={pad + (y + 1) * cell} width={cell * 5} height={cell * 5} rx={cell} fill={bg} />
      <rect x={pad + (x + 2) * cell} y={pad + (y + 2) * cell} width={cell * 3} height={cell * 3} rx={cell * 0.7} fill={fg} />
    </g>
  );
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ borderRadius: 18, background: bg, display: 'block' }}>
      {cells}
      <Finder x={0} y={0} /><Finder x={n - 7} y={0} /><Finder x={0} y={n - 7} />
    </svg>
  );
}

/* ============================================================
   AMOUNT ENTRY  (sale + pre-auth + tip, currency-aware)
   ============================================================ */
const FLOW_COPY = {
  sale:    { title: 'New Payment', label: 'Add Transaction Amount', cta: 'Pay' },
  preauth: { title: 'Pre-Authorization', label: 'Add Transaction Amount', cta: 'Authorize' },
  tip:     { title: 'Add a Tip', label: 'Add Tip Amount', cta: 'Add Tip' },
  cash:    { title: 'Cash Payment', label: 'Add Transaction Amount', cta: 'Take Cash' },
};
function AmountScreen({ ctx }) {
  const { amount, setAmount, merchant, go, cancel, flow, currency, setCurrency, setMethod } = ctx;
  const copy = FLOW_COPY[flow] || FLOW_COPY.sale;
  const cap = currency === 'LBP' ? 9999999999 : 99999999;
  const onKey = (k) => {
    setAmount((a) => {
      if (k === 'del') return Math.floor(a / 10);
      if (k === '00') return Math.min(a * 100, cap);
      return Math.min(a * 10 + parseInt(k, 10), cap);
    });
  };
  const switchCur = (c) => { if (c !== currency) { setCurrency(c); setAmount(0); } };
  const digits = String(amount).length;
  const dispSize = digits > 9 ? 42 : digits > 7 ? 52 : 64;
  return (
    <div className="body fade-enter">
      <Head title={copy.title} sub={merchant} onBack={cancel} />

      <div className="pad" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 8 }}>
        <AmountDisplay units={amount} currency={currency} size={dispSize} label={copy.label} />

        {/* currency selector — centered, same size as number keys */}
        <div className="curkeys" style={{ margin: '40px 0 0' }}>
          {['USD', 'LBP'].map((c) => (
            <button key={c} className={'curkey' + (currency === c ? ' on' : '')} onClick={() => switchCur(c)}>{c}</button>
          ))}
        </div>
      </div>

      <div className="pad" style={{ paddingBottom: 24 }}>
        <MerchantKeypad onKey={onKey} />
        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <button className="btn btn-ghost btn-lg" disabled={amount === 0} style={{ flex: '0 0 34%', color: 'var(--red)' }} onClick={() => setAmount(0)}>CLEAR</button>
          <button className="btn btn-primary btn-lg" disabled={amount === 0} style={{ flex: 1, fontSize: 26, fontWeight: 800, letterSpacing: '0.04em' }} onClick={() => go('method')}>
            {copy.cta.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
}

/* brand logo marks for the wallet / crypto rails.
   NOTE: stylized brand-accurate stand-ins — drop official SVGs in to replace. */
function WalletLogo({ name }) {
  const src = { whish: 'assets/logo-whish.png', omt: 'assets/logo-omt.png', bob: 'assets/logo-bob.png' }[name];
  return <img className={'wlogo-img wlogo-' + name} src={src} alt={name} />;
}
function CoinLogo({ sym, size = 34 }) {
  const st = { width: size, height: size };
  const src = { USDC: 'assets/coin-usdc.png', USDT: 'assets/coin-usdt.png', BTC: 'assets/coin-btc.png', ETH: 'assets/coin-eth.png' }[sym];
  if (src) return <img className="coin-img" style={st} src={src} alt={sym} />;
  return null;
}
function PayRail({ icon, title, logos, onClick }) {
  return (
    <button className="paybtn" onClick={onClick}>
      <div className="paybtn-ic">{icon === 'crypto' ? <span className="paybtn-ic-img ic-crypto" /> : icon === 'qr' ? <span className="paybtn-ic-img ic-wallet" /> : React.createElement(Icon[icon])}</div>
      <div className="paybtn-txt">
        <b>{title}</b>
        <div className="paybtn-logos">{logos}</div>
      </div>
      <Icon.chev style={{ width: 18, height: 18, color: 'var(--text-faint)', flexShrink: 0 }} />
    </button>
  );
}

/* animated payment card (tap-to-pay motion) */
function PayCardAnim({ onClick }) {
  return (
    <button onClick={onClick} style={{ background: 'none', display: 'block' }}>
      <div className="payanim">
        <div className="payglow" />
        <div className="paycard">
          <div className="pc-nfc"><Icon.contactless style={{ width: 22, height: 22 }} /></div>
          <div className="pc-chip" />
          <div className="pc-num num">5413 •••• •••• 4471</div>
          <div className="pc-brand"><Wordmark size={13} light /></div>
        </div>
      </div>
      <div style={{ marginTop: 16, fontSize: 15, color: 'var(--text)', fontWeight: 700, textAlign: 'center' }}>Tap, Insert or Swipe Card</div>
    </button>
  );
}

/* ============================================================
   PRESENT CARD / SELECT METHOD  ("New Payment")
   ============================================================ */
const METHODS = [
  { id: 'tap', label: 'Contactless', icon: 'contactless', desc: 'Tap card' },
  { id: 'qr', label: 'Wallet Payment', icon: 'qr' },
  { id: 'crypto', label: 'Crypto Payment', icon: 'crypto' },
];
function MethodScreen({ ctx }) {
  const { total, go, setMethod, back, currency, merchant, flow } = ctx;
  const title = flow === 'tip' ? 'New Tip Payment' : flow === 'cash' ? 'New Cash Payment' : flow === 'preauth' ? 'New Pre-Authorization' : 'New Payment';
  const pick = (m) => {
    setMethod(m);
    if (m.id === 'qr') go('qr');
    else if (m.id === 'crypto') go('crypto');
    else go('pin'); // card: tap / insert / swipe → cardholder PIN
  };
  const isLBP = currency === 'LBP';
  return (
    <div className="body fade-enter">
      <Head title={title} sub={merchant} onBack={back} />

      {/* total — pushed down, larger */}
      <div className="pad" style={{ textAlign: 'center', marginTop: 34 }}>
        <div className="amount-label" style={{ marginBottom: 18, fontSize: 13 }}>Total Amount Due</div>
        <div className="num" style={{ fontSize: 60, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1 }}>{money(total, currency)}</div>
      </div>

      {/* contactless ripple target — centered in the middle */}
      <div className="pad" style={{ flex: 1, display: 'grid', placeItems: 'center' }}>
        <button onClick={() => pick(METHODS[0])} style={{ background: 'none' }}>
          <div className="tap-target" style={isLBP ? { transform: 'scale(1.2)' } : undefined}>
            <div className="ring r1" /><div className="ring r2" /><div className="ring r3" />
            <div className="tap-core"><Icon.contactless /></div>
          </div>
          <div style={{ marginTop: isLBP ? 30 : 18, fontSize: 18, color: 'var(--text)', fontWeight: 700, textAlign: 'center' }}>Tap, Insert or Swipe Card</div>
        </button>
      </div>

      {/* OR PAY WITH — anchored at the bottom */}
      <div className="pad" style={{ paddingBottom: isLBP ? 60 : 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '0 0 14px' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
          <span style={{ fontSize: 11, color: 'var(--text-faint)', fontWeight: 700, letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>OR PAY WITH</span>
          <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <PayRail icon="qr" title="Wallet Payment" onClick={() => pick(METHODS[1])}
            logos={[<WalletLogo key="o" name="omt" />, <WalletLogo key="w" name="whish" />, <WalletLogo key="b" name="bob" />]} />
          {currency !== 'LBP' && (
            <PayRail icon="crypto" title="Crypto Payment" onClick={() => pick(METHODS[2])}
              logos={[<CoinLogo key="btc" sym="BTC" />, <CoinLogo key="eth" sym="ETH" />, <CoinLogo key="usdt" sym="USDT" />, <CoinLogo key="usdc" sym="USDC" />]} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   QR PAY
   ============================================================ */
function QRScreen({ ctx }) {
  const { total, go, back, currency, merchant, fail, setMethod } = ctx;
  const [left, setLeft] = React.useState(60);
  React.useEffect(() => {
    if (left <= 0) { fail('Wallet Payment Expired'); return; }
    const id = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [left]);
  return (
    <div className="body fade-enter">
      <Head title="Wallet Payment" sub={merchant} onBack={back} />

      {/* total — identical component, size & treatment as New Payment */}
      <div className="pad" style={{ marginTop: 26 }}>
        <AmountDisplay units={total} currency={currency} size={64} label="Total Amount Due" />
      </div>

      <div className="pad" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', paddingTop: 8, paddingBottom: 8 }}>
        <div className="chip chip-blue" style={{ fontSize: 14, padding: '9px 16px' }}><Icon.scan style={{ width: 15, height: 15 }} /> Open Your Wallet & Scan</div>
        <div style={{ padding: 18, background: '#fff', borderRadius: 30, boxShadow: '0 16px 50px -12px rgba(24,164,232,0.35)' }}>
          <FauxQR size={272} />
        </div>
        <div className="expiry-pill">Expires in <span className="num">0:{String(left).padStart(2, '0')}</span></div>
      </div>

      <div className="pad" style={{ paddingBottom: 24 }}>
        <button className="btn btn-primary btn-lg" onClick={() => { setMethod({ id: 'qr', kind: 'wallet', label: 'Wallet Payment', wallet: 'whish' }); go('processing'); }}>Simulate scan</button>
      </div>
    </div>
  );
}

/* ============================================================
   CRYPTO PAY
   ============================================================ */
const CRYPTO_ASSETS = [
  { id: 'usdt', sym: 'USDT', n: 'Tether', rate: 1, nets: ['ERC-20', 'TRC-20', 'BEP-20'] },
  { id: 'usdc', sym: 'USDC', n: 'USD Coin', rate: 1, nets: ['ERC-20', 'Solana', 'Base'] },
  { id: 'eth', sym: 'ETH', n: 'Ethereum', rate: 0.00028, nets: ['Ethereum', 'Arbitrum', 'Base'] },
  { id: 'btc', sym: 'BTC', n: 'Bitcoin', rate: 0.0000094, nets: ['Bitcoin', 'Lightning'] },
];
function CryptoScreen({ ctx }) {
  const { go, back, usdCents, merchant, fail, setMethod } = ctx;
  const [a, setA] = React.useState(null);
  const [net, setNet] = React.useState(null);
  const [left, setLeft] = React.useState(60);
  React.useEffect(() => {
    if (!net) return;
    if (left <= 0) { fail('Crypto Payment Expired'); return; }
    const id = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [left, net]);
  const chooseCoin = (x) => { setA(x); setNet(null); setLeft(60); };
  const cryptoAmt = a ? ((usdCents / 100) * a.rate) : 0;
  return (
    <div className="body fade-enter">
      <Head title="Crypto Payment" sub={merchant} onBack={back} />
      <div className="pad scroll" style={{ flex: 1, paddingBottom: 16 }}>
        {/* choose currency */}
        <div className="amount-label" style={{ margin: '4px 2px 12px' }}>Choose your Currency</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
          {CRYPTO_ASSETS.map((x) => (
            <button key={x.id} className={'cryptotile' + (a && a.id === x.id ? ' sel' : '')} onClick={() => chooseCoin(x)}>
              <CoinLogo sym={x.sym} size={46} />
            </button>
          ))}
        </div>

        {/* choose blockchain */}
        {a && (
          <div className="fade-enter">
            <div className="amount-label" style={{ margin: '20px 2px 12px' }}>Choose the Blockchain</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {a.nets.map((nw) => (
                <button key={nw} className={'netchip' + (net === nw ? ' sel' : '')} onClick={() => { setNet(nw); setLeft(60); }}>{nw}</button>
              ))}
            </div>
          </div>
        )}

        {/* QR + amount + expiry */}
        {a && net && (
          <div className="fade-enter" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginTop: 22 }}>
            <div style={{ padding: 18, background: '#fff', borderRadius: 28, boxShadow: '0 16px 50px -12px rgba(24,164,232,0.35)' }}>
              <FauxQR size={244} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div className="num" style={{ fontSize: 30, fontWeight: 600 }}>{cryptoAmt < 0.01 ? cryptoAmt.toFixed(8) : cryptoAmt.toFixed(2)} {a.sym}</div>
              <div className="num" style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 2 }}>≈ ${fmtUSD(usdCents)} · {net}</div>
            </div>
            <div className="card num" style={{ padding: '9px 14px', fontSize: 12, color: 'var(--text-dim)', letterSpacing: '0.02em', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              bp1q…{a.sym.toLowerCase()}…7f3a9c2e8d
            </div>
            <div className="expiry-pill">Expires in <span className="num">0:{String(left).padStart(2, '0')}</span></div>
          </div>
        )}
      </div>
      <div className="pad" style={{ paddingBottom: 24 }}>
        <button className="btn btn-primary btn-lg" disabled={!a || !net} onClick={() => { setMethod({ id: 'crypto', kind: 'crypto', label: 'Crypto', coin: a.sym, network: net }); go('processing'); }}>Simulate received</button>
      </div>
    </div>
  );
}

/* ============================================================
   PIN ENTRY  (card payment — secure, shuffled keypad)
   ============================================================ */
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function PinScreen({ ctx }) {
  const { go, back, cancel, merchant } = ctx;
  const [pin, setPin] = React.useState('');
  const [digits] = React.useState(() => shuffle(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']));
  const tap = (d) => setPin((p) => (p.length >= 6 ? p : p + d));
  const submit = () => { if (pin.length >= 4) go('processing'); };
  const dots = Math.max(4, pin.length);
  return (
    <div className="body fade-enter">
      <Head title="Enter PIN" sub={merchant} onBack={back} />

      <div className="pad" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
        <div className="pin-lock"><Icon.lock style={{ width: 26, height: 26 }} /></div>
        <div style={{ fontSize: 22, fontWeight: 750, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>Enter your PIN</div>
        <div className="pin-dots">
          {Array.from({ length: dots }).map((_, i) => (
            <span key={i} className={'pin-dot' + (i < pin.length ? ' on' : '')} />
          ))}
        </div>
        <div className="chip chip-green"><Icon.shield style={{ width: 13, height: 13 }} /> Encrypted · PCI-DSS secure</div>
      </div>

      <div className="pad" style={{ paddingBottom: 24 }}>
        <div className="pin-keypad">
          {digits.slice(0, 9).map((d) => (
            <button key={d} className="pin-key" onClick={() => tap(d)}>{d}</button>
          ))}
          <button className="pin-key act clear" onClick={() => setPin('')}>Clear</button>
          <button className="pin-key" onClick={() => tap(digits[9])}>{digits[9]}</button>
          <button className="pin-key act enter" disabled={pin.length < 4} onClick={submit}>Enter</button>
        </div>
        <button className="btn btn-ghost" style={{ marginTop: 12 }} onClick={cancel}>Cancel</button>
      </div>
    </div>
  );
}

/* ============================================================
   PROCESSING
   ============================================================ */
function ProcessingScreen({ ctx }) {
  const { method, refundMode } = ctx;
  const steps = ['Connecting to Big Pay', 'Authorizing', 'Confirming'];
  const isCard = !method || (method.kind !== 'wallet' && method.kind !== 'crypto' && method.kind !== 'cash');
  const word = method && method.kind === 'wallet' ? 'Wallet' : method && method.kind === 'crypto' ? 'Crypto' : method && method.kind === 'cash' ? 'Cash' : 'Card';
  const [step, setStep] = React.useState(0);
  React.useEffect(() => { const id = setInterval(() => setStep((s) => Math.min(s + 1, steps.length - 1)), 800); return () => clearInterval(id); }, []);
  return (
    <div className="body fade-enter" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <svg className="spinner" viewBox="0 0 80 80"><circle className="track" cx="40" cy="40" r="34" /><circle className="head" cx="40" cy="40" r="34" /></svg>
      <div style={{ marginTop: 26, fontSize: 19, fontWeight: 750 }}>{refundMode ? 'Processing Refund' : 'Processing Payment'}</div>
      <div style={{ marginTop: 6, fontSize: 13.5, color: 'var(--text-dim)' }}>{steps[step]}…</div>
      <div className="dots" style={{ marginTop: 22 }}>
        {steps.map((_, i) => <i key={i} className={i <= step ? 'fill' : ''} />)}
      </div>
      <div style={{ position: 'absolute', bottom: 28, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9 }}>
        {isCard && <div className="chip chip-soft">Do not remove card</div>}
        <div style={{ fontSize: 11.5, fontWeight: 650, letterSpacing: '0.04em', color: 'var(--text-faint)' }}>{word} Payment · BIGPAY SAL</div>
      </div>
    </div>
  );
}

Object.assign(window, { Head, FauxQR, AmountScreen, MethodScreen, QRScreen, CryptoScreen, PinScreen, ProcessingScreen, METHODS });

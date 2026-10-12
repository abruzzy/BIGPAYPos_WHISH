/* global React, Icon, AmountDisplay, MerchantKeypad, BrandLockup, BrandTile, Wordmark, Head, fmtUSD, fmtLBP, fmtMoney */
/* Home, result, receipt, settings, refund screens. Loaded as text/babel. */

/* ============================================================
   HOME / IDLE
   ============================================================ */
function txnIcon(label) {
  if (/apple|google|wallet/i.test(label)) return 'phone';
  if (/chip/i.test(label)) return 'chip';
  if (/qr/i.test(label)) return 'qr';
  if (/swipe|magstripe/i.test(label)) return 'swipe';
  if (/crypto/i.test(label)) return 'crypto';
  return 'contactless';
}
function HomeScreen({ ctx }) {
  const { go, startSale, startPreauth, startTip, startCash, startVoid, startAdjust, startSettlement, startRefund, gate, dark, toggleTheme, merchant, online, setOnline } = ctx;
  const actions = [
    { id: 'preauth', label: 'Pre-Auth', icon: 'clock', fn: startPreauth },
    { id: 'adjust', label: 'Adjustment', icon: 'adjust', lock: true, fn: () => gate(startAdjust) },
    { id: 'void', label: 'Void', icon: 'void', lock: true, fn: () => gate(startVoid) },
    { id: 'cash', label: 'Cash', icon: 'cash', lock: true, fn: () => gate(startCash) },
    { id: 'tip', label: 'Tip', icon: 'tip', fn: startTip },
    { id: 'refund', label: 'Refund', icon: 'refund', fn: startRefund },
    { id: 'settle', label: 'Settlement', icon: 'settle', lock: true, fn: () => gate(startSettlement) },
    { id: 'reports', label: 'Reports', icon: 'reports', fn: () => go('reports') },
    { id: 'settings', label: 'Settings', icon: 'settings', fn: () => go('settings') },
  ];
  return (
    <div className="body fade-enter">
      <div className="pad" style={{ paddingTop: 26, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <img src={dark ? window.BP_LOGO_DARK : window.BP_LOGO} alt="Big Pay" style={{ width: 236, maxWidth: '62%', height: 'auto', display: 'block' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <button onClick={() => setOnline((v) => !v)} aria-label="Toggle online status"
            className={'chip ' + (online ? 'chip-green' : 'chip-red')}
            style={{ fontSize: 10.5, padding: '5px 9px', cursor: 'pointer' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: online ? 'var(--green)' : 'var(--red)' }} /> {online ? 'Online' : 'Offline'}
          </button>
          <button onClick={() => go('screensaver')} aria-label="Lock terminal"
            style={{ width: 44, height: 44, borderRadius: 13, flexShrink: 0, display: 'grid', placeItems: 'center', background: 'var(--surface)', border: '1px solid var(--line-2)', color: 'var(--text-dim)' }}>
            <Icon.lock style={{ width: 21, height: 21 }} />
          </button>
        </div>
      </div>

      <div className="pad" style={{ flex: 1, minHeight: 0, paddingTop: 14, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 16.5, color: 'var(--text-dim)', fontWeight: 600 }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 3, minWidth: 0 }}>
              {window.BP_PARTNER && <img src={window.BP_PARTNER.logo} alt="" style={{ height: 34, width: 'auto', borderRadius: window.BP_PARTNER.pill ? 999 : 10, flexShrink: 0 }} />}
              <div style={{ fontSize: 31, fontWeight: 800, letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{merchant}</div>
            </div>
            {ctx.category && (
              <button className="chip cat-chip" onClick={() => ctx.reset('category')} aria-label="Change merchant type" style={{ background: 'color-mix(in srgb, var(--partner) 16%, transparent)', color: 'var(--partner-ink)' }}>
                {ctx.category.label} · MCC {ctx.category.mcc}
              </button>
            )}
          </div>
          <button onClick={toggleTheme} aria-label="Toggle light or dark mode"
            style={{ width: 52, height: 52, borderRadius: 16, flexShrink: 0, display: 'grid', placeItems: 'center', background: 'var(--surface)', border: '1px solid var(--line-2)', color: 'var(--blue-2)' }}>
            {React.createElement(Icon[dark ? 'sun' : 'moon'], { style: { width: 26, height: 26 } })}
          </button>
        </div>

        {/* big CTA */}
        <button className="btn btn-primary cta-pay" style={{ marginTop: 20, padding: '30px 34px', fontSize: 35, flexShrink: 0, justifyContent: 'space-between', borderRadius: 'var(--r-lg)' }} onClick={startSale}>
          <span className="sheen" />
          <span style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative' }}>
            <span className="cta-plus" style={{ width: 52, height: 52, borderRadius: 17, background: 'rgba(255,255,255,0.18)', display: 'grid', placeItems: 'center' }}><Icon.plus style={{ width: 30, height: 30 }} /></span>
            New Payment
          </span>
          <span className="cta-arrow" style={{ position: 'relative' }}><Icon.chev style={{ width: 25, height: 25, opacity: 0.9 }} /></span>
        </button>

        {/* divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '22px 0 14px', flexShrink: 0 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
          <span style={{ fontSize: 11, color: 'var(--text-faint)', fontWeight: 700, letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>OTHER OPTIONS</span>
          <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
        </div>

        {/* square option tiles */}
        <div style={{ flex: 1, minHeight: 0, maxHeight: 404, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gridAutoRows: 'minmax(0, 1fr)', gap: 10, paddingBottom: 6 }}>
          {actions.map((a) => (
            <button key={a.id} className="row" style={{ position: 'relative', minWidth: 0, minHeight: 0, flexDirection: 'column', justifyContent: 'center', gap: 8, padding: '12px 6px 10px' }} onClick={a.fn}>
              {a.lock && <span className="tile-lock"><Icon.lock style={{ width: 11, height: 11 }} /></span>}
              <div className="ic" style={{ width: 54, height: 54, background: '#fff', border: 'none' }}>{React.createElement(Icon[a.icon], { style: { width: 36, height: 36 } })}</div>
              <span style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '0.04em', textAlign: 'center', maxWidth: '100%' }}>{a.label.toUpperCase()}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="pad" style={{ paddingBottom: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
        <Icon.shield style={{ width: 13, height: 13, color: 'var(--text-faint)' }} />
        <span style={{ fontSize: 11, color: 'var(--text-faint)', whiteSpace: 'nowrap' }}>Secured by Big Pay · #BP-4471</span>
      </div>
    </div>
  );
}
function selectAndRefund(ctx, t) { if (ctx.viewTxn) ctx.viewTxn(t); }

/* ============================================================
   REPORTS — today's sales summary + transaction history
   ============================================================ */
function ReportsScreen({ ctx }) {
  const { back, merchant } = ctx;
  const [hidden, setHidden] = React.useState(false);
  const mask = (v) => (hidden ? '••••••' : v);
  return (
    <div className="body fade-enter">
      <Head title="Reports" sub={merchant} onBack={back} />
      <div className="pad scroll" style={{ flex: 1, paddingBottom: 18 }}>
        {/* total sales card */}
        <div className="card" style={{ padding: 18, background: 'linear-gradient(140deg, var(--surface-2), var(--surface))' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <span style={{ fontSize: 11.5, color: 'var(--text-dim)', fontWeight: 650, letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Today’s sales</span>
                <button onClick={() => setHidden((h) => !h)} aria-label={hidden ? 'Show amounts' : 'Hide amounts'}
                  style={{ width: 26, height: 26, borderRadius: 9, display: 'grid', placeItems: 'center', background: 'var(--surface-3)', color: 'var(--text-dim)', flexShrink: 0 }}>
                  {React.createElement(Icon[hidden ? 'eyeOff' : 'eye'], { style: { width: 15, height: 15 } })}
                </button>
              </div>
              <div className="num" style={{ fontSize: 36, fontWeight: 600, marginTop: 6, letterSpacing: hidden ? '0.04em' : '-0.02em' }}>{mask('$1,284.50')}</div>
            </div>
            <div className="chip chip-blue" style={{ marginTop: 2 }}>▲ 12%</div>
          </div>
          <div style={{ display: 'flex', gap: 22, marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
            <div><div className="num" style={{ fontSize: 18, fontWeight: 600 }}>{mask('38')}</div><div style={{ fontSize: 11, color: 'var(--text-faint)' }}>Sales</div></div>
            <div><div className="num" style={{ fontSize: 18, fontWeight: 600 }}>{mask('$33.80')}</div><div style={{ fontSize: 11, color: 'var(--text-faint)' }}>Avg ticket</div></div>
            <div><div className="num" style={{ fontSize: 18, fontWeight: 600 }}>{mask('$96.40')}</div><div style={{ fontSize: 11, color: 'var(--text-faint)' }}>Tips</div></div>
          </div>
        </div>

        {/* transaction history */}
        <div className="recent-head">
          <h3>Transactions</h3>
          <span className="chip chip-soft">Today</span>
        </div>
        <div>
          {TXNS.map((t) => (
            <button key={t.id} className="txn" style={{ width: '100%', textAlign: 'left' }} onClick={() => selectAndRefund(ctx, t)}>
              <div className="tic">{React.createElement(Icon[txnIcon(t.label)])}</div>
              <div className="tt">
                <b>{t.label.replace('Sale · ', '')}</b>
                <span>{t.card} · {t.time}</span>
              </div>
              <div className="tx-amt">
                <b>+${fmtUSD(t.cents)}</b>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   RESULT — approved / declined
   ============================================================ */
function ResultScreen({ ctx }) {
  const { total, go, approved, method, refundMode, closeMode, retry, finish, flow, currency, failReason, sendReceipt } = ctx;
  const ok = approved;
  const auth = '0' + Math.floor(100000 + Math.random() * 899999);
  const money = currency === 'LBP' ? fmtMoney(total, 'LBP') + ' LBP' : '$' + fmtMoney(total, 'USD');
  const okTitle = flow === 'refund' ? 'Refunded' : flow === 'void' ? 'Voided' : flow === 'adjustment' ? 'Adjusted' : flow === 'preauth' ? 'Authorized' : flow === 'tip' ? 'Tip received' : 'Approved';
  const okSub = flow === 'refund' ? 'Funds returned' : flow === 'void' ? 'Transaction voided' : flow === 'adjustment' ? 'Amount adjusted' : flow === 'preauth' ? 'Hold placed on card' : flow === 'tip' ? 'Thank you!' : flow === 'cash' ? 'Cash received' : 'Payment Received';

  const kind = method && method.kind;
  const typeLabel = flow === 'refund' ? 'Refund' : flow === 'void' ? 'Void' : flow === 'adjustment' ? 'Adjustment' : flow === 'preauth' ? 'Pre-authorization' : flow === 'tip' ? 'Tip' : flow === 'cash' ? 'Cash' : 'Sale';
  let rows;
  if (kind === 'cash') rows = [['Type', typeLabel], ['Tendered', 'Cash'], ['Transaction ID', auth]];
  else if (kind === 'crypto') rows = [['Type', typeLabel], ['Coin', (method && method.coin) || 'USDT'], ['Network', (method && method.network) || 'TRC-20'], ['Transaction ID', auth]];
  else if (kind === 'wallet') rows = [['Type', typeLabel], ['Wallet', ((method && method.wallet) || 'whish').toUpperCase()], ['Transaction ID', auth]];
  else rows = [['Type', typeLabel], ['Method', (method && method.label) || 'Contactless'], ['Card', 'Visa •••• 4471'], ['Transaction ID', auth]];

  const [printState, setPrintState] = React.useState('idle'); // idle | printing | done
  const doPrint = () => {
    if (printState !== 'idle') return;
    setPrintState('printing');
    setTimeout(() => { setPrintState('done'); setTimeout(() => setPrintState('idle'), 1800); }, 1400);
  };
  const receipt = [
    { id: 'print', label: printState === 'printing' ? 'PRINTING…' : printState === 'done' ? 'PRINTED' : 'PRINT', icon: printState === 'done' ? 'check' : 'printer', fn: doPrint, state: printState },
    { id: 'email', label: 'EMAIL', icon: 'mail', fn: () => sendReceipt('email') },
    { id: 'qr', label: 'QR CODE', icon: 'qr', fn: () => go('receiptQR') },
  ];
  const showReceipt = ok && flow !== 'void' && flow !== 'adjustment';

  return (
    <div className="body fade-enter">
      <div className="pad scroll" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 20 }}>
        <div className={'check-wrap big pop ' + (ok ? 'ok' : 'bad')}>
          <div className={'check-ring ' + (ok ? 'ok' : 'bad')} />
          <div className={'check-core big ' + (ok ? 'ok' : 'bad')}>{ok ? <Icon.check /> : <Icon.x />}</div>
        </div>
        <div style={{ marginTop: 26, fontSize: 38, fontWeight: 800, letterSpacing: '-0.02em', textAlign: 'center', lineHeight: 1.05 }}>
          {ok ? okTitle : (failReason || 'Declined')}
        </div>
        <div style={{ marginTop: 8, fontSize: 18, color: 'var(--text-dim)', fontWeight: 600, textAlign: 'center' }}>
          {ok ? okSub : (failReason ? 'Please try again' : 'Card issuer declined · 05')}
        </div>

        <div className="num" style={{ marginTop: 20, fontSize: 42, fontWeight: 600 }}>{flow === 'refund' ? '−' : ''}{money}</div>

        {ok && (
          <div className="card" style={{ marginTop: 22, padding: '14px 18px', width: '100%' }}>
            {rows.map(([k, v], i) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderTop: i ? '1px solid var(--line)' : 'none' }}>
                <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>{k}</span>
                <span className="num" style={{ fontSize: 13, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
        )}

        {showReceipt && (
          <div style={{ width: '100%', marginTop: 22 }}>
            <div className="amount-label" style={{ textAlign: 'center', marginBottom: 12 }}>Customer Receipt</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              {receipt.map((r) => (
                <button key={r.id} className={'rcpt-btn' + (r.state && r.state !== 'idle' ? ' rcpt-' + r.state : '')} title={r.label} aria-label={r.label} onClick={r.fn}>
                  {React.createElement(Icon[r.icon])}
                  <span className="rcpt-label">{r.label}</span>
                </button>
              ))}
            </div>
            <button className="btn btn-primary btn-lg" style={{ marginTop: 16, fontSize: 22 }} onClick={finish}>Complete Payment</button>
          </div>
        )}
      </div>

      {(!ok || !showReceipt) && (
        <div className="pad" style={{ paddingBottom: 24 }}>
          {!ok ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button className="btn btn-primary btn-lg" onClick={retry}>Try again</button>
              <button className="btn btn-ghost" onClick={finish}>Cancel</button>
            </div>
          ) : (
            <button className="btn btn-primary btn-lg" style={{ fontSize: 22 }} onClick={finish}>Complete Payment</button>
          )}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   RECEIPT OPTIONS
   ============================================================ */
function ReceiptScreen({ ctx }) {
  const { go, finish } = ctx;
  const opts = [
    { id: 'print', label: 'Print receipt', desc: 'Thermal printer', icon: 'printer', fn: () => go('thanks') },
    { id: 'email', label: 'Email', desc: 'Send a digital copy', icon: 'mail', fn: () => go('receiptEntry') },
    { id: 'qr', label: 'QR code', desc: 'Customer scans to download', icon: 'qr', fn: () => go('receiptQR') },
    { id: 'none', label: 'No receipt', desc: 'Skip', icon: 'x', fn: () => go('thanks') },
  ];
  return (
    <div className="body fade-enter">
      <Head title="Send receipt" sub="How would the customer like it?" />
      <div className="pad scroll" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center' }}>
        {opts.map((o) => (
          <button key={o.id} className="row" onClick={o.fn}>
            <div className="ic">{React.createElement(Icon[o.icon])}</div>
            <div className="rt"><b>{o.label}</b><span>{o.desc}</span></div>
            <Icon.chev className="chev" style={{ width: 17, height: 17 }} />
          </button>
        ))}
      </div>
      <div className="pad" style={{ paddingBottom: 24 }}>
        <button className="btn btn-ghost" onClick={finish}>Done</button>
      </div>
    </div>
  );
}

/* QR receipt — shown on the terminal and mirrored full-screen on the customer display */
function ReceiptQRScreen({ ctx }) {
  const { go, back, merchant } = ctx;
  return (
    <div className="body fade-enter">
      <Head title="Send Receipt" sub={merchant} onBack={back} />
      <div className="pad" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
        <div className="amount-label" style={{ textAlign: 'center' }}>Scan For Your Receipt</div>
        <div style={{ padding: 18, background: '#fff', borderRadius: 28, boxShadow: '0 16px 50px -12px rgba(24,164,232,0.35)' }}>
          {React.createElement(window.FauxQR, { size: 236 })}
        </div>
        <div className="chip chip-blue" style={{ fontSize: 14, padding: '9px 16px' }}><Icon.scan style={{ width: 15, height: 15 }} /> Open Your Camera &amp; Scan</div>
      </div>
      <div className="pad" style={{ paddingBottom: 24 }}>
        <button className="btn btn-primary btn-lg" style={{ fontSize: 24, fontWeight: 750 }} onClick={() => go('thanks')}>Done</button>
      </div>
    </div>
  );
}

/* receipt entry (email / sms) — bigger on-screen keyboard */
function ReceiptEntryScreen({ ctx }) {
  const { go, back, merchant, receiptMode } = ctx;
  const sms = receiptMode === 'sms';
  const [val, setVal] = React.useState('');
  const [mode, setMode] = React.useState('abc'); // 'abc' | 'shift' | 'sym'
  const tap = (c) => { setVal((v) => v + c); if (mode === 'shift') setMode('abc'); };
  const delOne = () => setVal((v) => v.slice(0, -1));
  const label = sms ? 'Enter Customer Phone Number' : 'Enter Customer Email Address';
  const placeholder = sms ? '+961 70 000 000' : 'name@email.com';
  const minLen = sms ? 6 : 3;
  const LETTER_ROWS = {
    abc: ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'],
    shift: ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'],
  };
  const SYM_ROWS = ['1234567890', '-_@.+#$&', ',?!\'":;'];
  return (
    <div className="body fade-enter">
      <Head title="Send Receipt" sub={merchant} onBack={back} />
      <div className="pad" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="amount-label" style={{ textAlign: 'center', marginBottom: 16 }}>{label}</div>
        <div className="card" style={{ padding: '18px 18px', minHeight: 58, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 600 }}>
          {val || <span style={{ color: 'var(--text-faint)', fontWeight: 500 }}>{placeholder}</span>}
          <span style={{ width: 2, height: 24, background: 'var(--blue)', marginLeft: 2, animation: 'spin 1s steps(2) infinite', opacity: 0.9 }} />
        </div>
        {!sms && (
          <div style={{ display: 'flex', gap: 8, marginTop: 14, justifyContent: 'center' }}>
            {['@gmail.com', '@hotmail.com', '.com'].map((s) => (
              <button key={s} className="chip chip-soft" style={{ cursor: 'pointer' }} onClick={() => setVal((v) => v + s)}>{s}</button>
            ))}
          </div>
        )}
      </div>

      <div className="pad" style={{ paddingBottom: 20 }}>
        {sms ? (
          <div className="kp-num" style={{ marginBottom: 14 }}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '0'].map((c) => (
              <button key={c} className="kp-key" onClick={() => tap(c)}>{c}</button>
            ))}
            <button className="kp-key" onClick={delOne}><Icon.backspace style={{ width: 24, height: 24 }} /></button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 14 }}>
            {mode === 'sym' ? (
              SYM_ROWS.map((r, ri) => (
                <div key={ri} style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                  {ri === 2 && <div style={{ flex: 0.5 }} />}
                  {r.split('').map((c) => (
                    <button key={c} className="kb-key" onClick={() => tap(c)}>{c}</button>
                  ))}
                  {ri === 2 && <button className="kb-key kb-del" onClick={delOne}><Icon.backspace style={{ width: 21, height: 21 }} /></button>}
                </div>
              ))
            ) : (
              LETTER_ROWS[mode === 'shift' ? 'shift' : 'abc'].map((r, ri) => (
                <div key={ri} style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                  {ri === 2 && (
                    <button className={'kb-key kb-mod' + (mode === 'shift' ? ' on' : '')} onClick={() => setMode(mode === 'shift' ? 'abc' : 'shift')}><Icon.shift style={{ width: 20, height: 20 }} /></button>
                  )}
                  {r.split('').map((c) => (
                    <button key={c} className="kb-key" onClick={() => tap(c)}>{c}</button>
                  ))}
                  {ri === 2 && <button className="kb-key kb-del" onClick={delOne}><Icon.backspace style={{ width: 21, height: 21 }} /></button>}
                </div>
              ))
            )}
            {/* bottom utility row */}
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
              <button className="kb-key kb-mod" style={{ maxWidth: 64, fontSize: 14, fontWeight: 700 }} onClick={() => setMode(mode === 'sym' ? 'abc' : 'sym')}>{mode === 'sym' ? 'ABC' : '123'}</button>
              <button className="kb-key" onClick={() => tap('@')}>@</button>
              <button className="kb-key" style={{ flex: 1, maxWidth: 140 }} onClick={() => tap('_')}>_</button>
              <button className="kb-key" onClick={() => tap('.')}>.</button>
            </div>
          </div>
        )}
        <button className="btn btn-primary btn-lg" disabled={val.length < minLen} onClick={() => go('thanks')}>Send Receipt</button>
      </div>
    </div>
  );
}

/* ============================================================
   THANK YOU
   ============================================================ */
function ThanksScreen({ ctx }) {
  const { finish, merchant, dark } = ctx;
  return (
    <div className="body fade-enter" style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div className="pop" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: -64 }}>
        <img className="thanks-logo" src={dark ? window.BP_LOGO_DARK : window.BP_LOGO} alt="Big Pay" style={{ width: 320, maxWidth: '86vw', height: 'auto', display: 'block' }} />
        <div style={{ marginTop: 28, fontSize: 40, fontWeight: 800, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>Thank You!</div>
        <div style={{ marginTop: 10, fontSize: 19, color: 'var(--text-dim)' }}>Payment Complete</div>
        <div className="chip chip-green" style={{ marginTop: 24, fontSize: 15, padding: '10px 18px' }}><Icon.check style={{ width: 16, height: 16 }} /> Receipt Sent</div>
      </div>
      <div className="pad" style={{ position: 'absolute', bottom: 96, left: 0, right: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button className="btn btn-primary btn-lg" style={{ fontSize: 28, padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 13 }} onClick={finish}><Icon.home style={{ width: 28, height: 28 }} /> HOME</button>
      </div>
    </div>
  );
}

/* ============================================================
   SETTINGS
   ============================================================ */
function SettingsScreen({ ctx }) {
  const { back, go, dark, merchant, gate } = ctx;
  const groups = [
    { title: 'System', items: [
      { label: 'System Settings', desc: 'Terminal, Host & Operators', icon: 'sliders', lock: true, fn: () => gate(() => go('systemSettings')) },
    ]},
    { title: 'Merchant', items: [
      { label: 'Merchant Profile', desc: merchant, icon: 'user', fn: () => go('merchantProfile') },
    ]},
    { title: 'Device', items: [
      { label: 'Connectivity', desc: 'Wi-Fi · 4G', icon: 'wifi', fn: () => go('connectivity') },
      { label: 'Date & Time', desc: 'Network · Manual', icon: 'clock', fn: () => go('datetime') },
      { label: 'Display & Sound', desc: 'Brightness · Volume', icon: 'sun', fn: () => go('display') },
      { label: 'Card Readers', desc: 'NFC · Chip · Magstripe', icon: 'chip', fn: () => go('cardReaders') },
    ]},
    { title: 'Payments', items: [
      { label: 'Language & Currency', desc: 'English · USD / LBP', icon: 'globe', fn: () => go('language') },
      { label: 'Crypto Acceptance', desc: 'BTC · ETH · USDT', icon: 'crypto', fn: () => go('cryptoSettings') },
    ]},
    { title: 'Security', items: [
      { label: 'Manager PIN', desc: 'Required For Cash, Void, Settlement', icon: 'lock', fn: () => go('changePin') },
      { label: 'Batch & Settlement', desc: 'Auto-Close 11:00 PM', icon: 'reports', fn: () => go('batchSettings') },
    ]},
  ];
  return (
    <div className="body fade-enter">
      <Head title="Settings" sub={merchant} onBack={back} />
      <div className="pad scroll" style={{ flex: 1, paddingBottom: 18 }}>
        {groups.map((g) => (
          <div key={g.title} style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-faint)', margin: '0 4px 10px' }}>{g.title}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {g.items.map((it) => (
                <button key={it.label} className="row" onClick={it.fn || back}>
                  <div className="ic">{React.createElement(Icon[it.icon])}</div>
                  <div className="rt"><b style={{ fontSize: 14.5 }}>{it.label}</b><span>{it.desc}</span></div>
                  {it.lock && <Icon.lock style={{ width: 14, height: 14, color: 'var(--text-faint)', marginRight: 4 }} />}
                  <Icon.chev className="chev" style={{ width: 16, height: 16 }} />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   REFUND — recent transactions list + confirm
   ============================================================ */
const TXNS = [
  { id: 't1', label: 'Sale · Contactless', card: 'Visa •••• 4471', cents: 3380, time: '2:14 PM' },
  { id: 't2', label: 'Sale · Apple Pay', card: 'Mastercard •••• 8820', cents: 12750, time: '1:02 PM' },
  { id: 't3', label: 'Sale · Chip', card: 'Visa •••• 1190', cents: 2450, time: '12:38 PM' },
  { id: 't4', label: 'Sale · QR pay', card: 'Whish wallet', cents: 5600, time: '11:55 AM' },
];
const CLOSE_COPY = {
  refund: { list: 'Refund Transactions', btn: 'Refund Transaction', verb: 'You are refunding', danger: true, icon: 'refund' },
  void: { list: 'Void a sale', btn: 'Confirm Void', verb: 'You are voiding', danger: true, icon: 'void' },
  adjustment: { list: 'Adjust a sale', btn: 'Confirm adjustment', verb: 'You are adjusting', danger: false, icon: 'adjust' },
};
function RefundListScreen({ ctx }) {
  const { back, selectRefund, flow, merchant } = ctx;
  const c = CLOSE_COPY[flow] || CLOSE_COPY.refund;
  return (
    <div className="body fade-enter">
      <Head title={c.list} sub={merchant} onBack={back} />
      <div className="pad scroll" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9, paddingBottom: 18 }}>
        {TXNS.map((t) => (
          <button key={t.id} className="row" onClick={() => selectRefund(t)}>
            <div className="ic" style={{ color: 'var(--text-dim)' }}>{React.createElement(Icon[c.icon])}</div>
            <div className="rt"><b style={{ fontSize: 14.5 }}>{t.label}</b><span>{t.card} · {t.time}</span></div>
            <div className="num" style={{ fontWeight: 600, fontSize: 15 }}>${fmtUSD(t.cents)}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
function RefundConfirmScreen({ ctx }) {
  const { back, refundTxn, go, flow, merchant, detail } = ctx;
  const c = CLOSE_COPY[flow] || CLOSE_COPY.refund;
  const t = refundTxn || TXNS[0];
  const accent = detail ? 'var(--blue)' : (c.danger ? 'var(--red)' : 'var(--blue)');
  const auth = '0' + Math.floor(100000 + Math.random() * 899999);
  return (
    <div className="body fade-enter">
      <Head title="Transaction Details" sub={merchant} onBack={back} />
      <div className="pad" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: 20, background: `color-mix(in srgb, ${accent} 16%, transparent)`, display: 'grid', placeItems: 'center', color: accent }}>
          {React.createElement(Icon[detail ? 'printer' : c.icon], { style: { width: 30, height: 30 } })}
        </div>
        <div style={{ marginTop: 18, fontSize: 13, color: 'var(--text-dim)' }}>{detail ? 'Amount' : c.verb}</div>
        <div className="num" style={{ fontSize: 46, fontWeight: 600, marginTop: 6 }}>${fmtUSD(t.cents)}</div>
        <div className="card" style={{ marginTop: 24, padding: '14px 18px', width: '100%' }}>
          {[['Type', t.label.replace('Sale · ', '')], ['Card', t.card], ['Time', t.time], ['Transaction ID', auth]].map(([k, v], i) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderTop: i ? '1px solid var(--line)' : 'none' }}>
              <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>{k}</span>
              <span className="num" style={{ fontSize: 13, fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="pad" style={{ paddingBottom: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {detail ? (
          <button className="btn btn-primary btn-lg" onClick={() => go('thanks')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9 }}>
            <Icon.printer style={{ width: 19, height: 19 }} /> Re-Print Receipt
          </button>
        ) : (
          <button className={'btn btn-lg ' + (c.danger ? 'btn-danger' : 'btn-primary')} onClick={() => go('refundProcessing')}>{c.btn}</button>
        )}
        <button className="btn btn-ghost" onClick={back}>Cancel</button>
      </div>
    </div>
  );
}

/* ============================================================
   MANAGER PIN GATE + CHANGE PIN
   ============================================================ */
function PinPad({ value, onTap, onClear }) {
  return (
    <div className="pin-keypad">
      {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
        <button key={d} className="pin-key" onClick={() => onTap(d)}>{d}</button>
      ))}
      <button className="pin-key act clear" onClick={onClear}>Clear</button>
      <button className="pin-key" onClick={() => onTap('0')}>0</button>
      <button className="pin-key del" onClick={() => onTap('del')}><Icon.backspace /></button>
    </div>
  );
}
function ManagerPinScreen({ ctx }) {
  const { managerPin, pinOk, cancel } = ctx;
  const [pin, setPin] = React.useState('');
  const [err, setErr] = React.useState(false);
  const tap = (d) => {
    if (d === 'del') { setPin((p) => p.slice(0, -1)); return; }
    setPin((p) => {
      if (p.length >= 4) return p;
      const np = p + d;
      if (np.length === 4) {
        if (np === managerPin) setTimeout(pinOk, 240);
        else setTimeout(() => { setErr(true); setPin(''); setTimeout(() => setErr(false), 450); }, 180);
      }
      return np;
    });
  };
  const dots = Math.max(4, pin.length);
  return (
    <div className="body fade-enter">
      <Head title="Manager PIN" sub="Authorization required" onBack={cancel} />
      <div className="pad" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22 }}>
        <div className="pin-lock" style={{ color: err ? 'var(--red)' : 'var(--blue-2)' }}><Icon.lock style={{ width: 26, height: 26 }} /></div>
        <div style={{ fontSize: 20, fontWeight: 750, whiteSpace: 'nowrap' }}>Enter Manager PIN</div>
        <div className={'pin-dots' + (err ? ' shake' : '')}>
          {Array.from({ length: dots }).map((_, i) => <span key={i} className={'pin-dot' + (i < pin.length ? ' on' : '')} />)}
        </div>
        <div style={{ fontSize: 12.5, color: err ? 'var(--red)' : 'var(--text-faint)' }}>{err ? 'Incorrect PIN · Try Again' : 'Required For Cash, Void, Settlement & Adjustment'}</div>
      </div>
      <div className="pad" style={{ paddingBottom: 24 }}>
        <PinPad onTap={tap} onClear={() => setPin('')} />
        <button className="btn btn-ghost" style={{ marginTop: 12 }} onClick={cancel}>Cancel</button>
      </div>
    </div>
  );
}
function ChangePinScreen({ ctx }) {
  const { back, managerPin, saveManagerPin } = ctx;
  const [step, setStep] = React.useState('current'); // current | new | confirm
  const [val, setVal] = React.useState('');
  const [first, setFirst] = React.useState('');
  const [err, setErr] = React.useState('');
  const titleMap = { current: 'Enter current PIN', new: 'Enter new PIN', confirm: 'Re-enter new PIN' };
  const tap = (d) => {
    if (d === 'del') { setVal((p) => p.slice(0, -1)); return; }
    setVal((p) => {
      if (p.length >= 4) return p;
      const np = p + d;
      if (np.length === 4) setTimeout(() => advance(np), 200);
      return np;
    });
  };
  const advance = (np) => {
    if (step === 'current') {
      if (np === managerPin) { setErr(''); setStep('new'); setVal(''); }
      else { setErr('Wrong current PIN'); setVal(''); }
    } else if (step === 'new') {
      setFirst(np); setErr(''); setStep('confirm'); setVal('');
    } else {
      if (np === first) { saveManagerPin(np); back(); }
      else { setErr('PINs don’t match'); setStep('new'); setVal(''); setFirst(''); }
    }
  };
  const dots = Math.max(4, val.length);
  return (
    <div className="body fade-enter">
      <Head title="Change Manager PIN" sub={back ? 'Settings' : ''} onBack={back} />
      <div className="pad" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22 }}>
        <div className="pin-lock"><Icon.lock style={{ width: 26, height: 26 }} /></div>
        <div style={{ fontSize: 20, fontWeight: 750, whiteSpace: 'nowrap' }}>{titleMap[step]}</div>
        <div className="pin-dots">
          {Array.from({ length: dots }).map((_, i) => <span key={i} className={'pin-dot' + (i < val.length ? ' on' : '')} />)}
        </div>
        {err && <div style={{ fontSize: 12.5, color: 'var(--red)' }}>{err}</div>}
      </div>
      <div className="pad" style={{ paddingBottom: 24 }}>
        <PinPad onTap={tap} onClear={() => setVal('')} />
        <button className="btn btn-ghost" style={{ marginTop: 12 }} onClick={back}>Cancel</button>
      </div>
    </div>
  );
}

/* ============================================================
   SETTLEMENT — batch close
   ============================================================ */
const SETTLE_LINES = [
  { type: 'Card', count: 32, cents: 101230 },
  { type: 'Wallet', count: 5, cents: 24180 },
  { type: 'Crypto', count: 1, cents: 6380 },
  { type: 'Pre-Auth', count: 2, cents: 18900 },
  { type: 'Tip', count: 11, cents: 9640 },
  { type: 'Cash', count: 4, cents: 15240 },
  { type: 'Void', count: 1, cents: -4500, neg: true },
  { type: 'Refund', count: 1, cents: -3380, neg: true },
];
function SettlementScreen({ ctx }) {
  const { back, finish, merchant } = ctx;
  const [done, setDone] = React.useState(false);
  const [cur, setCur] = React.useState('USD');
  const totalCents = SETTLE_LINES.reduce((s, l) => s + l.cents, 0);
  const totalCount = SETTLE_LINES.reduce((s, l) => s + l.count, 0);
  const amt = (cents) => cur === 'USD'
    ? (cents < 0 ? '-$' : '$') + fmtUSD(Math.abs(cents))
    : (cents < 0 ? '-' : '') + fmtLBP(Math.abs(cents)) + ' LBP';

  if (done) {
    return (
      <div className="body fade-enter" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div className="check-wrap big pop ok">
          <div className="check-ring ok" />
          <div className="check-core big ok"><Icon.check /></div>
        </div>
        <div style={{ marginTop: 26, fontSize: 34, fontWeight: 800, letterSpacing: '-0.02em' }}>Batch Settled</div>
        <div style={{ marginTop: 8, fontSize: 16, color: 'var(--text-dim)', fontWeight: 600 }}>{totalCount} transactions · {amt(totalCents)}</div>
        <button className="btn btn-primary btn-lg" style={{ position: 'absolute', bottom: 24, left: 24, right: 24, width: 'calc(100% - 48px)' }} onClick={finish}>Done</button>
      </div>
    );
  }
  return (
    <div className="body fade-enter">
      <Head title="Settlement" sub={merchant} onBack={back} />

      {/* currency toggle — like New Payment */}
      <div className="pad" style={{ marginTop: 4 }}>
        <div className="curkeys">
          {['USD', 'LBP'].map((c) => (
            <button key={c} className={'curkey' + (cur === c ? ' on' : '')} style={{ height: 48, flex: 1 }} onClick={() => setCur(c)}>{c}</button>
          ))}
        </div>
      </div>

      <div className="pad scroll" style={{ flex: 1, paddingBottom: 14 }}>
        {/* batch total */}
        <div className="card" style={{ marginTop: 4, padding: 18, background: 'linear-gradient(140deg, var(--surface-2), var(--surface))', textAlign: 'center' }}>
          <div className="amount-label" style={{ marginBottom: 8 }}>Batch Total</div>
          <div className="num" style={{ fontSize: 40, fontWeight: 600 }}>{amt(totalCents)}</div>
          <div className="num" style={{ fontSize: 12.5, color: 'var(--text-faint)', marginTop: 3 }}>{totalCount} transactions</div>
        </div>

        {/* per-type breakdown */}
        <div className="card" style={{ marginTop: 12, padding: '6px 18px 10px' }}>
          <div className="settle-row settle-head">
            <span>Type</span><span>Count</span><span>Amount</span>
          </div>
          {SETTLE_LINES.map((l) => (
            <div key={l.type} className="settle-row">
              <span style={{ fontWeight: 650, color: l.neg ? 'var(--red)' : 'var(--text)' }}>{l.type}</span>
              <span className="num" style={{ color: 'var(--text-dim)' }}>{l.count}</span>
              <span className="num" style={{ fontWeight: 600, color: l.neg ? 'var(--red)' : 'var(--text)' }}>{amt(l.cents)}</span>
            </div>
          ))}
          <div className="settle-row settle-total">
            <span style={{ fontWeight: 750 }}>Total</span>
            <span className="num" style={{ color: 'var(--text-dim)' }}>{totalCount}</span>
            <span className="num" style={{ fontWeight: 750 }}>{amt(totalCents)}</span>
          </div>
        </div>
      </div>

      <div className="pad" style={{ paddingBottom: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button className="btn btn-primary btn-lg" onClick={() => setDone(true)}>Settle Transactions</button>
        <button className="btn btn-ghost btn-lg" onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9 }}>
          <Icon.printer style={{ width: 19, height: 19 }} /> Print Report
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   MERCHANT TYPE (Big Pay × whish variant) — shown after the screensaver
   ============================================================ */
const MERCHANT_TYPES = [
  { id: 'gov', label: 'Governmental Services', mcc: '9399', desc: 'Government Services', icon: 'landmark' },
  { id: 'edu', label: 'Educational Services', mcc: '8299', desc: 'Schools & Education', icon: 'grad' },
  { id: 'tel', label: 'Telecom Services', mcc: '4814', desc: 'Telecommunication Services', icon: 'antenna' },
  { id: 'ret', label: 'Retailer', mcc: '5999', desc: 'Miscellaneous Retail', icon: 'bag' },
];
function CategoryScreen({ ctx }) {
  const { dark, merchant, setCategory, reset } = ctx;
  const pick = (c) => { setCategory(c); reset('home'); };
  return (
    <div className="body fade-enter">
      <div className="pad" style={{ paddingTop: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <img src={dark ? window.BP_WORD_DARK : window.BP_WORD} alt="Big Pay" style={{ height: 50, width: 'auto', display: 'block' }} />
        <span style={{ fontSize: 22, color: 'var(--text-faint)', fontWeight: 500 }}>×</span>
        <img src={window.BP_PARTNER.logo} alt={window.BP_PARTNER.name} style={{ height: 50, width: 'auto', borderRadius: window.BP_PARTNER.pill ? 999 : 14, display: 'block' }} />
      </div>
      <div className="pad" style={{ textAlign: 'center', marginTop: 26 }}>
        <div style={{ fontSize: 13, color: 'var(--text-dim)', fontWeight: 600 }}>{merchant}</div>
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 2 }}>Select Merchant Type</div>
      </div>
      <div className="pad scroll" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 22, paddingBottom: 18 }}>
        {MERCHANT_TYPES.map((c) => (
          <button key={c.id} className="row cat-btn" onClick={() => pick(c)}>
            <div className="ic cat-ic">{React.createElement(Icon[c.icon], { style: { width: 30, height: 30 } })}</div>
            <div className="rt"><b>{c.label}</b><span>MCC {c.mcc} · {c.desc}</span></div>
            <Icon.chev className="chev" style={{ width: 18, height: 18 }} />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   SCREENSAVER / IDLE LOCK
   ============================================================ */
function ScreensaverScreen({ ctx }) {
  const { reset, merchant, dark, online, battery = 86 } = ctx;
  const lowBatt = battery <= 25;
  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(id);
  }, []);
  const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const date = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  return (
    <div className={'saver' + (dark ? '' : ' saver-light')} onClick={() => reset(window.BP_PARTNER ? 'category' : 'home')}>
      <div className="saver-aurora" />
      <div className="saver-grid" />
      <div className="saver-rings"><span /><span /><span /></div>

      <div className="saver-center">
        <img className="saver-logo" src={dark ? window.BP_LOGO_DARK : window.BP_LOGO} alt="Big Pay" style={{ width: 340, maxWidth: '88vw', height: 'auto' }} />
      </div>

      <div className="saver-clock">
        <div className="num t">{time}</div>
        <div className="d">{date}</div>
      </div>

      <div className="saver-foot">
        <div className="saver-merchant" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          {window.BP_PARTNER && <img src={window.BP_PARTNER.logo} alt="" style={{ height: 28, width: 'auto', borderRadius: window.BP_PARTNER.pill ? 999 : 8, flexShrink: 0 }} />}
          {merchant}
        </div>
        <div className="saver-online"><span className={'dot' + (online ? '' : ' off')} /> {online ? 'Terminal Ready · Secured' : 'Terminal Offline'}</div>
        {lowBatt && (
          <div className="saver-batt">
            <svg width="22" height="12" viewBox="0 0 22 12"><rect x="0.75" y="0.75" width="17.5" height="10.5" rx="2.6" fill="none" stroke="currentColor" strokeWidth="1.5" /><rect x="2.5" y="2.5" width={Math.max(1.5, Math.round(14 * battery / 100))} height="7" rx="1.4" fill="currentColor" /><rect x="19.5" y="3.5" width="2" height="5" rx="1" fill="currentColor" opacity="0.6" /></svg>
            Low Battery · <span className="num" style={{ letterSpacing: 0 }}>{battery + '%'}</span> — Please Connect Charger
          </div>
        )}
        <div className="saver-tap">Tap to begin</div>
      </div>
    </div>
  );
}

Object.assign(window, {
  HomeScreen, CategoryScreen, MERCHANT_TYPES, ReportsScreen, ResultScreen, ReceiptScreen, ReceiptEntryScreen, ReceiptQRScreen, ThanksScreen,
  SettingsScreen, RefundListScreen, RefundConfirmScreen, ManagerPinScreen, ChangePinScreen, SettlementScreen, ScreensaverScreen, PinPad, TXNS,
});

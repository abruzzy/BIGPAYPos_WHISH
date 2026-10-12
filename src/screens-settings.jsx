/* global React, Icon, Head, BrandLockup */
/* Big Pay — Settings sub-screens: device controls + manager-only System Settings.
   Loaded as text/babel after screens-aux.jsx. */

/* session-persistent device state (prototype) */
const DEVICE = {
  conn: 'wifi', wifiName: 'Breidy-5G', sim: 'touch · 4G',
  brightness: 75, volume: 60, autoTime: true,
  date: '2026-06-05', time: '18:42',
};

/* ---------- shared bits ---------- */
function Toggle({ on, onClick }) {
  return <span role="switch" aria-checked={on} className={'sw' + (on ? ' on' : '')} onClick={onClick} />;
}
function Seg({ value, options, onChange }) {
  return (
    <div className="seg">
      {options.map((o) => (
        <button key={o.v} className={value === o.v ? 'on' : ''} onClick={() => onChange(o.v)}>{o.label}</button>
      ))}
    </div>
  );
}
function KV({ icon, label, sub, children, onClick, danger }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag className="kv" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      {icon && <div className="kv-ic" style={danger ? { background: 'color-mix(in srgb, var(--red) 15%, transparent)', color: 'var(--red)' } : undefined}>{React.createElement(Icon[icon])}</div>}
      <div className="kv-main"><b style={danger ? { color: 'var(--red)' } : undefined}>{label}</b>{sub && <span>{sub}</span>}</div>
      {children}
    </Tag>
  );
}
function Group({ title, children }) {
  return (
    <div className="set-group">
      {title && <div className="set-group-title">{title}</div>}
      <div className="set-card">{children}</div>
    </div>
  );
}
/* a plain key→value row used in the parameter lists */
function ParamRow({ label, value, mono, onClick, last }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag className="kv" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default', borderBottom: last ? 'none' : undefined }}>
      <div className="kv-main"><b style={{ fontWeight: 600 }}>{label}</b></div>
      {value != null && <span className={'kv-val' + (mono ? ' num' : '')}>{value}</span>}
      {onClick && <Icon.chev className="chev" style={{ width: 15, height: 15, marginLeft: 10 }} />}
    </Tag>
  );
}
/* slide-up on-screen keyboard sheet (same keys as receipt entry) */
function EditKeyboard({ label, value, mono, onCommit, onClose }) {
  const [v, setV] = React.useState(value);
  const [mode, setMode] = React.useState('abc');
  const tap = (c) => { setV((x) => x + c); if (mode === 'shift') setMode('abc'); };
  const delOne = () => setV((x) => x.slice(0, -1));
  const LETTER_ROWS = { abc: ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'], shift: ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'] };
  const SYM_ROWS = ['1234567890', '-_@.+#$&', ',?!\'":;'];
  const done = () => { onCommit(v); onClose(); };
  return (
    <div className="kbsheet-back" onClick={onClose}>
      <div className="kbsheet" onClick={(e) => e.stopPropagation()}>
        <div className="kbsheet-label">{label}</div>
        <div className="kbsheet-field">{v || <span style={{ color: 'var(--text-faint)', fontWeight: 500 }}>—</span>}<span className="kbsheet-caret" /></div>
        {mono ? (
          <div className="kp-num" style={{ marginBottom: 14 }}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'].map((c) => (
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
                  {r.split('').map((c) => (<button key={c} className="kb-key" onClick={() => tap(c)}>{c}</button>))}
                  {ri === 2 && <button className="kb-key kb-del" onClick={delOne}><Icon.backspace style={{ width: 21, height: 21 }} /></button>}
                </div>
              ))
            ) : (
              LETTER_ROWS[mode === 'shift' ? 'shift' : 'abc'].map((r, ri) => (
                <div key={ri} style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                  {ri === 2 && (<button className={'kb-key kb-mod' + (mode === 'shift' ? ' on' : '')} onClick={() => setMode(mode === 'shift' ? 'abc' : 'shift')}><Icon.shift style={{ width: 20, height: 20 }} /></button>)}
                  {r.split('').map((c) => (<button key={c} className="kb-key" onClick={() => tap(c)}>{c}</button>))}
                  {ri === 2 && <button className="kb-key kb-del" onClick={delOne}><Icon.backspace style={{ width: 21, height: 21 }} /></button>}
                </div>
              ))
            )}
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
              <button className="kb-key kb-mod" style={{ maxWidth: 64, fontSize: 14, fontWeight: 700 }} onClick={() => setMode(mode === 'sym' ? 'abc' : 'sym')}>{mode === 'sym' ? 'ABC' : '123'}</button>
              <button className="kb-key" onClick={() => tap('@')}>@</button>
              <button className="kb-key" style={{ flex: 1, maxWidth: 150 }} onClick={() => tap(' ')}>space</button>
              <button className="kb-key" onClick={() => tap('.')}>.</button>
            </div>
          </div>
        )}
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" style={{ flex: 2, fontSize: 21, fontWeight: 750 }} onClick={done}>SAVE</button>
        </div>
      </div>
    </div>
  );
}

/* inline-editable key→value row: tap to edit with on-screen keyboard */
function EditRow({ label, value, onChange, mono, last, type }) {
  const [editing, setEditing] = React.useState(false);
  return (
    <React.Fragment>
      <div className="kv" style={{ cursor: 'pointer', borderBottom: last ? 'none' : undefined }} onClick={() => setEditing(true)}>
        <div className="kv-main"><b style={{ fontWeight: 600 }}>{label}</b></div>
        <span className={'kv-val' + (mono ? ' num' : '')}>{value}</span>
        <Icon.pencil className="kv-pencil" />
      </div>
      {editing && <EditKeyboard label={label} value={value} mono={mono}
        onCommit={(nv) => { if (nv !== value && onChange) onChange(nv); }}
        onClose={() => setEditing(false)} />}
    </React.Fragment>
  );
}

/* ============================================================
   CONNECTIVITY — Wi-Fi / 4G
   ============================================================ */
function ConnectivityScreen({ ctx }) {
  const { back, merchant } = ctx;
  const [conn, setConn] = React.useState(DEVICE.conn);
  const [roaming, setRoaming] = React.useState(!!DEVICE.roaming);
  const toggleRoaming = () => { DEVICE.roaming = !roaming; setRoaming(!roaming); };
  const set = (v) => { DEVICE.conn = v; setConn(v); };
  const wifiNets = [
    { name: 'Breidy-5G', signal: 'Strong', on: true },
    { name: 'Breidy-Guest', signal: 'Good', on: false },
    { name: 'MDSL-Office', signal: 'Weak', on: false },
  ];
  return (
    <div className="body fade-enter">
      <Head title="Connectivity" sub={merchant} onBack={back} />
      <div className="pad scroll" style={{ flex: 1, paddingBottom: 18 }}>
        <Group title="Connection Mode">
          <div className="kv">
            <div className="kv-main"><b>Network</b><span>{conn === 'wifi' ? 'Connected Via Wi-Fi' : 'Connected Via Mobile Data'}</span></div>
            <Seg value={conn} onChange={set} options={[{ v: 'wifi', label: 'Wi-Fi' }, { v: '4g', label: '4G' }]} />
          </div>
        </Group>

        {conn === 'wifi' ? (
          <Group title="Wi-Fi Networks">
            {wifiNets.map((n, i) => (
              <button key={n.name} className="kv" style={{ borderBottom: i === wifiNets.length - 1 ? 'none' : undefined }} onClick={() => { DEVICE.wifi = n; ctx.go('wifiDetail'); }}>
                <div className="kv-ic"><Icon.wifi /></div>
                <div className="kv-main"><b>{n.name}</b><span>{n.signal} Signal · WPA2</span></div>
                {n.on ? <span className="chip chip-green" style={{ fontSize: 10.5 }}>Connected</span> : <Icon.lock style={{ width: 14, height: 14, color: 'var(--text-faint)' }} />}
                <Icon.chev className="chev" style={{ width: 15, height: 15, marginLeft: 8 }} />
              </button>
            ))}
          </Group>
        ) : (
          <Group title="Mobile Data">
            <KV icon="signal" label="touch" sub="4G LTE · SIM 1" onClick={() => { DEVICE.carrier = 'touch'; ctx.go('cellular'); }}><span className="chip chip-green" style={{ fontSize: 10.5 }}>Active</span><Icon.chev className="chev" style={{ width: 15, height: 15, marginLeft: 8 }} /></KV>
            <KV icon="signal" label="alfa" sub="Tap To Configure SIM 2" onClick={() => { DEVICE.carrier = 'alfa'; ctx.go('cellular'); }}><Icon.chev className="chev" style={{ width: 15, height: 15 }} /></KV>
            <div className="kv" style={{ borderBottom: 'none' }}>
              <div className="kv-main"><b>Data Roaming</b><span>Use Data Abroad</span></div>
              <Toggle on={roaming} onClick={toggleRoaming} />
            </div>
          </Group>
        )}
        <div style={{ fontSize: 11.5, color: 'var(--text-faint)', textAlign: 'center', padding: '4px 16px' }}>
          The terminal automatically falls back to {conn === 'wifi' ? '4G' : 'Wi-Fi'} if the primary connection drops.
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   CELLULAR / APN — per-SIM mobile data network settings
   ============================================================ */
function CellularScreen({ ctx }) {
  const { back } = ctx;
  const carrier = DEVICE.carrier || 'touch';
  const presets = {
    touch: { apn: 'internet.mtctouch.com.lb', mcc: '415', mnc: '01', user: '', net: '4g' },
    alfa: { apn: 'internet.alfa.com.lb', mcc: '415', mnc: '03', user: '', net: '4g' },
  };
  const [form, setForm] = React.useState(presets[carrier]);
  const [dataOn, setDataOn] = React.useState(true);
  const [editing, setEditing] = React.useState(null);
  const LABELS = { apn: 'APN', user: 'Username', pass: 'Password', mcc: 'MCC', mnc: 'MNC' };
  const field = (k, label, ph) => (
    <div>
      <span style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 7 }}>{label}</span>
      <button onClick={() => setEditing(k)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface-2)', border: '1px solid var(--line-2)', borderRadius: 11, padding: '12px 13px', color: 'var(--text)', font: 'inherit', fontSize: 14, fontWeight: 600, textAlign: 'left', cursor: 'pointer' }}>
        <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: form[k] ? 'var(--text)' : 'var(--text-faint)' }}>{form[k] || ph}</span>
        <Icon.pencil style={{ width: 14, height: 14, color: 'var(--text-faint)', flexShrink: 0 }} />
      </button>
    </div>
  );
  return (
    <div className="body fade-enter">
      <Head title={carrier.charAt(0).toUpperCase() + carrier.slice(1)} sub="Mobile Data Settings" onBack={back} />
      <div className="pad scroll" style={{ flex: 1, paddingBottom: 18 }}>
        <Group>
          <div className="kv">
            <div className="kv-ic"><Icon.signal /></div>
            <div className="kv-main"><b>Mobile Data</b><span>Use {carrier} For Connectivity</span></div>
            <Toggle on={dataOn} onClick={() => setDataOn(!dataOn)} />
          </div>
          <div className="kv" style={{ borderBottom: 'none' }}>
            <div className="kv-main"><b style={{ fontWeight: 600 }}>Preferred Network</b></div>
            <Seg value={form.net} onChange={(v) => setForm((f) => ({ ...f, net: v }))}
              options={[{ v: '4g', label: '4G' }, { v: '3g', label: '3G' }, { v: 'auto', label: 'Auto' }]} />
          </div>
        </Group>

        <div className="set-group-title">Access Point (APN)</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, opacity: dataOn ? 1 : 0.45, pointerEvents: dataOn ? 'auto' : 'none' }}>
          {field('apn', 'APN', 'internet')}
          {field('user', 'Username', 'Optional')}
          {field('pass', 'Password', 'Optional')}
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>{field('mcc', 'MCC')}</div>
            <div style={{ flex: 1 }}>{field('mnc', 'MNC')}</div>
          </div>
        </div>

        <div className="set-group-title" style={{ marginTop: 18 }}>Advanced</div>
        <Group>
          <ParamRow label="Authentication Type" value="PAP / CHAP" onClick={() => {}} />
          <ParamRow label="APN Protocol" value="IPv4/IPv6" onClick={() => {}} last />
        </Group>
      </div>
      <div className="pad" style={{ paddingBottom: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button className="btn btn-primary btn-lg" onClick={back}>Save</button>
      </div>
      {editing && (
        <EditKeyboard label={LABELS[editing]} value={form[editing] || ''} mono={editing === 'mcc' || editing === 'mnc'}
          onCommit={(nv) => setForm((f) => ({ ...f, [editing]: nv }))} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}

/* ============================================================
   WI-FI DETAIL — connect / network info
   ============================================================ */
function WifiDetailScreen({ ctx }) {
  const { back } = ctx;
  const net = DEVICE.wifi || { name: 'Wi-Fi', signal: 'Good', on: false };
  const [pw, setPw] = React.useState('');
  const [show, setShow] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  return (
    <div className="body fade-enter">
      <Head title={net.name} sub={net.on ? 'Connected' : 'Wi-Fi Network'} onBack={back} />
      <div className="pad scroll" style={{ flex: 1, paddingBottom: 18 }}>
        {net.on ? (
          <React.Fragment>
            <Group>
              <ParamRow label="Status" value="Connected" />
              <ParamRow label="Signal" value={net.signal} />
              <ParamRow label="Security" value="WPA2" />
              <ParamRow label="IP address" value="10.7.3.42" mono />
              <ParamRow label="Gateway" value="10.7.3.1" mono />
              <ParamRow label="Link speed" value="120 Mbps" mono last />
            </Group>
            <div className="pad" style={{ padding: 0, display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
              <button className="btn btn-danger btn-lg" onClick={back}>Forget Network</button>
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div style={{ fontSize: 12.5, color: 'var(--text-faint)', margin: '2px 2px 14px' }}>{net.signal} Signal · Secured With WPA2</div>
            <span style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 8 }}>Password</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setEditing(true)} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface-2)', border: '1px solid var(--line-2)', borderRadius: 11, padding: '12px 13px', color: 'var(--text)', font: 'inherit', fontSize: 14, fontWeight: 600, textAlign: 'left', cursor: 'pointer' }}>
                <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: show ? 0 : '0.12em', color: pw ? 'var(--text)' : 'var(--text-faint)' }}>{pw ? (show ? pw : '•'.repeat(pw.length)) : 'Enter Wi-Fi Password'}</span>
                <Icon.pencil style={{ width: 14, height: 14, color: 'var(--text-faint)', flexShrink: 0 }} />
              </button>
              <button onClick={() => setShow((s) => !s)} aria-label="Show password" style={{ width: 46, borderRadius: 11, background: 'var(--surface-2)', border: '1px solid var(--line-2)', display: 'grid', placeItems: 'center', color: 'var(--text-dim)' }}>
                {React.createElement(Icon[show ? 'eyeOff' : 'eye'], { style: { width: 18, height: 18 } })}
              </button>
            </div>
          </React.Fragment>
        )}
      </div>
      {!net.on && (
        <div className="pad" style={{ paddingBottom: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="btn btn-primary btn-lg" disabled={pw.length < 4} onClick={back}>Connect</button>
          <button className="btn btn-ghost" onClick={back}>Cancel</button>
        </div>
      )}
      {editing && (
        <EditKeyboard label="Wi-Fi Password" value={pw}
          onCommit={(nv) => setPw(nv)} onClose={() => setEditing(false)} />
      )}
    </div>
  );
}

/* ============================================================
   CARD READERS
   ============================================================ */
function CardReadersScreen({ ctx }) {
  const { back, merchant } = ctx;
  const [r, setR] = React.useState({ nfc: true, chip: true, mag: true });
  const tog = (k) => setR((s) => ({ ...s, [k]: !s[k] }));
  const readers = [
    { k: 'nfc', icon: 'contactless', label: 'Contactless (NFC)', sub: 'Tap cards & phone wallets' },
    { k: 'chip', icon: 'chip', label: 'Chip (EMV)', sub: 'Insert chip cards' },
    { k: 'mag', icon: 'swipe', label: 'Magstripe', sub: 'Swipe legacy cards' },
  ];
  return (
    <div className="body fade-enter">
      <Head title="Card Readers" sub={merchant} onBack={back} />
      <div className="pad scroll" style={{ flex: 1, paddingBottom: 18 }}>
        <Group title="Accepted Methods">
          {readers.map((it, i) => (
            <div key={it.k} className="kv" style={{ borderBottom: i === readers.length - 1 ? 'none' : undefined }}>
              <div className="kv-ic">{React.createElement(Icon[it.icon])}</div>
              <div className="kv-main"><b>{it.label}</b><span>{it.sub}</span></div>
              <Toggle on={r[it.k]} onClick={() => tog(it.k)} />
            </div>
          ))}
        </Group>
        <Group title="Reader Status">
          <ParamRow label="EMV Kernel" value="L2 v2.9" />
          <ParamRow label="Contactless Kernels" value="Visa · MC · Amex" />
          <ParamRow label="Last Diagnostic" value="Today · Passed" last />
        </Group>
      </div>
    </div>
  );
}

/* ============================================================
   LANGUAGE & CURRENCY
   ============================================================ */
function LanguageScreen({ ctx }) {
  const { back, merchant } = ctx;
  const [lang, setLang] = React.useState('en');
  const [cur, setCur] = React.useState('USD');
  const langs = [{ v: 'en', label: 'English' }, { v: 'ar', label: 'العربية' }, { v: 'fr', label: 'Français' }];
  return (
    <div className="body fade-enter">
      <Head title="Language & Currency" sub={merchant} onBack={back} />
      <div className="pad scroll" style={{ flex: 1, paddingBottom: 18 }}>
        <Group title="Display Language">
          {langs.map((l, i) => (
            <button key={l.v} className="kv" style={{ borderBottom: i === langs.length - 1 ? 'none' : undefined }} onClick={() => setLang(l.v)}>
              <div className="kv-ic"><Icon.globe /></div>
              <div className="kv-main"><b style={{ fontWeight: 600 }}>{l.label}</b></div>
              {lang === l.v ? <Icon.check style={{ width: 20, height: 20, color: 'var(--blue-2)' }} /> : null}
            </button>
          ))}
        </Group>
        <Group title="Default Currency">
          <div className="kv" style={{ borderBottom: 'none' }}>
            <div className="kv-main"><b style={{ fontWeight: 600 }}>Charge In</b><span>Customer Can Switch At Checkout</span></div>
            <Seg value={cur} onChange={setCur} options={[{ v: 'USD', label: 'USD' }, { v: 'LBP', label: 'LBP' }]} />
          </div>
        </Group>
        <Group title="Exchange Rate">
          <ParamRow label="1 USD" value="89,500 LBP" mono />
          <ParamRow label="Rate Source" value="Daily · Auto" last />
        </Group>
      </div>
    </div>
  );
}

/* ============================================================
   CRYPTO ACCEPTANCE
   ============================================================ */
function CryptoSettingsScreen({ ctx }) {
  const { back, merchant } = ctx;
  const [on, setOn] = React.useState({ btc: true, eth: true, usdt: true, usdc: false });
  const tog = (k) => setOn((s) => ({ ...s, [k]: !s[k] }));
  const coins = [
    { k: 'btc', label: 'Bitcoin', sym: 'BTC', net: 'Bitcoin Network', color: '#f7931a' },
    { k: 'eth', label: 'Ethereum', sym: 'ETH', net: 'ERC-20', color: '#627eea' },
    { k: 'usdt', label: 'Tether', sym: 'USDT', net: 'TRC-20', color: '#26a17b' },
    { k: 'usdc', label: 'USD Coin', sym: 'USDC', net: 'ERC-20', color: '#2775ca' },
  ];
  const [conv, setConv] = React.useState(true);
  return (
    <div className="body fade-enter">
      <Head title="Crypto Acceptance" sub={merchant} onBack={back} />
      <div className="pad scroll" style={{ flex: 1, paddingBottom: 18 }}>
        <Group title="Accepted Coins">
          {coins.map((c, i) => (
            <div key={c.k} className="kv" style={{ borderBottom: i === coins.length - 1 ? 'none' : undefined }}>
              <div className="kv-ic" style={{ background: c.color, color: '#fff', fontWeight: 800, fontSize: 12, fontFamily: 'var(--font-mono, monospace)' }}>{c.sym.slice(0, 1)}</div>
              <div className="kv-main"><b>{c.label} <span style={{ color: 'var(--text-faint)', fontWeight: 600 }}>· {c.sym}</span></b><span>{c.net}</span></div>
              <Toggle on={on[c.k]} onClick={() => tog(c.k)} />
            </div>
          ))}
        </Group>
        <Group title="Settlement">
          <div className="kv" style={{ borderBottom: 'none' }}>
            <div className="kv-main"><b>Auto-Convert To USD</b><span>Settle Crypto As Fiat</span></div>
            <Toggle on={conv} onClick={() => setConv(!conv)} />
          </div>
        </Group>
      </div>
    </div>
  );
}

/* ============================================================
   BATCH & SETTLEMENT
   ============================================================ */
function BatchSettingsScreen({ ctx }) {
  const { back, startSettlement, merchant } = ctx;
  const [auto, setAuto] = React.useState(true);
  return (
    <div className="body fade-enter">
      <Head title="Batch & Settlement" sub={merchant} onBack={back} />
      <div className="pad scroll" style={{ flex: 1, paddingBottom: 18 }}>
        <Group title="Current Batch">
          <ParamRow label="Batch Number" value="000002" mono />
          <ParamRow label="Open Transactions" value="56" mono />
          <ParamRow label="Batch Total" value="$1,284.50" mono last />
        </Group>
        <Group title="Auto Settlement">
          <div className="kv">
            <div className="kv-main"><b>Enable Auto-Close</b><span>Close Batch Automatically</span></div>
            <Toggle on={auto} onClick={() => setAuto(!auto)} />
          </div>
          <ParamRow label="Close Time" value="11:00 PM" onClick={() => {}} last />
        </Group>
      </div>
      <div className="pad" style={{ paddingBottom: 24 }}>
        <button className="btn btn-primary btn-lg" onClick={startSettlement}>Settle Now</button>
      </div>
    </div>
  );
}

/* ============================================================
   DATE & TIME
   ============================================================ */
function DateTimeScreen({ ctx }) {
  const { back, merchant } = ctx;
  const [auto, setAuto] = React.useState(DEVICE.autoTime);
  const [date, setDate] = React.useState(DEVICE.date);
  const [time, setTime] = React.useState(DEVICE.time);
  const [tz, setTz] = React.useState(DEVICE.tz || 'Beirut (GMT+3)');
  const [sheet, setSheet] = React.useState(null); // 'date' | 'time' | 'tz'
  const setA = (v) => { DEVICE.autoTime = v; setAuto(v); };
  const fmt = (d) => { try { return new Date(d + 'T00:00').toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' }); } catch (e) { return d; } };
  const TZS = ['Beirut (GMT+3)', 'Dubai (GMT+4)', 'Riyadh (GMT+3)', 'Cairo (GMT+2)', 'Istanbul (GMT+3)', 'London (GMT+0)', 'Paris (GMT+1)', 'New York (GMT-5)'];
  const rowStyle = (dim) => ({ cursor: dim ? 'default' : 'pointer', opacity: dim ? 0.45 : 1 });
  return (
    <div className="body fade-enter">
      <Head title="Date & Time" sub={merchant} onBack={back} />
      <div className="pad scroll" style={{ flex: 1, paddingBottom: 18 }}>
        <Group>
          <div className="kv">
            <div className="kv-ic"><Icon.clock /></div>
            <div className="kv-main"><b>Automatic</b><span>Sync From Network</span></div>
            <Toggle on={auto} onClick={() => setA(!auto)} />
          </div>
        </Group>

        <Group title="Set Manually">
          <button className="kv" style={rowStyle(auto)} disabled={auto} onClick={() => setSheet('date')}>
            <div className="kv-main"><b style={{ fontWeight: 600 }}>Date</b><span>{fmt(date)}</span></div>
            <Icon.chev className="chev" style={{ width: 15, height: 15 }} />
          </button>
          <button className="kv" style={{ ...rowStyle(auto), borderBottom: 'none' }} disabled={auto} onClick={() => setSheet('time')}>
            <div className="kv-main"><b style={{ fontWeight: 600 }}>Time</b><span className="num">{time} · 24-Hour</span></div>
            <Icon.chev className="chev" style={{ width: 15, height: 15 }} />
          </button>
        </Group>

        <Group title="Time Zone">
          <button className="kv" style={{ cursor: 'pointer', borderBottom: 'none' }} onClick={() => setSheet('tz')}>
            <div className="kv-main"><b style={{ fontWeight: 600 }}>Time Zone</b><span>{tz}</span></div>
            <Icon.chev className="chev" style={{ width: 15, height: 15 }} />
          </button>
        </Group>
      </div>

      {sheet === 'date' && <CalendarSheet value={date} onPick={(d) => { setDate(d); DEVICE.date = d; }} onClose={() => setSheet(null)} />}
      {sheet === 'time' && <TimeSheet value={time} onPick={(t) => { setTime(t); DEVICE.time = t; }} onClose={() => setSheet(null)} />}
      {sheet === 'tz' && (
        <PickSheet title="Select Time Zone" options={TZS} value={tz} onPick={(v) => { setTz(v); DEVICE.tz = v; }} onClose={() => setSheet(null)} />
      )}
    </div>
  );
}

/* in-screen list selector sheet */
function PickSheet({ title, options, value, onPick, onClose }) {
  return (
    <div className="kbsheet-back" onClick={onClose}>
      <div className="kbsheet" onClick={(e) => e.stopPropagation()}>
        <div className="kbsheet-label">{title}</div>
        <div style={{ maxHeight: 320, overflowY: 'auto' }}>
          {options.map((o) => (
            <button key={o} className="kv" style={{ cursor: 'pointer', width: '100%' }} onClick={() => { onPick(o); onClose(); }}>
              <div className="kv-main"><b style={{ fontWeight: 600 }}>{o}</b></div>
              {value === o ? <Icon.check style={{ width: 19, height: 19, color: 'var(--blue-2)' }} /> : null}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* in-screen calendar sheet */
function CalendarSheet({ value, onPick, onClose }) {
  const init = (() => { try { return new Date(value + 'T00:00'); } catch (e) { return new Date(); } })();
  const [view, setView] = React.useState({ y: init.getFullYear(), m: init.getMonth() });
  const [sel, setSel] = React.useState(value);
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const first = new Date(view.y, view.m, 1).getDay();
  const days = new Date(view.y, view.m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < first; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);
  const iso = (d) => `${view.y}-${String(view.m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const move = (delta) => setView((v) => { const m = v.m + delta; return { y: v.y + Math.floor(m / 12), m: (m % 12 + 12) % 12 }; });
  return (
    <div className="kbsheet-back" onClick={onClose}>
      <div className="kbsheet" onClick={(e) => e.stopPropagation()}>
        <div className="cal-head">
          <button className="cal-nav" onClick={() => move(-1)}><Icon.back style={{ width: 18, height: 18 }} /></button>
          <span>{MONTHS[view.m]} {view.y}</span>
          <button className="cal-nav" onClick={() => move(1)}><Icon.chev style={{ width: 18, height: 18 }} /></button>
        </div>
        <div className="cal-grid cal-dow">{['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={i}>{d}</span>)}</div>
        <div className="cal-grid">
          {cells.map((d, i) => d ? (
            <button key={i} className={'cal-day' + (sel === iso(d) ? ' on' : '')} onClick={() => setSel(iso(d))}>{d}</button>
          ) : <span key={i} />)}
        </div>
        <button className="btn btn-primary" style={{ width: '100%', marginTop: 16 }} onClick={() => { onPick(sel); onClose(); }}>Set Date</button>
      </div>
    </div>
  );
}

/* in-screen time stepper sheet */
function TimeSheet({ value, onPick, onClose }) {
  const [h, setH] = React.useState(parseInt((value || '12:00').split(':')[0], 10));
  const [m, setM] = React.useState(parseInt((value || '12:00').split(':')[1], 10));
  const wrap = (n, max) => (n + max) % max;
  const pad = (n) => String(n).padStart(2, '0');
  return (
    <div className="kbsheet-back" onClick={onClose}>
      <div className="kbsheet" onClick={(e) => e.stopPropagation()}>
        <div className="kbsheet-label">Set Time · 24-Hour</div>
        <div className="time-stepper">
          <div className="ts-col">
            <button onClick={() => setH((x) => wrap(x + 1, 24))}><Icon.chev style={{ width: 20, height: 20, transform: 'rotate(-90deg)' }} /></button>
            <div className="ts-val num">{pad(h)}</div>
            <button onClick={() => setH((x) => wrap(x - 1, 24))}><Icon.chev style={{ width: 20, height: 20, transform: 'rotate(90deg)' }} /></button>
          </div>
          <div className="ts-colon">:</div>
          <div className="ts-col">
            <button onClick={() => setM((x) => wrap(x + 1, 60))}><Icon.chev style={{ width: 20, height: 20, transform: 'rotate(-90deg)' }} /></button>
            <div className="ts-val num">{pad(m)}</div>
            <button onClick={() => setM((x) => wrap(x - 1, 60))}><Icon.chev style={{ width: 20, height: 20, transform: 'rotate(90deg)' }} /></button>
          </div>
        </div>
        <button className="btn btn-primary" style={{ width: '100%', marginTop: 18 }} onClick={() => { onPick(`${pad(h)}:${pad(m)}`); onClose(); }}>Set Time</button>
      </div>
    </div>
  );
}

/* ============================================================
   DISPLAY & SOUND — brightness + volume
   ============================================================ */
function DisplaySoundScreen({ ctx }) {
  const { back, merchant } = ctx;
  const [bright, setBright] = React.useState(DEVICE.brightness);
  const [vol, setVol] = React.useState(DEVICE.volume);
  return (
    <div className="body fade-enter">
      <Head title="Display & Sound" sub={merchant} onBack={back} />
      <div className="pad scroll" style={{ flex: 1, paddingBottom: 18 }}>
        <Group title="Brightness">
          <div className="kv" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 14, borderBottom: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <Icon.sun style={{ width: 22, height: 22, color: 'var(--text-dim)', flexShrink: 0 }} />
              <input className="sl" type="range" min="10" max="100" value={bright}
                onChange={(e) => { const v = +e.target.value; setBright(v); DEVICE.brightness = v; }} />
              <span className="kv-val num" style={{ width: 40, textAlign: 'right' }}>{bright}%</span>
            </div>
          </div>
        </Group>

        <Group title="Volume">
          <div className="kv" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 14, borderBottom: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <Icon.volume style={{ width: 22, height: 22, color: 'var(--text-dim)', flexShrink: 0 }} />
              <input className="sl" type="range" min="0" max="100" value={vol}
                onChange={(e) => { const v = +e.target.value; setVol(v); DEVICE.volume = v; }} />
              <span className="kv-val num" style={{ width: 40, textAlign: 'right' }}>{vol}%</span>
            </div>
          </div>
        </Group>

        <Group title="Sound">
          <div className="kv"><div className="kv-main"><b>Beep On Card Read</b></div><Toggle on={true} onClick={() => {}} /></div>
          <div className="kv" style={{ borderBottom: 'none' }}><div className="kv-main"><b>Approval Chime</b></div><Toggle on={true} onClick={() => {}} /></div>
        </Group>
      </div>
    </div>
  );
}

/* ============================================================
   SYSTEM SETTINGS — manager-only hub
   ============================================================ */
function SystemSettingsScreen({ ctx }) {
  const { back, go, merchant } = ctx;
  const groups = [
    [
      { label: 'Terminal Parameter', icon: 'sliders', to: 'sysTerminal' },
      { label: 'Communication Parameter', icon: 'link', to: 'sysComm' },
      { label: 'Transaction Management', icon: 'reports', to: 'sysTxn' },
    ],
    [
      { label: 'Other Settings', icon: 'download', to: 'sysOther' },
      { label: 'Operator Management', icon: 'users', to: 'sysOperator' },
    ],
    [
      { label: 'About', icon: 'info', to: 'sysAbout' },
    ],
  ];
  return (
    <div className="body fade-enter">
      <Head title="System Settings" sub={merchant} onBack={back} />
      <div className="pad scroll" style={{ flex: 1, paddingBottom: 18 }}>
        <div className="chip chip-soft" style={{ margin: '0 2px 14px', fontSize: 11 }}><Icon.lock style={{ width: 12, height: 12 }} /> Manager Access · Authorized</div>
        {groups.map((g, gi) => (
          <Group key={gi}>
            {g.map((it, i) => (
              <ParamRow key={it.label} label={it.label} onClick={() => go(it.to)} last={i === g.length - 1} />
            ))}
          </Group>
        ))}
      </div>
    </div>
  );
}

/* ---- parameter lists ---- */
function TerminalParamScreen({ ctx }) {
  const { back, merchant } = ctx;
  const [autoSettle, setAutoSettle] = React.useState(true);
  const [toggles, setToggles] = React.useState({ branch: false, returnSale: false, extraPw: false, qr: false });
  const tog = (k) => setToggles((s) => ({ ...s, [k]: !s[k] }));
  const initial = [
    ['Merchant Name', 'Breidy Naturals'], ['Phone Number', '0123456789', true], ['Merchant ID', '000422000006003', true],
    ['Terminal ID', '00000101', true], ['Acquirer', '461120FFFF', true], ['Merchant Type', '2332342', true],
    ['Default Currency', 'USD'], ['Tips', '10', true], ['LBP No PIN Limit', '8,550,000', true], ['USD No PIN Limit', '80', true],
    ['Automatic Settle', '10', true], ['Automatic Settle Mins', '51', true], ['Pre-Auth Expiry', '10', true],
    ['Serial Number', '000009', true], ['Batch Number', '000002', true], ['Address', 'Beirut'],
    ['Merchant Addr 1', 'PURPL'], ['Merchant Addr 2', 'CTM'], ['Merchant Addr 3', 'BEIRUT-01-666222'],
    ['E-Receipt URL', 'http://10.17.3.110:3000'], ['Key', 'FA48···98FE', true], ['Check Value', '91AB9023', true],
  ];
  const [vals, setVals] = React.useState(() => Object.fromEntries(initial.map(([l, v]) => [l, v])));
  const setVal = (l, v) => setVals((s) => ({ ...s, [l]: v }));
  const rows = initial.slice(0, 10);
  const rows2 = initial.slice(10);
  return (
    <div className="body fade-enter">
      <Head title="Terminal Parameter" sub={merchant} onBack={back} />
      <div className="pad scroll" style={{ flex: 1, paddingBottom: 18 }}>
        <Group>
          {rows.map(([l, v, m]) => <EditRow key={l} label={l} value={vals[l]} mono={m} onChange={(nv) => setVal(l, nv)} />)}
          <div className="kv" style={{ borderBottom: 'none' }}>
            <div className="kv-main"><b style={{ fontWeight: 600 }}>Enable Automatic Settle</b></div>
            <Toggle on={autoSettle} onClick={() => setAutoSettle(!autoSettle)} />
          </div>
        </Group>
        <Group>
          {rows2.map(([l, v, m]) => <EditRow key={l} label={l} value={vals[l]} mono={m} onChange={(nv) => setVal(l, nv)} />)}
          {[['branch', 'Branch'], ['returnSale', 'Return To Sale'], ['extraPw', 'Extra Password Required'], ['qr', 'QR Receipt']].map(([k, l], i, a) => (
            <div key={k} className="kv" style={{ borderBottom: i === a.length - 1 ? 'none' : undefined }}>
              <div className="kv-main"><b style={{ fontWeight: 600 }}>{l}</b></div>
              <Toggle on={toggles[k]} onClick={() => tog(k)} />
            </div>
          ))}
        </Group>
      </div>
    </div>
  );
}

function CommunicationParamScreen({ ctx }) {
  const { back, merchant } = ctx;
  const [ssl, setSsl] = React.useState(false);
  const initial = [
    ['Host IP', '10.7.3.71'], ['Host Port', '9000'], ['Backup Host IP', '127.0.0.1'], ['Backup Host Port', '9000'],
    ['Host IP SIM', '127.0.0.1'], ['Host Port SIM', '9000'], ['Backup Host IP SIM', '127.0.0.1'], ['Backup Host Port SIM', '9000'],
    ['TPDU', '6000020000'], ['NII', '002'],
  ];
  const [vals, setVals] = React.useState(() => Object.fromEntries(initial.map(([l, v]) => [l, v])));
  const setVal = (l, v) => setVals((s) => ({ ...s, [l]: v }));
  return (
    <div className="body fade-enter">
      <Head title="Communication Parameter" sub={merchant} onBack={back} />
      <div className="pad scroll" style={{ flex: 1, paddingBottom: 18 }}>
        <Group>
          {initial.map(([l, v]) => <EditRow key={l} label={l} value={vals[l]} mono onChange={(nv) => setVal(l, nv)} />)}
        </Group>
        <Group>
          <div className="kv" style={{ borderBottom: 'none' }}>
            <div className="kv-main"><b style={{ fontWeight: 600 }}>SSL Communication</b><span>Encrypt Host Connection</span></div>
            <Toggle on={ssl} onClick={() => setSsl(!ssl)} />
          </div>
        </Group>
      </div>
    </div>
  );
}

function TransactionMgmtScreen({ ctx }) {
  const { back, go, merchant } = ctx;
  const [st, setSt] = React.useState({ esig: 'close', autoCheckout: 'open', revoke: 'open', cardCancel: 'open', preauth: 'close' });
  const set = (k, v) => setSt((s) => ({ ...s, [k]: v }));
  const segOpts = [{ v: 'open', label: 'Open' }, { v: 'close', label: 'Close' }];
  const segs = [
    ['esig', 'Electronic Signature'], ['autoCheckout', 'Automatic Checkout After Settlement'],
    ['revoke', 'Consumption Revocation Free'], ['cardCancel', 'Card For Cancellation Of Consumption'], ['preauth', 'Pre-Auth Completed'],
  ];
  const numsInit = [['Number Of Positive Retransmissions', '3'], ['Maximum Number Of Transactions', '500'], ['Consumption Return Limit', '1000'], ['Electronic Cash Transaction Limit', '800']];
  const [vals, setVals] = React.useState(() => Object.fromEntries(numsInit.map(([l, v]) => [l, v])));
  const setVal = (l, v) => setVals((s) => ({ ...s, [l]: v }));
  const [clear, setClear] = React.useState(null); // 'confirm' | 'done'
  return (
    <div className="body fade-enter">
      <Head title="Transaction Management" sub={merchant} onBack={back} />
      <div className="pad scroll" style={{ flex: 1, paddingBottom: 18 }}>
        <Group>
          {segs.map(([k, l], i) => (
            <div key={k} className="kv" style={{ borderBottom: i === segs.length - 1 ? 'none' : undefined }}>
              <div className="kv-main"><b style={{ fontWeight: 600 }}>{l}</b></div>
              <Seg value={st[k]} onChange={(v) => set(k, v)} options={segOpts} />
            </div>
          ))}
        </Group>
        <Group>
          <ParamRow label="Clear Transaction Flow" onClick={() => setClear('confirm')} />
          {numsInit.map(([l, v], i) => <EditRow key={l} label={l} value={vals[l]} mono onChange={(nv) => setVal(l, nv)} last={i === numsInit.length - 1} />)}
        </Group>
      </div>
      {clear && (
        <div className="kbsheet-back" onClick={() => clear === 'done' && setClear(null)} style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div className="run-card" onClick={(e) => e.stopPropagation()}>
            {clear === 'confirm' ? (
              <React.Fragment>
                <div className="run-check" style={{ background: 'color-mix(in srgb, var(--red) 16%, transparent)', color: 'var(--red)' }}><Icon.refund style={{ width: 30, height: 30 }} /></div>
                <div className="run-title">Clear Transaction Flow?</div>
                <div className="run-sub">This Removes All Pending Flow Records On This Terminal.</div>
                <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                  <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setClear(null)}>Cancel</button>
                  <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => setClear('done')}>Clear</button>
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div className="run-check"><Icon.check style={{ width: 34, height: 34 }} /></div>
                <div className="run-title">Transaction Flow Cleared</div>
                <button className="btn btn-primary" style={{ marginTop: 18, width: '100%' }} onClick={() => setClear(null)}>Done</button>
              </React.Fragment>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function OtherSettingsScreen({ ctx }) {
  const { back, merchant } = ctx;
  const tiles = [
    { id: 'keys', label: 'IC Public Keys Downloading', sub: 'Download EMV CA public keys', icon: 'shield', bg: 'linear-gradient(150deg,#3fb56e,#2e9e57)', run: 'Downloading CA public keys…', ok: '32 CA keys updated' },
    { id: 'icparam', label: 'IC Parameter Downloading', sub: 'Sync EMV terminal parameters', icon: 'download', bg: 'linear-gradient(150deg,#2f74d0,#2a6fdb)', run: 'Syncing EMV parameters…', ok: 'Parameters up to date' },
    { id: 'signin', label: 'Sign In', sub: 'Operator authentication', icon: 'user', bg: 'linear-gradient(150deg,#18a4e8,#1488d0)', run: 'Authenticating operator…', ok: 'Signed in as Manager' },
    { id: 'qps', label: 'QPS Parameter Downloading', sub: 'Sync QuickPass parameters', icon: 'crypto', bg: 'linear-gradient(150deg,#7b61d6,#5a43c4)', run: 'Downloading QuickPass config…', ok: 'QuickPass synced' },
  ];
  const [active, setActive] = React.useState(null); // {tile, phase}
  const runTile = (t) => {
    setActive({ tile: t, phase: 'run' });
    setTimeout(() => setActive({ tile: t, phase: 'ok' }), 1800);
  };
  return (
    <div className="body fade-enter">
      <Head title="Other Settings" sub={merchant} onBack={back} />
      <div className="pad scroll" style={{ flex: 1, paddingBottom: 18, paddingTop: 8 }}>
        <div className="bigrows">
          {tiles.map((t) => (
            <button key={t.id} className="bigrow" onClick={() => runTile(t)}>
              <div className="br-ic" style={{ background: t.bg }}>{React.createElement(Icon[t.icon])}</div>
              <div className="br-main"><b>{t.label}</b><span>{t.sub}</span></div>
              <Icon.chev className="chev" style={{ width: 17, height: 17 }} />
            </button>
          ))}
        </div>
      </div>
      {active && (
        <div className="kbsheet-back" onClick={() => active.phase === 'ok' && setActive(null)} style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div className="run-card" onClick={(e) => e.stopPropagation()}>
            {active.phase === 'run' ? (
              <React.Fragment>
                <div className="run-spinner" />
                <div className="run-title">{active.tile.run}</div>
                <div className="run-sub">{active.tile.label}</div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div className="run-check"><Icon.check style={{ width: 34, height: 34 }} /></div>
                <div className="run-title">{active.tile.ok}</div>
                <button className="btn btn-primary" style={{ marginTop: 18, width: '100%' }} onClick={() => setActive(null)}>Done</button>
              </React.Fragment>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function OperatorMgmtScreen({ ctx }) {
  const { back, go, merchant } = ctx;
  const items = [
    { label: 'Teller Management', sub: 'Add Or Remove Tellers', icon: 'users', fn: () => go('tellerMgmt') },
    { label: 'Supervisor Change', sub: 'Reassign Supervisor', icon: 'user', fn: () => go('supervisorChange') },
    { label: 'Manager Password Change', sub: 'Update Manager PIN', icon: 'key', fn: () => go('changePin') },
  ];
  return (
    <div className="body fade-enter">
      <Head title="Operator Management" sub={merchant} onBack={back} />
      <div className="pad scroll" style={{ flex: 1, paddingBottom: 18 }}>
        <Group>
          {items.map((it, i) => (
            <KV key={it.label} icon={it.icon} label={it.label} sub={it.sub} onClick={it.fn || (() => {})}>
              <Icon.chev className="chev" style={{ width: 15, height: 15 }} />
            </KV>
          ))}
        </Group>
      </div>
    </div>
  );
}

/* ---- Teller Management: list of operators with add / remove ---- */
function TellerMgmtScreen({ ctx }) {
  const { back, merchant } = ctx;
  const [tellers, setTellers] = React.useState([
    { id: '01', name: 'Layla Breidy', role: 'Cashier', active: true },
    { id: '02', name: 'Karim Haddad', role: 'Cashier', active: true },
    { id: '03', name: 'Rana Khoury', role: 'Cashier', active: false },
  ]);
  const remove = (id) => setTellers((t) => t.filter((x) => x.id !== id));
  const toggle = (id) => setTellers((t) => t.map((x) => x.id === id ? { ...x, active: !x.active } : x));
  const add = () => {
    const n = tellers.length + 1;
    setTellers((t) => [...t, { id: String(n).padStart(2, '0'), name: 'New Teller ' + n, role: 'Cashier', active: true }]);
  };
  return (
    <div className="body fade-enter">
      <Head title="Teller Management" sub={merchant} onBack={back} />
      <div className="pad scroll" style={{ flex: 1, paddingBottom: 18 }}>
        <Group title={tellers.length + ' Operators'}>
          {tellers.map((t, i) => (
            <div key={t.id} className="kv" style={{ borderBottom: i === tellers.length - 1 ? 'none' : undefined }}>
              <div className="kv-ic" style={{ background: t.active ? 'color-mix(in srgb, var(--blue) 16%, transparent)' : 'var(--surface-2)', color: t.active ? 'var(--blue-2)' : 'var(--text-faint)' }}><Icon.user /></div>
              <div className="kv-main" style={{ minWidth: 0 }}><b>{t.name}</b><span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>ID {t.id} · {t.role}</span></div>
              <Toggle on={t.active} onClick={() => toggle(t.id)} />
              <button onClick={() => remove(t.id)} aria-label="Remove" style={{ marginLeft: 12, width: 30, height: 30, borderRadius: 9, display: 'grid', placeItems: 'center', background: 'color-mix(in srgb, var(--red) 14%, transparent)', color: 'var(--red)', flexShrink: 0 }}>
                <Icon.x style={{ width: 16, height: 16 }} />
              </button>
            </div>
          ))}
        </Group>
      </div>
      <div className="pad save-bar">
        <button className="btn btn-primary btn-lg" onClick={add} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9 }}><Icon.plus style={{ width: 19, height: 19 }} /> Add Teller</button>
      </div>
    </div>
  );
}

/* ---- Supervisor Change: pick the active supervisor ---- */
function SupervisorChangeScreen({ ctx }) {
  const { back, merchant } = ctx;
  const people = [
    { id: '00', name: 'Sami Breidy', role: 'Owner' },
    { id: '01', name: 'Layla Breidy', role: 'Senior Cashier' },
    { id: '02', name: 'Karim Haddad', role: 'Cashier' },
  ];
  const [sel, setSel] = React.useState('00');
  return (
    <div className="body fade-enter">
      <Head title="Supervisor Change" sub={merchant} onBack={back} />
      <div className="pad scroll" style={{ flex: 1, paddingBottom: 18 }}>
        <Group title="Assign Supervisor">
          {people.map((p, i) => (
            <button key={p.id} className="kv" style={{ borderBottom: i === people.length - 1 ? 'none' : undefined }} onClick={() => setSel(p.id)}>
              <div className="kv-ic"><Icon.user /></div>
              <div className="kv-main"><b style={{ fontWeight: 600 }}>{p.name}</b><span>ID {p.id} · {p.role}</span></div>
              {sel === p.id ? <Icon.check style={{ width: 20, height: 20, color: 'var(--blue-2)' }} /> : null}
            </button>
          ))}
        </Group>
      </div>
    </div>
  );
}

function AboutScreen({ ctx }) {
  const { back, dark, merchant } = ctx;
  const rows = [
    ['Model', 'TOPWISE T6D'], ['POS OS', 'Big Pay OS v3.2.1'], ['Serial number', '000009', true],
    ['Terminal ID', '00000101', true], ['Merchant ID', '000422000006003', true], ['EMV kernel', 'L2 v2.9'],
    ['Firmware', '1.04.221', true], ['Last settlement', 'Today · 11:00 PM'],
  ];
  return (
    <div className="body fade-enter">
      <Head title="About" sub={merchant} onBack={back} />
      <div className="pad scroll" style={{ flex: 1, paddingBottom: 18 }}>
        <div style={{ textAlign: 'center', padding: '14px 0 22px' }}>
          <img src={dark ? window.BP_LOGO_DARK : window.BP_LOGO} alt="Big Pay" style={{ width: 240, maxWidth: '70%', height: 'auto', display: 'inline-block' }} />
        </div>
        <Group>
          {rows.map(([l, v, m], i) => <ParamRow key={l} label={l} value={v} mono={m} last={i === rows.length - 1} />)}
        </Group>
        <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-faint)', marginTop: 6 }}>© 2026 Big Pay SAL · All rights reserved</div>
      </div>
    </div>
  );
}

/* ============================================================
   MERCHANT PROFILE — editable; name shows on home/idle
   ============================================================ */
function MerchantProfileScreen({ ctx }) {
  const { back, merchantInfo, setMerchantInfo } = ctx;
  const [form, setForm] = React.useState(merchantInfo);
  const [editing, setEditing] = React.useState(null);
  const fields = [['name', 'Business Name'], ['address', 'Address'], ['phone', 'Phone Number'], ['mid', 'Merchant ID']];
  const save = () => { setMerchantInfo(form); back(); };
  return (
    <div className="body fade-enter">
      <Head title="Merchant Profile" sub={merchantInfo.name} onBack={back} />
      <div className="pad scroll" style={{ flex: 1, paddingBottom: 18 }}>
        <div style={{ fontSize: 12, color: 'var(--text-faint)', margin: '2px 2px 16px' }}>These Details Appear On The Idle Screen And Printed Receipts.</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {fields.map(([k, label]) => {
            const locked = k === 'mid';
            return (
              <div key={k}>
                <span style={{ display: 'block', fontSize: 11.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 8 }}>{label}</span>
                <button onClick={() => !locked && setEditing(k)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface-2)', border: '1px solid var(--line-2)', borderRadius: 11, padding: '13px 14px', color: 'var(--text)', font: 'inherit', fontSize: 15, fontWeight: 600, textAlign: 'left', cursor: locked ? 'default' : 'pointer', opacity: locked ? 0.6 : 1 }}>
                  <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{form[k] || ''}</span>
                  {!locked && <Icon.pencil className="kv-pencil" style={{ width: 15, height: 15, margin: 0 }} />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <div className="pad" style={{ paddingBottom: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button className="btn btn-primary btn-lg" onClick={save}>Save Changes</button>
        <button className="btn btn-ghost" onClick={back}>Cancel</button>
      </div>
      {editing && (
        <EditKeyboard
          label={(fields.find(([k]) => k === editing) || [])[1]}
          value={form[editing] || ''}
          mono={editing === 'phone'}
          onCommit={(nv) => setForm((f) => ({ ...f, [editing]: nv }))}
          onClose={() => setEditing(null)} />
      )}
    </div>
  );
}

/* ============================================================
   KIOSK — exit requires manager PIN, then drops to Android
   ============================================================ */
function AndroidNav({ onBack, onExit, onHome }) {
  return (
    <div className="anav">
      <button className="anav-btn" aria-label="Back" onClick={onBack}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M14.5 4 7 12l7.5 8 1.6-1.5L10 12l6.1-6.5z" /></svg>
      </button>
      <button className="anav-btn" aria-label="Exit (manager PIN)" onClick={onExit}>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4"><circle cx="12" cy="12" r="9" /></svg>
      </button>
      <button className="anav-btn" aria-label="App home" onClick={onHome}>
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>
      </button>
    </div>
  );
}

function ExitGateScreen({ ctx }) {
  const { back, managerPin, reset } = ctx;
  const [val, setVal] = React.useState('');
  const [err, setErr] = React.useState('');
  const tap = (d) => {
    if (d === 'del') { setVal((p) => p.slice(0, -1)); return; }
    setVal((p) => {
      if (p.length >= 4) return p;
      const np = p + d;
      if (np.length === 4) setTimeout(() => check(np), 200);
      return np;
    });
  };
  const check = (np) => {
    if (np === managerPin) { reset('androidHome'); }
    else { setErr('Incorrect manager PIN'); setVal(''); }
  };
  const dots = Math.max(4, val.length);
  return (
    <div className="body fade-enter">
      <Head title="Exit Application" sub="Big Pay is locked to this device" onBack={back} />
      <div className="pad" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
        <div className="pin-lock"><Icon.lock style={{ width: 26, height: 26 }} /></div>
        <div style={{ fontSize: 19, fontWeight: 750, textAlign: 'center', maxWidth: 280 }}>Enter Manager PIN to Exit</div>
        <div style={{ fontSize: 12.5, color: 'var(--text-faint)', textAlign: 'center', marginTop: -8 }}>Kiosk mode · closing returns to Android</div>
        <div className="pin-dots">
          {Array.from({ length: dots }).map((_, i) => <span key={i} className={'pin-dot' + (i < val.length ? ' on' : '')} />)}
        </div>
        {err && <div style={{ fontSize: 12.5, color: 'var(--red)' }}>{err}</div>}
      </div>
      <div className="pad" style={{ paddingBottom: 24 }}>
        {React.createElement(window.PinPad, { onTap: tap, onClear: () => setVal('') })}
        <button className="btn btn-primary btn-lg" style={{ marginTop: 12 }} onClick={back}>Stay in App</button>
      </div>
    </div>
  );
}

function AndroidHomeScreen({ ctx }) {
  const { relaunch } = ctx;
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const date = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const apps = [
    { name: 'Big Pay', primary: true },
    { name: 'Settings', icon: 'settings' }, { name: 'Files', icon: 'reports' },
    { name: 'Phone', icon: 'phone' }, { name: 'Camera', icon: 'scan' }, { name: 'Clock', icon: 'clock' },
  ];
  return (
    <div className="ahome">
      <div className="ahome-status"><span>{time.replace(/\s?[AP]M/, '')}</span><span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Icon.wifi style={{ width: 14, height: 14 }} /><Icon.signal style={{ width: 14, height: 14 }} /></span></div>
      <div className="ahome-clock"><div className="t">{time}</div><div className="d">{date}</div></div>
      <div className="ahome-grid">
        {apps.map((a) => (
          <button key={a.name} className="ahome-app" onClick={a.primary ? relaunch : undefined}>
            <span className={'ahome-icon' + (a.primary ? ' bp' : '')}>
              {a.primary
                ? <img src={window.BP_MARK} alt="" style={{ width: '66%', height: '66%', objectFit: 'contain' }} />
                : React.createElement(Icon[a.icon], { style: { width: 26, height: 26, color: '#fff' } })}
            </span>
            <span className="ahome-name">{a.name}</span>
          </button>
        ))}
      </div>
      <div className="ahome-hint">Tap <b>Big Pay</b> to relaunch the terminal</div>
      <div className="anav ahome-nav">
        <button className="anav-btn" aria-label="Back" onClick={relaunch}><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M14.5 4 7 12l7.5 8 1.6-1.5L10 12l6.1-6.5z" /></svg></button>
        <button className="anav-btn" aria-label="Home" onClick={relaunch}><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4"><circle cx="12" cy="12" r="9" /></svg></button>
        <button className="anav-btn" aria-label="Recents" onClick={relaunch}><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4"><rect x="4" y="4" width="16" height="16" rx="2" /></svg></button>
      </div>
    </div>
  );
}

Object.assign(window, {
  ConnectivityScreen, CellularScreen, WifiDetailScreen, DateTimeScreen, DisplaySoundScreen, SystemSettingsScreen,
  CardReadersScreen, LanguageScreen, CryptoSettingsScreen, BatchSettingsScreen,
  TerminalParamScreen, CommunicationParamScreen, TransactionMgmtScreen,
  OtherSettingsScreen, OperatorMgmtScreen, TellerMgmtScreen, SupervisorChangeScreen, AboutScreen,
  MerchantProfileScreen, AndroidNav, ExitGateScreen, AndroidHomeScreen,
});

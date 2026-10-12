import React, { useEffect, useMemo, useState } from 'react'
import {
  Activity, ArrowDownRight, ArrowUpRight, Bell, Building2, CalendarDays, Check,
  ChevronDown, CircleHelp, CreditCard, DoorOpen, Download, FileText, Filter,
  Home, LayoutDashboard, LogOut, Menu, MoreHorizontal, Plus, Search, Settings,
  ShieldCheck, SlidersHorizontal, Sparkles, TrendingUp, Users, Wallet, X,
  Zap, Droplets, Wrench, Clock3, LoaderCircle, LockKeyhole
} from 'lucide-react'
import { isNeonAuthConfigured, neon } from './neon'

const nav = [
  { label: 'Overview', icon: LayoutDashboard, section: 'WORKSPACE' },
  { label: 'Properties', icon: Building2, section: 'WORKSPACE' },
  { label: 'Rooms & Tenants', icon: Users, section: 'WORKSPACE' },
  { label: 'Bills & Expenses', icon: FileText, section: 'MANAGEMENT' },
  { label: 'Finance', icon: Wallet, section: 'MANAGEMENT' },
]
const seedProperties = [
  { id: 'p1', name: 'Marina Residence', location: 'Dubai Marina, Dubai', units: 24, occupied: 21, status: 'Active', color: 'blue' },
  { id: 'p2', name: 'Palm View Apartments', location: 'Al Barsha, Dubai', units: 18, occupied: 16, status: 'Active', color: 'purple' },
  { id: 'p3', name: 'Garden Court', location: 'Khalifa City, Abu Dhabi', units: 12, occupied: 10, status: 'Active', color: 'green' },
]
const seedTenants = [
  { id: 't1', name: 'Sarah Johnson', room: 'MR-204', property: 'Marina Residence', rent: 4200, due: 'Oct 15, 2026', status: 'Paid' },
  { id: 't2', name: 'Ahmed Hassan', room: 'MR-308', property: 'Marina Residence', rent: 3800, due: 'Oct 12, 2026', status: 'Pending' },
  { id: 't3', name: 'Priya Sharma', room: 'PV-106', property: 'Palm View Apartments', rent: 3200, due: 'Oct 10, 2026', status: 'Overdue' },
  { id: 't4', name: 'Daniel Smith', room: 'GC-202', property: 'Garden Court', rent: 2900, due: 'Oct 18, 2026', status: 'Paid' },
]
const seedBills = [
  { id: 'b1', title: 'DEWA Utility Bill', category: 'Utilities', property: 'Marina Residence', amount: 1850, date: 'Oct 08, 2026', status: 'Paid' },
  { id: 'b2', title: 'Elevator Maintenance', category: 'Maintenance', property: 'Palm View Apartments', amount: 750, date: 'Oct 10, 2026', status: 'Pending' },
  { id: 'b3', title: 'Water Supply', category: 'Utilities', property: 'Garden Court', amount: 420, date: 'Oct 11, 2026', status: 'Pending' },
]
const money = n => new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(Number(n || 0))
const initials = s => String(s || 'GH').split(' ').map(x => x[0]).join('').slice(0,2).toUpperCase()

function AuthScreen({ onDemo }) {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const submit = async e => {
    e.preventDefault(); setError('')
    if (!isNeonAuthConfigured) { setError('Configure Neon Auth in your environment first, or open Demo mode to explore the interface.'); return }
    setBusy(true)
    try {
      const result = mode === 'signin'
        ? await neon.auth.signInWithPassword({ email, password })
        : await neon.auth.signUp({ email, password, options: { data: { name, full_name: name } } })
      if (result.error) throw result.error
      if (mode === 'signup' && !result.data.session) setError('Account created. Check your email to confirm, then sign in.')
    } catch (err) { setError(err.message || 'Unable to authenticate.') }
    finally { setBusy(false) }
  }
  return <div className="auth-wrap">
    <div className="auth-visual">
      <div className="brand brand-light"><div className="brand-mark"><Home size={20}/></div><span>glossy<span className="brand-thin">home</span></span></div>
      <div className="auth-hero-copy"><div className="eyebrow"><Sparkles size={14}/> PROPERTY, PERFECTED</div><h1>A clearer view of<br/>your property portfolio.</h1><p>One calm, connected workspace for every property, resident and payment.</p></div>
      <div className="visual-stats"><div><span>Portfolio visibility</span><strong>All in one place</strong></div><div className="visual-stat-icon"><TrendingUp size={20}/></div></div>
      <div className="auth-orbit orbit-one"></div><div className="auth-orbit orbit-two"></div>
    </div>
    <div className="auth-panel"><div className="auth-mobile-brand brand"><div className="brand-mark"><Home size={20}/></div><span>glossy<span className="brand-thin">home</span></span></div>
      <div className="auth-form-wrap"><div className="form-kicker">WELCOME TO GLOSSY HOME</div><h2>{mode === 'signin' ? 'Sign in to your workspace' : 'Create your workspace'}</h2><p className="muted">Manage your properties with confidence.</p>
      <form onSubmit={submit} className="auth-form">
        {mode === 'signup' && <label>Full name<input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" required autoComplete="name"/></label>}
        <label>Email address<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" required autoComplete="email"/></label>
        <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters" minLength={8} required autoComplete={mode==='signin'?'current-password':'new-password'}/></label>
        {error && <div className="inline-error">{error}</div>}
        <button className="btn btn-primary btn-full" disabled={busy}>{busy ? <LoaderCircle className="spin" size={17}/> : <LockKeyhole size={16}/>} {mode==='signin'?'Sign in':'Create account'}</button>
      </form>
      <div className="auth-switch">{mode==='signin'?'New to Glossy Home?':'Already have an account?'} <button className="link-button" onClick={()=>{setMode(mode==='signin'?'signup':'signin');setError('')}}>{mode==='signin'?'Create an account':'Sign in'}</button></div>
      <div className="auth-divider"><span>OR</span></div><button className="btn btn-outline btn-full" onClick={onDemo}>Explore demo workspace <ArrowUpRight size={16}/></button>
      <div className="auth-security"><ShieldCheck size={15}/> Your property data stays in your workspace.</div></div>
      <div className="auth-footer">© 2026 Glossy Home · Property management, made clear</div>
    </div>
  </div>
}

function Sidebar({ page, setPage, user, signOut, mobileOpen, setMobileOpen }) {
  const grouped = ['WORKSPACE','MANAGEMENT']
  return <><div className={`sidebar-backdrop ${mobileOpen?'show':''}`} onClick={()=>setMobileOpen(false)}></div><aside className={`sidebar ${mobileOpen?'sidebar-open':''}`}>
    <div className="brand"><div className="brand-mark"><Home size={20}/></div><span>glossy<span className="brand-thin">home</span></span></div>
    <div className="workspace-select"><div className="workspace-avatar">GH</div><div className="workspace-meta"><strong>Glossy Home</strong><span>Property workspace</span></div><ChevronDown size={15}/></div>
    {grouped.map(group=><div className="nav-group" key={group}><div className="nav-label">{group}</div>{nav.filter(n=>n.section===group).map(item=><button key={item.label} className={`nav-item ${page===item.label?'active':''}`} onClick={()=>{setPage(item.label);setMobileOpen(false)}}><item.icon size={18}/><span>{item.label}</span>{item.label==='Bills & Expenses'&&<span className="nav-count">2</span>}</button>)}</div>)}
    <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><CircleHelp size={18}/></div><strong>Need a hand?</strong><p>Explore tips to get the most from your workspace.</p><button onClick={()=>alert('Help centre: connect your support URL here.')}>Visit help centre <ArrowUpRight size={13}/></button></div>
      <button className="nav-item settings-item" onClick={()=>alert('Workspace settings will be available in a future iteration.')}><Settings size={18}/><span>Settings</span></button>
      <div className="sidebar-user"><div className="avatar">{initials(user?.user_metadata?.full_name || user?.name || user?.email || 'GH')}</div><div className="user-meta"><strong>{user?.user_metadata?.full_name || user?.name || user?.email?.split('@')[0] || 'Demo Manager'}</strong><span>{user?.email || 'Demo workspace'}</span></div><button className="icon-button small" title="Sign out" onClick={signOut}><LogOut size={16}/></button></div>
    </div>
  </aside></>
}

function StatCard({ label, value, note, trend, icon: Icon, tone='blue' }) {
  return <div className="stat-card"><div className="stat-top"><span>{label}</span><div className={`stat-icon ${tone}`}><Icon size={18}/></div></div><div className="stat-value">{value}</div><div className="stat-note">{trend && <span className={`trend ${trend.startsWith('-')?'down':''}`}><ArrowUpRight size={13}/>{trend}</span>}<span>{note}</span></div></div>
}
function Status({ value }) { const v=String(value||'Pending').toLowerCase(); return <span className={`status status-${v.replace(/\s+/g,'-')}`}><span className="status-dot"></span>{value||'Pending'}</span> }
function EmptyState({ title, detail }) { return <div className="empty-state"><div className="empty-icon"><FileText size={20}/></div><strong>{title}</strong><p>{detail}</p></div> }

function Modal({ title, onClose, children }) { return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><div className="modal"><div className="modal-head"><h3>{title}</h3><button className="icon-button" onClick={onClose}><X size={18}/></button></div>{children}</div></div> }

function App() {
  const [session, setSession] = useState(null)
  const [authReady, setAuthReady] = useState(!isNeonAuthConfigured)
  const [demo, setDemo] = useState(false)
  const [page, setPage] = useState('Overview')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState('')
  const [properties, setProperties] = useState(seedProperties)
  const [tenants, setTenants] = useState(seedTenants)
  const [bills, setBills] = useState(seedBills)
  const [loadingData, setLoadingData] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isNeonAuthConfigured) return
    let active = true
    neon.auth.getSession().then(({data})=>{ if (active) setSession(data?.session || null) }).catch(()=>{}).finally(()=>{ if (active) setAuthReady(true) })
    const {data:{subscription}} = neon.auth.onAuthStateChange((_event, s)=>{setSession(s);setDemo(false);setAuthReady(true)})
    return ()=>{ active = false; subscription.unsubscribe() }
  }, [])
  const user = session?.user
  useEffect(() => {
    if (!user || !session?.access_token) return
    let alive = true
    const load = async () => {
      setLoadingData(true)
      try {
        const headers = { Authorization: `Bearer ${session.access_token}` }
        const results = await Promise.all([
          fetch('/api/properties', { headers }),
          fetch('/api/tenants', { headers }),
          fetch('/api/bills', { headers }),
        ])
        for (const response of results) {
          if (!response.ok) {
            const payload = await response.json().catch(() => ({}))
            throw new Error(payload.error || 'Could not load workspace data.')
          }
        }
        const [p, t, b] = await Promise.all(results.map(r => r.json()))
        if (!alive) return
        setProperties(p)
        setTenants(t)
        setBills(b)
      } catch (err) {
        if (alive) notify(err.message || 'Could not load workspace data.')
      } finally {
        if (alive) setLoadingData(false)
      }
    }
    load()
    return () => { alive = false }
  }, [user?.id, session?.access_token])
  const signOut = async () => { if (neon) await neon.auth.signOut(); setDemo(false); setSession(null) }
  const notify = msg => { setToast(msg); window.setTimeout(()=>setToast(''), 3200) }
  const isAuthed = Boolean(session || demo)
  const allProperties = properties
  const allTenants = tenants
  const allBills = bills
  const totalUnits = allProperties.reduce((s,p)=>s+Number(p.units||p.total_units||0),0)
  const occupied = allProperties.reduce((s,p)=>s+Number(p.occupied||p.occupied_units||0),0)
  const occupancy = totalUnits ? Math.round(occupied/totalUnits*100) : 0
  const monthlyRent = allTenants.reduce((s,t)=>s+Number(t.rent||t.monthly_rent||0),0)
  const pendingBills = allBills.filter(b=>!['paid','complete','completed'].includes(String(b.status).toLowerCase()))
  const filteredProperties = allProperties.filter(p=>`${p.name} ${p.location||p.address||''}`.toLowerCase().includes(search.toLowerCase()))
  const filteredTenants = allTenants.filter(t=>`${t.name||t.full_name||''} ${t.room||t.room_number||''} ${t.property||t.property_name||''}`.toLowerCase().includes(search.toLowerCase()))
  const filteredBills = allBills.filter(b=>`${b.title||b.name||''} ${b.category||''} ${b.property||b.property_name||''}`.toLowerCase().includes(search.toLowerCase()))

  const saveRecord = async (type, record) => {
    setSaving(true)
    const setters = {properties:setProperties,tenants:setTenants,bills:setBills}
    try {
      if (user && session?.access_token) {
        const response = await fetch(`/api/${type}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
          body: JSON.stringify(record),
        })
        const data = await response.json().catch(() => ({}))
        if (!response.ok) throw new Error(data.error || 'Could not save record.')
        setters[type](old=>[data,...old])
      } else {
        const local = {...record,id:`${type[0]}${Date.now()}`}
        setters[type](old=>[local,...old])
      }
      setModal(null); notify(`${type[0].toUpperCase()+type.slice(1,-1)} added successfully.`)
    } catch (err) { notify(err.message || 'Could not save record.') }
    finally { setSaving(false) }
  }
  const deleteRecord = async (type, id) => {
    if (!confirm('Delete this record? This action cannot be undone.')) return
    const setters = {properties:setProperties,tenants:setTenants,bills:setBills}
    try {
      if (user && session?.access_token) {
        const response = await fetch(`/api/${type}/${encodeURIComponent(id)}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${session.access_token}` },
        })
        const data = await response.json().catch(() => ({}))
        if (!response.ok) throw new Error(data.error || 'Could not delete record.')
      }
      setters[type](old=>old.filter(x=>x.id!==id)); notify('Record deleted.')
    } catch(err) { notify(err.message || 'Could not delete record.') }
  }
  const exportCsv = (rows, name) => {
    if (!rows.length) return notify('There are no records to export.')
    const keys = [...new Set(rows.flatMap(Object.keys))]
    const csv = [keys.join(','), ...rows.map(r=>keys.map(k=>`"${String(r[k]??'').replace(/"/g,'""')}"`).join(','))].join('\n')
    const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'})); const a=document.createElement('a');a.href=url;a.download=`glossy-home-${name}.csv`;a.click();URL.revokeObjectURL(url)
  }
  const openAdd = type => setModal(type)
  if (!authReady) return <div className="loading-screen"><LoaderCircle className="spin" size={24}/> Loading your workspace…</div>
  if (!isAuthed) return <AuthScreen onDemo={()=>{setDemo(true);setPage('Overview')}}/>

  const titleMap = {'Overview':'Good morning, manager','Properties':'Properties','Rooms & Tenants':'Rooms & Tenants','Bills & Expenses':'Bills & Expenses','Finance':'Finance'}
  const subtitleMap = {'Overview':'Here’s what’s happening across your portfolio today.','Properties':'Keep your properties and units organized.','Rooms & Tenants':'A complete view of residents, rooms and occupancy.','Bills & Expenses':'Track bills, utilities and property expenses.','Finance':'Understand income, costs and portfolio performance.'}
  return <div className="app-shell">
    <Sidebar page={page} setPage={setPage} user={user} signOut={signOut} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}/>
    <main className="main-area">
      <header className="topbar"><div className="topbar-left"><button className="icon-button mobile-menu" onClick={()=>setMobileOpen(true)}><Menu size={20}/></button><div className="breadcrumb">Workspace <span>/</span> <strong>{page}</strong></div></div><div className="topbar-actions"><div className="topbar-date"><CalendarDays size={15}/> Monday, October 12, 2026</div><button className="icon-button notification-button" onClick={()=>notify('You’re all caught up.')}><Bell size={18}/><i></i></button><div className="topbar-avatar">{initials(user?.user_metadata?.full_name || user?.name || user?.email || 'GH')}</div></div></header>
      <div className="content-wrap">
        <div className="page-heading"><div><div className="page-kicker"><span className="live-dot"></span> YOUR PORTFOLIO AT A GLANCE</div><h1>{titleMap[page]||page}{page==='Overview'&&<span className="heading-wave">.</span>}</h1><p>{subtitleMap[page]}</p></div><div className="heading-actions"><button className="btn btn-outline" onClick={()=>exportCsv(page==='Properties'?properties:page==='Rooms & Tenants'?tenants:bills,page.toLowerCase().replace(/[^a-z]+/g,'-'))}><Download size={16}/> Export</button><button className="btn btn-primary" onClick={()=>openAdd(page==='Properties'?'properties':page==='Rooms & Tenants'?'tenants':'bills')}><Plus size={17}/> Add {page==='Properties'?'property':page==='Rooms & Tenants'?'tenant':'bill'}</button></div></div>
        {demo && <div className="demo-banner"><Sparkles size={16}/><div><strong>Demo workspace</strong><span>Changes are temporary in this preview. Connect Neon Auth and Neon PostgreSQL to securely save records between sessions.</span></div><button onClick={()=>notify('Follow README.md to connect Neon Auth and Neon PostgreSQL.')}>Set up database <ArrowUpRight size={14}/></button></div>}
        {page==='Overview' && <Dashboard properties={allProperties} tenants={allTenants} bills={allBills} occupancy={occupancy} totalUnits={totalUnits} monthlyRent={monthlyRent} pendingBills={pendingBills} onPage={setPage} onAdd={openAdd} onExport={exportCsv}/>}
        {page==='Properties' && <PropertiesPage rows={filteredProperties} onAdd={()=>openAdd('properties')} onDelete={id=>deleteRecord('properties',id)} onExport={()=>exportCsv(filteredProperties,'properties')}/>}
        {page==='Rooms & Tenants' && <TenantsPage rows={filteredTenants} onAdd={()=>openAdd('tenants')} onDelete={id=>deleteRecord('tenants',id)} onExport={()=>exportCsv(filteredTenants,'tenants')}/>}
        {page==='Bills & Expenses' && <BillsPage rows={filteredBills} onAdd={()=>openAdd('bills')} onDelete={id=>deleteRecord('bills',id)} onExport={()=>exportCsv(filteredBills,'bills')}/>}
        {page==='Finance' && <FinancePage tenants={allTenants} bills={allBills} properties={allProperties} monthlyRent={monthlyRent} pendingBills={pendingBills}/>}
        <footer className="app-footer"><span>© 2026 Glossy Home</span><span><span className="footer-dot"></span>{user?'Secure workspace':'Demo mode'} <span className="footer-sep">·</span> Built for better property management</span></footer>
      </div>
    </main>
    {modal && <RecordModal type={modal} properties={properties} saving={saving} onClose={()=>setModal(null)} onSave={record=>saveRecord(modal,record)}/>}
    {toast && <div className="toast"><Check size={16}/>{toast}</div>}
  </div>
}

function Dashboard({properties,tenants,bills,occupancy,totalUnits,monthlyRent,pendingBills,onPage,onAdd,onExport}) {
  const paid = bills.filter(b=>String(b.status).toLowerCase()==='paid').reduce((s,b)=>s+Number(b.amount||0),0)
  return <div className="dashboard-content">
    <div className="stat-grid">
      <StatCard label="Total properties" value={properties.length} note="Across your portfolio" icon={Building2} tone="blue"/>
      <StatCard label="Occupied units" value={`${occupancy}%`} note={`${tenants.length} tenants currently listed`} icon={DoorOpen} tone="mint" trend="+4.2%"/>
      <StatCard label="Monthly rent roll" value={money(monthlyRent)} note="Expected monthly income" icon={Wallet} tone="violet"/>
      <StatCard label="Outstanding bills" value={money(pendingBills.reduce((s,b)=>s+Number(b.amount||0),0))} note={`${pendingBills.length} items need attention`} icon={CreditCard} tone="orange"/>
    </div>
    <div className="dashboard-grid">
      <section className="panel portfolio-panel"><div className="panel-head"><div><h2>Property portfolio</h2><p>Performance across your properties</p></div><button className="text-action" onClick={()=>onPage('Properties')}>View all <ArrowUpRight size={14}/></button></div>
        {properties.length===0?<EmptyState title="No properties yet" detail="Add your first property to begin building your portfolio."/>:<div className="property-list">{properties.slice(0,4).map((p,i)=>{const units=Number(p.units||p.total_units||0),occ=Number(p.occupied||p.occupied_units||0);return <div className="property-row" key={p.id}><div className={`property-symbol ${['blue','purple','green','orange'][i%4]}`}><Building2 size={19}/></div><div className="property-info"><strong>{p.name}</strong><span>{p.location||p.address||'Location not set'}</span></div><div className="property-occupancy"><div className="occupancy-label"><strong>{units?Math.round(occ/units*100):0}%</strong><span>{occ}/{units} units</span></div><div className="progress-track"><div className="progress-fill" style={{width:`${units?occ/units*100:0}%`}}/></div></div><Status value={p.status||'Active'}/></div>})}</div>}
        <div className="panel-foot"><div className="foot-stat"><span>Total units</span><strong>{totalUnits}</strong></div><div className="foot-stat"><span>Occupied units</span><strong>{properties.reduce((s,p)=>s+Number(p.occupied||p.occupied_units||0),0)}</strong></div><div className="foot-stat"><span>Vacant units</span><strong>{Math.max(0,totalUnits-properties.reduce((s,p)=>s+Number(p.occupied||p.occupied_units||0),0))}</strong></div></div>
      </section>
      <section className="panel insight-panel"><div className="panel-head"><div><h2>Portfolio insights</h2><p>A quick financial snapshot</p></div><div className="insight-icon"><Activity size={18}/></div></div>
        <div className="insight-highlight"><div className="insight-label">Collected bills</div><div className="insight-number">{money(paid)}</div><div className="insight-caption"><span className="insight-trend"><ArrowUpRight size={13}/> Up to date</span> Recorded paid expenses</div><div className="mini-chart"><span style={{height:'30%'}}/><span style={{height:'42%'}}/><span style={{height:'36%'}}/><span style={{height:'58%'}}/><span style={{height:'48%'}}/><span style={{height:'70%'}}/><span style={{height:'62%'}}/><span style={{height:'88%'}}/><span style={{height:'72%'}}/><span style={{height:'100%'}}/><span style={{height:'82%'}}/><span style={{height:'94%'}}/></div></div>
        <div className="insight-lines"><div><span><span className="legend-dot income"></span>Expected monthly rent</span><strong>{money(monthlyRent)}</strong></div><div><span><span className="legend-dot expense"></span>Pending expenses</span><strong>{money(pendingBills.reduce((s,b)=>s+Number(b.amount||0),0))}</strong></div></div>
        <button className="btn btn-outline btn-full insight-button" onClick={()=>onPage('Finance')}>View financial report <ArrowUpRight size={15}/></button>
      </section>
    </div>
    <div className="lower-grid"><section className="panel table-panel"><div className="panel-head"><div><h2>Recent tenants</h2><p>Latest resident activity</p></div><button className="text-action" onClick={()=>onPage('Rooms & Tenants')}>View all <ArrowUpRight size={14}/></button></div><div className="table-scroll"><table><thead><tr><th>Tenant</th><th>Room</th><th>Monthly rent</th><th>Status</th></tr></thead><tbody>{tenants.slice(0,4).map(t=><tr key={t.id}><td><div className="person-cell"><div className="person-avatar">{initials(t.name||t.full_name)}</div><span>{t.name||t.full_name}</span></div></td><td>{t.room||t.room_number||'—'}</td><td className="money-cell">{money(t.rent||t.monthly_rent)}</td><td><Status value={t.status}/></td></tr>)}</tbody></table>{!tenants.length&&<EmptyState title="No tenants yet" detail="Your residents will appear here."/>}</div></section>
      <section className="panel attention-panel"><div className="panel-head"><div><h2>Needs attention</h2><p>Items to review</p></div><span className="attention-count">{pendingBills.length}</span></div>{pendingBills.length===0?<EmptyState title="All caught up" detail="There are no pending bills."/>:pendingBills.slice(0,3).map((b,i)=><div className="attention-item" key={b.id}><div className={`attention-icon ${i%2?'orange':'blue'}`}>{b.category==='Utilities'?<Zap size={16}/>:<Wrench size={16}/>}</div><div className="attention-info"><strong>{b.title||b.name}</strong><span>{b.property||b.property_name||'Property'} · {b.date||b.due_date||'No date'}</span></div><div className="attention-amount">{money(b.amount)}</div></div>)}<button className="text-action attention-link" onClick={()=>onPage('Bills & Expenses')}>Review all bills <ArrowUpRight size={14}/></button></section></div>
  </div>
}

function PageToolbar({count,label,onAdd,onExport}) { return <div className="page-toolbar"><div className="result-count">{count} {label}</div><div className="toolbar-actions"><button className="btn btn-outline btn-sm" onClick={onExport}><Download size={14}/> Export CSV</button><button className="btn btn-primary btn-sm" onClick={onAdd}><Plus size={15}/> Add new</button></div></div> }
function PropertiesPage({rows,onAdd,onDelete,onExport}) { return <div className="page-body"><div className="section-intro"><div><h2>Your properties</h2><p>Manage addresses, units and occupancy in one place.</p></div><div className="summary-chip"><Building2 size={15}/>{rows.length} properties</div></div><PageToolbar count={rows.length} label="properties" onAdd={onAdd} onExport={onExport}/>{rows.length===0?<EmptyState title="No properties found" detail="Add a property to start managing your portfolio."/>:<div className="property-cards">{rows.map((p,i)=><div className="property-card" key={p.id}><div className={`property-card-art art-${i%3}`}><div className="art-building"><Building2 size={31}/></div><span className="art-tag"><span className="footer-dot"></span>{p.status||'Active'}</span><button className="card-menu" onClick={()=>onDelete(p.id)} title="Delete property"><MoreHorizontal size={19}/></button></div><div className="property-card-body"><div className="property-card-title"><h3>{p.name}</h3><span className="property-id">ID · {String(p.id).slice(0,6)}</span></div><p className="property-address">{p.location||p.address||'Location not set'}</p><div className="property-card-metrics"><div><span>Total units</span><strong>{p.units||p.total_units||0}</strong></div><div><span>Occupied</span><strong>{p.occupied||p.occupied_units||0}</strong></div><div><span>Vacant</span><strong>{Math.max(0,Number(p.units||p.total_units||0)-Number(p.occupied||p.occupied_units||0))}</strong></div></div><div className="property-card-progress"><div className="occupancy-label"><span>Occupancy rate</span><strong>{p.units||p.total_units?Math.round(Number(p.occupied||p.occupied_units||0)/Number(p.units||p.total_units)*100):0}%</strong></div><div className="progress-track"><div className="progress-fill" style={{width:`${p.units||p.total_units?Number(p.occupied||p.occupied_units||0)/Number(p.units||p.total_units)*100:0}%`}}/></div></div></div></div>)}</div>}</div> }
function TenantsPage({rows,onAdd,onDelete,onExport}) { return <div className="page-body"><div className="section-intro"><div><h2>Resident directory</h2><p>Track occupancy, rental agreements and payment status.</p></div><div className="summary-chip"><Users size={15}/>{rows.length} residents</div></div><PageToolbar count={rows.length} label="tenants" onAdd={onAdd} onExport={onExport}/><div className="panel table-panel full-table"><div className="table-scroll"><table><thead><tr><th>Tenant</th><th>Room</th><th>Property</th><th>Monthly rent</th><th>Next due</th><th>Status</th><th></th></tr></thead><tbody>{rows.map(t=><tr key={t.id}><td><div className="person-cell"><div className="person-avatar">{initials(t.name||t.full_name)}</div><div><strong>{t.name||t.full_name}</strong><small>{t.email||'Resident'}</small></div></div></td><td>{t.room||t.room_number||'—'}</td><td>{t.property||t.property_name||'—'}</td><td className="money-cell">{money(t.rent||t.monthly_rent)}</td><td>{t.due||t.due_date||'—'}</td><td><Status value={t.status}/></td><td><button className="icon-button small danger-hover" onClick={()=>onDelete(t.id)} title="Delete tenant"><X size={15}/></button></td></tr>)}</tbody></table>{!rows.length&&<EmptyState title="No tenants found" detail="Add your first tenant to get started."/>}</div></div></div> }
function BillsPage({rows,onAdd,onDelete,onExport}) { return <div className="page-body"><div className="section-intro"><div><h2>Expense register</h2><p>Keep utility bills, maintenance and recurring costs in view.</p></div><div className="summary-chip"><CreditCard size={15}/>{rows.length} records</div></div><PageToolbar count={rows.length} label="bills" onAdd={onAdd} onExport={onExport}/><div className="panel table-panel full-table"><div className="table-scroll"><table><thead><tr><th>Expense</th><th>Category</th><th>Property</th><th>Amount</th><th>Date</th><th>Status</th><th></th></tr></thead><tbody>{rows.map(b=><tr key={b.id}><td><div className="expense-cell"><div className="expense-icon">{b.category==='Utilities'?<Zap size={16}/>:b.category==='Maintenance'?<Wrench size={16}/>:<FileText size={16}/>}</div><strong>{b.title||b.name}</strong></div></td><td>{b.category||'Other'}</td><td>{b.property||b.property_name||'—'}</td><td className="money-cell">{money(b.amount)}</td><td>{b.date||b.due_date||'—'}</td><td><Status value={b.status}/></td><td><button className="icon-button small danger-hover" onClick={()=>onDelete(b.id)} title="Delete bill"><X size={15}/></button></td></tr>)}</tbody></table>{!rows.length&&<EmptyState title="No bills found" detail="Add a bill or expense to track costs."/>}</div></div></div> }
function FinancePage({tenants,bills,properties,monthlyRent,pendingBills}) { const totalPaid=bills.filter(b=>String(b.status).toLowerCase()==='paid').reduce((s,b)=>s+Number(b.amount||0),0);const totalPending=pendingBills.reduce((s,b)=>s+Number(b.amount||0),0);return <div className="page-body"><div className="section-intro"><div><h2>Financial overview</h2><p>A practical snapshot of rental income and property expenses.</p></div><div className="summary-chip"><TrendingUp size={15}/>Portfolio health</div></div><div className="stat-grid finance-stats"><StatCard label="Monthly rent roll" value={money(monthlyRent)} note="Based on listed tenants" icon={Wallet} tone="blue"/><StatCard label="Paid expenses" value={money(totalPaid)} note="Bills marked paid" icon={Check} tone="mint"/><StatCard label="Pending expenses" value={money(totalPending)} note={`${pendingBills.length} awaiting payment`} icon={Clock3} tone="orange"/><StatCard label="Properties" value={properties.length} note="In this workspace" icon={Building2} tone="violet"/></div><div className="finance-columns"><section className="panel finance-panel"><div className="panel-head"><div><h2>Expense breakdown</h2><p>Recorded bills by category</p></div></div>{['Utilities','Maintenance','Other'].map(cat=>{const amount=bills.filter(b=>(b.category||'Other')===cat).reduce((s,b)=>s+Number(b.amount||0),0);const total=bills.reduce((s,b)=>s+Number(b.amount||0),0);return <div className="breakdown-row" key={cat}><div><span className={`breakdown-dot ${cat.toLowerCase()}`}></span><span>{cat}</span><strong>{money(amount)}</strong></div><div className="progress-track"><div className={`progress-fill ${cat.toLowerCase()}`} style={{width:`${total?amount/total*100:0}%`}}/></div></div>})}{!bills.length&&<EmptyState title="No expenses recorded" detail="Expense categories will appear here."/>}</section><section className="panel finance-panel"><div className="panel-head"><div><h2>Income at a glance</h2><p>Rental value of active tenant records</p></div></div><div className="income-figure">{money(monthlyRent)}<span>Expected per month</span></div><div className="income-note"><div className="income-note-icon"><Users size={16}/></div><div><strong>{tenants.length} tenant records</strong><span>Included in current rent roll</span></div></div><div className="income-note"><div className="income-note-icon green"><Building2 size={16}/></div><div><strong>{properties.length} properties</strong><span>Across your managed portfolio</span></div></div></section></div></div> }

function RecordModal({type,properties,saving,onClose,onSave}) {
  const [form,setForm] = useState({status:type==='properties'?'Active':type==='tenants'?'Pending':'Pending',category:'Utilities'})
  const update=(k,v)=>setForm(old=>({...old,[k]:v}))
  const title=type==='properties'?'Add property':type==='tenants'?'Add tenant':'Add bill or expense'
  const submit=e=>{e.preventDefault();if(type==='properties')onSave({name:form.name,location:form.location,units:Number(form.units||0),occupied:Number(form.occupied||0),status:form.status});else if(type==='tenants')onSave({name:form.name,room:form.room,property:form.property,rent:Number(form.rent||0),due:form.due,status:form.status,email:form.email});else onSave({title:form.title,category:form.category,property:form.property,amount:Number(form.amount||0),date:form.date,status:form.status})}
  return <Modal title={title} onClose={onClose}><form className="record-form" onSubmit={submit}>
    {type==='properties'?<><label>Property name<input required value={form.name||''} onChange={e=>update('name',e.target.value)} placeholder="e.g. Marina Residence"/></label><label>Location<input value={form.location||''} onChange={e=>update('location',e.target.value)} placeholder="Area, city"/></label><div className="form-row"><label>Total units<input type="number" min="0" required value={form.units||''} onChange={e=>update('units',e.target.value)}/></label><label>Occupied units<input type="number" min="0" value={form.occupied||''} onChange={e=>update('occupied',e.target.value)}/></label></div><label>Status<select value={form.status} onChange={e=>update('status',e.target.value)}><option>Active</option><option>Inactive</option></select></label></>
    :type==='tenants'?<><label>Tenant full name<input required value={form.name||''} onChange={e=>update('name',e.target.value)} placeholder="Full name"/></label><label>Email address<input type="email" value={form.email||''} onChange={e=>update('email',e.target.value)} placeholder="tenant@example.com"/></label><div className="form-row"><label>Room / unit<input required value={form.room||''} onChange={e=>update('room',e.target.value)} placeholder="MR-204"/></label><label>Monthly rent (AED)<input type="number" min="0" required value={form.rent||''} onChange={e=>update('rent',e.target.value)}/></label></div><label>Property<select value={form.property||''} onChange={e=>update('property',e.target.value)}><option value="">Select property</option>{properties.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}</select></label><div className="form-row"><label>Next due date<input value={form.due||''} onChange={e=>update('due',e.target.value)} placeholder="Oct 15, 2026"/></label><label>Status<select value={form.status} onChange={e=>update('status',e.target.value)}><option>Paid</option><option>Pending</option><option>Overdue</option></select></label></div></>
    :<><label>Expense title<input required value={form.title||''} onChange={e=>update('title',e.target.value)} placeholder="e.g. DEWA utility bill"/></label><div className="form-row"><label>Category<select value={form.category} onChange={e=>update('category',e.target.value)}><option>Utilities</option><option>Maintenance</option><option>Insurance</option><option>Other</option></select></label><label>Amount (AED)<input type="number" min="0" required value={form.amount||''} onChange={e=>update('amount',e.target.value)}/></label></div><label>Property<select value={form.property||''} onChange={e=>update('property',e.target.value)}><option value="">Select property</option>{properties.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}</select></label><div className="form-row"><label>Date<input value={form.date||''} onChange={e=>update('date',e.target.value)} placeholder="Oct 12, 2026"/></label><label>Status<select value={form.status} onChange={e=>update('status',e.target.value)}><option>Paid</option><option>Pending</option><option>Overdue</option></select></label></div></>}
    <div className="modal-actions"><button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button><button className="btn btn-primary" disabled={saving}>{saving?<LoaderCircle size={16} className="spin"/>:<Plus size={16}/>} Save record</button></div>
  </form></Modal>
}
export default App

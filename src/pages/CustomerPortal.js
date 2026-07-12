import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { serviceRequestAPI, paymentAPI, enquiryAPI } from '../services/api';
import { formatDate, formatCurrency } from '../utils/format';

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{ background:'#fff', border:'1px solid #e9ecef', borderRadius:12, padding:'18px 20px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ width:44, height:44, borderRadius:10, background:color+'15', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>{icon}</div>
        <div>
          <div style={{ fontSize:11, color:'#6c757d', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px' }}>{label}</div>
          <div style={{ fontSize:22, fontWeight:800, color:color }}>{value}</div>
        </div>
      </div>
    </div>
  );
}

export default function CustomerPortal() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    if (user?.customerId) {
      serviceRequestAPI.getAll().then(r => setServices((r.data.data||[]).slice(0,5))).catch(()=>{});
      paymentAPI.getByCustomer(user.customerId).then(r => setPayments(r.data.data||[])).catch(()=>{});
    }
  }, [user]);

  const TABS = [['overview','Overview','🏠'],['services','Services','🔧'],['payments','Payments','💳'],['profile','Profile','👤']];

  return (
    <div style={{ minHeight:'100vh', background:'#f8f9fa' }}>
      {/* Top nav */}
      <nav style={{ background:'#009B00', padding:'0 24px', height:60, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <img src="/aga-logo.jpeg" alt="AGA" style={{ width:36, height:36, borderRadius:'50%', objectFit:'cover' }} />
          <div>
            <div style={{ color:'#fff', fontSize:14, fontWeight:700 }}>Aqua Green Agencies</div>
            <div style={{ color:'#7fff7f', fontSize:10 }}>Customer Portal</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <span style={{ color:'rgba(255,255,255,0.8)', fontSize:13 }}>Hello, {user?.fullName?.split(' ')[0]}</span>
          <Link to="/" style={{ color:'#7fff7f', fontSize:13 }}>Website</Link>
          <button onClick={() => { logout(); navigate('/login'); }} style={{ background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)', color:'#fff', padding:'6px 14px', borderRadius:8, cursor:'pointer', fontSize:13 }}>
            Logout
          </button>
        </div>
      </nav>

      <div className="container" style={{ padding:'28px 24px' }}>
        {/* Tabs */}
        <div style={{ display:'flex', gap:4, borderBottom:'2px solid #e9ecef', marginBottom:24 }}>
          {TABS.map(([key,label,icon]) => (
            <button key={key} onClick={()=>setTab(key)} style={{ padding:'10px 18px', border:'none', background:'transparent', cursor:'pointer', fontSize:14, fontWeight:700, color:tab===key?'#009B00':'#6c757d', borderBottom:tab===key?'2px solid #009B00':'2px solid transparent', marginBottom:-2, display:'flex', alignItems:'center', gap:6 }}>
              {icon} {label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div>
            <div style={{ fontSize:18, fontWeight:800, marginBottom:20 }}>Welcome back, {user?.fullName}!</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:14, marginBottom:28 }}>
              <StatCard icon="🔧" label="Service Requests" value={services.length} color="#009B00" />
              <StatCard icon="💳" label="Total Payments" value={payments.length} color="#1d4ed8" />
              <StatCard icon="💰" label="Amount Paid" value={formatCurrency(payments.reduce((s,p)=>s+Number(p.amount||0),0))} color="#065f46" />
              <StatCard icon="✅" label="Services Done" value={services.filter(s=>s.status==='COMPLETED').length} color="#7c3aed" />
            </div>

            {/* Recent services */}
            <div style={{ background:'#fff', border:'1px solid #e9ecef', borderRadius:12, overflow:'hidden' }}>
              <div style={{ padding:'14px 18px', borderBottom:'1px solid #f1f3f5', fontWeight:700, fontSize:14 }}>Recent Service Requests</div>
              {services.length === 0 ? (
                <div style={{ padding:32, textAlign:'center', color:'#9aa0a6' }}>No service requests yet</div>
              ) : (
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                  <thead><tr style={{ background:'#f8f9fa' }}>{['Ticket','Issue','Technician','Status','Date'].map(h=><th key={h} style={{ padding:'9px 14px', textAlign:'left', fontSize:11, color:'#6c757d', fontWeight:700, letterSpacing:'0.3px', textTransform:'uppercase' }}>{h}</th>)}</tr></thead>
                  <tbody>{services.map(s=>(
                    <tr key={s.id} style={{ borderBottom:'1px solid #f1f3f5' }}>
                      <td style={{ padding:'9px 14px', fontWeight:700, color:'#009B00' }}>{s.ticketNumber}</td>
                      <td style={{ padding:'9px 14px', color:'#495057' }}>{s.issueDescription?.slice(0,40)}</td>
                      <td style={{ padding:'9px 14px', color:'#6c757d' }}>{s.assignedTechnician||'Pending'}</td>
                      <td style={{ padding:'9px 14px' }}><span className={`badge badge-${s.status?.toLowerCase().replace('_','')}`}>{s.status?.replace('_',' ')}</span></td>
                      <td style={{ padding:'9px 14px', color:'#9aa0a6', fontSize:11 }}>{formatDate(s.createdAt)}</td>
                    </tr>
                  ))}</tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Services tab */}
        {tab === 'services' && (
          <div>
            <div style={{ fontWeight:800, fontSize:18, marginBottom:20 }}>Service History</div>
            <div style={{ background:'#fff', border:'1px solid #e9ecef', borderRadius:12, overflow:'hidden' }}>
              {services.length === 0 ? (
                <div style={{ padding:48, textAlign:'center', color:'#9aa0a6' }}>
                  <div style={{ fontSize:40, marginBottom:12 }}>🔧</div>
                  <p>No service requests yet</p>
                  <a href="tel:09952828740" className="btn btn-primary mt-12" style={{ display:'inline-flex' }}>Call 09952828740</a>
                </div>
              ) : (
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                  <thead><tr style={{ background:'#f8f9fa' }}>{['Ticket','Product','Issue','Technician','Charge','Status','Date'].map(h=><th key={h} style={{ padding:'9px 14px', textAlign:'left', fontSize:11, color:'#6c757d', fontWeight:700, textTransform:'uppercase' }}>{h}</th>)}</tr></thead>
                  <tbody>{services.map(s=>(
                    <tr key={s.id} style={{ borderBottom:'1px solid #f1f3f5' }}>
                      <td style={{ padding:'9px 14px', fontWeight:700, color:'#009B00' }}>{s.ticketNumber}</td>
                      <td style={{ padding:'9px 14px' }}>{s.productName||'—'}</td>
                      <td style={{ padding:'9px 14px', color:'#6c757d' }}>{s.issueDescription?.slice(0,35)}</td>
                      <td style={{ padding:'9px 14px' }}>{s.assignedTechnician||'—'}</td>
                      <td style={{ padding:'9px 14px', fontWeight:700, color:'#009B00' }}>{formatCurrency(s.serviceCharge)}</td>
                      <td style={{ padding:'9px 14px' }}><span className={`badge badge-${s.status?.toLowerCase().replace('_','')}`}>{s.status?.replace('_',' ')}</span></td>
                      <td style={{ padding:'9px 14px', color:'#9aa0a6', fontSize:11 }}>{formatDate(s.createdAt)}</td>
                    </tr>
                  ))}</tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Payments tab */}
        {tab === 'payments' && (
          <div>
            <div style={{ fontWeight:800, fontSize:18, marginBottom:20 }}>Payment History</div>
            <div style={{ background:'#fff', border:'1px solid #e9ecef', borderRadius:12, overflow:'hidden' }}>
              {payments.length === 0 ? (
                <div style={{ padding:48, textAlign:'center', color:'#9aa0a6' }}>No payments yet</div>
              ) : (
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                  <thead><tr style={{ background:'#f8f9fa' }}>{['Payment No','Invoice','Amount','Method','Status','Date'].map(h=><th key={h} style={{ padding:'9px 14px', textAlign:'left', fontSize:11, color:'#6c757d', fontWeight:700, textTransform:'uppercase' }}>{h}</th>)}</tr></thead>
                  <tbody>{payments.map(p=>(
                    <tr key={p.id} style={{ borderBottom:'1px solid #f1f3f5' }}>
                      <td style={{ padding:'9px 14px', fontWeight:700, color:'#009B00' }}>{p.paymentNumber}</td>
                      <td style={{ padding:'9px 14px' }}>{p.invoiceNumber||'—'}</td>
                      <td style={{ padding:'9px 14px', fontWeight:700, color:'#065f46' }}>{formatCurrency(p.amount)}</td>
                      <td style={{ padding:'9px 14px', color:'#6c757d' }}>{p.paymentMethod?.replace('_',' ')}</td>
                      <td style={{ padding:'9px 14px' }}><span className={`badge badge-${p.paymentStatus?.toLowerCase()}`}>{p.paymentStatus}</span></td>
                      <td style={{ padding:'9px 14px', color:'#9aa0a6', fontSize:11 }}>{formatDate(p.createdAt)}</td>
                    </tr>
                  ))}</tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Profile tab */}
        {tab === 'profile' && (
          <div style={{ maxWidth:500 }}>
            <div style={{ fontWeight:800, fontSize:18, marginBottom:20 }}>My Profile</div>
            <div style={{ background:'#fff', border:'1px solid #e9ecef', borderRadius:12, padding:24 }}>
              <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24 }}>
                <div style={{ width:60, height:60, borderRadius:'50%', background:'#e0f9e0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:800, color:'#009B00' }}>
                  {user?.fullName?.charAt(0)||'?'}
                </div>
                <div>
                  <div style={{ fontSize:18, fontWeight:800 }}>{user?.fullName}</div>
                  <div style={{ fontSize:13, color:'#6c757d' }}>{user?.email}</div>
                  <span style={{ fontSize:11, background:'#e0f9e0', color:'#009B00', padding:'2px 8px', borderRadius:10, fontWeight:700 }}>Customer</span>
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {[['Email',user?.email],['Mobile',user?.mobile],['Customer ID',user?.customerId?`C-${user.customerId}`:'—']].map(([label,value])=>(
                  <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #f1f3f5' }}>
                    <span style={{ fontWeight:600, fontSize:13, color:'#6c757d' }}>{label}</span>
                    <span style={{ fontSize:13, color:'#212529' }}>{value||'—'}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:20 }}>
                <Link to="/change-password" className="btn btn-outline btn-sm">Change Password</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

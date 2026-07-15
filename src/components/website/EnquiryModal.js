import { useState } from 'react';
import { enquiryAPI } from '../../services/api';

const SERVICES = ['New RO Purchase','RO Service','Filter Replacement','Leakage Repair','New Installation','Membrane Replacement','Get Quotation','Water TDS Testing','Other'];

export default function EnquiryModal({ isOpen, onClose, product }) {
  const [form, setForm] = useState({ customerName:'',mobile:'',email:'',address:'',city:'',serviceRequired:product?'New RO Purchase':'',message:'' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  // isOpen is optional: parent components already conditionally render
  // this component (e.g. {enquireOpen && <EnquiryModal .../>}), so only
  // bail out here if isOpen was explicitly passed and is false.
  if (isOpen === false) return null;

  const validate = () => {
    const e = {};
    if (!form.customerName.trim()) e.customerName = 'Name is required';
    if (!/^[6-9]\d{9}$/.test(form.mobile)) e.mobile = 'Enter valid 10-digit mobile';
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    return e;
  };

  const set = (k,v) => { setForm(f=>({...f,[k]:v})); if(errors[k]) setErrors(e=>({...e,[k]:undefined})); };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await enquiryAPI.submit({ ...form, productId:product?.id||null, productName:product?.name||null, source:'WEBSITE' });
      setSuccess(true);
    } catch { setErrors({ submit:'Something went wrong. Please try again.' }); }
    finally { setLoading(false); }
  };

  const handleClose = () => {
    setForm({customerName:'',mobile:'',email:'',address:'',city:'',serviceRequired:'',message:''});
    setErrors({}); setSuccess(false); onClose();
  };

  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&handleClose()} style={{zIndex:1200}}>
      <div className="modal" style={{ maxWidth:500 }}>
        {success ? (
          <div style={{ textAlign:'center', padding:'24px 0' }}>
            <div style={{ width:72, height:72, background:'#d1fae5', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
              <span className="material-icons" style={{ fontSize:36, color:'#008800' }}>check_circle</span>
            </div>
            <h2 style={{ fontSize:22, fontWeight:800, marginBottom:8 }}>Enquiry Submitted!</h2>
            <p style={{ color:'#6b7280', marginBottom:6 }}>Thank you, <strong>{form.customerName}</strong>!</p>
            <p style={{ color:'#6b7280', marginBottom:24, fontSize:13 }}>
              Our team will call you at <strong>{form.mobile}</strong> within <strong>45 minutes</strong>.
            </p>
            {product && <div style={{ background:'#f0fff0', borderRadius:10, padding:'10px 16px', marginBottom:20, fontSize:13, color:'#0F9D58', fontWeight:600 }}>Enquiry for: {product.name}</div>}
            <button className="btn btn-primary" onClick={handleClose} style={{ width:'100%', justifyContent:'center', padding:12 }}>Close</button>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <div>
                <div className="modal-title">{product ? `Enquire — ${product.name}` : 'Get Free Quote'}</div>
                {product && (
                  <div style={{ fontSize:13, color:'#065F46', marginTop:4, fontWeight:600 }}>
                    {product.pricingMode==='FREE'?'FREE':product.pricingMode==='CONTACT_FOR_PRICE'?'Contact for Price':product.price?`₹${Number(product.price).toLocaleString('en-IN')}`:''}
                  </div>
                )}
              </div>
              <button className="modal-close" onClick={handleClose}>×</button>
            </div>
            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <div className="grid-2" style={{gap:12}}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input className={`form-input${errors.customerName?' error':''}`} placeholder="Your name" value={form.customerName} onChange={e=>set('customerName',e.target.value)} />
                  {errors.customerName&&<span className="form-error">{errors.customerName}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Mobile *</label>
                  <input className={`form-input${errors.mobile?' error':''}`} placeholder="10-digit mobile" value={form.mobile} onChange={e=>set('mobile',e.target.value.replace(/\D/,'').slice(0,10))} inputMode="numeric" />
                  {errors.mobile&&<span className="form-error">{errors.mobile}</span>}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email (optional)</label>
                <input className={`form-input${errors.email?' error':''}`} placeholder="your@email.com" type="email" value={form.email} onChange={e=>set('email',e.target.value)} />
                {errors.email&&<span className="form-error">{errors.email}</span>}
              </div>
              <div className="grid-2" style={{gap:12}}>
                <div className="form-group">
                  <label className="form-label">Address / Area</label>
                  <input className="form-input" placeholder="Your area" value={form.address} onChange={e=>set('address',e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input className="form-input" placeholder="Coimbatore" value={form.city} onChange={e=>set('city',e.target.value)} />
                </div>
              </div>
              {!product && (
                <div className="form-group">
                  <label className="form-label">Service Required</label>
                  <select className="form-select" value={form.serviceRequired} onChange={e=>set('serviceRequired',e.target.value)}>
                    <option value="">Select a service</option>
                    {SERVICES.map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Message (optional)</label>
                <textarea className="form-textarea" placeholder="Any specific requirements?" value={form.message} onChange={e=>set('message',e.target.value)} style={{minHeight:70}} />
              </div>
              {errors.submit && <div className="alert-error">{errors.submit}</div>}
              <button className="btn btn-primary" type="submit" disabled={loading} style={{ width:'100%', justifyContent:'center', padding:13, fontSize:15 }}>
                {loading?<><span className="spinner"/>Submitting…</>:<><span className="material-icons" style={{fontSize:18}}>send</span>Submit Enquiry</>}
              </button>
              <div style={{ textAlign:'center', fontSize:11, color:'#9ca3af' }}>
                <span className="material-icons" style={{fontSize:12,verticalAlign:'middle'}}>lock</span>
                {' '}We respond within 45 minutes · No spam
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

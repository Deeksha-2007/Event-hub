import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/common/navbar";
import Footer from "../components/common/footer";
import { authService } from "../services/api";
import { useAuth } from "../context/AuthContext";

function FieldError({ msg }) {
  return msg ? <p className="mt-1 text-xs text-red-400">{msg}</p> : null;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name:"", email:"", password:"", confirm:"", isOrganizer: false });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Enter a valid email address.";
    }
    if (!form.password) {
      errs.password = "Password is required.";
    } else if (form.password.length < 8) {
      errs.password = "Password must be at least 8 characters.";
    }
    if (!form.confirm) {
      errs.confirm = "Please confirm your password.";
    } else if (form.confirm !== form.password) {
      errs.confirm = "Passwords do not match.";
    }
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setApiError("");
    setLoading(true);
    try {
      const res = await authService.register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.isOrganizer ? 'ORGANIZER' : 'USER',
      });
      const { token, user } = res.data.data;
      login(token, user);
      const redirect = localStorage.getItem('eventnest_redirect') || (
        user.role === 'ORGANIZER' ? '/organizer/overview' : '/events'
      );
      localStorage.removeItem('eventnest_redirect');
      navigate(redirect);
    } catch (err) {
      setApiError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputCls = "w-full rounded-2xl border border-white/10 bg-[#17151b] px-4 py-3.5 text-sm text-[#f5f2ec] outline-none transition placeholder:text-white/25 focus:border-[#d5b68a]/50 focus:ring-1 focus:ring-[#d5b68a]/15";

  return (
    <main className="min-h-screen bg-[#090909] text-[#f5f2ec]">
      <Navbar />

      <div className="flex min-h-[90vh] items-center justify-center px-5 py-24">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center">
            <span className="inline-flex items-center gap-2 text-xl font-semibold tracking-[-0.5px]">
              <span aria-hidden="true" className="grid grid-cols-2 gap-0.75">
                {Array.from({length:4}).map((_,i)=>(
                  <span key={i} className="h-1.75 w-1.75 rounded-[1px] bg-[#f6f4f0]" />
                ))}
              </span>
              EventNest<span className="text-[#d5b68a]">.</span>
            </span>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0e0b14] p-8">
            <p className="mb-1 text-[10px] uppercase tracking-[0.25em] text-[#d5b68a]">JOIN US</p>
            <h1 className="mb-7 font-['Playfair_Display',Georgia,serif] text-3xl text-[#f5f2ec]">
              Create account
            </h1>

            {apiError && (
              <div className="mb-4 rounded-xl border border-red-400/20 bg-red-400/8 px-4 py-3 text-sm text-red-400">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label htmlFor="reg-name" className="mb-1.5 block text-xs text-white/40">Full name</label>
                <input id="reg-name" type="text" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Your name" autoComplete="name" className={inputCls} />
                <FieldError msg={errors.name} />
              </div>

              <div>
                <label htmlFor="reg-email" className="mb-1.5 block text-xs text-white/40">Email address</label>
                <input id="reg-email" type="email" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="you@example.com" autoComplete="email" className={inputCls} />
                <FieldError msg={errors.email} />
              </div>

              <div>
                <label htmlFor="reg-password" className="mb-1.5 block text-xs text-white/40">Password</label>
                <input id="reg-password" type="password" value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))} placeholder="At least 8 characters" autoComplete="new-password" className={inputCls} />
                <FieldError msg={errors.password} />
              </div>

              <div>
                <label htmlFor="reg-confirm" className="mb-1.5 block text-xs text-white/40">Confirm password</label>
                <input id="reg-confirm" type="password" value={form.confirm} onChange={e=>setForm(p=>({...p,confirm:e.target.value}))} placeholder="Repeat your password" autoComplete="new-password" className={inputCls} />
                <FieldError msg={errors.confirm} />
              </div>

              {/* Organizer toggle */}
              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 transition hover:bg-white/[0.06]">
                <div className="relative">
                  <input
                    id="reg-organizer"
                    type="checkbox"
                    checked={form.isOrganizer}
                    onChange={e=>setForm(p=>({...p,isOrganizer:e.target.checked}))}
                    className="sr-only"
                  />
                  <div className={`h-5 w-9 rounded-full transition ${form.isOrganizer ? 'bg-[#d5b68a]' : 'bg-white/15'}`}>
                    <div className={`mt-0.5 ml-0.5 h-4 w-4 rounded-full bg-white transition-transform ${form.isOrganizer ? 'translate-x-4' : ''}`} />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-white/80">Register as Organizer</p>
                  <p className="text-[11px] text-white/35">I want to create and manage events</p>
                </div>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full min-h-12 items-center justify-center gap-3 rounded-full bg-[#d5b68a] text-sm font-semibold text-[#17120c] transition hover:-translate-y-0.5 hover:bg-[#e8cfa8] disabled:opacity-60 mt-2"
              >
                {loading
                  ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#17120c]/30 border-t-[#17120c]" />
                  : "Create account →"}
              </button>
            </form>

            <div className="mt-5 border-t border-white/8 pt-5">
              <p className="text-center text-xs text-white/35">
                Already have an account?{" "}
                <Link to="/login" className="text-[#d5b68a] underline underline-offset-4 hover:text-white">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

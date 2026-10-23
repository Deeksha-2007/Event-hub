
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/common/navbar";
import Footer from "../components/common/footer";

function FieldError({ msg }) {
  return msg ? <p className="mt-1 text-xs text-red-400">{msg}</p> : null;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const errs = {};
    if (!form.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Enter a valid email address.";
    }
    if (!form.password) errs.password = "Password is required.";
    else if (form.password.length < 6) errs.password = "Password must be at least 6 characters.";
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      // Simulated auth — store token and user info
      localStorage.setItem("token", "demo-token-" + Date.now());
      const name = form.email.split("@")[0].replace(/[._]/g," ").replace(/\b\w/g,c=>c.toUpperCase());
      localStorage.setItem("user", JSON.stringify({ name, email: form.email }));
      setLoading(false);
      const redirect = localStorage.getItem('eventnest_redirect') || '/my-bookings';
      localStorage.removeItem('eventnest_redirect');
      navigate(redirect);
    }, 600);
  }

  const inputCls = "w-full rounded-2xl border border-white/10 bg-[#17151b] px-4 py-3.5 text-sm text-[#f5f2ec] outline-none transition placeholder:text-white/25 focus:border-[#d5b68a]/50 focus:ring-1 focus:ring-[#d5b68a]/15";

  return (
    <main className="min-h-screen bg-[#090909] text-[#f5f2ec]">
      <Navbar />

      <div className="flex min-h-[90vh] items-center justify-center px-5 py-24">
        <div className="w-full max-w-md">
          {/* Brand mark */}
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
            <p className="mb-1 text-[10px] uppercase tracking-[0.25em] text-[#d5b68a]">WELCOME BACK</p>
            <h1 className="mb-7 font-['Playfair_Display',Georgia,serif] text-3xl text-[#f5f2ec]">
              Sign in
            </h1>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label htmlFor="login-email" className="mb-1.5 block text-xs text-white/40">Email address</label>
                <input
                  id="login-email"
                  type="email"
                  value={form.email}
                  onChange={e=>setForm(p=>({...p,email:e.target.value}))}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={inputCls}
                />
                <FieldError msg={errors.email} />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="login-password" className="text-xs text-white/40">Password</label>
                  <span className="text-[10px] text-white/25 cursor-default">Forgot password? (demo)</span>
                </div>
                <input
                  id="login-password"
                  type="password"
                  value={form.password}
                  onChange={e=>setForm(p=>({...p,password:e.target.value}))}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={inputCls}
                />
                <FieldError msg={errors.password} />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full min-h-12 items-center justify-center gap-3 rounded-full bg-[#d5b68a] text-sm font-semibold text-[#17120c] transition hover:-translate-y-0.5 hover:bg-[#e8cfa8] disabled:opacity-60 mt-2"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#17120c]/30 border-t-[#17120c]" />
                ) : "Sign in →"}
              </button>
            </form>

            <div className="mt-5 border-t border-white/8 pt-5">
              <p className="text-center text-xs text-white/35">
                Don't have an account?{" "}
                <Link to="/register" className="text-[#d5b68a] underline underline-offset-4 hover:text-white">
                  Create one
                </Link>
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-[10px] text-white/20">
            ⚠️ This is a demo login — no real authentication is performed.
          </p>

          <div className="mt-4 text-center">
            <Link to="/events" className="text-xs text-white/30 hover:text-white">
              ← Continue browsing events
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

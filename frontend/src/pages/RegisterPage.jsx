
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/common/navbar";
import Footer from "../components/common/footer";
import { useAuth } from "../context/AuthContext";

function FieldError({ msg }) {
  return msg ? <p className="mt-1 text-xs text-red-400">{msg}</p> : null;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth(); // get the login function from AuthContext
  const [form, setForm] = useState({ name:"", email:"", password:"", confirm:"" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(""); // e.g. email already exists
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false); // show success message briefly

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
    setServerError("");
    setLoading(true);

    try {
      // Call the real backend register API
      const response = await fetch("http://localhost:5001/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Show error (e.g. "An account with this email already exists")
        setServerError(data.message || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      // Show a brief success message
      setSuccess(true);

      // Save token and user using AuthContext (also saves to localStorage)
      login(data.data.token, data.data.user);

      // Redirect after a short delay so user sees the success message
      setTimeout(() => {
        const redirect = localStorage.getItem("eventnest_redirect") || "/events";
        localStorage.removeItem("eventnest_redirect");
        navigate(redirect);
      }, 1200);
    } catch (err) {
      // Network error
      setServerError("Could not connect to server. Please make sure the backend is running.");
      setLoading(false);
    }
  }

  const inputCls = "w-full rounded-2xl border border-white/10 bg-[#17151b] px-4 py-3.5 text-sm text-[#f5f2ec] outline-none transition placeholder:text-white/25 focus:border-[#d5b68a]/50 focus:ring-1 focus:ring-[#d5b68a]/15";

  return (
    <main className="min-h-screen bg-[#090909] text-[#f5f2ec]">
      <Navbar />

      <div className="flex min-h-[90vh] items-center justify-center px-5 py-24">
        <div className="w-full max-w-md">
          {/* Brand */}
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

            {/* Success message */}
            {success && (
              <div className="mb-4 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                ✓ Account created successfully! Redirecting you...
              </div>
            )}

            {/* Server-side error */}
            {serverError && (
              <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {serverError}
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

              <button
                type="submit"
                disabled={loading || success}
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

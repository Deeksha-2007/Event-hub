import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/organizer/dashboard/shared';

function Section({ title, sub, children }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-[#0d0d12] p-5 sm:p-6">
      <div className="mb-5 border-b border-white/8 pb-4">
        <h2 className="text-sm font-semibold text-white">{title}</h2>
        {sub && <p className="mt-0.5 text-xs text-white/35">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs text-white/40">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

function Toast({ message, type }) {
  if (!message) return null;
  const colors = type === 'success'
    ? 'border-emerald-400/20 bg-emerald-400/8 text-emerald-400'
    : 'border-red-400/20 bg-red-400/8 text-red-400';
  return <div className={`mb-4 rounded-xl border px-4 py-3 text-sm ${colors}`}>{message}</div>;
}

const inputCls = 'w-full rounded-xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#d5b68a]/50 focus:bg-white/[0.06] disabled:opacity-40';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();

  const [profile, setProfile] = useState({
    name: user?.name || 'Demo Organizer',
    phone: user?.phone || '+91 98765 43210',
    avatar: user?.avatar || '',
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [profileToast, setProfileToast] = useState({ message: '', type: '' });

  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordToast, setPasswordToast] = useState({ message: '', type: '' });

  function showToast(setter, message, type) {
    setter({ message, type });
    setTimeout(() => setter({ message: '', type: '' }), 4000);
  }

  function validateProfile() {
    const e = {};
    if (!profile.name.trim()) e.name = 'Name is required';
    if (profile.avatar && !/^https?:\/\/.+/.test(profile.avatar))
      e.avatar = 'Enter a valid URL starting with http:// or https://';
    return e;
  }

  function handleProfileSave(e) {
    e.preventDefault();
    const errs = validateProfile();
    setProfileErrors(errs);
    if (Object.keys(errs).length) return;
    // In mock mode, just update the local AuthContext
    updateUser({ name: profile.name.trim(), phone: profile.phone.trim(), avatar: profile.avatar.trim() });
    showToast(setProfileToast, 'Profile updated successfully', 'success');
  }

  function validatePasswords() {
    const e = {};
    if (!passwords.currentPassword) e.currentPassword = 'Current password is required';
    if (!passwords.newPassword) e.newPassword = 'New password is required';
    else if (passwords.newPassword.length < 8) e.newPassword = 'New password must be at least 8 characters';
    if (!passwords.confirm) e.confirm = 'Please confirm your new password';
    else if (passwords.confirm !== passwords.newPassword) e.confirm = 'Passwords do not match';
    return e;
  }

  function handlePasswordChange(e) {
    e.preventDefault();
    const errs = validatePasswords();
    setPasswordErrors(errs);
    if (Object.keys(errs).length) return;
    // Mock — just clear the form and show success
    setPasswords({ currentPassword: '', newPassword: '', confirm: '' });
    showToast(setPasswordToast, 'Password changed successfully (demo mode — no real change)', 'success');
  }

  return (
    <div>
      <PageHeader title="Profile & Settings" sub="Manage your organizer account details and security" />

      <div className="space-y-6 max-w-2xl">
        {/* Account info strip */}
        <div className="flex items-center gap-4 rounded-2xl border border-white/8 bg-[#0d0d12] p-5">
          {profile.avatar && /^https?:\/\/.+/.test(profile.avatar) ? (
            <img src={profile.avatar} alt="" className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-white/10" onError={(e) => (e.target.style.display = 'none')} />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#d5b68a]/15 text-xl font-semibold text-[#d5b68a]">
              {profile.name?.[0]?.toUpperCase() || 'O'}
            </div>
          )}
          <div>
            <p className="font-semibold text-white">{profile.name}</p>
            <p className="text-sm text-white/40">{user?.email}</p>
            <span className="mt-1 inline-block rounded-full border border-[#d5b68a]/25 bg-[#d5b68a]/10 px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-[#d5b68a]">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Profile section */}
        <Section title="Profile Information" sub="Update your public name, avatar, and contact details">
          <Toast message={profileToast.message} type={profileToast.type} />
          <form onSubmit={handleProfileSave} className="space-y-4">
            <Field label="Full Name *" error={profileErrors.name}>
              <input value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} placeholder="Your full name" className={inputCls} />
            </Field>
            <Field label="Email address">
              <input value={user?.email || 'organizer@eventnest.com'} disabled className={inputCls} />
              <p className="mt-1 text-xs text-white/25">Email cannot be changed</p>
            </Field>
            <Field label="Phone number" error={profileErrors.phone}>
              <input value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} placeholder="+91 98765 43210" className={inputCls} />
            </Field>
            <Field label="Avatar URL" error={profileErrors.avatar}>
              <input value={profile.avatar} onChange={(e) => setProfile((p) => ({ ...p, avatar: e.target.value }))} placeholder="https://example.com/avatar.jpg" className={inputCls} />
            </Field>
            {profile.avatar && /^https?:\/\/.+/.test(profile.avatar) && (
              <div className="flex items-center gap-3">
                <img src={profile.avatar} alt="avatar preview" className="h-12 w-12 rounded-full object-cover ring-2 ring-white/10" onError={(e) => (e.target.style.display = 'none')} />
                <p className="text-xs text-white/30">Preview</p>
              </div>
            )}
            <div className="pt-1">
              <button type="submit" className="flex items-center gap-2 rounded-full bg-[#d5b68a] px-6 py-2.5 text-sm font-semibold text-[#17120c] transition hover:bg-[#e8cfa8]">
                Save Profile
              </button>
            </div>
          </form>
        </Section>

        {/* Password section */}
        <Section title="Change Password" sub="Choose a strong password of at least 8 characters">
          <Toast message={passwordToast.message} type={passwordToast.type} />
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <Field label="Current Password *" error={passwordErrors.currentPassword}>
              <input type="password" value={passwords.currentPassword} onChange={(e) => setPasswords((p) => ({ ...p, currentPassword: e.target.value }))} placeholder="Enter your current password" className={inputCls} />
            </Field>
            <Field label="New Password *" error={passwordErrors.newPassword}>
              <input type="password" value={passwords.newPassword} onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))} placeholder="At least 8 characters" className={inputCls} />
            </Field>
            <Field label="Confirm New Password *" error={passwordErrors.confirm}>
              <input type="password" value={passwords.confirm} onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))} placeholder="Repeat new password" className={inputCls} />
            </Field>
            <div className="pt-1">
              <button type="submit" className="rounded-full border border-white/12 bg-white/6 px-6 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white">
                Change Password
              </button>
            </div>
          </form>
        </Section>

        {/* Account info */}
        <Section title="Account Information" sub="Read-only details about your account">
          <dl className="space-y-3 text-sm">
            {[
              { label: 'Account Role', value: user?.role || 'ORGANIZER' },
              { label: 'Member Since', value: 'January 15, 2024' },
              { label: 'Dashboard Mode', value: 'Frontend Demo (no backend required)' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between gap-4 border-b border-white/5 pb-3 last:border-0 last:pb-0">
                <dt className="text-white/40">{label}</dt>
                <dd className="font-medium text-white/70 text-right">{value}</dd>
              </div>
            ))}
          </dl>
        </Section>
      </div>
    </div>
  );
}

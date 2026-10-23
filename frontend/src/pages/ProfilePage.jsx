
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/common/navbar";
import Footer from "../components/common/footer";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import ProfileDetails from "../components/profile/ProfileDetails";
import ProfileForm from "../components/profile/ProfileForm";

const EMPTY_PROFILE = {
  name: "",
  email: "",
  phone: "",
  city: "",
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [draft, setDraft] = useState(EMPTY_PROFILE);
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const isLoggedIn = Boolean(localStorage.getItem("token"));

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const extra = JSON.parse(localStorage.getItem("user_profile") || "{}");

      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: extra.phone || "",
        city: extra.city || "",
      });
    } catch {
      setProfile(EMPTY_PROFILE);
    }
  }, []);

  useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => setSaved(false), 3000);
    return () => clearTimeout(timer);
  }, [saved]);

  const startEdit = () => {
    setDraft({ ...profile });
    setErrors({});
    setSaved(false);
    setEditing(true);
  };

  const cancelEdit = () => {
    setDraft({ ...profile });
    setErrors({});
    setEditing(false);
  };

  const handleSave = (e) => {
    e.preventDefault();

    const nextErrors = {};

    if (!draft.name.trim()) {
      nextErrors.name = "Name is required.";
    }

    if (!draft.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (draft.phone && !/^\+?[\d\s\-()]{6,}$/.test(draft.phone)) {
      nextErrors.phone = "Enter a valid phone number.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const updated = {
      name: draft.name.trim(),
      email: draft.email.trim(),
      phone: draft.phone?.trim() || "",
      city: draft.city || "",
    };

    setProfile(updated);

    try {
      localStorage.setItem(
        "user",
        JSON.stringify({ name: updated.name, email: updated.email })
      );
      localStorage.setItem(
        "user_profile",
        JSON.stringify({ phone: updated.phone, city: updated.city })
      );
    } catch {
      // Profile remains updated in the current React state.
    }

    setEditing(false);
    setSaved(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("user_profile");
    navigate("/");
    window.location.reload();
  };

  const initials =
    profile.name.split(" ").filter(Boolean).map((word) => word[0])
      .slice(0, 2).join("").toUpperCase() || "?";

  return (
    <main className="min-h-screen bg-[#090909] text-[#f5f2ec]">
      <Navbar />

      {!isLoggedIn ? (
        <div className="flex min-h-[75vh] flex-col items-center justify-center gap-6 px-5 text-center">
          <p className="font-['Playfair_Display',Georgia,serif] text-3xl">
            Sign in to view profile
          </p>
          <div className="flex gap-3">
            <Link
              to="/login"
              className="rounded-full bg-[#d5b68a] px-7 py-3 text-sm font-semibold text-[#17120c] hover:bg-[#e8cfa8]"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="rounded-full border border-white/20 px-7 py-3 text-sm text-white/70 hover:border-white/40"
            >
              Create account
            </Link>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-[1600px] px-5 pb-20 pt-28 sm:px-10 sm:pt-32 lg:px-16">
          <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
            <ProfileSidebar
              profile={profile}
              initials={initials}
              onLogout={handleLogout}
            />

            <section>
              {editing ? (
                <>
                  <div className="mb-7">
                    <p className="mb-1 text-[10px] uppercase tracking-[0.25em] text-[#d5b68a]">
                      YOUR ACCOUNT
                    </p>
                    <h1 className="font-['Playfair_Display',Georgia,serif] text-3xl">
                      Edit Profile
                    </h1>
                  </div>

                  <ProfileForm
                    draft={draft}
                    setDraft={setDraft}
                    errors={errors}
                    onSubmit={handleSave}
                    onCancel={cancelEdit}
                  />
                </>
              ) : (
                <ProfileDetails
                  profile={profile}
                  saved={saved}
                  onEdit={startEdit}
                />
              )}

              <p className="mt-5 text-[10px] text-white/20">
                Profile changes are stored in your browser only. No server-side
                data is saved.
              </p>
            </section>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}

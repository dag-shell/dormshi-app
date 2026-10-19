import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faPhone, faPen } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'sonner';
import { UserAvatar } from '@common/UserAvatar';
import { QRCode } from '@common/QRCode';
import { BottomSheet } from '@common/BottomSheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const defaultProfile = {
  name: 'Maya Okafor',
  phone: '+251 91 234 5678'
};

const stats = [
  { label: 'Requests', value: '4' },
  { label: 'Deliveries', value: '23' },
  { label: 'Rating', value: '4.9' }
];

function getInitials(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return 'ME';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Profile() {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('dormshi_user_profile');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return defaultProfile;
  });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({ name: profile.name, phone: profile.phone });

  const handleOpenEdit = () => {
    setFormData({ name: profile.name, phone: profile.phone });
    setIsEditOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = formData.name.trim();
    const trimmedPhone = formData.phone.trim();
    if (!trimmedName) {
      toast.error('Please enter a name.');
      return;
    }
    if (!trimmedPhone) {
      toast.error('Please enter a phone number.');
      return;
    }

    const updated = { name: trimmedName, phone: trimmedPhone };
    setProfile(updated);
    try {
      localStorage.setItem('dormshi_user_profile', JSON.stringify(updated));
    } catch {
      // ignore
    }
    setIsEditOpen(false);
    toast.success('Account updated.');
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 pt-6 pb-28 sm:px-6 lg:px-8 lg:pt-8">
      {/* Profile Details Card with Corner Edit Button */}
      <section className="relative rounded-lg border border-border bg-card p-5">
        <button
          type="button"
          onClick={handleOpenEdit}
          className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-all active:scale-95"
          title="Edit account"
          aria-label="Edit account"
        >
          <FontAwesomeIcon icon={faPen} className="size-3.5" />
        </button>

        <div className="flex items-center gap-4 pr-10">
          <UserAvatar initials={getInitials(profile.name)} isMe size="xl" />

          <div className="min-w-0 space-y-1">
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl truncate">
              {profile.name}
            </h1>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
              <FontAwesomeIcon icon={faPhone} className="size-3 text-muted-foreground" />
              <span className="font-mono font-medium text-foreground">{profile.phone}</span>
            </p>
          </div>
        </div>
      </section>

      {/* Edit Account Bottom Sheet */}
      <BottomSheet
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit account"
        description="Update your display name and phone number."
      >
        <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="edit-name" className="text-xs font-semibold text-foreground">
              Full name
            </Label>
            <Input
              id="edit-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Your name"
              className="h-10 rounded-lg text-sm"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-phone" className="text-xs font-semibold text-foreground">
              Phone number
            </Label>
            <Input
              id="edit-phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="+251 91 234 5678"
              className="h-10 rounded-lg text-sm font-mono"
              required
            />
          </div>

          <div className="flex flex-col gap-2 pt-2 sm:flex-row-reverse">
            <Button
              type="submit"
              className="h-10 w-full rounded-full font-semibold"
            >
              Save changes
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditOpen(false)}
              className="h-10 w-full rounded-full font-medium"
            >
              Cancel
            </Button>
          </div>
        </form>
      </BottomSheet>

      {/* Stats Summary (kept as requested) */}
      <dl className="grid grid-cols-3 divide-x divide-border rounded-lg border border-border bg-card text-center shadow-none">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col-reverse py-3.5 px-2">
            <dt className="text-xs text-muted-foreground font-medium">{s.label}</dt>
            <dd className="flex items-center justify-center gap-1 text-base sm:text-lg font-bold text-foreground">
              {s.label === 'Rating' && (
                <FontAwesomeIcon icon={faStar} className="size-3.5 text-foreground" aria-hidden="true" />
              )}
              {s.value}
            </dd>
          </div>
        ))}
      </dl>

      {/* QR Code & ID Card */}
      <section
        aria-label="Delivery QR code"
        className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-card p-6 text-center"
      >
        <div className="rounded-lg border border-border bg-white p-3">
          <QRCode value="dormshi:user:u_me" size={160} label="Personal QR code" />
        </div>
        <p className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          ID: #DRM-8291
        </p>
      </section>

      {/* Legal Footer Links */}
      <p className="flex justify-center gap-4 pb-4 text-xs text-muted-foreground">
        <Link to="/terms" className="hover:text-foreground">Terms</Link>
        <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
        <span>© 2026 Dormshi</span>
      </p>
    </div>
  );
}
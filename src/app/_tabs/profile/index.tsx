import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Header } from '@/ui/layout/Header';
import {
  ProfileOverviewSection,
  ProfileLinksSection,
  type UserProfileData
} from './_components';
import { defaultProfile, profileStats as stats } from '@/data';

export const Route = createFileRoute('/_tabs/profile/')({
  component: ProfilePage,
});

export function ProfilePage() {
  const [profile, setProfile] = useState<UserProfileData>(() => {
    try {
      const saved = localStorage.getItem('dormshi_user_profile');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return defaultProfile;
  });

  const handleSaveProfile = (updated: UserProfileData) => {
    setProfile(updated);
    try {
      localStorage.setItem('dormshi_user_profile', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  return (
    <div className="pb-28">
      <Header title="Account" showBackButton={false} />
      <div className="mx-auto max-w-3xl space-y-6 px-4 pt-4 sm:px-6 lg:px-8">
        {/* Section 1: Profile details, avatar, stats & edit sheet */}
        <ProfileOverviewSection
          profile={profile}
          stats={stats}
          onSaveProfile={handleSaveProfile}
        />

        {/* Section 2: App and community links */}
        <ProfileLinksSection />
      </div>
    </div>
  );
}

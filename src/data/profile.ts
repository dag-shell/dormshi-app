export interface UserProfileData {
  name: string;
  phone: string;
  avatarUrl?: string;
}

export const defaultProfile: UserProfileData = {
  name: 'Maya Okafor',
  phone: '+251 91 234 5678'
};

export interface ProfileStat {
  label: string;
  value: string;
}

export const profileStats: ProfileStat[] = [
  { label: 'Requests', value: '4' },
  { label: 'Deliveries', value: '23' },
  { label: 'Rating', value: '4.9' }
];
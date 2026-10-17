import React from 'react';
import { LegalDocument } from '../components/LegalDocument';
import { privacySections } from '../data/legal';

export function Privacy() {
  return <LegalDocument title="Privacy Policy" sections={privacySections} />;
}
import React from 'react';
import { LegalDocument } from '../components/LegalDocument';
import { termsSections } from '../data/legal';

export function Terms() {
  return <LegalDocument title="Terms of Service" sections={termsSections} />;
}
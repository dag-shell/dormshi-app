import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AppShell } from '@/components/layout/AppShell';
import { Home } from './pages/Home';
import { CreateRequest } from './pages/CreateRequest';
import { RequestDetails } from './pages/RequestDetails';
import { Fulfillment } from './pages/Fulfillment';
import { DeliveryConfirmation } from './pages/DeliveryConfirmation';
import { Wallet } from './pages/Wallet';
import { Profile } from './pages/Profile';
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Home />} />
          <Route path="/requests/new" element={<CreateRequest />} />
          <Route path="/requests/:id" element={<RequestDetails />} />
          <Route path="/requests/:id/track" element={<Fulfillment />} />
          <Route path="/requests/:id/confirm" element={<DeliveryConfirmation />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <Toaster position="top-center" />
    </BrowserRouter>
  );
}
import React, { useState } from 'react';
import GreenTechNav from '../components/greentech/GreenTechNav';
import GreenTechHero from '../components/greentech/GreenTechHero';
import CoreServicesGrid from '../components/greentech/CoreServicesGrid';
import GreenImpactDashboard from '../components/greentech/GreenImpactDashboard';
import MultiStepBookingEngine from '../components/greentech/MultiStepBookingEngine';
import GreenTechFooter from '../components/greentech/GreenTechFooter';

export default function HomePage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingPrefill, setBookingPrefill] = useState({});

  const handleOpenBooking = (initialData = {}) => {
    setBookingPrefill(initialData);
    setIsBookingOpen(true);
  };

  const handleSelectService = (service) => {
    setBookingPrefill({
      services: [service.id]
    });
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#2C3E50] antialiased selection:bg-[#2ECC71]/30 selection:text-[#0F3D2E]">
      {/* 1. Sticky Global Frosted Navigation */}
      <GreenTechNav
        onRequestAudit={() => handleOpenBooking({})}
        onOpenDashboard={() => {
          const el = document.getElementById('impact-dashboard');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <main>
        {/* 2. Hero Section: Split-Screen with Typographic Value Proposition & Green Impact Estimator */}
        <GreenTechHero
          onRequestAuditWithData={(data) => handleOpenBooking(data)}
        />

        {/* 3. Core Services Grid: 3-Column Dynamic Cards with Expandable Eco-Specs */}
        <CoreServicesGrid
          onSelectService={handleSelectService}
        />

        {/* 4. Interactive Green Impact Dashboard: Live Telemetry & Vector Spline Charts */}
        <GreenImpactDashboard />
      </main>

      {/* 5. Editorial-Grade SaaS Footer */}
      <GreenTechFooter
        onRequestAudit={() => handleOpenBooking({})}
      />

      {/* 6. Seamless Multi-Step Booking Engine Wizard (Modal & Mobile Bottom-Sheet) */}
      <MultiStepBookingEngine
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialData={bookingPrefill}
      />
    </div>
  );
}

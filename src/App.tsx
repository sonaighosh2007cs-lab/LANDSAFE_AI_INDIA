import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { FloatingAiAgent } from './components/layout/FloatingAiAgent';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { LocationSelectorModal } from './components/modals/LocationSelectorModal';
import { NotificationDrawer } from './components/modals/NotificationDrawer';
import { AppointmentBookingModal } from './components/modals/AppointmentBookingModal';
import { LocationAnalysisLoader } from './components/common/LocationAnalysisLoader';

// Route pages
import { DashboardOverview } from './pages/DashboardOverview';
import { DisasterNewsPage } from './pages/DisasterNewsPage';
import { LiveWeatherPage } from './pages/LiveWeatherPage';
import { AiAgentPage } from './pages/AiAgentPage';
import { MyAreaPage } from './pages/MyAreaPage';
import { IndiaMapPage } from './pages/IndiaMapPage';
import { AiRiskEngineeringPage } from './pages/AiRiskEngineeringPage';
import { ActiveWarningHotspotPage } from './pages/ActiveWarningHotspotPage';
import { IndianRiskRankingPage } from './pages/IndianRiskRankingPage';
import { GsiHistoricalAnalysisPage } from './pages/GsiHistoricalAnalysisPage';
import { DataPipelinesPage } from './pages/DataPipelinesPage';

const MainLayout: React.FC = () => {
  const {
    activeRoute,
    isOnboardingComplete,
    isAnalyzingLocation,
    analyzingLocationName,
    isAppointmentModalOpen,
    setIsAppointmentModalOpen,
    appointmentServiceType,
  } = useApp();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // If user hasn't completed the onboarding flow yet, render the onboarding setup
  if (!isOnboardingComplete) {
    return (
      <>
        <OnboardingFlow />
        {isAnalyzingLocation && <LocationAnalysisLoader locationName={analyzingLocationName} />}
      </>
    );
  }

  // Active View Router
  const renderCurrentView = () => {
    switch (activeRoute) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'disaster-news':
        return <DisasterNewsPage />;
      case 'live-weather':
        return <LiveWeatherPage />;
      case 'ai-agent':
        return <AiAgentPage />;
      case 'my-area':
        return <MyAreaPage />;
      case 'india-map':
        return <IndiaMapPage />;
      case 'ai-risk-engineering':
        return <AiRiskEngineeringPage />;
      case 'active-warning-hotspot':
        return <ActiveWarningHotspotPage />;
      case 'indian-risk-ranking':
        return <IndianRiskRankingPage />;
      case 'gsi-historical-analysis':
        return <GsiHistoricalAnalysisPage />;
      case 'data-pipelines':
        return <DataPipelinesPage />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-gray-200 flex flex-col font-sans selection:bg-orange-500 selection:text-white relative">
      {/* Dynamic Location Analysis Overlay */}
      {isAnalyzingLocation && <LocationAnalysisLoader locationName={analyzingLocationName} />}

      {/* Top Fixed/Sticky Header */}
      <Header isMobileNavOpen={isMobileNavOpen} setIsMobileNavOpen={setIsMobileNavOpen} />

      {/* Main Body Layout: Left Sidebar + Main Content Offset */}
      <div className="flex-1 flex min-w-0 relative">
        {/* Left Navigation Sidebar (Fixed on desktop, drawer on mobile) */}
        <Sidebar isMobileNavOpen={isMobileNavOpen} setIsMobileNavOpen={setIsMobileNavOpen} />

        {/* Dynamic Main Content & Footer Area (Offset on desktop by lg:pl-72 so it starts AFTER the sidebar) */}
        <div className="flex-1 flex flex-col min-w-0 w-full lg:pl-72">
          {/* Main Stage View */}
          <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {renderCurrentView()}
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </div>

      {/* Global Modals & Drawers */}
      <LocationSelectorModal />
      <NotificationDrawer />
      <AppointmentBookingModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        defaultServiceType={appointmentServiceType}
      />
      <FloatingAiAgent />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import EmailInputSection from './components/EmailInputSection';
import ResultDashboard from './components/ResultDashboard';
import ModelBenchmarksView from './components/ModelBenchmarksView';
import CorpusAnalyticsView from './components/CorpusAnalyticsView';
import BackendConfigModal from './components/BackendConfigModal';
import Footer from './components/Footer';
import { sampleEmails } from './data/sampleEmails';
import { runEmailAnalysis, getBackendConfig, saveBackendConfig } from './services/apiService';

export default function App() {
  const [currentTab, setCurrentTab] = useState('scanner'); // 'scanner' | 'benchmarks' | 'corpus'
  
  // Theme state: 'dark' | 'light'
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('phishshield_theme');
    if (saved) return saved;
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('phishshield_theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const [emailData, setEmailData] = useState({
    senderName: sampleEmails[0].senderName,
    senderEmail: sampleEmails[0].senderEmail,
    subject: sampleEmails[0].subject,
    body: sampleEmails[0].body,
    urls: sampleEmails[0].urls || []
  });

  const [isScanning, setIsScanning] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [backendConfig, setBackendConfig] = useState(getBackendConfig());
  const [activeModel, setActiveModel] = useState(backendConfig.activeModel || 'auto');

  // Handle running the analysis
  const handleAnalyze = async () => {
    if (!emailData.body.trim() && !emailData.subject.trim()) return;

    setIsScanning(true);
    setAnalysisResult(null);

    try {
      const result = await runEmailAnalysis(emailData, activeModel);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsScanning(false);
    }
  };

  // Select a preset sample email
  const handleSelectSample = (sample) => {
    setEmailData({
      senderName: sample.senderName,
      senderEmail: sample.senderEmail,
      subject: sample.subject,
      body: sample.body,
      urls: sample.urls || []
    });
    setAnalysisResult(null);
  };

  // Reset scan and return to input screen
  const handleReset = () => {
    setAnalysisResult(null);
  };

  // Save backend configuration
  const handleSaveBackend = (mode, url) => {
    saveBackendConfig(mode, url, activeModel);
    setBackendConfig({ mode, url, activeModel });
  };

  // Change active ML model
  const handleSelectModel = (modelId) => {
    setActiveModel(modelId);
    saveBackendConfig(backendConfig.mode, backendConfig.url, modelId);
  };

  return (
    <div className="min-h-screen bg-[#edf0f5] dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white transition-colors duration-150">
      
      {/* Enterprise Navigation Bar with Light/Dark Switcher */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        backendConfig={backendConfig}
        activeModel={activeModel}
        onSelectModel={handleSelectModel}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onReset={handleReset}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 pb-12">
        {currentTab === 'scanner' && (
          !analysisResult ? (
            <div className="space-y-4">
              <HeroBanner />
              <EmailInputSection
                emailData={emailData}
                setEmailData={setEmailData}
                onAnalyze={handleAnalyze}
                isScanning={isScanning}
                onSelectSample={handleSelectSample}
              />
            </div>
          ) : (
            <ResultDashboard
              result={analysisResult}
              emailData={emailData}
              onResetScan={handleReset}
            />
          )
        )}

        {currentTab === 'benchmarks' && (
          <ModelBenchmarksView
            activeModel={activeModel}
            onSelectModel={handleSelectModel}
          />
        )}

        {currentTab === 'corpus' && (
          <CorpusAnalyticsView />
        )}
      </main>

      {/* Backend Settings Modal */}
      <BackendConfigModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        backendConfig={backendConfig}
        onSave={handleSaveBackend}
      />

      {/* Footer */}
      <Footer />

    </div>
  );
}

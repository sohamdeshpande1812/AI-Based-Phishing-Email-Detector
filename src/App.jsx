import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import EmailInspectionWorkspace from './components/EmailInspectionWorkspace';
import ResultDashboard from './components/ResultDashboard';
import ModelBenchmarksView from './components/ModelBenchmarksView';
import CorpusAnalyticsView from './components/CorpusAnalyticsView';
import BackendConfigModal from './components/BackendConfigModal';
import Footer from './components/Footer';
import { sampleEmails } from './data/sampleEmails';
import { runEmailAnalysis, getBackendConfig, saveBackendConfig } from './services/apiService';

export default function App() {
  const [currentTab, setCurrentTab] = useState('scanner'); // 'scanner' | 'benchmarks' | 'corpus'
  const [viewMode, setViewMode] = useState('workspace'); // 'workspace' | 'full-dashboard'
  
  // Theme state: default to enterprise dark mode
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
    setViewMode('workspace');
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
    <div className="min-h-screen bg-slate-100 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white transition-colors duration-200 cyber-glow-bg cyber-grid-pattern">
      
      {/* Enterprise Top Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => { setCurrentTab(tab); setViewMode('workspace'); }}
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
          viewMode === 'full-dashboard' && analysisResult ? (
            <ResultDashboard
              result={analysisResult}
              emailData={emailData}
              onResetScan={handleReset}
            />
          ) : (
            <div className="space-y-4">
              <HeroBanner />
              <EmailInspectionWorkspace
                emailData={emailData}
                setEmailData={setEmailData}
                onAnalyze={handleAnalyze}
                isScanning={isScanning}
                analysisResult={analysisResult}
                onSelectSample={handleSelectSample}
                onResetScan={handleReset}
                activeModel={activeModel}
              />
            </div>
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

      {/* Modernized Production Footer */}
      <Footer />

    </div>
  );
}

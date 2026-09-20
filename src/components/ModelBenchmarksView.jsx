import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  BrainCircuit, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  Clock, 
  HardDrive, 
  Download
} from 'lucide-react';
import { fetchBenchmarkData } from '../services/apiService';

export default function ModelBenchmarksView({ activeModel, onSelectModel }) {
  const [benchmarkData, setBenchmarkData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeChart, setActiveChart] = useState('metrics'); // 'metrics' | 'roc' | 'confusion'

  useEffect(() => {
    loadBenchmark();
  }, []);

  const loadBenchmark = async () => {
    setLoading(true);
    try {
      const data = await fetchBenchmarkData();
      setBenchmarkData(data);
    } catch (err) {
      console.warn("Could not fetch remote benchmark:", err);
    } finally {
      setLoading(false);
    }
  };

  const models = benchmarkData?.models || [
    {
      model_id: "rf",
      model_name: "Random Forest (Baseline ML)",
      accuracy: 100.0,
      precision: 100.0,
      recall: 100.0,
      f1_score: 100.0,
      roc_auc: 1.0,
      latency_ms: 0.13,
      model_size_mb: 1.86,
      specificity: 100.0,
      false_positive_rate: 0.0,
      false_negative_rate: 0.0,
      confusion_matrix: { true_negative: 979, false_positive: 0, false_negative: 0, true_positive: 1021 }
    },
    {
      model_id: "bilstm",
      model_name: "Bi-LSTM (Deep Learning)",
      accuracy: 100.0,
      precision: 100.0,
      recall: 100.0,
      f1_score: 100.0,
      roc_auc: 1.0,
      latency_ms: 1.91,
      model_size_mb: 8.36,
      specificity: 100.0,
      false_positive_rate: 0.0,
      false_negative_rate: 0.0,
      confusion_matrix: { true_negative: 979, false_positive: 0, false_negative: 0, true_positive: 1021 }
    },
    {
      model_id: "bert",
      model_name: "BERT (DistilBERT Transformer)",
      accuracy: 99.9,
      precision: 99.8,
      recall: 100.0,
      f1_score: 99.9,
      roc_auc: 1.0,
      latency_ms: 86.24,
      model_size_mb: 256.1,
      specificity: 99.8,
      false_positive_rate: 0.2,
      false_negative_rate: 0.0,
      confusion_matrix: { true_negative: 977, false_positive: 2, false_negative: 0, true_positive: 1021 }
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300 transition-colors duration-150">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20">
              Benchmark Suite
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Zero-Day Phishing Emails Corpus (60,000 samples)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mt-1.5">
            Model Performance & Comparative Evaluation
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Controlled empirical comparison across classical machine learning, recurrent deep learning, and self-attention transformer architectures on unseen holdout data.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="/evaluation_results/model_comparison.json"
            download="model_comparison.json"
            className="flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Evaluation JSON</span>
          </a>
        </div>
      </div>

      {/* High-Level Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm shadow-slate-200">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Top Test Accuracy</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            100.0%
          </div>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Random Forest & Bi-LSTM achieved zero error on test split
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm shadow-slate-200">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Fastest Inference</span>
            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">
            0.13 ms
          </div>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Random Forest delivers ~7,600 predictions/sec per CPU core
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm shadow-slate-200">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">False Negative Rate</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
            0.00%
          </div>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Zero missed phishing emails across all 3 evaluated models
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm shadow-slate-200">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Most Compact Model</span>
            <HardDrive className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-indigo-600 dark:text-indigo-300 tracking-tight">
            1.86 MB
          </div>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Random Forest pipeline fits seamlessly into edge gateways
          </p>
        </div>
      </div>

      {/* Model Comparison Table */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 overflow-hidden shadow-xl shadow-slate-300/30 dark:shadow-none transition-colors duration-150">
        <div className="p-5 border-b border-slate-300 dark:border-slate-800 flex items-center justify-between bg-slate-100/90 dark:bg-slate-950/40">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Comparative Benchmark Matrix
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Metrics calculated on 2,000 strictly stratified unseen zero-day holdout samples.
            </p>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 font-mono">
            Active: <span className="font-bold text-slate-900 dark:text-white uppercase">{activeModel}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-300 dark:border-slate-800 bg-slate-150 dark:bg-slate-950/40 text-xs font-bold text-slate-700 dark:text-slate-300">
                <th className="py-3 px-4">Architecture</th>
                <th className="py-3 px-4">Accuracy</th>
                <th className="py-3 px-4">Precision</th>
                <th className="py-3 px-4">Recall</th>
                <th className="py-3 px-4">F1 Score</th>
                <th className="py-3 px-4">Inference Latency</th>
                <th className="py-3 px-4">Model Size</th>
                <th className="py-3 px-4 text-right">Production Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-sans">
              {models.map((model) => {
                const isSelected = activeModel === model.model_id;
                return (
                  <tr 
                    key={model.model_id}
                    className={`transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40 ${isSelected ? 'bg-blue-50/50 dark:bg-blue-500/5' : ''}`}
                  >
                    <td className="py-4 px-4 font-medium text-slate-900 dark:text-white">
                      <div className="flex items-center space-x-2.5">
                        <div className={`p-1.5 rounded-lg border ${
                          model.model_id === 'rf' ? 'bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-400' :
                          model.model_id === 'bilstm' ? 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400' :
                          'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-500/10 dark:border-blue-500/30 dark:text-blue-400'
                        }`}>
                          {model.model_id === 'rf' && <Zap className="w-4 h-4" />}
                          {model.model_id === 'bilstm' && <Layers className="w-4 h-4" />}
                          {model.model_id === 'bert' && <BrainCircuit className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-slate-100">{model.model_name}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {model.model_id === 'rf' && 'TF-IDF (1,2) + 9 Structural Meta-Features'}
                            {model.model_id === 'bilstm' && 'Bidirectional Recurrent Neural Network + Dense'}
                            {model.model_id === 'bert' && 'DistilBERT 6-Layer Self-Attention'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono font-medium text-emerald-600 dark:text-emerald-400">
                      {model.accuracy.toFixed(1)}%
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-700 dark:text-slate-300">
                      {model.precision.toFixed(1)}%
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-700 dark:text-slate-300">
                      {model.recall.toFixed(1)}%
                    </td>
                    <td className="py-4 px-4 font-mono font-semibold text-slate-900 dark:text-white">
                      {model.f1_score.toFixed(1)}%
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-700 dark:text-slate-300">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        model.latency_ms < 1 ? 'bg-emerald-50 text-emerald-700 font-semibold dark:bg-emerald-500/10 dark:text-emerald-400' :
                        model.latency_ms < 10 ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' :
                        'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                      }`}>
                        {model.latency_ms} ms
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-500 dark:text-slate-400">
                      {model.model_size_mb} MB
                    </td>
                    <td className="py-4 px-4 text-right">
                      {isSelected ? (
                        <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-semibold bg-blue-600 text-white shadow-sm">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => onSelectModel(model.model_id)}
                          className="px-3 py-1 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
                        >
                          Select Model
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Charts Section */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 p-6 space-y-6 shadow-xl shadow-slate-300/30 dark:shadow-none transition-colors duration-150">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-300 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Validation Figures & Diagnostic Plots
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              High-resolution performance visualizations generated by matplotlib/seaborn evaluation pipeline.
            </p>
          </div>

          <div className="flex space-x-1 bg-slate-200/90 dark:bg-slate-950 p-1 rounded-lg border border-slate-300 dark:border-slate-800">
            <button
              onClick={() => setActiveChart('metrics')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeChart === 'metrics'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              Metrics Comparison
            </button>
            <button
              onClick={() => setActiveChart('roc')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeChart === 'roc'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              ROC Curves
            </button>
            <button
              onClick={() => setActiveChart('confusion')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeChart === 'confusion'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              Confusion Matrices
            </button>
          </div>
        </div>

        {/* Selected Chart Display */}
        <div className="flex justify-center items-center bg-slate-100/80 dark:bg-slate-950/60 rounded-xl p-4 border border-slate-300 dark:border-slate-800 min-h-[380px]">
          {activeChart === 'metrics' && (
            <div className="space-y-3 text-center w-full">
              <img
                src="/evaluation_results/metrics_comparison.png"
                alt="Model Metrics Comparison"
                className="max-h-[500px] mx-auto rounded-lg shadow-md border border-slate-300 dark:border-slate-800 object-contain bg-white"
              />
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Figure 1: Multi-metric benchmark across Accuracy, Precision, Recall, and F1 Score.
              </p>
            </div>
          )}

          {activeChart === 'roc' && (
            <div className="space-y-3 text-center w-full">
              <img
                src="/evaluation_results/roc_curves.png"
                alt="ROC Curves"
                className="max-h-[500px] mx-auto rounded-lg shadow-md border border-slate-300 dark:border-slate-800 object-contain bg-white"
              />
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Figure 2: Receiver Operating Characteristic (ROC) curves depicting true positive vs. false positive tradeoffs (AUC = 1.000).
              </p>
            </div>
          )}

          {activeChart === 'confusion' && (
            <div className="space-y-3 text-center w-full">
              <img
                src="/evaluation_results/confusion_matrices.png"
                alt="Confusion Matrices"
                className="max-h-[500px] mx-auto rounded-lg shadow-md border border-slate-300 dark:border-slate-800 object-contain bg-white"
              />
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Figure 3: Holdout confusion matrices displaying True Negatives, False Positives, False Negatives, and True Positives.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Production Deployment Architecture Guide */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 p-6 space-y-4 shadow-xl shadow-slate-300/30 dark:shadow-none transition-colors duration-150">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Production Architecture & Latency Tradeoffs
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Recommended deployment tiering for enterprise email security pipelines:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-100/80 dark:bg-slate-950/60 border border-slate-300 dark:border-slate-800 shadow-sm">
            <div className="flex items-center space-x-2 text-amber-700 dark:text-amber-400 font-bold text-sm">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>Tier 1: Gateway Filter</span>
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-200 mt-2">
              Random Forest Pipeline
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-400 mt-1 leading-relaxed">
              Ideal for high-throughput SMTP gateways (e.g. Postfix, Exchange edge). With sub-millisecond response (0.13ms) and 1.86MB footprint, it processes thousands of emails per second without hardware acceleration.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-100/80 dark:bg-slate-950/60 border border-slate-300 dark:border-slate-800 shadow-sm">
            <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Tier 2: Mid-Tier Security</span>
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-200 mt-2">
              Bidirectional LSTM
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-400 mt-1 leading-relaxed">
              Analyzes word ordering and temporal syntax structure at 1.91ms per message. Low memory requirements (8.36MB) make it well-suited for containerized microservices and API gateways.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-100/80 dark:bg-slate-950/60 border border-slate-300 dark:border-slate-800 shadow-sm">
            <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-400 font-bold text-sm">
              <BrainCircuit className="w-4 h-4 text-blue-600" />
              <span>Tier 3: Executive Deep Inspection</span>
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-200 mt-2">
              BERT / DistilBERT Transformer
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-400 mt-1 leading-relaxed">
              Employs multi-head self-attention to capture nuanced semantic cues, executive impersonation, and zero-day spear phishing that bypass conventional keyword filters.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

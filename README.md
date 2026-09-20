# 🛡️ PhishShield AI - Email Phishing & Threat Detector

An AI-powered cybersecurity web application and threat analysis dashboard designed for detecting phishing, social engineering, and fraudulent email attacks in real-time.

---

## 🌟 Key Features

1. **Multi-Vector Threat Scanning**:
   - **Urgency & Panic Cue Detection**: Identifies psychological coercion, artificial deadlines, and account suspension threats.
   - **Domain & URL X-Ray**: Detects raw IP address hosts, high-risk TLDs (`.xyz`, `.top`, `.click`), typosquatting, and lookalike brand subdomains.
   - **Credential & Financial Harvesting**: Flags requests for passwords, tax forms, direct deposit updates, and payment details.
   - **Sender Spoofing & Header Analysis**: Detects display name impersonation and mismatching sender domains.

2. **Interactive Analysis Dashboard**:
   - **Dynamic Risk Gauge**: 0% to 100% circular SVG score gauge with real-time risk level categorization (Critical / Moderate / Low).
   - **Interactive Threat X-Ray**: Highlights suspicious phrases directly within the email body with clickable threat justification tooltips.
   - **Multi-Vector Score Breakdown**: Progress metrics for Urgency, Data Harvesting, URL Risk, and Sender Integrity.
   - **Actionable Incident Guidance**: Tailored recommendations checklist and one-click incident report copy tool.

3. **Multi-Format Input System**:
   - **Structured Composer**: Separate fields for Sender Name, Email, Subject, Body, and URLs.
   - **Raw EML Paste**: Paste full raw email text with auto-header parsing.
   - **Preset Scenarios**: 1-click test cases for PayPal Phish, HR Payroll Scam, Office 365 Credential Harvester, Safe Meeting Invite, and Safe GitHub Advisory.
   - **File Upload**: Drag-and-drop `.eml` / `.txt` files.

4. **Dual Engine Architecture**:
   - **Built-in AI Threat Engine**: Runs directly in the browser with zero dependencies or external server requirements.
   - **Custom Python ML Backend Connector**: Seamless toggle in the settings to hook up your own FastAPI, Flask, Scikit-learn, or BERT model microservice.

---

## 🚀 Getting Started

### 1. Run the Frontend (Vite + React)

```bash
# Install dependencies (if not already installed)
npm install

# Start the development server
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

---

### 2. (Optional) Run the Python Backend Microservice

If you want to test connecting a custom Python machine learning backend:

```bash
cd backend_sample
pip install -r requirements.txt
python app.py
```

Then in the frontend, click **Built-in Engine** in the top navigation bar, select **Custom Python Backend API**, and enter `http://localhost:8000/api/analyze`.

---

## 📂 Project Structure

```
mini project/
├── index.html                     # Entry HTML with cyber fonts & styling
├── tailwind.config.js             # Custom cyber color palette and animations
├── package.json                   # Dependencies
├── src/
│   ├── main.jsx                   # React root entrypoint
│   ├── App.jsx                    # Core Application logic & state
│   ├── index.css                  # Custom cyber grid & styling
│   ├── data/
│   │   └── sampleEmails.js        # Realistic phishing & legitimate test datasets
│   ├── services/
│   │   ├── analyzerEngine.js      # Multi-vector heuristic & NLP detection engine
│   │   └── apiService.js          # API connector with dual-mode support
│   └── components/
│       ├── Navbar.jsx             # Top bar with sample switcher & API modal trigger
│       ├── HeroBanner.jsx         # Project hero header with security pills
│       ├── EmailInputSection.jsx  # Input workspace (Structured, Raw, Samples, Upload)
│       ├── ScanningOverlay.jsx    # Real-time animated cyber scan checklist
│       ├── ResultDashboard.jsx    # Result view with verdict banner & score gauge
│       ├── RiskGauge.jsx          # Animated circular probability score gauge
│       ├── ThreatBreakdown.jsx    # Progress metrics & red flag indicators
│       ├── EmailXRayView.jsx      # Highlighted text inspector with threat tooltips
│       ├── ActionRecommendations.jsx # Security checklist & incident report copier
│       ├── BackendConfigModal.jsx # Backend connection configuration modal
│       └── Footer.jsx             # Project credits
└── backend_sample/
    ├── app.py                     # Python FastAPI starter microservice
    └── requirements.txt           # Python dependencies
```

/**
 * AI Phishing Email Detection & Threat Analysis Engine
 * Performs multi-vector heuristic, NLP pattern, and domain spoofing analysis.
 */

// Known reputable domain whitelist
const KNOWN_LEGITIMATE_DOMAINS = [
  'google.com', 'gmail.com', 'microsoft.com', 'outlook.com', 'github.com',
  'apple.com', 'amazon.com', 'paypal.com', 'linkedin.com', 'atlassian.net',
  'slack.com', 'stripe.com', 'zoom.us', 'dropbox.com', 'netflix.com'
];

// High-risk TLDs frequently abused in phishing campaigns
const SUSPICIOUS_TLDS = ['.xyz', '.top', '.tk', '.ml', '.ga', '.cf', '.gq', '.click', '.work', '.fit', '.support', '.download', '.site', '.monster'];

// Suspicious brand impersonation keywords in unauthorized domains
const BRAND_TARGETS = ['paypal', 'microsoft', 'micosoft', 'google', 'apple', 'netflix', 'amazon', 'chase', 'bankofamerica', 'wellsfargo', 'coinbase', 'binance', 'support', 'security', 'verify', 'update', 'login', 'portal', 'auth'];

// Threat dictionary with category weights and explanations
const THREAT_PATTERNS = [
  // Urgency & Fear Tactics
  {
    regex: /(within 24 hours|within 2 hours|immediately|urgent:?|action required|account has been suspended|account is locked|temporarily locked|permanent termination|permanent deletion|quarantined|final notice|last warning|account closure)/gi,
    category: 'Urgency & Pressure Tactics',
    severity: 'high',
    weight: 25,
    reason: 'Uses artificial urgency and psychological pressure to force quick, uncritical action.'
  },
  // Credential & Financial Harvesting
  {
    regex: /(verify your identity|credit card credentials|validate your credentials|enter your password|keep same password|direct deposit|w-2 tax|banking details|unauthorized transaction of|billing details|social security|ssn|wire transfer|crypto payment|gift card)/gi,
    category: 'Credential & Financial Harvesting',
    severity: 'high',
    weight: 30,
    reason: 'Directly solicits sensitive credentials, financial records, or payment authorizations.'
  },
  // Suspicious Calls to Action / Deceptive Links
  {
    regex: /(click the official secure link|confirm your identity immediately|restore access|open our employee self-service portal|validate now|click here to verify|reset your password now|unlock your account)/gi,
    category: 'Deceptive Call to Action',
    severity: 'medium',
    weight: 20,
    reason: 'Prompts immediate interaction with unverified external landing pages.'
  },
  // Generic Impersonal Salutations
  {
    regex: /(dear valued customer|dear user|hello team member|dear customer|dear client|dear account holder)/gi,
    category: 'Impersonal Salutation',
    severity: 'medium',
    weight: 15,
    reason: 'Generic greeting typical of mass phishing campaigns lacking personalized metadata.'
  },
  // Threat of Negative Consequences
  {
    regex: /(failure to verify|result in permanent|experience delays in upcoming salary|loss of access|will be permanently disabled)/gi,
    category: 'Threat of Negative Consequences',
    severity: 'high',
    weight: 20,
    reason: 'Coercive language attempting to intimidate the recipient into compliance.'
  }
];

/**
 * Extract URLs from email text
 */
export function extractUrls(text = '') {
  const urlRegex = /(https?:\/\/[^\s<>"']+)/gi;
  const matches = text.match(urlRegex) || [];
  return [...new Set(matches)];
}

/**
 * Analyze a URL for phishing characteristics
 */
export function analyzeUrl(url) {
  const flags = [];
  let riskScore = 0;

  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();

    // Check for IP address in URL
    const isIpAddress = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
    if (isIpAddress) {
      flags.push({
        type: 'ip_url',
        label: 'Raw IP Address Hostname',
        description: `URL uses a bare IP address (${hostname}) rather than a registered domain name, a hallmark of malicious phishing infrastructure.`,
        severity: 'high'
      });
      riskScore += 45;
    }

    // Check for suspicious TLDs
    const hasSuspiciousTld = SUSPICIOUS_TLDS.some(tld => hostname.endsWith(tld));
    if (hasSuspiciousTld) {
      flags.push({
        type: 'suspicious_tld',
        label: 'High-Risk Top Level Domain',
        description: `Domain ends with a high-risk TLD (${hostname}) known for inexpensive or abusive mass domain registrations.`,
        severity: 'high'
      });
      riskScore += 35;
    }

    // Check for brand name abuse or lookalike subdomains
    const brandMatches = BRAND_TARGETS.filter(brand => hostname.includes(brand));
    const isKnownDomain = KNOWN_LEGITIMATE_DOMAINS.some(legit => hostname === legit || hostname.endsWith('.' + legit));
    
    if (brandMatches.length > 0 && !isKnownDomain) {
      flags.push({
        type: 'brand_spoof',
        label: 'Potential Brand Spoofing / Lookalike Domain',
        description: `Domain contains trademarked security or brand keywords (${brandMatches.join(', ')}) but does not resolve to the official verified domain.`,
        severity: 'high'
      });
      riskScore += 40;
    }

    // Check for excessive subdomains or hyphens
    const hyphenCount = (hostname.match(/-/g) || []).length;
    if (hyphenCount >= 2 && !isKnownDomain) {
      flags.push({
        type: 'hyphenated_domain',
        label: 'Excessive Hyphenation in Hostname',
        description: `Hostname contains multiple hyphens (${hostname}), frequently used to spoof legitimate brand identities.`,
        severity: 'medium'
      });
      riskScore += 20;
    }

    // Check for unencrypted HTTP for sensitive action
    if (parsed.protocol === 'http:') {
      flags.push({
        type: 'insecure_http',
        label: 'Unencrypted HTTP Connection',
        description: 'Link uses unencrypted HTTP instead of HTTPS for login or verification portal.',
        severity: 'medium'
      });
      riskScore += 15;
    }

  } catch (err) {
    // Malformed URL
    flags.push({
      type: 'malformed_url',
      label: 'Malformed URL Pattern',
      description: 'The URL could not be parsed into a standard web protocol.',
      severity: 'medium'
    });
    riskScore += 15;
  }

  return {
    url,
    riskScore: Math.min(100, riskScore),
    flags
  };
}

/**
 * Check sender email for spoofing or suspicious domain
 */
export function analyzeSender(senderEmail = '', senderName = '') {
  const flags = [];
  let riskScore = 0;
  
  if (!senderEmail) return { riskScore: 0, flags };

  const emailLower = senderEmail.toLowerCase().trim();
  const domain = emailLower.includes('@') ? emailLower.split('@')[1] : '';

  // Check if sender name claims to be a brand but domain doesn't match
  const nameLower = senderName.toLowerCase();
  
  const knownBrandNames = [
    { name: 'paypal', official: 'paypal.com' },
    { name: 'microsoft', official: 'microsoft.com' },
    { name: 'google', official: 'google.com' },
    { name: 'apple', official: 'apple.com' },
    { name: 'netflix', official: 'netflix.com' },
    { name: 'amazon', official: 'amazon.com' },
    { name: 'github', official: 'github.com' },
  ];

  for (const brand of knownBrandNames) {
    if (nameLower.includes(brand.name) && domain && !domain.endsWith(brand.official)) {
      flags.push({
        type: 'display_name_spoofing',
        label: `Display Name Impersonation (${brand.name.toUpperCase()})`,
        description: `The sender name claims to be from "${senderName}", but the actual email domain is "@${domain}" instead of official "@${brand.official}".`,
        severity: 'high'
      });
      riskScore += 40;
    }
  }

  // Check if domain contains suspicious TLDs or lookalikes
  if (domain) {
    if (SUSPICIOUS_TLDS.some(tld => domain.endsWith(tld))) {
      flags.push({
        type: 'suspicious_sender_tld',
        label: 'Suspicious Sender Domain TLD',
        description: `Sender email domain uses high-risk extension (${domain}).`,
        severity: 'high'
      });
      riskScore += 30;
    }

    if (BRAND_TARGETS.some(b => domain.includes(b)) && !KNOWN_LEGITIMATE_DOMAINS.some(k => domain === k || domain.endsWith('.' + k))) {
      flags.push({
        type: 'lookalike_sender_domain',
        label: 'Lookalike Sender Domain',
        description: `Sender domain contains keywords attempting to mimic an authentic service (${domain}).`,
        severity: 'high'
      });
      riskScore += 35;
    }
  }

  return {
    senderEmail,
    senderName,
    domain,
    riskScore: Math.min(100, riskScore),
    flags
  };
}

/**
 * Main Analyzer Engine Function
 */
export function analyzeEmailContent({ senderName = '', senderEmail = '', subject = '', body = '', urls = [] }) {
  const fullText = `${subject}\n${body}`;
  const extracted = extractUrls(fullText);
  const combinedUrls = [...new Set([...(urls || []), ...extracted])];

  // 1. Text Pattern Analysis & Highlighting
  const matchedThreats = [];
  const highlights = [];
  let textRiskAccumulator = 0;

  THREAT_PATTERNS.forEach(pattern => {
    let match;
    const regex = new RegExp(pattern.regex.source, 'gi');
    
    while ((match = regex.exec(body)) !== null) {
      const matchText = match[0];
      const start = match.index;
      const end = start + matchText.length;

      highlights.push({
        text: matchText,
        start,
        end,
        category: pattern.category,
        severity: pattern.severity,
        reason: pattern.reason
      });

      matchedThreats.push({
        phrase: matchText,
        category: pattern.category,
        severity: pattern.severity,
        reason: pattern.reason
      });

      textRiskAccumulator += pattern.weight;
    }
  });

  // 2. URL Analysis
  const urlAnalysisResults = combinedUrls.map(analyzeUrl);
  const maxUrlRisk = urlAnalysisResults.length > 0 
    ? Math.max(...urlAnalysisResults.map(u => u.riskScore), 0)
    : 0;

  // 3. Sender Analysis
  const senderAnalysis = analyzeSender(senderEmail, senderName);

  // 4. Calculate Sub-Scores (0 to 100 each)
  const urgencyMatches = matchedThreats.filter(t => t.category === 'Urgency & Pressure Tactics' || t.category === 'Threat of Negative Consequences');
  const harvestingMatches = matchedThreats.filter(t => t.category === 'Credential & Financial Harvesting');
  const ctaMatches = matchedThreats.filter(t => t.category === 'Deceptive Call to Action');

  const urgencyScore = Math.min(100, urgencyMatches.length * 40);
  const harvestingScore = Math.min(100, harvestingMatches.length * 45);
  const linksScore = maxUrlRisk > 0 ? maxUrlRisk : (ctaMatches.length > 0 ? 30 : 0);
  const senderScore = senderAnalysis.riskScore;
  const contentScore = Math.min(100, Math.round(textRiskAccumulator * 0.9));

  // 5. Compute Weighted Overall Phishing Probability Score (0 - 100%)
  let totalScore = 0;
  if (highlights.length === 0 && maxUrlRisk === 0 && senderScore === 0) {
    // Pure clean email
    totalScore = 4;
  } else {
    // Weighted combination
    const rawWeighted = (
      (urgencyScore * 0.25) +
      (harvestingScore * 0.30) +
      (linksScore * 0.25) +
      (senderScore * 0.20)
    );
    // Amplify if multiple threat vectors exist simultaneously
    const vectorCount = (urgencyScore > 0 ? 1 : 0) + (harvestingScore > 0 ? 1 : 0) + (linksScore > 30 ? 1 : 0) + (senderScore > 0 ? 1 : 0);
    const synergyBonus = vectorCount >= 3 ? 15 : (vectorCount === 2 ? 8 : 0);
    
    totalScore = Math.min(99, Math.max(8, Math.round(rawWeighted + synergyBonus)));
  }

  // 6. Classification & Verdict
  let verdict = 'legitimate';
  let verdictTitle = 'Legitimate & Safe';
  let verdictBadge = 'LOW RISK';
  let themeColor = 'safe'; // 'safe', 'warning', 'danger'

  if (totalScore >= 70) {
    verdict = 'phishing';
    verdictTitle = 'Phishing Threat Detected';
    verdictBadge = 'HIGH RISK CRITICAL';
    themeColor = 'danger';
  } else if (totalScore >= 40) {
    verdict = 'suspicious';
    verdictTitle = 'Suspicious / Potential Threat';
    verdictBadge = 'MEDIUM RISK';
    themeColor = 'warning';
  }

  // 7. Generate Key Red Flags List
  const redFlags = [];

  if (senderAnalysis.flags.length > 0) {
    senderAnalysis.flags.forEach(f => {
      redFlags.push({ title: f.label, description: f.description, severity: f.severity });
    });
  }

  urlAnalysisResults.forEach(u => {
    u.flags.forEach(f => {
      redFlags.push({ title: f.label, description: f.description, severity: f.severity, url: u.url });
    });
  });

  if (urgencyMatches.length > 0) {
    redFlags.push({
      title: 'High Urgency / Coercion Tactics',
      description: `Detected ${urgencyMatches.length} high-urgency phrase(s) designed to induce panic and bypass logical scrutiny.`,
      severity: 'high'
    });
  }

  if (harvestingMatches.length > 0) {
    redFlags.push({
      title: 'Credential / Financial Solicitation',
      description: 'Email explicitly requests passwords, tax details, or banking authentication.',
      severity: 'high'
    });
  }

  // 8. Generate Actionable Security Recommendations
  const recommendations = [];
  if (verdict === 'phishing') {
    recommendations.push({
      title: 'Do NOT click any embedded links or attachments',
      details: 'The links likely lead to credential harvesting sites or malicious drive-by payload downloads.'
    });
    recommendations.push({
      title: 'Report to your Security / IT Operations Team',
      details: 'Forward this email as an attachment to your security department (e.g., phish@company.com).'
    });
    recommendations.push({
      title: 'Mark as Phishing in your Email Client',
      details: 'Help global spam filters identify and block this campaign for other users.'
    });
    recommendations.push({
      title: 'Do NOT reply to the sender',
      details: 'Replying confirms that your email address is active and monitored.'
    });
  } else if (verdict === 'suspicious') {
    recommendations.push({
      title: 'Verify via alternative official communication channel',
      details: 'Contact the alleged sender via a known phone number or separate portal before taking action.'
    });
    recommendations.push({
      title: 'Inspect full URL destinations before clicking',
      details: 'Hover over hyperlinks to verify the actual domain matches official service providers.'
    });
  } else {
    recommendations.push({
      title: 'No overt security threats detected',
      details: 'Email exhibits standard communication patterns with authentic domain signatures.'
    });
    recommendations.push({
      title: 'Standard Security Hygiene',
      details: 'Always maintain caution with unexpected attachments or requests for money.'
    });
  }

  return {
    verdict,
    verdictTitle,
    verdictBadge,
    themeColor,
    score: totalScore,
    confidence: totalScore >= 70 ? Math.min(99, 85 + Math.round((totalScore - 70) * 0.45)) : (totalScore <= 30 ? Math.min(99, 90 + Math.round((30 - totalScore) * 0.3)) : 82),
    timestamp: new Date().toISOString(),
    metrics: {
      urgencyScore,
      harvestingScore,
      linksScore,
      senderScore,
      contentScore
    },
    redFlags,
    highlights,
    urlAnalysis: urlAnalysisResults,
    senderAnalysis,
    recommendations,
    stats: {
      totalWords: body.trim().split(/\s+/).filter(Boolean).length,
      totalUrls: combinedUrls.length,
      totalThreatSpans: highlights.length
    }
  };
}

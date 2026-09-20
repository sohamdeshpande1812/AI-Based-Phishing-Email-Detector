export const sampleEmails = [
  {
    id: 'phishing-paypal',
    name: 'PayPal - Urgent Account Suspension',
    type: 'phishing',
    badge: 'High Risk Phishing',
    senderName: 'PayPal Security Team',
    senderEmail: 'security-alert@service-paypal-verify.com',
    subject: 'URGENT: Your account has been suspended due to suspicious activity (Action Required)',
    body: `Dear Valued Customer,

We detected an unauthorized transaction of $489.99 from an unrecognized IP address (185.220.101.5) on your PayPal account. 

For your safety and protection, your PayPal account has been temporarily LOCKED and all outgoing transfers are suspended.

To restore access and prevent permanent account termination, you must verify your identity and credit card credentials within 24 HOURS.

Click the official secure link below to confirm your identity immediately:
http://paypal-verification-center.secure-login-portal.com/update-auth

Failure to verify within 24 hours will result in permanent deletion of your PayPal balance and account closure.

Thank you for your prompt attention.
PayPal Fraud Prevention & Security Department
Case ID: PP-99482-SEC`,
    urls: ['http://paypal-verification-center.secure-login-portal.com/update-auth']
  },
  {
    id: 'phishing-hr-payroll',
    name: 'HR Dept - Mandatory Direct Deposit Update',
    type: 'phishing',
    badge: 'High Risk Phishing',
    senderName: 'Human Resources Management',
    senderEmail: 'hr-payroll-notice@internal-company-portal.net',
    subject: 'MANDATORY: Update Your Direct Deposit & Tax Withholding Information Immediately',
    body: `Hello Team Member,

Due to our upcoming fiscal year tax adjustments and automated payroll audit, all active employees must re-verify their direct deposit banking details and submit their updated W-2 tax forms.

Any employee who fails to complete this verification by 5:00 PM today will experience delays in upcoming salary disbursement.

Please open our employee self-service portal to submit your banking details and password:
https://portal-payroll-benefits.secure-auth-system.xyz/login

Please do NOT reply to this automated system email.

Regards,
Internal HR & Payroll Administration
Global Workplace Services`,
    urls: ['https://portal-payroll-benefits.secure-auth-system.xyz/login']
  },
  {
    id: 'phishing-microsoft-365',
    name: 'Microsoft 365 - Password Expiration Notice',
    type: 'phishing',
    badge: 'Credential Harvester',
    senderName: 'Microsoft Office 365 Admin',
    senderEmail: 'admin-notification@micosoft-online-support.com',
    subject: 'Action Required: Your Microsoft 365 password expires in 2 hours',
    body: `Dear User,

Your Microsoft Office 365 business email password is scheduled to expire in 2 hours.

If you wish to retain your current password and avoid losing access to your Outlook inbox, OneDrive files, and Teams chats, you must validate your credentials immediately.

Keep Same Password & Validate Now:
http://192.241.144.78/ms-office-auth/keep-password.html

If you do not take action before the expiration window, your corporate mailbox will be quarantined.

Microsoft Cloud Security Services
One Microsoft Way, Redmond, WA`,
    urls: ['http://192.241.144.78/ms-office-auth/keep-password.html']
  },
  {
    id: 'legitimate-meeting',
    name: 'Google Meet - Team Sprint Planning',
    type: 'legitimate',
    badge: 'Legitimate & Safe',
    senderName: 'Alex Rivera (Engineering Lead)',
    senderEmail: 'alex.rivera@techcorp.com',
    subject: 'Sprint Planning & Architecture Review - Thursday 2:00 PM EST',
    body: `Hi Team,

Hope you're having a productive week!

Please find the agenda for our upcoming Sprint 24 Planning session scheduled for this Thursday at 2:00 PM EST:

1. Review remaining backlog tickets from Sprint 23
2. Technical demo of the new OAuth authentication service
3. Capacity allocation and sprint goal commitments
4. Q&A and architecture discussion

Google Meet link: https://meet.google.com/abc-defg-hij
Sprint Board: https://techcorp.atlassian.net/jira/software/projects/PROJ

Feel free to add any specific topics to the shared Google Doc before tomorrow morning.

Best regards,
Alex Rivera
Lead Software Architect | TechCorp Systems`,
    urls: ['https://meet.google.com/abc-defg-hij', 'https://techcorp.atlassian.net/jira/software/projects/PROJ']
  },
  {
    id: 'legitimate-github-notification',
    name: 'GitHub - Dependabot Security Advisory',
    type: 'legitimate',
    badge: 'Legitimate & Safe',
    senderName: 'GitHub Support',
    senderEmail: 'notifications@github.com',
    subject: '[GitHub] Dependabot alert resolved: CVE-2026-1128 in mini-project repository',
    body: `Hello @soham-deshpande,

Dependabot has detected that the security vulnerability in package "axios" (CVE-2026-1128) in your repository 'mini-project' has been resolved by PR #14.

Repository: github.com/soham-deshpande/mini-project
Base Branch: main
Status: Closed and Merged

You can view the audit log and vulnerability details directly in your security dashboard:
https://github.com/soham-deshpande/mini-project/security/dependabot

No further action is required from your side.

-- 
The GitHub Team
GitHub, Inc. 88 Colin P Kelly Jr St, San Francisco, CA 94107`,
    urls: ['https://github.com/soham-deshpande/mini-project/security/dependabot']
  }
];

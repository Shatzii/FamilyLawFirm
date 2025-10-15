# 🏔️ BAM FamiLex AI - Colorado Family Law Platform

![Frontend CI](https://github.com/Shatzii/FamilyLawFirm/actions/workflows/frontend.yml/badge.svg)
![Backend CI](https://github.com/Shatzii/FamilyLawFirm/actions/workflows/backend.yml/badge.svg)
![Frontend Audit](https://github.com/Shatzii/FamilyLawFirm/actions/workflows/audit-frontend.yml/badge.svg)
![Backend Audit](https://github.com/Shatzii/FamilyLawFirm/actions/workflows/audit-backend.yml/badge.svg)

**Professional offline-capable family law practice management platform** specifically designed for Colorado attorneys and their clients.

## 🎯 Project Overview

BAM FamiLex AI is a comprehensive Next.js 14 TypeScript application that provides:

- **Colorado-specific child support and parenting time calculators** (CRS 14-10-115 compliant)
- **JDF form auto-filling and generation** for all Colorado Judicial Department forms
- **Secure co-parent communication platform** with HIPAA compliance
- **Local SQLite database** for complete offline development and privacy
- **AI-powered legal assistance** specialized in Colorado family law
- **Document management system** with e-signature capabilities

## 🚀 Quick Start (Offline Development)

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn
- VS Code (recommended)
- Git

### Installation & Setup

1. **Clone or download this repository:**

   ```bash
   # If using git
   git clone https://github.com/Shatzii/FamilyLawFirm.git
   cd FamilyLawFirm
   
   # OR download and extract ZIP
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**

   ```text
   http://localhost:3000
   ```

**🎉 You're ready to develop!** The entire platform runs locally with no internet dependency.

## Track B: Full Stack with Docker

For a self-hosted stack with Postgres, Redis, MinIO, backend API, and AI service:

1. Create an environment file based on `.env.example` and update secrets.
2. Start core services:

   ```powershell
   # Windows PowerShell
   ./deploy-bam-familex.ps1
   ```

   Or enable optional services (Matrix, Jitsi, DocuSeal, Cal.com, Umami, Ollama):

   ```powershell
   ./deploy-bam-familex.ps1 -IncludeExtras
   ```

3. Access URLs:
   - Frontend: <http://localhost:3000>
   - API: <http://localhost:3001>
   - MinIO Console: <http://localhost:9001>
   - DocuSeal: <http://localhost:3002>
   - Cal.com: <http://localhost:3003>
   - Umami: <http://localhost:3004>

Docker files:

- `docker-compose.yml` – service orchestration
- `Dockerfile.frontend` – Next.js dev container
- `packages/backend` – FastAPI API container
- `packages/ai-services/legal-nlp` – Minimal AI service

## �📁 Project Structure

```text
BAM-FAMILEX-AI/
├── app/                          # Next.js 14 App Router
│   ├── components/              # React components
│   │   ├── ColoradoDashboard.tsx # Main dashboard
│   │   ├── CalculatorSuite.tsx  # Colorado calculators
│   │   ├── ColoradoForms.tsx    # JDF form components
│   │   └── CoParentingHub.tsx   # Communication platform
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles with legal branding
├── lib/                         # Core business logic
│   ├── colorado-laws.ts         # Colorado statutes & regulations
│   ├── calculators.ts           # Child support & parenting time
│   ├── database.ts              # Local SQLite operations
│   └── forms.ts                 # JDF form definitions
├── public/                      # Static assets
├── .github/                     # GitHub configuration
│   └── copilot-instructions.md  # AI assistant instructions
├── package.json                 # Project configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

## ⚖️ Colorado Law Compliance

### Child Support Calculations

- Implements Colorado Income Shares Model per **CRS 14-10-115**
- Includes parenting time adjustments (92-365 nights)
- Handles extraordinary expenses and deviations
- Generates **JDF 1360** compatible data

### Parenting Time Analysis

- Colorado-specific schedules and best interests factors
- Overnight calculation per **CRS 14-10-124**
- Holiday and summer schedule optimization
- **JDF 1113** parenting plan generation

### Court Forms (JDF)

- **JDF 1111**: Petition for Dissolution
- **JDF 1113**: Parenting Plan
- **JDF 1115**: Permanent Orders
- **JDF 1360**: Child Support Calculation
- Auto-population with case data

## 💼 Features

### 🧮 Colorado Calculators

- **Child Support Calculator**: CRS-compliant income shares model
- **Parenting Time Calculator**: Overnight distribution analysis
- **Asset Division**: Equitable distribution scenarios
- **Maintenance Calculator**: Colorado spousal support guidelines

### 📋 Document Management

- JDF form auto-filling with case data
- PDF generation with legal formatting
- Document version control and audit trails
- Secure client document sharing

### 💬 Secure Communication

- HIPAA-compliant messaging (Matrix.org integration)
- Video conferencing (Jitsi integration)
- Co-parent scheduling and coordination
- Attorney-client privileged communications

### 🤖 FamiLex AI Assistant

- Colorado family law expertise
- Document analysis and review
- Case strategy recommendations
- Legal research assistance

## 🛠️ Development Commands

```bash
# Development server
npm run dev              # Start dev server at http://localhost:3000

# Building & Testing
npm run build           # Create production build
npm run start          # Start production server
npm run lint           # Run ESLint for code quality

# Database Operations
npm run db:init        # Initialize SQLite database
npm run db:seed        # Seed with sample data
```

## 🔒 Security & Privacy

### Data Protection

- **Local SQLite database** - no cloud dependencies
- **Client-attorney privilege** protection
- **HIPAA compliance** for healthcare information
- **Encrypted communications** for sensitive data

### Offline Capability

- **Complete offline development** after initial setup
- **No internet dependency** for core functionality
- **Local data storage** for maximum privacy
- **Self-hosted deployment** options available

## 📱 Technology Stack

### Frontend

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** with legal-specific styling
- **Radix UI** for accessible components
- **Lucide React** for icons

### Backend & Database

- **SQLite** for local development
- **Node.js** server-side rendering
- **Recharts** for data visualization
- **jsPDF** for document generation

### Legal Integrations

- **Colorado statutes** database
- **JDF form** templates
- **Court calendar** integration ready
- **E-signature** preparation (DocuSeal compatible)

## 🏛️ Colorado County Support

Configured for major Colorado jurisdictions:

| County    | Judicial District | E-Filing | Mediation |
|-----------|------------------|----------|-----------|
| Denver    | 2nd J.D.         | ✅        | Required  |
| Arapahoe  | 18th J.D.        | ✅        | Required  |
| Jefferson | 1st J.D.         | ✅        | Required  |
| Boulder   | 20th J.D.        | ✅        | Required  |

## 📈 Roadmap

### Phase 1 (Current) - Offline Development

- ✅ Colorado calculators and forms
- ✅ Local database and UI components
- ✅ Basic document generation

### Phase 2 - Enhanced Features

- [ ] Advanced AI document analysis
- [ ] Court calendar integration
- [ ] Multi-case management dashboard
- [ ] Advanced reporting and analytics

### Phase 3 - Professional Deployment

- [ ] Secure cloud deployment options
- [ ] Multi-user attorney firm support
- [ ] Advanced e-signature workflows
- [ ] API integration with court systems

## 🤝 Contributing

This is a professional legal technology platform. Development follows strict security and compliance standards:

1. **Fork** the repository
2. **Create** a feature branch
3. **Follow** TypeScript and legal tech best practices
4. **Test** all Colorado law calculations thoroughly
5. **Submit** pull request with detailed description

## 📄 Legal Disclaimers

### Attorney Supervision Required

- This software is a **tool for licensed attorneys**
- All legal documents require **attorney review** before filing
- **No attorney-client relationship** is created by use of this software
- Users must comply with Colorado Rules of Professional Conduct

### Accuracy & Liability

- Calculations based on current Colorado statutes (updated 2024)
- Users responsible for verifying current law and local rules
- **No warranty** provided for legal accuracy or completeness
- Professional liability insurance recommended

## 📞 Support & Contact

### BAM Family Law Technology Platform

- Website: [BAM Family Law]
- Support: Legal technology specialists
- Documentation: Comprehensive guides for Colorado attorneys

---

### 🔐 Confidentiality Notice

This software may contain confidential and privileged attorney-client communications and work product. Use only in compliance with applicable professional conduct rules and confidentiality requirements.

**© 2024 BAM Family Law. Professional Legal Technology Platform.**

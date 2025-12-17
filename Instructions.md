1\. Executive Summary 

1.1 What is Beqst? 

Beqst is a comprehensive digital estate planning platform designed specifically for the UK market. It enables individuals to organise, document, and secure their entire legacy in one trusted location, while providing executors with the tools they need to efficiently manage estate administration after death. 

The platform transforms the traditionally complex, expensive, and emotionally draining process of estate planning and probate into a guided, affordable, and accessible digital experience. 

1.2 The Problem We Solve 

The UK faces a significant estate planning crisis with far-reaching consequences: 

|

Challenge 

 |

Impact 

 |
|

60% Without Wills 

 |

The majority of UK adults have no valid will, leaving families vulnerable to intestacy laws 

 |
|

£2.1B Unclaimed 

 |

Billions in assets remain unclaimed annually due to poor documentation 

 |
|

9-12 Month Probate 

 |

Complex, stressful probate processes burden grieving families 

 |
|

£3K-£10K Legal Costs 

 |

Professional estate planning and probate services remain prohibitively expensive 

 |
|

Digital Asset Crisis 

 |

Cryptocurrency, online accounts, and digital assets are increasingly lost 

 |

1.3 Our Solution 

Beqst provides a secure, guided platform where users can: 

-   Create or upload their will with intelligent document processing 

-   Document all assets (property, investments, pensions, digital accounts, cryptocurrency) 

-   Allocate assets to beneficiaries with visual percentage-based distribution 

-   Store critical documents in an encrypted digital vault 

-   Designate and prepare executors with clear instructions 

-   Enable executors to efficiently manage probate (Phase 2) 

1.4 Market Opportunity 

|

TAM (Total) 

 |

SAM (Serviceable) 

 |

SOM (5-Year) 

 |
|

£2.1B annually 

 |

£420M digital-ready 

 |

£42M target 

 |

Target Market: 18 million UK adults aged 25-65 without comprehensive estate plans 

1.5 Revenue Model 

|

Tier 

 |

Price 

 |

Features 

 |
|

FREE 

 |

£0/month 

 |

1 estate, 5 assets, 100MB storage - Lead generation 

 |
|

BASIC 

 |

£9.99/month 

 |

Unlimited assets, will creation, OCR processing, 2GB storage 

 |
|

PREMIUM 

 |

£24.99/month 

 |

AI document analysis, advanced reports, priority support, 10GB 

 |
|

PROFESSIONAL 

 |

£99.99/month 

 |

For solicitors: white-label, unlimited storage, API access 

 |

1.6 Why Now? 

-   COVID-19 increased death awareness and estate planning urgency by 300% 

-   Digital transformation acceptance at an all-time high across demographics 

-   Inheritance tax threshold changes driving increased planning needs 

-   The great wealth transfer: £5.5 trillion moving to the next generation 

-   Growing digital asset ownership (cryptocurrency, online businesses, social media) 

2\. Product Vision & Architecture 

2.1 Three-Phase Development Strategy 

Beqst is architected as a modular platform that will evolve through three distinct phases, each building upon the previous while maintaining backward compatibility and data integrity. 

Phase 1: Owner Portal (MVP) --- This Document 

Scope: 15 core pages enabling estate owners to create comprehensive digital estate plans 

Users: Estate owners (individuals planning their legacy) 

Key Features: User authentication, asset management, beneficiaries, executors, document vault, will creation, subscription management 

Revenue: Subscription tiers (FREE, BASIC, PREMIUM) 

Phase 2: Executor Portal (Post-MVP) 

Scope: ~20 additional pages for executor-specific functionality 

Users: Designated executors managing estates after death 

Key Features: Death notification workflow, estate dashboard, probate tools, HMRC IHT assistance, beneficiary communication 

Revenue: Executor portal access fee (£49-£99 one-time or £9.99/month) 

Phase 3: Beneficiary Portal (Future) 

Scope: ~10 additional pages for beneficiary transparency 

Users: Named beneficiaries tracking their inheritance 

Key Features: Inheritance tracker, probate timeline, secure messaging, document access, digital signatures 

Revenue: Conversion funnel to owner accounts 

2.2 Scale-Ready Design Principles 

The architecture anticipates all three phases from day one to avoid expensive refactoring: 

-   Multi-tenancy support: Users, Executors, Beneficiaries as separate but connected entities 

-   Role-based access control (RBAC) implemented from day one 

-   Notification system designed for one-to-many and many-to-many patterns 

-   Document permission model supporting granular access control 

-   API versioning to support future portal-specific endpoints 

-   Modular services with clear boundaries that can evolve to microservices 

-   Event-driven communication patterns ready for future scaling 

3\. Technical Architecture 

3.1 Technology Stack 

The following technology choices balance developer productivity, performance, security, and long-term maintainability: 

|

Layer 

 |

Technology 

 |

Rationale 

 |
|

Frontend 

 |

Next.js 14+, React 18, TypeScript 

 |

SSR for SEO, type safety, excellent DX 

 |
|

Styling 

 |

Tailwind CSS + shadcn/ui 

 |

Rapid development, consistent design system 

 |
|

Backend 

 |

Node.js + Express/NestJS 

 |

JS everywhere, vast ecosystem 

 |
|

Database 

 |

PostgreSQL 14+ with Prisma 

 |

ACID compliance, complex queries, type-safe ORM 

 |
|

Cache 

 |

Redis 

 |

Sessions, rate limiting, job queues 

 |
|

Storage 

 |

AWS S3 or Cloudflare R2 

 |

Industry standard, scalable, S3-compatible 

 |
|

Payments 

 |

Stripe 

 |

Best-in-class API, SCA compliant 

 |
|

Email 

 |

SendGrid or Amazon SES 

 |

Reliable transactional email delivery 

 |
|

AI/OCR 

 |

Claude API + AWS Textract 

 |

Intelligent document analysis 

 |
|

Hosting 

 |

Vercel (FE) + Railway (BE) 

 |

Auto-scaling, excellent DX, cost-effective 

 |
|

Job Queue 

 |

BullMQ 

 |

Redis-based queue for background jobs 

 |

3.2 Service Architecture 

The platform uses a modular monolith approach that can evolve to microservices: 

|

Service 

 |

Responsibilities 

 |

Dependencies 

 |
|

Auth Service 

 |

Registration, login, JWT, 2FA, password reset 

 |

Redis, SendGrid 

 |
|

Estate Service 

 |

Assets, beneficiaries, executors, allocations 

 |

Auth Service 

 |
|

Document Service 

 |

Upload, storage, OCR, AI analysis 

 |

S3, Claude API, BullMQ 

 |
|

Payment Service 

 |

Subscriptions, billing, webhooks 

 |

Stripe, Auth Service 

 |
|

Will Service 

 |

Will wizard, template generation, PDF 

 |

Estate, Document Service 

 |

4\. Security & Compliance 

⚠️ CRITICAL: This application handles wills, bank details, and sensitive financial data. Security requirements are non-negotiable and must be implemented with bank-grade standards. 

4.1 Data Encryption 

Encryption at Rest (Field-Level) 

The following fields MUST be encrypted using AES-256-CBC with unique IV per record: 

-   Asset account numbers and sort codes 

-   Passwords and credentials for digital assets 

-   National Insurance numbers 

-   Any personally identifiable information (PII) 

-   Cryptocurrency wallet addresses and seed phrase locations 

Encryption keys must be stored in environment variables, never in code, and rotated quarterly. 

Encryption in Transit 

-   HTTPS enforced for all connections (HSTS headers required) 

-   TLS 1.3 minimum for all connections 

-   Secure cookies (httpOnly, secure, sameSite=strict) 

4.2 Authentication Requirements 

Password Requirements 

-   Minimum 12 characters 

-   Must include: uppercase, lowercase, number, special character 

-   bcrypt hashing with cost factor 12+ 

-   Password strength indicator in UI 

Session Management 

-   JWT tokens with 7-day expiry 

-   Refresh token mechanism for seamless re-authentication 

-   Rate limiting: 5 login attempts per 15 minutes per IP 

-   Session storage in Redis with automatic expiry 

-   Email verification required before full platform access 

4.3 Role-Based Access Control (RBAC) 

RBAC system implemented from Phase 1 to support future phases: 

|

Role 

 |

Permissions 

 |
|

OWNER 

 |

Full CRUD on all estate data (assets, beneficiaries, executors, documents, will) 

 |
|

EXECUTOR 

 |

(Phase 2) Read access to estate, assets, beneficiaries; Read/download documents 

 |
|

BENEFICIARY 

 |

(Phase 3) Filtered read access to own inheritance details only 

 |

4.4 GDPR Compliance 

|

GDPR Right 

 |

Implementation 

 |
|

Right to Access 

 |

GET /api/v1/gdpr/export - Download all user data 

 |
|

Right to Rectification 

 |

PUT /api/v1/user/profile - Update any personal data 

 |
|

Right to Erasure 

 |

DELETE /api/v1/gdpr/erase - Account deletion with 30-day grace 

 |
|

Right to Portability 

 |

GET /api/v1/gdpr/portable - Export in JSON format 

 |
|

Consent Management 

 |

PUT /api/v1/gdpr/consent - Manage consent preferences 

 |

4.5 API Security 

Rate Limiting 

-   General API: 100 requests per 15 minutes per user 

-   Auth endpoints: 5 login attempts per 15 minutes per IP 

-   File upload: 20 uploads per hour per user 

-   Password reset: 3 requests per hour per email 

Input Validation & Protection 

-   Validate ALL user inputs using Zod schemas 

-   Sanitize for XSS attacks 

-   Use parameterized queries (Prisma prevents SQL injection) 

-   CSRF tokens for state-changing requests 

5\. Data Architecture 

5.1 Database Design Philosophy 

PostgreSQL was chosen for its ACID compliance, complex relationship handling, JSONB support for flexible data, full-text search capabilities, and proven reliability with financial data. 

Normalisation: 3NF with strategic denormalisation for performance 

Primary Keys: UUIDs for all tables to support distributed systems 

Soft Deletes: deleted_at timestamp on sensitive tables for audit trails 

5.2 Core Entity Relationships 

-   User → Estates (One-to-Many): One user can have multiple estates 

-   Estate → Assets (One-to-Many): An estate contains multiple assets 

-   Estate → Beneficiaries (One-to-Many): An estate can have multiple beneficiaries 

-   Asset → Beneficiaries (Many-to-Many via Allocations): Assets allocated by percentage 

-   Estate → Documents (One-to-Many): Multiple associated documents 

-   Asset → Liability (One-to-One optional): Linked liabilities (e.g., mortgage) 

5.3 Core Database Tables 

Users Table 

Key Fields: id (UUID PK), email (unique), password_hash, first_name, last_name, date_of_birth, phone_number, address fields, email_verified, two_factor_enabled, subscription_tier, stripe_customer_id, created_at, updated_at, deleted_at 

Estates Table 

Key Fields: id (UUID PK), owner_id (FK), owner_name, date_of_birth, date_of_death, status (ACTIVE | DEATH_INITIATED | DEATH_VERIFIED | PROBATE_IN_PROGRESS | CLOSED), has_will, will_type, total_asset_value, total_liability_value, net_estate_value, estimated_iht 

Assets Table 

Asset Types: BANK_ACCOUNT, PROPERTY, INVESTMENT, PENSION, INSURANCE, VEHICLE, PERSONAL_PROPERTY, DIGITAL, CRYPTOCURRENCY, BUSINESS, OTHER 

Key Fields: id, estate_id (FK), asset_type, asset_name, current_value, ownership_type, ownership_percentage, institution_name, account_number_encrypted, sort_code_encrypted 

Beneficiaries Table 

Inheritance Types: RESIDUARY (percentage of remaining), SPECIFIC (specific assets), CONTINGENT (backup) 

Key Fields: id, estate_id (FK), user_id (FK optional), full_name, relationship, email, inheritance_type, residuary_percentage, total_inheritance_value 

Beneficiary Allocations Table 

Allocation Types: PERCENTAGE (e.g., 50%), SPECIFIC_AMOUNT (e.g., £10,000), SPECIFIC_ITEM 

Constraint: Sum of percentages per asset must equal 100% 

Executors Table 

Executor Types: PRIMARY, CO_EXECUTOR, ALTERNATE 

Key Fields: id, estate_id (FK), full_name, relationship, email, phone, executor_type, appointment_order, invited_at, accepted_at, instruction_text 

Documents Table 

Document Types: WILL, DEATH_CERTIFICATE, PROPERTY_DEED, INSURANCE_POLICY, BANK_STATEMENT, TAX_RETURN, PENSION_STATEMENT, OTHER 

Key Fields: id, estate_id (FK), file_name, file_type, file_size, storage_url, document_type, ocr_processed, ocr_text, extracted_data (JSONB), ai_confidence_score 

Liabilities Table 

Liability Types: MORTGAGE, LOAN, CREDIT_CARD, OVERDRAFT, TAX_OWED, BUSINESS_DEBT, OTHER 

Key Fields: id, estate_id (FK), liability_type, creditor_name, current_balance, linked_asset_id (FK optional), repayment_priority 

Audit Logs Table 

Key Fields: id, user_id (FK), estate_id, action, entity_type, entity_id, changes_before (JSONB), changes_after (JSONB), ip_address, user_agent, timestamp 

6\. MVP Page Specifications (15 Pages) 

The MVP consists of 15 pages providing a complete estate planning experience. Each page uses mobile-first responsive design, progressive disclosure, inline help, and auto-save functionality. 

Page 1: Authentication (Sign Up / Login) 

Route: /auth 

Purpose: Secure account creation and authentication 

Features: Tab-based UI, email/password with validation, password strength indicator, OAuth (Google, Apple), email verification, forgot password flow, rate limiting 

API: POST /api/auth/register, /login, /forgot-password, /reset-password, GET /verify-email 

Page 2: Onboarding Wizard 

Route: /onboarding 

Purpose: Welcome first-time users, reduce abandonment 

Steps: 1) Welcome screen, 2) How it works, 3) What you'll add, 4) Create first estate (name, DOB, address) 

Features: Progress dots, Skip option, saves progress to localStorage 

Page 3: Dashboard 

Route: /dashboard 

Purpose: Central hub showing estate overview and quick actions 

Components: Summary cards (total items, executors, last updated), completion progress bar, category cards (Financial, Legal, Insurance, People), recent activity feed, quick action buttons 

API: GET /api/estates/:id/dashboard 

Page 4: Estate Summary / Net Worth 

Route: /dashboard/summary 

Purpose: Detailed financial breakdown with IHT estimation 

Features: Financial summary card, asset breakdown pie chart, liabilities list, IHT calculation explainer, PDF export 

API: GET /api/estates/:id/summary 

Page 5: Asset Dashboard 

Route: /assets 

Purpose: List all assets with filtering, sorting, search 

Features: Table view (Name, Type, Value, Beneficiaries), filter by type, real-time search, sort options, empty state guidance 

API: GET /api/estates/:id/assets 

Page 6: Add/Edit Asset 

Route: /assets/new or /assets/:id/edit 

Purpose: Single dynamic form for all asset types 

Dynamic Fields: Bank Account (institution, account number, balance), Property (address, value, mortgage), Investment (provider, type, value), Pension, Vehicle, Digital, Cryptocurrency 

Allocation: Visual slider interface to allocate percentage to beneficiaries (must sum to 100%) 

API: POST /api/estates/:id/assets, PATCH /api/estates/:id/assets/:assetId 

Page 7: Asset Detail View 

Route: /assets/:id 

Purpose: View complete asset information 

Features: All asset details, beneficiary allocation summary, linked documents, linked liabilities, activity history, edit/delete buttons 

Page 8: Liabilities Management 

Route: /liabilities 

Purpose: Manage debts with estate impact 

Features: Table view, modal-based add/edit, link to assets, estate impact summary, repayment priority ordering 

API: GET, POST, PATCH, DELETE /api/estates/:id/liabilities 

Page 9: Beneficiaries List 

Route: /beneficiaries 

Purpose: View all beneficiaries with inheritance summary 

Features: Card view per beneficiary, inheritance summary (allocated assets with percentages and values), total inheritance calculation, residuary allocation summary 

API: GET /api/estates/:id/beneficiaries 

Page 10: Beneficiary Detail & Allocation Manager 

Route: /beneficiaries/:id or /beneficiaries/new 

Purpose: Add/edit beneficiary and manage allocations 

Features: Personal info form, inheritance type selection, visual allocation sliders per asset, real-time validation (must sum to 100%) 

API: GET, POST, PATCH, DELETE /api/estates/:id/beneficiaries/:id, /api/estates/:id/allocations 

Page 11: Executors Management 

Route: /executors 

Purpose: Manage designated executors 

Features: Primary executor highlighted, co-executors and alternates, modal add/edit, email invitation system, status tracking (Not Sent/Sent/Accepted/Declined), rich text editor for instructions 

API: GET, POST, PATCH, DELETE /api/estates/:id/executors, POST /api/estates/:id/executors/:id/invite 

Page 12: Document Library 

Route: /documents 

Purpose: Secure document storage with search 

Features: Grid view with thumbnails, drag-and-drop upload, filter by type, full-text search, upload modal with type selection 

Upload Flow: Get presigned S3 URL → Upload to S3 → Confirm → Queue OCR job 

API: GET /api/estates/:id/documents, GET /upload-url, POST /confirm-upload 

Page 13: Document Detail View 

Route: /documents/:id 

Purpose: View document with OCR and AI extraction 

Features: PDF/image preview, metadata display, OCR status with confidence score, extracted text view, AI extraction results (detected executors, beneficiaries, assets), 'Add to Estate' button, visibility controls 

Page 14: Will Hub / Upload Will 

Route: /will 

Purpose: Central will management 

Features: Will status display, two options (Upload or Create), drag-and-drop PDF upload, OCR + AI processing, link to Will Creation Wizard 

API: GET /api/estates/:id/will, POST /api/estates/:id/will/upload 

Page 15: Will Creation Wizard 

Route: /will/create 

Purpose: Guided will creation compliant with UK law 

Steps: 1) Personal Details, 2) Executors, 3) Guardians (if children), 4) Beneficiaries, 5) Specific Bequests, 6) Special Requests, 7) Review & Generate 

Output: PDF will compliant with Wills Act 1837, instructions for signing with witnesses 

API: POST /api/estates/:id/will/create-wizard/start, PATCH /step/:n, POST /generate 

Page 16: Settings & Subscription 

Route: /settings 

Purpose: Account management and billing 

Tabs: Account (profile, delete), Security (password, 2FA, sessions), Notifications (email preferences), Billing (plan, payment method, history) 

API: GET/PATCH /api/users/me/settings, POST /change-password, GET/DELETE /sessions, GET/POST /subscription 

7\. API Specifications 

7.1 Design Principles 

-   RESTful design with consistent resource naming 

-   JSON request/response bodies 

-   Standard HTTP status codes (200, 201, 400, 401, 403, 404, 422, 500) 

-   Pagination for list endpoints (page, limit, total) 

-   Consistent error format with code, message, details 

-   API versioning via URL prefix (/api/v1/) 

7.2 Authentication Endpoints 

|

Endpoint 

 |

Description 

 |
|

POST /auth/register 

 |

Create account, returns user + JWT tokens 

 |
|

POST /auth/login 

 |

Authenticate, returns user + JWT tokens 

 |
|

POST /auth/refresh-token 

 |

Exchange refresh token for new access token 

 |
|

POST /auth/forgot-password 

 |

Send password reset email 

 |
|

POST /auth/reset-password 

 |

Reset password using token 

 |
|

GET /auth/verify-email 

 |

Verify email using OTP 

 |

7.3 Estate Endpoints 

|

Endpoint 

 |

Description 

 |
|

GET /estates/:id/dashboard 

 |

Dashboard data: summary, progress, activity 

 |
|

GET /estates/:id/summary 

 |

Financial summary: totals, breakdown, IHT 

 |
|

GET/POST /estates/:id/assets 

 |

List all / Create new asset 

 |
|

GET/PATCH/DELETE /estates/:id/assets/:id 

 |

Get/Update/Delete specific asset 

 |
|

GET/POST /estates/:id/beneficiaries 

 |

List all / Create new beneficiary 

 |
|

POST /estates/:id/allocations 

 |

Create/update asset-to-beneficiary allocation 

 |
|

GET/POST /estates/:id/executors 

 |

List all / Add new executor 

 |
|

POST /estates/:id/executors/:id/invite 

 |

Send invitation email 

 |
|

GET /estates/:id/documents 

 |

List all documents 

 |
|

GET /estates/:id/documents/upload-url 

 |

Get presigned S3 URL 

 |
|

GET/POST /estates/:id/will 

 |

Get will status / Upload will 

 |
|

POST /estates/:id/will/create-wizard/* 

 |

Will wizard: start, step, generate 

 |

7.4 Error Response Format 

All errors follow consistent format: { "error": { "code": "VALIDATION_ERROR", "message": "User-friendly message", "details": {...} } } 

8\. Payment Integration (Stripe) 

8.1 Subscription Flow 

New User (Free Tier) 

1.  User registers → automatically on FREE tier 

1.  No payment required - limited features (1 estate, 5 assets, 100MB) 

1.  Can use basic functionality immediately 

Upgrade Flow 

1.  User clicks 'Upgrade' or hits feature limit 

1.  Redirect to pricing page with tier comparison 

1.  Select plan (BASIC/PREMIUM) and billing period 

1.  Create Stripe Checkout Session via API 

1.  Redirect to Stripe hosted checkout 

1.  User enters payment details 

1.  Stripe redirects to success page 

1.  Webhook: subscription.created → update database 

1.  User has immediate premium access 

8.2 Webhook Events 

|

Event 

 |

Action 

 |
|

checkout.session.completed 

 |

Activate subscription, update user tier 

 |
|

customer.subscription.updated 

 |

Handle upgrade/downgrade 

 |
|

customer.subscription.deleted 

 |

Revert to FREE tier 

 |
|

invoice.payment_succeeded 

 |

Create transaction record, send receipt 

 |
|

invoice.payment_failed 

 |

Send failure email, retry logic 

 |

8.3 Feature Gates 

Middleware checks subscription tier before allowing access to premium features. Returns 402 Payment Required with upgrade URL if insufficient tier. 

9\. Document Processing Pipeline 

9.1 Upload Flow 

1.  User selects file(s) in browser 

1.  Frontend requests presigned S3 URL from backend 

1.  Frontend uploads directly to S3 

1.  Frontend confirms upload to backend 

1.  Backend creates document record 

1.  Backend queues OCR job in BullMQ 

1.  Background worker processes document 

9.2 OCR Processing 

Tool: AWS Textract for text extraction 

Output: Full extracted text stored in database 

Index: Full-text search index on ocr_text field 

Confidence: Confidence score stored per document 

9.3 AI Extraction (Claude) 

For uploaded wills and legal documents, Claude API extracts structured data: 

-   Testator name and details 

-   Executor names and addresses 

-   Beneficiaries and allocations 

-   Specific bequests 

-   Residuary estate instructions 

-   Trust provisions 

Results stored as JSONB with confidence scores. Users can review and 'Add to Estate' with one click. 

9.4 File Security 

-   Maximum file size: 10MB per file 

-   Allowed types: PDF, JPEG, PNG, DOCX, TXT 

-   Virus scanning with ClamAV before storage 

-   Filename sanitization 

-   S3 bucket NOT publicly accessible 

-   Presigned URLs with 1-hour expiry 

10\. UI/UX Requirements 

10.1 Design System 

Colour Palette 

Primary: #2C5F8D (Calming Blue) - CTAs, links 

Secondary: #5A9FBF (Light Blue) - Accents 

Success: #4A7C59 (Forest Green) - Completion states 

Warning: #D4A574 (Soft Gold) - Warnings 

Error: #C45563 (Muted Red) - Errors, delete actions 

Background: #F5F7FA (Off-White) 

Text: #2D3748 (Dark Grey) 

Typography 

Font: Inter or system font stack 

Minimum: 16px font size 

Line Height: 1.6 

10.2 Responsive Breakpoints 

-   Mobile: < 640px 

-   Tablet: 640px - 1024px 

-   Desktop: > 1024px 

10.3 Accessibility (WCAG 2.1 AA) 

-   Colour contrast ratio: 4.5:1 minimum 

-   Keyboard navigation for all interactive elements 

-   Focus indicators visible 

-   Alt text for images 

-   ARIA labels for screen readers 

-   Form labels and error messages 

10.4 Key UI Patterns 

-   Progress indicators (linear bars, circular widgets) 

-   Inline validation with debounce 

-   Auto-save for long forms 

-   Skeleton loaders for async content 

-   Empty states with illustrations and CTAs 

-   Toast notifications for actions 

11\. Testing & Quality Assurance 

11.1 Testing Strategy 

Unit Tests (60%): Jest + React Testing Library, 80% coverage target 

Integration Tests (30%): API endpoints with test database 

E2E Tests (10%): Playwright for critical user flows 

11.2 Critical Test Scenarios 

Authentication 

-   User can register with valid email/password 

-   User cannot register with existing email 

-   Email verification flow works correctly 

-   Password reset flow completes successfully 

Estate Management 

-   User can add/edit/delete assets 

-   Beneficiary allocation must sum to 100% 

-   Progress calculation updates correctly 

Subscription 

-   Stripe payment succeeds with valid card 

-   User cannot exceed storage limits on Free 

-   Webhook correctly updates subscription status 

11.3 E2E Critical Paths 

1.  Registration → Email verification → Login 

1.  Add asset → Allocate to beneficiary → View summary 

1.  Upload document → OCR → AI extraction → Apply to estate 

1.  Subscribe → Payment → Access premium features 

1.  Create will → Save draft → Generate PDF 

12\. Deployment & DevOps 

12.1 Infrastructure 

Recommended Stack 

Frontend: Vercel (automatic deployments from Git) 

Backend: Railway (Node.js with auto-scaling) 

Database: Railway PostgreSQL 

Cache: Railway Redis 

Storage: Cloudflare R2 or AWS S3 

Estimated Cost: £50-100/month early stage 

12.2 CI/CD Pipeline 

1.  Lint and type-check on every commit 

1.  Unit tests run on every PR 

1.  Integration tests on merge to main 

1.  Automatic deployment to staging 

1.  Manual promotion to production 

12.3 Monitoring 

-   Sentry - Error tracking 

-   PostHog - Product analytics 

-   Better Stack - Logs 

-   UptimeRobot - Uptime monitoring 

12.4 Environment Variables 

Required variables: DATABASE_URL, REDIS_URL, ENCRYPTION_KEY, JWT_SECRET, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET, CLAUDE_API_KEY, SENDGRID_API_KEY, APP_URL 

13\. Success Metrics & KPIs 

13.1 North Star Metric 

Monthly Active Estates: Number of estates with >50% completion that have been updated in the last 30 days 

13.2 Key Performance Indicators 

|

Category 

 |

Metric 

 |

Target 

 |

Measure 

 |
|

Acquisition 

 |

Sign-up rate 

 |

20% 

 |

Visitors → Users 

 |
|

Activation 

 |

First asset added 

 |

< 24 hours 

 |

Time to value 

 |
|

Engagement 

 |

Completion rate 

 |

> 60% 

 |

Profile complete 

 |
|

Revenue 

 |

Conversion rate 

 |

15% 

 |

Free → Paid 

 |
|

Retention 

 |

Monthly churn 

 |

< 5% 

 |

Cancellations 

 |
|

Referral 

 |

NPS Score 

 |

> 50 

 |

Promoter score 

 |

13.3 Technical Performance 

-   99.9% uptime target 

-   <200ms average API response time 

-   <3s average page load time 

-   Zero critical security incidents 

13.4 Launch Criteria 

-   All 15 pages functional: 100% 

-   Core user flows tested: 100% 

-   Lighthouse performance score: ≥90 

-   Test coverage: ≥80% 

-   Security review: Pass 

-   Beta users onboarded: ≥10 

-   Critical bugs: 0 

14\. Deliverables & Definition of Done 

14.1 MVP Deliverables 

Functional 

-   All 15 pages fully functional and tested 

-   User authentication with email/password and OAuth 

-   Complete CRUD operations for all estate data 

-   Document upload and storage with OCR 

-   Stripe subscription integration 

-   Progress tracking and dashboard 

-   Responsive design (mobile, tablet, desktop) 

Technical 

-   Production deployment on Vercel/Railway 

-   PostgreSQL database with Prisma ORM 

-   S3/R2 file storage configured 

-   SSL certificates and HTTPS enforced 

-   Error tracking with Sentry 

-   Automated backups configured 

Documentation 

-   Technical documentation for codebase 

-   API documentation (OpenAPI/Swagger) 

-   Deployment guide 

-   Environment setup instructions 

14.2 Definition of Done 

A feature is complete when: 

1.  Code written and passes linting 

1.  Unit tests written and passing (80% coverage) 

1.  Integration tests passing 

1.  Code reviewed and approved 

1.  Deployed to staging and tested 

1.  Performance metrics meet targets 

1.  Accessibility standards met (WCAG 2.1 AA) 

1.  Documentation updated 

15\. Appendix 

15.1 Glossary 

IHT: Inheritance Tax (UK tax on estates over £325,000) 

GDPR: General Data Protection Regulation 

2FA: Two-Factor Authentication 

JWT: JSON Web Token 

RBAC: Role-Based Access Control 

OCR: Optical Character Recognition 

SCA: Strong Customer Authentication 

CRUD: Create, Read, Update, Delete operations 

15.2 UK Legal Framework 

Wills Act 1837: Requirements for valid wills in England & Wales 

Mental Capacity Act 2005: Power of attorney considerations 

Data Protection Act 2018: UK implementation of GDPR 

Consumer Rights Act 2015: Subscription terms compliance 

15.3 External Resources 

-   UK Government - Making a will: gov.uk/make-will 

-   HMRC IHT guidance: gov.uk/inheritance-tax 

-   ICO GDPR guidance: ico.org.uk 

-   Stripe documentation: stripe.com/docs 

-   Next.js documentation: nextjs.org/docs 

─────────────────── 

Ready to Build the Future of Estate Planning 

Let's create something extraordinary together. 

───────────────────
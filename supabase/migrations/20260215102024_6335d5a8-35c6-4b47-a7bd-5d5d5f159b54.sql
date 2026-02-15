
-- =============================================
-- FULL COURSE CONTENT RESTRUCTURE
-- Industry-standard commercial lending curriculum
-- Updates all course_content_modules with proper titles, descriptions, topics, and durations
-- =============================================

UPDATE course_content_modules SET 
  title = d.new_title, 
  description = d.new_desc, 
  duration = d.new_dur, 
  topics = d.new_topics::jsonb, 
  lessons_count = d.new_lc
FROM (VALUES 
-- =============================================
-- SBA 7(a) BEGINNER
-- =============================================
('sba-7(a)-module-1-beginner', 'SBA 7(a) Program Overview & Fundamentals',
 'Master the fundamentals of the SBA 7(a) loan program including program history, guarantee structure, eligible uses of proceeds, and SBA lender designations.',
 '2.5 hours', '["SBA 7(a) program history and mission","Government guarantee percentages and fee structure","Eligible and ineligible uses of proceeds","SBA lender designations (PLP, SBA Express, Community Advantage)"]', 8),
('sba-7(a)-module-2-beginner', 'SBA 7(a) Loan Products & Structures',
 'Explore all SBA 7(a) sub-programs including Standard 7(a), 7(a) Small Loans, CAPLines, Export loans, and Community Advantage with terms, rates, and ideal use cases.',
 '3 hours', '["Standard 7(a) loan terms and maximum amounts","7(a) Small Loan and Express sub-programs","CAPLines revolving credit facilities","Export Working Capital and International Trade loans"]', 10),
('sba-7(a)-module-3-beginner', 'Borrower Eligibility & Qualification',
 'Learn SBA size standards by NAICS code, eligibility criteria, creditworthiness assessment, and how to effectively screen potential SBA 7(a) borrowers.',
 '3 hours', '["SBA size standards by NAICS code","Eligibility requirements and exclusions","Credit score and history evaluation","Personal resource and injection requirements"]', 10),
('sba-7(a)-module-4-beginner', 'Application Process & Documentation',
 'Navigate the complete SBA 7(a) application process from pre-screening through SBA authorization, including all required SBA forms and E-Tran submission.',
 '3.5 hours', '["SBA Form 1919 borrower information","Personal Financial Statement (SBA Form 413)","Business plan and projection requirements","E-Tran electronic submission process"]', 12),
('sba-7(a)-module-5-beginner', 'Financial Analysis for SBA Lending',
 'Develop skills in analyzing borrower financial statements for SBA loans including cash flow analysis, debt service coverage ratios, and projection evaluation.',
 '3 hours', '["Cash flow analysis techniques","Debt service coverage ratio (DSCR) calculation","Pro forma financial projections","Global cash flow analysis for guarantors"]', 10),
('sba-7(a)-module-6-beginner', 'SBA 7(a) Underwriting Fundamentals',
 'Understand the SBA 7(a) underwriting process including the five Cs of credit, collateral evaluation, repayment ability assessment, and credit memo preparation.',
 '3.5 hours', '["Five Cs of credit for SBA loans","Collateral evaluation and lien position","Repayment ability assessment methods","Credit memorandum preparation"]', 12),
('sba-7(a)-module-7-beginner', 'Loan Closing, Servicing & Liquidation',
 'Master SBA 7(a) closing requirements, authorization conditions, ongoing servicing obligations, default management, and SBA purchase and liquidation procedures.',
 '3 hours', '["Authorization conditions and closing procedures","Ongoing servicing and reporting requirements","Default management and workout strategies","SBA purchase request and liquidation"]', 10),

-- =============================================
-- SBA 7(a) EXPERT
-- =============================================
('sba-7(a)-module-1-expert', 'Advanced SBA 7(a) Market Strategy',
 'Analyze advanced SBA 7(a) market dynamics, competitive positioning, portfolio strategy, and emerging trends in government-guaranteed lending.',
 '3 hours', '["SBA lending market analysis and trends","Competitive landscape and strategic positioning","Portfolio concentration and growth strategy","Regulatory trend forecasting and impact analysis"]', 10),
('sba-7(a)-module-2-expert', 'Complex SBA 7(a) Deal Structuring',
 'Master complex SBA 7(a) transactions including multi-use properties, change of ownership, partner buyouts, ESOPs, and multi-entity franchise structures.',
 '3.5 hours', '["Multi-use property financing strategies","Change of ownership and partner buyout deals","ESOP and succession planning transactions","Multi-entity and franchise deal structures"]', 12),
('sba-7(a)-module-3-expert', 'Advanced Credit & Financial Analysis',
 'Apply sophisticated financial analysis techniques to complex SBA borrowers including multi-entity global cash flow, industry-specific metrics, and stress testing.',
 '3.5 hours', '["Multi-entity global cash flow analysis","Industry-specific financial metrics and ratios","Stress testing and sensitivity analysis","Trend analysis and anomaly detection"]', 12),
('sba-7(a)-module-4-expert', 'SBA Regulatory Compliance & Risk',
 'Navigate complex SBA regulatory requirements including SOP 50 10, affiliation rules, change of ownership regulations, and compliance audit preparation.',
 '3 hours', '["SBA SOP 50 10 comprehensive review","Affiliation rules and size determination","Regulatory change management","Compliance audit preparation and response"]', 10),
('sba-7(a)-module-5-expert', 'SBA Portfolio & Risk Management',
 'Develop advanced portfolio management skills including concentration risk analysis, portfolio stress testing, risk-adjusted returns, and performance optimization.',
 '3 hours', '["Portfolio concentration and diversification analysis","Risk-adjusted return metrics and optimization","Portfolio stress testing methodologies","Performance benchmarking and reporting"]', 10),
('sba-7(a)-module-6-expert', 'Advanced SBA Underwriting Techniques',
 'Apply expert-level underwriting methods to challenging SBA scenarios including startups, special-purpose properties, distressed businesses, and exception requests.',
 '3.5 hours', '["Startup and projection-based underwriting","Special-purpose property valuation methods","Distressed business evaluation techniques","Exception-based underwriting and risk mitigation"]', 12),
('sba-7(a)-module-7-expert', 'Strategic SBA Lending Leadership',
 'Lead SBA lending operations with advanced decision-making frameworks, team management strategies, business development, and cross-selling techniques.',
 '3 hours', '["Strategic decision-making frameworks","Team leadership and talent development","Business development and referral strategies","Cross-selling and relationship management"]', 10),

-- =============================================
-- SBA 504 BEGINNER
-- =============================================
('sba-504-module-1-beginner', 'SBA 504 Program Overview & Fundamentals',
 'Master the SBA 504/CDC loan program including its unique three-party structure, eligible projects, job creation requirements, and the debenture funding process.',
 '2.5 hours', '["SBA 504 program structure and mission","Certified Development Company (CDC) role","Job creation and retention requirements","Debenture funding and pooling process"]', 8),
('sba-504-module-2-beginner', 'SBA 504 Project Types & Loan Structures',
 'Explore eligible 504 projects including commercial real estate acquisition, heavy equipment purchases, and energy efficiency improvements with the 50-40-10 structure.',
 '3 hours', '["Commercial real estate acquisition projects","Major equipment and machinery purchases","Energy efficiency and renewable energy projects","50-40-10 loan structure and interim financing"]', 10),
('sba-504-module-3-beginner', 'Borrower Eligibility & Project Qualification',
 'Learn 504-specific eligibility criteria including net worth and income tests, tangible net worth limits, project size requirements, and public policy goals.',
 '3 hours', '["Net worth and average net income tests","Tangible net worth limitations","Project size and cost requirements","Public policy goals and community benefit"]', 10),
('sba-504-module-4-beginner', '504 Application Process & Documentation',
 'Navigate the 504 application process through CDC screening, project eligibility verification, SBA authorization, and the debenture funding timeline.',
 '3.5 hours', '["CDC application intake and screening","Project eligibility verification process","SBA authorization and approval workflow","Debenture funding timeline and procedures"]', 12),
('sba-504-module-5-beginner', 'Financial Analysis for 504 Lending',
 'Analyze 504 borrower financials including total project cost analysis, borrower contribution calculations, DSCR requirements, and collateral coverage assessment.',
 '3 hours', '["Total project cost analysis and breakdown","Borrower equity injection requirements","Debt service coverage for 504 loans","Collateral coverage and lien positions"]', 10),
('sba-504-module-6-beginner', 'SBA 504 Underwriting Fundamentals',
 'Understand 504 underwriting including project feasibility analysis, environmental review requirements, CDC credit analysis standards, and appraisal evaluation.',
 '3.5 hours', '["Project feasibility and economic impact","Environmental review and Phase I/II requirements","CDC underwriting standards and criteria","Appraisal review and valuation methods"]', 12),
('sba-504-module-7-beginner', '504 Closing, Servicing & Debenture Management',
 'Master 504 closing procedures for both interim and permanent financing, debenture pooling schedules, ongoing servicing obligations, and default resolution.',
 '3 hours', '["Interim and permanent loan closing procedures","Debenture pooling schedule and settlement","Ongoing servicing and CDC reporting","Default management and workout strategies"]', 10),

-- =============================================
-- SBA 504 EXPERT
-- =============================================
('sba-504-module-1-expert', 'Advanced 504 Market Strategy & Analysis',
 'Analyze 504 market opportunities, CDC competitive dynamics, strategic positioning for growth, and public policy alignment for maximum community impact.',
 '3 hours', '["504 lending market trends and opportunities","CDC competitive landscape analysis","Strategic growth and market positioning","Public policy and community impact optimization"]', 10),
('sba-504-module-2-expert', 'Complex 504 Project Structuring',
 'Master complex 504 projects including manufacturing facilities, mixed-use developments, 504 refinance transactions, and energy public policy projects.',
 '3.5 hours', '["Manufacturing facility acquisition and expansion","Mixed-use property project structuring","504 Refinance Program transactions","Energy public policy and green initiatives"]', 12),
('sba-504-module-3-expert', 'Advanced 504 Financial Analysis',
 'Apply advanced financial analysis to complex 504 projects including multi-phase developments, franchise expansion modeling, and capital stack optimization.',
 '3.5 hours', '["Multi-phase development financial modeling","Franchise expansion and growth projections","Advanced DSCR and cash flow analysis","Capital stack optimization strategies"]', 12),
('sba-504-module-4-expert', '504 Regulatory Framework & Compliance',
 'Navigate advanced 504 regulations including SOP 50 10(6), CDC reporting requirements, debenture compliance, and regulatory change management.',
 '3 hours', '["SOP 50 10(6) advanced requirements","CDC annual reporting and financial audits","Debenture compliance and pool management","Regulatory change impact assessment"]', 10),
('sba-504-module-5-expert', '504 Portfolio Risk Management',
 'Manage 504 loan portfolios with advanced concentration risk analysis, performance benchmarking, loss mitigation strategies, and CDC portfolio optimization.',
 '3 hours', '["CDC portfolio concentration analysis","Performance benchmarking and metrics","Loss mitigation and recovery strategies","Portfolio optimization and rebalancing"]', 10),
('sba-504-module-6-expert', 'Advanced 504 Underwriting & Valuation',
 'Apply expert underwriting to complex 504 projects including special-purpose properties, startup ventures, environmental risk assessment, and construction oversight.',
 '3.5 hours', '["Special-purpose property valuation techniques","Startup project underwriting and projections","Environmental risk assessment and mitigation","Construction oversight and draw management"]', 12),
('sba-504-module-7-expert', 'Strategic 504 Lending & CDC Leadership',
 'Lead CDC operations with strategic planning, stakeholder management, community development impact measurement, and organizational growth strategies.',
 '3 hours', '["CDC strategic planning and governance","Stakeholder engagement and partnership development","Community development impact measurement","Organizational growth and scaling strategies"]', 10),

-- =============================================
-- SBA EXPRESS BEGINNER
-- =============================================
('sba-express-module-1-beginner', 'SBA Express Program Overview & Fundamentals',
 'Master the SBA Express loan program including its expedited processing, reduced guarantee percentage, revolving line capabilities, and maximum loan amounts.',
 '2.5 hours', '["SBA Express program features and benefits","Expedited 36-hour turnaround process","50% guarantee vs standard 7(a) guarantee","Maximum loan amounts and eligible uses"]', 8),
('sba-express-module-2-beginner', 'SBA Express Products & Credit Structures',
 'Explore SBA Express product options including term loans, revolving lines of credit, and the unique features that differentiate Express from Standard 7(a).',
 '3 hours', '["SBA Express term loan structures","Revolving line of credit features","Express vs Standard 7(a) comparison","Interest rate and fee structures"]', 10),
('sba-express-module-3-beginner', 'Express Borrower Screening & Qualification',
 'Learn efficient borrower screening methods for SBA Express including credit scoring models, quick eligibility assessment, and risk-based pricing decisions.',
 '3 hours', '["Rapid borrower screening techniques","Credit scoring models for Express loans","Quick eligibility assessment frameworks","Risk-based pricing and structuring"]', 10),
('sba-express-module-4-beginner', 'Streamlined Application & Documentation',
 'Navigate the streamlined SBA Express application process with reduced documentation requirements, lender-specific forms, and expedited processing workflows.',
 '3 hours', '["Reduced documentation requirements","Lender-specific application forms","Expedited processing workflow","E-Tran Express submission"]', 10),
('sba-express-module-5-beginner', 'Financial Analysis for Express Lending',
 'Apply efficient financial analysis techniques appropriate for SBA Express loan decisions including abbreviated analysis methods and scoring-based approaches.',
 '3 hours', '["Abbreviated financial analysis methods","Scoring-based credit decision models","Quick ratio and cash flow assessments","Risk factor identification"]', 10),
('sba-express-module-6-beginner', 'SBA Express Underwriting Fundamentals',
 'Understand SBA Express underwriting with its delegated authority, streamlined credit analysis, collateral requirements, and automated decision tools.',
 '3 hours', '["Delegated underwriting authority","Streamlined credit analysis process","Express collateral requirements","Automated decision support tools"]', 10),
('sba-express-module-7-beginner', 'Express Closing, Servicing & Portfolio Management',
 'Master SBA Express closing procedures, ongoing servicing requirements, portfolio monitoring, and renewal processes for revolving Express lines.',
 '3 hours', '["Express loan closing procedures","Revolving line renewal and review","Portfolio monitoring and reporting","Default management for Express loans"]', 10),

-- =============================================
-- SBA EXPRESS EXPERT
-- =============================================
('sba-express-module-1-expert', 'Advanced Express Market Strategy',
 'Analyze the Express lending market with advanced competitive positioning, high-volume production strategies, and portfolio growth optimization techniques.',
 '3 hours', '["Express market opportunity analysis","High-volume production strategies","Competitive differentiation tactics","Portfolio growth optimization"]', 10),
('sba-express-module-2-expert', 'Complex Express Deal Structuring',
 'Master complex Express transactions including large revolving facilities, multi-purpose structures, and creative solutions within Express program parameters.',
 '3.5 hours', '["Large revolving facility structuring","Multi-purpose Express loan design","Creative structuring within program limits","Express combined with other SBA products"]', 12),
('sba-express-module-3-expert', 'Advanced Express Credit Analysis',
 'Apply advanced credit analysis to Express lending including portfolio-level risk assessment, predictive scoring models, and exception-based decisioning.',
 '3.5 hours', '["Portfolio-level risk assessment methods","Predictive credit scoring optimization","Exception-based decision frameworks","Trend analysis and early warning systems"]', 12),
('sba-express-module-4-expert', 'Express Regulatory & Compliance Management',
 'Navigate Express-specific regulatory requirements including PLP delegated authority obligations, audit compliance, and regulatory change management.',
 '3 hours', '["PLP delegated authority requirements","Express-specific compliance standards","Audit preparation and response","Regulatory change impact management"]', 10),
('sba-express-module-5-expert', 'Express Portfolio & Risk Optimization',
 'Optimize Express loan portfolios with advanced analytics, concentration management, loss forecasting, and performance-driven portfolio strategies.',
 '3 hours', '["Advanced portfolio analytics and dashboards","Concentration risk management strategies","Loss forecasting and provisioning","Performance-driven portfolio optimization"]', 10),
('sba-express-module-6-expert', 'Advanced Express Underwriting Systems',
 'Develop and optimize automated Express underwriting systems including scoring model calibration, workflow automation, and quality control frameworks.',
 '3.5 hours', '["Scoring model calibration and validation","Workflow automation and efficiency","Quality control and exception monitoring","Technology integration and optimization"]', 12),
('sba-express-module-7-expert', 'Strategic Express Lending Operations',
 'Lead Express lending operations at scale with production management, team performance optimization, technology strategy, and business development.',
 '3 hours', '["Production management at scale","Team performance and incentive optimization","Technology strategy and implementation","Strategic business development"]', 10),

-- =============================================
-- COMMERCIAL REAL ESTATE BEGINNER
-- =============================================
('commercial-real-estate-module-1-beginner', 'Commercial Real Estate Lending Overview',
 'Master the fundamentals of CRE lending including property types, market cycles, key metrics like cap rates and NOI, and the role of CRE in commercial banking.',
 '2.5 hours', '["CRE property types and classifications","Market cycles and economic indicators","Capitalization rates and Net Operating Income","CRE lending in commercial banking"]', 8),
('commercial-real-estate-module-2-beginner', 'CRE Loan Products & Structures',
 'Explore CRE loan products including permanent financing, bridge loans, construction-to-permanent, and mezzanine structures with terms and pricing.',
 '3 hours', '["Permanent CRE financing structures","Bridge and interim CRE loans","Construction-to-permanent conversion","Mezzanine and subordinate financing"]', 10),
('commercial-real-estate-module-3-beginner', 'CRE Borrower & Property Qualification',
 'Learn to evaluate CRE borrowers and properties including sponsor experience assessment, property condition evaluation, and market area analysis.',
 '3 hours', '["Sponsor experience and financial capacity","Property condition assessment basics","Market and submarket analysis","Tenant quality and lease review"]', 10),
('commercial-real-estate-module-4-beginner', 'CRE Application & Due Diligence',
 'Navigate the CRE loan application process including required documentation, environmental assessments, title review, and third-party report management.',
 '3.5 hours', '["CRE loan application requirements","Phase I and Phase II environmental assessments","Title search and survey review","Third-party report management"]', 12),
('commercial-real-estate-module-5-beginner', 'CRE Financial Analysis Fundamentals',
 'Develop CRE financial analysis skills including NOI calculation, DSCR analysis, LTV ratios, cash-on-cash returns, and operating expense evaluation.',
 '3 hours', '["Net Operating Income (NOI) calculation","Debt Service Coverage Ratio (DSCR)","Loan-to-Value (LTV) ratio analysis","Operating expense and vacancy analysis"]', 10),
('commercial-real-estate-module-6-beginner', 'CRE Underwriting Fundamentals',
 'Understand CRE underwriting including property valuation approaches, income capitalization, appraisal review, and risk rating methodologies.',
 '3.5 hours', '["Three approaches to property valuation","Income capitalization methodology","Appraisal review and reconciliation","CRE risk rating frameworks"]', 12),
('commercial-real-estate-module-7-beginner', 'CRE Closing, Servicing & Asset Management',
 'Master CRE closing procedures, loan document review, ongoing property monitoring, covenant compliance, and loan maturity management.',
 '3 hours', '["CRE closing document requirements","Property insurance and escrow management","Covenant compliance monitoring","Loan maturity and renewal strategies"]', 10),

-- =============================================
-- COMMERCIAL REAL ESTATE EXPERT
-- =============================================
('commercial-real-estate-module-1-expert', 'Advanced CRE Market Analysis & Strategy',
 'Analyze advanced CRE market dynamics including cycle timing, demographic shifts, urbanization trends, and strategic portfolio positioning across property types.',
 '3 hours', '["CRE cycle timing and prediction models","Demographic and migration trend analysis","Urbanization and remote work impact","Strategic portfolio positioning"]', 10),
('commercial-real-estate-module-2-expert', 'Complex CRE Deal Structuring',
 'Master complex CRE transactions including portfolio deals, development financing, joint ventures, syndications, and CMBS/CLO securitization.',
 '3.5 hours', '["Portfolio and cross-collateralized deals","Ground-up development financing","Joint venture and syndication structures","CMBS and securitization fundamentals"]', 12),
('commercial-real-estate-module-3-expert', 'Advanced CRE Financial Modeling',
 'Apply sophisticated CRE financial modeling including DCF analysis, waterfall distributions, sensitivity testing, and multi-scenario projections.',
 '3.5 hours', '["Discounted cash flow (DCF) modeling","Waterfall distribution structures","Sensitivity and Monte Carlo analysis","Multi-scenario projection frameworks"]', 12),
('commercial-real-estate-module-4-expert', 'CRE Regulatory & Environmental Compliance',
 'Navigate complex CRE regulatory requirements including environmental liability, zoning and entitlements, ADA compliance, and flood zone management.',
 '3 hours', '["Environmental liability and remediation","Zoning, entitlement, and land use","ADA compliance requirements","Flood zone determination and insurance"]', 10),
('commercial-real-estate-module-5-expert', 'CRE Portfolio Risk Management',
 'Manage CRE loan portfolios with concentration analysis, stress testing, watchlist management, and performance attribution across property types and markets.',
 '3 hours', '["CRE concentration and diversification analysis","Property type and geographic stress testing","Watchlist management and early intervention","Performance attribution and benchmarking"]', 10),
('commercial-real-estate-module-6-expert', 'Advanced CRE Valuation & Underwriting',
 'Apply expert CRE valuation techniques including residual land value, highest and best use analysis, adaptive reuse evaluation, and complex appraisal review.',
 '3.5 hours', '["Residual land value analysis","Highest and best use determination","Adaptive reuse and conversion valuation","Complex appraisal review and challenge"]', 12),
('commercial-real-estate-module-7-expert', 'Strategic CRE Lending Leadership',
 'Lead CRE lending teams with market strategy development, client relationship management, workout and restructuring oversight, and portfolio optimization.',
 '3 hours', '["CRE market strategy development","Key client relationship management","Workout and restructuring leadership","Portfolio optimization and growth strategy"]', 10),

-- =============================================
-- CONSTRUCTION LOANS BEGINNER
-- =============================================
('construction-loans-module-1-beginner', 'Construction Lending Overview & Fundamentals',
 'Master the fundamentals of construction lending including project types, loan structures, draw processes, and the unique risks inherent in construction financing.',
 '2.5 hours', '["Construction loan types and structures","Residential vs commercial construction","Draw process and disbursement fundamentals","Key construction lending risks"]', 8),
('construction-loans-module-2-beginner', 'Construction Loan Products & Structures',
 'Explore construction loan products including spec, pre-sold, owner-occupied, and construction-to-permanent structures with terms, pricing, and holdback requirements.',
 '3 hours', '["Speculative construction financing","Pre-sold and contract-based lending","Owner-occupied construction loans","Construction-to-permanent conversion structures"]', 10),
('construction-loans-module-3-beginner', 'Builder & Project Qualification',
 'Learn to evaluate construction borrowers including builder experience assessment, contractor vetting, project feasibility analysis, and market demand evaluation.',
 '3 hours', '["Builder and developer experience evaluation","General contractor qualification criteria","Project feasibility and market demand analysis","Bonding and insurance requirements"]', 10),
('construction-loans-module-4-beginner', 'Construction Documentation & Compliance',
 'Navigate construction loan documentation including plans and specifications review, permit verification, contractor agreements, and lien waiver management.',
 '3.5 hours', '["Plans, specifications, and cost review","Building permit and zoning verification","Contractor and subcontractor agreements","Mechanic lien waiver management"]', 12),
('construction-loans-module-5-beginner', 'Construction Budget & Cost Analysis',
 'Develop skills in construction budget analysis including cost estimation verification, hard and soft cost evaluation, contingency adequacy, and budget monitoring.',
 '3 hours', '["Construction cost estimation methods","Hard costs vs soft costs analysis","Contingency reserve adequacy","Budget monitoring and variance tracking"]', 10),
('construction-loans-module-6-beginner', 'Construction Underwriting Fundamentals',
 'Understand construction loan underwriting including as-complete valuation, LTC ratios, interest reserve calculations, and completion risk assessment.',
 '3.5 hours', '["As-complete and as-is valuation methods","Loan-to-Cost (LTC) ratio analysis","Interest reserve calculation and adequacy","Completion risk assessment and mitigation"]', 12),
('construction-loans-module-7-beginner', 'Draw Management, Inspection & Closeout',
 'Master construction draw processing including inspection procedures, retainage management, change order evaluation, and loan conversion at project completion.',
 '3 hours', '["Draw request processing and approval","Site inspection procedures and reports","Retainage and change order management","Project completion and loan conversion"]', 10),

-- =============================================
-- CONSTRUCTION LOANS EXPERT
-- =============================================
('construction-loans-module-1-expert', 'Advanced Construction Market Analysis',
 'Analyze construction market dynamics including supply chain economics, labor market trends, material cost forecasting, and regional development patterns.',
 '3 hours', '["Construction market cycle analysis","Supply chain and material cost trends","Labor market and subcontractor dynamics","Regional development pattern assessment"]', 10),
('construction-loans-module-2-expert', 'Complex Construction Deal Structuring',
 'Master complex construction financing including multi-phase developments, mixed-use projects, horizontal land development, and participation lending.',
 '3.5 hours', '["Multi-phase development financing","Mixed-use construction structuring","Horizontal land development loans","Participation and syndicated construction lending"]', 12),
('construction-loans-module-3-expert', 'Advanced Construction Financial Modeling',
 'Apply advanced financial modeling to construction projects including absorption rate analysis, IRR calculations, sensitivity testing, and exit strategy modeling.',
 '3.5 hours', '["Absorption rate and sell-out analysis","Internal rate of return (IRR) modeling","Construction cost sensitivity testing","Exit strategy and takeout modeling"]', 12),
('construction-loans-module-4-expert', 'Construction Regulatory & Risk Compliance',
 'Navigate complex construction regulatory requirements including environmental impact, OSHA compliance, prevailing wage, and interagency coordination.',
 '3 hours', '["Environmental impact assessment and mitigation","OSHA and safety compliance requirements","Prevailing wage and Davis-Bacon Act","Multi-jurisdictional regulatory coordination"]', 10),
('construction-loans-module-5-expert', 'Construction Portfolio Risk Management',
 'Manage construction loan portfolios with advanced concentration analysis, completion risk monitoring, guarantee analysis, and workout strategies.',
 '3 hours', '["Construction portfolio concentration management","Completion risk monitoring systems","Guarantee structure analysis and enforcement","Workout and restructuring strategies"]', 10),
('construction-loans-module-6-expert', 'Advanced Construction Underwriting',
 'Apply expert construction underwriting to complex projects including high-rise, infrastructure, public-private partnerships, and distressed construction.',
 '3.5 hours', '["High-rise and complex structure underwriting","Infrastructure and P3 project analysis","Distressed construction project evaluation","Advanced inspection and monitoring systems"]', 12),
('construction-loans-module-7-expert', 'Strategic Construction Lending Leadership',
 'Lead construction lending operations with project management oversight, team development, market strategy, and technology integration for portfolio monitoring.',
 '3 hours', '["Construction lending team development","Project management oversight frameworks","Market strategy and business development","Technology integration and monitoring systems"]', 10),

-- =============================================
-- EQUIPMENT FINANCING BEGINNER
-- =============================================
('equipment-financing-module-1-beginner', 'Equipment Financing Overview & Fundamentals',
 'Master the fundamentals of equipment financing including lease vs loan structures, UCC filings, useful life concepts, and the role of equipment lending in commercial banking.',
 '2.5 hours', '["Equipment financing vs traditional lending","Lease structures vs loan structures","UCC filing and perfection basics","Equipment useful life and depreciation"]', 8),
('equipment-financing-module-2-beginner', 'Equipment Loan Products & Lease Structures',
 'Explore equipment financing products including term loans, capital leases, operating leases, sale-leaseback, and vendor financing programs with terms and pricing.',
 '3 hours', '["Equipment term loan structures","Capital lease vs operating lease","Sale-leaseback arrangements","Vendor and manufacturer financing programs"]', 10),
('equipment-financing-module-3-beginner', 'Borrower & Equipment Qualification',
 'Learn to evaluate equipment financing borrowers and assets including business capacity assessment, equipment valuation, vendor relationship evaluation, and technology risk.',
 '3 hours', '["Borrower business and financial capacity","Equipment type and condition evaluation","Vendor and manufacturer assessment","Technology obsolescence risk analysis"]', 10),
('equipment-financing-module-4-beginner', 'Equipment Finance Documentation & UCC',
 'Navigate equipment financing documentation including loan agreements, UCC-1 filing procedures, title and lien verification, and insurance requirements.',
 '3.5 hours', '["Equipment loan agreement essentials","UCC-1 filing and search procedures","Title verification and lien position","Equipment insurance requirements"]', 12),
('equipment-financing-module-5-beginner', 'Equipment Financial Analysis',
 'Develop skills in equipment financing analysis including useful life assessment, residual value estimation, payment structure comparison, and return on equipment analysis.',
 '3 hours', '["Useful life and economic life analysis","Residual value estimation methods","Payment structure and cash flow comparison","Return on equipment investment analysis"]', 10),
('equipment-financing-module-6-beginner', 'Equipment Underwriting Fundamentals',
 'Understand equipment underwriting including collateral valuation methods, depreciation schedules, essential use doctrine, and equipment-specific risk factors.',
 '3.5 hours', '["Equipment appraisal and valuation methods","Depreciation schedules and residual values","Essential use doctrine analysis","Equipment-specific risk assessment"]', 12),
('equipment-financing-module-7-beginner', 'Equipment Loan Closing & Portfolio Management',
 'Master equipment loan closing including delivery verification, equipment inspection, ongoing monitoring, and end-of-term management for leases.',
 '3 hours', '["Delivery and installation verification","Equipment inspection and acceptance","Ongoing monitoring and insurance tracking","End-of-term options and remarketing"]', 10),

-- =============================================
-- EQUIPMENT FINANCING EXPERT
-- =============================================
('equipment-financing-module-1-expert', 'Advanced Equipment Market Analysis',
 'Analyze equipment markets with advanced industry trend analysis, technology disruption assessment, secondary market dynamics, and strategic portfolio positioning.',
 '3 hours', '["Equipment industry trend analysis","Technology disruption and innovation impact","Secondary market and remarketing dynamics","Strategic equipment portfolio positioning"]', 10),
('equipment-financing-module-2-expert', 'Complex Equipment Deal Structuring',
 'Master complex equipment transactions including fleet financing, sale-leaseback portfolios, cross-border equipment, and technology upgrade programs.',
 '3.5 hours', '["Fleet and portfolio financing structures","Sale-leaseback portfolio transactions","Cross-border equipment financing","Technology refresh and upgrade programs"]', 12),
('equipment-financing-module-3-expert', 'Advanced Equipment Financial Modeling',
 'Apply advanced financial modeling to equipment transactions including total cost of ownership, tax benefit analysis, and lease vs buy optimization.',
 '3.5 hours', '["Total cost of ownership modeling","Tax benefit and depreciation optimization","Lease vs buy decision frameworks","Advanced cash flow and IRR analysis"]', 12),
('equipment-financing-module-4-expert', 'Equipment Regulatory & Tax Compliance',
 'Navigate equipment financing regulations including ASC 842 lease accounting, tax reform impacts, cross-border compliance, and industry-specific requirements.',
 '3 hours', '["ASC 842 lease accounting standards","Tax reform and depreciation impacts","Cross-border financing compliance","Industry-specific regulatory requirements"]', 10),
('equipment-financing-module-5-expert', 'Equipment Portfolio Risk Management',
 'Manage equipment finance portfolios with advanced residual risk analysis, industry concentration management, remarketing strategies, and loss mitigation.',
 '3 hours', '["Residual value risk management","Industry concentration analysis","Remarketing and disposition strategies","Loss mitigation and recovery optimization"]', 10),
('equipment-financing-module-6-expert', 'Advanced Equipment Valuation & Underwriting',
 'Apply expert equipment valuation techniques including specialized asset appraisal, fleet analysis, technology obsolescence modeling, and distressed equipment assessment.',
 '3.5 hours', '["Specialized asset appraisal techniques","Fleet utilization and lifecycle analysis","Technology obsolescence modeling","Distressed equipment valuation and recovery"]', 12),
('equipment-financing-module-7-expert', 'Strategic Equipment Finance Leadership',
 'Lead equipment financing operations with vendor program management, technology platform strategy, team development, and market expansion.',
 '3 hours', '["Vendor program management and growth","Technology platform and automation strategy","Team development and specialization","Market expansion and new verticals"]', 10),

-- =============================================
-- BUSINESS LINES OF CREDIT BEGINNER
-- =============================================
('business-lines-of-credit-module-1-beginner', 'Business Lines of Credit Overview',
 'Master the fundamentals of business lines of credit including revolving structures, borrowing base concepts, advance rates, and seasonal working capital needs.',
 '2.5 hours', '["Revolving credit structure fundamentals","Borrowing base concepts and mechanics","Advance rate determination","Seasonal and cyclical working capital"]', 8),
('business-lines-of-credit-module-2-beginner', 'Line of Credit Products & Structures',
 'Explore business line of credit products including asset-based revolvers, formula-based facilities, clean lines, and committed vs uncommitted structures.',
 '3 hours', '["Asset-based revolving lines","Formula-based credit facilities","Clean line vs collateralized structures","Committed vs uncommitted facilities"]', 10),
('business-lines-of-credit-module-3-beginner', 'Borrower Assessment for Revolving Credit',
 'Learn to evaluate borrowers for revolving credit including cash conversion cycle analysis, working capital needs assessment, and seasonal pattern recognition.',
 '3 hours', '["Cash conversion cycle analysis","Working capital needs assessment","Seasonal revenue pattern evaluation","Industry-specific revolving credit needs"]', 10),
('business-lines-of-credit-module-4-beginner', 'LOC Application & Documentation',
 'Navigate line of credit documentation including borrowing base certificates, compliance certificates, financial covenants, and reporting requirements.',
 '3.5 hours', '["Borrowing base certificate preparation","Financial covenant structures","Compliance reporting requirements","Revolving credit agreement terms"]', 12),
('business-lines-of-credit-module-5-beginner', 'LOC Financial Analysis',
 'Analyze revolving credit borrowers with accounts receivable aging, inventory turnover, payables analysis, and working capital trend evaluation.',
 '3 hours', '["Accounts receivable aging analysis","Inventory turnover and valuation","Accounts payable and vendor analysis","Working capital trend evaluation"]', 10),
('business-lines-of-credit-module-6-beginner', 'LOC Underwriting Fundamentals',
 'Understand line of credit underwriting including borrowing base verification, advance rate setting, over-advance risk assessment, and covenant design.',
 '3.5 hours', '["Borrowing base verification methods","Advance rate determination factors","Over-advance risk assessment","Financial covenant design and monitoring"]', 12),
('business-lines-of-credit-module-7-beginner', 'LOC Monitoring, Renewal & Management',
 'Master ongoing line of credit monitoring including borrowing base audits, covenant compliance tracking, annual renewal process, and line management strategies.',
 '3 hours', '["Borrowing base audit procedures","Covenant compliance monitoring","Annual renewal review process","Line utilization and management strategies"]', 10),

-- =============================================
-- BUSINESS LINES OF CREDIT EXPERT
-- =============================================
('business-lines-of-credit-module-1-expert', 'Advanced Revolving Credit Strategy',
 'Analyze advanced revolving credit markets including syndicated facilities, multi-bank lines, competitive dynamics, and strategic positioning for complex borrowers.',
 '3 hours', '["Syndicated revolving credit facilities","Multi-bank relationship management","Competitive market dynamics","Complex borrower strategic positioning"]', 10),
('business-lines-of-credit-module-2-expert', 'Complex LOC Deal Structuring',
 'Master complex revolving credit structures including accordion features, swingline facilities, multi-currency lines, and hybrid term/revolving facilities.',
 '3.5 hours', '["Accordion and expansion features","Swingline and same-day availability","Multi-currency revolving facilities","Hybrid term and revolving structures"]', 12),
('business-lines-of-credit-module-3-expert', 'Advanced LOC Credit Analysis',
 'Apply advanced credit analysis to revolving facilities including cash flow waterfall modeling, inter-company analysis, and seasonal stress testing.',
 '3.5 hours', '["Cash flow waterfall modeling","Inter-company and related party analysis","Seasonal and cyclical stress testing","Collateral deterioration scenarios"]', 12),
('business-lines-of-credit-module-4-expert', 'LOC Regulatory & Compliance Framework',
 'Navigate revolving credit regulatory requirements including leveraged lending guidance, risk rating frameworks, and shared national credit program.',
 '3 hours', '["Leveraged lending guidance compliance","Risk rating and classification standards","Shared National Credit program","Regulatory capital treatment"]', 10),
('business-lines-of-credit-module-5-expert', 'LOC Portfolio Risk Management',
 'Manage revolving credit portfolios with utilization analysis, concentration monitoring, early warning indicators, and portfolio optimization strategies.',
 '3 hours', '["Line utilization trend analysis","Concentration and correlation monitoring","Early warning indicator systems","Portfolio optimization and pricing"]', 10),
('business-lines-of-credit-module-6-expert', 'Advanced LOC Underwriting Systems',
 'Develop advanced revolving credit underwriting capabilities including automated borrowing base monitoring, real-time covenant tracking, and AI-driven alerts.',
 '3.5 hours', '["Automated borrowing base monitoring","Real-time covenant compliance tracking","AI-driven early warning alerts","Advanced field exam and audit techniques"]', 12),
('business-lines-of-credit-module-7-expert', 'Strategic Revolving Credit Leadership',
 'Lead revolving credit operations with portfolio strategy, client advisory services, technology innovation, and team specialization development.',
 '3 hours', '["Revolving credit portfolio strategy","Client advisory and value-added services","Technology innovation and automation","Team specialization and knowledge management"]', 10),

-- =============================================
-- ASSET-BASED LENDING BEGINNER
-- =============================================
('asset-based-lending-module-1-beginner', 'Asset-Based Lending Overview & Fundamentals',
 'Master ABL fundamentals including collateral-driven lending concepts, eligible asset types, monitoring requirements, and how ABL differs from traditional cash flow lending.',
 '2.5 hours', '["ABL vs cash flow lending fundamentals","Eligible collateral types and categories","Collateral monitoring requirements","ABL market and borrower profiles"]', 8),
('asset-based-lending-module-2-beginner', 'ABL Products & Collateral Structures',
 'Explore ABL products including AR-based facilities, inventory-based lines, equipment and real estate add-ons, and cross-collateralized structures.',
 '3 hours', '["Accounts receivable-based facilities","Inventory lending structures","Equipment and real estate components","Cross-collateralized ABL structures"]', 10),
('asset-based-lending-module-3-beginner', 'ABL Borrower & Collateral Assessment',
 'Learn to evaluate ABL borrowers including collateral quality assessment, customer concentration analysis, inventory valuation methods, and dilution tracking.',
 '3 hours', '["Collateral quality and composition assessment","Customer and debtor concentration analysis","Inventory classification and valuation","Dilution analysis and trending"]', 10),
('asset-based-lending-module-4-beginner', 'ABL Documentation & Field Examination',
 'Navigate ABL documentation including borrowing base certificates, lien perfection, field examination procedures, and ongoing reporting requirements.',
 '3.5 hours', '["ABL loan agreement key provisions","Lien perfection and intercreditor agreements","Field examination procedures","Ongoing reporting and compliance requirements"]', 12),
('asset-based-lending-module-5-beginner', 'ABL Financial & Collateral Analysis',
 'Develop ABL-specific financial analysis skills including availability calculations, borrowing base mechanics, advance rate determination, and reserve setting.',
 '3 hours', '["Availability calculation methodology","Borrowing base certificate analysis","Advance rate determination factors","Reserve types and setting methods"]', 10),
('asset-based-lending-module-6-beginner', 'ABL Underwriting Fundamentals',
 'Understand ABL underwriting including collateral valuation, liquidation analysis, advance rate benchmarking, and ABL-specific risk rating frameworks.',
 '3.5 hours', '["Collateral appraisal and valuation","Orderly liquidation value analysis","Advance rate benchmarking by asset type","ABL risk rating and classification"]', 12),
('asset-based-lending-module-7-beginner', 'ABL Monitoring, Reporting & Workouts',
 'Master ongoing ABL monitoring including daily availability tracking, periodic field exams, covenant monitoring, and ABL workout and restructuring strategies.',
 '3 hours', '["Daily availability monitoring procedures","Periodic field examination scheduling","Covenant compliance and early warnings","ABL workout and restructuring strategies"]', 10),

-- =============================================
-- ASSET-BASED LENDING EXPERT
-- =============================================
('asset-based-lending-module-1-expert', 'Advanced ABL Market Strategy',
 'Analyze the ABL market with advanced competitive dynamics, deal sourcing strategies, market segmentation, and portfolio positioning for growth.',
 '3 hours', '["ABL market trends and competitive landscape","Deal sourcing and origination strategies","Market segmentation and targeting","Portfolio positioning for growth"]', 10),
('asset-based-lending-module-2-expert', 'Complex ABL Deal Structuring',
 'Master complex ABL transactions including multi-entity borrowing bases, cross-border collateral, DIP financing, and second lien ABL structures.',
 '3.5 hours', '["Multi-entity and combined borrowing bases","Cross-border collateral and currency issues","DIP and emergence ABL financing","Second lien and split collateral structures"]', 12),
('asset-based-lending-module-3-expert', 'Advanced ABL Collateral Analysis',
 'Apply sophisticated collateral analysis including real-time inventory monitoring, AI-driven dilution prediction, dynamic advance rate adjustment, and stressed availability modeling.',
 '3.5 hours', '["Real-time collateral monitoring systems","AI-driven dilution and performance prediction","Dynamic advance rate adjustment models","Stressed availability scenario analysis"]', 12),
('asset-based-lending-module-4-expert', 'ABL Regulatory & Legal Framework',
 'Navigate ABL regulatory requirements including UCC Article 9, intercreditor agreements, bankruptcy considerations, and cross-border legal frameworks.',
 '3 hours', '["UCC Article 9 advanced provisions","Complex intercreditor agreements","Bankruptcy and preference considerations","Cross-border legal and regulatory framework"]', 10),
('asset-based-lending-module-5-expert', 'ABL Portfolio Risk Management',
 'Manage ABL portfolios with advanced collateral deterioration monitoring, industry concentration analysis, loss given default modeling, and recovery optimization.',
 '3 hours', '["Collateral deterioration early warning","Industry and sector concentration analysis","Loss given default modeling for ABL","Recovery rate optimization strategies"]', 10),
('asset-based-lending-module-6-expert', 'Advanced ABL Underwriting & Valuation',
 'Apply expert ABL underwriting to distressed situations, turnaround financing, industry-specific collateral, and complex multi-asset structures.',
 '3.5 hours', '["Distressed and turnaround ABL financing","Industry-specific collateral underwriting","Complex multi-asset pool valuation","Advanced field exam techniques and findings"]', 12),
('asset-based-lending-module-7-expert', 'Strategic ABL Operations Leadership',
 'Lead ABL operations with field exam team management, technology platform strategy, portfolio-level risk management, and business development.',
 '3 hours', '["Field exam team management and development","ABL technology platform and automation","Portfolio-level risk governance","Business development and deal origination"]', 10),

-- =============================================
-- INVOICE FACTORING BEGINNER
-- =============================================
('invoice-factoring-module-1-beginner', 'Invoice Factoring Overview & Fundamentals',
 'Master invoice factoring fundamentals including the difference between factoring and lending, recourse vs non-recourse, notification methods, and market applications.',
 '2.5 hours', '["Factoring vs traditional lending concepts","Recourse vs non-recourse factoring","Notification vs non-notification factoring","Invoice factoring market applications"]', 8),
('invoice-factoring-module-2-beginner', 'Factoring Products & Fee Structures',
 'Explore factoring products including spot factoring, whole turnover, selective invoice discounting, and reverse factoring with fee structures and pricing.',
 '3 hours', '["Spot factoring and selective programs","Whole turnover factoring agreements","Invoice discounting structures","Reverse factoring and supply chain finance"]', 10),
('invoice-factoring-module-3-beginner', 'Client & Debtor Qualification',
 'Learn to evaluate factoring clients and their account debtors including creditworthiness assessment, debtor concentration analysis, and industry risk evaluation.',
 '3 hours', '["Factoring client assessment criteria","Account debtor creditworthiness evaluation","Debtor concentration risk analysis","Industry and sector risk evaluation"]', 10),
('invoice-factoring-module-4-beginner', 'Factoring Documentation & Setup',
 'Navigate factoring documentation including purchase agreements, notice of assignment, UCC filings, and client onboarding procedures.',
 '3.5 hours', '["Factoring purchase agreement terms","Notice of assignment procedures","UCC filing for purchased receivables","Client onboarding and setup process"]', 12),
('invoice-factoring-module-5-beginner', 'Invoice Verification & Analysis',
 'Develop invoice verification skills including aging analysis, dilution calculation, dispute management, and accounts receivable quality assessment.',
 '3 hours', '["Invoice verification and validation","Aging analysis and collection patterns","Dilution calculation and trending","Dispute tracking and resolution"]', 10),
('invoice-factoring-module-6-beginner', 'Factoring Underwriting & Risk Assessment',
 'Understand factoring underwriting including debtor credit analysis, advance rate determination, reserve calculations, and fraud risk mitigation.',
 '3.5 hours', '["Debtor credit analysis for factoring","Advance rate and holdback determination","Reserve calculation methodologies","Fraud detection and prevention"]', 12),
('invoice-factoring-module-7-beginner', 'Collections, Reporting & Account Management',
 'Master factoring collections processes, cash application, client reporting, account reconciliation, and ongoing relationship management.',
 '3 hours', '["Collections process and procedures","Cash application and remittance","Client reporting and transparency","Account reconciliation and management"]', 10),

-- =============================================
-- INVOICE FACTORING EXPERT
-- =============================================
('invoice-factoring-module-1-expert', 'Advanced Factoring Market Strategy',
 'Analyze the factoring market with competitive dynamics, niche market identification, technology disruption, and strategic positioning for growth.',
 '3 hours', '["Factoring market competitive analysis","Niche market identification and targeting","Fintech disruption and digital factoring","Strategic market positioning"]', 10),
('invoice-factoring-module-2-expert', 'Complex Factoring Deal Structuring',
 'Master complex factoring arrangements including cross-border factoring, government receivables, healthcare factoring, and multi-debtor portfolio purchases.',
 '3.5 hours', '["Cross-border and international factoring","Government and public sector receivables","Healthcare receivables factoring","Multi-debtor portfolio acquisition"]', 12),
('invoice-factoring-module-3-expert', 'Advanced Factoring Analytics',
 'Apply advanced analytics to factoring including predictive dilution modeling, debtor risk scoring, portfolio performance optimization, and AI-driven decisions.',
 '3.5 hours', '["Predictive dilution and loss modeling","Debtor risk scoring algorithms","Portfolio performance optimization","AI-driven credit and pricing decisions"]', 12),
('invoice-factoring-module-4-expert', 'Factoring Regulatory & Legal Compliance',
 'Navigate factoring regulatory requirements including true sale opinions, bankruptcy considerations, consumer protection, and cross-border legal frameworks.',
 '3 hours', '["True sale vs secured lending opinions","Bankruptcy and priority considerations","Consumer protection compliance","Cross-border legal frameworks"]', 10),
('invoice-factoring-module-5-expert', 'Factoring Portfolio Risk Management',
 'Manage factoring portfolios with debtor concentration monitoring, loss prediction, reserve adequacy testing, and performance attribution analysis.',
 '3 hours', '["Debtor concentration risk management","Predictive loss modeling and provisioning","Reserve adequacy stress testing","Performance attribution and benchmarking"]', 10),
('invoice-factoring-module-6-expert', 'Advanced Factoring Underwriting',
 'Apply expert factoring underwriting to complex receivables including progress billing, retainage, milestone-based invoices, and distressed client scenarios.',
 '3.5 hours', '["Progress billing and construction factoring","Retainage and milestone-based analysis","Distressed client factoring decisions","Complex receivable pool underwriting"]', 12),
('invoice-factoring-module-7-expert', 'Strategic Factoring Operations',
 'Lead factoring operations with technology platform management, team performance optimization, client advisory services, and market expansion strategies.',
 '3 hours', '["Technology platform and automation leadership","Team performance and efficiency optimization","Client advisory and value-added services","Market expansion and channel development"]', 10),

-- =============================================
-- MERCHANT CASH ADVANCES BEGINNER
-- =============================================
('merchant-cash-advances-module-1-beginner', 'Merchant Cash Advance Overview',
 'Master MCA fundamentals including purchase of future receivables, factor rate pricing, split percentages, holdback structures, and regulatory landscape.',
 '2.5 hours', '["MCA vs traditional lending concepts","Factor rate and pricing structure","Split percentage and holdback mechanisms","MCA regulatory environment"]', 8),
('merchant-cash-advances-module-2-beginner', 'MCA Products & Pricing Models',
 'Explore MCA products including credit card split, ACH-based advances, revenue-based financing, and stacking considerations with pricing comparisons.',
 '3 hours', '["Credit card split MCA structures","ACH-based advance products","Revenue-based financing models","MCA stacking risks and considerations"]', 10),
('merchant-cash-advances-module-3-beginner', 'Merchant Qualification & Assessment',
 'Learn to evaluate merchants for MCAs including business verification, processing statement analysis, bank statement review, and industry risk assessment.',
 '3 hours', '["Merchant business verification methods","Credit card processing statement analysis","Bank statement review and trending","Industry and seasonal risk assessment"]', 10),
('merchant-cash-advances-module-4-beginner', 'MCA Documentation & Funding',
 'Navigate MCA documentation including purchase agreements, UCC filings, ACH authorization, and the rapid funding process from application to disbursement.',
 '3 hours', '["MCA purchase agreement terms","UCC-1 filing for future receivables","ACH authorization and debit setup","Rapid funding workflow and timeline"]', 10),
('merchant-cash-advances-module-5-beginner', 'MCA Financial Analysis',
 'Develop MCA-specific financial analysis including effective cost calculation, payback period estimation, revenue impact assessment, and affordability analysis.',
 '3 hours', '["Effective APR and cost calculation","Payback period estimation methods","Revenue impact and cash flow analysis","Merchant affordability assessment"]', 10),
('merchant-cash-advances-module-6-beginner', 'MCA Risk Assessment & Underwriting',
 'Understand MCA underwriting including revenue verification, decline rate analysis, industry risk scoring, and fraud detection for merchant applications.',
 '3.5 hours', '["Revenue verification and validation","Decline rate and chargeback analysis","Industry risk scoring models","Fraud detection and identity verification"]', 12),
('merchant-cash-advances-module-7-beginner', 'MCA Collections & Portfolio Management',
 'Master MCA collection methods including split adjustment, ACH management, default procedures, and portfolio monitoring for merchant cash advances.',
 '3 hours', '["Daily remittance monitoring","Split adjustment and modification","Default procedures and remedies","Portfolio performance tracking"]', 10),

-- =============================================
-- MERCHANT CASH ADVANCES EXPERT
-- =============================================
('merchant-cash-advances-module-1-expert', 'Advanced MCA Market Strategy',
 'Analyze the MCA market with competitive dynamics, regulatory evolution, fintech integration, and strategic positioning in alternative commercial financing.',
 '3 hours', '["MCA market evolution and trends","Regulatory landscape changes","Fintech and technology integration","Strategic competitive positioning"]', 10),
('merchant-cash-advances-module-2-expert', 'Complex MCA Deal Structuring',
 'Master complex MCA structures including syndicated advances, renewal programs, consolidation deals, and hybrid MCA-loan products.',
 '3.5 hours', '["Syndicated MCA participation structures","Renewal and re-advance programs","Consolidation and buyout transactions","Hybrid MCA and loan products"]', 12),
('merchant-cash-advances-module-3-expert', 'Advanced MCA Analytics & Modeling',
 'Apply advanced analytics to MCA portfolios including predictive default modeling, optimal pricing algorithms, machine learning risk scoring, and portfolio optimization.',
 '3.5 hours', '["Predictive default and loss modeling","Optimal pricing and factor rate algorithms","Machine learning risk scoring","Portfolio optimization and returns analysis"]', 12),
('merchant-cash-advances-module-4-expert', 'MCA Regulatory & Legal Framework',
 'Navigate the evolving MCA regulatory landscape including state disclosure requirements, usury considerations, true sale characterization, and compliance programs.',
 '3 hours', '["State disclosure and APR requirements","Usury law considerations and exemptions","True sale vs loan characterization","Compliance program development"]', 10),
('merchant-cash-advances-module-5-expert', 'MCA Portfolio Risk Management',
 'Manage MCA portfolios with advanced loss prediction, vintage analysis, concentration monitoring, and capital allocation optimization.',
 '3 hours', '["Advanced loss prediction models","Vintage and cohort performance analysis","Industry and geographic concentration","Capital allocation and return optimization"]', 10),
('merchant-cash-advances-module-6-expert', 'Advanced MCA Underwriting Systems',
 'Develop automated MCA underwriting systems including API integrations, real-time decisioning, machine learning models, and exception management.',
 '3.5 hours', '["Automated underwriting system design","API integration for data verification","Real-time decisioning engines","Machine learning model deployment"]', 12),
('merchant-cash-advances-module-7-expert', 'Strategic MCA Operations Leadership',
 'Lead MCA operations with technology strategy, sales channel management, regulatory compliance oversight, and business scaling strategies.',
 '3 hours', '["Technology platform strategy and scaling","Sales channel and ISO management","Regulatory compliance leadership","Business growth and scaling strategies"]', 10),

-- =============================================
-- WORKING CAPITAL BEGINNER
-- =============================================
('working-capital-module-1-beginner', 'Working Capital Finance Overview',
 'Master working capital fundamentals including cash conversion cycle, seasonal patterns, working capital components, and the role of short-term financing in business operations.',
 '2.5 hours', '["Working capital concepts and components","Cash conversion cycle analysis","Seasonal and cyclical working capital needs","Short-term vs long-term financing"]', 8),
('working-capital-module-2-beginner', 'Working Capital Products & Solutions',
 'Explore working capital products including revolving lines, term working capital loans, trade finance, supply chain financing, and inventory financing solutions.',
 '3 hours', '["Revolving working capital lines","Term working capital loans","Trade finance and letters of credit","Supply chain financing solutions"]', 10),
('working-capital-module-3-beginner', 'Working Capital Needs Assessment',
 'Learn to assess borrower working capital needs including operating cycle analysis, seasonal pattern identification, growth-driven capital requirements, and industry benchmarking.',
 '3 hours', '["Operating cycle analysis techniques","Seasonal pattern identification","Growth-driven capital requirements","Industry working capital benchmarking"]', 10),
('working-capital-module-4-beginner', 'Working Capital Documentation',
 'Navigate working capital loan documentation including credit agreements, borrowing base requirements, financial covenants, and reporting obligations.',
 '3.5 hours', '["Working capital credit agreement terms","Borrowing base and collateral requirements","Financial covenant structures","Reporting and compliance obligations"]', 12),
('working-capital-module-5-beginner', 'Working Capital Financial Analysis',
 'Analyze working capital with current ratio assessment, quick ratio evaluation, working capital turnover, and cash flow from operations analysis.',
 '3 hours', '["Current and quick ratio analysis","Working capital turnover metrics","Cash flow from operations assessment","Accounts receivable and payable management"]', 10),
('working-capital-module-6-beginner', 'Working Capital Underwriting',
 'Understand working capital underwriting including short-term repayment analysis, seasonal cash flow modeling, collateral adequacy, and covenant compliance projection.',
 '3.5 hours', '["Short-term repayment ability analysis","Seasonal cash flow modeling","Collateral adequacy for working capital","Covenant compliance projection"]', 12),
('working-capital-module-7-beginner', 'Working Capital Monitoring & Management',
 'Master ongoing working capital loan monitoring including utilization tracking, seasonal clean-up requirements, annual renewal processes, and borrower financial health assessment.',
 '3 hours', '["Line utilization monitoring","Seasonal clean-up requirement tracking","Annual renewal and review process","Borrower financial health assessment"]', 10),

-- =============================================
-- WORKING CAPITAL EXPERT
-- =============================================
('working-capital-module-1-expert', 'Advanced Working Capital Strategy',
 'Analyze advanced working capital markets including complex corporate needs, cross-border working capital, technology-driven solutions, and market competitive dynamics.',
 '3 hours', '["Complex corporate working capital needs","Cross-border working capital challenges","Technology-driven working capital solutions","Competitive market dynamics"]', 10),
('working-capital-module-2-expert', 'Complex Working Capital Structuring',
 'Master complex working capital structures including multi-entity facilities, receivable securitization, dynamic discounting programs, and working capital optimization.',
 '3.5 hours', '["Multi-entity working capital facilities","Receivable securitization programs","Dynamic discounting and early pay programs","Working capital optimization structures"]', 12),
('working-capital-module-3-expert', 'Advanced Working Capital Analysis',
 'Apply advanced analysis to working capital including DuPont decomposition, industry-adjusted metrics, scenario modeling, and predictive cash flow analytics.',
 '3.5 hours', '["DuPont analysis and decomposition","Industry-adjusted working capital metrics","Scenario and stress test modeling","Predictive cash flow analytics"]', 12),
('working-capital-module-4-expert', 'Working Capital Regulatory Framework',
 'Navigate working capital regulatory requirements including leveraged lending guidance, risk-based capital, international trade compliance, and stress testing mandates.',
 '3 hours', '["Leveraged lending guidance application","Risk-based capital considerations","International trade compliance","Regulatory stress testing requirements"]', 10),
('working-capital-module-5-expert', 'Working Capital Portfolio Management',
 'Manage working capital portfolios with utilization analytics, industry concentration monitoring, loss forecasting, and portfolio yield optimization.',
 '3 hours', '["Utilization analytics and trending","Industry concentration management","Loss forecasting and provisioning","Portfolio yield optimization"]', 10),
('working-capital-module-6-expert', 'Advanced Working Capital Underwriting',
 'Apply expert working capital underwriting to complex borrowers including multi-national operations, commodity-dependent businesses, and distressed working capital situations.',
 '3.5 hours', '["Multi-national working capital underwriting","Commodity-dependent business analysis","Distressed working capital situations","Advanced cash flow stress testing"]', 12),
('working-capital-module-7-expert', 'Strategic Working Capital Leadership',
 'Lead working capital operations with treasury management integration, client advisory services, technology strategy, and team performance optimization.',
 '3 hours', '["Treasury management integration","Working capital advisory services","Technology and automation strategy","Team performance and specialization"]', 10),

-- =============================================
-- FRANCHISE FINANCING BEGINNER
-- =============================================
('franchise-financing-module-1-beginner', 'Franchise Financing Overview',
 'Master franchise financing fundamentals including franchise business models, FDD analysis, territory rights, franchisor-franchisee relationships, and financing options.',
 '2.5 hours', '["Franchise business model fundamentals","Franchise Disclosure Document (FDD) overview","Territory rights and exclusivity","Franchise financing landscape"]', 8),
('franchise-financing-module-2-beginner', 'Franchise Loan Products & Structures',
 'Explore franchise financing products including SBA franchise loans, conventional franchise financing, equipment and leasehold improvements, and multi-unit structures.',
 '3 hours', '["SBA franchise loan programs","Conventional franchise financing","Equipment and leasehold improvement loans","Multi-unit franchise financing"]', 10),
('franchise-financing-module-3-beginner', 'Franchisee & Franchise System Assessment',
 'Learn to evaluate franchisees and franchise systems including FDD Item analysis, unit economics review, franchisee experience assessment, and territory viability.',
 '3 hours', '["FDD Item 19 financial performance analysis","Unit economics and profitability review","Franchisee experience and qualifications","Territory viability and competition"]', 10),
('franchise-financing-module-4-beginner', 'Franchise Application & Documentation',
 'Navigate franchise loan applications including franchise agreement review, FDD analysis, SBA franchise registry verification, and franchisor consent requirements.',
 '3.5 hours', '["Franchise agreement review essentials","FDD analysis for lenders","SBA Franchise Directory verification","Franchisor consent and addendum requirements"]', 12),
('franchise-financing-module-5-beginner', 'Franchise Financial Analysis',
 'Analyze franchise financials including unit-level economics, ramp-up period projections, royalty and fee impact analysis, and multi-unit financial modeling.',
 '3 hours', '["Unit-level P&L analysis","Ramp-up period financial projections","Royalty and advertising fee impact","Multi-unit financial performance modeling"]', 10),
('franchise-financing-module-6-beginner', 'Franchise Underwriting Fundamentals',
 'Understand franchise underwriting including brand strength evaluation, operator quality assessment, market saturation analysis, and franchise-specific risk factors.',
 '3.5 hours', '["Franchise brand strength evaluation","Operator quality and experience assessment","Market saturation and competition analysis","Franchise-specific risk factors"]', 12),
('franchise-financing-module-7-beginner', 'Franchise Closing & Relationship Management',
 'Master franchise loan closing including franchisor coordination, ongoing performance monitoring, expansion financing, and franchise system relationship management.',
 '3 hours', '["Franchise loan closing procedures","Franchisor coordination and reporting","Ongoing performance monitoring","Expansion and growth financing"]', 10),

-- =============================================
-- FRANCHISE FINANCING EXPERT
-- =============================================
('franchise-financing-module-1-expert', 'Advanced Franchise Market Analysis',
 'Analyze franchise markets with brand lifecycle assessment, emerging concept evaluation, international franchise dynamics, and multi-brand portfolio strategy.',
 '3 hours', '["Franchise brand lifecycle analysis","Emerging concept evaluation framework","International franchise market dynamics","Multi-brand portfolio strategy"]', 10),
('franchise-financing-module-2-expert', 'Complex Franchise Deal Structuring',
 'Master complex franchise transactions including area development financing, master franchise arrangements, franchise acquisition portfolios, and conversion deals.',
 '3.5 hours', '["Area development agreement financing","Master franchise and sub-franchising","Portfolio franchise acquisition deals","Franchise conversion and rebranding"]', 12),
('franchise-financing-module-3-expert', 'Advanced Franchise Financial Modeling',
 'Apply advanced financial modeling to franchise transactions including multi-unit roll-up analysis, development schedule modeling, and brand performance benchmarking.',
 '3.5 hours', '["Multi-unit roll-up financial modeling","Development schedule and timeline analysis","Brand performance benchmarking","Franchise system health indicators"]', 12),
('franchise-financing-module-4-expert', 'Franchise Legal & Regulatory Compliance',
 'Navigate franchise regulatory requirements including FTC franchise rules, state registration, franchise relationship laws, and international franchise compliance.',
 '3 hours', '["FTC franchise rule compliance","State registration and filing requirements","Franchise relationship and termination laws","International franchise regulatory framework"]', 10),
('franchise-financing-module-5-expert', 'Franchise Portfolio Risk Management',
 'Manage franchise lending portfolios with brand concentration analysis, system health monitoring, franchisor financial assessment, and distressed franchise strategies.',
 '3 hours', '["Brand and system concentration analysis","Franchisor financial health monitoring","System-wide performance tracking","Distressed franchise intervention strategies"]', 10),
('franchise-financing-module-6-expert', 'Advanced Franchise Underwriting',
 'Apply expert franchise underwriting to complex scenarios including emerging brands, distressed systems, market entry analysis, and turnaround franchise financing.',
 '3.5 hours', '["Emerging brand underwriting criteria","Distressed franchise system analysis","New market entry underwriting","Turnaround franchise financing"]', 12),
('franchise-financing-module-7-expert', 'Strategic Franchise Finance Leadership',
 'Lead franchise lending operations with franchisor relationship development, preferred lender programs, franchise advisory services, and team specialization.',
 '3 hours', '["Franchisor relationship development","Preferred lender program management","Franchise advisory and consulting services","Team specialization in franchise lending"]', 10),

-- =============================================
-- HEALTHCARE FINANCING BEGINNER
-- =============================================
('healthcare-financing-module-1-beginner', 'Healthcare Financing Overview',
 'Master healthcare financing fundamentals including healthcare industry structure, revenue cycle basics, payer mix analysis, and the unique characteristics of healthcare lending.',
 '2.5 hours', '["Healthcare industry structure and segments","Revenue cycle fundamentals","Payer mix and reimbursement basics","Healthcare lending characteristics"]', 8),
('healthcare-financing-module-2-beginner', 'Healthcare Loan Products & Structures',
 'Explore healthcare financing products including practice acquisition loans, equipment financing, real estate loans, and working capital facilities for healthcare providers.',
 '3 hours', '["Medical practice acquisition financing","Healthcare equipment financing","Medical office and facility financing","Healthcare working capital solutions"]', 10),
('healthcare-financing-module-3-beginner', 'Healthcare Borrower Assessment',
 'Learn to evaluate healthcare borrowers including provider credentialing, practice volume analysis, insurance panel participation, and regulatory compliance status.',
 '3 hours', '["Provider credentialing and licensing","Practice volume and patient analysis","Insurance panel participation review","Regulatory compliance status"]', 10),
('healthcare-financing-module-4-beginner', 'Healthcare Documentation & Compliance',
 'Navigate healthcare loan documentation including HIPAA considerations, state licensing requirements, Medicare/Medicaid participation, and professional liability insurance.',
 '3.5 hours', '["HIPAA compliance in lending","State licensing and CON requirements","Medicare and Medicaid participation","Professional liability insurance requirements"]', 12),
('healthcare-financing-module-5-beginner', 'Healthcare Financial Analysis',
 'Analyze healthcare financials including revenue per provider metrics, collection rates, days in AR, payer mix profitability, and overhead cost management.',
 '3 hours', '["Revenue per provider analysis","Collection rate and aging metrics","Payer mix profitability assessment","Overhead and staffing cost management"]', 10),
('healthcare-financing-module-6-beginner', 'Healthcare Underwriting Fundamentals',
 'Understand healthcare underwriting including provider dependency risk, reimbursement rate analysis, regulatory risk assessment, and healthcare-specific collateral evaluation.',
 '3.5 hours', '["Provider dependency risk assessment","Reimbursement rate trend analysis","Healthcare regulatory risk evaluation","Healthcare collateral and goodwill valuation"]', 12),
('healthcare-financing-module-7-beginner', 'Healthcare Loan Servicing & Management',
 'Master healthcare loan servicing including performance monitoring, regulatory change impact assessment, practice transition management, and growth financing.',
 '3 hours', '["Healthcare loan performance monitoring","Reimbursement change impact tracking","Practice transition and succession planning","Growth and expansion financing"]', 10),

-- =============================================
-- HEALTHCARE FINANCING EXPERT
-- =============================================
('healthcare-financing-module-1-expert', 'Advanced Healthcare Market Analysis',
 'Analyze healthcare market dynamics including value-based care transformation, consolidation trends, technology disruption, and strategic positioning for healthcare lending.',
 '3 hours', '["Value-based care transformation impact","Healthcare consolidation and M&A trends","Digital health and telemedicine disruption","Strategic healthcare lending positioning"]', 10),
('healthcare-financing-module-2-expert', 'Complex Healthcare Deal Structuring',
 'Master complex healthcare transactions including multi-practice acquisitions, healthcare system partnerships, ambulatory surgery center financing, and senior care facilities.',
 '3.5 hours', '["Multi-practice acquisition and roll-up","Healthcare system partnership structures","Ambulatory surgery center (ASC) financing","Senior care and long-term facility deals"]', 12),
('healthcare-financing-module-3-expert', 'Advanced Healthcare Financial Modeling',
 'Apply advanced financial modeling to healthcare including value-based reimbursement modeling, population health economics, and multi-site practice analysis.',
 '3.5 hours', '["Value-based reimbursement modeling","Population health economics analysis","Multi-site practice financial modeling","Healthcare M&A valuation methods"]', 12),
('healthcare-financing-module-4-expert', 'Healthcare Regulatory & Compliance Framework',
 'Navigate complex healthcare regulations including Stark Law, Anti-Kickback, HIPAA enforcement, state CON requirements, and healthcare compliance program design.',
 '3 hours', '["Stark Law and self-referral regulations","Anti-Kickback Statute compliance","HIPAA enforcement and penalties","Certificate of Need (CON) requirements"]', 10),
('healthcare-financing-module-5-expert', 'Healthcare Portfolio Risk Management',
 'Manage healthcare loan portfolios with reimbursement risk monitoring, regulatory change assessment, provider concentration analysis, and loss mitigation strategies.',
 '3 hours', '["Reimbursement risk monitoring systems","Regulatory change impact assessment","Provider and specialty concentration","Healthcare-specific loss mitigation"]', 10),
('healthcare-financing-module-6-expert', 'Advanced Healthcare Underwriting',
 'Apply expert healthcare underwriting to complex scenarios including distressed practices, healthcare startups, telemedicine ventures, and value-based care transitions.',
 '3.5 hours', '["Distressed healthcare practice evaluation","Healthcare startup underwriting","Telemedicine venture assessment","Value-based care transition analysis"]', 12),
('healthcare-financing-module-7-expert', 'Strategic Healthcare Finance Leadership',
 'Lead healthcare lending operations with industry specialization, advisory services, healthcare industry partnerships, and team knowledge development.',
 '3 hours', '["Healthcare industry specialization strategy","Advisory and consulting services","Healthcare system partnerships","Team healthcare knowledge development"]', 10),

-- =============================================
-- RESTAURANT FINANCING BEGINNER
-- =============================================
('restaurant-financing-module-1-beginner', 'Restaurant Financing Overview',
 'Master restaurant financing fundamentals including industry structure, concept types, franchise vs independent operations, and the unique risks of food service lending.',
 '2.5 hours', '["Restaurant industry structure and segments","Concept types and business models","Franchise vs independent operations","Food service lending risk profile"]', 8),
('restaurant-financing-module-2-beginner', 'Restaurant Loan Products & Structures',
 'Explore restaurant financing products including new build-out loans, acquisition financing, equipment loans, leasehold improvements, and working capital solutions.',
 '3 hours', '["New restaurant build-out financing","Restaurant acquisition loans","Kitchen equipment and FF&E financing","Leasehold improvement and working capital"]', 10),
('restaurant-financing-module-3-beginner', 'Restaurant Borrower Assessment',
 'Learn to evaluate restaurant borrowers including operator experience, concept viability, location analysis, lease terms evaluation, and competitive market assessment.',
 '3 hours', '["Operator experience and track record","Concept viability and market demand","Location and site analysis","Lease terms and occupancy cost evaluation"]', 10),
('restaurant-financing-module-4-beginner', 'Restaurant Documentation & Requirements',
 'Navigate restaurant loan documentation including lease review, health permits, liquor licensing, franchise agreements, and food service-specific requirements.',
 '3.5 hours', '["Commercial lease review for restaurants","Health permit and inspection requirements","Liquor license considerations","Restaurant-specific loan requirements"]', 12),
('restaurant-financing-module-5-beginner', 'Restaurant Financial Analysis',
 'Analyze restaurant financials including food and labor cost ratios, prime cost analysis, average check and covers, and seasonality impact assessment.',
 '3 hours', '["Food cost percentage and COGS analysis","Labor cost ratio and productivity","Prime cost calculation and benchmarking","Average check, covers, and RevPASH"]', 10),
('restaurant-financing-module-6-beginner', 'Restaurant Underwriting Fundamentals',
 'Understand restaurant underwriting including concept risk assessment, location scoring, operator evaluation, build-out cost analysis, and ramp-up period projections.',
 '3.5 hours', '["Concept and brand risk assessment","Location scoring and demographics","Operator and management evaluation","Build-out cost and ramp-up projections"]', 12),
('restaurant-financing-module-7-beginner', 'Restaurant Loan Management & Monitoring',
 'Master restaurant loan servicing including POS data monitoring, financial performance tracking, health inspection compliance, and expansion or distress management.',
 '3 hours', '["POS data and sales monitoring","Financial performance tracking metrics","Health and safety compliance monitoring","Expansion financing and distress management"]', 10),

-- =============================================
-- RESTAURANT FINANCING EXPERT
-- =============================================
('restaurant-financing-module-1-expert', 'Advanced Restaurant Market Analysis',
 'Analyze restaurant market dynamics including consumer trends, delivery and ghost kitchen disruption, labor market challenges, and strategic lending opportunities.',
 '3 hours', '["Consumer dining trend analysis","Delivery, ghost kitchen, and virtual brands","Labor market challenges and solutions","Strategic restaurant lending opportunities"]', 10),
('restaurant-financing-module-2-expert', 'Complex Restaurant Deal Structuring',
 'Master complex restaurant transactions including multi-unit expansion, area development financing, restaurant group acquisitions, and conversion deals.',
 '3.5 hours', '["Multi-unit expansion financing programs","Area development agreement structures","Restaurant group acquisition deals","Concept conversion and rebranding"]', 12),
('restaurant-financing-module-3-expert', 'Advanced Restaurant Financial Modeling',
 'Apply advanced financial modeling to restaurant transactions including unit economic modeling, expansion projections, commodity exposure analysis, and profitability optimization.',
 '3.5 hours', '["Unit economic modeling and optimization","Multi-unit expansion financial projections","Commodity and supply chain exposure","Technology and efficiency ROI analysis"]', 12),
('restaurant-financing-module-4-expert', 'Restaurant Regulatory & Compliance',
 'Navigate restaurant regulatory requirements including food safety compliance, labor law considerations, franchise regulations, and multi-state operational compliance.',
 '3 hours', '["Food safety and FDA compliance","Labor law and wage-hour considerations","Franchise regulatory requirements","Multi-state operational compliance"]', 10),
('restaurant-financing-module-5-expert', 'Restaurant Portfolio Risk Management',
 'Manage restaurant loan portfolios with concept and brand concentration analysis, performance benchmarking, early warning systems, and workout strategies.',
 '3 hours', '["Concept and brand concentration analysis","Restaurant performance benchmarking","Early warning indicators for restaurants","Restaurant workout and restructuring"]', 10),
('restaurant-financing-module-6-expert', 'Advanced Restaurant Underwriting',
 'Apply expert restaurant underwriting to complex scenarios including ghost kitchens, food halls, celebrity concepts, and distressed restaurant turnarounds.',
 '3.5 hours', '["Ghost kitchen and virtual brand underwriting","Food hall and shared kitchen concepts","Celebrity and concept-driven ventures","Distressed restaurant turnaround analysis"]', 12),
('restaurant-financing-module-7-expert', 'Strategic Restaurant Finance Leadership',
 'Lead restaurant lending operations with industry specialization, franchisor partnerships, advisory services, and portfolio-level strategy development.',
 '3 hours', '["Restaurant industry specialization strategy","Franchisor partnership development","Restaurant advisory and consulting","Portfolio strategy and growth planning"]', 10),

-- =============================================
-- BRIDGE LOANS BEGINNER
-- =============================================
('bridge-loans-module-1-beginner', 'Bridge Lending Overview & Fundamentals',
 'Master bridge loan fundamentals including interim financing concepts, exit strategy importance, typical bridge loan scenarios, and risk-reward dynamics.',
 '2.5 hours', '["Bridge loan concepts and structure","Interim financing use cases","Exit strategy fundamentals","Risk-reward dynamics in bridge lending"]', 8),
('bridge-loans-module-2-beginner', 'Bridge Loan Products & Structures',
 'Explore bridge loan products including acquisition bridges, renovation bridges, lease-up bridges, and repositioning facilities with terms, pricing, and interest reserves.',
 '3 hours', '["Acquisition bridge loan structures","Renovation and rehab bridge loans","Lease-up and stabilization bridges","Interest reserves and holdback structures"]', 10),
('bridge-loans-module-3-beginner', 'Bridge Borrower & Project Assessment',
 'Learn to evaluate bridge borrowers and projects including sponsor track record, exit strategy feasibility, property condition, and market timing assessment.',
 '3 hours', '["Sponsor experience and track record","Exit strategy feasibility analysis","Property condition assessment","Market timing and cycle evaluation"]', 10),
('bridge-loans-module-4-beginner', 'Bridge Loan Documentation',
 'Navigate bridge loan documentation including short-form loan agreements, personal guarantees, completion guarantees, and extension provisions.',
 '3.5 hours', '["Bridge loan agreement key provisions","Personal and completion guarantees","Extension and modification provisions","Subordination and intercreditor terms"]', 12),
('bridge-loans-module-5-beginner', 'Bridge Loan Financial Analysis',
 'Analyze bridge transactions including as-is vs as-stabilized values, renovation budget evaluation, carrying cost calculations, and exit scenario modeling.',
 '3 hours', '["As-is vs as-stabilized valuation","Renovation budget and cost analysis","Carrying cost and interest calculations","Exit scenario financial modeling"]', 10),
('bridge-loans-module-6-beginner', 'Bridge Underwriting Fundamentals',
 'Understand bridge underwriting including LTV analysis at multiple values, exit probability assessment, construction risk evaluation, and bridge-specific risk rating.',
 '3.5 hours', '["LTV analysis at multiple valuation points","Exit strategy probability assessment","Construction and renovation risk evaluation","Bridge-specific risk rating frameworks"]', 12),
('bridge-loans-module-7-beginner', 'Bridge Loan Management & Resolution',
 'Master bridge loan monitoring including milestone tracking, extension decision-making, exit strategy execution monitoring, and maturity default management.',
 '3 hours', '["Project milestone tracking and monitoring","Extension decision-making frameworks","Exit strategy execution monitoring","Maturity default and resolution strategies"]', 10),

-- =============================================
-- BRIDGE LOANS EXPERT
-- =============================================
('bridge-loans-module-1-expert', 'Advanced Bridge Market Strategy',
 'Analyze the bridge lending market with competitive dynamics, capital market integration, institutional bridge programs, and strategic market positioning.',
 '3 hours', '["Bridge lending market dynamics and trends","Capital market and securitization integration","Institutional bridge lending programs","Strategic market positioning and differentiation"]', 10),
('bridge-loans-module-2-expert', 'Complex Bridge Deal Structuring',
 'Master complex bridge transactions including mezzanine bridge facilities, portfolio bridge loans, note-on-note financing, and preferred equity bridge structures.',
 '3.5 hours', '["Mezzanine bridge facility structures","Portfolio bridge loan transactions","Note-on-note and leverage financing","Preferred equity bridge structures"]', 12),
('bridge-loans-module-3-expert', 'Advanced Bridge Financial Modeling',
 'Apply advanced financial modeling to bridge transactions including waterfall analysis, IRR optimization, stress testing exit scenarios, and risk-adjusted return modeling.',
 '3.5 hours', '["Bridge transaction waterfall modeling","IRR optimization and fee analysis","Exit scenario stress testing","Risk-adjusted return and pricing models"]', 12),
('bridge-loans-module-4-expert', 'Bridge Regulatory & Capital Framework',
 'Navigate bridge lending regulatory requirements including risk-based capital treatment, CRE concentration guidance, HVCRE classification, and stress testing requirements.',
 '3 hours', '["Risk-based capital treatment for bridges","CRE concentration guidance impact","HVCRE classification considerations","Regulatory stress testing for bridge portfolios"]', 10),
('bridge-loans-module-5-expert', 'Bridge Portfolio Risk Management',
 'Manage bridge loan portfolios with maturity concentration analysis, exit probability monitoring, interest reserve adequacy tracking, and portfolio-level stress testing.',
 '3 hours', '["Maturity concentration and extension risk","Exit probability monitoring systems","Interest reserve adequacy tracking","Portfolio-level stress testing"]', 10),
('bridge-loans-module-6-expert', 'Advanced Bridge Underwriting',
 'Apply expert bridge underwriting to complex scenarios including distressed asset acquisition, value-add repositioning, ground-up bridge financing, and portfolio transactions.',
 '3.5 hours', '["Distressed asset bridge financing","Value-add repositioning underwriting","Ground-up bridge loan analysis","Complex portfolio bridge transactions"]', 12),
('bridge-loans-module-7-expert', 'Strategic Bridge Lending Leadership',
 'Lead bridge lending operations with capital markets integration, investor relations, deal team management, and portfolio strategy optimization.',
 '3 hours', '["Capital markets integration strategy","Investor relations and reporting","Deal team management and performance","Portfolio strategy and yield optimization"]', 10),

-- =============================================
-- TERM LOANS BEGINNER
-- =============================================
('term-loans-module-1-beginner', 'Term Loan Overview & Fundamentals',
 'Master term loan fundamentals including amortization structures, fixed vs variable rates, covenant types, and the role of term lending in commercial banking.',
 '2.5 hours', '["Term loan structure fundamentals","Amortization types and schedules","Fixed vs variable interest rates","Term lending in commercial banking"]', 8),
('term-loans-module-2-beginner', 'Term Loan Products & Amortization',
 'Explore term loan products including fully amortizing, balloon payment, bullet maturity, and interest-only structures with appropriate use cases and pricing.',
 '3 hours', '["Fully amortizing term loan structures","Balloon and bullet payment structures","Interest-only period structures","Pricing and fee structures"]', 10),
('term-loans-module-3-beginner', 'Term Loan Borrower Assessment',
 'Learn to evaluate term loan borrowers including debt capacity analysis, industry cyclicality assessment, management quality evaluation, and purpose verification.',
 '3 hours', '["Debt capacity and leverage analysis","Industry cyclicality assessment","Management quality evaluation","Loan purpose and use verification"]', 10),
('term-loans-module-4-beginner', 'Term Loan Documentation & Covenants',
 'Navigate term loan documentation including promissory notes, loan agreements, financial covenants, reporting requirements, and default provisions.',
 '3.5 hours', '["Promissory note and loan agreement","Financial covenant design (DSCR, leverage)","Reporting and compliance requirements","Default and acceleration provisions"]', 12),
('term-loans-module-5-beginner', 'Term Loan Financial Analysis',
 'Develop term loan financial analysis skills including cash flow adequacy, leverage ratio analysis, fixed charge coverage, and debt capacity modeling.',
 '3 hours', '["Cash flow adequacy assessment","Leverage and debt-to-equity ratios","Fixed charge coverage ratio (FCCR)","Debt capacity and serviceability modeling"]', 10),
('term-loans-module-6-beginner', 'Term Loan Underwriting Fundamentals',
 'Understand term loan underwriting including repayment analysis, collateral adequacy, guarantor assessment, loan structure optimization, and risk rating.',
 '3.5 hours', '["Repayment ability and cash flow analysis","Collateral coverage and LTV assessment","Personal guarantor evaluation","Risk rating and loan pricing"]', 12),
('term-loans-module-7-beginner', 'Term Loan Servicing & Administration',
 'Master term loan servicing including payment processing, covenant monitoring, annual review procedures, and maturity and renewal management.',
 '3 hours', '["Payment processing and tracking","Covenant compliance monitoring","Annual review procedures","Maturity, renewal, and modification management"]', 10),

-- =============================================
-- TERM LOANS EXPERT
-- =============================================
('term-loans-module-1-expert', 'Advanced Term Lending Strategy',
 'Analyze term lending markets with advanced competitive dynamics, relationship pricing strategies, portfolio composition optimization, and market segmentation.',
 '3 hours', '["Term lending market dynamics","Relationship pricing and optimization","Portfolio composition strategy","Market segmentation and targeting"]', 10),
('term-loans-module-2-expert', 'Complex Term Loan Structuring',
 'Master complex term loan structures including syndicated term facilities, unitranche financing, delayed draw terms, and structured finance integration.',
 '3.5 hours', '["Syndicated term loan structures","Unitranche and hybrid financing","Delayed draw and revolving term features","Structured finance and securitization"]', 12),
('term-loans-module-3-expert', 'Advanced Term Loan Credit Analysis',
 'Apply advanced credit analysis to term loans including leveraged lending assessment, enterprise valuation, cash flow waterfall modeling, and recovery analysis.',
 '3.5 hours', '["Leveraged lending assessment methods","Enterprise valuation for credit","Cash flow waterfall and priority analysis","Loss given default and recovery modeling"]', 12),
('term-loans-module-4-expert', 'Term Loan Regulatory Framework',
 'Navigate term loan regulatory requirements including interagency guidance on leveraged lending, stress testing, risk-based capital, and supervisory expectations.',
 '3 hours', '["Interagency leveraged lending guidance","Stress testing and DFAST requirements","Risk-based capital treatment","Supervisory expectations and best practices"]', 10),
('term-loans-module-5-expert', 'Term Loan Portfolio Management',
 'Manage term loan portfolios with maturity distribution analysis, industry concentration monitoring, covenant waiver impact assessment, and portfolio optimization.',
 '3 hours', '["Maturity distribution and mismatch analysis","Industry and sector concentration","Covenant waiver and modification impact","Portfolio optimization and rebalancing"]', 10),
('term-loans-module-6-expert', 'Advanced Term Loan Underwriting',
 'Apply expert term loan underwriting to complex borrowers including highly leveraged transactions, acquisition financing, recapitalizations, and distressed credits.',
 '3.5 hours', '["Highly leveraged transaction underwriting","Acquisition financing analysis","Recapitalization and dividend recap evaluation","Distressed credit underwriting"]', 12),
('term-loans-module-7-expert', 'Strategic Term Lending Leadership',
 'Lead term lending operations with portfolio strategy, syndication management, client relationship development, and team performance optimization.',
 '3 hours', '["Portfolio strategy and yield management","Syndication and participation management","Strategic client relationship development","Team performance and knowledge management"]', 10),

-- =============================================
-- BUSINESS ACQUISITION BEGINNER
-- =============================================
('business-acquisition-module-1-beginner', 'Business Acquisition Financing Overview',
 'Master the fundamentals of business acquisition financing including deal types, valuation methods, financing structures, and the role of lending in M&A transactions.',
 '2.5 hours', '["Business acquisition deal types","Valuation methodology overview","Acquisition financing structures","Lender role in M&A transactions"]', 8),
('business-acquisition-module-2-beginner', 'Acquisition Loan Products & Structures',
 'Explore acquisition financing products including SBA acquisition loans, conventional acquisition facilities, seller financing, and earnout structures.',
 '3 hours', '["SBA acquisition loan programs","Conventional acquisition financing","Seller financing and seller notes","Earnout and contingent payment structures"]', 10),
('business-acquisition-module-3-beginner', 'Buyer & Target Business Assessment',
 'Learn to evaluate acquisition borrowers and target businesses including buyer qualification, target business analysis, synergy assessment, and deal rationale evaluation.',
 '3 hours', '["Buyer qualification and experience","Target business operational assessment","Synergy identification and validation","Deal rationale and strategic fit"]', 10),
('business-acquisition-module-4-beginner', 'Acquisition Documentation & Due Diligence',
 'Navigate acquisition loan documentation including purchase agreements, due diligence requirements, representation and warranty review, and closing conditions.',
 '3.5 hours', '["Purchase agreement review for lenders","Due diligence checklist and process","Representation and warranty analysis","Closing conditions and funding requirements"]', 12),
('business-acquisition-module-5-beginner', 'Acquisition Financial Analysis',
 'Analyze acquisition transactions including business valuation, goodwill calculation, pro forma financial modeling, and debt capacity assessment for acquisitions.',
 '3 hours', '["Business valuation methods (DCF, comps, asset)","Goodwill calculation and justification","Pro forma financial statement preparation","Acquisition debt capacity assessment"]', 10),
('business-acquisition-module-6-beginner', 'Acquisition Underwriting Fundamentals',
 'Understand acquisition underwriting including deal structure evaluation, transition risk assessment, customer concentration analysis, and key person dependency.',
 '3.5 hours', '["Deal structure and leverage evaluation","Management transition risk assessment","Customer and supplier concentration","Key person dependency analysis"]', 12),
('business-acquisition-module-7-beginner', 'Post-Acquisition Monitoring & Integration',
 'Master post-acquisition loan management including integration milestone tracking, performance monitoring against projections, covenant compliance, and growth financing.',
 '3 hours', '["Integration milestone tracking","Performance vs projection monitoring","Post-acquisition covenant compliance","Growth and expansion financing"]', 10),

-- =============================================
-- BUSINESS ACQUISITION EXPERT
-- =============================================
('business-acquisition-module-1-expert', 'Advanced M&A Market Analysis',
 'Analyze M&A market dynamics including deal flow trends, private equity competition, valuation multiples by sector, and strategic positioning for acquisition lending.',
 '3 hours', '["M&A deal flow trends and cycle analysis","Private equity and sponsor competition","Valuation multiples by industry sector","Strategic acquisition lending positioning"]', 10),
('business-acquisition-module-2-expert', 'Complex Acquisition Deal Structuring',
 'Master complex acquisition structures including leveraged buyouts, management buyouts, recapitalizations, platform and add-on acquisitions, and cross-border deals.',
 '3.5 hours', '["Leveraged buyout (LBO) financing","Management buyout (MBO) structures","Platform and add-on acquisition financing","Cross-border acquisition transactions"]', 12),
('business-acquisition-module-3-expert', 'Advanced Acquisition Financial Modeling',
 'Apply advanced financial modeling to acquisitions including LBO modeling, synergy valuation, accretion/dilution analysis, and sensitivity testing.',
 '3.5 hours', '["LBO and leveraged return modeling","Synergy identification and valuation","Accretion and dilution analysis","Sensitivity and scenario testing"]', 12),
('business-acquisition-module-4-expert', 'Acquisition Legal & Regulatory Framework',
 'Navigate acquisition regulatory requirements including antitrust considerations, Hart-Scott-Rodino, industry-specific approval requirements, and cross-border regulations.',
 '3 hours', '["Antitrust and competition analysis","Hart-Scott-Rodino filing requirements","Industry-specific regulatory approvals","Cross-border M&A regulatory framework"]', 10),
('business-acquisition-module-5-expert', 'Acquisition Portfolio Risk Management',
 'Manage acquisition loan portfolios with leveraged concentration analysis, integration risk monitoring, sponsor performance tracking, and workout strategies.',
 '3 hours', '["Leveraged lending concentration management","Integration and transition risk monitoring","Sponsor and PE fund performance tracking","Acquisition loan workout strategies"]', 10),
('business-acquisition-module-6-expert', 'Advanced Acquisition Underwriting',
 'Apply expert acquisition underwriting to complex scenarios including distressed acquisitions, carve-out transactions, roll-up strategies, and sponsor-backed deals.',
 '3.5 hours', '["Distressed acquisition underwriting","Corporate carve-out and divestiture analysis","Roll-up strategy evaluation","Sponsor-backed deal assessment"]', 12),
('business-acquisition-module-7-expert', 'Strategic M&A Finance Leadership',
 'Lead acquisition lending operations with sponsor relationship management, deal team development, market positioning, and advisory service offerings.',
 '3 hours', '["Sponsor and PE relationship management","M&A deal team development","Market positioning and branding","Advisory and value-added services"]', 10)

) AS d(id, new_title, new_desc, new_dur, new_topics, new_lc)
WHERE course_content_modules.id = d.id;

-- =============================================
-- UPDATE EXTRA PROCESSING/UNDERWRITING MODULES
-- =============================================
UPDATE course_content_modules SET 
  title = 'SBA Loan Application Processing',
  description = 'Learn the complete SBA loan application processing workflow from initial intake through submission, including document collection, verification, and file preparation.',
  duration = '3 hours',
  topics = '["Application intake and screening","Document collection and verification","File preparation and packaging","Submission workflow management"]'::jsonb,
  lessons_count = 10
WHERE id = 'loan-application-processing-module';

UPDATE course_content_modules SET 
  title = 'SBA Loan Processing Workflow Management',
  description = 'Master SBA loan processing workflows including pipeline management, status tracking, condition clearing, and coordination with underwriting and closing teams.',
  duration = '3 hours',
  topics = '["Pipeline management and prioritization","Status tracking and milestone management","Condition clearing and follow-up","Cross-team coordination and communication"]'::jsonb,
  lessons_count = 10
WHERE id = 'loan-workflow-processing-module';

UPDATE course_content_modules SET 
  title = 'Advanced SBA Documentation & Compliance Processing',
  description = 'Master advanced SBA documentation requirements including complex entity structures, regulatory compliance verification, and exception documentation.',
  duration = '3.5 hours',
  topics = '["Complex entity documentation requirements","Regulatory compliance verification","Exception documentation and approval","Advanced file quality control"]'::jsonb,
  lessons_count = 12
WHERE id = 'loan-documentation-compliance-module';

UPDATE course_content_modules SET 
  title = 'SBA Loan Closing & Post-Processing Administration',
  description = 'Master the SBA loan closing process including authorization review, closing document preparation, funding coordination, and post-closing administration.',
  duration = '3 hours',
  topics = '["Authorization condition review and clearing","Closing document preparation and review","Funding coordination and disbursement","Post-closing file management and reporting"]'::jsonb,
  lessons_count = 10
WHERE id = 'loan-closing-administration-module';

-- SBA Loan Processing modules
UPDATE course_content_modules SET 
  title = 'SBA Loan Processing Fundamentals',
  description = 'Master the fundamentals of SBA loan processing including application intake, document checklist management, borrower communication, and file organization.',
  duration = '3 hours',
  topics = '["SBA application intake procedures","Document checklist and tracking","Borrower communication protocols","File organization and management"]'::jsonb,
  lessons_count = 10
WHERE id = 'sba-loan-processing-1';

UPDATE course_content_modules SET 
  title = 'SBA Loan Processing Advanced Techniques',
  description = 'Apply advanced SBA loan processing techniques including complex deal coordination, multi-party communication, pipeline optimization, and quality assurance.',
  duration = '3 hours',
  topics = '["Complex deal coordination methods","Multi-party communication management","Pipeline optimization strategies","Quality assurance and compliance checks"]'::jsonb,
  lessons_count = 10
WHERE id = 'sba-loan-processing-2';

-- Equipment Loan Processing modules
UPDATE course_content_modules SET 
  title = 'Equipment Loan Processing Fundamentals',
  description = 'Master equipment loan processing including vendor coordination, equipment specification verification, UCC search procedures, and title documentation.',
  duration = '3 hours',
  topics = '["Vendor coordination and documentation","Equipment specification verification","UCC search and filing procedures","Title and lien documentation"]'::jsonb,
  lessons_count = 10
WHERE id = 'equipment-loan-processing-1';

UPDATE course_content_modules SET 
  title = 'Equipment Loan Processing Advanced Techniques',
  description = 'Apply advanced equipment loan processing techniques including fleet financing coordination, cross-border documentation, and closing workflow management.',
  duration = '3 hours',
  topics = '["Fleet financing documentation management","Cross-border equipment processing","Advanced closing workflow coordination","Quality control and compliance verification"]'::jsonb,
  lessons_count = 10
WHERE id = 'equipment-loan-processing-2';

-- =============================================
-- CREATE MODULES FOR EMPTY COURSES
-- =============================================

-- SBA Loan Underwriting (currently 0 modules)
INSERT INTO course_content_modules (id, course_id, title, description, duration, lessons_count, order_index, topics, status, is_active) VALUES
('sba-underwriting-module-1', 'sba-loan-underwriting', 'SBA Underwriting Overview & Standards', 'Master SBA underwriting standards including credit analysis frameworks, SBA-specific requirements, and the underwriter role in the SBA lending process.', '3 hours', 10, 0, '["SBA underwriting standards and guidelines","Credit analysis framework overview","Underwriter role and responsibilities","SBA SOP underwriting requirements"]'::jsonb, 'available', true),
('sba-underwriting-module-2', 'sba-loan-underwriting', 'SBA Credit Analysis & Risk Assessment', 'Develop comprehensive SBA credit analysis skills including financial statement analysis, industry risk evaluation, and management quality assessment.', '3.5 hours', 12, 1, '["Financial statement analysis for SBA","Industry risk evaluation methods","Management quality assessment","Repayment ability determination"]'::jsonb, 'available', true),
('sba-underwriting-module-3', 'sba-loan-underwriting', 'SBA Collateral & Guarantee Evaluation', 'Learn to evaluate collateral and guarantees for SBA loans including appraisal review, lien position analysis, and guarantor financial assessment.', '3 hours', 10, 2, '["Collateral appraisal review techniques","Lien position and priority analysis","Guarantor financial evaluation","SBA collateral requirements and exceptions"]'::jsonb, 'available', true),
('sba-underwriting-module-4', 'sba-loan-underwriting', 'SBA Credit Memorandum Preparation', 'Master SBA credit memorandum preparation including deal summary, risk analysis, mitigation strategies, and recommendation documentation.', '3.5 hours', 12, 3, '["Credit memo structure and content","Deal summary and recommendation","Risk identification and mitigation","Supporting analysis and documentation"]'::jsonb, 'available', true),
('sba-underwriting-module-5', 'sba-loan-underwriting', 'SBA Underwriting Decision & Conditions', 'Understand the SBA underwriting decision process including approval conditions, decline documentation, counterproposal strategies, and authorization preparation.', '3 hours', 10, 4, '["Underwriting decision frameworks","Approval condition development","Decline documentation and communication","Counterproposal and restructuring strategies"]'::jsonb, 'available', true);

-- Construction Loan Underwriting (currently 0 modules)
INSERT INTO course_content_modules (id, course_id, title, description, duration, lessons_count, order_index, topics, status, is_active) VALUES
('construction-underwriting-module-1', 'construction-loan-underwriting', 'Construction Underwriting Standards', 'Master construction loan underwriting standards including project evaluation frameworks, builder assessment criteria, and construction-specific risk factors.', '3 hours', 10, 0, '["Construction underwriting standards","Project evaluation framework","Builder assessment criteria","Construction risk factor identification"]'::jsonb, 'available', true),
('construction-underwriting-module-2', 'construction-loan-underwriting', 'Construction Budget & Cost Underwriting', 'Develop expertise in construction budget underwriting including cost verification, contingency analysis, hard and soft cost evaluation, and budget adequacy testing.', '3.5 hours', 12, 1, '["Construction cost verification methods","Contingency reserve analysis","Hard and soft cost evaluation","Budget adequacy stress testing"]'::jsonb, 'available', true),
('construction-underwriting-module-3', 'construction-loan-underwriting', 'Construction Valuation & Collateral', 'Learn construction loan collateral evaluation including as-complete valuation, LTC ratio analysis, land valuation, and construction appraisal review techniques.', '3 hours', 10, 2, '["As-complete valuation methods","Loan-to-Cost ratio analysis","Land and site valuation","Construction appraisal review"]'::jsonb, 'available', true),
('construction-underwriting-module-4', 'construction-loan-underwriting', 'Construction Risk Analysis & Mitigation', 'Master construction risk analysis including completion risk, market absorption risk, cost overrun scenarios, and mitigation strategy development.', '3.5 hours', 12, 3, '["Completion risk assessment methods","Market absorption and sell-out analysis","Cost overrun scenario modeling","Risk mitigation strategy development"]'::jsonb, 'available', true),
('construction-underwriting-module-5', 'construction-loan-underwriting', 'Construction Credit Decision & Monitoring', 'Understand construction underwriting decisions including credit approval conditions, draw monitoring requirements, inspection protocols, and conversion criteria.', '3 hours', 10, 4, '["Construction credit approval conditions","Draw monitoring and inspection requirements","Change order evaluation and approval","Conversion and completion criteria"]'::jsonb, 'available', true);

-- Equipment Finance Loan Underwriting (currently 0 modules - using the first course ID)
INSERT INTO course_content_modules (id, course_id, title, description, duration, lessons_count, order_index, topics, status, is_active) VALUES
('equipment-underwriting-module-1', 'equipment-finance-loan-underwriting', 'Equipment Finance Underwriting Standards', 'Master equipment finance underwriting standards including asset evaluation frameworks, borrower assessment criteria, and equipment-specific risk factors.', '3 hours', 10, 0, '["Equipment underwriting standards","Asset evaluation framework","Borrower assessment for equipment finance","Equipment-specific risk factors"]'::jsonb, 'available', true),
('equipment-underwriting-module-2', 'equipment-finance-loan-underwriting', 'Equipment Valuation & Collateral Analysis', 'Develop expertise in equipment valuation including useful life assessment, depreciation analysis, residual value estimation, and secondary market evaluation.', '3.5 hours', 12, 1, '["Equipment useful life assessment","Depreciation and obsolescence analysis","Residual value estimation methods","Secondary market and remarketing evaluation"]'::jsonb, 'available', true),
('equipment-underwriting-module-3', 'equipment-finance-loan-underwriting', 'Equipment Finance Credit Analysis', 'Learn comprehensive credit analysis for equipment financing including borrower capacity, equipment essentiality, vendor evaluation, and technology risk assessment.', '3 hours', 10, 2, '["Borrower capacity for equipment finance","Equipment essentiality and business impact","Vendor and manufacturer evaluation","Technology and obsolescence risk"]'::jsonb, 'available', true),
('equipment-underwriting-module-4', 'equipment-finance-loan-underwriting', 'Equipment Finance Risk Assessment', 'Master equipment finance risk assessment including asset concentration risk, industry-specific equipment factors, and lease vs loan structure evaluation.', '3.5 hours', 12, 3, '["Asset concentration risk analysis","Industry-specific equipment factors","Lease vs loan structure evaluation","Equipment portfolio risk assessment"]'::jsonb, 'available', true),
('equipment-underwriting-module-5', 'equipment-finance-loan-underwriting', 'Equipment Finance Decision & Documentation', 'Understand equipment finance underwriting decisions including approval conditions, documentation requirements, UCC perfection verification, and closing oversight.', '3 hours', 10, 4, '["Equipment finance approval conditions","Documentation and UCC requirements","Perfection verification procedures","Closing oversight and funding"]'::jsonb, 'available', true);

-- Also sync new modules to course_modules table
INSERT INTO course_modules (module_id, title, description, skill_level, duration, lessons_count, order_index, is_active, course_id, created_at, updated_at)
SELECT 
  ccm.id, ccm.title, ccm.description,
  CASE WHEN c.level = 'expert' THEN 'expert'::skill_level ELSE 'beginner'::skill_level END,
  ccm.duration, ccm.lessons_count, ccm.order_index, ccm.is_active, ccm.course_id, now(), now()
FROM course_content_modules ccm
LEFT JOIN courses c ON c.id = ccm.course_id
WHERE ccm.course_id IN ('sba-loan-underwriting', 'construction-loan-underwriting', 'equipment-finance-loan-underwriting')
AND NOT EXISTS (SELECT 1 FROM course_modules cm WHERE cm.module_id = ccm.id);

-- Update existing course_modules to match new titles and descriptions
UPDATE course_modules SET 
  title = ccm.title,
  description = ccm.description,
  duration = ccm.duration,
  lessons_count = ccm.lessons_count,
  updated_at = now()
FROM course_content_modules ccm
WHERE course_modules.module_id = ccm.id;

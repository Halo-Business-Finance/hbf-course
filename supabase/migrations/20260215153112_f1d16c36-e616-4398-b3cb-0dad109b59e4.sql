
-- Insert professional course videos for major tracks
INSERT INTO course_videos (module_id, title, description, video_url, video_type, duration_seconds, order_index, is_active) VALUES
-- SBA 7(a) Beginner videos
('sba-7(a)-module-1-beginner', 'SBA 7(a) Program Overview', 'Comprehensive introduction to the SBA 7(a) loan program, eligibility requirements, and key benefits for small businesses.', 'https://www.youtube.com/watch?v=placeholder-sba7a-overview', 'youtube', 1200, 1, true),
('sba-7(a)-module-2-beginner', 'SBA 7(a) Loan Products Explained', 'Detailed walkthrough of SBA 7(a) loan types including Standard, Express, and Community Advantage programs.', 'https://www.youtube.com/watch?v=placeholder-sba7a-products', 'youtube', 900, 1, true),
('sba-7(a)-module-3-beginner', 'Qualifying Borrowers for SBA 7(a)', 'How to evaluate borrower eligibility including size standards, credit requirements, and use of proceeds.', 'https://www.youtube.com/watch?v=placeholder-sba7a-qualifying', 'youtube', 1080, 1, true),
('sba-7(a)-module-4-beginner', 'SBA 7(a) Documentation Checklist', 'Complete guide to required documentation for SBA 7(a) loan applications and processing.', 'https://www.youtube.com/watch?v=placeholder-sba7a-docs', 'youtube', 840, 1, true),
('sba-7(a)-module-5-beginner', 'SBA 7(a) Financial Analysis Basics', 'Fundamental financial analysis techniques for SBA 7(a) lending including cash flow and debt service coverage.', 'https://www.youtube.com/watch?v=placeholder-sba7a-financial', 'youtube', 1320, 1, true),
('sba-7(a)-module-6-beginner', 'SBA 7(a) Underwriting Fundamentals', 'Step-by-step SBA 7(a) underwriting process from application review to credit decision.', 'https://www.youtube.com/watch?v=placeholder-sba7a-underwriting', 'youtube', 1500, 1, true),
('sba-7(a)-module-7-beginner', 'SBA 7(a) Loan Closing & Servicing', 'Closing procedures, servicing requirements, and post-closing monitoring for SBA 7(a) loans.', 'https://www.youtube.com/watch?v=placeholder-sba7a-closing', 'youtube', 1140, 1, true),

-- SBA 504 Beginner videos
('sba-504-module-1-beginner', 'SBA 504 Program Introduction', 'Overview of the SBA 504 loan program, CDC role, and real estate financing advantages.', 'https://www.youtube.com/watch?v=placeholder-sba504-intro', 'youtube', 1080, 1, true),
('sba-504-module-2-beginner', 'SBA 504 Project Structures', 'Understanding the 50/40/10 structure and eligible project costs in SBA 504 financing.', 'https://www.youtube.com/watch?v=placeholder-sba504-structures', 'youtube', 960, 1, true),
('sba-504-module-3-beginner', 'SBA 504 Borrower Qualification', 'Evaluating borrower eligibility, net worth tests, and job creation requirements.', 'https://www.youtube.com/watch?v=placeholder-sba504-qualifying', 'youtube', 900, 1, true),

-- SBA Express Beginner videos
('sba-express-module-1-beginner', 'SBA Express Loan Essentials', 'Fast-track SBA lending: understanding Express loan features, limits, and 36-hour turnaround.', 'https://www.youtube.com/watch?v=placeholder-express-essentials', 'youtube', 720, 1, true),
('sba-express-module-2-beginner', 'SBA Express Products & Lines of Credit', 'Express term loans vs. revolving lines of credit - features and use cases.', 'https://www.youtube.com/watch?v=placeholder-express-products', 'youtube', 840, 1, true),

-- CRE Beginner videos
('commercial-real-estate-module-1-beginner', 'Commercial Real Estate Lending Overview', 'Introduction to CRE loan types, property classifications, and market fundamentals.', 'https://www.youtube.com/watch?v=placeholder-cre-overview', 'youtube', 1380, 1, true),
('commercial-real-estate-module-2-beginner', 'CRE Loan Products & Structures', 'Permanent loans, bridge loans, construction-to-perm, and CMBS explained.', 'https://www.youtube.com/watch?v=placeholder-cre-products', 'youtube', 1200, 1, true),
('commercial-real-estate-module-3-beginner', 'CRE Borrower & Property Analysis', 'Evaluating sponsors, property performance, and tenant quality in CRE lending.', 'https://www.youtube.com/watch?v=placeholder-cre-borrower', 'youtube', 1140, 1, true),

-- Construction Beginner videos
('construction-loans-module-1-beginner', 'Construction Lending Fundamentals', 'How construction loans work: draw schedules, inspections, and conversion to permanent financing.', 'https://www.youtube.com/watch?v=placeholder-construction-fundamentals', 'youtube', 1200, 1, true),
('construction-loans-module-2-beginner', 'Construction Loan Draw Process', 'Managing construction draws, inspections, retainage, and budget monitoring.', 'https://www.youtube.com/watch?v=placeholder-construction-draws', 'youtube', 960, 1, true),

-- Equipment Financing Beginner videos
('equipment-financing-module-1-beginner', 'Equipment Financing Overview', 'Introduction to equipment loans, leases, and financing structures for business equipment.', 'https://www.youtube.com/watch?v=placeholder-equipment-overview', 'youtube', 1080, 1, true),
('equipment-financing-module-2-beginner', 'Equipment Lease vs. Loan Analysis', 'Comparing equipment leases and loans: tax implications, ownership, and financial impact.', 'https://www.youtube.com/watch?v=placeholder-equipment-lease-loan', 'youtube', 1020, 1, true),

-- Working Capital videos
('working-capital-module-1-beginner', 'Working Capital Financing Essentials', 'Understanding working capital needs, financing options, and cash flow management for businesses.', 'https://www.youtube.com/watch?v=placeholder-wc-essentials', 'youtube', 900, 1, true),

-- Invoice Factoring videos
('invoice-factoring-module-1-beginner', 'Invoice Factoring Fundamentals', 'How invoice factoring works: selling receivables, advance rates, and fee structures.', 'https://www.youtube.com/watch?v=placeholder-factoring-fundamentals', 'youtube', 960, 1, true),

-- MCA videos
('merchant-cash-advances-module-1-beginner', 'Merchant Cash Advance Overview', 'Understanding MCAs: factor rates, holdback percentages, and daily remittance structure.', 'https://www.youtube.com/watch?v=placeholder-mca-overview', 'youtube', 840, 1, true),

-- Franchise videos
('franchise-financing-module-1-beginner', 'Franchise Financing Essentials', 'How to finance franchise acquisitions: SBA programs, FDD analysis, and franchisor requirements.', 'https://www.youtube.com/watch?v=placeholder-franchise-essentials', 'youtube', 1080, 1, true),

-- Healthcare videos
('healthcare-financing-module-1-beginner', 'Healthcare Practice Financing', 'Financing medical, dental, and veterinary practice acquisitions and startups.', 'https://www.youtube.com/watch?v=placeholder-healthcare-financing', 'youtube', 1140, 1, true),

-- ABL videos
('asset-based-lending-module-1-beginner', 'Asset-Based Lending Introduction', 'How ABL works: borrowing base calculations, eligible collateral, and monitoring requirements.', 'https://www.youtube.com/watch?v=placeholder-abl-intro', 'youtube', 1020, 1, true),

-- Business LOC videos
('business-lines-of-credit-module-1-beginner', 'Business Lines of Credit Overview', 'Understanding revolving credit facilities: structures, covenants, and renewal processes.', 'https://www.youtube.com/watch?v=placeholder-loc-overview', 'youtube', 900, 1, true);


-- Insert professional lesson articles for major courses
-- SBA 7(a) Beginner Course Articles
INSERT INTO course_articles (module_id, title, content, excerpt, category, reading_time_minutes, order_index, is_published, tags) VALUES
('sba-7(a)-module-1-beginner', 'Understanding the SBA 7(a) Loan Program', 
'<h2>Introduction to SBA 7(a) Loans</h2>
<p>The SBA 7(a) loan program is the Small Business Administration''s primary and most flexible loan program. It provides financial assistance to small businesses that might not otherwise qualify for conventional bank financing.</p>

<h3>Key Program Features</h3>
<ul>
<li><strong>Maximum Loan Amount:</strong> Up to $5 million</li>
<li><strong>Guaranty Percentage:</strong> Up to 85% for loans of $150,000 or less; up to 75% for loans greater than $150,000</li>
<li><strong>Interest Rates:</strong> Negotiated between borrower and lender, subject to SBA maximums</li>
<li><strong>Maturity:</strong> Up to 25 years for real estate; up to 10 years for equipment; up to 10 years for working capital</li>
</ul>

<h3>Eligibility Requirements</h3>
<p>To qualify for an SBA 7(a) loan, a business must:</p>
<ol>
<li>Operate as a for-profit entity in the United States</li>
<li>Meet SBA size standards for its industry</li>
<li>Demonstrate the ability to repay the loan</li>
<li>Have a sound business purpose</li>
<li>Not have funds available from other financial sources</li>
</ol>

<h3>Use of Proceeds</h3>
<p>SBA 7(a) loans can be used for virtually any legitimate business purpose, including:</p>
<ul>
<li>Working capital and operational expenses</li>
<li>Purchasing equipment, machinery, or fixtures</li>
<li>Acquiring land or buildings</li>
<li>Refinancing existing business debt</li>
<li>Starting a new business or expanding an existing one</li>
</ul>

<h3>The Application Process</h3>
<p>The typical SBA 7(a) loan application involves several key steps:</p>
<ol>
<li><strong>Pre-qualification:</strong> Initial assessment of borrower eligibility</li>
<li><strong>Documentation gathering:</strong> Financial statements, tax returns, business plan</li>
<li><strong>Lender review:</strong> Credit analysis and underwriting</li>
<li><strong>SBA authorization:</strong> SBA reviews and approves the guaranty</li>
<li><strong>Closing:</strong> Loan documents executed and funds disbursed</li>
</ol>',
'Comprehensive overview of the SBA 7(a) loan program including eligibility, terms, and application process.',
'SBA Lending', 12, 1, true, ARRAY['SBA', '7(a)', 'small business', 'loan program']),

('sba-7(a)-module-2-beginner', 'SBA 7(a) Loan Products and Variations',
'<h2>Types of SBA 7(a) Loans</h2>
<p>The SBA 7(a) program encompasses several specialized loan products designed to meet different business needs.</p>

<h3>Standard 7(a) Loan</h3>
<p>The standard 7(a) loan is the most common type, offering up to $5 million with SBA guaranty. Processing typically takes 5-10 business days after complete submission.</p>

<h3>7(a) Small Loan</h3>
<p>For loans of $350,000 or less, the 7(a) Small Loan program offers streamlined processing with reduced documentation requirements.</p>

<h3>SBA Express</h3>
<p>SBA Express loans offer a maximum of $500,000 with a 36-hour SBA turnaround. The guaranty percentage is 50% for loans up to $500,000.</p>

<h3>Export Express</h3>
<p>Designed for exporters, this program offers up to $500,000 with a 36-hour SBA response time to help businesses develop or expand export activities.</p>

<h3>CAPLines</h3>
<p>CAPLines is an umbrella program that helps small businesses meet short-term and cyclical working capital needs through four sub-programs:</p>
<ul>
<li><strong>Seasonal Line:</strong> For businesses with seasonal increases in inventory or accounts receivable</li>
<li><strong>Contract Line:</strong> For businesses with assignable contracts</li>
<li><strong>Builders Line:</strong> For small general contractors or builders</li>
<li><strong>Working Capital Line:</strong> Asset-based revolving line of credit</li>
</ul>

<h3>Community Advantage</h3>
<p>Community Advantage loans are designed to serve underserved markets, with a maximum loan amount of $350,000 available through mission-based lenders.</p>',
'Explore the different types of SBA 7(a) loan products and their specific features.',
'SBA Lending', 10, 1, true, ARRAY['SBA', '7(a)', 'loan products', 'CAPLines', 'Express']),

('sba-7(a)-module-3-beginner', 'Borrower Qualification and Credit Analysis',
'<h2>Evaluating SBA 7(a) Borrowers</h2>
<p>Proper borrower qualification is the foundation of successful SBA lending. This article covers the key factors lenders evaluate when processing SBA 7(a) loan applications.</p>

<h3>The Five C''s of Credit</h3>
<ol>
<li><strong>Character:</strong> Assessment of the borrower''s integrity, credit history, and business experience</li>
<li><strong>Capacity:</strong> Ability to repay the loan based on cash flow analysis</li>
<li><strong>Capital:</strong> Owner''s equity injection and investment in the business</li>
<li><strong>Collateral:</strong> Assets pledged to secure the loan</li>
<li><strong>Conditions:</strong> Economic and industry conditions affecting the business</li>
</ol>

<h3>Personal Credit Requirements</h3>
<p>While the SBA does not set a minimum credit score, most lenders require:</p>
<ul>
<li>FICO score of 680 or higher for standard processing</li>
<li>Clean credit history with explanations for any derogatory items</li>
<li>No recent bankruptcies (typically within the last 3 years)</li>
<li>Current on all existing obligations</li>
</ul>

<h3>Financial Statement Analysis</h3>
<p>Key financial metrics evaluated include:</p>
<ul>
<li><strong>Debt Service Coverage Ratio (DSCR):</strong> Minimum 1.25x is typical</li>
<li><strong>Current Ratio:</strong> Measures short-term liquidity</li>
<li><strong>Debt-to-Equity Ratio:</strong> Assesses leverage and financial risk</li>
<li><strong>Working Capital:</strong> Evaluates operational financial health</li>
</ul>

<h3>Equity Injection Requirements</h3>
<p>SBA requires borrowers to demonstrate adequate equity injection:</p>
<ul>
<li>Typically 10-20% for business acquisitions</li>
<li>May be lower for existing businesses with strong cash flow</li>
<li>Must be from verifiable sources (savings, securities, real estate equity)</li>
</ul>',
'Learn the essential borrower qualification criteria and credit analysis techniques for SBA 7(a) loans.',
'Credit Analysis', 15, 1, true, ARRAY['credit analysis', 'borrower qualification', 'five Cs', 'DSCR']),

('sba-7(a)-module-4-beginner', 'SBA Documentation and Compliance Requirements',
'<h2>Essential Documentation for SBA 7(a) Loans</h2>
<p>Proper documentation is critical for SBA loan approval and compliance. This article details the required documents and regulatory framework.</p>

<h3>Required Application Documents</h3>
<ul>
<li>SBA Form 1919 - Borrower Information Form</li>
<li>SBA Form 1920 - Lender''s Application for Guaranty</li>
<li>Personal Financial Statement (SBA Form 413)</li>
<li>Business Financial Statements (3 years)</li>
<li>Federal Tax Returns (3 years - personal and business)</li>
<li>Business Plan or Loan Purpose Statement</li>
<li>Business Licenses and Registrations</li>
<li>Organizational Documents (Articles of Incorporation, Operating Agreements)</li>
</ul>

<h3>Compliance Framework</h3>
<p>SBA lenders must comply with:</p>
<ul>
<li><strong>SBA SOP 50 10:</strong> The primary reference for 7(a) loan processing</li>
<li><strong>Regulation B:</strong> Equal Credit Opportunity Act compliance</li>
<li><strong>Bank Secrecy Act:</strong> Anti-money laundering requirements</li>
<li><strong>CRA:</strong> Community Reinvestment Act obligations</li>
</ul>

<h3>Environmental Review Requirements</h3>
<p>For loans involving real estate, environmental due diligence may include:</p>
<ul>
<li>Phase I Environmental Site Assessment</li>
<li>Phase II investigation (if warranted)</li>
<li>Compliance with NEPA requirements</li>
</ul>',
'Comprehensive guide to SBA documentation requirements and regulatory compliance standards.',
'Compliance', 12, 1, true, ARRAY['documentation', 'compliance', 'SBA forms', 'regulatory']),

-- Commercial Real Estate Beginner Articles
('commercial-real-estate-module-1-beginner', 'Introduction to Commercial Real Estate Lending',
'<h2>Commercial Real Estate Lending Fundamentals</h2>
<p>Commercial real estate (CRE) lending is a specialized segment of commercial finance that involves financing income-producing properties. This module introduces the core concepts every lending professional needs to understand.</p>

<h3>Types of Commercial Properties</h3>
<ul>
<li><strong>Office:</strong> Class A, B, and C office buildings</li>
<li><strong>Retail:</strong> Shopping centers, strip malls, standalone retail</li>
<li><strong>Industrial:</strong> Warehouses, manufacturing facilities, distribution centers</li>
<li><strong>Multifamily:</strong> Apartment complexes (5+ units)</li>
<li><strong>Hospitality:</strong> Hotels, motels, resorts</li>
<li><strong>Special Purpose:</strong> Healthcare facilities, self-storage, data centers</li>
</ul>

<h3>Key Metrics in CRE Lending</h3>
<p>Understanding these metrics is essential for evaluating CRE loans:</p>
<ul>
<li><strong>Loan-to-Value (LTV):</strong> Typically 65-80% for most property types</li>
<li><strong>Debt Service Coverage Ratio (DSCR):</strong> Minimum 1.20x-1.35x depending on property type</li>
<li><strong>Net Operating Income (NOI):</strong> Revenue minus operating expenses (excluding debt service)</li>
<li><strong>Capitalization Rate (Cap Rate):</strong> NOI divided by property value</li>
<li><strong>Occupancy Rate:</strong> Percentage of leased versus available space</li>
</ul>

<h3>The CRE Loan Process</h3>
<ol>
<li>Initial inquiry and pre-qualification</li>
<li>Property and borrower due diligence</li>
<li>Appraisal and environmental assessment</li>
<li>Credit analysis and underwriting</li>
<li>Loan committee approval</li>
<li>Legal documentation and closing</li>
</ol>',
'Foundational overview of commercial real estate lending including property types, key metrics, and the loan process.',
'Commercial Real Estate', 14, 1, true, ARRAY['CRE', 'commercial real estate', 'property types', 'LTV', 'DSCR']),

('commercial-real-estate-module-2-beginner', 'CRE Property Valuation and Market Analysis',
'<h2>Understanding CRE Property Valuation</h2>
<p>Accurate property valuation is the cornerstone of sound commercial real estate lending. This article covers the three primary approaches to valuation and how to interpret market conditions.</p>

<h3>Three Approaches to Value</h3>

<h4>1. Income Approach</h4>
<p>The income approach is the most commonly used method for income-producing properties. It converts a property''s net operating income into a value estimate using capitalization rates.</p>
<p><strong>Direct Capitalization:</strong> Value = NOI / Cap Rate</p>
<p>Example: If a property generates $200,000 in NOI and the market cap rate is 7%, the estimated value would be $2,857,143.</p>

<h4>2. Sales Comparison Approach</h4>
<p>This method compares the subject property to recently sold comparable properties, making adjustments for differences in size, location, condition, and amenities.</p>

<h4>3. Cost Approach</h4>
<p>The cost approach estimates the value based on the cost to replace or reproduce the improvements, minus depreciation, plus land value. This method is most useful for special-purpose properties.</p>

<h3>Market Analysis Components</h3>
<ul>
<li><strong>Supply Analysis:</strong> Current inventory, construction pipeline, absorption rates</li>
<li><strong>Demand Drivers:</strong> Employment growth, population trends, economic indicators</li>
<li><strong>Rent Analysis:</strong> Market rents, rent growth trends, concessions</li>
<li><strong>Vacancy Trends:</strong> Historical and projected vacancy rates by submarket</li>
</ul>',
'Deep dive into CRE property valuation methods and market analysis techniques.',
'Commercial Real Estate', 15, 1, true, ARRAY['valuation', 'cap rate', 'NOI', 'market analysis']),

-- Equipment Financing Articles
('equipment-financing-module-1-beginner', 'Equipment Financing Fundamentals',
'<h2>Introduction to Equipment Financing</h2>
<p>Equipment financing enables businesses to acquire essential machinery, technology, and vehicles without depleting working capital. This module covers the fundamentals of equipment lending.</p>

<h3>Types of Equipment Financing</h3>
<ul>
<li><strong>Equipment Loans:</strong> Traditional term loans secured by the equipment being purchased</li>
<li><strong>Equipment Leases:</strong> Operating leases, capital leases, and sale-leaseback arrangements</li>
<li><strong>Equipment Lines of Credit:</strong> Revolving facilities for ongoing equipment needs</li>
<li><strong>Vendor Financing:</strong> Financing arranged through equipment manufacturers or dealers</li>
</ul>

<h3>Equipment Valuation Methods</h3>
<p>Accurate equipment valuation is critical for determining loan amounts and managing collateral risk:</p>
<ul>
<li><strong>Fair Market Value (FMV):</strong> Price equipment would sell for in an open market</li>
<li><strong>Orderly Liquidation Value (OLV):</strong> Value in a controlled sale with reasonable marketing time</li>
<li><strong>Forced Liquidation Value (FLV):</strong> Value in a quick sale, typically auction</li>
<li><strong>Replacement Cost:</strong> Cost to purchase equivalent new or used equipment</li>
</ul>

<h3>Key Underwriting Considerations</h3>
<ul>
<li>Equipment useful life vs. loan term (loan should not exceed useful life)</li>
<li>Technology obsolescence risk</li>
<li>Maintenance and operating costs</li>
<li>Residual value projections</li>
<li>Industry-specific depreciation rates</li>
</ul>',
'Essential knowledge for equipment financing professionals covering loan types, valuation, and underwriting.',
'Equipment Financing', 12, 1, true, ARRAY['equipment', 'financing', 'leasing', 'valuation']),

-- Construction Loans Articles
('construction-loans-module-1-beginner', 'Construction Lending Overview',
'<h2>Introduction to Construction Lending</h2>
<p>Construction loans are specialized short-term financing products that fund the building or renovation of commercial and residential properties. They require unique expertise due to the inherent risks of construction projects.</p>

<h3>Types of Construction Loans</h3>
<ul>
<li><strong>Construction-to-Permanent:</strong> Single-close loan that converts to permanent financing upon completion</li>
<li><strong>Stand-Alone Construction:</strong> Short-term loan requiring separate permanent financing</li>
<li><strong>Renovation/Rehab Loans:</strong> Financing for property improvements and rehabilitation</li>
<li><strong>Speculative Construction:</strong> Loans for projects without pre-sold units or pre-leased space</li>
</ul>

<h3>The Draw Process</h3>
<p>Unlike traditional loans where funds are disbursed at closing, construction loans involve periodic draws:</p>
<ol>
<li>Borrower submits draw request with supporting documentation</li>
<li>Independent inspector verifies work completion</li>
<li>Lender reviews and approves the draw</li>
<li>Funds are disbursed to the borrower or directly to contractors</li>
<li>Title company updates endorsement to ensure no mechanics liens</li>
</ol>

<h3>Risk Factors in Construction Lending</h3>
<ul>
<li><strong>Completion Risk:</strong> Will the project be finished on time and within budget?</li>
<li><strong>Cost Overrun Risk:</strong> Material costs, labor shortages, design changes</li>
<li><strong>Market Risk:</strong> Will demand exist when the project is completed?</li>
<li><strong>Environmental Risk:</strong> Soil conditions, contamination, regulatory requirements</li>
<li><strong>Contractor Risk:</strong> Financial strength and track record of the builder</li>
</ul>',
'Comprehensive introduction to construction lending including loan types, draw processes, and risk management.',
'Construction', 13, 1, true, ARRAY['construction', 'loans', 'draw process', 'risk management']),

-- Invoice Factoring Articles
('invoice-factoring-module-1-beginner', 'Invoice Factoring Essentials',
'<h2>Understanding Invoice Factoring</h2>
<p>Invoice factoring is a financial transaction where a business sells its accounts receivable (invoices) to a third party (factor) at a discount. This provides immediate working capital without taking on traditional debt.</p>

<h3>How Factoring Works</h3>
<ol>
<li><strong>Invoice Generation:</strong> Business delivers goods/services and generates an invoice</li>
<li><strong>Invoice Submission:</strong> Business submits the invoice to the factoring company</li>
<li><strong>Advance Payment:</strong> Factor advances 70-90% of the invoice value (typically within 24-48 hours)</li>
<li><strong>Collection:</strong> Factor collects payment from the customer</li>
<li><strong>Reserve Release:</strong> Factor pays the remaining balance minus fees</li>
</ol>

<h3>Types of Factoring</h3>
<ul>
<li><strong>Recourse Factoring:</strong> Business retains credit risk if customer doesn''t pay</li>
<li><strong>Non-Recourse Factoring:</strong> Factor assumes credit risk (higher fees)</li>
<li><strong>Spot Factoring:</strong> Factoring individual invoices as needed</li>
<li><strong>Whole Ledger Factoring:</strong> Factoring all receivables on an ongoing basis</li>
</ul>

<h3>Fee Structures</h3>
<p>Factoring fees typically range from 1-5% of the invoice value per month and depend on:</p>
<ul>
<li>Volume of invoices factored</li>
<li>Creditworthiness of customers (debtors)</li>
<li>Industry and payment terms</li>
<li>Whether recourse or non-recourse</li>
<li>Length of time invoices are outstanding</li>
</ul>

<h3>Ideal Factoring Candidates</h3>
<p>Invoice factoring works best for businesses that:</p>
<ul>
<li>Sell to other businesses (B2B) or government entities</li>
<li>Have creditworthy customers with net payment terms</li>
<li>Need working capital faster than traditional lending allows</li>
<li>Are growing rapidly and need to fund increased production</li>
</ul>',
'Complete guide to invoice factoring including mechanics, types, fee structures, and ideal use cases.',
'Working Capital', 14, 1, true, ARRAY['factoring', 'accounts receivable', 'working capital', 'B2B']),

-- Working Capital Articles
('working-capital-module-1-beginner', 'Working Capital Management Fundamentals',
'<h2>Understanding Working Capital</h2>
<p>Working capital is the lifeblood of every business. It represents the difference between current assets and current liabilities, measuring a company''s short-term financial health and operational efficiency.</p>

<h3>Working Capital Formula</h3>
<p><strong>Working Capital = Current Assets - Current Liabilities</strong></p>
<p>Key components include:</p>
<ul>
<li><strong>Current Assets:</strong> Cash, accounts receivable, inventory, prepaid expenses</li>
<li><strong>Current Liabilities:</strong> Accounts payable, short-term debt, accrued expenses</li>
</ul>

<h3>Working Capital Financing Options</h3>
<ul>
<li><strong>Business Lines of Credit:</strong> Revolving facilities for ongoing needs</li>
<li><strong>Short-Term Loans:</strong> Fixed-term financing for specific purposes</li>
<li><strong>Invoice Factoring:</strong> Selling receivables for immediate cash</li>
<li><strong>Merchant Cash Advances:</strong> Advances against future sales</li>
<li><strong>Trade Credit:</strong> Extended payment terms from suppliers</li>
<li><strong>SBA Working Capital Loans:</strong> Government-backed financing options</li>
</ul>

<h3>Cash Conversion Cycle</h3>
<p>The cash conversion cycle (CCC) measures how long it takes for a business to convert its investments in inventory and other resources into cash:</p>
<p><strong>CCC = Days Inventory Outstanding + Days Sales Outstanding - Days Payable Outstanding</strong></p>
<p>A shorter CCC indicates more efficient working capital management.</p>

<h3>Seasonal Working Capital Needs</h3>
<p>Many businesses experience seasonal fluctuations that create temporary working capital gaps. Lenders should understand:</p>
<ul>
<li>Peak and off-peak revenue cycles</li>
<li>Inventory build-up requirements</li>
<li>Staffing and payroll variations</li>
<li>Timing of major expenses vs. revenue recognition</li>
</ul>',
'Essential guide to working capital management, financing options, and cash flow analysis for lending professionals.',
'Working Capital', 13, 1, true, ARRAY['working capital', 'cash flow', 'CCC', 'financing']);

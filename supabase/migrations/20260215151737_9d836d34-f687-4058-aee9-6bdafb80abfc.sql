
-- Insert interactive decision-based case studies for major courses
INSERT INTO case_studies (module_id, title, company, situation, challenge, solution, outcome, lessons_learned, order_index) VALUES

-- SBA 7(a) Case Studies
('sba-7(a)-module-1-beginner', 'Regional Bakery Expansion', 'Sweet Rise Bakeries LLC',
'Sweet Rise Bakeries, a family-owned bakery chain with 3 locations in Ohio, has been operating for 12 years with annual revenue of $2.8 million. The owners want to open two new locations and upgrade equipment at existing stores.',
'The owners need $1.2 million in financing but have been declined by two conventional lenders due to insufficient collateral coverage. Their personal credit scores are 720 and 695, and the business has a DSCR of 1.35x. They have $150,000 in liquid savings for injection.',
'The lending team structured an SBA 7(a) loan for $1.2 million with a 75% SBA guaranty. The loan was split: $800,000 for real estate (25-year term) and $400,000 for equipment (10-year term). The 12.5% equity injection met SBA requirements, and the strong DSCR supported the request.',
'Both new locations opened within 8 months. Year-one revenue from new locations exceeded projections by 15%. The business created 28 new full-time jobs and maintained a perfect payment history. Total annual revenue grew to $4.6 million.',
'["SBA guaranty can bridge the gap when conventional collateral is insufficient", "Splitting loan into real estate and equipment components optimizes terms", "Strong DSCR (1.35x) and adequate equity injection are critical success factors", "Job creation strengthens the SBA application narrative"]'::jsonb,
1),

('sba-7(a)-module-3-beginner', 'Tech Startup Working Capital', 'DataFlow Analytics Inc.',
'DataFlow Analytics, a 3-year-old SaaS company with $1.5 million in annual recurring revenue, needs $500,000 in working capital to hire developers and expand marketing. The company is profitable but has minimal tangible assets.',
'The company has strong recurring revenue but limited hard collateral. The founder has a 740 credit score but limited personal assets. Traditional lenders require 2:1 collateral coverage, which the company cannot meet. Monthly cash burn is $45,000 during growth phase.',
'An SBA 7(a) working capital loan for $500,000 was structured with a 7-year term. The SBA guaranty (75%) reduced the lender''s risk. Collateral included a blanket lien on business assets plus personal guarantees. The strong ARR growth rate (40% YoY) supported repayment capacity.',
'DataFlow hired 5 engineers and doubled marketing spend. Within 12 months, ARR grew to $2.8 million. The company maintained positive cash flow from month 6 post-funding and began exploring Series A venture capital.',
'["Recurring revenue models can substitute for traditional collateral in SBA lending", "Growth rate and customer retention metrics are key underwriting factors for tech companies", "Working capital loans require careful cash flow projections and monitoring", "SBA programs can effectively serve technology companies despite non-traditional asset bases"]'::jsonb,
1),

-- Commercial Real Estate Case Studies
('commercial-real-estate-module-1-beginner', 'Mixed-Use Development Financing', 'Harbor Point Development Group',
'Harbor Point Development Group seeks $8.5 million to acquire and renovate a 45,000 SF mixed-use building in downtown Portland. The property has 30,000 SF of office space and 15,000 SF of ground-floor retail, currently 60% occupied.',
'The property requires $2.5 million in renovations to attract quality tenants. Current NOI is $380,000, insufficient for the requested loan amount. The borrower has completed 3 similar projects but none of this scale. Environmental Phase I revealed potential concerns.',
'A construction-to-permanent loan was structured at 70% LTV based on stabilized value ($12.1 million). An interest reserve covered 18 months of payments during renovation. A Phase II environmental assessment cleared concerns. The borrower contributed 30% equity and provided personal guarantees.',
'After 14 months of renovation, occupancy reached 92%. Stabilized NOI hit $840,000, yielding a 6.9% cap rate. The property appraised at $12.1 million, and the loan was converted to permanent financing. The borrower created 150+ jobs in the building.',
'["Stabilized value underwriting is appropriate for value-add projects with experienced sponsors", "Interest reserves protect both lender and borrower during renovation periods", "Environmental due diligence must be thorough—Phase II resolved potential deal-breaking concerns", "Mixed-use properties offer diversification benefits but require specialized lease analysis"]'::jsonb,
1),

-- Equipment Financing Case Studies
('equipment-financing-module-1-beginner', 'Manufacturing Equipment Upgrade', 'Precision Metal Works Inc.',
'Precision Metal Works, a 20-year-old precision machining company, needs to replace aging CNC equipment. The company has $5.2 million in annual revenue and wants to acquire 4 new CNC machines totaling $1.8 million to improve capacity and quality.',
'The existing equipment is fully depreciated and outdated, reducing competitiveness. The company has been losing bids to competitors with newer technology. Cash reserves are limited to $200,000, and the owner (age 62) is planning succession within 5 years.',
'An equipment financing package was structured with 80% advance rate ($1.44 million financed, $360,000 down payment). The 7-year term aligned with the equipment''s 10-year useful life. A maintenance reserve was established, and the succession plan was documented to address continuity concerns.',
'New equipment increased production capacity by 35% and reduced rejection rates from 4.2% to 0.8%. The company won $1.3 million in new contracts within the first year. Revenue grew to $6.8 million, and the owner began transitioning management to the next generation.',
'["Equipment financing terms should not exceed the asset''s useful economic life", "Technology upgrades can dramatically improve competitiveness and win rates", "Succession planning should be addressed in equipment financing for aging business owners", "Maintenance reserves protect collateral value and ensure continued productivity"]'::jsonb,
1),

-- Construction Loan Case Studies
('construction-loans-module-1-beginner', 'Townhome Development Project', 'Riverside Homes LLC',
'Riverside Homes seeks a $6.2 million construction loan to build 24 townhomes on a 4-acre parcel. Pre-sales account for 8 of the 24 units. The developer has completed 3 prior projects of 12-16 units each, all successfully.',
'The project faces rising material costs (lumber up 25% YoY), labor shortages in the region, and only 33% pre-sales. The municipality requires infrastructure improvements costing $400,000 not in the original budget. The developer''s personal liquidity is adequate but not exceptional.',
'The construction loan was structured with a 65% LTC ratio, 18-month term, and 10% contingency reserve. Monthly draw inspections were required. The developer contributed 35% equity including land value. Pre-sale requirements were set at 50% (12 units) before final approval, achieved within 60 days.',
'All 24 units were completed in 16 months, under the 18-month timeline. Total pre-sales reached 20 units before completion. The project came in 3% over budget due to material costs, covered by the contingency reserve. The developer''s profit margin was 18% on total project costs.',
'["Contingency reserves (8-12%) are essential for construction loans to absorb cost overruns", "Pre-sale requirements reduce market risk and demonstrate demand", "Monthly draw inspections ensure construction progress matches funding disbursements", "Developer experience and track record are critical underwriting factors for construction lending"]'::jsonb,
1),

-- Invoice Factoring Case Studies
('invoice-factoring-module-1-beginner', 'Staffing Company Cash Flow Solution', 'ProStaff Workforce Solutions',
'ProStaff Workforce Solutions, a temporary staffing company with $3.8 million in annual revenue, faces severe cash flow gaps. They must pay temporary workers weekly but their corporate clients pay on net-60 terms. The company has $620,000 in outstanding receivables at any given time.',
'ProStaff''s cash conversion cycle is 75 days, creating a permanent working capital deficit. Traditional bank lines of credit were denied due to the company''s thin margins (8% net) and limited hard assets. The company is growing 20% annually, which exacerbates the cash flow gap.',
'A whole-ledger factoring facility was established with an 85% advance rate on eligible receivables. The factor conducted credit checks on ProStaff''s top 15 clients (all creditworthy). The factoring fee was 2.5% for the first 30 days plus 0.5% per additional 15-day period. Recourse factoring was selected to minimize fees.',
'ProStaff received immediate access to $527,000 in working capital (85% of $620,000). The company eliminated payroll funding stress and was able to accept larger staffing contracts. Revenue grew 35% in the first year to $5.1 million. The factoring relationship was maintained for 2 years before the company qualified for a traditional credit facility.',
'["Factoring is ideal for B2B companies with creditworthy customers and long payment terms", "Staffing companies are prime factoring candidates due to weekly payroll vs. delayed customer payments", "Advance rates of 80-90% provide substantial immediate working capital", "Factoring can serve as a bridge to traditional financing as the company grows and builds credit history"]'::jsonb,
1),

-- Working Capital Case Studies
('working-capital-module-1-beginner', 'Seasonal Retailer Working Capital', 'Mountain Gear Outfitters',
'Mountain Gear Outfitters, an outdoor recreation retailer with 2 locations, generates 65% of its $4.2 million annual revenue between May and October. The business needs to purchase $800,000 in inventory by March for the peak season but has only $180,000 in cash reserves.',
'The seasonal nature creates a $620,000 working capital gap every spring. Previous years were funded through expensive credit card advances (24% APR). The business has a 1.8x annual DSCR but only 0.6x during the off-season months (November-February).',
'A $750,000 seasonal working capital line of credit was structured with a 12-month revolving term. Draw-downs were permitted from January through April, with required paydown to $100,000 by November. Interest-only payments during the draw period, followed by principal reduction from peak season revenues.',
'The lower cost of capital (8.5% vs. 24% credit cards) saved $93,000 annually in interest costs. The business was able to increase inventory by 20%, capturing $340,000 in previously lost sales. The line was successfully renewed for 3 consecutive years with increasing limits.',
'["Seasonal businesses require specialized working capital structures that align with cash flow cycles", "Annual DSCR may mask seasonal liquidity gaps—monthly cash flow analysis is essential", "Line of credit cleanup requirements (annual paydown) ensure the facility is truly revolving", "Reducing financing costs can significantly improve net margins for seasonal businesses"]'::jsonb,
1);

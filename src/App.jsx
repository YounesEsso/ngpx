import React, { useState, useEffect, useRef, useMemo } from "react";
import { Zap, Flame, ChevronRight, ArrowLeft, Check, X, Trophy, Target, Database, Shuffle, LogOut, Users, BarChart2, Clock, Award } from "lucide-react";
import { supabase } from "./supabase.js";

const ADMIN_EMAILS = ["younes.essoulami@engie.com", "narsimha.misra@engie.com"];

// ============================================================================
// TOPIC TAXONOMY
// ============================================================================
const TOPIC_LABELS = {
  "POWER-FUND": "Power Fundamentals", "GAS-FUND": "Gas Fundamentals",
  "GAS-CHAIN": "Gas Value Chain (Wellhead → Burner Tip)", "POWER-GEN": "Generation Technologies",
  "POWER-DELIV": "Power Delivery (T&D / Grid)", "UTIL": "Utilities & Regulation",
  "POWER-MKT": "Wholesale Power Markets", "GAS-MKT": "Wholesale Gas Markets",
  "DERIV": "Derivatives & Spreads", "RISK": "Risk & Valuation", "DEAL": "Deal Structuring & Contracts",
};

const MODULE_TOPIC = {
  "1a":"POWER-FUND","1b":"GAS-FUND","1c":"GAS-CHAIN","1d":"POWER-DELIV","1e":"GAS-CHAIN","1f":"POWER-FUND",
  "2a":"POWER-GEN","2b":"UTIL","2c":"POWER-MKT","2d":"GAS-CHAIN","2e":"GAS-CHAIN","2f":"GAS-CHAIN","2g":"GAS-CHAIN","2h":"POWER-DELIV",
  "3a":"POWER-MKT","3b":"UTIL","3c":"POWER-MKT",
  "4a":"POWER-MKT","4b":"POWER-MKT","4c":"GAS-MKT","4d":"GAS-CHAIN","4e":"DEAL",
  "5a":"POWER-MKT","5b":"POWER-MKT","5c":"POWER-MKT","5d":"GAS-MKT","5e":"DERIV","5f":"POWER-MKT","5g":"DERIV","5h":"POWER-FUND",
  "6a":"RISK","6b":"DEAL","6c":"RISK","6d":"GAS-MKT","6e":"DEAL",
};

// ============================================================================
// CURRICULUM
// ============================================================================
const CURRICULUM = {
  1: { name:"FOUNDATIONS", grade:"Elementary (G1-3)", tag:"L1", modules:[
    { id:"1a", title:"What is Electricity?", lesson:"Electricity = flow of electrons through a wire. Generated at a power plant, sent over high-voltage transmission lines, then through smaller distribution lines to your home. Critical rule: bulk electricity cannot be cheaply stored — it must be made the moment it's used. This drives the entire power-market design.",
      questions:[
        {q:"What flows through a wire to make current?",options:["Water","Electrons","Air","Photons"],answer:1,explain:"Electrons = charged particles whose motion = current."},
        {q:"Can bulk electricity be cheaply stored?",options:["Yes, in tanks","No — supply must match demand each second","Yes, underground","Only on weekends"],answer:1,explain:"THE foundational fact behind power-market design."},
        {q:"Long-distance bulk power moves on:",options:["Pipelines","High-voltage transmission lines","Trains","Trucks"],answer:1,explain:"Higher voltage = lower line losses."},
      ]},
    { id:"1b", title:"What is Natural Gas?", lesson:"Natural gas = ~90%+ methane (CH₄). Burns cleanly. Heats homes, cooks food, fuels power plants. Moves through pipelines (not wires). Unlike electricity, gas CAN be stored — in salt caverns, depleted reservoirs, and the pipelines themselves (linepack). Storability is THE structural difference between gas and power.",
      questions:[
        {q:"Main component of natural gas:",options:["Oxygen","Methane (CH₄)","Helium","CO₂"],answer:1,explain:"~90%+ methane; ethane/propane round it out."},
        {q:"How does bulk gas move?",options:["Wires","Pipelines","Tanker trucks only","Rail"],answer:1,explain:"~3 million miles of US gas pipeline."},
        {q:"Can natural gas be stored?",options:["Never","Yes — caverns, reservoirs, linepack","Only frozen","Only in bottles"],answer:1,explain:"Storability defines the gas-vs-power difference."},
      ]},
    { id:"1c", title:"From Wellhead to Burner Tip", lesson:"Gas's journey: (1) WELLHEAD — drilled wells lift gas. (2) GATHERING — small pipes collect from many wells. (3) PROCESSING — clean gas, strip water/CO₂/H₂S/NGLs. (4) TRANSMISSION — long-haul high-pressure interstate pipelines. (5) DISTRIBUTION — LDCs run smaller pipes ending at your meter and BURNER TIP (stove, furnace). Memorize this 5-stage chain.",
      questions:[
        {q:"Five stages, in order:",options:["Well→Storage→Pipe→Plant→Burner","Wellhead→Gathering→Processing→Transmission→Distribution","Pipe→Well→Burner→Plant→Storage","Plant→Pipe→Well→LDC→Meter"],answer:1,explain:"WGPTD. Burner tip is final demand."},
        {q:"Burner tip refers to:",options:["Wellhead flame","Final end-use point — stove, furnace, industrial burner","Compressor exhaust","LNG flare"],answer:1,explain:"End of the journey — where flame begins."},
        {q:"City gate = handoff between:",options:["Well and gathering","Processing and gathering","Interstate transmission and the LDC","Two LDCs"],answer:2,explain:"Pressure step-down + custody transfer."},
      ]},
    { id:"1d", title:"From Power Plant to Outlet", lesson:"Power's chain: (1) GENERATION at ~13-25 kV. (2) STEP-UP transformer to 138-765 kV. (3) TRANSMISSION long-haul. (4) SUBSTATION steps voltage down. (5) DISTRIBUTION 4-35 kV along streets. (6) SERVICE pole-top transformer to 120/240 V. All in milliseconds. No storage along the way (utility batteries are still <2% of generation).",
      questions:[
        {q:"Why very high voltage for long-distance?",options:["Looks impressive","Lower current at same power → much lower I²R losses","Birds dislike low V","Federal mandate"],answer:1,explain:"Doubling V quarters resistive losses."},
        {q:"US residential outlet voltage:",options:["12 V","120 V","1,200 V","12,000 V"],answer:1,explain:"120 V single-phase; 240 V for big appliances."},
        {q:"Substations primarily contain:",options:["Batteries","Transformers + switchgear that step voltage and route power","Generators","Customer meters"],answer:1,explain:"Voltage transformation + protection + switching."},
      ]},
    { id:"1e", title:"Where Natural Gas Comes From", lesson:"Three settings: CONVENTIONAL (porous rock — drill vertically). SHALE (tight rock — needs HORIZONTAL DRILLING + HYDRAULIC FRACTURING). ASSOCIATED (comes up alongside oil from oil wells). The 2008+ shale revolution made the US the world's largest gas producer. Big basins: MARCELLUS/UTICA (PA/OH/WV — biggest), PERMIAN (TX/NM — oil-driven), HAYNESVILLE (LA/TX), EAGLE FORD (TX), BAKKEN (ND).",
      questions:[
        {q:"Largest US gas basin:",options:["Bakken","Marcellus / Utica","Eagle Ford","Anadarko"],answer:1,explain:"Appalachian Marcellus/Utica = ~30%+ of US gas."},
        {q:"Fracking enables production from:",options:["Conventional only","Shale and tight-rock formations","Underwater wells","LNG terminals"],answer:1,explain:"Horizontal drilling + frac unlocked shale (~2008+)."},
        {q:"Permian gas is mostly:",options:["Pure gas play","Associated gas — comes up with oil; supply tracks oil drilling","Imported","From coal"],answer:1,explain:"Inelastic vs gas price — Waha hub blowouts."},
      ]},
    { id:"1f", title:"Supply and Demand", lesson:"Many buyers + scarce supply → price up. Abundant supply + weak demand → price down. Power and gas prices change hourly. Hot afternoon → A/C demand → power spikes. 3 AM in spring → demand crashes, prices can go NEGATIVE (generators pay to stay on rather than incur restart costs). Cold snap in NYC → Algonquin gas can move 5x in a day.",
      questions:[
        {q:"Summer power-price peaks typically occur:",options:["3 AM","Hot afternoons (A/C load)","During rain","Christmas"],answer:1,explain:"A/C drives summer peak."},
        {q:"Can wholesale power prices go negative?",options:["Never","Yes — when oversupply meets weak demand","Only in cartoons","Only in EU"],answer:1,explain:"Generators pay to stay online vs restart costs."},
        {q:"Winter gas spikes are most extreme at:",options:["Henry Hub","Northeast city gates (Algonquin, Transco Z6)","Permian (Waha)","Anywhere equally"],answer:1,explain:"Pipeline constraints into NE decouple from HH."},
      ]},
  ]},
  2: { name:"MIDDLE SCHOOL", grade:"G4-6", tag:"L2", modules:[
    { id:"2a", title:"How Power is Generated", lesson:"Most plants spin a magnet inside coils. COAL/GAS: burn fuel → steam → turbine. NUCLEAR: uranium fission for heat. WIND: moving air. SOLAR PV: photons knock electrons loose in silicon (no spinning). HYDRO: falling water. CCGT (combined-cycle gas turbine) = jet-engine-like turbine + steam turbine on exhaust heat → ~6,400 Btu/kWh, ~58-63% efficient — workhorse of the modern US fleet.",
      questions:[
        {q:"Most plants generate by:",options:["Spinning a magnet inside a coil","Mixing chemicals","Static electricity","Lightning"],answer:0,explain:"~95%+ use electromagnetic induction."},
        {q:"NOT dispatchable on demand:",options:["Gas peaker","Coal","Wind farm","Nuclear"],answer:2,explain:"Wind is intermittent."},
        {q:"CCGT means:",options:["Coal-Coal Gas Turbine","Combined-Cycle Gas Turbine","Capacity Cap Gas Tariff","Carbon Capture"],answer:1,explain:"Two cycles in series → ~60% efficiency."},
      ]},
    { id:"2b", title:"What is a Utility?", lesson:"Utility = delivers power/gas to your premises. RESTRUCTURED markets (TX, PA, NY, IL, NJ, parts of NE): utility ONLY delivers; separate companies generate and retail. VERTICALLY INTEGRATED (most of Southeast, NW, much of West): one utility does all. ~2/3 of US population is in some restructured market. Utilities are regulated as monopolies — running parallel wires/pipes is wasteful.",
      questions:[
        {q:"Vertically integrated =",options:["Only delivery","Generation + delivery + billing as one regulated entity","Only generation","Only billing"],answer:1,explain:"Pre-1990s model; common in regulated states."},
        {q:"Texas operates a:",options:["Vertically integrated market","Deregulated/restructured market via ERCOT","Federal-only market","No market"],answer:1,explain:"Generation, transmission, retail unbundled in ERCOT."},
        {q:"Why are utilities regulated as monopolies?",options:["Politics","Parallel wires/pipes are economically wasteful (natural monopoly)","Federal mandate","Random history"],answer:1,explain:"Regulation substitutes for competition."},
      ]},
    { id:"2c", title:"Peak vs Off-Peak", lesson:"PEAK = weekdays HE 8 through HE 23 (5 days × 16 hours = '5×16'). OFF-PEAK = nights, early mornings, weekends, NERC holidays. Forwards trade separately. LOAD FACTOR = avg ÷ peak load — flatter is cheaper to serve. On-peak typically 20-50% above off-peak; in tight markets the spread blows out.",
      questions:[
        {q:"'5×16' means:",options:["5 plants × 16 states","5 weekdays × 16 hours peak block","5% of 16 generators","5 dollars × 16"],answer:1,explain:"Mon-Fri, HE 8 through HE 23, holidays excluded."},
        {q:"Load factor =",options:["Truck weight","Average ÷ peak load","Plant noise","Turbine RPM"],answer:1,explain:"Higher LF = flatter demand = better economics."},
        {q:"Off-peak block covers:",options:["Hot afternoons","Nights, early mornings, weekends, holidays","Only Christmas","Hurricanes"],answer:1,explain:"When industrial/residential demand drops."},
      ]},
    { id:"2d", title:"Gas Gathering & Processing", lesson:"Raw wellhead gas = methane + ethane/propane/butane (NGLs) + water + CO₂ + H₂S + sometimes nitrogen. GATHERING (small low-pressure pipes) brings gas from many wells to a PROCESSING PLANT, where: DEHYDRATION removes water, SWEETENING removes H₂S/CO₂ (amine units), FRACTIONATION separates NGLs. Result = pipeline-quality gas (~95%+ methane). NGLs ship separately (Mont Belvieu hub).",
      questions:[
        {q:"NGLs are:",options:["Just water","Ethane, propane, butane separated at processing","LNG cargoes","Crude oil"],answer:1,explain:"Heavier hydrocarbons stripped out."},
        {q:"'Sour' gas =",options:["Sugar","Gas containing significant H₂S (toxic, corrosive)","Salt","Methane only"],answer:1,explain:"Removed by sweetening."},
        {q:"Why must water be removed before pipelines?",options:["Aesthetic","Forms hydrate plugs and corrodes steel pipe","Reduces price","Customer pref"],answer:1,explain:"Hydrates block flow."},
      ]},
    { id:"2e", title:"Pipelines, Compression & Linepack", lesson:"Transmission pipes = 24-42\" diameter, 500-1,500 psi steel. COMPRESSOR STATIONS every 50-100 mi re-pressurize against friction loss. ~3 million miles of US gas pipe (transmission + distribution). LINEPACK = gas in the pipe — provides hours of flexibility. Major systems: TRANSCO (Gulf→NE), TENNESSEE (TX→NE), EL PASO (Permian→W), REX (Rockies→OH bidirectional).",
      questions:[
        {q:"Compressor stations:",options:["Cool gas","Re-pressurize gas after friction-driven pressure drops","Add odorant","Tax it"],answer:1,explain:"Without compression every ~50-100 mi, flow stops."},
        {q:"Linepack:",options:["Pipeline insurance","Gas physically inside the pipe (short-term flexibility)","Tariff bundle","Pipe coating"],answer:1,explain:"Pack/draft for hourly flow swings."},
        {q:"Total US gas pipe mileage:",options:["~30,000","~300,000","~3,000,000","~30 million"],answer:2,explain:"~3M miles transmission + distribution."},
      ]},
    { id:"2f", title:"Gas Storage", lesson:"Storage absorbs the seasonal mismatch (steady production, winter heating spike). SALT CAVERNS = man-made cavities in salt domes; small but very fast (multiple cycles/year) — favored for trading. DEPLETED RESERVOIRS = old gas/oil fields; biggest by volume but slow (~1 cycle). AQUIFERS = water-rock; expensive. Plus LINEPACK and LNG peak shavers. EIA Storage Report (Thursday 10:30 AM ET) is among the most market-moving releases in commodities.",
      questions:[
        {q:"Storage with FASTEST cycling:",options:["Aquifer","Salt cavern","Depleted reservoir","LNG tank"],answer:1,explain:"High deliverability, multiple turns/yr."},
        {q:"MOST COMMON storage type:",options:["Salt cavern","Depleted reservoir","Aquifer","LNG"],answer:1,explain:"Old gas/oil fields = widespread, low-cost."},
        {q:"EIA storage report releases:",options:["Mon 9 AM","Thursday 10:30 AM ET","Fri 4 PM","Sun midnight"],answer:1,explain:"Drives front-month NG futures."},
      ]},
    { id:"2g", title:"City Gates, LDCs & Burner Tip", lesson:"Gas leaves transmission at a CITY GATE — pressure drops from 500-1,000 psi to 60-200 psi for the LDC. The LDC (e.g., Con Edison, National Grid) owns local pipes + your meter. Pressure drops further to ~0.25 psi (7 in WC) into your home. Final demand = BURNER TIP. Pure methane is ODORLESS; LDCs add MERCAPTAN (rotten-egg smell) at the city gate so leaks are detectable.",
      questions:[
        {q:"City gate =",options:["Municipal building","Metering point: transmission gas → LDC","LNG terminal","Storage cavern"],answer:1,explain:"Pressure step-down + custody transfer."},
        {q:"Mercaptan added because:",options:["Increases heat","Methane is odorless — mercaptan makes leaks detectable","Tax","Combustion"],answer:1,explain:"Rotten-egg smell at low ppm."},
        {q:"Residential gas line pressure ≈",options:["1,000 psi","100 psi","0.25 psi (7 in WC)","14.7 psi"],answer:2,explain:"Ultra-low after meter regulator."},
      ]},
    { id:"2h", title:"Power Grid: Voltage Levels & Substations", lesson:"Generator: 13-25 kV. Step-up to TRANSMISSION (138, 230, 345, 500, 765 kV — higher = longer haul). Substation steps down. SUBTRANSMISSION (35-138 kV) feeds large industrials. DISTRIBUTION (4-35 kV) along streets. Pole-top transformer drops to 120/240 V. Physics: P=V·I; for fixed P, double V → halve I → I²R losses fall 4×. HVDC for very long hauls or linking asynchronous AC grids.",
      questions:[
        {q:"Why high voltage long-distance?",options:["Looks impressive","Lower current at same power → much lower I²R losses","Required for AC","Federal mandate"],answer:1,explain:"Doubling V quarters resistive losses."},
        {q:"Residential service voltage:",options:["12 V","120 V (and 240 V split-phase)","1,200 V","7,200 V"],answer:1,explain:"120 V outlets, 240 V for big appliances."},
        {q:"HVDC most useful for:",options:["Local distribution","Very long distances OR linking asynchronous AC grids","Outlets","Solar only"],answer:1,explain:"Lower line losses; only practical AC-grid tie."},
      ]},
  ]},
  3: { name:"HIGH SCHOOL", grade:"G7-12", tag:"L3", modules:[
    { id:"3a", title:"Deregulation: Short History", lesson:"PRE-1978: Vertically integrated regulated monopolies. PURPA 1978: Forced utilities to buy from qualifying facilities — cracked the door. EPACT 1992: Created EWGs, opened wholesale competition. FERC Order 888 (1996): Open-access transmission. Order 2000 (1999): RTO formation. CALIFORNIA 2000-01: Restructuring + supply gap + Enron manipulation = $40B+ crisis. TEXAS 2021 (Storm Uri): $50B settlement, retailer defaults, exposed weatherization gaps.",
      questions:[
        {q:"FERC Order 888 (1996) required:",options:["RTO formation","Open-access non-discriminatory transmission tariffs","Retail competition","Carbon tax"],answer:1,explain:"OATT = foundation of wholesale competition."},
        {q:"California 2000-01 crisis caused by:",options:["Just weather","Restructuring + supply gap + market manipulation","Federal mandate","Random"],answer:1,explain:"Enron 'Death Star' manipulation amplified structural problems."},
        {q:"Texas 2021 Storm Uri exposed:",options:["Tax issues","Weatherization gaps + market-design vulnerabilities at scarcity prices","Pipeline overcapacity","Random"],answer:1,explain:"$9k/MWh for 70+ hours triggered cascade defaults."},
      ]},
    { id:"3b", title:"Wholesale vs Retail", lesson:"WHOLESALE = generators sell to LSEs (Load-Serving Entities) at hub LMPs or bilaterally. RETAIL = LSEs sell to end customers. In RESTRUCTURED states, customers can choose a retail provider (REPs in TX, ESCOs in NY). FERC regulates wholesale; STATE PUCs regulate retail. POLR (Provider of Last Resort) supplies customers who don't choose.",
      questions:[
        {q:"FERC vs state PUC jurisdiction:",options:["Same","FERC = wholesale interstate; PUC = retail intrastate","PUC = wholesale","Random"],answer:1,explain:"Federal Power Act split."},
        {q:"REP (in Texas) =",options:["FERC employee","Retail Electric Provider — sells power to customers","Generator","Pipeline"],answer:1,explain:"Customer-facing competitive retailer in ERCOT."},
        {q:"POLR =",options:["Pipeline regulator","Provider of Last Resort — supplies customers who don't choose / lose retailer","Trading desk","ISO program"],answer:1,explain:"Default-service mechanism."},
      ]},
    { id:"3c", title:"Market Participants", lesson:"GENERATORS: own plants, bid into ISOs. LSEs / REPs: serve load, hedge with PPAs/swaps. FINANCIAL TRADERS: speculators, market-makers. PIPELINE / TRANSPORT: midstream. ASSET-BACKED MARKETERS: own physical, trade options. ISOs/RTOs: market operators (PJM, MISO, ERCOT, CAISO, NYISO, ISO-NE, SPP). FERC: federal regulator. NERC: reliability standards. CFTC: derivatives oversight.",
      questions:[
        {q:"An LSE is:",options:["Liquid Storage Entity","Load-Serving Entity — supplies retail customers","Liquefaction Site Engineer","Listed Stock Exchange"],answer:1,explain:"Buys at wholesale, serves retail load."},
        {q:"ISOs/RTOs do:",options:["Generate power","Operate wholesale markets and dispatch the grid","Set retail rates","Mine coal"],answer:1,explain:"Market operator + grid operator combined."},
        {q:"CFTC oversees:",options:["Pipelines","Derivatives / futures markets (incl. NG, power)","Retail rates","Coal plants"],answer:1,explain:"Energy futures fall under Commodity Exchange Act."},
      ]},
  ]},
  4: { name:"COLLEGE PREP", grade:"Advanced HS / Frosh", tag:"L4", modules:[
    { id:"4a", title:"The 7 ISO/RTOs", lesson:"PJM (13 states + DC, biggest by load — RPM capacity auction). MISO (15 states, mid-continent — PRA). ERCOT (~90% of TX, energy-only via ORDC). CAISO (CA, Resource Adequacy not auction). NYISO (NY, ICAP auctions, TCC market). ISO-NE (6 NE states, FCM auction). SPP (TX–ND, Integrated Marketplace). DA + RT clearing in all; capacity in 4 of 7. ERCOT alone is energy-only.",
      questions:[
        {q:"Largest US ISO by load:",options:["MISO","PJM","ERCOT","CAISO"],answer:1,explain:"13 states + DC, ~65 million people."},
        {q:"Energy-only ISO (no capacity market):",options:["PJM","MISO","ERCOT","ISO-NE"],answer:2,explain:"ORDC drives scarcity pricing instead."},
        {q:"PJM capacity auction:",options:["RPM (Reliability Pricing Model)","FCM","ICAP","ORDC"],answer:0,explain:"3-year forward Base Residual Auction."},
      ]},
    { id:"4b", title:"Day-Ahead vs Real-Time", lesson:"DAY-AHEAD: hourly market clearing ~4 PM previous day via SCUC + SCED. Generators submit offers, ISO commits and dispatches, publishes DA LMPs. REAL-TIME: 5-min (most ISOs) imbalance market. TWO-SETTLEMENT: DA position settles at DA LMP; deviations at RT LMP. Virtual bids (INC/DEC) take pure financial positions in DA, settle at RT.",
      questions:[
        {q:"DA market clears around:",options:["Midnight","~4 PM previous day","Real-time","Friday only"],answer:1,explain:"Hourly schedules published evening before."},
        {q:"Two-settlement system:",options:["Two ISOs","DA at DA LMP; deviations at RT LMP","Two checks","Two margins"],answer:1,explain:"Standard ISO design."},
        {q:"Virtual bids (INC/DEC):",options:["Physical only","Financial bids in DA without delivery — settle vs RT","Carbon allowances","Capacity"],answer:1,explain:"Liquidity tool, ISO surveillance applies."},
      ]},
    { id:"4c", title:"Henry Hub and Basis", lesson:"Henry Hub (Erath, LA) = NYMEX NG futures delivery point — meeting of ~13 pipelines. BASIS = local hub price minus HH. Algonquin City Gates (NE), Transco Z6 NY, Dominion South (Marcellus), Chicago, Waha (Permian), Opal (Rockies), SoCal Citygate, AECO (Canada). Basis is where location-specific information lives. NYMEX NG expires 3 BD before contract month.",
      questions:[
        {q:"Henry Hub is:",options:["Storage cavern","Pipeline junction in Erath, LA — NYMEX delivery point","LNG terminal","Office in DC"],answer:1,explain:"Geographic crossroads → natural pricing point."},
        {q:"If HH=$3.00 and Z6 NY basis = +$1.50:",options:["$1.50","$3.00","$4.50","$0.50"],answer:2,explain:"Local price = HH + basis."},
        {q:"NYMEX NG expires:",options:["Last day of month","3 business days before first day of contract month","First Friday","Random"],answer:1,explain:"Memorize for end-of-month roll behavior."},
      ]},
    { id:"4d", title:"Major Pipelines", lesson:"TRANSCO (Williams) — Gulf to NE. TENNESSEE GAS (Kinder Morgan) — competing route. ALGONQUIN (Enbridge) — into NE, structurally constrained. EL PASO — Permian to West. REX (Rockies Express) — bidirectional, key for Marcellus exports west. POWER INTERTIES: ERCOT DC ties (limited — keeps ERCOT outside FERC), Pacific DC Intertie (3,100 MW HVDC). Transmission constraints CREATE LMP spreads.",
      questions:[
        {q:"REX significance:",options:["Coal banned","Marcellus shale needed western outlets — REX reversed flow","California restructured","Random"],answer:1,explain:"Reversed-flow infrastructure shift."},
        {q:"Why is ERCOT 'islanded'?",options:["Geography only","Limited DC ties keep it outside FERC interstate jurisdiction","Different frequency","All true"],answer:1,explain:"Regulatory choice via DC ties."},
        {q:"Algonquin pipeline serves:",options:["California","New England (Boston)","Florida","Pacific NW"],answer:1,explain:"The constrained pipe behind NE winter basis spikes."},
      ]},
    { id:"4e", title:"Standard Deal Types", lesson:"PPA (Power Purchase Agreement): long-term offtake of generation. TOLLING: toller supplies fuel, pays capacity charge; takes the power and bears spark-spread risk. CAPACITY CONTRACT: pure availability payment. NAESB BASE CONTRACT: physical gas. FT (Firm Transport): non-curtailable, pays daily reservation. IT (Interruptible Transport): cheaper, curtailed first. ISDA Master = financial OTC. EEI Master = physical power. NAESB = physical gas.",
      questions:[
        {q:"PPA stands for:",options:["Power Producer Allowance","Power Purchase Agreement","Public Pipeline Authority","Pre-Pay Adjustment"],answer:1,explain:"Long-term offtake contract."},
        {q:"In tolling, the toller bears:",options:["Plant capex","Spark spread / heat rate exposure","Property taxes","Insurance only"],answer:1,explain:"Toller supplies fuel, takes power."},
        {q:"FT vs IT:",options:["Same","FT non-curtailable, daily reservation; IT cheaper, curtailed first","FT cheaper","IT for liquids"],answer:1,explain:"Winter NE shippers pay 10x for FT."},
        {q:"Standard physical-power master:",options:["ISDA","EEI Master","NAESB","EFET"],answer:1,explain:"EEI = US standard for bilateral physical power."},
      ]},
  ]},
  5: { name:"COLLEGE", grade:"Undergraduate", tag:"L5", modules:[
    { id:"5a", title:"Locational Marginal Pricing (LMP)", lesson:"LMP = ENERGY + CONGESTION + LOSSES at a specific node. Energy is system-wide. Congestion appears when a transmission line binds — import-constrained nodes spike, export-constrained crash. Losses reflect resistive losses to that location. PJM has ~10,000 nodes. HUBS = weighted-average baskets (PJM West, ERCOT North). The whole nodal game = forecasting CONGESTION.",
      questions:[
        {q:"LMP components:",options:["Capacity","Energy + Congestion + Losses","Reactive power","Carbon"],answer:1,explain:"Three additive components."},
        {q:"Congestion appears when:",options:["Always","A transmission line binds","Demand is low","Random"],answer:1,explain:"Binding constraint → location-to-location LMP spread."},
        {q:"PJM hubs are:",options:["Pipelines","Weighted-average baskets of nodes used as liquid trading points","Substations only","Customer accounts"],answer:1,explain:"PJM West Hub is the most-traded power location in US."},
      ]},
    { id:"5b", title:"Capacity Markets", lesson:"Capacity ≠ Energy. Capacity markets pay generators to be AVAILABLE during future peaks. PJM RPM, ISO-NE FCM, NYISO ICAP, MISO PRA. CAISO uses Resource Adequacy (bilateral). ERCOT energy-only. CONE (Cost of New Entry) anchors auction parameters. ELCC (Effective Load Carrying Capability) accredits intermittent resources at less than nameplate. MOPR = floor on subsidized resource offers (controversial).",
      questions:[
        {q:"Capacity markets exist to:",options:["Pay for fuel","Compensate generators for being available during future peaks","Subsidize renewables","Cap retail prices"],answer:1,explain:"Resource adequacy mechanism."},
        {q:"PJM capacity auction =",options:["RPM","FCM","ICAP","ORDC"],answer:0,explain:"3-year forward."},
        {q:"ELCC accreditation:",options:["Always 100%","Reliability-equivalent capacity contribution — wind/solar < nameplate, declines as penetration grows","Same as nameplate","Random"],answer:1,explain:"Saturation effect at high renewable penetration."},
      ]},
    { id:"5c", title:"Ancillary Services", lesson:"REGULATION (RegA / RegD): sub-minute response to AGC for frequency control. SPINNING RESERVE: online, sync'd, deliver in 10 min. NON-SPIN: offline but startable in 10-30 min. REPLACEMENT/SUPPLEMENTAL: 30-60 min. BLACK START: restart grid from scratch. VOLTAGE SUPPORT: reactive. ERCOT also has ECRS, FFR. Co-optimized with energy in DA + RT clearing.",
      questions:[
        {q:"Reg vs spin reserve:",options:["Same","Reg = sub-minute AGC; spin = 10-min sync'd reserve","Reg slower","Random"],answer:1,explain:"Time scale defines product."},
        {q:"Black start units:",options:["Always nuclear","Generators able to start without external grid power","First on dispatch","Decommissioned"],answer:1,explain:"Often hydro or aero gas turbines."},
        {q:"Ancillary services co-optimized with:",options:["Capacity","Energy in DA + RT clearing","Carbon","Retail"],answer:1,explain:"Single LP per interval — efficient resource allocation."},
      ]},
    { id:"5d", title:"Gas Storage Trading", lesson:"Storage = optionality. INTRINSIC VALUE: lock with calendar spreads (buy summer, sell winter futures, less holding cost). EXTRINSIC VALUE: re-optimization right as the curve shifts — must be priced via lattice or LSM. Mar-Apr 'widow-maker' spread is the classic cycle bet. Working gas vs cushion (base) gas. Salt = high deliverability, low capacity; reservoir = opposite.",
      questions:[
        {q:"Intrinsic storage value comes from:",options:["Subsidies","Locking calendar spreads at trade date","Taxes","Random"],answer:1,explain:"Buy summer, sell winter."},
        {q:"Extrinsic storage value:",options:["Random","Optionality / right to re-optimize as forward curve shifts","Capacity payment","Tax credit"],answer:1,explain:"Path-dependent option value."},
        {q:"'Widow-maker' spread =",options:["NG Mar-Apr calendar spread, classic blow-up","Power capacity","Coal-gas switch","Random"],answer:0,explain:"Amaranth (2006) lost $6B+ on it."},
      ]},
    { id:"5e", title:"Heat Rate, Spark, Dark Spreads", lesson:"HEAT RATE (Btu/kWh) = fuel input per electric output. Best CCGT ~6,400; coal ~10,000; peaker ~9,500-11,000. SPARK SPREAD = Power − HR×Gas − VOM (gas plant gross margin). DARK SPREAD = Power − Coal_HR×Coal − VOM (coal plant). CLEAN spreads include carbon. Heat-Rate Linked option strikes on HR×Gas (avoids fuel-price exposure). Sparks/darks drive coal-to-gas switching.",
      questions:[
        {q:"Spark spread =",options:["Power × HR","Power − (HR × Gas + VOM)","Coal × HR","Random"],answer:1,explain:"Gas plant gross margin per MWh."},
        {q:"Heat rate units:",options:["MW","Btu/kWh — fuel in per electric out","$ per kWh","Random"],answer:1,explain:"Lower = more efficient."},
        {q:"Coal-to-gas switching when:",options:["Random","Gas drops or carbon rises enough that gas variable cost < coal","Coal banned","FERC orders"],answer:1,explain:"Compare HR×fuel + carbon for each — cheaper dispatches."},
      ]},
    { id:"5f", title:"FTRs / CRRs / TCCs", lesson:"Same product, different ISO names. FTR (Financial Transmission Right, PJM/MISO/ISO-NE/SPP). CRR (Congestion Revenue Right, CAISO/ERCOT). TCC (Transmission Congestion Contract, NYISO). Pays/charges hourly DA congestion-price difference between source and sink × MW awarded. Hedges location-spread risk OR speculates on congestion. ISO holds quarterly auctions; revenue from real-time congestion charges funds payouts.",
      questions:[
        {q:"FTR settles on:",options:["Energy LMP","Hourly DA congestion-price difference between source and sink × MW","Capacity","Carbon"],answer:1,explain:"Pure congestion-spread instrument."},
        {q:"CRR vs FTR vs TCC:",options:["Different products","Same product, different ISO names (CAISO/ERCOT vs PJM/MISO vs NYISO)","FTR is biggest","Random"],answer:1,explain:"Standardized concept across ISOs."},
        {q:"FTR auctions held:",options:["Annually","Quarterly (with monthly/seasonal variants)","Daily","Never"],answer:1,explain:"Plus annual long-term and monthly short-term."},
      ]},
    { id:"5g", title:"Hedging Basics", lesson:"PRODUCER hedge: short futures locks sale price. CONSUMER hedge: long futures locks purchase. CROSS-HEDGE: hedge with imperfect substitute (e.g., HH for non-HH gas). BASIS RISK: residual after cross-hedge. Hedge ratios: minimum-variance using realized correlation. FAS 133 / IFRS 9: hedge accounting requires effectiveness testing. Effective hedge → defer PnL to OCI; ineffective → mark to P&L.",
      questions:[
        {q:"Producer hedge:",options:["Long futures","Short futures (locks sale price)","Long calls","Random"],answer:1,explain:"Sells future production forward."},
        {q:"Basis risk =",options:["FX risk","Residual price risk after cross-hedging with imperfect substitute","Federal tax","Random"],answer:1,explain:"Local hub vs futures-delivery point."},
        {q:"Hedge accounting (effective):",options:["P&L immediately","Deferred to OCI; recognized when hedged item flows","Always P&L","Never"],answer:1,explain:"FAS 133 / IFRS 9 effectiveness test."},
      ]},
    { id:"5h", title:"Power Flow & Load Flow", lesson:"LOAD FLOW (Power Flow) finds the voltage at each bus given known generation and load. The standard iterative method (Gauss-Seidel):\n\n(1) ASSUME initial voltage = rated (e.g. 100V)\n(2) CALCULATE load current: I = S* / V* (complex power / conjugate of voltage)\n(3) COMPUTE bus voltage: V_load = V_source − Z_line × I_load\n(4) CHECK convergence: % Change = |V_new − V_old| / V_nominal × 100%\n(5) If % change > threshold, repeat from step 2\n\nExample: 100V source, 1Ω line, 1kW load:\n• Iteration 1: I = 1000/100 = 10A → V = 100 − (1)(10) = 90V (10% change)\n• Iteration 2: I = 1000/90 = 11.11A → V = 100 − (1)(11.11) = 88.89V (1.1% change)\n• Iteration 3: I = 1000/88.89 = 11.25A → V = 100 − (1)(11.25) = 88.75V (0.14% change)\n• Converges to ≈ 88.7V",
      questions:[
        {q:"In load flow, load current is calculated as:",options:["V / Z","S* / V*","P × R","V × I"],answer:1,explain:"I = S*/V* — complex power divided by conjugate of voltage."},
        {q:"With 100V source, 1Ω line, 1kW load — voltage at node B after iteration 1:",options:["100V","95V","90V","85V"],answer:2,explain:"I = 1000/100 = 10A; V = 100 − (1)(10) = 90V."},
        {q:"Load current in iteration 2 (after V=90V):",options:["10A","10.5A","11.11A","12A"],answer:2,explain:"I = S*/V* = 1000/90 = 11.11A — current rises as voltage drops."},
        {q:"Voltage at node B after iteration 2:",options:["90V","88.89V","87.5V","85V"],answer:1,explain:"V = 100 − (1)(11.11) = 88.89V. % change = 1.1% — not yet converged."},
        {q:"Why does load current increase each iteration?",options:["Line resistance grows","Voltage drops so more current needed to deliver same power","Source voltage falls","Random variation"],answer:1,explain:"Constant power load: P = V × I. As V drops, I must rise to maintain 1kW."},
        {q:"Load flow iteration stops when:",options:["After exactly 3 steps","% voltage change falls below convergence threshold","Current exceeds limit","Voltage reaches zero"],answer:1,explain:"Convergence criterion: |V_new − V_old| / V_nominal < threshold (e.g. 0.1%)."},
      ]},
  ]},
  6: { name:"GRADUATE", grade:"Quant / Practitioner", tag:"L6", modules:[
    { id:"6a", title:"Real Options & Storage Valuation", lesson:"INTRINSIC: lock-in value with calendar spreads at trade date (deterministic). EXTRINSIC: re-optimization optionality requires path-dependent valuation. Approaches: LSM (Longstaff-Schwartz Monte Carlo) regresses continuation values on basis functions. STOCHASTIC DP (lattice / Bellman backward induction). Spot/forward dynamics: 2-factor mean-reverting (Schwartz-Smith), GBM-jump for spikes. Ratchets / injection-withdrawal capacity constraints make this a constrained stochastic control problem.",
      questions:[
        {q:"LSM stands for:",options:["Linear Stochastic Model","Longstaff-Schwartz Monte Carlo (regression-based path-dependent valuation)","Local State Memory","Random"],answer:1,explain:"Standard method for path-dependent options."},
        {q:"Schwartz-Smith model:",options:["1-factor","2-factor mean-reverting forward-curve model for commodities","Black-Scholes variant","Random"],answer:1,explain:"Short-term + long-term factors."},
        {q:"Storage as control problem:",options:["Static","Constrained stochastic control with injection/withdrawal capacity bounds","Trivial","Federal mandate"],answer:1,explain:"Bellman backward induction or LSM."},
      ]},
    { id:"6b", title:"Structured Products", lesson:"HEAT-RATE CALL: max(P − HR×G − VOM, 0) = spark-spread call. Priced via Margrabe (zero-strike) or Kirk's approximation. SWING / TAKE-OR-PAY GAS: vary daily within DCQ min/max bounds, MAQ floor — pure path-dependent. INDEX-PLUS-BASIS: NYMEX HH ± fixed adder. WEATHER DERIVATIVES: HDD/CDD swaps. LOAD-FOLLOWING: Σ Loadₜ × LMPₜ + shape-risk premium. Each decomposes to vanilla replicating components for hedging.",
      questions:[
        {q:"Margrabe formula prices:",options:["Vanilla calls","Zero-strike spread option between two GBM assets (closed-form)","Bonds","Asian"],answer:1,explain:"Spread of two correlated GBMs at zero strike."},
        {q:"Kirk's approximation extends Margrabe to:",options:["FX","Non-zero strikes","Equities","Bonds"],answer:1,explain:"Approximate but widely used for spark-spread strikes."},
        {q:"Swing option payoff is:",options:["Linear","Path-dependent — depends on holder's daily take pattern subject to bounds","European-style","Always zero"],answer:1,explain:"Pure path-dependent option."},
      ]},
    { id:"6c", title:"Risk Metrics & Portfolio", lesson:"VaR (95%, 99%): loss threshold not exceeded with given probability over horizon. Limitations: doesn't capture tail magnitude; not sub-additive. CVaR / Expected Shortfall: average loss given loss > VaR — coherent. STRESS / SCENARIO TESTS: specific shocks (Storm Uri, Polar Vortex, hurricane). PFE: forward-looking credit exposure. CVA: discount derivative value for counterparty default risk. WRONG-WAY RISK: counterparty exposure rises as their credit deteriorates.",
      questions:[
        {q:"CVaR vs VaR:",options:["Same","CVaR averages losses BEYOND VaR — captures tail magnitude; coherent","VaR is bigger","Random"],answer:1,explain:"Why CVaR is preferred for tail-heavy commodities."},
        {q:"Wrong-way risk:",options:["Random","Counterparty exposure rises as their credit deteriorates","FX-only","Right-side gain"],answer:1,explain:"Producer/consumer hedges in stress."},
        {q:"PFE =",options:["Past exposure","Potential Future Exposure — forward-looking credit metric","Just CVA","Capacity"],answer:1,explain:"Combined with CVA/DVA for credit-risk pricing."},
      ]},
    { id:"6d", title:"LNG & Cross-Commodity Arbitrage", lesson:"US LNG terminals (Sabine, Cameron, Corpus, Freeport, Calcasieu, Plaquemines, Rio Grande) link HH to JKM (NE Asia) and TTF (Europe). Rough arb: HH × 1.15 + ~$2.50 liquefaction toll + ~$1-2 shipping/regas ≈ landed cost. Below this, cargoes can cancel ($2-3 toll is sunk). COAL-GAS switching. OIL-GAS: 6:1 BOE link broke post-shale (now 30-50:1). CARBON: $10/ton CO₂ ≈ +$0.40/MMBtu equiv on a CCGT.",
      questions:[
        {q:"US LNG-Europe rough arb breakeven (vs $3 HH):",options:["$0.50","$5-7/MMBtu landed","$50","Always profitable"],answer:1,explain:"1.15× HH + ~$2.5 toll + shipping/regas."},
        {q:"JKM benchmarks LNG for:",options:["Gulf","NW Europe","NE Asia (Japan/Korea)","Brazil"],answer:2,explain:"Platts JKM = Asia LNG spot."},
        {q:"Why did 6:1 oil-gas BOE link break?",options:["OPEC","Shale gas decoupled US gas — abundance pushed gas to its own marginal cost","Carbon","EVs"],answer:1,explain:"Post-2008 shale broke the soft floor."},
      ]},
    { id:"6e", title:"Structured Power & Gas Deals", lesson:"PRICING toolkits: Black-76 (forward-lognormal commodity options), Margrabe / Kirk (spread), LSM / lattice (path-dependent). HEDGING: decompose to vanilla, dynamically delta-hedge, monitor cross-gamma in spread books. VOL SURFACE: NG shows winter right-skew, calendar humps. STRUCTURING: heat-rate calls, swing options, full-requirements with shape risk, weather derivatives, asset-backed trading. CREDIT: ISDA + CSA + IM/VM; cleared products reduce counterparty risk via CCP novation.",
      questions:[
        {q:"Black-76 used for:",options:["Equities","European options on forwards/futures (commodity workhorse)","Bonds","FX"],answer:1,explain:"Lognormal forward; standard commodity-options model."},
        {q:"HDD swap:",options:["Hot-Day Discount","Pays based on Heating Degree Days vs strike — gas-heating exposure hedge","Hard drive","Hub differential"],answer:1,explain:"HDD = max(65°F − avg daily temp, 0)."},
        {q:"CCP novation:",options:["Random","Cleared trade replaces bilateral counterparty with central clearinghouse","ISDA term","Tax form"],answer:1,explain:"Reduces credit exposure to a single regulated entity."},
        {q:"Cross-gamma in spread options:",options:["Doesn't exist","Sensitivity of one delta to changes in the other underlying — material for spark hedging","FX-only","Always zero"],answer:1,explain:"Why spread books need 2D scenario PnL."},
      ]},
  ]},
};

const PLACEMENT = [
  {lvl:1,topic:"POWER-FUND",q:"What flows through a wire to make electric current?",options:["Water","Electrons","Air","Photons"],answer:1},
  {lvl:1,topic:"POWER-FUND",q:"Bulk electricity storage is:",options:["Easy and cheap","Difficult — supply must match demand each instant","Done in tanks","Solved by batteries today"],answer:1},
  {lvl:2,topic:"POWER-FUND",q:"Power (W) =",options:["V × I","V + I","V / I","V − I"],answer:0},
  {lvl:3,topic:"POWER-FUND",q:"Why use AC for grid?",options:["Faster electrons","Transformers easily step AC voltage","AC is safer","DC was banned"],answer:1},
  {lvl:1,topic:"GAS-FUND",q:"Natural gas is mostly:",options:["Helium","Methane (CH₄)","Hydrogen","Steam"],answer:1},
  {lvl:2,topic:"GAS-FUND",q:"1 Dth ≈",options:["1 kWh","1 MMBtu (≈ 1 Mcf)","1 BBL","1 gallon"],answer:1},
  {lvl:2,topic:"GAS-FUND",q:"Mcf =",options:["Million cf","Thousand cf (Roman M = 1,000)","Megacubic ft","Microcubic ft"],answer:1},
  {lvl:3,topic:"GAS-FUND",q:"Pipeline gas heat content ≈",options:["100 Btu/cf","1,000 Btu/cf","10,000 Btu/cf","1 Btu/cf"],answer:1},
  {lvl:1,topic:"GAS-CHAIN",q:"How does bulk gas reach end users?",options:["Wires","Pipelines","Trucks only","Wireless"],answer:1},
  {lvl:2,topic:"GAS-CHAIN",q:"NGLs are:",options:["Just water","Ethane, propane, butane separated at processing","LNG cargoes","Crude oil"],answer:1},
  {lvl:2,topic:"GAS-CHAIN",q:"Storage with FASTEST cycling:",options:["Aquifer","Salt cavern","Depleted reservoir","LNG tank"],answer:1},
  {lvl:3,topic:"GAS-CHAIN",q:"A 'city gate' is:",options:["Building","Metering point: transmission gas → LDC","LNG terminal","Cavern"],answer:1},
  {lvl:2,topic:"POWER-GEN",q:"Most plants generate by:",options:["Spinning a magnet inside a coil","Mixing chemicals","Static","Lightning"],answer:0},
  {lvl:2,topic:"POWER-GEN",q:"NOT dispatchable:",options:["Gas peaker","Coal","Wind farm","Nuclear"],answer:2},
  {lvl:3,topic:"POWER-GEN",q:"CCGT means:",options:["Coal-Coal Gas Turbine","Combined-Cycle Gas Turbine","Capacity Cap Gas Tariff","Carbon Capture"],answer:1},
  {lvl:4,topic:"POWER-GEN",q:"US nuclear fleet capacity factor:",options:["~50%","~92-93%","~30%","~70%"],answer:1},
  {lvl:1,topic:"POWER-DELIV",q:"Long-distance bulk power:",options:["Pipelines","High-voltage transmission lines","Trains","Trucks"],answer:1},
  {lvl:2,topic:"POWER-DELIV",q:"Substations primarily contain:",options:["Generators","Transformers + switchgear","Meters","Batteries"],answer:1},
  {lvl:3,topic:"POWER-DELIV",q:"Why high voltage long-distance?",options:["Looks impressive","Lower current → much lower I²R losses","Required for AC","Federal mandate"],answer:1},
  {lvl:4,topic:"POWER-DELIV",q:"Three principal US AC interconnections:",options:["Just one","Eastern, Western, ERCOT","N/S/Central","PJM/MISO/SPP"],answer:1},
  {lvl:3,topic:"UTIL",q:"FERC regulates:",options:["Retail rates","Interstate wholesale gas and power","City taxes","OSHA"],answer:1},
  {lvl:3,topic:"UTIL",q:"An LDC is:",options:["Long-Duration Contract","Local Distribution Company","Light DC","Limited Demand Charge"],answer:1},
  {lvl:3,topic:"UTIL",q:"Vertically integrated =",options:["Only delivers","Only generates","Generates + delivers + bills as one regulated entity","Only retails"],answer:2},
  {lvl:4,topic:"UTIL",q:"Cost-of-service ratemaking:",options:["Stock price","Costs + depreciation + allowed return × rate base","Random","FERC index"],answer:1},
  {lvl:2,topic:"POWER-MKT",q:"'5×16' refers to:",options:["Turbine model","Peak block: 5 weekdays × 16 hours","Transformer rating","Tax code"],answer:1},
  {lvl:3,topic:"POWER-MKT",q:"Most consequential US dereg failure:",options:["TX 2021","California 2000-01","NY 2003","OH 2014"],answer:1},
  {lvl:4,topic:"POWER-MKT",q:"Energy-only ISO:",options:["PJM","MISO","ERCOT","NYISO"],answer:2},
  {lvl:5,topic:"POWER-MKT",q:"LMP = energy + losses + ___",options:["Capacity","Congestion","Carbon","Capital"],answer:1},
  {lvl:4,topic:"GAS-MKT",q:"Henry Hub is the delivery point for:",options:["NYMEX WTI","NYMEX NG futures","PJM power","ERCOT capacity"],answer:1},
  {lvl:4,topic:"GAS-MKT",q:"'Basis' (gas) =",options:["HH price","Local hub price minus HH","Storage volume","Tariff"],answer:1},
  {lvl:5,topic:"GAS-MKT",q:"Gas storage withdrawal season:",options:["Apr-Oct","Nov-Mar","Year-round","Dec only"],answer:1},
  {lvl:5,topic:"GAS-MKT",q:"JKM benchmarks LNG for:",options:["Gulf","NW Europe","NE Asia","Brazil"],answer:2},
  {lvl:5,topic:"DERIV",q:"Spark spread = power minus:",options:["Coal price","Heat rate × gas price (plus VOM)","Capacity payment","T&D charge"],answer:1},
  {lvl:5,topic:"DERIV",q:"Heat rate (Btu/kWh):",options:["Plant size","Fuel input per electric output","Boiler temp","Stack height"],answer:1},
  {lvl:5,topic:"DERIV",q:"Backwardation in NG futures:",options:["Front < back","Front > later months","Random","Capacity"],answer:1},
  {lvl:6,topic:"DERIV",q:"Margrabe / Kirk prices:",options:["Vanilla calls","Spread options (spark/dark)","Bonds","FX"],answer:1},
  {lvl:5,topic:"RISK",q:"VaR at 95%, 1-day:",options:["Always positive","Loss threshold not exceeded with 95% prob over 1-day","Max profit","Capital req"],answer:1},
  {lvl:6,topic:"RISK",q:"CVaR =",options:["VaR + 1","Average loss given loss > VaR","Always lower than VaR","Random"],answer:1},
  {lvl:6,topic:"RISK",q:"Extrinsic storage value:",options:["Subsidies","Optionality / re-optimization right","Tax credits","Cushion gas"],answer:1},
  {lvl:6,topic:"RISK",q:"Wrong-way risk:",options:["Random","Counterparty exposure rises as their credit deteriorates","FX-only","Right-side gain"],answer:1},
  {lvl:4,topic:"DEAL",q:"PPA stands for:",options:["Power Producer Allowance","Power Purchase Agreement","Public Pipeline Authority","Pre-Pay Adjustment"],answer:1},
  {lvl:4,topic:"DEAL",q:"FT vs IT:",options:["Same","FT non-curtailable, daily reservation; IT cheaper, curtailed first","FT cheaper","IT for liquids"],answer:1},
  {lvl:5,topic:"DEAL",q:"In tolling, the toller bears:",options:["Plant capex","Spark spread / heat rate exposure","Property taxes","Insurance only"],answer:1},
  {lvl:6,topic:"DEAL",q:"A 'swing' option in gas:",options:["Fixed daily volume only","Vary daily takes within min/max; subject to MAQ","Refuse delivery","Free transport"],answer:1},
];

const defaultProgress = { placed:false, level:1, completed:{}, triviaHigh:0, totalAnswered:0, totalCorrect:0, timeSpentSeconds:0 };

// ── UI ATOMS ──
const Pill = ({ children, color="lime" }) => {
  const c = {lime:"border-lime-500 text-lime-400",amber:"border-amber-500 text-amber-400",cyan:"border-cyan-500 text-cyan-400",fuchsia:"border-fuchsia-500 text-fuchsia-400",rose:"border-rose-500 text-rose-400",zinc:"border-zinc-600 text-zinc-400"};
  return <span className={`inline-block px-1.5 py-0.5 border font-mono text-[10px] uppercase tracking-wider ${c[color]||c.zinc}`}>{children}</span>;
};
const Btn = ({ children, onClick, variant="primary", className="", disabled=false }) => {
  const v = {primary:"bg-lime-400 text-black border-lime-400 hover:bg-lime-300",ghost:"border-zinc-700 text-zinc-300 hover:border-lime-500 hover:text-lime-400",danger:"border-rose-700 text-rose-400 hover:border-rose-500"};
  return <button onClick={onClick} disabled={disabled} className={`px-3 py-1.5 border font-mono text-xs uppercase tracking-wider transition-colors ${disabled?"opacity-30 cursor-not-allowed":"cursor-pointer"} ${v[variant]} ${className}`}>{children}</button>;
};
const Panel = ({ title, accent="lime", children, className="" }) => {
  const a = {lime:"border-lime-700",amber:"border-amber-700",cyan:"border-cyan-700",fuchsia:"border-fuchsia-700",rose:"border-rose-700",zinc:"border-zinc-700"};
  const t = {lime:"text-lime-400",amber:"text-amber-400",cyan:"text-cyan-400",fuchsia:"text-fuchsia-400",rose:"text-rose-400",zinc:"text-zinc-400"};
  return (
    <div className={`border ${a[accent]||a.zinc} bg-zinc-950/60 p-4 ${className}`}>
      {title && <div className={`font-mono text-[10px] uppercase tracking-[0.2em] mb-3 ${t[accent]||t.zinc}`}>▸ {title}</div>}
      {children}
    </div>
  );
};

function fmtTime(s) {
  if (!s) return "0m";
  const h = Math.floor(s/3600), m = Math.floor((s%3600)/60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

// ── LANDING PAGE ──
function LandingPage({ onLogin }) {
  return (
    <div className="min-h-screen bg-black text-zinc-100" style={{backgroundImage:"radial-gradient(circle at 20% 30%, rgba(132,204,22,0.04), transparent 50%), radial-gradient(circle at 80% 70%, rgba(245,158,11,0.04), transparent 50%)"}}>
      <header className="border-b border-zinc-800 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Zap size={18} className="text-lime-400"/><Flame size={18} className="text-amber-400"/>
          <span className="font-mono text-sm tracking-wider text-zinc-100">NGPX//ACADEMY</span>
          <Pill color="zinc">v3</Pill>
        </div>
        <Btn onClick={onLogin} variant="primary">▸ LOGIN</Btn>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="font-mono text-xs text-lime-400 uppercase tracking-[0.3em] mb-4">US Power & Natural Gas</div>
          <h1 className="font-mono text-4xl font-bold text-zinc-100 mb-4 leading-tight">NGPX//ACADEMY</h1>
          <p className="font-mono text-zinc-400 text-sm max-w-xl mx-auto leading-relaxed">Professional training curriculum for energy traders, analysts, and practitioners — from fundamentals through graduate-level quant methods.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {[["34","Modules"],["150+","Questions"],["11","Topic Areas"],["6","Difficulty Tiers"]].map(([n,l])=>(
            <div key={l} className="border border-zinc-800 bg-zinc-950/60 p-4 text-center font-mono">
              <div className="text-2xl font-bold text-lime-400">{n}</div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">{l}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {Object.entries(CURRICULUM).map(([lvl,data])=>(
            <div key={lvl} className="border border-zinc-800 bg-zinc-950/60 p-4 font-mono">
              <div className="flex justify-between items-start mb-2">
                <Pill color={["lime","lime","amber","amber","cyan","fuchsia"][parseInt(lvl)-1]||"zinc"}>{data.tag}</Pill>
                <span className="text-[10px] text-zinc-600">{data.grade}</span>
              </div>
              <div className="text-zinc-100 text-sm font-bold mb-1">{data.name}</div>
              <div className="text-[10px] text-zinc-500">{data.modules.length} modules · {data.modules.flatMap(m=>m.questions).length} questions</div>
            </div>
          ))}
        </div>

        <div className="border border-zinc-800 bg-zinc-950/60 p-8 text-center font-mono">
          <div className="text-zinc-400 text-sm mb-2">Access is by invitation only.</div>
          <div className="text-zinc-500 text-xs mb-6">Already have an account? Log in to resume your progress.</div>
          <Btn onClick={onLogin} variant="primary" className="text-sm px-6 py-2">▸ LOGIN TO YOUR ACCOUNT</Btn>
          <div className="mt-4 text-[10px] text-zinc-600">No account? Contact your administrator to request access.</div>
        </div>
      </main>

      <footer className="border-t border-zinc-900 px-6 py-4 font-mono text-xs text-zinc-600 text-center">
        NGPX//ACADEMY · Invite-only · Not financial advice
      </footer>
    </div>
  );
}

// ── LOGIN PAGE ──
function LoginPage({ onBack, onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const login = async () => {
    if (!email || !password) { setError("Email and password required."); return; }
    setLoading(true); setError("");
    const { error: e } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (e) setError(e.message);
    else onSuccess();
  };

  const sendReset = async () => {
    if (!email) { setError("Enter your email first."); return; }
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
    setLoading(false); setResetSent(true);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4" style={{backgroundImage:"radial-gradient(circle at 50% 40%, rgba(132,204,22,0.04), transparent 60%)"}}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Zap size={20} className="text-lime-400"/><Flame size={20} className="text-amber-400"/>
          </div>
          <div className="font-mono text-lg tracking-wider text-zinc-100">NGPX//ACADEMY</div>
          <div className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest mt-1">Secure Access</div>
        </div>

        <Panel accent="lime">
          {!showReset ? (
            <div className="space-y-3 font-mono">
              <div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Email</div>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 px-3 py-2 text-xs font-mono focus:border-lime-500 outline-none"
                  placeholder="your@email.com" onKeyDown={e=>e.key==="Enter"&&login()}/>
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Password</div>
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 px-3 py-2 text-xs font-mono focus:border-lime-500 outline-none"
                  placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&login()}/>
              </div>
              {error && <div className="text-rose-400 text-xs">{error}</div>}
              <Btn onClick={login} variant="primary" disabled={loading} className="w-full justify-center">
                {loading ? "LOGGING IN..." : "▸ LOGIN"}
              </Btn>
              <button onClick={()=>setShowReset(true)} className="text-[10px] text-zinc-500 hover:text-zinc-300 font-mono uppercase tracking-wider w-full text-center mt-2">
                Forgot password?
              </button>
            </div>
          ) : (
            <div className="space-y-3 font-mono">
              <div className="text-xs text-zinc-400">Enter your email to receive a reset link.</div>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 px-3 py-2 text-xs font-mono focus:border-lime-500 outline-none"
                placeholder="your@email.com"/>
              {resetSent ? <div className="text-lime-400 text-xs">▸ Reset link sent — check your email.</div> : null}
              {error && <div className="text-rose-400 text-xs">{error}</div>}
              <Btn onClick={sendReset} disabled={loading||resetSent} className="w-full justify-center">
                {loading ? "SENDING..." : "SEND RESET LINK"}
              </Btn>
              <button onClick={()=>{setShowReset(false);setResetSent(false);setError("");}} className="text-[10px] text-zinc-500 hover:text-zinc-300 font-mono uppercase tracking-wider w-full text-center">
                ← Back to login
              </button>
            </div>
          )}
        </Panel>

        <div className="text-center mt-4">
          <button onClick={onBack} className="font-mono text-[10px] text-zinc-600 hover:text-zinc-400 uppercase tracking-wider flex items-center gap-1 mx-auto">
            <ArrowLeft size={10}/> Back to home
          </button>
        </div>
        <div className="text-center mt-3 font-mono text-[10px] text-zinc-700">No account? Contact your administrator.</div>
      </div>
    </div>
  );
}

// ── ADMIN DASHBOARD ──
function AdminDashboard({ user, onSignOut, onViewAsStudent }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("progress").select("*").order("updated_at", { ascending: false });
    if (!error && data) setUsers(data);
    setLoading(false);
  };

  const pctColor = p => p >= 80 ? "text-lime-400" : p >= 50 ? "text-amber-400" : "text-rose-400";

  const totalModules = Object.values(CURRICULUM).reduce((s,l)=>s+l.modules.length,0);

  return (
    <div className="min-h-screen bg-black text-zinc-100" style={{backgroundImage:"radial-gradient(circle at 20% 30%, rgba(132,204,22,0.04), transparent 50%)"}}>
      <header className="border-b border-zinc-800 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Zap size={16} className="text-lime-400"/><Flame size={16} className="text-amber-400"/>
          <span className="font-mono text-sm tracking-wider">NGPX//ACADEMY</span>
          <Pill color="fuchsia">ADMIN</Pill>
        </div>
   <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-zinc-400">Younes Essoulami</span>
          <button onClick={onViewAsStudent} className="font-mono text-[10px] text-zinc-500 hover:text-lime-400 uppercase tracking-wider flex items-center gap-1">
            ▸ Student View
          </button>
    
          <button onClick={onSignOut} className="font-mono text-[10px] text-zinc-500 hover:text-rose-400 uppercase tracking-wider flex items-center gap-1">
            <LogOut size={11}/> out
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Panel title="TOTAL USERS" accent="fuchsia">
            <div className="font-mono text-2xl font-bold text-fuchsia-400">{users.length}</div>
            <div className="text-[10px] text-zinc-500">registered</div>
          </Panel>
          <Panel title="AVG LEVEL" accent="amber">
            <div className="font-mono text-2xl font-bold text-amber-400">
              {users.length ? (users.reduce((s,u)=>s+(u.level||1),0)/users.length).toFixed(1) : "—"}
            </div>
            <div className="text-[10px] text-zinc-500">across all users</div>
          </Panel>
          <Panel title="AVG ACCURACY" accent="cyan">
            <div className="font-mono text-2xl font-bold text-cyan-400">
              {users.length ? Math.round(users.filter(u=>u.total_answered>0).reduce((s,u)=>s+((u.total_correct||0)/(u.total_answered||1)*100),0)/(users.filter(u=>u.total_answered>0).length||1)) : 0}%
            </div>
            <div className="text-[10px] text-zinc-500">correct answers</div>
          </Panel>
          <Panel title="TOTAL TIME" accent="lime">
            <div className="font-mono text-2xl font-bold text-lime-400">
              {fmtTime(users.reduce((s,u)=>s+(u.time_spent_seconds||0),0))}
            </div>
            <div className="text-[10px] text-zinc-500">combined study time</div>
          </Panel>
        </div>

        <Panel title={`USER PROGRESS // ${users.length} ACCOUNTS`} accent="fuchsia">
          {loading ? (
            <div className="font-mono text-xs text-zinc-500 animate-pulse">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="font-mono text-xs text-zinc-500">No users yet. Invite users from the Supabase dashboard.</div>
          ) : (
            <div className="font-mono text-xs overflow-x-auto">
              <div className="grid grid-cols-12 gap-2 px-2 py-1 border-b border-zinc-800 text-zinc-500 uppercase tracking-wider min-w-[700px]">
                <div className="col-span-3">User</div>
                <div className="col-span-1 text-center">Level</div>
                <div className="col-span-2 text-center">Modules</div>
                <div className="col-span-2 text-center">Accuracy</div>
                <div className="col-span-2 text-center">Time</div>
                <div className="col-span-2 text-center">Last seen</div>
              </div>
              {users.map(u => {
                const completedCount = Object.keys(u.completed_modules||{}).length;
                const acc = u.total_answered > 0 ? Math.round((u.total_correct/u.total_answered)*100) : 0;
                const lastSeen = u.updated_at ? new Date(u.updated_at).toLocaleDateString() : "—";
                return (
                  <div key={u.id} onClick={()=>setSelected(selected?.id===u.id?null:u)}
                    className="grid grid-cols-12 gap-2 px-2 py-2 border-b border-zinc-900 hover:bg-zinc-900/50 cursor-pointer min-w-[700px]">
                    <div className="col-span-3">
                      <div className="text-zinc-100">{u.full_name||"—"}</div>
                      <div className="text-[10px] text-zinc-600">{u.email||""}</div>
                    </div>
                    <div className="col-span-1 text-center">
                      <span className="text-amber-400 font-bold">L{u.level||1}</span>
                    </div>
                    <div className="col-span-2 text-center text-zinc-300">{completedCount}/{totalModules}</div>
                    <div className={`col-span-2 text-center font-bold ${pctColor(acc)}`}>{acc}%</div>
                    <div className="col-span-2 text-center text-zinc-400">{fmtTime(u.time_spent_seconds||0)}</div>
                    <div className="col-span-2 text-center text-zinc-500">{lastSeen}</div>
                  </div>
                );
              })}
            </div>
          )}
        </Panel>

        {selected && (
          <Panel title={`USER DETAIL // ${selected.full_name||selected.email}`} accent="cyan">
            <div className="font-mono text-xs space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  ["Level", `L${selected.level||1} — ${CURRICULUM[selected.level||1]?.name}`,"amber"],
                  ["Modules", `${Object.keys(selected.completed_modules||{}).length}/${totalModules}`,"lime"],
                  ["Accuracy", `${selected.total_answered>0?Math.round((selected.total_correct/selected.total_answered)*100):0}% (${selected.total_correct||0}/${selected.total_answered||0})`,"cyan"],
                  ["Time Spent", fmtTime(selected.time_spent_seconds||0),"fuchsia"],
                  ["Trivia High", selected.trivia_high_score||0,"fuchsia"],
                  ["Placement", selected.placed?"Complete":"Not taken","zinc"],
                ].map(([label,val,color])=>(
                  <div key={label} className="border border-zinc-800 p-3">
                    <div className="text-[10px] text-zinc-500 uppercase mb-1">{label}</div>
                    <div className={`text-sm font-bold text-${color}-400`}>{val}</div>
                  </div>
                ))}
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">Module Scores</div>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-1">
                  {Object.entries(CURRICULUM).flatMap(([,l])=>l.modules).map(m=>{
                    const score = (selected.completed_modules||{})[m.id];
                    return (
                      <div key={m.id} className={`p-2 border text-center ${score>=70?"border-lime-700 bg-lime-950/20":"border-zinc-800"}`}>
                        <div className="text-[10px] text-zinc-500">{m.id}</div>
                        <div className={`text-xs font-bold ${score>=70?"text-lime-400":score?"text-amber-400":"text-zinc-600"}`}>
                          {score!=null?`${score}%`:"—"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Panel>
        )}
      </main>
    </div>
  );
}

// ── MAIN APP (same as before but with Supabase save) ──
function MainApp({ user, progress, setProgress, onSignOut }) {
  const [view, setView] = useState(progress.placed ? "dashboard" : "welcome");
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [placementScore, setPlacementScore] = useState(0);
  const [placementByLevel, setPlacementByLevel] = useState({});
  const [placementByTopic, setPlacementByTopic] = useState({});
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const interval = setInterval(async () => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      startTimeRef.current = Date.now();
      const updated = { ...progress, timeSpentSeconds: (progress.timeSpentSeconds||0) + elapsed };
      setProgress(updated);
      await saveProgress(updated);
    }, 30000);
    return () => clearInterval(interval);
  }, [progress]);

  const saveProgress = async (p) => {
    await supabase.from("progress").upsert({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.email,
      level: p.level,
      placed: p.placed,
      completed_modules: p.completed,
      trivia_high_score: p.triviaHigh,
      total_answered: p.totalAnswered,
      total_correct: p.totalCorrect,
      time_spent_seconds: p.timeSpentSeconds||0,
      updated_at: new Date().toISOString(),
    }, { onConflict: "id" });
  };

  const persist = async (p) => { setProgress(p); await saveProgress(p); };

  const handlePlacementComplete = async (level, score, byLevel, byTopic) => {
    setPlacementScore(score); setPlacementByLevel(byLevel||{}); setPlacementByTopic(byTopic||{});
    const updated = { ...progress, placed: true, level };
    await persist(updated); setView("placement-result");
  };

  const handleModuleComplete = async (id, pct, total, correct) => {
    const nc = { ...progress.completed, [id]: pct };
    let nl = progress.level;
    const cm = CURRICULUM[progress.level].modules.map(m=>m.id);
    if (cm.every(mid=>(nc[mid]||0)>=70) && progress.level < 6) nl = progress.level + 1;
    await persist({ ...progress, level:nl, completed:nc, totalAnswered:progress.totalAnswered+total, totalCorrect:progress.totalCorrect+correct });
  };

  const handleViewChange = (v) => {
    if (typeof v==="object"&&v.type==="module") { setActiveModuleId(v.id); setView("module"); }
    else setView(v);
  };

  const fullName = user.user_metadata?.full_name || user.email;

  return (
    <div className="min-h-screen bg-black text-zinc-100" style={{backgroundImage:"radial-gradient(circle at 20% 30%, rgba(132,204,22,0.04), transparent 50%), radial-gradient(circle at 80% 70%, rgba(245,158,11,0.04), transparent 50%)"}}>
      <header className="border-b border-zinc-800 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Zap size={16} className="text-lime-400"/><Flame size={16} className="text-amber-400"/>
          <span className="font-mono text-sm tracking-wider text-zinc-100">NGPX//ACADEMY</span>
          <Pill color="zinc">v3</Pill>
        </div>
        <div className="flex items-center gap-2">
          {progress.placed && <Pill color={progress.level>=5?"lime":"amber"}>L{progress.level} · {CURRICULUM[progress.level].name}</Pill>}
          <span className="font-mono text-[10px] text-zinc-500 hidden md:inline">{fullName}</span>
          <button onClick={onSignOut} className="font-mono text-[10px] text-zinc-500 hover:text-rose-400 uppercase tracking-wider flex items-center gap-1">
            <LogOut size={11}/> out
          </button>
        </div>
      </header>
      <main className="py-4">
        {view==="welcome" && <WelcomeScreen onStart={()=>setView("placement")}/>}
        {view==="placement" && <Placement onComplete={handlePlacementComplete}/>}
        {view==="placement-result" && <PlacementResult score={placementScore} level={progress.level} byLevel={placementByLevel} byTopic={placementByTopic} onContinue={()=>setView("dashboard")}/>}
        {view==="dashboard" && <Dashboard state={progress} onView={handleViewChange}/>}
        {view==="module" && activeModuleId && <ModuleView moduleId={activeModuleId} state={progress} onComplete={handleModuleComplete} onBack={()=>setView("dashboard")}/>}
        {view==="trivia" && <TriviaMode state={progress} onUpdateHigh={async s=>{ const u={...progress,triviaHigh:s}; await persist(u); }} onBack={()=>setView("dashboard")}/>}
        {view==="cards" && <FlashcardMode state={progress} onBack={()=>setView("dashboard")}/>}
      </main>
      <footer className="border-t border-zinc-900 px-4 py-3 font-mono text-xs text-zinc-600 text-center">
        NGPX//ACADEMY · Educational use only · Not financial advice
      </footer>
    </div>
  );
}

// ── WELCOME ──
function WelcomeScreen({ onStart }) {
  const total = Object.values(CURRICULUM).flatMap(l=>l.modules.flatMap(m=>m.questions)).length;
  return (
    <div className="max-w-2xl mx-auto p-4">
      <Panel title="WELCOME // NGPX ACADEMY" accent="lime">
        <div className="font-mono text-zinc-300 text-sm leading-relaxed space-y-3">
          <p>US Power & Natural Gas trading curriculum — 6 tiers from Foundations through Graduate.</p>
          <div className="grid grid-cols-2 gap-2 my-4">
            <div className="border border-zinc-800 p-2 text-xs"><span className="text-lime-400">▸</span> 34 modules</div>
            <div className="border border-zinc-800 p-2 text-xs"><span className="text-amber-400">▸</span> {total} questions</div>
            <div className="border border-zinc-800 p-2 text-xs"><span className="text-cyan-400">▸</span> 11 topic areas</div>
            <div className="border border-zinc-800 p-2 text-xs"><span className="text-fuchsia-400">▸</span> 44q placement</div>
          </div>
          <p>Take the placement test to be tiered, then work modules + trivia + flashcards to reach L5.</p>
        </div>
        <div className="mt-6"><Btn onClick={onStart} variant="primary">▸ BEGIN PLACEMENT</Btn></div>
      </Panel>
    </div>
  );
}

// ── PLACEMENT ──
function Placement({ onComplete }) {
  const [idx, setIdx] = useState(0);
  const [picks, setPicks] = useState([]);
  const [selected, setSelected] = useState(null);
  const q = PLACEMENT[idx];

  const submit = () => {
    if (selected===null) return;
    const next = [...picks, {lvl:q.lvl, topic:q.topic, correct:selected===q.answer}];
    if (idx===PLACEMENT.length-1) {
      const byLevel={}, byTopic={};
      next.forEach(p=>{
        if(!byLevel[p.lvl]) byLevel[p.lvl]={c:0,t:0}; byLevel[p.lvl].t++; if(p.correct) byLevel[p.lvl].c++;
        if(!byTopic[p.topic]) byTopic[p.topic]={c:0,t:0}; byTopic[p.topic].t++; if(p.correct) byTopic[p.topic].c++;
      });
      let starting=1;
      for(let L=6;L>=1;L--){ if(byLevel[L]&&byLevel[L].c/byLevel[L].t>=0.5){starting=Math.max(1,L-1);break;} }
      onComplete(starting, next.filter(p=>p.correct).length, byLevel, byTopic);
    } else { setPicks(next); setSelected(null); setIdx(idx+1); }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Panel title={`PLACEMENT // ${idx+1} / ${PLACEMENT.length}`} accent="amber">
        <div className="font-mono space-y-4">
          <div className="h-1 bg-zinc-900"><div className="h-full bg-amber-400 transition-all" style={{width:`${((idx+1)/PLACEMENT.length)*100}%`}}/></div>
          <div className="text-xs text-zinc-500 flex justify-between">
            <span>L{q.lvl} · {q.topic}</span><span>NO HINTS // NO BACKTRACK</span>
          </div>
          <div className="text-zinc-100 text-sm">{q.q}</div>
          <div className="space-y-2">
            {q.options.map((o,i)=>(
              <button key={i} onClick={()=>setSelected(i)} className={`block w-full text-left p-2.5 border font-mono text-xs ${selected===i?"border-amber-400 bg-amber-400/10 text-amber-100":"border-zinc-800 text-zinc-300 hover:border-amber-700"}`}>
                <span className="text-zinc-500 mr-2">[{String.fromCharCode(65+i)}]</span>{o}
              </button>
            ))}
          </div>
          <div className="pt-2 flex justify-end">
            <Btn onClick={submit} variant="primary" disabled={selected===null}>{idx===PLACEMENT.length-1?"FINISH":"NEXT"} <ChevronRight size={12} className="inline"/></Btn>
          </div>
        </div>
      </Panel>
    </div>
  );
}

// ── PLACEMENT RESULT ──
function PlacementResult({ score, level, byLevel, byTopic, onContinue }) {
  const topicRows = Object.entries(byTopic||{}).map(([t,v])=>({topic:t,c:v.c,t_:v.t,pct:Math.round((v.c/v.t)*100)})).sort((a,b)=>a.pct-b.pct);
  const weakest = topicRows.slice(0,3).filter(r=>r.pct<100);
  const pctColor = p => p>=80?"text-lime-400":p>=50?"text-amber-400":"text-rose-400";
  const barColor = p => p>=80?"bg-lime-400":p>=50?"bg-amber-400":"bg-rose-400";
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <Panel title="ASSESSMENT COMPLETE" accent="lime">
        <div className="font-mono grid grid-cols-3 gap-4">
          <div><div className="text-xs text-zinc-500 mb-1">SCORE</div><div className="text-3xl text-lime-400 font-bold">{score}<span className="text-zinc-600 text-xl">/{PLACEMENT.length}</span></div></div>
          <div><div className="text-xs text-zinc-500 mb-1">PLACEMENT</div><div className="text-2xl text-amber-400 font-bold">L{level}</div><div className="text-xs text-zinc-400">{CURRICULUM[level].name}</div></div>
          <div><div className="text-xs text-zinc-500 mb-1">PATH TO L5</div><div className="text-2xl text-cyan-400 font-bold">{level>=5?"AT TARGET":`+${5-level}`}</div></div>
        </div>
      </Panel>
      <Panel title="TOPIC BREAKDOWN" accent="cyan">
        <div className="font-mono text-xs">
          {topicRows.map(r=>(
            <div key={r.topic} className="grid grid-cols-12 gap-2 px-2 py-1.5 border-b border-zinc-900">
              <div className="col-span-6"><div className="text-zinc-100">{TOPIC_LABELS[r.topic]||r.topic}</div></div>
              <div className="col-span-2 text-right tabular-nums text-zinc-300">{r.c}/{r.t_}</div>
              <div className={`col-span-1 text-right tabular-nums font-bold ${pctColor(r.pct)}`}>{r.pct}%</div>
              <div className="col-span-3 flex items-center"><div className="h-1.5 w-full bg-zinc-900"><div className={`h-full ${barColor(r.pct)}`} style={{width:`${r.pct}%`}}/></div></div>
            </div>
          ))}
        </div>
      </Panel>
      {weakest.length>0&&<Panel title="FOCUS AREAS" accent="rose"><div className="font-mono text-xs space-y-1">{weakest.map(r=><div key={r.topic} className="text-zinc-300">• {TOPIC_LABELS[r.topic]} — <span className={pctColor(r.pct)}>{r.pct}%</span></div>)}</div></Panel>}
      <div className="text-center pt-2"><Btn onClick={onContinue}>OPEN DASHBOARD <ChevronRight size={12} className="inline"/></Btn></div>
    </div>
  );
}

// ── DASHBOARD ──
function Dashboard({ state, onView }) {
  const completed = Object.keys(state.completed).length;
  const total = Object.values(CURRICULUM).reduce((s,l)=>s+l.modules.length,0);
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Panel title="LEVEL" accent="amber"><div className="font-mono"><div className="text-2xl font-bold text-amber-400">L{state.level}</div><div className="text-[10px] text-zinc-500 uppercase">{CURRICULUM[state.level].name}</div></div></Panel>
        <Panel title="PROGRESS" accent="lime"><div className="font-mono"><div className="text-2xl font-bold text-lime-400">{completed}<span className="text-zinc-600 text-base">/{total}</span></div><div className="text-[10px] text-zinc-500 uppercase">modules cleared</div></div></Panel>
        <Panel title="ACCURACY" accent="cyan"><div className="font-mono"><div className="text-2xl font-bold text-cyan-400">{state.totalAnswered?Math.round((state.totalCorrect/state.totalAnswered)*100):0}%</div><div className="text-[10px] text-zinc-500 uppercase">{state.totalCorrect}/{state.totalAnswered}</div></div></Panel>
        <Panel title="TIME SPENT" accent="fuchsia"><div className="font-mono"><div className="text-2xl font-bold text-fuchsia-400">{fmtTime(state.timeSpentSeconds||0)}</div><div className="text-[10px] text-zinc-500 uppercase">study time</div></div></Panel>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        <button onClick={()=>onView("trivia")} className="border border-fuchsia-700 hover:border-fuchsia-500 bg-zinc-950/60 p-3 font-mono text-xs uppercase tracking-wider text-fuchsia-400 flex items-center justify-center gap-2"><Trophy size={14}/> Trivia</button>
        <button onClick={()=>onView("cards")} className="border border-cyan-700 hover:border-cyan-500 bg-zinc-950/60 p-3 font-mono text-xs uppercase tracking-wider text-cyan-400 flex items-center justify-center gap-2"><Shuffle size={14}/> Flashcards</button>
        <button disabled className="border border-zinc-800 bg-zinc-950/30 p-3 font-mono text-xs uppercase tracking-wider text-zinc-600 flex items-center justify-center gap-2 cursor-not-allowed"><Target size={14}/> Goal: L5</button>
      </div>
      {Object.entries(CURRICULUM).map(([lvl,data])=>{
        const L=parseInt(lvl), locked=L>state.level;
        return (
          <Panel key={lvl} title={`${data.tag} // ${data.name} · ${data.grade}`} accent={locked?"rose":L===state.level?"amber":"lime"}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {data.modules.map(m=>{
                const score=state.completed[m.id], passed=score&&score>=70, t=MODULE_TOPIC[m.id];
                return (
                  <button key={m.id} onClick={()=>!locked&&onView({type:"module",id:m.id})} disabled={locked}
                    className={`text-left p-3 border font-mono text-xs ${locked?"border-zinc-900 text-zinc-700 cursor-not-allowed bg-zinc-950/30":passed?"border-lime-700 bg-lime-950/20 text-lime-300":"border-zinc-800 hover:border-amber-600 text-zinc-300"}`}>
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] text-zinc-500">{m.id}</span>
                      <div className="flex gap-1 items-center">{t&&<Pill color="zinc">{t}</Pill>}{passed&&<Check size={11} className="text-lime-400"/>}{locked&&<span className="text-rose-500 text-[10px]">LOCKED</span>}</div>
                    </div>
                    <div className="text-zinc-100 text-xs">{m.title}</div>
                    {score!==undefined&&<div className="text-[10px] text-zinc-500 mt-1">last: {score}%</div>}
                  </button>
                );
              })}
            </div>
          </Panel>
        );
      })}
    </div>
  );
}

// ── MODULE VIEW ──
function ModuleView({ moduleId, state, onComplete, onBack }) {
  const [phase, setPhase] = useState("lesson");
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const mod = useMemo(()=>{ for(const lvl of Object.values(CURRICULUM)){ const m=lvl.modules.find(x=>x.id===moduleId); if(m) return m; } return null; },[moduleId]);
  if(!mod) return <div className="p-4 font-mono text-rose-400">Module not found.</div>;
  const submit=()=>{ if(selected===null) return; setShowAnswer(true); setAnswers([...answers,selected===mod.questions[qIdx].answer]); };
  const next=()=>{
    if(qIdx===mod.questions.length-1){ const c=answers.filter(a=>a).length; const pct=Math.round((c/mod.questions.length)*100); onComplete(mod.id,pct,mod.questions.length,c); setPhase("done"); }
    else { setQIdx(qIdx+1); setSelected(null); setShowAnswer(false); }
  };
  if(phase==="lesson") return (
    <div className="max-w-2xl mx-auto p-4 space-y-3">
      <button onClick={onBack} className="font-mono text-xs text-zinc-500 hover:text-lime-400 flex items-center gap-1"><ArrowLeft size={12}/> BACK</button>
      <Panel title={`${mod.id} // ${mod.title}`} accent="cyan"><div className="font-mono text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">{mod.lesson}</div></Panel>
      <Btn onClick={()=>setPhase("quiz")}>BEGIN QUIZ ({mod.questions.length} Qs) <ChevronRight size={12} className="inline"/></Btn>
    </div>
  );
  if(phase==="done"){
    const c=answers.filter(a=>a).length, pct=Math.round((c/mod.questions.length)*100), passed=pct>=70;
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Panel title="MODULE COMPLETE" accent={passed?"lime":"amber"}>
          <div className="font-mono text-center py-4">
            <div className="text-xs text-zinc-500 mb-2">SCORE</div>
            <div className={`text-5xl font-bold mb-2 ${passed?"text-lime-400":"text-amber-400"}`}>{pct}%</div>
            <div className="text-zinc-400 text-sm mb-1">{c}/{mod.questions.length} correct</div>
            <div className={`text-xs uppercase tracking-wider mt-3 ${passed?"text-lime-400":"text-amber-400"}`}>{passed?"▸ PASS — Module cleared":"▸ Need 70% to clear; retry available"}</div>
            <div className="flex gap-2 justify-center mt-6">
              <Btn onClick={onBack} variant="ghost">DASHBOARD</Btn>
              {!passed&&<Btn onClick={()=>{setPhase("lesson");setQIdx(0);setAnswers([]);setSelected(null);setShowAnswer(false);}}>RETRY</Btn>}
            </div>
          </div>
        </Panel>
      </div>
    );
  }
  const q=mod.questions[qIdx];
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-3">
      <button onClick={onBack} className="font-mono text-xs text-zinc-500 hover:text-lime-400 flex items-center gap-1"><ArrowLeft size={12}/> BACK</button>
      <Panel title={`${mod.id} QUIZ // ${qIdx+1}/${mod.questions.length}`} accent="cyan">
        <div className="font-mono space-y-3">
          <div className="h-1 bg-zinc-900"><div className="h-full bg-cyan-400 transition-all" style={{width:`${((qIdx+1)/mod.questions.length)*100}%`}}/></div>
          <div className="text-zinc-100 text-sm">{q.q}</div>
          <div className="space-y-2">
            {q.options.map((o,i)=>{
              const ic=i===q.answer, is=i===selected;
              let cls="border-zinc-800 text-zinc-300 hover:border-cyan-700";
              if(showAnswer){ if(ic) cls="border-lime-500 bg-lime-950/30 text-lime-200"; else if(is) cls="border-rose-500 bg-rose-950/30 text-rose-200"; else cls="border-zinc-900 text-zinc-600"; }
              else if(is) cls="border-cyan-400 bg-cyan-400/10 text-cyan-100";
              return (<button key={i} onClick={()=>!showAnswer&&setSelected(i)} disabled={showAnswer} className={`block w-full text-left p-2.5 border font-mono text-xs ${cls}`}><span className="text-zinc-500 mr-2">[{String.fromCharCode(65+i)}]</span>{o}{showAnswer&&ic&&<Check size={12} className="inline ml-2 text-lime-400"/>}{showAnswer&&is&&!ic&&<X size={12} className="inline ml-2 text-rose-400"/>}</button>);
            })}
          </div>
          {showAnswer&&q.explain&&<div className="border-l-2 border-cyan-700 pl-3 text-xs text-zinc-400"><span className="text-cyan-400 uppercase text-[10px]">▸ explain</span><br/>{q.explain}</div>}
          <div className="flex justify-end pt-1">
            {!showAnswer&&<Btn onClick={submit} disabled={selected===null}>SUBMIT</Btn>}
            {showAnswer&&<Btn onClick={next} variant="primary">{qIdx===mod.questions.length-1?"FINISH":"NEXT"} <ChevronRight size={12} className="inline"/></Btn>}
          </div>
        </div>
      </Panel>
    </div>
  );
}

// ── TRIVIA ──
function TriviaMode({ state, onUpdateHigh, onBack }) {
  const ALL_Q = useMemo(()=>Object.entries(CURRICULUM).flatMap(([lvl,data])=>data.modules.flatMap(m=>m.questions.map(q=>({...q,level:parseInt(lvl),topic:MODULE_TOPIC[m.id]||"POWER-FUND"})))),[]);
  const [phase, setPhase] = useState("ready");
  const [pool, setPool] = useState([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const tickRef = useRef(null);

  const start=()=>{
    const filtered=ALL_Q.filter(q=>q.level<=Math.min(state.level+1,6));
    setPool([...filtered].sort(()=>Math.random()-0.5).slice(0,Math.min(15,filtered.length)));
    setIdx(0);setScore(0);setStreak(0);setBestStreak(0);setSelected(null);setShowAnswer(false);setTimeLeft(15);setPhase("playing");
  };

  useEffect(()=>{
    if(phase!=="playing"||showAnswer) return;
    tickRef.current=setInterval(()=>{ setTimeLeft(t=>{ if(t<=1){clearInterval(tickRef.current);setShowAnswer(true);setStreak(0);return 0;} return t-1; }); },1000);
    return()=>clearInterval(tickRef.current);
  },[phase,idx,showAnswer]);

  const submit=(i)=>{
    if(showAnswer) return; setSelected(i); setShowAnswer(true); clearInterval(tickRef.current);
    if(i===pool[idx].answer){ const pts=100+(timeLeft*10)+(streak*25); setScore(s=>s+pts); const ns=streak+1; setStreak(ns); setBestStreak(b=>Math.max(b,ns)); } else setStreak(0);
  };
  const next=()=>{
    if(idx===pool.length-1){ setPhase("done"); if(score>state.triviaHigh) onUpdateHigh(score); }
    else { setIdx(idx+1);setSelected(null);setShowAnswer(false);setTimeLeft(15); }
  };

  if(phase==="ready") return (
    <div className="max-w-2xl mx-auto p-4">
      <button onClick={onBack} className="font-mono text-xs text-zinc-500 hover:text-lime-400 flex items-center gap-1 mb-3"><ArrowLeft size={12}/> BACK</button>
      <Panel title="TRIVIA MODE" accent="fuchsia">
        <div className="font-mono text-zinc-300 text-sm space-y-2 mb-4">
          <div>▸ 15 questions from your unlocked levels</div>
          <div>▸ 15 seconds per question · Score: 100 + 10/sec + 25 × streak</div>
          <div className="text-fuchsia-400">HIGH SCORE: {state.triviaHigh}</div>
        </div>
        <Btn onClick={start} variant="primary">▸ START</Btn>
      </Panel>
    </div>
  );

  if(phase==="done") return (
    <div className="max-w-2xl mx-auto p-4">
      <Panel title="TRIVIA COMPLETE" accent="fuchsia">
        <div className="font-mono text-center py-4">
          <div className="text-6xl font-bold text-fuchsia-400 mb-2">{score}</div>
          <div className="text-zinc-400 text-sm">Best Streak: {bestStreak}</div>
          {score>state.triviaHigh&&<div className="text-lime-400 text-sm mt-2">▸ NEW HIGH SCORE</div>}
          <div className="flex gap-2 justify-center mt-6"><Btn onClick={onBack} variant="ghost">DASHBOARD</Btn><Btn onClick={start}>PLAY AGAIN</Btn></div>
        </div>
      </Panel>
    </div>
  );

  const q=pool[idx];
  return (
    <div className="max-w-2xl mx-auto p-4">
      <Panel title={`TRIVIA // ${idx+1}/${pool.length}`} accent="fuchsia">
        <div className="font-mono space-y-3">
          <div className="flex justify-between text-xs"><span className="text-zinc-500">SCORE: <span className="text-fuchsia-400 font-bold">{score}</span> · STREAK: <span className="text-amber-400">{streak}</span></span><span className={`font-bold ${timeLeft<=5?"text-rose-400 animate-pulse":"text-zinc-300"}`}>⏱ {timeLeft}s</span></div>
          <div className="h-1 bg-zinc-900"><div className={`h-full transition-all ${timeLeft<=5?"bg-rose-400":"bg-fuchsia-400"}`} style={{width:`${(timeLeft/15)*100}%`}}/></div>
          <div className="text-zinc-100 text-sm">{q.q}</div>
          <div className="space-y-2">
            {q.options.map((o,i)=>{
              const ic=i===q.answer, is=i===selected;
              let cls="border-zinc-800 text-zinc-300 hover:border-fuchsia-700";
              if(showAnswer){ if(ic) cls="border-lime-500 bg-lime-950/30 text-lime-200"; else if(is) cls="border-rose-500 bg-rose-950/30 text-rose-200"; else cls="border-zinc-900 text-zinc-600"; }
              return <button key={i} onClick={()=>submit(i)} disabled={showAnswer} className={`block w-full text-left p-2.5 border font-mono text-xs ${cls}`}><span className="text-zinc-500 mr-2">[{String.fromCharCode(65+i)}]</span>{o}</button>;
            })}
          </div>
          {showAnswer&&q.explain&&<div className="border-l-2 border-fuchsia-700 pl-3 text-xs text-zinc-400">{q.explain}</div>}
          <div className="flex justify-end pt-1">{showAnswer&&<Btn onClick={next} variant="primary">{idx===pool.length-1?"FINISH":"NEXT"} <ChevronRight size={12} className="inline"/></Btn>}</div>
        </div>
      </Panel>
    </div>
  );
}

// ── FLASHCARDS ──
function FlashcardMode({ state, onBack }) {
  const cards = useMemo(()=>{
    const all=[];
    for(const [lvl,data] of Object.entries(CURRICULUM)){ if(parseInt(lvl)>Math.min(state.level+1,6)) continue; for(const m of data.modules) all.push({id:m.id,title:m.title,lesson:m.lesson}); }
    return [...all].sort(()=>Math.random()-0.5);
  },[state.level]);
  const [idx,setIdx]=useState(0);
  const [flipped,setFlipped]=useState(false);
  if(!cards.length) return <div className="p-4 font-mono text-zinc-400">No cards.</div>;
  const c=cards[idx];
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-3">
      <button onClick={onBack} className="font-mono text-xs text-zinc-500 hover:text-lime-400 flex items-center gap-1"><ArrowLeft size={12}/> BACK</button>
      <Panel title={`FLASHCARDS // ${idx+1}/${cards.length}`} accent="cyan">
        <div className="font-mono">
          <div onClick={()=>setFlipped(f=>!f)} className="min-h-[200px] border border-cyan-700 bg-zinc-950 p-6 cursor-pointer hover:border-cyan-500 transition-colors flex items-center justify-center">
            {!flipped?<div className="text-center"><div className="text-[10px] text-zinc-500 uppercase mb-3">▸ TAP TO FLIP</div><div className="text-zinc-500 text-xs mb-2">{c.id}</div><div className="text-cyan-300 text-xl font-bold">{c.title}</div></div>
            :<div className="text-zinc-300 text-sm leading-relaxed">{c.lesson}</div>}
          </div>
          <div className="flex justify-between mt-3">
            <Btn onClick={()=>{setIdx((idx-1+cards.length)%cards.length);setFlipped(false);}} variant="ghost">◀ PREV</Btn>
            <Btn onClick={()=>{setIdx((idx+1)%cards.length);setFlipped(false);}}>NEXT ▶</Btn>
          </div>
        </div>
      </Panel>
    </div>
  );
}

// ── ROOT APP ──
export default function App() {
  const [appView, setAppView] = useState("loading");
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(defaultProgress);
  const [studentView, setStudentView] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        await loadProgress(session.user);
        setAppView("app");
      } else {
        setAppView("landing");
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await loadProgress(session.user);
        setAppView("app");
      } else {
        setUser(null);
        setProgress(defaultProgress);
        setAppView("landing");
      }
    });
    return () => subscription.unsubscribe();
  }, []);

 const loadProgress = async (u) => {
    const { data } = await supabase.from("progress").select("*").eq("id", u.id).single();
    if (data) {
      setProgress({
        placed: data.placed||false,
        level: data.level||1,
        completed: data.completed_modules||{},
        triviaHigh: data.trivia_high_score||0,
        totalAnswered: data.total_answered||0,
        totalCorrect: data.total_correct||0,
        timeSpentSeconds: data.time_spent_seconds||0,
      });
    } else {
      setProgress(defaultProgress);
      await supabase.from("progress").upsert({
        id: u.id,
        email: u.email,
        full_name: u.user_metadata?.full_name || u.email,
        level: 1,
        placed: false,
        completed_modules: {},
        trivia_high_score: 0,
        total_answered: 0,
        total_correct: 0,
        time_spent_seconds: 0,
        updated_at: new Date().toISOString(),
      }, { onConflict: "id" });
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setAppView("landing");
  };

  if (appView==="loading") return (
    <div className="min-h-screen bg-black flex items-center justify-center font-mono text-sm">
      <div className="text-lime-400 animate-pulse">▸ LOADING...</div>
    </div>
  );

  if (appView==="landing") return <LandingPage onLogin={()=>setAppView("login")}/>;
  if (appView==="login") return <LoginPage onBack={()=>setAppView("landing")} onSuccess={()=>setAppView("app")}/>;

if (appView==="app" && user) {
    if (ADMIN_EMAILS.includes(user.email) && !studentView) {
      return <AdminDashboard user={user} onSignOut={signOut} onViewAsStudent={()=>setStudentView(true)}/>;
    }
    const isAdmin = ADMIN_EMAILS.includes(user.email);
    return <MainApp user={user} progress={progress} setProgress={setProgress} onSignOut={()=>{setStudentView(false);signOut();}}/>;
  }

  return null;
}

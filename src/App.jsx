import React, { useState, useEffect, useRef, useMemo } from "react";
import { Zap, Flame, ChevronRight, ArrowLeft, Check, X, Trophy, Target, Database, Shuffle, LogOut } from "lucide-react";
import { supabase } from "./supabase.js";

const ADMIN_EMAILS = ["younes.essoulami@engie.com", "narsimha.misra@engie.com"];

const TOPIC_LABELS = {
  "POWER-FUND":"Power Fundamentals","GAS-FUND":"Gas Fundamentals","GAS-CHAIN":"Gas Value Chain (Wellhead → Burner Tip)",
  "POWER-GEN":"Generation Technologies","POWER-DELIV":"Power Delivery (T&D / Grid)","UTIL":"Utilities & Regulation",
  "POWER-MKT":"Wholesale Power Markets","GAS-MKT":"Wholesale Gas Markets","DERIV":"Derivatives & Spreads",
  "RISK":"Risk & Valuation","DEAL":"Deal Structuring & Contracts",
};

const MODULE_TOPIC = {
  "1a":"POWER-FUND","1b":"GAS-FUND","1c":"GAS-CHAIN","1d":"POWER-DELIV","1e":"GAS-CHAIN","1f":"POWER-FUND",
  "2a":"POWER-GEN","2b":"UTIL","2c":"POWER-MKT","2d":"GAS-CHAIN","2e":"GAS-CHAIN","2f":"GAS-CHAIN","2g":"GAS-CHAIN","2h":"POWER-DELIV",
  "3a":"POWER-MKT","3b":"UTIL","3c":"POWER-MKT",
  "4a":"POWER-MKT","4b":"POWER-MKT","4c":"GAS-MKT","4d":"GAS-CHAIN","4e":"DEAL",
  "5a":"POWER-MKT","5b":"POWER-MKT","5c":"POWER-MKT","5d":"GAS-MKT","5e":"DERIV","5f":"POWER-MKT","5g":"DERIV","5h":"POWER-FUND",
  "6a":"RISK","6b":"DEAL","6c":"RISK","6d":"GAS-MKT","6e":"DEAL",
};

const CURRICULUM = {
  1:{name:"FOUNDATIONS",grade:"Elementary (G1-3)",tag:"L1",modules:[
    {id:"1a",title:"What is Electricity?",lesson:"Electricity = flow of electrons through a wire. Generated at a power plant, sent over high-voltage transmission lines, then through smaller distribution lines to your home. Critical rule: bulk electricity cannot be cheaply stored — it must be made the moment it's used. This drives the entire power-market design.",questions:[
      {q:"What flows through a wire to make current?",options:["Water","Electrons","Air","Photons"],answer:1,explain:"Electrons = charged particles whose motion = current."},
      {q:"Can bulk electricity be cheaply stored?",options:["Yes, in tanks","No — supply must match demand each second","Yes, underground","Only on weekends"],answer:1,explain:"THE foundational fact behind power-market design."},
      {q:"Long-distance bulk power moves on:",options:["Pipelines","High-voltage transmission lines","Trains","Trucks"],answer:1,explain:"Higher voltage = lower line losses."},
    
      {q:"Where is electricity generated before reaching your home?",options:["At your local substation", "At a power plant", "Underground", "At the distribution pole"],answer:1,explain:"Power plants are the source \u2014 generation happens there before transmission."},
      {q:"Why does bulk electricity need to be made the moment it's used?",options:["It's too expensive to store", "It loses voltage quickly", "Bulk electricity cannot be cheaply stored", "Grid rules require it"],answer:2,explain:"No cheap bulk storage = supply must match demand every second."},
      {q:"Electricity travels from power plant to home via:",options:["Pipelines then wires", "High-voltage lines then lower-voltage distribution", "Underground tanks then meters", "Radio waves then converters"],answer:1,explain:"Step-up for long haul, step-down for local delivery."},
      {q:"What fundamental fact drives all power-market design?",options:["Electricity is expensive to generate", "Power plants are far from cities", "Bulk electricity cannot be cheaply stored", "Transmission lines age quickly"],answer:2,explain:"Instant supply-demand balance requirement shapes every market rule."},
      {q:"Distribution lines carry power at:",options:["Same voltage as transmission", "Higher voltage than generation", "Lower voltage than transmission", "Zero voltage"],answer:2,explain:"Voltage steps down from transmission to distribution to service."},
      {q:"Which best describes the role of transmission lines?",options:["Store electricity for peak demand", "Carry bulk power long distances at high voltage", "Convert AC to DC for homes", "Measure customer usage"],answer:1,explain:"High-voltage transmission = long-haul backbone of the grid."},
      {q:"Electrons flowing through a wire produce:",options:["Heat only", "Magnetic fields only", "Electric current", "Radio waves"],answer:2,explain:"Current = directional flow of electrons."},
    ]},
    {id:"1b",title:"What is Natural Gas?",lesson:"Natural gas = ~90%+ methane (CH₄). Burns cleanly. Heats homes, cooks food, fuels power plants. Moves through pipelines (not wires). Unlike electricity, gas CAN be stored — in salt caverns, depleted reservoirs, and the pipelines themselves (linepack). Storability is THE structural difference between gas and power.",questions:[
      {q:"Main component of natural gas:",options:["Oxygen","Methane (CH₄)","Helium","CO₂"],answer:1,explain:"~90%+ methane; ethane/propane round it out."},
      {q:"How does bulk gas move?",options:["Wires","Pipelines","Tanker trucks only","Rail"],answer:1,explain:"~3 million miles of US gas pipeline."},
      {q:"Can natural gas be stored?",options:["Never","Yes — caverns, reservoirs, linepack","Only frozen","Only in bottles"],answer:1,explain:"Storability defines the gas-vs-power difference."},
    
      {q:"What makes natural gas different from electricity in terms of storage?",options:["Gas cannot be stored at all", "Gas CAN be stored; electricity cannot cheaply be", "Both can be stored equally", "Neither can be stored"],answer:1,explain:"Storability is THE structural difference between gas and power markets."},
      {q:"Where can natural gas be stored?",options:["Only in tanks above ground", "Salt caverns, depleted reservoirs, and pipelines (linepack)", "Only in liquid form", "It cannot be stored"],answer:1,explain:"Multiple storage types give gas markets flexibility power lacks."},
      {q:"Natural gas heats homes, cooks food, and:",options:["Generates electricity only underground", "Fuels power plants", "Replaces nuclear only", "Moves only by truck"],answer:1,explain:"Gas is multi-use \u2014 heating, cooking, and power generation."},
      {q:"What is linepack?",options:["A pipeline tariff", "Gas stored inside the pipeline itself", "A processing technique", "A storage cavern type"],answer:1,explain:"The gas physically in the pipe provides short-term flexibility."},
      {q:"Why is storability of gas commercially important?",options:["It reduces pipeline pressure", "It allows supply and demand to be separated in time", "It makes gas cheaper to produce", "It eliminates the need for pipelines"],answer:1,explain:"Storage decouples production from consumption \u2014 huge commercial value."},
      {q:"Natural gas burns:",options:["Dirtier than coal", "Cleanly relative to other fossil fuels", "Only at high pressure", "Only when liquefied"],answer:1,explain:"Cleaner combustion is a key advantage of natural gas."},
      {q:"What percentage of natural gas is approximately methane?",options:["~50%", "~70%", "~90%+", "~99.9% always"],answer:2,explain:"~90%+ methane; balance is ethane, propane, butane, trace gases."},
    ]},
    {id:"1c",title:"From Wellhead to Burner Tip",lesson:"Gas's journey: (1) WELLHEAD — drilled wells lift gas. (2) GATHERING — small pipes collect from many wells. (3) PROCESSING — clean gas, strip water/CO₂/H₂S/NGLs. (4) TRANSMISSION — long-haul high-pressure interstate pipelines. (5) DISTRIBUTION — LDCs run smaller pipes ending at your meter and BURNER TIP (stove, furnace). Memorize this 5-stage chain.",questions:[
      {q:"Five stages, in order:",options:["Well→Storage→Pipe→Plant→Burner","Wellhead→Gathering→Processing→Transmission→Distribution","Pipe→Well→Burner→Plant→Storage","Plant→Pipe→Well→LDC→Meter"],answer:1,explain:"WGPTD. Burner tip is final demand."},
      {q:"Burner tip refers to:",options:["Wellhead flame","Final end-use point — stove, furnace, industrial burner","Compressor exhaust","LNG flare"],answer:1,explain:"End of the journey — where flame begins."},
      {q:"City gate = handoff between:",options:["Well and gathering","Processing and gathering","Interstate transmission and the LDC","Two LDCs"],answer:2,explain:"Pressure step-down + custody transfer."},
    
      {q:"What happens at the GATHERING stage?",options:["Gas is liquefied", "Small pipes collect gas from many wells", "Gas is sold to end users", "Interstate pipelines deliver gas"],answer:1,explain:"Gathering = low-pressure local collection from wellheads."},
      {q:"What is removed during PROCESSING?",options:["Only methane", "Water, CO\u2082, H\u2082S, and NGLs", "Only nitrogen", "Nothing \u2014 gas goes straight to pipelines"],answer:1,explain:"Processing cleans gas to pipeline quality."},
      {q:"What do LDCs operate?",options:["Interstate pipelines", "Local distribution pipes to end customers", "Gathering systems", "Processing plants"],answer:1,explain:"LDC = Local Distribution Company \u2014 last mile to homes/businesses."},
      {q:"Interstate transmission pipelines are characterized by:",options:["Low pressure, small diameter", "High pressure, long haul", "Local distribution only", "Underground storage only"],answer:1,explain:"Transmission = high-pressure, long-distance backbone."},
      {q:"Which stage immediately follows gathering?",options:["Distribution", "Transmission", "Processing", "Burner tip"],answer:2,explain:"WGPTD \u2014 Wellhead, Gathering, Processing, Transmission, Distribution."},
      {q:"The burner tip represents:",options:["The wellhead", "The processing plant outlet", "The final end-use point", "The city gate"],answer:2,explain:"Burner tip = where gas is finally combusted by the end user."},
      {q:"What is the correct order of the gas value chain?",options:["Processing \u2192 Gathering \u2192 Transmission \u2192 Distribution", "Gathering \u2192 Wellhead \u2192 Processing \u2192 Distribution", "Wellhead \u2192 Gathering \u2192 Processing \u2192 Transmission \u2192 Distribution", "Transmission \u2192 Processing \u2192 Gathering \u2192 Distribution"],answer:2,explain:"WGPTD \u2014 the 5-stage chain every gas trader must know."},
    ]},
    {id:"1d",title:"From Power Plant to Outlet",lesson:"Power's chain: (1) GENERATION at ~13-25 kV. (2) STEP-UP transformer to 138-765 kV. (3) TRANSMISSION long-haul. (4) SUBSTATION steps voltage down. (5) DISTRIBUTION 4-35 kV along streets. (6) SERVICE pole-top transformer to 120/240 V. All in milliseconds. No storage along the way (utility batteries are still <2% of generation).",questions:[
      {q:"Why very high voltage for long-distance?",options:["Looks impressive","Lower current at same power → much lower I²R losses","Birds dislike low V","Federal mandate"],answer:1,explain:"Doubling V quarters resistive losses."},
      {q:"US residential outlet voltage:",options:["12 V","120 V","1,200 V","12,000 V"],answer:1,explain:"120 V single-phase; 240 V for big appliances."},
      {q:"Substations primarily contain:",options:["Batteries","Transformers + switchgear that step voltage and route power","Generators","Customer meters"],answer:1,explain:"Voltage transformation + protection + switching."},
    
      {q:"At what voltage is electricity typically generated at a power plant?",options:["120 V", "138-765 kV", "13-25 kV", "4-35 kV"],answer:2,explain:"Generators produce at 13-25 kV; transformers step it up for transmission."},
      {q:"What does a step-up transformer do?",options:["Reduces voltage for homes", "Increases voltage for long-distance transmission", "Stores electricity", "Converts AC to DC"],answer:1,explain:"Higher voltage = lower current = less line loss over distance."},
      {q:"Distribution lines operate at approximately:",options:["138-765 kV", "13-25 kV", "4-35 kV", "120 V"],answer:2,explain:"Distribution = 4-35 kV along streets before final step-down."},
      {q:"What percentage of generation do utility-scale batteries currently represent?",options:["<2%", "~20%", "~50%", ">75%"],answer:0,explain:"Batteries are still a tiny fraction \u2014 storage remains the grid's challenge."},
      {q:"How quickly does power travel from plant to outlet?",options:["Hours", "Minutes", "Milliseconds", "Days"],answer:2,explain:"Electromagnetic propagation is nearly instantaneous."},
      {q:"What is the voltage at a standard US residential outlet?",options:["240 V only", "12 V", "120 V (240 V for large appliances)", "480 V"],answer:2,explain:"120 V standard; 240 V split-phase for dryers, ovens, EV chargers."},
    ]},
    {id:"1e",title:"Where Natural Gas Comes From",lesson:"Three settings: CONVENTIONAL (porous rock — drill vertically). SHALE (tight rock — needs HORIZONTAL DRILLING + HYDRAULIC FRACTURING). ASSOCIATED (comes up alongside oil from oil wells). The 2008+ shale revolution made the US the world's largest gas producer. Big basins: MARCELLUS/UTICA (PA/OH/WV — biggest), PERMIAN (TX/NM — oil-driven), HAYNESVILLE (LA/TX), EAGLE FORD (TX), BAKKEN (ND).",questions:[
      {q:"Largest US gas basin:",options:["Bakken","Marcellus / Utica","Eagle Ford","Anadarko"],answer:1,explain:"Appalachian Marcellus/Utica = ~30%+ of US gas."},
      {q:"Fracking enables production from:",options:["Conventional only","Shale and tight-rock formations","Underwater wells","LNG terminals"],answer:1,explain:"Horizontal drilling + frac unlocked shale (~2008+)."},
      {q:"Permian gas is mostly:",options:["Pure gas play","Associated gas — comes up with oil; supply tracks oil drilling","Imported","From coal"],answer:1,explain:"Inelastic vs gas price — Waha hub blowouts."},
    
      {q:"What technique unlocked shale gas production after 2008?",options:["Vertical drilling only", "Horizontal drilling + hydraulic fracturing", "Deepwater drilling", "Coal gasification"],answer:1,explain:"The shale revolution: horizontal + fracking = massive supply growth."},
      {q:"Associated gas comes from:",options:["Dedicated gas wells only", "Gas produced alongside oil from oil wells", "Shale formations only", "LNG regasification"],answer:1,explain:"Associated gas supply tracks oil drilling, not gas prices \u2014 key for Permian."},
      {q:"Which basin is the largest US natural gas producer?",options:["Permian", "Haynesville", "Marcellus / Utica", "Eagle Ford"],answer:2,explain:"Marcellus/Utica in Appalachia = ~30%+ of US gas supply."},
      {q:"Conventional gas production uses:",options:["Horizontal drilling only", "Hydraulic fracturing only", "Vertical drilling into porous rock", "LNG conversion"],answer:2,explain:"Conventional = porous reservoir, vertical well, natural pressure."},
      {q:"The Permian Basin is located in:",options:["PA/OH/WV", "LA/TX", "TX/NM", "ND"],answer:2,explain:"Permian = West Texas / New Mexico \u2014 primarily an oil basin with associated gas."},
      {q:"Why is Permian gas supply relatively inelastic to gas prices?",options:["Pipelines are fixed", "It is associated gas \u2014 supply driven by oil economics", "Gas prices are regulated there", "It is all LNG"],answer:1,explain:"Producers drill for oil; gas is a byproduct \u2014 doesn't respond to gas prices."},
      {q:"The Haynesville basin is located in:",options:["PA/OH/WV", "LA/TX", "TX/NM", "ND"],answer:1,explain:"Haynesville = northwestern Louisiana / east Texas \u2014 major dry gas basin."},
    ]},
    {id:"1f",title:"Supply and Demand",lesson:"Many buyers + scarce supply → price up. Abundant supply + weak demand → price down. Power and gas prices change hourly. Hot afternoon → A/C demand → power spikes. 3 AM in spring → demand crashes, prices can go NEGATIVE (generators pay to stay on rather than incur restart costs). Cold snap in NYC → Algonquin gas can move 5x in a day.",questions:[
      {q:"Summer power-price peaks typically occur:",options:["3 AM","Hot afternoons (A/C load)","During rain","Christmas"],answer:1,explain:"A/C drives summer peak."},
      {q:"Can wholesale power prices go negative?",options:["Never","Yes — when oversupply meets weak demand","Only in cartoons","Only in EU"],answer:1,explain:"Generators pay to stay online vs restart costs."},
      {q:"Winter gas spikes are most extreme at:",options:["Henry Hub","Northeast city gates (Algonquin, Transco Z6)","Permian (Waha)","Anywhere equally"],answer:1,explain:"Pipeline constraints into NE decouple from HH."},
    
      {q:"What happens to power prices during a hot afternoon?",options:["They fall due to solar generation", "They spike due to A/C demand", "They stay flat by regulation", "They go negative"],answer:1,explain:"Summer peak = A/C load surge \u2192 price spike."},
      {q:"Why can power prices go negative?",options:["Regulators allow it as subsidy", "Generators pay to stay online rather than incur restart costs", "Customers refuse to pay", "Transmission is free at night"],answer:1,explain:"Restart costs exceed the cost of paying the grid to take power."},
      {q:"When are power prices typically lowest?",options:["Hot summer afternoons", "Cold winter mornings", "3 AM in spring (low demand)", "Friday evenings"],answer:2,explain:"Overnight + mild weather = minimal load = price floor or negative."},
      {q:"A cold snap in NYC most affects which gas hub?",options:["Henry Hub", "Waha", "Algonquin City Gates", "Chicago"],answer:2,explain:"Pipeline constraints into NE cause Algonquin to decouple wildly from HH."},
      {q:"How frequently do power and gas prices change?",options:["Daily only", "Weekly", "Hourly or more frequently", "Monthly"],answer:2,explain:"Power clears every 5 minutes in real-time; gas trades daily and intraday."},
      {q:"Scarce supply + many buyers leads to:",options:["Lower prices", "Price controls", "Higher prices", "Stable prices"],answer:2,explain:"Basic supply-demand: scarcity \u2192 price increase."},
      {q:"Which statement about gas prices is correct?",options:["They are fixed by federal regulators", "They can move 5x in a day during cold snaps", "They only change monthly", "They always follow oil prices"],answer:1,explain:"Northeast gas can spike dramatically on pipeline constraints + cold weather."},
    ]},
  ]},
  2:{name:"MIDDLE SCHOOL",grade:"G4-6",tag:"L2",modules:[
    {id:"2a",title:"How Power is Generated",lesson:"Most plants spin a magnet inside coils. COAL/GAS: burn fuel → steam → turbine. NUCLEAR: uranium fission for heat. WIND: moving air. SOLAR PV: photons knock electrons loose in silicon (no spinning). HYDRO: falling water. CCGT (combined-cycle gas turbine) = jet-engine-like turbine + steam turbine on exhaust heat → ~6,400 Btu/kWh, ~58-63% efficient — workhorse of the modern US fleet.",questions:[
      {q:"Most plants generate by:",options:["Spinning a magnet inside a coil","Mixing chemicals","Static electricity","Lightning"],answer:0,explain:"~95%+ use electromagnetic induction."},
      {q:"NOT dispatchable on demand:",options:["Gas peaker","Coal","Wind farm","Nuclear"],answer:2,explain:"Wind is intermittent."},
      {q:"CCGT means:",options:["Coal-Coal Gas Turbine","Combined-Cycle Gas Turbine","Capacity Cap Gas Tariff","Carbon Capture"],answer:1,explain:"Two cycles in series → ~60% efficiency."},
    
      {q:"What converts heat energy to mechanical energy in most power plants?",options:["A battery", "A turbine", "A capacitor", "A transformer"],answer:1,explain:"Steam or gas spins a turbine \u2192 turbine spins a generator."},
      {q:"Solar PV generates electricity by:",options:["Heating steam", "Spinning a turbine", "Photons knocking electrons loose in silicon", "Chemical reaction"],answer:2,explain:"PV = photovoltaic \u2014 direct conversion, no spinning parts."},
      {q:"What is the approximate efficiency of a CCGT plant?",options:["~30%", "~45%", "~58-63%", "~90%"],answer:2,explain:"Two cycles in series capture exhaust heat \u2014 best thermal efficiency."},
      {q:"Which generation type is NOT dispatchable on demand?",options:["Gas peaker", "Nuclear", "Coal", "Solar farm"],answer:3,explain:"Solar output depends on sunlight \u2014 cannot be dispatched on command."},
      {q:"What does CCGT stand for?",options:["Carbon Capture Gas Technology", "Combined-Cycle Gas Turbine", "Coal-to-Carbon Gas Transfer", "Centralized Control Grid Terminal"],answer:1,explain:"Combined-cycle = gas turbine + steam turbine on exhaust heat."},
      {q:"In a CCGT, the second cycle captures:",options:["Solar energy", "Wind energy", "Waste heat from the gas turbine exhaust", "Nuclear decay"],answer:2,explain:"The steam cycle runs on exhaust heat that would otherwise be wasted."},
      {q:"Hydro power generates electricity using:",options:["Steam from geothermal", "Falling or flowing water", "Nuclear fission", "Solar panels"],answer:1,explain:"Falling water spins a turbine \u2014 clean, dispatchable where available."},
    ]},
    {id:"2b",title:"What is a Utility?",lesson:"Utility = delivers power/gas to your premises. RESTRUCTURED markets (TX, PA, NY, IL, NJ, parts of NE): utility ONLY delivers; separate companies generate and retail. VERTICALLY INTEGRATED (most of Southeast, NW, much of West): one utility does all. ~2/3 of US population is in some restructured market. Utilities are regulated as monopolies — running parallel wires/pipes is wasteful.",questions:[
      {q:"Vertically integrated =",options:["Only delivery","Generation + delivery + billing as one regulated entity","Only generation","Only billing"],answer:1,explain:"Pre-1990s model; common in regulated states."},
      {q:"Texas operates a:",options:["Vertically integrated market","Deregulated/restructured market via ERCOT","Federal-only market","No market"],answer:1,explain:"Generation, transmission, retail unbundled in ERCOT."},
      {q:"Why are utilities regulated as monopolies?",options:["Politics","Parallel wires/pipes are economically wasteful (natural monopoly)","Federal mandate","Random history"],answer:1,explain:"Regulation substitutes for competition."},
    
      {q:"What is a vertically integrated utility?",options:["One that only generates power", "One that only delivers power", "One entity doing generation, delivery, and billing", "A federally owned grid"],answer:2,explain:"Old-model utility: monopoly over the full supply chain."},
      {q:"In restructured markets, who delivers power?",options:["The generator", "The competitive retailer", "The utility (wires company only)", "The ISO"],answer:2,explain:"Restructuring separates generation/retail from the regulated wires business."},
      {q:"Why are utilities considered natural monopolies?",options:["They are government owned", "Running parallel wires/pipes is economically wasteful", "They have the best prices", "Federal law requires it"],answer:1,explain:"Duplicate infrastructure makes no economic sense \u2014 one set of wires serves all."},
      {q:"Which state operates the most deregulated power market?",options:["California", "New York", "Texas (ERCOT)", "Florida"],answer:2,explain:"ERCOT is the most deregulated \u2014 full competitive generation and retail."},
      {q:"In a restructured market, who can customers choose?",options:["Their ISO", "Their transmission owner", "Their retail electric provider", "Their generator"],answer:2,explain:"Retail competition = customers pick their electricity supplier."},
      {q:"Regulation substitutes for competition in utility markets because:",options:["Utilities are too large to compete", "Natural monopoly conditions mean competition is impossible or wasteful", "Federal law bans competition", "Customers prefer monopolies"],answer:1,explain:"Regulation mimics competitive outcomes where natural monopoly exists."},
      {q:"Which region is most commonly vertically integrated?",options:["Texas", "PJM territory", "Much of the Southeast and Northwest", "New York"],answer:2,explain:"Southeast (Southern Company, Duke) and Pacific NW remain largely regulated/integrated."},
    ]},
    {id:"2c",title:"Peak vs Off-Peak",lesson:"PEAK = weekdays HE 8 through HE 23 (5 days × 16 hours = '5×16'). OFF-PEAK = nights, early mornings, weekends, NERC holidays. Forwards trade separately. LOAD FACTOR = avg ÷ peak load — flatter is cheaper to serve. On-peak typically 20-50% above off-peak; in tight markets the spread blows out.",questions:[
      {q:"'5×16' means:",options:["5 plants × 16 states","5 weekdays × 16 hours peak block","5% of 16 generators","5 dollars × 16"],answer:1,explain:"Mon-Fri, HE 8 through HE 23, holidays excluded."},
      {q:"Load factor =",options:["Truck weight","Average ÷ peak load","Plant noise","Turbine RPM"],answer:1,explain:"Higher LF = flatter demand = better economics."},
      {q:"Off-peak block covers:",options:["Hot afternoons","Nights, early mornings, weekends, holidays","Only Christmas","Hurricanes"],answer:1,explain:"When industrial/residential demand drops."},
    
      {q:"'5\u00d716' refers to which power trading block?",options:["5 generators \u00d7 16 markets", "5 weekdays \u00d7 16 peak hours", "5% of 16 MW capacity", "5 ISOs \u00d7 16 states"],answer:1,explain:"Peak block: Mon-Fri, hours ending 8 through 23."},
      {q:"Off-peak hours typically include:",options:["Weekday afternoons", "Weekend days, nights, and NERC holidays", "Monday mornings only", "Summer afternoons"],answer:1,explain:"Off-peak = when industrial and residential demand is lowest."},
      {q:"Load factor is defined as:",options:["Peak load \u00f7 average load", "Average load \u00f7 peak load", "Total load \u00d7 hours", "Minimum load \u00f7 maximum load"],answer:1,explain:"Higher load factor = flatter demand curve = more efficient grid use."},
      {q:"A higher load factor means:",options:["More volatile prices", "Flatter demand = cheaper to serve", "Higher peak prices", "More transmission constraints"],answer:1,explain:"Flat load profiles are more efficient and cheaper to serve."},
      {q:"On-peak power prices are typically:",options:["Equal to off-peak", "Lower than off-peak", "20-50% above off-peak", "Fixed by regulators"],answer:2,explain:"Peak demand commands a premium \u2014 dispatchable capacity is scarce."},
      {q:"NERC holidays are treated as:",options:["Peak days", "Off-peak days", "Super-peak days", "Regular weekdays"],answer:1,explain:"Major holidays are excluded from the 5\u00d716 peak block."},
      {q:"Why do peak and off-peak power trade at different prices?",options:["Different fuel types", "Grid congestion only", "Demand varies significantly \u2014 dispatchable capacity is scarcer at peak", "Regulatory requirement"],answer:2,explain:"Scarcity of peaking capacity during high demand drives the on/off-peak spread."},
    ]},
    {id:"2d",title:"Gas Gathering & Processing",lesson:"Raw wellhead gas = methane + ethane/propane/butane (NGLs) + water + CO₂ + H₂S + sometimes nitrogen. GATHERING (small low-pressure pipes) brings gas from many wells to a PROCESSING PLANT, where: DEHYDRATION removes water, SWEETENING removes H₂S/CO₂ (amine units), FRACTIONATION separates NGLs. Result = pipeline-quality gas (~95%+ methane). NGLs ship separately (Mont Belvieu hub).",questions:[
      {q:"NGLs are:",options:["Just water","Ethane, propane, butane separated at processing","LNG cargoes","Crude oil"],answer:1,explain:"Heavier hydrocarbons stripped out."},
      {q:"'Sour' gas =",options:["Sugar","Gas containing significant H₂S (toxic, corrosive)","Salt","Methane only"],answer:1,explain:"Removed by sweetening."},
      {q:"Why must water be removed before pipelines?",options:["Aesthetic","Forms hydrate plugs and corrodes steel pipe","Reduces price","Customer pref"],answer:1,explain:"Hydrates block flow."},
    
      {q:"What are NGLs?",options:["Natural Gas Liquids \u2014 ethane, propane, butane separated at processing", "Non-Gateway Liquids \u2014 pipeline byproducts", "Nuclear Gas Liquids \u2014 regulated compounds", "Net Gas Losses \u2014 shrinkage"],answer:0,explain:"NGLs = heavier hydrocarbons stripped out at processing, sold separately."},
      {q:"Why must water be removed from gas before pipeline transport?",options:["It reduces gas BTU value", "Water forms hydrate plugs and corrodes steel pipe", "Customers reject wet gas", "It increases pressure too much"],answer:1,explain:"Hydrates block flow; water corrodes pipe \u2014 dehydration is essential."},
      {q:"'Sour' gas contains significant amounts of:",options:["CO\u2082 only", "Ethane", "H\u2082S (hydrogen sulfide)", "Nitrogen"],answer:2,explain:"H\u2082S is toxic and corrosive \u2014 must be removed by sweetening."},
      {q:"What process removes H\u2082S and CO\u2082 from raw gas?",options:["Dehydration", "Fractionation", "Sweetening (amine units)", "Compression"],answer:2,explain:"Amine sweetening units scrub acid gases \u2014 standard at processing plants."},
      {q:"Where do NGLs trade after being separated?",options:["Henry Hub", "Waha Hub", "Mont Belvieu", "Chicago Citygate"],answer:2,explain:"Mont Belvieu (near Houston) is the main NGL hub in the US."},
      {q:"Which process separates different NGL components from each other?",options:["Dehydration", "Sweetening", "Fractionation", "Compression"],answer:2,explain:"Fractionation splits ethane, propane, butane into separate streams."},
      {q:"Raw wellhead gas typically contains:",options:["Only methane", "Methane plus water, CO\u2082, H\u2082S, and NGLs", "Only ethane and propane", "Pipeline-quality gas already"],answer:1,explain:"Raw gas is a mixture \u2014 processing removes impurities and separates NGLs."},
    ]},
    {id:"2e",title:"Pipelines, Compression & Linepack",lesson:"Transmission pipes = 24-42\" diameter, 500-1,500 psi steel. COMPRESSOR STATIONS every 50-100 mi re-pressurize against friction loss. ~3 million miles of US gas pipe (transmission + distribution). LINEPACK = gas in the pipe — provides hours of flexibility. Major systems: TRANSCO (Gulf→NE), TENNESSEE (TX→NE), EL PASO (Permian→W), REX (Rockies→OH bidirectional).",questions:[
      {q:"Compressor stations:",options:["Cool gas","Re-pressurize gas after friction-driven pressure drops","Add odorant","Tax it"],answer:1,explain:"Without compression every ~50-100 mi, flow stops."},
      {q:"Linepack:",options:["Pipeline insurance","Gas physically inside the pipe (short-term flexibility)","Tariff bundle","Pipe coating"],answer:1,explain:"Pack/draft for hourly flow swings."},
      {q:"Total US gas pipe mileage:",options:["~30,000","~300,000","~3,000,000","~30 million"],answer:2,explain:"~3M miles transmission + distribution."},
    
      {q:"What is the typical pressure range in US transmission pipelines?",options:["10-50 psi", "500-1,500 psi", "5,000-10,000 psi", "0.25-5 psi"],answer:1,explain:"High-pressure transmission moves gas efficiently over long distances."},
      {q:"How far apart are compressor stations typically placed?",options:["5-10 miles", "50-100 miles", "500-1,000 miles", "Every 10 feet"],answer:1,explain:"Friction reduces pressure \u2014 compressors every 50-100 mi re-pressurize."},
      {q:"What is linepack used for?",options:["Measuring pipeline volume", "Storing gas in the pipe for short-term flexibility", "Compressing gas at stations", "Billing customers"],answer:1,explain:"Packing/drafting the line provides hours of operational flexibility."},
      {q:"Which pipeline connects the Gulf Coast to the Northeast?",options:["El Paso", "REX", "Transco (Williams)", "Rockies Express"],answer:2,explain:"Transco is the highest-volume natural gas pipeline in the US."},
      {q:"REX (Rockies Express) is significant because:",options:["It connects Texas to California", "It reversed flow to move Marcellus gas westward", "It carries only LNG", "It is the oldest US pipeline"],answer:1,explain:"REX reversed to give Marcellus shale access to Midwest markets."},
      {q:"Typical transmission pipe diameter is:",options:["1-4 inches", "6-12 inches", "24-42 inches", "100+ inches"],answer:2,explain:"Large diameter = high volume capacity for interstate transport."},
      {q:"Total US pipeline mileage (transmission + distribution) is approximately:",options:["30,000 miles", "300,000 miles", "3,000,000 miles", "30,000,000 miles"],answer:2,explain:"~3 million miles \u2014 one of the largest infrastructure networks in the world."},
    ]},
    {id:"2f",title:"Gas Storage",lesson:"Storage absorbs the seasonal mismatch (steady production, winter heating spike). SALT CAVERNS = man-made cavities in salt domes; small but very fast (multiple cycles/year) — favored for trading. DEPLETED RESERVOIRS = old gas/oil fields; biggest by volume but slow (~1 cycle). AQUIFERS = water-rock; expensive. Plus LINEPACK and LNG peak shavers. EIA Storage Report (Thursday 10:30 AM ET) is among the most market-moving releases in commodities.",questions:[
      {q:"Storage with FASTEST cycling:",options:["Aquifer","Salt cavern","Depleted reservoir","LNG tank"],answer:1,explain:"High deliverability, multiple turns/yr."},
      {q:"MOST COMMON storage type:",options:["Salt cavern","Depleted reservoir","Aquifer","LNG"],answer:1,explain:"Old gas/oil fields = widespread, low-cost."},
      {q:"EIA storage report releases:",options:["Mon 9 AM","Thursday 10:30 AM ET","Fri 4 PM","Sun midnight"],answer:1,explain:"Drives front-month NG futures."},
    
      {q:"Which storage type has the highest deliverability (fastest withdrawal)?",options:["Depleted reservoir", "Aquifer", "Salt cavern", "LNG peak shaver"],answer:2,explain:"Salt caverns = small but fast \u2014 ideal for trading and peak shaving."},
      {q:"Which storage type has the largest working gas volume?",options:["Salt cavern", "Aquifer", "Depleted reservoir", "LNG peak shaver"],answer:2,explain:"Old oil/gas fields repurposed for storage \u2014 widespread and large capacity."},
      {q:"The EIA storage report is released:",options:["Monday 9 AM ET", "Thursday 10:30 AM ET", "Friday 4 PM ET", "Daily at noon"],answer:1,explain:"Thursday 10:30 AM ET \u2014 among the most market-moving weekly reports in commodities."},
      {q:"Why is salt cavern storage favored by traders?",options:["Largest capacity", "Cheapest to build", "High deliverability and multiple cycles per year", "Government subsidized"],answer:2,explain:"Speed and flexibility = trading value; can inject/withdraw multiple times per year."},
      {q:"Gas storage is primarily used to manage:",options:["Daily price fluctuations only", "The seasonal mismatch between steady production and winter heating demand", "Pipeline maintenance", "LNG exports"],answer:1,explain:"Storage absorbs summer surplus for winter withdrawal \u2014 core seasonal function."},
      {q:"An aquifer storage facility uses:",options:["Salt domes", "Old oil fields", "Water-bearing rock formations", "Underground tanks"],answer:2,explain:"Aquifers are water-saturated rock \u2014 more expensive and complex than other types."},
      {q:"Cushion (base) gas in a storage facility:",options:["Is traded daily", "Maintains minimum pressure to allow withdrawal \u2014 not available for sale", "Is always salt", "Equals total working gas"],answer:1,explain:"Cushion gas is trapped \u2014 it maintains the reservoir pressure needed to withdraw."},
    ]},
    {id:"2g",title:"City Gates, LDCs & Burner Tip",lesson:"Gas leaves transmission at a CITY GATE — pressure drops from 500-1,000 psi to 60-200 psi for the LDC. The LDC (e.g., Con Edison, National Grid) owns local pipes + your meter. Pressure drops further to ~0.25 psi (7 in WC) into your home. Final demand = BURNER TIP. Pure methane is ODORLESS; LDCs add MERCAPTAN (rotten-egg smell) at the city gate so leaks are detectable.",questions:[
      {q:"City gate =",options:["Municipal building","Metering point: transmission gas → LDC","LNG terminal","Storage cavern"],answer:1,explain:"Pressure step-down + custody transfer."},
      {q:"Mercaptan added because:",options:["Increases heat","Methane is odorless — mercaptan makes leaks detectable","Tax","Combustion"],answer:1,explain:"Rotten-egg smell at low ppm."},
      {q:"Residential gas line pressure ≈",options:["1,000 psi","100 psi","0.25 psi (7 in WC)","14.7 psi"],answer:2,explain:"Ultra-low after meter regulator."},
    
      {q:"What happens at a city gate?",options:["Gas is extracted from the ground", "Pressure drops from transmission levels and custody transfers to the LDC", "Gas is liquefied for storage", "NGLs are separated"],answer:1,explain:"City gate = metering point + pressure reduction where transmission meets distribution."},
      {q:"Why is mercaptan added to natural gas?",options:["It increases heat content", "It prevents corrosion", "Pure methane is odorless \u2014 mercaptan makes leaks detectable", "It reduces pressure"],answer:2,explain:"Rotten-egg smell at very low concentrations = safety standard."},
      {q:"Residential gas line pressure is approximately:",options:["500 psi", "100 psi", "14.7 psi", "0.25 psi (7 in WC)"],answer:3,explain:"Ultra-low pressure after the meter regulator \u2014 safe for home appliances."},
      {q:"What does LDC stand for?",options:["Long Distance Carrier", "Local Distribution Company", "Liquids Displacement Capacity", "Licensed Delivery Certificate"],answer:1,explain:"LDC owns and operates local gas pipes serving homes and businesses."},
      {q:"Who adds mercaptan to natural gas?",options:["The wellhead operator", "The processing plant", "The LDC at the city gate", "The end user"],answer:2,explain:"LDC adds the odorant at or near the city gate \u2014 their safety responsibility."},
      {q:"Transmission pressure stepping down to distribution levels happens at:",options:["The wellhead", "The processing plant", "The city gate", "The meter"],answer:2,explain:"City gate = pressure reduction station at the transmission-distribution interface."},
    ]},
    {id:"2h",title:"Power Grid: Voltage Levels & Substations",lesson:"Generator: 13-25 kV. Step-up to TRANSMISSION (138, 230, 345, 500, 765 kV — higher = longer haul). Substation steps down. SUBTRANSMISSION (35-138 kV) feeds large industrials. DISTRIBUTION (4-35 kV) along streets. Pole-top transformer drops to 120/240 V. Physics: P=V·I; for fixed P, double V → halve I → I²R losses fall 4×. HVDC for very long hauls or linking asynchronous AC grids.",questions:[
      {q:"Why high voltage long-distance?",options:["Looks impressive","Lower current at same power → much lower I²R losses","Required for AC","Federal mandate"],answer:1,explain:"Doubling V quarters resistive losses."},
      {q:"Residential service voltage:",options:["12 V","120 V (and 240 V split-phase)","1,200 V","7,200 V"],answer:1,explain:"120 V outlets, 240 V for big appliances."},
      {q:"HVDC most useful for:",options:["Local distribution","Very long distances OR linking asynchronous AC grids","Outlets","Solar only"],answer:1,explain:"Lower line losses; only practical AC-grid tie."},
    
      {q:"What is subtransmission voltage typically used for?",options:["Residential service", "Large industrial customers and local substations (35-138 kV)", "Long-haul bulk transport", "Generation output"],answer:1,explain:"Subtransmission bridges bulk transmission and local distribution."},
      {q:"The formula P = V \u00d7 I means that for fixed power:",options:["Higher voltage requires higher current", "Higher voltage requires lower current", "Voltage and current are unrelated", "Lower voltage reduces losses"],answer:1,explain:"For fixed P, doubling V halves I \u2014 I\u00b2R losses fall by 75%."},
      {q:"HVDC is most useful for:",options:["Short local distribution", "Very long distances or linking asynchronous AC grids", "Residential service", "Small industrial loads"],answer:2,explain:"HVDC has lower losses over very long distances and enables AC grid interconnection."},
      {q:"Why does the US use AC rather than DC for the grid?",options:["AC is safer for homes", "Transformers easily step AC voltage up and down", "DC cannot travel long distances", "Federal law requires AC"],answer:1,explain:"AC voltage transformation = efficient long-distance transmission."},
      {q:"What voltage range covers US bulk transmission?",options:["120-240 V", "4-35 kV", "138-765 kV", "1-10 kV"],answer:2,explain:"138, 230, 345, 500, 765 kV \u2014 higher voltage for longer hauls."},
      {q:"Resistive (I\u00b2R) losses can be reduced by:",options:["Using thicker wire only", "Increasing current", "Increasing voltage (reducing current at same power)", "Using DC only"],answer:2,explain:"Higher V \u2192 lower I \u2192 I\u00b2R losses fall as the square of current reduction."},
    ]},
  ]},
  3:{name:"HIGH SCHOOL",grade:"G7-12",tag:"L3",modules:[
    {id:"3a",title:"Deregulation: Short History",lesson:"PRE-1978: Vertically integrated regulated monopolies. PURPA 1978: Forced utilities to buy from qualifying facilities — cracked the door. EPACT 1992: Created EWGs, opened wholesale competition. FERC Order 888 (1996): Open-access transmission. Order 2000 (1999): RTO formation. CALIFORNIA 2000-01: Restructuring + supply gap + Enron manipulation = $40B+ crisis. TEXAS 2021 (Storm Uri): $50B settlement, retailer defaults, exposed weatherization gaps.",questions:[
      {q:"FERC Order 888 (1996) required:",options:["RTO formation","Open-access non-discriminatory transmission tariffs","Retail competition","Carbon tax"],answer:1,explain:"OATT = foundation of wholesale competition."},
      {q:"California 2000-01 crisis caused by:",options:["Just weather","Restructuring + supply gap + market manipulation","Federal mandate","Random"],answer:1,explain:"Enron 'Death Star' manipulation amplified structural problems."},
      {q:"Texas 2021 Storm Uri exposed:",options:["Tax issues","Weatherization gaps + market-design vulnerabilities at scarcity prices","Pipeline overcapacity","Random"],answer:1,explain:"$9k/MWh for 70+ hours triggered cascade defaults."},
    
      {q:"What did FERC Order 888 (1996) require?",options:["Retail competition in all states", "Open-access non-discriminatory transmission tariffs", "Nuclear plant decommissioning", "Carbon pricing"],answer:1,explain:"OATT = the legal foundation for wholesale competition."},
      {q:"The California energy crisis of 2000-01 was caused by:",options:["A hurricane", "Restructuring flaws + supply gap + market manipulation", "Federal price controls", "Nuclear plant failures"],answer:1,explain:"Enron's 'Death Star' schemes amplified structural market design problems."},
      {q:"PURPA (1978) was significant because:",options:["It created ISOs", "It forced utilities to buy from qualifying facilities \u2014 opening competition", "It set retail prices", "It banned coal plants"],answer:1,explain:"PURPA cracked the monopoly door \u2014 first independent power producers."},
      {q:"Texas 2021 (Storm Uri) primarily exposed:",options:["Too much renewable energy", "Weatherization gaps and market-design vulnerabilities at scarcity prices", "Pipeline overcapacity", "Federal regulatory failure"],answer:1,explain:"$9,000/MWh for 70+ hours triggered cascade defaults and $50B+ in damages."},
      {q:"EPACT 1992 created:",options:["The FERC", "Exempt Wholesale Generators (EWGs) \u2014 opening wholesale competition", "Retail deregulation nationwide", "Carbon markets"],answer:1,explain:"EWGs could sell wholesale power competitively \u2014 key restructuring step."},
      {q:"FERC Order 2000 (1999) promoted:",options:["Retail competition", "RTO formation for regional grid management", "Natural gas deregulation", "Nuclear subsidies"],answer:1,explain:"Order 2000 encouraged utilities to join RTOs for independent grid operation."},
      {q:"What is an OATT?",options:["A type of power plant", "Open Access Transmission Tariff \u2014 requires non-discriminatory grid access", "An energy storage technology", "A carbon credit"],answer:1,explain:"OATT ensures all generators can access the transmission grid on equal terms."},
    ]},
    {id:"3b",title:"Wholesale vs Retail",lesson:"WHOLESALE = generators sell to LSEs (Load-Serving Entities) at hub LMPs or bilaterally. RETAIL = LSEs sell to end customers. In RESTRUCTURED states, customers can choose a retail provider (REPs in TX, ESCOs in NY). FERC regulates wholesale; STATE PUCs regulate retail. POLR (Provider of Last Resort) supplies customers who don't choose.",questions:[
      {q:"FERC vs state PUC jurisdiction:",options:["Same","FERC = wholesale interstate; PUC = retail intrastate","PUC = wholesale","Random"],answer:1,explain:"Federal Power Act split."},
      {q:"REP (in Texas) =",options:["FERC employee","Retail Electric Provider — sells power to customers","Generator","Pipeline"],answer:1,explain:"Customer-facing competitive retailer in ERCOT."},
      {q:"POLR =",options:["Pipeline regulator","Provider of Last Resort — supplies customers who don't choose / lose retailer","Trading desk","ISO program"],answer:1,explain:"Default-service mechanism."},
    
      {q:"Who regulates wholesale power markets?",options:["State PUCs", "FERC (Federal Energy Regulatory Commission)", "NERC", "The Department of Energy"],answer:1,explain:"FERC has jurisdiction over interstate wholesale electricity and gas."},
      {q:"What does POLR stand for?",options:["Pipeline Operator License Requirement", "Provider of Last Resort \u2014 supplies customers who don't choose a retailer", "Power Output Level Rating", "Public Oversight of Licensed Retailers"],answer:1,explain:"POLR = default service for customers without a competitive supplier."},
      {q:"In Texas, a REP is:",options:["A federal regulator", "A Retail Electric Provider \u2014 sells power to end customers competitively", "A pipeline company", "A transmission owner"],answer:1,explain:"REPs compete for retail customers in ERCOT's deregulated market."},
      {q:"State PUCs regulate:",options:["Wholesale interstate markets", "Retail rates and intrastate distribution", "Federal pipelines", "ISO operations"],answer:1,explain:"State authority ends at the retail/distribution level; FERC covers wholesale."},
      {q:"An LSE (Load-Serving Entity) primarily does what?",options:["Operates transmission lines", "Generates electricity", "Serves retail load \u2014 buys wholesale, sells retail", "Regulates gas prices"],answer:2,explain:"LSE = the entity responsible for matching supply to retail customer demand."},
      {q:"Which entity handles retail competition in New York?",options:["REPs", "ESCOs (Energy Service Companies)", "LDCs", "The NYISO"],answer:1,explain:"ESCOs serve retail customers in restructured NY markets."},
      {q:"The Federal Power Act splits jurisdiction between:",options:["FERC and NERC", "FERC (wholesale interstate) and state PUCs (retail intrastate)", "DOE and FERC", "States only"],answer:1,explain:"Dual regulatory system: federal wholesale + state retail."},
    ]},
    {id:"3c",title:"Market Participants",lesson:"GENERATORS: own plants, bid into ISOs. LSEs / REPs: serve load, hedge with PPAs/swaps. FINANCIAL TRADERS: speculators, market-makers. PIPELINE / TRANSPORT: midstream. ASSET-BACKED MARKETERS: own physical, trade options. ISOs/RTOs: market operators (PJM, MISO, ERCOT, CAISO, NYISO, ISO-NE, SPP). FERC: federal regulator. NERC: reliability standards. CFTC: derivatives oversight.",questions:[
      {q:"An LSE is:",options:["Liquid Storage Entity","Load-Serving Entity — supplies retail customers","Liquefaction Site Engineer","Listed Stock Exchange"],answer:1,explain:"Buys at wholesale, serves retail load."},
      {q:"ISOs/RTOs do:",options:["Generate power","Operate wholesale markets and dispatch the grid","Set retail rates","Mine coal"],answer:1,explain:"Market operator + grid operator combined."},
      {q:"CFTC oversees:",options:["Pipelines","Derivatives / futures markets (incl. NG, power)","Retail rates","Coal plants"],answer:1,explain:"Energy futures fall under Commodity Exchange Act."},
    
      {q:"What does an ISO/RTO primarily do?",options:["Generate electricity", "Own transmission lines", "Operate wholesale markets and dispatch the grid", "Set retail rates"],answer:2,explain:"ISO/RTO = independent market operator and grid reliability coordinator."},
      {q:"NERC sets:",options:["Electricity prices", "Reliability standards for the bulk power system", "Carbon limits", "Pipeline tariffs"],answer:1,explain:"NERC = North American Electric Reliability Corporation \u2014 reliability standards."},
      {q:"The CFTC oversees:",options:["Physical gas pipelines", "Derivatives and futures markets including energy", "Retail electricity", "Nuclear plants"],answer:1,explain:"Commodity Exchange Act gives CFTC jurisdiction over energy derivatives."},
      {q:"Asset-backed marketers differ from financial traders because:",options:["They use more leverage", "They own physical assets and trade options against them", "They are regulated by FERC", "They only trade gas"],answer:1,explain:"Physical asset ownership gives optionality \u2014 different risk profile from pure financials."},
      {q:"Which entity sets reliability standards that all grid participants must follow?",options:["FERC", "State PUCs", "NERC", "DOE"],answer:2,explain:"NERC standards are mandatory for bulk power system reliability."},
      {q:"A financial trader in power markets primarily:",options:["Builds power plants", "Owns transmission rights", "Takes financial positions \u2014 no physical delivery obligation", "Operates the grid"],answer:2,explain:"Financial participants provide liquidity without owning physical assets."},
      {q:"Which of the following is an ISO/RTO?",options:["Transco", "ENGIE", "PJM Interconnection", "Exelon"],answer:2,explain:"PJM is the largest ISO/RTO in the US by load served."},
    ]},
  ]},
  4:{name:"COLLEGE PREP",grade:"Advanced HS / Frosh",tag:"L4",modules:[
    {id:"4a",title:"The 7 ISO/RTOs",lesson:"PJM (13 states + DC, biggest by load — RPM capacity auction). MISO (15 states, mid-continent — PRA). ERCOT (~90% of TX, energy-only via ORDC). CAISO (CA, Resource Adequacy not auction). NYISO (NY, ICAP auctions, TCC market). ISO-NE (6 NE states, FCM auction). SPP (TX–ND, Integrated Marketplace). DA + RT clearing in all; capacity in 4 of 7. ERCOT alone is energy-only.",questions:[
      {q:"Largest US ISO by load:",options:["MISO","PJM","ERCOT","CAISO"],answer:1,explain:"13 states + DC, ~65 million people."},
      {q:"Energy-only ISO (no capacity market):",options:["PJM","MISO","ERCOT","ISO-NE"],answer:2,explain:"ORDC drives scarcity pricing instead."},
      {q:"PJM capacity auction:",options:["RPM (Reliability Pricing Model)","FCM","ICAP","ORDC"],answer:0,explain:"3-year forward Base Residual Auction."},
    
      {q:"Which ISO/RTO serves approximately 90% of Texas?",options:["PJM", "MISO", "CAISO", "ERCOT"],answer:3,explain:"ERCOT is intentionally islanded from interstate grids for regulatory reasons."},
      {q:"PJM's capacity auction mechanism is called:",options:["FCM", "ICAP", "RPM (Reliability Pricing Model)", "ORDC"],answer:2,explain:"RPM = PJM's 3-year forward Base Residual Auction."},
      {q:"ISO-NE's capacity mechanism is called:",options:["RPM", "FCM (Forward Capacity Market)", "ICAP", "PRA"],answer:1,explain:"FCM auctions capacity 3 years forward in New England."},
      {q:"Which ISO uses ORDC instead of a formal capacity market?",options:["PJM", "ISO-NE", "ERCOT", "NYISO"],answer:2,explain:"ERCOT is energy-only \u2014 ORDC (Operating Reserve Demand Curve) drives scarcity pricing."},
      {q:"MISO's capacity mechanism is called:",options:["RPM", "FCM", "PRA (Planning Resource Auction)", "ICAP"],answer:2,explain:"MISO's Planning Resource Auction procures capacity for reliability."},
      {q:"How many ISOs/RTOs operate in the US?",options:["3", "5", "7", "10"],answer:2,explain:"PJM, MISO, ERCOT, CAISO, NYISO, ISO-NE, SPP \u2014 7 major ISOs."},
      {q:"SPP (Southwest Power Pool) covers approximately:",options:["The Northeast", "Texas only", "A north-south corridor from Texas to North Dakota", "The Pacific Coast"],answer:2,explain:"SPP territory stretches from TX/OK/KS up through NE/ND."},
    ]},
    {id:"4b",title:"Day-Ahead vs Real-Time",lesson:"DAY-AHEAD: hourly market clearing ~4 PM previous day via SCUC + SCED. Generators submit offers, ISO commits and dispatches, publishes DA LMPs. REAL-TIME: 5-min (most ISOs) imbalance market. TWO-SETTLEMENT: DA position settles at DA LMP; deviations at RT LMP. Virtual bids (INC/DEC) take pure financial positions in DA, settle at RT.",questions:[
      {q:"DA market clears around:",options:["Midnight","~4 PM previous day","Real-time","Friday only"],answer:1,explain:"Hourly schedules published evening before."},
      {q:"Two-settlement system:",options:["Two ISOs","DA at DA LMP; deviations at RT LMP","Two checks","Two margins"],answer:1,explain:"Standard ISO design."},
      {q:"Virtual bids (INC/DEC):",options:["Physical only","Financial bids in DA without delivery — settle vs RT","Carbon allowances","Capacity"],answer:1,explain:"Liquidity tool, ISO surveillance applies."},
    
      {q:"When does the day-ahead market typically clear?",options:["At midnight", "Around 4 PM the previous day", "In real-time", "At 8 AM on the day of delivery"],answer:1,explain:"DA market results published evening before \u2014 generators commit schedules."},
      {q:"In the two-settlement system, deviations from DA schedules settle at:",options:["The DA LMP", "The real-time LMP", "A fixed price", "Zero"],answer:1,explain:"RT imbalances settle at 5-minute RT LMPs \u2014 incentivizes accurate scheduling."},
      {q:"Virtual bids (INC/DEC) in the day-ahead market are:",options:["Physical generation commitments", "Financial positions that settle against real-time prices", "Capacity market bids", "Transmission reservations"],answer:1,explain:"Virtuals take DA positions without physical delivery \u2014 pure financial."},
      {q:"SCUC stands for:",options:["System Cost Under Contract", "Security-Constrained Unit Commitment", "Standard Customer Utility Charge", "Sub-Circuit Under Construction"],answer:1,explain:"SCUC = optimization that commits generators for next-day operation."},
      {q:"SCED stands for:",options:["System Clearing and Economic Dispatch", "Security-Constrained Economic Dispatch", "Standard Contract for Energy Delivery", "Sub-daily Cost Energy Determination"],answer:1,explain:"SCED = real-time dispatch optimization minimizing system cost."},
      {q:"Real-time markets in most ISOs clear every:",options:["1 hour", "5 minutes", "15 minutes", "1 day"],answer:1,explain:"5-minute RT intervals \u2014 fine-grained balancing of supply and demand."},
      {q:"An INC bid in the DA market effectively:",options:["Schedules physical generation", "Buys energy in DA, sells in RT", "Reserves transmission capacity", "Procures capacity"],answer:1,explain:"INC = increment bid \u2014 long DA, short RT \u2014 profits if DA clears above RT."},
    ]},
    {id:"4c",title:"Henry Hub and Basis",lesson:"Henry Hub (Erath, LA) = NYMEX NG futures delivery point — meeting of ~13 pipelines. BASIS = local hub price minus HH. Algonquin City Gates (NE), Transco Z6 NY, Dominion South (Marcellus), Chicago, Waha (Permian), Opal (Rockies), SoCal Citygate, AECO (Canada). Basis is where location-specific information lives. NYMEX NG expires 3 BD before contract month.",questions:[
      {q:"Henry Hub is:",options:["Storage cavern","Pipeline junction in Erath, LA — NYMEX delivery point","LNG terminal","Office in DC"],answer:1,explain:"Geographic crossroads → natural pricing point."},
      {q:"If HH=$3.00 and Z6 NY basis = +$1.50:",options:["$1.50","$3.00","$4.50","$0.50"],answer:2,explain:"Local price = HH + basis."},
      {q:"NYMEX NG expires:",options:["Last day of month","3 business days before first day of contract month","First Friday","Random"],answer:1,explain:"Memorize for end-of-month roll behavior."},
    
      {q:"Henry Hub is located in:",options:["Houston, TX", "Erath, LA", "New York, NY", "Chicago, IL"],answer:1,explain:"Erath, Louisiana \u2014 confluence of ~13 major pipelines."},
      {q:"NYMEX NG futures expire how many business days before the contract month?",options:["1 BD", "3 BD", "5 BD", "10 BD"],answer:1,explain:"3 BD before first day of delivery month \u2014 creates end-of-month roll activity."},
      {q:"Dominion South basis represents gas priced at:",options:["Gulf Coast", "New England", "Appalachian Marcellus production area", "California"],answer:2,explain:"Dominion South = Marcellus/Utica production hub in PA \u2014 often trades at discount to HH."},
      {q:"If Henry Hub = $3.00 and Algonquin basis = +$2.00, Algonquin price =",options:["$1.00", "$2.00", "$3.00", "$5.00"],answer:3,explain:"Local price = HH + basis. $3.00 + $2.00 = $5.00."},
      {q:"AECO is a gas hub located in:",options:["Texas", "Louisiana", "Canada (Alberta)", "Ohio"],answer:2,explain:"AECO = Alberta hub \u2014 main Canadian gas pricing point."},
      {q:"Waha hub is located in:",options:["Appalachia", "West Texas (Permian Basin)", "Louisiana", "California"],answer:1,explain:"Waha = Permian Basin hub \u2014 prone to negative basis when pipelines are full."},
      {q:"Basis risk in gas trading refers to:",options:["Credit risk", "The residual price risk when hedging a local hub with HH futures", "Volumetric risk", "Currency risk"],answer:1,explain:"Local price may not move perfectly with HH \u2014 basis risk is location-specific."},
    ]},
    {id:"4d",title:"Major Pipelines",lesson:"TRANSCO (Williams) — Gulf to NE. TENNESSEE GAS (Kinder Morgan) — competing route. ALGONQUIN (Enbridge) — into NE, structurally constrained. EL PASO — Permian to West. REX (Rockies Express) — bidirectional, key for Marcellus exports west. POWER INTERTIES: ERCOT DC ties (limited — keeps ERCOT outside FERC), Pacific DC Intertie (3,100 MW HVDC). Transmission constraints CREATE LMP spreads.",questions:[
      {q:"REX significance:",options:["Coal banned","Marcellus shale needed western outlets — REX reversed flow","California restructured","Random"],answer:1,explain:"Reversed-flow infrastructure shift."},
      {q:"Why is ERCOT 'islanded'?",options:["Geography only","Limited DC ties keep it outside FERC interstate jurisdiction","Different frequency","All true"],answer:1,explain:"Regulatory choice via DC ties."},
      {q:"Algonquin pipeline serves:",options:["California","New England (Boston)","Florida","Pacific NW"],answer:1,explain:"The constrained pipe behind NE winter basis spikes."},
    
      {q:"Why is ERCOT 'islanded' from other US grids?",options:["Geographic isolation", "Limited DC ties keep it outside FERC interstate jurisdiction", "Different AC frequency", "State law bans connections"],answer:1,explain:"DC ties allow interconnection without triggering FERC interstate regulation."},
      {q:"The Algonquin pipeline primarily serves:",options:["California", "Texas", "New England (Boston area)", "The Midwest"],answer:2,explain:"Algonquin = the constrained key pipe into New England \u2014 drives winter basis spikes."},
      {q:"El Paso pipeline primarily moves gas from:",options:["Appalachia to Midwest", "Gulf Coast to Northeast", "Permian Basin to West Coast/Southwest", "Canada to Great Lakes"],answer:2,explain:"El Paso Natural Gas = major Permian/Gulf source pipeline to Western US."},
      {q:"Tennessee Gas Pipeline is significant because:",options:["It only serves Texas", "It runs from Gulf Coast to Northeast, competing with Transco", "It only carries LNG", "It is government owned"],answer:1,explain:"Tennessee = one of the two main Gulf-to-Northeast pipes alongside Transco."},
      {q:"Transmission constraints create:",options:["Uniform prices everywhere", "LMP spreads between constrained and unconstrained locations", "Pipeline tariff discounts", "Lower total demand"],answer:1,explain:"Constraints = price separation between nodes \u2014 the core of congestion economics."},
      {q:"The Pacific DC Intertie carries approximately how much power?",options:["500 MW", "1,000 MW", "3,100 MW", "10,000 MW"],answer:2,explain:"~3,100 MW HVDC line connecting Pacific Northwest hydro to Southern California."},
      {q:"What was the main purpose of reversing REX pipeline flow?",options:["To import Canadian gas", "To move Marcellus shale gas westward to Midwest markets", "To connect Gulf Coast to California", "To transport LNG"],answer:1,explain:"Marcellus supply explosion needed western outlets \u2014 REX reversal was the solution."},
    ]},
    {id:"4e",title:"Standard Deal Types",lesson:"PPA (Power Purchase Agreement): long-term offtake of generation. TOLLING: toller supplies fuel, pays capacity charge; takes the power and bears spark-spread risk. CAPACITY CONTRACT: pure availability payment. NAESB BASE CONTRACT: physical gas. FT (Firm Transport): non-curtailable, pays daily reservation. IT (Interruptible Transport): cheaper, curtailed first. ISDA Master = financial OTC. EEI Master = physical power. NAESB = physical gas.",questions:[
      {q:"PPA stands for:",options:["Power Producer Allowance","Power Purchase Agreement","Public Pipeline Authority","Pre-Pay Adjustment"],answer:1,explain:"Long-term offtake contract."},
      {q:"In tolling, the toller bears:",options:["Plant capex","Spark spread / heat rate exposure","Property taxes","Insurance only"],answer:1,explain:"Toller supplies fuel, takes power."},
      {q:"FT vs IT:",options:["Same","FT non-curtailable, daily reservation; IT cheaper, curtailed first","FT cheaper","IT for liquids"],answer:1,explain:"Winter NE shippers pay 10x for FT."},
      {q:"Standard physical-power master:",options:["ISDA","EEI Master","NAESB","EFET"],answer:1,explain:"EEI = US standard for bilateral physical power."},
    
      {q:"In a tolling agreement, the plant operator receives:",options:["Spark spread profits", "A capacity payment while the toller supplies fuel and takes power", "All fuel cost savings", "Capacity market revenues"],answer:1,explain:"Tollee gets paid for availability; toller bears fuel and power price risk."},
      {q:"What does FT (Firm Transport) guarantee?",options:["Cheapest gas price", "Non-curtailable delivery \u2014 gas moves even during constraints", "Highest priority storage access", "Free pipeline capacity"],answer:1,explain:"FT = reservation charge for guaranteed non-interruptible service."},
      {q:"IT (Interruptible Transport) is:",options:["More expensive than FT", "Never curtailed", "Cheaper but curtailed first during constraints", "Fixed-volume only"],answer:2,explain:"IT saves on daily reservation charges but gets cut when pipes are full."},
      {q:"The EEI Master Agreement governs:",options:["Physical gas trades", "Financial derivatives", "Physical power trades", "Pipeline transportation"],answer:2,explain:"EEI = standard bilateral master agreement for physical electricity."},
      {q:"The NAESB Base Contract governs:",options:["Physical gas trades", "Physical power trades", "Financial derivatives", "Capacity market bids"],answer:0,explain:"NAESB = standard bilateral master agreement for physical natural gas."},
      {q:"An ISDA Master Agreement is used for:",options:["Physical gas delivery", "Physical power delivery", "OTC financial derivatives", "Pipeline transportation"],answer:2,explain:"ISDA = International Swaps and Derivatives Association master for OTC derivatives."},
      {q:"A PPA (Power Purchase Agreement) typically provides:",options:["Short-term spot pricing", "Long-term offtake of generation output", "Pipeline transportation rights", "Capacity market exemption"],answer:1,explain:"PPAs give generators revenue certainty; buyers get fixed supply commitment."},
    ]},
  ]},
  5:{name:"COLLEGE",grade:"Undergraduate",tag:"L5",modules:[
    {id:"5a",title:"Locational Marginal Pricing (LMP)",lesson:"LMP = ENERGY + CONGESTION + LOSSES at a specific node. Energy is system-wide. Congestion appears when a transmission line binds — import-constrained nodes spike, export-constrained crash. Losses reflect resistive losses to that location. PJM has ~10,000 nodes. HUBS = weighted-average baskets (PJM West, ERCOT North). The whole nodal game = forecasting CONGESTION.",questions:[
      {q:"LMP components:",options:["Capacity","Energy + Congestion + Losses","Reactive power","Carbon"],answer:1,explain:"Three additive components."},
      {q:"Congestion appears when:",options:["Always","A transmission line binds","Demand is low","Random"],answer:1,explain:"Binding constraint → location-to-location LMP spread."},
      {q:"PJM hubs are:",options:["Pipelines","Weighted-average baskets of nodes used as liquid trading points","Substations only","Customer accounts"],answer:1,explain:"PJM West Hub is the most-traded power location in US."},
    
      {q:"The three components of LMP are:",options:["Energy, Capacity, Carbon", "Energy, Congestion, Losses", "Fuel, Transmission, Distribution", "Generation, Reserve, Voltage"],answer:1,explain:"LMP = Energy + Congestion + Loss components at each node."},
      {q:"When a transmission line binds, what happens to LMPs?",options:["All LMPs equalize", "Import-constrained nodes spike; export-constrained nodes drop", "All LMPs fall", "LMPs are suspended"],answer:1,explain:"Congestion component separates nodal prices \u2014 constrained nodes diverge."},
      {q:"PJM West Hub is best described as:",options:["A physical generator location", "A weighted-average basket of nodes used as a liquid trading point", "A transmission substation", "A capacity zone"],answer:1,explain:"Hubs aggregate many nodes into a tradeable reference price."},
      {q:"Approximately how many nodes does PJM have?",options:["100", "1,000", "10,000", "100,000"],answer:2,explain:"~10,000 nodes \u2014 granular nodal pricing across the 13-state PJM footprint."},
      {q:"The loss component of LMP reflects:",options:["Credit losses", "Resistive energy losses in delivering power to that location", "Capacity market costs", "Fuel cost changes"],answer:1,explain:"Higher-loss locations pay a premium reflecting the cost of I\u00b2R losses."},
      {q:"What does the congestion component of LMP represent?",options:["Pipeline congestion", "The cost of routing power around binding transmission constraints", "Carbon costs", "Fuel transport costs"],answer:1,explain:"Congestion LMP = shadow price of the binding transmission constraint."},
      {q:"Which statement about nodal pricing is correct?",options:["All nodes in an ISO have the same LMP", "LMPs can differ significantly across nodes due to congestion", "Only hubs have LMPs", "LMPs are set by regulators"],answer:1,explain:"Nodal granularity is the point \u2014 location-specific prices reflect real grid conditions."},
    ]},
    {id:"5b",title:"Capacity Markets",lesson:"Capacity ≠ Energy. Capacity markets pay generators to be AVAILABLE during future peaks. PJM RPM, ISO-NE FCM, NYISO ICAP, MISO PRA. CAISO uses Resource Adequacy (bilateral). ERCOT energy-only. CONE (Cost of New Entry) anchors auction parameters. ELCC (Effective Load Carrying Capability) accredits intermittent resources at less than nameplate. MOPR = floor on subsidized resource offers (controversial).",questions:[
      {q:"Capacity markets exist to:",options:["Pay for fuel","Compensate generators for being available during future peaks","Subsidize renewables","Cap retail prices"],answer:1,explain:"Resource adequacy mechanism."},
      {q:"PJM capacity auction =",options:["RPM","FCM","ICAP","ORDC"],answer:0,explain:"3-year forward."},
      {q:"ELCC accreditation:",options:["Always 100%","Reliability-equivalent capacity contribution — wind/solar < nameplate, declines as penetration grows","Same as nameplate","Random"],answer:1,explain:"Saturation effect at high renewable penetration."},
    
      {q:"What is the purpose of capacity markets?",options:["To pay for fuel", "To compensate generators for being available during future peak periods", "To subsidize renewables", "To cap retail prices"],answer:1,explain:"Capacity markets ensure resource adequacy \u2014 generators get paid to exist and be available."},
      {q:"ELCC stands for:",options:["Estimated Load Carrying Capability", "Effective Load Carrying Capability \u2014 reliability contribution of a resource", "Enhanced Levelized Cost Calculation", "Environmental Limit on Carbon Credits"],answer:1,explain:"ELCC accredits intermittent resources at less than nameplate \u2014 based on actual reliability contribution."},
      {q:"Why does wind ELCC decline as wind penetration grows?",options:["Wind turbines wear out", "Saturation effect \u2014 additional wind adds less incremental reliability", "Wind speeds decrease", "Grid operators limit wind"],answer:1,explain:"When lots of wind is already on the system, more wind doesn't proportionally help reliability."},
      {q:"MOPR in capacity markets refers to:",options:["Market Operations Performance Report", "Minimum Offer Price Rule \u2014 a floor preventing subsidized resources from suppressing prices", "Maximum Output Power Rating", "Market Observer Protocol Requirement"],answer:1,explain:"MOPR prevents state-subsidized resources from artificially depressing capacity prices."},
      {q:"CONE stands for:",options:["Cost of New Entry \u2014 the benchmark cost anchoring capacity auction parameters", "Central Operating Network Entity", "Carbon Offset Net Equivalent", "Capacity Order Notification Event"],answer:0,explain:"CONE sets the target price for new peaking capacity \u2014 anchors the VRR curve."},
      {q:"Which ISO does NOT have a formal capacity market?",options:["PJM", "ISO-NE", "NYISO", "ERCOT"],answer:3,explain:"ERCOT is energy-only \u2014 relies on high energy prices during scarcity instead."},
      {q:"Capacity payments are made to generators for:",options:["Every MWh they produce", "Being available and reliable during peak periods", "Reducing carbon emissions", "Building new transmission"],answer:1,explain:"Capacity = availability payment \u2014 you get paid to be there when needed."},
    ]},
    {id:"5c",title:"Ancillary Services",lesson:"REGULATION (RegA / RegD): sub-minute response to AGC for frequency control. SPINNING RESERVE: online, sync'd, deliver in 10 min. NON-SPIN: offline but startable in 10-30 min. REPLACEMENT/SUPPLEMENTAL: 30-60 min. BLACK START: restart grid from scratch. VOLTAGE SUPPORT: reactive. ERCOT also has ECRS, FFR. Co-optimized with energy in DA + RT clearing.",questions:[
      {q:"Reg vs spin reserve:",options:["Same","Reg = sub-minute AGC; spin = 10-min sync'd reserve","Reg slower","Random"],answer:1,explain:"Time scale defines product."},
      {q:"Black start units:",options:["Always nuclear","Generators able to start without external grid power","First on dispatch","Decommissioned"],answer:1,explain:"Often hydro or aero gas turbines."},
      {q:"Ancillary services co-optimized with:",options:["Capacity","Energy in DA + RT clearing","Carbon","Retail"],answer:1,explain:"Single LP per interval — efficient resource allocation."},
    
      {q:"What is the difference between regulation and spinning reserve?",options:["Regulation is faster \u2014 sub-minute AGC response; spinning reserve responds in 10 min", "Spinning reserve is faster", "They are the same product", "Regulation is offline"],answer:0,explain:"Time scale distinguishes ancillary products \u2014 regulation is the fastest response."},
      {q:"A black start unit can:",options:["Generate the most power", "Start without external grid power to restart the system", "Respond fastest to AGC", "Store the most energy"],answer:1,explain:"Black start capability = restart the grid from scratch after a blackout."},
      {q:"Non-spinning reserve differs from spinning reserve because:",options:["It is cheaper but must start within 30-60 min", "It is offline but startable in 10-30 min", "It never responds", "It is always nuclear"],answer:1,explain:"Non-spin = offline but quickly startable \u2014 cheaper reservation cost than spinning."},
      {q:"Ancillary services are co-optimized with energy because:",options:["It's required by FERC", "Single optimization minimizes total system cost across all products", "It simplifies billing", "Generators prefer it"],answer:1,explain:"Co-optimization ensures resources are allocated to highest-value use across energy + AS."},
      {q:"AGC stands for:",options:["Automatic Generation Control \u2014 sub-minute dispatch signal for frequency regulation", "Average Grid Capacity", "Ancillary Gas Cost", "Annual Generation Certificate"],answer:0,explain:"AGC = the signal that regulation resources respond to for frequency control."},
      {q:"Voltage support (reactive power) is an ancillary service that:",options:["Stores energy", "Controls frequency", "Maintains voltage levels across the grid", "Reduces carbon emissions"],answer:2,explain:"Reactive power management maintains voltage stability \u2014 essential for grid operation."},
      {q:"Which ERCOT-specific ancillary product provides very fast frequency response?",options:["RegD", "ECRS and FFR (Fast Frequency Response)", "Black start", "Non-spin"],answer:1,explain:"ERCOT's FFR and ECRS (Contingency Reserve Service) address its islanded frequency challenges."},
    ]},
    {id:"5d",title:"Gas Storage Trading",lesson:"Storage = optionality. INTRINSIC VALUE: lock with calendar spreads (buy summer, sell winter futures, less holding cost). EXTRINSIC VALUE: re-optimization right as the curve shifts — must be priced via lattice or LSM. Mar-Apr 'widow-maker' spread is the classic cycle bet. Working gas vs cushion (base) gas. Salt = high deliverability, low capacity; reservoir = opposite.",questions:[
      {q:"Intrinsic storage value comes from:",options:["Subsidies","Locking calendar spreads at trade date","Taxes","Random"],answer:1,explain:"Buy summer, sell winter."},
      {q:"Extrinsic storage value:",options:["Random","Optionality / right to re-optimize as forward curve shifts","Capacity payment","Tax credit"],answer:1,explain:"Path-dependent option value."},
      {q:"'Widow-maker' spread =",options:["NG Mar-Apr calendar spread, classic blow-up","Power capacity","Coal-gas switch","Random"],answer:0,explain:"Amaranth (2006) lost $6B+ on it."},
    
      {q:"The 'widow-maker' spread refers to:",options:["Coal-gas switching spread", "The March-April natural gas calendar spread \u2014 historically volatile", "Power-gas basis", "Henry Hub vs Algonquin spread"],answer:1,explain:"Mar-Apr spread = end of winter/start of injection season \u2014 Amaranth lost $6B+ on it in 2006."},
      {q:"Intrinsic storage value is based on:",options:["Future price uncertainty", "Locking in calendar spreads at the trade date", "Weather forecasts", "Government subsidies"],answer:1,explain:"Intrinsic = deterministic lock-in of buy-summer/sell-winter spread."},
      {q:"Extrinsic storage value comes from:",options:["Guaranteed price differentials", "The option to re-optimize as the forward curve changes over time", "Storage capacity payments", "Pipeline tariff savings"],answer:1,explain:"Extrinsic = path-dependent optionality \u2014 the value of future re-optimization rights."},
      {q:"Salt cavern storage is preferred for trading because:",options:["It has the most working gas", "It can cycle multiple times per year with high deliverability", "It is cheapest to build", "It is government subsidized"],answer:1,explain:"High deliverability + multiple turns = ability to trade seasonal and weather swings."},
      {q:"Why must extrinsic storage value be priced using stochastic methods?",options:["Regulation requires it", "It depends on future price paths that are uncertain \u2014 path-dependent option value", "It's simpler than intrinsic", "Traders prefer it"],answer:1,explain:"Re-optimization rights have value that depends on how prices evolve \u2014 must model uncertainty."},
      {q:"Working gas in a storage facility is:",options:["The same as cushion gas", "The gas available for withdrawal and commercial use", "Always in salt caverns", "Fixed by regulators"],answer:1,explain:"Working gas = total capacity minus cushion gas = tradeable volume."},
      {q:"Amaranth Advisors (2006) lost ~$6B primarily on:",options:["LNG cargo trades", "The March-April natural gas spread", "Coal futures", "Power capacity bids"],answer:1,explain:"Classic widow-maker blow-up \u2014 concentrated Mar-Apr NG spread position."},
    ]},
    {id:"5e",title:"Heat Rate, Spark, Dark Spreads",lesson:"HEAT RATE (Btu/kWh) = fuel input per electric output. Best CCGT ~6,400; coal ~10,000; peaker ~9,500-11,000. SPARK SPREAD = Power − HR×Gas − VOM (gas plant gross margin). DARK SPREAD = Power − Coal_HR×Coal − VOM (coal plant). CLEAN spreads include carbon. Heat-Rate Linked option strikes on HR×Gas (avoids fuel-price exposure). Sparks/darks drive coal-to-gas switching.",questions:[
      {q:"Spark spread =",options:["Power × HR","Power − (HR × Gas + VOM)","Coal × HR","Random"],answer:1,explain:"Gas plant gross margin per MWh."},
      {q:"Heat rate units:",options:["MW","Btu/kWh — fuel in per electric out","$ per kWh","Random"],answer:1,explain:"Lower = more efficient."},
      {q:"Coal-to-gas switching when:",options:["Random","Gas drops or carbon rises enough that gas variable cost < coal","Coal banned","FERC orders"],answer:1,explain:"Compare HR×fuel + carbon for each — cheaper dispatches."},
    
      {q:"Spark spread measures:",options:["The cost of coal vs gas", "A gas plant's gross margin: power price minus fuel cost", "Pipeline transportation cost", "Carbon emission cost"],answer:1,explain:"Spark spread = Power \u2212 (HR \u00d7 Gas + VOM) = gas plant gross margin per MWh."},
      {q:"A dark spread measures:",options:["Gas plant margin", "Coal plant gross margin: power minus coal fuel cost", "Nuclear plant margin", "Solar plant margin"],answer:1,explain:"Dark spread = coal plant equivalent of spark spread."},
      {q:"Heat rate units are:",options:["$/MWh", "Btu/kWh \u2014 fuel input per unit of electric output", "MW/MMBtu", "\u00b0F per kWh"],answer:1,explain:"Lower heat rate = more efficient plant = less fuel per MWh."},
      {q:"Coal-to-gas switching occurs when:",options:["Gas prices are higher than coal", "Carbon prices fall", "Gas is cheap enough that gas variable cost beats coal variable cost", "Regulators require it"],answer:2,explain:"The switching price is where HR\u00d7gas + carbon < HR\u00d7coal + carbon for coal."},
      {q:"A heat-rate linked option avoids:",options:["Congestion risk", "Fuel-price exposure \u2014 strike is set as HR \u00d7 gas price", "Credit risk", "Regulatory risk"],answer:1,explain:"HR-linked options move with fuel prices \u2014 useful for hedging spark spread without basis risk."},
      {q:"A best CCGT plant has a heat rate of approximately:",options:["3,000 Btu/kWh", "6,400 Btu/kWh", "10,000 Btu/kWh", "15,000 Btu/kWh"],answer:1,explain:"~6,400 Btu/kWh = ~58-63% efficiency \u2014 best combined-cycle thermal performance."},
      {q:"Clean spark spread includes:",options:["Only fuel costs", "Carbon costs in addition to fuel costs", "Transmission costs", "All operating expenses"],answer:1,explain:"Clean spread adds carbon allowance cost \u2014 important in cap-and-trade markets."},
    ]},
    {id:"5f",title:"FTRs / CRRs / TCCs",lesson:"Same product, different ISO names. FTR (Financial Transmission Right, PJM/MISO/ISO-NE/SPP). CRR (Congestion Revenue Right, CAISO/ERCOT). TCC (Transmission Congestion Contract, NYISO). Pays/charges hourly DA congestion-price difference between source and sink × MW awarded. Hedges location-spread risk OR speculates on congestion. ISO holds quarterly auctions; revenue from real-time congestion charges funds payouts.",questions:[
      {q:"FTR settles on:",options:["Energy LMP","Hourly DA congestion-price difference between source and sink × MW","Capacity","Carbon"],answer:1,explain:"Pure congestion-spread instrument."},
      {q:"CRR vs FTR vs TCC:",options:["Different products","Same product, different ISO names (CAISO/ERCOT vs PJM/MISO vs NYISO)","FTR is biggest","Random"],answer:1,explain:"Standardized concept across ISOs."},
      {q:"FTR auctions held:",options:["Annually","Quarterly (with monthly/seasonal variants)","Daily","Never"],answer:1,explain:"Plus annual long-term and monthly short-term."},
    
      {q:"FTR stands for:",options:["Forward Transmission Rate", "Financial Transmission Right \u2014 hedges or speculates on nodal congestion", "Federal Tariff Requirement", "Fuel Transport Reservation"],answer:1,explain:"FTRs pay/charge the congestion price difference between source and sink."},
      {q:"A CRR (Congestion Revenue Right) in CAISO is equivalent to:",options:["A pipeline tariff", "An FTR in other ISOs \u2014 same concept, different ISO name", "A capacity product", "A renewable credit"],answer:1,explain:"CRR = CAISO/ERCOT name for the same nodal congestion hedge as FTR."},
      {q:"FTR auctions are held:",options:["Daily", "Monthly and quarterly (with annual long-term auctions)", "Only annually", "Never \u2014 FTRs are allocated only"],answer:1,explain:"Multiple auction windows: annual, monthly, and quarterly \u2014 different tenors."},
      {q:"An FTR holder benefits when:",options:["The grid is uncongested", "Congestion develops between the FTR source and sink", "Energy prices fall", "Capacity markets tighten"],answer:1,explain:"FTR pays the congestion spread \u2014 holder profits from congestion on their source-sink path."},
      {q:"TCC (Transmission Congestion Contract) is the NYISO name for:",options:["A pipeline product", "The FTR/CRR equivalent \u2014 nodal congestion hedge", "A capacity product", "A carbon credit"],answer:1,explain:"TCC = NYISO's version of the same financial congestion right."},
      {q:"FTR revenue comes from:",options:["Generator fuel savings", "ISO congestion charge collections distributed to FTR holders", "Retail rate surcharges", "Capacity market surplus"],answer:1,explain:"ISOs collect congestion revenue and pay it to FTR holders \u2014 revenue adequacy."},
      {q:"A source-to-sink FTR pays positive when:",options:["Source price > sink price", "Sink price > source price (congestion into the sink)", "Prices are equal", "The line is uncongested"],answer:1,explain:"FTR = (Sink LMP \u2212 Source LMP) \u00d7 MW \u2014 positive when sink is more expensive."},
    ]},
    {id:"5g",title:"Hedging Basics",lesson:"PRODUCER hedge: short futures locks sale price. CONSUMER hedge: long futures locks purchase. CROSS-HEDGE: hedge with imperfect substitute (e.g., HH for non-HH gas). BASIS RISK: residual after cross-hedge. Hedge ratios: minimum-variance using realized correlation. FAS 133 / IFRS 9: hedge accounting requires effectiveness testing. Effective hedge → defer PnL to OCI; ineffective → mark to P&L.",questions:[
      {q:"Producer hedge:",options:["Long futures","Short futures (locks sale price)","Long calls","Random"],answer:1,explain:"Sells future production forward."},
      {q:"Basis risk =",options:["FX risk","Residual price risk after cross-hedging with imperfect substitute","Federal tax","Random"],answer:1,explain:"Local hub vs futures-delivery point."},
      {q:"Hedge accounting (effective):",options:["P&L immediately","Deferred to OCI; recognized when hedged item flows","Always P&L","Never"],answer:1,explain:"FAS 133 / IFRS 9 effectiveness test."},
    
      {q:"A producer's hedge involves:",options:["Buying futures", "Selling futures to lock in a sale price", "Buying calls", "Holding physical inventory"],answer:1,explain:"Producer shorts futures \u2014 locking future production at today's forward price."},
      {q:"Basis risk in hedging refers to:",options:["Credit risk", "The risk that the hedge instrument doesn't perfectly track the hedged exposure", "Interest rate risk", "Volumetric risk"],answer:1,explain:"Cross-hedging with HH futures leaves basis risk if your location differs."},
      {q:"Under FAS 133 / IFRS 9, an effective hedge allows:",options:["Immediate P&L recognition", "Deferral of gains/losses to OCI until the hedged item flows", "No accounting treatment", "Mark-to-market only"],answer:1,explain:"Hedge accounting defers PnL volatility \u2014 must pass effectiveness testing."},
      {q:"A consumer's hedge involves:",options:["Selling futures", "Buying futures to lock in a purchase price", "Selling puts", "No hedging needed"],answer:1,explain:"Consumer goes long futures \u2014 locks in purchase price against rising prices."},
      {q:"OCI stands for:",options:["Oil Cost Index", "Other Comprehensive Income \u2014 where effective hedge PnL is deferred", "Operational Cost Indicator", "Open Contract Interest"],answer:1,explain:"Effective hedge PnL goes to OCI, recognized when the hedged transaction occurs."},
      {q:"The minimum-variance hedge ratio uses:",options:["Always 1:1", "The correlation between the hedge instrument and the exposure", "Random selection", "Regulatory guidelines"],answer:1,explain:"Optimal hedge ratio minimizes residual variance using realized correlation."},
      {q:"An ineffective hedge under FAS 133 results in:",options:["Deferral to OCI", "Immediate mark-to-market through P&L", "No accounting entry", "Tax exemption"],answer:1,explain:"Failed effectiveness test = gains/losses flow through income statement immediately."},
    ]},
    {id:"5h",title:"Power Flow & Load Flow",lesson:"LOAD FLOW (Power Flow) finds the voltage at each bus given known generation and load. The standard iterative method (Gauss-Seidel):\n\n(1) ASSUME initial voltage = rated (e.g. 100V)\n(2) CALCULATE load current: I = S* / V* (complex power / conjugate of voltage)\n(3) COMPUTE bus voltage: V_load = V_source − Z_line × I_load\n(4) CHECK convergence: % Change = |V_new − V_old| / V_nominal × 100%\n(5) If % change > threshold, repeat from step 2\n\nExample: 100V source, 1Ω line, 1kW load:\n• Iteration 1: I = 1000/100 = 10A → V = 100 − (1)(10) = 90V (10% change)\n• Iteration 2: I = 1000/90 = 11.11A → V = 100 − (1)(11.11) = 88.89V (1.1% change)\n• Iteration 3: I = 1000/88.89 = 11.25A → V = 100 − (1)(11.25) = 88.75V (0.14% change)\n• Converges to ≈ 88.7V",questions:[
      {q:"In load flow, load current is calculated as:",options:["V / Z","S* / V*","P × R","V × I"],answer:1,explain:"I = S*/V* — complex power divided by conjugate of voltage."},
      {q:"With 100V source, 1Ω line, 1kW load — voltage at node B after iteration 1:",options:["100V","95V","90V","85V"],answer:2,explain:"I = 1000/100 = 10A; V = 100 − (1)(10) = 90V."},
      {q:"Load current in iteration 2 (after V=90V):",options:["10A","10.5A","11.11A","12A"],answer:2,explain:"I = S*/V* = 1000/90 = 11.11A — current rises as voltage drops."},
      {q:"Voltage at node B after iteration 2:",options:["90V","88.89V","87.5V","85V"],answer:1,explain:"V = 100 − (1)(11.11) = 88.89V. % change = 1.1% — not yet converged."},
      {q:"Why does load current increase each iteration?",options:["Line resistance grows","Voltage drops so more current needed to deliver same power","Source voltage falls","Random variation"],answer:1,explain:"Constant power load: P = V × I. As V drops, I must rise to maintain 1kW."},
      {q:"Load flow iteration stops when:",options:["After exactly 3 steps","% voltage change falls below convergence threshold","Current exceeds limit","Voltage reaches zero"],answer:1,explain:"Convergence criterion: |V_new − V_old| / V_nominal < threshold (e.g. 0.1%)."},
    
      {q:"Load flow analysis finds:",options:["Fuel costs at each generator", "Voltage at each bus given known generation and load", "Transmission line ownership", "Carbon emissions per node"],answer:1,explain:"Load flow = the fundamental power systems calculation \u2014 find voltages given P and Q."},
      {q:"In Gauss-Seidel iteration, what is the first step?",options:["Calculate the final answer", "Assume initial voltage = rated (e.g. 100V)", "Measure actual grid voltage", "Set load to zero"],answer:1,explain:"Iteration starts with an initial guess (flat start = rated voltage everywhere)."},
      {q:"Why does load current increase in each iteration of load flow?",options:["Line resistance grows", "Voltage drops so more current is needed to deliver constant power", "Source voltage increases", "Random numerical error"],answer:1,explain:"Constant power load: P = V \u00d7 I. As V drops, I must rise to maintain the same power."},
      {q:"Convergence in load flow iteration is achieved when:",options:["After exactly 10 steps", "The percentage voltage change between iterations falls below a threshold", "Current exceeds the line rating", "Voltage reaches zero"],answer:1,explain:"Iterate until \u0394V/V_nominal < threshold (e.g. 0.1%) \u2014 solution has converged."},
      {q:"Load current is calculated as:",options:["V / Z (Ohm's law)", "S* / V* (complex power / conjugate of voltage)", "P \u00d7 R", "I \u00d7 R"],answer:1,explain:"For complex power loads: I = S*/V* \u2014 conjugate notation handles reactive power correctly."},
      {q:"In the example (100V source, 1\u03a9 line, 1kW load), after convergence voltage is approximately:",options:["100V", "95V", "88.7V", "80V"],answer:2,explain:"Iterative solution converges to ~88.7V \u2014 significantly below source voltage due to line drop."},
      {q:"The Gauss-Seidel method is classified as:",options:["A direct solution method", "An iterative method that updates variables sequentially", "A Monte Carlo simulation", "A statistical regression"],answer:1,explain:"Gauss-Seidel updates each variable using the latest available values \u2014 iterative, not direct."},
    ]},
  ]},
  6:{name:"GRADUATE",grade:"Quant / Practitioner",tag:"L6",modules:[
    {id:"6a",title:"Real Options & Storage Valuation",lesson:"INTRINSIC: lock-in value with calendar spreads at trade date (deterministic). EXTRINSIC: re-optimization optionality requires path-dependent valuation. Approaches: LSM (Longstaff-Schwartz Monte Carlo) regresses continuation values on basis functions. STOCHASTIC DP (lattice / Bellman backward induction). Spot/forward dynamics: 2-factor mean-reverting (Schwartz-Smith), GBM-jump for spikes. Ratchets / injection-withdrawal capacity constraints make this a constrained stochastic control problem.",questions:[
      {q:"LSM stands for:",options:["Linear Stochastic Model","Longstaff-Schwartz Monte Carlo (regression-based path-dependent valuation)","Local State Memory","Random"],answer:1,explain:"Standard method for path-dependent options."},
      {q:"Schwartz-Smith model:",options:["1-factor","2-factor mean-reverting forward-curve model for commodities","Black-Scholes variant","Random"],answer:1,explain:"Short-term + long-term factors."},
      {q:"Storage as control problem:",options:["Static","Constrained stochastic control with injection/withdrawal capacity bounds","Trivial","Federal mandate"],answer:1,explain:"Bellman backward induction or LSM."},
    
      {q:"LSM stands for:",options:["Linear Stochastic Model", "Longstaff-Schwartz Monte Carlo \u2014 regression-based valuation of path-dependent options", "Local Storage Method", "Least-Squares Metric"],answer:1,explain:"LSM regresses continuation values on basis functions to value American/Bermudan options."},
      {q:"Storage valuation is a stochastic control problem because:",options:["Storage is regulated", "Injection/withdrawal decisions depend on uncertain future prices with capacity constraints", "Gas prices are fixed", "Storage operators prefer it"],answer:1,explain:"Bellman's principle: optimal decisions at each step given uncertain future \u2014 classic control problem."},
      {q:"The Schwartz-Smith model uses how many factors?",options:["1", "2", "3", "5"],answer:1,explain:"Two factors: short-term mean-reverting + long-term equilibrium level."},
      {q:"Intrinsic storage value can be locked in by:",options:["Buying spot gas", "Calendar spread trades at the time of valuation", "Monte Carlo simulation", "Waiting for prices to move"],answer:1,explain:"Buy cheaper summer months, sell winter forward \u2014 lock intrinsic at trade date."},
      {q:"Jump processes in gas price models capture:",options:["Seasonal patterns", "Sudden large price spikes (e.g. from weather events or supply disruptions)", "Mean reversion", "Long-term trends only"],answer:1,explain:"Jumps = discrete large moves \u2014 essential for modeling winter NE gas or power spikes."},
      {q:"Bellman backward induction in storage valuation:",options:["Starts at maturity and works backward to find optimal policy", "Starts at inception and projects forward", "Uses Monte Carlo simulation only", "Requires LSM"],answer:0,explain:"Backward dynamic programming: solve from terminal condition backward to find optimal decisions."},
      {q:"Storage injection/withdrawal capacity constraints make the problem:",options:["Simpler than a vanilla option", "A constrained stochastic control problem", "Linear and solvable analytically", "Identical to a European option"],answer:1,explain:"Physical limits on flow rates create inequality constraints \u2014 non-trivial optimization."},
    ]},
    {id:"6b",title:"Structured Products",lesson:"HEAT-RATE CALL: max(P − HR×G − VOM, 0) = spark-spread call. Priced via Margrabe (zero-strike) or Kirk's approximation. SWING / TAKE-OR-PAY GAS: vary daily within DCQ min/max bounds, MAQ floor — pure path-dependent. INDEX-PLUS-BASIS: NYMEX HH ± fixed adder. WEATHER DERIVATIVES: HDD/CDD swaps. LOAD-FOLLOWING: Σ Loadₜ × LMPₜ + shape-risk premium. Each decomposes to vanilla replicating components for hedging.",questions:[
      {q:"Margrabe formula prices:",options:["Vanilla calls","Zero-strike spread option between two GBM assets (closed-form)","Bonds","Asian"],answer:1,explain:"Spread of two correlated GBMs at zero strike."},
      {q:"Kirk's approximation extends Margrabe to:",options:["FX","Non-zero strikes","Equities","Bonds"],answer:1,explain:"Approximate but widely used for spark-spread strikes."},
      {q:"Swing option payoff is:",options:["Linear","Path-dependent — depends on holder's daily take pattern subject to bounds","European-style","Always zero"],answer:1,explain:"Pure path-dependent option."},
    
      {q:"A heat-rate call option pays:",options:["Fixed rate of return", "max(Power \u2212 HR\u00d7Gas \u2212 VOM, 0) \u2014 the spark spread option payoff", "Gas price appreciation", "Carbon credits"],answer:1,explain:"Heat-rate call = spark spread call \u2014 toller's profit when power exceeds fuel cost."},
      {q:"Margrabe's formula prices:",options:["Standard Black-Scholes calls", "Zero-strike spread options between two GBM assets", "Bond options", "Currency forwards"],answer:1,explain:"Margrabe = exchange one asset for another \u2014 closed-form for zero-strike spreads."},
      {q:"Kirk's approximation extends spread option pricing to:",options:["Three underlyings", "Non-zero strike prices", "American exercise", "Path-dependent payoffs"],answer:1,explain:"Kirk approximates non-zero strike spread options \u2014 widely used for spark spreads."},
      {q:"A swing option's payoff depends on:",options:["Only the final price", "The holder's daily take decisions subject to volume bounds \u2014 path-dependent", "A single exercise date", "Only the average price"],answer:1,explain:"Swing = path-dependent; payoff depends on sequence of daily volume decisions."},
      {q:"A Take-or-Pay (ToP) contract includes:",options:["No minimum obligation", "A minimum annual quantity (MAQ) the buyer must pay for or take", "Unlimited volume at fixed price", "Daily volume only"],answer:1,explain:"ToP = buyer pays for MAQ whether taken or not \u2014 downside volume protection for seller."},
      {q:"An HDD swap pays based on:",options:["Heating equipment costs", "Heating Degree Days relative to a strike \u2014 hedges gas heating demand exposure", "Hot day discounts", "Hub differential"],answer:1,explain:"HDD = max(65\u00b0F \u2212 avg temp, 0) per day \u2014 swap pays HDD \u00d7 notional vs strike."},
      {q:"A load-following power contract exposes the seller to:",options:["Fixed payment risk only", "Shape risk \u2014 load varies and must be matched at LMP", "Capacity market risk", "No market risk"],answer:1,explain:"Load-following = serve whatever load shows up; shape uncertainty = the key risk."},
    ]},
    {id:"6c",title:"Risk Metrics & Portfolio",lesson:"VaR (95%, 99%): loss threshold not exceeded with given probability over horizon. Limitations: doesn't capture tail magnitude; not sub-additive. CVaR / Expected Shortfall: average loss given loss > VaR — coherent. STRESS / SCENARIO TESTS: specific shocks (Storm Uri, Polar Vortex, hurricane). PFE: forward-looking credit exposure. CVA: discount derivative value for counterparty default risk. WRONG-WAY RISK: counterparty exposure rises as their credit deteriorates.",questions:[
      {q:"CVaR vs VaR:",options:["Same","CVaR averages losses BEYOND VaR — captures tail magnitude; coherent","VaR is bigger","Random"],answer:1,explain:"Why CVaR is preferred for tail-heavy commodities."},
      {q:"Wrong-way risk:",options:["Random","Counterparty exposure rises as their credit deteriorates","FX-only","Right-side gain"],answer:1,explain:"Producer/consumer hedges in stress."},
      {q:"PFE =",options:["Past exposure","Potential Future Exposure — forward-looking credit metric","Just CVA","Capacity"],answer:1,explain:"Combined with CVA/DVA for credit-risk pricing."},
    
      {q:"VaR at 95% over 1 day means:",options:["Maximum possible loss", "Loss will not exceed this level on 95 out of 100 days", "Average loss", "Expected profit"],answer:1,explain:"VaR = threshold not exceeded with the given confidence level over the horizon."},
      {q:"CVaR is preferred over VaR for commodities because:",options:["It is simpler to calculate", "It captures average tail loss magnitude \u2014 coherent and sensitive to tail shape", "Regulators require it", "It is always lower"],answer:1,explain:"VaR ignores what happens in the tail; CVaR averages losses beyond VaR."},
      {q:"PFE (Potential Future Exposure) is used for:",options:["Daily trading P&L", "Forward-looking credit risk measurement", "Historical simulation", "Retail pricing"],answer:1,explain:"PFE = expected future exposure to counterparty default at future time points."},
      {q:"CVA stands for:",options:["Commodity Value Adjustment", "Credit Valuation Adjustment \u2014 discount for counterparty default risk", "Carbon Value Assessment", "Contract Volatility Analysis"],answer:1,explain:"CVA = the cost of counterparty default risk embedded in a derivative's value."},
      {q:"Wrong-way risk occurs when:",options:["A trade goes against you", "Counterparty exposure rises as their creditworthiness deteriorates", "Prices move favorably", "Volatility falls"],answer:1,explain:"Wrong-way = bad correlation between exposure and counterparty credit quality."},
      {q:"VaR is NOT sub-additive, meaning:",options:["Portfolio VaR always equals sum of individual VaRs", "Portfolio VaR can exceed the sum of individual VaRs \u2014 diversification not guaranteed", "VaR is always zero for portfolios", "VaR cannot be calculated for portfolios"],answer:1,explain:"Non-sub-additivity: VaR(A+B) can > VaR(A) + VaR(B) \u2014 a key theoretical weakness."},
      {q:"Stress testing in energy portfolios typically involves:",options:["Historical average scenarios", "Specific extreme scenarios like Storm Uri, Polar Vortex, or hurricanes", "Random price draws", "Regulatory minimum tests only"],answer:1,explain:"Named stress scenarios capture tail risks that VaR/CVaR parametric models may miss."},
    ]},
    {id:"6d",title:"LNG & Cross-Commodity Arbitrage",lesson:"US LNG terminals (Sabine, Cameron, Corpus, Freeport, Calcasieu, Plaquemines, Rio Grande) link HH to JKM (NE Asia) and TTF (Europe). Rough arb: HH × 1.15 + ~$2.50 liquefaction toll + ~$1-2 shipping/regas ≈ landed cost. Below this, cargoes can cancel ($2-3 toll is sunk). COAL-GAS switching. OIL-GAS: 6:1 BOE link broke post-shale (now 30-50:1). CARBON: $10/ton CO₂ ≈ +$0.40/MMBtu equiv on a CCGT.",questions:[
      {q:"US LNG-Europe rough arb breakeven (vs $3 HH):",options:["$0.50","$5-7/MMBtu landed","$50","Always profitable"],answer:1,explain:"1.15× HH + ~$2.5 toll + shipping/regas."},
      {q:"JKM benchmarks LNG for:",options:["Gulf","NW Europe","NE Asia (Japan/Korea)","Brazil"],answer:2,explain:"Platts JKM = Asia LNG spot."},
      {q:"Why did 6:1 oil-gas BOE link break?",options:["OPEC","Shale gas decoupled US gas — abundance pushed gas to its own marginal cost","Carbon","EVs"],answer:1,explain:"Post-2008 shale broke the soft floor."},
    
      {q:"The rough LNG export arbitrage breakeven from US to Europe (at $3 HH) is approximately:",options:["$3.50/MMBtu", "$5-7/MMBtu landed", "$10/MMBtu", "Always profitable"],answer:1,explain:"1.15 \u00d7 HH + ~$2.50 liquefaction + ~$1-2 shipping/regas = $5-7 landed."},
      {q:"JKM is the benchmark for:",options:["US Henry Hub gas", "Northwest European gas (TTF)", "Northeast Asian LNG spot prices", "US power"],answer:2,explain:"Platts JKM (Japan Korea Marker) = the Asian LNG spot reference price."},
      {q:"TTF is the benchmark for:",options:["US Henry Hub", "Northwest European natural gas", "Northeast Asian LNG", "US power"],answer:1,explain:"TTF (Title Transfer Facility) = Netherlands-based European gas hub and benchmark."},
      {q:"Why did the traditional 6:1 oil-gas BTU parity break after 2008?",options:["OPEC production cuts", "US shale gas abundance pushed gas to its own marginal cost independent of oil", "Carbon taxes separated them", "LNG exports linked them"],answer:1,explain:"Shale decoupled US gas from oil \u2014 30-50:1 BTU ratios became common post-shale."},
      {q:"A $10/ton increase in carbon price is roughly equivalent to a gas price increase of approximately:",options:["$0.04/MMBtu", "$0.40/MMBtu", "$4.00/MMBtu", "$40/MMBtu"],answer:1,explain:"~$0.40/MMBtu for a CCGT at ~6,400 Btu/kWh and ~0.12 tons CO\u2082/MMBtu gas."},
      {q:"US LNG export terminals include:",options:["Only Sabine Pass", "Sabine, Cameron, Corpus, Freeport, Calcasieu, and others", "Only Gulf Coast terminals", "Only East Coast terminals"],answer:1,explain:"Multiple terminals now \u2014 US became world's largest LNG exporter in recent years."},
      {q:"Coal-to-gas switching affects LNG markets because:",options:["LNG is used for coal", "Higher carbon prices make gas more competitive, increasing gas demand globally", "LNG terminals burn coal", "Switching only affects US markets"],answer:1,explain:"Carbon pricing changes the gas-coal competitive balance \u2014 global LNG demand sensitive to this."},
    ]},
    {id:"6e",title:"Structured Power & Gas Deals",lesson:"PRICING toolkits: Black-76 (forward-lognormal commodity options), Margrabe / Kirk (spread), LSM / lattice (path-dependent). HEDGING: decompose to vanilla, dynamically delta-hedge, monitor cross-gamma in spread books. VOL SURFACE: NG shows winter right-skew, calendar humps. STRUCTURING: heat-rate calls, swing options, full-requirements with shape risk, weather derivatives, asset-backed trading. CREDIT: ISDA + CSA + IM/VM; cleared products reduce counterparty risk via CCP novation.",questions:[
      {q:"Black-76 used for:",options:["Equities","European options on forwards/futures (commodity workhorse)","Bonds","FX"],answer:1,explain:"Lognormal forward; standard commodity-options model."},
      {q:"HDD swap:",options:["Hot-Day Discount","Pays based on Heating Degree Days vs strike — gas-heating exposure hedge","Hard drive","Hub differential"],answer:1,explain:"HDD = max(65°F − avg daily temp, 0)."},
      {q:"CCP novation:",options:["Random","Cleared trade replaces bilateral counterparty with central clearinghouse","ISDA term","Tax form"],answer:1,explain:"Reduces credit exposure to a single regulated entity."},
      {q:"Cross-gamma in spread options:",options:["Doesn't exist","Sensitivity of one delta to changes in the other underlying — material for spark hedging","FX-only","Always zero"],answer:1,explain:"Why spread books need 2D scenario PnL."},
    
      {q:"Black-76 is used for pricing:",options:["Equity options", "European options on forwards/futures \u2014 the standard commodity options model", "Bond options only", "FX forwards"],answer:1,explain:"Black-76 = lognormal forward model \u2014 workhorse for commodity option pricing."},
      {q:"CCP novation means:",options:["Two parties agree bilaterally", "A cleared trade replaces the bilateral counterparty with a central clearinghouse", "Counterparty default", "Contract renegotiation"],answer:1,explain:"Clearing = novation to CCP \u2014 both sides face the clearinghouse, reducing bilateral credit risk."},
      {q:"Cross-gamma in a spread book is:",options:["Not relevant", "The sensitivity of one asset's delta to changes in the other asset's price", "Pure gamma of one leg", "Always zero for gas/power"],answer:1,explain:"In spark spread books, power and gas moves interact \u2014 cross-gamma is material for hedging."},
      {q:"Initial margin (IM) in cleared derivatives is posted to:",options:["The counterparty directly", "The central clearinghouse to cover potential future exposure", "FERC", "The exchange only"],answer:1,explain:"IM at CCP protects against default between VM calls \u2014 regulatory requirement post-Dodd-Frank."},
      {q:"Variation margin (VM) in cleared derivatives represents:",options:["Initial collateral", "Daily mark-to-market settlement flows between counterparties via the CCP", "Fixed payments", "Carbon offsets"],answer:1,explain:"VM = daily PnL settlement \u2014 keeps cleared books marked to market continuously."},
      {q:"The volatility surface for natural gas options typically shows:",options:["Flat volatility across strikes and tenors", "Winter right-skew and seasonal calendar humps", "Summer peaks only", "No seasonal pattern"],answer:1,explain:"Gas vol surface reflects winter demand uncertainty and storage optionality \u2014 heavily seasonal."},
      {q:"Decomposing a complex structured product into vanilla replicating components allows:",options:["Avoiding all hedging", "Dynamic delta-hedging with liquid vanilla instruments", "Eliminating all risk", "Regulatory exemption"],answer:1,explain:"Replication = express exotic payoff as portfolio of vanillas \u2014 then hedge with liquid instruments."},
    ]},
  ]},
};

const PLACEMENT=[
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

const defaultProgress={placed:false,level:1,completed:{},triviaHigh:0,totalAnswered:0,totalCorrect:0,timeSpentSeconds:0,currentModule:null,currentQuestion:0,currentAnswers:[],placementIdx:0,placementPicks:[],placementScore:null};

function fmtTime(s){if(!s)return"0m";const h=Math.floor(s/3600),m=Math.floor((s%3600)/60);return h>0?`${h}h ${m}m`:`${m}m`;}

function shuffleQuestion(q){
  // Create array of [option, isCorrect] pairs and shuffle
  const pairs=q.options.map((o,i)=>({text:o,correct:i===q.answer}));
  for(let i=pairs.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pairs[i],pairs[j]]=[pairs[j],pairs[i]];}
  return{
    ...q,
    options:pairs.map(p=>p.text),
    answer:pairs.findIndex(p=>p.correct),
  };
}

// UI ATOMS
const Pill=({children,color="lime"})=>{const c={lime:"border-lime-500 text-lime-400",amber:"border-amber-500 text-amber-400",cyan:"border-cyan-500 text-cyan-400",fuchsia:"border-fuchsia-500 text-fuchsia-400",rose:"border-rose-500 text-rose-400",zinc:"border-zinc-600 text-zinc-400"};return <span className={`inline-block px-1.5 py-0.5 border font-mono text-[10px] uppercase tracking-wider ${c[color]||c.zinc}`}>{children}</span>;};
const Btn=({children,onClick,variant="primary",className="",disabled=false})=>{const v={primary:"bg-lime-400 text-black border-lime-400 hover:bg-lime-300",ghost:"border-zinc-700 text-zinc-300 hover:border-lime-500 hover:text-lime-400"};return <button onClick={onClick} disabled={disabled} className={`px-3 py-1.5 border font-mono text-xs uppercase tracking-wider transition-colors ${disabled?"opacity-30 cursor-not-allowed":"cursor-pointer"} ${v[variant]||v.primary} ${className}`}>{children}</button>;};
const Panel=({title,accent="lime",children,className=""})=>{const a={lime:"border-lime-700",amber:"border-amber-700",cyan:"border-cyan-700",fuchsia:"border-fuchsia-700",rose:"border-rose-700",zinc:"border-zinc-700"};const t={lime:"text-lime-400",amber:"text-amber-400",cyan:"text-cyan-400",fuchsia:"text-fuchsia-400",rose:"text-rose-400",zinc:"text-zinc-400"};return <div className={`border ${a[accent]||a.zinc} bg-zinc-950/60 p-4 ${className}`}>{title&&<div className={`font-mono text-[10px] uppercase tracking-[0.2em] mb-3 ${t[accent]||t.zinc}`}>▸ {title}</div>}{children}</div>;};

// LANDING
function LandingPage({onLogin}){
  const [expanded,setExpanded]=useState(null);
  const colors=["lime","lime","amber","amber","cyan","fuchsia"];
  const toggle=(lvl)=>setExpanded(expanded===lvl?null:lvl);
  return(
    <div className="min-h-screen bg-black text-zinc-100" style={{backgroundImage:"radial-gradient(circle at 20% 30%, rgba(132,204,22,0.04), transparent 50%)"}}>
      <header className="border-b border-zinc-800 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3"><Zap size={18} className="text-lime-400"/><Flame size={18} className="text-amber-400"/><span className="font-mono text-sm tracking-wider">NGPX//ACADEMY</span><Pill color="zinc">v3</Pill></div>
        <Btn onClick={onLogin} variant="primary">▸ LOGIN</Btn>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="font-mono text-xs text-lime-400 uppercase tracking-[0.3em] mb-4">US Power & Natural Gas</div>
          <h1 className="font-mono text-4xl font-bold text-zinc-100 mb-4">NGPX//ACADEMY</h1>
          <p className="font-mono text-zinc-400 text-sm max-w-xl mx-auto leading-relaxed">Professional training curriculum for energy traders, analysts, and practitioners — from fundamentals through graduate-level quant methods.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {[["34","Modules"],["340+","Questions"],["11","Topic Areas"],["6","Difficulty Tiers"]].map(([n,l])=>(
            <div key={l} className="border border-zinc-800 bg-zinc-950/60 p-4 text-center font-mono"><div className="text-2xl font-bold text-lime-400">{n}</div><div className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">{l}</div></div>
          ))}
        </div>
        <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider mb-3">▸ Click a tier to see modules</div>
        <div className="space-y-3 mb-12">
          {Object.entries(CURRICULUM).map(([lvl,data])=>{
            const color=colors[parseInt(lvl)-1]||"zinc";
            const isOpen=expanded===lvl;
            const borderColors={lime:"border-lime-700",amber:"border-amber-700",cyan:"border-cyan-700",fuchsia:"border-fuchsia-700",zinc:"border-zinc-700"};
            const textColors={lime:"text-lime-400",amber:"text-amber-400",cyan:"text-cyan-400",fuchsia:"text-fuchsia-400",zinc:"text-zinc-400"};
            return(
              <div key={lvl} className={`border ${isOpen?borderColors[color]:"border-zinc-800"} bg-zinc-950/60 transition-colors`}>
                <button onClick={()=>toggle(lvl)} className="w-full p-4 font-mono text-left flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Pill color={color}>{data.tag}</Pill>
                    <span className="text-zinc-100 text-sm font-bold">{data.name}</span>
                    <span className="text-[10px] text-zinc-600 hidden md:inline">{data.grade}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-zinc-500">{data.modules.length} modules · {data.modules.flatMap(m=>m.questions).length} questions</span>
                    <span className={`text-xs ${textColors[color]}`}>{isOpen?"▲":"▼"}</span>
                  </div>
                </button>
                {isOpen&&(
                  <div className="border-t border-zinc-800 px-4 pb-4 pt-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {data.modules.map(m=>(
                        <div key={m.id} className="flex items-start gap-2 p-2 border border-zinc-900 bg-zinc-900/40">
                          <span className={`text-[10px] font-bold ${textColors[color]} mt-0.5 shrink-0`}>{m.id}</span>
                          <div>
                            <div className="text-zinc-200 text-xs font-medium">{m.title}</div>
                            <div className="text-[10px] text-zinc-600 mt-0.5">{m.questions.length} questions · {MODULE_TOPIC[m.id]||""}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="border border-zinc-800 bg-zinc-950/60 p-8 text-center font-mono">
          <div className="text-zinc-400 text-sm mb-2">Access is by invitation only.</div>
          <div className="text-zinc-500 text-xs mb-6">Already have an account? Log in to resume your progress.</div>
          <Btn onClick={onLogin} variant="primary" className="text-sm px-6 py-2">▸ LOGIN TO YOUR ACCOUNT</Btn>
          <div className="mt-4 text-[10px] text-zinc-600">No account? Contact your administrator to request access.</div>
        </div>
      </main>
      <footer className="border-t border-zinc-900 px-6 py-4 font-mono text-xs text-zinc-600 text-center">NGPX//ACADEMY · Invite-only · Not financial advice</footer>
    </div>
  );
}

// LOGIN
function LoginPage({onBack,onSuccess}){
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [showReset,setShowReset]=useState(false);
  const [resetSent,setResetSent]=useState(false);

  const login=async()=>{
    if(!email||!password){setError("Email and password required.");return;}
    setLoading(true);setError("");
    const{error:e}=await supabase.auth.signInWithPassword({email,password});
    setLoading(false);
    if(e)setError(e.message);else onSuccess();
  };

  const sendReset=async()=>{
    if(!email){setError("Enter your email first.");return;}
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin});
    setLoading(false);setResetSent(true);
  };

  return(
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3"><Zap size={20} className="text-lime-400"/><Flame size={20} className="text-amber-400"/></div>
          <div className="font-mono text-lg tracking-wider text-zinc-100">NGPX//ACADEMY</div>
          <div className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest mt-1">Secure Access</div>
        </div>
        <Panel accent="lime">
          {!showReset?(
            <div className="space-y-3 font-mono">
              <div><div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Email</div><input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 px-3 py-2 text-xs font-mono focus:border-lime-500 outline-none" placeholder="your@email.com" onKeyDown={e=>e.key==="Enter"&&login()}/></div>
              <div><div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Password</div><input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 px-3 py-2 text-xs font-mono focus:border-lime-500 outline-none" placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&login()}/></div>
              {error&&<div className="text-rose-400 text-xs">{error}</div>}
              <Btn onClick={login} variant="primary" disabled={loading} className="w-full justify-center">{loading?"LOGGING IN...":"▸ LOGIN"}</Btn>
              <button onClick={()=>setShowReset(true)} className="text-[10px] text-zinc-500 hover:text-zinc-300 font-mono uppercase tracking-wider w-full text-center mt-2">Forgot password?</button>
            </div>
          ):(
            <div className="space-y-3 font-mono">
              <div className="text-xs text-zinc-400">Enter your email to receive a reset link.</div>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 px-3 py-2 text-xs font-mono focus:border-lime-500 outline-none" placeholder="your@email.com"/>
              {resetSent&&<div className="text-lime-400 text-xs">▸ Reset link sent — check your email.</div>}
              {error&&<div className="text-rose-400 text-xs">{error}</div>}
              <Btn onClick={sendReset} disabled={loading||resetSent} className="w-full justify-center">{loading?"SENDING...":"SEND RESET LINK"}</Btn>
              <button onClick={()=>{setShowReset(false);setResetSent(false);setError("");}} className="text-[10px] text-zinc-500 hover:text-zinc-300 font-mono uppercase tracking-wider w-full text-center">← Back to login</button>
            </div>
          )}
        </Panel>
        <div className="text-center mt-4"><button onClick={onBack} className="font-mono text-[10px] text-zinc-600 hover:text-zinc-400 uppercase tracking-wider flex items-center gap-1 mx-auto"><ArrowLeft size={10}/> Back to home</button></div>
        <div className="text-center mt-3 font-mono text-[10px] text-zinc-700">No account? Contact your administrator.</div>
      </div>
    </div>
  );
}

// ADMIN DASHBOARD
function AdminDashboard({user,onSignOut,onViewAsStudent,onGoHome}){
  const [users,setUsers]=useState([]);
  const [loading,setLoading]=useState(true);
  const [selected,setSelected]=useState(null);

  useEffect(()=>{loadUsers();},[]);

  const loadUsers=async()=>{
    setLoading(true);
    const{data,error}=await supabase.from("progress").select("*").order("updated_at",{ascending:false});
    if(!error&&data)setUsers(data);
    setLoading(false);
  };

  const pctColor=p=>p>=80?"text-lime-400":p>=50?"text-amber-400":"text-rose-400";
  const barColor=p=>p>=80?"bg-lime-400":p>=50?"bg-amber-400":"bg-rose-400";
  const totalModules=Object.values(CURRICULUM).reduce((s,l)=>s+l.modules.length,0);
  const fullName=user.user_metadata?.full_name||user.email;

  return(
    <div className="min-h-screen bg-black text-zinc-100" style={{backgroundImage:"radial-gradient(circle at 20% 30%, rgba(132,204,22,0.04), transparent 50%)"}}>
      <header className="border-b border-zinc-800 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3"><Zap size={16} className="text-lime-400"/><Flame size={16} className="text-amber-400"/><span className="font-mono text-sm tracking-wider">NGPX//ACADEMY</span><Pill color="fuchsia">ADMIN</Pill></div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-zinc-400">{fullName}</span>
          <button onClick={onGoHome} className="font-mono text-[10px] text-zinc-500 hover:text-zinc-300 uppercase tracking-wider">⌂ Home</button>
          <button onClick={onViewAsStudent} className="font-mono text-[10px] text-zinc-500 hover:text-lime-400 uppercase tracking-wider">▸ Student View</button>
          <button onClick={onSignOut} className="font-mono text-[10px] text-zinc-500 hover:text-rose-400 uppercase tracking-wider flex items-center gap-1"><LogOut size={12}/> Sign out</button>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-4 space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Panel title="TOTAL USERS" accent="fuchsia"><div className="font-mono text-2xl font-bold text-fuchsia-400">{users.length}</div><div className="text-[10px] text-zinc-500">registered</div></Panel>
          <Panel title="AVG LEVEL" accent="amber"><div className="font-mono text-2xl font-bold text-amber-400">{users.length?(users.reduce((s,u)=>s+(u.level||1),0)/users.length).toFixed(1):"—"}</div><div className="text-[10px] text-zinc-500">across all users</div></Panel>
          <Panel title="AVG ACCURACY" accent="cyan"><div className="font-mono text-2xl font-bold text-cyan-400">{users.length?Math.round(users.filter(u=>u.total_answered>0).reduce((s,u)=>s+((u.total_correct||0)/(u.total_answered||1)*100),0)/(users.filter(u=>u.total_answered>0).length||1)):0}%</div><div className="text-[10px] text-zinc-500">correct answers</div></Panel>
          <Panel title="TOTAL TIME" accent="lime"><div className="font-mono text-2xl font-bold text-lime-400">{fmtTime(users.reduce((s,u)=>s+(u.time_spent_seconds||0),0))}</div><div className="text-[10px] text-zinc-500">combined study time</div></Panel>
        </div>
        <Panel title={`USER PROGRESS // ${users.length} ACCOUNTS`} accent="fuchsia">
          {loading?(<div className="font-mono text-xs text-zinc-500 animate-pulse">Loading users...</div>):users.length===0?(<div className="font-mono text-xs text-zinc-500">No users yet.</div>):(
            <div className="font-mono text-xs overflow-x-auto">
              <div className="grid grid-cols-12 gap-2 px-2 py-1 border-b border-zinc-800 text-zinc-500 uppercase tracking-wider min-w-[900px]">
                <div className="col-span-3">User</div><div className="col-span-1 text-center">Level</div><div className="col-span-2 text-center">Placement</div><div className="col-span-1 text-center">Score</div><div className="col-span-1 text-center">Modules</div><div className="col-span-1 text-center">Accuracy</div><div className="col-span-1 text-center">Time</div><div className="col-span-2 text-center">Last seen</div>
              </div>
              {users.map(u=>{
                const cc=Object.keys(u.completed_modules||{}).length;
                const acc=u.total_answered>0?Math.round((u.total_correct/u.total_answered)*100):0;
                const ls=u.updated_at?new Date(u.updated_at).toLocaleDateString():"—";
                const placementTotal=44;
                const placementDone=u.placed?placementTotal:(u.placement_idx||0);
                const placementLabel=u.placed?"Complete ✓":placementDone>0?`Q${placementDone}/44`:"Not taken";
                const placementColor=u.placed?"text-lime-400":placementDone>0?"text-amber-400":"text-zinc-600";
                const ps=u.placement_score!=null?u.placement_score:null;
                return(
                  <div key={u.id} onClick={()=>setSelected(selected?.id===u.id?null:u)} className="grid grid-cols-12 gap-2 px-2 py-2 border-b border-zinc-900 hover:bg-zinc-900/50 cursor-pointer min-w-[900px]">
                    <div className="col-span-3"><div className="text-zinc-100">{u.full_name||"—"}</div><div className="text-[10px] text-zinc-600">{u.email||""}</div></div>
                    <div className="col-span-1 text-center"><span className="text-amber-400 font-bold">L{u.level||1}</span></div>
                    <div className={`col-span-2 text-center font-bold text-xs ${placementColor}`}>{placementLabel}</div>
                    <div className={`col-span-1 text-center font-bold text-xs ${ps!=null?pctColor(ps):"text-zinc-600"}`}>{ps!=null?`${ps}%`:"—"}</div>
                    <div className="col-span-1 text-center text-zinc-300">{cc}/{totalModules}</div>
                    <div className={`col-span-1 text-center font-bold ${pctColor(acc)}`}>{acc}%</div>
                    <div className="col-span-1 text-center text-zinc-400">{fmtTime(u.time_spent_seconds||0)}</div>
                    <div className="col-span-2 text-center text-zinc-500">{ls}</div>
                  </div>
                );
              })}
            </div>
          )}
        </Panel>
        {selected&&(
          <Panel title={`USER DETAIL // ${selected.full_name||selected.email}`} accent="cyan">
            <div className="font-mono text-xs space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[["Level",`L${selected.level||1} — ${CURRICULUM[selected.level||1]?.name}`,"amber"],["Modules",`${Object.keys(selected.completed_modules||{}).length}/${totalModules}`,"lime"],["Accuracy",`${selected.total_answered>0?Math.round((selected.total_correct/selected.total_answered)*100):0}%`,"cyan"],["Time",fmtTime(selected.time_spent_seconds||0),"fuchsia"],["Trivia High",selected.trivia_high_score||0,"fuchsia"],["Placement",selected.placed?"Complete ✓":selected.placement_idx>0?`In progress (Q${selected.placement_idx}/44)`:"Not taken",selected.placed?"lime":selected.placement_idx>0?"amber":"zinc"],["Placement Score",selected.placement_score!=null?`${selected.placement_score}% (${Math.round(selected.placement_score*44/100)}/44)`:"—",selected.placement_score>=80?"lime":selected.placement_score>=50?"amber":"zinc"]].map(([label,val,color])=>(
                  <div key={label} className="border border-zinc-800 p-3"><div className="text-[10px] text-zinc-500 uppercase mb-1">{label}</div><div className={`text-sm font-bold text-${color}-400`}>{val}</div></div>
                ))}
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">Module Scores</div>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-1">
                  {Object.entries(CURRICULUM).flatMap(([,l])=>l.modules).map(m=>{
                    const score=(selected.completed_modules||{})[m.id];
                    return(<div key={m.id} className={`p-2 border text-center ${score>=70?"border-lime-700 bg-lime-950/20":"border-zinc-800"}`}><div className="text-[10px] text-zinc-500">{m.id}</div><div className={`text-xs font-bold ${score>=70?"text-lime-400":score?"text-amber-400":"text-zinc-600"}`}>{score!=null?`${score}%`:"—"}</div></div>);
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

// MAIN APP
function MainApp({user,progress,setProgress,onSignOut,onBackToAdmin,onGoHome}){
  const [showChangePwd,setShowChangePwd]=useState(false);
  const [view,setView]=useState(()=>{
    if(progress.currentModule&&progress.currentQuestion>0)return"module";
    if(progress.placed)return"dashboard";
    if(progress.placementIdx>0)return"placement";
    return"welcome";
  });
  const [activeModuleId,setActiveModuleId]=useState(
    progress.currentModule&&progress.currentQuestion>0?progress.currentModule:null
  );
  const [placementScore,setPlacementScore]=useState(0);
  const [placementByLevel,setPlacementByLevel]=useState({});
  const [placementByTopic,setPlacementByTopic]=useState({});
  const startTimeRef=useRef(Date.now());

  useEffect(()=>{
    const interval=setInterval(async()=>{
      const elapsed=Math.floor((Date.now()-startTimeRef.current)/1000);
      startTimeRef.current=Date.now();
      const updated={...progress,timeSpentSeconds:(progress.timeSpentSeconds||0)+elapsed};
      setProgress(updated);
      await saveProgress(updated);
    },30000);
    return()=>clearInterval(interval);
  },[progress]);

  const saveProgress=async(p)=>{
    await supabase.from("progress").upsert({
      id:user.id,email:user.email,full_name:user.user_metadata?.full_name||user.email,
      level:p.level,placed:p.placed,completed_modules:p.completed,
      trivia_high_score:p.triviaHigh,total_answered:p.totalAnswered,
      total_correct:p.totalCorrect,time_spent_seconds:p.timeSpentSeconds||0,
      current_module:p.currentModule||null,current_question:p.currentQuestion||0,
      current_answers:p.currentAnswers||[],
      placement_idx:p.placementIdx||0,placement_picks:p.placementPicks||[],placement_score:p.placementScore!=null?p.placementScore:null,
      updated_at:new Date().toISOString(),
    },{onConflict:"id"});
  };

  const persist=async(p)=>{setProgress(p);await saveProgress(p);};
  const progressRef=useRef(progress);
  useEffect(()=>{progressRef.current=progress;},[progress]);

  const handleModuleBack=async()=>{
    const p=progressRef.current;
    await persist({...p,currentModule:null,currentQuestion:0,currentAnswers:[]});
    setView("dashboard");
  };

  const handleSaveQuizState=async(modId,qIdx,ans)=>{
    const p=progressRef.current;
    const prevLen=p.currentAnswers?p.currentAnswers.length:0;
    const newAnswer=ans.length>prevLen;
    const updated={
      ...p,
      currentModule:modId,
      currentQuestion:qIdx,
      currentAnswers:ans,
      totalAnswered:newAnswer?p.totalAnswered+1:p.totalAnswered,
      totalCorrect:newAnswer&&ans[ans.length-1]?p.totalCorrect+1:p.totalCorrect,
    };
    await persist(updated);
  };

  const handlePlacementComplete=async(level,score,byLevel,byTopic)=>{
    setPlacementScore(score);setPlacementByLevel(byLevel||{});setPlacementByTopic(byTopic||{});
    const pct=Math.round((score/44)*100);
    const p=progressRef.current;
    const updated={...p,placed:true,level,placementIdx:0,placementPicks:[],placementScore:pct};
    setProgress(updated);
    await saveProgress(updated);
    setView("placement-result");
  };

  const handleSavePlacement=async(idx,picks)=>{
    const p=progressRef.current;
    await persist({...p,placementIdx:idx,placementPicks:picks});
  };

  const handleModuleComplete=async(id,pct,total,correct)=>{
    const nc={...progress.completed,[id]:pct};
    let nl=progress.level;
    const cm=CURRICULUM[progress.level].modules.map(m=>m.id);
    if(cm.every(mid=>(nc[mid]||0)>=70)&&progress.level<6)nl=progress.level+1;
    await persist({...progress,level:nl,completed:nc,totalAnswered:progress.totalAnswered+total,totalCorrect:progress.totalCorrect+correct});
  };

  const handleViewChange=async(v)=>{
    if(typeof v==="object"&&v.type==="module"){
      if(v.id!==progress.currentModule){
        await persist({...progress,currentModule:v.id,currentQuestion:0,currentAnswers:[]});
      }
      setActiveModuleId(v.id);setView("module");
    }else setView(v);
  };

  const fullName=user.user_metadata?.full_name||user.email;

  return(
    <div className="min-h-screen bg-black text-zinc-100" style={{backgroundImage:"radial-gradient(circle at 20% 30%, rgba(132,204,22,0.04), transparent 50%), radial-gradient(circle at 80% 70%, rgba(245,158,11,0.04), transparent 50%)"}}>
      {showChangePwd&&<ChangePasswordModal onClose={()=>setShowChangePwd(false)}/>}
      <header className="border-b border-zinc-800 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3"><Zap size={16} className="text-lime-400"/><Flame size={16} className="text-amber-400"/><span className="font-mono text-sm tracking-wider text-zinc-100">NGPX//ACADEMY</span><Pill color="zinc">v3</Pill></div>
        <div className="flex items-center gap-2">
          {progress.placed&&<Pill color={progress.level>=5?"lime":"amber"}>L{progress.level} · {CURRICULUM[progress.level].name}</Pill>}
          <span className="font-mono text-[10px] text-zinc-500 hidden md:inline">{fullName}</span>
          {onBackToAdmin&&<button onClick={onBackToAdmin} className="font-mono text-[10px] text-zinc-500 hover:text-lime-400 uppercase tracking-wider">▸ Admin</button>}
          <button onClick={onGoHome} className="font-mono text-[10px] text-zinc-500 hover:text-zinc-300 uppercase tracking-wider">⌂ Home</button>
          <button onClick={()=>setShowChangePwd(true)} className="font-mono text-[10px] text-zinc-500 hover:text-cyan-400 uppercase tracking-wider">⚙ pwd</button>
          <button onClick={onSignOut} className="font-mono text-[10px] text-zinc-500 hover:text-rose-400 uppercase tracking-wider flex items-center gap-1"><LogOut size={11}/> out</button>
        </div>
      </header>
      <main className="py-4">
        {view==="welcome"&&<WelcomeScreen onStart={()=>setView("placement")}/>}
        {view==="placement"&&<Placement onComplete={handlePlacementComplete} resumeIdx={progress.placementIdx} resumePicks={progress.placementPicks} onSavePlacement={handleSavePlacement}/>}
        {view==="placement-result"&&<PlacementResult score={placementScore} level={progress.level} byLevel={placementByLevel} byTopic={placementByTopic} onContinue={()=>setView("dashboard")}/>}
        {view==="dashboard"&&<Dashboard state={progress} onView={handleViewChange}/>}
        {view==="module"&&activeModuleId&&<ModuleView moduleId={activeModuleId} state={{...progress,userId:user.id}} onComplete={handleModuleComplete} onBack={handleModuleBack} onSaveQuizState={handleSaveQuizState}/>}
        {view==="trivia"&&<TriviaMode state={progress} onUpdateHigh={async s=>{const u={...progress,triviaHigh:s};await persist(u);}} onBack={()=>setView("dashboard")}/>}
        {view==="cards"&&<FlashcardMode state={progress} onBack={()=>setView("dashboard")}/>}
      </main>
      <footer className="border-t border-zinc-900 px-4 py-3 font-mono text-xs text-zinc-600 text-center">NGPX//ACADEMY · Educational use only · Not financial advice</footer>
    </div>
  );
}

// WELCOME
function WelcomeScreen({onStart}){
  const total=Object.values(CURRICULUM).flatMap(l=>l.modules.flatMap(m=>m.questions)).length;
  return(
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

// PLACEMENT
function Placement({onComplete,resumeIdx=0,resumePicks=[],onSavePlacement}){
  const [idx,setIdx]=useState(resumeIdx);
  const [picks,setPicks]=useState(resumePicks);
  const [selected,setSelected]=useState(null);
  const [showAnswer,setShowAnswer]=useState(false);
  // Deterministic shuffle using fixed seed so order is same across sessions
  const shuffled=useMemo(()=>{
    const arr=PLACEMENT.map(q=>shuffleQuestion(q));
    const seed=12345; // fixed seed for placement
    let s=seed;
    for(let i=arr.length-1;i>0;i--){s=(s*1664525+1013904223)&0xffffffff;const j=Math.abs(s)%(i+1);[arr[i],arr[j]]=[arr[j],arr[i]];}
    return arr;
  },[]);
  const q=shuffled[idx];

  const submit=()=>{
    if(selected===null)return;
    setShowAnswer(true);
  };

  const advance=()=>{
    const correct=selected===q.answer;
    const next=[...picks,{lvl:q.lvl,topic:q.topic,correct}];
    if(idx===shuffled.length-1){
      const byLevel={},byTopic={};
      next.forEach(p=>{
        if(!byLevel[p.lvl])byLevel[p.lvl]={c:0,t:0};byLevel[p.lvl].t++;if(p.correct)byLevel[p.lvl].c++;
        if(!byTopic[p.topic])byTopic[p.topic]={c:0,t:0};byTopic[p.topic].t++;if(p.correct)byTopic[p.topic].c++;
      });
      let starting=1;
      for(let L=6;L>=1;L--){if(byLevel[L]&&byLevel[L].c/byLevel[L].t>=0.5){starting=Math.max(1,L-1);break;}}
      onComplete(starting,next.filter(p=>p.correct).length,byLevel,byTopic);
    }else{
      const nextIdx=idx+1;
      setPicks(next);setSelected(null);setShowAnswer(false);setIdx(nextIdx);
      onSavePlacement(nextIdx,next);
    }
  };

  const userCorrect=showAnswer&&selected===q.answer;

  return(
    <div className="max-w-2xl mx-auto p-4">
      <Panel title={`PLACEMENT // ${idx+1} / ${shuffled.length}`} accent="amber">
        <div className="font-mono space-y-4">
          <div className="h-1 bg-zinc-900"><div className="h-full bg-amber-400 transition-all" style={{width:`${((idx+1)/shuffled.length)*100}%`}}/></div>
          <div className="text-xs text-zinc-500 flex justify-between"><span>L{q.lvl} · {q.topic}</span><span>{resumeIdx>0&&idx===resumeIdx?<span className="text-amber-400">▸ RESUMED</span>:"NO HINTS // NO BACKTRACK"}</span></div>
          <div className="text-zinc-100 text-sm">{q.q}</div>
          <div className="space-y-2">
            {q.options.map((o,i)=>{
              const ic=i===q.answer,is=i===selected;
              let cls="border-zinc-800 text-zinc-300 hover:border-amber-700";
              if(showAnswer){
                if(ic)cls="border-lime-500 bg-lime-950/30 text-lime-200";
                else if(is)cls="border-rose-500 bg-rose-950/30 text-rose-200";
                else cls="border-zinc-900 text-zinc-600";
              }else if(is)cls="border-amber-400 bg-amber-400/10 text-amber-100";
              return(
                <button key={i} onClick={()=>!showAnswer&&setSelected(i)} disabled={showAnswer} className={`block w-full text-left p-2.5 border font-mono text-xs ${cls}`}>
                  <span className="text-zinc-500 mr-2">[{String.fromCharCode(65+i)}]</span>{o}
                  {showAnswer&&ic&&<span className="ml-2 text-lime-400 text-[10px] uppercase font-bold">✓ CORRECT</span>}
                  {showAnswer&&is&&!ic&&<X size={12} className="inline ml-2 text-rose-400"/>}
                </button>
              );
            })}
          </div>
          {showAnswer&&(
            <div className={`border-l-2 ${userCorrect?"border-lime-500":"border-rose-500"} pl-3 py-2 text-xs space-y-1`}>
              <div className={`uppercase text-[10px] font-bold tracking-wider ${userCorrect?"text-lime-400":"text-rose-400"}`}>{userCorrect?"✓ CORRECT":"✗ INCORRECT"}</div>
              {!userCorrect&&<div className="text-lime-300 text-xs">Correct answer: <span className="font-bold">{q.options[q.answer]}</span></div>}
              {q.explain&&<div className="text-zinc-400">{q.explain}</div>}
            </div>
          )}
          <div className="pt-2 flex justify-end">
            {!showAnswer&&<Btn onClick={submit} variant="primary" disabled={selected===null}>SUBMIT <ChevronRight size={12} className="inline"/></Btn>}
            {showAnswer&&<Btn onClick={advance} variant="primary">{idx===shuffled.length-1?"FINISH":"NEXT"} <ChevronRight size={12} className="inline"/></Btn>}
          </div>
        </div>
      </Panel>
    </div>
  );
}

// PLACEMENT RESULT
function PlacementResult({score,level,byLevel,byTopic,onContinue}){
  const topicRows=Object.entries(byTopic||{}).map(([t,v])=>({topic:t,c:v.c,t_:v.t,pct:Math.round((v.c/v.t)*100)})).sort((a,b)=>a.pct-b.pct);
  const weakest=topicRows.slice(0,3).filter(r=>r.pct<100);
  const pctColor=p=>p>=80?"text-lime-400":p>=50?"text-amber-400":"text-rose-400";
  const barColor=p=>p>=80?"bg-lime-400":p>=50?"bg-amber-400":"bg-rose-400";
  return(
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
          {topicRows.map(r=>(<div key={r.topic} className="grid grid-cols-12 gap-2 px-2 py-1.5 border-b border-zinc-900"><div className="col-span-6"><div className="text-zinc-100">{TOPIC_LABELS[r.topic]||r.topic}</div></div><div className="col-span-2 text-right tabular-nums text-zinc-300">{r.c}/{r.t_}</div><div className={`col-span-1 text-right tabular-nums font-bold ${pctColor(r.pct)}`}>{r.pct}%</div><div className="col-span-3 flex items-center"><div className="h-1.5 w-full bg-zinc-900"><div className={`h-full ${barColor(r.pct)}`} style={{width:`${r.pct}%`}}/></div></div></div>))}
        </div>
      </Panel>
      {weakest.length>0&&<Panel title="FOCUS AREAS" accent="rose"><div className="font-mono text-xs space-y-1">{weakest.map(r=><div key={r.topic} className="text-zinc-300">• {TOPIC_LABELS[r.topic]} — <span className={pctColor(r.pct)}>{r.pct}%</span></div>)}</div></Panel>}
      <div className="text-center pt-2"><Btn onClick={onContinue}>OPEN DASHBOARD <ChevronRight size={12} className="inline"/></Btn></div>
    </div>
  );
}

// DASHBOARD
function Dashboard({state,onView}){
  const completed=Object.keys(state.completed).length;
  const total=Object.values(CURRICULUM).reduce((s,l)=>s+l.modules.length,0);
  return(
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
        const L=parseInt(lvl),locked=L>state.level;
        return(
          <Panel key={lvl} title={`${data.tag} // ${data.name} · ${data.grade}`} accent={locked?"rose":L===state.level?"amber":"lime"}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {data.modules.map(m=>{
                const score=state.completed[m.id],passed=score&&score>=70,t=MODULE_TOPIC[m.id];
                return(<button key={m.id} onClick={()=>!locked&&onView({type:"module",id:m.id})} disabled={locked} className={`text-left p-3 border font-mono text-xs ${locked?"border-zinc-900 text-zinc-700 cursor-not-allowed bg-zinc-950/30":passed?"border-lime-700 bg-lime-950/20 text-lime-300":"border-zinc-800 hover:border-amber-600 text-zinc-300"}`}>
                  <div className="flex justify-between items-start mb-1"><span className="text-[10px] text-zinc-500">{m.id}</span><div className="flex gap-1 items-center">{t&&<Pill color="zinc">{t}</Pill>}{passed&&<Check size={11} className="text-lime-400"/>}{locked&&<span className="text-rose-500 text-[10px]">LOCKED</span>}</div></div>
                  <div className="text-zinc-100 text-xs">{m.title}</div>
                  {score!==undefined&&<div className="text-[10px] text-zinc-500 mt-1">last: {score}%</div>}
                </button>);
              })}
            </div>
          </Panel>
        );
      })}
    </div>
  );
}

// MODULE VIEW
function ModuleView({moduleId,state,onComplete,onBack,onSaveQuizState}){
  const resumeQ=state.currentModule===moduleId?state.currentQuestion||0:0;
  const resumeA=state.currentModule===moduleId?state.currentAnswers||[]:[];
  const [phase,setPhase]=useState(resumeQ>0?"quiz":"lesson");
  const [qIdx,setQIdx]=useState(resumeQ);
  const [answers,setAnswers]=useState(resumeA);
  const [selected,setSelected]=useState(null);
  const [showAnswer,setShowAnswer]=useState(false);
  const mod=useMemo(()=>{for(const lvl of Object.values(CURRICULUM)){const m=lvl.modules.find(x=>x.id===moduleId);if(m)return m;}return null;},[moduleId]);
  // Deterministic sample + shuffle based on userId+moduleId
  // Same 5 questions in same order every session for this user+module combo
  const shuffledQuestions=useMemo(()=>{
    if(!mod)return[];
    const QUESTIONS_PER_ATTEMPT=5;
    // Seed = userId chars + moduleId chars for user-specific but stable ordering
    const seedStr=(state.userId||"")+mod.id;
    const seed=seedStr.split("").reduce((a,c)=>a+c.charCodeAt(0),0);
    let s=seed;
    const rng=()=>{s=(s*1664525+1013904223)&0xffffffff;return Math.abs(s)/0x7fffffff;};
    // Shuffle all questions deterministically
    const arr=mod.questions.map(q=>shuffleQuestion(q));
    for(let i=arr.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}
    // Take first QUESTIONS_PER_ATTEMPT
    return arr.slice(0,Math.min(QUESTIONS_PER_ATTEMPT,arr.length));
  },[mod?.id,state.userId]);
  if(!mod)return <div className="p-4 font-mono text-rose-400">Module not found.</div>;
  const submit=()=>{
    if(selected===null)return;
    setShowAnswer(true);
    const correct=selected===shuffledQuestions[qIdx].answer;
    const newAnswers=[...answers,correct];
    setAnswers(newAnswers);
    // Save qIdx+1 so on resume we start at the NEXT unanswered question
    onSaveQuizState(moduleId,qIdx+1,newAnswers);
  };
  const next=()=>{
    if(qIdx===shuffledQuestions.length-1){const c=answers.filter(a=>a).length;const pct=Math.round((c/shuffledQuestions.length)*100);onComplete(mod.id,pct,shuffledQuestions.length,c);setPhase("done");onSaveQuizState(null,0,[]);}
    else{setQIdx(qIdx+1);setSelected(null);setShowAnswer(false);}
  };
  if(phase==="lesson")return(
    <div className="max-w-2xl mx-auto p-4 space-y-3">
      <button onClick={onBack} className="font-mono text-xs text-zinc-500 hover:text-lime-400 flex items-center gap-1"><ArrowLeft size={12}/> BACK</button>
      <Panel title={`${mod.id} // ${mod.title}`} accent="cyan"><div className="font-mono text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">{mod.lesson}</div></Panel>
      <Btn onClick={()=>setPhase("quiz")}>BEGIN QUIZ ({shuffledQuestions.length} Qs) <ChevronRight size={12} className="inline"/></Btn>
    </div>
  );

  if(phase==="done"){
    const c=answers.filter(a=>a).length,pct=Math.round((c/shuffledQuestions.length)*100),passed=pct>=70;
    return(
      <div className="max-w-2xl mx-auto p-4">
        <Panel title="MODULE COMPLETE" accent={passed?"lime":"amber"}>
          <div className="font-mono text-center py-4">
            <div className="text-xs text-zinc-500 mb-2">SCORE</div>
            <div className={`text-5xl font-bold mb-2 ${passed?"text-lime-400":"text-amber-400"}`}>{pct}%</div>
            <div className="text-zinc-400 text-sm mb-1">{c}/{shuffledQuestions.length} correct</div>
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
  const q=shuffledQuestions[qIdx];
  const userWasCorrect=showAnswer&&selected===q.answer;
  return(
    <div className="max-w-2xl mx-auto p-4 space-y-3">
      <button onClick={onBack} className="font-mono text-xs text-zinc-500 hover:text-lime-400 flex items-center gap-1"><ArrowLeft size={12}/> BACK</button>
      <Panel title={`${mod.id} QUIZ // ${qIdx+1}/${shuffledQuestions.length}`} accent="cyan">
        <div className="font-mono space-y-3">
          <div className="h-1 bg-zinc-900"><div className="h-full bg-cyan-400 transition-all" style={{width:`${((qIdx+1)/shuffledQuestions.length)*100}%`}}/></div>
          {resumeQ>0&&qIdx===resumeQ&&answers.length===resumeA.length&&<div className="text-[10px] text-amber-400 uppercase tracking-wider">▸ Continuing from where you left off</div>}
          <div className="text-zinc-100 text-sm">{q.q}</div>
          <div className="space-y-2">
            {q.options.map((o,i)=>{
              const ic=i===q.answer,is=i===selected;
              let cls="border-zinc-800 text-zinc-300 hover:border-cyan-700";
              if(showAnswer){
                if(ic)cls="border-lime-500 bg-lime-950/30 text-lime-200";
                else if(is)cls="border-rose-500 bg-rose-950/30 text-rose-200";
                else cls="border-zinc-900 text-zinc-600";
              }else if(is)cls="border-cyan-400 bg-cyan-400/10 text-cyan-100";
              return(
                <button key={i} onClick={()=>!showAnswer&&setSelected(i)} disabled={showAnswer} className={`block w-full text-left p-2.5 border font-mono text-xs ${cls}`}>
                  <span className="text-zinc-500 mr-2">[{String.fromCharCode(65+i)}]</span>{o}
                  {showAnswer&&ic&&<span className="ml-2 text-lime-400 text-[10px] uppercase font-bold">✓ CORRECT</span>}
                  {showAnswer&&is&&!ic&&<X size={12} className="inline ml-2 text-rose-400"/>}
                </button>
              );
            })}
          </div>
          {showAnswer&&(
            <div className={`border-l-2 ${userWasCorrect?"border-lime-500":"border-rose-500"} pl-3 py-2 text-xs space-y-1`}>
              <div className={`uppercase text-[10px] font-bold tracking-wider ${userWasCorrect?"text-lime-400":"text-rose-400"}`}>
                {userWasCorrect?"✓ CORRECT":"✗ INCORRECT"}
              </div>
              {!userWasCorrect&&<div className="text-lime-300 text-xs">Correct answer: <span className="font-bold">{q.options[q.answer]}</span></div>}
              <div className="text-zinc-400">{q.explain}</div>
            </div>
          )}
          <div className="flex justify-end pt-1">
            {!showAnswer&&<Btn onClick={submit} disabled={selected===null}>SUBMIT</Btn>}
            {showAnswer&&<Btn onClick={next} variant="primary">{qIdx===shuffledQuestions.length-1?"FINISH":"NEXT"} <ChevronRight size={12} className="inline"/></Btn>}
          </div>
        </div>
      </Panel>
    </div>
  );
}

// TRIVIA
function TriviaMode({state,onUpdateHigh,onBack}){
  const ALL_Q=useMemo(()=>Object.entries(CURRICULUM).flatMap(([lvl,data])=>data.modules.flatMap(m=>m.questions.map(q=>({...q,level:parseInt(lvl),topic:MODULE_TOPIC[m.id]||"POWER-FUND"})))),[]);
  const [phase,setPhase]=useState("ready");
  const [pool,setPool]=useState([]);
  const [idx,setIdx]=useState(0);
  const [score,setScore]=useState(0);
  const [streak,setStreak]=useState(0);
  const [bestStreak,setBestStreak]=useState(0);
  const [timeLeft,setTimeLeft]=useState(15);
  const [selected,setSelected]=useState(null);
  const [showAnswer,setShowAnswer]=useState(false);
  const tickRef=useRef(null);

  const start=()=>{
    const filtered=ALL_Q.filter(q=>q.level<=Math.min(state.level+1,6));
    setPool([...filtered].sort(()=>Math.random()-0.5).slice(0,Math.min(15,filtered.length)));
    setIdx(0);setScore(0);setStreak(0);setBestStreak(0);setSelected(null);setShowAnswer(false);setTimeLeft(15);setPhase("playing");
  };

  useEffect(()=>{
    if(phase!=="playing"||showAnswer)return;
    tickRef.current=setInterval(()=>{setTimeLeft(t=>{if(t<=1){clearInterval(tickRef.current);setShowAnswer(true);setStreak(0);return 0;}return t-1;});},1000);
    return()=>clearInterval(tickRef.current);
  },[phase,idx,showAnswer]);

  const submit=(i)=>{
    if(showAnswer)return;setSelected(i);setShowAnswer(true);clearInterval(tickRef.current);
    if(i===pool[idx].answer){const pts=100+(timeLeft*10)+(streak*25);setScore(s=>s+pts);const ns=streak+1;setStreak(ns);setBestStreak(b=>Math.max(b,ns));}else setStreak(0);
  };

  const next=()=>{
    if(idx===pool.length-1){setPhase("done");if(score>state.triviaHigh)onUpdateHigh(score);}
    else{setIdx(idx+1);setSelected(null);setShowAnswer(false);setTimeLeft(15);}
  };

  if(phase==="ready")return(
    <div className="max-w-2xl mx-auto p-4">
      <button onClick={onBack} className="font-mono text-xs text-zinc-500 hover:text-lime-400 flex items-center gap-1 mb-3"><ArrowLeft size={12}/> BACK</button>
      <Panel title="TRIVIA MODE" accent="fuchsia">
        <div className="font-mono text-zinc-300 text-sm space-y-2 mb-4"><div>▸ 15 questions from your unlocked levels</div><div>▸ 15 seconds per question · Score: 100 + 10/sec + 25 × streak</div><div className="text-fuchsia-400">HIGH SCORE: {state.triviaHigh}</div></div>
        <Btn onClick={start} variant="primary">▸ START</Btn>
      </Panel>
    </div>
  );

  if(phase==="done")return(
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
  return(
    <div className="max-w-2xl mx-auto p-4">
      <Panel title={`TRIVIA // ${idx+1}/${pool.length}`} accent="fuchsia">
        <div className="font-mono space-y-3">
          <div className="flex justify-between text-xs"><span className="text-zinc-500">SCORE: <span className="text-fuchsia-400 font-bold">{score}</span> · STREAK: <span className="text-amber-400">{streak}</span></span><span className={`font-bold ${timeLeft<=5?"text-rose-400 animate-pulse":"text-zinc-300"}`}>⏱ {timeLeft}s</span></div>
          <div className="h-1 bg-zinc-900"><div className={`h-full transition-all ${timeLeft<=5?"bg-rose-400":"bg-fuchsia-400"}`} style={{width:`${(timeLeft/15)*100}%`}}/></div>
          <div className="text-zinc-100 text-sm">{q.q}</div>
          <div className="space-y-2">
            {q.options.map((o,i)=>{
              const ic=i===q.answer,is=i===selected;
              let cls="border-zinc-800 text-zinc-300 hover:border-fuchsia-700";
              if(showAnswer){if(ic)cls="border-lime-500 bg-lime-950/30 text-lime-200";else if(is)cls="border-rose-500 bg-rose-950/30 text-rose-200";else cls="border-zinc-900 text-zinc-600";}
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

// FLASHCARDS
function FlashcardMode({state,onBack}){
  const cards=useMemo(()=>{const all=[];for(const [lvl,data] of Object.entries(CURRICULUM)){if(parseInt(lvl)>Math.min(state.level+1,6))continue;for(const m of data.modules)all.push({id:m.id,title:m.title,lesson:m.lesson});}return[...all].sort(()=>Math.random()-0.5);},[state.level]);
  const [idx,setIdx]=useState(0);
  const [flipped,setFlipped]=useState(false);
  if(!cards.length)return <div className="p-4 font-mono text-zinc-400">No cards.</div>;
  const c=cards[idx];
  return(
    <div className="max-w-2xl mx-auto p-4 space-y-3">
      <button onClick={onBack} className="font-mono text-xs text-zinc-500 hover:text-lime-400 flex items-center gap-1"><ArrowLeft size={12}/> BACK</button>
      <Panel title={`FLASHCARDS // ${idx+1}/${cards.length}`} accent="cyan">
        <div className="font-mono">
          <div onClick={()=>setFlipped(f=>!f)} className="min-h-[200px] border border-cyan-700 bg-zinc-950 p-6 cursor-pointer hover:border-cyan-500 transition-colors flex items-center justify-center">
            {!flipped?<div className="text-center"><div className="text-[10px] text-zinc-500 uppercase mb-3">▸ TAP TO FLIP</div><div className="text-zinc-500 text-xs mb-2">{c.id}</div><div className="text-cyan-300 text-xl font-bold">{c.title}</div></div>:<div className="text-zinc-300 text-sm leading-relaxed">{c.lesson}</div>}
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

// SET PASSWORD PAGE (for invite flow)
function SetPasswordPage({onDone}){
  const [password,setPassword]=useState("");
  const [confirm,setConfirm]=useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [done,setDone]=useState(false);

  const save=async()=>{
    if(!password||password.length<8){setError("Password must be at least 8 characters.");return;}
    if(password!==confirm){setError("Passwords don't match.");return;}
    setLoading(true);setError("");
    const{error:e}=await supabase.auth.updateUser({password});
    setLoading(false);
    if(e)setError(e.message);
    else{setDone(true);setTimeout(onDone,1500);}
  };

  return(
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3"><Zap size={20} className="text-lime-400"/><Flame size={20} className="text-amber-400"/></div>
          <div className="font-mono text-lg tracking-wider text-zinc-100">NGPX//ACADEMY</div>
          <div className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest mt-1">Set Your Password</div>
        </div>
        <Panel accent="lime">
          {done?(
            <div className="font-mono text-center py-4">
              <div className="text-lime-400 text-sm mb-2">▸ Password set successfully!</div>
              <div className="text-zinc-500 text-xs">Redirecting to the app...</div>
            </div>
          ):(
            <div className="space-y-3 font-mono">
              <div className="text-xs text-zinc-400 mb-2">Welcome! Create a password to access your account.</div>
              <div><div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">New Password</div><input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 px-3 py-2 text-xs font-mono focus:border-lime-500 outline-none" placeholder="Min. 8 characters"/></div>
              <div><div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Confirm Password</div><input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 px-3 py-2 text-xs font-mono focus:border-lime-500 outline-none" placeholder="Repeat password" onKeyDown={e=>e.key==="Enter"&&save()}/></div>
              {error&&<div className="text-rose-400 text-xs">{error}</div>}
              <Btn onClick={save} variant="primary" disabled={loading} className="w-full justify-center">{loading?"SAVING...":"▸ SET PASSWORD & ENTER"}</Btn>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}

// CHANGE PASSWORD MODAL
function ChangePasswordModal({onClose}){
  const [password,setPassword]=useState("");
  const [confirm,setConfirm]=useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [done,setDone]=useState(false);

  const save=async()=>{
    if(!password||password.length<8){setError("Password must be at least 8 characters.");return;}
    if(password!==confirm){setError("Passwords don't match.");return;}
    setLoading(true);setError("");
    try{
      const{data,error:e}=await supabase.auth.updateUser({password});
      if(e){setError(e.message);setLoading(false);return;}
      setLoading(false);
      setDone(true);
    }catch(err){
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return(
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
      <div className="w-full max-w-sm">
        <Panel accent="lime" title="CHANGE PASSWORD">
          {done?(
            <div className="font-mono text-center py-4 space-y-3">
              <div className="text-lime-400 text-sm">▸ Password updated successfully!</div>
              <Btn onClick={onClose} variant="primary">CLOSE</Btn>
            </div>
          ):(
            <div className="space-y-3 font-mono">
              <div><div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">New Password</div><input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 px-3 py-2 text-xs font-mono focus:border-lime-500 outline-none" placeholder="Min. 8 characters"/></div>
              <div><div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Confirm Password</div><input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 px-3 py-2 text-xs font-mono focus:border-lime-500 outline-none" placeholder="Repeat password" onKeyDown={e=>e.key==="Enter"&&save()}/></div>
              {error&&<div className="text-rose-400 text-xs">{error}</div>}
              <div className="flex gap-2 pt-1">
                <Btn onClick={onClose} variant="ghost">CANCEL</Btn>
                <Btn onClick={save} variant="primary" disabled={loading}>{loading?"SAVING...":"▸ SAVE"}</Btn>
              </div>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}

// ROOT APP
export default function App(){
  const [appView,setAppView]=useState("loading");
  const [user,setUser]=useState(null);
  const [progress,setProgress]=useState(defaultProgress);
  const [studentView,setStudentView]=useState(false);

  useEffect(()=>{
    // Detect invite/recovery token in URL hash
    const hash=window.location.hash;
    if(hash&&(hash.includes("type=invite")||hash.includes("type=recovery"))){
      setAppView("set-password");
      return;
    }
    supabase.auth.getSession().then(async({data:{session}})=>{
      if(session?.user){setUser(session.user);await loadProgress(session.user);setAppView("app");}
      else setAppView("landing");
    });
    const{data:{subscription}}=supabase.auth.onAuthStateChange(async(event,session)=>{
      // Ignore USER_UPDATED — fired when password changes, modal handles success display
      if(event==="USER_UPDATED") return;
      if(event==="PASSWORD_RECOVERY"){
        setAppView("set-password");
        return;
      }
      if(session?.user){setUser(session.user);await loadProgress(session.user);setAppView("app");}
      else{setUser(null);setProgress(defaultProgress);setStudentView(false);setAppView("landing");}
    });
    return()=>subscription.unsubscribe();
  },[]);

  const loadProgress=async(u)=>{
    const{data}=await supabase.from("progress").select("*").eq("id",u.id).single();
    if(data){
      setProgress({placed:data.placed||false,level:data.level||1,completed:data.completed_modules||{},triviaHigh:data.trivia_high_score||0,totalAnswered:data.total_answered||0,totalCorrect:data.total_correct||0,timeSpentSeconds:data.time_spent_seconds||0,currentModule:data.current_module||null,currentQuestion:data.current_question||0,currentAnswers:data.current_answers||[],placementIdx:data.placement_idx||0,placementPicks:data.placement_picks||[],placementScore:data.placement_score!=null?data.placement_score:null});
    }else{
      setProgress(defaultProgress);
      await supabase.from("progress").upsert({id:u.id,email:u.email,full_name:u.user_metadata?.full_name||u.email,level:1,placed:false,completed_modules:{},trivia_high_score:0,total_answered:0,total_correct:0,time_spent_seconds:0,current_module:null,current_question:0,current_answers:[],placement_idx:0,placement_picks:[],placement_score:null,updated_at:new Date().toISOString()},{onConflict:"id"});
    }
  };

  const signOut=async()=>{await supabase.auth.signOut();setStudentView(false);setAppView("landing");};

  if(appView==="loading")return(<div className="min-h-screen bg-black flex items-center justify-center font-mono text-sm"><div className="text-lime-400 animate-pulse">▸ LOADING...</div></div>);
  if(appView==="set-password")return <SetPasswordPage onDone={()=>{window.location.hash="";setAppView("app");}}/>;
  if(appView==="landing")return <LandingPage onLogin={()=>setAppView("login")}/>;
  if(appView==="login")return <LoginPage onBack={()=>setAppView("landing")} onSuccess={()=>setAppView("app")}/>;

  if(appView==="app"&&user){
    const isAdmin=ADMIN_EMAILS.includes(user.email);
    if(isAdmin&&!studentView){
      return <AdminDashboard user={user} onSignOut={signOut} onViewAsStudent={()=>setStudentView(true)} onGoHome={()=>setAppView("landing")}/>;
    }
    return <MainApp user={user} progress={progress} setProgress={setProgress} onSignOut={()=>{setStudentView(false);signOut();}} onBackToAdmin={isAdmin?()=>setStudentView(false):null} onGoHome={()=>setAppView("landing")}/>;
  }

  // Safety: if stuck on loading or app without user, go to landing after 5s
  if(appView==="loading"||appView==="app"){
    setTimeout(()=>{if(!user)setAppView("landing");},5000);
  }

  return null;
}

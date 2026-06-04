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
    {id:"1a",title:"What is Electricity?",lesson:"Electricity is the flow of electrons through a conductor — typically copper wire. At a power plant (gas, coal, nuclear, hydro, wind, solar), mechanical or chemical energy is converted into electrical energy. A generator spins a magnet inside a coil of wire, which pushes electrons through the system.\n\nThe grid moves electricity in three stages. TRANSMISSION carries bulk power at high voltage — typically 138,000 to 765,000 volts — over long distances on the big steel towers you see along highways. DISTRIBUTION steps the voltage down using transformers to 4,000-35,000 volts along streets and neighborhoods. Finally SERVICE drops it again to 120/240 volts for your home outlets.\n\nCritical rule: bulk electricity cannot be cheaply stored at scale. Batteries help at the margins (utility-scale storage is still under 2% of generation), but a power plant must produce exactly as much as customers are using, every second of every day. If supply and demand don't match perfectly, voltage and frequency drift away from their standard values (60 Hz in the US), and equipment can fail.\n\nThis single fact — non-storability — drives the entire design of power markets. Real-time dispatch, capacity markets, frequency regulation, and ancillary services all exist to keep that supply-demand equation in instantaneous balance.",questions:[
      {q:"What is electricity?",options:["Static charge in the air", "The flow of electrons through a conductor", "Heat radiating from wires", "Light energy converted to power"],answer:1,explain:"Electricity = flow of electrons through a wire (typically copper)."},
      {q:"At a power plant, what does a generator do?",options:["Stores electrons in a tank", "Spins a magnet inside a coil to push electrons", "Burns fuel directly into voltage", "Converts gas into wires"],answer:1,explain:"Generators convert mechanical energy to electrical by spinning a magnet inside a wire coil."},
      {q:"What voltage range is used for bulk transmission?",options:["120-240 V", "4,000-35,000 V", "138,000-765,000 V", "Over 1 million V"],answer:2,explain:"Transmission lines carry bulk power at 138-765 kV on the big steel towers."},
      {q:"What voltage range is used for distribution?",options:["120-240 V", "4,000-35,000 V", "138,000-765,000 V", "Variable based on demand"],answer:1,explain:"Distribution runs at 4-35 kV along streets, stepped down from transmission."},
      {q:"What voltage does a typical US home receive?",options:["12/24 V", "120/240 V", "480/600 V", "4,000 V"],answer:1,explain:"Service voltage is 120/240 V — stepped down from distribution by a pole-top transformer."},
      {q:"What is the critical rule about bulk electricity?",options:["It is dangerous to touch", "It cannot be cheaply stored at scale", "It must always travel underground", "It can only be made from fossil fuels"],answer:1,explain:"Non-storability is the foundational rule — supply must match demand every second."},
      {q:"Roughly what fraction of US generation is utility-scale battery storage today?",options:["Under 2%", "About 10%", "About 25%", "Over 50%"],answer:0,explain:"Despite progress, batteries are still less than 2% of total generation."},
      {q:"What is the standard grid frequency in the US?",options:["50 Hz", "60 Hz", "100 Hz", "Variable"],answer:1,explain:"60 Hz is the US standard — frequency drift signals supply-demand imbalance."},
      {q:"Why do power markets need real-time dispatch and capacity markets?",options:["To collect more taxes", "Because electricity can't be cheaply stored, supply must match demand every second", "To make trading more interesting", "Because of EPA regulations"],answer:1,explain:"Non-storability drives the entire market design — these mechanisms keep supply and demand in balance."},
      {q:"Which of these is NOT mentioned as a power generation source?",options:["Nuclear", "Hydro", "Geothermal", "Wind"],answer:2,explain:"The lesson lists gas, coal, nuclear, hydro, wind, and solar — geothermal isn't mentioned."}
    ]},
    {id:"1b",title:"What is Natural Gas?",lesson:"Natural gas is a fossil fuel composed of approximately 90%+ methane (CH₄), with smaller amounts of ethane, propane, butane, and trace gases. It burns cleanly compared to coal or oil — producing roughly half the CO₂ per unit of energy as coal — which is why it has become a bridge fuel between high-carbon fossil fuels and renewables.\n\nNatural gas has three main uses in the US economy. First, it HEATS homes and commercial buildings through furnaces and boilers. Second, it COOKS food on gas stoves and in industrial ovens. Third, and increasingly important, it FUELS power plants — natural gas now generates roughly 40% of all US electricity.\n\nUnlike electricity, natural gas moves through underground pipelines, not wires. The US has roughly 3 million miles of gas pipeline infrastructure — one of the world's largest energy networks. Gas flows under pressure: high pressure in long-haul transmission pipelines, low pressure in the local distribution lines that reach your meter.\n\nCrucially, and unlike electricity, natural gas CAN be stored. It can be injected into salt caverns, depleted oil and gas reservoirs, or aquifer formations underground. The pipelines themselves act as storage too — packing or drafting the line is called LINEPACK and provides hours of operational flexibility. \n\nStorability is THE structural difference between gas and power markets. It lets producers and consumers separate the timing of production and consumption — buy when cheap in summer, sell when expensive in winter.",questions:[
      {q:"What is natural gas composed of?",options:["~50% methane and 50% propane", "~90%+ methane (CH₄) with smaller hydrocarbons", "Pure CO₂", "Hydrogen and helium"],answer:1,explain:"Natural gas is ~90%+ methane with smaller amounts of ethane, propane, butane, and trace gases."},
      {q:"How does natural gas compare to coal for CO₂ emissions?",options:["About twice the CO₂", "Same as coal", "Roughly half the CO₂ per unit of energy", "Zero CO₂"],answer:2,explain:"Gas produces roughly half the CO₂ per unit of energy compared to coal — its bridge-fuel advantage."},
      {q:"What share of US electricity does natural gas generate?",options:["About 10%", "About 25%", "Roughly 40%", "Over 75%"],answer:2,explain:"Natural gas generates roughly 40% of US electricity today."},
      {q:"How does natural gas move from producer to consumer?",options:["High-voltage wires", "Through pipelines under pressure", "Via tanker trucks", "In compressed steel canisters"],answer:1,explain:"Pipelines (not wires) carry gas under pressure — about 3 million miles of US infrastructure."},
      {q:"Approximately how many miles of gas pipeline infrastructure exist in the US?",options:["300,000 miles", "1 million miles", "3 million miles", "10 million miles"],answer:2,explain:"Roughly 3 million miles — one of the world's largest energy networks."},
      {q:"Which of these is NOT a gas storage method mentioned?",options:["Salt caverns", "Depleted oil and gas reservoirs", "Above-ground steel tanks", "Aquifer formations"],answer:2,explain:"The three underground storage types are salt caverns, depleted reservoirs, and aquifers."},
      {q:"What is linepack?",options:["A pipeline maintenance crew", "Gas stored inside pipelines themselves", "A pricing benchmark", "A safety inspection"],answer:1,explain:"Linepack = packing/drafting the pipeline itself for short-term storage flexibility."},
      {q:"What is the most important structural difference between gas and power markets?",options:["Gas is regulated, power isn't", "Gas can be stored, electricity can't be cheaply stored", "Gas is cheaper", "Gas is only used by industry"],answer:1,explain:"Storability is the fundamental difference — it changes the entire market structure."},
      {q:"What commercial advantage does gas storability provide?",options:["Lower production costs", "Producers and consumers can separate timing of production and consumption", "Cleaner combustion", "Higher pressure delivery"],answer:1,explain:"Storage decouples when gas is produced from when it's consumed — enabling buy-summer/sell-winter trades."},
      {q:"Which of these is one of the three main uses of natural gas mentioned?",options:["Aluminum production", "Heating homes and buildings", "Plastic manufacturing", "Steel forging"],answer:1,explain:"The three main uses given are heating, cooking, and power generation."}
    ]},
    {id:"1c",title:"From Wellhead to Burner Tip",lesson:"Natural gas travels from underground reservoirs to end users through a five-stage value chain. Understanding this chain is essential for anyone trading gas because each stage has its own infrastructure, costs, and price formation.\n\nStage 1 — WELLHEAD: Drilled wells lift raw gas from underground formations to the surface. Pressure at the wellhead can range from very low (depleted fields) to very high (new deep wells). Wellhead is where the gas value chain begins.\n\nStage 2 — GATHERING: Small-diameter, low-pressure pipes collect gas from many individual wells in a producing region and bring it to a central processing point. Gathering systems are typically operated by midstream companies, not the producers themselves.\n\nStage 3 — PROCESSING: Raw gas is cleaned to pipeline quality. Plants remove water (which forms hydrate plugs and corrodes steel), carbon dioxide (corrosive), hydrogen sulfide (toxic and corrosive — gas containing H₂S is called \"sour gas\"), and natural gas liquids (NGLs — ethane, propane, butane). NGLs are valuable separately and sold into their own markets.\n\nStage 4 — TRANSMISSION: Long-haul, high-pressure interstate pipelines move clean gas hundreds or thousands of miles from producing regions to demand centers. Pressure typically runs 500-1,500 psi. Compressor stations every 50-100 miles re-pressurize the gas as it loses pressure to friction.\n\nStage 5 — DISTRIBUTION: Local Distribution Companies (LDCs) operate smaller, lower-pressure pipes that fan out from the transmission system to homes and businesses. The chain ends at the BURNER TIP — the stove, furnace, or boiler where the gas is finally consumed.\n\nMemorize this chain: Wellhead → Gathering → Processing → Transmission → Distribution → Burner Tip.",questions:[
      {q:"What is the correct order of the gas value chain?",options:["Processing → Wellhead → Gathering → Distribution → Transmission", "Wellhead → Gathering → Processing → Transmission → Distribution", "Gathering → Wellhead → Transmission → Processing → Distribution", "Transmission → Distribution → Gathering → Processing → Wellhead"],answer:1,explain:"WGPTD: Wellhead → Gathering → Processing → Transmission → Distribution → Burner Tip."},
      {q:"What happens at the gathering stage?",options:["Gas is processed to pipeline quality", "Small low-pressure pipes collect from many wells", "High-pressure long-haul transport", "Gas is delivered to homes"],answer:1,explain:"Gathering: small, low-pressure pipes collect gas from many individual wells."},
      {q:"What gets removed during processing?",options:["Only methane", "Only water", "Water, CO₂, H₂S, and NGLs", "Only nitrogen"],answer:2,explain:"Processing removes water, CO₂, H₂S, and NGLs — leaves clean methane-rich pipeline-quality gas."},
      {q:"What is 'sour gas'?",options:["Gas that smells bad", "Gas containing hydrogen sulfide (H₂S)", "Old gas that has degraded", "Gas with low BTU content"],answer:1,explain:"Sour gas = gas containing H₂S — toxic and corrosive, must be removed at processing."},
      {q:"Why is water removed during gas processing?",options:["It reduces the BTU value", "It forms hydrate plugs and corrodes steel pipe", "Water makes gas heavier", "Customers prefer dry gas"],answer:1,explain:"Water in pipelines forms hydrate ice plugs and corrodes steel — both serious operational risks."},
      {q:"What are NGLs?",options:["Natural Gas Lines (pipelines)", "Natural Gas Liquids — ethane, propane, butane", "National Gas Levies (taxes)", "Nominal Gas Limits (quotas)"],answer:1,explain:"NGLs = Natural Gas Liquids: ethane, propane, butane separated at processing and sold separately."},
      {q:"What pressure range do transmission pipelines typically operate at?",options:["1-10 psi", "100-200 psi", "500-1,500 psi", "10,000+ psi"],answer:2,explain:"Transmission runs at high pressure (500-1,500 psi) to move gas efficiently over long distances."},
      {q:"Why are compressor stations placed every 50-100 miles?",options:["To monitor for leaks", "To re-pressurize gas that loses pressure to friction", "To meter sales to customers", "To filter out impurities"],answer:1,explain:"Friction reduces pressure as gas flows; compressors restore it every 50-100 miles."},
      {q:"What does LDC stand for in the gas industry?",options:["Long Distance Carrier", "Local Distribution Company", "Light Density Cargo", "Licensed Drilling Contractor"],answer:1,explain:"LDCs operate local distribution pipes from transmission system to end users."},
      {q:"What is the 'burner tip'?",options:["The wellhead drilling tip", "Where the gas is finally consumed (stove, furnace, boiler)", "The processing plant output", "The first pressure regulator"],answer:1,explain:"Burner tip = the end point where gas is combusted by the end user."}
    ]},
    {id:"1d",title:"From Power Plant to Outlet",lesson:"Electricity travels from generation to consumption through a six-stage chain, with voltage being stepped up and down by transformers along the way. The whole journey happens in milliseconds.\n\nStage 1 — GENERATION: Power plants produce electricity at relatively low voltage, typically 13,000 to 25,000 volts (13-25 kV). This is too low for efficient long-distance transport.\n\nStage 2 — STEP-UP TRANSFORMER: At the power plant's switchyard, a step-up transformer increases voltage dramatically to 138,000-765,000 volts (138-765 kV). Higher voltage means lower current for the same power, which means lower energy loss to heat in the wires (I²R losses).\n\nStage 3 — TRANSMISSION: High-voltage long-haul transmission lines carry bulk power over hundreds of miles on the big steel lattice towers. Lines may span entire regions, linking generators and load centers across states.\n\nStage 4 — SUBSTATION: Near population centers, substations house transformers that step voltage down. Multiple substations form a hierarchy, with each step reducing voltage further.\n\nStage 5 — DISTRIBUTION: Lower-voltage distribution lines (4,000-35,000 volts, or 4-35 kV) run along streets — these are the wooden poles you see in most neighborhoods. They fan out from substations to serve homes and businesses.\n\nStage 6 — SERVICE: A final pole-top transformer on each block steps voltage down to 120/240 volts for residential service. This is the voltage that comes out of your outlet.\n\nAll of this happens at nearly the speed of light — in milliseconds. And critically, there's essentially no storage along the way: utility-scale batteries remain under 2% of total generation. Every electron generated must be consumed almost immediately.",questions:[
      {q:"At what voltage is electricity typically generated at a power plant?",options:["120-240 V", "4,000-35,000 V", "13,000-25,000 V", "138,000-765,000 V"],answer:2,explain:"Generation happens at 13-25 kV — too low for efficient long-distance transport."},
      {q:"What does a step-up transformer do?",options:["Reduces voltage for distribution", "Increases voltage for long-distance transmission", "Stores energy in capacitors", "Converts AC to DC"],answer:1,explain:"Step-up transformers raise voltage from generation (13-25 kV) to transmission (138-765 kV)."},
      {q:"Why is voltage increased before long-distance transmission?",options:["To make wires hotter", "Higher voltage means lower current = less I²R energy loss", "Required by federal regulation", "To make the lines more visible"],answer:1,explain:"Higher V → lower I → less I²R loss → more efficient long-distance transport."},
      {q:"What does a substation primarily do?",options:["Generate backup power", "Step voltage down using transformers", "Store electricity in batteries", "Burn waste heat"],answer:1,explain:"Substations house transformers that step voltage down toward distribution levels."},
      {q:"What voltage range is typical for distribution lines (the ones on wooden poles in neighborhoods)?",options:["120-240 V", "4,000-35,000 V", "13,000-25,000 V", "138,000-765,000 V"],answer:1,explain:"Distribution runs at 4-35 kV on the wooden poles you see along streets."},
      {q:"What is the final voltage delivered to a typical US home outlet?",options:["12/24 V", "120/240 V", "480 V", "4,000 V"],answer:1,explain:"Service voltage is 120/240 V — stepped down by a pole-top transformer on your block."},
      {q:"Roughly how fast does electricity travel from power plant to outlet?",options:["Minutes", "Seconds", "Milliseconds", "Hours during peak demand"],answer:2,explain:"The entire chain happens in milliseconds — at nearly the speed of light."},
      {q:"What percentage of US generation is utility-scale battery storage?",options:["Under 2%", "About 10%", "About 25%", "Over 50%"],answer:0,explain:"Despite growth, batteries remain under 2% of total generation."},
      {q:"How many distinct stages are in the power delivery chain described?",options:["Three", "Four", "Six", "Ten"],answer:2,explain:"Six stages: generation, step-up, transmission, substation, distribution, service."},
      {q:"What term describes energy lost as heat in transmission wires?",options:["Frequency drift", "I²R losses", "Reactive power", "Capacitor leakage"],answer:1,explain:"I²R losses (current squared times resistance) = heat dissipated in the wires."}
    ]},
    {id:"1e",title:"Where Natural Gas Comes From",lesson:"Natural gas is produced from underground rock formations through three distinct geological settings, each with different economics and drilling techniques.\n\nCONVENTIONAL gas comes from porous, permeable rock formations like sandstone. The gas migrated naturally into these traps over millions of years and flows easily once a well taps the reservoir. Conventional wells are drilled vertically — straight down to the pay zone. This was the dominant production method until the 2000s.\n\nSHALE gas is trapped in tight, low-permeability rock that doesn't easily release gas. Extracting it requires two key techniques used together: HORIZONTAL DRILLING (turning the well sideways through the shale layer to maximize contact) and HYDRAULIC FRACTURING (pumping water, sand, and chemicals at high pressure to crack the rock and release gas). The 2008+ shale revolution transformed US energy markets and made the US the world's largest natural gas producer.\n\nASSOCIATED gas is produced alongside oil from oil wells. The gas dissolves in crude oil at reservoir pressure; when oil is pumped to the surface, the gas separates out. Associated gas production depends entirely on oil drilling activity, not gas prices — which can create supply gluts in oil-heavy basins.\n\nMajor US gas basins to know:\n- MARCELLUS/UTICA (Pennsylvania, Ohio, West Virginia) — the biggest US gas producer, shale gas\n- PERMIAN (West Texas, southeastern New Mexico) — oil-driven, with massive associated gas production\n- HAYNESVILLE (northern Louisiana, east Texas) — major shale gas play\n- EAGLE FORD (south Texas) — both oil and gas\n- BAKKEN (North Dakota) — primarily oil, with significant associated gas\n\nEach basin has different geology, costs, pipeline access, and price dynamics. Understanding which basin a trade exposes you to is fundamental to gas trading.",questions:[
      {q:"What type of rock does CONVENTIONAL gas come from?",options:["Granite bedrock", "Porous, permeable rock like sandstone", "Coal seams", "Volcanic ash deposits"],answer:1,explain:"Conventional gas comes from porous, permeable rock — sandstone is a classic example."},
      {q:"What two techniques combined unlocked shale gas production?",options:["Strip mining + flotation", "Horizontal drilling + hydraulic fracturing", "Vertical drilling + steam injection", "Solar heating + chemical leaching"],answer:1,explain:"Horizontal drilling + fracking together unlocked the shale revolution starting around 2008."},
      {q:"When did the US shale revolution begin in earnest?",options:["1990s", "2008+", "Early 1970s", "2020s"],answer:1,explain:"The 2008+ shale revolution transformed US energy markets."},
      {q:"What is 'associated gas'?",options:["Gas produced alongside oil from oil wells", "Gas from joint-venture wells", "Mixed gas and propane", "Gas dissolved in groundwater"],answer:0,explain:"Associated gas comes up with crude oil from oil wells — supply driven by oil drilling activity."},
      {q:"Why is associated gas supply not very responsive to gas prices?",options:["It's controlled by OPEC", "It depends on oil drilling activity, not gas prices", "It's federally rationed", "Pipelines limit it"],answer:1,explain:"Producers drill for oil; gas is a byproduct — gas prices don't drive that decision."},
      {q:"Which is the BIGGEST US gas producing basin?",options:["Permian", "Haynesville", "Marcellus/Utica", "Eagle Ford"],answer:2,explain:"Marcellus/Utica in PA/OH/WV is the largest US gas producer."},
      {q:"Which states is the Permian Basin located in?",options:["PA and OH", "West Texas and southeastern New Mexico", "Louisiana and Mississippi", "North Dakota and Montana"],answer:1,explain:"Permian = West Texas + southeastern New Mexico, primarily an oil basin."},
      {q:"Which basin is described as primarily oil-driven but with massive associated gas production?",options:["Marcellus", "Permian", "Haynesville", "Bakken"],answer:1,explain:"Permian is oil-driven; its associated gas is a byproduct of oil drilling."},
      {q:"Where is the Haynesville basin located?",options:["Northern Louisiana and east Texas", "Pennsylvania", "North Dakota", "South Texas"],answer:0,explain:"Haynesville straddles northern Louisiana and east Texas — major shale gas."},
      {q:"What's the primary direction conventional gas wells are drilled?",options:["Horizontally", "Vertically", "At 45° angles", "In spirals"],answer:1,explain:"Conventional wells are drilled vertically — straight down to the porous pay zone."}
    ]},
    {id:"1f",title:"Supply and Demand",lesson:"Energy commodity prices respond to the basic economic forces of supply and demand — but with unique characteristics driven by the non-storable nature of electricity and the seasonal patterns of gas consumption.\n\nThe fundamental relationships are intuitive. Many buyers chasing scarce supply pushes prices up. Abundant supply combined with weak demand pushes prices down. But power and gas markets see these forces play out on time scales unfamiliar to other commodities — prices change hourly, sometimes by the minute.\n\nPOWER PRICE DYNAMICS: On a hot summer afternoon, air conditioning load surges across cities. Demand pushes against the limits of available generation, and wholesale power prices can spike from $30/MWh to over $1,000/MWh in hours. Conversely, at 3 AM in mild weather, demand crashes. Wind and inflexible coal/nuclear plants keep running, and prices can go NEGATIVE — generators actually pay the grid to take their output rather than incur the cost of shutting down and restarting.\n\nGAS PRICE DYNAMICS: Cold snaps in the Northeast can cause regional gas prices to multiply 5x in a single day as heating demand surges against pipeline capacity constraints. The Algonquin Citygate hub serving Boston is famous for these spikes — gas there has occasionally traded at over $50/MMBtu while the national benchmark at Henry Hub trades around $3/MMBtu.\n\nVOLATILITY DRIVERS: Weather is the single largest short-term driver. Pipeline outages, plant failures, and storage levels matter on longer horizons. Speculation amplifies movements but rarely causes them. The asymmetry between summer (mainly power demand) and winter (mainly heating demand) creates seasonal patterns traders exploit.\n\nThe price you see at any moment reflects a real-time balance of physical fundamentals, expectations, and trader positioning.",questions:[
      {q:"What pushes energy prices UP?",options:["Many buyers chasing scarce supply", "Abundant supply with weak demand", "Falling temperatures only", "Federal mandate"],answer:0,explain:"Classic supply-demand: scarcity + strong demand drives price increases."},
      {q:"What pushes energy prices DOWN?",options:["Hot weather", "Abundant supply combined with weak demand", "Pipeline expansions", "Strong industrial demand"],answer:1,explain:"Plentiful supply meeting weak demand pushes prices down."},
      {q:"What time scales do power and gas prices change on?",options:["Annually only", "Monthly only", "Hourly, sometimes by the minute", "Only when regulators change rules"],answer:2,explain:"Power and gas prices change hourly, sometimes by the minute — unusual for commodities."},
      {q:"What drives power price spikes on hot summer afternoons?",options:["Solar generation peaks", "Air conditioning load surges", "Industrial maintenance", "Trading volume"],answer:1,explain:"A/C demand surges across cities push wholesale power prices much higher."},
      {q:"From what level can wholesale power prices spike during peak demand?",options:["From $1 to $5", "From $30/MWh to over $1,000/MWh", "From $5 to $20", "Prices are capped"],answer:1,explain:"Power can move from ~$30/MWh to over $1,000/MWh in a few hours during scarcity."},
      {q:"Why can power prices go NEGATIVE at 3 AM in spring?",options:["Bug in trading software", "Generators pay to stay on rather than incur restart costs", "Federal subsidies", "Customers refuse to take power"],answer:1,explain:"Inflexible generators (coal/nuclear/wind) accept negative prices to avoid shutdown costs."},
      {q:"What is famous about the Algonquin Citygate gas hub?",options:["It serves Texas", "Cold snaps cause extreme price spikes — sometimes over $50/MMBtu", "It only trades on weekdays", "It is federally subsidized"],answer:1,explain:"Algonquin serves Boston and is famous for cold-snap spikes due to pipeline constraints."},
      {q:"What multiple can Northeast gas prices reach during a cold snap?",options:["Up to 5x in a day", "About 1.1x", "10x guaranteed", "Prices stay stable"],answer:0,explain:"Cold snaps can multiply Northeast gas prices 5x in a single day."},
      {q:"What is the single largest SHORT-TERM driver of energy prices?",options:["Weather", "Federal policy", "Currency moves", "Stock market"],answer:0,explain:"Weather is the dominant short-term driver — temperature shocks move power and gas prices most."},
      {q:"What's the seasonal asymmetry in energy demand?",options:["No seasonal pattern", "Summer drives power demand, winter drives heating demand", "Both peak in spring", "Both peak in fall"],answer:1,explain:"Summer = power demand (A/C); winter = heating demand — creates exploitable seasonal patterns."}
    ]},
  ]},
  2:{name:"MIDDLE SCHOOL",grade:"G4-6",tag:"L2",modules:[
    {id:"2a",title:"How Power is Generated",lesson:"Most plants spin a magnet inside coils. COAL/GAS: burn fuel → steam → turbine. NUCLEAR: uranium fission for heat. WIND: moving air. SOLAR PV: photons knock electrons loose in silicon (no spinning). HYDRO: falling water. CCGT (combined-cycle gas turbine) = jet-engine-like turbine + steam turbine on exhaust heat → ~6,400 Btu/kWh, ~58-63% efficient — workhorse of the modern US fleet.",questions:[
      {q:"Most plants generate by:",options:["Spinning a magnet inside a coil","Mixing reactive chemicals in a cell","Building static electricity in capacitors","Channeling lightning via tall masts"],answer:0,explain:"~95%+ use electromagnetic induction."},
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
      {q:"Load current in iteration 2 (after V=90V):",options:["10A","10.5A","11.11A","12A"],answer:2,explain:"I = S*/V* = 1000/90 = 11.11A — current rises as voltage drops."},
      {q:"Voltage at node B after iteration 2:",options:["90V","88.89V","87.5V","85V"],answer:1,explain:"V = 100 − (1)(11.11) = 88.89V. % change = 1.1% — not yet converged."},
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
  {lvl:1,topic:"POWER-FUND",q:"What flows through a wire to make electric current?",options:["Water molecules","Electrons","Air molecules","Photon particles"],answer:1},
  {lvl:1,topic:"POWER-FUND",q:"Bulk electricity storage is:",options:["Easy and cheap at grid scale","Difficult — supply must match demand each instant","Handled by large underground tanks","Fully solved by modern battery farms"],answer:1},
  {lvl:2,topic:"POWER-FUND",q:"Power (W) =",options:["V × I","V + I","V / I","V − I"],answer:0},
  {lvl:3,topic:"POWER-FUND",q:"Why use AC for grid?",options:["AC electrons travel faster than DC","Transformers easily step AC voltage up/down","AC current causes fewer accidents","DC transmission was outlawed in 1890s"],answer:1},
  {lvl:1,topic:"GAS-FUND",q:"Natural gas is mostly:",options:["Helium (He)","Methane (CH₄)","Hydrogen (H₂)","Propane (C₃H₈)"],answer:1},
  {lvl:2,topic:"GAS-FUND",q:"1 Dth ≈",options:["1 kWh of electricity","1 MMBtu (≈ 1 Mcf)","1 barrel of crude","1 gallon of diesel"],answer:1},
  {lvl:2,topic:"GAS-FUND",q:"Mcf =",options:["Million cubic feet (M=mega)","Thousand cubic feet (Roman M = 1,000)","Megacubic feet per hour","Metric cubic feet standard"],answer:1},
  {lvl:3,topic:"GAS-FUND",q:"Pipeline gas heat content ≈",options:["100 Btu/cf","1,000 Btu/cf","10,000 Btu/cf","1 Btu/cf"],answer:1},
  {lvl:1,topic:"GAS-CHAIN",q:"How does bulk gas reach end users?",options:["Wires","Pipelines","Trucks only","Wireless"],answer:1},
  {lvl:2,topic:"GAS-CHAIN",q:"NGLs are:",options:["Water and CO₂ removed at the wellhead","Ethane, propane, butane separated at processing","Liquefied natural gas ready for export","Light crude oil blended with gas"],answer:1},
  {lvl:2,topic:"GAS-CHAIN",q:"Storage with FASTEST cycling:",options:["Aquifer","Salt cavern","Depleted reservoir","LNG tank"],answer:1},
  {lvl:3,topic:"GAS-CHAIN",q:"A 'city gate' is:",options:["A municipal government building","Metering point: transmission gas → LDC","An LNG import terminal","An underground storage cavern"],answer:1},
  {lvl:2,topic:"POWER-GEN",q:"Most plants generate by:",options:["Spinning a magnet inside a coil","Mixing reactive chemicals in a cell","Building up static electric charges","Capturing lightning from the atmosphere"],answer:0},
  {lvl:2,topic:"POWER-GEN",q:"NOT dispatchable:",options:["Gas peaker","Coal","Wind farm","Nuclear"],answer:2},
  {lvl:3,topic:"POWER-GEN",q:"CCGT means:",options:["Coal-Coal Gas Turbine","Combined-Cycle Gas Turbine","Capacity Cap Gas Tariff","Carbon Capture"],answer:1},
  {lvl:4,topic:"POWER-GEN",q:"US nuclear fleet capacity factor:",options:["Around 50% due to refueling outages","Around 92-93% — highest of any source","Around 30% similar to wind capacity","Around 70% comparable to gas plants"],answer:1},
  {lvl:1,topic:"POWER-DELIV",q:"Long-distance bulk power:",options:["Underground gas pipelines","High-voltage transmission lines","Dedicated electric rail cars","Specialized power transport trucks"],answer:1},
  {lvl:2,topic:"POWER-DELIV",q:"Substations primarily contain:",options:["Gas-fired backup generators","Transformers + switchgear for voltage control","Revenue meters for billing customers","Large battery storage systems"],answer:1},
  {lvl:3,topic:"POWER-DELIV",q:"Why high voltage long-distance?",options:["Higher voltage looks more impressive on pylons","Lower current → much lower I²R losses","Only AC power can travel at high voltage","Federal law requires 345kV minimum"],answer:1},
  {lvl:4,topic:"POWER-DELIV",q:"Three principal US AC interconnections:",options:["Only one national grid exists","Eastern, Western, ERCOT","Northern, Southern, Central grids","PJM, MISO, and SPP only"],answer:1},
  {lvl:3,topic:"UTIL",q:"FERC regulates:",options:["State retail electricity rates","Interstate wholesale gas and power","Municipal utility tax assessments","Worker safety at power plants"],answer:1},
  {lvl:3,topic:"UTIL",q:"An LDC is:",options:["Long-Duration Contract for storage","Local Distribution Company serving customers","Light DC current measurement","Limited Demand Charge on utility bills"],answer:1},
  {lvl:3,topic:"UTIL",q:"Vertically integrated =",options:["Utility that only delivers power to homes","Utility that only owns power plants","Generates + delivers + bills as one regulated entity","Utility that only handles retail billing"],answer:2},
  {lvl:4,topic:"UTIL",q:"Cost-of-service ratemaking:",options:["Based on the utility's current stock price","Costs + depreciation + allowed return × rate base","Set randomly by state regulators each year","Tied to a published FERC commodity index"],answer:1},
  {lvl:2,topic:"POWER-MKT",q:"'5×16' refers to:",options:["A gas turbine efficiency model","Peak block: 5 weekdays × 16 hours","A transformer voltage rating","An IRS tax classification code"],answer:1},
  {lvl:3,topic:"POWER-MKT",q:"Most consequential US dereg failure:",options:["Texas 2021 winter storm failures","California 2000-01 market collapse","New York 2003 blackout cascade","Ohio 2014 polar vortex shortage"],answer:1},
  {lvl:4,topic:"POWER-MKT",q:"Energy-only ISO:",options:["PJM","MISO","ERCOT","NYISO"],answer:2},
  {lvl:5,topic:"POWER-MKT",q:"LMP = energy + losses + ___",options:["Capacity","Congestion","Carbon","Capital"],answer:1},
  {lvl:4,topic:"GAS-MKT",q:"Henry Hub is the delivery point for:",options:["NYMEX WTI","NYMEX NG futures","PJM power","ERCOT capacity"],answer:1},
  {lvl:4,topic:"GAS-MKT",q:"'Basis' (gas) =",options:["The Henry Hub spot price itself","Local hub price minus Henry Hub price","Total working gas in storage","Pipeline transportation tariff rate"],answer:1},
  {lvl:5,topic:"GAS-MKT",q:"Gas storage withdrawal season:",options:["Apr-Oct","Nov-Mar","Year-round","Dec only"],answer:1},
  {lvl:5,topic:"GAS-MKT",q:"JKM benchmarks LNG for:",options:["Gulf","NW Europe","NE Asia","Brazil"],answer:2},
  {lvl:5,topic:"DERIV",q:"Spark spread = power minus:",options:["The prevailing coal price at delivery","Heat rate × gas price (plus VOM)","The capacity market payment received","Transmission and distribution charges"],answer:1},
  {lvl:5,topic:"DERIV",q:"Heat rate (Btu/kWh):",options:["Nameplate capacity of the power plant","Fuel input per unit of electric output","Operating temperature of the boiler","Height of the exhaust smoke stack"],answer:1},
  {lvl:5,topic:"DERIV",q:"Backwardation in NG futures:",options:["Front month price is below back months","Front month price is above later months","Price differences are random each day","Determined by capacity market auction"],answer:1},
  {lvl:6,topic:"DERIV",q:"Margrabe / Kirk prices:",options:["Standard vanilla call options","Spread options (spark/dark spreads)","Fixed income bond derivatives","Foreign exchange forward contracts"],answer:1},
  {lvl:5,topic:"RISK",q:"VaR at 95%, 1-day:",options:["The maximum possible loss in one day","Loss threshold not exceeded with 95% prob over 1-day","The maximum profit achievable in a day","Minimum regulatory capital requirement"],answer:1},
  {lvl:6,topic:"RISK",q:"CVaR =",options:["Value-at-Risk plus one standard deviation","Average loss given that loss exceeds VaR","Always a smaller number than VaR itself","A randomly selected loss scenario value"],answer:1},
  {lvl:6,topic:"RISK",q:"Extrinsic storage value:",options:["Government subsidies for storage assets","Optionality / re-optimization right as curve shifts","Federal tax credits for gas storage","Value locked in cushion gas inventory"],answer:1},
  {lvl:6,topic:"RISK",q:"Wrong-way risk:",options:["Exposure moves randomly with market prices","Counterparty exposure rises as their credit deteriorates","A risk category only relevant in FX markets","When exposure moves favorably with credit quality"],answer:1},
  {lvl:4,topic:"DEAL",q:"PPA stands for:",options:["Power Producer Allowance","Power Purchase Agreement","Public Pipeline Authority","Pre-Pay Adjustment"],answer:1},
  {lvl:4,topic:"DEAL",q:"FT vs IT:",options:["Firm and interruptible transport are identical products","FT non-curtailable, daily reservation; IT cheaper, curtailed first","Firm transport is always the cheaper option","Interruptible transport is only for NGL liquids"],answer:1},
  {lvl:5,topic:"DEAL",q:"In tolling, the toller bears:",options:["All plant capital expenditure costs","Spark spread / heat rate exposure on fuel and power","Annual property taxes on the facility","Liability insurance premiums only"],answer:1},
  {lvl:6,topic:"DEAL",q:"A 'swing' option in gas:",options:["Locks buyer into a fixed daily delivery volume","Vary daily takes within min/max; subject to MAQ","Allows buyer to refuse all deliveries freely","Includes free pipeline transportation rights"],answer:1},
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
  const [showPwd,setShowPwd]=useState(false);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [showReset,setShowReset]=useState(false);
  const [resetSent,setResetSent]=useState(false);

  const login=async()=>{
    if(!email||!password){setError("Email and password required.");return;}
    setLoading(true);setError("");
    const{error:e}=await supabase.auth.signInWithPassword({email,password});
    setLoading(false);
    if(e){const msg=e.message?.includes("Invalid login")?"Email or password is incorrect.":e.message;setError(msg);}else onSuccess();
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
              <div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Password</div>
                <div className="relative">
                  <input type={showPwd?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 px-3 py-2 pr-10 text-xs font-mono focus:border-lime-500 outline-none" placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&login()}/>
                  <button type="button" onClick={()=>setShowPwd(!showPwd)} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-lime-400 font-mono text-[10px] uppercase tracking-wider px-1.5 py-1" aria-label={showPwd?"Hide password":"Show password"}>{showPwd?"hide":"show"}</button>
                </div>
              </div>
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
  const [showMenu,setShowMenu]=useState(false);
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
      const p=progressRef.current;
      const updated={...p,timeSpentSeconds:(p.timeSpentSeconds||0)+elapsed};
      setProgress(updated);
      progressRef.current=updated;
      await saveProgress(updated);
    },30000);
    return()=>clearInterval(interval);
  },[]);

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
    progressRef.current=updated;
    setProgress(updated);
    try{
      await saveProgress(updated);
    }catch(e){
      console.error("Save failed:",e);
    }
    setView("placement-result");
  };

  const handleSavePlacement=async(idx,picks)=>{
    const p=progressRef.current;
    await persist({...p,placementIdx:idx,placementPicks:picks});
  };

  const handleModuleComplete=async(id,pct,total,correct)=>{
    const p=progressRef.current;
    const nc={...p.completed,[id]:pct};
    let nl=p.level;
    const cm=CURRICULUM[p.level].modules.map(m=>m.id);
    if(cm.every(mid=>(nc[mid]||0)>=70)&&p.level<6)nl=p.level+1;
    const updated={...p,level:nl,completed:nc,totalAnswered:p.totalAnswered+total,totalCorrect:p.totalCorrect+correct,currentModule:null,currentQuestion:0,currentAnswers:[]};
    progressRef.current=updated;
    setProgress(updated);
    await saveProgress(updated);
  };

  const handleViewChange=async(v)=>{
    if(typeof v==="object"&&v.type==="module"){
      const p=progressRef.current;
      if(v.id!==p.currentModule){
        await persist({...p,currentModule:v.id,currentQuestion:0,currentAnswers:[]});
      }
      setActiveModuleId(v.id);setView("module");
    }else setView(v);
  };

  const fullName=user.user_metadata?.full_name||user.email;

  return(
    <div className="min-h-screen bg-black text-zinc-100" style={{backgroundImage:"radial-gradient(circle at 20% 30%, rgba(132,204,22,0.04), transparent 50%), radial-gradient(circle at 80% 70%, rgba(245,158,11,0.04), transparent 50%)"}}>
      {showChangePwd&&<ChangePasswordModal onClose={()=>setShowChangePwd(false)}/>}
      {showMenu&&<div className="fixed inset-0 z-40" onClick={()=>setShowMenu(false)}/>}
      <header className="border-b border-zinc-800 px-4 py-3 flex justify-between items-center relative">
        <div className="flex items-center gap-3 min-w-0">
          <Zap size={16} className="text-lime-400 flex-shrink-0"/>
          <Flame size={16} className="text-amber-400 flex-shrink-0"/>
          <span className="font-mono text-sm tracking-wider text-zinc-100 flex-shrink-0">NGPX//ACADEMY</span>
          {view==="module"&&activeModuleId&&progress.placed&&(()=>{
            const mod=CURRICULUM[progress.level]?.modules?.find(m=>m.id===activeModuleId)||Object.values(CURRICULUM).flatMap(l=>l.modules).find(m=>m.id===activeModuleId);
            return mod?(
              <>
                <span className="font-mono text-xs text-zinc-700 hidden md:inline">/</span>
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider hidden md:inline">L{progress.level} · {CURRICULUM[progress.level].name}</span>
                <span className="font-mono text-xs text-zinc-700 hidden md:inline">/</span>
                <span className="font-mono text-[10px] text-amber-400 font-bold hidden md:inline truncate">{mod.id} · {mod.title}</span>
              </>
            ):null;
          })()}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {progress.placed&&view!=="module"&&<Pill color={progress.level>=5?"lime":"amber"}>L{progress.level} · {CURRICULUM[progress.level].name}</Pill>}
          <span className="font-mono text-[10px] text-zinc-500 hidden md:inline">{fullName}</span>
          <div className="relative">
            <button onClick={()=>setShowMenu(!showMenu)} className="font-mono text-[10px] text-zinc-300 hover:text-lime-400 uppercase tracking-wider border border-zinc-700 hover:border-lime-500 px-2.5 py-1.5 flex items-center gap-1">
              ⚙ Menu <span className="text-[8px]">▾</span>
            </button>
            {showMenu&&(
              <div className="absolute top-full right-0 mt-1 bg-zinc-950 border border-zinc-700 min-w-[160px] z-50 font-mono">
                {onBackToAdmin&&(
                  <button onClick={()=>{setShowMenu(false);onBackToAdmin();}} className="w-full text-left text-[10px] text-zinc-300 hover:text-lime-400 hover:bg-zinc-900 uppercase tracking-wider px-3 py-2 border-b border-zinc-800 flex items-center gap-2">
                    ▸ Admin
                  </button>
                )}
                <button onClick={()=>{setShowMenu(false);onGoHome();}} className="w-full text-left text-[10px] text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900 uppercase tracking-wider px-3 py-2 border-b border-zinc-800 flex items-center gap-2">
                  ⌂ Home
                </button>
                <button onClick={()=>{setShowMenu(false);setShowChangePwd(true);}} className="w-full text-left text-[10px] text-zinc-300 hover:text-cyan-400 hover:bg-zinc-900 uppercase tracking-wider px-3 py-2 border-b border-zinc-800 flex items-center gap-2">
                  ⚙ Change password
                </button>
                <button onClick={()=>{setShowMenu(false);onSignOut();}} className="w-full text-left text-[10px] text-rose-400 hover:text-rose-300 hover:bg-zinc-900 uppercase tracking-wider px-3 py-2 flex items-center gap-2">
                  <LogOut size={10}/> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="py-4">
        {view==="welcome"&&<WelcomeScreen onStart={()=>setView("placement")}/>}
        {view==="placement"&&<Placement onComplete={handlePlacementComplete} resumeIdx={progress.placementIdx} resumePicks={progress.placementPicks} onSavePlacement={handleSavePlacement}/>}
        {view==="placement-result"&&<PlacementResult score={placementScore} level={progressRef.current.level} byLevel={placementByLevel} byTopic={placementByTopic} onContinue={()=>setView("dashboard")}/>}
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
  return(
    <div className="max-w-2xl mx-auto p-4">
      <Panel title="PLACEMENT TEST" accent="lime">
        <div className="font-mono text-zinc-300 text-sm leading-relaxed space-y-3">
          <div className="text-zinc-100 text-base font-bold mb-1">Before you begin</div>
          <p className="text-zinc-400">This test places you in the right tier so you start learning at the right level — not too easy, not too hard.</p>

          <div className="grid grid-cols-2 gap-px bg-zinc-800 border border-zinc-800 my-4">
            <div className="bg-zinc-950 p-3">
              <div className="text-zinc-500 text-[9px] uppercase tracking-wider mb-1">Questions</div>
              <div className="text-lime-400 text-xl font-bold">44</div>
              <div className="text-zinc-600 text-[10px]">across 11 topics</div>
            </div>
            <div className="bg-zinc-950 p-3">
              <div className="text-zinc-500 text-[9px] uppercase tracking-wider mb-1">Time</div>
              <div className="text-amber-400 text-xl font-bold">~10 min</div>
              <div className="text-zinc-600 text-[10px]">at your own pace</div>
            </div>
            <div className="bg-zinc-950 p-3">
              <div className="text-zinc-500 text-[9px] uppercase tracking-wider mb-1">Result</div>
              <div className="text-cyan-400 text-xl font-bold">L1–L6</div>
              <div className="text-zinc-600 text-[10px]">personalised tier</div>
            </div>
            <div className="bg-zinc-950 p-3">
              <div className="text-zinc-500 text-[9px] uppercase tracking-wider mb-1">Rules</div>
              <div className="text-rose-400 text-sm font-bold">No backtrack</div>
              <div className="text-zinc-600 text-[10px]">answers are final</div>
            </div>
          </div>

          <div className="border-l-2 border-zinc-700 pl-3 my-3">
            <div className="text-zinc-500 text-xs leading-relaxed">Don't worry about your score — the test is designed to find where your knowledge starts, not to grade you.</div>
          </div>
        </div>
        <div className="mt-6">
          <Btn onClick={onStart} variant="primary" className="w-full text-center justify-center">▸ START PLACEMENT TEST</Btn>
          <div className="text-zinc-600 text-[10px] text-center mt-2">Progress is saved — you can resume if you close the browser</div>
        </div>
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

  const [finishing,setFinishing]=useState(false);
  const advance=async()=>{
    const correct=selected===q.answer;
    const next=[...picks,{lvl:q.lvl,topic:q.topic,correct}];
    if(idx===shuffled.length-1){
      setFinishing(true);
      const byLevel={},byTopic={};
      next.forEach(p=>{
        if(!byLevel[p.lvl])byLevel[p.lvl]={c:0,t:0};byLevel[p.lvl].t++;if(p.correct)byLevel[p.lvl].c++;
        if(!byTopic[p.topic])byTopic[p.topic]={c:0,t:0};byTopic[p.topic].t++;if(p.correct)byTopic[p.topic].c++;
      });
      let starting=1;
      for(let L=1;L<=6;L++){if(byLevel[L]&&byLevel[L].c/byLevel[L].t>=0.5)starting=L;}
      await onComplete(starting,next.filter(p=>p.correct).length,byLevel,byTopic);
      setFinishing(false);
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
            {showAnswer&&<Btn onClick={advance} variant="primary" disabled={finishing}>{finishing?"SAVING...":idx===shuffled.length-1?"FINISH":"NEXT"} <ChevronRight size={12} className="inline"/></Btn>}
          </div>
        </div>
      </Panel>
    </div>
  );
}

// PLACEMENT RESULT
function PlacementResult({score,level,byLevel,byTopic,onContinue}){
  const topicRows=Object.entries(byTopic||{}).map(([t,v])=>({topic:t,c:v.c,t_:v.t,pct:Math.round((v.c/v.t)*100)})).sort((a,b)=>a.pct-b.pct);
  const strong=topicRows.filter(r=>r.pct>=70).reverse().slice(0,3);
  const focus=topicRows.filter(r=>r.pct<50).slice(0,3);
  const pctColor=p=>p>=80?"text-lime-400":p>=50?"text-amber-400":"text-rose-400";
  const barColor=p=>p>=80?"bg-lime-400":p>=50?"bg-amber-400":"bg-rose-400";
  const pctScore=Math.round((score/PLACEMENT.length)*100);

  // Get the first module of the placed level
  const firstModule=CURRICULUM[level]?.modules?.[0];
  const levelExplanations={
    1:"You're starting at the foundations. Take it step by step — the early modules cover essential vocabulary you'll need everywhere else.",
    2:"You have basic familiarity with energy concepts. The next modules build out the value chain and physical infrastructure.",
    3:"You have solid foundations but haven't yet covered market structure and trading mechanics.",
    4:"You understand market basics. The next modules dive into wholesale market mechanics and dispatch.",
    5:"You're at a strong intermediate level. The remaining modules cover advanced pricing, capacity markets, and trading strategies.",
    6:"You're at the top tier. These modules cover quant methods, structured products, and advanced risk."
  };

  return(
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <Panel title="ASSESSMENT COMPLETE" accent="lime">
        <div className="font-mono grid grid-cols-3 gap-4">
          <div>
            <div className="text-xs text-zinc-500 mb-1">SCORE</div>
            <div className="text-3xl text-lime-400 font-bold">{score}<span className="text-zinc-600 text-xl">/{PLACEMENT.length}</span></div>
            <div className="text-zinc-600 text-[10px]">{pctScore}% correct</div>
          </div>
          <div>
            <div className="text-xs text-zinc-500 mb-1">PLACEMENT</div>
            <div className="text-2xl text-amber-400 font-bold">L{level}</div>
            <div className="text-xs text-zinc-400">{CURRICULUM[level].name}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-500 mb-1">PATH TO L5</div>
            <div className="text-2xl text-cyan-400 font-bold">{level>=5?"AT TARGET":`+${5-level}`}</div>
            {level<5&&<div className="text-zinc-600 text-[10px]">{5-level===1?"tier":"tiers"} to go</div>}
          </div>
        </div>
      </Panel>

      <div className="border border-amber-700 bg-amber-950/20 p-4 font-mono">
        <div className="text-amber-400 text-[10px] uppercase tracking-[0.15em] font-bold mb-2">▸ What this means</div>
        <div className="text-amber-100 text-sm leading-relaxed mb-2">
          You've been placed at <span className="font-bold">L{level} — {CURRICULUM[level].name}</span>. {levelExplanations[level]}
        </div>
        {firstModule&&level<6&&<div className="text-amber-400 text-xs font-bold mt-3">▸ Start with module {firstModule.id} — {firstModule.title}</div>}
      </div>

      {(strong.length>0||focus.length>0)&&(
        <Panel title="YOUR PROFILE" accent="cyan">
          {strong.length>0&&(
            <div className="mb-3">
              <div className="text-zinc-500 text-[10px] uppercase tracking-wider mb-2">Strong topics</div>
              <div className="flex flex-wrap gap-1.5">
                {strong.map(r=><span key={r.topic} className="border border-lime-700 bg-lime-950/30 text-lime-400 text-[10px] px-2 py-1 font-mono">{TOPIC_LABELS[r.topic]||r.topic}</span>)}
              </div>
            </div>
          )}
          {focus.length>0&&(
            <div>
              <div className="text-zinc-500 text-[10px] uppercase tracking-wider mb-2">Focus areas</div>
              <div className="flex flex-wrap gap-1.5">
                {focus.map(r=><span key={r.topic} className="border border-rose-800 bg-rose-950/30 text-rose-400 text-[10px] px-2 py-1 font-mono">{TOPIC_LABELS[r.topic]||r.topic}</span>)}
              </div>
            </div>
          )}
        </Panel>
      )}

      <Panel title="TOPIC BREAKDOWN" accent="zinc">
        <div className="font-mono text-xs">
          {topicRows.map(r=>(<div key={r.topic} className="grid grid-cols-12 gap-2 px-2 py-1.5 border-b border-zinc-900"><div className="col-span-6"><div className="text-zinc-100">{TOPIC_LABELS[r.topic]||r.topic}</div></div><div className="col-span-2 text-right tabular-nums text-zinc-300">{r.c}/{r.t_}</div><div className={`col-span-1 text-right tabular-nums font-bold ${pctColor(r.pct)}`}>{r.pct}%</div><div className="col-span-3 flex items-center"><div className="h-1.5 w-full bg-zinc-900"><div className={`h-full ${barColor(r.pct)}`} style={{width:`${r.pct}%`}}/></div></div></div>))}
        </div>
      </Panel>

      <div className="pt-2">
        <Btn onClick={onContinue} variant="primary" className="w-full text-center justify-center">▸ GO TO MY DASHBOARD</Btn>
      </div>
    </div>
  );
}

// DASHBOARD
function Dashboard({state,onView}){
  const completed=Object.keys(state.completed).length;
  const total=Object.values(CURRICULUM).reduce((s,l)=>s+l.modules.length,0);

  // For each tier, compute cleared/total and whether any module needs retry
  const tierStats=(L)=>{
    const mods=CURRICULUM[L]?.modules||[];
    const cleared=mods.filter(m=>(state.completed[m.id]||0)>=70).length;
    const needsRetry=mods.filter(m=>state.completed[m.id]!==undefined&&state.completed[m.id]<70);
    return{cleared,total:mods.length,needsRetry};
  };

  return(
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Panel title="LEVEL" accent="amber"><div className="font-mono"><div className="text-2xl font-bold text-amber-400">L{state.level}</div><div className="text-[10px] text-zinc-500 uppercase">{CURRICULUM[state.level].name}</div></div></Panel>
        <Panel title="PROGRESS" accent="lime"><div className="font-mono"><div className="text-2xl font-bold text-lime-400">{completed}<span className="text-zinc-600 text-base">/{total}</span></div><div className="text-[10px] text-zinc-500 uppercase">modules cleared</div></div></Panel>
        <Panel title="ACCURACY" accent="cyan"><div className="font-mono"><div className="text-2xl font-bold text-cyan-400">{state.totalAnswered?Math.round((state.totalCorrect/state.totalAnswered)*100):0}%</div><div className="text-[10px] text-zinc-500 uppercase">{state.totalCorrect}/{state.totalAnswered}</div></div></Panel>
        <Panel title="TIME SPENT" accent="fuchsia"><div className="font-mono"><div className="text-2xl font-bold text-fuchsia-400">{fmtTime(state.timeSpentSeconds||0)}</div><div className="text-[10px] text-zinc-500 uppercase">study time</div></div></Panel>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={()=>onView("trivia")} className="border border-fuchsia-700 hover:border-fuchsia-500 bg-zinc-950/60 p-3 font-mono text-xs uppercase tracking-wider text-fuchsia-400 flex items-center justify-center gap-2"><Trophy size={14}/> Trivia</button>
        <button onClick={()=>onView("cards")} className="border border-cyan-700 hover:border-cyan-500 bg-zinc-950/60 p-3 font-mono text-xs uppercase tracking-wider text-cyan-400 flex items-center justify-center gap-2"><Shuffle size={14}/> Flashcards</button>
      </div>

      {Object.entries(CURRICULUM).map(([lvl,data],idx,arr)=>{
        const L=parseInt(lvl);
        const locked=L>state.level;
        const isCurrent=L===state.level;
        const isNextLocked=L===state.level+1;
        const {cleared,total:tierTotal,needsRetry}=tierStats(L);
        const prevStats=L>1?tierStats(L-1):null;
        const remaining=prevStats?prevStats.total-prevStats.cleared:0;

        return(
          <div key={lvl}>

            {/* Unlock banner — shown just before the next locked tier */}
            {isNextLocked&&state.level<6&&(()=>{
              const ps=tierStats(state.level);
              const retryMods=ps.needsRetry;
              const left=ps.total-ps.cleared;
              return(
                <div className="border border-fuchsia-900 bg-zinc-950/80 px-4 py-3 flex items-center gap-4 font-mono">
                  <span className="text-lg flex-shrink-0">🔒</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-fuchsia-400 text-[10px] uppercase tracking-[0.15em] font-bold mb-1">{data.tag} {data.name} — Locked</div>
                    <div className="text-zinc-500 text-[11px]">
                      Pass <span className="text-zinc-300">all {ps.total} L{state.level} modules</span> at <span className="text-zinc-300">70%+</span> to unlock
                      {retryMods.length>0&&<span className="text-rose-400"> · {retryMods.map(m=>m.id).join(", ")} {retryMods.length===1?"needs":"need"} a retry</span>}
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-fuchsia-400 text-xl font-bold leading-none">{ps.cleared}<span className="text-fuchsia-900 text-sm">/{ps.total}</span></div>
                    <div className="text-fuchsia-900 text-[9px] uppercase tracking-wider">done</div>
                  </div>
                </div>
              );
            })()}

            <Panel
              key={lvl}
              title={`${data.tag} // ${data.name} · ${data.grade}${isCurrent?" — "+cleared+"/"+tierTotal+" cleared":""}`}
              accent={locked?"zinc":isCurrent?"amber":"lime"}
              className={locked?"opacity-50":""}
            >
              {/* current tier progress bar */}
              {isCurrent&&tierTotal>0&&(
                <div className="mb-3">
                  <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 transition-all rounded-full" style={{width:`${(cleared/tierTotal)*100}%`}}/>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {data.modules.map((m,modIdx)=>{
                  const score=state.completed[m.id];
                  const passed=score!==undefined&&score>=70;
                  const needsRetryModule=score!==undefined&&score<70;
                  const t=MODULE_TOPIC[m.id];
                  // "Start here" badge: first incomplete module of current tier, only if user hasn't started any module yet in this tier
                  const tierHasProgress=data.modules.some(mm=>state.completed[mm.id]!==undefined);
                  const isStartHere=isCurrent&&!locked&&score===undefined&&!tierHasProgress&&data.modules.findIndex(mm=>state.completed[mm.id]===undefined)===modIdx;
                  return(
                    <button
                      key={m.id}
                      onClick={()=>!locked&&onView({type:"module",id:m.id})}
                      disabled={locked}
                      className={`text-left p-3 border font-mono text-xs transition-colors relative ${
                        locked?"border-zinc-900 text-zinc-700 cursor-not-allowed bg-zinc-950/30":
                        isStartHere?"border-lime-400 bg-lime-950/40 text-zinc-100":
                        passed?"border-lime-700 bg-lime-950/20 text-lime-300":
                        needsRetryModule?"border-amber-800 bg-amber-950/20 text-amber-200":
                        "border-zinc-800 hover:border-amber-600 text-zinc-300"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] text-zinc-500">{m.id}</span>
                        <div className="flex gap-1 items-center">
                          {isStartHere&&<span className="text-[9px] bg-lime-400 text-black px-1.5 py-0.5 uppercase tracking-wider font-bold">Start here</span>}
                          {t&&!locked&&!isStartHere&&<Pill color="zinc">{t}</Pill>}
                          {passed&&<Check size={11} className="text-lime-400"/>}
                          {needsRetryModule&&<span className="text-[9px] bg-rose-950 text-rose-400 px-1.5 py-0.5 uppercase tracking-wider">Retry</span>}
                          {locked&&<span className="text-zinc-700 text-[10px]">LOCKED</span>}
                        </div>
                      </div>
                      <div className={locked?"text-zinc-700 text-xs":"text-zinc-100 text-xs"}>{m.title}</div>
                      {score!==undefined&&(
                        <div className={`text-[10px] mt-1 ${passed?"text-lime-600":"text-rose-500"}`}>
                          {score}%{needsRetryModule&&" · need 70%"}
                        </div>
                      )}
                      {isStartHere&&<div className="text-[10px] mt-1 text-lime-500">▸ Your first module</div>}
                    </button>
                  );
                })}
              </div>
            </Panel>
          </div>
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
  const [finishing,setFinishing]=useState(false);
  const next=async()=>{
    if(qIdx===shuffledQuestions.length-1){
      setFinishing(true);
      const c=answers.filter(a=>a).length;
      const pct=Math.round((c/shuffledQuestions.length)*100);
      // Await onComplete first — it saves completion + clears current_module atomically
      await onComplete(mod.id,pct,shuffledQuestions.length,c);
      setPhase("done");
      setFinishing(false);
    }else{setQIdx(qIdx+1);setSelected(null);setShowAnswer(false);}
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
            {showAnswer&&<Btn onClick={next} variant="primary" disabled={finishing}>{finishing?"SAVING...":qIdx===shuffledQuestions.length-1?"FINISH":"NEXT"} <ChevronRight size={12} className="inline"/></Btn>}
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
  const [correctCount,setCorrectCount]=useState(0);
  const [streak,setStreak]=useState(0);
  const [bestStreak,setBestStreak]=useState(0);
  const [timeLeft,setTimeLeft]=useState(15);
  const [selected,setSelected]=useState(null);
  const [showAnswer,setShowAnswer]=useState(false);
  const tickRef=useRef(null);

  const start=()=>{
    const filtered=ALL_Q.filter(q=>q.level<=Math.min(state.level+1,6));
    setPool([...filtered].sort(()=>Math.random()-0.5).slice(0,Math.min(15,filtered.length)).map(q=>shuffleQuestion(q)));
    setIdx(0);setScore(0);setCorrectCount(0);setStreak(0);setBestStreak(0);setSelected(null);setShowAnswer(false);setTimeLeft(15);setPhase("playing");
  };

  useEffect(()=>{
    if(phase!=="playing"||showAnswer)return;
    tickRef.current=setInterval(()=>{setTimeLeft(t=>{if(t<=1){clearInterval(tickRef.current);setShowAnswer(true);setStreak(0);return 0;}return t-1;});},1000);
    return()=>clearInterval(tickRef.current);
  },[phase,idx,showAnswer]);

  const submit=(i)=>{
    if(showAnswer)return;setSelected(i);setShowAnswer(true);clearInterval(tickRef.current);
    if(i===pool[idx].answer){const pts=100+(timeLeft*10)+(streak*25);setScore(s=>s+pts);setCorrectCount(c=>c+1);const ns=streak+1;setStreak(ns);setBestStreak(b=>Math.max(b,ns));}else setStreak(0);
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
          <div className="text-zinc-300 text-sm mb-1">{correctCount}/{pool.length} correct</div>
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

  const loadProgress=async(u)=>{
    try{
      const timeout=new Promise((_,reject)=>setTimeout(()=>reject(new Error("timeout")),5000));
      const query=supabase.from("progress").select("*").eq("id",u.id).single();
      const{data}=await Promise.race([query,timeout]);
      if(data){
        setProgress({
          placed:data.placed||false,level:data.level||1,
          completed:data.completed_modules||{},
          triviaHigh:data.trivia_high_score||0,
          totalAnswered:data.total_answered||0,
          totalCorrect:data.total_correct||0,
          timeSpentSeconds:data.time_spent_seconds||0,
          currentModule:data.current_module||null,
          currentQuestion:data.current_question||0,
          currentAnswers:data.current_answers||[],
          placementIdx:data.placement_idx||0,
          placementPicks:data.placement_picks||[],
          placementScore:data.placement_score!=null?data.placement_score:null,
        });
      }else{
        setProgress(defaultProgress);
        await supabase.from("progress").upsert({
          id:u.id,email:u.email,
          full_name:u.user_metadata?.full_name||u.email,
          level:1,placed:false,completed_modules:{},
          trivia_high_score:0,total_answered:0,total_correct:0,
          time_spent_seconds:0,current_module:null,current_question:0,
          current_answers:[],placement_idx:0,placement_picks:[],
          placement_score:null,updated_at:new Date().toISOString(),
        },{onConflict:"id"});
      }
    }catch(e){
      console.error("loadProgress failed:",e.message);
      setProgress(defaultProgress);
    }
  };

  useEffect(()=>{
    // Handle invite/recovery links
    const hash=window.location.hash;
    if(hash&&(hash.includes("type=invite")||hash.includes("type=recovery"))){
      setAppView("set-password");
      return;
    }

    // onAuthStateChange is the primary handler
    const{data:{subscription}}=supabase.auth.onAuthStateChange(async(event,session)=>{
      if(event==="USER_UPDATED") return;
      if(event==="PASSWORD_RECOVERY"){setAppView("set-password");return;}
      if(session?.user){
        setUser(session.user);
        await loadProgress(session.user);
        setAppView("app");
      }else{
        setUser(null);
        setProgress(defaultProgress);
        setStudentView(false);
        setAppView("landing");
      }
    });

    // getSession: only go to landing if no session AND still on initial loading screen
    supabase.auth.getSession().then(({data:{session}})=>{
      if(!session?.user) setAppView("landing");
      // If session exists, INITIAL_SESSION event fires → onAuthStateChange handles it
    });

    return()=>subscription.unsubscribe();
  },[]);

  // Safety net: if stuck on loading after 6s, go to landing
  useEffect(()=>{
    if(appView!=="loading") return;
    const t=setTimeout(()=>setAppView("landing"),6000);
    return()=>clearTimeout(t);
  },[appView]);

  const signOut=async()=>{
    await supabase.auth.signOut();
    setStudentView(false);
    setAppView("landing");
  };

  if(appView==="loading")return(
    <div className="min-h-screen bg-black flex items-center justify-center font-mono text-sm">
      <div className="text-lime-400 animate-pulse">▸ LOADING...</div>
    </div>
  );
  if(appView==="set-password")return <SetPasswordPage onDone={()=>{window.location.hash="";setAppView("app");}}/>;
  if(appView==="landing")return <LandingPage onLogin={()=>setAppView("login")}/>;
  if(appView==="login")return <LoginPage onBack={()=>setAppView("landing")} onSuccess={()=>{}}/>;

  if(appView==="app"&&user){
    const isAdmin=ADMIN_EMAILS.includes(user.email);
    if(isAdmin&&!studentView){
      return <AdminDashboard user={user} onSignOut={signOut} onViewAsStudent={()=>setStudentView(true)} onGoHome={()=>setAppView("landing")}/>;
    }
    return <MainApp user={user} progress={progress} setProgress={setProgress} onSignOut={()=>{setStudentView(false);signOut();}} onBackToAdmin={isAdmin?()=>setStudentView(false):null} onGoHome={()=>setAppView("landing")}/>;
  }

  if(appView==="app"&&!user)return(
    <div className="min-h-screen bg-black flex items-center justify-center font-mono text-sm">
      <div className="text-lime-400 animate-pulse">▸ LOADING...</div>
    </div>
  );

  return null;
}

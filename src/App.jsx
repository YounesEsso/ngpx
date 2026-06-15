import React, { useState, useEffect, useRef, useMemo } from "react";
import { Zap, Flame, ChevronRight, ArrowLeft, Check, X, Trophy, Target, Database, Shuffle, LogOut } from "lucide-react";
import { supabase } from "./supabase.js";

const ADMIN_EMAILS = ["younes.essoulami@engie.com", "narsimha.misra@engie.com", "michelle.mouton@engie.com"];

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
    {id:"2a",title:"How Power is Generated",lesson:"Electricity is produced by converting other energy forms — chemical, nuclear, kinetic, or solar — into electric current. Most large power plants use the same basic principle: spin a magnet inside a coil of wire to induce voltage. The differences lie in what energy is used to spin the turbine.\n\nTHERMAL PLANTS burn fuel to make steam. Gas-fired combined-cycle plants (CCGT) are the most efficient, reaching 58-63% efficiency by capturing exhaust heat in a second steam cycle. Coal plants burn pulverized coal to make steam directly — around 33-40% efficient. Nuclear plants use the heat from controlled fission reactions to make steam, with 33-38% efficiency but extremely high capacity factors (90%+).\n\nHYDROELECTRIC plants use falling water to spin turbines directly — no combustion, no heat. They're highly efficient (90%+) and dispatchable but limited to specific geography. Pumped storage hydro is the only utility-scale energy storage technology that has been widely deployed.\n\nWIND turbines convert kinetic energy of moving air directly to electricity. They're intermittent (depend on wind speed) and have low capacity factors (typically 30-45%). \n\nSOLAR comes in two forms. Photovoltaic (PV) panels convert sunlight directly to DC current via the photoelectric effect, then inverters convert it to AC for the grid. Solar thermal uses mirrors to concentrate sunlight, heat a fluid, and drive a steam turbine. PV is now dominant.\n\nA key concept is the CAPACITY FACTOR — the percentage of nameplate capacity actually produced over time. Nuclear runs near 90%, gas 50-60%, wind 30-45%, solar 20-30%. This matters for dispatch and economics: a 100 MW solar plant doesn't equal a 100 MW gas plant.",questions:[
      {q:"What basic principle do most large power plants use to generate electricity?",options:["Static electricity buildup", "Spin a magnet inside a coil of wire", "Direct chemical conversion", "Nuclear decay"],answer:1,explain:"Generators spin a magnet in a coil to induce voltage — the basic principle for thermal, hydro, and wind plants."},
      {q:"What is the typical efficiency range of a combined-cycle gas turbine (CCGT)?",options:["20-30%", "33-40%", "58-63%", "Over 90%"],answer:2,explain:"CCGT plants reach 58-63% by capturing exhaust heat in a second steam cycle — the most efficient thermal technology."},
      {q:"Why are CCGT plants more efficient than simple gas turbines?",options:["They use cleaner fuel", "They capture exhaust heat in a second steam cycle", "They burn at higher temperature", "They have larger turbines"],answer:1,explain:"The 'combined cycle' = gas turbine + steam turbine driven by gas turbine exhaust heat."},
      {q:"What is nuclear's capacity factor?",options:["Around 30%", "Around 50%", "Around 90%+", "Around 20%"],answer:2,explain:"Nuclear plants run near 90% capacity factor — they're designed for baseload, running constantly."},
      {q:"What's unique about hydroelectric plants compared to thermal?",options:["They're less efficient", "They use falling water directly — no combustion or heat needed", "They only work at night", "They need fossil fuel backup"],answer:1,explain:"Hydro skips the heat-to-steam step — water falls directly through a turbine."},
      {q:"What does a wind turbine convert?",options:["Heat to electricity", "Light to electricity", "Kinetic energy of moving air to electricity", "Chemical energy to electricity"],answer:2,explain:"Wind turbines convert the kinetic energy of air movement directly to electric current."},
      {q:"What are the two main types of solar generation?",options:["Hot solar and cold solar", "Photovoltaic (PV) and solar thermal", "Direct and indirect", "Daytime and nighttime"],answer:1,explain:"PV uses panels to make DC from sunlight; solar thermal concentrates sunlight to drive a steam turbine."},
      {q:"What does 'capacity factor' measure?",options:["Maximum nameplate output", "The percentage of nameplate capacity actually produced over time", "Fuel cost per MWh", "Plant operating expense"],answer:1,explain:"Capacity factor = actual production / theoretical maximum if the plant ran at full power 24/7."},
      {q:"Which technology has the LOWEST capacity factor mentioned?",options:["Nuclear", "Gas", "Wind", "Solar"],answer:3,explain:"Solar runs at 20-30% capacity factor — limited by daylight and weather."},
      {q:"Why does the lesson note that a 100 MW solar plant doesn't equal a 100 MW gas plant?",options:["Solar is more expensive", "Solar uses different voltage", "Capacity factors differ — solar produces far less actual energy from the same nameplate", "Gas requires more land"],answer:2,explain:"Nameplate capacity is theoretical max; capacity factor determines actual output — solar's much lower than gas."}
    ]},
    {id:"2b",title:"What is a Utility?",lesson:"A utility is a company that provides essential services — electricity, gas, water — to homes and businesses in a defined geographic territory. In the US energy sector, utilities are regulated monopolies, granted exclusive rights to serve their territory in exchange for accepting government oversight of their rates and operations.\n\nThe economic logic is \"natural monopoly\". Running parallel sets of power lines or gas pipes to every house would be enormously wasteful. So society lets one company build the infrastructure — but caps their profits and regulates their rates so they can't exploit the monopoly position.\n\nHistorically, US utilities were VERTICALLY INTEGRATED — one entity owned the generation plants, the transmission wires, the distribution lines, and handled customer billing all under a single regulated monopoly. The Southeast (Southern Company, Duke), the Pacific Northwest, and many other regions still operate this way.\n\nStarting in the 1990s, parts of the US RESTRUCTURED, breaking the monopoly into separate competitive and regulated pieces:\n- GENERATION became competitive — anyone meeting reliability standards can build a power plant and sell wholesale\n- TRANSMISSION and DISTRIBUTION remain regulated monopolies (the wires)\n- RETAIL became competitive — customers can choose their electricity supplier in deregulated states\n\nERCOT (most of Texas) is the most deregulated US market. PJM, NYISO, ISO-NE, MISO, CAISO, and SPP all run competitive wholesale markets while keeping the wires regulated. The Southeast, parts of the West, and most municipal utilities remain vertically integrated.\n\nTwo regulators split jurisdiction: FERC handles interstate wholesale markets, while state Public Utility Commissions (PUCs) handle retail rates and intrastate distribution.",questions:[
      {q:"What is a utility?",options:["A government department", "A company providing essential services in a defined territory under regulation", "Any private power company", "A non-profit organization"],answer:1,explain:"A utility = company providing essential services (power, gas, water) to a defined territory, regulated by government."},
      {q:"Why are utilities considered 'natural monopolies'?",options:["The government likes monopolies", "Running parallel wires/pipes to every house would be enormously wasteful", "Federal law banned competition", "Utilities are too profitable to compete with"],answer:1,explain:"Building duplicate infrastructure makes no economic sense — single-network efficiency justifies regulated monopoly."},
      {q:"What does 'vertically integrated' mean for a utility?",options:["Owns multiple utilities in different states", "One entity owns generation, transmission, distribution, and billing", "Builds tall transmission towers", "Operates only one type of business"],answer:1,explain:"Vertical integration = single company controls the full chain from generation to retail."},
      {q:"What changed when parts of the US 'restructured' starting in the 1990s?",options:["Utilities became government-owned", "Monopolies were broken into competitive and regulated pieces", "All utilities went bankrupt", "Federal law took over retail"],answer:1,explain:"Restructuring separated competitive activities (generation, retail) from regulated wires (transmission, distribution)."},
      {q:"In a restructured market, what stays REGULATED?",options:["Generation", "Retail sales", "Transmission and distribution (the wires)", "Nothing — it's all competitive"],answer:2,explain:"The wires remain regulated monopolies; generation and retail become competitive."},
      {q:"In a restructured market, what becomes COMPETITIVE?",options:["Only generation", "Generation and retail", "Only retail", "Distribution"],answer:1,explain:"Both generation (wholesale supply) and retail (customer choice) became competitive."},
      {q:"Which is the MOST deregulated US power market?",options:["California", "ERCOT (most of Texas)", "Florida", "Pennsylvania"],answer:1,explain:"ERCOT in Texas is the most deregulated — full competitive generation and retail."},
      {q:"What regions still operate primarily as vertically integrated utilities?",options:["The whole country", "The Southeast, Pacific Northwest, and most municipal utilities", "Only Texas", "Only the West Coast"],answer:1,explain:"Southeast (Southern, Duke), Pacific NW, and municipal utilities remain largely integrated."},
      {q:"Which agency regulates interstate wholesale power markets?",options:["State PUCs", "FERC (Federal Energy Regulatory Commission)", "Department of Energy", "EPA"],answer:1,explain:"FERC = federal regulator for interstate wholesale electricity and natural gas markets."},
      {q:"What do state Public Utility Commissions (PUCs) regulate?",options:["Wholesale interstate prices", "Retail rates and intrastate distribution", "Federal nuclear policy", "Pipeline tariffs"],answer:1,explain:"State PUCs handle retail rates and intrastate distribution; FERC handles wholesale interstate."}
    ]},
    {id:"2c",title:"Peak vs Off-Peak",lesson:"Power demand follows a predictable daily and weekly pattern. Demand is highest during business hours on weekdays — when offices run air conditioning, factories operate, and homes use lights and appliances. Demand drops at night when most activity stops, and on weekends when commercial loads ease.\n\nWholesale power markets capture this with two standard trading \"blocks\":\n\nON-PEAK = Monday through Friday, hour-ending 7 through hour-ending 22 (so 6 AM to 10 PM Central, broadly speaking). Some markets define this as 16 hours per weekday, sometimes called \"5×16\" (5 weekdays × 16 peak hours).\n\nOFF-PEAK = everything else. Nights from 10 PM to 6 AM, weekends, and NERC holidays (the major US holidays where bulk demand drops significantly).\n\nThese two blocks trade as separate products. A trader can buy a Q3 2026 PJM West Hub on-peak forward separately from off-peak. Prices typically differ substantially: on-peak averages 20-50% higher than off-peak in normal conditions, and can be much higher during scarcity events.\n\nA useful related metric is LOAD FACTOR: the ratio of average load to peak load. A perfectly flat demand profile would have load factor of 100%. Most utilities sit around 50-65%. Higher load factor = more efficient grid use, lower average cost to serve. Industrial customers with steady 24/7 operations have very high load factors; residential customers with sharp peaks have low load factors.\n\nA few markets also trade \"super-peak\" blocks for the highest-demand hours (e.g., 2-7 PM in summer), but the standard 5×16 / 2×16 / 7×8 (on-peak / weekend on-peak / off-peak) is the dominant convention.",questions:[
      {q:"When does power demand typically PEAK?",options:["Late at night", "Business hours on weekdays", "Weekends", "Right before sunrise"],answer:1,explain:"Weekday business hours = highest demand from offices, factories, A/C, and residential."},
      {q:"What does '5×16' mean in power trading?",options:["5 plants × 16 states", "5 weekdays × 16 peak hours per day", "5% of 16 hub prices", "5 generators × 16 contracts"],answer:1,explain:"5×16 = the on-peak block: 5 weekdays × 16 hours each (hour-ending 7 through 22)."},
      {q:"What hours are typically considered ON-PEAK?",options:["Midnight to noon", "6 AM to 10 PM weekdays", "Weekends only", "24 hours per day"],answer:1,explain:"On-peak is hour-ending 7 through 22, roughly 6 AM to 10 PM, Monday-Friday."},
      {q:"What time periods count as OFF-PEAK?",options:["Only Sunday", "Nights, weekends, and NERC holidays", "Only night hours", "Only weekend days"],answer:1,explain:"Off-peak = nights (10 PM-6 AM), weekends, and NERC holidays — anything not in the on-peak window."},
      {q:"What does NERC stand for?",options:["National Energy Reserve Council", "North American Electric Reliability Corporation", "Nuclear Energy Regulatory Commission", "Northeast Regional Coordination"],answer:1,explain:"NERC sets reliability standards for the bulk power system; their holiday list defines off-peak."},
      {q:"How much higher do on-peak prices typically run vs off-peak?",options:["About 1-5%", "20-50% on average", "Always at least 200%", "No difference"],answer:1,explain:"On-peak runs 20-50% above off-peak in normal conditions; much more during scarcity."},
      {q:"What is LOAD FACTOR?",options:["Maximum power output", "Ratio of average load to peak load", "Total energy used per year", "Number of customers served"],answer:1,explain:"Load factor = average load / peak load. Higher = flatter demand = more efficient grid."},
      {q:"What does a load factor of 100% represent?",options:["Maximum possible electricity use", "A perfectly flat demand profile", "System overload", "100% renewable supply"],answer:1,explain:"100% load factor = demand never varies from average — perfectly flat profile."},
      {q:"Where do most utilities' load factors typically fall?",options:["Around 20-30%", "Around 50-65%", "Around 80-90%", "Above 95%"],answer:1,explain:"Most utilities sit at 50-65% load factor due to daily and seasonal demand variation."},
      {q:"Which type of customer typically has the HIGHEST load factor?",options:["Residential", "Commercial offices", "Industrial 24/7 operations", "Schools"],answer:2,explain:"Steady 24/7 industrial operations produce nearly flat demand — very high load factors."}
    ]},
    {id:"2d",title:"Gas Gathering & Processing",lesson:"Raw natural gas straight from the wellhead isn't ready for pipelines or end users. It contains water, carbon dioxide, hydrogen sulfide, and natural gas liquids (NGLs) — all of which must be removed or separated. The gathering and processing stages handle this transformation between the wellhead and the long-haul transmission system.\n\nGATHERING is the first stage. Small-diameter, low-pressure pipes collect gas from many individual wells across a producing region — sometimes hundreds of wells spread over hundreds of square miles. Gathering systems are typically operated by midstream companies, not the producers themselves. Compressor stations along the gathering network boost pressure as needed.\n\nPROCESSING cleans the raw gas to \"pipeline quality.\" Multiple steps happen at a processing plant:\n\nDEHYDRATION removes water using glycol or solid desiccants. Water in pipelines is dangerous — it forms hydrate plugs (ice-like solids that block flow) and corrodes steel pipe.\n\nSWEETENING removes acid gases — primarily carbon dioxide (CO₂) and hydrogen sulfide (H₂S). H₂S is toxic in small concentrations and extremely corrosive. Gas containing significant H₂S is called \"sour gas\"; cleaned gas is \"sweet\". Amine treating units are the standard technology.\n\nNGL EXTRACTION separates the heavier hydrocarbons — ethane, propane, butane, pentane — from the methane stream. NGLs are valuable separately and sold into their own markets (Mont Belvieu hub near Houston is the main NGL trading point).\n\nFRACTIONATION then splits the mixed NGL stream into individual products: pure ethane, propane, butane, and natural gasoline.\n\nThe processed dry methane stream enters interstate transmission pipelines. NGLs travel separately by pipeline, rail, or truck to refineries, chemical plants, and export terminals.",questions:[
      {q:"What does the gathering stage do?",options:["Cleans gas to pipeline quality", "Small low-pressure pipes collect gas from many wells", "Transports gas long distances", "Sells gas to end users"],answer:1,explain:"Gathering = collecting raw gas from individual wells via low-pressure pipes."},
      {q:"Who typically operates gas gathering systems?",options:["The well producers themselves", "Midstream companies", "Local Distribution Companies", "Federal agencies"],answer:1,explain:"Gathering is operated by midstream companies, separate from producers and end users."},
      {q:"What does processing remove from raw gas?",options:["Only methane", "Water, CO₂, H₂S, and NGLs", "Only nitrogen", "Nothing — gas goes straight to pipelines"],answer:1,explain:"Processing cleans raw gas: removes water, acid gases, and separates NGLs."},
      {q:"What does DEHYDRATION remove?",options:["Methane", "Water", "Sulfur", "Nitrogen"],answer:1,explain:"Dehydration removes water using glycol or solid desiccants."},
      {q:"Why must water be removed from pipeline gas?",options:["It reduces BTU value", "It forms hydrate plugs and corrodes steel", "Customers reject wet gas", "Federal regulation requires it"],answer:1,explain:"Water forms hydrate ice plugs that block flow and corrodes steel pipe — both serious operational risks."},
      {q:"What does SWEETENING remove?",options:["Sugar from gas", "CO₂ and H₂S", "Methane", "Water only"],answer:1,explain:"Sweetening removes acid gases: carbon dioxide and hydrogen sulfide."},
      {q:"What is 'sour gas'?",options:["Old degraded gas", "Gas containing significant H₂S", "Gas with low BTU", "Gas mixed with oil"],answer:1,explain:"Sour gas = contains hydrogen sulfide (H₂S), toxic and corrosive — must be sweetened."},
      {q:"What are NGLs?",options:["Natural Gas Lines (pipelines)", "Natural Gas Liquids — ethane, propane, butane, etc.", "Non-Gas Liquids", "National Gas Licensing"],answer:1,explain:"NGLs = Natural Gas Liquids: heavier hydrocarbons (ethane, propane, butane, pentane) separated at processing."},
      {q:"What's the main NGL trading hub in the US?",options:["Henry Hub", "Mont Belvieu (near Houston)", "Algonquin", "Cushing"],answer:1,explain:"Mont Belvieu, near Houston, is the major NGL trading and fractionation hub."}
    ]},
    {id:"2e",title:"Pipelines, Compression & Linepack",lesson:"Natural gas pipelines are the highways of the gas industry. The US has roughly 3 million miles of gas pipeline infrastructure — one of the world's largest energy networks. Pipelines come in two main categories.\n\nINTERSTATE TRANSMISSION pipelines are the long-haul backbone, moving gas hundreds or thousands of miles from producing regions to demand centers. Diameter ranges from 24\" to 42\" — large enough for a person to walk through. Pressure typically runs 500-1,500 psi. These are regulated by FERC since they cross state lines.\n\nDISTRIBUTION pipelines are the local network operated by Local Distribution Companies (LDCs). Smaller diameter, lower pressure (1-200 psi typically), serving homes and businesses directly. Regulated by state Public Utility Commissions.\n\nGas flows through pipelines because of PRESSURE DIFFERENTIAL — high pressure at one end, lower pressure at the other. Friction with the pipe walls slows the gas and reduces pressure as it travels. To overcome this, COMPRESSOR STATIONS are placed every 50-100 miles along transmission pipelines. Each station takes gas in at lower pressure, compresses it back up to operating pressure, and sends it on.\n\nA key trading concept: LINEPACK. The gas physically inside a pipeline is itself a form of storage. By \"packing the line\" (increasing pressure with extra gas), operators can store hours' worth of supply. By \"drafting the line\" (drawing gas faster than it's being injected), they can release that stored gas. Linepack provides crucial operational flexibility — different from underground storage but valuable for managing daily swings.\n\nMajor US transmission pipelines include Transco (Gulf Coast to Northeast), Tennessee (Gulf to Northeast), Algonquin (into New England), El Paso (Permian to West Coast), and REX (Marcellus westward). Each has its own pricing dynamics.",questions:[
      {q:"How many miles of gas pipeline infrastructure does the US have?",options:["About 30,000 miles", "About 300,000 miles", "About 3 million miles", "About 30 million miles"],answer:2,explain:"~3 million miles — one of the world's largest energy networks."},
      {q:"What's the typical pressure range in interstate transmission pipelines?",options:["1-50 psi", "100-200 psi", "500-1,500 psi", "Over 10,000 psi"],answer:2,explain:"Transmission pipelines run at high pressure (500-1,500 psi) to move gas efficiently."},
      {q:"What's the typical diameter range of transmission pipelines?",options:["1-6 inches", "8-12 inches", "24-42 inches", "Over 100 inches"],answer:2,explain:"Large 24-42 inch diameter — big enough for a person to walk inside."},
      {q:"Who regulates interstate transmission pipelines?",options:["State PUCs", "FERC", "NERC", "EPA"],answer:1,explain:"FERC regulates interstate pipelines because they cross state lines."},
      {q:"How far apart are compressor stations placed on transmission pipelines?",options:["Every 5-10 miles", "Every 50-100 miles", "Every 500-1,000 miles", "Only at the start and end"],answer:1,explain:"Compressors every 50-100 miles re-pressurize gas that loses pressure to friction."},
      {q:"What is LINEPACK?",options:["A pipeline maintenance crew", "Gas stored inside the pipeline itself", "A type of compressor", "Pipeline pressure rating"],answer:1,explain:"Linepack = the gas physically in the pipeline, providing short-term storage flexibility."},
      {q:"What does 'packing the line' mean operationally?",options:["Shutting it down", "Increasing pressure with extra gas to store it", "Reducing pressure", "Adding more pipes"],answer:1,explain:"Packing = boosting pressure with extra gas, storing hours' worth of supply in the line."},
      {q:"Which is a MAJOR Gulf-to-Northeast pipeline?",options:["Transco", "Pacific Gas Pipeline", "Caribbean Express", "Atlantic Gas"],answer:0,explain:"Transco runs Gulf Coast to Northeast — one of the highest-volume US pipelines."},
      {q:"What does the Algonquin pipeline primarily serve?",options:["California", "Texas", "New England (Boston area)", "Florida"],answer:2,explain:"Algonquin is the main gas pipe into New England — constrained, which causes Boston winter price spikes."},
      {q:"What's special about the REX (Rockies Express) pipeline?",options:["It's the largest US pipeline", "It reversed flow to move Marcellus shale gas westward", "It only carries LNG", "It's underwater"],answer:1,explain:"REX reversed flow to move Marcellus production westward to Midwest markets."}
    ]},
    {id:"2f",title:"Gas Storage",lesson:"Unlike electricity, natural gas can be stored at large scale, and this storability is one of the most commercially important facts in energy markets. Gas demand swings dramatically between summer (low) and winter (high heating demand), while production runs steadily year-round. Storage absorbs summer surplus and delivers winter supply.\n\nThe US has three main types of underground storage:\n\nDEPLETED RESERVOIR storage uses old oil and gas fields after their commercial production ends. The geology that originally trapped gas underground for millions of years can hold injected gas again. This is the largest type by working volume — accounting for most US storage capacity. Slow to cycle (typically 1-2 turns per year) but cheap to build.\n\nAQUIFER storage uses water-saturated underground rock formations. Gas displaces water and is held in place by impermeable caprock. More expensive and complex to develop than depleted reservoirs. Used mainly in regions without convenient depleted fields.\n\nSALT CAVERN storage uses cavities dissolved into underground salt formations. Smaller working volume per facility but much faster cycling — can inject or withdraw multiple times per year. Favored by traders for short-term flexibility and peak-shaving. Concentrated along the Gulf Coast where salt deposits are abundant.\n\nA critical distinction: CUSHION GAS (base gas) is the minimum amount kept in storage to maintain pressure — it's trapped and not available for sale. WORKING GAS is the volume that can be cycled in and out commercially. Storage capacity is reported as working gas.\n\nThe EIA Weekly Natural Gas Storage Report, released Thursdays at 10:30 AM ET, is one of the most market-moving data releases in commodities. Traders watch the build/draw vs the 5-year average closely. Big surprises move prices significantly.",questions:[
      {q:"Why is gas storage commercially valuable?",options:["It reduces transportation cost", "It absorbs summer surplus and delivers winter supply", "Storage tanks are cheap", "Federal subsidies"],answer:1,explain:"Storage decouples steady year-round production from highly seasonal demand."},
      {q:"How many main types of underground gas storage are there in the US?",options:["One", "Two", "Three", "Five"],answer:2,explain:"Three: depleted reservoirs, aquifers, and salt caverns."},
      {q:"Which type accounts for MOST US storage capacity?",options:["Salt caverns", "Aquifer storage", "Depleted reservoirs", "LNG tanks"],answer:2,explain:"Depleted reservoirs (old oil/gas fields) hold the largest working volume."},
      {q:"What type of storage cycles FASTEST?",options:["Depleted reservoirs", "Aquifers", "Salt caverns", "All cycle equally"],answer:2,explain:"Salt caverns can inject/withdraw multiple times per year — favored by traders."},
      {q:"Where are most US salt cavern storage facilities located?",options:["Pacific Northwest", "Gulf Coast", "Northeast", "Rocky Mountains"],answer:1,explain:"Salt deposits concentrate along the Gulf Coast — abundant geology for cavern storage."},
      {q:"What is CUSHION GAS (base gas)?",options:["The total gas in storage", "Minimum gas kept to maintain pressure — not available for sale", "Gas used for safety", "Gas held for emergencies"],answer:1,explain:"Cushion gas is trapped — maintains reservoir pressure but isn't tradeable volume."},
      {q:"What is WORKING GAS?",options:["Total gas including cushion", "The volume that can be cycled in and out commercially", "Only gas in salt caverns", "Gas for industrial use"],answer:1,explain:"Working gas = the tradeable portion that can be injected and withdrawn."},
      {q:"When is the EIA Weekly Natural Gas Storage Report released?",options:["Monday 9 AM ET", "Wednesday 2 PM ET", "Thursday 10:30 AM ET", "Friday 4 PM ET"],answer:2,explain:"Thursday 10:30 AM ET — one of the most market-moving data releases in commodities."},
      {q:"Why is the EIA storage report so closely watched?",options:["It moves stock prices", "Traders watch build/draw vs the 5-year average — surprises move prices significantly", "It signals oil supply", "It triggers federal action"],answer:1,explain:"Storage changes vs 5-year average reveal supply/demand balance — big surprises move gas prices."},
      {q:"What's a key advantage of salt cavern storage for traders?",options:["Largest capacity", "High deliverability and multiple cycles per year for short-term flexibility", "Cheapest to build", "Government subsidized"],answer:1,explain:"Speed and flexibility = trading value; salt caverns let you respond to short-term price swings."}
    ]},
    {id:"2g",title:"City Gates, LDCs & Burner Tip",lesson:"Once natural gas leaves the high-pressure interstate transmission system, it enters the local distribution network that delivers it to your home, business, or industrial facility. Three concepts define this final stretch: city gates, LDCs, and the burner tip.\n\nThe CITY GATE is the physical and commercial handoff point between interstate transmission and local distribution. It's a station — typically a small fenced facility with pipes, valves, and meters — where the transmission pipeline meets the local distribution system. At the city gate, three things happen:\n\nPRESSURE REDUCTION: Transmission pressure (500-1,500 psi) is stepped down to distribution pressure (a few psi to 100 psi). This requires pressure regulators.\n\nCUSTODY TRANSFER: Ownership of the gas passes from the interstate pipeline operator to the Local Distribution Company (LDC). Meters measure the exact volume changing hands — billing accuracy matters.\n\nODORIZATION: Pure natural gas is odorless. The LDC injects MERCAPTAN — the chemical that gives natural gas its distinctive \"rotten egg\" smell — so leaks can be detected by smell. This is purely a safety addition.\n\nThe LDC (Local Distribution Company) owns and operates the local pipes that fan out from the city gate to individual customers. Examples: Con Edison (NYC), National Grid (many regions), Atmos Energy (Texas), Southern California Gas. LDCs are regulated by state Public Utility Commissions.\n\nResidential gas line pressure is extremely low — about 0.25 psi (7 inches water column). The pressure is dropped progressively through multiple regulator stages before reaching your meter.\n\nThe BURNER TIP is industry shorthand for the final consumption point — your stove, furnace, water heater, or industrial boiler. It's where the gas value chain ends after its journey from the wellhead.",questions:[
      {q:"What happens at the CITY GATE?",options:["Gas is extracted from the ground", "Pressure drops and custody transfers from transmission to LDC", "Gas is processed and dehydrated", "Gas is liquefied"],answer:1,explain:"City gate = handoff point: pressure reduction + custody transfer from pipeline to LDC."},
      {q:"What pressure range is typical for transmission pipelines?",options:["0.25 psi", "1-50 psi", "500-1,500 psi", "Over 5,000 psi"],answer:2,explain:"Transmission runs at high pressure (500-1,500 psi) to move gas efficiently."},
      {q:"Why is MERCAPTAN added to natural gas?",options:["It increases heat content", "It prevents corrosion", "Pure methane is odorless — mercaptan adds the smell so leaks are detectable", "It reduces pressure"],answer:2,explain:"Mercaptan = the 'rotten egg' odorant that makes leaks detectable by smell."},
      {q:"What does LDC stand for?",options:["Long Distance Carrier", "Local Distribution Company", "Liquids Displacement Capacity", "Licensed Drilling Contractor"],answer:1,explain:"LDC = Local Distribution Company; operates pipes from city gate to end customers."},
      {q:"Who regulates LDCs?",options:["FERC", "NERC", "State Public Utility Commissions", "EPA"],answer:2,explain:"State PUCs regulate LDCs and retail gas service; FERC handles interstate pipelines."},
      {q:"What is residential gas line pressure?",options:["500 psi", "100 psi", "About 0.25 psi (7 inches water column)", "Variable based on demand"],answer:2,explain:"Ultra-low pressure (~0.25 psi) after multiple regulators — safe for home appliances."},
      {q:"Which is an example of a real LDC?",options:["Transco", "Con Edison", "ERCOT", "NYMEX"],answer:1,explain:"Con Edison serves NYC as the local distribution company."},
      {q:"What is the BURNER TIP?",options:["Where gas is drilled", "The processing plant exit", "The final consumption point — stove, furnace, boiler", "A type of compressor"],answer:2,explain:"Burner tip = where the gas is finally combusted by the end user."}
    ]},
    {id:"2h",title:"Power Grid: Voltage Levels & Substations",lesson:"The power grid uses a hierarchy of voltage levels, with substations as the critical nodes that step voltage up and down. Understanding this hierarchy explains how electricity flows efficiently from massive power plants to your kitchen outlet.\n\nGENERATION VOLTAGE: Power plants produce electricity at moderate voltage, typically 13-25 kV. This is too low for efficient long-distance transport.\n\nSTEP-UP TRANSFORMERS at the plant's switchyard raise voltage dramatically — to 138 kV, 230 kV, 345 kV, 500 kV, or 765 kV depending on the line. Higher voltage means lower current for the same power, which means lower line losses (heat dissipated as I²R losses falls as the square of current).\n\nBULK TRANSMISSION lines carry power between regions on the big steel lattice towers along highways and through rural corridors. These are the 138-765 kV lines you see crossing the landscape.\n\nSUBTRANSMISSION (35-138 kV) is an intermediate layer — voltage between bulk transmission and distribution. Serves large industrial customers directly and feeds local substations.\n\nDISTRIBUTION SUBSTATIONS step voltage down again, from transmission or subtransmission levels to primary distribution voltage (typically 4-35 kV). These substations are the medium-sized facilities you see at the edge of neighborhoods.\n\nPRIMARY DISTRIBUTION lines (4-35 kV) run along streets — the wooden poles in most neighborhoods. They feed pole-mounted transformers that perform the final step-down.\n\nPOLE-TOP TRANSFORMERS reduce voltage to SERVICE voltage — 120/240 V for residential, 277/480 V for many commercial buildings.\n\nA SUBSTATION is essentially a collection of transformers, switchgear (circuit breakers, disconnects), protection relays, and control equipment housed in a fenced area. Substations enable voltage transformation, switching, fault isolation, and metering — the operational nodes of the grid.",questions:[
      {q:"At what voltage is electricity typically generated at a power plant?",options:["120 V", "4-35 kV", "13-25 kV", "138-765 kV"],answer:2,explain:"Generators produce at 13-25 kV — moderate voltage, too low for efficient transmission."},
      {q:"What does a STEP-UP transformer do?",options:["Reduces voltage for distribution", "Raises voltage for efficient long-distance transmission", "Stores energy", "Converts AC to DC"],answer:1,explain:"Step-up transformers boost voltage to 138-765 kV at the power plant before transmission."},
      {q:"Why is higher voltage better for long-distance transmission?",options:["It looks more impressive", "Lower current means lower I²R line losses", "Required by law", "Faster electrons"],answer:1,explain:"Higher V → lower I → I²R losses fall as the square of current."},
      {q:"What voltage range is BULK transmission?",options:["120-240 V", "4-35 kV", "13-25 kV", "138-765 kV"],answer:3,explain:"Bulk transmission lines run at 138, 230, 345, 500, or 765 kV."},
      {q:"What voltage range is SUBTRANSMISSION?",options:["120-240 V", "35-138 kV", "13-25 kV", "Over 765 kV"],answer:1,explain:"Subtransmission (35-138 kV) bridges bulk transmission and distribution."},
      {q:"What voltage range is PRIMARY DISTRIBUTION?",options:["120-240 V", "4-35 kV", "138-765 kV", "Generation only"],answer:1,explain:"Distribution lines run at 4-35 kV on wooden poles along streets."},
      {q:"What does a POLE-TOP TRANSFORMER do?",options:["Generates electricity", "Stores power", "Steps voltage down to service voltage for homes", "Measures consumption"],answer:2,explain:"Pole-top transformers reduce distribution voltage to 120/240 V for homes."},
      {q:"What's the SERVICE voltage for a typical US home?",options:["12/24 V", "120/240 V", "480/600 V", "4 kV"],answer:1,explain:"US residential service is 120/240 V (split-phase from the pole-top transformer)."},
      {q:"What is a SUBSTATION?",options:["A backup power plant", "A collection of transformers, switchgear, and controls in a fenced area", "A type of pipeline", "A control room only"],answer:1,explain:"Substation = a node housing transformers + switchgear + protection + controls."}
    ]},
  ]},
  3:{name:"HIGH SCHOOL",grade:"G7-12",tag:"L3",modules:[
    {id:"3a",title:"Deregulation: Short History",lesson:"For most of the 20th century, US electricity was provided by vertically integrated regulated monopolies — utilities that generated, transmitted, distributed, and sold power within their territory under state regulation. Starting in the late 1970s, this model began to fracture.\n\nPURPA (Public Utility Regulatory Policies Act, 1978) was the first crack. Passed in response to the 1970s oil crises, it required utilities to buy power from qualifying facilities (QFs) — small, often renewable or cogeneration plants — at their \"avoided cost.\" For the first time, non-utilities could build power plants and sell to the grid. This created an opening for independent power producers (IPPs).\n\nEPACT 1992 (Energy Policy Act) created Exempt Wholesale Generators (EWGs), allowing companies to build power plants purely for wholesale sale without becoming regulated utilities. This dramatically expanded wholesale competition.\n\nFERC ORDER 888 (1996) required transmission-owning utilities to publish Open Access Transmission Tariffs (OATTs) and provide non-discriminatory grid access to all generators. This was the legal foundation that made wholesale competition workable — independent generators could now actually use the transmission grid.\n\nFERC ORDER 2000 (1999) encouraged utilities to form Regional Transmission Organizations (RTOs) — independent entities to operate the grid and run wholesale markets, separate from any single utility's commercial interests.\n\nTHE CALIFORNIA CRISIS (2000-2001): California's poorly designed deregulation collapsed. Enron and others gamed the market with schemes like \"Death Star\" (creating artificial congestion to collect payments). Blackouts, sky-high prices, and Enron's bankruptcy followed. Many states paused or reversed deregulation plans.\n\nTEXAS WINTER STORM URI (February 2021): ERCOT's energy-only market design hit its limits. Inadequate weatherization caused gas and coal plants to fail, prices spiked to the $9,000/MWh cap for over 70 hours, $50B+ in damages, and several retailers went bankrupt. A cautionary tale about market design under extreme stress.\n\nThe current US grid is a patchwork: some regions deregulated (PJM, ERCOT, NYISO), others vertically integrated (much of Southeast).",questions:[
      {q:"What did PURPA (1978) do?",options:["Created the EPA", "Required utilities to buy from qualifying facilities — opened competition", "Banned nuclear plants", "Set federal electricity rates"],answer:1,explain:"PURPA opened the door to independent power producers — first crack in the utility monopoly."},
      {q:"What did EPACT 1992 create?",options:["Federal carbon tax", "Exempt Wholesale Generators (EWGs) — wholesale-only plants without utility status", "State PUCs", "Nuclear waste rules"],answer:1,explain:"EWGs allowed pure wholesale generation companies to operate without becoming regulated utilities."},
      {q:"What was FERC Order 888 (1996)?",options:["A nuclear safety rule", "Required Open Access Transmission Tariffs (OATTs) for non-discriminatory grid access", "Set retail rates", "Created NERC"],answer:1,explain:"OATT = the legal foundation that made wholesale competition workable on the transmission grid."},
      {q:"What did FERC Order 2000 (1999) encourage?",options:["Carbon pricing", "Formation of Regional Transmission Organizations (RTOs)", "Nuclear expansion", "Retail competition"],answer:1,explain:"Order 2000 pushed for independent RTOs to operate the grid and wholesale markets."},
      {q:"What caused the California energy crisis of 2000-2001?",options:["A natural disaster", "Poorly designed deregulation + market manipulation (e.g., Enron's 'Death Star')", "Federal price controls", "Nuclear plant failures"],answer:1,explain:"Bad market design + manipulation by Enron and others led to blackouts, price spikes, and bankruptcies."},
      {q:"What was Enron's 'Death Star' scheme?",options:["A nuclear plant", "Creating artificial congestion to collect transmission congestion payments", "A power plant design", "A computer virus"],answer:1,explain:"Enron gamed California's market by creating fake congestion to pocket congestion relief payments."},
      {q:"What happened during Texas Winter Storm Uri (February 2021)?",options:["A nuclear accident", "Inadequate weatherization caused massive plant failures, prices hit $9,000/MWh for 70+ hours", "Federal takeover of ERCOT", "Cyberattack on the grid"],answer:1,explain:"Storm Uri exposed ERCOT's vulnerabilities: extreme prices, retailer bankruptcies, $50B+ damages."},
      {q:"What is the price cap in ERCOT that was hit during Uri?",options:["$1,000/MWh", "$9,000/MWh", "$100,000/MWh", "No cap exists"],answer:1,explain:"ERCOT's $9,000/MWh cap was hit for 70+ hours during Uri, triggering massive defaults."},
      {q:"How would you describe today's US power market structure?",options:["All deregulated", "All vertically integrated", "A patchwork — some regions deregulated (PJM, ERCOT, NYISO), others integrated (Southeast)", "Federally controlled"],answer:2,explain:"US is a patchwork of restructured wholesale markets and vertically integrated utility territories."}
    ]},
    {id:"3b",title:"Wholesale vs Retail",lesson:"Electricity markets have two distinct layers: WHOLESALE and RETAIL. Understanding the boundary between them is essential for understanding who can compete, who is regulated, and how the system makes money.\n\nWHOLESALE refers to bulk power transactions between generators, traders, utilities, and large industrial customers. Wholesale prices clear in $/MWh and represent the cost of delivering bulk electricity at a specific location and time. ISO/RTO markets (PJM, ERCOT, NYISO, ISO-NE, MISO, CAISO, SPP) run wholesale auctions every five minutes for real-time and once daily for day-ahead. Wholesale is regulated at the federal level by FERC.\n\nRETAIL refers to delivery and sale to end customers — homes, businesses, factories. Retail prices are quoted in cents/kWh and include not just the wholesale energy cost but transmission, distribution, taxes, ancillary services, capacity charges, and supplier margin. Retail is regulated at the state level by Public Utility Commissions (PUCs).\n\nIn RESTRUCTURED states (like Texas, Pennsylvania, New York, Massachusetts), customers can choose their RETAIL ELECTRICITY PROVIDER (REP) or ENERGY SERVICE COMPANY (ESCO). These competitive retailers buy wholesale power and resell to customers, competing on price, contract terms, green energy options, and service. The distribution utility still delivers the electrons over its wires regardless of who you buy from.\n\nIn VERTICALLY INTEGRATED states (like much of the Southeast), the utility provides everything — generation, delivery, and billing — at state-regulated rates. No retail choice.\n\nThe PROVIDER OF LAST RESORT (POLR) is the default supplier for customers who don't choose a competitive retailer. Usually the incumbent utility.\n\nLOAD-SERVING ENTITY (LSE) is the technical name for any entity responsible for serving retail load — buying wholesale and selling to end customers. REPs, ESCOs, and vertically integrated utilities are all types of LSEs.",questions:[
      {q:"What does WHOLESALE electricity refer to?",options:["Power sold to homes", "Bulk transactions between generators, traders, utilities, large industrials", "Power for street lighting", "Government purchases"],answer:1,explain:"Wholesale = bulk transactions priced in $/MWh, regulated by FERC."},
      {q:"What unit are wholesale electricity prices quoted in?",options:["Cents/kWh", "Dollars per kWh", "$/MWh", "Dollars per ton"],answer:2,explain:"Wholesale is $/MWh (megawatt-hour); retail is cents/kWh."},
      {q:"Who regulates wholesale electricity markets?",options:["State PUCs", "FERC", "NERC", "EPA"],answer:1,explain:"FERC = federal regulator for wholesale interstate electricity (and gas)."},
      {q:"What does RETAIL electricity refer to?",options:["Wholesale auctions", "Sale to end customers — homes, businesses, factories", "Federal sales", "Pipeline gas only"],answer:1,explain:"Retail = sales to end customers, priced in cents/kWh."},
      {q:"Who regulates retail electricity?",options:["FERC", "State Public Utility Commissions (PUCs)", "NERC", "DOE"],answer:1,explain:"State PUCs regulate retail rates and distribution; FERC handles wholesale."},
      {q:"What's a REP (Retail Electric Provider)?",options:["A federal agency", "A competitive retailer that buys wholesale and resells to customers", "A type of generator", "A pipeline operator"],answer:1,explain:"REPs operate in restructured states, competing for retail customers."},
      {q:"In a restructured state with retail choice, who delivers the electrons?",options:["The retail provider", "The distribution utility (regardless of who you buy from)", "The federal government", "The ISO"],answer:1,explain:"The wires utility still delivers power; you just choose your retail energy supplier."},
      {q:"What does POLR stand for?",options:["Pipeline Operator License Requirement", "Provider of Last Resort — default supplier for non-choosing customers", "Power Output Level Rating", "Public Oversight of Licensed Retailers"],answer:1,explain:"POLR = default service for customers who don't pick a competitive retailer."},
      {q:"What does LSE stand for?",options:["Local Service Entity", "Load-Serving Entity — any entity responsible for serving retail load", "Licensed State Engineer", "Lower Service Energy"],answer:1,explain:"LSE = the technical term for any entity responsible for retail customer load."},
      {q:"Which states have RETAIL CHOICE (competitive retailers)?",options:["All US states", "Restructured states like Texas, Pennsylvania, New York", "Only the Pacific Northwest", "Only the Southeast"],answer:1,explain:"Texas, PA, NY, MA and other restructured states; Southeast and PNW remain vertically integrated."}
    ]},
    {id:"3c",title:"Market Participants",lesson:"Energy markets involve a wide cast of participants, each playing a specific role. Understanding who's at the table — and what motivates each player — is essential for understanding how prices form and how trades get done.\n\nGENERATORS: Build, own, and operate power plants. Sell into wholesale markets or under long-term contracts. Independent Power Producers (IPPs), regulated utility generation arms, and merchant generators all qualify. Examples: NextEra, Vistra, Calpine.\n\nLOAD-SERVING ENTITIES (LSEs): Buy wholesale and serve retail customers. Includes Retail Electric Providers, ESCOs, and vertically integrated utility retail arms.\n\nTRANSMISSION OWNERS: Own and maintain the high-voltage transmission grid. Provide service under FERC-regulated tariffs. Sometimes the same company as a utility's generation arm, sometimes separate.\n\nISOs/RTOs: Independent System Operators / Regional Transmission Organizations. Run the wholesale markets, dispatch generation in real-time, maintain reliability. They don't own assets — they're independent market operators. Examples: PJM, ERCOT, NYISO, MISO, CAISO, ISO-NE, SPP.\n\nASSET-BACKED MARKETERS: Companies that own physical assets (plants, pipelines, storage) and trade around them. Can deliver physically and take physical positions. They have informational and optionality advantages but bear physical risk.\n\nFINANCIAL TRADERS: Take pure financial positions — futures, options, swaps — without intending physical delivery. Provide market liquidity. Banks, hedge funds, prop trading firms. Subject to CFTC oversight (financial derivatives regulator).\n\nUTILITIES (VERTICALLY INTEGRATED): Combine generation, transmission, distribution, and retail under one regulated entity. Common in the Southeast and Pacific Northwest.\n\nREGULATORS: FERC (federal wholesale interstate), state PUCs (retail intrastate), NERC (reliability standards), CFTC (financial derivatives).\n\nINDUSTRIAL END USERS: Large factories and data centers that buy directly from wholesale or have direct supply contracts.",questions:[
      {q:"What do GENERATORS do?",options:["Operate transmission lines", "Build, own, and operate power plants and sell into wholesale markets", "Bill retail customers", "Regulate other participants"],answer:1,explain:"Generators produce wholesale electricity — IPPs, utility arms, and merchant generators."},
      {q:"What's an Independent Power Producer (IPP)?",options:["A government agency", "A non-utility company that owns power plants", "A retail customer", "A type of transformer"],answer:1,explain:"IPPs are non-utility companies that build and operate power plants for wholesale sale."},
      {q:"What do LSEs (Load-Serving Entities) do?",options:["Generate power", "Buy wholesale and serve retail customers", "Operate transmission", "Regulate the grid"],answer:1,explain:"LSEs buy at wholesale and sell at retail — REPs, ESCOs, utility retail arms."},
      {q:"What do ISOs/RTOs do?",options:["Own power plants", "Operate wholesale markets and dispatch generation independently", "Bill retail customers", "Build transmission lines"],answer:1,explain:"ISOs/RTOs run markets and dispatch the grid as independent operators — they don't own assets."},
      {q:"Which is an ISO/RTO?",options:["NextEra", "PJM", "Exelon", "Calpine"],answer:1,explain:"PJM is one of the seven major US ISOs/RTOs."},
      {q:"What's an ASSET-BACKED MARKETER?",options:["A bank", "A company that owns physical assets and trades around them", "A retail customer", "A regulator"],answer:1,explain:"Asset-backed marketers own plants, pipes, or storage and trade with both physical and financial positions."},
      {q:"What's a FINANCIAL TRADER in energy markets?",options:["A utility employee", "Takes pure financial positions without physical delivery — provides liquidity", "Operates transmission", "Bills retail customers"],answer:1,explain:"Financial traders use derivatives without taking physical delivery — banks, hedge funds, prop firms."},
      {q:"Who regulates FINANCIAL DERIVATIVES in energy markets?",options:["FERC", "State PUCs", "CFTC", "NERC"],answer:2,explain:"CFTC (Commodity Futures Trading Commission) regulates financial derivatives including energy."},
      {q:"Which regulator sets RELIABILITY STANDARDS?",options:["FERC", "State PUCs", "NERC", "CFTC"],answer:2,explain:"NERC sets mandatory reliability standards for the bulk power system."},
      {q:"Why are LARGE INDUSTRIAL END USERS notable in energy markets?",options:["They sell power", "They buy directly from wholesale or have direct supply contracts", "They regulate prices", "They operate substations"],answer:1,explain:"Large industrials (factories, data centers) often buy direct from wholesale, bypassing retail."}
    ]},
  ]},
  4:{name:"COLLEGE PREP",grade:"Advanced HS / Frosh",tag:"L4",modules:[
    {id:"4a",title:"The 7 ISO/RTOs",lesson:"The US has seven major Independent System Operators (ISOs) and Regional Transmission Organizations (RTOs) that operate wholesale electricity markets. Together they cover roughly two-thirds of US electricity demand. Knowing the seven and their characteristics is essential — each has different rules, market designs, and price dynamics.\n\nPJM INTERCONNECTION: The largest by load served. Covers 13 states from New Jersey to Illinois plus DC. Runs energy, capacity (RPM auction), and ancillary services markets. ~65 million customers.\n\nMISO (Midcontinent Independent System Operator): Spans 15 states north-south through the central US, from Manitoba (Canada) to Louisiana. Energy and capacity (PRA auction). Heavily wind-dependent in the upper Midwest.\n\nERCOT (Electric Reliability Council of Texas): Covers about 90% of Texas. Intentionally isolated from neighboring grids via DC ties to stay outside FERC interstate jurisdiction. ENERGY-ONLY market — no formal capacity market. Uses ORDC (Operating Reserve Demand Curve) for scarcity pricing.\n\nNYISO (New York ISO): Covers New York State. Energy market, ICAP (Installed Capacity) market, ancillary services. Distinct upstate/downstate price separation due to transmission constraints.\n\nISO-NE (ISO New England): Six New England states. FCM (Forward Capacity Market) auctions capacity 3 years forward. Heavily dependent on natural gas, vulnerable to winter pipeline constraints (Algonquin spikes).\n\nCAISO (California ISO): California and parts of Nevada. Heavy solar (duck curve) and renewable integration. Uses CRRs (Congestion Revenue Rights) instead of FTRs.\n\nSPP (Southwest Power Pool): A north-south corridor from Texas/Oklahoma up through Nebraska and the Dakotas. Heavy wind generation.\n\nAreas NOT covered by an ISO: Southeast (Southern Company, Duke, Florida), Pacific Northwest (BPA territory), most municipal utilities. These remain bilateral markets with vertically integrated utilities.",questions:[
      {q:"How many major US ISOs/RTOs are there?",options:["Three", "Five", "Seven", "Ten"],answer:2,explain:"Seven: PJM, MISO, ERCOT, NYISO, ISO-NE, CAISO, SPP."},
      {q:"Which ISO is the LARGEST by load served?",options:["ERCOT", "PJM", "CAISO", "MISO"],answer:1,explain:"PJM is the largest, serving ~65 million customers across 13 states + DC."},
      {q:"Which ISO covers about 90% of Texas?",options:["PJM", "SPP", "ERCOT", "MISO"],answer:2,explain:"ERCOT covers ~90% of Texas — intentionally isolated from interstate grids."},
      {q:"Why is ERCOT 'isolated' from other grids?",options:["Geographic isolation", "Limited DC ties keep it outside FERC interstate jurisdiction", "Different AC frequency", "Federal law banned connections"],answer:1,explain:"DC ties allow interconnection without triggering FERC interstate regulation."},
      {q:"What's unique about ERCOT's market design?",options:["It has the largest capacity market", "ENERGY-ONLY — no formal capacity market", "It's the only deregulated retail market", "It uses only renewable energy"],answer:1,explain:"ERCOT is energy-only; scarcity prices via ORDC replace a capacity market."},
      {q:"What does ORDC stand for?",options:["Optimal Resource Dispatch Curve", "Operating Reserve Demand Curve", "Open Regulated Demand Charge", "Off-peak Reserve Distribution Code"],answer:1,explain:"ORDC = ERCOT's mechanism that adds a scarcity adder to energy prices as reserves get tight."},
      {q:"Which ISO uses FCM (Forward Capacity Market)?",options:["PJM", "NYISO", "ISO-NE", "MISO"],answer:2,explain:"ISO-NE's FCM auctions capacity 3 years forward in New England."},
      {q:"Which ISO covers California?",options:["SPP", "CAISO", "PJM", "NYISO"],answer:1,explain:"CAISO = California ISO; covers California and parts of Nevada."},
      {q:"Which region is NOT covered by an ISO?",options:["13 Northeast states", "Most of Texas", "The Southeast (Georgia, Florida, etc.)", "California"],answer:2,explain:"Southeast remains bilateral with vertically integrated utilities (Southern Co, Duke, Florida)."},
      {q:"What's PJM's capacity market called?",options:["FCM", "RPM (Reliability Pricing Model)", "PRA", "ICAP"],answer:1,explain:"PJM's RPM = 3-year-forward Base Residual Auction for capacity."}
    ]},
    {id:"4b",title:"Day-Ahead vs Real-Time",lesson:"ISO wholesale electricity markets use a TWO-SETTLEMENT system, with two distinct auction processes that together produce locational hourly prices for energy.\n\nTHE DAY-AHEAD MARKET runs once each afternoon for the next operating day. Generators submit offers (price and quantity), and load-serving entities submit bids. The ISO runs a Security-Constrained Unit Commitment (SCUC) optimization that minimizes total cost while respecting transmission, reliability, and generator constraints. By around 4-5 PM the prior day, the market publishes Day-Ahead Locational Marginal Prices (DA LMPs) for every hour of the next 24 hours at every node — typically thousands of nodes per ISO.\n\nDay-ahead clearing commits generators: they're scheduled and obligated to deliver their cleared quantities. Load-serving entities are similarly obligated to take and pay for their cleared positions at the DA LMP.\n\nTHE REAL-TIME MARKET runs every 5 minutes. The ISO's Security-Constrained Economic Dispatch (SCED) optimization re-runs continuously, redispatching the actual fleet against actual real-time conditions (weather, plant outages, load deviations). Real-Time LMPs (RT LMPs) are published every 5 minutes.\n\nDEVIATIONS between day-ahead schedules and real-time actuals settle at the RT LMP. If you scheduled 100 MW DA but delivered 110 MW, the extra 10 MW gets paid (or charged) at the RT price. This creates strong incentives for accurate forecasting.\n\nVIRTUAL BIDS are pure financial positions in the DA market — no physical obligation. An INCREMENT (INC) bid = sell DA, buy RT (profits if DA clears above RT). A DECREMENT (DEC) bid = buy DA, sell RT. Virtuals provide DA-RT price convergence and add liquidity.\n\nTrading strategies live in the spread between DA and RT prices, between adjacent hours, between locations, and between expected and actual fundamentals.",questions:[
      {q:"What does the DAY-AHEAD market do?",options:["Settles physical delivery 24h after", "Runs once daily for next-day hourly scheduling", "Real-time dispatch every 5 min", "Settles annual contracts"],answer:1,explain:"DA market clears the next-day hourly schedule via optimization; publishes prices ~4-5 PM prior day."},
      {q:"What does SCUC stand for?",options:["System Cost Under Contract", "Security-Constrained Unit Commitment", "Standard Customer Utility Charge", "Sub-Circuit Under Construction"],answer:1,explain:"SCUC = the optimization that commits generators for the next operating day."},
      {q:"What does SCED stand for?",options:["System Clearing and Economic Dispatch", "Security-Constrained Economic Dispatch", "Standard Contract for Energy Delivery", "Sub-daily Cost Energy Determination"],answer:1,explain:"SCED = real-time dispatch optimization that minimizes system cost every 5 minutes."},
      {q:"How often does the REAL-TIME market clear in most ISOs?",options:["Once an hour", "Every 15 minutes", "Every 5 minutes", "Daily"],answer:2,explain:"5-minute RT intervals — fine-grained balancing of supply and demand."},
      {q:"In the two-settlement system, what happens when delivery differs from schedule?",options:["Penalty fee", "Deviations settle at the real-time LMP", "No charge", "Annual reconciliation"],answer:1,explain:"DA schedules settle at DA LMP; the difference between actual and scheduled settles at RT LMP."},
      {q:"What is a VIRTUAL BID?",options:["Physical generation commitment", "Financial position in DA market with no physical obligation", "Capacity payment", "Pipeline reservation"],answer:1,explain:"Virtuals are pure financial positions — profit/loss settles at RT vs DA prices."},
      {q:"What's an INC (increment) virtual bid?",options:["Physical generation", "Sell DA, buy RT (profits if DA clears above RT)", "Buy DA, sell RT", "Pipeline transport"],answer:1,explain:"INC = sell DA at higher price, buy back at lower RT price = profit on the spread."},
      {q:"What's a DEC (decrement) virtual bid?",options:["Sell DA, buy RT", "Buy DA, sell RT (profits if RT clears above DA)", "Capacity bid", "Transmission right"],answer:1,explain:"DEC = buy DA at lower price, sell at higher RT price = profit on the spread."},
      {q:"Why are virtual bids beneficial for the market?",options:["They reduce regulator workload", "They provide DA-RT convergence and liquidity", "They subsidize generation", "They reduce transmission needs"],answer:1,explain:"Virtuals drive convergence between DA and RT prices, improving forecasting incentives and liquidity."},
      {q:"When does the DA market typically clear?",options:["8 AM operating day", "Around 4-5 PM the previous day", "Midnight", "Real-time only"],answer:1,explain:"DA results published evening before operations — generators get committed in time to start up."}
    ]},
    {id:"4c",title:"Henry Hub and Basis",lesson:"Henry Hub is the most important point in US natural gas trading. Located in Erath, Louisiana, it's a physical pipeline interconnect where roughly 13 major interstate pipelines converge. Henry Hub is the delivery point for NYMEX natural gas futures, making it the BENCHMARK price for North American natural gas.\n\nNYMEX NG FUTURES: The NYMEX (now CME Group) Henry Hub natural gas futures contract is the most-traded energy derivative in the world after WTI crude. Contract specs: 10,000 MMBtu per contract, monthly expiry 3 business days before the first day of the delivery month, physical delivery at Henry Hub. The \"front month\" is the next contract to expire.\n\nBut gas isn't consumed at Henry Hub — it's consumed at thousands of locations across the country. The price at any other location differs from Henry Hub due to transportation costs, pipeline capacity, regional supply/demand, and seasonal factors. The difference is called BASIS.\n\nLOCAL HUB PRICE = HENRY HUB + BASIS\n\nA POSITIVE basis means the local hub is more expensive than Henry Hub (typical for demand centers like Boston in winter). A NEGATIVE basis means it's cheaper (typical for producing regions with constrained pipeline takeaway, like Waha in the Permian).\n\nMajor US gas hubs to know:\n- HENRY HUB (LA) — the benchmark\n- WAHA (West TX, Permian) — often negative basis from producer congestion\n- DOMINION SOUTH (PA, Marcellus production) — often negative basis\n- ALGONQUIN CITY GATES (Boston) — famous winter basis spikes ($30-50+/MMBtu vs ~$3 HH)\n- CHICAGO CITY GATE — Midwest demand hub\n- AECO (Alberta) — Canadian benchmark\n\nBASIS RISK: hedging local gas exposure with Henry Hub futures leaves residual basis risk if the local-HH relationship moves unexpectedly. Big traders manage basis exposure as carefully as outright price.",questions:[
      {q:"Where is Henry Hub physically located?",options:["Houston, TX", "Erath, Louisiana", "New York City", "Calgary, Alberta"],answer:1,explain:"Henry Hub is in Erath, Louisiana — confluence of ~13 major pipelines."},
      {q:"Why is Henry Hub so important?",options:["Largest storage facility", "Delivery point for NYMEX gas futures — the US benchmark", "Only gas hub in the US", "Government-owned"],answer:1,explain:"Henry Hub = the benchmark for North American gas; NYMEX futures settle there."},
      {q:"How big is one NYMEX natural gas futures contract?",options:["1,000 MMBtu", "10,000 MMBtu", "100,000 MMBtu", "1 million MMBtu"],answer:1,explain:"Each NYMEX NG contract = 10,000 MMBtu (the standard size)."},
      {q:"When does the NYMEX NG futures contract expire?",options:["First day of delivery month", "3 business days before the delivery month", "Last day of delivery month", "End of quarter"],answer:1,explain:"3 BD before first day of delivery month — creates end-of-month roll activity."},
      {q:"What is BASIS in gas markets?",options:["The futures price", "Local hub price minus Henry Hub price", "Storage capacity", "Pipeline tariff"],answer:1,explain:"Basis = local price − Henry Hub price (positive or negative)."},
      {q:"If Henry Hub = $3.00 and Algonquin basis = +$10.00, the Algonquin price is:",options:["$3.00", "$7.00", "$13.00", "-$10.00"],answer:2,explain:"Local price = HH + basis. $3 + $10 = $13/MMBtu."},
      {q:"Which hub typically has NEGATIVE basis?",options:["Algonquin", "Waha (Permian)", "Chicago", "Henry Hub itself"],answer:1,explain:"Waha often trades at negative basis when Permian pipeline takeaway is full."},
      {q:"Why does Waha sometimes have NEGATIVE basis?",options:["Low local demand", "Constrained pipeline takeaway forces producers to discount", "Government subsidies", "Pipeline reversal"],answer:1,explain:"When Permian producers can't move all their gas out, local prices drop below HH."},
      {q:"What's BASIS RISK?",options:["The risk of a pipeline failing", "Residual risk when hedging local exposure with Henry Hub futures", "Currency risk", "Credit risk on the counterparty"],answer:1,explain:"Hedging with HH futures leaves you exposed if the local-HH spread (basis) moves unexpectedly."},
      {q:"What is AECO?",options:["A US ISO", "Canadian gas hub in Alberta", "An LNG export terminal", "A pipeline operator"],answer:1,explain:"AECO = the main Canadian gas pricing hub in Alberta."}
    ]},
    {id:"4d",title:"Major Pipelines",lesson:"The US gas pipeline network connects producing regions to demand centers, and the geography of these pipes drives regional pricing. A handful of major systems are responsible for moving the bulk of US gas. Knowing them — and how they connect — is fundamental to gas trading.\n\nGULF COAST TO NORTHEAST:\n- TRANSCO (Williams) — the highest-volume US gas pipeline. Runs from south Texas/Louisiana Gulf Coast to New York and surrounding Northeast markets. Critical for Northeast supply.\n- TENNESSEE GAS PIPELINE (Kinder Morgan) — another major Gulf-to-Northeast pipe. Together Transco and Tennessee are the backbone of Southeast-to-Northeast gas movement.\n- ALGONQUIN (Enbridge) — extends from the Tennessee/Texas Eastern interconnect into New England, terminating at Algonquin City Gates near Boston. CONSTRAINED in winter — drives the famous Boston gas basis spikes.\n\nGULF COAST TO MIDWEST:\n- EL PASO NATURAL GAS — major pipe from Permian Basin and Gulf to the desert Southwest and California.\n- NATURAL GAS PIPELINE COMPANY OF AMERICA (NGPL) — Gulf to Chicago.\n\nMARCELLUS/UTICA OUTBOUND (post-shale revolution):\n- ROCKIES EXPRESS PIPELINE (REX) — Originally built to move Rockies gas eastward to the Midwest. After the Marcellus boom, REX was REVERSED to move Marcellus gas westward — a famous example of how shale flipped traditional gas flow patterns.\n- MOUNTAIN VALLEY PIPELINE — Newer Appalachian outlet, southbound.\n\nPACIFIC INTERTIE:\n- The PACIFIC DC INTERTIE (a high-voltage DC power line) connects Pacific Northwest hydro to Southern California — important for power, not gas.\n\nTRANSMISSION CONSTRAINTS drive regional price differences. When Algonquin is full in winter, Boston gas trades at multiples of Henry Hub. When Permian gas exceeds pipeline capacity, Waha trades at huge discounts. Trading basis = trading these pipeline constraints.",questions:[
      {q:"What's the HIGHEST-VOLUME US natural gas pipeline?",options:["El Paso", "Transco", "Algonquin", "REX"],answer:1,explain:"Transco (operated by Williams) is the highest-volume US gas pipeline — Gulf to Northeast."},
      {q:"What region does TRANSCO primarily serve?",options:["Pacific Northwest", "Gulf Coast to Northeast", "Permian to California", "Canada to Midwest"],answer:1,explain:"Transco runs Gulf Coast to NY/Northeast — backbone of Southeast-to-NE gas movement."},
      {q:"Which pipeline is famously CONSTRAINED in winter?",options:["Transco", "REX", "Algonquin (into New England)", "El Paso"],answer:2,explain:"Algonquin can't bring enough gas into Boston in winter → famous winter basis spikes."},
      {q:"What's significant about the REX (Rockies Express) pipeline?",options:["It only carries LNG", "It REVERSED flow to move Marcellus gas westward", "It's the oldest pipeline", "It carries crude oil"],answer:1,explain:"REX was originally Rockies → Midwest, but after the Marcellus boom it was reversed."},
      {q:"Where does EL PASO Natural Gas primarily serve?",options:["Northeast", "Midwest", "From the Permian Basin and Gulf to the desert Southwest and California", "Florida"],answer:2,explain:"El Paso moves Permian/Gulf gas to Western US (Arizona, California)."},
      {q:"Which is one of the two main Gulf-to-Northeast pipelines?",options:["NGPL", "Tennessee Gas Pipeline", "Algonquin", "Pacific Gas"],answer:1,explain:"Transco and Tennessee together form the Gulf-to-Northeast backbone."},
      {q:"What's the MOUNTAIN VALLEY PIPELINE?",options:["A Rocky Mountains-to-Coast pipe", "Newer Appalachian (Marcellus) outlet, southbound", "An old pipeline", "A pacific NW pipe"],answer:1,explain:"Mountain Valley is a newer Marcellus outlet running southbound."},
      {q:"What is the PACIFIC DC INTERTIE?",options:["A gas pipeline", "A high-voltage DC POWER line, not gas", "An LNG terminal", "A trading hub"],answer:1,explain:"Pacific DC Intertie = power line connecting PNW hydro to Southern California — not gas."},
      {q:"What drives regional gas price differences?",options:["Federal regulation", "Transmission constraints (pipeline capacity limits)", "Currency fluctuations", "Stock market"],answer:1,explain:"Pipeline constraints create basis spreads — full pipes = local price separation."},
      {q:"When Permian gas EXCEEDS pipeline capacity, what happens at Waha?",options:["Prices spike higher", "Waha trades at HUGE discounts (negative basis)", "Federal intervention", "Pipelines reverse"],answer:1,explain:"Stranded production forces producers to accept much lower prices — negative basis."}
    ]},
    {id:"4e",title:"Standard Deal Types",lesson:"Energy trading uses standardized contract structures that govern how trades are executed, delivered, and settled. Knowing the major deal types is essential for any trader, analyst, or counterparty negotiator.\n\nPHYSICAL POWER DEALS:\n- BASELOAD (24×7): Constant MW over the entire contract period.\n- ON-PEAK (5×16): Mon-Fri, 16 hours per day, typically 6 AM to 10 PM.\n- OFF-PEAK (2×16 + 7×8): Weekends + nights + NERC holidays.\n- LOAD-FOLLOWING: Quantity varies hour-by-hour matching customer load. Shape risk is on the seller.\n\nPHYSICAL GAS DEALS:\n- FIRM TRANSPORT (FT): Daily reservation charge guarantees non-curtailable delivery. Higher cost, certainty.\n- INTERRUPTIBLE TRANSPORT (IT): No reservation; cheaper but curtailed first when pipelines are constrained.\n- POWER PURCHASE AGREEMENT (PPA): Long-term offtake of generation output. Common for renewable projects.\n- TAKE-OR-PAY (ToP): Buyer commits to taking a minimum annual quantity (MAQ) or paying for it anyway.\n\nFINANCIAL DERIVATIVES:\n- FUTURES (NYMEX): Standardized, exchange-traded, cleared by CME. Used for outright price hedging.\n- SWAPS: OTC bilateral fixed-for-floating exchange. Cleared at ICE or CME for liquid products.\n- OPTIONS: Call/put on futures or swaps. Embedded in many physical deals.\n\nASSET-LEVEL DEALS:\n- TOLLING AGREEMENT: Toller pays a fixed capacity payment to use a power plant. Toller supplies fuel and takes the power; plant owner gets paid for availability. Common for gas-fired plants.\n\nSTANDARD MASTER AGREEMENTS:\n- EEI Master Agreement: physical power\n- NAESB Base Contract: physical gas  \n- ISDA Master: OTC financial derivatives\n\nThese standardized agreements speed up deal execution and reduce legal risk.",questions:[
      {q:"What does BASELOAD power mean?",options:["Off-peak only", "Constant MW over the entire contract period", "Variable by hour", "Weekends only"],answer:1,explain:"Baseload = constant power 24/7 for the contract duration."},
      {q:"What does a LOAD-FOLLOWING contract mean?",options:["Fixed shape", "Quantity varies hour-by-hour matching customer load", "Always off-peak", "No deliveries"],answer:1,explain:"Load-following = serve actual customer load shape; shape risk sits with the seller."},
      {q:"What's FT (Firm Transport)?",options:["Cheapest option", "Daily reservation charge guarantees non-curtailable delivery", "Always free", "Available only weekends"],answer:1,explain:"FT = guaranteed delivery via reservation charge; higher cost than IT."},
      {q:"What's IT (Interruptible Transport)?",options:["Most reliable option", "No reservation; cheaper but curtailed first when pipelines are full", "Premium service", "Used only by utilities"],answer:1,explain:"IT = cheaper but cut off first during pipeline constraints."},
      {q:"What's a PPA?",options:["Power Pricing Agency", "Power Purchase Agreement — long-term offtake of generation output", "Pipeline Performance Agreement", "Public Power Authority"],answer:1,explain:"PPA = long-term contract to buy a project's output; common for renewable projects."},
      {q:"What's a Take-or-Pay (ToP) contract?",options:["Buyer pays only for what they take", "Buyer commits to a minimum annual quantity or pays for it anyway", "Supplier guarantee", "Government subsidy"],answer:1,explain:"ToP gives the seller volume certainty; buyer pays for MAQ whether they take it or not."},
      {q:"What's a TOLLING AGREEMENT?",options:["A pipeline tariff", "Toller pays plant for availability; toller supplies fuel and takes the power", "A storage contract", "A retail deal"],answer:1,explain:"Tolling separates fuel/power risk from the plant operator — common in gas-fired generation."},
      {q:"In a tolling agreement, who supplies the fuel?",options:["The plant owner", "The toller (the counterparty using the plant's output)", "The fuel company directly", "The grid operator"],answer:1,explain:"Toller delivers fuel to the plant, plant runs it, toller takes the power output."},
      {q:"What's the standard master agreement for PHYSICAL POWER trades?",options:["NAESB", "EEI Master Agreement", "ISDA", "NYMEX"],answer:1,explain:"EEI Master Agreement governs bilateral physical power deals."},
      {q:"What's the standard master agreement for PHYSICAL GAS trades?",options:["EEI", "NAESB Base Contract", "ISDA", "FERC"],answer:1,explain:"NAESB Base Contract is the standard for bilateral physical gas."},
      {q:"What's the ISDA Master Agreement used for?",options:["Physical power", "Physical gas", "OTC financial derivatives", "Capacity markets"],answer:2,explain:"ISDA governs OTC derivatives like swaps and options across asset classes."}
    ]},
  ]},
  5:{name:"COLLEGE",grade:"Undergraduate",tag:"L5",modules:[
    {id:"5a",title:"Locational Marginal Pricing (LMP)",lesson:"LMP — Locational Marginal Price — is the foundational pricing concept in restructured US wholesale electricity markets. Every node on the transmission grid has its own price, every 5 minutes, reflecting the cost of delivering one additional MWh to that specific location. PJM has ~10,000 nodes; smaller ISOs have hundreds to thousands. Understanding LMP is essential.\n\nThe LMP at any node has THREE COMPONENTS:\n\nENERGY COMPONENT: The system-wide marginal cost of generation at that moment. The same value across all nodes when there's no congestion or loss differentiation.\n\nCONGESTION COMPONENT: The shadow price of binding transmission constraints. When a line is at its limit, expensive generation must run on the export-constrained side, and cheaper generation must idle on the import-constrained side. The price gap = the congestion LMP component. ZERO when no constraints are binding.\n\nLOSS COMPONENT: Reflects the marginal cost of I²R energy losses in delivering electricity to that location. Far locations pay more for losses; locations near generation pay less.\n\nLMP = ENERGY + CONGESTION + LOSSES\n\nWhen transmission is unconstrained and losses are uniform, all nodes have the same LMP. When a constraint binds, prices separate dramatically. During scarcity, all prices rise sharply.\n\nHUBS are weighted-average baskets of nodes used as liquid trading points (e.g., PJM West Hub, NYISO Zone J = NYC). Traders use hubs because individual nodal liquidity is limited; hubs aggregate liquidity.\n\nZONES are larger geographic regions (load zones in NYISO and ISO-NE). Some ISOs settle retail at zonal prices and wholesale at nodal.\n\nLMPs can be NEGATIVE during oversupply conditions — most common when wind generation peaks at low-demand hours and there's not enough load to absorb it. Generators (especially wind with PTC subsidies) can profitably pay to stay online.",questions:[
      {q:"What does LMP stand for?",options:["Load Marginal Pricing", "Locational Marginal Price", "Limited Market Position", "Lower Mean Price"],answer:1,explain:"LMP = Locational Marginal Price; the foundational price in restructured wholesale markets."},
      {q:"What are the THREE components of LMP?",options:["Energy, Capacity, Carbon", "Energy, Congestion, Losses", "Fuel, Transmission, Distribution", "Base, Peak, Off-peak"],answer:1,explain:"LMP = Energy + Congestion + Losses (the three additive components)."},
      {q:"When does the CONGESTION component become non-zero?",options:["Always", "When a transmission line is at its binding limit", "Only at night", "Never"],answer:1,explain:"Congestion LMP appears when transmission constraints bind — the price gap reflects shadow cost of the constraint."},
      {q:"What does the LOSS component reflect?",options:["Credit losses", "The marginal cost of I²R energy losses delivering power to that location", "Equipment depreciation", "Customer churn"],answer:1,explain:"Loss component captures energy lost in transmission as heat; far locations pay more."},
      {q:"Approximately how many nodes does PJM have?",options:["100", "1,000", "10,000", "100,000"],answer:2,explain:"PJM has ~10,000 nodes; each gets its own LMP every 5 minutes."},
      {q:"What is a HUB?",options:["A physical generator", "A weighted-average basket of nodes used as a liquid trading point", "A substation", "A pipeline terminal"],answer:1,explain:"Hubs aggregate many nodes into a single tradeable reference price (e.g., PJM West Hub)."},
      {q:"Why do traders use HUB prices rather than individual nodes?",options:["Required by FERC", "Individual node liquidity is limited; hubs aggregate liquidity", "Hubs are physical", "Lower fees"],answer:1,explain:"Hubs concentrate liquidity into one tradeable price — easier hedging."},
      {q:"When can LMPs go NEGATIVE?",options:["Never", "Oversupply conditions — often wind generation at low-demand hours", "Only at peak demand", "Only during emergencies"],answer:1,explain:"Negative LMPs occur when supply exceeds demand and inflexible generators (subsidized renewables) keep running."},
      {q:"If energy is $30, congestion is $20, losses are $2, what's the LMP?",options:["$30", "$48", "$52", "$60"],answer:2,explain:"$30 + $20 + $2 = $52. LMP = sum of the three components."},
      {q:"In NYISO, what is 'Zone J'?",options:["A capacity zone", "NYC load zone — important pricing zone", "An RTO", "A generator"],answer:1,explain:"Zone J = New York City load zone — highly constrained, frequently expensive."}
    ]},
    {id:"5b",title:"Capacity Markets",lesson:"An energy-only market pays generators only for electricity they actually produce. The problem: peak demand happens for very few hours each year, but the grid still needs enough capacity to serve those peaks. Without sufficient revenue during scarcity, generators may not build or maintain peaking units. This is the \"missing money\" problem.\n\nCAPACITY MARKETS solve this by paying generators for AVAILABILITY — being there when needed, regardless of how often they run. Generators bid into a capacity auction with a $/MW-day or $/kW-year price; the auction clears at the price needed to attract enough capacity to meet a reliability target.\n\nPJM's RELIABILITY PRICING MODEL (RPM): Auctions held 3 years forward in the Base Residual Auction (BRA). Generators commit to be available during the delivery year and face penalty if they fail. The market also uses Variable Resource Requirement (VRR) — a sloped demand curve rather than a fixed quantity, smoothing prices.\n\nISO-NE's FORWARD CAPACITY MARKET (FCM): Auctions 3 years forward, similar to PJM.\n\nNYISO's INSTALLED CAPACITY (ICAP): Spot and seasonal auctions, less forward than PJM/ISO-NE.\n\nMISO's PLANNING RESOURCE AUCTION (PRA): Annual auction for the next planning year.\n\nERCOT: NO capacity market. Energy-only design with the Operating Reserve Demand Curve (ORDC) adding scarcity adders to energy prices when reserves get tight.\n\nCAISO: Resource Adequacy (RA) requirements — LSEs must demonstrate they have contracted enough capacity; bilateral procurement rather than centralized auction.\n\nELCC (Effective Load Carrying Capability): Capacity accreditation for intermittent resources. A 100 MW wind farm doesn't qualify for 100 MW of capacity — its ELCC is much lower, reflecting actual reliability contribution. ELCC declines as more intermittent resources are added (saturation effect).\n\nCONE (Cost of New Entry): The benchmark cost to build a new peaking plant, used to calibrate auction parameters. MOPR (Minimum Offer Price Rule) prevents subsidized resources from depressing prices artificially.",questions:[
      {q:"What's the 'MISSING MONEY' problem capacity markets solve?",options:["Stolen money", "Generators can't earn enough from energy alone for rare peak hours to justify peaking units", "Currency issues", "Customer non-payment"],answer:1,explain:"Energy-only revenue is insufficient during scarcity to incentivize peaking capacity — capacity markets add explicit availability payments."},
      {q:"What does PJM's capacity market auction commit to?",options:["1 year forward", "3 years forward", "5 years forward", "Same-day delivery"],answer:1,explain:"PJM's Base Residual Auction is 3 years forward for capacity availability."},
      {q:"What's the name of PJM's capacity market?",options:["FCM", "RPM (Reliability Pricing Model)", "PRA", "ICAP"],answer:1,explain:"RPM = Reliability Pricing Model, PJM's 3-year-forward capacity construct."},
      {q:"What's ISO-NE's capacity market called?",options:["RPM", "FCM (Forward Capacity Market)", "ICAP", "PRA"],answer:1,explain:"FCM auctions 3 years forward in New England, similar to PJM's RPM."},
      {q:"Which ISO has NO capacity market?",options:["PJM", "ISO-NE", "ERCOT", "NYISO"],answer:2,explain:"ERCOT is energy-only; ORDC adds scarcity adders to energy prices instead."},
      {q:"How does CAISO handle resource adequacy?",options:["Energy-only market", "Bilateral procurement under RA requirements — LSEs contract capacity themselves", "Annual auction like PJM", "Federally administered"],answer:1,explain:"CAISO uses bilateral procurement under Resource Adequacy rules rather than centralized auction."},
      {q:"What does ELCC stand for?",options:["Electric Load Capacity Calculation", "Effective Load Carrying Capability", "Energy Limit Curve Constraint", "Estimated Long-term Capacity Cost"],answer:1,explain:"ELCC = capacity accreditation for intermittent resources, reflecting actual reliability contribution."},
      {q:"Why does wind's ELCC DECLINE as wind penetration grows?",options:["Turbines age", "Saturation effect — additional wind adds less incremental reliability", "Wind speeds decrease", "Regulation"],answer:1,explain:"When lots of wind is already on the system, extra wind doesn't proportionally improve reliability."},
      {q:"What is CONE?",options:["A type of generator", "Cost of New Entry — benchmark cost to build a peaking plant", "A capacity zone", "An ISO name"],answer:1,explain:"CONE = the target price for new peaking capacity, used to calibrate auction parameters."},
      {q:"What is MOPR?",options:["Maximum Output Power Rating", "Minimum Offer Price Rule — prevents subsidized resources from artificially depressing capacity prices", "Market Operations Performance Report", "Mandatory Operating Performance Requirement"],answer:1,explain:"MOPR is a price floor protecting capacity markets from subsidized resources."}
    ]},
    {id:"5c",title:"Ancillary Services",lesson:"Energy markets clear $/MWh prices for bulk electric energy delivery. But maintaining grid reliability requires additional services beyond raw energy. ANCILLARY SERVICES are the supporting products that keep the grid stable — frequency, voltage, contingency response. ISOs procure them in co-optimized markets alongside energy.\n\nREGULATION (RegA/RegD): The fastest response — sub-minute. Generators on Automatic Generation Control (AGC) respond to a signal every few seconds, adjusting output to keep frequency at exactly 60 Hz. Two products: RegA (slower, traditional) and RegD (faster, used by batteries).\n\nSPINNING RESERVE: Generators online and synchronized to the grid, with headroom to ramp up within 10 minutes if needed. Backup for sudden contingencies (a generator trips offline, transmission line fails).\n\nNON-SPINNING RESERVE: Offline generators that can start and reach output within 30-60 minutes. Cheaper than spinning since they're not consuming fuel just to stand by.\n\nREPLACEMENT RESERVE: Slower response, longer duration. Refills the reserve pool after a contingency is used.\n\nVOLTAGE SUPPORT (REACTIVE POWER): Maintaining voltage levels across the grid. Reactive power doesn't transfer energy but is essential for AC operation. Some generators are required to provide it.\n\nBLACK START CAPABILITY: A unit that can start without external grid power. Used to restart the system after a complete blackout — first generator to come up restores grid voltage, allowing other plants to restart.\n\nERCOT has its own products: ECRS (ERCOT Contingency Reserve Service), Fast Frequency Response (FFR), and ResponsiveReserve. The energy-only design plus islanded grid creates unique frequency challenges.\n\nCO-OPTIMIZATION: Energy and ancillary services clear in a single optimization minimizing total system cost. A generator capable of providing both energy and reserves can earn from either depending on which is most valuable. Pricing reflects opportunity cost.",questions:[
      {q:"What's the FASTEST ancillary service response?",options:["Replacement reserve", "REGULATION (sub-minute, AGC signal)", "Non-spinning reserve", "Black start"],answer:1,explain:"Regulation is the fastest — every few seconds, generators on AGC adjust to keep frequency at 60 Hz."},
      {q:"What does AGC stand for?",options:["Average Grid Capacity", "Automatic Generation Control — the dispatch signal regulation resources follow", "Ancillary Gas Cost", "Annual Generation Certificate"],answer:1,explain:"AGC = the second-by-second signal that regulation resources respond to."},
      {q:"What's SPINNING RESERVE?",options:["Fast frequency response", "Generators online and synchronized, with headroom to ramp up within 10 minutes", "Cold backup", "Offline only"],answer:1,explain:"Spinning = already running, ready to ramp up if a generator trips off."},
      {q:"What's NON-SPINNING RESERVE?",options:["Same as spinning", "Offline generators that can start and reach output within 30-60 minutes", "Permanently offline", "Variable resource"],answer:1,explain:"Non-spin = offline but startable; cheaper than spinning since not consuming fuel."},
      {q:"What's VOLTAGE SUPPORT (reactive power)?",options:["Energy delivery", "Maintains voltage levels across the grid — essential for AC operation", "Pipeline pressure", "Battery storage"],answer:1,explain:"Reactive power doesn't transfer energy but is essential for stable AC grid operation."},
      {q:"What's BLACK START capability?",options:["Coal-fired plants only", "A unit that can start without external grid power, used to restart from blackout", "Nighttime operation", "First-of-day startup"],answer:1,explain:"Black start units restart the system after a blackout — they don't need outside power to begin."},
      {q:"What's CO-OPTIMIZATION?",options:["Two ISOs trading", "Energy and ancillary services clear in a single optimization minimizing total cost", "Federal coordination", "Joint utility planning"],answer:1,explain:"Co-optimization = ISO clears all products together; resources allocated to highest-value use."},
      {q:"What's ERCOT's fast frequency response product called?",options:["RegA", "FFR (Fast Frequency Response)", "RPM", "ICAP"],answer:1,explain:"FFR is ERCOT-specific for very fast frequency response, given its islanded grid challenges."},
      {q:"Why are ancillary services CO-OPTIMIZED with energy?",options:["Regulator requires it", "Single optimization minimizes total system cost across all products", "Simpler billing", "Tradition"],answer:1,explain:"Co-optimization yields system-wide cost-efficient dispatch — products allocated to highest-value use."},
      {q:"What is RegD?",options:["A type of reactive power", "Faster regulation product, used by batteries", "Replacement reserve", "Discount rate"],answer:1,explain:"RegD = the faster regulation signal, designed for fast-responding resources like batteries."}
    ]},
    {id:"5d",title:"Gas Storage Trading",lesson:"Natural gas storage is a financial instrument as much as a physical asset. Storage capacity can be valued, optimized, hedged, and traded by separating its INTRINSIC and EXTRINSIC values.\n\nINTRINSIC VALUE: The value locked in deterministically by today's forward curve. If summer gas is $3 and winter gas is $5, a storage operator can buy summer, store, and sell winter — earning the $2 spread minus storage costs and losses. The intrinsic value is whatever spread you can lock in today via calendar trades.\n\nEXTRINSIC VALUE: The value of OPTIONALITY — the right to re-optimize as the forward curve changes over time. Even after locking in intrinsic spreads, you can revise positions if curves shift. Salt cavern storage with multiple cycles per year captures more extrinsic value than slow-cycle reservoir storage.\n\nThe MARCH-APRIL SPREAD (the \"widow-maker\"): Historically the most volatile gas calendar spread. March is the end of winter (last withdrawal); April starts the injection season. Weather, storage levels, and forward expectations create huge moves. Famous for blowing up traders — Amaranth Advisors lost ~$6 billion on March-April spread positions in September 2006.\n\nVALUATION METHODS:\n- Intrinsic via calendar spreads — simple, deterministic\n- Extrinsic via Monte Carlo simulation — Schwartz-Smith model or similar two-factor processes (short-term mean-reverting + long-term equilibrium)\n- LONGSTAFF-SCHWARTZ Monte Carlo (LSM): The standard regression-based method for valuing path-dependent options like storage\n- Stochastic control with Bellman backward induction: Mathematical framework for optimal injection/withdrawal decisions over time\n\nSTORAGE CAPACITY MEASURES:\n- WORKING GAS: tradeable volume\n- DELIVERABILITY: max daily injection or withdrawal rate\n- CYCLES: how many times per year the facility can fully cycle\n- Higher cycles + higher deliverability = more option value\n\nSalt caverns may have a fraction of a depleted reservoir's working volume but capture more economic value per unit due to flexibility.",questions:[
      {q:"What is INTRINSIC storage value?",options:["The hidden value", "Value locked in deterministically by today's forward curve calendar spreads", "Future random value", "Government subsidy"],answer:1,explain:"Intrinsic = the spread you can lock in today via calendar trades (buy summer, sell winter)."},
      {q:"What is EXTRINSIC storage value?",options:["External revenue", "The value of OPTIONALITY — right to re-optimize as curves change", "Tax credits", "Storage capacity rentals"],answer:1,explain:"Extrinsic = path-dependent option value from re-optimizing as forward curve shifts."},
      {q:"Which storage type captures more EXTRINSIC value?",options:["Slow-cycle reservoir", "Salt cavern with multiple cycles per year", "All equally", "Aquifer"],answer:1,explain:"Fast cycling = more re-optimization opportunities = more extrinsic value."},
      {q:"What's the 'WIDOW-MAKER' in gas trading?",options:["A type of pipeline", "The March-April calendar spread — historically volatile", "A storage facility", "A pricing benchmark"],answer:1,explain:"Mar-Apr spread = end of winter / start of injection — extremely volatile, blew up Amaranth."},
      {q:"How much did Amaranth Advisors lose on Mar-Apr spreads in 2006?",options:["~$60 million", "~$600 million", "~$6 billion", "~$60 billion"],answer:2,explain:"Amaranth lost approximately $6 billion in September 2006 — classic widow-maker disaster."},
      {q:"What does LSM (Longstaff-Schwartz) Monte Carlo do?",options:["Forecast weather", "Regression-based method for valuing path-dependent options like storage", "Calculate pipeline tariffs", "Set capacity prices"],answer:1,explain:"LSM regresses continuation values on basis functions to value American/Bermudan options."},
      {q:"What two-factor model is commonly used for gas prices?",options:["Single random walk", "Schwartz-Smith (short-term mean-reverting + long-term equilibrium)", "CAPM", "Black-Scholes"],answer:1,explain:"Schwartz-Smith combines short-term mean reversion with long-term equilibrium level."},
      {q:"What is DELIVERABILITY in storage?",options:["Pipeline tariff", "Maximum daily injection or withdrawal rate", "Cushion gas", "Working capacity"],answer:1,explain:"Deliverability = how fast you can move gas in/out per day — drives optionality value."},
      {q:"What is WORKING GAS?",options:["Total gas including cushion", "The tradeable volume that can be cycled in and out", "Cushion gas only", "Inventory in pipelines"],answer:1,explain:"Working gas = the commercial volume; cushion gas maintains pressure but isn't tradeable."},
      {q:"How do salt caverns compare to depleted reservoirs commercially?",options:["Always more valuable per unit", "Smaller volume but capture more economic value per unit due to flexibility", "Always less valuable", "Identical"],answer:1,explain:"Salt cavern's high cycling + deliverability often beats larger reservoirs in $/unit value."}
    ]},
    {id:"5e",title:"Heat Rate, Spark, Dark Spreads",lesson:"The economics of fossil-fuel generation revolve around three closely related concepts: HEAT RATE, SPARK SPREAD, and DARK SPREAD. Together they describe how efficiently a plant converts fuel to electricity and whether it's making money at current market prices.\n\nHEAT RATE measures plant efficiency: HOW MUCH FUEL ENERGY IS REQUIRED TO PRODUCE ONE UNIT OF ELECTRICITY. Units are Btu/kWh (British thermal units of fuel per kilowatt-hour of electricity). LOWER heat rates = MORE efficient plants.\n\nTypical heat rates:\n- Best CCGT (combined cycle gas turbine): ~6,400 Btu/kWh — most efficient (58-63% thermal efficiency)\n- Simple cycle gas turbine: ~10,000-12,000 Btu/kWh\n- Coal plants: ~9,500-10,500 Btu/kWh\n- Older inefficient peakers: 13,000-15,000 Btu/kWh\n\nSPARK SPREAD = the gross margin of a gas-fired plant:\nSPARK SPREAD = POWER PRICE − (HEAT RATE × GAS PRICE) − VOM\n\nWhere VOM = variable O&M (~$2-5/MWh). If power = $40/MWh, heat rate = 7,000 Btu/kWh, gas = $3/MMBtu, then fuel cost = 7 × $3 = $21/MWh, leaving a spark spread of ~$15-17/MWh.\n\nDARK SPREAD = same concept for COAL plants:\nDARK SPREAD = POWER PRICE − (HEAT RATE × COAL PRICE) − VOM\n\nCLEAN SPARK / CLEAN DARK include carbon costs. As carbon prices rise, gas plants increasingly out-compete coal — gas has lower carbon emissions per Btu. The COAL-TO-GAS SWITCHING price is where: HR_coal × coal + carbon_coal = HR_gas × gas + carbon_gas.\n\nHEAT-RATE-LINKED OPTIONS: Options where the strike scales with gas price (e.g., strike = heat rate × gas + premium). These hedge spark spread exposure without basis risk on the fuel side.\n\nSpark spreads are a primary trading instrument and a key indicator of generation profitability.",questions:[
      {q:"What does HEAT RATE measure?",options:["Plant size", "Fuel input per unit of electric output (Btu/kWh)", "Annual fuel consumption", "Maximum capacity"],answer:1,explain:"Heat rate = how much fuel energy is needed to produce one kWh of electricity."},
      {q:"What unit is heat rate measured in?",options:["$/MWh", "Btu/kWh", "MW/MMBtu", "kWh per ton"],answer:1,explain:"Btu/kWh — British thermal units of fuel per kilowatt-hour of electricity output."},
      {q:"Is a LOWER or HIGHER heat rate more efficient?",options:["Higher", "LOWER — less fuel per kWh = more efficient", "No difference", "Depends on fuel type"],answer:1,explain:"Lower heat rate = more efficient plant; less fuel needed per unit of electricity."},
      {q:"What's the typical heat rate of a best-in-class CCGT?",options:["~3,000 Btu/kWh", "~6,400 Btu/kWh", "~10,000 Btu/kWh", "~15,000 Btu/kWh"],answer:1,explain:"~6,400 Btu/kWh ≈ 58-63% efficiency — best combined-cycle thermal performance."},
      {q:"What does SPARK SPREAD equal?",options:["Power − coal price", "Power − (heat rate × gas price) − VOM", "Gas − coal", "Power + capacity payment"],answer:1,explain:"Spark spread = gas plant gross margin = Power − fuel cost − VOM."},
      {q:"What's the DARK SPREAD equivalent?",options:["Spark spread for solar", "Same calculation for COAL plants instead of gas", "Negative spark spread", "Storage value"],answer:1,explain:"Dark spread = power − (HR × coal price) − VOM, the coal-plant equivalent of spark."},
      {q:"What's CLEAN SPARK SPREAD?",options:["Spark spread plus carbon emissions cost", "Spark for natural gas only", "Renewable-only metric", "Carbon credit value"],answer:0,explain:"Clean spread includes carbon allowance cost — important in markets with carbon pricing."},
      {q:"What's COAL-TO-GAS SWITCHING?",options:["Replacing coal plants", "The gas price level where gas variable cost beats coal — drives dispatch order", "Federal mandate", "Pipeline retrofit"],answer:1,explain:"Switching price = where HR×gas + carbon < HR×coal + carbon — gas becomes cheaper to dispatch."},
      {q:"Calculate spark spread: Power=$50/MWh, HR=7,000 Btu/kWh, Gas=$4/MMBtu, VOM=$3/MWh",options:["$15/MWh", "$19/MWh", "$22/MWh", "$25/MWh"],answer:1,explain:"Fuel = 7 × $4 = $28. Spark = $50 − $28 − $3 = $19/MWh."},
      {q:"What's a HEAT-RATE-LINKED OPTION?",options:["Same as a vanilla call", "Option where strike scales with fuel price (e.g., strike = HR × gas + premium)", "Coal-specific option", "Capacity option"],answer:1,explain:"HR-linked options hedge spark spread without leaving fuel basis exposure."}
    ]},
    {id:"5f",title:"FTRs / CRRs / TCCs",lesson:"When transmission constraints bind and LMPs separate across nodes, energy delivery from one location to another becomes more expensive than just the energy cost. Buyers at constrained nodes pay congestion premiums; sellers at export-constrained nodes receive less. FINANCIAL TRANSMISSION RIGHTS (FTRs) are the instruments that hedge or speculate on this congestion.\n\nAn FTR is a financial right that pays the LMP difference between a SOURCE and a SINK node. For example, an FTR from Western PJM to Eastern PJM pays whatever (East LMP − West LMP) is, hour by hour, for the contract period. Holding an FTR makes you long the congestion path.\n\nFTR uses:\n- HEDGING: A generator at a constrained-source location can buy an FTR from source to sink, locking in some congestion exposure\n- SPECULATION: Take a view on whether a specific path will become more or less congested\n- COUNTER-FLOW: Take the opposite side, betting congestion will reduce or reverse\n\nISO TERMINOLOGY VARIES:\n- PJM, MISO, ISO-NE: FTRs (Financial Transmission Rights)\n- NYISO: TCCs (Transmission Congestion Contracts)\n- CAISO, ERCOT: CRRs (Congestion Revenue Rights)\n\nAll same underlying concept, different names.\n\nAUCTIONS: ISOs hold annual, monthly, and sometimes quarterly auctions. Annual auctions sell rights for the upcoming year; monthly auctions for individual months. Long-term auctions sell multi-year strips.\n\nREVENUE ADEQUACY: When congestion happens, ISOs collect from the constrained side and pay the unconstrained side — the difference is congestion revenue. ISOs allocate this revenue back to FTR holders. In rare cases (mis-modeled outages), revenues fall short and FTR holders are paid less than face value.\n\nNODAL pricing means FTRs can be defined between ANY source and ANY sink — thousands of possible paths.",questions:[
      {q:"What does an FTR pay?",options:["Fixed monthly payment", "The LMP difference between a source and sink node", "Capacity payments", "Energy price"],answer:1,explain:"FTR = (Sink LMP − Source LMP) × MW for each hour — pays the congestion path."},
      {q:"If you hold a source-to-sink FTR, when does it pay POSITIVE?",options:["Always", "When sink LMP > source LMP (congestion into the sink)", "Only during outages", "Never"],answer:1,explain:"FTR pays positive when downstream is more expensive than upstream — congestion premium."},
      {q:"What does FTR stand for?",options:["Federal Transmission Right", "Financial Transmission Right", "Fixed Tariff Reservation", "Future Trading Receipt"],answer:1,explain:"FTR = Financial Transmission Right — instrument that pays nodal LMP differences."},
      {q:"What does CAISO call its FTRs?",options:["TCCs", "CRRs (Congestion Revenue Rights)", "FTRs", "ICAP"],answer:1,explain:"CAISO (and ERCOT) use 'CRR' — same concept, different name."},
      {q:"What does NYISO call its FTRs?",options:["FTRs", "TCCs (Transmission Congestion Contracts)", "CRRs", "RPM"],answer:1,explain:"NYISO uses TCC — Transmission Congestion Contract."},
      {q:"How often are FTR auctions held?",options:["Daily", "Annual, monthly, and sometimes quarterly", "Once every 5 years", "Only on demand"],answer:1,explain:"Multiple auction windows: annual for next year, monthly for individual months, plus long-term strips."},
      {q:"Where does the money paid to FTR holders come from?",options:["Customer surcharges", "Congestion revenue collected by the ISO during constraint events", "Federal subsidies", "Generator fines"],answer:1,explain:"ISOs collect congestion charges when constraints bind, distribute to FTR holders."},
      {q:"What is REVENUE ADEQUACY in FTR markets?",options:["Capacity adequacy", "When collected congestion revenue is sufficient to fully pay FTR obligations", "Generator revenue", "Customer billing"],answer:1,explain:"Revenue adequacy = collections match obligations; rare shortfalls leave FTR holders short-paid."},
      {q:"Can FTRs be used to SPECULATE?",options:["No, only hedging", "Yes — taking a view on whether a path will become more or less congested", "Only by utilities", "Only by ISOs"],answer:1,explain:"FTRs are both hedges and speculative instruments — anyone with credit can trade them."},
      {q:"What's a COUNTER-FLOW FTR?",options:["Reversed power flow", "Taking the opposite side — betting congestion will reduce or reverse", "Two FTRs combined", "An FTR with a discount"],answer:1,explain:"Counter-flow FTRs profit when the constrained direction unwinds — the opposite bet."}
    ]},
    {id:"5g",title:"Hedging Basics",lesson:"Hedging is the use of financial instruments to offset risk in an underlying physical or financial exposure. The goal isn't to eliminate all risk but to manage volatility around an unwanted exposure.\n\nTHE TWO BASIC HEDGES:\n- PRODUCER HEDGE: A natural-gas producer is naturally LONG gas (they win when prices rise). They can sell futures or fix a price via swap to lock in future revenue — a SHORT hedge.\n- CONSUMER HEDGE: A power plant or utility is naturally SHORT fuel (they pay more when prices rise). They can buy futures or fix a price via swap — a LONG hedge.\n\nHEDGE EFFECTIVENESS: A perfect hedge would offset the exposure 1-for-1. In practice, hedges have residual risk:\n- BASIS RISK: The hedge instrument doesn't perfectly track the exposure (e.g., hedging Algonquin gas with Henry Hub futures leaves NE-HH basis exposure).\n- VOLUMETRIC RISK: Actual volumes differ from hedged volumes — over-hedged or under-hedged.\n- TIMING RISK: The hedge expires at different points than physical settlements.\n\nTHE MINIMUM-VARIANCE HEDGE RATIO uses the correlation and volatility of the hedge instrument vs the exposure to find the optimal hedge ratio:\nHR_opt = ρ × (σ_exposure / σ_hedge)\n\nWhere ρ = correlation, σ = volatility. If the hedge perfectly tracks, HR = 1. If correlation is lower or vol differs, the ratio adjusts.\n\nHEDGE ACCOUNTING (FAS 133 / IFRS 9): For an \"effective\" hedge passing statistical tests, gains/losses can be deferred to Other Comprehensive Income (OCI) until the hedged item flows through earnings. INEFFECTIVE hedges mark-to-market through P&L, creating earnings volatility.\n\nINSTRUMENTS:\n- Futures: standardized, exchange-traded\n- Swaps: OTC, customizable fixed-for-floating\n- Options: cap downside, retain upside (or vice versa)\n- Collars: combine bought-put and sold-call to cap range without premium cost",questions:[
      {q:"What's a PRODUCER HEDGE?",options:["Going long futures", "Selling futures to lock in future sale price", "Buying inventory", "Charging premium"],answer:1,explain:"Producer is long the commodity; they SHORT futures to lock in a sale price."},
      {q:"What's a CONSUMER HEDGE?",options:["Selling futures", "Buying futures to lock in purchase price", "No hedging needed", "Wait for prices to fall"],answer:1,explain:"Consumer is short fuel exposure; they go LONG futures to lock in cost."},
      {q:"What's BASIS RISK?",options:["Counterparty default", "Risk that the hedge instrument doesn't perfectly track the exposure", "Currency risk", "Interest rate risk"],answer:1,explain:"Basis risk = residual mismatch between hedge and exposure (e.g., NE gas vs HH futures)."},
      {q:"What's VOLUMETRIC RISK in hedging?",options:["Storage volume risk", "Actual volumes differ from hedged volumes — over/under-hedged", "Pipeline volume", "Trading volume"],answer:1,explain:"If you hedge 100 MWh but actually consume 120 MWh, you're under-hedged on the extra 20."},
      {q:"What does the MINIMUM-VARIANCE HEDGE RATIO use?",options:["Always 1:1", "Correlation and volatility of hedge vs exposure", "Random selection", "Federal guidelines"],answer:1,explain:"HR = ρ × (σ_exp / σ_hedge) — optimizes hedge ratio based on stats."},
      {q:"What's hedge ACCOUNTING (FAS 133 / IFRS 9) for?",options:["Tax filing", "Deferring P&L of effective hedges to OCI until the hedged item flows through earnings", "Insurance", "Credit reporting"],answer:1,explain:"Effective hedges defer P&L to OCI, reducing earnings volatility."},
      {q:"What happens with INEFFECTIVE hedges?",options:["They get deferred to OCI", "They mark-to-market through P&L, creating earnings volatility", "They're banned", "They're written off"],answer:1,explain:"Failed effectiveness test = gains/losses flow through income statement immediately."},
      {q:"What's OCI?",options:["Operating Cost Index", "Other Comprehensive Income — where effective hedge P&L is deferred", "Open Contract Interest", "Oil Currency Index"],answer:1,explain:"OCI holds deferred hedge gains/losses until the hedged transaction occurs."},
      {q:"What's a COLLAR strategy?",options:["A single option", "Bought put + sold call — cap range without net premium cost", "Two futures", "A swap"],answer:1,explain:"Collar = buy a put for downside, sell a call for upside; premium often nets near zero."},
      {q:"What's a SWAP in hedging?",options:["Exchange of physical assets", "OTC fixed-for-floating exchange — customizable", "Same as futures", "A retail product"],answer:1,explain:"Swap = OTC bilateral fixed-for-floating; customizable but bilateral credit risk."}
    ]},
    {id:"5h",title:"Power Flow & Load Flow",lesson:"Power flow analysis is the fundamental computation used to operate the grid. Given the configuration of generators, loads, and transmission lines, what voltages and currents result at every bus? This is THE foundational power systems calculation.\n\nTHE PROBLEM SETUP: You have a network of buses (nodes) connected by transmission lines. At each bus, you know either:\n- A generation P + Q (slack/PV bus)\n- A load P + Q (PQ bus, the most common)\n- A fixed voltage and angle (slack bus, reference)\n\nThe unknowns: voltage magnitude and angle at every PQ bus, generation at the slack bus.\n\nTHE EQUATIONS: For each bus, the power flowing in must equal the power flowing out (Kirchhoff's law). The current through each line is related to the voltage difference and the line impedance (Ohm's law in AC form). These give a system of NONLINEAR equations — they can't be solved analytically for large networks.\n\nITERATIVE SOLUTION METHODS:\n- GAUSS-SEIDEL: Start with an initial guess (often 1.0 pu voltage everywhere — \"flat start\"). Update each bus voltage using the latest available values for other buses. Iterate until voltages stop changing meaningfully.\n- NEWTON-RAPHSON: Faster convergence using the Jacobian matrix. Standard for large grids.\n- FAST DECOUPLED: Approximations that exploit AC grid structure for speed.\n\nWORKED EXAMPLE (Gauss-Seidel intuition):\nSource: 100V, Line impedance: 1Ω, Constant power load: 1 kW.\nIteration 1: Assume V_load = 100V. I = P/V = 1000/100 = 10A. Voltage drop = 10A × 1Ω = 10V. New V_load = 90V.\nIteration 2: V_load = 90V. I = 1000/90 = 11.1A. Drop = 11.1V. New V_load = 88.9V.\nIteration 3: V_load = 88.9V. I = 11.25A. Drop = 11.25V. New V_load = 88.75V.\nConverges to ~88.7V.\n\nCONVERGENCE: Iterate until ΔV/V_nominal < threshold (e.g., 0.001). Real-world load flow runs in milliseconds on modern hardware.\n\nUSES: Setting LMPs, planning transmission expansion, contingency analysis (what if a line trips?), real-time security assessment.",questions:[
      {q:"What does power flow analysis solve for?",options:["Generator fuel cost", "Voltage and current at every bus given known generation and load", "Customer billing", "Capacity prices"],answer:1,explain:"Power flow = find voltages and angles throughout the network from known P/Q injections."},
      {q:"What types of buses exist in power flow?",options:["Only generation", "PQ (load), PV (generator), and slack (reference)", "Only load", "Only transmission"],answer:1,explain:"Three bus types: PQ (load), PV (gen with fixed V), and slack (reference)."},
      {q:"Why are power flow equations NONLINEAR?",options:["Variables interact in non-additive ways (voltages multiply currents)", "They were poorly designed", "They use random numbers", "Linear systems are slower"],answer:0,explain:"P = V × I × cos(θ); the product makes the system nonlinear — requires iterative solution."},
      {q:"What's a 'FLAT START' in power flow?",options:["A reset", "Initial guess of 1.0 pu voltage at every bus", "No starting solution", "Zero voltage"],answer:1,explain:"Flat start: assume 1.0 per-unit voltage everywhere as the initial iteration guess."},
      {q:"What's GAUSS-SEIDEL iteration?",options:["A direct solver", "Iterative method that updates bus voltages sequentially using latest values", "Monte Carlo", "Statistical regression"],answer:1,explain:"Gauss-Seidel updates each bus's voltage in turn, using the latest available estimates of others."},
      {q:"What's NEWTON-RAPHSON?",options:["Slower than Gauss-Seidel", "Faster convergence using the Jacobian matrix — standard for large grids", "Same as GS", "Direct algebraic solution"],answer:1,explain:"Newton-Raphson uses Jacobian-based updates for quadratic convergence — preferred for large systems."},
      {q:"In the example (100V, 1Ω, 1kW), what's the converged load voltage?",options:["100V", "95V", "~88.7V", "75V"],answer:2,explain:"Iterative solution converges to ~88.7V — well below source due to line voltage drop."},
      {q:"Why does load current INCREASE as voltage drops (for constant power load)?",options:["Random", "P = V × I means lower V requires higher I", "Line resistance changes", "Source increases"],answer:1,explain:"Constant power: P = V × I. As V falls, I must rise to keep P the same."},
      {q:"How is CONVERGENCE typically declared?",options:["After exactly 10 iterations", "When voltage changes between iterations fall below a threshold", "When current reaches zero", "Never automatically"],answer:1,explain:"Iterate until ΔV/V_nominal < threshold (e.g., 0.001 = 0.1%)."},
      {q:"What's power flow USED for in practice?",options:["Only academic", "Setting LMPs, planning transmission, contingency analysis, real-time security assessment", "Customer billing", "Trading derivatives"],answer:1,explain:"Power flow is the engine behind LMPs, planning, and security analysis — runs millions of times daily."}
    ]},
  ]},
  6:{name:"GRADUATE",grade:"Quant / Practitioner",tag:"L6",modules:[
    {id:"6a",title:"Real Options & Storage Valuation",lesson:"Storage assets and flexible generation contain embedded OPTIONALITY — the right (but not obligation) to act in response to evolving market conditions. Valuing this optionality is a core skill in advanced energy trading. The mathematics extends classical option pricing to handle physical constraints.\n\nWHY VANILLA OPTION PRICING DOESN'T WORK: Black-Scholes assumes a single exercise date, GBM dynamics, and unconstrained exercise. Storage has multiple decisions over time, capacity constraints (max injection/withdrawal rates, max inventory), seasonal price dynamics, and path-dependent payoffs.\n\nSTOCHASTIC CONTROL: Storage valuation is a constrained stochastic control problem. At each time step, the operator decides whether to inject, withdraw, or hold, subject to:\n- Working capacity (0 ≤ inventory ≤ max)\n- Daily injection rate limit\n- Daily withdrawal rate limit\n- Forward price uncertainty\n\nBELLMAN BACKWARD INDUCTION: Define V(t, S, I) = value at time t given price S and inventory I. At terminal time T, V(T, S, I) = 0 (storage worthless after expiry). Work backward:\nV(t, S, I) = max over actions [immediate payoff + E[V(t+1, S', I') | S, I, action]]\n\nThis recursion finds the optimal policy.\n\nLONGSTAFF-SCHWARTZ MONTE CARLO (LSM): The standard numerical method. Simulate many price paths forward. At each time step, regress the continuation value (future cash flows) on basis functions of current state. The regression gives an estimate of E[continuation | state]. Compare to immediate exercise value to decide.\n\nSCHWARTZ-SMITH TWO-FACTOR MODEL: Price = short-term mean-reverting factor + long-term equilibrium factor. Captures both rapid price swings and slow drift.\n\nJUMP PROCESSES: Standard GBM understates the probability of large moves. Adding Poisson jumps captures cold snaps, plant outages, supply disruptions — essential for power and gas with their famous spike behavior.\n\nINTRINSIC vs EXTRINSIC: Intrinsic = today's deterministic spread. Extrinsic = optionality value from re-optimizing as curves evolve. Total = intrinsic + extrinsic.",questions:[
      {q:"Why doesn't VANILLA Black-Scholes work for storage?",options:["Too simple", "Storage has multiple decisions, capacity constraints, and path-dependent payoffs", "Storage isn't an option", "Black-Scholes is for stocks only"],answer:1,explain:"Black-Scholes assumes single-date exercise without constraints — storage violates all those."},
      {q:"What is STORAGE VALUATION mathematically?",options:["Linear programming", "A constrained stochastic control problem", "Pure deterministic", "Linear regression"],answer:1,explain:"Multiple decisions over time with capacity constraints and uncertainty — classic stochastic control."},
      {q:"What does Bellman BACKWARD INDUCTION do?",options:["Forward simulation", "Starts at maturity (V=0) and works backward, finding optimal policy at each step", "Random search", "Statistical regression only"],answer:1,explain:"Dynamic programming: solve from terminal condition backward, finding optimal action at each step."},
      {q:"What does LSM (Longstaff-Schwartz Monte Carlo) regress?",options:["Forward prices", "Continuation value (future cash flows) on basis functions of current state", "Volatility", "Strike prices"],answer:1,explain:"LSM regresses continuation values on basis functions — compares to immediate exercise to decide."},
      {q:"What's the SCHWARTZ-SMITH two-factor model?",options:["Single mean reversion", "Short-term mean-reverting + long-term equilibrium factor", "Pure GBM", "Constant volatility"],answer:1,explain:"Two factors: rapid mean-reverting moves + slow long-term equilibrium drift."},
      {q:"Why are JUMP PROCESSES essential for power/gas models?",options:["They look fancier", "They capture large discrete moves (spikes) that GBM understates", "They reduce computation", "Required by regulation"],answer:1,explain:"Power and gas have spike behavior (cold snaps, outages) that GBM cannot reproduce."},
      {q:"What's INTRINSIC value in storage?",options:["The total value", "Today's deterministic lock-in of calendar spreads", "Future optionality", "Cushion gas value"],answer:1,explain:"Intrinsic = deterministic spread you can lock in today via calendar trades."},
      {q:"What's EXTRINSIC value in storage?",options:["Cushion gas value", "Optionality value from re-optimizing as curves evolve", "Same as intrinsic", "Tax shield"],answer:1,explain:"Extrinsic = path-dependent option value from the right to re-optimize."},
      {q:"At terminal time T in backward induction, what is V?",options:["Max value", "Zero — storage is worthless after expiry", "Initial price", "Equal to current spread"],answer:1,explain:"V(T, S, I) = 0 — storage has no value after the contract expires."}
    ]},
    {id:"6b",title:"Structured Products",lesson:"Beyond vanilla futures, swaps, and options, structured energy products combine multiple instruments to express specific risk views or hedging needs. Understanding the building blocks lets traders both create and decompose complex deals.\n\nHEAT-RATE CALL OPTION: Pays max(Power − HR × Gas − VOM, 0). It's a spark spread call — the toller's profit when power exceeds fuel cost. Used to hedge or speculate on gas plant economics. Closed-form pricing via Margrabe's formula (zero strike) or Kirk's approximation (non-zero strike).\n\nMARGRABE FORMULA: Prices an option to exchange one GBM asset for another. Closed-form, no volatility of the strike needed — only the volatilities of both assets and their correlation. Used for zero-strike spread options.\n\nKIRK'S APPROXIMATION: Extends to non-zero strike spread options. Critical for spark spreads where you subtract heat-rate-scaled gas plus VOM from power.\n\nSWING OPTIONS: Contract gives buyer the right to vary daily nominations between a minimum and maximum, subject to a total annual quantity. Common in gas where buyers need flexibility. Path-dependent — value depends on actual daily decisions.\n\nTAKE-OR-PAY (ToP): Buyer commits to paying for a Minimum Annual Quantity (MAQ) regardless of whether they take it. Reduces volume risk for the seller.\n\nHDD/CDD SWAPS: Weather derivatives. Heating Degree Days (HDD) measure how cold a day is below 65°F. Cooling Degree Days (CDD) measure how hot. An HDD swap pays HDD × notional vs a strike — used to hedge weather-sensitive gas/power exposure.\n\nLOAD-FOLLOWING DEALS: Seller delivers whatever quantity the buyer's load actually requires, hour by hour. Seller bears all \"shape risk\" — the variation between forecast and actual.\n\nREPLICATION: Complex structured products can be decomposed into portfolios of vanillas (calls, puts, futures) that can be dynamically hedged with liquid instruments. Knowing how to decompose = how to price and hedge.",questions:[
      {q:"What does a HEAT-RATE CALL OPTION pay?",options:["Fixed yield", "max(Power − HR × Gas − VOM, 0) — the spark spread call", "Forward price", "Capacity payment"],answer:1,explain:"Heat-rate call = spark spread call payoff — toller's profit if power > fuel cost."},
      {q:"What does MARGRABE's formula price?",options:["Vanilla calls", "Zero-strike spread options between two GBM assets", "American puts", "Convertible bonds"],answer:1,explain:"Margrabe = closed-form pricing for an option to exchange two GBM assets (zero-strike)."},
      {q:"What does KIRK's APPROXIMATION extend?",options:["Black-Scholes", "Spread option pricing to NON-ZERO strikes (e.g., spark spreads with VOM)", "Bond pricing", "FX options"],answer:1,explain:"Kirk's handles non-zero strikes — essential for real-world spark spread valuation."},
      {q:"What's a SWING OPTION?",options:["A weather derivative", "Buyer can vary daily nominations between min/max subject to annual MAQ", "Pure financial option", "Equity-linked"],answer:1,explain:"Swing = path-dependent option with daily flexibility and total annual constraint."},
      {q:"What's TAKE-OR-PAY (ToP)?",options:["Buyer can refuse", "Buyer pays for MAQ regardless of whether they take it", "Free option", "Standard delivery"],answer:1,explain:"ToP = buyer committed to paying for MAQ; seller gets volume certainty."},
      {q:"What does an HDD swap pay?",options:["Power price spread", "HDD × notional vs strike — hedges heating demand exposure", "Capacity payment", "Pipeline rates"],answer:1,explain:"HDD swap = weather derivative paying based on Heating Degree Days vs a strike."},
      {q:"How is HDD calculated for a day?",options:["Average temperature", "max(65°F − avg temp, 0) — degrees below 65°F", "High temperature", "Wind speed"],answer:1,explain:"HDD = max(65 − avg temp, 0); accumulates degree-days below the heating threshold."},
      {q:"What's LOAD-FOLLOWING risk?",options:["Currency risk", "Shape risk — seller delivers whatever buyer's actual load requires hour-by-hour", "Storage risk", "Counterparty risk"],answer:1,explain:"Load-following = seller takes shape risk (forecast vs actual customer load)."},
      {q:"What's REPLICATION in structured products?",options:["Copying a trade", "Decomposing complex products into portfolios of vanilla instruments for pricing and hedging", "Repeating a contract", "Duplicating positions"],answer:1,explain:"Replication = express the exotic as a portfolio of vanillas → price and hedge with liquid instruments."},
      {q:"Why are spread options harder than vanilla calls?",options:["More expensive", "Payoff depends on two correlated underlyings, not one — requires special pricing models", "No reason", "They're not harder"],answer:1,explain:"Two underlyings + correlation = Margrabe/Kirk needed, not vanilla Black-Scholes."}
    ]},
    {id:"6c",title:"Risk Metrics & Portfolio",lesson:"Energy portfolios carry multidimensional risks: price (multiple commodities, locations, tenors), volumetric, operational, weather, and credit. Quantifying these risks consistently is essential for trading, capital allocation, and regulatory reporting.\n\nVALUE-AT-RISK (VaR): At a given confidence level (typically 95% or 99%) over a horizon (1-day, 10-day), VaR is the loss threshold not exceeded by that probability. \"1-day 95% VaR of $1M\" means we expect the daily loss to exceed $1M only 5% of the time. Calculated via historical simulation, Monte Carlo, or parametric methods.\n\nVaR LIMITATIONS:\n- Not COHERENT (fails subadditivity): VaR(A+B) can be > VaR(A) + VaR(B), so diversification isn't always guaranteed.\n- IGNORES TAIL SHAPE: Two portfolios with same VaR can have very different losses beyond VaR.\n- Backward-looking when using historical data.\n\nCONDITIONAL VaR / EXPECTED SHORTFALL (CVaR/ES): The AVERAGE loss given that loss exceeds VaR. Coherent. Sensitive to tail shape. Increasingly preferred over VaR by regulators (Basel III for banks, FRTB framework).\n\nPOTENTIAL FUTURE EXPOSURE (PFE): Forward-looking measure of counterparty credit risk. The expected maximum exposure to a counterparty at future dates under stress scenarios. Used for setting credit limits and capital reserves.\n\nCREDIT VALUATION ADJUSTMENT (CVA): The market value discount applied to derivatives to reflect counterparty default risk. Higher counterparty risk → larger CVA → lower asset value.\n\nWRONG-WAY RISK: Counterparty exposure rises just as their creditworthiness deteriorates. Particularly dangerous in energy (e.g., a power retailer's credit weakens during the same scarcity that increases your exposure to them). Hard to model but material.\n\nSTRESS TESTING: Beyond statistical metrics, simulate specific extreme scenarios (Storm Uri, Polar Vortex, hurricane Gulf disruption). VaR/CVaR may miss low-probability/high-impact tail events that named stress scenarios capture.\n\nPORTFOLIO HEDGING: Decompose exposures into deltas across price factors. Hedge each delta with appropriate instruments. Re-balance as markets move (dynamic hedging).",questions:[
      {q:"What does '1-day 95% VaR of $1M' mean?",options:["Always loses $1M daily", "Loss exceeds $1M only 5% of days", "Maximum possible loss", "Average loss"],answer:1,explain:"VaR threshold not exceeded with 95% confidence = exceeded ~5% of the time."},
      {q:"What's a KEY VaR limitation?",options:["Always too high", "Not coherent (fails subadditivity) and ignores tail shape beyond the threshold", "Too simple to calculate", "Too expensive"],answer:1,explain:"VaR can fail subadditivity (no guaranteed diversification benefit) and ignores tail beyond VaR."},
      {q:"What does CVaR (Expected Shortfall) measure?",options:["Same as VaR", "Average loss GIVEN loss exceeds VaR — coherent, captures tail shape", "Maximum loss", "Minimum profit"],answer:1,explain:"CVaR/ES = average of losses worse than VaR — coherent and tail-sensitive."},
      {q:"What's PFE?",options:["Past Financial Exposure", "Potential Future Exposure — forward-looking credit risk measure", "Profit and Loss Exposure", "Predictive Forward Estimate"],answer:1,explain:"PFE = expected maximum future exposure to a counterparty; used for credit limits."},
      {q:"What's CVA?",options:["Conditional VaR", "Credit Valuation Adjustment — market value discount for counterparty default risk", "Capacity Value Adjustment", "Carbon Valuation Allowance"],answer:1,explain:"CVA = derivative value haircut reflecting counterparty default risk."},
      {q:"What's WRONG-WAY RISK?",options:["Hedging mistake", "Counterparty exposure rises just as their creditworthiness deteriorates", "Trade execution error", "Currency mismatch"],answer:1,explain:"Wrong-way: exposure correlates positively with counterparty default risk — especially dangerous."},
      {q:"Why is CVaR INCREASINGLY PREFERRED over VaR?",options:["Easier to calculate", "Coherent + sensitive to tail shape + regulator-preferred", "Lower numbers", "Older standard"],answer:1,explain:"CVaR's coherence + tail sensitivity make it superior; regulators (Basel III, FRTB) increasingly use it."},
      {q:"What does STRESS TESTING add beyond VaR/CVaR?",options:["Nothing", "Specific extreme scenarios (e.g., Storm Uri) that may miss low-probability tail events", "Marketing", "Reduced computation"],answer:1,explain:"Named stress scenarios capture specific tail events that statistical metrics may miss."},
      {q:"VaR's failure to satisfy subadditivity means:",options:["Always wrong", "Diversification benefits aren't guaranteed: VaR(A+B) can exceed VaR(A)+VaR(B)", "Impossible to calculate", "Same as CVaR"],answer:1,explain:"Non-subadditive = portfolio VaR can exceed sum of individual VaRs — counter-intuitive."},
      {q:"How is PORTFOLIO HEDGING typically structured?",options:["Hedge each trade separately", "Decompose exposures into deltas across price factors and hedge each delta", "Single global hedge", "Don't hedge"],answer:1,explain:"Decompose into factor deltas → hedge each separately with appropriate instruments → rebalance dynamically."}
    ]},
    {id:"6d",title:"LNG & Cross-Commodity Arbitrage",lesson:"The rise of US LNG exports (Sabine Pass online 2016) physically linked US gas markets to global ones. Henry Hub now trades against the Dutch TTF, Japan-Korea Marker (JKM), and other international benchmarks. Cross-commodity arbitrage between gas, power, oil, and carbon shapes pricing.\n\nUS LNG EXPORT ARBITRAGE (rough breakeven from Gulf Coast to Europe):\n- Buy Henry Hub gas: $X/MMBtu\n- Liquefaction tolling fee: ~$2.50/MMBtu (typical contracts: 115% of HH + tolling)\n- Shipping to Europe: ~$0.50-1.00/MMBtu\n- Regasification + delivery to TTF: ~$0.50/MMBtu\n- Total landed cost in Europe ≈ 1.15 × HH + $3.50-4.00/MMBtu\n\nIf TTF > landed cost, the arb works. When TTF spiked above $50/MMBtu during the 2022 Russia crisis, the arb was extremely profitable.\n\nGLOBAL GAS BENCHMARKS:\n- HENRY HUB (HH) — North American benchmark\n- TTF — Dutch Title Transfer Facility, primary NW European benchmark\n- JKM — Platts Japan-Korea Marker, Northeast Asian LNG spot\n- NBP — UK National Balancing Point\n- AECO — Canadian (Alberta)\n\nOIL-GAS RELATIONSHIP: Pre-shale, oil and gas traded on a rough 6:1 BTU-equivalent parity. Post-shale (2008+), US gas decoupled — gas now reflects its own marginal cost regardless of oil. Ratios of 30:1 or higher are common. Internationally, gas pricing is increasingly hub-based rather than oil-linked.\n\nCARBON-FUEL ARBITRAGE: As carbon prices rise, gas-fired generation increasingly displaces coal. A $10/ton carbon price ≈ $0.40/MMBtu equivalent cost to gas (at ~0.12 tons CO₂ per MMBtu). Carbon prices shift the coal-gas switching threshold dramatically.\n\nUS LNG EXPORT TERMINALS:\n- Sabine Pass (Cheniere) — first online\n- Cameron (Sempra)\n- Corpus Christi (Cheniere)\n- Freeport (Freeport LNG)\n- Calcasieu Pass (Venture Global)\n- Plaquemines, Rio Grande, others in development\n\nUS became the world's LARGEST LNG exporter in 2023.",questions:[
      {q:"What's the approximate breakeven from US Gulf to Europe (LNG arb) at HH = $3?",options:["$3.50/MMBtu", "$5-7/MMBtu landed", "$10/MMBtu", "Always profitable"],answer:1,explain:"1.15 × HH + ~$3.50-4.00 = ~$5-7/MMBtu landed in Europe."},
      {q:"What benchmark covers EUROPEAN gas?",options:["JKM", "TTF (Dutch Title Transfer Facility)", "AECO", "HH"],answer:1,explain:"TTF = primary Northwest European gas benchmark."},
      {q:"What benchmark covers ASIAN LNG SPOT?",options:["TTF", "JKM (Platts Japan-Korea Marker)", "HH", "NBP"],answer:1,explain:"JKM = Northeast Asian LNG spot reference (Platts)."},
      {q:"What was the pre-shale oil-gas BTU-equivalent ratio?",options:["1:1", "6:1", "30:1", "100:1"],answer:1,explain:"Historically gas and oil traded near 6:1 BTU parity; this broke after the shale revolution."},
      {q:"What ratio is common between oil and gas POST-SHALE?",options:["1:1", "6:1", "30:1 or higher", "Identical"],answer:2,explain:"Shale decoupled US gas — ratios of 30:1 or higher (oil far more expensive per BTU) are common."},
      {q:"What's the approximate gas-equivalent cost of $10/ton CO₂ carbon?",options:["$0.04/MMBtu", "$0.40/MMBtu", "$4/MMBtu", "$40/MMBtu"],answer:1,explain:"$10/ton × ~0.12 tons CO₂/MMBtu gas ≈ $1.20 for coal but ~$0.40 for gas equivalent."},
      {q:"What was the FIRST US LNG export terminal online?",options:["Cameron", "Freeport", "Sabine Pass (Cheniere)", "Corpus Christi"],answer:2,explain:"Sabine Pass (Cheniere) was the first US LNG export terminal online in 2016."},
      {q:"In what year did the US become the world's LARGEST LNG exporter?",options:["2016", "2020", "2023", "2030 (still pending)"],answer:2,explain:"US became the world's largest LNG exporter in 2023, surpassing Qatar and Australia."},
      {q:"What did the 2022 Russia crisis do to TTF prices?",options:["Lowered them", "Spiked above $50/MMBtu — making US LNG export arbs extremely profitable", "No effect", "Made them negative"],answer:1,explain:"TTF spiked dramatically (over $50/MMBtu), making US LNG-to-Europe arb extremely lucrative."},
      {q:"What's a typical TOLLING FEE for US LNG liquefaction?",options:["$0.10/MMBtu", "~$2.50/MMBtu", "$10/MMBtu", "No fee"],answer:1,explain:"Typical US LNG offtake: 115% of HH + ~$2.50/MMBtu liquefaction tolling."}
    ]},
    {id:"6e",title:"Structured Power & Gas Deals",lesson:"Beyond standardized exchange-traded futures, energy trading is dominated by bilateral structured deals: customized contracts negotiated between two counterparties to fit specific commercial needs. These deals require deeper modeling, valuation, and operational sophistication than vanilla products.\n\nVANILLA OPTIONS FRAMEWORK: Black-76 prices European options on forwards/futures, the standard for commodity options. The lognormal forward model handles flat volatility surfaces but real markets show smile, skew, and seasonal vol structure that require extended models.\n\nSTRUCTURED PRODUCT TYPES (recap from earlier):\n- Heat-rate-linked options (spark spreads)\n- Swing options (variable daily nominations)\n- Take-or-pay contracts\n- HDD/CDD weather derivatives\n- Load-following supply contracts\n- Tolling agreements\n\nCLEARING vs OTC:\n- Cleared trades (futures, cleared swaps): face the Central CounterParty (CCP, e.g., CME ClearPort, ICE Clear). Initial Margin posted to cover potential future exposure between Variation Margin calls. Variation Margin = daily mark-to-market settlement.\n- OTC bilateral: face the counterparty directly. Credit risk managed via collateral agreements (CSAs under ISDA), letters of credit, parent guarantees.\n\nNOVATION at CCP: A cleared trade replaces the bilateral counterparty with the clearinghouse on both sides. Dramatically reduces bilateral credit risk but concentrates risk at the CCP.\n\nCROSS-GAMMA AND COMPLEX HEDGING: A spark spread book has separate sensitivities to gas, power, and to the correlation between them. Cross-gamma = sensitivity of one asset's delta to the other asset's price. Material for hedging accurately.\n\nPOST-CRISIS REGULATION (Dodd-Frank, EMIR): Most standard derivatives must now be cleared (with exemptions for non-financial hedgers). Initial Margin requirements harmonized across jurisdictions.\n\nDECOMPOSITION FOR HEDGING: Express the exotic as a static portfolio of vanillas plus a dynamic delta-hedging strategy. The challenge is finding tractable decompositions for path-dependent and constraint-bound products like swing options and storage.",questions:[
      {q:"What does BLACK-76 price?",options:["Equity options", "European options on FORWARDS/FUTURES — standard commodity options model", "Bonds", "FX forwards"],answer:1,explain:"Black-76 = the lognormal forward model; the workhorse for commodity option pricing."},
      {q:"What's a CCP in cleared derivatives?",options:["Central Capital Pool", "Central CounterParty — the clearinghouse that both sides face", "Counterparty Credit Provider", "Capacity Clearing Program"],answer:1,explain:"CCP = central clearinghouse; both sides face the CCP instead of each other."},
      {q:"What is NOVATION at a CCP?",options:["A new product", "A cleared trade replaces the bilateral counterparty with the clearinghouse", "Trade renegotiation", "Default management"],answer:1,explain:"Novation = swap original bilateral counterparties for the CCP on both sides — reduces bilateral credit risk."},
      {q:"What's INITIAL MARGIN (IM)?",options:["Trade ticket fee", "Collateral posted to the CCP to cover potential future exposure between VM calls", "Daily settlement", "Trading commission"],answer:1,explain:"IM covers the gap between Variation Margin calls — buffer against default."},
      {q:"What's VARIATION MARGIN (VM)?",options:["A different option", "Daily mark-to-market settlement at the CCP", "Custom contract terms", "Annual reconciliation"],answer:1,explain:"VM = daily P&L settlement through the CCP — keeps cleared books marked to market."},
      {q:"What governs OTC bilateral derivatives credit risk?",options:["No documentation", "ISDA Master Agreement + CSA (Credit Support Annex) for collateral", "Federal law only", "No collateral"],answer:1,explain:"ISDA + CSA = the standard framework for OTC bilateral credit risk management."},
      {q:"What's CROSS-GAMMA in a spark-spread book?",options:["Not relevant", "Sensitivity of one asset's delta to the OTHER asset's price", "Pure delta only", "Same as vega"],answer:1,explain:"Cross-gamma matters because power and gas moves interact in a spread book."},
      {q:"What did Dodd-Frank (post-2010 US) require for most standard derivatives?",options:["Eliminated derivatives", "CLEARING through a CCP (with exemptions for non-financial hedgers)", "Pre-trade approval", "All on-exchange"],answer:1,explain:"Dodd-Frank mandated clearing of standardized swaps to reduce systemic risk."},
      {q:"What's the European equivalent of Dodd-Frank?",options:["Basel III", "EMIR (European Market Infrastructure Regulation)", "MiFID II only", "Solvency II"],answer:1,explain:"EMIR is the EU's regulation requiring clearing and reporting of derivatives."},
      {q:"What's REPLICATION/DECOMPOSITION for structured products?",options:["Copying a competitor", "Express the exotic as a static portfolio of vanillas + dynamic delta hedging", "Doubling positions", "Two-sided quotes"],answer:1,explain:"Decomposition = portfolio of liquid vanilla instruments + dynamic hedging strategy."},
      {q:"Why is Black-76 inadequate for real commodity markets?",options:["It's banned", "Real surfaces show smile, skew, and seasonal structure that need extended models", "It's too new", "No reason"],answer:1,explain:"Real vol surfaces aren't flat — smile, skew, and seasonality require more sophisticated models."}
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

// ════════════════════════════════════════════════════════════════════════════
// ERROR BOUNDARY (B4) — catches any uncaught React error and shows a recovery UI
// instead of a blank white screen. Also reports to Sentry if configured.
// ════════════════════════════════════════════════════════════════════════════
class ErrorBoundary extends React.Component {
  constructor(props){
    super(props);
    this.state={hasError:false,error:null,errorInfo:null};
  }
  static getDerivedStateFromError(error){
    return{hasError:true,error};
  }
  componentDidCatch(error,errorInfo){
    // Log locally
    console.error("ErrorBoundary caught:",error,errorInfo);
    this.setState({errorInfo});
    // Forward to Sentry if installed (B5). Safe no-op if Sentry isn't loaded.
    try{
      if(typeof window!=="undefined"&&window.Sentry&&window.Sentry.captureException){
        window.Sentry.captureException(error,{contexts:{react:{componentStack:errorInfo?.componentStack}}});
      }
    }catch(_){}
    // Best-effort: log to Supabase bug_reports table so admins see crashes
    // (only if a user is signed in — supabase client will silently no-op otherwise)
    try{
      const u=supabase.auth.getUser();
      if(u&&u.then){
        u.then(({data})=>{
          if(data?.user){
            supabase.from("bug_reports").insert({
              user_id:data.user.id,
              user_email:data.user.email||"unknown",
              page:"crash",
              browser:(navigator.userAgent||"").slice(0,300),
              category:"crashed",
              description:`AUTO-CAPTURED CRASH:\n\n${error?.message||"unknown error"}\n\nStack:\n${(error?.stack||"").slice(0,800)}\n\nComponent stack:\n${(errorInfo?.componentStack||"").slice(0,500)}`,
              status:"new",
            }).then(()=>{}).catch(()=>{});
          }
        }).catch(()=>{});
      }
    }catch(_){}
  }
  reset=()=>{
    this.setState({hasError:false,error:null,errorInfo:null});
  };
  reload=()=>{
    window.location.reload();
  };
  render(){
    if(this.state.hasError){
      return(
        <div className="min-h-screen bg-black text-zinc-100 flex items-center justify-center px-4">
          <div className="max-w-lg w-full">
            <div className="text-center mb-6">
              <div className="font-mono text-rose-400 text-2xl mb-2">⚠ Something went wrong</div>
              <div className="font-mono text-zinc-400 text-sm leading-relaxed">
                The app hit an unexpected error. Your progress is saved on our servers and won&apos;t be lost.
              </div>
            </div>
            <div className="border border-rose-700 bg-zinc-950 p-4 mb-4">
              <div className="font-mono text-[10px] text-rose-400 uppercase tracking-wider mb-2">Error</div>
              <div className="font-mono text-xs text-zinc-300 break-words">{this.state.error?.message||"Unknown error"}</div>
            </div>
            <div className="flex gap-2 justify-center">
              <button onClick={this.reload} className="bg-lime-400 hover:bg-lime-300 text-black font-mono font-bold uppercase tracking-wider text-sm px-5 py-2.5 transition-colors">▸ Reload the app</button>
              <button onClick={this.reset} className="border border-zinc-700 hover:border-zinc-500 text-zinc-300 font-mono text-sm uppercase tracking-wider px-4 py-2.5 transition-colors">Try again</button>
            </div>
            <div className="text-center mt-4 font-mono text-[10px] text-zinc-600">
              This error has been logged. We&apos;ll look into it.
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

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

// SIGNUP
// SIGNUP PAGE — self-service account creation, restricted to @engie.com
function SignUpPage({onBack,onSuccess}){
  const [email,setEmail]=useState("");
  const [fullName,setFullName]=useState("");
  const [password,setPassword]=useState("");
  const [showPwd,setShowPwd]=useState(false);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [done,setDone]=useState(false);

  // Client-side check (defense in depth — Supabase Auth can also enforce domain rules)
  const emailLooksValid=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isEngieEmail=/^[^\s@]+@engie\.com$/i.test(email.trim());

  const submit=async()=>{
    setError("");
    const trimmedEmail=email.trim().toLowerCase();
    const cleanName=fullName.trim();
    if(!emailLooksValid){setError("Please enter a valid email address.");return;}
    if(!cleanName){setError("Please enter your full name.");return;}
    if(cleanName.length<2){setError("Name is too short.");return;}
    if(cleanName.length>100){setError("Name must be 100 characters or less.");return;}
    if(!password||password.length<8){setError("Password must be at least 8 characters.");return;}
    setLoading(true);
    try{
      const{data,error:e}=await supabase.auth.signUp({
        email:trimmedEmail,
        password,
        options:{
          data:{full_name:cleanName},
          emailRedirectTo:window.location.origin+"/",
        },
      });
      setLoading(false);
      if(e){
        if(e.message?.toLowerCase().includes("already")||e.message?.toLowerCase().includes("registered")){
          setError("An account with this email already exists. Try logging in instead.");
        }else{
          setError(e.message||"Could not create account. Please try again.");
        }
        return;
      }
      // Supabase may or may not require email confirmation depending on project settings.
      // Either way, show a success message and let the user proceed.
      setDone(true);
    }catch(err){
      setLoading(false);
      setError("Network error. Please try again.");
    }
  };

  return(
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3"><Zap size={20} className="text-lime-400"/><Flame size={20} className="text-amber-400"/></div>
          <div className="font-mono text-lg tracking-wider text-zinc-100">NGPX//ACADEMY</div>
          <div className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest mt-1">Create your account</div>
        </div>
        <Panel accent="lime" title="CREATE ACCOUNT">
          {done?(
            <div className="space-y-3 font-mono text-center py-4">
              <div className="text-lime-400 text-base">✓ Account created!</div>
              <div className="border border-amber-700 bg-amber-950/20 px-3 py-3 mt-2 text-left">
                <div className="text-amber-300 text-xs leading-relaxed mb-1.5">
                  <span className="font-bold">▸ Check your email now</span>
                </div>
                <div className="text-amber-100 text-[11px] leading-relaxed">
                  We sent a confirmation link to your inbox. You won&apos;t be able to log in until you click it.
                </div>
                <div className="text-zinc-500 text-[10px] leading-relaxed mt-2">
                  Don&apos;t see it? Check your spam or junk folder.
                </div>
              </div>
              <div className="pt-2">
                <Btn onClick={onSuccess} variant="primary" className="w-full justify-center">▸ DONE — I&apos;LL CHECK MY EMAIL</Btn>
              </div>
            </div>
          ):(
            <div className="space-y-3 font-mono">
              <div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Engie Email</div>
                <input autoFocus type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} className={`w-full bg-zinc-900 border text-zinc-100 px-3 py-2 text-xs font-mono focus:outline-none ${email&&!emailLooksValid?"border-rose-700 focus:border-rose-500":"border-zinc-700 focus:border-lime-500"}`} placeholder="your email address"/>
                {email&&isEngieEmail&&<div className="text-lime-500 text-[10px] mt-1">✓ Engie email recognized</div>}
                {email&&emailLooksValid&&!isEngieEmail&&<div className="text-amber-400 text-[10px] mt-1">Note: only authorized emails are accepted. If you don&apos;t have an @engie.com email yet, make sure your admin has whitelisted yours.</div>}
                {email&&!emailLooksValid&&<div className="text-rose-400 text-[10px] mt-1">Please enter a valid email address.</div>}
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Full Name</div>
                <input autoComplete="name" value={fullName} onChange={e=>setFullName(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 px-3 py-2 text-xs font-mono focus:border-lime-500 outline-none" placeholder="Firstname Lastname"/>
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Password (min. 8 chars)</div>
                <div className="relative">
                  <input type={showPwd?"text":"password"} autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 px-3 py-2 pr-12 text-xs font-mono focus:border-lime-500 outline-none" placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&submit()}/>
                  <button type="button" onClick={()=>setShowPwd(!showPwd)} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-lime-400 font-mono text-[10px] uppercase tracking-wider px-1.5 py-1">{showPwd?"hide":"show"}</button>
                </div>
              </div>
              {error&&<div className="text-rose-400 text-xs">{error}</div>}
              <Btn onClick={submit} variant="primary" disabled={loading} className="w-full justify-center">{loading?"CREATING...":"▸ CREATE ACCOUNT"}</Btn>
              <div className="border-t border-zinc-800 pt-3 text-center">
                <div className="text-[10px] text-zinc-500 mb-1">Already have an account?</div>
                <button onClick={onSuccess} className="font-mono text-[10px] text-lime-400 hover:text-lime-300 uppercase tracking-wider">▸ Log in</button>
              </div>
            </div>
          )}
        </Panel>
        <div className="text-center mt-4">
          <button onClick={onBack} className="font-mono text-[10px] text-zinc-600 hover:text-zinc-400 uppercase tracking-wider flex items-center gap-1 mx-auto">
            <ArrowLeft size={10}/> Back to home
          </button>
        </div>
        <div className="text-center mt-3 font-mono text-[10px] text-zinc-700">For ENGIE employees and authorized guests</div>
      </div>
    </div>
  );
}

// LANDING
function LandingPage({onLogin,onSignUp}){
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
        <div className="text-center mb-12">
          <div className="font-mono text-xs text-lime-400 uppercase tracking-[0.3em] mb-4">US Power & Natural Gas</div>
          <h1 className="font-mono text-4xl font-bold text-zinc-100 mb-4">NGPX//ACADEMY</h1>
          <p className="font-mono text-zinc-400 text-sm max-w-xl mx-auto leading-relaxed mb-6">Professional training curriculum for energy traders, analysts, and practitioners — from fundamentals through graduate-level quant methods.</p>
          <div className="flex flex-col items-center gap-2">
            <Btn onClick={onLogin} variant="primary" className="text-sm px-8 py-3">▸ LOGIN TO BEGIN</Btn>
            <button onClick={onSignUp} className="font-mono text-[10px] text-lime-400 hover:text-lime-300 uppercase tracking-wider mt-1">▸ Or create an account</button>
            <div className="text-[10px] text-zinc-600 font-mono uppercase tracking-wider mt-1">For ENGIE employees and authorized guests</div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[["35","Modules"],["340+","Questions"],["11","Topic Areas"],["6","Difficulty Tiers"]].map(([n,l])=>(
            <div key={l} className="border border-zinc-800 bg-zinc-950/60 p-4 text-center font-mono"><div className="text-2xl font-bold text-lime-400">{n}</div><div className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">{l}</div></div>
          ))}
        </div>
        <div className="text-center mb-12 font-mono text-[10px] text-zinc-500 leading-relaxed">
          ▸ Educational platform · No ENGIE business or trading data is stored or referenced
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
          <div className="text-zinc-400 text-sm mb-2">For ENGIE employees and authorized guests.</div>
          <div className="text-zinc-500 text-xs mb-6">Already have an account? Log in to resume your progress.</div>
          <div className="flex flex-col items-center gap-2">
            <Btn onClick={onLogin} variant="primary" className="text-sm px-6 py-2">▸ LOGIN TO YOUR ACCOUNT</Btn>
            <button onClick={onSignUp} className="font-mono text-[10px] text-lime-400 hover:text-lime-300 uppercase tracking-wider mt-1">▸ Or create an account</button>
          </div>
        </div>
      </main>
      <footer className="border-t border-zinc-900 px-6 py-4 font-mono text-xs text-zinc-600 text-center space-y-1"><div>NGPX//ACADEMY · ENGIE EEMNA · Educational only · Not financial advice</div><div className="text-zinc-700 text-[10px]">No ENGIE business or trading data is stored or referenced.</div></footer>
    </div>
  );
}

// LOGIN
function LoginPage({onBack,onSuccess,onSignUp}){
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [showPwd,setShowPwd]=useState(false);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [showReset,setShowReset]=useState(false);
  const [resetSent,setResetSent]=useState(false);
  // U2: detect unconfirmed-email error and offer to resend
  const [needsConfirm,setNeedsConfirm]=useState(false);
  const [resending,setResending]=useState(false);
  const [resendSent,setResendSent]=useState(false);

  const resendConfirmation=async()=>{
    if(!email){return;}
    setResending(true);
    try{
      const{error:e}=await supabase.auth.resend({type:"signup",email:email.trim().toLowerCase()});
      setResending(false);
      if(e){setError(e.message||"Could not resend. Try again.");return;}
      setResendSent(true);
    }catch(err){
      setResending(false);
      setError("Network error while resending.");
    }
  };

  const login=async()=>{
    if(!email||!password){setError("Email and password required.");return;}
    setLoading(true);setError("");setNeedsConfirm(false);setResendSent(false);
    const{error:e}=await supabase.auth.signInWithPassword({email:email.trim().toLowerCase(),password});
    setLoading(false);
    if(e){
      const m=(e.message||"").toLowerCase();
      // U2: detect unconfirmed-email case
      if(m.includes("not confirmed")||m.includes("confirm your email")||m.includes("email not verified")){
        setNeedsConfirm(true);
        setError("Your email isn't confirmed yet. Click the link in your confirmation email, or resend it below.");
      }else if(m.includes("invalid login")){
        setError("Email or password is incorrect.");
      }else{
        setError(e.message);
      }
    }else{
      onSuccess();
    }
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
              <div><div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Email</div><input autoFocus type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 px-3 py-2 text-xs font-mono focus:border-lime-500 outline-none" placeholder="your@email.com" onKeyDown={e=>e.key==="Enter"&&login()}/></div>
              <div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Password</div>
                <div className="relative">
                  <input type={showPwd?"text":"password"} autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 px-3 py-2 pr-10 text-xs font-mono focus:border-lime-500 outline-none" placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&login()}/>
                  <button type="button" onClick={()=>setShowPwd(!showPwd)} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-lime-400 font-mono text-[10px] uppercase tracking-wider px-1.5 py-1" aria-label={showPwd?"Hide password":"Show password"}>{showPwd?"hide":"show"}</button>
                </div>
              </div>
              {error&&<div className="text-rose-400 text-xs">{error}</div>}
              {needsConfirm&&(
                <div className="border border-amber-700 bg-amber-950/20 px-3 py-2 text-xs space-y-2">
                  {resendSent?(
                    <div className="text-lime-400 text-xs">✓ Confirmation email resent — check your inbox.</div>
                  ):(
                    <button onClick={resendConfirmation} disabled={resending} className="font-mono text-[11px] text-amber-300 hover:text-amber-200 uppercase tracking-wider underline">
                      {resending?"SENDING...":"▸ Resend confirmation email"}
                    </button>
                  )}
                </div>
              )}
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
        <div className="text-center mt-3 font-mono text-[10px] text-zinc-500">No account yet? <button onClick={onSignUp} className="text-lime-400 hover:text-lime-300 uppercase tracking-wider">▸ Sign up</button></div>
      </div>
    </div>
  );
}

// ADMIN DASHBOARD
function AdminDashboard({user,onSignOut,onViewAsStudent,onGoHome}){
  const [users,setUsers]=useState([]);
  const [loading,setLoading]=useState(true);
  const [showScoringGuide,setShowScoringGuide]=useState(false);
  const [selected,setSelected]=useState(null);
  // Disputes panel state
  const [showDisputes,setShowDisputes]=useState(false);
  const [disputes,setDisputes]=useState([]);
  const [disputesLoading,setDisputesLoading]=useState(false);
  const [disputeFilter,setDisputeFilter]=useState("open");
  const [expandedDispute,setExpandedDispute]=useState(null);

  // Bug reports panel state
  const [showBugs,setShowBugs]=useState(false);
  const [bugs,setBugs]=useState([]);
  const [bugsLoading,setBugsLoading]=useState(false);
  const [bugFilter,setBugFilter]=useState("new");
  const [expandedBug,setExpandedBug]=useState(null);

  const loadDisputes=async()=>{
    setDisputesLoading(true);
    const{data,error}=await supabase.from("question_disputes").select("*").order("created_at",{ascending:false});
    if(!error&&data)setDisputes(data);
    setDisputesLoading(false);
  };

  const updateDisputeStatus=async(id,newStatus)=>{
    const{error}=await supabase.from("question_disputes").update({status:newStatus,updated_at:new Date().toISOString()}).eq("id",id);
    if(!error){
      setDisputes(prev=>prev.map(d=>d.id===id?{...d,status:newStatus}:d));
    }else{
      alert("Failed to update: "+(error.message||"unknown error"));
    }
  };

  const loadBugs=async()=>{
    setBugsLoading(true);
    const{data,error}=await supabase.from("bug_reports").select("*").order("created_at",{ascending:false});
    if(!error&&data)setBugs(data);
    setBugsLoading(false);
  };

  const updateBugStatus=async(id,newStatus)=>{
    const{error}=await supabase.from("bug_reports").update({status:newStatus,updated_at:new Date().toISOString()}).eq("id",id);
    if(!error){
      setBugs(prev=>prev.map(b=>b.id===id?{...b,status:newStatus}:b));
    }else{
      alert("Failed to update: "+(error.message||"unknown error"));
    }
  };

  // Load disputes when panel is first opened
  useEffect(()=>{
    if(showDisputes&&disputes.length===0&&!disputesLoading)loadDisputes();
  },[showDisputes]);

  // Load bugs when panel is first opened
  useEffect(()=>{
    if(showBugs&&bugs.length===0&&!bugsLoading)loadBugs();
  },[showBugs]);

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
        <div className="border border-zinc-800 bg-zinc-950/60">
          <button onClick={()=>setShowScoringGuide(!showScoringGuide)} className="w-full px-4 py-3 flex justify-between items-center hover:bg-zinc-900/50 font-mono">
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 text-[10px] uppercase tracking-[0.15em] font-bold">ℹ️ How scoring works</span>
              <span className="text-zinc-600 text-[10px]">— calculation logic reference</span>
            </div>
            <span className="text-zinc-500 text-xs">{showScoringGuide?"▴":"▾"}</span>
          </button>
          {showScoringGuide&&(
            <div className="px-4 pb-4 pt-2 font-mono text-xs space-y-4 border-t border-zinc-800">
              
              <div>
                <div className="text-cyan-400 text-[10px] uppercase tracking-wider font-bold mb-2">1. PLACEMENT TEST (44 QUESTIONS)</div>
                <div className="text-zinc-400 leading-relaxed space-y-1.5">
                  <div><span className="text-zinc-300">Pool:</span> 44 questions, 4 per topic across 11 topics, covering all 6 levels.</div>
                  <div><span className="text-zinc-300">Level placement rule:</span> User is placed at the <span className="text-amber-400">highest level (L1-L6) where they scored ≥50% on that level's questions</span>.</div>
                  <div className="text-zinc-500 text-[11px] border-l-2 border-zinc-700 pl-2 mt-1">Example: a user scoring 98% overall (43/44) can still be placed at L5 if they missed 3+ of the 4 L6 questions. The L6 questions cover quant topics (Margrabe, Black-76, CVaR) that practical traders may not know.</div>
                  <div><span className="text-zinc-300">Score % displayed:</span> raw correct / 44 (overall percentage).</div>
                </div>
              </div>

              <div>
                <div className="text-cyan-400 text-[10px] uppercase tracking-wider font-bold mb-2">2. MODULE QUIZZES (5 QUESTIONS PER ATTEMPT)</div>
                <div className="text-zinc-400 leading-relaxed space-y-1.5">
                  <div><span className="text-zinc-300">Pool:</span> Each module has 9-13 questions. App samples 5 deterministically per user (seeded by userId + moduleId).</div>
                  <div><span className="text-zinc-300">Sampling:</span> Same user + same module = same 5 questions every time (prevents shopping for easier sets).</div>
                  <div><span className="text-zinc-300">Pass threshold:</span> ≥70% — with 5 questions, that's 4/5 correct.</div>
                  <div><span className="text-zinc-300">Score storage:</span> Best score is kept. A failed retry never downgrades a previous pass.</div>
                </div>
              </div>

              <div>
                <div className="text-cyan-400 text-[10px] uppercase tracking-wider font-bold mb-2">3. TIER UNLOCK</div>
                <div className="text-zinc-400 leading-relaxed">
                  To unlock the next tier (e.g. L4 from L3): pass <span className="text-amber-400">all modules in current tier at ≥70%</span>. Unlock banner shows the count and names modules needing retry.
                </div>
              </div>

              <div>
                <div className="text-cyan-400 text-[10px] uppercase tracking-wider font-bold mb-2">4. TRIVIA MODE (15 QUESTIONS · 15S EACH)</div>
                <div className="text-zinc-400 leading-relaxed space-y-1.5">
                  <div>Score per correct answer:</div>
                  <div className="pl-3 space-y-0.5">
                    <div>• <span className="text-lime-400">+100</span> base points</div>
                    <div>• <span className="text-amber-400">+10 per second</span> remaining on the timer</div>
                    <div>• <span className="text-fuchsia-400">+25 × streak</span> (consecutive correct answers)</div>
                  </div>
                  <div className="text-zinc-500 text-[11px] border-l-2 border-zinc-700 pl-2 mt-1">Example: 4th correct in a row with 6s left = 100 + 60 + 75 = +235 points</div>
                  <div>Wrong answer or timeout resets streak to 0. High score only updates if beaten.</div>
                </div>
              </div>

              <div>
                <div className="text-cyan-400 text-[10px] uppercase tracking-wider font-bold mb-2">5. DASHBOARD STATS</div>
                <div className="text-zinc-400 leading-relaxed space-y-1">
                  <div><span className="text-zinc-300">Level:</span> from placement test, or auto-increments when all current tier modules are passed at 70%+</div>
                  <div><span className="text-zinc-300">Progress X/35:</span> count of modules where stored score is ≥70%</div>
                  <div><span className="text-zinc-300">Accuracy:</span> total questions correct ÷ total questions answered (across all attempts)</div>
                  <div><span className="text-zinc-300">Time spent:</span> accumulated seconds across all sessions, updated every 30 seconds</div>
                  <div><span className="text-zinc-300">Trivia high:</span> best trivia game score achieved by the user</div>
                </div>
              </div>

            </div>
          )}
        </div>
        {/* DISPUTED QUESTIONS PANEL */}
        <div className={`border ${showDisputes?"border-rose-700":"border-rose-900"} bg-rose-950/10`}>
          <button onClick={()=>setShowDisputes(!showDisputes)} className="w-full px-4 py-3 flex justify-between items-center hover:bg-rose-950/20 font-mono">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-rose-400 text-[10px] uppercase tracking-[0.15em] font-bold">🚩 Disputed Questions</span>
              {disputes.filter(d=>d.status==="open").length>0&&(
                <span className="bg-rose-950 border border-rose-700 text-rose-300 text-[9px] px-1.5 py-0.5 uppercase tracking-wider">{disputes.filter(d=>d.status==="open").length} OPEN</span>
              )}
              <span className="text-zinc-600 text-[10px]">— user-reported issues</span>
            </div>
            <span className="text-rose-500 text-xs">{showDisputes?"▴":"▾"}</span>
          </button>
          {showDisputes&&(
            <div className="px-4 pb-4 pt-2 border-t border-rose-900">
              {disputesLoading?(
                <div className="text-zinc-500 text-xs font-mono py-3">Loading disputes...</div>
              ):disputes.length===0?(
                <div className="text-zinc-500 text-xs font-mono py-3">No disputes yet.</div>
              ):(
                <>
                  {/* Filter buttons */}
                  <div className="flex gap-1.5 flex-wrap pb-3 mb-3 border-b border-zinc-900">
                    {[
                      {id:"all",label:`All (${disputes.length})`},
                      {id:"open",label:`Open (${disputes.filter(d=>d.status==="open").length})`},
                      {id:"reviewed",label:`Reviewed (${disputes.filter(d=>d.status==="reviewed").length})`},
                      {id:"fixed",label:`Fixed (${disputes.filter(d=>d.status==="fixed").length})`},
                      {id:"invalid",label:`Invalid (${disputes.filter(d=>d.status==="invalid").length})`},
                    ].map(f=>(
                      <button
                        key={f.id}
                        onClick={()=>setDisputeFilter(f.id)}
                        className={`px-2 py-1 border text-[10px] uppercase tracking-wider font-mono transition-colors ${
                          disputeFilter===f.id
                            ?"border-rose-600 bg-rose-950/30 text-rose-300"
                            :"border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500"
                        }`}
                      >{f.label}</button>
                    ))}
                    <button
                      onClick={loadDisputes}
                      className="ml-auto px-2 py-1 border border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500 text-[10px] uppercase tracking-wider font-mono"
                    >↻ Refresh</button>
                  </div>

                  {/* Dispute rows */}
                  <div className="font-mono text-xs">
                    {disputes.filter(d=>disputeFilter==="all"||d.status===disputeFilter).map(d=>{
                      const isExpanded=expandedDispute===d.id;
                      const statusColors={
                        open:"border-rose-700 bg-rose-950/30 text-rose-300",
                        reviewed:"border-amber-700 bg-amber-950/20 text-amber-300",
                        fixed:"border-lime-700 bg-lime-950/20 text-lime-300",
                        invalid:"border-zinc-700 bg-zinc-900 text-zinc-400",
                      };
                      const categoryLabels={
                        wrong_answer:"Wrong answer",
                        ambiguous:"Ambiguous wording",
                        outdated:"Outdated info",
                        typo:"Typo",
                        other:"Other",
                      };
                      return(
                        <div key={d.id} className={`border-b border-zinc-900 ${d.status!=="open"&&!isExpanded?"opacity-60":""}`}>
                          <div
                            onClick={()=>setExpandedDispute(isExpanded?null:d.id)}
                            className="grid grid-cols-12 gap-2 px-2 py-2 hover:bg-zinc-900/50 cursor-pointer"
                          >
                            <div className="col-span-1 text-amber-400 font-bold">{d.module_id||"PL"}</div>
                            <div className="col-span-7">
                              <div className="text-zinc-100 truncate">{d.question_text}</div>
                              <div className="text-zinc-500 text-[10px] italic truncate mt-0.5">"{d.reason}"</div>
                              <div className="text-zinc-600 text-[9px] mt-0.5">{d.user_email} · {new Date(d.created_at).toLocaleString()}</div>
                            </div>
                            <div className="col-span-2 text-rose-300 text-[10px] flex items-center">{d.category?categoryLabels[d.category]||d.category:"—"}</div>
                            <div className="col-span-2 flex items-center">
                              <span className={`px-1.5 py-0.5 border text-[9px] uppercase tracking-wider ${statusColors[d.status]||statusColors.open}`}>{d.status}</span>
                            </div>
                          </div>

                          {isExpanded&&(
                            <div className="bg-black p-3 border-t border-zinc-900 space-y-3">
                              {/* Full question detail */}
                              <div className="bg-zinc-950 border border-zinc-900 p-3">
                                <div className="text-zinc-600 text-[9px] uppercase tracking-wider mb-1">
                                  {d.context==="placement"?"Placement test":`Module ${d.module_id}`} · Dispute #{d.id}
                                </div>
                                <div className="text-zinc-100 text-xs font-bold mb-2">{d.question_text}</div>
                                <div className="space-y-0.5 text-[10px]">
                                  {(d.question_options||[]).map((opt,i)=>{
                                    const isUserAns=opt===d.user_answer_text;
                                    const isCorrect=opt===d.correct_answer_text;
                                    return(
                                      <div key={i} className={isCorrect?"text-lime-400":isUserAns?"text-rose-400":"text-zinc-500"}>
                                        [{String.fromCharCode(65+i)}] {opt}
                                        {isUserAns&&<span className="text-zinc-600 ml-2">← user picked</span>}
                                        {isCorrect&&<span className="text-zinc-600 ml-2">← marked correct</span>}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* User reason */}
                              <div className="bg-zinc-950 border border-zinc-900 p-3">
                                <div className="text-zinc-600 text-[9px] uppercase tracking-wider mb-1">User's reason · {categoryLabels[d.category]||"No category"}</div>
                                <div className="text-zinc-300 text-xs italic leading-relaxed">"{d.reason}"</div>
                              </div>

                              {/* Status actions */}
                              <div className="border-t border-zinc-900 pt-3">
                                <div className="text-zinc-400 text-[10px] uppercase tracking-wider mb-2">Update status</div>
                                <div className="flex gap-1.5 flex-wrap">
                                  <button
                                    onClick={(e)=>{e.stopPropagation();updateDisputeStatus(d.id,"reviewed");}}
                                    disabled={d.status==="reviewed"}
                                    className={`px-2 py-1 border text-[10px] uppercase tracking-wider font-mono ${d.status==="reviewed"?"opacity-30 cursor-not-allowed border-zinc-700 text-zinc-500":"border-amber-700 bg-amber-950/20 text-amber-300 hover:bg-amber-950/40"}`}
                                  >Mark Reviewed</button>
                                  <button
                                    onClick={(e)=>{e.stopPropagation();updateDisputeStatus(d.id,"fixed");}}
                                    disabled={d.status==="fixed"}
                                    className={`px-2 py-1 border text-[10px] uppercase tracking-wider font-mono ${d.status==="fixed"?"opacity-30 cursor-not-allowed border-zinc-700 text-zinc-500":"border-lime-700 bg-lime-950/20 text-lime-300 hover:bg-lime-950/40"}`}
                                  >Mark Fixed (valid)</button>
                                  <button
                                    onClick={(e)=>{e.stopPropagation();updateDisputeStatus(d.id,"invalid");}}
                                    disabled={d.status==="invalid"}
                                    className={`px-2 py-1 border text-[10px] uppercase tracking-wider font-mono ${d.status==="invalid"?"opacity-30 cursor-not-allowed border-zinc-700 text-zinc-500":"border-zinc-700 bg-zinc-900 text-zinc-400 hover:bg-zinc-800"}`}
                                  >Mark Invalid (no change)</button>
                                  <button
                                    onClick={(e)=>{e.stopPropagation();updateDisputeStatus(d.id,"open");}}
                                    disabled={d.status==="open"}
                                    className={`px-2 py-1 border text-[10px] uppercase tracking-wider font-mono ${d.status==="open"?"opacity-30 cursor-not-allowed border-zinc-700 text-zinc-500":"border-rose-700 bg-rose-950/20 text-rose-300 hover:bg-rose-950/40"}`}
                                  >Reopen</button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {disputes.filter(d=>disputeFilter==="all"||d.status===disputeFilter).length===0&&(
                      <div className="text-zinc-500 text-xs font-mono py-3 text-center">No disputes in this filter.</div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        {/* BUG REPORTS PANEL */}
        <div className={`border ${showBugs?"border-amber-700":"border-amber-900"} bg-amber-950/10`}>
          <button onClick={()=>setShowBugs(!showBugs)} className="w-full px-4 py-3 flex justify-between items-center hover:bg-amber-950/20 font-mono">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-amber-400 text-[10px] uppercase tracking-[0.15em] font-bold">🐛 Bug Reports</span>
              {bugs.filter(b=>b.status==="new").length>0&&(
                <span className="bg-amber-950 border border-amber-700 text-amber-300 text-[9px] px-1.5 py-0.5 uppercase tracking-wider">{bugs.filter(b=>b.status==="new").length} NEW</span>
              )}
              <span className="text-zinc-600 text-[10px]">— user-reported issues</span>
            </div>
            <span className="text-amber-500 text-xs">{showBugs?"▴":"▾"}</span>
          </button>
          {showBugs&&(
            <div className="px-4 pb-4 pt-2 border-t border-amber-900">
              {bugsLoading?(
                <div className="text-zinc-500 text-xs font-mono py-3">Loading bug reports...</div>
              ):bugs.length===0?(
                <div className="text-zinc-500 text-xs font-mono py-3">No bug reports yet.</div>
              ):(
                <>
                  <div className="flex gap-1.5 flex-wrap pb-3 mb-3 border-b border-zinc-900">
                    {[
                      {id:"all",label:`All (${bugs.length})`},
                      {id:"new",label:`New (${bugs.filter(b=>b.status==="new").length})`},
                      {id:"in_progress",label:`In progress (${bugs.filter(b=>b.status==="in_progress").length})`},
                      {id:"fixed",label:`Fixed (${bugs.filter(b=>b.status==="fixed").length})`},
                      {id:"wont_fix",label:`Won't fix (${bugs.filter(b=>b.status==="wont_fix").length})`},
                    ].map(f=>(
                      <button
                        key={f.id}
                        onClick={()=>setBugFilter(f.id)}
                        className={`px-2 py-1 border text-[10px] uppercase tracking-wider font-mono transition-colors ${
                          bugFilter===f.id
                            ?"border-amber-600 bg-amber-950/30 text-amber-300"
                            :"border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500"
                        }`}
                      >{f.label}</button>
                    ))}
                    <button
                      onClick={loadBugs}
                      className="ml-auto px-2 py-1 border border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500 text-[10px] uppercase tracking-wider font-mono"
                    >↻ Refresh</button>
                  </div>

                  <div className="font-mono text-xs">
                    {bugs.filter(b=>bugFilter==="all"||b.status===bugFilter).map(b=>{
                      const isExpanded=expandedBug===b.id;
                      const statusColors={
                        new:"border-amber-700 bg-amber-950/30 text-amber-300",
                        in_progress:"border-cyan-700 bg-cyan-950/20 text-cyan-300",
                        fixed:"border-lime-700 bg-lime-950/20 text-lime-300",
                        wont_fix:"border-zinc-700 bg-zinc-900 text-zinc-400",
                      };
                      const categoryLabels={
                        ui_broken:"UI broken",
                        crashed:"Crashed",
                        login_issue:"Login issue",
                        slow:"Slow",
                        other:"Other",
                      };
                      return(
                        <div key={b.id} className={`border-b border-zinc-900 ${b.status!=="new"&&!isExpanded?"opacity-60":""}`}>
                          <div
                            onClick={()=>setExpandedBug(isExpanded?null:b.id)}
                            className="grid grid-cols-12 gap-2 px-2 py-2 hover:bg-zinc-900/50 cursor-pointer"
                          >
                            <div className="col-span-2 text-cyan-400 text-[10px] truncate">{b.page||"?"}</div>
                            <div className="col-span-6">
                              <div className="text-zinc-100 truncate">{b.description}</div>
                              <div className="text-zinc-600 text-[9px] mt-0.5">{b.user_email} · {new Date(b.created_at).toLocaleString()}</div>
                            </div>
                            <div className="col-span-2 text-amber-300 text-[10px] flex items-center">{b.category?categoryLabels[b.category]||b.category:"—"}</div>
                            <div className="col-span-2 flex items-center">
                              <span className={`px-1.5 py-0.5 border text-[9px] uppercase tracking-wider ${statusColors[b.status]||statusColors.new}`}>{b.status==="in_progress"?"In progress":b.status==="wont_fix"?"Won't fix":b.status}</span>
                            </div>
                          </div>

                          {isExpanded&&(
                            <div className="bg-black p-3 border-t border-zinc-900 space-y-3">
                              <div className="bg-zinc-950 border border-zinc-900 p-3 text-xs space-y-2">
                                <div className="text-zinc-600 text-[9px] uppercase tracking-wider">Description</div>
                                <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{b.description}</div>
                              </div>

                              <div className="bg-zinc-950 border border-zinc-900 p-3 text-[10px] grid grid-cols-2 gap-2">
                                <div><span className="text-zinc-600">User:</span> <span className="text-zinc-300">{b.user_email}</span></div>
                                <div><span className="text-zinc-600">Page:</span> <span className="text-zinc-300">{b.page||"?"}</span></div>
                                <div><span className="text-zinc-600">Category:</span> <span className="text-zinc-300">{b.category?categoryLabels[b.category]||b.category:"—"}</span></div>
                                <div><span className="text-zinc-600">Time:</span> <span className="text-zinc-300">{new Date(b.created_at).toLocaleString()}</span></div>
                                <div className="col-span-2 break-all"><span className="text-zinc-600">Browser:</span> <span className="text-zinc-400">{b.browser||"—"}</span></div>
                              </div>

                              <div className="border-t border-zinc-900 pt-3">
                                <div className="text-zinc-400 text-[10px] uppercase tracking-wider mb-2">Update status</div>
                                <div className="flex gap-1.5 flex-wrap">
                                  <button
                                    onClick={(e)=>{e.stopPropagation();updateBugStatus(b.id,"in_progress");}}
                                    disabled={b.status==="in_progress"}
                                    className={`px-2 py-1 border text-[10px] uppercase tracking-wider font-mono ${b.status==="in_progress"?"opacity-30 cursor-not-allowed border-zinc-700 text-zinc-500":"border-cyan-700 bg-cyan-950/20 text-cyan-300 hover:bg-cyan-950/40"}`}
                                  >Mark In Progress</button>
                                  <button
                                    onClick={(e)=>{e.stopPropagation();updateBugStatus(b.id,"fixed");}}
                                    disabled={b.status==="fixed"}
                                    className={`px-2 py-1 border text-[10px] uppercase tracking-wider font-mono ${b.status==="fixed"?"opacity-30 cursor-not-allowed border-zinc-700 text-zinc-500":"border-lime-700 bg-lime-950/20 text-lime-300 hover:bg-lime-950/40"}`}
                                  >Mark Fixed</button>
                                  <button
                                    onClick={(e)=>{e.stopPropagation();updateBugStatus(b.id,"wont_fix");}}
                                    disabled={b.status==="wont_fix"}
                                    className={`px-2 py-1 border text-[10px] uppercase tracking-wider font-mono ${b.status==="wont_fix"?"opacity-30 cursor-not-allowed border-zinc-700 text-zinc-500":"border-zinc-700 bg-zinc-900 text-zinc-400 hover:bg-zinc-800"}`}
                                  >Mark Won&apos;t Fix</button>
                                  <button
                                    onClick={(e)=>{e.stopPropagation();updateBugStatus(b.id,"new");}}
                                    disabled={b.status==="new"}
                                    className={`px-2 py-1 border text-[10px] uppercase tracking-wider font-mono ${b.status==="new"?"opacity-30 cursor-not-allowed border-zinc-700 text-zinc-500":"border-amber-700 bg-amber-950/20 text-amber-300 hover:bg-amber-950/40"}`}
                                  >Reopen</button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {bugs.filter(b=>bugFilter==="all"||b.status===bugFilter).length===0&&(
                      <div className="text-zinc-500 text-xs font-mono py-3 text-center">No bug reports in this filter.</div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        <Panel title={`USER PROGRESS // ${users.length} ACCOUNTS`} accent="fuchsia">
          {loading?(<div className="font-mono text-xs text-zinc-500 animate-pulse">Loading users...</div>):users.length===0?(<div className="font-mono text-xs text-zinc-500">No users yet.</div>):(
            <div className="font-mono text-xs overflow-x-auto">
              <div className="grid grid-cols-12 gap-2 px-2 py-1 border-b border-zinc-800 text-zinc-500 uppercase tracking-wider min-w-[900px]">
                <div className="col-span-3">User</div><div className="col-span-1 text-center">Level</div><div className="col-span-2 text-center">Placement</div><div className="col-span-1 text-center">Score</div><div className="col-span-1 text-center">Modules</div><div className="col-span-1 text-center">Accuracy</div><div className="col-span-1 text-center">Time</div><div className="col-span-2 text-center">Last seen</div>
              </div>
              {users.map(u=>{
                const cc=Object.values(u.completed_modules||{}).filter(s=>s>=70).length;
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
                {[["Level",`L${selected.level||1} — ${CURRICULUM[selected.level||1]?.name}`,"amber"],["Modules",`${Object.values(selected.completed_modules||{}).filter(s=>s>=70).length}/${totalModules}`,"lime"],["Accuracy",`${selected.total_answered>0?Math.round((selected.total_correct/selected.total_answered)*100):0}%`,"cyan"],["Time",fmtTime(selected.time_spent_seconds||0),"fuchsia"],["Trivia High",selected.trivia_high_score||0,"fuchsia"],["Placement",selected.placed?"Complete ✓":selected.placement_idx>0?`In progress (Q${selected.placement_idx}/44)`:"Not taken",selected.placed?"lime":selected.placement_idx>0?"amber":"zinc"],["Placement Score",selected.placement_score!=null?`${selected.placement_score}% (${Math.round(selected.placement_score*44/100)}/44)`:"—",selected.placement_score>=80?"lime":selected.placement_score>=50?"amber":"zinc"]].map(([label,val,color])=>(
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
  // C2 FIX: track save errors and show a banner to the user
  const [saveError,setSaveError]=useState(null);
  // Bug reporter
  const [showBugReport,setShowBugReport]=useState(false);
  // P1.1: write queue — serializes all saveProgress calls to prevent lost writes
  // when multiple async operations save concurrently (timer + quiz submit + nav).
  const saveQueueRef=useRef(Promise.resolve());
  const [showBetaBanner,setShowBetaBanner]=useState(()=>{
    try{return localStorage.getItem("ngpx_beta_banner_dismissed")!=="1";}catch(_){return true;}
  });
  const dismissBetaBanner=()=>{
    try{localStorage.setItem("ngpx_beta_banner_dismissed","1");}catch(_){}
    setShowBetaBanner(false);
  };
  const [view,setView]=useState(()=>{
    if(progress.currentModule&&progress.currentQuestion>0)return"module";
    if(progress.placed)return"dashboard";
    if(progress.placementIdx>0)return"placement";
    return"welcome";
  });
  const [activeModuleId,setActiveModuleId]=useState(
    progress.currentModule&&progress.currentQuestion>0?progress.currentModule:null
  );

  // FIX: if progress loaded late (after MainApp mounted with stale defaultProgress),
  // and user is on welcome/placement but they're already placed, redirect to dashboard.
  // Only auto-correct UP (welcome -> dashboard); never auto-redirect away from dashboard or module.
  useEffect(()=>{
    if(progress.placed&&(view==="welcome"||view==="placement")){
      setView("dashboard");
    }
  },[progress.placed]);
  const [placementScore,setPlacementScore]=useState(0);
  const [placementByLevel,setPlacementByLevel]=useState({});
  const [placementByTopic,setPlacementByTopic]=useState({});
  const startTimeRef=useRef(Date.now());
  const lastActivityRef=useRef(Date.now());

  // ACTIVE TIME TRACKING:
  // Time is counted only when the user is actively using the app:
  //   1. Tab must be visible (not in a background tab)
  //   2. Window must be focused
  //   3. User must have interacted (mouse/keyboard/touch) within the last 2 minutes
  // This prevents inflated time stats from tabs left open overnight.
  useEffect(()=>{
    const IDLE_THRESHOLD_MS=2*60*1000; // 2 minutes without activity = idle
    const TICK_MS=30000;

    const recordActivity=()=>{lastActivityRef.current=Date.now();};
    // Listen for any user interaction
    const events=["mousemove","mousedown","keydown","scroll","touchstart","focus"];
    events.forEach(e=>window.addEventListener(e,recordActivity,{passive:true}));

    const interval=setInterval(async()=>{
      const now=Date.now();
      const isVisible=typeof document!=="undefined"&&document.visibilityState==="visible";
      const isRecentlyActive=(now-lastActivityRef.current)<IDLE_THRESHOLD_MS;
      // Reset the clock so we never accumulate stale wall-clock time
      const elapsed=Math.floor((now-startTimeRef.current)/1000);
      startTimeRef.current=now;

      // Only count time if the user is actively using the app
      if(!isVisible||!isRecentlyActive){
        return; // skip this tick — user is idle or tab is hidden
      }

      const p=progressRef.current;
      const updated={...p,timeSpentSeconds:(p.timeSpentSeconds||0)+elapsed};
      setProgress(updated);
      progressRef.current=updated;
      await saveProgress(updated);
    },TICK_MS);

    // When tab becomes hidden, reset clock so the hidden time isn't counted on return
    const onVisibilityChange=()=>{
      if(document.visibilityState==="visible"){
        startTimeRef.current=Date.now();
        lastActivityRef.current=Date.now();
      }
    };
    document.addEventListener("visibilitychange",onVisibilityChange);

    return()=>{
      clearInterval(interval);
      events.forEach(e=>window.removeEventListener(e,recordActivity));
      document.removeEventListener("visibilitychange",onVisibilityChange);
    };
  },[]);

  // saveProgress: serialized via saveQueueRef to prevent concurrent writes from
  // overwriting each other. Each call returns a promise that resolves after the
  // queue's prior work has completed AND this save has also completed.
  const saveProgress=(p)=>{
    const doSave=async()=>{
      try{
        // P1.2: verify session still belongs to the current user — if user signed
        // out or switched accounts mid-flight, abort the save.
        const{data:{user:currentAuthUser}}=await supabase.auth.getUser();
        if(!currentAuthUser||currentAuthUser.id!==user.id){
          console.warn("saveProgress: session changed, aborting save");
          return{success:false,error:new Error("Session changed; save aborted")};
        }
        const{error}=await supabase.from("progress").upsert({
          id:user.id,email:user.email,full_name:user.user_metadata?.full_name||user.email,
          level:p.level,placed:p.placed,completed_modules:p.completed,
          trivia_high_score:p.triviaHigh,total_answered:p.totalAnswered,
          total_correct:p.totalCorrect,time_spent_seconds:p.timeSpentSeconds||0,
          current_module:p.currentModule||null,current_question:p.currentQuestion||0,
          current_answers:p.currentAnswers||[],
          placement_idx:p.placementIdx||0,placement_picks:p.placementPicks||[],placement_score:p.placementScore!=null?p.placementScore:null,
          updated_at:new Date().toISOString(),
        },{onConflict:"id"});
        if(error){
          console.error("saveProgress error:",error);
          setSaveError(error.message||"Failed to save progress");
          return{success:false,error};
        }
        if(saveError)setSaveError(null);
        return{success:true};
      }catch(e){
        console.error("saveProgress threw:",e);
        setSaveError(e.message||"Network error while saving");
        return{success:false,error:e};
      }
    };
    // Chain this save behind any in-flight save. The .catch(()=>{}) ensures
    // a failing save doesn't break the chain for subsequent saves.
    const next=saveQueueRef.current.then(doSave);
    saveQueueRef.current=next.catch(()=>{});
    return next;
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
    // C1 FIX: removed per-question accumulation of totalAnswered/totalCorrect.
    // Accumulation now happens once per module completion in handleModuleComplete,
    // and only on the first attempt. This prevents retries from inflating the totals.
    const p=progressRef.current;
    const updated={
      ...p,
      currentModule:modId,
      currentQuestion:qIdx,
      currentAnswers:ans,
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
    const safeCompleted=p.completed||{};
    // C1 FIX: only accumulate totalAnswered/totalCorrect on the FIRST attempt of this module
    // (per-question increments are also suppressed in handleSaveQuizState — see below)
    const isFirstAttempt=safeCompleted[id]===undefined;
    // Keep best score: if user previously passed (>=70%), don't downgrade with a failed retry
    const prevScore=safeCompleted[id];
    // Q7 FIX: always keep the best score, including for failed (<70) retries.
    // Previous logic downgraded failed retries; this discouraged practice.
    const newScore=prevScore!==undefined?Math.max(prevScore,pct):pct;
    const nc={...safeCompleted,[id]:newScore};
    let nl=p.level;
    const cm=CURRICULUM[p.level].modules.map(m=>m.id);
    if(cm.every(mid=>(nc[mid]||0)>=70)&&p.level<6)nl=p.level+1;
    const updated={
      ...p,level:nl,completed:nc,
      totalAnswered:isFirstAttempt?(p.totalAnswered||0)+total:(p.totalAnswered||0),
      totalCorrect:isFirstAttempt?(p.totalCorrect||0)+correct:(p.totalCorrect||0),
      currentModule:null,currentQuestion:0,currentAnswers:[]
    };
    progressRef.current=updated;
    setProgress(updated);
    const result=await saveProgress(updated);
    if(!result?.success){
      console.error("Module completion save failed — score may not persist");
    }
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
      {showChangePwd&&<ChangePasswordModal onClose={()=>setShowChangePwd(false)} userEmail={user.email}/>}
      {showBugReport&&<BugReportModal user={user} currentView={view==="module"&&activeModuleId?`module-${activeModuleId}`:view} onClose={()=>setShowBugReport(false)}/>}
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
            <button onClick={()=>setShowBugReport(true)} className="font-mono text-[10px] text-amber-400 hover:text-amber-300 uppercase tracking-wider border border-amber-800 hover:border-amber-600 px-2.5 py-1.5 flex items-center gap-1" title="Report a bug">
              🐛 <span className="hidden md:inline">Report bug</span>
            </button>
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
                <button onClick={()=>{setShowMenu(false);setView("dashboard");}} className="w-full text-left text-[10px] text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900 uppercase tracking-wider px-3 py-2 border-b border-zinc-800 flex items-center gap-2">
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
        {/* BETA BANNER — shown once until dismissed */}
        {showBetaBanner&&(
          <div className="max-w-2xl mx-auto px-4 mb-3">
            <div className="border border-amber-800 bg-amber-950/20 px-3 py-2 font-mono text-xs text-amber-300 flex justify-between items-center gap-3">
              <span>📢 NGPX//ACADEMY is new. Found something off? Use the <span className="text-amber-400 font-bold">🐛 Report bug</span> button in the header any time.</span>
              <button onClick={dismissBetaBanner} className="text-amber-500 hover:text-amber-200 flex-shrink-0 text-[10px] uppercase tracking-wider whitespace-nowrap">✕ Got it</button>
            </div>
          </div>
        )}
        {/* C2 FIX: visible banner when a save has failed */}
        {saveError&&(
          <div className="max-w-2xl mx-auto px-4 mb-3">
            <div className="border border-rose-700 bg-rose-950/30 px-3 py-2 font-mono text-xs text-rose-300 flex justify-between items-center gap-3">
              <span>⚠ Last save failed: {saveError}. Your progress may not be saved. Check your connection and continue — the next save will retry.</span>
              <button onClick={()=>setSaveError(null)} className="text-rose-400 hover:text-rose-200 flex-shrink-0">✕</button>
            </div>
          </div>
        )}
        {view==="welcome"&&<WelcomeScreen onStart={()=>setView("placement")}/>}
        {view==="placement"&&<Placement onComplete={handlePlacementComplete} resumeIdx={progress.placementIdx} resumePicks={progress.placementPicks} onSavePlacement={handleSavePlacement} user={user} onExit={()=>setView("dashboard")}/>}
        {view==="placement-result"&&<PlacementResult score={placementScore} level={progressRef.current.level} byLevel={placementByLevel} byTopic={placementByTopic} onContinue={()=>setView("dashboard")} onStartModule={(modId)=>{setActiveModuleId(modId);setView("module");}}/>}
        {view==="dashboard"&&<Dashboard state={progress} onView={handleViewChange}/>}
        {view==="module"&&activeModuleId&&<ModuleView key={activeModuleId} moduleId={activeModuleId} state={{...progress,userId:user.id}} onComplete={handleModuleComplete} onBack={handleModuleBack} onSaveQuizState={handleSaveQuizState} user={user} onContinue={(nextId)=>{setActiveModuleId(nextId);setView("module");}}/>}
        {view==="trivia"&&<TriviaMode state={progress} onUpdateHigh={async s=>{const cur=progressRef.current.triviaHigh||0;if(s<=cur)return;const u={...progressRef.current,triviaHigh:s};progressRef.current=u;setProgress(u);await saveProgress(u);}} onBack={()=>setView("dashboard")}/>}
        {view==="cards"&&<FlashcardMode state={progress} onBack={()=>setView("dashboard")}/>}
      </main>
      <footer className="border-t border-zinc-900 px-4 py-3 font-mono text-xs text-zinc-600 text-center space-y-0.5"><div>NGPX//ACADEMY · ENGIE EEMNA · Educational only · Not financial advice</div><div className="text-zinc-700 text-[10px]">No ENGIE business or trading data is stored or referenced.</div></footer>
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
function Placement({onComplete,resumeIdx=0,resumePicks=[],onSavePlacement,user,onExit}){
  const [idx,setIdx]=useState(resumeIdx);
  const [picks,setPicks]=useState(resumePicks);
  const [showDispute,setShowDispute]=useState(false);
  const [disputed,setDisputed]=useState({});
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

  const submittingRef=useRef(false);
  const submit=()=>{
    if(submittingRef.current||selected===null||showAnswer)return;
    submittingRef.current=true;
    setShowAnswer(true);
    submittingRef.current=false;
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
      // Level-dependent placement thresholds:
      // L1-L2 (foundations): 50% — be generous
      // L3-L4 (intermediate): 60% — moderate proof
      // L5-L6 (advanced): 75% — require genuine mastery
      // ALSO: placement is "highest CONSECUTIVE level passed from L1 up" —
      // a user can't skip levels by lucky-guessing on advanced questions while
      // failing fundamentals. Stop climbing at the first level they don't clear.
      const LEVEL_THRESHOLDS={1:0.5,2:0.5,3:0.6,4:0.6,5:0.75,6:0.75};
      let starting=1;
      for(let L=1;L<=6;L++){
        const passed=byLevel[L]&&byLevel[L].c/byLevel[L].t>=LEVEL_THRESHOLDS[L];
        if(passed)starting=L;
        else break; // can't skip levels — stop at first failure
      }
      await onComplete(starting,next.filter(p=>p.correct).length,byLevel,byTopic);
      setFinishing(false);
    }else{
      const nextIdx=idx+1;
      setPicks(next);setSelected(null);setShowAnswer(false);setIdx(nextIdx);
      onSavePlacement(nextIdx,next);
    }
  };

  const userCorrect=showAnswer&&selected===q.answer;

  return(<>
    {showDispute&&user&&q&&(
      <DisputeModal
        user={user}
        context="placement"
        moduleId={null}
        question={q}
        userAnswerIdx={selected}
        onClose={()=>{setShowDispute(false);setDisputed(d=>({...d,[idx]:true}));}}
      />
    )}
    <div className="max-w-2xl mx-auto p-4">
      <Panel title={`PLACEMENT // ${idx+1} / ${shuffled.length}`} accent="amber">
        {onExit&&(
          <div className="flex justify-end -mt-2 mb-2">
            <button
              onClick={()=>{if(confirm("Exit placement test? Your answers so far are saved — you can resume any time."))onExit();}}
              className="font-mono text-[10px] text-zinc-500 hover:text-zinc-300 uppercase tracking-wider"
            >▸ Exit & save</button>
          </div>
        )}
        <div className="font-mono space-y-4">
          <div className="h-1 bg-zinc-900"><div className="h-full bg-amber-400 transition-all" style={{width:`${((idx+1)/shuffled.length)*100}%`}}/></div>
          <div className="text-xs text-zinc-500 flex justify-between"><span>L{q.lvl} · {TOPIC_LABELS[q.topic]||q.topic}</span><span>{resumeIdx>0&&idx===resumeIdx?<span className="text-amber-400">▸ RESUMED</span>:"NO HINTS // NO BACKTRACK"}</span></div>
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
            <>
              <div className={`border-l-2 ${userCorrect?"border-lime-500":"border-rose-500"} pl-3 py-2 text-xs space-y-1`}>
                <div className={`uppercase text-[10px] font-bold tracking-wider ${userCorrect?"text-lime-400":"text-rose-400"}`}>{userCorrect?"✓ CORRECT":"✗ INCORRECT"}</div>
                {!userCorrect&&<div className="text-lime-300 text-xs">Correct answer: <span className="font-bold">{q.options[q.answer]}</span></div>}
                {q.explain&&<div className="text-zinc-400">{q.explain}</div>}
              </div>
              {!userCorrect&&(
                <div className="flex items-center gap-2 pt-1">
                  {disputed[idx]?(
                    <span className="text-lime-500 text-[10px] font-mono">✓ Dispute submitted — we&apos;ll review it</span>
                  ):(
                    <button
                      onClick={()=>setShowDispute(true)}
                      className="text-zinc-500 hover:text-rose-400 text-[10px] font-mono uppercase tracking-wider flex items-center gap-1"
                    >🚩 Disagree with this answer?</button>
                  )}
                </div>
              )}
            </>
          )}
          <div className="pt-2 flex justify-between items-center">
            <div className="text-[10px] text-zinc-500 font-mono">
              {selected!==null&&!showAnswer&&"▸ Click SUBMIT to confirm your answer"}
            </div>
            <div>
              {!showAnswer&&<Btn onClick={submit} variant="primary" disabled={selected===null}>SUBMIT <ChevronRight size={12} className="inline"/></Btn>}
              {showAnswer&&<Btn onClick={advance} variant="primary" disabled={finishing}>{finishing?"SAVING...":idx===shuffled.length-1?"FINISH":"NEXT"} <ChevronRight size={12} className="inline"/></Btn>}
            </div>
          </div>
        </div>
      </Panel>
    </div>
  </>);
}function PlacementResult({score,level,byLevel,byTopic,onContinue,onStartModule}){
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
        <div className="text-zinc-500 text-[10px] mt-3 pt-3 border-t border-amber-900 leading-relaxed">
          ▸ Your level is the highest tier you cleared CONSECUTIVELY starting from L1. Each tier has a rising bar: L1-L2 need 50%, L3-L4 need 60%, L5-L6 need 75%. If you fail any tier on the climb, you stop there. This is intentional — strong fundamentals matter more than scattered correct answers at advanced levels.
        </div>
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

      <div className="pt-2 flex gap-2 flex-wrap">
        {firstModule&&level<6&&(
          <Btn onClick={()=>onStartModule&&onStartModule(firstModule.id)} variant="primary" className="flex-1 text-center justify-center">▸ Start module {firstModule.id} now <ChevronRight size={12} className="inline"/></Btn>
        )}
        <Btn onClick={onContinue} variant={firstModule&&level<6?"ghost":"primary"} className={firstModule&&level<6?"text-center justify-center":"w-full text-center justify-center"}>{firstModule&&level<6?"DASHBOARD":"▸ GO TO MY DASHBOARD"}</Btn>
      </div>
    </div>
  );
}

// DASHBOARD
function Dashboard({state,onView}){
  const completed=Object.values(state.completed||{}).filter(s=>s>=70).length;
  const total=Object.values(CURRICULUM).reduce((s,l)=>s+l.modules.length,0);

  // For each tier, compute cleared/total and whether any module needs retry
  const tierStats=(L)=>{
    const mods=CURRICULUM[L]?.modules||[];
    const comp=state.completed||{};
    const cleared=mods.filter(m=>(comp[m.id]||0)>=70).length;
    const needsRetry=mods.filter(m=>comp[m.id]!==undefined&&comp[m.id]<70);
    return{cleared,total:mods.length,needsRetry};
  };

  // Track expanded state for collapsed completed tiers
  const [expandedTiers,setExpandedTiers]=useState({});
  const toggleTier=(lvl)=>setExpandedTiers(prev=>({...prev,[lvl]:!prev[lvl]}));

  return(
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Panel title="LEVEL" accent="amber"><div className="font-mono"><div className="text-2xl font-bold text-amber-400">L{state.level}</div><div className="text-[10px] text-zinc-500 uppercase">{CURRICULUM[state.level].name}</div></div></Panel>
        <Panel title="PROGRESS" accent="lime"><div className="font-mono"><div className="text-2xl font-bold text-lime-400">{completed}<span className="text-zinc-600 text-base">/{total}</span></div><div className="text-[10px] text-zinc-500 uppercase">modules cleared</div></div></Panel>
        <Panel title="ACCURACY" accent="cyan"><div className="font-mono"><div className="text-2xl font-bold text-cyan-400">{state.totalAnswered>0?Math.round((state.totalCorrect/state.totalAnswered)*100)+"%":"—"}</div><div className="text-[10px] text-zinc-500 uppercase">{state.totalAnswered>0?`${state.totalCorrect}/${state.totalAnswered}`:"no quizzes yet"}</div></div></Panel>
        <Panel title="TIME SPENT" accent="fuchsia"><div className="font-mono"><div className="text-2xl font-bold text-fuchsia-400">{fmtTime(state.timeSpentSeconds||0)}</div><div className="text-[10px] text-zinc-500 uppercase">study time</div></div></Panel>
      </div>

      {Object.entries(CURRICULUM).map(([lvl,data],idx,arr)=>{
        const L=parseInt(lvl);
        const locked=L>state.level;
        const isCurrent=L===state.level;
        const isNextLocked=L===state.level+1;
        const {cleared,total:tierTotal,needsRetry}=tierStats(L);
        const prevStats=L>1?tierStats(L-1):null;
        const remaining=prevStats?prevStats.total-prevStats.cleared:0;
        // Tier is "complete" when all modules passed AND tier is below current level
        const isComplete=tierTotal>0&&cleared===tierTotal&&L<state.level;
        const isExpanded=expandedTiers[lvl]===true;
        const shouldCollapse=isComplete&&!isExpanded;

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

            {shouldCollapse?(
              <button onClick={()=>toggleTier(lvl)} className="w-full border border-lime-800 bg-lime-950/15 hover:bg-lime-950/30 px-4 py-2.5 flex justify-between items-center font-mono transition-colors">
                <div className="flex items-center gap-3">
                  <Pill color="lime">{data.tag}</Pill>
                  <span className="text-zinc-400 text-xs">{data.name}</span>
                  <span className="text-lime-500 text-[10px]">✓ Complete</span>
                </div>
                <span className="text-zinc-600 text-xs">▾</span>
              </button>
            ):(
            <Panel
              key={lvl}
              title={`${data.tag} // ${data.name} · ${data.grade}${isCurrent?" — "+cleared+"/"+tierTotal+" cleared":""}${isComplete?" — ✓ Complete":""}`}
              accent={locked?"zinc":isCurrent?"amber":"lime"}
              className=""
            >
              {isComplete&&isExpanded&&(
                <button onClick={()=>toggleTier(lvl)} className="text-zinc-500 hover:text-zinc-300 font-mono text-[10px] uppercase tracking-wider mb-2 flex items-center gap-1">
                  ▴ Collapse this tier
                </button>
              )}
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
                  const comp=state.completed||{};
                  const score=comp[m.id];
                  const passed=score!==undefined&&score>=70;
                  const needsRetryModule=score!==undefined&&score<70;
                  const t=MODULE_TOPIC[m.id];
                  // "Start here" badge: first incomplete module of current tier, only if user hasn't started any module yet in this tier
                  const tierHasProgress=data.modules.some(mm=>comp[mm.id]!==undefined);
                  const isStartHere=isCurrent&&!locked&&score===undefined&&!tierHasProgress&&data.modules.findIndex(mm=>comp[mm.id]===undefined)===modIdx;
                  const isInProgress=state.currentModule===m.id&&(state.currentQuestion||0)>0;
                  return(
                    <button
                      key={m.id}
                      onClick={()=>!locked&&onView({type:"module",id:m.id})}
                      disabled={locked}
                      className={`text-left p-3 border font-mono text-xs transition-colors relative ${
                        locked?"border-zinc-800 text-zinc-400 cursor-not-allowed bg-zinc-950/60":
                        isStartHere?"border-lime-400 bg-lime-950/40 text-zinc-100":
                        passed?"border-lime-700 bg-lime-950/20 text-lime-300":
                        needsRetryModule?"border-amber-800 bg-amber-950/20 text-amber-200":
                        "border-zinc-800 hover:border-amber-600 text-zinc-300"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] text-zinc-500">{m.id}</span>
                        <div className="flex gap-1 items-center">
                          {isStartHere&&<span className="text-[9px] bg-lime-400 text-black px-1.5 py-0.5 uppercase tracking-wider font-bold">Start here</span>}{isInProgress&&!isStartHere&&<span className="border border-amber-500 text-amber-400 text-[9px] px-1.5 py-0.5 font-mono uppercase tracking-wider ml-1">▸ Continue</span>}
                          {t&&!locked&&!isStartHere&&<Pill color="zinc">{t}</Pill>}
                          {passed&&<Check size={11} className="text-lime-400"/>}
                          {needsRetryModule&&<span className="text-[9px] bg-rose-950 text-rose-400 px-1.5 py-0.5 uppercase tracking-wider">Retry</span>}
                          {locked&&<span className="text-zinc-500 text-[10px] border border-zinc-700 px-1.5 py-0.5 uppercase tracking-wider">🔒 Locked</span>}
                        </div>
                      </div>
                      <div className={locked?"text-zinc-400 text-xs":"text-zinc-100 text-xs"}>{m.title}</div>
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
            )}

            {/* Move Trivia/Flashcards to appear AFTER current tier */}
            {isCurrent&&(
              <div className="grid grid-cols-2 gap-2 mt-4">
                <button onClick={()=>onView("trivia")} className="border border-fuchsia-700 hover:border-fuchsia-500 bg-zinc-950/60 p-3 font-mono text-xs uppercase tracking-wider text-fuchsia-400 flex items-center justify-center gap-2"><Trophy size={14}/> Trivia</button>
                <button onClick={()=>onView("cards")} className="border border-cyan-700 hover:border-cyan-500 bg-zinc-950/60 p-3 font-mono text-xs uppercase tracking-wider text-cyan-400 flex items-center justify-center gap-2"><Shuffle size={14}/> Flashcards</button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// MODULE VIEW
function ModuleView({moduleId,state,onComplete,onBack,onSaveQuizState,user,onContinue}){
  const resumeQ=state.currentModule===moduleId?state.currentQuestion||0:0;
  const resumeA=state.currentModule===moduleId?state.currentAnswers||[]:[];
  const [phase,setPhase]=useState(resumeQ>0?"quiz":"lesson");
  const [qIdx,setQIdx]=useState(resumeQ);
  const [answers,setAnswers]=useState(resumeA);
  const [selected,setSelected]=useState(null);
  const [showAnswer,setShowAnswer]=useState(false);
  const [showDispute,setShowDispute]=useState(false);
  const [disputed,setDisputed]=useState({});  // tracks which questions have been disputed this session
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
  const submittingRef=useRef(false);
  const submit=()=>{
    if(submittingRef.current||selected===null||showAnswer)return;
    submittingRef.current=true;
    setShowAnswer(true);
    const correct=selected===shuffledQuestions[qIdx].answer;
    const newAnswers=[...answers,correct];
    setAnswers(newAnswers);
    // Save qIdx+1 so on resume we start at the NEXT unanswered question
    onSaveQuizState(moduleId,qIdx+1,newAnswers);
    submittingRef.current=false;
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
  if(phase==="lesson"){
    const wordCount=mod.lesson.split(/\s+/).filter(Boolean).length;
    const readMins=Math.max(1,Math.round(wordCount/200));
    // Quiz not yet taken in THIS visit. If user already passed this module before (best score >= 70),
    // suppress the "before you go" warning since they don't need to take it again.
    const alreadyPassedBefore=(state.completed||{})[mod.id]>=70;
    const handleBackWithGuard=()=>{
      if(alreadyPassedBefore){onBack();return;}
      if(window.confirm("Leave without taking the quiz?\n\nThis module won't be marked as complete until you pass the quiz (70%+). You can come back and finish anytime.")){
        onBack();
      }
    };
    return(
      <div className="max-w-2xl mx-auto p-4 space-y-3">
        <button onClick={handleBackWithGuard} className="font-mono text-xs text-zinc-500 hover:text-lime-400 flex items-center gap-1">
          <ArrowLeft size={12}/> BACK
          {!alreadyPassedBefore&&<span className="text-amber-500 text-[10px] ml-1">(quiz not yet taken)</span>}
        </button>
        {/* Progress stepper — makes it clear there are TWO parts */}
        <div className="flex gap-1 bg-zinc-950 border border-zinc-800 p-1.5">
          <div className="flex-1 px-2 py-1.5 bg-cyan-900/30 border border-cyan-700 text-cyan-300 text-[10px] text-center font-mono font-bold uppercase tracking-wider">● 1. LESSON</div>
          <div className="flex-1 px-2 py-1.5 border border-zinc-700 text-zinc-500 text-[10px] text-center font-mono uppercase tracking-wider">○ 2. QUIZ ({shuffledQuestions.length} Qs)</div>
        </div>
        <div className="border border-cyan-700 bg-zinc-950/60 p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="font-mono text-[10px] text-cyan-400 uppercase tracking-[0.2em]">▸ {mod.id} // {mod.title}</div>
            <div className="font-mono text-[10px] text-zinc-500">⏱ ~{readMins} min read</div>
          </div>
          <div className="font-mono text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">{mod.lesson}</div>
        </div>
        {/* "Ready?" callout — visually impossible to miss */}
        <div className="border border-lime-600 bg-lime-950/20 px-4 py-4 text-center mt-2">
          <div className="font-mono text-lime-400 text-sm font-bold uppercase tracking-wider mb-1.5">▸ READY FOR THE QUIZ?</div>
          <div className="font-mono text-lime-300/70 text-[11px] uppercase tracking-wider mb-3">{shuffledQuestions.length} QUESTIONS · 70% TO PASS · REQUIRED TO COMPLETE THIS MODULE</div>
          <button
            onClick={()=>setPhase("quiz")}
            className="bg-lime-400 hover:bg-lime-300 text-black font-mono font-bold uppercase tracking-wider text-sm px-6 py-2.5 transition-colors inline-flex items-center gap-2"
          >BEGIN QUIZ <ChevronRight size={14}/></button>
        </div>
      </div>
    );
  }

  if(phase==="done"){
    const c=answers.filter(a=>a).length,pct=Math.round((c/shuffledQuestions.length)*100),passed=pct>=70;
    // U14: find the next module in the same tier
    const tierMods=CURRICULUM[state.level]?.modules||[];
    const myIdx=tierMods.findIndex(m=>m.id===mod.id);
    const nextMod=myIdx>=0&&myIdx<tierMods.length-1?tierMods[myIdx+1]:null;
    return(
      <div className="max-w-2xl mx-auto p-4">
        <Panel title="MODULE COMPLETE" accent={passed?"lime":"amber"}>
          <div className="font-mono text-center py-4">
            <div className="text-xs text-zinc-500 mb-2">SCORE</div>
            <div className={`text-5xl font-bold mb-2 ${passed?"text-lime-400":"text-amber-400"}`}>{pct}%</div>
            <div className="text-zinc-400 text-sm mb-1">{c}/{shuffledQuestions.length} correct</div>
            <div className={`text-xs uppercase tracking-wider mt-3 ${passed?"text-lime-400":"text-amber-400"}`}>{passed?"▸ PASS — Module cleared":"▸ Need 70% to clear; retry available"}</div>
            <div className="flex gap-2 justify-center mt-6 flex-wrap">
              {passed?(
                <>
                  {nextMod&&<Btn onClick={()=>onContinue&&onContinue(nextMod.id)} variant="primary">▸ Continue to {nextMod.id} <ChevronRight size={12} className="inline"/></Btn>}
                  <Btn onClick={onBack} variant="ghost">DASHBOARD</Btn>
                </>
              ):(
                <>
                  {/* U15: RETRY skips the lesson and goes straight to the quiz */}
                  <Btn onClick={()=>{setPhase("quiz");setQIdx(0);setAnswers([]);setSelected(null);setShowAnswer(false);}} variant="primary">▸ RETRY QUIZ</Btn>
                  <Btn onClick={()=>{setPhase("lesson");setQIdx(0);setAnswers([]);setSelected(null);setShowAnswer(false);}} variant="ghost">RE-READ LESSON</Btn>
                  <Btn onClick={onBack} variant="ghost">DASHBOARD</Btn>
                </>
              )}
            </div>
          </div>
        </Panel>
      </div>
    );
  }
  const q=shuffledQuestions[qIdx];
  const userWasCorrect=showAnswer&&selected===q.answer;
  return(<>
    {showDispute&&user&&q&&(
      <DisputeModal
        user={user}
        context="module"
        moduleId={mod.id}
        question={q}
        userAnswerIdx={selected}
        onClose={()=>{setShowDispute(false);setDisputed(d=>({...d,[qIdx]:true}));}}
      />
    )}
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
            <>
              <div className={`border-l-2 ${userWasCorrect?"border-lime-500":"border-rose-500"} pl-3 py-2 text-xs space-y-1`}>
                <div className={`uppercase text-[10px] font-bold tracking-wider ${userWasCorrect?"text-lime-400":"text-rose-400"}`}>
                  {userWasCorrect?"✓ CORRECT":"✗ INCORRECT"}
                </div>
                {!userWasCorrect&&<div className="text-lime-300 text-xs">Correct answer: <span className="font-bold">{q.options[q.answer]}</span></div>}
                <div className="text-zinc-400">{q.explain}</div>
              </div>
              {!userWasCorrect&&(
                <div className="flex items-center gap-2 pt-1">
                  {disputed[qIdx]?(
                    <span className="text-lime-500 text-[10px] font-mono">✓ Dispute submitted — we&apos;ll review it</span>
                  ):(
                    <button
                      onClick={()=>setShowDispute(true)}
                      className="text-zinc-500 hover:text-rose-400 text-[10px] font-mono uppercase tracking-wider flex items-center gap-1"
                    >🚩 Disagree with this answer?</button>
                  )}
                </div>
              )}
            </>
          )}
          <div className="flex justify-between items-center pt-1">
            <div className="text-[10px] text-zinc-500 font-mono">
              {selected!==null&&!showAnswer&&"▸ Click SUBMIT to confirm your answer"}
            </div>
            <div>
              {!showAnswer&&<Btn onClick={submit} disabled={selected===null}>SUBMIT</Btn>}
              {showAnswer&&<Btn onClick={next} variant="primary" disabled={finishing}>{finishing?"SAVING...":qIdx===shuffledQuestions.length-1?"FINISH":"NEXT"} <ChevronRight size={12} className="inline"/></Btn>}
            </div>
          </div>
        </div>
      </Panel>
    </div>
  </>);
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
  const [timedOut,setTimedOut]=useState(false);
  const tickRef=useRef(null);

  const start=()=>{
    const filtered=ALL_Q.filter(q=>q.level<=Math.min(state.level+1,6));
    const arr=[...filtered];
    for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}
    setPool(arr.slice(0,Math.min(15,arr.length)).map(q=>shuffleQuestion(q)));
    setIdx(0);setScore(0);scoreRef.current=0;setCorrectCount(0);setStreak(0);setBestStreak(0);setSelected(null);setShowAnswer(false);setTimeLeft(15);setPhase("playing");
  };

  useEffect(()=>{
    if(phase!=="playing"||showAnswer)return;
    tickRef.current=setInterval(()=>{setTimeLeft(t=>{if(t<=1){clearInterval(tickRef.current);setShowAnswer(true);setStreak(0);setTimedOut(true);return 0;}return t-1;});},1000);
    return()=>clearInterval(tickRef.current);
  },[phase,idx,showAnswer]);

  const [lastBreakdown,setLastBreakdown]=useState(null);
  const submittingRef=useRef(false);
  // Q1 FIX: scoreRef captures the latest score synchronously so onUpdateHigh
  // gets the correct final score even on the last question (where React state
  // batching would otherwise return the pre-update value).
  const scoreRef=useRef(0);
  useEffect(()=>{scoreRef.current=score;},[score]);
  const submit=(i)=>{
    if(submittingRef.current||showAnswer)return;
    submittingRef.current=true;
    setTimedOut(false);
    setSelected(i);setShowAnswer(true);clearInterval(tickRef.current);
    if(i===pool[idx].answer){
      const base=100;
      const timeBonus=timeLeft*10;
      const streakBonus=streak*25;
      const pts=base+timeBonus+streakBonus;
      setLastBreakdown({total:pts,base,timeBonus,streakBonus,streakMult:streak});
      // Q1 FIX: update ref synchronously so next() reads the correct total
      scoreRef.current=scoreRef.current+pts;
      setScore(s=>s+pts);
      setCorrectCount(c=>c+1);
      const ns=streak+1;
      setStreak(ns);
      setBestStreak(b=>Math.max(b,ns));
    }else{
      setLastBreakdown(null);
      setStreak(0);
    }
    submittingRef.current=false;
  };

  const next=()=>{
    if(idx===pool.length-1){setPhase("done");onUpdateHigh(scoreRef.current);}
    else{setIdx(idx+1);setSelected(null);setShowAnswer(false);setTimeLeft(15);setLastBreakdown(null);setTimedOut(false);}
  };

  if(phase==="ready")return(
    <div className="max-w-2xl mx-auto p-4">
      <button onClick={onBack} className="font-mono text-xs text-zinc-500 hover:text-lime-400 flex items-center gap-1 mb-3"><ArrowLeft size={12}/> BACK</button>
      <Panel title="TRIVIA MODE" accent="fuchsia">
        <div className="font-mono text-zinc-300 text-sm space-y-2 mb-4"><div>▸ 15 questions from your unlocked levels</div><div>▸ 15 seconds per question · Score: 100 + 10/sec + 25 × streak</div><div className="text-fuchsia-400">HIGH SCORE: {state.triviaHigh>0?state.triviaHigh:"— (not played yet)"}</div></div>
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
          {score>state.triviaHigh?(
            <div className="text-lime-400 text-sm mt-2">▸ NEW HIGH SCORE (previous: {state.triviaHigh||0})</div>
          ):state.triviaHigh>0?(
            <div className="text-zinc-500 text-xs mt-2">Your high score: <span className="text-fuchsia-400">{state.triviaHigh}</span> · {score-state.triviaHigh<0?`${state.triviaHigh-score} away`:"matched"}</div>
          ):(
            <div className="text-zinc-500 text-xs mt-2">Your first trivia game — score saved.</div>
          )}
          <div className="flex gap-2 justify-center mt-6"><Btn onClick={onBack} variant="ghost">DASHBOARD</Btn><Btn onClick={start}>PLAY AGAIN</Btn></div>
        </div>
      </Panel>
    </div>
  );

  const q=pool[idx];
  return(
    <div className="max-w-2xl mx-auto p-4">
      <Panel title={`TRIVIA // ${idx+1}/${pool.length}${q.topic?" · "+(TOPIC_LABELS[q.topic]||q.topic):""}`} accent="fuchsia">
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
          {showAnswer&&lastBreakdown&&(
            <div className="border border-lime-700 bg-lime-950/20 p-2.5 font-mono">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-lime-300 text-xs font-bold">✓ CORRECT</span>
                <span className="text-lime-400 text-lg font-bold">+{lastBreakdown.total}</span>
              </div>
              <div className="flex gap-3 text-[10px] border-t border-lime-900 pt-1.5">
                <span className="text-lime-500">+{lastBreakdown.base} base</span>
                {lastBreakdown.timeBonus>0&&<span className="text-amber-400">+{lastBreakdown.timeBonus} time bonus</span>}
                {lastBreakdown.streakBonus>0&&<span className="text-fuchsia-400">+{lastBreakdown.streakBonus} streak ×{lastBreakdown.streakMult}</span>}
              </div>
            </div>
          )}
          {showAnswer&&timedOut&&<div className="border-l-2 border-rose-500 pl-3 py-1.5 text-xs"><span className="text-rose-400 font-bold">⏱ Time&apos;s up</span> <span className="text-zinc-400">— streak reset.</span></div>}
          {showAnswer&&q.explain&&<div className="border-l-2 border-fuchsia-700 pl-3 text-xs text-zinc-400">{q.explain}</div>}
          <div className="flex justify-end pt-1">{showAnswer&&<Btn onClick={next} variant="primary">{idx===pool.length-1?"FINISH":"NEXT"} <ChevronRight size={12} className="inline"/></Btn>}</div>
        </div>
      </Panel>
    </div>
  );
}

// FLASHCARDS
function FlashcardMode({state,onBack}){
  const [deckSeed,setDeckSeed]=useState(0); // bump to reshuffle
  const cards=useMemo(()=>{const all=[];for(const [lvl,data] of Object.entries(CURRICULUM)){if(parseInt(lvl)>Math.min(state.level+1,6))continue;for(const m of data.modules)all.push({id:m.id,title:m.title,lesson:m.lesson});}const arr=[...all];for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}return arr;},[state.level,deckSeed]);
  const [idx,setIdx]=useState(0);
  const [flipped,setFlipped]=useState(false);
  const [done,setDone]=useState(false);
  // Keyboard support
  React.useEffect(()=>{
    const onKey=(e)=>{
      if(done)return;
      if(e.key===" "||e.key==="Enter"){e.preventDefault();setFlipped(f=>!f);}
      else if(e.key==="ArrowRight"){e.preventDefault();if(idx===cards.length-1)setDone(true);else{setIdx(idx+1);setFlipped(false);}}
      else if(e.key==="ArrowLeft"){e.preventDefault();setIdx((idx-1+cards.length)%cards.length);setFlipped(false);}
      else if(e.key==="Escape"){e.preventDefault();onBack();}
    };
    window.addEventListener("keydown",onKey);
    return()=>window.removeEventListener("keydown",onKey);
  },[idx,cards.length,done,onBack]);
  if(!cards.length)return <div className="p-4 font-mono text-zinc-400">No cards.</div>;
  if(done)return(
    <div className="max-w-2xl mx-auto p-4 space-y-3">
      <button onClick={onBack} className="font-mono text-xs text-zinc-500 hover:text-lime-400 flex items-center gap-1"><ArrowLeft size={12}/> BACK</button>
      <Panel title="DECK COMPLETE" accent="cyan">
        <div className="font-mono text-center py-4">
          <div className="text-cyan-400 text-2xl font-bold mb-2">✓ Deck complete</div>
          <div className="text-zinc-400 text-sm mb-1">You reviewed all {cards.length} cards.</div>
          <div className="flex gap-2 justify-center mt-6 flex-wrap">
            <Btn onClick={()=>{setDeckSeed(s=>s+1);setIdx(0);setFlipped(false);setDone(false);}} variant="primary">▸ SHUFFLE & REVIEW AGAIN</Btn>
            <Btn onClick={onBack} variant="ghost">DASHBOARD</Btn>
          </div>
        </div>
      </Panel>
    </div>
  );
  const c=cards[idx];
  return(
    <div className="max-w-2xl mx-auto p-4 space-y-3">
      <button onClick={onBack} className="font-mono text-xs text-zinc-500 hover:text-lime-400 flex items-center gap-1"><ArrowLeft size={12}/> BACK</button>
      <Panel title={`FLASHCARDS // ${idx+1}/${cards.length}`} accent="cyan">
        <div className="h-1 bg-zinc-900 mb-3"><div className="h-full bg-cyan-400 transition-all" style={{width:`${((idx+1)/cards.length)*100}%`}}/></div>
        <div className="font-mono">
          <div onClick={()=>setFlipped(f=>!f)} className="min-h-[200px] border border-cyan-700 bg-zinc-950 p-6 cursor-pointer hover:border-cyan-500 transition-colors flex items-center justify-center">
            {!flipped?(
              <div className="text-center">
                <div className="text-[10px] text-zinc-500 uppercase mb-3">▸ TAP TO FLIP</div>
                <div className="text-zinc-500 text-xs mb-2">{c.id}</div>
                <div className="text-cyan-300 text-xl font-bold">{c.title}</div>
              </div>
            ):(
              <div className="text-center">
                <div className="text-[10px] text-cyan-400 uppercase tracking-wider mb-3">▸ {c.id} · {c.title}</div>
                <div className="text-zinc-200 text-base leading-relaxed">
                  {(()=>{
                    // Extract first 2 sentences as summary
                    const text=c.lesson.replace(/\n+/g," ").trim();
                    const sentences=text.match(/[^.!?]+[.!?]+/g)||[text];
                    return sentences.slice(0,2).join(" ").trim();
                  })()}
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-between mt-3 items-center">
            <Btn onClick={()=>{setIdx((idx-1+cards.length)%cards.length);setFlipped(false);}} variant="ghost">◀ PREV</Btn>
            <div className="hidden md:block text-[10px] text-zinc-600 font-mono">SPACE: flip · ← →: nav · ESC: back</div>
            <Btn onClick={()=>{if(idx===cards.length-1)setDone(true);else{setIdx(idx+1);setFlipped(false);}}}>{idx===cards.length-1?"FINISH ▶":"NEXT ▶"}</Btn>
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


// DISPUTE MODAL — user reports an issue with a question
function DisputeModal({user,context,moduleId,question,userAnswerIdx,onClose}){
  const [category,setCategory]=useState("");
  const [reason,setReason]=useState("");
  // Q5 FIX: prevent double-submission via re-entrancy guard
  const submittingRef=useRef(false);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [done,setDone]=useState(false);

  const categories=[
    {id:"wrong_answer",label:"Wrong answer"},
    {id:"ambiguous",label:"Ambiguous wording"},
    {id:"outdated",label:"Outdated info"},
    {id:"typo",label:"Typo"},
    {id:"other",label:"Other"},
  ];

  const submit=async()=>{
    if(submittingRef.current){return;}
    if(userAnswerIdx===null||userAnswerIdx===undefined){setError("Cannot dispute without a selected answer.");return;}
    if(!reason.trim()){setError("Please add a brief reason.");return;}
    if(reason.length>500){setError("Reason must be 500 characters or less.");return;}
    submittingRef.current=true;
    setLoading(true);setError("");
    try{
      const{error:e}=await supabase.from("question_disputes").insert({
        user_id:user.id,
        user_email:user.email,
        context,
        module_id:moduleId||null,
        question_text:question.q,
        question_options:question.options,
        user_answer_text:question.options[userAnswerIdx],
        correct_answer_text:question.options[question.answer],
        category:category||null,
        reason:reason.trim(),
        status:"open",
      });
      if(e){setError(e.message||"Could not submit. Try again.");setLoading(false);submittingRef.current=false;return;}
      setDone(true);
      setLoading(false);
      // Auto-close after 1.5s
      setTimeout(onClose,1500);
    }catch(err){
      setError("Network error. Please try again.");
      setLoading(false);
      submittingRef.current=false;
    }
  };

  return(
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
      <div className="w-full max-w-lg">
        <div className="border border-rose-700 bg-zinc-950 p-4 font-mono">
          <div className="text-rose-400 text-[10px] uppercase tracking-[0.2em] font-bold mb-3">▸ DISPUTE THIS QUESTION</div>

          {done?(
            <div className="py-6 text-center space-y-2">
              <div className="text-lime-400 text-sm">✓ Dispute submitted</div>
              <div className="text-zinc-500 text-xs">We&apos;ll review it. Thank you for the feedback.</div>
            </div>
          ):(
            <>
              {/* Auto-captured question info */}
              <div className="bg-black border border-zinc-900 p-3 mb-3 text-xs">
                <div className="text-zinc-600 text-[9px] uppercase tracking-wider mb-1">Question</div>
                <div className="text-zinc-300 mb-2">{question.q}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  <div>
                    <div className="text-zinc-600 text-[9px] uppercase tracking-wider mb-0.5">Your answer</div>
                    <div className="text-rose-400 text-[11px]">{question.options[userAnswerIdx]}</div>
                  </div>
                  <div>
                    <div className="text-zinc-600 text-[9px] uppercase tracking-wider mb-0.5">Marked correct</div>
                    <div className="text-lime-300 text-[11px]">{question.options[question.answer]}</div>
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="mb-3">
                <div className="text-zinc-400 text-[10px] uppercase tracking-wider mb-2">
                  Issue category <span className="text-zinc-600 normal-case">(optional)</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map(c=>(
                    <button
                      key={c.id}
                      type="button"
                      onClick={()=>setCategory(category===c.id?"":c.id)}
                      className={`px-2 py-1 border text-[10px] uppercase tracking-wider font-mono transition-colors ${
                        category===c.id
                          ?"border-rose-600 bg-rose-950/30 text-rose-300"
                          :"border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500"
                      }`}
                    >{c.label}</button>
                  ))}
                </div>
              </div>

              {/* Reason */}
              <div className="mb-3">
                <div className="text-zinc-400 text-[10px] uppercase tracking-wider mb-1">Your reason</div>
                <textarea
                  value={reason}
                  onChange={e=>setReason(e.target.value.slice(0,500))}
                  placeholder="Explain why you think the answer should be different..."
                  className="w-full bg-black border border-zinc-700 text-zinc-100 px-3 py-2 text-xs font-mono focus:border-rose-600 outline-none resize-y"
                  rows={4}
                />
                <div className="text-zinc-600 text-[9px] text-right mt-1">{reason.length} / 500</div>
              </div>

              {error&&<div className="text-rose-400 text-xs mb-2">{error}</div>}

              <div className="flex gap-2 justify-end border-t border-zinc-900 pt-3">
                <Btn onClick={onClose} variant="ghost">CANCEL</Btn>
                <button
                  onClick={submit}
                  disabled={loading||!reason.trim()}
                  className={`px-3 py-1.5 border font-mono text-xs uppercase tracking-wider transition-colors ${
                    loading||!reason.trim()
                      ?"opacity-30 cursor-not-allowed border-zinc-700 text-zinc-500"
                      :"bg-rose-700 border-rose-700 text-white hover:bg-rose-600 cursor-pointer"
                  }`}
                >{loading?"SUBMITTING...":"SUBMIT DISPUTE"}</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


// BUG REPORT MODAL
function BugReportModal({user,currentView,onClose}){
  const [category,setCategory]=useState("");
  const [description,setDescription]=useState("");
  // Q5 FIX: prevent double-submission via re-entrancy guard
  const submittingRef=useRef(false);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [done,setDone]=useState(false);

  const categories=[
    {id:"ui_broken",label:"UI broken"},
    {id:"crashed",label:"Crashed / froze"},
    {id:"login_issue",label:"Login issue"},
    {id:"slow",label:"Slow"},
    {id:"other",label:"Other"},
  ];

  const submit=async()=>{
    if(submittingRef.current){return;}
    if(!description.trim()){setError("Please describe what happened.");return;}
    if(description.length>1000){setError("Description must be 1000 characters or less.");return;}
    submittingRef.current=true;
    setLoading(true);setError("");
    try{
      const{error:e}=await supabase.from("bug_reports").insert({
        user_id:user.id,
        user_email:user.email,
        page:currentView||"unknown",
        browser:(navigator.userAgent||"").slice(0,300),
        category:category||null,
        description:description.trim(),
        status:"new",
      });
      if(e){setError(e.message||"Could not submit. Try again.");setLoading(false);submittingRef.current=false;return;}
      setDone(true);
      setLoading(false);
      setTimeout(onClose,1500);
    }catch(err){
      setError("Network error. Please try again.");
      setLoading(false);
      submittingRef.current=false;
    }
  };

  const now=new Date();
  const timeStr=now.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});

  return(
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
      <div className="w-full max-w-lg">
        <div className="border border-amber-700 bg-zinc-950 p-4 font-mono">
          <div className="text-amber-400 text-[10px] uppercase tracking-[0.2em] font-bold mb-3">🐛 REPORT A BUG</div>

          {done?(
            <div className="py-6 text-center space-y-2">
              <div className="text-lime-400 text-sm">✓ Bug report submitted</div>
              <div className="text-zinc-500 text-xs">Thank you — we&apos;ll investigate.</div>
            </div>
          ):(
            <>
              <div className="bg-black border border-zinc-900 p-3 mb-3 text-xs">
                <div className="text-zinc-600 text-[9px] uppercase tracking-wider mb-1">Auto-captured</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-400 text-[10px]">
                  <div><span className="text-zinc-600">User:</span> {user.email}</div>
                  <div><span className="text-zinc-600">Page:</span> {currentView||"unknown"}</div>
                  <div><span className="text-zinc-600">Time:</span> {timeStr}</div>
                  <div className="truncate"><span className="text-zinc-600">Browser:</span> {(navigator.userAgent||"").split(" ").slice(-2).join(" ")}</div>
                </div>
              </div>

              <div className="mb-3">
                <div className="text-zinc-400 text-[10px] uppercase tracking-wider mb-2">
                  Type of issue <span className="text-zinc-600 normal-case">(optional)</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map(c=>(
                    <button
                      key={c.id}
                      type="button"
                      onClick={()=>setCategory(category===c.id?"":c.id)}
                      className={`px-2 py-1 border text-[10px] uppercase tracking-wider font-mono transition-colors ${
                        category===c.id
                          ?"border-amber-600 bg-amber-950/30 text-amber-300"
                          :"border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500"
                      }`}
                    >{c.label}</button>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <div className="text-zinc-400 text-[10px] uppercase tracking-wider mb-1">Describe what happened</div>
                <textarea
                  value={description}
                  onChange={e=>setDescription(e.target.value.slice(0,1000))}
                  placeholder="What did you do? What happened? What did you expect?"
                  className="w-full bg-black border border-zinc-700 text-zinc-100 px-3 py-2 text-xs font-mono focus:border-amber-600 outline-none resize-y"
                  rows={5}
                />
                <div className="text-zinc-600 text-[9px] text-right mt-1">{description.length} / 1000</div>
              </div>

              {error&&<div className="text-rose-400 text-xs mb-2">{error}</div>}

              <div className="flex gap-2 justify-end border-t border-zinc-900 pt-3">
                <Btn onClick={onClose} variant="ghost">CANCEL</Btn>
                <button
                  onClick={submit}
                  disabled={loading||!description.trim()}
                  className={`px-3 py-1.5 border font-mono text-xs uppercase tracking-wider transition-colors ${
                    loading||!description.trim()
                      ?"opacity-30 cursor-not-allowed border-zinc-700 text-zinc-500"
                      :"bg-amber-600 border-amber-600 text-black hover:bg-amber-500 cursor-pointer"
                  }`}
                >{loading?"SUBMITTING...":"SUBMIT REPORT"}</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// CHANGE PASSWORD MODAL
function ChangePasswordModal({onClose,userEmail}){
  const [currentPwd,setCurrentPwd]=useState("");
  const [password,setPassword]=useState("");
  const [confirm,setConfirm]=useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [done,setDone]=useState(false);

  const save=async()=>{
    if(!currentPwd){setError("Enter your current password.");return;}
    if(!password||password.length<8){setError("New password must be at least 8 characters.");return;}
    if(password!==confirm){setError("Passwords don't match.");return;}
    if(password===currentPwd){setError("New password must be different from current.");return;}
    setLoading(true);setError("");
    try{
      // Verify current password by re-authenticating
      const{error:authErr}=await supabase.auth.signInWithPassword({email:userEmail,password:currentPwd});
      if(authErr){setError("Current password is incorrect.");setLoading(false);return;}
      // Now update to new password
      const{error:updErr}=await supabase.auth.updateUser({password});
      if(updErr){setError(updErr.message);setLoading(false);return;}
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
              <div><div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Current Password</div><input type="password" value={currentPwd} onChange={e=>setCurrentPwd(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 px-3 py-2 text-xs font-mono focus:border-lime-500 outline-none" placeholder="Required to verify it's you"/></div>
              <div><div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">New Password</div><input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 px-3 py-2 text-xs font-mono focus:border-lime-500 outline-none" placeholder="Min. 8 characters"/></div>
              <div><div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Confirm New Password</div><input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 px-3 py-2 text-xs font-mono focus:border-lime-500 outline-none" placeholder="Repeat new password" onKeyDown={e=>e.key==="Enter"&&save()}/></div>
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
function AppRoot(){
  const [appView,setAppView]=useState("loading");
  const [user,setUser]=useState(null);
  const [progress,setProgress]=useState(defaultProgress);
  const [studentView,setStudentView]=useState(false);

  const loadProgress=async(u)=>{
    try{
      const timeout=new Promise((_,reject)=>setTimeout(()=>reject(new Error("timeout")),5000));
      const query=supabase.from("progress").select("*").eq("id",u.id).maybeSingle();
      const{data,error}=await Promise.race([query,timeout]);
      // CRITICAL: distinguish "no row exists" from "query failed".
      // Only INSERT a fresh row if the query succeeded AND data is null (user doesn't exist).
      // If the query errored or timed out, do NOT overwrite — that would wipe existing progress.
      if(error){
        console.error("loadProgress query error:",error.message);
        // Keep whatever progress state is currently set; don't reset.
        return;
      }
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
        // Query succeeded but no row exists. This is a brand-new user → create the row.
        // Use INSERT (not upsert) to fail loudly if there's a race and a row was created concurrently.
        setProgress(defaultProgress);
        const{error:insErr}=await supabase.from("progress").insert({
          id:u.id,email:u.email,
          full_name:u.user_metadata?.full_name||u.email,
          level:1,placed:false,completed_modules:{},
          trivia_high_score:0,total_answered:0,total_correct:0,
          time_spent_seconds:0,current_module:null,current_question:0,
          current_answers:[],placement_idx:0,placement_picks:[],
          placement_score:null,updated_at:new Date().toISOString(),
        });
        if(insErr&&!insErr.message?.includes("duplicate")){
          console.error("loadProgress insert error:",insErr.message);
        }
      }
    }catch(e){
      // Timeouts and network errors: keep current state, log, don't reset.
      console.error("loadProgress threw (keeping current state):",e.message);
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
  if(appView==="landing")return <LandingPage onLogin={()=>setAppView("login")} onSignUp={()=>setAppView("signup")}/>;
  if(appView==="login")return <LoginPage onBack={()=>setAppView("landing")} onSuccess={()=>{}} onSignUp={()=>setAppView("signup")}/>;
  if(appView==="signup")return <SignUpPage onBack={()=>setAppView("landing")} onSuccess={()=>setAppView("login")}/>;

  if(appView==="app"&&user){
    const isAdmin=ADMIN_EMAILS.includes((user.email||"").toLowerCase());
    if(isAdmin&&!studentView){
      // Admin's "Home" = go to the student dashboard (their own user view), not the landing page.
      return <AdminDashboard user={user} onSignOut={signOut} onViewAsStudent={()=>setStudentView(true)} onGoHome={()=>setStudentView(true)}/>;
    }
    // In MainApp, "Home" should NOT log out; it should go back to landing only if they
    // explicitly want that (rare). For now, treat it as a no-op for signed-in users —
    // they're already on the dashboard if view==="dashboard", or they can use the menu.
    // The cleanest behavior: scroll to top + ensure they're at the dashboard view.
    return <MainApp user={user} progress={progress} setProgress={setProgress} onSignOut={()=>{setStudentView(false);signOut();}} onBackToAdmin={isAdmin?()=>setStudentView(false):null} onGoHome={()=>{/* signed-in users stay signed in; the menu button just returns to dashboard */}}/>;
  }

  if(appView==="app"&&!user)return(
    <div className="min-h-screen bg-black flex items-center justify-center font-mono text-sm">
      <div className="text-lime-400 animate-pulse">▸ LOADING...</div>
    </div>
  );

  return null;
}

// Wrap with ErrorBoundary at the root (B4)
export default function App(){
  return(
    <ErrorBoundary>
      <AppRoot/>
    </ErrorBoundary>
  );
}


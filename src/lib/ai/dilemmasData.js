/**
 * EcoMart Ethics Dilemma Scenarios
 * Curated sustainable consumer dilemmas where there is no objective single "right" answer.
 *
 * CBSE RESPONSIBLE AI RULE:
 * The AI explicitly refuses to pick for the user, explaining that value judgments
 * and priorities belong to human conscience, not algorithmic optimization.
 */

export const ETHICS_DILEMMAS = [
  {
    id: 'dilemma-fashion',
    title: 'Budget Fast-Fashion vs Multi-Year Hemp Investment',
    category: 'Textiles & Living Costs',
    badge: 'Affordability vs Durability',
    premise:
      'A college student on a ₹1,500 monthly discretionary allowance needs a warm jacket for a freezing winter semester.',
    optionA: {
      id: 'opt-a',
      title: 'Recycled Polyester Fleece (₹899)',
      summary: 'Immediately affordable, highly insulating, lightweight.',
      environmentalTradeoff:
        'Sheds microplastics during every washing cycle. Likely needs replacement in 1-2 years if zippers fail.',
      humanTradeoff: 'Leaves ₹600 for meals, transit, and textbooks without incurring debt.'
    },
    optionB: {
      id: 'opt-b',
      title: 'Hand-Woven Organic Hemp & Wool Parka (₹3,900)',
      summary: 'Ultra-durable, natural heirloom construction, 100% biodegradable.',
      environmentalTradeoff:
        'Near-zero synthetic microfiber pollution, natural organic fibers, lasts 10-15 years.',
      humanTradeoff:
        'Requires exhausting 2.5 months of total student savings or borrowing money from family.'
    },
    aiRefusalStatement:
      'I cannot and will not choose for you. Determining whether immediate economic survival or multi-year ecological preservation is superior is a subjective value judgment, not an algorithmic formula. Algorithms that shame low-income consumers for choosing affordable essentials commit socio-economic bias. The choice belongs to your personal ethics.',
    reflectionA:
      'You chose Option A (Immediate Affordability). This is a completely valid, pragmatic decision. Environmentalism cannot require personal financial destitution. To minimize harm with this fleece, wash it inside a microfiber-catching laundry bag and repair small seam tears rather than discarding it.',
    reflectionB:
      'You chose Option B (Long-Term Circularity). You prioritized durable heirloom longevity over immediate liquid savings. Over its 10-year lifespan, this parka avoids 5-7 replacement cycles and thousands of microplastic washes, representing an extraordinary ecological return on investment if you can absorb the upfront cashflow shock.'
  },
  {
    id: 'dilemma-packaging',
    title: 'Local Plastic Tub vs Air-Shipped European Glass Jar',
    category: 'Packaging & Logistics',
    badge: 'Transit Carbon vs Ocean Plastics',
    premise:
      'A small honey cooperative in Himachal Pradesh must choose packaging for their 5,000 annual honey harvests.',
    optionA: {
      id: 'opt-a',
      title: 'Locally Molded Food-Grade Polypropylene (#5 PP) Tub',
      summary: 'Manufactured 18km away in Baddi; extremely light (22g) and unbreakable.',
      environmentalTradeoff:
        'Near-zero freight transport carbon emissions; readily accepted by Indian municipal dry-waste recyclers. However, petroleum-derived plastic persists if littered.',
      humanTradeoff:
        'Keeps jar packaging cost at ₹12/unit, ensuring rural honey remains affordable for working-class families.'
    },
    optionB: {
      id: 'opt-b',
      title: 'Imported Heavy Borosilicate Glass Jar from Europe',
      summary: '100% inert, zero chemical leaching, infinitely recyclable, premium look.',
      environmentalTradeoff:
        'Zero plastic pollution risk. However, shipping 480g glass containers 11,000km via maritime container and diesel truck generates 8.4x more transport CO₂e.',
      humanTradeoff:
        'Increases packaging cost to ₹95/unit, tripling retail price and converting basic nutrition into an elite luxury item.'
    },
    aiRefusalStatement:
      'I explicitly decline to rank one above the other. Deciding whether global transit carbon emissions (climate warming) or terrestrial polymer persistence (ocean plastic pollution) is more catastrophic is an ongoing ecological debate with no objective consensus. No AI model should pretend this calculation has an objective mathematical winner.',
    reflectionA:
      'You chose Option A (Minimizing Logistics Carbon & Preserving Affordability). You prioritized low transport diesel emissions and broad community access over material purism. Setting up a local tub return discount program can prevent littering while keeping logistics hyper-efficient.',
    reflectionB:
      'You chose Option B (Zero Microplastics & Infinite Material Recyclability). You prioritized non-toxic inertness and absolute circularity over freight emissions. To offset the high transit carbon, the cooperative should incentivize customers to wash and reuse the glass jars endlessly for pantry storage.'
  },
  {
    id: 'dilemma-labor',
    title: 'Automated Energy-Efficient Mill vs Rural Handloom Cooperative',
    category: 'Social Justice & Energy',
    badge: 'Industrial Decarbonization vs Artisan Livelihoods',
    premise:
      'An annual inter-school eco summit is commissioning 1,200 cotton tote bags for delegates.',
    optionA: {
      id: 'opt-a',
      title: 'Solar-Powered Automated Textile Mill in Ahmedabad',
      summary: 'State-of-the-art robotic looms powered by on-site solar rooftop arrays.',
      environmentalTradeoff:
        'Consumes 45% less energy and 30% less water per meter of fabric due to automated closed-loop wastewater recovery.',
      humanTradeoff:
        'Requires only 2 factory technicians to run the entire batch. Profits flow to corporate shareholders.'
    },
    optionB: {
      id: 'opt-b',
      title: 'Khadi Handloom Cooperative in Mirzapur',
      summary: '100% human-powered spinning wheel (charkha) and pit-loom weaving.',
      environmentalTradeoff:
        'Zero electric kilowatt-hours consumed in weaving. However, small-batch traditional river retting has slightly higher artisanal water intensity.',
      humanTradeoff:
        'Provides 3 weeks of living-wage income directly to 18 rural women artisans, preserving cultural heritage.'
    },
    aiRefusalStatement:
      'I refuse to dictate this choice. Weighing technical thermodynamic efficiency (automated solar megawatt reduction) against human social equity (direct dignified rural employment) is an ethical choice of community values. Technocratic optimization often erases vulnerable human workers. The decision rests in your moral conscience.',
    reflectionA:
      'You chose Option A (Technological Energy Efficiency). You prioritized verifiable thermodynamic optimization and closed-loop water treatment. Modern automated infrastructure is vital for large-scale industrial decarbonization.',
    reflectionB:
      'You chose Option B (Human-Centered Social Justice). You recognized that sustainability is meaningless without human dignity and fair-wage livelihoods. Empowering decentralized artisan women creates resilient communities resistant to urban migration distress.'
  },
  {
    id: 'dilemma-convenience',
    title: '15-Minute Delivery App vs Saturday Walk-to-Refill Kirana',
    category: 'Urban Living & Convenience',
    badge: 'Time Poverty vs Zero Waste',
    premise:
      'An exhausted working parent balancing a 50-hour corporate week runs out of floor cleaner on a Thursday night.',
    optionA: {
      id: 'opt-a',
      title: 'Instant 15-Minute Dark-Store App Delivery',
      summary: 'Pre-packaged in single-use multi-layer plastic sachet, delivered immediately to the doorstep.',
      environmentalTradeoff:
        'Generates non-recyclable plastic packaging film and dedicated two-wheeler petrol trip.',
      humanTradeoff:
        'Frees up 90 minutes of precious evening rest to spend bedtime reading with a young child.'
    },
    optionB: {
      id: 'opt-b',
      title: 'Saturday Morning Walk to Zero-Waste Kirana Refill Station',
      summary: 'Carry clean reusable glass bottle 1.2km to dispense bulk neem concentrate.',
      environmentalTradeoff:
        'Zero packaging waste, zero motorized delivery transport emissions.',
      humanTradeoff:
        'Consumes Saturday morning rest; requires living in a neighborhood that actually possesses a bulk refill store.'
    },
    aiRefusalStatement:
      'I refuse to pass moral judgment. Algorithms must never guilt consumers who face severe time poverty or caretaking duties. Zero-waste lifestyle ideals often assume the consumer possesses abundant leisure time and physical proximity to specialized infrastructure. Your priority is entirely yours to decide.',
    reflectionA:
      'You chose Option A (Caretaking & Time Preservation). You honored human mental health and family presence over zero-waste rigidity. Sustainability is a marathon, not a puritanical test; accepting convenience during high-stress periods is healthy and realistic.',
    reflectionB:
      'You chose Option B (Intentional Zero-Waste Effort). You chose to invest personal time and physical energy into breaking the single-use cycle. Supporting local bulk dispensaries builds communal refill infrastructure for everyone in the neighborhood.'
  }
];

// Colorado Family Law Constants and Calculations
// Based on Colorado Revised Statutes Title 14

type CountyKey = 'denver' | 'arapahoe' | 'jefferson' | 'boulder';
type Counties = Record<CountyKey, {
  name: string; jurisdiction: string; localRules: string; efile: boolean; mediation: string;
}>;

export const COLORADO_LAWS = {
  childSupport: {
    // Based on CRS 14-10-115 and current income shares model
    basicObligation: {
      1: 1056,   // One child
      2: 1328,   // Two children  
      3: 1536,   // Three children
      4: 1680,   // Four children
      5: 1790,   // Five children
      6: 1900,   // Six or more children
    },
    
    // Parenting time adjustments per Colorado guidelines
    parentingTimeAdjustments: {
      overnight92to109: 0.0,      // 92-109 nights (standard)
      overnight110to127: 0.10,    // 110-127 nights (10% reduction)
      overnight128to142: 0.25,    // 128-142 nights (25% reduction) 
      overnight143to182: 0.50,    // 143-182 nights (50% reduction)
      overnightEqual183: 0.75,    // 183+ nights (75% reduction)
    },
    
    // Income thresholds and caps
    lowIncomeThreshold: 1050,     // Monthly gross income threshold
    highIncomeThreshold: 30000,   // Monthly gross income threshold
    
    // Colorado-specific deviations
    deviationFactors: {
      extraordinaryMedical: true,
      extraordinaryExpenses: true,
      educationalExpenses: true,
      travelCosts: true,
      otherChildren: true
    }
  },
  
  parentingTime: {
    // Colorado parenting time guidelines
    standardSchedule: {
      weekdayHours: 4,              // Typical weekday parenting time
      weekendHours: 48,             // Weekend parenting time (Fri 6pm - Sun 6pm)
      holidayRotation: 'alternating', // Holiday schedule
      summerWeeks: 4,               // Extended summer parenting time
    },
    
    // Best interests factors per CRS 14-10-124
    bestInterestsFactors: [
      'wishes_of_child',
      'wishes_of_parents', 
      'interaction_and_interrelationship',
      'childs_adjustment',
      'mental_physical_health',
      'physical_proximity',
      'ability_to_encourage_relationship',
      'history_of_involvement',
      'domestic_violence_history'
    ]
  },
  
  // Official Colorado JDF forms
  forms: {
    JDF_1111: {
      name: "Petition for Dissolution of Marriage or Legal Separation",
      required: ["petitioner", "respondent", "marriage_date", "separation_date", "jurisdiction_basis"],
      coloradoSpecific: true,
      courtFees: 230.00
    },
    JDF_1113: {
      name: "Parenting Plan", 
      required: ["children", "residential_schedule", "decision_making", "parenting_time"],
      coloradoSpecific: true,
      mustInclude: ["holiday_schedule", "transportation", "communication"]
    },
    JDF_1115: {
      name: "Permanent Orders",
      required: ["child_support", "parenting_time", "property_division"],
      coloradoSpecific: true
    },
    JDF_1360: {
      name: "Child Support Calculation",
      required: ["gross_income_a", "gross_income_b", "children_count", "overnight_schedule"],
      coloradoSpecific: true,
      calculation: "income_shares_model"
    }
  },
  
  // Colorado county-specific information
  counties: {
    denver: {
      name: "Denver County",
      jurisdiction: "2nd Judicial District", 
      localRules: "D.C.R.L.M.",
      efile: true,
      mediation: "mandatory_for_parenting"
    },
    arapahoe: {
      name: "Arapahoe County",
      jurisdiction: "18th Judicial District",
      localRules: "18th J.D. Local Rules", 
      efile: true,
      mediation: "mandatory_for_parenting"
    },
    jefferson: {
      name: "Jefferson County", 
      jurisdiction: "1st Judicial District",
      localRules: "1st J.D. Local Rules",
      efile: true,
      mediation: "mandatory_for_parenting"
    },
    boulder: {
      name: "Boulder County",
      jurisdiction: "20th Judicial District", 
      localRules: "20th J.D. Local Rules",
      efile: true,
      mediation: "mandatory_for_parenting"
    }
  } as Counties,
  
  // Colorado deadlines and timelines
  deadlines: {
    response_to_petition: 21,        // Days to respond to petition
    financial_disclosures: 42,       // Days to exchange financial info
    permanent_orders_hearing: 182,   // Days for permanent orders
    appeal_deadline: 49,             // Days to file appeal
    modification_waiting_period: 730 // Days before modification (2 years)
  }
};

// Validation functions for Colorado-specific requirements
export const validation = {
  isValidColoradoCounty(county: string): boolean {
    return Object.keys(COLORADO_LAWS.counties).includes(county.toLowerCase() as CountyKey);
  },
  
  isValidJDFForm(formNumber: string): boolean {
    return Object.keys(COLORADO_LAWS.forms).includes(formNumber.toUpperCase());
  },
  
  requiresMediation(caseType: string, county: string): boolean {
    const countyInfo = COLORADO_LAWS.counties[county.toLowerCase() as CountyKey];
    return countyInfo?.mediation === "mandatory_for_parenting" && 
           caseType.includes("parenting");
  }
};
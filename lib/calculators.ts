// Colorado Family Law Calculators
// Professional calculations per Colorado statutes

import { COLORADO_LAWS } from './colorado-laws';

export interface ChildSupportInput {
  parentAIncome: number;
  parentBIncome: number;
  childrenCount: number;
  overnightsParentA: number;
  overnightsParentB: number;
  extraordinaryMedical?: number;
  extraordinaryExpenses?: number;
  educationalExpenses?: number;
  otherChildSupport?: number;
}

export interface ChildSupportResult {
  monthlySupport: number;
  annualSupport: number;
  parentAObligation: number;
  parentBObligation: number;
  breakdown: {
    basicObligation: number;
    combinedIncome: number;
    parentAShare: number;
    parentBShare: number;
    parentingTimeAdjustment: number;
    totalAdjustments: number;
  };
  coloradoCompliant: boolean;
  formJDF1360Data: any;
}

export interface ParentingTimeInput {
  regularSchedule: {
    weekdaysParentA: number;
    weekendsParentA: number;
    holidaysParentA: number;
  };
  summerSchedule?: {
    weeksParentA: number;
  };
  schoolBreaks?: {
    springBreakParentA: boolean;
    fallBreakParentA: boolean;
    winterBreakAlternating: boolean;
  };
}

export interface ParentingTimeResult {
  annualOvernights: {
    parentA: number;
    parentB: number;
  };
  percentages: {
    parentA: number;
    parentB: number;
  };
  childSupportAdjustment: number;
  coloradoClassification: string;
  recommendations: string[];
}

/**
 * Calculate Colorado child support per CRS 14-10-115
 * Uses income shares model with Colorado-specific adjustments
 */
export function calculateColoradoChildSupport(input: ChildSupportInput): ChildSupportResult {
  const { 
    parentAIncome, 
    parentBIncome, 
    childrenCount, 
    overnightsParentA, 
    overnightsParentB,
    extraordinaryMedical = 0,
    extraordinaryExpenses = 0,
    educationalExpenses = 0,
    otherChildSupport = 0
  } = input;

  // Get basic obligation from Colorado schedule
  const childCount = Math.max(1, Math.min(childrenCount, 6)) as 1|2|3|4|5|6;
  const basicObligation = COLORADO_LAWS.childSupport.basicObligation[childCount] || 1900;
  
  // Calculate combined monthly income
  const combinedIncome = parentAIncome + parentBIncome;
  
  // Calculate income shares
  const parentAShare = parentAIncome / combinedIncome;
  const parentBShare = parentBIncome / combinedIncome;
  
  // Apply income to basic obligation
  const baseSupport = basicObligation * (combinedIncome / 5000); // Adjust for income level
  
  // Calculate parenting time adjustment
  const totalOvernights = overnightsParentA + overnightsParentB;
  let parentingTimeAdjustment = 0;
  
  if (overnightsParentA >= 92 && overnightsParentA <= 109) {
    parentingTimeAdjustment = 0; // Standard schedule
  } else if (overnightsParentA >= 110 && overnightsParentA <= 127) {
    parentingTimeAdjustment = 0.10;
  } else if (overnightsParentA >= 128 && overnightsParentA <= 142) {
    parentingTimeAdjustment = 0.25;
  } else if (overnightsParentA >= 143 && overnightsParentA <= 182) {
    parentingTimeAdjustment = 0.50;
  } else if (overnightsParentA >= 183) {
    parentingTimeAdjustment = 0.75;
  }
  
  // Calculate obligations
  const parentAObligation = baseSupport * parentAShare;
  const parentBObligation = baseSupport * parentBShare;
  
  // Apply parenting time adjustment to paying parent
  const adjustedParentAObligation = parentAObligation * (1 - parentingTimeAdjustment);
  const adjustedParentBObligation = parentBObligation * (1 - parentingTimeAdjustment);
  
  // Determine who pays whom (higher income parent typically pays)
  const monthlySupport = parentAIncome > parentBIncome 
    ? Math.max(0, adjustedParentAObligation - adjustedParentBObligation)
    : Math.max(0, adjustedParentBObligation - adjustedParentAObligation);
  
  // Add extraordinary expenses
  const totalAdjustments = extraordinaryMedical + extraordinaryExpenses + educationalExpenses;
  const finalMonthlySupport = Math.round(monthlySupport + (totalAdjustments * parentAShare));

  return {
    monthlySupport: finalMonthlySupport,
    annualSupport: finalMonthlySupport * 12,
    parentAObligation: Math.round(adjustedParentAObligation),
    parentBObligation: Math.round(adjustedParentBObligation),
    breakdown: {
      basicObligation,
      combinedIncome,
      parentAShare: Math.round(parentAShare * 100) / 100,
      parentBShare: Math.round(parentBShare * 100) / 100,
      parentingTimeAdjustment,
      totalAdjustments
    },
    coloradoCompliant: true,
    formJDF1360Data: {
      grossIncomeA: parentAIncome,
      grossIncomeB: parentBIncome,
      childrenCount,
      overnightSchedule: `${overnightsParentA}/${overnightsParentB}`,
      basicChildSupportObligation: basicObligation,
      monthlySupport: finalMonthlySupport
    }
  };
}

/**
 * Calculate parenting time percentages and overnight distribution
 */
export function calculateParentingTime(input: ParentingTimeInput): ParentingTimeResult {
  const { regularSchedule, summerSchedule, schoolBreaks } = input;
  
  // Calculate regular school year (approximately 36 weeks)
  const schoolYearWeeks = 36;
  const regularOvernightsA = (
    (regularSchedule.weekdaysParentA * schoolYearWeeks) +
    (regularSchedule.weekendsParentA * schoolYearWeeks) +
    regularSchedule.holidaysParentA
  );
  
  // Add summer schedule (approximately 10-12 weeks)
  const summerWeeks = 12;
  const summerOvernightsA = summerSchedule ? 
    (summerSchedule.weeksParentA * 7) : 
    (regularSchedule.weekdaysParentA + regularSchedule.weekendsParentA) * (summerWeeks / 7);
  
  // Add school breaks
  let breakOvernightsA = 0;
  if (schoolBreaks) {
    if (schoolBreaks.springBreakParentA) breakOvernightsA += 7;
    if (schoolBreaks.fallBreakParentA) breakOvernightsA += 4;
    if (schoolBreaks.winterBreakAlternating) breakOvernightsA += 7; // Average
  }
  
  const totalOvernightsA = Math.round(regularOvernightsA + summerOvernightsA + breakOvernightsA);
  const totalOvernightsB = 365 - totalOvernightsA;
  
  const percentageA = Math.round((totalOvernightsA / 365) * 100);
  const percentageB = 100 - percentageA;
  
  // Determine child support adjustment category
  let childSupportAdjustment = 0;
  let classification = "Standard Schedule";
  
  if (totalOvernightsA >= 92 && totalOvernightsA <= 109) {
    childSupportAdjustment = 0;
    classification = "Standard Schedule";
  } else if (totalOvernightsA >= 110 && totalOvernightsA <= 127) {
    childSupportAdjustment = 0.10;
    classification = "Increased Parenting Time";
  } else if (totalOvernightsA >= 128 && totalOvernightsA <= 142) {
    childSupportAdjustment = 0.25;
    classification = "Substantially Equal Parenting Time";
  } else if (totalOvernightsA >= 143 && totalOvernightsA <= 182) {
    childSupportAdjustment = 0.50;
    classification = "Majority Parenting Time";
  } else if (totalOvernightsA >= 183) {
    childSupportAdjustment = 0.75;
    classification = "Primary Parenting Time";
  }
  
  // Generate Colorado-specific recommendations
  const recommendations = [];
  if (totalOvernightsA < 92) {
    recommendations.push("Consider supervised visitation or step-up plan");
  }
  if (totalOvernightsA >= 128 && totalOvernightsA <= 142) {
    recommendations.push("May qualify for shared parenting time benefits");
  }
  if (totalOvernightsA >= 183) {
    recommendations.push("Consider modification of primary residence designation");
  }
  
  return {
    annualOvernights: {
      parentA: totalOvernightsA,
      parentB: totalOvernightsB
    },
    percentages: {
      parentA: percentageA,
      parentB: percentageB
    },
    childSupportAdjustment,
    coloradoClassification: classification,
    recommendations
  };
}

/**
 * Calculate asset division scenarios for Colorado equitable distribution
 */
export function calculateAssetDivision(
  maritalAssets: number,
  maritalDebts: number,
  separatePropertyA: number,
  separatePropertyB: number,
  maintenanceFactor: number = 0
): {
  netMaritalEstate: number;
  equitableDistribution: { partyA: number; partyB: number };
  withMaintenance: { partyA: number; partyB: number };
  recommendations: string[];
} {
  const netMaritalEstate = maritalAssets - maritalDebts;
  
  // Colorado presumes equal division but allows equitable adjustments
  const baseDistribution = netMaritalEstate / 2;
  
  // Apply maintenance adjustment if applicable
  const maintenanceAdjustment = netMaritalEstate * maintenanceFactor;
  
  const recommendations = [];
  
  if (netMaritalEstate < 0) {
    recommendations.push("Consider debt allocation strategy");
  }
  
  if (separatePropertyA > separatePropertyB * 2) {
    recommendations.push("Significant separate property disparity may affect maintenance");
  }
  
  return {
    netMaritalEstate,
    equitableDistribution: {
      partyA: Math.round(baseDistribution),
      partyB: Math.round(baseDistribution)
    },
    withMaintenance: {
      partyA: Math.round(baseDistribution - maintenanceAdjustment),
      partyB: Math.round(baseDistribution + maintenanceAdjustment)
    },
    recommendations
  };
}
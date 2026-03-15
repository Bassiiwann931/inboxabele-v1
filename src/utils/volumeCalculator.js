/**
 * Volume calculator for email warmup plans.
 *
 * Supported planTypes: COLD | MIGRATION | REHAB
 *
 * @param {Object} intake
 * @param {string} intake.planType       - COLD | MIGRATION | REHAB
 * @param {number} intake.totalListSize  - Total addressable list
 * @param {number} intake.engagementRate - Historical open/engagement rate (0–1)
 * @param {number} intake.targetVolume   - Desired steady-state daily sends
 * @param {number} intake.durationDays   - How many days the schedule should span
 *
 * @returns {Array<{day: number, dailyVolume: number, phase: string, segments: Array, throttleHours: number}>}
 */

const PLAN_CONFIG = {
  COLD:      { startPct: 0.001, dailyGrowth: 0.20 },
  MIGRATION: { startPct: 0.010, dailyGrowth: 0.30 },
  REHAB:     { startPct: 0.0005, dailyGrowth: 0.15 },
};

const PHASE_GATE_OPEN_RATE = 0.15; // 15% open rate required to advance phase

// Phase boundaries
const WARMUP_END_DAY = 7;
const RAMP_END_DAY   = 14;
// "Scale" phase starts day 15+

function getPhase(day, openRateMet) {
  if (day <= WARMUP_END_DAY) return 'warmup';
  if (day <= RAMP_END_DAY) {
    // Advancing from warmup → ramp requires the open rate gate
    return openRateMet ? 'ramp' : 'warmup_extended';
  }
  return openRateMet ? 'scale' : 'ramp_extended';
}

function buildSegments(dailyVolume, engagementRate, totalListSize) {
  // Split volume across engagement tiers: highly-engaged first, then mid, then cold
  const highEngaged  = Math.round(dailyVolume * 0.5);
  const midEngaged   = Math.round(dailyVolume * 0.35);
  const lowEngaged   = dailyVolume - highEngaged - midEngaged;

  return [
    { name: 'Highly Engaged',  size: Math.round(totalListSize * engagementRate * 0.6), sends: highEngaged },
    { name: 'Mid Engaged',     size: Math.round(totalListSize * engagementRate * 0.4), sends: midEngaged },
    { name: 'Low / Unengaged', size: Math.round(totalListSize * (1 - engagementRate)),  sends: lowEngaged },
  ];
}

function calcThrottleHours(dailyVolume) {
  // Spread sends proportionally; small volumes in a short window, large volumes need more throttling
  if (dailyVolume <= 500)    return 2;
  if (dailyVolume <= 5000)   return 6;
  if (dailyVolume <= 20000)  return 12;
  return 24;
}

export function calculateVolume({ planType, totalListSize, engagementRate, targetVolume, durationDays }) {
  const config = PLAN_CONFIG[planType];
  if (!config) throw new Error(`Unknown planType: ${planType}`);

  const maxFirst14Days = totalListSize * 0.20;
  const startVolume = Math.max(1, Math.round(totalListSize * config.startPct));

  // Whether we assume the open-rate gate is met (plan is generated optimistically)
  // In a live system this would come from real metrics; here we assume it's met after warmup.
  const assumedGateMet = true;

  const schedule = [];
  let currentVolume = startVolume;

  for (let day = 1; day <= durationDays; day++) {
    // Apply 20%-of-list cap for first 14 days
    const cappedVolume = day <= RAMP_END_DAY
      ? Math.min(currentVolume, maxFirst14Days)
      : currentVolume;

    // Don't exceed the desired targetVolume
    const dailyVolume = Math.min(Math.round(cappedVolume), targetVolume);

    const phase = getPhase(day, assumedGateMet);
    const segments = buildSegments(dailyVolume, engagementRate, totalListSize);
    const throttleHours = calcThrottleHours(dailyVolume);

    schedule.push({ day, dailyVolume, phase, segments, throttleHours });

    // Grow for next day
    currentVolume = currentVolume * (1 + config.dailyGrowth);
  }

  return schedule;
}

export { PHASE_GATE_OPEN_RATE, PLAN_CONFIG };

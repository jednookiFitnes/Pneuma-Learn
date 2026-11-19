import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateRiskGraph,
  calculateEspeDistance,
  calculateMttfdFromB10d,
  symmetrizeChannelsMttfd,
  calculateDcAvg,
  evaluateCcfScore,
  evaluateAchievedPl,
  computeUserRank,
  CCF_CRITERIA,
} from './safetyMath';
import { simulateCircuit } from './simulatorEngine';
import { IFA_EXAMPLES } from '../data/ifaExamples';

test('EN ISO 13849-1 Risk Graph resolves S/F/P combinations accurately', () => {
  assert.equal(
    evaluateRiskGraph({ severity: 'S1', frequency: 'F1', possibility: 'P1' }).finalPlr,
    'a'
  );
  assert.equal(
    evaluateRiskGraph({ severity: 'S1', frequency: 'F2', possibility: 'P2' }).finalPlr,
    'c'
  );
  assert.equal(
    evaluateRiskGraph({ severity: 'S2', frequency: 'F1', possibility: 'P2' }).finalPlr,
    'd'
  );
  assert.equal(
    evaluateRiskGraph({ severity: 'S2', frequency: 'F2', possibility: 'P2' }).finalPlr,
    'e'
  );
  assert.equal(
    evaluateRiskGraph({
      severity: 'S2',
      frequency: 'F2',
      possibility: 'P2',
      lowProbabilityReduction: true,
    }).finalPlr,
    'd'
  );
});

test('EN ISO 13855 ESPE safety distance computes hand/body/single-beam formulas', () => {
  const fineShort = calculateEspeDistance({
    mode: 'hand_fine',
    resolutionMm: 20,
    stoppingTimeMs: 100,
  });
  // S = 2000 * 0.1 + 8*(20-14) = 200 + 48 = 248 mm
  assert.equal(fineShort.finalSMm, 248);

  const fineLong = calculateEspeDistance({
    mode: 'hand_fine',
    resolutionMm: 30,
    stoppingTimeMs: 300,
  });
  // 2000*0.3 + 128 = 728 > 500 -> recalculates with K=1600 -> 1600*0.3 + 128 = 608 mm
  assert.equal(fineLong.kMmPerSec, 1600);
  assert.equal(fineLong.finalSMm, 608);

  const twoHand = calculateEspeDistance({
    mode: 'two_hand',
    resolutionMm: 0,
    stoppingTimeMs: 200,
  });
  // 1600 * 0.2 + 250 = 570 mm
  assert.equal(twoHand.finalSMm, 570);
});

test('IFA Report MTTFD, T10D, capping, and symmetrization calculations match standard', () => {
  const res = calculateMttfdFromB10d({
    b10d: 20_000_000,
    dOp: 250,
    hOp: 16,
    tCycleSec: 10,
    category: '3',
  });
  // nop = 250 * 16 * 3600 / 10 = 1,440,000 cycles/year
  assert.equal(res.nOpPerYear, 1_440_000);
  // T10D = 20,000,000 / 1,440,000 = 13.888... < 20 -> warning true
  assert.equal(res.preventiveReplacementWarning, true);
  // MTTFd raw = 138.88 -> capped at 100 for Cat 3
  assert.equal(res.cappedMttfdYears, 100);
  assert.equal(res.band, 'high');

  const resCat4 = calculateMttfdFromB10d({
    b10d: 20_000_000,
    dOp: 250,
    hOp: 16,
    tCycleSec: 10,
    category: '4',
  });
  assert.equal(resCat4.capLimitYears, 2500);
  assert.ok(resCat4.cappedMttfdYears > 138 && resCat4.cappedMttfdYears < 139);

  // Symmetrization of equal 100-year channels should equal 100
  assert.equal(Math.round(symmetrizeChannelsMttfd(100, 100, '3')), 100);
  // Symmetrization of 100 and 10 -> 2/3 * (110 - 1/(0.01+0.1)) = 2/3*(110 - 9.09) = 67.27
  const sym = symmetrizeChannelsMttfd(100, 10, '3');
  assert.ok(sym > 67 && sym < 68);
});

test('DCavg, CCF checklist, and Achieved PL evaluation behave strictly per EN ISO 13849-1', () => {
  const dc = calculateDcAvg([
    { mttfdYears: 100, dcPercent: 99 },
    { mttfdYears: 100, dcPercent: 90 },
  ]);
  assert.equal(dc.dcAvgPercent, 94.5);
  assert.equal(dc.level, 'medium');

  const allCcf = evaluateCcfScore(CCF_CRITERIA.map((c) => c.id));
  assert.equal(allCcf.score, 100);
  assert.equal(allCcf.passed, true);

  const partialCcf = evaluateCcfScore(['separation', 'diversity', 'overpressure']); // 15+20+15 = 50
  assert.equal(partialCcf.score, 50);
  assert.equal(partialCcf.passed, false);

  const cat4Ok = evaluateAchievedPl({
    category: '4',
    dcLevel: 'high',
    mttfdBand: 'high',
    ccfPassed: true,
  });
  assert.equal(cat4Ok.achievedPl, 'e');
  assert.equal(cat4Ok.compliantArchitecture, true);

  const cat4FailDc = evaluateAchievedPl({
    category: '4',
    dcLevel: 'medium',
    mttfdBand: 'high',
    ccfPassed: true,
  });
  assert.equal(cat4FailDc.achievedPl, null);
  assert.equal(cat4FailDc.compliantArchitecture, false);
});

test('Simulator engine detects air traps on vertical axis without mechanical lock and detects VOFA faults', () => {
  const unsafeStop = simulateCircuit('vertical_axis_hgl_dncke', 'safety_demand', false);
  assert.equal(unsafeStop.residualEnergyRisk, 'high');
  assert.equal(unsafeStop.safetySeverity, 'danger');
  assert.equal(unsafeStop.lines.workLineA, 'trapped');

  const safeMechStop = simulateCircuit('vertical_axis_hgl_dncke', 'safety_demand', true);
  assert.equal(safeMechStop.mechBrakeEngaged, true);
  assert.equal(safeMechStop.safetySeverity, 'warning');

  const vofaFault = simulateCircuit('press_vofa_dual', 'single_fault', false);
  assert.equal(vofaFault.sensorFeedbackOk, false);
  assert.equal(vofaFault.chamberABar, 0);
});

test('User rank progression computes levels properly', () => {
  assert.equal(computeUserRank(0).level, 1);
  assert.equal(computeUserRank(200).level, 2);
  assert.equal(computeUserRank(650).level, 4);
});

test('IFA Report 2/2017e pneumatic dataset contains all 6 canonical examples with complete states', () => {
  assert.deepEqual(
    IFA_EXAMPLES.map((e) => e.exampleNumber),
    [2, 11, 14, 25, 26, 31]
  );
  assert.deepEqual(
    IFA_EXAMPLES.map((e) => `${e.category}/${e.pl}`),
    ['1/c', '2/d', '3/d', '3/e', '3/e', '4/e']
  );
  for (const ex of IFA_EXAMPLES) {
    assert.ok(ex.states.normal.summary.length > 20);
    assert.ok(ex.states.safety_demand.summary.length > 20);
    assert.ok(ex.states.single_fault.summary.length > 20);
    assert.ok(ex.whyThisCategory.summary.length > 20);
    assert.ok(ex.specialistWarning.length > 20);
  }
});

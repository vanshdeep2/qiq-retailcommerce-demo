/**
 * Generates Crestline retail ecommerce contact dataset (10,000 records, 8 weeks).
 * Run: node scripts/generate-crestline-dataset.mjs
 */
import { writeFileSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { randomUUID } from 'crypto'
import {
  DRIVER_TAXONOMY,
  L1_CATEGORIES,
  L1_WEIGHTS,
  L2_WEIGHTS,
  isHighRiskDriver,
  pickWeightedDriver,
} from '../src/data/contactDriverTaxonomy.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUT = join(ROOT, 'public', 'data', 'contact_search_data.json')
const STATS_OUT = join(ROOT, 'scripts', 'dataset-stats.json')

const TOTAL = 10000
const WEEKS = 8
const PER_WEEK = TOTAL / WEEKS

const WEEK_BOUNDARIES = [
  { start: '2026-04-06', end: '2026-04-12', label: 'W1' },
  { start: '2026-04-13', end: '2026-04-19', label: 'W2' },
  { start: '2026-04-20', end: '2026-04-26', label: 'W3' },
  { start: '2026-04-27', end: '2026-05-03', label: 'W4' },
  { start: '2026-05-04', end: '2026-05-10', label: 'W5' },
  { start: '2026-05-11', end: '2026-05-17', label: 'W6' },
  { start: '2026-05-18', end: '2026-05-24', label: 'W7' },
  { start: '2026-05-25', end: '2026-05-31', label: 'W8' },
]

const CHANNELS = ['voice', 'email', 'chat']
const CHANNEL_WEIGHTS = [0.65, 0.22, 0.13]

const FEATURED_AGENTS = [
  'Michael Naidoo', 'Nomsa Dlamini', 'Lerato Nkosi', 'Pieter Botha', 'Busisiwe Maseko',
  'Ayanda Mbeki', 'Zanele Ndlovu', 'Thabo van der Merwe', 'Janine Jacobs', 'Sipho Khumalo',
]

const COACHED_AGENTS = ['Lerato Nkosi', 'Pieter Botha', 'Busisiwe Maseko', 'Ayanda Mbeki']

const EXTRA_AGENTS = [
  'Andile Zulu', 'Bongani Ngcobo', 'Candice Pretorius', 'Dumisani Mthembu', 'Elize Steyn',
  'Fikile Xaba', 'Gugu Mhlongo', 'Hendrik Kruger', 'Ingrid Bothma', 'Jabulani Sithole',
  'Karabo Molefe', 'Lungile Cele', 'Mandla Dube', 'Naledi Mokoena', 'Oscar Viljoen',
  'Palesa Radebe', 'Quinton Fourie', 'Refilwe Modise', 'Sibusiso Gumede', 'Themba Nkuna',
  'Unathi Qwabe', 'Vuyisile Mabaso', 'Willem de Klerk', 'Xolani Mbatha', 'Yolanda Swart',
  'Zinhle Buthelezi', 'Amahle Nkomo', 'Bheki Zondi', 'Chantelle van Wyk', 'Dineo Kgosana',
  'Ebrahim Patel', 'Fatima Osman', 'Gert van Heerden', 'Hlengiwe Shange', 'Isaac Mnguni',
  'Johan Erasmus', 'Kgomotso Seboko', 'Lerato Mabena', 'Mpho Tshabalala', 'Nhlanhla Mkhize',
  'Olwethu Dlamini', 'Phumzile Nxumalo', 'Riaan Louw', 'Sello Mahlangu', 'Thandiwe Maseko',
  'Ulrich van Niekerk', 'Vusi Ndaba', 'Wandile Khoza', 'Xoliswa Mthethwa', 'Yusuf Adams',
  'Zodwa Maphumulo', 'Anathi Bhengu', 'Brenton Jacobs', 'Cebile Mkhwanazi', 'Daniel Mokoena',
  'Elsabe Venter', 'Fanie Coetzee', 'Gcinile Mabaso', 'Hermanus du Plessis', 'Itumeleng Moloi',
  'Jaco van Zyl', 'Keabetswe Modise', 'Lindiwe Nkabinde', 'Marius Steenkamp', 'Nokuthula Zungu',
  'Oupa Moleko', 'Petra van der Berg', 'Qinisile Mthembu', 'Rethabile Mokoena', 'Stefan Nel',
  'Tshepo Molefe', 'Unathi Mabena', 'Vernon Pieterse', 'Winnie Mabaso', 'Xander van Rooyen',
]

const ALL_AGENTS = [...FEATURED_AGENTS, ...EXTRA_AGENTS].slice(0, 85)

const CF_WEEKLY_TARGET = [77, 82, 105, 123, 59, 45, 32, 41]

const FEATURED_CF_CALLS = [
  { callId: 'CL-RX-CF0001', agent: 'Pieter Botha', date: '2026-04-14', cfType: 'policy_misquote' },
  { callId: 'CL-RX-CF0002', agent: 'Lerato Nkosi', date: '2026-04-22', cfType: 'no_resolution_confirmation' },
  { callId: 'CL-RX-CF0003', agent: 'Ayanda Mbeki', date: '2026-05-01', cfType: 'verification_failure' },
  { callId: 'CL-RX-CF0004', agent: 'Zanele Ndlovu', date: '2026-05-08', cfType: 'escalation_avoidance' },
  { callId: 'CL-RX-CF0005', agent: 'Busisiwe Maseko', date: '2026-04-18', cfType: 'no_case_notes' },
]

const CF_TYPES = [
  { id: 'policy_misquote', label: 'Policy misquote: 14-day returns window stated (policy is 30 days)', pillar: 'Business Policy' },
  { id: 'no_resolution_confirmation', label: 'No resolution confirmation: call closed without refund status or timeline', pillar: 'Resolution & Close' },
  { id: 'no_case_notes', label: 'No case notes: repeat contact where prior interaction had no documentation', pillar: 'Documentation Accuracy' },
  { id: 'escalation_avoidance', label: 'Escalation avoidance: criteria met but not escalated, third contact from same customer', pillar: 'Escalation' },
  { id: 'verification_failure', label: 'Verification failure: return processed without identity verification', pillar: 'Verification' },
]

const HIGH_RISK_L2_PICK = ['Returns & Exchanges', 'Refund Requests', 'Billing & Refunds', 'Order Issues']

const FIRST_NAMES = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Jamie', 'Avery', 'Quinn', 'Blake', 'Drew', 'Skyler', 'Cameron', 'Reese', 'Parker']
const LAST_NAMES = ['Miller', 'Davis', 'Wilson', 'Brown', 'Garcia', 'Martinez', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Robinson', 'Clark']

const REPEAT_CLUSTERS = Array.from({ length: 205 }, (_, i) => ({
  order: `CL-ORD-${10000 + i}`,
  customer: `${FIRST_NAMES[i % 15]} ${LAST_NAMES[i % 15]}`,
  contacts: 2 + (i % 3),
}))

let seed = 42
function rand() {
  seed = (seed * 16807) % 2147483647
  return (seed - 1) / 2147483646
}

function pickWeighted(items, weights) {
  const r = rand()
  let acc = 0
  for (let i = 0; i < items.length; i++) {
    acc += weights[i]
    if (r < acc) return items[i]
  }
  return items[items.length - 1]
}

function pick(arr) {
  return arr[Math.floor(rand() * arr.length)]
}

function pickDriver(opts = {}) {
  if (opts.l1 && opts.l2) return { l1: opts.l1, l2: opts.l2 }
  if (opts.l1) {
    const l2Items = DRIVER_TAXONOMY[opts.l1]
    const weights = L2_WEIGHTS[opts.l1]
    const l2Weights = l2Items.map((l2) => weights[l2] ?? 1 / l2Items.length)
    return { l1: opts.l1, l2: pickWeighted(l2Items, l2Weights) }
  }
  if (opts.forceHighRisk) {
    const l1 = pick(['Orders & Transactions', 'Billing & Payments'])
    const l2Items = DRIVER_TAXONOMY[l1].filter((l2) => HIGH_RISK_L2_PICK.includes(l2) || l2.includes('Refund') || l2.includes('Returns'))
    return { l1, l2: pick(l2Items.length ? l2Items : DRIVER_TAXONOMY[l1]) }
  }
  return pickWeightedDriver(rand)
}

function dateInWeek(weekIdx) {
  const w = WEEK_BOUNDARIES[weekIdx]
  const start = new Date(w.start)
  const end = new Date(w.end)
  const days = Math.floor((end - start) / 86400000)
  const d = new Date(start)
  d.setDate(d.getDate() + Math.floor(rand() * (days + 1)))
  const h = 8 + Math.floor(rand() * 10)
  const m = Math.floor(rand() * 60)
  const s = Math.floor(rand() * 60)
  return {
    date: d.toISOString().slice(0, 10),
    time: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`,
  }
}

function weekParams(weekIdx, l1, l2, agentName) {
  const phase = weekIdx < 4 ? 'decline' : weekIdx === 4 ? 'intervention' : 'recovery'
  const isHighRisk = isHighRiskDriver(l1, l2)
  const isCoached = COACHED_AGENTS.includes(agentName)

  let fcrBase = isHighRisk ? 0.48 : l1 === 'Service Delivery' ? 0.68 : 0.75
  let ahtBase = isHighRisk ? 380 : l1 === 'Service Delivery' ? 310 : 260
  let csatBase = isHighRisk ? 3.2 : 3.8
  let escProb = isHighRisk ? 0.12 : 0.06
  let trProb = isHighRisk ? 0.18 : 0.10
  let repeatProb = isHighRisk ? 0.28 : 0.12
  let cfProb = isHighRisk ? 0.04 : 0.01

  if (phase === 'decline' && isHighRisk) {
    fcrBase -= 0.02 * weekIdx
    ahtBase += 15 * weekIdx
    csatBase -= 0.08 * weekIdx
    repeatProb += 0.03 * weekIdx
    cfProb += 0.008 * weekIdx
  } else if (phase === 'intervention' && isHighRisk) {
    fcrBase -= 0.05
    ahtBase += 55
    csatBase -= 0.15
    repeatProb += 0.05
    cfProb += 0.01
  } else if (phase === 'recovery' && isHighRisk) {
    const recoveryWeek = weekIdx - 5
    fcrBase += 0.06 + recoveryWeek * 0.04
    ahtBase -= 20 + recoveryWeek * 12
    csatBase += 0.1 + recoveryWeek * 0.08
    repeatProb -= 0.04 + recoveryWeek * 0.03
    cfProb -= 0.015
  }

  if (isCoached && isHighRisk) {
    if (phase === 'decline' || phase === 'intervention') {
      fcrBase -= 0.12
      ahtBase += 40
      csatBase -= 0.25
      repeatProb += 0.08
      cfProb += 0.02
    } else {
      fcrBase += 0.15 + (weekIdx - 5) * 0.05
      ahtBase -= 30
      csatBase += 0.2
      repeatProb -= 0.1
      cfProb -= 0.02
    }
  }

  if (agentName === 'Michael Naidoo' && isHighRisk) {
    fcrBase = Math.max(fcrBase, 0.82)
    csatBase = Math.max(csatBase, 4.1)
    cfProb *= 0.2
  }
  if (agentName === 'Zanele Ndlovu' && isHighRisk && phase !== 'recovery') {
    fcrBase = Math.min(fcrBase, 0.35)
    csatBase = Math.min(csatBase, 2.5)
    cfProb += 0.03
  }

  return { fcrBase, ahtBase, csatBase, escProb, trProb, repeatProb, cfProb, phase, isHighRisk }
}

function makeQuestionEvals(qaScore, cfType) {
  const metCount = Math.round((qaScore / 100) * 10)
  const evals = []
  for (let i = 1; i <= 14; i++) {
    const qid = `q${i}`
    const applicable = i !== 3 && i !== 10
    let awarded = applicable && i <= metCount ? 1 : applicable ? 0 : null
    if (cfType === 'policy_misquote' && qid === 'q13') awarded = 0
    if (cfType === 'no_resolution_confirmation' && qid === 'q9') awarded = 0
    if (cfType === 'no_case_notes' && qid === 'q11') awarded = 0
    if (cfType === 'verification_failure' && qid === 'q4') awarded = 0
    evals.push({
      na_reason: applicable ? null : 'Not applicable for this contact type.',
      reasoning: applicable ? 'Evaluated from transcript.' : 'N/A',
      applicable,
      question_id: qid,
      requires_crm: qid === 'q3',
      llm_score_awarded: awarded,
      structured_evidence: [],
      policy_score_awarded: awarded ?? 1,
      effective_earned_weight: applicable ? (awarded ? 8 : 0) : 0,
    })
  }
  return evals
}

function sectionScores(isHighRisk, qaScore, cfType) {
  const doc = isHighRisk ? Math.min(qaScore - 15, 55) : qaScore - 5
  const resolution = isHighRisk ? Math.min(qaScore - 10, 60) : qaScore
  const policy = cfType === 'policy_misquote' ? 20 : qaScore
  const experience = qaScore + 5
  return [
    { section: 'Customer Experience', score_pct: Math.min(100, experience), earned_weight: 26, applicable_weight: 34 },
    { section: 'Policy and Compliance', score_pct: Math.min(100, policy), earned_weight: 12, applicable_weight: 12 },
    { section: 'Documentation Accuracy', score_pct: Math.max(20, doc), earned_weight: 25, applicable_weight: 34 },
    { section: 'Resolution & Close', score_pct: Math.max(15, resolution), earned_weight: 20, applicable_weight: 20 },
  ]
}

function agentLine(agent, text) {
  return `Agent (${agent}): ${text}`
}

function customerLine(text) {
  return `Customer: ${text}`
}

const DRIVER_ISSUE_TEMPLATES = {
  'Refund Requests': {
    customerOpen: 'I returned an item two weeks ago and still have not seen the refund on my card.',
    customerFollow: 'The return tracking shows it was delivered to your warehouse last Tuesday.',
    agentFinding: 'I can see the return was received on our side. The refund is queued for processing.',
    agentResolve: 'Your refund of $47.50 will post within 3-5 business days. I have confirmed that in the system.',
  },
  'Returns & Exchanges': {
    customerOpen: 'I want to return a jacket from order {order} but I am not sure if I am still within the return period.',
    customerFollow: 'It was delivered about three weeks ago.',
    agentFinding: 'Let me check the delivery date against our returns policy.',
    agentResolve: 'Crestline offers a 30-day return window from delivery. You are within that window and I can start the return for you today.',
  },
  'Billing & Refunds': {
    customerOpen: 'I was only refunded part of what I expected on order {order}.',
    customerFollow: 'The restocking fee was not explained when I started the return.',
    agentFinding: 'I am reviewing the refund calculation line by line in the system.',
    agentResolve: 'The partial refund reflects a restocking deduction on opened items. I have documented the breakdown and the remaining balance will post in 3-5 business days if approved.',
  },
  'Reimbursements': {
    customerOpen: 'I paid for return shipping and need reimbursement on order {order}.',
    customerFollow: 'The prepaid label did not work at the drop-off point.',
    agentFinding: 'I can see the shipping receipt you uploaded to the case.',
    agentResolve: 'I have approved a $12.50 shipping reimbursement. It will post to your card within 3-5 business days.',
  },
  'Reimbursements & Adjustments': {
    customerOpen: 'My account shows an adjustment I do not recognise on order {order}.',
    customerFollow: 'It looks like a duplicate charge reversal.',
    agentFinding: 'I can see a billing adjustment from last week on this order.',
    agentResolve: 'The adjustment corrects a duplicate authorization. Your balance is now $0 and I have emailed confirmation.',
  },
  'Promo Codes': {
    customerOpen: 'My promo code CREST15 did not apply at checkout on order {order}.',
    customerFollow: 'The code was still within the expiry date on the promotion page.',
    agentFinding: 'The code was valid but excluded sale items in your cart.',
    agentResolve: 'I have applied a one-time courtesy credit for the discount amount and documented the promo terms on your account.',
  },
  'Invoice Requests': {
    customerOpen: 'I need a VAT invoice for order {order} for my expense report.',
    customerFollow: 'The download link in my email is expired.',
    agentFinding: 'I can regenerate the invoice from the order record.',
    agentResolve: 'I have emailed the updated invoice PDF to your address on file. It includes all line items and tax breakdown.',
  },
  'Payment Method Issues': {
    customerOpen: 'My saved card will not work at checkout for order {order}.',
    customerFollow: 'I updated the expiry date but it still fails.',
    agentFinding: 'The card token needs to be refreshed in our payment vault.',
    agentResolve: 'Please remove and re-add the card in your account settings. I have cleared the failed attempt so you will not be double-charged.',
  },
  'Payment Failure': {
    customerOpen: 'Checkout failed three times when I tried to pay for order {order}.',
    customerFollow: 'My bank says the charge did not go through.',
    agentFinding: 'The errors were caused by an address validation mismatch on the postal code.',
    agentResolve: 'I have corrected the address format and you can retry checkout now. No duplicate charges were created.',
  },
  'Billing Inquiries': {
    customerOpen: 'I have a question about the charges on order {order}.',
    customerFollow: 'There are two line items I do not recognise.',
    agentFinding: 'Let me walk through each charge on the order summary.',
    agentResolve: 'One line is extended warranty and one is express shipping. I have emailed an itemised breakdown and noted your questions on the case.',
  },
  'Promotions & Discounts': {
    customerOpen: 'I thought the spring sale applied to order {order} but I was charged full price.',
    customerFollow: 'The banner said 20% off everything.',
    agentFinding: 'The promotion excluded certain brands in your cart.',
    agentResolve: 'I have applied a courtesy price match for the eligible items and documented the promotion terms on your account.',
  },
  'Order Status': {
    customerOpen: 'The tracking number for {order} has not moved in five days.',
    customerFollow: 'I just need to know if it is actually on the way.',
    agentFinding: 'The label was created but the carrier has not received the parcel yet.',
    agentResolve: 'I have escalated to our warehouse team. Updated tracking should appear within 24 hours and I have noted the delay on your order.',
  },
  'Order Cancellations': {
    customerOpen: 'I need to cancel order {order} before it ships.',
    customerFollow: 'It still shows as processing on my account.',
    agentFinding: 'The order is in pick status - I can still stop it.',
    agentResolve: 'Cancellation is confirmed. Any charge will reverse within 3-5 business days and I have sent confirmation by email.',
  },
  'Shipping & Delivery': {
    customerOpen: 'My order {order} was supposed to arrive last week and still has not shown up.',
    customerFollow: 'Tracking has not updated since it left the regional hub.',
    agentFinding: 'I am checking with the carrier now - there is a delay at the regional sort facility.',
    agentResolve: 'Revised delivery is expected in 2 business days. I have added a shipping credit to your account and documented the delay on the case.',
  },
  'Delivery Failures': {
    customerOpen: 'Tracking says delivered but I never received order {order}.',
    customerFollow: 'I checked with neighbours and the building office - nothing.',
    agentFinding: 'Carrier shows delivered but GPS scan is more than 50 metres from your address.',
    agentResolve: 'I am opening a missing-package investigation. You will hear back within 48 hours with either a replacement or refund confirmation.',
  },
  'Address Issues': {
    customerOpen: 'The courier delivered order {order} to the wrong address.',
    customerFollow: 'I have the photo proof from the driver showing the wrong door number.',
    agentFinding: 'I can see the misdelivery flag on the shipment.',
    agentResolve: 'I am arranging redelivery to your correct address and a refund if the parcel cannot be recovered within 48 hours.',
  },
  'Account & Login Issues': {
    customerOpen: 'I cannot log into my Crestline account to track order {order}.',
    customerFollow: 'Password reset emails are not arriving.',
    agentFinding: 'Your email is verified but the reset messages were blocked by a typo in the profile.',
    agentResolve: 'I have corrected the email and triggered a new reset link. You should receive it within 15 minutes.',
  },
  'Password Reset': {
    customerOpen: 'I need to reset my password to access order {order} history.',
    customerFollow: 'The reset link expired before I could use it.',
    agentFinding: 'Your account is active but the last reset token timed out.',
    agentResolve: 'I have sent a fresh reset link valid for 24 hours. Check spam if it does not arrive within five minutes.',
  },
  'Product Support': {
    customerOpen: 'I am unsure which size to order for the running jacket on order {order}.',
    customerFollow: 'I am usually between a small and medium.',
    agentFinding: 'Based on the size chart, customers between sizes often take medium for a relaxed fit.',
    agentResolve: 'I have emailed the sizing guide and fit notes for that style. Free exchange applies within 30 days if the size does not work.',
  },
  'Policy Clarification': {
    customerOpen: 'I want to confirm Crestline return policy before I ship order {order} back.',
    customerFollow: 'The website wording is confusing about final sale items.',
    agentFinding: 'Let me clarify which items on your order qualify for return.',
    agentResolve: 'Standard items have a 30-day return window from delivery. Final sale items are marked at purchase and are not returnable. I have emailed the policy summary.',
  },
  'Order Issues': {
    customerOpen: 'I ordered a blue sweater but received a grey one instead on order {order}.',
    customerFollow: 'I have not worn it - it is still in the original packaging.',
    agentFinding: 'I can confirm the pick error on our side for order {order}.',
    agentResolve: 'I am sending the correct item today and a prepaid label for the wrong item. You will get tracking within 24 hours.',
  },
  'Order Placement': {
    customerOpen: 'I need help completing checkout for order {order}.',
    customerFollow: 'The page freezes when I click place order.',
    agentFinding: 'There is a session timeout affecting your browser cart.',
    agentResolve: 'I have refreshed your cart server-side. Please log in again and the items should still be saved.',
  },
  'Order Management': {
    customerOpen: 'I need to combine two orders {order} into one shipment.',
    customerFollow: 'Both are still in processing status.',
    agentFinding: 'I can see both orders in the same warehouse queue.',
    agentResolve: 'I have merged the shipments. You will receive one tracking number within 24 hours and a single shipping confirmation email.',
  },
  'Order Modifications': {
    customerOpen: 'I need to change the size on order {order} before it ships.',
    customerFollow: 'It has not left the warehouse yet.',
    agentFinding: 'The order is still in pick status so a modification is possible.',
    agentResolve: 'Size updated to large. Revised confirmation is on its way by email and delivery date is unchanged.',
  },
  'Duplicate Orders': {
    customerOpen: 'I was charged twice for order {order} - it appears twice in my account.',
    customerFollow: 'Both show as processing.',
    agentFinding: 'I can see a duplicate submission within two minutes.',
    agentResolve: 'I have cancelled the duplicate and initiated a refund for the second charge. The active order will ship as normal.',
  },
  'Preorders & Backorders': {
    customerOpen: 'My preorder for order {order} still shows no ship date.',
    customerFollow: 'The product page said shipping in April.',
    agentFinding: 'The supplier delayed the batch by two weeks.',
    agentResolve: 'Revised ship date is May 12. I have added a 10% courtesy credit and you will get tracking when it leaves our warehouse.',
  },
  'Courier/Driver Issues': {
    customerOpen: 'The driver refused to leave order {order} without a signature I could not provide.',
    customerFollow: 'I was at work when they attempted delivery.',
    agentFinding: 'I can see two failed delivery attempts on the tracking.',
    agentResolve: 'I have authorised leave-at-door with photo proof for the next attempt. You will get SMS notification with the delivery window.',
  },
  'Escalations & Approvals': {
    customerOpen: 'I need a supervisor to approve an exception on order {order}.',
    customerFollow: 'The front-line agent said they could not override the policy.',
    agentFinding: 'I can see the prior notes and the exception criteria.',
    agentResolve: 'I am escalating to our approvals team now. A decision will be emailed within 24 hours with your case reference.',
  },
  'Merchant Communication': {
    customerOpen: 'I have not heard back from Crestline about my marketplace seller issue on order {order}.',
    customerFollow: 'The seller said to contact Crestline directly.',
    agentFinding: 'I can see the seller escalation ticket in our system.',
    agentResolve: 'I have contacted the seller directly and will update you within 48 hours with resolution or refund options.',
  },
  'Missing/Incorrect Information': {
    customerOpen: 'The product page had wrong dimensions for the item on order {order}.',
    customerFollow: 'What I received does not match the listed measurements.',
    agentFinding: 'I can confirm the listing error was reported by two other customers.',
    agentResolve: 'You qualify for a full return with prepaid label. I have flagged the listing for correction and noted your case.',
  },
  'Account Creation': {
    customerOpen: 'I am trying to create an account to track order {order} as a guest purchase.',
    customerFollow: 'It says my email is already in use but I never registered.',
    agentFinding: 'A guest checkout created a partial profile with your email.',
    agentResolve: 'I have sent an account activation link. Once set up you will see order history including this purchase.',
  },
  'Account Verification': {
    customerOpen: 'My account verification is blocking me from managing order {order}.',
    customerFollow: 'I uploaded ID but it still shows pending.',
    agentFinding: 'The document image was too blurry for automatic verification.',
    agentResolve: 'Please re-upload a clear photo of your ID. I have reset the verification queue and you should be approved within 2 hours.',
  },
  'Account Lockout': {
    customerOpen: 'My account is locked after too many login attempts for order {order}.',
    customerFollow: 'I was trying to reset my password.',
    agentFinding: 'Security lockout triggered after five failed attempts.',
    agentResolve: 'I have unlocked the account and sent a secure reset link. Please use it within one hour.',
  },
  'Profile Updates': {
    customerOpen: 'I need to update my shipping address before order {order} ships.',
    customerFollow: 'I moved since I placed the order.',
    agentFinding: 'The order has not shipped so an address change is possible.',
    agentResolve: 'Address updated on the order and your profile. Confirmation email is on its way.',
  },
  'Account Deletion': {
    customerOpen: 'I want to delete my Crestline account but have an open return on order {order}.',
    customerFollow: 'I still need the refund to process.',
    agentFinding: 'Account deletion is blocked while an open return is active.',
    agentResolve: 'I have scheduled deletion for 7 days after your refund completes. You will receive email confirmation at each step.',
  },
  'Complaints': {
    customerOpen: 'I want to file a formal complaint about my experience with order {order}.',
    customerFollow: 'This is the third time I have called without resolution.',
    agentFinding: 'I can see two prior contacts on this issue.',
    agentResolve: 'I have logged your complaint with our customer relations team. You will receive a written response within 3 business days.',
  },
  'Feedback': {
    customerOpen: 'I wanted to share feedback about my recent experience with order {order}.',
    customerFollow: 'Overall good service but delivery was slower than expected.',
    agentFinding: 'Thank you for taking the time to share this.',
    agentResolve: 'I have recorded your feedback on the case and shared it with our delivery partners team. A follow-up survey will arrive by email.',
  },
  'Follow-up Calls': {
    customerOpen: 'I am calling back about order {order} as discussed with your colleague yesterday.',
    customerFollow: 'They said the refund would be processed by today.',
    agentFinding: 'I can see the prior case notes and the pending refund status.',
    agentResolve: 'The refund of $47.50 was submitted this morning and will post within 3-5 business days. I have confirmed that in the system.',
  },
  'Escalations': {
    customerOpen: 'I need this escalated - order {order} has been unresolved for two weeks.',
    customerFollow: 'I have spoken to three agents already.',
    agentFinding: 'I can see the full contact history and escalation criteria are met.',
    agentResolve: 'I am escalating to our specialist team now. A supervisor will contact you within 24 hours with a case reference.',
  },
}

function fillTemplate(text, order) {
  return text.replace(/\{order\}/g, order)
}

function countTranscriptTurns(lines) {
  let agent = 0
  let customer = 0
  for (const line of lines) {
    if (line.startsWith('Agent (')) agent++
    else if (line.startsWith('Customer:')) customer++
  }
  return { total: lines.length, agent, customer }
}

function padTranscript(lines, agent, order, subcategory) {
  const fillers = [
    agentLine(agent, 'One moment while I review the order details in our system.'),
    customerLine('Sure, take your time.'),
    agentLine(agent, 'Thank you for waiting. I can see the full history on order ' + order + '.'),
    customerLine('Does that change anything about my request?'),
    agentLine(agent, `To make sure I have this right - you contacted us about ${subcategory.toLowerCase()} on this order.`),
    customerLine('Yes, that is correct.'),
    agentLine(agent, 'I appreciate your patience while we work through this together.'),
    customerLine('I just want to make sure it is actually resolved this time.'),
    agentLine(agent, 'I have noted everything we discussed today on your case for future reference.'),
    customerLine('Thank you for explaining that clearly.'),
    agentLine(agent, 'Is there anything else about order ' + order + ' I can help with before we close?'),
    customerLine('No, I think we have covered everything for now.'),
    agentLine(agent, 'Thank you for contacting Crestline. We appreciate your business.'),
  ]
  let fi = 0
  while (fi < fillers.length) {
    const { total, agent: a, customer: c } = countTranscriptTurns(lines)
    if (total >= 8 && a >= 3 && c >= 3) break
    lines.splice(lines.length - 1, 0, fillers[fi])
    fi++
  }
  return lines
}

function buildTranscript({
  agent,
  order,
  subcategory,
  l1,
  isHighRisk,
  cfType,
  channel,
  phase,
  isRepeat,
  fcr,
  escalated,
}) {
  const issue = DRIVER_ISSUE_TEMPLATES[subcategory] || {
    customerOpen: `I need help with ${subcategory.toLowerCase()} on order {order}.`,
    customerFollow: 'I have the order details ready if you need them.',
    agentFinding: `Let me pull up order {order} in the system.`,
    agentResolve: `I have taken care of your ${subcategory.toLowerCase()} request and documented everything on the case.`,
  }

  const isBenchmark = agent === 'Michael Naidoo'
  const isCoached = COACHED_AGENTS.includes(agent)
  const coachedBadPhase = isCoached && (phase === 'decline' || phase === 'intervention')
  const zaneleEscalationMiss = agent === 'Zanele Ndlovu' && cfType === 'escalation_avoidance'

  const lines = []

  if (channel === 'email') {
    lines.push('Email thread - Crestline Customer Care')
    lines.push(customerLine(`Re: order ${order} - ${subcategory.toLowerCase()}.`))
    lines.push(agentLine(agent, 'Thank you for contacting Crestline Customer Care.'))
  } else if (channel === 'chat') {
    lines.push('Chat - Crestline Support')
    lines.push(agentLine(agent, 'Hi, thanks for chatting with Crestline. How can I help you today?'))
  } else {
    lines.push(agentLine(agent, `Thank you for contacting Crestline, this is ${agent}. How can I help you today?`))
  }

  if (cfType !== 'verification_failure' && !coachedBadPhase) {
    lines.push(agentLine(agent, 'For security, can I confirm the order number and the email address on the account?'))
    lines.push(customerLine(`Order ${order}, and the email on the account should be on file from checkout.`))
  } else if (cfType === 'verification_failure') {
    lines.push(agentLine(agent, 'I can look into that return for you right away.'))
    lines.push(customerLine(fillTemplate(issue.customerOpen, order)))
  } else {
    lines.push(agentLine(agent, 'Can I get your order number to get started?'))
    lines.push(customerLine(`It is ${order}.`))
  }

  if (isRepeat && !cfType) {
    lines.push(customerLine(`This is my third time contacting Crestline about ${subcategory.toLowerCase()} on order ${order}.`))
  } else {
    lines.push(customerLine(fillTemplate(issue.customerOpen, order)))
  }

  lines.push(agentLine(agent, fillTemplate(issue.agentFinding, order)))
  lines.push(customerLine(fillTemplate(issue.customerFollow, order)))

  if (cfType === 'policy_misquote') {
    lines.push(agentLine(agent, 'Our return window is 14 days from delivery, so this order would not qualify for a refund under policy.'))
    lines.push(customerLine('I thought Crestline allowed 30 days - that is what your website says.'))
    lines.push(agentLine(agent, 'The system shows 14 days for this category. I can note your concern but I cannot override that today.'))
  } else if (cfType === 'escalation_avoidance' || zaneleEscalationMiss) {
    lines.push(agentLine(agent, 'I understand this is frustrating. Let me try one more time to process the refund from my side.'))
    lines.push(customerLine('I have already spoken to two other agents. I need a supervisor or escalation.'))
    lines.push(agentLine(agent, 'I am sure we can sort this without escalating. I will refresh the return status now.'))
    lines.push(customerLine('That is what I was told last time. I am not confident this is resolved.'))
    lines.push(agentLine(agent, 'I have updated the notes. Please allow 24 hours and call back if you still do not see the refund.'))
  } else if (cfType === 'verification_failure') {
    lines.push(agentLine(agent, 'I will go ahead and process the refund on this return now without holding the line.'))
    lines.push(customerLine('Do you need me to confirm anything else for security?'))
    lines.push(agentLine(agent, 'No, we are fine. The refund is submitted.'))
  } else if (cfType === 'no_resolution_confirmation' || (coachedBadPhase && isHighRisk && !isBenchmark)) {
    lines.push(agentLine(agent, 'I have started the return process in the system.'))
    lines.push(customerLine('When will the money be back on my card?'))
    lines.push(agentLine(agent, 'It should process soon. Is there anything else I can help with today?'))
    lines.push(customerLine('So you cannot confirm the amount or timeline?'))
    lines.push(agentLine(agent, 'The system will update automatically once processing completes. Thank you for calling Crestline.'))
  } else if (escalated) {
    lines.push(agentLine(agent, 'This needs our specialist returns team. I am escalating now with full notes on order ' + order + '.'))
    lines.push(customerLine('How long until someone contacts me?'))
    lines.push(agentLine(agent, 'A specialist will reach out within 24 hours. Your escalation reference is on the case.'))
  } else {
    const policyLine = isHighRisk ? 'Crestline offers a 30-day return window from delivery where applicable.' : ''
    if (policyLine && subcategory !== 'Policy Clarification') {
      lines.push(agentLine(agent, policyLine))
    }
    lines.push(agentLine(agent, fillTemplate(issue.agentResolve, order)))
    if (isBenchmark && isHighRisk) {
      lines.push(agentLine(agent, 'To recap: your refund of $47.50 will post within 3-5 business days. I have added full notes to case ' + order + ' and confirmation is on its way by email.'))
    }
  }

  const skipCaseNotes = cfType === 'no_case_notes' || (coachedBadPhase && !isBenchmark && rand() < 0.6)
  if (!skipCaseNotes && fcr && cfType !== 'no_resolution_confirmation' && cfType !== 'escalation_avoidance' && !zaneleEscalationMiss) {
    lines.push(agentLine(agent, 'I have documented today\'s resolution and next steps on your case for any future contacts.'))
  }

  if (fcr && cfType !== 'no_resolution_confirmation' && !zaneleEscalationMiss && cfType !== 'escalation_avoidance') {
    lines.push(agentLine(agent, 'Is there anything else I can help you with today?'))
    lines.push(customerLine('No, that covers it. Thank you.'))
    lines.push(agentLine(agent, 'Thank you for contacting Crestline. Have a great day.'))
  } else if (!fcr) {
    lines.push(customerLine('I may need to call back if this is not resolved.'))
    lines.push(agentLine(agent, 'Please use the same case reference if you contact us again so we can pick up where we left off.'))
  }

  padTranscript(lines, agent, order, subcategory)
  return lines.join('\n')
}

function buildRecord(id, weekIdx, opts = {}) {
  const { l1, l2 } = pickDriver(opts)
  const channel = opts.channel || pickWeighted(CHANNELS, CHANNEL_WEIGHTS)
  const agent = opts.agent || pick(ALL_AGENTS)

  const cluster = opts.cluster || (rand() < 0.35 && isHighRiskDriver(l1, l2) ? pick(REPEAT_CLUSTERS) : null)
  const customer = cluster ? cluster.customer : `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`
  const order = cluster ? cluster.order : `CL-ORD-${20000 + Math.floor(rand() * 8000)}`

  const params = weekParams(weekIdx, l1, l2, agent)
  const { date, time } = dateInWeek(weekIdx)

  const fcr = opts.fcr ?? (rand() < params.fcrBase)
  const escalated = opts.escalated ?? (rand() < params.escProb)
  const transferred = opts.transferred ?? (!escalated && rand() < params.trProb)
  const isRepeat = opts.isRepeat ?? (rand() < params.repeatProb)

  let cfType = opts.cfType ?? null
  let critical = false
  if (!cfType && rand() < params.cfProb) {
    cfType = pick(CF_TYPES).id
    critical = true
  }
  if (opts.forceCritical) {
    critical = true
    cfType = opts.cfType || pick(CF_TYPES).id
  }

  let csat = params.csatBase + (rand() - 0.5) * 0.8
  if (!fcr) csat -= 0.6
  if (critical) csat -= 1.2
  if (fcr && !critical) csat += 0.3
  csat = Math.max(1, Math.min(5, Math.round(csat * 10) / 10))

  const aht = Math.round(params.ahtBase + (rand() - 0.5) * 60 + (channel === 'email' ? -40 : channel === 'chat' ? -20 : 0))

  let qaScore = 70 + (csat - 3) * 12 + (fcr ? 8 : -10) - (critical ? 40 : 0)
  qaScore = Math.max(0, Math.min(100, Math.round(qaScore * 10) / 10))
  const qaPass = !critical && qaScore >= 70

  const cfLabel = critical ? CF_TYPES.find((c) => c.id === cfType)?.label : null
  const prefix = critical ? 'CL-RX-CF' : 'CL-RX-'
  const callId = opts.callId || `${prefix}${String(id).padStart(6, '0')}`

  const transcript = buildTranscript({
    agent,
    order,
    subcategory: l2,
    l1,
    isHighRisk: params.isHighRisk,
    cfType: critical ? cfType : null,
    channel,
    phase: params.phase,
    isRepeat,
    fcr,
    escalated,
  })

  const summary = `Contact regarding order ${order} (${l2}) via ${channel}. `
    + (critical ? `Critical failure flagged: ${cfLabel}. ` : '')
    + (isRepeat ? 'This is a repeat contact on the same issue. ' : '')
    + (fcr ? 'Issue resolved on first contact.' : 'Issue not fully resolved; follow-up may be required.')

  let micro_coaching_action = null
  let formal_coaching_flag = false
  if (critical && cfType) {
    const shortLabel = CF_TYPES.find((c) => c.id === cfType)?.label?.split(':')[0] || cfType
    micro_coaching_action = `QiQ micro coaching: ${shortLabel} flagged on this contact — review protocol before your next returns shift.`
  } else if (!fcr && params.isHighRisk) {
    micro_coaching_action = `QiQ micro coaching: Confirm refund amount and 3-5 day timeline before closing returns contacts.`
  } else if (COACHED_AGENTS.includes(agent) && params.isHighRisk && (params.phase === 'decline' || params.phase === 'intervention')) {
    micro_coaching_action = `QiQ micro coaching: ${agent.split(' ')[0]}, you missed resolution confirmation on a returns contact today.`
  }
  if (COACHED_AGENTS.includes(agent) && params.phase === 'recovery' && params.isHighRisk) {
    formal_coaching_flag = true
  }

  return {
    call_id: callId,
    full_uuid: randomUUID(),
    agent_name: agent,
    call_date: date,
    call_time: time,
    driver_category: l1,
    driver_subcategory: l2,
    call_category: l1,
    call_subcategory: l2,
    merchant_name: customer,
    merchant_contact: order,
    channel,
    order_number: order,
    call_handling_time: aht,
    transcript,
    narrative_summary: summary,
    fcr_resolved: fcr,
    predicted_csat_score: csat,
    predicted_csat_label: csat >= 4.5 ? 'Very Satisfied' : csat >= 4 ? 'Satisfied' : csat >= 3 ? 'Neutral' : csat >= 2 ? 'Dissatisfied' : 'Very Dissatisfied',
    predicted_nps_score: Math.round(csat * 2 - 1),
    critical_failure: critical,
    critical_failure_category: cfType,
    escalated,
    transferred,
    is_repeat_contact: isRepeat,
    qa_score: critical ? 0 : qaScore,
    qa_pass: qaPass,
    auto_fail_reasons: critical ? [cfLabel] : [],
    key_strengths: fcr ? ['Clear communication on Crestline policy.'] : [],
    key_gaps: critical ? [cfLabel] : !fcr ? ['Resolution not confirmed at close.'] : [],
    questions_met: Math.floor(qaScore / 10),
    questions_not_met: 14 - Math.floor(qaScore / 10),
    section_scores: sectionScores(params.isHighRisk, qaScore, cfType),
    question_evaluations: makeQuestionEvals(qaScore, cfType),
    micro_coaching_action,
    formal_coaching_flag,
  }
}

function isHighRiskRecord(r) {
  return isHighRiskDriver(r.driver_category || r.call_category, r.driver_subcategory || r.call_subcategory)
}

// --- Generate ---
const records = []
let id = 1
let cfCounter = 1

for (let w = 0; w < WEEKS; w++) {
  const weekCount = w === WEEKS - 1 ? TOTAL - records.length : PER_WEEK
  const cfTarget = CF_WEEKLY_TARGET[w]

  const cfSlots = new Set()
  while (cfSlots.size < cfTarget && cfSlots.size < weekCount) {
    cfSlots.add(Math.floor(rand() * weekCount))
  }

  for (let i = 0; i < weekCount; i++) {
    const isCf = cfSlots.has(i)
    const cfType = isCf ? CF_TYPES[cfCounter % CF_TYPES.length].id : null
    const record = buildRecord(id++, w, {
      forceCritical: isCf,
      cfType,
      callId: isCf ? `CL-RX-CF${String(cfCounter++).padStart(4, '0')}` : undefined,
      agent: isCf && w < 5 ? pick([...COACHED_AGENTS, 'Zanele Ndlovu']) : undefined,
      forceHighRisk: isCf || undefined,
    })
    records.push(record)
  }
}

for (const cluster of REPEAT_CLUSTERS.slice(0, 140)) {
  for (let c = 0; c < cluster.contacts; c++) {
    if (records.length >= TOTAL + 200) break
    const w = c === 0 ? Math.floor(rand() * 4) : Math.min(7, Math.floor(rand() * 4) + c)
    records.push(buildRecord(id++, w, {
      cluster,
      l1: 'Billing & Payments',
      l2: pick(['Refund Requests', 'Billing & Refunds', 'Billing Inquiries']),
      isRepeat: c > 0,
      agent: pick(COACHED_AGENTS),
      fcr: false,
      forceCritical: c === cluster.contacts - 1 && rand() < 0.4,
      cfType: c === cluster.contacts - 1 ? 'no_case_notes' : null,
    }))
  }
}

while (records.length > TOTAL) records.pop()
while (records.length < TOTAL) {
  records.push(buildRecord(id++, 7, { l1: 'General Support' }))
}

for (const featured of FEATURED_CF_CALLS) {
  const idx = records.findIndex((r) => r.call_id === featured.callId)
  if (idx < 0) continue
  const w = WEEK_BOUNDARIES.findIndex((wb) => featured.date >= wb.start && featured.date <= wb.end)
  const rebuilt = buildRecord(idx + 1, Math.max(0, w), {
    callId: featured.callId,
    agent: featured.agent,
    cfType: featured.cfType,
    forceCritical: true,
    l1: 'Orders & Transactions',
    l2: 'Returns & Exchanges',
    fcr: false,
    isRepeat: featured.cfType === 'no_case_notes' || featured.cfType === 'escalation_avoidance',
  })
  rebuilt.call_date = featured.date
  records[idx] = rebuilt
}

// Calibrate CSAT < 3 ~18%
const lowCsatTarget = Math.round(TOTAL * 0.18)
let lowIndices = records.map((r, i) => ({ i, csat: r.predicted_csat_score })).filter((x) => x.csat < 3).map((x) => x.i)

if (lowIndices.length > lowCsatTarget) {
  const toRaise = lowIndices
    .filter((i) => !isHighRiskRecord(records[i]) || rand() > 0.5)
    .slice(0, lowIndices.length - lowCsatTarget)
  for (const i of toRaise) {
    records[i].predicted_csat_score = Math.round((3.1 + rand() * 0.8) * 10) / 10
    records[i].predicted_csat_label = 'Neutral'
  }
}

lowIndices = records.map((r, i) => (r.predicted_csat_score < 3 ? i : -1)).filter((i) => i >= 0)
for (const i of records.map((_, idx) => idx)) {
  if (lowIndices.length >= lowCsatTarget) break
  if (records[i].predicted_csat_score >= 3 && isHighRiskRecord(records[i])) {
    records[i].predicted_csat_score = Math.round((2 + rand() * 0.9) * 10) / 10
    records[i].predicted_csat_label = records[i].predicted_csat_score < 2.5 ? 'Very Dissatisfied' : 'Dissatisfied'
    lowIndices.push(i)
  }
}

const currentAht = records.reduce((s, r) => s + r.call_handling_time, 0) / records.length
const ahtScale = 348 / currentAht
for (const r of records) {
  r.call_handling_time = Math.round(r.call_handling_time * ahtScale)
  if (isHighRiskRecord(r)) {
    r.call_handling_time = Math.round(r.call_handling_time * 1.08)
  }
}

const repeatTarget = Math.round(TOTAL * 0.23)
let repeatCount = records.filter((r) => r.is_repeat_contact).length
if (repeatCount < repeatTarget) {
  const candidates = records.filter((r) => !r.is_repeat_contact && isHighRiskRecord(r)).sort(() => rand() - 0.5)
  for (const r of candidates.slice(0, repeatTarget - repeatCount)) {
    r.is_repeat_contact = true
  }
}

for (const r of records) {
  if (COACHED_AGENTS.includes(r.agent_name) && isHighRiskRecord(r) && r.call_date >= '2026-05-18') {
    if (rand() < 0.75) {
      r.fcr_resolved = true
      r.predicted_csat_score = Math.round(Math.max(r.predicted_csat_score, 3.5) * 10) / 10
    }
  }
}

const fcrCount = records.filter((r) => r.fcr_resolved).length
const targetFcr = Math.round(TOTAL * 0.61)
if (fcrCount > targetFcr) {
  const toFlip = records.filter((r) => r.fcr_resolved && r.driver_category === 'General Support').slice(0, fcrCount - targetFcr)
  for (const r of toFlip) r.fcr_resolved = false
} else if (fcrCount < targetFcr) {
  const toFlip = records.filter((r) => !r.fcr_resolved && r.driver_category === 'General Support').slice(0, targetFcr - fcrCount)
  for (const r of toFlip) r.fcr_resolved = true
}

const escTarget = Math.round(TOTAL * 0.092)
let escCount = records.filter((r) => r.escalated).length
if (escCount > escTarget) {
  for (const r of records.filter((r) => r.escalated && r.driver_category === 'General Support').slice(0, escCount - escTarget)) {
    r.escalated = false
  }
} else if (escCount < escTarget) {
  for (const r of records.filter((r) => !r.escalated && isHighRiskRecord(r)).slice(0, escTarget - escCount)) {
    r.escalated = true
  }
}

const trTarget = Math.round(TOTAL * 0.141)
let trCount = records.filter((r) => r.transferred).length
if (trCount > trTarget) {
  for (const r of records.filter((r) => r.transferred && !r.escalated && r.driver_category === 'General Support').slice(0, trCount - trTarget)) {
    r.transferred = false
  }
} else if (trCount < trTarget) {
  for (const r of records.filter((r) => !r.transferred && !r.escalated && isHighRiskRecord(r)).slice(0, trTarget - trCount)) {
    r.transferred = true
  }
}

const csatAvg = records.reduce((s, r) => s + r.predicted_csat_score, 0) / records.length
const csatShift = 3.6 - csatAvg
for (const r of records) {
  r.predicted_csat_score = Math.max(1, Math.min(5, Math.round((r.predicted_csat_score + csatShift) * 10) / 10))
}

const FEATURED_CF_IDS = new Set(FEATURED_CF_CALLS.map((f) => f.callId))

function clearCriticalFlag(record) {
  record.critical_failure = false
  record.critical_failure_category = null
  record.qa_score = Math.max(72, record.qa_score || 75)
  record.qa_pass = record.qa_score >= 70
  record.auto_fail_reasons = []
  record.key_gaps = record.fcr_resolved ? [] : ['Resolution not confirmed at close.']
}

function applyCriticalFlag(record, cfTypeId) {
  const cfMeta = CF_TYPES.find((c) => c.id === cfTypeId) || CF_TYPES[0]
  record.critical_failure = true
  record.critical_failure_category = cfMeta.id
  record.qa_score = 0
  record.qa_pass = false
  record.fcr_resolved = false
  record.auto_fail_reasons = [cfMeta.label]
  record.key_gaps = [cfMeta.label]
  if (!record.micro_coaching_action) {
    const shortLabel = cfMeta.label.split(':')[0]
    record.micro_coaching_action = `QiQ micro coaching: ${shortLabel} flagged on this contact — review protocol before your next returns shift.`
  }
}

for (let w = 0; w < WEEKS; w++) {
  const wb = WEEK_BOUNDARIES[w]
  const target = CF_WEEKLY_TARGET[w]
  const inWeek = records.filter((r) => r.call_date >= wb.start && r.call_date <= wb.end)

  const refreshCfList = () => inWeek.filter((r) => r.critical_failure)
  let cfList = refreshCfList()

  while (cfList.length > target) {
    const removable = cfList.filter((r) => !FEATURED_CF_IDS.has(r.call_id))
    if (!removable.length) break
    clearCriticalFlag(removable[removable.length - 1])
    cfList = refreshCfList()
  }

  let typeIdx = 0
  while (cfList.length < target) {
    const pool = inWeek.filter((r) => !r.critical_failure && !FEATURED_CF_IDS.has(r.call_id))
    const candidate = pool.find(isHighRiskRecord) || pool[0]
    if (!candidate) break
    applyCriticalFlag(candidate, CF_TYPES[typeIdx % CF_TYPES.length].id)
    typeIdx += 1
    cfList = refreshCfList()
  }
}

function aggregateDrivers(data) {
  const n = data.length
  const byL1 = {}
  const byL2 = {}

  for (const l1 of L1_CATEGORIES) {
    const subset = data.filter((r) => r.driver_category === l1)
    if (!subset.length) continue
    const esc = subset.filter((r) => r.escalated).length
    byL1[l1] = {
      volume: subset.length,
      share: Math.round((subset.length / n) * 1000) / 10,
      fcr: Math.round((subset.filter((r) => r.fcr_resolved).length / subset.length) * 1000) / 10,
      aht: Math.round(subset.reduce((s, r) => s + r.call_handling_time, 0) / subset.length),
      esc: Math.round((esc / subset.length) * 1000) / 10,
      drivers: {},
    }
    for (const l2 of DRIVER_TAXONOMY[l1]) {
      const sub = subset.filter((r) => r.driver_subcategory === l2)
      if (!sub.length) continue
      const subEsc = sub.filter((r) => r.escalated).length
      const row = {
        name: l2,
        volume: sub.length,
        share: Math.round((sub.length / subset.length) * 1000) / 10,
        fcr: Math.round((sub.filter((r) => r.fcr_resolved).length / sub.length) * 1000) / 10,
        aht: Math.round(sub.reduce((s, r) => s + r.call_handling_time, 0) / sub.length),
        esc: Math.round((subEsc / sub.length) * 1000) / 10,
      }
      byL1[l1].drivers[l2] = row
      byL2[`${l1}::${l2}`] = row
    }
  }
  return { byL1, byL2 }
}

function aggregate(data) {
  const n = data.length
  const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length
  const aht = avg(data.map((r) => r.call_handling_time))
  const fcr = (data.filter((r) => r.fcr_resolved).length / n) * 100
  const csat = avg(data.map((r) => r.predicted_csat_score))
  const rcr = (data.filter((r) => r.is_repeat_contact).length / n) * 100
  const er = (data.filter((r) => r.escalated).length / n) * 100
  const tr = (data.filter((r) => r.transferred).length / n) * 100
  const csatLow = (data.filter((r) => r.predicted_csat_score < 3).length / n) * 100

  const byL1 = {}
  for (const l1 of L1_CATEGORIES) {
    const subset = data.filter((r) => r.driver_category === l1)
    if (!subset.length) continue
    byL1[l1] = {
      count: subset.length,
      aht: avg(subset.map((r) => r.call_handling_time)),
      fcr: (subset.filter((r) => r.fcr_resolved).length / subset.length) * 100,
      csat: avg(subset.map((r) => r.predicted_csat_score)),
      rcr: (subset.filter((r) => r.is_repeat_contact).length / subset.length) * 100,
    }
  }

  const highRisk = data.filter(isHighRiskRecord)
  const lowRisk = data.filter((r) => !isHighRiskRecord(r))

  const byWeek = WEEK_BOUNDARIES.map((w) => {
    const subset = data.filter((r) => r.call_date >= w.start && r.call_date <= w.end)
    const hr = subset.filter(isHighRiskRecord)
    return {
      week: w.label,
      aht: avg(subset.map((r) => r.call_handling_time)),
      fcr: (subset.filter((r) => r.fcr_resolved).length / subset.length) * 100,
      csat: avg(subset.map((r) => r.predicted_csat_score)),
      cf: subset.filter((r) => r.critical_failure).length,
      returnsAht: hr.length ? avg(hr.map((r) => r.call_handling_time)) : 0,
      returnsFcr: hr.length ? (hr.filter((r) => r.fcr_resolved).length / hr.length) * 100 : 0,
    }
  })

  const byChannel = {}
  for (const ch of CHANNELS) {
    byChannel[ch] = data.filter((r) => r.channel === ch).length / n
  }

  const coachedReturnsFcr = {}
  for (const agent of COACHED_AGENTS) {
    const early = data.filter((r) => r.agent_name === agent && isHighRiskRecord(r) && r.call_date <= '2026-05-03')
    const late = data.filter((r) => r.agent_name === agent && isHighRiskRecord(r) && r.call_date >= '2026-05-18')
    coachedReturnsFcr[agent] = {
      w1w4: early.length ? (early.filter((r) => r.fcr_resolved).length / early.length) * 100 : 0,
      w7w8: late.length ? (late.filter((r) => r.fcr_resolved).length / late.length) * 100 : 0,
    }
  }

  const driverStats = aggregateDrivers(data)

  return {
    n, aht, fcr, csat, rcr, er, tr, csatLow,
    byL1, byQueue: byL1,
    highRisk: {
      count: highRisk.length,
      aht: highRisk.length ? avg(highRisk.map((r) => r.call_handling_time)) : 0,
      fcr: highRisk.length ? (highRisk.filter((r) => r.fcr_resolved).length / highRisk.length) * 100 : 0,
    },
    lowRisk: {
      count: lowRisk.length,
      fcr: lowRisk.length ? (lowRisk.filter((r) => r.fcr_resolved).length / lowRisk.length) * 100 : 0,
    },
    byWeek, byChannel, coachedReturnsFcr, driverStats,
  }
}

const stats = aggregate(records)

const errors = []
if (records.length !== TOTAL) errors.push(`Count ${records.length} !== ${TOTAL}`)
if (Math.abs(stats.csatLow - 18) > 3) errors.push(`CSAT<3 ${stats.csatLow.toFixed(1)}% not ~18%`)
if (stats.highRisk.fcr >= stats.lowRisk.fcr) errors.push('High-risk FCR should be worst')
for (const agent of COACHED_AGENTS) {
  const c = stats.coachedReturnsFcr[agent]
  if (c.w7w8 <= c.w1w4) errors.push(`${agent} FCR not improved W7-W8 vs W1-W4`)
}

let shortTranscripts = 0
for (const r of records) {
  const lines = r.transcript.split('\n').filter(Boolean)
  const { total, agent: a, customer: c } = countTranscriptTurns(lines)
  if (total < 8 || a < 3 || c < 3) shortTranscripts++
}
if (shortTranscripts > 0) errors.push(`${shortTranscripts} transcripts below minimum length`)

console.log('Dataset stats:', JSON.stringify({ n: stats.n, byL1: stats.byL1, driverStatsL1: Object.fromEntries(Object.entries(stats.driverStats.byL1).map(([k, v]) => [k, { volume: v.volume, share: v.share }])) }, null, 2))
if (errors.length) {
  console.warn('Validation warnings:', errors)
} else {
  console.log('Validation passed.')
}

mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, JSON.stringify(records, null, 2))
writeFileSync(STATS_OUT, JSON.stringify(stats, null, 2))
console.log(`Wrote ${records.length} records to ${OUT}`)

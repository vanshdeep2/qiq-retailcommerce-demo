/**
 * Generates Crestline retail ecommerce contact dataset (2,200 records, 8 weeks).
 * Run: node scripts/generate-crestline-dataset.mjs
 */
import { writeFileSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { randomUUID } from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUT = join(ROOT, 'public', 'data', 'contact_search_data.json')
const STATS_OUT = join(ROOT, 'scripts', 'dataset-stats.json')

const TOTAL = 2200
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

const QUEUES = ['Returns & Refunds', 'Order & Delivery', 'General Enquiries']
const QUEUE_WEIGHTS = [0.4, 0.35, 0.25]
const CHANNELS = ['voice', 'email', 'chat']
const CHANNEL_WEIGHTS = [0.65, 0.22, 0.13]

const FEATURED_AGENTS = [
  'Michael Naidoo',
  'Nomsa Dlamini',
  'Lerato Nkosi',
  'Pieter Botha',
  'Busisiwe Maseko',
  'Ayanda Mbeki',
  'Zanele Ndlovu',
  'Thabo van der Merwe',
  'Janine Jacobs',
  'Sipho Khumalo',
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

const CF_TYPES = [
  { id: 'policy_misquote', label: 'Policy misquote: 14-day returns window stated (policy is 30 days)', pillar: 'Business Policy' },
  { id: 'no_resolution_confirmation', label: 'No resolution confirmation: call closed without refund status or timeline', pillar: 'Resolution & Close' },
  { id: 'no_case_notes', label: 'No case notes: repeat contact where prior interaction had no documentation', pillar: 'Documentation Accuracy' },
  { id: 'escalation_avoidance', label: 'Escalation avoidance: criteria met but not escalated, third contact from same customer', pillar: 'Escalation' },
  { id: 'verification_failure', label: 'Verification failure: return processed without identity verification', pillar: 'Verification' },
]

const RETURNS_SUBCATEGORIES = [
  'Refund Status Inquiry', 'Return Window Question', 'Exchange for Size', 'Damaged Item Return',
  'Wrong Item Received', 'Return Label Request', 'Partial Refund Dispute', 'Store Credit vs Refund',
]

const ORDER_SUBCATEGORIES = [
  'Delayed Shipment', 'Missing Package', 'Tracking Not Updating', 'Delivery to Wrong Address',
  'Order Cancellation', 'Shipping Upgrade Request', 'International Delivery',
]

const GENERAL_SUBCATEGORIES = [
  'Sizing Guide', 'Product Availability', 'Promo Code Issue', 'Account Login',
  'Loyalty Points', 'Gift Card Balance', 'Website Checkout Error',
]

const FIRST_NAMES = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Jamie', 'Avery', 'Quinn', 'Blake', 'Drew', 'Skyler', 'Cameron', 'Reese', 'Parker']
const LAST_NAMES = ['Miller', 'Davis', 'Wilson', 'Brown', 'Garcia', 'Martinez', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Robinson', 'Clark']

// Repeat-contact clusters for returns/refund search density
const REPEAT_CLUSTERS = Array.from({ length: 45 }, (_, i) => ({
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

function weekParams(weekIdx, queue, agentName) {
  const phase = weekIdx < 4 ? 'decline' : weekIdx === 4 ? 'intervention' : 'recovery'
  const isReturns = queue === 'Returns & Refunds'
  const isCoached = COACHED_AGENTS.includes(agentName)

  let fcrBase = isReturns ? 0.48 : queue === 'Order & Delivery' ? 0.68 : 0.75
  let ahtBase = isReturns ? 380 : queue === 'Order & Delivery' ? 310 : 260
  let csatBase = isReturns ? 3.2 : 3.8
  let escProb = isReturns ? 0.12 : 0.06
  let trProb = isReturns ? 0.18 : 0.10
  let repeatProb = isReturns ? 0.28 : 0.12
  let cfProb = isReturns ? 0.04 : 0.01

  if (phase === 'decline' && isReturns) {
    fcrBase -= 0.02 * weekIdx
    ahtBase += 15 * weekIdx
    csatBase -= 0.08 * weekIdx
    repeatProb += 0.03 * weekIdx
    cfProb += 0.008 * weekIdx
  } else if (phase === 'intervention' && isReturns) {
    fcrBase -= 0.05
    ahtBase += 55
    csatBase -= 0.15
    repeatProb += 0.05
    cfProb += 0.01
  } else if (phase === 'recovery' && isReturns) {
    const recoveryWeek = weekIdx - 5
    fcrBase += 0.06 + recoveryWeek * 0.04
    ahtBase -= 20 + recoveryWeek * 12
    csatBase += 0.1 + recoveryWeek * 0.08
    repeatProb -= 0.04 + recoveryWeek * 0.03
    cfProb -= 0.015
  }

  if (isCoached && isReturns) {
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

  // High performers on returns
  if (agentName === 'Michael Naidoo' && isReturns) {
    fcrBase = Math.max(fcrBase, 0.82)
    csatBase = Math.max(csatBase, 4.1)
    cfProb *= 0.2
  }
  if (agentName === 'Zanele Ndlovu' && isReturns && phase !== 'recovery') {
    fcrBase = Math.min(fcrBase, 0.35)
    csatBase = Math.min(csatBase, 2.5)
    cfProb += 0.03
  }

  return { fcrBase, ahtBase, csatBase, escProb, trProb, repeatProb, cfProb, phase }
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

function sectionScores(queue, qaScore, cfType) {
  const isReturns = queue === 'Returns & Refunds'
  const doc = isReturns ? Math.min(qaScore - 15, 55) : qaScore - 5
  const resolution = isReturns ? Math.min(qaScore - 10, 60) : qaScore
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

const SUBCATEGORY_ISSUES = {
  'Refund Status Inquiry': {
    customerOpen: 'I returned an item two weeks ago and still have not seen the refund on my card.',
    customerFollow: 'The return tracking shows it was delivered to your warehouse last Tuesday.',
    agentFinding: 'I can see the return was received on our side. The refund is queued for processing.',
    agentResolve: 'Your refund of $47.50 will post within 3-5 business days. I have confirmed that in the system.',
  },
  'Return Window Question': {
    customerOpen: 'I want to return a jacket from order {order} but I am not sure if I am still within the return period.',
    customerFollow: 'It was delivered about three weeks ago.',
    agentFinding: 'Let me check the delivery date against our returns policy.',
    agentResolve: 'Crestline offers a 30-day return window from delivery. You are within that window and I can start the return for you today.',
  },
  'Exchange for Size': {
    customerOpen: 'I need to exchange a medium for a large on order {order}.',
    customerFollow: 'The medium fits but the shoulders are too tight.',
    agentFinding: 'I can see the item is eligible for exchange under our sizing policy.',
    agentResolve: 'I have initiated the exchange. The new size will ship within 2-3 business days once the return label is scanned.',
  },
  'Damaged Item Return': {
    customerOpen: 'The package arrived damaged and the product inside is unusable.',
    customerFollow: 'There are photos in the case if you need them.',
    agentFinding: 'I am sorry about that. I can see the damage was noted on the delivery scan.',
    agentResolve: 'I have approved a full refund and emailed a prepaid return label. Refund will post within 3-5 business days after we receive the item.',
  },
  'Wrong Item Received': {
    customerOpen: 'I ordered a blue sweater but received a grey one instead.',
    customerFollow: 'I have not worn it - it is still in the original packaging.',
    agentFinding: 'I can confirm the pick error on our side for order {order}.',
    agentResolve: 'I am sending the correct item today and a prepaid label for the wrong item. You will get tracking within 24 hours.',
  },
  'Return Label Request': {
    customerOpen: 'I need a return shipping label for order {order}.',
    customerFollow: 'The item is unused with tags still attached.',
    agentFinding: 'Your order qualifies for return under our 30-day policy.',
    agentResolve: 'I have emailed the prepaid return label to the address on file. Once scanned, refund processing takes 3-5 business days.',
  },
  'Partial Refund Dispute': {
    customerOpen: 'I was only refunded part of what I expected on order {order}.',
    customerFollow: 'The restocking fee was not explained when I started the return.',
    agentFinding: 'I am reviewing the refund calculation line by line in the system.',
    agentResolve: 'The partial refund reflects a restocking deduction on opened items. I have documented the breakdown and the remaining balance will post in 3-5 business days if approved.',
  },
  'Store Credit vs Refund': {
    customerOpen: 'I was offered store credit but I want the refund back to my card.',
    customerFollow: 'I did not agree to store credit when I started the return.',
    agentFinding: 'I can see the return was processed as store credit by default.',
    agentResolve: 'I have converted this to a card refund of $62.00. It will post within 3-5 business days and I have noted your preference on the case.',
  },
  'Delayed Shipment': {
    customerOpen: 'My order {order} was supposed to arrive last week and still has not shown up.',
    customerFollow: 'Tracking has not updated since it left the regional hub.',
    agentFinding: 'I am checking with the carrier now - there is a delay at the regional sort facility.',
    agentResolve: 'Revised delivery is expected in 2 business days. I have added a shipping credit to your account and documented the delay on the case.',
  },
  'Missing Package': {
    customerOpen: 'Tracking says delivered but I never received order {order}.',
    customerFollow: 'I checked with neighbours and the building office - nothing.',
    agentFinding: 'Carrier shows delivered but GPS scan is more than 50 metres from your address.',
    agentResolve: 'I am opening a missing-package investigation. You will hear back within 48 hours with either a replacement or refund confirmation.',
  },
  'Tracking Not Updating': {
    customerOpen: 'The tracking number for {order} has not moved in five days.',
    customerFollow: 'I just need to know if it is actually on the way.',
    agentFinding: 'The label was created but the carrier has not received the parcel yet.',
    agentResolve: 'I have escalated to our warehouse team. Updated tracking should appear within 24 hours and I have noted the delay on your order.',
  },
  'Delivery to Wrong Address': {
    customerOpen: 'The courier delivered order {order} to the wrong address.',
    customerFollow: 'I have the photo proof from the driver showing the wrong door number.',
    agentFinding: 'I can see the misdelivery flag on the shipment.',
    agentResolve: 'I am arranging redelivery to your correct address and a refund if the parcel cannot be recovered within 48 hours.',
  },
  'Order Cancellation': {
    customerOpen: 'I need to cancel order {order} before it ships.',
    customerFollow: 'It still shows as processing on my account.',
    agentFinding: 'The order is in pick status - I can still stop it.',
    agentResolve: 'Cancellation is confirmed. Any charge will reverse within 3-5 business days and I have sent confirmation by email.',
  },
  'Shipping Upgrade Request': {
    customerOpen: 'Can I upgrade order {order} to express shipping?',
    customerFollow: 'I am happy to pay the difference if it has not left the warehouse.',
    agentFinding: 'The order has not shipped yet so an upgrade is possible.',
    agentResolve: 'Express shipping is added. New delivery estimate is 2 business days and the upgrade fee is on your confirmation email.',
  },
  'International Delivery': {
    customerOpen: 'I need help with customs hold on international order {order}.',
    customerFollow: 'The carrier says additional documentation is required.',
    agentFinding: 'I can see the customs hold code on the shipment.',
    agentResolve: 'I have sent the commercial invoice to the carrier. Clearance should complete within 3 business days and I have documented next steps on the case.',
  },
  'Sizing Guide': {
    customerOpen: 'I am unsure which size to order for the running jacket.',
    customerFollow: 'I am usually between a small and medium.',
    agentFinding: 'Based on the size chart, customers between sizes often take medium for a relaxed fit.',
    agentResolve: 'I have emailed the sizing guide and fit notes for that style. Free exchange applies within 30 days if the size does not work.',
  },
  'Product Availability': {
    customerOpen: 'Is the linen shirt in olive still in stock?',
    customerFollow: 'The website showed low stock yesterday.',
    agentFinding: 'We have 12 units in the distribution centre for your region.',
    agentResolve: 'It is available to order now. I can place a reservation for 24 hours if you want time to decide.',
  },
  'Promo Code Issue': {
    customerOpen: 'My promo code CREST15 did not apply at checkout on order {order}.',
    customerFollow: 'The code was still within the expiry date on the promotion page.',
    agentFinding: 'The code was valid but excluded sale items in your cart.',
    agentResolve: 'I have applied a one-time courtesy credit for the discount amount and documented the promo terms on your account.',
  },
  'Account Login': {
    customerOpen: 'I cannot log into my Crestline account to track order {order}.',
    customerFollow: 'Password reset emails are not arriving.',
    agentFinding: 'Your email is verified but the reset messages were blocked by a typo in the profile.',
    agentResolve: 'I have corrected the email and triggered a new reset link. You should receive it within 15 minutes.',
  },
  'Loyalty Points': {
    customerOpen: 'Points from order {order} are not showing on my loyalty balance.',
    customerFollow: 'It has been more than a week since delivery.',
    agentFinding: 'Points post 48 hours after delivery - yours were still pending.',
    agentResolve: 'I have manually posted 240 points to your account. They will appear immediately and I have noted the delay on the case.',
  },
  'Gift Card Balance': {
    customerOpen: 'My gift card balance looks wrong after order {order}.',
    customerFollow: 'I used a $50 card but more was taken than expected.',
    agentFinding: 'The card and card plus card split are both on the receipt.',
    agentResolve: 'Remaining balance is $18.50. I have emailed an itemised receipt and updated the case notes.',
  },
  'Website Checkout Error': {
    customerOpen: 'Checkout failed three times when I tried to pay for order {order}.',
    customerFollow: 'My bank says the charge did not go through.',
    agentFinding: 'The errors were caused by an address validation mismatch on the postal code.',
    agentResolve: 'I have corrected the address format and you can retry checkout now. No duplicate charges were created.',
  },
}

function fillTemplate(text, order) {
  return text.replace(/\{order\}/g, order)
}

function buildTranscript({
  agent,
  order,
  subcategory,
  queue,
  cfType,
  channel,
  phase,
  isRepeat,
  fcr,
  escalated,
}) {
  const issue = SUBCATEGORY_ISSUES[subcategory] || {
    customerOpen: `I need help with ${subcategory.toLowerCase()} on order {order}.`,
    customerFollow: 'I have the order details ready if you need them.',
    agentFinding: `Let me pull up order {order} in the system.`,
    agentResolve: `I have taken care of your ${subcategory.toLowerCase()} request and documented everything on the case.`,
  }

  const isBenchmark = agent === 'Michael Naidoo'
  const isCoached = COACHED_AGENTS.includes(agent)
  const coachedBadPhase = isCoached && (phase === 'decline' || phase === 'intervention')
  const zaneleEscalationMiss = agent === 'Zanele Ndlovu' && phase !== 'recovery' && (isRepeat || cfType === 'escalation_avoidance')

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
  } else if (cfType === 'no_resolution_confirmation' || (coachedBadPhase && queue === 'Returns & Refunds' && !isBenchmark)) {
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
    const policyLine = queue === 'Returns & Refunds'
      ? 'Crestline offers a 30-day return window from delivery where applicable.'
      : ''
    if (policyLine && subcategory !== 'Return Window Question') {
      lines.push(agentLine(agent, policyLine))
    }
    lines.push(agentLine(agent, fillTemplate(issue.agentResolve, order)))
    if (isBenchmark && queue === 'Returns & Refunds') {
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

  return lines.join('\n')
}

function buildRecord(id, weekIdx, opts = {}) {
  const queue = opts.queue || pickWeighted(QUEUES, QUEUE_WEIGHTS)
  const channel = opts.channel || pickWeighted(CHANNELS, CHANNEL_WEIGHTS)
  const agent = opts.agent || pick(ALL_AGENTS)
  const subcats = queue === 'Returns & Refunds' ? RETURNS_SUBCATEGORIES
    : queue === 'Order & Delivery' ? ORDER_SUBCATEGORIES : GENERAL_SUBCATEGORIES
  const subcategory = opts.subcategory || pick(subcats)

  const cluster = opts.cluster || (rand() < 0.35 && queue === 'Returns & Refunds' ? pick(REPEAT_CLUSTERS) : null)
  const customer = cluster ? cluster.customer : `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`
  const order = cluster ? cluster.order : `CL-ORD-${20000 + Math.floor(rand() * 8000)}`

  const params = weekParams(weekIdx, queue, agent)
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
    subcategory,
    queue,
    cfType: critical ? cfType : null,
    channel,
    phase: params.phase,
    isRepeat,
    fcr,
    escalated,
  })
  const summary = `Contact regarding order ${order} (${subcategory}) via ${channel}. `
    + (critical ? `Critical failure flagged: ${cfLabel}. ` : '')
    + (isRepeat ? 'This is a repeat contact on the same issue. ' : '')
    + (fcr ? 'Issue resolved on first contact.' : 'Issue not fully resolved; follow-up may be required.')

  return {
    call_id: callId,
    full_uuid: randomUUID(),
    agent_name: agent,
    call_date: date,
    call_time: time,
    call_category: queue,
    call_subcategory: subcategory,
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
    section_scores: sectionScores(queue, qaScore, cfType),
    question_evaluations: makeQuestionEvals(qaScore, cfType),
  }
}

// --- Generate ---
const records = []
let id = 1
let cfCounter = 1

for (let w = 0; w < WEEKS; w++) {
  const weekCount = w === WEEKS - 1 ? TOTAL - records.length : PER_WEEK
  const cfTarget = w < 4 ? 12 + w * 2 : w < 6 ? 6 - (w - 4) * 2 : 2

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
      queue: isCf ? 'Returns & Refunds' : undefined,
    })
    records.push(record)
  }
}

// Add dense repeat clusters for returns search
for (const cluster of REPEAT_CLUSTERS.slice(0, 30)) {
  for (let c = 0; c < cluster.contacts; c++) {
    if (records.length >= TOTAL + 50) break
    const w = c === 0 ? Math.floor(rand() * 4) : Math.min(7, Math.floor(rand() * 4) + c)
    records.push(buildRecord(id++, w, {
      cluster,
      queue: 'Returns & Refunds',
      subcategory: pick(['Refund Status Inquiry', 'Return Window Question', 'Partial Refund Dispute']),
      isRepeat: c > 0,
      agent: pick(COACHED_AGENTS),
      fcr: c === cluster.contacts - 1 ? false : false,
      forceCritical: c === cluster.contacts - 1 && rand() < 0.4,
      cfType: c === cluster.contacts - 1 ? 'no_case_notes' : null,
    }))
  }
}

// Trim or pad to exactly TOTAL (replace tail if over)
while (records.length > TOTAL) records.pop()
while (records.length < TOTAL) {
  records.push(buildRecord(id++, 7, { queue: 'General Enquiries' }))
}

// Force ~18% CSAT < 3 (calibrate)
const lowCsatTarget = Math.round(TOTAL * 0.18)
let lowIndices = records
  .map((r, i) => ({ i, csat: r.predicted_csat_score }))
  .filter((x) => x.csat < 3)
  .map((x) => x.i)

// Raise excess low-CSAT records above 3
if (lowIndices.length > lowCsatTarget) {
  const toRaise = lowIndices
    .filter((i) => records[i].call_category !== 'Returns & Refunds' || rand() > 0.5)
    .slice(0, lowIndices.length - lowCsatTarget)
  for (const i of toRaise) {
    records[i].predicted_csat_score = Math.round((3.1 + rand() * 0.8) * 10) / 10
    records[i].predicted_csat_label = 'Neutral'
  }
}

lowIndices = records.map((r, i) => (r.predicted_csat_score < 3 ? i : -1)).filter((i) => i >= 0)
for (const i of records.map((_, idx) => idx)) {
  if (lowIndices.length >= lowCsatTarget) break
  if (records[i].predicted_csat_score >= 3 && records[i].call_category === 'Returns & Refunds') {
    records[i].predicted_csat_score = Math.round((2 + rand() * 0.9) * 10) / 10
    records[i].predicted_csat_label = records[i].predicted_csat_score < 2.5 ? 'Very Dissatisfied' : 'Dissatisfied'
    lowIndices.push(i)
  }
}

// Calibrate AHT toward 348s period average
const currentAht = records.reduce((s, r) => s + r.call_handling_time, 0) / records.length
const ahtScale = 348 / currentAht
for (const r of records) {
  r.call_handling_time = Math.round(r.call_handling_time * ahtScale)
  if (r.call_category === 'Returns & Refunds') {
    r.call_handling_time = Math.round(r.call_handling_time * 1.08)
  }
}

// Calibrate repeat rate toward 23%
const repeatTarget = Math.round(TOTAL * 0.23)
let repeatCount = records.filter((r) => r.is_repeat_contact).length
if (repeatCount < repeatTarget) {
  const candidates = records
    .filter((r) => !r.is_repeat_contact && r.call_category === 'Returns & Refunds')
    .sort(() => rand() - 0.5)
  for (const r of candidates.slice(0, repeatTarget - repeatCount)) {
    r.is_repeat_contact = true
  }
}

// Boost coached agents W7-W8 returns FCR
for (const r of records) {
  if (COACHED_AGENTS.includes(r.agent_name) && r.call_category === 'Returns & Refunds' && r.call_date >= '2026-05-18') {
    if (rand() < 0.75) {
      r.fcr_resolved = true
      r.predicted_csat_score = Math.round(Math.max(r.predicted_csat_score, 3.5) * 10) / 10
    }
  }
}

// Nudge period FCR to ~61%
const fcrCount = records.filter((r) => r.fcr_resolved).length
const targetFcr = Math.round(TOTAL * 0.61)
if (fcrCount > targetFcr) {
  const toFlip = records.filter((r) => r.fcr_resolved && r.call_category === 'General Enquiries').slice(0, fcrCount - targetFcr)
  for (const r of toFlip) r.fcr_resolved = false
} else if (fcrCount < targetFcr) {
  const toFlip = records.filter((r) => !r.fcr_resolved && r.call_category === 'General Enquiries').slice(0, targetFcr - fcrCount)
  for (const r of toFlip) r.fcr_resolved = true
}

// --- Stats ---
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

  const byQueue = {}
  for (const q of QUEUES) {
    const subset = data.filter((r) => r.call_category === q)
    byQueue[q] = {
      count: subset.length,
      aht: avg(subset.map((r) => r.call_handling_time)),
      fcr: (subset.filter((r) => r.fcr_resolved).length / subset.length) * 100,
      csat: avg(subset.map((r) => r.predicted_csat_score)),
      rcr: (subset.filter((r) => r.is_repeat_contact).length / subset.length) * 100,
    }
  }

  const byWeek = WEEK_BOUNDARIES.map((w, wi) => {
    const subset = data.filter((r) => r.call_date >= w.start && r.call_date <= w.end)
    const returns = subset.filter((r) => r.call_category === 'Returns & Refunds')
    return {
      week: w.label,
      aht: avg(subset.map((r) => r.call_handling_time)),
      fcr: (subset.filter((r) => r.fcr_resolved).length / subset.length) * 100,
      csat: avg(subset.map((r) => r.predicted_csat_score)),
      cf: subset.filter((r) => r.critical_failure).length,
      returnsAht: returns.length ? avg(returns.map((r) => r.call_handling_time)) : 0,
      returnsFcr: returns.length ? (returns.filter((r) => r.fcr_resolved).length / returns.length) * 100 : 0,
    }
  })

  const byChannel = {}
  for (const ch of CHANNELS) {
    byChannel[ch] = data.filter((r) => r.channel === ch).length / n
  }

  const coachedReturnsFcr = {}
  for (const agent of COACHED_AGENTS) {
    const early = data.filter((r) => r.agent_name === agent && r.call_category === 'Returns & Refunds' && r.call_date <= '2026-05-03')
    const late = data.filter((r) => r.agent_name === agent && r.call_category === 'Returns & Refunds' && r.call_date >= '2026-05-18')
    coachedReturnsFcr[agent] = {
      w1w4: early.length ? (early.filter((r) => r.fcr_resolved).length / early.length) * 100 : 0,
      w7w8: late.length ? (late.filter((r) => r.fcr_resolved).length / late.length) * 100 : 0,
    }
  }

  return { n, aht, fcr, csat, rcr, er, tr, csatLow, byQueue, byWeek, byChannel, coachedReturnsFcr }
}

const stats = aggregate(records)

// Validation
const errors = []
if (records.length !== TOTAL) errors.push(`Count ${records.length} !== ${TOTAL}`)
if (Math.abs(stats.csatLow - 18) > 3) errors.push(`CSAT<3 ${stats.csatLow.toFixed(1)}% not ~18%`)
if (stats.byQueue['Returns & Refunds'].fcr >= stats.byQueue['Order & Delivery'].fcr) {
  errors.push('Returns FCR should be worst')
}
for (const agent of COACHED_AGENTS) {
  const c = stats.coachedReturnsFcr[agent]
  if (c.w7w8 <= c.w1w4) errors.push(`${agent} FCR not improved W7-W8 vs W1-W4`)
}

console.log('Dataset stats:', JSON.stringify(stats, null, 2))
if (errors.length) {
  console.warn('Validation warnings:', errors)
} else {
  console.log('Validation passed.')
}

mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, JSON.stringify(records, null, 2))
writeFileSync(STATS_OUT, JSON.stringify(stats, null, 2))
console.log(`Wrote ${records.length} records to ${OUT}`)

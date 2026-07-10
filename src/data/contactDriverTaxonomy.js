/** E-commerce (Crestline) contact driver taxonomy — L1 categories and L2 drivers */

export const DRIVER_TAXONOMY = {
  'Account & Access': [
    'Account Creation',
    'Password Reset',
    'Account Verification',
    'Account Lockout',
    'Profile Updates',
    'Account Deletion',
    'Account & Login Issues',
  ],
  'Billing & Payments': [
    'Billing & Refunds',
    'Promo Codes',
    'Invoice Requests',
    'Payment Method Issues',
    'Payment Failure',
    'Billing Inquiries',
    'Refund Requests',
    'Reimbursements',
    'Promotions & Discounts',
    'Reimbursements & Adjustments',
  ],
  'Orders & Transactions': [
    'Preorders & Backorders',
    'Duplicate Orders',
    'Order Status',
    'Order Placement',
    'Order Cancellations',
    'Order Issues',
    'Order Management',
    'Order Modifications',
    'Returns & Exchanges',
  ],
  'Service Delivery': [
    'Address Issues',
    'Courier/Driver Issues',
    'Delivery Failures',
    'Escalations & Approvals',
    'Merchant Communication',
    'Shipping & Delivery',
  ],
  'Product Support': [
    'Missing/Incorrect Information',
    'Product Support',
  ],
  'General Support': [
    'Complaints',
    'Feedback',
    'Follow-up Calls',
    'Escalations',
    'Policy Clarification',
  ],
}

export const L1_CATEGORIES = Object.keys(DRIVER_TAXONOMY)

/** Narrative-weighted L1 distribution (~55% returns/refund cluster) */
export const L1_WEIGHTS = {
  'Orders & Transactions': 0.30,
  'Billing & Payments': 0.25,
  'Service Delivery': 0.18,
  'Account & Access': 0.10,
  'Product Support': 0.09,
  'General Support': 0.08,
}

/** L2 weights within each L1 — returns/refund drivers weighted higher */
export const L2_WEIGHTS = {
  'Orders & Transactions': {
    'Returns & Exchanges': 0.35,
    'Order Issues': 0.15,
    'Order Status': 0.12,
    'Order Cancellations': 0.10,
    'Order Placement': 0.08,
    'Order Modifications': 0.07,
    'Duplicate Orders': 0.06,
    'Preorders & Backorders': 0.04,
    'Order Management': 0.03,
  },
  'Billing & Payments': {
    'Refund Requests': 0.28,
    'Billing & Refunds': 0.22,
    'Billing Inquiries': 0.12,
    'Payment Failure': 0.10,
    'Promo Codes': 0.08,
    'Payment Method Issues': 0.06,
    'Invoice Requests': 0.05,
    'Reimbursements': 0.04,
    'Promotions & Discounts': 0.03,
    'Reimbursements & Adjustments': 0.02,
  },
  'Service Delivery': {
    'Shipping & Delivery': 0.28,
    'Delivery Failures': 0.22,
    'Address Issues': 0.18,
    'Courier/Driver Issues': 0.12,
    'Escalations & Approvals': 0.10,
    'Merchant Communication': 0.10,
  },
  'Account & Access': {
    'Account & Login Issues': 0.30,
    'Password Reset': 0.25,
    'Account Verification': 0.15,
    'Profile Updates': 0.12,
    'Account Lockout': 0.08,
    'Account Creation': 0.06,
    'Account Deletion': 0.04,
  },
  'Product Support': {
    'Product Support': 0.55,
    'Missing/Incorrect Information': 0.45,
  },
  'General Support': {
    'Policy Clarification': 0.28,
    'Follow-up Calls': 0.22,
    'Complaints': 0.20,
    'Escalations': 0.18,
    'Feedback': 0.12,
  },
}

export const HIGH_RISK_L2 = new Set([
  'Returns & Exchanges',
  'Refund Requests',
  'Billing & Refunds',
  'Order Issues',
  'Partial Refund Dispute',
])

export const HIGH_RISK_L1 = new Set(['Orders & Transactions', 'Billing & Payments'])

export const ALL_L2_DRIVERS = L1_CATEGORIES.flatMap((l1) =>
  DRIVER_TAXONOMY[l1].map((l2) => ({ l1, l2 })),
)

export function isHighRiskDriver(l1, l2) {
  return HIGH_RISK_L1.has(l1) && (
    HIGH_RISK_L2.has(l2)
    || l2 === 'Returns & Exchanges'
    || l2 === 'Refund Requests'
    || l2 === 'Billing & Refunds'
  )
}

export function pickWeightedDriver(randFn) {
  const l1Items = L1_CATEGORIES
  const l1Weights = l1Items.map((l1) => L1_WEIGHTS[l1])
  const l1 = pickWeightedItem(l1Items, l1Weights, randFn)
  const l2Items = DRIVER_TAXONOMY[l1]
  const weights = L2_WEIGHTS[l1]
  const l2Weights = l2Items.map((l2) => weights[l2] ?? 1 / l2Items.length)
  const l2 = pickWeightedItem(l2Items, l2Weights, randFn)
  return { l1, l2 }
}

function pickWeightedItem(items, weights, randFn) {
  const r = randFn()
  let acc = 0
  for (let i = 0; i < items.length; i++) {
    acc += weights[i]
    if (r < acc) return items[i]
  }
  return items[items.length - 1]
}

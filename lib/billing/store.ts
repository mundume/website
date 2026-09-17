import Database from "better-sqlite3";

const database = new Database("./sqlite.db");

export type StoredSubscription = {
  plan: string;
  status: string;
  currency: string;
  interval: "monthly" | "annually";
  latestReference: string;
};

export type StoredTransaction = {
  reference: string;
  amount: number;
  currency: string;
  paidAt: string | null;
};

database.exec(`
  CREATE TABLE IF NOT EXISTS billing_transactions (
    reference TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    status TEXT NOT NULL,
    amount INTEGER NOT NULL,
    currency TEXT NOT NULL,
    paid_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS billing_subscriptions (
    user_id TEXT PRIMARY KEY,
    plan TEXT NOT NULL,
    status TEXT NOT NULL,
    currency TEXT NOT NULL,
    interval TEXT NOT NULL,
    latest_reference TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

export function recordSuccessfulPayment({
  reference,
  userId,
  amount,
  currency,
  paidAt,
  interval,
}: {
  reference: string;
  userId: string;
  amount: number;
  currency: string;
  paidAt: string | null;
  interval: "monthly" | "annually";
}) {
  if (currency !== "KES") {
    throw new Error("Only KES subscriptions are supported.");
  }

  const save = database.transaction(() => {
    database
      .prepare(
        `INSERT INTO billing_transactions (reference, user_id, status, amount, currency, paid_at)
         VALUES (?, ?, 'success', ?, ?, ?)
         ON CONFLICT(reference) DO UPDATE SET
           status = excluded.status,
           amount = excluded.amount,
           currency = excluded.currency,
           paid_at = excluded.paid_at`
      )
      .run(reference, userId, amount, currency, paidAt);

    database
      .prepare(
        `INSERT INTO billing_subscriptions
          (user_id, plan, status, currency, interval, latest_reference, updated_at)
         VALUES (?, 'Pro', 'active', ?, ?, ?, CURRENT_TIMESTAMP)
         ON CONFLICT(user_id) DO UPDATE SET
           plan = excluded.plan,
           status = excluded.status,
           currency = excluded.currency,
           interval = excluded.interval,
           latest_reference = excluded.latest_reference,
           updated_at = CURRENT_TIMESTAMP`
      )
      .run(userId, currency, interval, reference);
  });

  save();
}

export function getBillingSummary(userId: string) {
  const subscription = database
    .prepare(
      `SELECT
        plan,
        status,
        currency,
        interval,
        latest_reference as latestReference
       FROM billing_subscriptions
       WHERE user_id = ?`
    )
    .get(userId) as StoredSubscription | undefined;

  const transactions = database
    .prepare(
      `SELECT
        reference,
        amount,
        currency,
        paid_at as paidAt
       FROM billing_transactions
       WHERE user_id = ? AND status = 'success'
       ORDER BY COALESCE(paid_at, created_at) DESC`
    )
    .all(userId) as StoredTransaction[];

  return { subscription, transactions };
}

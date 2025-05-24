import { Worker, Queue, QueueScheduler, Job } from 'bullmq';
import { initDb } from './db.js';

const connection = {
  host: 'localhost',
  port: 6379,
};

export async function startWorker() {
  const db = await initDb();
  const smsQueue = new Queue('sms', { connection });
  new QueueScheduler('sms', { connection });

  // Process SMS sending
  new Worker(
    'sms',
    async job => {
      const { id } = job.data;
      const message = await db.get('SELECT * FROM messages WHERE id = ?', id);
      if (!message) return;
      // Simulate SMS sending
      console.log(`Sending SMS for message ${id}`);
      await db.run('UPDATE messages SET status = ?, sent_at = ? WHERE id = ?', 'sent', new Date().toISOString(), id);
    },
    { connection }
  );

  // Periodically check for pending messages
  setInterval(async () => {
    const now = new Date().toISOString();
    const pending = await db.all('SELECT id FROM messages WHERE status = ? AND scheduled_at <= ?', 'pending', now);
    for (const row of pending) {
      await smsQueue.add('send-sms', { id: row.id });
    }
  }, 1000 * 60);

  // Daily job to remind about unused coupons
  const dailyQueue = new Queue('daily', { connection });
  new QueueScheduler('daily', { connection });
  new Worker(
    'daily',
    async () => {
      const cutoff = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
      const coupons = await db.all('SELECT id, user_id FROM coupons WHERE used = 0 AND created_at <= ?', cutoff);
      for (const c of coupons) {
        const id = await db.run(
          'INSERT INTO messages (campaign_assignment_id, step_index, status, scheduled_at) VALUES (?, ?, ?, ?)',
          0,
          0,
          'pending',
          new Date().toISOString()
        );
        await smsQueue.add('send-sms', { id: id.lastID });
        console.log(`Reminder for coupon ${c.id} queued`);
      }
    },
    { connection }
  );

  await dailyQueue.add(
    'check-coupons',
    {},
    {
      repeat: { cron: '0 0 * * *' },
    }
  );
}

export async function scheduleCampaignMessages(assignmentId) {
  const db = await initDb();
  const assignment = await db.get('SELECT * FROM campaign_assignments WHERE id = ?', assignmentId);
  if (!assignment) return;
  const campaign = await db.get('SELECT * FROM campaigns WHERE id = ?', assignment.campaign_id);
  if (!campaign) return;
  const steps = JSON.parse(campaign.steps);
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const scheduled = new Date(new Date(assignment.assigned_at).getTime() + step.delay * 1000);
    await db.run(
      'INSERT INTO messages (campaign_assignment_id, step_index, status, scheduled_at) VALUES (?, ?, ?, ?)',
      assignmentId,
      i,
      'pending',
      scheduled.toISOString()
    );
  }
}

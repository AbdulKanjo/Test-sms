import { startWorker, scheduleCampaignMessages } from './worker.js';
import { initDb } from './db.js';

async function main() {
  const db = await initDb();
  await startWorker();

  // Example: create a campaign if none exists
  const existing = await db.get('SELECT id FROM campaigns LIMIT 1');
  if (!existing) {
    const steps = JSON.stringify([
      { delay: 0, message: 'Welcome to our campaign!' },
      { delay: 60, message: 'Second message after 1 minute' },
    ]);
    await db.run('INSERT INTO campaigns (name, steps) VALUES (?, ?)', 'Welcome', steps);
    console.log('Default campaign created');
  }

  // Example assignment
  const campaign = await db.get('SELECT id FROM campaigns LIMIT 1');
  const assignment = await db.get('SELECT id FROM campaign_assignments LIMIT 1');
  if (!assignment && campaign) {
    const result = await db.run(
      'INSERT INTO campaign_assignments (campaign_id, user_id, assigned_at) VALUES (?, ?, ?)',
      campaign.id,
      1,
      new Date().toISOString()
    );
    await scheduleCampaignMessages(result.lastID);
    console.log('Campaign assignment created');
  }
}

main().catch(err => console.error(err));

const cron = require('node-cron');

console.log('Testing weekly cron functionality...');

// Test weekly schedule (every Sunday at 2:00 AM)
const weeklyTask = cron.schedule('0 2 * * 0', () => {
  console.log('Weekly notification cleanup would run now');
}, {
  scheduled: false, // Don't actually schedule it for testing
  timezone: "UTC"
});

console.log('Weekly cron expression is valid!');
console.log('Weekly task next run:', weeklyTask.nextDate().toDate());

// Clean up
weeklyTask.stop();

console.log('Weekly cron test completed successfully!');
console.log('Schedule: Every Sunday at 2:00 AM UTC');
console.log('Purpose: Check if notification table > 2500 records and clean oldest 1000'); 
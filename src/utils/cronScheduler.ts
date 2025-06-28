import cron from 'node-cron';
import { performNotificationCleanup } from './notificationCleanup';

export class CronScheduler {
  private static instance: CronScheduler;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): CronScheduler {
    if (!CronScheduler.instance) {
      CronScheduler.instance = new CronScheduler();
    }
    return CronScheduler.instance;
  }

  public initialize() {
    if (this.isInitialized) {
      console.log('Cron scheduler already initialized');
      return;
    }

    console.log('Initializing cron scheduler...');

    // Weekly notification cleanup - Every Sunday at 2:00 AM
    cron.schedule('0 2 * * 0', async () => {
      console.log('Running weekly notification cleanup check...');
      try {
        await performNotificationCleanup();
        console.log('Weekly notification cleanup check completed');
      } catch (error) {
        console.error('Weekly notification cleanup failed:', error);
      }
    }, {
      scheduled: true,
      timezone: "UTC"
    });

    this.isInitialized = true;
    console.log('Cron scheduler initialized successfully');
    console.log('Scheduled jobs:');
    console.log('- Weekly notification cleanup: Every Sunday at 2:00 AM UTC');
  }

  public stop() {
    console.log('Stopping cron scheduler...');
    cron.getTasks().forEach((task) => {
      task.stop();
    });
    this.isInitialized = false;
    console.log('Cron scheduler stopped');
  }

  public getStatus() {
    const tasks = cron.getTasks();
    const status = {
      isInitialized: this.isInitialized,
      activeTasks: tasks.size,
      taskDetails: Array.from(tasks.entries()).map(([name, task]) => ({
        name,
        running: true,
        nextDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }))
    };
    return status;
  }
} 
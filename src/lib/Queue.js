import Bee from 'bee-queue';
import redisConfig from '../config/redis';
import NewOrderMail from '../app/jobs/NewOrderMail';
import CancelOrderMail from '../app/jobs/CancelOrderMail';

const jobs = [ CancelOrderMail, NewOrderMail ];

class Queue {
  constructor() {
    this.queue = {};

    this.init();
  }

  init() {
    jobs.forEach(({key, handle}) => {
      this.queue[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      }
    });
  }

  add(queue, job) {
    return this.queue[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      const {bee, handle} = this.queue[job.key];

      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();

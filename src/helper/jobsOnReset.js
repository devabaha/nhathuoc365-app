const jobs = [];

export function addJob(job) {
  jobs.push(job);
}

export function executeJobs() {
  const jobsCount = jobs.length;
  for (let i = 0; i <= jobsCount; i++) {
    const job = jobs.pop();
    if (typeof job === 'function') {
      job();
    }
  }
}

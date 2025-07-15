// jobs/queueEmailVerification.js
module.exports = (agenda) => {
  agenda.define("queue email verification", async (job, bulkUploadId) => {
    const { chunk } = job.attrs.data;

    for (const row of chunk) {
      const { email } = row;
      if (email) {
        await agenda.now("verify and save email", { row, bulkUploadId });
      }
    }
  });
};

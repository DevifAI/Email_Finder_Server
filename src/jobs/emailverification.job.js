// jobs/queueEmailVerification.js
export default (agenda) => {
  agenda.define("queue_email_verification", async (job) => {
    const { chunk, bulkUploadId } = job.attrs.data;

    for (const row of chunk) {
      console.log(row);
      const { email } = row;

      if (email) {
        agenda.now("verify_and_save_email", { row, bulkUploadId });
      }
    }
  });
};

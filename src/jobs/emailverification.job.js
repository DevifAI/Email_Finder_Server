// jobs/queueEmailVerification.js
export default (agenda) => {
  agenda.define("queue_email_verification", async (job) => {
    const { chunk, bulkUploadId } = job.attrs.data;
    let count = 0;
    for (const row of chunk) {
      const { email } = row;
      count++;
      console.log(count, "number of rows processed");
      if (email) {
        agenda.now("verify_and_save_email", { row, bulkUploadId });
      }
    }
    console.log(count, "number of rows processed");
  });
};

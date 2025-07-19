// jobs/verifyAndSaveEmail.js
const EmailAccount = require("../models/emailaccount.model");
const BulkUpload = require("../models/bulkupload.model");
const verifyEmail = require("../utils/verifyEmail");

module.exports = (agenda) => {
  agenda.define("verify_and_save_email", async (job, done) => {
    const { row, bulkUploadId } = job.attrs.data;
    const { email, name, companyName, linkedin, position, website } = row;

    try {
      const alreadyExists = await EmailAccount.findOne({ email });

      if (alreadyExists) {
        console.log(email, "already exisys");
        await BulkUpload.findByIdAndUpdate(bulkUploadId, {
          $inc: { skipped: 1 },
        });
      } else {
        const response = await verifyEmail(email);
        const result = response?.data?.result;
        const reason = response?.data?.reason;

        await EmailAccount.create({
          name,
          email,
          companyName,
          linkedIn: linkedin,
          position,
          company: companyName,
          isVerified: reason === "accepted_email" && result === "deliverable",
          emailData: response?.data,
          website,
        });

        await BulkUpload.findByIdAndUpdate(bulkUploadId, {
          $inc: { inserted: 1 },
        });
      }

      // Now check if processing is complete
      const updatedUpload = await BulkUpload.findById(bulkUploadId);
      if (
        updatedUpload.inserted + updatedUpload.skipped >= updatedUpload.total &&
        updatedUpload.status !== "completed"
      ) {
        await BulkUpload.findByIdAndUpdate(bulkUploadId, {
          status: "completed",
        });
      }

      done();
    } catch (err) {
      console.error("Job error:", err.message);
      await BulkUpload.findByIdAndUpdate(bulkUploadId, {
        status: "failed",
        error: err.message,
      });
      done(err);
    }
  });
};

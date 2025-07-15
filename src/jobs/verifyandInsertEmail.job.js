// jobs/verifyAndSaveEmail.js
const EmailAccount = require("../models/emailaccount.model");
const BulkUpload = require("../models/bulkupload.model");
const verifyEmail = require("../utils/verifyEmail");

module.exports = (agenda) => {
  agenda.define("verify_and_save_email", async (job, done) => {
    const { row, bulkUploadId } = job.attrs.data;

    const { email, name, companyName, salaryRange, address, phoneNumber } = row;

    try {
      const alreadyExists = await EmailAccount.findOne({ email });

      if (alreadyExists) {
        await BulkUpload.findByIdAndUpdate(bulkUploadId, {
          $inc: { skipped: 1 },
        });
        return done();
      }

      const response = await verifyEmail(email);
      console.log(isValid);
      if (response.error) {
        await BulkUpload.findByIdAndUpdate(bulkUploadId, {
          $inc: { skipped: 1 },
        });
        return done();
      } // skip if invalid
      if (
        response?.data?.reason === "accepted_email" &&
        response?.data?.result === "delivarable"
      ) {
        await EmailAccount.create({
          name,
          email,
          companyName,
          salaryRange,
          address,
          phoneNumber,
          isVerified: true,
          emailData: response?.data,
        });
        await BulkUpload.findByIdAndUpdate(bulkUploadId, {
          $inc: { inserted: 1 },
        });
        done();
      } else {
        await BulkUpload.findByIdAndUpdate(bulkUploadId, {
          $inc: { skipped: 1 },
        });
      }
    } catch (error) {
      console.error("Job error:", error.message);
      await BulkUpload.findByIdAndUpdate(bulkUploadId, {
        status: "failed",
        error: err.message,
      });
      done(error);
    }
  });
};

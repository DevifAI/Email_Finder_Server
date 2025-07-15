// jobs/verifyAndSaveEmail.js
const EmailAccount = require("../models/emailaccount.model");
const BulkUpload = require("../models/bulkupload.model");
const verifyEmail = require("../utils/verifyEmail");

module.exports = (agenda) => {
  agenda.define("verify and save email", async (job, done) => {
    const { row } = job.attrs.data;
    const { email, name, companyName, salaryRange, address, phoneNumber } = row;

    try {
      const alreadyExists = await EmailAccount.findOne({ email });
      if (alreadyExists) {
        await BulkUpload.findByIdAndUpdate(bulkUploadId, {
          $inc: { skipped: 1 },
        });
        return done();
      }

      const isValid = await verifyEmail(email);
      console.log(isValid);
      if (!isValid) return done(); // skip if invalid

      await EmailAccount.create({
        name,
        email,
        companyName,
        salaryRange,
        address,
        phoneNumber,
        isVerified: true,
      });

      done();
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

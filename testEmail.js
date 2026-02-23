import sendEmail from "./utils/sendEmail.js";

const test = async () => {
  await sendEmail(
    "recipient@gmail.com", // your email for testing
    "http://localhost:3000/public-sign/testtoken"
  );
};

test();

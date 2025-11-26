// // server/src/utils/smsService.js
// import logger from "./logger.js";

// /**
//  * Mock SMS OTP sender — replace with Twilio or Firebase for production
//  * @param {string} phone - Phone number
//  * @param {string} message - Text message
//  */
// export const sendSmsOtp = async (phone, message) => {
//   try {
//     // For Twilio (example)
//     // await client.messages.create({
//     //   body: message,
//     //   from: process.env.TWILIO_PHONE_NUMBER,
//     //   to: phone,
//     // });

//     logger.info(`📱 SMS sent to ${phone}: ${message}`);
//     return true;
//   } catch (error) {
//     logger.error("❌ Failed to send SMS:", error);
//     throw new Error("SMS sending failed");
//   }
// };
// server/src/utils/smsService.js
import twilio from "twilio";
import logger from "./logger.js";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Send SMS OTP using Twilio
 */
export const sendSmsOtp = async (phone, message) => {
  try {
    if (!phone.startsWith("+")) {
      throw new Error("Phone number must be in E.164 format, e.g. +919876543210");
    }

    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    logger.info(`📱 SMS sent to ${phone}: ${response.sid}`);
    return true;
  } catch (error) {
    logger.error("❌ Failed to send SMS:", error.message);
    throw new Error("SMS sending failed");
  }
};

// // import twilio from "twilio";

// // // Twilio credentials should be in environment variables
// // const accountSid = process.env.TWILIO_ACCOUNT_SID;
// // const authToken = process.env.TWILIO_AUTH_TOKEN;
// // const fromNumber = process.env.TWILIO_PHONE_NUMBER;

// // if (!accountSid || !authToken || !fromNumber) {
// //   console.warn("Twilio credentials are not properly configured");
// // }

// // export async function sendSMS(to: string, message: string): Promise<void> {
// //   // If Twilio is not configured, log the message instead
// //   if (!accountSid || !authToken || !fromNumber) {
// //     console.log("SMS would have been sent:", { to, message });
// //     return;
// //   }

// //   try {
// //     const client = twilio(accountSid, authToken);
// //     await client.messages.create({
// //       body: message,
// //       to,
// //       from: fromNumber,
// //     });
// //   } catch (error) {
// //     console.error("Failed to send SMS:", error);
// //     throw new Error("Failed to send SMS");
// //   }
// // }
// import axios from "axios";

// const VIETTEL_SMS_URL = process.env.VIETTEL_SMS_URL;
// const ACCESS_TOKEN = process.env.VIETTEL_SMS_ACCESS_TOKEN;
// const BRAND_NAME = process.env.VIETTEL_SMS_BRANDNAME;

// if (!VIETTEL_SMS_URL || !ACCESS_TOKEN || !BRAND_NAME) {
//   console.warn("Viettel SMS credentials are not properly configured");
// }

// export async function sendSMS(to: string, message: string): Promise<void> {
//   if (!VIETTEL_SMS_URL || !ACCESS_TOKEN || !BRAND_NAME) {
//     console.log("SMS would have been sent:", { to, message });
//     return;
//   }

//   try {
//     // Format phone number to remove country code if present
//     const phoneNumber = to.replace(/^\+84/, "0");

//     const response = await axios.post(
//       VIETTEL_SMS_URL,
//       {
//         RequestID: String(Date.now()),
//         ServiceID: BRAND_NAME,
//         CommandCode: "BrandName",
//         Content: message,
//         Phone: phoneNumber,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${ACCESS_TOKEN}`,
//         },
//       }
//     );

//     if (response.data.status !== 1) {
//       throw new Error(`SMS sending failed: ${response.data.message}`);
//     }
//   } catch (error) {
//     console.error("Failed to send SMS:", error);
//     throw new Error("Failed to send SMS");
//   }
// }

import axios from "axios";

const INFOBIP_API_KEY = process.env.INFOBIP_API_KEY;
const INFOBIP_BASE_URL = process.env.INFOBIP_BASE_URL;
const INFOBIP_SENDER = process.env.INFOBIP_SENDER || "GiPuDiHiPin";

export async function sendSMS(to: string, message: string): Promise<void> {
    if (!INFOBIP_API_KEY || !INFOBIP_BASE_URL) {
      console.log("SMS would have been sent:", { to, message });
      return;
    }
  
    try {
      // Chuẩn hóa số điện thoại
      let phoneNumber = to;
      // Nếu số bắt đầu bằng 0, thay bằng +84
      if (to.startsWith('0')) {
        phoneNumber = '+84' + to.substring(1);
      }
      // Nếu số chưa có +84, thêm vào
      else if (!to.startsWith('+84')) {
        phoneNumber = '+84' + to;
      }
  
      console.log('Formatted phone number:', phoneNumber); // Log để debug
  
      const response = await axios.post(
        `https://${INFOBIP_BASE_URL}/sms/2/text/advanced`,
        {
          messages: [{
            from: INFOBIP_SENDER,
            destinations: [{ to: phoneNumber }],
            text: message
          }]
        },
        {
          headers: {
            'Authorization': `App ${INFOBIP_API_KEY}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
  
      console.log('API Response:', response.data); // Log response để debug
  
      if (response.data.messages?.[0]?.status?.groupId !== 1) {
        console.error('SMS Error Details:', response.data.messages?.[0]?.status);
        throw new Error('SMS sending failed');
      }
    } catch (error) {
      console.error("Failed to send SMS:", error);
      if (axios.isAxiosError(error)) {
        console.error('API Error Details:', {
          response: error.response?.data,
          status: error.response?.status,
        });
      }
      throw new Error("Failed to send SMS");
    }
  }
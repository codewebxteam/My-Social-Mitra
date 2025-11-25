const axios = require("axios");
const crypto = require("crypto");

// --- CREDENTIALS ---
const MERCHANT_ID = "PGTESTPAYUAT";
const SALT_KEY = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
const SALT_INDEX = 1;
const HOST_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox";

async function testPayment() {
    console.log("🔍 Testing PhonePe Connection...");

    const transactionId = "TEST_" + Date.now();
    
    const payloadData = {
        merchantId: MERCHANT_ID,
        merchantTransactionId: transactionId,
        merchantUserId: "USER_123",
        amount: 10000, // ₹100.00
        redirectUrl: "http://localhost:5173/success",
        redirectMode: "REDIRECT",
        mobileNumber: "9999999999",
        paymentInstrument: { type: "PAY_PAGE" }
    };

    // Encode
    const payload = Buffer.from(JSON.stringify(payloadData)).toString("base64");
    const stringToHash = payload + "/pg/v1/pay" + SALT_KEY;
    const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
    const checksum = sha256 + "###" + SALT_INDEX;

    try {
        const response = await axios.post(
            `${HOST_URL}/pg/v1/pay`,
            { request: payload },
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-VERIFY": checksum,
                }
            }
        );
        console.log("✅ SUCCESS! Payment Link:", response.data.data.instrumentResponse.redirectInfo.url);
    } catch (error) {
        console.log("❌ FAILED!");
        if (error.response) {
            console.log("Error Code:", error.response.data.code);
            console.log("Error Message:", error.response.data.message);
        } else {
            console.log(error.message);
        }
    }
}

testPayment();
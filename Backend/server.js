const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const axios = require("axios");
const admin = require("firebase-admin");
require("dotenv").config(); 

const app = express();

app.use(cors());
app.use(express.json());

// --- FIREBASE CONNECTION ---
try {
  const serviceAccount = require("./serviceAccountKey.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("✅ Firebase Admin Connected");
} catch (error) {
  console.log("⚠️ Firebase Key Warning: DB updates won't work without key.");
}

const db = admin.apps.length ? admin.firestore() : null;

// ==================================================
// 🛠️ SETTINGS: SIMULATION MODE ON
// Kyunki PhonePe Sandbox Key down hai, hum isse TRUE rakhenge
// taaki aapka project na ruke.
// ==================================================
const SKIP_PHONEPE_CHECK = true; 

// PhonePe Credentials (Real wale baad mein dalna)
const PHONEPE_HOST_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox";
const MERCHANT_ID = "PGTESTPAYUAT"; 
const SALT_KEY = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
const SALT_INDEX = 1;

// --- 1. INITIATE PAYMENT ---
app.post("/api/payment/initiate", async (req, res) => {
  try {
    console.log("🔔 Payment Request Recieved...");
    
    let { userId, amount, phone } = req.body;
    const cleanPhone = String(phone).replace(/\D/g, "").slice(-10);
    const merchantTransactionId = "TXN_" + Date.now();

    // --- SIMULATION MODE (Agar PhonePe Down Hai) ---
    if (SKIP_PHONEPE_CHECK) {
        console.log("⚠️ SIMULATION MODE: Skipping PhonePe Server Call...");
        
        // Fake DB Entry
        if(db) {
            await db.collection("transactions").doc(merchantTransactionId).set({
                userId, amount, status: "PENDING", createdAt: new Date().toISOString()
            });
        }

        // Hum user ko direct SUCCESS URL de denge (Fake Payment Link)
        // Real life mein ye PhonePe ka link hota hai
        const fakeSuccessUrl = `http://localhost:5173/payment-success?id=${merchantTransactionId}&status=SUCCESS`;
        
        console.log("✅ Simulated Link Generated:", fakeSuccessUrl);
        
        // Thoda delay taaki loading feel aaye
        setTimeout(() => {
            res.json({ success: true, url: fakeSuccessUrl });
        }, 1000);
        return; 
    }

    // --- REAL PHONEPE CODE (Jab Original Key chalegi tab ye use hoga) ---
    const data = {
      merchantId: MERCHANT_ID,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: userId.slice(0, 30),
      amount: amount * 100,
      redirectUrl: `http://localhost:5173/payment-success?id=${merchantTransactionId}`,
      redirectMode: "REDIRECT",
      mobileNumber: cleanPhone,
      paymentInstrument: { type: "PAY_PAGE" }
    };

    const payload = Buffer.from(JSON.stringify(data)).toString("base64");
    const stringToHash = payload + "/pg/v1/pay" + SALT_KEY;
    const checksum = crypto.createHash("sha256").update(stringToHash).digest("hex") + "###" + SALT_INDEX;

    const response = await axios.post(
      `${PHONEPE_HOST_URL}/pg/v1/pay`,
      { request: payload },
      { headers: { "Content-Type": "application/json", "X-VERIFY": checksum } }
    );

    if(db) {
        await db.collection("transactions").doc(merchantTransactionId).set({
            userId, amount, status: "PENDING", createdAt: new Date().toISOString()
        });
    }

    res.json({ success: true, url: response.data.data.instrumentResponse.redirectInfo.url });

  } catch (error) {
    console.error("❌ Payment Failed:", error.message);
    res.json({ success: false, error: error.message });
  }
});

// --- 2. CHECK STATUS ---
app.post("/api/payment/status", async (req, res) => {
  const { merchantTransactionId } = req.body;
  console.log(`🔎 Checking Status for: ${merchantTransactionId}`);

  // --- SIMULATION MODE ---
  if (SKIP_PHONEPE_CHECK) {
      console.log("✅ SIMULATION: Marking Payment as Success");
      
      if(db) {
        // 1. Transaction Update
        const txnRef = db.collection("transactions").doc(merchantTransactionId);
        const txnDoc = await txnRef.get();
        
        if(txnDoc.exists) {
            const userId = txnDoc.data().userId;
            
            // 2. User Profile Update (Mark as Paid)
            await db.collection("artifacts").doc("default-app")
                    .collection("users").doc(userId)
                    .collection("profile").doc("account_info")
                    .update({
                        paymentStatus: "paid",
                        paymentId: merchantTransactionId,
                        planActive: true,
                        updatedAt: new Date().toISOString()
                    });
            
            await txnRef.update({ status: "SUCCESS" });
            return res.json({ success: true, message: "Payment Verified (Simulated)" });
        }
      }
      // Agar DB nahi hai toh bhi success bhejo testing ke liye
      return res.json({ success: true, message: "Payment Verified (Simulated)" });
  }

  // --- REAL STATUS CHECK CODE ---
  // (Ye tab chalega jab SKIP_PHONEPE_CHECK = false hoga)
  // ... (Same as before) ...
});

app.listen(5001, () => console.log("🚀 Backend running on Port 5001 (Simulation Mode: ON)"));
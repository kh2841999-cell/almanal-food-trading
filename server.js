const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ هنا بيخلي السيرفر يقدّم الفرونت (index.html, style.css, الصور...)
app.use(express.static(path.join(__dirname)));

// 🔑 بيانات Paymob (لازم تغيرهم من حسابك)
const API_KEY = "YOUR_PAYMOB_API_KEY";       // من Dashboard
const INTEGRATION_ID = "YOUR_INTEGRATION_ID"; // من Integration
const IFRAME_ID = "YOUR_IFRAME_ID";           // من IFrame

// 🚀 API الدفع
app.post("/pay", async (req, res) => {
  try {
    // 1. Token
    const auth = await axios.post("https://accept.paymob.com/api/auth/tokens", {
      api_key: API_KEY
    });
    const token = auth.data.token;

    // 2. Order
    const order = await axios.post("https://accept.paymob.com/api/ecommerce/orders", {
      auth_token: token,
      delivery_needed: "false",
      amount_cents: "2500", // مثال: 25 جنيه
      currency: "EGP",
      items: []
    });
    const orderId = order.data.id;

    // 3. Payment Key
    const paymentKey = await axios.post("https://accept.paymob.com/api/acceptance/payment_keys", {
      auth_token: token,
      amount_cents: "2500",
      expiration: 3600,
      order_id: orderId,
      billing_data: {
        apartment: "NA",
        email: "customer@test.com",
        floor: "NA",
        first_name: "عميل",
        street: "NA",
        building: "NA",
        phone_number: "+201000000000",
        shipping_method: "NA",
        postal_code: "NA",
        city: "Cairo",
        country: "EG",
        last_name: "تجريبي",
        state: "NA"
      },
      currency: "EGP",
      integration_id: INTEGRATION_ID
    });

    const paymentToken = paymentKey.data.token;

    // 4. إرجاع رابط الدفع للفرونت
    res.json({
      payment_url: `https://accept.paymob.com/api/acceptance/iframes/${IFRAME_ID}?payment_token=${paymentToken}`
    });

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "خطأ في عملية الدفع" });
  }
});

// ✅ تشغيل السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Main endpoint to handle Lionwheel API requests
app.post('/api/create-task', async (req, res) => {
  try {
    const API_KEY = 'c_key_3694a9a7-6993-4d4a-8016-cedf0759f9eb';
    const LIONWHEEL_URL = 'https://members.lionwheel.com/api/v1/tasks/create';

    // Get WooCommerce order data from request body
    const wooOrder = req.body;

    // Transform WooCommerce data to Lionwheel format
    const lionwheelData = {
      pickup_at: new Date(wooOrder.date_created).toLocaleDateString('en-GB'),
      original_order_id: wooOrder.id,
      notes: `Order #${wooOrder.number}`,
      packages_quantity: "1", // Default to 1 if not specified
      destination_city: wooOrder.shipping.city,
      destination_street: wooOrder.shipping.address_1,
      destination_number: wooOrder.shipping.address_2 || "",
      destination_floor: "",
      destination_apartment: "",
      destination_notes: `Order #${wooOrder.number}\n${wooOrder.customer_note || ""}`,
      destination_recipient_name: `${wooOrder.shipping.first_name} ${wooOrder.shipping.last_name}`,
      destination_phone: wooOrder.billing.phone,
      destination_email: wooOrder.billing.email
    };

    // Make request to Lionwheel API
    const response = await axios.post(`${LIONWHEEL_URL}?key=${API_KEY}`, lionwheelData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to create task',
      details: error.response?.data || error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.use(express.static(__dirname));

// Dhan API से ऑप्शन चेन लाने का राउट
app.get('/api/option-chain', async (req, res) => {
    try {
        const symbol = req.query.symbol || 'NIFTY';
        
        // नोट: यहाँ अपना असली Dhan Client ID और Access Token डालें (या Environment Variable से लें)
        const dhanClientId = process.env.DHAN_CLIENT_ID || 'YOUR_CLIENT_ID';
        const dhanToken = process.env.DHAN_ACCESS_TOKEN || 'YOUR_ACCESS_TOKEN';

        // यदि अभी लाइव टोकन नहीं है, तो यह बैकएंड डेमो फॉर्मेट रिटर्न कर देगा ताकि ऐप एरर न दे
        if(dhanToken === 'YOUR_ACCESS_TOKEN') {
            return res.json({
                spot: 25525,
                rows: [
                    { strike: 25300, ce: 190000, pe: 230000 },
                    { strike: 25400, ce: 220000, pe: 270000 },
                    { strike: 25500, ce: 260000, pe: 340000 },
                    { strike: 25600, ce: 310000, pe: 290000 }
                ]
            });
        }

        const response = await axios.get('https://api.dhan.co/v2/optionchain', {
            headers: {
                'access-token': dhanToken,
                'client-id': dhanClientId,
                'Content-Type': 'application/json'
            },
            params: { underlyingScript: symbol }
        });

        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'Dhan API से डेटा लाने में विफल: ' + err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const fetch = (url, init) => import('node-fetch').then(module => module.default(url, init));
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;
console.log('yes', typeof fetch)

// This allows your frontend (running on a different port) to make requests to this server
app.use(cors({
    origin: "*",
}));

// This is the proxy endpoint your frontend will call
app.get('/api/geyser/:username', async (req, res) => {
    try {
        const username = req.params.username;
        // The actual API we are fetching from on the server-side
        const apiUrl = `https://api.geysermc.org/v2/utils/uuid/bedrock_or_java/${username}?prefix=.`;
        
        console.log(`Fetching data for: ${username}`); // Log to terminal to see it working
        
        const apiResponse = await fetch(apiUrl);
        if (!apiResponse.ok) {
            // Handle cases where the API returns an error
            throw new Error(`GeyserMC API returned status: ${apiResponse.status}`);
        }
        const data = await apiResponse.json();
        
        // Send the data back to your frontend
        res.json(data);
    } catch (error) {
        console.error('Proxy Error:', error);
        res.status(500).json({ error: 'Failed to fetch data from GeyserMC API' });
    }
});

app.get('/api/creepernation/:uuid', async (req, res) => {
    try {
        const uuid = req.params.uuid;
        // The actual API we are fetching from on the server-side
        const apiUrl = `https://api.creepernation.net/player/${uuid}`;
        
        console.log(`Fetching data for: ${uuid}`); // Log to terminal to see it working
        
        const apiResponse = await fetch(apiUrl);
        if (!apiResponse.ok) {
            // Handle cases where the API returns an error
            throw new Error(`GeyserMC API returned status: ${apiResponse.status}`);
        }
        const data = await apiResponse.text();
        
        // Send the data back to your frontend
        // res.json(data);
        // res.json({result: data});
        res.setHeader('content-type', 'image/png');
        res.send()
    } catch (error) {
        console.error('Proxy Error:', error);
        res.status(500).json({ error: 'OOgaBooga' });
    }
});

// You can add more proxy endpoints here for other APIs
// For example, for the CreeperNation API:
// app.get('/api/creepernation/:uuid', async (req, res) => { ... });

app.listen(port, () => {
    console.log(`✅ Proxy server is running at http://localhost:${port}`);
});
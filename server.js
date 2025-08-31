const fetch = (url, init) => import('node-fetch').then(module => module.default(url, init));
const express = require('express');
const mcs = require('node-mcstatus');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const db = require('./database.js');

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

// app.get('/api/creepernation/:uuid', async (req, res) => {
//     try {
//         const uuid = req.params.uuid;
//         // The actual API we are fetching from on the server-side
//         const apiUrl = `https://api.creepernation.net/player/${uuid}`;
        
//         console.log(`Fetching data for: ${uuid}`); // Log to terminal to see it working
        
//         const apiResponse = await fetch(apiUrl);
//         if (!apiResponse.ok) {
//             // Handle cases where the API returns an error
//             throw new Error(`GeyserMC API returned status: ${apiResponse.status}`);
//         }
//         const data = await apiResponse.text();
        
//         // Send the data back to your frontend
//         // res.json(data);
//         // res.json({result: data});
//         res.setHeader('content-type', 'image/png');
//         res.send()
//     } catch (error) {
//         console.error('Proxy Error:', error);
//         res.status(500).json({ error: 'OOgaBooga' });
//     }
// });

//this is the endpoint for checking the server status
app.get('/api/mc-status', (req, res) => {
    //These values are to be given on the frontend
    const host = req.query.host
    const port = 25565
    
    if (!host) {
        return res.status(400).json({ error: 'Host query parameter is required.' });
    }

    mcs.statusJava(host, port)
        .then((result) => {
            res.json(result);
        })
        .catch((error) => {
            console.error(`Failed to get status for ${host}:`, error);
            res.status(500).json({ error: 'Failed to fetch status' });
        });
});



app.listen(port, () => {
    console.log(`✅ Proxy server is running at http://localhost:${port}`);
});
const fetch = (url, init) => import('node-fetch').then(module => module.default(url, init));
const express = require('express');
const mcs = require('node-mcstatus');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const db = require('./database.js');

const app = express();
const port = 3000;
const SKIN_CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

console.log('yes', typeof fetch)

app.use(cors({
    origin: "*",
}));

app.use('/skins', express.static(path.join(__dirname, 'skins')));

// New endpoint to get a UUID from our local cache
app.get('/api/uuid/:username', (req, res) => {
    const { username } = req.params;
    db.get('SELECT uuid FROM players WHERE username = ?', [username], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (row) {
            res.json({ uuid: row.uuid });
        } else {
            res.status(404).json({ error: 'UUID not found' });
        }
    });
});

// This endpoint now fetches from GeyserMC and caches the result
app.get('/api/geyser/:username', async (req, res) => {
    try {
        const username = req.params.username;
        const apiUrl = `https://api.geysermc.org/v2/utils/uuid/bedrock_or_java/${username}?prefix=.`;

        console.log(`Fetching data for: ${username} from GeyserMC`);

        const apiResponse = await fetch(apiUrl);
        if (!apiResponse.ok) {
            throw new Error(`GeyserMC API returned status: ${apiResponse.status}`);
        }
        const data = await apiResponse.json();

        // Cache the username and UUID in the database
        db.run(
            `INSERT OR REPLACE INTO players (username, uuid, last_checked) VALUES (?, ?, ?)`,
            [username, data.id, Date.now()],
            (err) => {
                if (err) {
                    console.error('Database Error:', err);
                }
            }
        );

        res.json(data);
    } catch (error) {
        console.error('Proxy Error:', error);
        res.status(500).json({ error: 'Failed to fetch data from GeyserMC API' });
    }
});

// This endpoint for fetching skins remains the same
app.get('/api/creepernation/:uuid', async (req, res) => {
    try {
        const { uuid } = req.params;
        const username = req.query.username; // Get username from query param

        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        const now = Date.now();
        const skinPath = path.join(__dirname, 'skins', `${uuid}.png`);

        db.get('SELECT * FROM skins WHERE uuid = ?', [uuid], async (err, row) => {
            if (err) {
                console.error('Database Error:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (row && (now - row.last_updated) < SKIN_CACHE_DURATION) {
                return res.sendFile(skinPath);
            } else {
                const apiResponse = await fetch(`https://api.creepernation.net/player/${uuid}`);
                if (!apiResponse.ok) {
                    throw new Error(`Creepernation API returned status: ${apiResponse.status}`);
                }

                const buffer = await apiResponse.arrayBuffer();
                fs.writeFileSync(skinPath, Buffer.from(buffer));

                const lastUpdated = Date.now();
                db.run(
                    `INSERT OR REPLACE INTO skins (uuid, image_path, last_updated) VALUES (?, ?, ?)`,
                    [uuid, `/skins/${uuid}.png`, lastUpdated],
                    (err) => {
                        if (err) {
                            console.error('Database Error:', err);
                        }
                    }
                );

                res.sendFile(skinPath);
            }
        });
    } catch (error) {
        console.error('Proxy Error:', error);
        res.status(500).json({ error: 'Failed to fetch data from Creepernation API' });
    }
});


app.get('/api/mc-status', (req, res) => {
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
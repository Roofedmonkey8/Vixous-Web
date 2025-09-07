document.addEventListener('DOMContentLoaded', () => {
    const statsApiUrl = 'http://localhost:3000/api/leaderboard'
   
    var Podium = document.getElementById("podium_text_flex_box")
    fetch(statsApiUrl)
        .then(res => res.json())
        .then(data => {
            everything(data)
            console.log(data)
        })
    function everything(data){
        categories = ["money", "level", "time"]
        const places = ["first", "second", "third"]
        categories.forEach(category => {
            var leaderboardlist = document.getElementById(`${category}LeaderboardRunnerUp`)
            for(let i = 0; i < leaderboardlist.children.length; i++){ 
            leaderboardlist.children[i].textContent = i+4 + "th " + data.scoreboard.scores[`top_${category}_${i+4}_name`]['#server']
            if (data.scoreboard.scores[`top_${category}_${i+4}_name`]['#server'] !== "None"){
                leaderboardlist.children[i].textContent += " $" + data.scoreboard.scores[`top_${category}_${i+4}_value`]['#server']
            } else {
                leaderboardlist.children[i].textContent += " $" + data.scoreboard.scores[`top_${category}_${i+4}_value`]['#server']
            }

             for(let i = 0; i < places.length; i++) {
                const position = i+1;
                const place = places[i];
                const key = `top_${category}_${position}_name`
                const vKey = `top_${category}_${position}_value`
                const playerName = data.scoreboard.scores[key]["#server"]
                const imageId = `${category}_${place}_place_skin`
                // console.log("key: " + key);
                // console.log("playername: " + playerName);
                // console.log("image id: " + imageId)
                if (category === "level") {
                    document.getElementById(`${category}_${place}_place_text`).textContent = data.scoreboard.scores[key]['#server']
                    document.getElementById(`${category}_${place}_place_subtext`).textContent = "Level: " + data.scoreboard.scores[vKey]['#server']
                } else if (category === "time"){
                    document.getElementById(`${category}_${place}_place_text`).textContent = data.scoreboard.scores[key]['#server']
                    document.getElementById(`${category}_${place}_place_subtext`).textContent = data.scoreboard.scores[vKey]['#server']
                } else {
                    document.getElementById(`${category}_${place}_place_text`).textContent = data.scoreboard.scores[key]['#server']
                    document.getElementById(`${category}_${place}_place_subtext`).textContent = "$" + data.scoreboard.scores[vKey]['#server']
                }

                if (playerName && playerName != "None") {
                     getPlayerSkin(playerName, imageId)
                }            
            }
        };
    });


    async function getPlayerSkin(username, imageId) {
        try {
            let uuid;

            // check db for uuid
            const cachedRes = await fetch(`http://localhost:3000/api/uuid/${username}`);

            if (cachedRes.ok) {
                const data = await cachedRes.json();
                uuid = data.uuid;
            } else {
                // if not in db fetch from geyser
                console.log(`UUID for ${username} not found in cache. Fetching from GeyserMC.`);
                const geyserRes = await fetch(`http://localhost:3000/api/geyser/${username}`);
                const geyserData = await geyserRes.json();
                uuid = geyserData.id;
            }

            // get skin from creepernation api
            if (uuid) {
                document.getElementById(imageId).src = `http://localhost:3000/api/creepernation/${uuid}?username=${username}`;
            }
        } catch (error) {
            console.error(`Failed to get skin for ${username}:`, error);
        }
    }    
}});
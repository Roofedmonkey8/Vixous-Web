document.addEventListener('DOMContentLoaded', () => {
    const statsApiUrl = 'http://62.72.177.7:18724/stats.json'
    var leaderboardlist = document.getElementById("leaderboard-list")
    var Podium = document.getElementById("podium_text_flex_box")
    fetch(statsApiUrl)
        .then(res => res.json())
        .then(data => {
            everything(data)
            console.log(data)
        })
    function everything(data){
        for(var i = 0; i < leaderboardlist.children.length; i++){ 
            leaderboardlist.children[i].textContent = i+4 + "th " + data.scoreboard.scores[`top_money_${i+4}_name`]['#server']
            if (data.scoreboard.scores[`top_money_${i+4}_name`]['#server'] !== "None"){
                leaderboardlist.children[i].textContent += " $" + data.scoreboard.scores[`top_money_${i+4}_value`]['#server']
            }
        }
        document.getElementById("First_place_text").textContent = data.scoreboard.scores[`top_money_1_name`]['#server']
        document.getElementById("First_place_subtext").textContent = "$" + data.scoreboard.scores[`top_money_1_value`]['#server']  
        document.getElementById("Second_place_text").textContent = data.scoreboard.scores[`top_money_2_name`]['#server']
        document.getElementById("Second_place_subtext").textContent = "$" + data.scoreboard.scores[`top_money_2_value`]['#server'] 
        document.getElementById("Third_place_text").textContent = data.scoreboard.scores[`top_money_3_name`]['#server']
        document.getElementById("Third_place_subtext").textContent = "$" + data.scoreboard.scores[`top_money_3_value`]['#server'] 
        const moneyPlayerNames = [data.scoreboard.scores[`top_money_1_name`]["#server"],data.scoreboard.scores[`top_money_2_name`]["#server"],data.scoreboard.scores[`top_money_3_name`]["#server"]]

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

    getPlayerSkin(moneyPlayerNames[0], "First_place_baltop");
    getPlayerSkin(moneyPlayerNames[1], "Second_place_baltop");
    getPlayerSkin(moneyPlayerNames[2], "Third_place_baltop");
}});
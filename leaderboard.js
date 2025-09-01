document.addEventListener('DOMContentLoaded', () => {
    const statsApiUrl = 'http://62.72.177.7:18724/stats.json'
    var leaderboardlist = document.getElementById("leaderboard-list")
    var Podium = document.getElementById("podium_text_flex_box")
    fetch(statsApiUrl)
        .then(res => res.json())
        .then(data => {
            everything(data)
        })
    function everything(data){
        for(var i = 0; i < leaderboardlist.children.length; i++){
            leaderboardlist.children[i].textContent = i+4 + "th " + data.scoreboard.scores[`top_money_${i+4}_name`]['#server'] + " $" + data.scoreboard.scores[`top_money_${i+4}_value`]['#server']
        //I know they are magic numbers
        //I don't care
        //Figure it out
        Podium.children[1].textContent = data.scoreboard.scores[`top_money_1_name`]['#server']
        Podium.children[4].textContent = "$" + data.scoreboard.scores[`top_money_1_value`]['#server']  
        Podium.children[2].textContent = data.scoreboard.scores[`top_money_2_name`]['#server']
        Podium.children[5].textContent = "$" + data.scoreboard.scores[`top_money_2_value`]['#server'] 
        Podium.children[0].textContent = data.scoreboard.scores[`top_money_3_name`]['#server']
        Podium.children[3].textContent = "$" + data.scoreboard.scores[`top_money_3_value`]['#server'] 
        }
        const playernames = [data.scoreboard.scores[`top_money_1_name`]["#server"],data.scoreboard.scores[`top_money_2_name`]["#server"],data.scoreboard.scores[`top_money_3_name`]["#server"]]

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

    getPlayerSkin(playernames[0], "First_place_baltop");
    getPlayerSkin(playernames[2], "Second_place_baltop");
    getPlayerSkin(playernames[1], "Third_place_baltop");
}});
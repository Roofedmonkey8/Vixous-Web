document.addEventListener('DOMContentLoaded', () => {
    const statsApiUrl = 'http://localhost:3000/api/leaderboard'
   
    // let Podium = document.getElementById("podium_text_flex_box")
    fetch(statsApiUrl)
        .then(res => res.json())
        .then(data => {
            everything(data)
            // console.log(data)
        })
    function everything(data){
        // const categories = ["money", "level", "time"]
        // const places = ["first", "second", "third"]
        // console.log(typeof(data))
        // categories.forEach(category => {
        //     let leaderboardlist = document.getElementById(`${category}LeaderboardRunnerUp`)
        //     for(let i = 0; i < leaderboardlist.children.length; i++){ 
        //     // leaderboardlist.children[i].textContent = i+4 + "th " + data.scoreboard.scores[`top_${category}_${i+4}_name`]['#server']
        //     if (data.scoreboard.scores[`top_${category}_${i+4}_name`]['#server'] !== "None"){
        //         leaderboardlist.children[i].textContent += i+4 + "th " + " $" + data.scoreboard.scores[`top_${category}_${i+4}_value`]['#server']
        //     } else {
        //         leaderboardlist.children[i].textContent += i+4 + "th " + "---"
        //     }

        //      for(let i = 0; i < places.length; i++) {
        //         const position = i+1;
        //         const place = places[i];
        //         const key = `top_${category}_${position}_name`
        //         const vKey = `top_${category}_${position}_value`
        //         const playerName = data.scoreboard.scores[key]["#server"]
        //         const imageId = `${category}_${place}_place_skin`

        //         if (category === "level") {
        //             document.getElementById(`${category}_${place}_place_text`).textContent = playerName
        //             document.getElementById(`${category}_${place}_place_subtext`).textContent = "Level: " + data.scoreboard.scores[vKey]['#server']
        //         } else if (category === "time"){
        //             document.getElementById(`${category}_${place}_place_text`).textContent = playerName
        //             document.getElementById(`${category}_${place}_place_subtext`).textContent = data.scoreboard.scores[vKey]['#server']
        //         } else {
        //             document.getElementById(`${category}_${place}_place_text`).textContent = playerName
        //             document.getElementById(`${category}_${place}_place_subtext`).textContent = "$" + data.scoreboard.scores[vKey]['#server']
        //         }

        //         if (playerName && playerName != "None") {
        //              getPlayerSkin(playerName, imageId)
        //         }            
        //     }
        // };
        const testResponse = 
        fetch('http://127.0.0.1:3000/api/leaderboard')
        .then(res => res.json())
        .then(namedata => {
            let vbame = document.getElementsByClassName("Bame")
            let vbalue = document.getElementsByClassName("balue")
            for(let i = 0; i < vbame.length; i++){
                if (namedata[i]["name"] !== "None"){
                    vbame[i].textContent += namedata[i]["name"]
                }else {
                    vbame[i].textContent += "---"
                }
            }
            for(let i = 0; i < vbalue.length; i++){
                if (namedata[i]["value"] !== "0"){
                    vbalue[i].textContent += " $" + namedata[i]["value"]
                }
            }
        })
        // const test = testResponse.json();
    };


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
});
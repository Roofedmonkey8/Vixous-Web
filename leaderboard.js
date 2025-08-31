document.addEventListener('DOMContentLoaded', () => {
    const statsApiUrl = 'http://62.72.177.7:18724/stats.json'
    const CreepernationApiUrl = "https://api.creepernation.net/player/"
    var leaderboardlist = document.getElementById("leaderboard-list")
    var Podium = document.getElementById("podium_text_flex_box")
    fetch(statsApiUrl)
        .then(res => res.json())
        .then(data => {
            everything(data)
        })
    function everything(data){
        for(var i = 0; i < leaderboardlist.children.length; i++){
            leaderboardlist.children[i].textContent = i+4 + "th " + data.scoreboard.scores[`baltop_${i+4}_name`]['#server'] + " $" + data.scoreboard.scores[`baltop_${i+4}_value`]['#server']
        //I know they are magic numbers
        //I don't care
        //Figure it out
        Podium.children[1].textContent = data.scoreboard.scores[`baltop_1_name`]['#server']
        Podium.children[4].textContent = "$" + data.scoreboard.scores[`baltop_1_value`]['#server']  
        Podium.children[2].textContent = data.scoreboard.scores[`baltop_2_name`]['#server']
        Podium.children[5].textContent = "$" + data.scoreboard.scores[`baltop_2_value`]['#server'] 
        Podium.children[0].textContent = data.scoreboard.scores[`baltop_3_name`]['#server']
        Podium.children[3].textContent = "$" + data.scoreboard.scores[`baltop_3_value`]['#server'] 
        }
        const playernames = [data.scoreboard.scores[`baltop_1_name`]["#server"],data.scoreboard.scores[`baltop_2_name`]["#server"],data.scoreboard.scores[`baltop_3_name`]["#server"]]
        fetch(`http://localhost:3000/api/geyser/${playernames[0]}`)
            .then(res => res.json())
            .then(data => {
                const id = data["id"]
                document.getElementById("First_place_baltop").src = CreepernationApiUrl + id
            })
        fetch(`http://localhost:3000/api/geyser/${playernames[2]}`)
            .then(res => res.json())
            .then(data => {
                const id = data["id"]
                document.getElementById("Second_place_baltop").src = CreepernationApiUrl + id
            })
        fetch(`http://localhost:3000/api/geyser/${playernames[1]}`)
            .then(res => res.json())
            .then(data => {
                const id = data["id"]
                document.getElementById("Third_place_baltop").src = CreepernationApiUrl + id
            })
}});
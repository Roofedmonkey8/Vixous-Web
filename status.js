document.addEventListener('DOMContentLoaded', () => {
    const host = 'a48a514a.play.servcity.org';
    const statusApi = `http://localhost:3000/api/mc-status?host=${host}`;
    const serverStatus = document.getElementById('server-status');
    const statsApiUrl = 'http://localhost:3000/api/leaderboard'

    // https://mcstatus.io/docs#java-status
    fetch(statusApi)
        .then(res => res.json())
        .then(data => {
            if (data.online) {
                serverStatus.textContent = 'Server is Online!'
                serverStatus.style.color = 'green'
            }
            else {
                serverStatus.textContent = 'Server is Offline'
                serverStatus.style.color = 'red'
            }
        })
        .catch((error) => {
            // If the server is offline, then
            // you will NOT receive an error here.
            // Instead, you will use the `result.online`
            // boolean values in `.then()`.
            // Receiving an error here means that there
            // was an error with the service itself.
        })
            
    updateServerStats();
    setInterval(updateServerStats, 15000);

    function updateServerStats(){
        fetch(statsApiUrl)
            .then(res => res.json())
            .then(data => {
                const serverStatus = document.getElementById('server-status');
                const playerCountElement = document.getElementById('player-count');
                const playerListElement = document.getElementById('player-list');
                const playerlist = Object.keys(data.online)
                const playeractiviylist = Object.values(data.online)
                const playerlistlength = playerlist.length
                // console.log("Here!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")

                if (playerlistlength == 0){
                    playerCountElement.textContent = "Players: " + playerlistlength + "/" + 30
                } else if (playerlistlength > 0) {
                    playerCountElement.textContent = "Players: " + playerlistlength + "/" + 30
                    playerListElement.replaceChildren()
                    for (var i = 0; i < playerlistlength; i++){
                        const PlayerEntry = document.createElement('p');
                        playerListElement.appendChild(PlayerEntry);
                        PlayerEntry.textContent = playerlist[i]
                        if(playeractiviylist[i] !== true){
                            PlayerEntry.textContent += " [AFK]"
                            PlayerEntry.style.color = 'gray'
                        }   
                    }
                }
            })
    }
});
            
            
        
        
        
        
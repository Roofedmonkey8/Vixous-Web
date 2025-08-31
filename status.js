document.addEventListener('DOMContentLoaded', () => {
    const host = 'tired.is.gae.jcfbd.com';
    const statusApi = `http://localhost:3000/api/mc-status?host=${host}`;
    const serverStatus = document.getElementById('server-status');

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
    function updateServerStats() {
        fetch(statsApiUrl)
            .then(response => {

                const serverStatusElement = document.getElementById('server-status');
                const playerCountElement = document.getElementById('player-count');
                const playerListElement = document.getElementById('player-list');
    
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
            })
            .then(data => {
                playerCountElement = document.getElementById('player-count');
                playerListElement = document.getElementById('player-list');

                playerListElement.innerHTML = '';
                
                // Takes playercount from json data
                const onlinePlayers = data.online ? Object.keys(data.online).length : 0;
                const maxPlayers = '30';
                
                playerCountElement.textContent = `${onlinePlayers}/${maxPlayers}`;
                
                if (onlinePlayers > 0) {
                    // This loop will only run if there is at least one player online.
                    for (const player in data.online) {
                        if (data.online[player] === true) {
                            const playerNameElement = document.createElement('p');
                            playerNameElement.textContent = player;
                            playerListElement.appendChild(playerNameElement);
                        } else if (data.online[player] === 'afk') {
                            const playerNameAfkElement = document.createElement('p');
                            playerNameAfkElement.textContent = player + ' (AFK)';
                            playerNameAfkElement.style.color = 'gray'; 
                            playerListElement.appendChild(playerNameAfkElement);
                        }
                    }
                } else {
                    const noPlayersElement = document.createElement('p');
                    noPlayersElement.textContent = 'No one is online.';
                    playerListElement.appendChild(noPlayersElement);
                }
            })
            .catch(error => {
                // if it fails to get the data for any reason the script assumes the server is offline
                console.error("Failed to fetch server data:", error);
                const serverStatusElement = document.getElementById('server-status');
                const playerCountElement = document.getElementById('player-count');
                
                serverStatusElement.textContent = 'Server is Offline';
                serverStatusElement.style.color = '#FF4500';
                playerCountElement.textContent = '';
                playerListElement.innerHTML = '';
            });
    }
            
    // updateServerStats();
    // setInterval(updateServerStats, 15000);

    
});
            
            
        
        
        
        
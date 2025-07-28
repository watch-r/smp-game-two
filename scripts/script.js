// const players = [];

// function startGame() {
//     if (players.length < 3)
//         return alert("Need at least 3 players to start the game.");
//     localStorage.setItem("round", "1");

//     const assignedPlayers = assignRoles();
//     // Store roles and player list in localStorage
//     localStorage.setItem("players", JSON.stringify(assignedPlayers));

//     // Redirect to role.html (for the first player to check their role)
//     localStorage.setItem("playerIndex", "0"); // Start with first player
//     window.location.href = "role.html";
// }

// function assignRoles() {
//     const shuffled = [...players].map((p) => ({ ...p })); // Clone each player
//     shuffled.sort(() => Math.random() - 0.5);

//     shuffled[0].role = "Killer";
//     shuffled[1].role = "Police";
//     for (let i = 2; i < shuffled.length; i++) {
//         shuffled[i].role = "Civilian";
//     }

//     return shuffled;
//     // alert("Roles assigned! Check console for now.");
// }

// function joinGame() {
//     const nameInput = document.getElementById("playerName");
//     const name = nameInput.value.trim();

//     if (name === "") alert("Please Enter your name");
//     players.push({ name });
//     updatePlayerList();
//     nameInput.value = "";
// }

// function updatePlayerList() {
//     const playersUl = document.getElementById("playersUl");
//     playersUl.innerHTML = "";

//     players.forEach((player, index) => {
//         const li = document.createElement("li");
//         li.textContent = `${index + 1}. ${player.name}`;
//         li.className = "bg-gray-800 px-4 py-2 rounded";
//         playersUl.appendChild(li);
//     });
// }

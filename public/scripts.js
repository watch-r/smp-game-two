const players = [];

function startGame() {
    if (players.length < 3)
        return alert("Need at least 3 players to start the game.");
    alert("Game Starting... (Next Step: Assign Roles)");
}

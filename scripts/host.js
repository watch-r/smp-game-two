// host.js
import { supabase } from "./superbase.js";

document.getElementById("createRoomBtn").addEventListener("click", async () => {
    const roomCode = generateRoomCode();

    const hostName = document.getElementById("hostNameInput").value.trim();

    if (!hostName) {
        alert("Please enter your name");
        return;
    }

    // Insert the room into Supabase
    const { data, error } = await supabase
        .from("rooms")
        .insert([{ code: roomCode }]);

    if (error) {
        alert("Failed to create room: " + error.message);
        return;
    }

    // Show room code on screen
    document.getElementById(
        "roomCodeDisplay"
    ).textContent = `Room Code: ${roomCode}`;

    // add the host as a player
    const { error: playerError } = await supabase
        .from("players")
        .insert({ name: hostName, room_code: roomCode });

    if (playerError) {
        alert("Error adding host as player: " + playerError.message);
        return;
    }
    // Redirect after 2 seconds
    setTimeout(() => {
        window.location.href = `room.html?room=${roomCode}&host=true`;
    }, 2000);
});

// Generate 6-char room code
function generateRoomCode() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from(
        { length: 6 },
        () => chars[Math.floor(Math.random() * chars.length)]
    ).join("");
}

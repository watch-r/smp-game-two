// /scripts/play.js
import { supabase } from "./supabase.js";

// 🌐 Get URL Params
const urlParams = new URLSearchParams(window.location.search);
const roomCode = urlParams.get("room");
const isHost = urlParams.get("host") === "true";

// 🎯 DOM Elements
const statusText = document.getElementById("status");
const playersList = document.getElementById("playersList");

// 📦 Fetch players in the room
async function fetchPlayers() {
    const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("room_code", roomCode);

    if (error) {
        console.error("Error fetching players:", error.message);
        statusText.textContent = "Error loading players!";
        return;
    }

    renderPlayers(data);
}

// 🖼️ Render players
function renderPlayers(players) {
    playersList.innerHTML = "";
    players.forEach((player) => {
        const li = document.createElement("li");
        li.textContent = player.name;
        playersList.appendChild(li);
    });
}

// 🔁 Check if game has started (optional in this file if you're redirected correctly)
async function checkGameStatus() {
    const { data, error } = await supabase
        .from("rooms")
        .select("game_status")
        .eq("code", roomCode)
        .single();

    if (error) {
        console.error("Error fetching game status:", error.message);
        statusText.textContent = "Error fetching game status.";
        return;
    }

    if (data.game_status === "started") {
        statusText.textContent = "Game is in progress!";
    } else {
        statusText.textContent = "Waiting for game to start...";
    }
}

// 🔁 Optionally listen to game status change
supabase
    .channel("room-status-" + roomCode)
    .on(
        "postgres_changes",
        {
            event: "UPDATE",
            schema: "public",
            table: "rooms",
            filter: `code=eq.${roomCode}`,
        },
        (payload) => {
            if (payload.new.game_status === "started") {
                statusText.textContent = "Game just started!";
                fetchPlayers();
            }
        }
    )
    .subscribe();

// 🚀 Run
checkGameStatus();
fetchPlayers();

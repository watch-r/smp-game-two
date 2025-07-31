// /scripts/play.js
import { supabase } from "./superbase.js";

// DOM elements
const card = document.getElementById("card");
const timer = document.getElementById("timer");
const countdown = document.getElementById("countdown");
const roomInfo = document.getElementById("roomInfo");

// Get room & player name from localStorage / URL
const urlParams = new URLSearchParams(window.location.search);
const roomCode = urlParams.get("room");
const playerName = localStorage.getItem("playerName");

// Show room & player
roomInfo.textContent = `Room: ${roomCode} | Player: ${playerName}`;

// Get this player's role
let role = null;
let revealed = false;
let timeLeft = 5;
let timerInterval = null;

async function fetchRole() {
    const { data, error } = await supabase
        .from("players")
        .select("role")
        .eq("room_code", roomCode)
        .eq("name", playerName)
        .single();

    if (error || !data) {
        card.textContent = "Failed to fetch role.";
        return;
    }

    role = data.role;
}

card.addEventListener("click", () => {
    if (!role) return;

    if (!revealed) {
        revealed = true;
        card.textContent = `Your Role: ${role.toUpperCase()}`;
        card.classList.add("bg-green-700");

        timer.classList.remove("hidden");
        startCountdown();
    } else {
        revealed = false;
        card.textContent = "Tap to reveal your role";
        card.classList.remove("bg-green-700");
        timer.classList.add("hidden");
        clearInterval(timerInterval);
        countdown.textContent = 5;
        timeLeft = 5;
    }
});

function startCountdown() {
    timerInterval = setInterval(() => {
        timeLeft--;
        countdown.textContent = timeLeft;

        if (timeLeft === 0) {
            clearInterval(timerInterval);
            card.textContent = "Time's up!";
            timer.classList.add("hidden");
        }
    }, 1000);
}

// Fetch role initially
fetchRole();

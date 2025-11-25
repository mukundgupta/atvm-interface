document.addEventListener("DOMContentLoaded", () => {
  // --- Get Screen Elements ---
  const welcomeScreen = document.getElementById("welcome-screen");
  const stationScreen = document.getElementById("station-screen");

  // --- Get Button Elements ---
  const langButtons = document.querySelectorAll(".lang-btn");
  const backBtn = document.querySelector(".back-btn"); // This query still works

  // --- Get Time Elements ---
  const welcomeTimeEl = document.getElementById("welcome-time");
  const stationTimeEl = document.getElementById("station-time");

  // --- Function to update time ---
  function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const timeString = `${hours}:${minutes}`;

    // Update time on both screens
    if (welcomeTimeEl) welcomeTimeEl.textContent = timeString;
    if (stationTimeEl) stationTimeEl.textContent = timeString;
  }

  // --- Function to show station screen ---
  function showStationScreen() {
    welcomeScreen.style.display = "none";
    stationScreen.style.display = "flex";
  }

  // --- Function to show welcome screen ---
  function showWelcomeScreen() {
    stationScreen.style.display = "none";
    welcomeScreen.style.display = "flex";
  }

  // --- Add Event Listeners ---
  langButtons.forEach((button) => {
    button.addEventListener("click", showStationScreen);
  });

  // Add listener for the back button
  if (backBtn) {
    backBtn.addEventListener("click", showWelcomeScreen);
  }

  // --- Initialize Time ---
  updateTime(); // Call once on load
  // Update every minute (60000ms)
  setInterval(updateTime, 60000);
});

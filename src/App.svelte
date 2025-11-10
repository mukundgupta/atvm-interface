<script>
  import { fade, slide, scale } from "svelte/transition";
  import { onDestroy } from "svelte";

  let language = "—";
  let showOverlay = true;
  let currentPage = "language"; // "language" | "station" | "ticket" | "payment" | "booked"
  let countdown = 5;
  let _bookedCountdownInterval = null;

  // New variables for zoom behavior
  let zoomedSection = null;
  const cols = 3;
  const rows = 3;

  const stages = ["station", "ticket", "payment", "booked"];

  function setLanguage(lang) {
    language = lang;
    showOverlay = false;
    currentPage = "station";
  }

  function goNext() {
    const index = stages.indexOf(currentPage);
    if (index < stages.length - 1) {
      const next = stages[index + 1];
      currentPage = next;

      if (next === "booked") {
        if (_bookedCountdownInterval) {
          clearInterval(_bookedCountdownInterval);
          _bookedCountdownInterval = null;
        }

        countdown = 5;
        _bookedCountdownInterval = setInterval(() => {
          countdown = countdown - 1;
          if (countdown <= 0) {
            clearInterval(_bookedCountdownInterval);
            _bookedCountdownInterval = null;
            showOverlay = true;
            currentPage = "language";
            language = "—";
          }
        }, 1000);
      }
    }
  }

  onDestroy(() => {
    if (_bookedCountdownInterval) clearInterval(_bookedCountdownInterval);
  });

  function getProgress() {
    return ((stages.indexOf(currentPage) + 1) / stages.length) * 100;
  }

  function getStageLabel(stage) {
    switch (stage) {
      case "station":
        return "Station";
      case "ticket":
        return "Ticket";
      case "payment":
        return "Payment";
      case "booked":
        return "Booked";
    }
  }

  // --- Map zoom logic ---
  function zoomTo(sectionIndex) {
    zoomedSection = sectionIndex;
  }

  function resetZoom() {
    zoomedSection = null;
  }

  function getTranslate(index) {
    const col = index % cols;
    const row = Math.floor(index / cols);
    // adjust to shift the clicked area toward center
    const offsetX = (1 - 2 * (col / (cols - 1))) * 150;
    const offsetY = (1 - 2 * (row / (rows - 1))) * 150;
    return { x: offsetX, y: offsetY };
  }
</script>

<div class="main">
  {#if currentPage !== "language"}
    <div class="progress-container" transition:fade>
      <div class="progress-bar">
        <div class="progress-fill" style="width: {getProgress()}%"></div>
      </div>
      <div class="checkpoints">
        {#each stages as stage, i}
          <div class="checkpoint">
            <div
              class="circle {i <= stages.indexOf(currentPage) ? 'active' : ''}"
            ></div>
            <span class={i <= stages.indexOf(currentPage) ? "active" : ""}>
              {getStageLabel(stage)}
            </span>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  {#if currentPage === "language"}
    <div class="map">
      {#if showOverlay}
        <div class="overlay" transition:fade>
          <button on:click={() => setLanguage("English")}>English</button>
          <button on:click={() => setLanguage("हिंदी")}>हिंदी</button>
          <button on:click={() => setLanguage("मराठी")}>मराठी</button>
        </div>
      {/if}
      <div class="map-text">Language is {language}</div>
    </div>
  {:else if currentPage === "station"}
    <!-- STATION MAP WITH ZOOM -->
    <div class="map" on:dblclick={resetZoom}>
      <div
        class="map-inner"
        style="
          --zoom: {zoomedSection !== null ? 2 : 1};
          --translate-x: {zoomedSection !== null
          ? getTranslate(zoomedSection).x
          : 0}px;
          --translate-y: {zoomedSection !== null
          ? getTranslate(zoomedSection).y
          : 0}px;
        "
      ></div>

      <div class="grid-overlay">
        {#each Array(rows * cols) as _, i}
          <div class="grid-cell" on:click={() => zoomTo(i)}></div>
        {/each}
      </div>

      <button
        class="next-btn"
        transition:slide={{ duration: 400 }}
        on:click={goNext}
      >
        Next →
      </button>
    </div>
  {:else if currentPage === "ticket"}
    <div class="page" transition:slide>
      <h2>Select ticket options (placeholder)</h2>
      <button
        class="next-btn"
        transition:scale={{ duration: 400 }}
        on:click={goNext}
      >
        Next →
      </button>
    </div>
  {:else if currentPage === "payment"}
    <div class="page" transition:fade>
      <h2>Payment Page (placeholder)</h2>
      <button
        class="next-btn"
        transition:scale={{ duration: 400 }}
        on:click={goNext}
      >
        Pay Now →
      </button>
    </div>
  {:else if currentPage === "booked"}
    <div class="page" transition:slide={{ duration: 400 }}>
      <h2>✅ Ticket Booked!</h2>
      <p style="margin-top:0.5rem; font-size:1.1rem;">
        Returning to language selection in {countdown}...
      </p>
    </div>
  {/if}
</div>

<style>
  body {
    margin: 0;
    font-family: "Inter", sans-serif;
  }

  .main {
    border: 1px solid #ffffff;
    box-sizing: border-box;
    height: 100vh;
    aspect-ratio: 10 / 16;
    background: rgb(0, 0, 0);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    margin: 0 auto;
    overflow: hidden;
    padding: 0.5rem;
  }

  .progress-container {
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .progress-bar {
    width: 100%;
    height: 12px;
    background: #f2f2f2;
    border-radius: 6px;
    overflow: hidden;
    position: relative;
  }

  .progress-fill {
    height: 100%;
    background-color: #f68b1f;
    transition: width 0.8s ease;
  }

  .checkpoints {
    display: flex;
    justify-content: space-between;
    margin-top: 6px;
    padding: 0 0.2rem;
  }

  .checkpoint {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .checkpoint .circle {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid #f68b1f;
    background-color: white;
    transition:
      background-color 0.6s ease,
      transform 0.3s ease;
  }

  .checkpoint .circle.active {
    background-color: #f68b1f;
    transform: scale(1.2);
  }

  .checkpoint span {
    font-size: 0.75rem;
    color: #999;
    margin-top: 2px;
  }

  .checkpoint span.active {
    color: #f68b1f;
    font-weight: 600;
  }

  /* MAP + ZOOM SECTION */
  .map {
    flex: 1;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
    position: relative;
    flex-direction: column;
    overflow: hidden;
    background-color: white;
  }

  .map-inner {
    position: absolute;
    inset: 0;
    background: url("/map.jpg") center center / cover no-repeat;
    transform: scale(var(--zoom))
      translate(var(--translate-x), var(--translate-y));
    transition: transform 0.8s ease;
    transform-origin: center center;
  }

  .grid-overlay {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    position: absolute;
    inset: 0;
    z-index: 2;
  }

  .grid-cell {
    border: 1px solid rgba(255, 255, 255, 0.2);
    cursor: pointer;
  }

  .grid-cell:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 2;
    backdrop-filter: blur(3px);
  }

  .overlay button {
    width: 180px;
    padding: 15px 0;
    margin: 10px 0;
    font-size: 1.2rem;
    font-weight: 600;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    background-color: white;
    color: #000;
  }

  .map-text {
    background: rgba(86, 86, 86, 0.5);
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    color: white;
    position: absolute;
    top: 1rem;
    left: 1rem;
    z-index: 1;
  }

  .page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    text-align: center;
    color: black;
    background-color: white;
  }

  .next-btn {
    margin-top: 1rem;
    padding: 0.8rem 1.4rem;
    font-size: 1rem;
    border: none;
    border-radius: 6px;
    background-color: #f68b1f;
    color: white;
    font-weight: 600;
    cursor: pointer;
    z-index: 3;
  }
</style>

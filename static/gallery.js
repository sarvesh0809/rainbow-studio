document.addEventListener('DOMContentLoaded', () => {

  // PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE:
  const APP_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzVc1REkAvA14LXjXXfadgasv3RFMyEM0LW4I9MqOav3498L-F3hX8fB0PERA9vnsxD/exec";

  let galleryData = [];

  const grid = document.getElementById('gallery-grid');
  const searchInput = document.getElementById('gallery-search-input');
  const sortSelect = document.getElementById('gallery-sort-select');

  // Initialize Gallery
  async function initGallery() {
    if (APP_SCRIPT_URL === "YOUR_WEB_APP_URL_HERE") {
      galleryData = [
        {
          id: "mock1",
          title: "Waiting for Google Drive Sync",
          description: "Please follow the setup instructions to connect your Google Drive.",
          date: new Date().toISOString(),
          videoUrl: "media/mock-video.mp4",
          thumbnail: "media/caught-in-joy-poster.jpg"
        }
      ];
      renderGallery(galleryData);
    } else {
      try {
        const response = await fetch(APP_SCRIPT_URL);
        const data = await response.json();
        galleryData = data;

        // Initial sort based on select box
        const sorted = sortData(galleryData, sortSelect.value);
        renderGallery(sorted);
      } catch (error) {
        console.error("Error fetching Drive data:", error);
        if (grid) grid.innerHTML = '<p style="color: var(--text-muted); padding: 24px;">Failed to load videos from Google Drive.</p>';
      }
    }
  }

  initGallery();

  // Search functionality
  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = galleryData.filter(item =>
      item.title.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term)
    );

    // Maintain current sort order on filtered data
    const sortedAndFiltered = sortData(filtered, sortSelect.value);
    renderGallery(sortedAndFiltered);
  });

  // Sort functionality
  sortSelect.addEventListener('change', (e) => {
    const currentSearch = searchInput.value.toLowerCase();
    const filtered = galleryData.filter(item =>
      item.title.toLowerCase().includes(currentSearch) ||
      item.description.toLowerCase().includes(currentSearch)
    );

    const sorted = sortData(filtered, e.target.value);
    renderGallery(sorted);
  });

  function sortData(data, sortType) {
    // Clone array to avoid mutating original
    const dataCopy = [...data];

    switch (sortType) {
      case 'newest':
        return dataCopy.sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'oldest':
        return dataCopy.sort((a, b) => new Date(a.date) - new Date(b.date));
      case 'az':
        return dataCopy.sort((a, b) => a.title.localeCompare(b.title));
      case 'za':
        return dataCopy.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return dataCopy;
    }
  }

  function renderGallery(data) {
    if (!grid) return;

    grid.innerHTML = ''; // Clear grid

    if (data.length === 0) {
      grid.innerHTML = '<p style="color: var(--text-muted); padding: 24px;">No videos found matching your search.</p>';
      return;
    }

    data.forEach(item => {
      const card = document.createElement('div');
      card.className = 'video-card gallery-card';
      const isMock = item.id.startsWith("mock");
      const iframeSrc = isMock ? "" : `https://drive.google.com/file/d/${item.id}/preview`;
      const thumb = item.thumbnail ? item.thumbnail : "media/caught-in-joy.jpg";

      card.innerHTML = `
        <div class="video-thumbnail-wrap" style="pointer-events: auto;">
          <video class="gallery-video-player" muted loop playsinline poster="${thumb}" onmouseover="this.play()" onmouseout="this.pause()" style="width: 100%; height: 100%; object-fit: cover;">
            <source src="${isMock ? item.videoUrl : `https://drive.google.com/uc?export=download&id=${item.id}`}" type="video/mp4">
          </video>
          <div class="play-icon"></div>
        </div>
        <div class="video-info">
          <div class="video-title">${item.title.replace(/\.[^/.]+$/, "")}</div>
          <div class="video-desc">${item.description || "No description provided."}</div>
          <div class="video-date">${new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>
      `;

      card.addEventListener('click', () => {
        const vid = card.querySelector('video');
        const icon = card.querySelector('.play-icon');
        if (vid) {
          if (vid.paused) {
            // Play inline with native controls
            vid.muted = false;
            vid.controls = true;
            if (icon) icon.style.opacity = '0';
            vid.play().catch(e => console.log("Playback failed:", e));
          } else {
            vid.pause();
            vid.controls = false;
            if (icon) icon.style.opacity = '1';
          }
        }
      });

      grid.appendChild(card);
    });

    // Re-trigger GSAP animation for new elements
    gsap.fromTo('.gallery-card',
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 0.6,
        stagger: 0.05,
        ease: 'power2.out',
        clearProps: 'all' // prevents conflict if user filters fast
      }
    );
  }

});

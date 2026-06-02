/* ============================================
   RAINBOW ENTERTAINMENT — MOTION ENGINE
   GSAP + ScrollTrigger Animations — V2
   ============================================ */

// PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE:
const APP_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzVc1REkAvA14LXjXXfadgasv3RFMyEM0LW4I9MqOav3498L-F3hX8fB0PERA9vnsxD/exec";

document.addEventListener('DOMContentLoaded', () => {

  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger);

  // Initialize main animations immediately
  initMainAnimations();


  // ==========================================
  // 2. MAIN ANIMATIONS
  // ==========================================
  function initMainAnimations() {
    animateHero();
    animateIntro();
    animateVision();
    animateServices();
    initRecentWorks();
    animateAbout();
    animateFooter();
  }


  // ==========================================
  // HERO SECTION
  // ==========================================
  function animateHero() {
    const heroWords = document.querySelectorAll('.hero-headline .word-inner');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const header = document.querySelector('.site-header');

    const tl = gsap.timeline({ delay: 0.3 });

    if (heroWords.length > 0) {
      tl.to(heroWords, {
        y: 0,
        duration: 1.2,
        stagger: 0.08,
        ease: 'expo.out'
      });
    }

    tl.to(scrollIndicator, {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out'
    }, heroWords.length > 0 ? '-=0.4' : '0')
      .fromTo(header, {
        y: -30,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out'
      }, '-=0.6');
  }


  // ==========================================
  // INTRODUCTION SECTION
  // ==========================================
  function animateIntro() {
    const lines = document.querySelectorAll('.intro-text .line-inner');

    gsap.to(lines, {
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.15,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: '.section-intro',
        start: 'top 65%',
        end: 'bottom 50%',
        toggleActions: 'play none none reverse'
      }
    });
  }


  // ==========================================
  // VISION SECTION — V2 Cinematic
  // ==========================================
  function animateVision() {
    // Banner image parallax
    const bannerImg = document.querySelector('.vision-image-banner img');
    if (bannerImg) {
      gsap.fromTo(bannerImg,
        { scale: 1.15 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.vision-image-banner',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        }
      );
    }

    // Banner headline reveal
    const bannerText = document.querySelector('.vision-image-text h2');
    if (bannerText) {
      gsap.fromTo(bannerText,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: '.vision-image-banner',
            start: 'top 50%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    // Vision panels stagger
    const panels = document.querySelectorAll('.vision-panel');
    panels.forEach((panel, i) => {
      const number = panel.querySelector('.vision-panel-number');
      const line = panel.querySelector('.vision-panel-accent-line');
      const heading = panel.querySelector('h3');
      const para = panel.querySelector('p');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });

      tl.fromTo(number,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out' }
      )
        .fromTo(line,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.6, ease: 'expo.out', transformOrigin: 'left' },
          '-=0.4'
        )
        .fromTo(heading,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'expo.out' },
          '-=0.3'
        )
        .fromTo(para,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
          '-=0.3'
        );
    });

    // Image strip reveal
    const stripImgs = document.querySelectorAll('.vision-strip-img');
    stripImgs.forEach((img, i) => {
      gsap.fromTo(img,
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          delay: i * 0.12,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: img,
            start: 'top 88%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }


  // ==========================================
  // SERVICES SECTION
  // ==========================================
  function animateServices() {
    const cards = document.querySelectorAll('.service-card');
    const headline = document.querySelector('.services-headline');
    const subtitle = document.querySelector('.services-subtitle');

    if (headline) {
      gsap.fromTo(headline,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: headline,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    if (subtitle) {
      gsap.fromTo(subtitle,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: subtitle,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    cards.forEach((card, i) => {
      gsap.fromTo(card,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          delay: i * 0.08,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // Magnetic hover
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(card, {
          x: x * 0.04,
          y: y * 0.04,
          duration: 0.4,
          ease: 'power2.out'
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.5)'
        });
      });
    });
  }


  // ==========================================
  // RECENT WORKS CAROUSEL (Google Drive Data)
  // ==========================================
  async function initRecentWorks() {
    const track = document.getElementById('recent-videos-track');
    if (!track) return;

    let videoData = [];

    if (APP_SCRIPT_URL === "YOUR_WEB_APP_URL_HERE") {
      // Fallback mock data if URL is not set yet
      videoData = [
        {
          id: "mock1",
          title: "Waiting for Google Drive Sync",
          description: "Please follow the setup instructions to connect your Google Drive.",
          date: new Date().toISOString(),
          videoUrl: "media/mock-video.mp4",
          thumbnail: "media/caught-in-joy-poster.jpg"
        }
      ];
    } else {
      try {
        const response = await fetch(APP_SCRIPT_URL);
        const data = await response.json();

        // Sort by newest first and take top 5 for the index page
        videoData = data.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
      } catch (error) {
        console.error("Error fetching Drive data:", error);
        return;
      }
    }

    // Render cards
    videoData.forEach(item => {
      const card = document.createElement('div');
      card.className = 'video-card';

      const isMock = item.id.startsWith("mock");
      const iframeSrc = isMock ? "" : `https://drive.google.com/file/d/${item.id}/preview`;
      const thumb = item.thumbnail ? item.thumbnail : "media/adi-goldstein.jpg";

      card.innerHTML = `
        <div class="video-thumbnail-wrap">
          ${isMock 
            ? `<video class="recent-video-player" muted loop playsinline poster="${thumb}" style="width: 100%; height: 100%; object-fit: cover;">
                 <source src="${item.videoUrl}" type="video/mp4">
               </video>
               <div class="play-icon"></div>`
            : `<iframe src="${iframeSrc}" allow="autoplay; fullscreen" style="width: 100%; height: 100%; border: none; border-radius: var(--clay-radius);"></iframe>`
          }
        </div>
        <div class="video-info">
          <div class="video-title">${item.title.replace(/\.[^/.]+$/, "")}</div>
          <div class="video-desc">${item.description || "No description provided."}</div>
          <div class="video-date">${new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>
      `;
      // For mock videos, play on click
      if (isMock) {
        card.addEventListener('click', () => {
          const vid = card.querySelector('video');
          const icon = card.querySelector('.play-icon');
          if (vid && vid.paused) {
            vid.muted = false;
            vid.controls = true;
            if (icon) icon.style.display = 'none';
            vid.play().catch(e => console.log("Playback failed:", e));
          }
        });
      }
      track.appendChild(card);
    });

    // Animate carousel entry
    gsap.fromTo('.video-card',
      { x: 100, opacity: 0 },
      {
        x: 0, opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.section-recent',
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  // ==========================================
  // ABOUT SECTION
  // ==========================================
  function animateAbout() {
    const aboutTextBlock = document.querySelector('.about-text-block');
    const aboutImages = document.querySelectorAll('.about-img-wrap');
    const stats = document.querySelectorAll('.stat-item');

    if (aboutTextBlock) {
      const heading = aboutTextBlock.querySelector('h3');
      const paragraphs = aboutTextBlock.querySelectorAll('p');

      if (heading) {
        gsap.fromTo(heading,
          { y: 50, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: heading,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      paragraphs.forEach((p, i) => {
        gsap.fromTo(p,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 0.8,
            delay: i * 0.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: p,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
    }

    // About images with parallax
    aboutImages.forEach((wrap, i) => {
      const img = wrap.querySelector('img');

      gsap.fromTo(wrap,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 1,
          delay: i * 0.2,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: wrap,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Subtle parallax on scroll
      if (img) {
        gsap.fromTo(img,
          { scale: 1.1 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: wrap,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1
            }
          }
        );
      }
    });

    stats.forEach((stat, i) => {
      gsap.fromTo(stat,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.7,
          delay: i * 0.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: stat,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }


  // ==========================================
  // FOOTER
  // ==========================================
  function animateFooter() {
    const cta = document.querySelector('.footer-cta');

    if (cta) {
      gsap.fromTo(cta,
        { y: 80, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: cta,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    const footerCols = document.querySelectorAll('.footer-col');
    footerCols.forEach((col, i) => {
      gsap.fromTo(col,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.7,
          delay: i * 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.footer-bottom',
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }


  // ==========================================
  // GALLERY BUTTON — Magnetic Hover
  // ==========================================
  const loginBtn = document.querySelector('.btn-gallery');
  if (loginBtn) {
    loginBtn.addEventListener('mousemove', (e) => {
      const rect = loginBtn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(loginBtn, {
        x: x * 0.25,
        y: y * 0.25,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    loginBtn.addEventListener('mouseleave', () => {
      gsap.to(loginBtn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.4)'
      });
    });
  }

});

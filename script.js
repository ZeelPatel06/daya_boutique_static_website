
document.addEventListener("DOMContentLoaded", () => {
  // Mobile navigation
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(open));
    });

    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Mark the current page in navigation.
  const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
  document.querySelectorAll(".nav-link").forEach(link => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#")) return;
    const target = new URL(href, window.location.href).pathname.replace(/\/+$/, "") || "/";
    link.classList.toggle("active", target === currentPath);
  });

  // Home gallery slider
  const galleryTrack = document.getElementById("galleryTrack");
  const galleryPrev = document.getElementById("galleryPrev");
  const galleryNext = document.getElementById("galleryNext");

  if (galleryTrack && galleryPrev && galleryNext) {
    const step = () => {
      const card = galleryTrack.querySelector(".gallery-card");
      return card ? card.getBoundingClientRect().width + 14 : 300;
    };

    galleryPrev.addEventListener("click", () => {
      galleryTrack.scrollBy({ left: -step(), behavior: "smooth" });
    });

    galleryNext.addEventListener("click", () => {
      galleryTrack.scrollBy({ left: step(), behavior: "smooth" });
    });
  }

  // Testimonials: one card at a time.
  // Arrows are positioned outside the card, exactly left/right.
  const testimonialTrack = document.getElementById("testimonialTrack");
  const testimonialPrev = document.getElementById("testimonialPrev");
  const testimonialNext = document.getElementById("testimonialNext");
  const dots = [...document.querySelectorAll(".dot")];

  let testimonialIndex = 0;

  function showTestimonial(index) {
    if (!testimonialTrack || dots.length === 0) return;

    testimonialIndex = (index + dots.length) % dots.length;
    testimonialTrack.style.transform =
      `translateX(-${testimonialIndex * 100}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === testimonialIndex);
    });
  }

  if (testimonialPrev && testimonialNext) {
    testimonialPrev.addEventListener("click", () => {
      showTestimonial(testimonialIndex - 1);
    });

    testimonialNext.addEventListener("click", () => {
      showTestimonial(testimonialIndex + 1);
    });
  }

  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      showTestimonial(Number(dot.dataset.index));
    });
  });

  // Optional auto-slide; pause when the user interacts with the section.
  const testimonialSlider = document.querySelector(".testimonial-slider");

  if (testimonialSlider && testimonialTrack && dots.length > 1) {
    let timer = setInterval(() => {
      showTestimonial(testimonialIndex + 1);
    }, 5500);

    const pause = () => clearInterval(timer);
    const resume = () => {
      clearInterval(timer);
      timer = setInterval(() => {
        showTestimonial(testimonialIndex + 1);
      }, 5500);
    };

    testimonialSlider.addEventListener("mouseenter", pause);
    testimonialSlider.addEventListener("mouseleave", resume);
    testimonialSlider.addEventListener("touchstart", pause, { passive: true });
  }

  // Basic drag scrolling for the home gallery.
  if (galleryTrack) {
    let dragging = false;
    let startX = 0;
    let startScroll = 0;

    galleryTrack.addEventListener("pointerdown", event => {
      dragging = true;
      startX = event.clientX;
      startScroll = galleryTrack.scrollLeft;
      galleryTrack.setPointerCapture(event.pointerId);
    });

    galleryTrack.addEventListener("pointermove", event => {
      if (!dragging) return;
      galleryTrack.scrollLeft =
        startScroll - (event.clientX - startX);
    });

    ["pointerup", "pointercancel", "pointerleave"].forEach(type => {
      galleryTrack.addEventListener(type, () => {
        dragging = false;
      });
    });
  }
});

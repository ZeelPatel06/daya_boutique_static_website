document.addEventListener("DOMContentLoaded", () => {

  // ==========================================
  // MOBILE NAVIGATION
  // ==========================================

  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");

      menuToggle.setAttribute(
        "aria-expanded",
        String(open)
      );
    });

    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {

        navLinks.classList.remove("open");

        menuToggle.setAttribute(
          "aria-expanded",
          "false"
        );

      });
    });

  }


  // ==========================================
  // MARK CURRENT PAGE IN NAVIGATION
  // ==========================================

  const currentPath =
    window.location.pathname.replace(/\/+$/, "") || "/";

  document.querySelectorAll(".nav-link").forEach(link => {

    const href = link.getAttribute("href");

    if (!href || href.startsWith("#")) return;

    const target =
      new URL(
        href,
        window.location.href
      ).pathname.replace(/\/+$/, "") || "/";

    link.classList.toggle(
      "active",
      target === currentPath
    );

  });


  // ==========================================
  // HOME GALLERY SLIDER
  // ==========================================

  const galleryTrack =
    document.getElementById("galleryTrack");

  const galleryPrev =
    document.getElementById("galleryPrev");

  const galleryNext =
    document.getElementById("galleryNext");


  if (
    galleryTrack &&
    galleryPrev &&
    galleryNext
  ) {

    const step = () => {

      const card =
        galleryTrack.querySelector(".gallery-card");

      return card
        ? card.getBoundingClientRect().width + 14
        : 300;

    };


    galleryPrev.addEventListener("click", () => {

      galleryTrack.scrollBy({
        left: -step(),
        behavior: "smooth"
      });

    });


    galleryNext.addEventListener("click", () => {

      galleryTrack.scrollBy({
        left: step(),
        behavior: "smooth"
      });

    });

  }


  // ==========================================
// TESTIMONIALS
// ==========================================

const testimonialTrack =
  document.getElementById("testimonialTrack");

const testimonialPrev =
  document.getElementById("testimonialPrev");

const testimonialNext =
  document.getElementById("testimonialNext");

const dots =
  [...document.querySelectorAll(".dot")];

let testimonialIndex = 0;


// ==========================================
// SHOW TESTIMONIAL
// ==========================================

function showTestimonial(index) {

  if (!testimonialTrack || dots.length === 0) {
    return;
  }

  testimonialIndex =
    (index + dots.length) % dots.length;

  testimonialTrack.style.transform =
    `translateX(-${testimonialIndex * 100}%)`;

  dots.forEach((dot, i) => {

    dot.classList.toggle(
      "active",
      i === testimonialIndex
    );

  });

}


// ==========================================
// ARROWS
// ==========================================

if (testimonialPrev && testimonialNext) {

  testimonialPrev.addEventListener("click", () => {

    showTestimonial(testimonialIndex - 1);

  });

  testimonialNext.addEventListener("click", () => {

    showTestimonial(testimonialIndex + 1);

  });

}


// ==========================================
// DOTS
// ==========================================

dots.forEach(dot => {

  dot.addEventListener("click", () => {

    showTestimonial(
      Number(dot.dataset.index)
    );

  });

});


// ==========================================
// TESTIMONIAL TOUCH / SWIPE
// ==========================================

const testimonialViewport =
  document.querySelector(".testimonial-viewport");

let touchStartX = 0;
let touchStartY = 0;
let isTouching = false;


// ==========================================
// AUTO SLIDER CONTROL
// ==========================================

const testimonialSlider =
  document.querySelector(".testimonial-slider");

let testimonialTimer = null;
let testimonialResumeTimer = null;


function startTestimonialAutoSlide() {

  clearInterval(testimonialTimer);

  testimonialTimer = setInterval(() => {

    showTestimonial(
      testimonialIndex + 1
    );

  }, 5500);

}


function stopTestimonialAutoSlide() {

  clearInterval(testimonialTimer);

  testimonialTimer = null;

}


function resumeTestimonialAutoSlide() {

  clearTimeout(testimonialResumeTimer);

  testimonialResumeTimer = setTimeout(() => {

    startTestimonialAutoSlide();

  }, 1000);

}


// ==========================================
// TOUCH START
// ==========================================

if (testimonialViewport) {

  testimonialViewport.addEventListener(
    "touchstart",
    (event) => {

      // Stop auto slider immediately
      stopTestimonialAutoSlide();

      // Cancel previous resume
      clearTimeout(testimonialResumeTimer);

      isTouching = true;

      touchStartX =
        event.touches[0].clientX;

      touchStartY =
        event.touches[0].clientY;

    },
    { passive: true }
  );


  // ==========================================
  // TOUCH END
  // ==========================================

  testimonialViewport.addEventListener(
    "touchend",
    (event) => {

      if (!isTouching) {
        return;
      }

      isTouching = false;


      const touchEndX =
        event.changedTouches[0].clientX;

      const touchEndY =
        event.changedTouches[0].clientY;


      const distanceX =
        touchStartX - touchEndX;

      const distanceY =
        touchStartY - touchEndY;


      // Only treat horizontal movement
      // as a testimonial swipe
      if (
        Math.abs(distanceX) >
        Math.abs(distanceY)
      ) {

        // Minimum swipe distance
        if (Math.abs(distanceX) >= 50) {

          // Swipe LEFT → NEXT
          if (distanceX > 0) {

            showTestimonial(
              testimonialIndex + 1
            );

          }

          // Swipe RIGHT → PREVIOUS
          else {

            showTestimonial(
              testimonialIndex - 1
            );

          }

        }

      }


      // Restart auto slider after 1 second
      resumeTestimonialAutoSlide();

    },
    { passive: true }
  );


  // ==========================================
  // TOUCH CANCEL
  // ==========================================

  testimonialViewport.addEventListener(
    "touchcancel",
    () => {

      isTouching = false;

      resumeTestimonialAutoSlide();

    },
    { passive: true }
  );

}


// ==========================================
// MOUSE HOVER
// ==========================================

if (testimonialSlider) {

  testimonialSlider.addEventListener(
    "mouseenter",
    () => {

      stopTestimonialAutoSlide();

      clearTimeout(
        testimonialResumeTimer
      );

    }
  );


  testimonialSlider.addEventListener(
    "mouseleave",
    () => {

      resumeTestimonialAutoSlide();

    }
  );

}


// ==========================================
// START AUTO SLIDER
// ==========================================

if (
  testimonialTrack &&
  dots.length > 1
) {

  startTestimonialAutoSlide();

}

});
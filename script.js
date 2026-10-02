document.addEventListener("DOMContentLoaded", () => {
  const video = document.querySelector(".hero-video");
  const caption = document.querySelector(".location-caption");
  if (!video || !caption) return;

  // Exact scene intervals supplied by the filmmaker, in decimal seconds.
  // Display no location name in the short transitions between clips.
  const locations = [
    { start: 0.10, end: 3.20, name: "SÃO PAULO, BRAZIL" },
    { start: 3.40, end: 8.90, name: "RIO DE JANEIRO, BRAZIL" },
    { start: 9.10, end: 9.80, name: "MONTEVIDEO, URUGUAY" },
    { start: 10.00, end: 11.10, name: "PUNTA DEL ESTE, URUGUAY" },
    { start: 11.30, end: 13.80, name: "BUENOS AIRES, ARGENTINA" },
    { start: 13.90, end: 17.40, name: "LAGUNA ESMERALDA, ARGENTINA" },
    { start: 17.60, end: 19.90, name: "BEAGLE CHANNEL, ARGENTINA" },
    { start: 20.10, end: 24.10, name: "IGUAZÚ FALLS, BRAZIL & ARGENTINA" }
  ];

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reducedMotion.matches) {
    video.pause();
    return;
  }

  let activeIndex = -2;
  let animationFrame = 0;

  function syncCaption() {
    const time = video.currentTime;
    const nextIndex = locations.findIndex(
      ({ start, end }) => time >= start && time < end
    );

    if (nextIndex === activeIndex) return;
    activeIndex = nextIndex;

    if (nextIndex === -1) {
      caption.classList.remove("is-visible");
      return;
    }

    caption.textContent = locations[nextIndex].name;
    caption.classList.add("is-visible");
  }

  // Check during each animation frame for accuracy, including very short scenes.
  function trackPlayback() {
    animationFrame = 0;
    syncCaption();
    if (!video.paused && !video.ended) {
      animationFrame = window.requestAnimationFrame(trackPlayback);
    }
  }

  function startTracking() {
    syncCaption();
    if (!animationFrame) {
      animationFrame = window.requestAnimationFrame(trackPlayback);
    }
  }

  function stopTracking() {
    if (animationFrame) window.cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    syncCaption();
  }

  video.addEventListener("loadedmetadata", syncCaption);
  video.addEventListener("timeupdate", syncCaption);
  video.addEventListener("seeking", syncCaption);
  video.addEventListener("seeked", syncCaption);
  video.addEventListener("playing", startTracking);
  video.addEventListener("pause", stopTracking);
  video.addEventListener("ended", stopTracking);

  if (video.readyState >= 1) syncCaption();
  if (!video.paused) startTracking();
});

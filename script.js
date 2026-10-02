document.addEventListener("DOMContentLoaded", () => {
  const video = document.querySelector(".hero-video");
  const caption = document.querySelector(".location-caption");
  if (!video || !caption) return;

  // Approximate percentages of the hero video's runtime.
  // Adjust these cut points if the exported montage has different scene lengths.
  const locations = [
    { start: 0.00, name: "SÃO PAULO, BRAZIL" },
    { start: 0.13, name: "RIO DE JANEIRO, BRAZIL" },
    { start: 0.30, name: "MONTEVIDEO, URUGUAY" },
    { start: 0.42, name: "BUENOS AIRES, ARGENTINA" },
    { start: 0.54, name: "USHUAIA, ARGENTINA" },
    { start: 0.70, name: "BEAGLE CHANNEL, ARGENTINA" },
    { start: 0.85, name: "IGUAZÚ FALLS, ARGENTINA / BRAZIL" }
  ];

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reducedMotion.matches) {
    video.pause();
    return;
  }

  let activeLocation = "";
  let pendingTransition;

  function updateLocation() {
    if (!Number.isFinite(video.duration) || video.duration <= 0) return;
    const progress = video.currentTime / video.duration;
    const current = locations.reduce(
      (active, location) => progress >= location.start ? location : active,
      locations[0]
    );

    if (current.name === activeLocation) return;
    activeLocation = current.name;
    caption.classList.remove("is-visible");
    window.clearTimeout(pendingTransition);

    pendingTransition = window.setTimeout(() => {
      caption.textContent = current.name;
      caption.classList.add("is-visible");
    }, 170);
  }

  video.addEventListener("loadedmetadata", updateLocation);
  video.addEventListener("timeupdate", updateLocation);
  video.addEventListener("seeked", updateLocation);
  video.addEventListener("playing", updateLocation);

  // For cached video that has already loaded before script initialization.
  if (video.readyState >= 1) updateLocation();
});

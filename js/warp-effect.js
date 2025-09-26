// Warp effect for the hero card
document.addEventListener("DOMContentLoaded", function () {
  const card = document.querySelector(".warp-card");
  if (!card) return;

  // Mouse move event listener to the card
  card.addEventListener("mousemove", function (e) {
    const cardRect = card.getBoundingClientRect();
    const cardWidth = cardRect.width;
    const cardHeight = cardRect.height;

    // Calculate mouse position relative to card center
    const mouseX = e.clientX - cardRect.left - cardWidth / 2;
    const mouseY = e.clientY - cardRect.top - cardHeight / 2;

    // Calculate rotation based on mouse position (clamp values)
    const rotateY = Math.max(-10, Math.min(10, (mouseX / cardWidth) * 10));
    const rotateX = Math.max(-10, Math.min(10, -(mouseY / cardHeight) * 10));

    // Transformation with perspective
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    card.style.transition = "transform 0.1s ease-out";
  });

  // Reset card position when mouse leaves
  card.addEventListener("mouseleave", function () {
    card.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
    card.style.transition = "transform 0.5s ease";
  });

  // Pause scrolling reviews on hover
  const reviewsTrack = document.getElementById("reviewsTrack");
  if (reviewsTrack) {
    reviewsTrack.addEventListener("mouseenter", function () {
      this.style.animationPlayState = "paused";
    });

    reviewsTrack.addEventListener("mouseleave", function () {
      this.style.animationPlayState = "running";
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // === 1. Form Validation ===
  const form = document.querySelector('.needs-validation');
  if (form) {
    form.addEventListener('submit', (e) => {
      form.classList.add('was-validated');
    });
  }

  // === 2. Review Load More / Show Less ===
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  const showLessBtn = document.getElementById("showLessBtn");
  const reviewCards = document.querySelectorAll(".review-card-wrapper");

  if (!loadMoreBtn || !showLessBtn || !reviewCards.length) return;

  let visibleCount = 5;

  // Initially hide all after the first 5
  reviewCards.forEach((card, index) => {
    if (index >= visibleCount) card.classList.add("d-none");
  });

  showLessBtn.style.display = "none";

  // ▶️ Load More Click
  loadMoreBtn.addEventListener("click", () => {
    const hiddenCards = Array.from(reviewCards).filter(card => card.classList.contains("d-none"));
    
    for (let i = 0; i < 5 && i < hiddenCards.length; i++) {
      hiddenCards[i].classList.remove("d-none");
    }

    visibleCount += 5;

    if (visibleCount >= reviewCards.length) {
      loadMoreBtn.style.display = "none";
      showLessBtn.style.display = "inline-block";
    }
  });

  // 🔁 Show Less Click
  showLessBtn.addEventListener("click", () => {
    reviewCards.forEach((card, index) => {
      if (index >= 5) card.classList.add("d-none");
    });

    visibleCount = 5;
    loadMoreBtn.style.display = "inline-block";
    showLessBtn.style.display = "none";
  });
});

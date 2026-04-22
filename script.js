let text = "Explore your thoughts, emotions, and personality deeply.";
let i = 0;

let typingEl = document.getElementById("typing");

function typeEffect() {
  if (!typingEl) return;

  if (i < text.length) {
    typingEl.innerHTML += text.charAt(i);
    i++;
    setTimeout(typeEffect, 50);
  }
}

typeEffect();

// QUOTES
let quotes = document.querySelectorAll(".quote");
let index = 0;

if (quotes.length > 0) {
  setInterval(() => {
    quotes.forEach(q => q.classList.remove("active"));
    quotes[index].classList.add("active");
    index = (index + 1) % quotes.length;
  }, 3000);
}
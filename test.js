const qs = [
  { q: "You prefer?", o: ["Alone", "Friends", "Both"] },
  { q: "When stressed you?", o: ["Overthink", "Talk", "Ignore"] },
  { q: "Decision based on?", o: ["Logic", "Emotion", "Both"] }
];

let c = 0;
let ans = JSON.parse(localStorage.getItem("ans")) || [];

// =========================
// LOAD QUESTION
// =========================
function load() {

  const qEl = document.getElementById("q");
  const optEl = document.getElementById("opt");
  const bar = document.getElementById("bar");
  const qnum = document.getElementById("qnum");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (!qEl || !optEl) return;

  // QUESTION TEXT
  qEl.innerText = qs[c].q;

  // QUESTION NUMBER
  qnum.innerText = `Question ${c + 1} of ${qs.length}`;

  // OPTIONS
  optEl.innerHTML = "";

  qs[c].o.forEach((text, i) => {
    const div = document.createElement("div");
    div.className = "option";

    if (ans[c] === i) {
      div.classList.add("selected");
    }

    div.innerText = text;

    div.onclick = () => {
      ans[c] = i;
      localStorage.setItem("ans", JSON.stringify(ans));
      load();
    };

    optEl.appendChild(div);
  });

  // PROGRESS BAR
  bar.style.width = ((c + 1) / qs.length) * 100 + "%";

  // BUTTON STATES
  prevBtn.disabled = (c === 0);

  nextBtn.innerText = (c === qs.length - 1) ? "Finish" : "Next";
}

// =========================
// NEXT BUTTON
// =========================
function next() {

  if (ans[c] === undefined) {
    alert("Please select an option");
    return;
  }

  if (c < qs.length - 1) {
    c++;
    load();
  } else {
    location.href = "analyse.html"; // FIXED
  }
}

// =========================
// PREVIOUS BUTTON
// =========================
function prev() {
  if (c > 0) {
    c--;
    load();
  }
}

// =========================
// INIT
// =========================
load();
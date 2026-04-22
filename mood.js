// =========================
// LOAD DATA
// =========================
let data = JSON.parse(localStorage.getItem("mood") || "[]");

let chartInstance = null;

// =========================
// API KEY 
// =========================
const API_KEY = "YOUR_GEMINI_API_KEY_HERE";

// =========================
// AI INSIGHT
// =========================
async function getInsight() {

  let input = `Mood history: ${data.join(", ")}`;

  try {
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": API_KEY
        },
        body: JSON.stringify({
          contents: [
            { parts: [{ text: input }] }
          ]
        })
      }
    );

    const dataAI = await res.json();

    let result =
      dataAI?.candidates?.[0]?.content?.parts?.[0]?.text || "No insight.";

    document.getElementById("insight").innerText =
      "🤖 AI Insight:\n\n" + result;

  } catch (err) {
    console.log(err);
    document.getElementById("insight").innerText = "AI error.";
  }
}

// =========================
// SAVE MOOD
// =========================
function save() {
  let moodEl = document.getElementById("mood");

  data.push(moodEl.value);
  localStorage.setItem("mood", JSON.stringify(data));

  draw();
  getInsight();
}

// =========================
// DRAW CHART (FIXED)
// =========================
function draw() {
  let canvas = document.getElementById("chart");

  if (!canvas) {
    console.log("Canvas not found");
    return;
  }

  let ctx = canvas.getContext("2d"); // ✅ FIX

  let counts = { Happy: 0, Sad: 0, Angry: 0 };

  data.forEach(m => counts[m]++);

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(counts),
      datasets: [{
        label: "Mood Count",
        data: Object.values(counts),
        backgroundColor: ["#22c55e", "#ef4444", "#f59e0b"],
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1 }
        }
      }
    }
  });
}

// =========================
// INIT
// =========================
draw();
getInsight();

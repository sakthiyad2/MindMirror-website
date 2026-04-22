let data = JSON.parse(localStorage.getItem("mood") || "[]");

let chartInstance = null;

// API
const API_KEY = "geminiapi";

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

  } catch {
    document.getElementById("insight").innerText = "AI error.";
  }
}

// SAVE
function save() {
  let moodEl = document.getElementById("mood");

  data.push(moodEl.value);
  localStorage.setItem("mood", JSON.stringify(data));

  draw();
  getInsight();
}

// CHART
function draw() {
  let ctx = document.getElementById("chart");

  let counts = { Happy: 0, Sad: 0, Angry: 0 };

  data.forEach(m => counts[m]++);

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(counts),
      datasets: [{ data: Object.values(counts) }]
    }
  });
}

draw();
getInsight();
let ans = JSON.parse(localStorage.getItem("ans")) || [];

// TRAITS
let intro = 0, extro = 0;
let emotional = 0, logical = 0;

// CALCULATION
ans.forEach((a, i) => {

  if (i === 0 || i === 3) {
    if (a === 0) intro++;
    if (a === 2) extro++;
  }

  if (i === 2) {
    if (a === 0) emotional++;
    if (a === 1) logical++;
  }
});

// TOTAL
let totalIE = 2;
let totalEL = 1;

// PERCENTAGE
let introPer = totalIE ? Math.round((intro / totalIE) * 100) : 0;
let extroPer = 100 - introPer;

let emoPer = totalEL ? Math.round((emotional / totalEL) * 100) : 0;
let logPer = 100 - emoPer;

// TEXT
let text = "";

text += introPer > extroPer
  ? "You are more Introverted.\n"
  : "You are more Extroverted.\n";

text += emoPer > logPer
  ? "You rely more on Emotions.\n"
  : "You rely more on Logic.\n";

let finalInsight =
  introPer > extroPer
    ? "You are introspective and thoughtful."
    : "You are outgoing and expressive.";

// =========================
// API
// =========================
const API_KEY = "geminiapi";

async function getAIInsight(input) {
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

    const data = await res.json();

    if (data.error) return data.error.message;

    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";

  } catch {
    return "Network error.";
  }
}

// DISPLAY
setTimeout(async () => {

  let localResult = text + "\n\n" + finalInsight;

  document.getElementById("out").innerText = "Generating AI insight...";

  let aiData = await Promise.race([
    getAIInsight(localResult),
    new Promise(r => setTimeout(() => r("AI timeout"), 200000))
  ]);

  document.getElementById("out").innerText =
    localResult + "\n\n🤖 AI INSIGHT:\n" + aiData;

  document.getElementById("introBar").style.width = introPer + "%";
  document.getElementById("extroBar").style.width = extroPer + "%";
  document.getElementById("emoBar").style.width = emoPer + "%";
  document.getElementById("logBar").style.width = logPer + "%";

  document.getElementById("loading").style.display = "none";

}, 1000);

function downloadPDF() {
  console.log("Download clicked");

  let contentEl = document.getElementById("out");

  if (!contentEl) {
    alert("No report found");
    return;
  }

  let content = contentEl.innerText;

  if (!content.trim()) {
    alert("Report is empty");
    return;
  }

  let blob = new Blob([content], { type: "text/plain;charset=utf-8" });

  let url = URL.createObjectURL(blob);

  let a = document.createElement("a");
  a.href = url;
  a.download = "MindMirror_Report.txt";

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
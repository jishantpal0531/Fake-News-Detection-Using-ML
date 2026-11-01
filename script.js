
const newsForm = document.getElementById("newsForm");
const newsInput = document.getElementById("news");
const resultBox = document.getElementById("result");
const checkBtn = document.getElementById("checkBtn");

newsForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const news = newsInput.value.trim();

    if (!news) {
        showResult("Please enter some news text.", "error");
        return;
    }

    checkBtn.disabled = true;
    checkBtn.textContent = "Analyzing...";
    resultBox.className = "";
    resultBox.style.display = "none";

    try {
        const response = await fetch("/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ news: news })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Unable to analyze news.");
        }

        if (data.prediction === "Fake News") {
            showResult(
                "⚠️ Prediction: Fake News\n\nThis model classified the submitted text as fake.",
                "fake"
            );
        } else {
            showResult(
                "✓ Prediction: Real News\n\nThis model classified the submitted text as real.",
                "real"
            );
        }
    } catch (error) {
        showResult(
            "Error: " + error.message +
            " Please check whether the Flask server is running.",
            "error"
        );
    } finally {
        checkBtn.disabled = false;
        checkBtn.textContent = "Check News";
    }
});

function showResult(message, type) {
    resultBox.textContent = message;
    resultBox.className = "show " + type;
    resultBox.style.display = "block";
}

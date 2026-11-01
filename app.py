from flask import Flask, render_template, request, jsonify
import pickle

app = Flask(__name__)

# Load trained model
with open("fake_news_model.pkl", "rb") as file:
    saved_data = pickle.load(file)

model = saved_data["model"]
tfidf = saved_data["tfidf"]

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        news = request.json.get("news", "").strip()

        if not news:
            return jsonify({"error": "Please enter news text!"}), 400

        # Convert text into TF-IDF
        transformed_news = tfidf.transform([news])

        # Prediction
        prediction = model.predict(transformed_news)[0]

        if prediction == 0:
            result = "Fake News"
        else:
            result = "Real News"

        return jsonify({"prediction": result})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)

from flask import Flask, render_template, request, redirect, url_for, jsonify
import pandas as pd
import numpy as np
import yfinance as yf
from tensorflow.keras.models import load_model
from sklearn.preprocessing import MinMaxScaler
from datetime import datetime
import json

app = Flask(__name__)

# Load Pre-trained Model
model = load_model("model.keras")

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        stock = request.form.get("stock")
        no_of_days = int(request.form.get("no_of_days"))
        return redirect(url_for("predict", stock=stock, no_of_days=no_of_days))
    return render_template("index.html")

@app.route("/predict")
def predict():
    stock = request.args.get("stock", "BTC-USD")
    no_of_days = int(request.args.get("no_of_days", 10))

    # Fetch Stock Data
    end = datetime.now()
    start = datetime(end.year - 10, end.month, end.day)
    stock_data = yf.download(stock, start, end, progress=False)
    if stock_data.empty:
        return render_template(
            "result.html", 
            error="Invalid stock ticker or no data available.",
            stock=stock
        )

    # Data Preparation
    splitting_len = int(len(stock_data) * 0.9)
    x_test = stock_data[['Close']][splitting_len:]
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(x_test)

    x_data = []
    y_data = []
    for i in range(100, len(scaled_data)):
        x_data.append(scaled_data[i - 100:i])
        y_data.append(scaled_data[i])

    x_data = np.array(x_data)
    y_data = np.array(y_data)

    # Predictions
    predictions = model.predict(x_data, verbose=0)
    inv_predictions = scaler.inverse_transform(predictions)
    inv_y_test = scaler.inverse_transform(y_data)

    # Prepare Data for Plotting
    plotting_data = pd.DataFrame({
        'Original Test Data': inv_y_test.flatten(),
        'Predicted Test Data': inv_predictions.flatten()
    }, index=x_test.index[100:])

    # Prepare JSON data for historical closing prices
    historical_dates = [pd.Timestamp(d).strftime('%Y-%m-%d') for d in stock_data.index]
    historical_prices = stock_data['Close'].values.flatten().tolist()
    
    historical_data = {
        'dates': historical_dates,
        'prices': historical_prices
    }

    # Prepare JSON data for test predictions
    test_dates = [pd.Timestamp(d).strftime('%Y-%m-%d') for d in plotting_data.index]
    original_prices = plotting_data['Original Test Data'].values.flatten().tolist()
    predicted_prices = plotting_data['Predicted Test Data'].values.flatten().tolist()
    
    test_prediction_data = {
        'dates': test_dates,
        'original': original_prices,
        'predicted': predicted_prices
    }

    # Future Predictions
    last_100 = stock_data[['Close']].tail(100)
    last_100_scaled = scaler.transform(last_100)

    future_predictions = []
    last_100_scaled = last_100_scaled.reshape(1, -1, 1)
    for _ in range(no_of_days):
        next_day = model.predict(last_100_scaled, verbose=0)
        future_predictions.append(scaler.inverse_transform(next_day))
        last_100_scaled = np.append(last_100_scaled[:, 1:, :], next_day.reshape(1, 1, -1), axis=1)

    future_predictions = np.array(future_predictions).flatten()

    # Prepare JSON data for future predictions
    future_prediction_data = {
        'days': list(range(1, no_of_days + 1)),
        'prices': future_predictions.tolist()
    }

    # Get latest close price
    latest_close_price = float(stock_data['Close'].iloc[-1])

    return render_template(
        "result.html",
        stock=stock,
        no_of_days=no_of_days,
        latest_close_price=round(latest_close_price, 2),
        historical_data=json.dumps(historical_data),
        test_prediction_data=json.dumps(test_prediction_data),
        future_prediction_data=json.dumps(future_prediction_data),
        future_predictions=future_predictions
    )

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)



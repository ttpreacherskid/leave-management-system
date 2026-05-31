from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from datetime import datetime

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        historical_data = data.get('history', [])

        if not historical_data:
            return jsonify({'prediction': 0, 'risk_level': 'Low'})

        df = pd.DataFrame(historical_data)


        if 'department' in df.columns:
            # Group by Department and Month
            grouped = df.groupby(['department', 'month'])['count'].sum().reset_index()

            departments = df['department'].unique()
            results = []

            for dept in departments:
                dept_data = grouped[grouped['department'] == dept]

                # Train model for this specific department
                X = dept_data[['month']].values
                y = dept_data['count'].values

                model = RandomForestRegressor(n_estimators=100, random_state=42)
                model.fit(X, y)


                current_month = datetime.now().month
                next_month = current_month + 1
                if next_month > 12: next_month = 1

                pred_array = model.predict([[next_month]])
                prediction = max(0, int(pred_array[0]))

                risk = 'Low'
                if prediction > 5: risk = 'Moderate'
                if prediction > 10: risk = 'High'

                results.append({
                    'department': dept,
                    'predicted_days': prediction,
                    'risk_level': risk
                })


            results.sort(key=lambda x: x['predicted_days'], reverse=True)

            return jsonify({
                'department_predictions': results,
                'is_department_specific': True
            })

        else:

            X = df[['month']].values
            y = df['count'].values
            model = RandomForestRegressor(n_estimators=100, random_state=42)
            model.fit(X, y)

            current_month = datetime.now().month
            next_month = current_month + 1
            if next_month > 12: next_month = 1

            pred_array = model.predict([[next_month]])
            prediction = max(0, int(pred_array[0]))

            risk = 'Low'
            if prediction > 5: risk = 'Moderate'
            if prediction > 10: risk = 'High'

            return jsonify({
                'predicted_leave_days': prediction,
                'risk_level': risk,
                'is_department_specific': False
            })

    except Exception as e:
        print(f"ERROR: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("ML Service running on port 5000...")
    app.run(port=5000, debug=True)
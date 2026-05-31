import random
import csv
from datetime import datetime, timedelta

# Configuration
departments = ['Civil engineering', 'IT', 'ACCOUNTS', 'Marketing', 'Operations']
start_date = datetime(2023, 1, 1)
end_date = datetime(2023, 12, 31)

def get_leave_probability(month):

    if month == 12: return 0.8  # High season
    if month == 1: return 0.6   # Post-holiday
    if month == 2: return 0.2   # Low season
    return 0.4                  # Normal season

# Generate Data
synthetic_data = []

for dept in departments:
    current_date = start_date
    while current_date <= end_date:
        month = current_date.month


        prob = get_leave_probability(month)


        if random.random() < prob:

            leave_length = random.randint(1, 5)
            synthetic_data.append({
                'department': dept,
                'month': month,
                'start_date': current_date.strftime('%Y-%m-%d'),
                'days': leave_length
            })

        current_date += timedelta(days=1)

# Output sample
print(f"Generated {len(synthetic_data)} synthetic records.")
from main import app
from models import db, Records
import json
from datetime import datetime, timezone

db.create_all(app=app)

with open('../data.json') as f:
  data = json.load(f)

for row in data:
    newrec = Records(updateNum=row['updateNum'], date = datetime.fromtimestamp(row['date'], timezone.utc), url=row['url'], deaths=row['cases']['deaths'], imported=row['cases']['imported'], community=row['cases']['community'], tested=row['tested'], contact=row['cases']['contact'])
    db.session.add(newrec)
db.session.commit()

print('database initialized!')


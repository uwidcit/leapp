from main import app
from models import db, Records
import json

db.create_all(app=app)

with open('./data.json') as json_file:
    data = json.load(json_file)
    for rec in data:
        record = Records(
            date = rec['date'], 
            updateNum = rec['updateNum'], 
            url = rec['url'], 
            deaths = rec['cases']['deaths'],
            imported = rec['cases']['imported'],
            contact = rec['cases']['contact'],
            community = rec['cases']['community'],
            tested = rec['tested']
        )
        db.session.add(record)
    db.session.commit()

print('database initialized!')

print('database initialized!')
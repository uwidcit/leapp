from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()
from datetime import datetime

class Records(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    updateNum = db.Column(db.Integer)
    date = db.Column(db.DateTime)
    url = db.Column(db.String(220), unique=True, nullable=False)
    deaths = db.Column(db.Integer)
    imported = db.Column(db.Integer)
    community = db.Column(db.Integer)
    tested = db.Column(db.Integer)
    contact = db.Column(db.Integer)

    def toDict(self):
      return {
        "id": self.id,
        "updateNum": self.updateNum,
        "date": datetime.timestamp(self.date),
        "url":self.url,
        "cases": {
            "deaths": self.deaths,
            "imported": self.imported,
            "contact": self.contact, 
            "community": self.community
        },
        "tested": self.tested,
      }

      
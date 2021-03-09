from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

class Records(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Integer, nullable=False)
    updateNum =  db.Column(db.Integer, nullable=False)
    url = db.Column(db.String(80), nullable=False)
    deaths = db.Column(db.Integer, nullable=False)
    imported = db.Column(db.Integer, nullable=False)
    community = db.Column(db.Integer, nullable=False)
    contact = db.Column(db.Integer, nullable=False)
    tested = db.Column(db.Integer, nullable=False)
    
    def toDict(self):
        return{
            'id': self.id,
            'date': self.date,
            'updateNum': self.updateNum,
            'url': self.url,
            'cases': {
                'deaths':self.deaths,
                'imported':self.imported,
                'community':self.community,
                'contact': self.contact
            },
            'tested': self.tested
        }
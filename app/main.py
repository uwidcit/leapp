import json
from flask_cors import CORS
from flask import Flask, request, render_template
from sqlalchemy.exc import IntegrityError

from models import db, Records

''' Begin boilerplate code '''
def create_app():
  app = Flask(__name__, static_url_path='')
  app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
  app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
  app.config['SECRET_KEY'] = "MYSECRET"
  CORS(app)
  db.init_app(app)
  return app

app = create_app()

app.app_context().push()

''' End Boilerplate Code '''

@app.route('/')
def client_app():
  return app.send_static_file('app.html')

@app.route('/records', methods=['POST'])
def create_record():
  row = request.get_json()
  if row['password'] == app.config['SECRET_KEY']:
    newrec = Records(updateNum=row['updateNum'], date = datetime.fromtimestamp(row['date'], timezone.utc), url=row['url'], deaths=row['cases']['deaths'], imported=row['cases']['imported'], community=row['cases']['community'], tested=row['tested'], contact=row['cases']['contact'])
    db.session.add(newrec)
    db.session.commit()
    return 'Record Created!', 201 # return data and set the status code
  return 'Invalid Password!'

# check password
# if valid password
#  get all record objects
#  convert record objects to dictionaries
#  return dictionaries
# if invalid return invalid password

@app.route('/records', methods=['GET'])
def get_records():
  row = request.get_json()
  records = Records.query.all()
  records = [record.toDict() for record in records] # list comprehension which converts todo objects to dictionaries
  return json.dumps(records)

@app.route('/records/<id>', methods=['DELETE'])
def delete_record(id):
  row = request.get_json()
  if row['password'] == app.config['SECRET_KEY']:
    record = Records.query.filter_by(id=id).first()
    if record == None:
        return 'Record does not exist!'
    db.session.delete(record) # delete the object
    db.session.commit()
  return 'Deleted', 204



if __name__ == '__main__':
  app.run(host='0.0.0.0', port=8080, debug=True)
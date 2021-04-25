"""
Flask Documentation:     http://flask.pocoo.org/docs/
Jinja2 Documentation:    http://jinja.pocoo.org/2/documentation/
Werkzeug Documentation:  http://werkzeug.pocoo.org/documentation/
This file creates your application.
"""

import os, datetime
from app import app, db, login_manager
from flask import render_template, request, redirect, url_for, flash, jsonify
from flask_login import login_user, logout_user, current_user, login_required
from .forms import *
from app.models import *
from werkzeug.security import check_password_hash
from werkzeug.utils import secure_filename
import jwt
from functools import wraps


def token_required(f):
  @wraps(f)
  def decorated(*args, **kwargs):
      token = request.headers.get('Authorization', None)

      if not token:
        return jsonify({'error' : 'Token missing'}), 401
 
      try:
        data = jwt.decode(token.split(" ")[1], app.config['SECRET_KEY'])
        current_user = Users.query.filter_by(username=data['user']).first()

        if not current_user:
          return jsonify({'error': 'Access Deined'}), 401
        return  f(current_user, *args, **kwargs)
      except:
        return jsonify({'error' : 'Token is invalid'}), 401
  return decorated

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
  return render_template('index.html')

@login_manager.user_loader
def load_user(id):
  return UserRegistrationForm.query.get(int(id))

@app.route('/api/register', methods=['POST'])
def register():
  '''Accepts user information and saves it to the database'''

  form = UserRegistrationForm()
  upload_folder = app.config['UPLOAD_FOLDER']

  if request.method == "POST" and form.validate_on_submit():
    photo = form.photo.data
    filename = secure_filename(photo.filename)
    photo.save(os.path.join(upload_folder, filename))
    
    name = form.name.data
    email = form.email.data
    location = form.location.data
    biography = form.biography.data
    username = form.username.data
    password = form.password.data
    date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    new_user = Users(username, password, name, email, location, biography, filename, date)

    username2 = Users.query.filter_by(username=username).first()
    email2 = Users.query.filter_by(email=email).first()

    if username2 is not None: return jsonify(errors=["Username already taken"])
    if email2 is not None: return jsonify(errors=["Email already taken"])
    try:
      db.session.add(new_user)
      db.session.commit()
      return jsonify(messages="User registered successfully")
    except Exception as exc: 
      db.session.rollback()
      print(exc)
    return jsonify(errors=["Internal error occurred, please try again later"])
  return jsonify(errors=form_errors(form))
 

@app.route("/api/auth/login", methods=["POST"])
def login():
  form = LoginForm()

  if request.method == "POST" and form.validate_on_submit():
    username = form.username.data
    password = form.password.data
    user = Users.query.filter_by(username=username).first() 

    if user is not None and check_password_hash(user.password, password):
      key = app.config['SECRET_KEY']
      payload = {'user': user.username}
      token = jwt.encode(payload, key, algorithm="HS256").decode('utf-8')
      return jsonify({
        'message': "Login Successful",
        'token': token,
        'user_name': user.username,
        'user_id': user.id
        })
    else:
      return jsonify(errors=["Username or password is incorrect"])
  return jsonify(errors=form_errors(form))


@app.route('/api/auth/logout', methods=["GET"])
@token_required
def logout():
  return jsonify(message="You have been logged out")


@app.route('/api/cars', methods=["POST"])
@token_required
def new_car(current_user):
  form = NewCarForm()
  upload_folder = app.config['UPLOAD_FOLDER']

  if request.method == "POST" and form.validate_on_submit():
    photo = form.photo.data
    filename = secure_filename(photo.filename)
    photo.save(os.path.join(upload_folder, filename))
    make = form.make.data
    model = form.model.data
    year = form.year.data
    colour = form.colour.data
    price = form.price.data
    car_type = form.car_type.data
    transmission = form.transmission.data
    description = form.description.data

    new_car = Cars(current_user.id, description, make, model, colour, year, transmission, car_type, price, filename)

    try:
      db.session.add(new_car)
      db.session.commit()
      return jsonify(message="Car added successfully")
    except Exception as exc: 
      db.session.rollback()
      print(exc)
      return jsonify(errors=["Internal error occurred, please try again later"])
  return jsonify(errors=form_errors(form))


<<<<<<< HEAD
@app.route('/api/users/<user_id>', methods =['GET'])
@token_required
def user(user_id):
  if request.method == 'GET':
    user = Users.query.filter_by(id=user_id).first()
    #response = {"status": "ok", "user_data":{"name":user.name,
    #"email": user.email, "location": user.location,"biography": user.biography,
    #"profile_image": os.path.join(app.config['UPLOAD_FOLDER'],user.photo), 
    #"joined":user.date_joined}}
    response = {"status" : "ok", "user_data":{"name":user.name}}
    return jsonify(response)


=======
>>>>>>> 1deaac0dc03801804049064634511307aa6f4331
def form_errors(form):
  error_messages = []
  for field, errors in form.errors.items():
    for error in errors:
      message = "Error in the %s field - %s" % (getattr(form, field).label.text,error)
      error_messages.append(message)
  return error_messages

@app.route('/<file_name>.txt')
def send_text_file(file_name):
  """Send your static text file."""
  file_dot_text = file_name + '.txt'
  return app.send_static_file(file_dot_text)


@app.after_request
def add_header(response):
  """
  Add headers to both force latest IE rendering engine or Chrome Frame,
  and also tell the browser not to cache the rendered page. If we wanted
  to we could change max-age to 600 seconds which would be 10 minutes.
  """
  response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
  response.headers['Cache-Control'] = 'public, max-age=0'
  return response


@app.errorhandler(404)
def page_not_found(error):
  """Custom 404 page."""
  return render_template('404.html'), 404


if __name__ == '__main__':
  app.run(debug=True, host="0.0.0.0", port="8080")

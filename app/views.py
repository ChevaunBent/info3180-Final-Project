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
from .forms import RegisterUser, LoginForm
from .models import UserProfile
from werkzeug.security import check_password_hash
from werkzeug.utils import secure_filename
import jwt


###
# Routing for your application.
###

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    """
    Because we use HTML5 history mode in vue-router we need to configure our
    web server to redirect all routes to index.html. Hence the additional route
    "/<path:path".

    Also we will render the initial webpage and then let VueJS take control.
    """
    return render_template('index.html')

@app.route('/api/register', methods=['POST'])
def register():
    '''Accepts user information and saves it to the database'''
    registerUser = RegisterUser()
    
    if request.method == "POST":
        if registerUser.validate_on_submit():
            photo = registerUser.photo.data
            filename = secure_filename(photo.filename)
            photo.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            
            name = registerUser.name.data
            email = registerUser.email.data
            location = registerUser.location.data
            biography = registerUser.biography.data
            username = registerUser.username.data
            password = registerUser.password.data
            date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            
            username2 = UserProfile.query.filter_by(username=username).first()
            email2 =UserProfile.query.filter_by(email=email).first()
            
            user = UserProfile(username, password,name,email,location,biography,filename,date)
            try:
                if username2 is None and email2 is None:
                    db.session.add(user)
                    db.session.commit()
                    return jsonify(message = "Congratulations.... User successfully added"), 201
                while (username2 is not None or email2 is not None or username2 is not None and email2 is not None):
                    if username2 is not None and email2 is not None:
                        return jsonify(errors = ["Email Taken", "Username Taken"])
                    elif email2 is not None:
                        return jsonify(errors = ["Email Taken"])
                    else:
                        return jsonify(errors = ["Username Taken"])
            except Exception as exc: 
                db.session.rollback()
                print (exc)
                return jsonify(errors=["Some Internal Error Occurred, Please Try Again"])
        else:
            return jsonify(errors = form_errors(registerUser))
        
@app.route("/api/auth/login", methods=["POST"])
def login():
    form = LoginForm()
    if request.method == "POST":
        if form.validate_on_submit():
        # change this to actually validate the entire form submission
        # and not just one field
            username = form.username.data
            password = form.password.data
            try:
                # Get the username and password values from the form.
                user = UserProfile.query.filter_by(username=username).first()

                # using your model, query database for a user based on the username
                # and password submitted. Remember you need to compare the password hash.
                # You will need to import the appropriate function to do so.
                # Then store the result of that query to a `user` variable so it can be
                # passed to the login_user() method below.
                if user != None and check_password_hash(user.password,password):
                    #prepare user related info
                    payload = {'user': user.username}
                    jwt_token = str(jwt.encode(payload,app.config['SECRET_KEY'],algorithm = "HS256"))
                    response = {'message': 'User successfully logged in','token':jwt_token, "user_id": user.id}
                    return jsonify(response)
                #If username or password is incorrect
                return jsonify(errors=["Username or password is incorrect"])
            except Exception as exc: 
                print (exc)
                return jsonify(errors=["Some Internal Error Occurred Here, Please Try Again"])
        else:
            return jsonify(errors = form_errors(form))
        
def form_errors(form):
    error_messages = []
    """Collects form errors"""
    for field, errors in form.errors.items():
        for error in errors:
            message = "Error in the %s field - %s" % (
                    getattr(form, field).label.text,
                    error
                )
            error_messages.append(message)

    return error_messages

@app.route('/api/auth/logout', methods = ['POST'])
def logout():
    return jsonify(message= "User successfully logged out.")



# user_loader callback. This callback is used to reload the user object from
# the user ID stored in the session
@login_manager.user_loader
def load_user(id):
    return UserProfile.query.get(int(id))


###
# The functions below should be applicable to all Flask apps.
###


@app.route('/<file_name>.txt')
def send_text_file(file_name):
    """Send your static text file."""
    file_dot_text = file_name + '.txt'
    return app.send_static_file(file_dot_text)


@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
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

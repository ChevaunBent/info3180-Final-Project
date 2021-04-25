from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileRequired, FileAllowed
from wtforms import StringField, PasswordField, TextAreaField, IntegerField, FloatField, SelectField, HiddenField, validators
from wtforms.validators import InputRequired, Email, DataRequired

class UserRegistrationForm(FlaskForm):
  name = StringField('Name', validators=[InputRequired()])
  email = StringField('Email', validators=[InputRequired(),Email(message='Please enter a valid email address')])
  location = StringField('Location', validators=[InputRequired()])
  biography = TextAreaField('Biography', validators=[InputRequired()])
  username = StringField('Username', validators=[InputRequired()])
  password = PasswordField('Password', validators=[InputRequired()])
  photo = FileField('Photo', validators=[FileRequired(),FileAllowed(['jpg', 'jpeg', 'png'],'Images Only!')])
  
class LoginForm(FlaskForm):
  username = StringField('Username', validators=[InputRequired()])
  password = PasswordField('Password', validators=[InputRequired()])

class NewCarForm(FlaskForm):
  make = StringField('Make', validators=[InputRequired()])
  model = StringField('Model', validators=[InputRequired()])
  colour = StringField('Colour', validators=[InputRequired()])
  year = StringField('Year', validators=[InputRequired()])
  price = StringField('Price', validators=[InputRequired()])
  cartype = StringField('Car Type', validators=[InputRequired()])
  transmission = StringField('Transmission', validators=[InputRequired()])
  description = TextAreaField('Description', validators=[InputRequired()])
  photo = FileField('Upload Photo', validators=[FileRequired(),FileAllowed(['jpg', 'jpeg', 'png'],'Images Only!')])

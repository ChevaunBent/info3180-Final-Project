from . import db
from werkzeug.security import generate_password_hash

class Cars(db.Model):
    __tablename__ = 'Cars'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    description = db.Column(db.Text)
    make = db.Column(db.Text)
    model = db.Column(db.Text)
    colour = db.Column(db.Text)
    year = db.Column(db.Text)
    transmission = db.Column(db.Text)
    car_type = db.Column(db.Text)
    price = db.Column(db.Float)
    photo = db.Column(db.Text)

    def __init__(self, user_id, description, make, model, colour, year, transmission, car_type, price, photo):
        self.user_id = user_id
        self.description = description
        self.make = make 
        self.model = model
        self.colour = colour
        self.year = year
        self.transmission = transmission
        self.car_type = car_type
        self.price = price
        self.photo = photo

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        try:
            return unicode(self.id)  # python 2 support
        except NameError:
            return str(self.id)  # python 3 support

    def __repr__(self):
        return '<Cars %r>' % (self.id)

class Favourites(db.Model):
    __tablename__ = 'Favourites'

    id = db.Column(db.Integer, primary_key=True)
    car_id = db.Column(db.Integer)
    user_id = db.Column(db.Integer)

    def __init__(self, car_id, user_id):
        self.car_id = car_id
        self.user_id = user_id

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        try:
            return unicode(self.id)  # python 2 support
        except NameError:
            return str(self.id)  # python 3 support

    def __repr__(self):
        return '<Favourites %r>' % (self.id)

class Users(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    password = db.Column(db.String(255))
    name = db.Column(db.String(100))
    email = db.Column(db.String(120),  unique=True)
    location = db.Column(db.String(100))
    biography = db.Column(db.Text)
    photo = db.Column(db.Text)
    date_joined= db.Column(db.DateTime)

    def __init__(self, username, password, name, email, location, biography, photo, date_joined):
        self.username = username
        self.password = generate_password_hash(password, method='pbkdf2:sha256')
        self.name = name
        self.email = email
        self.location = location
        self.biography = biography
        self.photo = photo
        self.date_joined = date_joined

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        try:
            return unicode(self.id)  # python 2 support
        except NameError:
            return str(self.id)  # python 3 support

    def __repr__(self):
        return '<User %r>' % (self.username)


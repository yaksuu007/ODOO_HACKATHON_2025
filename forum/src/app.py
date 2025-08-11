from flask import Flask, jsonify, request,session
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_cors import CORS
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_bcrypt import Bcrypt

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost/hackathon'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = "your-secret-key"

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

# CORS - allow your React dev servers and support credentials for sessions/cookies
CORS(app, supports_credentials=True, origins=["http://localhost:5173", "http://localhost:5174"])

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'  # optional, for redirects

# Models

class Login(db.Model, UserMixin):
    __tablename__ = 'login'
    sr_no = db.Column(db.Integer, primary_key=True, autoincrement=True)
    profile_image = db.Column(db.String(255), nullable=True)
    fullname = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    contact_number = db.Column(db.String(15), nullable=False)
    designation = db.Column(db.Enum('player', 'facilities'), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


    def get_id(self):
        return str(self.sr_no)
    
    def to_dict(self):
        return {
            "sr_no": self.sr_no,
            "profile_image": self.profile_image,
            "fullname": self.fullname,
            "email": self.email,
            "contact_number": self.contact_number,
            "designation": self.designation,
            "created_at": self.created_at.isoformat()
        }


@login_manager.user_loader
def load_user(user_id):
    return Login.query.get(int(user_id))


# Routes

@app.route("/api/register", methods=["POST"])
def register():
    data = request.json
    fullname = data.get("fullname")
    email = data.get("email")
    password = data.get("password")
    contact_number = data.get("contact_number")
    designation = data.get("designation")
    profile_image = data.get("profile_image", "")  # Optional field

    if not all([fullname, email, password, contact_number, designation]):
        return jsonify({"message": "Missing required fields"}), 400

    if Login.query.filter_by(email=email).first():
        return jsonify({"message": "Email already registered"}), 400

    pw_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    new_user = Login(
        fullname=fullname,
        email=email,
        password_hash=pw_hash,
        contact_number=contact_number,
        designation=designation,
        profile_image=profile_image
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201


@app.route("/api/login", methods=["POST"])
def login():
   
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")

        print(f"Login attempt: email={email}")

        if not email or not password:
            print("Missing email or password")
            return jsonify({"message": "Email and password required"}), 400

        user = Login.query.filter_by(email=email).first()
        if user is None:
            print("User not found")
            return jsonify({"message": "Invalid credentials"}), 401

        print(f"User found: {user.fullname}, verifying password")

        if bcrypt.check_password_hash(user.password_hash, password):
            print("You have succesfully login")
            session['fullname'] = user.fullname
            session['email'] = user.email
            session['designation'] = user.designation
            login_user(user)
            return jsonify({"message": "Logged in", "user": user.to_dict()})
        else:
            print("Password incorrect")
            return jsonify({"message": "Invalid credentials"}), 401
    except Exception as e:
        print("Login error:", e)
        return jsonify({"message": "Internal server error"}), 500


@app.route("/api/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out"})


@app.route("/api/user", methods=["GET"])
@login_required
def get_user():
    return jsonify(current_user.to_dict())


# Other models and routes here...


@app.route("/")
def index():
    return "Flask is running!"


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0')

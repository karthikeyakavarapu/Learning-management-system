from flask import Flask, request, jsonify
from flask_cors import CORS
from database import init_db, get_db_connection
import crud

init_db()

app = Flask(__name__)
# Enable CORS for all routes (important for React Vite fetching)
CORS(app)

@app.route("/api/auth/register", methods=["POST"])
def register():
    data = request.json
    db = get_db_connection()
    
    db_user = crud.get_user_by_username(db, username=data.get("username"))
    if db_user:
        db.close()
        return jsonify({"detail": "Username already registered"}), 400
        
    new_user = crud.create_user(db=db, user_data=data)
    result = {"message": "User successfully registered", "user_id": new_user["id"], "role": new_user["role"]}
    db.close()
    return jsonify(result)

@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.json
    db = get_db_connection()
    
    db_user = crud.get_user_by_username(db, username=data.get("username"))
    if not db_user:
        db.close()
        return jsonify({"detail": "Invalid username or password"}), 400
        
    if db_user["hashed_password"] != data.get("password") + "notreallyhashed":
        db.close()
        return jsonify({"detail": "Invalid username or password"}), 400
    
    fake_token = f"fake-jwt-token-{db_user['id']}"
    result = {"access_token": fake_token, "role": db_user["role"], "user_id": db_user["id"]}
    db.close()
    return jsonify(result)

@app.route("/api/courses", methods=["GET"])
def get_all_courses():
    db = get_db_connection()
    courses = crud.get_courses(db)
    result = [
        {
            "id": c["id"],
            "title": c["title"],
            "description": c["description"],
            "instructor_id": c["instructor_id"],
        } for c in courses
    ]
    db.close()
    return jsonify(result)

@app.route("/api/courses/<int:course_id>/details", methods=["GET"])
def get_course_details(course_id):
    db = get_db_connection()
    lessons = crud.get_lessons_by_course(db, course_id=course_id)
    tests = crud.get_tests_by_course(db, course_id=course_id)
    db.close()
    return jsonify({
        "lessons": [{"id": l["id"], "title": l["title"], "youtube_url": l["youtube_url"]} for l in lessons],
        "tests": [{"id": t["id"], "title": t["title"], "test_url": t["test_url"]} for t in tests]
    })

@app.route("/api/courses", methods=["POST"])
def create_course():
    data = request.json
    instructor_id = request.args.get("instructor_id", type=int)
    db = get_db_connection()
    c = crud.create_course(db=db, course_data=data, instructor_id=instructor_id)
    db.close()
    return jsonify({"message": "Course created", "course_id": c["id"]})

@app.route("/api/courses/<int:course_id>/lessons", methods=["POST"])
def create_lesson(course_id):
    data = request.json
    db = get_db_connection()
    l = crud.create_lesson(db=db, lesson_data=data, course_id=course_id)
    db.close()
    return jsonify({"message": "Lesson added", "lesson_id": l["id"]})

@app.route("/api/courses/<int:course_id>/tests", methods=["POST"])
def create_test(course_id):
    data = request.json
    db = get_db_connection()
    t = crud.create_test(db=db, test_data=data, course_id=course_id)
    db.close()
    return jsonify({"message": "Test added", "test_id": t["id"]})

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=True)

import sqlite3

def get_user_by_username(db, username):
    return db.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()

def create_user(db, user_data):
    fake_hashed_password = user_data["password"] + "notreallyhashed"
    cursor = db.execute(
        'INSERT INTO users (username, hashed_password, role) VALUES (?, ?, ?)',
        (user_data["username"], fake_hashed_password, user_data["role"])
    )
    db.commit()
    user_id = cursor.lastrowid
    return {"id": user_id, "username": user_data["username"], "role": user_data["role"]}

def get_courses(db):
    return db.execute('SELECT * FROM courses').fetchall()

def create_course(db, course_data, instructor_id):
    cursor = db.execute(
        'INSERT INTO courses (title, description, instructor_id) VALUES (?, ?, ?)',
        (course_data["title"], course_data["description"], instructor_id)
    )
    db.commit()
    return {"id": cursor.lastrowid}

def get_lessons_by_course(db, course_id):
    return db.execute('SELECT * FROM lessons WHERE course_id = ?', (course_id,)).fetchall()

def create_lesson(db, lesson_data, course_id):
    cursor = db.execute(
        'INSERT INTO lessons (title, youtube_url, course_id) VALUES (?, ?, ?)',
        (lesson_data["title"], lesson_data["youtube_url"], course_id)
    )
    db.commit()
    return {"id": cursor.lastrowid}

def get_tests_by_course(db, course_id):
    return db.execute('SELECT * FROM tests WHERE course_id = ?', (course_id,)).fetchall()

def create_test(db, test_data, course_id):
    cursor = db.execute(
        'INSERT INTO tests (title, test_url, course_id) VALUES (?, ?, ?)',
        (test_data["title"], test_data["test_url"], course_id)
    )
    db.commit()
    return {"id": cursor.lastrowid}

import os
import sys

# ensure project root in path so "from app import ..." works
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from app import create_app, db
from app.models import Task

app = create_app()

with app.app_context():
    db.create_all()
    if Task.query.count() == 0:
        t = Task(title="Sample Task", description="This task is auto-created.")
        db.session.add(t)
        db.session.commit()
        print("Created sample task with id:", t.id)
    else:
        print("Database already has tasks.")

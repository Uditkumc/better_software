# tests/test_comments.py
import pytest
from app import create_app, db
from app.models import Task

@pytest.fixture
def app():
    app = create_app({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "SQLALCHEMY_TRACK_MODIFICATIONS": False,
    })
    with app.app_context():
        db.create_all()
        # add one task
        t = Task(title="Test Task", description="desc")
        db.session.add(t)
        db.session.commit()
    yield app
    with app.app_context():
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

def test_create_comment(client):
    res = client.post('/api/tasks/1/comments', json={"content": "Hello", "author": "Sam"})
    assert res.status_code == 201
    data = res.get_json()
    assert data['content'] == "Hello"
    assert data['author'] == "Sam"
    assert data['task_id'] == 1

def test_create_comment_missing_content(client):
    res = client.post('/api/tasks/1/comments', json={"author": "Sam"})
    assert res.status_code == 400

def test_list_comments(client):
    client.post('/api/tasks/1/comments', json={"content": "c1"})
    client.post('/api/tasks/1/comments', json={"content": "c2"})
    res = client.get('/api/tasks/1/comments')
    assert res.status_code == 200
    data = res.get_json()
    assert isinstance(data, list)
    assert len(data) == 2

def test_update_comment(client):
    res = client.post('/api/tasks/1/comments', json={"content": "old"})
    cid = res.get_json()['id']
    res2 = client.put(f'/api/comments/{cid}', json={"content": "new", "author": "X"})
    assert res2.status_code == 200
    d = res2.get_json()
    assert d['content'] == "new"
    assert d['author'] == "X"

def test_delete_comment(client):
    res = client.post('/api/tasks/1/comments', json={"content": "to del"})
    cid = res.get_json()['id']
    res2 = client.delete(f'/api/comments/{cid}')
    assert res2.status_code == 200
    res3 = client.get('/api/tasks/1/comments')
    assert all(c['id'] != cid for c in res3.get_json())

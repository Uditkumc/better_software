from flask import Blueprint, request, jsonify
from .. import db
from ..models import Task, Comment

comments_bp = Blueprint('comments', __name__)

@comments_bp.route('/tasks', methods=['GET'])
def list_tasks():
    tasks = Task.query.order_by(Task.id.asc()).all()
    return jsonify([t.to_dict() for t in tasks]), 200

@comments_bp.route('/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    t = Task.query.get(task_id)
    if not t:
        return jsonify({"error":"task not found"}), 404
    return jsonify(t.to_dict()), 200

@comments_bp.route('/tasks/<int:task_id>/comments', methods=['GET'])
def list_comments(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error":"task not found"}), 404
    comments = [c.to_dict() for c in task.comments.order_by(Comment.id.asc()).all()]
    return jsonify(comments), 200

@comments_bp.route('/tasks/<int:task_id>/comments', methods=['POST'])
def create_comment(task_id):
    data = request.get_json() or {}
    content = (data.get('content') or '').strip()
    author = data.get('author')
    if not content:
        return jsonify({"error":"content required"}), 400
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error":"task not found"}), 404
    comment = Comment(task_id=task_id, content=content, author=author)
    db.session.add(comment)
    db.session.commit()
    return jsonify(comment.to_dict()), 201

@comments_bp.route('/comments/<int:comment_id>', methods=['PUT'])
def update_comment(comment_id):
    data = request.get_json() or {}
    comment = Comment.query.get(comment_id)
    if not comment:
        return jsonify({"error":"comment not found"}), 404
    content = data.get('content')
    author = data.get('author')
    if content is not None:
        content = content.strip()
        if not content:
            return jsonify({"error":"content cannot be empty"}), 400
        comment.content = content
    if author is not None:
        comment.author = author
    db.session.commit()
    return jsonify(comment.to_dict()), 200

@comments_bp.route('/comments/<int:comment_id>', methods=['DELETE'])
def delete_comment(comment_id):
    comment = Comment.query.get(comment_id)
    if not comment:
        return jsonify({"error":"comment not found"}), 404
    db.session.delete(comment)
    db.session.commit()
    return jsonify({"message":"deleted"}), 200

import React, { useEffect, useState } from "react";

export default function Comments({ taskId }) {
  const [comments, setComments] = useState([]);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);

  async function load(){
    try {
      const res = await fetch(`/api/tasks/${taskId}/comments`);
      const data = await res.json();
      setComments(data || []);
    } catch (e) {
      setComments([]);
    }
  }

  useEffect(()=>{ load(); }, [taskId]);

  async function addComment(){
    if (!content.trim()) return alert("Write something");
    try {
      const res = await fetch(`/api/tasks/${taskId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, author })
      });
      if (!res.ok) throw new Error("add fail");
      setAuthor(""); setContent("");
      load();
    } catch (e) {
      alert("Error adding comment");
    }
  }

  async function saveEdit(){
    if (!editingId) return;
    if (!content.trim()) return alert("Write something");
    try {
      const res = await fetch(`/api/comments/${editingId}`, {
        method: "PUT",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ content, author })
      });
      if (!res.ok) throw new Error("edit fail");
      setEditingId(null); setAuthor(""); setContent("");
      load();
    } catch (e) {
      alert("Error updating");
    }
  }

  async function removeComment(id){
    if (!window.confirm("Delete?")) return;
    try {
      const res = await fetch(`/api/comments/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("delete fail");
      load();
    } catch (e) {
      alert("Error deleting");
    }
  }

  function startEdit(c){
    setEditingId(c.id);
    setAuthor(c.author || "");
    setContent(c.content || "");
  }

  return (
    <div>
      <h3>Comments ({comments.length})</h3>

      <div>
        {comments.map(c => (
          <div key={c.id} className="comment-card">
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <div>
                <div className="comment-author">{c.author || "Anonymous"}</div>
                <div className="comment-time">{c.created_at ? new Date(c.created_at).toLocaleString() : ""}</div>
              </div>
              <div>
                <button className="btn ghost" onClick={()=>startEdit(c)}>Edit</button>
                <button className="btn" onClick={()=>removeComment(c.id)}>Delete</button>
              </div>
            </div>
            <p style={{marginTop:8}}>{c.content}</p>
          </div>
        ))}
      </div>

      <div className="form-row" style={{marginTop:12}}>
        <input placeholder="Your name (optional)" value={author} onChange={e=>setAuthor(e.target.value)} />
        <textarea placeholder="Write a comment..." value={content} onChange={e=>setContent(e.target.value)} rows={4} />
        <div style={{marginTop:8}}>
          {editingId ? (
            <>
              <button className="btn primary" onClick={saveEdit}>Save</button>
              <button className="btn ghost" onClick={()=>{ setEditingId(null); setAuthor(""); setContent(""); }}>Cancel</button>
            </>
          ) : (
            <button className="btn primary" onClick={addComment}>Add Comment</button>
          )}
        </div>
      </div>
    </div>
  );
}

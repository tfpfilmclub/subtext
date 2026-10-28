'use client';
import { useEffect, useState } from 'react';
type Comment = {id:string;story:string;name:string;text:string;created_at:string;status:string;reports:number};
export default function Moderation() {
  const [comments,setComments]=useState<Comment[]>([]),[message,setMessage]=useState('Loading…');
  async function load() {try{const response=await fetch('/api/moderation');if(!response.ok)throw new Error();const data=await response.json();setComments(data.comments);setMessage(data.comments.length?'':'No comments yet.');}catch{setMessage('Could not load comments. Please refresh.');}}
  useEffect(()=>{load();},[]);
  async function remove(id:string) {if(!window.confirm('Delete this comment?'))return;const response=await fetch(`/api/comments/${id}/delete`,{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});if(response.ok)load();else setMessage('Could not delete the comment.');}
  return <main style={{maxWidth:850,margin:'auto',padding:'48px 24px',fontFamily:'Georgia,serif'}}><a href="https://tfpfilmclub.github.io/subtext/">SUBTEXT ↗</a><h1 style={{fontSize:44,margin:'24px 0'}}>Reader comments</h1><p>{message}</p>{comments.map(comment=><article key={comment.id} style={{borderTop:'1px solid #ccc',padding:'24px 0'}}><p>{comment.story} · {comment.status} · {comment.reports} reports</p><h2>{comment.name}</h2><p style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{comment.text}</p><p>{new Date(comment.created_at).toLocaleString()}</p><button onClick={()=>remove(comment.id)} style={{border:'1px solid #a50927',padding:'8px 18px',color:'#a50927',cursor:'pointer'}}>Delete</button></article>)}</main>;
}

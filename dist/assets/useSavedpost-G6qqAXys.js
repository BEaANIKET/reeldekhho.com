import{u as c,r as n,a as P,b as o,W as i,Y as S,Z as f}from"./index-rrPmFSZK.js";const y=()=>{const v=c(s=>{var e;return(e=s==null?void 0:s.savedPosts)==null?void 0:e.saved_Posts}),[p,t]=n.useState(!1),a=P(),r=c(s=>{var e;return(e=s==null?void 0:s.auth)==null?void 0:e.user}),u=async s=>{try{const e=await o.post("/post/addSaved?postId="+s);a(i(e.data.savedPost))}catch{}},d=async()=>{try{t(!0);const s=await o.get("/post/getsaved");a(S(s.data.savedPosts))}catch{}finally{t(!1)}},l=async s=>{try{const e=await o.delete(`/post/deletesaved?id=${s}`,{data:{postId:s}});a(f({_id:s}))}catch(e){console.error(e)}};return n.useEffect(()=>{r&&v.length===0&&(console.log("saved effect ran"),d())},[r]),{addSavedPost:u,getSavedPosts:d,removeSavedPost:l,savedLoading:p}};export{y as u};

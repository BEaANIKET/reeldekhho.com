import{r as o,b as g,c as v,j as s,R as w}from"./index-rrPmFSZK.js";const b=()=>{const[d,u]=o.useState([]),[c,n]=o.useState([]),[a,i]=o.useState(!0),[f,p]=o.useState(!0),m=async()=>{var r,t;try{const l=(await g.get("/post/get")).data.posts;u(l),n(l.map(h=>h._id))}catch(e){console.error((t=(r=e==null?void 0:e.response)==null?void 0:r.data)==null?void 0:t.error)}finally{p(!1)}},x=async()=>{var r,t;try{const l=(await g.get(`/post/get?&excludeIds=${c.join(",")}`)).data.posts;u([...d,...l]),n([...c,...l.map(h=>h._id)]),l.length<3&&i(!1)}catch(e){console.error((t=(r=e==null?void 0:e.response)==null?void 0:r.data)==null?void 0:t.error)}};return o.useEffect(()=>{m()},[]),{reels:d,loadReels:x,loader:f,hasmore:a}};function y(){const[d,u]=o.useState(0),{loadReels:c,reels:n,loader:a,hasmore:i}=b(),f=o.useRef(null),p=o.useRef([]),m=o.useCallback(()=>{if(!f.current)return;const r=f.current,t=r.scrollTop,e=r.offsetHeight;p.current.forEach((l,h)=>{if(l){const R=l.offsetTop,j=R+l.offsetHeight;R<=t+e/2&&j>t+e/2&&u(h)}})},[]),x=v(()=>{!a&&i&&c()},()=>{},{threshold:.3});return o.useEffect(()=>{d>=n.length-2&&i&&!a&&c()},[d,n.length,i,a,c]),s.jsx("div",{className:"h-[100dvh] w-full max-w-md m-auto bg-black overflow-hidden",children:a&&n.length===0?s.jsx("div",{className:"flex justify-center items-center h-full text-white",children:s.jsx("p",{children:"Loading..."})}):s.jsxs("div",{ref:f,onScroll:m,className:"h-[100dvh] scrollbar-hide overflow-y-scroll snap-start snap-mandatory snap-y",children:[n.map((r,t)=>s.jsx("div",{ref:e=>p.current[t]=e,className:"snap-start w-full h-full",children:s.jsx(w,{reel:r})},t)),s.jsx("div",{ref:x,className:"relative flex dark:bg-black bg-white text-black dark:text-white justify-center items-center z-10 h-full w-full snap-start overflow-hidden",children:a?s.jsx("p",{children:"Loading more reels..."}):i?s.jsx("p",{children:"Scroll down for more reels..."}):s.jsx("p",{children:"No more reels!"})})]})})}function N(){return s.jsx("div",{className:"h-[100dvh] w-full relative m-auto ",children:s.jsx(y,{})})}export{N as default};

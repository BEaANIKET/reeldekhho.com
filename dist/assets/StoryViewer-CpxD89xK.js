import{f as c,j as e,l as x,d as f,r as l,X as j}from"./index-rrPmFSZK.js";/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=c("ChevronLeft",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=c("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);function N({progress:a}){return e.jsx("div",{className:"w-full bg-gray-600 bg-opacity-50 h-1 rounded-full overflow-hidden",children:e.jsx("div",{className:"h-full bg-white transition-all duration-100 ease-linear",style:{width:`${a}%`}})})}function p(){const{username:a}=x(),n=f(),[u,w]=l.useState(0),[h,d]=l.useState(0),s=stories.find(r=>r.username===a),t=stories.findIndex(r=>r.username===a);l.useEffect(()=>{const r=setInterval(()=>{d(o=>o>=100?(i(),0):o+1)},30);return()=>clearInterval(r)},[u]);const i=()=>{t<stories.length-1?n(`/stories/${stories[t+1].username}`):n("/")},m=()=>{t>0&&n(`/stories/${stories[t-1].username}`)};return s?e.jsx("div",{className:"fixed inset-0 bg-black z-50",children:e.jsxs("div",{className:"relative h-full",children:[e.jsx("div",{className:"absolute top-0 w-full z-10 p-2",children:e.jsx(N,{progress:h})}),e.jsx("button",{onClick:()=>n("/"),className:"absolute top-4 right-4 z-10 text-white",children:e.jsx(j,{className:"w-6 h-6"})}),e.jsx("div",{className:"h-full flex items-center justify-center",children:e.jsx("img",{src:s.avatar,alt:s.username,className:"max-h-[90vh] object-contain"})}),t>0&&e.jsx("button",{onClick:m,className:"absolute left-4 top-1/2 transform -translate-y-1/2 text-white",children:e.jsx(v,{className:"w-8 h-8"})}),t<stories.length-1&&e.jsx("button",{onClick:i,className:"absolute right-4 top-1/2 transform -translate-y-1/2 text-white",children:e.jsx(g,{className:"w-8 h-8"})}),e.jsxs("div",{className:"absolute top-8 left-4 flex items-center space-x-2 text-white",children:[e.jsx("img",{src:s.avatar,alt:s.username,className:"w-8 h-8 rounded-full"}),e.jsx("span",{className:"font-semibold",children:s.username})]})]})}):null}export{p as default};

import{j as e}from"./jsx-runtime.CYXfivyR.js";import{h as I,p as H,a as O,b as B,m as P}from"./metaInfo.BhSY2715.js";import{p as m,a as R}from"./scrollInfo._nnrpahV.js";import{i as Y}from"./viewport.BLYoLRbk.js";import{f as D}from"./floor.C5SQ4ACR.js";import{u as a,a as T}from"./react.DptU6QxA.js";import{r as c}from"./index.Wp2u197Z.js";import{m as b,b as L,s as V}from"./config.B1_Pq8xc.js";import{c as u}from"./clsx.B-dksMZM.js";import{R as $,s as E}from"./searchPanel.V79e4mFB.js";import{A as l}from"./index.BVDwVEyD.js";import{m as i}from"./proxy.BrPFIn7t.js";import{R as X,T as Z,P as _,O as q,C as F}from"./index.skriH5Ff.js";import"./toNumber.DCaU3JdG.js";import"./index.yciKJEZf.js";import"./SVGVisualElement.CBlbrLkY.js";const x=50;function G(){const t=a(m);return t>=x?1:D(t/x,2)}function g(){return a(I)}function J(){return a(m)<x}function y(){return a(Y)}function p(){const t=g(),s=a(m);return t&&s>=x}function K(){const t=a(O),s=a(B),n=a(P);return{title:t,description:s,slug:n}}function Q(){return a(H)}function U(){const t=a(m),s=a(R);return g()&&t>=400&&s==="up"}function W(){const t=G();return e.jsx("div",{className:"absolute inset-0 -z-1 border-b border-zinc-200 dark:border-zinc-700 bg-white/70 dark:bg-zinc-800/70 backdrop-saturate-150 backdrop-blur-lg transform-gpu",style:{opacity:t}})}function ee(){return e.jsxs(e.Fragment,{children:[e.jsx(te,{}),e.jsx(se,{})]})}function te(){const t=J(),s=p();return e.jsx(l,{children:!s&&e.jsx(i.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsx(v,{isBgShow:t})})})}function se(){const t=U();return e.jsx($,{children:e.jsx(l,{children:t&&e.jsx(i.div,{className:"fixed z-10 top-12 inset-x-0 flex justify-center pointer-events-none",initial:{y:-20},animate:{y:0},exit:{y:-20,opacity:0},children:e.jsx(v,{isBgShow:!0})})})})}function v({isBgShow:t}){const s=Q(),[n,r]=c.useState(0),[h,N]=c.useState(0),[M,k]=c.useState(0),S=`radial-gradient(${M}px circle at ${n}px ${h}px, rgb(var(--accent) / 0.12) 0%, transparent 65%)`,z=({clientX:o,clientY:A,currentTarget:C})=>{const d=C.getBoundingClientRect();r(o-d.left),N(A-d.top),k(Math.sqrt(d.width**2+d.height**2)/2.5)};return e.jsxs("nav",{className:u("relative rounded-full group pointer-events-auto",{"shadow-lg shadow-zinc-800/5 border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 backdrop-blur":t}),onMouseMove:z,children:[e.jsx("div",{className:"absolute -z-1 -inset-px rounded-full opacity-0 group-hover:opacity-100",style:{background:S},"aria-hidden":!0}),e.jsx("div",{className:"text-sm px-4 flex",children:b.map(o=>e.jsx(ne,{href:o.link,title:o.name,icon:o.icon,isActive:s===o.link},o.name))})]})}function ne({href:t,isActive:s,title:n,icon:r}){return e.jsxs("a",{className:u("relative block px-4 py-1.5",s?"text-accent":"hover:text-accent"),href:t,children:[e.jsxs("div",{className:"flex space-x-2",children:[s&&e.jsx(i.i,{className:u("iconfont",r),initial:{y:10,opacity:0},animate:{y:0,opacity:1}}),e.jsx("span",{children:n})]}),s&&e.jsx("div",{className:"absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent"})]})}function ae(){const t=T(E);return e.jsx("button",{className:"size-9 rounded-full shadow-lg shadow-zinc-800/5 border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 backdrop-blur",type:"button","aria-label":"Search",onClick:()=>t(!0),children:e.jsx("i",{className:"iconfont icon-search"})})}function f(){const t=y(),s=p();return t?e.jsx(l,{children:!s&&e.jsx(i.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsx(j,{})})}):e.jsx(j,{})}function j(){return e.jsx("a",{className:"block",href:"/",title:"Nav to home",children:e.jsx("img",{className:"size-[40px] select-none object-cover rounded-2xl",src:L.avatar,alt:"Site owner avatar"})})}function ie(){const{title:t,description:s,slug:n}=K(),r=p();return e.jsx(l,{children:r&&e.jsxs(i.div,{className:"absolute inset-0 z-1 flex items-center justify-between md:px-10",initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:20},children:[e.jsxs("div",{className:"grow min-w-0",children:[e.jsx("div",{className:"truncate text-gray-600/60 dark:text-gray-300/60 text-xs",children:s}),e.jsx("h2",{className:"truncate text-lg",children:t})]}),e.jsxs("div",{className:"hidden md:block min-w-0 text-right",children:[e.jsx("div",{className:"text-gray-600/60 dark:text-gray-300/60 text-xs truncate",children:n}),e.jsx("div",{className:"text-gray-600 dark:text-gray-300",children:V.title})]})]})})}const re={hidden:{x:"-100%",transition:{duration:.2,ease:"easeOut"}},visible:{x:0,transition:{staggerChildren:.1,delayChildren:.1,duration:.2,ease:"easeOut"}}},oe={hidden:{opacity:0,x:"-100%"},visible:{opacity:1,x:0}};function ce({zIndex:t=999}){const[s,n]=c.useState(!1),r=t-1,h=t;return e.jsxs(X,{open:s,onOpenChange:n,children:[e.jsx(Z,{asChild:!0,children:e.jsx(le,{})}),e.jsx(l,{children:s&&e.jsxs(_,{forceMount:!0,children:[e.jsx(q,{asChild:!0,children:e.jsx(i.div,{className:"fixed inset-0 bg-gray-800/40",style:{zIndex:r},initial:{opacity:0},animate:{opacity:1},exit:{opacity:0,transition:{delay:.1}}})}),e.jsx(F,{asChild:!0,children:e.jsx(i.div,{className:"fixed left-0 inset-y-0 h-full bg-base rounded-r-lg p-4 flex flex-col justify-center w-[260px] max-w-[80%]",style:{zIndex:h},variants:re,initial:"hidden",animate:"visible",exit:"hidden",children:e.jsx(w.Provider,{value:{dismiss(){n(!1)}},children:e.jsx(de,{})})})})]})})]})}const le=c.forwardRef((t,s)=>e.jsx("button",{ref:s,className:"size-9 rounded-full shadow-lg shadow-zinc-800/5 border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 backdrop-blur",type:"button","aria-label":"Open menu",...t,children:e.jsx("i",{className:"iconfont icon-menu"})}));function de(){const{dismiss:t}=c.useContext(w);return e.jsx("ul",{className:"mt-8 pb-8 overflow-y-auto overflow-x-hidden min-h-0",children:b.map(s=>e.jsx(i.li,{variants:oe,children:e.jsxs("a",{className:"inline-flex p-2 space-x-4",href:s.link,onClick:t,children:[e.jsx("i",{className:u("iconfont",s.icon)}),e.jsx("span",{children:s.name})]})},s.name))})}const w=c.createContext(null);function ze(){const t=y();return e.jsxs("header",{className:"fixed top-0 inset-x-0 h-[64px] z-10 overflow-hidden",children:[e.jsx(W,{}),e.jsxs("div",{className:"max-w-[1100px] h-full md:px-4 mx-auto grid grid-cols-[64px_auto_64px]",children:[e.jsx("div",{className:"flex items-center justify-center",children:t?e.jsx(ce,{}):e.jsx(f,{})}),e.jsxs("div",{className:"relative flex items-center justify-center",children:[t?e.jsx(f,{}):e.jsx(ee,{}),e.jsx(ie,{})]}),e.jsx("div",{className:"flex items-center justify-center",children:e.jsx(ae,{})})]})]})}export{ze as Header};

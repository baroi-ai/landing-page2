import{c as p,r as v,j as e,B as E,L as S,a as J,b as D,H as Q,N as ee,Z as te,F as ne}from"./index-CZ3PCl2j.js";import{I as ae,V as se,D as re}from"./video-CjbrukFD.js";/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H=p("Feather",[["path",{d:"M12.67 19a2 2 0 0 0 1.416-.588l6.154-6.172a6 6 0 0 0-8.49-8.49L5.586 9.914A2 2 0 0 0 5 11.328V18a1 1 0 0 0 1 1z",key:"18jl4k"}],["path",{d:"M16 8 2 22",key:"vp34q"}],["path",{d:"M17.5 15H9",key:"1oz8nu"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oe=p("GitBranch",[["line",{x1:"6",x2:"6",y1:"3",y2:"15",key:"17qcm7"}],["circle",{cx:"18",cy:"6",r:"3",key:"1h7g24"}],["circle",{cx:"6",cy:"18",r:"3",key:"fqmcym"}],["path",{d:"M18 9a9 9 0 0 1-9 9",key:"n2h4wq"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ie=p("Hourglass",[["path",{d:"M5 22h14",key:"ehvnwv"}],["path",{d:"M5 2h14",key:"pdyrp9"}],["path",{d:"M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22",key:"1d314k"}],["path",{d:"M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2",key:"1vvvr6"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const le=p("Lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ce=p("Mic",[["path",{d:"M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z",key:"131961"}],["path",{d:"M19 10v2a7 7 0 0 1-14 0v-2",key:"1vc78b"}],["line",{x1:"12",x2:"12",y1:"19",y2:"22",key:"x3vr5v"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const de=p("MonitorSmartphone",[["path",{d:"M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8",key:"10dyio"}],["path",{d:"M10 19v-3.96 3.15",key:"1irgej"}],["path",{d:"M7 19h5",key:"qswx4l"}],["rect",{width:"6",height:"10",x:"16",y:"12",rx:"2",key:"1egngj"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const me=p("Palette",[["circle",{cx:"13.5",cy:"6.5",r:".5",fill:"currentColor",key:"1okk4w"}],["circle",{cx:"17.5",cy:"10.5",r:".5",fill:"currentColor",key:"f64h9f"}],["circle",{cx:"8.5",cy:"7.5",r:".5",fill:"currentColor",key:"fotxhn"}],["circle",{cx:"6.5",cy:"12.5",r:".5",fill:"currentColor",key:"qy21gx"}],["path",{d:"M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z",key:"12rzf8"}]]);var B={};function xe(s){if(typeof window>"u")return;const r=document.createElement("style");return r.setAttribute("type","text/css"),r.innerHTML=s,document.head.appendChild(r),s}Object.defineProperty(B,"__esModule",{value:!0});var a=v;function he(s){return s&&typeof s=="object"&&"default"in s?s:{default:s}}var m=he(a);xe(`.rfm-marquee-container {
  overflow-x: hidden;
  display: flex;
  flex-direction: row;
  position: relative;
  width: var(--width);
  transform: var(--transform);
}
.rfm-marquee-container:hover div {
  animation-play-state: var(--pause-on-hover);
}
.rfm-marquee-container:active div {
  animation-play-state: var(--pause-on-click);
}

.rfm-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
}
.rfm-overlay::before, .rfm-overlay::after {
  background: linear-gradient(to right, var(--gradient-color), rgba(255, 255, 255, 0));
  content: "";
  height: 100%;
  position: absolute;
  width: var(--gradient-width);
  z-index: 2;
  pointer-events: none;
  touch-action: none;
}
.rfm-overlay::after {
  right: 0;
  top: 0;
  transform: rotateZ(180deg);
}
.rfm-overlay::before {
  left: 0;
  top: 0;
}

.rfm-marquee {
  flex: 0 0 auto;
  min-width: var(--min-width);
  z-index: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  animation: scroll var(--duration) linear var(--delay) var(--iteration-count);
  animation-play-state: var(--play);
  animation-delay: var(--delay);
  animation-direction: var(--direction);
}
@keyframes scroll {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-100%);
  }
}

.rfm-initial-child-container {
  flex: 0 0 auto;
  display: flex;
  min-width: auto;
  flex-direction: row;
  align-items: center;
}

.rfm-child {
  transform: var(--transform);
}`);const ue=a.forwardRef(function({style:r={},className:d="",autoFill:l=!1,play:n=!0,pauseOnHover:t=!1,pauseOnClick:i=!1,direction:o="left",speed:y=50,delay:z=0,loop:k=0,gradient:F=!1,gradientColor:q="white",gradientWidth:b=200,onFinish:T,onCycleComplete:W,onMount:P,children:w},$){const[I,U]=a.useState(0),[j,Z]=a.useState(0),[N,R]=a.useState(1),[M,G]=a.useState(!1),K=a.useRef(null),x=$||K,f=a.useRef(null),g=a.useCallback(()=>{if(f.current&&x.current){const c=x.current.getBoundingClientRect(),C=f.current.getBoundingClientRect();let h=c.width,u=C.width;(o==="up"||o==="down")&&(h=c.height,u=C.height),R(l&&h&&u&&u<h?Math.ceil(h/u):1),U(h),Z(u)}},[l,x,o]);a.useEffect(()=>{if(M&&(g(),f.current&&x.current)){const c=new ResizeObserver(()=>g());return c.observe(x.current),c.observe(f.current),()=>{c&&c.disconnect()}}},[g,x,M]),a.useEffect(()=>{g()},[g,w]),a.useEffect(()=>{G(!0)},[]),a.useEffect(()=>{typeof P=="function"&&P()},[]);const L=a.useMemo(()=>l?j*N/y:j<I?I/y:j/y,[l,I,j,N,y]),X=a.useMemo(()=>Object.assign(Object.assign({},r),{"--pause-on-hover":!n||t?"paused":"running","--pause-on-click":!n||t&&!i||i?"paused":"running","--width":o==="up"||o==="down"?"100vh":"100%","--transform":o==="up"?"rotate(-90deg)":o==="down"?"rotate(90deg)":"none"}),[r,n,t,i,o]),Y=a.useMemo(()=>({"--gradient-color":q,"--gradient-width":typeof b=="number"?`${b}px`:b}),[q,b]),_=a.useMemo(()=>({"--play":n?"running":"paused","--direction":o==="left"?"normal":"reverse","--duration":`${L}s`,"--delay":`${z}s`,"--iteration-count":k?`${k}`:"infinite","--min-width":l?"auto":"100%"}),[n,o,L,z,k,l]),A=a.useMemo(()=>({"--transform":o==="up"?"rotate(90deg)":o==="down"?"rotate(-90deg)":"none"}),[o]),O=a.useCallback(c=>[...Array(Number.isFinite(c)&&c>=0?c:0)].map((C,h)=>m.default.createElement(a.Fragment,{key:h},a.Children.map(w,u=>m.default.createElement("div",{style:A,className:"rfm-child"},u)))),[A,w]);return M?m.default.createElement("div",{ref:x,style:X,className:"rfm-marquee-container "+d},F&&m.default.createElement("div",{style:Y,className:"rfm-overlay"}),m.default.createElement("div",{className:"rfm-marquee",style:_,onAnimationIteration:W,onAnimationEnd:T},m.default.createElement("div",{className:"rfm-initial-child-container",ref:f},a.Children.map(w,c=>m.default.createElement("div",{style:A,className:"rfm-child"},c))),O(N-1)),m.default.createElement("div",{className:"rfm-marquee",style:_},O(N))):null});var V=B.default=ue;const pe=768,fe=[{name:"Flux",icon:"/icons/flux.png"},{name:"Ideogram",icon:"/icons/ideogram.png"},{name:"Minimax",icon:"/icons/minimax.png"},{name:"Wan",icon:"/icons/wan.png"},{name:"Google Veo",icon:"/icons/google.png"}],ge=[{name:"Luma",icon:"/icons/luma.png"},{name:"Recraft",icon:"/icons/recraft.png"},{name:"Kling",icon:"/icons/kling.png"},{name:"Hunyuan",icon:"/icons/hunyuan.png"},{name:"Pixverser",icon:"/icons/pixverser.png"},{name:"Hailuo",icon:"/icons/hailuo.png"}],ve=()=>{const s=v.useRef(null),[r,d]=v.useState(!1);v.useEffect(()=>{const t=()=>{d(window.innerWidth<pe)};return t(),window.addEventListener("resize",t),s.current&&(s.current.playbackRate=.75),()=>window.removeEventListener("resize",t)},[]);const l={desktop:{webm:"/videos/hero-background.webm",mp4:"/videos/hero-background.mp4"},mobile:{webm:"/videos/hero-background-mobile.webm",mp4:"/videos/hero-background-mobile.mp4"}},n=r?l.mobile:l.desktop;return e.jsxs("section",{className:"relative min-h-screen flex items-center overflow-hidden pt-20",children:[e.jsxs("div",{className:"absolute inset-0 z-0",children:[e.jsx("div",{className:"absolute inset-0 bg-dark-500/60 z-10"}),e.jsxs("video",{ref:s,autoPlay:!0,muted:!0,loop:!0,playsInline:!0,className:"object-cover w-full h-full opacity-50",poster:"/videos/hero-poster.webp",children:[e.jsx("source",{src:n.webm,type:"video/webm"}),e.jsx("source",{src:n.mp4,type:"video/mp4"}),"Your browser does not support the video tag."]},r?"mobile-video":"desktop-video")]}),e.jsx("div",{className:"absolute inset-0 hero-gradient z-10"}),e.jsx("div",{className:"container mx-auto px-4 md:px-6 relative z-20",children:e.jsxs("div",{className:"flex flex-col items-center text-center max-w-4xl mx-auto",children:[e.jsxs("div",{className:"space-y-6",children:[e.jsx("div",{className:"inline-block px-3 py-1 rounded-full bg-dark-200/80 backdrop-blur-sm border border-cyan/20 text-sm animate-in stagger-1",children:e.jsx("span",{className:"text-gray-300",children:"AI Models & Tools"})}),e.jsxs("h1",{className:"text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight animate-in stagger-2",children:[e.jsx("span",{className:"block",children:"All AI Tools"}),e.jsx("span",{className:"glow-text text-glow mt-2 block",children:"In One Platform"})]}),e.jsx("p",{className:"text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto animate-in stagger-3",children:"Create AI images, videos, and more using Multiple AI models."})]}),e.jsx("div",{className:"w-full max-w-6xl mx-auto my-12 animate-in stagger-4",children:e.jsxs("div",{className:"flex items-center justify-center marquee-container-mobile",children:[e.jsx("div",{className:"w-1/2",children:e.jsx(V,{gradient:!1,speed:30,direction:"right",pauseOnHover:!0,children:fe.map((t,i)=>e.jsx("div",{className:"mx-4 flex-shrink-0",children:e.jsx("div",{className:"glass-panel p-3 rounded-xl flex items-center justify-center border border-white/5",children:e.jsx("img",{src:t.icon,alt:`${t.name} logo`,className:"h-10 w-10 object-contain"})})},i))})}),e.jsx("div",{className:"px-4 md:px-8 flex-shrink-0",children:e.jsx("div",{className:"glass-panel p-4 rounded-2xl border border-white/10 shadow-lg animate-pulse-glow-zoom",children:e.jsx("img",{src:"/logo.png",alt:"Sharky AI logo",className:"h-16 w-16 object-contain"})})}),e.jsx("div",{className:"w-1/2",children:e.jsx(V,{gradient:!1,speed:30,direction:"left",pauseOnHover:!0,children:ge.map((t,i)=>e.jsx("div",{className:"mx-4 flex-shrink-0",children:e.jsx("div",{className:"glass-panel p-3 rounded-xl flex items-center justify-center border border-white/5",children:e.jsx("img",{src:t.icon,alt:`${t.name} logo`,className:"h-10 w-10 object-contain"})})},i))})})]})}),e.jsxs("div",{className:"flex flex-col sm:flex-row gap-4 justify-center animate-in stagger-5",children:[e.jsx(E,{className:"bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-dark-500 font-medium btn-glow px-8 py-6 text-lg",asChild:!0,children:e.jsxs(S,{to:"https://forms.gle/xYmKPZR2ZDpywKuz8",children:["Notify Me",e.jsx(J,{className:"ml-2 h-5 w-5"})]})}),e.jsx(E,{variant:"outline",className:"border-cyan/30 hover:border-cyan/60 text-gray-100 px-8 py-6 text-lg hover-glow hidden sm:inline-flex",asChild:!0,children:e.jsx(S,{to:"",children:"Coming Soon"})})]}),e.jsx("div",{className:"mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl animate-in stagger-6",children:[{icon:ae,title:"Image Generation",desc:"Create photorealistic images with just text prompts"},{icon:se,title:"Video Generation",desc:"Transform images into fluid, natural videos"},{icon:ce,title:"Voice Cloning",desc:"Clone any voice with just seconds of audio"},{icon:H,title:"More",desc:"Find even more AI tools for your projects"}].map((t,i)=>e.jsxs("div",{className:"glass-panel p-6 rounded-xl flex flex-col items-center text-center border border-white/5 hover-scale",children:[e.jsx("div",{className:"glass-icon rounded-full mb-4",children:e.jsx(t.icon,{className:"h-6 w-6 text-cyan-light"})}),e.jsx("h3",{className:"text-lg font-semibold mb-2",children:t.title}),e.jsx("p",{className:"text-gray-400 text-sm",children:t.desc})]},i))})]})}),e.jsx("div",{className:"absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-dark-500 to-transparent z-20"})]})},ye=({title:s,description:r,icon:d,className:l,glowPosition:n="top-right"})=>{const t={"top-left":"top-0 left-0 -translate-x-1/2 -translate-y-1/2","top-right":"top-0 right-0 translate-x-1/2 -translate-y-1/2","bottom-left":"bottom-0 left-0 -translate-x-1/2 translate-y-1/2","bottom-right":"bottom-0 right-0 translate-x-1/2 translate-y-1/2"};return e.jsxs("div",{className:D("relative overflow-hidden glass-panel p-6 rounded-xl border border-white/10 hover-scale",l),children:[e.jsx("div",{className:"absolute inset-0 hero-gradient z-10"}),e.jsx("div",{className:D("absolute w-40 h-40 bg-cyan/10 rounded-full blur-3xl opacity-50",t[n])}),e.jsxs("div",{className:"relative z-10 flex flex-col h-full",children:[e.jsx("div",{className:"glass-icon w-14 h-14 rounded-lg flex items-center justify-center mb-5",children:e.jsx(d,{className:"h-7 w-7 text-cyan"})}),e.jsx("h3",{className:"text-xl font-semibold mb-3",children:s}),e.jsx("p",{className:"text-gray-400 flex-grow",children:r})]})]})},je=()=>{v.useEffect(()=>{const n=new IntersectionObserver(i=>{i.forEach(o=>{o.isIntersecting&&o.target.classList.add("animate-fadeIn")})},{threshold:.1}),t=document.querySelectorAll(".reveal");return t.forEach(i=>n.observe(i)),()=>{t.forEach(i=>n.unobserve(i))}},[]);const s="Deepshark AI: All in one AI Platform",r="Explore AI with Deepshark AI. Access powerful open & closed source models for AI image generation, video creation, and voice synthesis. Pay-per-use, privacy-first, and cross-platform.",d="https://deepsharkai.art/",l="https://deepsharkai.art/og-image.png";return e.jsxs("div",{className:"min-h-screen bg-dark-500 text-white overflow-x-hidden",children:[e.jsxs(Q,{children:[e.jsx("title",{children:s}),e.jsx("meta",{name:"description",content:r}),e.jsx("link",{rel:"canonical",href:d}),e.jsx("meta",{property:"og:type",content:"website"}),e.jsx("meta",{property:"og:url",content:d}),e.jsx("meta",{property:"og:title",content:s}),e.jsx("meta",{property:"og:description",content:r}),e.jsx("meta",{property:"og:image",content:l}),e.jsx("meta",{name:"twitter:card",content:"summary_large_image"}),e.jsx("meta",{name:"twitter:url",content:d}),e.jsx("meta",{name:"twitter:title",content:s}),e.jsx("meta",{name:"twitter:description",content:r}),e.jsx("meta",{name:"twitter:image",content:l}),e.jsx("script",{type:"application/ld+json",children:JSON.stringify({"@context":"https://schema.org","@type":"Organization",name:"Deepshark AI",url:"https://sharkyai.xyz",logo:"https://deepsharkai.art/logo.png",description:r,contactPoint:{"@type":"ContactPoint",contactType:"customer support",url:"https://deepsharkai.art/contact"}})})]}),e.jsx(ee,{}),e.jsx(ve,{}),e.jsxs("section",{id:"features",className:"py-20 md:py-24 relative",children:[e.jsx("div",{className:"absolute top-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-cyan/20 to-transparent"}),e.jsx("div",{className:"absolute top-40 left-20 w-72 h-72 bg-cyan/5 rounded-full blur-3xl pointer-events-none"}),e.jsxs("div",{className:"container mx-auto px-4 md:px-6 relative z-10",children:[e.jsxs("div",{className:"text-center max-w-3xl mx-auto mb-12 md:mb-16 reveal",children:[e.jsxs("h2",{className:"text-3xl md:text-4xl font-bold mb-4 md:mb-6",children:["Powered by ",e.jsx("span",{className:"glow-text",children:"Open & Closed Source"})," ","Innovation"]}),e.jsx("p",{className:"text-lg text-gray-400",children:"We've integrated the most advanced open & Closed source AI models to give you unparalleled creative freedom without restrictions or hidden costs."})]}),e.jsx("div",{className:"grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 md:mb-20 reveal",children:[{icon:H,title:"Simple Interface",description:"Experience AI models with Simple UI/UX, WIth  a wider range of AI  Models.",glowPosition:"top-right"},{icon:le,title:"Privacy-First",description:"No data collection, no tracking. Your creations remain 100% private.",glowPosition:"top-left"},{icon:oe,title:"Latest AI Models",description:"Access a curated selection of powerful, up-to-date open & closed source models.",glowPosition:"bottom-right"},{icon:re,title:"Pay Per Use",description:"Flexible coin-based system. No subscriptions, only pay for the compute you consume.",glowPosition:"bottom-left"}].map((n,t)=>e.jsx(ye,{icon:n.icon,title:n.title,description:n.description,glowPosition:n.glowPosition},t))}),e.jsx("div",{className:"grid md:grid-cols-3 gap-8 reveal",children:[{icon:te,title:"Lightning Fast",description:"Optimized inference engines deliver results in seconds, not minutes."},{icon:de,title:"Cross Platform",description:"Access Deepshark AI seamlessly on Web, Android, and iOS. Create wherever you are."},{icon:me,title:"Full Control",description:"Fine-tune generation parameters to achieve your desired results."}].map((n,t)=>e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"glass-icon w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center",children:e.jsx(n.icon,{className:"h-6 w-6 text-cyan"})}),e.jsx("h3",{className:"text-xl font-medium mb-3",children:n.title}),e.jsx("p",{className:"text-gray-400",children:n.description})]},t))})]})]}),e.jsxs("section",{id:"access",className:"py-20 md:py-24 relative",children:[e.jsx("div",{className:"absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan/10 to-transparent"}),e.jsx("div",{className:"container mx-auto px-4 md:px-6 relative z-10",children:e.jsxs("div",{className:"max-w-4xl mx-auto text-center",children:[e.jsxs("h2",{className:"text-3xl md:text-4xl font-bold mb-6 reveal",children:["Access Deepshark AI ",e.jsx("span",{className:"glow-text",children:"Anywhere"})]}),e.jsx("p",{className:"text-lg md:text-xl text-gray-300 mb-8 md:mb-10 reveal",children:"Use Deepshark AI's powerful tools directly in your browser, or download our dedicated apps. Stay creative on the go."}),e.jsx("div",{className:"flex flex-wrap gap-4 justify-center reveal",children:e.jsx(E,{className:"bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-black font-medium btn-glow px-8 py-3 md:py-4 text-base md:text-lg",asChild:!0,children:e.jsxs(S,{to:"",children:[e.jsx(ie,{className:"ml-2 h-5 w-5"})," Comming Soon"]})})})]})})]}),e.jsx(ne,{})]})};export{je as default};

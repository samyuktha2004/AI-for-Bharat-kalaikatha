import{c as r,r as a,j as e,m as o,A as l}from"./index-CPjMm9W2.js";/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=[["path",{d:"M12 20h.01",key:"zekei9"}],["path",{d:"M8.5 16.429a5 5 0 0 1 7 0",key:"1bycff"}],["path",{d:"M5 12.859a10 10 0 0 1 5.17-2.69",key:"1dl1wf"}],["path",{d:"M19 12.859a10 10 0 0 0-2.007-1.523",key:"4k23kn"}],["path",{d:"M2 8.82a15 15 0 0 1 4.177-2.643",key:"1grhjp"}],["path",{d:"M22 8.82a15 15 0 0 0-11.288-3.764",key:"z3jwby"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]],u=r("wifi-off",y);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=[["path",{d:"M12 20h.01",key:"zekei9"}],["path",{d:"M2 8.82a15 15 0 0 1 20 0",key:"dnpr2z"}],["path",{d:"M5 12.859a10 10 0 0 1 14 0",key:"1x1e6c"}],["path",{d:"M8.5 16.429a5 5 0 0 1 7 0",key:"1bycff"}]],g=r("wifi",m);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=[["path",{d:"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",key:"cbrjhi"}]],b=r("wrench",k),f={};function p(){return navigator.onLine?!(f?.VITE_AZURE_OPENAI_ENDPOINT||f?.VITE_AZURE_VISION_ENDPOINT)?"demo":"online":"offline"}function N(){const[i,s]=a.useState(p()),[n,h]=a.useState(!1);a.useEffect(()=>{const c=()=>s(p()),d=()=>s("offline");return window.addEventListener("online",c),window.addEventListener("offline",d),()=>{window.removeEventListener("online",c),window.removeEventListener("offline",d)}},[]);const t={online:{icon:g,color:"bg-green-500 dark:bg-green-600",text:"Online",description:"All cloud features available"},offline:{icon:u,color:"bg-gray-500 dark:bg-gray-600",text:"Offline",description:"Using cached data"},demo:{icon:b,color:"bg-blue-500 dark:bg-blue-600",text:"Demo",description:"Using smart fallbacks"}}[i],x=t.icon;return e.jsxs("div",{className:"fixed top-2 right-2 z-50",children:[e.jsxs(o.button,{initial:{opacity:0,y:-10},animate:{opacity:1,y:0},onClick:()=>h(!n),className:`${t.color} text-white rounded-full shadow-lg backdrop-blur-sm
          transition-all duration-200 flex items-center gap-2
          ${n?"px-4 py-2":"p-2"}`,title:`${t.text} - Click for details`,children:[e.jsx(x,{className:"w-4 h-4"}),e.jsx(l,{children:n&&e.jsx(o.div,{initial:{width:0,opacity:0},animate:{width:"auto",opacity:1},exit:{width:0,opacity:0},className:"text-xs font-medium whitespace-nowrap overflow-hidden",children:t.text})})]}),e.jsx(l,{children:n&&e.jsxs(o.div,{initial:{opacity:0,y:-10,scale:.9},animate:{opacity:1,y:0,scale:1},exit:{opacity:0,y:-10,scale:.9},className:`absolute top-12 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl
              border border-gray-200 dark:border-gray-700 p-3 min-w-[200px]`,children:[e.jsx("p",{className:"text-xs text-gray-600 dark:text-gray-300 mb-2",children:t.description}),i==="demo"&&e.jsx("p",{className:"text-xs text-blue-600 dark:text-blue-400",children:"💡 Configure AWS/Azure for full features"}),i==="offline"&&e.jsx("p",{className:"text-xs text-gray-500 dark:text-gray-400",children:"📱 Limited functionality until back online"})]})})]})}export{N as C};

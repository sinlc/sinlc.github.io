import{u as S,e as m,r as o,A as x,j as n,b as T}from"./index-bWZrbSSw.js";import{B as j,D as C}from"./DbRenewReminder-C5xWekE4.js";import{e as f,T as k,a as v,P as w,b as R}from"./App-dCxs5CYi.js";import{S as y}from"./index-BETW-xoB.js";import{S as L}from"./StopRouteList-BsYN6yRU.js";import"./CircularProgress-DJGaeMVe.js";const M=({stopTab:r,onChangeTab:i})=>{const{t:c}=S(),p=m(),{db:{stopList:l},savedStops:u}=o.useContext(x);return u.length===0?n.jsxs(n.Fragment,{children:[n.jsx(f,{variant:"h6",children:c("未有收藏車站")}),n.jsx(f,{variant:"body1",children:c("請按下圖指示增加")})]}):n.jsx(k,{value:r,onChange:(t,a)=>i(a,!0),sx:B,variant:"scrollable",scrollButtons:!0,children:u.map(t=>t.split("|")).filter(([t,a])=>l[a]).map(([t,a])=>n.jsx(v,{label:l[a].name[p],value:`${t}|${a}`,disableRipple:!0},`stops-${a}`))})},B={background:r=>r.palette.background.default,minHeight:"36px","& .MuiTab-root":{alignItems:"center",justifyContent:"center",paddingTop:0,paddingBottom:0,minHeight:"32px"},"& .MuiTabs-flexContainer":{justifyContent:"flex-start"}},I=T.forwardRef(({stopTab:r,onChangeTab:i},c)=>{const{db:{stopList:p,stopMap:l},savedStops:u}=o.useContext(x),t=o.useRef(r);o.useImperativeHandle(c,()=>({changeTab:e=>{t.current=e}}));const a=o.useMemo(()=>u.filter(e=>e.split("|")[1]in p),[u,p]),d=o.useCallback(()=>{let e=a.indexOf(t.current);return e!==-1?e:-1},[a]),b=o.useMemo(()=>a.map(e=>{var g;if(e==="")return[];const s=[e.split("|")];return(g=l[s[0][1]])==null||g.forEach(h=>s.push(h)),s}),[a,l]);return n.jsx(y,{index:d(),onChangeIndex:e=>{i(a[e])},children:b.map((e,s)=>n.jsx(L,{stops:e,isFocus:d()===s},`savedStops-${s}`))})}),V=()=>{const{savedStops:r,db:{stopList:i},colorMode:c}=o.useContext(x),p=m(),l=o.useRef(null),u=o.useMemo(()=>{try{const e=localStorage.getItem("stopTab")??"|";if(e&&r.includes(e)&&i[e.split("|")[1]])return e;for(let s=0;s<r.length;++s){let g=r[s].split("|")[1];if(i[g])return r[s]}}catch(e){console.error(e)}return""},[r,i]),[t,a]=o.useState(u),d=o.useCallback(e=>t===""?"unset":e.palette.mode==="dark"?e.palette.background.default:"white",[t]);o.useEffect(()=>{localStorage.setItem("stopTab",t)},[t]);const b=o.useCallback(e=>{var s;a(e),(s=l.current)==null||s.changeTab(e)},[]);return n.jsxs(w,{sx:{...$,bgcolor:d,backgroundImage:t===""?`url(/img/stop-bookmark-guide-${c}-${p}.png)`:"unset",opacity:t===""?"0.8":"unset"},square:!0,elevation:0,children:[n.jsx(M,{stopTab:t,onChangeTab:b}),n.jsx(j,{}),n.jsx(C,{}),n.jsx(R,{sx:{flex:1,overflow:"scroll"},children:n.jsx(I,{ref:l,stopTab:t,onChangeTab:b})})]})},$={textAlign:"center",display:"flex",flexDirection:"column",overflow:"auto",width:"100%",flex:1,backgroundSize:"contain",backgroundPosition:"center",backgroundRepeat:"no-repeat"};export{V as default};
import{r as T,e as Z}from"./index.Wp2u197Z.js";const g={ASSETS_PREFIX:void 0,BASE_URL:"/8tme-blog",DEV:!1,MODE:"production",PROD:!0,SITE:"https://8tme.github.io",SSR:!1};let x=0;function _e(e,s){const n=`atom${++x}`,u={toString(){return(g?"production":void 0)!=="production"&&this.debugLabel?n+":"+this.debugLabel:n}};return typeof e=="function"?u.read=e:(u.init=e,u.read=m,u.write=ee),u}function m(e){return e(this)}function ee(e,s,n){return s(this,typeof n=="function"?n(e(this)):n)}const $=(e,s)=>e.unstable_is?e.unstable_is(s):s===e,L=e=>"init"in e,S=e=>!!e.write,O=new WeakMap,V=e=>{var s;return z(e)&&!((s=O.get(e))!=null&&s[1])},ne=(e,s)=>{const n=O.get(e);if(n)n[1]=!0,n[0].forEach(u=>u(s));else if((g?"production":void 0)!=="production")throw new Error("[Bug] cancelable promise not found")},te=e=>{if(O.has(e))return;const s=[new Set,!1];O.set(e,s);const n=()=>{s[1]=!0};e.then(n,n),e.onCancel=u=>{s[0].add(u)}},z=e=>typeof e?.then=="function",X=e=>"v"in e||"e"in e,F=e=>{if("e"in e)throw e.e;if((g?"production":void 0)!=="production"&&!("v"in e))throw new Error("[Bug] atom state is not initialized");return e.v},q=(e,s,n)=>{n.p.has(e)||(n.p.add(e),s.then(()=>{n.p.delete(e)},()=>{n.p.delete(e)}))},H=(e,s,n,u,a)=>{var b;if((g?"production":void 0)!=="production"&&u===s)throw new Error("[Bug] atom cannot depend on itself");n.d.set(u,a.n),V(n.v)&&q(s,n.v,a),(b=a.m)==null||b.t.add(s),e&&oe(e,u,s)},k=()=>[new Map,new Map,new Set],U=(e,s,n)=>{e[0].has(s)||e[0].set(s,new Set),e[1].set(s,n)},oe=(e,s,n)=>{const u=e[0].get(s);u&&u.add(n)},se=(e,s)=>e[0].get(s),N=(e,s)=>{e[2].add(s)},M=e=>{for(;e[1].size||e[2].size;){e[0].clear();const s=new Set(e[1].values());e[1].clear();const n=new Set(e[2]);e[2].clear(),s.forEach(u=>{var a;return(a=u.m)==null?void 0:a.l.forEach(b=>b())}),n.forEach(u=>u())}},G=(...[e,s,n,u])=>{let a;(g?"production":void 0)!=="production"&&(a=new Set);const b=(c,o,t)=>{const i="v"in o,r=o.v,d=V(o.v)?o.v:null;if(z(t)){te(t);for(const l of o.d.keys())q(c,t,e(l));o.v=t,delete o.e}else o.v=t,delete o.e;(!i||!Object.is(r,o.v))&&(++o.n,d&&ne(d,t))},p=(c,o,t)=>{var i;const r=e(o);if(X(r)&&(r.m&&!t?.has(o)||Array.from(r.d).every(([f,E])=>p(c,f,t).n===E)))return r;r.d.clear();let d=!0;const l=f=>{if($(o,f)){const _=e(f);if(!X(_))if(L(f))b(f,_,f.init);else throw new Error("no atom init");return F(_)}const E=p(c,f,t);if(d)H(c,o,r,f,E);else{const _=k();H(_,o,r,f,E),R(_,o,r),M(_)}return F(E)};let w,h;const P={get signal(){return w||(w=new AbortController),w.signal},get setSelf(){return(g?"production":void 0)!=="production"&&!S(o)&&console.warn("setSelf function cannot be used with read-only atom"),!h&&S(o)&&(h=(...f)=>{if((g?"production":void 0)!=="production"&&d&&console.warn("setSelf function cannot be called in sync"),!d)return W(o,...f)}),h}};try{const f=s(o,l,P);if(b(o,r,f),z(f)){(i=f.onCancel)==null||i.call(f,()=>w?.abort());const E=()=>{if(r.m){const _=k();R(_,o,r),M(_)}};f.then(E,E)}return r}catch(f){return delete r.v,r.e=f,++r.n,r}finally{d=!1}},D=c=>F(p(void 0,c)),y=(c,o,t)=>{var i,r;const d=new Map;for(const l of((i=t.m)==null?void 0:i.t)||[])d.set(l,e(l));for(const l of t.p)d.set(l,e(l));return(r=se(c,o))==null||r.forEach(l=>{d.set(l,e(l))}),d},v=(c,o,t)=>{const i=[],r=new Set,d=(w,h)=>{if(!r.has(w)){r.add(w);for(const[P,f]of y(c,w,h))w!==P&&d(P,f);i.push([w,h,h.n])}};d(o,t);const l=new Set([o]);for(let w=i.length-1;w>=0;--w){const[h,P,f]=i[w];let E=!1;for(const _ of P.d.keys())if(_!==h&&l.has(_)){E=!0;break}E&&(p(c,h,r),R(c,h,P),f!==P.n&&(U(c,h,P),l.add(h))),r.delete(h)}},A=(c,o,...t)=>n(o,l=>F(p(c,l)),(l,...w)=>{const h=e(l);let P;if($(o,l)){if(!L(l))throw new Error("atom not writable");const f="v"in h,E=h.v,_=w[0];b(l,h,_),R(c,l,h),(!f||!Object.is(E,h.v))&&(U(c,l,h),v(c,l,h))}else P=A(c,l,...w);return M(c),P},...t),W=(c,...o)=>{const t=k(),i=A(t,c,...o);return M(t),i},R=(c,o,t)=>{if(t.m&&!V(t.v)){for(const i of t.d.keys())t.m.d.has(i)||(I(c,i,e(i)).t.add(o),t.m.d.add(i));for(const i of t.m.d||[])if(!t.d.has(i)){t.m.d.delete(i);const r=j(c,i,e(i));r?.t.delete(o)}}},I=(c,o,t)=>{if(!t.m){p(c,o);for(const i of t.d.keys())I(c,i,e(i)).t.add(o);if(t.m={l:new Set,d:new Set(t.d.keys()),t:new Set},(g?"production":void 0)!=="production"&&a.add(o),S(o)){const i=t.m;N(c,()=>{const r=u(o,(...d)=>A(c,o,...d));r&&(i.u=r)})}}return t.m},j=(c,o,t)=>{if(t.m&&!t.m.l.size&&!Array.from(t.m.t).some(i=>{var r;return(r=e(i).m)==null?void 0:r.d.has(o)})){const i=t.m.u;i&&N(c,i),delete t.m,(g?"production":void 0)!=="production"&&a.delete(o);for(const r of t.d.keys()){const d=j(c,r,e(r));d?.t.delete(o)}return}return t.m},J={get:D,set:W,sub:(c,o)=>{const t=k(),i=e(c),r=I(t,c,i);M(t);const d=r.l;return d.add(o),()=>{d.delete(o);const l=k();j(l,c,i),M(l)}},unstable_derive:c=>G(...c(e,s,n,u))};return(g?"production":void 0)!=="production"&&Object.assign(J,{dev4_get_internal_weak_map:()=>({get:o=>{const t=e(o);if(t.n!==0)return t}}),dev4_get_mounted_atoms:()=>a,dev4_restore_atoms:o=>{const t=k();for(const[i,r]of o)if(L(i)){const d=e(i),l="v"in d,w=d.v;b(i,d,r),R(t,i,d),(!l||!Object.is(w,d.v))&&(U(t,i,d),v(t,i,d))}M(t)}}),J},re=()=>{const e=new WeakMap;return G(n=>{if((g?"production":void 0)!=="production"&&!n)throw new Error("Atom is undefined or null");let u=e.get(n);return u||(u={d:new Map,p:new Set,n:0},e.set(n,u)),u},(n,...u)=>n.read(...u),(n,...u)=>n.write(...u),(n,...u)=>{var a;return(a=n.onMount)==null?void 0:a.call(n,...u)})};let C;const ie=()=>(C||(C=re(),(g?"production":void 0)!=="production"&&(globalThis.__JOTAI_DEFAULT_STORE__||(globalThis.__JOTAI_DEFAULT_STORE__=C),globalThis.__JOTAI_DEFAULT_STORE__!==C&&console.warn("Detected multiple Jotai instances. It may cause unexpected behavior with the default store. https://github.com/pmndrs/jotai/discussions/2044"))),C),K={ASSETS_PREFIX:void 0,BASE_URL:"/8tme-blog",DEV:!1,MODE:"production",PROD:!0,SITE:"https://8tme.github.io",SSR:!1},ce=T.createContext(void 0),Q=e=>T.useContext(ce)||ie(),Y=e=>typeof e?.then=="function",ue=e=>{e.status="pending",e.then(s=>{e.status="fulfilled",e.value=s},s=>{e.status="rejected",e.reason=s})},de=Z.use||(e=>{if(e.status==="pending")throw e;if(e.status==="fulfilled")return e.value;throw e.status==="rejected"?e.reason:(ue(e),e)}),B=new WeakMap,le=e=>{let s=B.get(e);return s||(s=new Promise((n,u)=>{let a=e;const b=y=>v=>{a===y&&n(v)},p=y=>v=>{a===y&&u(v)},D=y=>{"onCancel"in y&&typeof y.onCancel=="function"&&y.onCancel(v=>{if((K?"production":void 0)!=="production"&&v===y)throw new Error("[Bug] p is not updated even after cancelation");Y(v)?(B.set(v,s),a=v,v.then(b(v),p(v)),D(v)):n(v)})};e.then(b(e),p(e)),D(e)}),B.set(e,s)),s};function fe(e,s){const n=Q(),[[u,a,b],p]=T.useReducer(v=>{const A=n.get(e);return Object.is(v[0],A)&&v[1]===n&&v[2]===e?v:[A,n,e]},void 0,()=>[n.get(e),n,e]);let D=u;if((a!==n||b!==e)&&(p(),D=n.get(e)),T.useEffect(()=>{const v=n.sub(e,()=>{p()});return p(),v},[n,e,void 0]),T.useDebugValue(D),Y(D)){const v=le(D);return de(v)}return D}function ve(e,s){const n=Q();return T.useCallback((...a)=>{if((K?"production":void 0)!=="production"&&!("write"in e))throw new Error("not writable atom");return n.set(e,...a)},[n,e])}function be(e,s){return[fe(e),ve(e)]}export{ve as a,_e as b,be as c,fe as u};

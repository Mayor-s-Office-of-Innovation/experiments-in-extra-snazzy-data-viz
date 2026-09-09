/**
 * Bundled by jsDelivr using Rollup v4.62.2 and esbuild v0.28.1.
 * Original file: /npm/@luma.gl/shadertools@9.4.0/dist/index.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
import{shaderTypeDecoder as ee,log as pi}from"./luma.gl-core@9.4.0-+esm.mjs";import{clamp as di,Matrix4 as te}from"./math.gl-core@4.1.0-+esm.mjs";const y="(?:var<\\s*(uniform|storage(?:\\s*,\\s*[A-Za-z_][A-Za-z0-9_]*)?)\\s*>|var)\\s+([A-Za-z_][A-Za-z0-9_]*)",T="\\s*",Z=[new RegExp(`@binding\\(\\s*(auto|\\d+)\\s*\\)${T}@group\\(\\s*(\\d+)\\s*\\)${T}${y}`,"g"),new RegExp(`@group\\(\\s*(\\d+)\\s*\\)${T}@binding\\(\\s*(auto|\\d+)\\s*\\)${T}${y}`,"g")],xe=[new RegExp(`@binding\\(\\s*(auto|\\d+)\\s*\\)${T}@group\\(\\s*(\\d+)\\s*\\)${T}${y}`,"g"),new RegExp(`@group\\(\\s*(\\d+)\\s*\\)${T}@binding\\(\\s*(auto|\\d+)\\s*\\)${T}${y}`,"g")],gi=[new RegExp(`@binding\\(\\s*(\\d+)\\s*\\)${T}@group\\(\\s*(\\d+)\\s*\\)${T}${y}`,"g"),new RegExp(`@group\\(\\s*(\\d+)\\s*\\)${T}@binding\\(\\s*(\\d+)\\s*\\)${T}${y}`,"g")],_i=[new RegExp(`@binding\\(\\s*(auto)\\s*\\)\\s*@group\\(\\s*(\\d+)\\s*\\)\\s*${y}`,"g"),new RegExp(`@group\\(\\s*(\\d+)\\s*\\)\\s*@binding\\(\\s*(auto)\\s*\\)\\s*${y}`,"g"),new RegExp(`@binding\\(\\s*(auto)\\s*\\)\\s*@group\\(\\s*(\\d+)\\s*\\)(?:[\\s\\n\\r]*@[A-Za-z_][^\\n\\r]*)*[\\s\\n\\r]*${y}`,"g"),new RegExp(`@group\\(\\s*(\\d+)\\s*\\)\\s*@binding\\(\\s*(auto)\\s*\\)(?:[\\s\\n\\r]*@[A-Za-z_][^\\n\\r]*)*[\\s\\n\\r]*${y}`,"g")];function ie(e){const t=e.split("");let i=0,n=0,r=!1,o=!1,a=!1;for(;i<e.length;){const s=e[i],l=e[i+1];if(o){a?a=!1:s==="\\"?a=!0:s==='"'&&(o=!1),i++;continue}if(r){s===`
`||s==="\r"?r=!1:t[i]=" ",i++;continue}if(n>0){if(s==="/"&&l==="*"){t[i]=" ",t[i+1]=" ",n++,i+=2;continue}if(s==="*"&&l==="/"){t[i]=" ",t[i+1]=" ",n--,i+=2;continue}s!==`
`&&s!=="\r"&&(t[i]=" "),i++;continue}if(s==='"'){o=!0,i++;continue}if(s==="/"&&l==="/"){t[i]=" ",t[i+1]=" ",r=!0,i+=2;continue}if(s==="/"&&l==="*"){t[i]=" ",t[i+1]=" ",n=1,i+=2;continue}i++}return t.join("")}function j(e,t){const i=ie(e),n=[];for(const r of t){r.lastIndex=0;let o;for(o=r.exec(i);o;){const a=r===t[0],s=o.index,l=o[0].length;n.push({match:e.slice(s,s+l),index:s,length:l,bindingToken:o[a?1:2],groupToken:o[a?2:1],accessDeclaration:o[3]?.trim(),name:o[4]}),o=r.exec(i)}}return n.sort((r,o)=>r.index-o.index)}function Qe(e,t,i){const n=j(e,t);if(!n.length)return e;let r="",o=0;for(const a of n)r+=e.slice(o,a.index),r+=i(a),o=a.index+a.length;return r+=e.slice(o),r}function et(e){return/@binding\(\s*auto\s*\)/.test(ie(e))}function mi(e,t){return j(e,t===Z||t===xe?_i:t).find(n=>n.bindingToken==="auto")}function Ie(e,t={}){const i=tt(e),n=hi(i);if(!n)return null;const r=vi(i,n);if(!r)return null;const o=Si(i,n,r);if(!o)return null;if(t.scanVertexAttributes===!1)return{attributes:[],bindings:o};const a=bi(i,n);if(!a)return null;const s=Ri(i,n,r,a,t.vertexEntryPoint);return s?{attributes:s,bindings:o}:null}function tt(e){const t=ie(e),i=/[A-Za-z_][A-Za-z0-9_]*|(?:0[xX][0-9A-Fa-f]+|\d+)|[@(){}<>\[\]:,;=]/g,n=[];let r=i.exec(t);for(;r;)n.push({value:r[0],index:r.index}),r=i.exec(t);return n}function hi(e){const t=[];let i=0;for(const n of e){if(n.value==="}"&&i===0)return null;t.push(i),n.value==="{"?i++:n.value==="}"&&i--}return i===0?t:null}function vi(e,t){const i=new Map;for(let n=0;n<e.length;n++){if(t[n]!==0||e[n].value!=="alias")continue;const r=e[n+1]?.value;if(!X(r)||e[n+2]?.value!=="="||i.has(r))return null;const o=rt(e,t,n+3,";");if(o<0||o===n+3)return null;i.set(r,re(e.slice(n+3,o))),n=o}return i}function bi(e,t){const i=new Map;for(let n=0;n<e.length;n++){if(t[n]!==0||e[n].value!=="struct")continue;const r=e[n+1]?.value,o=n+2;if(!X(r)||i.has(r)||e[o]?.value!=="{")return null;const a=Le(e,o,"{","}");if(a<0)return null;i.set(r,e.slice(o+1,a)),n=a}return i}function Si(e,t,i){const n=[],r=new Set,o=new Set;for(let a=0;a<e.length;a++){if(t[a]!==0||e[a].value!=="var")continue;const s=ot(e,t,a),l=e.slice(s,a),c=Ae(l,"group"),f=Ae(l,"binding");if(c===null||f===null||c===void 0!=(f===void 0))return null;if(c===void 0||f===void 0)continue;let p=a+1,d=[];if(e[p]?.value==="<"){const h=Le(e,p,"<",">");if(h<0)return null;const I=ne(e.slice(p+1,h),",");if(!I)return null;d=I.map(re),p=h+1}const u=e[p]?.value;if(!X(u)||e[p+1]?.value!==":")return null;const g=rt(e,t,p+2,";");if(g<0||g===p+2)return null;const m=Ce(re(e.slice(p+2,g)),i);if(!m)return null;const R=xi({name:u,group:c,location:f,addressSpace:d,resourceType:m}),E=`${c}:${f}`;if(!R||r.has(E)||o.has(u))return null;n.push(R),r.add(E),o.add(u),a=g}return Ai(n),n.sort((a,s)=>a.group-s.group||a.location-s.location||a.name.localeCompare(s.name))}function xi(e){const{name:t,group:i,location:n,addressSpace:r,resourceType:o}=e,a={name:t,group:i,location:n};if(r[0]==="uniform"&&r.length===1)return{...a,type:"uniform"};if(r[0]==="storage"&&r.length<=2){const s=r[1]||"read";return s==="read"?{...a,type:"read-only-storage"}:s==="read_write"?{...a,type:"storage"}:null}return r.length>0?null:o==="sampler"||o==="sampler_comparison"?{...a,type:"sampler",...o==="sampler_comparison"?{samplerType:"comparison"}:{}}:o==="texture_external"?{...a,type:"external-texture"}:Ii(a,o)||Ci(a,o)}function Ii(e,t){const i=/^texture_storage_(1d|2d|2d_array|3d)<([A-Za-z0-9_]+),(read|write|read_write)>$/.exec(t);if(!i)return null;const n={read:"read-only",write:"write-only",read_write:"read-write"}[i[3]];return{...e,type:"storage",format:i[2],access:n,viewDimension:Re(i[1])}}function Ci(e,t){const i=/^texture_(multisampled_)?(1d|2d|2d_array|cube|cube_array|3d)<(f32|i32|u32)>$/.exec(t);if(i){if(i[1]&&i[2]!=="2d")return null;const r={f32:"float",i32:"sint",u32:"uint"}[i[3]];return{...e,type:"texture",viewDimension:Re(i[2]),sampleType:r,multisampled:!!i[1]}}const n=/^texture_depth_(multisampled_)?(2d|2d_array|cube|cube_array)$/.exec(t);return!n||n[1]&&n[2]!=="2d"?null:{...e,type:"texture",viewDimension:Re(n[2]),sampleType:"depth",multisampled:!!n[1]}}function Ai(e){for(const t of e){if(t.type!=="sampler"||t.samplerType||!t.name.endsWith("Sampler"))continue;const i=t.name.slice(0,-7);e.find(r=>r.type==="texture"&&r.name===i&&r.group===t.group)?.sampleType==="depth"&&(t.samplerType="non-filtering")}}function Ri(e,t,i,n,r){const o=Li(e,t);if(!o)return null;const a=o.filter(u=>u.vertex),s=r?a.find(u=>u.name===r):a.length===1?a[0]:void 0;if(!s)return a.length===0&&!r?[]:null;const l=ne(s.parameters,",");if(!l)return null;const c=[],f=new Set,p=new Set,d=new Set;for(const u of l)if(u.length>0&&!it({declaration:u,aliases:i,structures:n,attributes:c,attributeLocations:f,attributeNames:p,visitedStructures:d}))return null;return c.sort((u,g)=>u.location-g.location||u.name.localeCompare(g.name))}function Li(e,t){const i=[],n=new Set;for(let r=0;r<e.length;r++){if(t[r]!==0||e[r].value!=="fn")continue;const o=e[r+1]?.value,a=r+2;if(!X(o)||n.has(o)||e[a]?.value!=="(")return null;const s=Le(e,a,"(",")");if(s<0)return null;const l=ot(e,t,r);i.push({name:o,vertex:nt(e.slice(l,r),"vertex"),parameters:e.slice(a+1,s)}),n.add(o),r=s}return i}function it(e){const{declaration:t,aliases:i,structures:n,attributes:r,attributeLocations:o,attributeNames:a,visitedStructures:s}=e,l=yi(t,":");if(l<1||l===t.length-1)return!1;const c=Ti(t.slice(0,l)),f=Ae(t.slice(0,l),"location"),p=nt(t.slice(0,l),"builtin"),d=Ce(re(t.slice(l+1)),i);if(!c||f===null||!d||f!==void 0&&p)return!1;if(f!==void 0){const m=Mi(d);return!m||o.has(f)||a.has(c)?!1:(r.push({name:c,location:f,type:m}),o.add(f),a.add(c),!0)}if(p)return!0;const u=n.get(d);if(!u||s.has(d))return!1;const g=ne(u,",");if(!g)return!1;s.add(d);for(const m of g)if(m.length>0&&!it({...e,declaration:m}))return!1;return s.delete(d),!0}function Ce(e,t,i=new Set){const n=tt(e);let r="";for(const o of n){const a=t.get(o.value);if(!a){r+=Ei(o.value);continue}if(i.has(o.value))return null;const s=new Set(i);s.add(o.value);const l=Ce(a,t,s);if(!l)return null;r+=l}return r}function Ei(e){const t=/^(vec[234]|mat[234]x[234])([fiuh])$/.exec(e);if(!t)return e;const i={f:"f32",i:"i32",u:"u32",h:"f16"}[t[2]];return`${t[1]}<${i}>`}function Mi(e){return/^(?:i32|u32|f32|f16|vec[234]<(?:i32|u32|f32|f16)>)$/.test(e)?e:null}function Ae(e,t){let i;for(let n=0;n<e.length;n++)if(!(e[n].value!=="@"||e[n+1]?.value!==t)){if(i!==void 0||e[n+2]?.value!=="("||!/^\d+$/.test(e[n+3]?.value||"")||e[n+4]?.value!==")")return null;i=Number(e[n+3].value)}return i}function nt(e,t){return e.some((i,n)=>i.value==="@"&&e[n+1]?.value===t)}function Re(e){return e.replace("_","-")}function Le(e,t,i,n){let r=0;for(let o=t;o<e.length;o++)if(e[o].value===i)r++;else if(e[o].value===n&&--r===0)return o;return-1}function ne(e,t){const i=[];let n=0;const r={"(":0,"<":0,"[":0,"{":0},o=Object.keys(r),a={")":"(",">":"<","]":"[","}":"{"};for(let s=0;s<e.length;s++){const l=e[s].value;if(l===t&&o.every(c=>r[c]===0)){i.push(e.slice(n,s)),n=s+1;continue}if(l in r)r[l]++;else if(l in a){const c=a[l];if(r[c]--,r[c]<0)return null}}return o.every(s=>r[s]===0)?(i.push(e.slice(n)),i):null}function yi(e,t){const i=ne(e,t);return i&&i.length===2?i[0].length:-1}function rt(e,t,i,n){for(let r=i;r<e.length;r++)if(t[r]===0&&e[r].value===n)return r;return-1}function ot(e,t,i){for(let n=i-1;n>=0;n--)if(e[n].value===";"&&t[n]===0||e[n].value==="}"&&t[n]===1)return n+1;return 0}function Ti(e){for(let t=e.length-1;t>=0;t--)if(X(e[t].value))return e[t].value;return null}function re(e){return e.map(t=>t.value).join("")}function X(e){return!!(e&&/^[A-Za-z_][A-Za-z0-9_]*$/.test(e))}function F(e,t){if(!e){const i=new Error(t||"shadertools: assertion failed.");throw Error.captureStackTrace?.(i,F),i}}const Ee={number:{type:"number",validate(e,t){return Number.isFinite(e)&&typeof t=="object"&&(t.max===void 0||e<=t.max)&&(t.min===void 0||e>=t.min)}},array:{type:"array",validate(e,t){return Array.isArray(e)||ArrayBuffer.isView(e)}}};function wi(e){const t={};for(const[i,n]of Object.entries(e))t[i]=Ni(n);return t}function Pi(e,t,i){const n={};for(const[r,o]of Object.entries(t))e&&r in e&&!o.private?(o.validate&&F(o.validate(e[r],o),`${i}: invalid ${r}`),n[r]=e[r]):n[r]=o.value;return n}function Ni(e){let t=at(e);if(t!=="object")return{value:e,...Ee[t],type:t};if(typeof e=="object")return e?e.type!==void 0?{...e,...Ee[e.type],type:e.type}:e.value===void 0?{type:"object",value:e}:(t=at(e.value),{...e,...Ee[t],type:t}):{type:"object",value:null};throw new Error("props")}function at(e){return Array.isArray(e)||ArrayBuffer.isView(e)?"array":typeof e}const Bi=`#ifdef MODULE_LOGDEPTH
  logdepth_adjustPosition(gl_Position);
#endif
`,Ui=`#ifdef MODULE_MATERIAL
  fragColor = material_filterColor(fragColor);
#endif

#ifdef MODULE_LIGHTING
  fragColor = lighting_filterColor(fragColor);
#endif

#ifdef MODULE_FOG
  fragColor = fog_filterColor(fragColor);
#endif

#ifdef MODULE_PICKING
  fragColor = picking_filterHighlightColor(fragColor);
  fragColor = picking_filterPickingColor(fragColor);
#endif

#ifdef MODULE_LOGDEPTH
  logdepth_setFragDepth();
#endif
`,Oi={vertex:Bi,fragment:Ui},st=/void\s+main\s*\([^)]*\)\s*\{\n?/,lt=/}\n?[^{}]*$/,Me=[],oe="__LUMA_INJECT_DECLARATIONS__";function Fi(e){const t={vertex:{},fragment:{}};for(const i in e){let n=e[i];const r=Di(i);typeof n=="string"&&(n={order:0,injection:n}),t[r][i]=n}return t}function Di(e){const t=e.slice(0,2);switch(t){case"vs":return"vertex";case"fs":return"fragment";default:throw new Error(t)}}function ae(e,t,i,n=!1,r="glsl",o={}){const a=t==="vertex";for(const s in i){const l=i[s];l.sort((f,p)=>f.order-p.order),Me.length=l.length;for(let f=0,p=l.length;f<p;++f)Me[f]=l[f].injection;const c=`${Me.join(`
`)}
`;switch(s){case"vs:#decl":(r==="wgsl"||a)&&(e=e.replace(oe,c));break;case"vs:#main-start":(r==="wgsl"||a)&&(e=r==="wgsl"?se(e,"vertex",c,"start",o.vertex):e.replace(st,f=>f+c));break;case"vs:#main-end":(r==="wgsl"||a)&&(e=r==="wgsl"?se(e,"vertex",c,"end",o.vertex):e.replace(lt,f=>c+f));break;case"fs:#decl":(r==="wgsl"||!a)&&(e=e.replace(oe,c));break;case"fs:#main-start":(r==="wgsl"||!a)&&(e=r==="wgsl"?se(e,"fragment",c,"start",o.fragment):e.replace(st,f=>f+c));break;case"fs:#main-end":(r==="wgsl"||!a)&&(e=r==="wgsl"?se(e,"fragment",c,"end",o.fragment):e.replace(lt,f=>c+f));break;default:e=e.replace(s,f=>f+c)}}return e=e.replace(oe,""),n&&(e=e.replace(/\}\s*$/,s=>s+Oi[t])),e}function Vi(e){const t={};return F(Array.isArray(e)&&e.length>1),e.forEach(i=>{for(const n in i)t[n]=t[n]?`${t[n]}
${i[n]}`:i[n]}),t}function se(e,t,i,n,r){const o=Gi(e,t,r);if(!o)return e;if(n==="start"){const a=o.openBraceIndex+1;return`${e.slice(0,a)}
${i}${e.slice(a)}`}return`${e.slice(0,o.closeBraceIndex)}${i}${e.slice(o.closeBraceIndex)}`}function Gi(e,t,i){const n=t==="vertex"?"@vertex":"@fragment",r=e.indexOf(n);if(r<0)return null;const o=i?e.search(new RegExp(`\\bfn\\s+${ki(i)}\\s*\\(`)):e.indexOf("fn",r);if(o<0)return null;const a=e.indexOf("{",o);if(a<0)return null;let s=0;for(let l=a;l<e.length;l++){const c=e[l];if(c==="{")s++;else if(c==="}"&&(s--,s===0))return{openBraceIndex:a,closeBraceIndex:l}}return null}function ki(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function V(e){e.map(t=>ye(t))}function ye(e){if(e.instance)return;V(e.dependencies||[]);const{propTypes:t={},deprecations:i=[],inject:n={}}=e,r={normalizedInjections:Fi(n),parsedDeprecations:Hi(i)};t&&(r.propValidators=wi(t)),e.instance=r;let o={};t&&(o=Object.entries(t).reduce((a,[s,l])=>{const c=l?.value;return c&&(a[s]=c),a},{})),e.defaultUniforms={...e.defaultUniforms,...o}}function zi(e,t,i){ye(e);const n=i||{...e.defaultUniforms};return t&&e.getUniforms?e.getUniforms(t,n):Pi(t,e.instance?.propValidators,e.name)}function Te(e,t,i){e.deprecations?.forEach(n=>{n.regex?.test(t)&&(n.deprecated?i.deprecated(n.old,n.new)():i.removed(n.old,n.new)())})}function Hi(e){return e.forEach(t=>{t.type==="function"?t.regex=new RegExp(`\\b${t.old}\\(`):t.regex=new RegExp(`${t.type} ${t.old};`)}),e}function we(e){V(e);const t={},i={};le({modules:e,level:0,moduleMap:t,moduleDepth:i});const n=Object.keys(i).sort((r,o)=>i[o]-i[r]).map(r=>t[r]);return V(n),n}function le(e){const{modules:t,level:i,moduleMap:n,moduleDepth:r}=e;if(i>=5)throw new Error("Possible loop in shader dependency graph");for(const o of t)n[o.name]=o,(r[o.name]===void 0||r[o.name]<i)&&(r[o.name]=i);for(const o of t)o.dependencies&&le({modules:o.dependencies,level:i+1,moduleMap:n,moduleDepth:r})}function $i(e){V(e);const t={},i={};return le({modules:e,level:0,moduleMap:t,moduleDepth:i}),e=Object.keys(i).sort((n,r)=>i[r]-i[n]).map(n=>t[n]),V(e),e}function ji(e){return $i(e)}const qi=/^(vs|fs):(?:#(?:decl|main-start|main-end)|[A-Za-z_][\w-]*)$/;function Wi(e=[],t){const i=[],n={},r={},o={},a={};for(const s of e)ct({modules:i,defines:n,injections:r,vertexInputs:o,varyings:a},s),ct({modules:i,defines:n,injections:r,vertexInputs:o,varyings:a},s[t]);for(const s of Object.keys(a))if(o[s])throw new Error(`ShaderPlugin name "${s}" cannot be both a vertex input and a varying`);return{modules:i,defines:n,injections:r,vertexInputs:o,varyings:a}}function Ki(e=[],t=[]){const i=[...e],n=new Set(i.map(r=>r.name));for(const r of t)n.has(r.name)||(i.push(r),n.add(r.name));return i}function ct(e,t){if(t){t.modules?.length&&e.modules.push(...t.modules),t.defines&&Object.assign(e.defines,t.defines);for(const[i,n]of Object.entries(t.vertexInputs||{})){ft(i,"vertex input");const r=e.vertexInputs[i];if(r&&r!==n)throw new Error(`ShaderPlugin vertex input "${i}" has conflicting types "${r}" and "${n}"`);e.vertexInputs[i]=n}for(const[i,n]of Object.entries(t.varyings||{})){ft(i,"varying");const r=Zi(i,n),o=e.varyings[i];if(o&&(o.type!==r.type||o.interpolation!==r.interpolation))throw new Error(`ShaderPlugin varying "${i}" has conflicting declarations "${o.type}/${o.interpolation}" and "${r.type}/${r.interpolation}"`);e.varyings[i]=r}for(const i of t.injections||[])Xi(i.target),e.injections[i.target]||(e.injections[i.target]=[]),e.injections[i.target].push({injection:i.injection,order:i.order??0})}}function ft(e,t){if(!/^[A-Za-z_][A-Za-z0-9_]*$/.test(e)||e.startsWith("_luma_"))throw new Error(`ShaderPlugin ${t} "${e}" must be a valid non-reserved identifier`)}function Zi(e,t){const{primitiveType:i}=ee.getAttributeShaderTypeInfo(t.type),n=i==="i32"||i==="u32",r=t.interpolation||(n?"flat":"smooth");if(n&&r==="smooth")throw new Error(`ShaderPlugin integer varying "${e}" must use flat interpolation`);return{type:t.type,interpolation:r}}function Xi(e){if(!qi.test(e))throw new Error(`ShaderPlugin injection target "${e}" must be a named shader anchor or hook`)}const Yi=/^(?:uniform\s+)?(?:(?:lowp|mediump|highp)\s+)?[A-Za-z0-9_]+(?:<[^>]+>)?\s+([A-Za-z0-9_]+)(?:\s*\[[^\]]+\])?\s*;/,Ji=/((?:layout\s*\([^)]*\)\s*)*)uniform\s+([A-Za-z_][A-Za-z0-9_]*)\s*\{([\s\S]*?)\}\s*([A-Za-z_][A-Za-z0-9_]*)?\s*;/g;function Pe(e){return`${e.name}Uniforms`}function ut(e,t){const i=t==="wgsl"?e.source:t==="vertex"?e.vs:e.fs;if(!i)return null;const n=Pe(e);return Qi(i,t==="wgsl"?"wgsl":"glsl",n)}function pt(e,t){const i=Object.keys(e.uniformTypes||{});if(!i.length)return null;const n=ut(e,t);return n?{moduleName:e.name,uniformBlockName:Pe(e),stage:t,expectedUniformNames:i,actualUniformNames:n,matches:nn(i,n)}:null}function dt(e,t,i={}){const n=pt(e,t);if(!n||n.matches)return n;const r=rn(n);return i.log?.error?.(r,n)(),i.throwOnError!==!1&&F(!1,r),n}function Ne(e){const t=[],i=on(e);for(const n of i.matchAll(Ji)){const r=n[1]?.trim()||null;t.push({blockName:n[2],body:n[3],instanceName:n[4]||null,layoutQualifier:r,hasLayoutQualifier:!!r,isStd140:!!(r&&/\blayout\s*\([^)]*\bstd140\b[^)]*\)/.exec(r))})}return t}function gt(e,t,i,n){const r=Ne(e).filter(a=>!a.isStd140),o=new Set;for(const a of r){if(o.has(a.blockName))continue;o.add(a.blockName);const s=n?.label?`${n.label} `:"",l=a.hasLayoutQualifier?`declares ${an(a.layoutQualifier)} instead of layout(std140)`:"does not declare layout(std140)",c=`${s}${t} shader uniform block ${a.blockName} ${l}. luma.gl host-side shader block packing assumes explicit layout(std140) for GLSL uniform blocks. Add \`layout(std140)\` to the block declaration.`;i?.warn?.(c,a)()}return r}function Qi(e,t,i){const n=t==="wgsl"?en(e,i):tn(e,i);if(!n)return null;const r=[];for(const o of n.split(`
`)){const a=o.replace(/\/\/.*$/,"").trim();if(!a||a.startsWith("#"))continue;const s=t==="wgsl"?a.match(/^([A-Za-z0-9_]+)\s*:/):a.match(Yi);s&&r.push(s[1])}return r}function en(e,t){const i=new RegExp(`\\bstruct\\s+${t}\\b`,"m").exec(e);if(!i)return null;const n=e.indexOf("{",i.index);if(n<0)return null;let r=0;for(let o=n;o<e.length;o++){const a=e[o];if(a==="{"){r++;continue}if(a==="}"&&(r--,r===0))return e.slice(n+1,o)}return null}function tn(e,t){return Ne(e).find(n=>n.blockName===t)?.body||null}function nn(e,t){if(e.length!==t.length)return!1;for(let i=0;i<e.length;i++)if(e[i]!==t[i])return!1;return!0}function rn(e){const{expectedUniformNames:t,actualUniformNames:i}=e,n=t.filter(s=>!i.includes(s)),r=i.filter(s=>!t.includes(s)),o=[`Expected ${t.length} fields, found ${i.length}.`],a=sn(t,i);return a&&o.push(a),n.length&&o.push(`Missing from shader block (${n.length}): ${_t(n)}.`),r.length&&o.push(`Unexpected in shader block (${r.length}): ${_t(r)}.`),t.length<=12&&i.length<=12&&(n.length||r.length)&&(o.push(`Expected: ${t.join(", ")}.`),o.push(`Actual: ${i.join(", ")}.`)),`${e.moduleName}: ${e.stage} shader uniform block ${e.uniformBlockName} does not match module.uniformTypes. ${o.join(" ")}`}function on(e){return e.replace(/\/\*[\s\S]*?\*\//g,"").replace(/\/\/.*$/gm,"")}function an(e){return e.replace(/\s+/g," ").trim()}function sn(e,t){const i=Math.min(e.length,t.length);for(let n=0;n<i;n++)if(e[n]!==t[n])return`First mismatch at field ${n+1}: expected ${e[n]}, found ${t[n]}.`;return e.length>t.length?`Shader block ends after field ${t.length}; expected next field ${e[t.length]}.`:t.length>e.length?`Shader block has extra field ${t.length}: ${t[e.length]}.`:null}function _t(e,t=8){if(e.length<=t)return e.join(", ");const i=e.length-t;return`${e.slice(0,t).join(", ")}, ... (${i} more)`}function ln(e){switch(e?.gpu.toLowerCase()){case"apple":return`#define APPLE_GPU
// Apple optimizes away the calculation necessary for emulated fp64
#define LUMA_FP64_CODE_ELIMINATION_WORKAROUND 1
#define LUMA_FP32_TAN_PRECISION_WORKAROUND 1
// Intel GPU doesn't have full 32 bits precision in same cases, causes overflow
#define LUMA_FP64_HIGH_BITS_OVERFLOW_WORKAROUND 1
`;case"nvidia":return`#define NVIDIA_GPU
// Nvidia optimizes away the calculation necessary for emulated fp64
#define LUMA_FP64_CODE_ELIMINATION_WORKAROUND 1
`;case"intel":return`#define INTEL_GPU
// Intel optimizes away the calculation necessary for emulated fp64
#define LUMA_FP64_CODE_ELIMINATION_WORKAROUND 1
// Intel's built-in 'tan' function doesn't have acceptable precision
#define LUMA_FP32_TAN_PRECISION_WORKAROUND 1
// Intel GPU doesn't have full 32 bits precision in same cases, causes overflow
#define LUMA_FP64_HIGH_BITS_OVERFLOW_WORKAROUND 1
`;case"amd":return`#define AMD_GPU
`;default:return`#define DEFAULT_GPU
// Prevent driver from optimizing away the calculation necessary for emulated fp64
#define LUMA_FP64_CODE_ELIMINATION_WORKAROUND 1
// Headless Chrome's software shader 'tan' function doesn't have acceptable precision
#define LUMA_FP32_TAN_PRECISION_WORKAROUND 1
// If the GPU doesn't have full 32 bits precision, will causes overflow
#define LUMA_FP64_HIGH_BITS_OVERFLOW_WORKAROUND 1
`}}function cn(e,t){if(Number(e.match(/^#version[ \t]+(\d+)/m)?.[1]||100)!==300)throw new Error("luma.gl v9 only supports GLSL 3.00 shader sources");switch(t){case"vertex":return e=ht(e,fn),e;case"fragment":return e=ht(e,un),e;default:throw new Error(t)}}const mt=[[/^(#version[ \t]+(100|300[ \t]+es))?[ \t]*\n/,`#version 300 es
`],[/\btexture(2D|2DProj|Cube)Lod(EXT)?\(/g,"textureLod("],[/\btexture(2D|2DProj|Cube)(EXT)?\(/g,"texture("]],fn=[...mt,[Be("attribute"),"in $1"],[Be("varying"),"out $1"]],un=[...mt,[Be("varying"),"in $1"]];function ht(e,t){for(const[i,n]of t)e=e.replace(i,n);return e}function Be(e){return new RegExp(`\\b${e}[ \\t]+(\\w+[ \\t]+\\w+(\\[\\w+\\])?;)`,"g")}function Ue(e,t,i="glsl"){let n="";for(const r in e){const o=e[r];if(n+=`${i==="wgsl"?"fn":"void"} ${o.signature} {
`,o.header&&(n+=`  ${o.header}`),t[r]){const s=t[r];s.sort((l,c)=>l.order-c.order);for(const l of s)n+=`  ${l.injection}
`}o.footer&&(n+=`  ${o.footer}`),n+=`}
`}return n}function vt(e){const t={vertex:{},fragment:{}};for(const i of e){let n,r;typeof i!="string"?(n=i,r=n.hook):(n={},r=i),r=r.trim();const o=r.indexOf(":"),a=r.slice(0,o),s=r.slice(o+1),l=r.replace(/\(.+/,""),c=Object.assign(n,{signature:s});switch(a){case"vs":t.vertex[l]=c;break;case"fs":t.fragment[l]=c;break;default:throw new Error(a)}}return t}function bt(e,t){return{name:pn(e,t),language:"glsl",version:dn(e)}}function pn(e,t="unnamed"){const n=/#define[^\S\r\n]*SHADER_NAME[^\S\r\n]*([A-Za-z0-9_-]+)\s*/.exec(e);return n?n[1]:t}function dn(e){let t=100;const i=e.match(/[^\s]+/g);if(i&&i.length>=2&&i[0]==="#version"){const n=parseInt(i[1],10);Number.isFinite(n)&&(t=n)}if(t!==100&&t!==300)throw new Error(`Invalid GLSL version ${t}`);return t}const St=[new RegExp(`@binding\\(\\s*(\\d+)\\s*\\)\\s*@group\\(\\s*(\\d+)\\s*\\)\\s*${y}\\s*:\\s*([^;]+);`,"g"),new RegExp(`@group\\(\\s*(\\d+)\\s*\\)\\s*@binding\\(\\s*(\\d+)\\s*\\)\\s*${y}\\s*:\\s*([^;]+);`,"g")];function xt(e,t=[]){const i=ie(e),n=new Map;for(const o of t)n.set(It(o.name,o.group,o.location),o.moduleName);const r=[];for(const o of St){o.lastIndex=0;let a;for(a=o.exec(i);a;){const s=o===St[0],l=Number(a[s?1:2]),c=Number(a[s?2:1]),f=a[3]?.trim(),p=a[4],d=a[5].trim(),u=n.get(It(p,c,l));r.push(gn({name:p,group:c,binding:l,owner:u?"module":"application",moduleName:u,accessDeclaration:f,resourceType:d})),a=o.exec(i)}}return r.sort((o,a)=>o.group!==a.group?o.group-a.group:o.binding!==a.binding?o.binding-a.binding:o.name.localeCompare(a.name))}function gn(e){const t={name:e.name,group:e.group,binding:e.binding,owner:e.owner,kind:"unknown",moduleName:e.moduleName,resourceType:e.resourceType};if(e.accessDeclaration){const i=e.accessDeclaration.split(",").map(n=>n.trim());if(i[0]==="uniform")return{...t,kind:"uniform",access:"uniform"};if(i[0]==="storage"){const n=i[1]||"read_write";return{...t,kind:n==="read"?"read-only-storage":"storage",access:n}}}return e.resourceType==="sampler"||e.resourceType==="sampler_comparison"?{...t,kind:"sampler",samplerKind:e.resourceType==="sampler_comparison"?"comparison":"filtering"}:e.resourceType.startsWith("texture_storage_")?{...t,kind:"storage-texture",access:mn(e.resourceType),viewDimension:Ct(e.resourceType)}:e.resourceType.startsWith("texture_")?{...t,kind:"texture",viewDimension:Ct(e.resourceType),sampleType:_n(e.resourceType),multisampled:e.resourceType.startsWith("texture_multisampled_")}:t}function It(e,t,i){return`${t}:${i}:${e}`}function Ct(e){if(e.includes("cube_array"))return"cube-array";if(e.includes("2d_array"))return"2d-array";if(e.includes("cube"))return"cube";if(e.includes("3d"))return"3d";if(e.includes("2d"))return"2d";if(e.includes("1d"))return"1d"}function _n(e){if(e.startsWith("texture_depth_"))return"depth";if(e.includes("<i32>"))return"sint";if(e.includes("<u32>"))return"uint";if(e.includes("<f32>"))return"float"}function mn(e){return/,\s*([A-Za-z_][A-Za-z0-9_]*)\s*>$/.exec(e)?.[1]}const G="([a-zA-Z_][a-zA-Z0-9_]*)",hn=/^\s*\#\s*if\s+(.+?)\s*(?:\/\/.*)?$/,vn=new RegExp(`^\\s*\\#\\s*ifdef\\s*${G}\\s*$`),bn=new RegExp(`^\\s*\\#\\s*ifndef\\s*${G}\\s*(?:\\/\\/.*)?$`),Sn=/^\s*\#\s*else\s*(?:\/\/.*)?$/,xn=/^\s*\#\s*endif\s*$/,In=new RegExp(`^\\s*\\#\\s*ifdef\\s*${G}\\s*(?:\\/\\/.*)?$`),Cn=/^\s*\#\s*endif\s*(?:\/\/.*)?$/;function q(e,t){const i=e.split(`
`),n=[],r=[];let o=!0;for(const a of i){const s=a.match(hn),l=a.match(In)||a.match(vn),c=a.match(bn),f=a.match(Sn),p=a.match(Cn)||a.match(xn);if(s){const d=An(s[1],t?.defines||{}),u=o&&d;r.push({parentActive:o,branchTaken:d,active:u}),o=u}else if(l||c){const d=(l||c)?.[1],u=!!t?.defines?.[d],g=l?u:!u,m=o&&g;r.push({parentActive:o,branchTaken:g,active:m}),o=m}else if(f){const d=r[r.length-1];if(!d)throw new Error("Encountered #else without matching #if, #ifdef or #ifndef");d.active=d.parentActive&&!d.branchTaken,d.branchTaken=!0,o=d.active}else p?(r.pop(),o=r.length?r[r.length-1].active:!0):o&&n.push(a)}if(r.length>0)throw new Error("Unterminated conditional block in shader source");return n.join(`
`)}function An(e,t){const i=e.trim();if(/^[+-]?\d+(?:\.\d+)?$/.test(i))return Number(i)!==0;if(i==="true")return!0;if(i==="false")return!1;const n=i.match(new RegExp(`^!\\s*${G}$`));if(n)return!t[n[1]];const r=i.match(new RegExp(`^${G}$`));if(r)return!!t[r[1]];const o=i.match(new RegExp(`^defined\\s*\\(\\s*${G}\\s*\\)$`));if(o)return t[o[1]]!==void 0;const a=i.match(new RegExp(`^!\\s*defined\\s*\\(\\s*${G}\\s*\\)$`));if(a)return t[a[1]]===void 0;throw new Error(`Unsupported #if expression "${e}"`)}function Rn(e,t){const i=[];for(const[n,r]of Object.entries(t))En(e,n),i.push(`in ${Oe(r)} ${n};`);return i.join(`
`)}function Ln(e,t,i){const n=Object.entries(i);if(n.length===0)return{source:e,declarations:"",initialization:""};const r=Mn(e,t),o=e.slice(r.openParenthesis+1,r.closeParenthesis),a=yn(e,o),s=new Set(a.locations),l=[],c=[],f=[];for(const[m,R]of n){if(a.names.has(m)||Pn(e,m))throw new Error(`ShaderPlugin vertex input "${m}" conflicts with an existing WGSL shader input or variable`);const E=Nn(s);s.add(E);const h=`_luma_${m}`;l.push(`@location(${E}) ${h}: ${R}`),c.push(`var<private> ${m}: ${R};`),f.push(`${m} = ${h};`)}const p=o.trim()?`,
  `:`
  `,d=o.trim()?"":`
`,u=`${o}${p}${l.join(`,
  `)}${d}`;return{source:e.slice(0,r.openParenthesis+1)+u+e.slice(r.closeParenthesis),declarations:c.join(`
`),initialization:f.join(`
`)}}function Oe(e){const{primitiveType:t,components:i}=ee.getAttributeShaderTypeInfo(e),n=t==="i32"?"int":t==="u32"?"uint":"float";return i===1?n:`${n==="int"?"i":n==="uint"?"u":""}vec${i}`}function En(e,t){const i=ce(t);if(new RegExp(`\\b(?:in|attribute)\\s+(?:(?:lowp|mediump|highp)\\s+)?[A-Za-z_][A-Za-z0-9_]*\\s+${i}\\s*(?:\\[|;)`).test(e))throw new Error(`ShaderPlugin vertex input "${t}" conflicts with an existing GLSL input`)}function Mn(e,t){const n=new RegExp(`\\bfn\\s+${ce(t)}\\s*\\(`,"g").exec(e);if(!n)throw new Error(`ShaderPlugin vertex inputs require WGSL vertex entry point "${t}"`);const r=e.indexOf("(",n.index),o=Lt(e,r,"(",")");if(o<0)throw new Error(`Unable to parse WGSL vertex entry point "${t}" parameters`);return{openParenthesis:r,closeParenthesis:o}}function yn(e,t){const i=At(t),n=new Set(Rt(t)),r=Tn(t);for(const o of r){const a=wn(e,o);if(a!==null){i.push(...At(a));for(const s of Rt(a))n.add(s)}}return{locations:i,names:n}}function At(e){const t=[],i=/@location\s*\(\s*(\d+)\s*\)/g;let n=i.exec(e);for(;n;)t.push(Number(n[1])),n=i.exec(e);return t}function Rt(e){const t=[],i=/(?:^|,)\s*(?:@[A-Za-z_][\w]*(?:\([^)]*\))?\s*)*([A-Za-z_][\w]*)\s*:/gm;let n=i.exec(e);for(;n;)t.push(n[1]),n=i.exec(e);return t}function Tn(e){const t=[],i=/:\s*([A-Za-z_][\w]*)\b/g;let n=i.exec(e);for(;n;)t.push(n[1]),n=i.exec(e);return t}function wn(e,t){const n=new RegExp(`\\bstruct\\s+${ce(t)}\\s*\\{`,"g").exec(e);if(!n)return null;const r=e.indexOf("{",n.index),o=Lt(e,r,"{","}");return o<0?null:e.slice(r+1,o)}function Pn(e,t){const i=ce(t),n=new RegExp(`\\b(?:var(?:<[^>]+>)?|let|const)\\s+${i}\\b`,"g");let r=n.exec(e);for(;r;){if(Bn(e,r.index)===0)return!0;r=n.exec(e)}return!1}function Nn(e){let t=0;for(;e.has(t);)t++;return t}function Lt(e,t,i,n){let r=0,o=0,a=!1;for(let s=t;s<e.length;s++){const l=e[s],c=e[s+1];if(a){l===`
`&&(a=!1);continue}if(o>0){l==="/"&&c==="*"?(o++,s++):l==="*"&&c==="/"&&(o--,s++);continue}if(l==="/"&&c==="/"){a=!0,s++;continue}if(l==="/"&&c==="*"){o=1,s++;continue}if(l===i&&r++,l===n&&--r===0)return s}return-1}function Bn(e,t){let i=0,n=0,r=!1;for(let o=0;o<t;o++){const a=e[o],s=e[o+1];if(r){a===`
`&&(r=!1);continue}if(n>0){a==="/"&&s==="*"?(n++,o++):a==="*"&&s==="/"&&(n--,o++);continue}a==="/"&&s==="/"?(r=!0,o++):a==="/"&&s==="*"?(n=1,o++):a==="{"?i++:a==="}"&&i--}return i}function ce(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function Un(e,t,i){const n=[],r=[];for(const[o,a]of Object.entries(i)){Zn(e,o);const s=a.interpolation==="flat"?"flat ":"",l=t==="vertex"?"out":"in";n.push(`${s}${l} ${Oe(a.type)} ${o};`),t==="vertex"&&r.push(`${o} = ${Wn(a.type)};`)}return{declarations:n.join(`
`),initialization:r.join(`
`)}}function On(e,t,i,n){const r=Object.entries(n);if(r.length===0)return{source:e,declarations:"",vertexInitialization:"",fragmentInitialization:""};let o=e,a=fe(o,t,"vertex");const s=Fn(o,a);let l=fe(o,i,"fragment");const c=Dn(o,l),f=Fe(o,s),p=Fe(o,c.type),d=new Set([...ue(a.parameters),...ue(f.body),...ue(l.parameters),...ue(p.body)]),u=new Set([...Et(f.body),...Et(p.body)]),g=[],m=[],R=[],E=[];for(const[_,b]of r){if(d.has(_)||jn(o,_))throw new Error(`ShaderPlugin varying "${_}" conflicts with existing WGSL stage I/O or a module variable`);const L=qn(u);u.add(L);const M=b.interpolation==="flat"?" @interpolate(flat)":"";g.push(`  @location(${L})${M} ${_}: ${b.type},`),m.push(`var<private> ${_}: ${b.type};`),R.push(`${_} = ${Kn(b.type)};`),E.push(`${_} = ${c.name}.${_};`)}Vn(o,s,a.openBrace,a.closeBrace),o=Gn(o,s,a,r.map(([_])=>_)),a=fe(o,t,"vertex"),o=kn(o,a,r.map(([_])=>_));const I=(s===c.type?[s]:[s,c.type]).map(_=>Fe(o,_).closeBrace).sort((_,b)=>b-_);for(const _ of I)o=o.slice(0,_)+`${g.join(`
`)}
`+o.slice(_);if(l=fe(o,i,"fragment"),!new RegExp(`\\b${k(c.name)}\\s*:`).test(l.parameters))throw new Error(`Unable to preserve WGSL fragment input "${c.name}"`);return{source:o,declarations:m.join(`
`),vertexInitialization:R.join(`
`),fragmentInitialization:E.join(`
`)}}function fe(e,t,i){const r=new RegExp(`\\bfn\\s+${k(t)}\\s*\\(`,"g").exec(e);if(!r)throw new Error(`ShaderPlugin varyings require WGSL ${i} entry point "${t}"`);const o=e.indexOf("(",r.index),a=pe(e,o,"(",")"),s=e.indexOf("{",a),l=pe(e,s,"{","}");if(a<0||s<0||l<0)throw new Error(`Unable to parse WGSL ${i} entry point "${t}"`);return{openParenthesis:o,closeParenthesis:a,openBrace:s,closeBrace:l,parameters:e.slice(o+1,a)}}function Fn(e,t){const i=e.slice(t.closeParenthesis+1,t.openBrace),n=/->\s*([A-Za-z_][\w]*)\s*$/.exec(i.trim());if(!n||De(e,n[1])===null)throw new Error("ShaderPlugin varyings require the WGSL vertex entry point to return a named struct");return n[1]}function Dn(e,t){const i=[];for(const n of $n(t.parameters,",")){const r=/(?:@[A-Za-z_][\w]*(?:\([^)]*\))?\s*)*([A-Za-z_][\w]*)\s*:\s*([A-Za-z_][\w]*)\s*$/.exec(n.trim());r&&De(e,r[2])&&i.push({name:r[1],type:r[2]})}if(i.length!==1)throw new Error(`ShaderPlugin varyings require exactly one named WGSL fragment input struct; found ${i.length}`);return i[0]}function Fe(e,t){const i=De(e,t);if(!i)throw new Error(`Unable to find WGSL stage I/O struct "${t}"`);return i}function De(e,t){const n=new RegExp(`\\bstruct\\s+${k(t)}\\s*\\{`,"g").exec(e);if(!n)return null;const r=e.indexOf("{",n.index),o=pe(e,r,"{","}");return o<0?null:{openBrace:r,closeBrace:o,body:e.slice(r+1,o)}}function Vn(e,t,i,n){const r=new RegExp(`\\b${k(t)}\\s*\\(`,"g");let o=r.exec(e);for(;o;){if(o.index<i||o.index>n)throw new Error(`ShaderPlugin varying output struct "${t}" is constructed outside the selected vertex entry point`);o=r.exec(e)}}function Gn(e,t,i,n){const r=new RegExp(`\\b${k(t)}\\s*\\(`,"g"),o=[];let a=r.exec(e);for(;a;){if(a.index>i.openBrace&&a.index<i.closeBrace){const s=e.indexOf("(",a.index),l=pe(e,s,"(",")");if(l<0||l>i.closeBrace)throw new Error(`Unable to parse WGSL output constructor "${t}"`);o.push({openParenthesis:s,closeParenthesis:l})}a=r.exec(e)}for(const s of o.sort((l,c)=>c.closeParenthesis-l.closeParenthesis)){const c=e.slice(s.openParenthesis+1,s.closeParenthesis).trim()?", ":"";e=e.slice(0,s.closeParenthesis)+c+n.join(", ")+e.slice(s.closeParenthesis)}return e}function kn(e,t,i){const n=zn(e,t.openBrace+1,t.closeBrace);for(let r=n.length-1;r>=0;r--){const o=n[r],a=e.slice(o.expressionStart,o.semicolon).trim();if(!a)throw new Error("ShaderPlugin varying vertex entry point cannot use an empty return");const s=`_luma_vertexOutput${r}`,l=i.map(f=>`${s}.${f} = ${f};`).join(`
`),c=`{
var ${s} = ${a};
${l}
return ${s};
}`;e=e.slice(0,o.start)+c+e.slice(o.semicolon+1)}return e}function zn(e,t,i){const n=[];let r=t;for(;r<i;)if(r=Ve(e,r,i),e.slice(r,r+6)==="return"&&!/[A-Za-z0-9_]/.test(e[r+6]||"")){const o=r+6,a=Hn(e,o,i);if(a<0)throw new Error("Unable to parse WGSL return statement in selected vertex entry point");n.push({start:r,expressionStart:o,semicolon:a}),r=a+1}else r++;return n}function Hn(e,t,i){let n=0,r=0;for(let o=t;o<i;o++){const a=Ve(e,o,i);if(a!==o){o=a-1;continue}const s=e[o];if(s==="("&&n++,s===")"&&n--,s==="["&&r++,s==="]"&&r--,s===";"&&n===0&&r===0)return o}return-1}function Ve(e,t,i){let n=t;if(e[n]==="/"&&e[n+1]==="/"){const r=e.indexOf(`
`,n+2);return r<0||r>i?i:r+1}if(e[n]==="/"&&e[n+1]==="*"){let r=1;for(n+=2;n<i&&r>0;)e[n]==="/"&&e[n+1]==="*"?(r++,n+=2):e[n]==="*"&&e[n+1]==="/"?(r--,n+=2):n++}return n}function $n(e,t){const i=[];let n=0,r=0,o=0;for(let a=0;a<e.length;a++){const s=e[a];s==="("&&r++,s===")"&&r--,s==="<"&&o++,s===">"&&o--,s===t&&r===0&&o===0&&(i.push(e.slice(n,a)),n=a+1)}return i.push(e.slice(n)),i}function Et(e){const t=[],i=/@location\s*\(\s*(\d+)\s*\)/g;let n=i.exec(e);for(;n;)t.push(Number(n[1])),n=i.exec(e);return t}function ue(e){const t=[],i=/(?:^|,)\s*(?:@[A-Za-z_][\w]*(?:\([^)]*\))?\s*)*([A-Za-z_][\w]*)\s*:/gm;let n=i.exec(e);for(;n;)t.push(n[1]),n=i.exec(e);return t}function jn(e,t){const i=new RegExp(`\\b(?:var(?:<[^>]+>)?|let|const)\\s+${k(t)}\\b`,"g");let n=i.exec(e);for(;n;){if(Xn(e,n.index)===0)return!0;n=i.exec(e)}return!1}function qn(e){let t=0;for(;e.has(t);)t++;return t}function Wn(e){const{primitiveType:t,components:i}=ee.getAttributeShaderTypeInfo(e),n=t==="u32"?"0u":t==="i32"?"0":"0.0";return i===1?n:`${Oe(e)}(${n})`}function Kn(e){const{primitiveType:t,components:i}=ee.getAttributeShaderTypeInfo(e),n=`${t}(0)`;return i===1?n:`${e}(${n})`}function Zn(e,t){if(new RegExp(`\\b(?:flat\\s+|smooth\\s+)?(?:in|out|varying)\\s+(?:(?:lowp|mediump|highp)\\s+)?[A-Za-z_][A-Za-z0-9_]*\\s+${k(t)}\\s*(?:\\[|;)`).test(e))throw new Error(`ShaderPlugin varying "${t}" conflicts with existing GLSL stage I/O`)}function pe(e,t,i,n){let r=0,o=0,a=!1;for(let s=t;s<e.length;s++){const l=e[s],c=e[s+1];if(a){l===`
`&&(a=!1);continue}if(o>0){l==="/"&&c==="*"?(o++,s++):l==="*"&&c==="/"&&(o--,s++);continue}if(l==="/"&&c==="/"){a=!0,s++;continue}if(l==="/"&&c==="*"){o=1,s++;continue}if(l===i&&r++,l===n&&--r===0)return s}return-1}function Xn(e,t){let i=0;for(let n=0;n<t;n++){const r=Ve(e,n,t);if(r!==n){n=r-1;continue}e[n]==="{"&&i++,e[n]==="}"&&i--}return i}function k(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}const Ge=`

${oe}
`,Y=100,Yn=`precision highp float;
`;function Jn(e){const t=we(e.modules||[]),{source:i,bindingAssignments:n}=Qn(e.platformInfo,{...e,source:e.source,stage:"vertex",modules:t});return{source:i,getUniforms:Tt(t),bindingAssignments:n,bindingTable:xt(i,n),shaderLayout:Ie(i,{vertexEntryPoint:e.vertexEntryPoint,scanVertexAttributes:e.scanVertexAttributes})}}function Mt(e){const{vs:t,fs:i}=e,n=we(e.modules||[]);return{vs:yt(e.platformInfo,{...e,source:t,stage:"vertex",modules:n}),fs:yt(e.platformInfo,{...e,source:i,stage:"fragment",modules:n}),getUniforms:Tt(n)}}function Qn(e,t){const{source:i,stage:n,modules:r,defines:o={},hookFunctions:a=[],inject:s={},pluginInjections:l={},pluginVertexInputs:c={},pluginVaryings:f={},vertexEntryPoint:p="vertexMain",fragmentEntryPoint:d="fragmentMain",log:u}=t;F(typeof i=="string","shader source must be a string");const g=q(i,{defines:o}),m=Ln(g,p,c),R=On(m.source,p,d,f),E=R.source;let h="";const I=vt(a),v={},_={},b={};wt(l,v,_,b);for(const x in s){const A=typeof s[x]=="string"?{injection:s[x],order:0}:s[x],w=/^(v|f)s:(#)?([\w-]+)$/.exec(x);if(w){const Q=w[2],U=w[3];Q?U==="decl"?_[x]=[A]:b[x]=[A]:v[x]=[A]}else b[x]=[A]}er(m.declarations,m.initialization,_,b),tr(R,_,b);const L=r,M=sr(E),D=ar(M.source),S=ur(L,t._bindingRegistry,D,o),P=[];for(const x of L){u&&Te(x,E,u);const A=q(ke(x,"wgsl",u),{defines:o}),w=lr(A,x,{usedBindingsByGroup:D,bindingRegistry:t._bindingRegistry,reservedBindingKeysByGroup:S});P.push(...w.bindingAssignments);const Q=w.source;h+=Q;const U=ir(x);for(const O in U){const Je=/^(v|f)s:#([\w-]+)$/.exec(O);if(Je){const Se=Je[2]==="decl"?_:b;Se[O]=Se[O]||[],Se[O].push(U[O])}else v[O]=v[O]||[],v[O].push(U[O])}}return h+=Ge,h=ae(h,n,nr(_),!1,"wgsl",{vertex:p,fragment:d}),h+=rr(I,v),h+=hr(P),h+=M.source,h=ae(h,n,b,!1,"wgsl",{vertex:p,fragment:d}),mr(h),{source:h,bindingAssignments:P}}function yt(e,t){const{source:i,stage:n,language:r="glsl",modules:o,defines:a={},hookFunctions:s=[],inject:l={},pluginInjections:c={},pluginVertexInputs:f={},pluginVaryings:p={},prologue:d=!0,log:u}=t;F(typeof i=="string","shader source must be a string");const g=r==="glsl"?bt(i).version:-1,m=e.shaderLanguageVersion,R=g===100?"#version 100":"#version 300 es",h=i.split(`
`).slice(1).join(`
`),I={};o.forEach(S=>{Object.assign(I,S.defines)}),Object.assign(I,a);let v="";switch(r){case"wgsl":break;case"glsl":v=d?`${R}

// ----- PROLOGUE -------------------------
${`#define SHADER_TYPE_${n.toUpperCase()}`}

${ln(e)}
${n==="fragment"?Yn:""}

// ----- APPLICATION DEFINES -------------------------

${or(I)}

`:`${R}
`;break}const _=vt(s),b={},L={},M={};wt(c,b,L,M);for(const S in l){const P=typeof l[S]=="string"?{injection:l[S],order:0}:l[S],x=/^(v|f)s:(#)?([\w-]+)$/.exec(S);if(x){const A=x[2],w=x[3];A?w==="decl"?L[S]=[P]:M[S]=[P]:b[S]=[P]}else M[S]=[P]}if(n==="vertex"){const S=Rn(h,f);S&&(L["vs:#decl"]=L["vs:#decl"]||[],L["vs:#decl"].push({injection:S,order:Number.MIN_SAFE_INTEGER}))}const D=Un(h,n,p);if(D.declarations){const S=n==="vertex"?"vs:#decl":"fs:#decl";L[S]=L[S]||[],L[S].push({injection:D.declarations,order:Number.MIN_SAFE_INTEGER})}D.initialization&&(M["vs:#main-start"]=M["vs:#main-start"]||[],M["vs:#main-start"].push({injection:D.initialization,order:Number.MIN_SAFE_INTEGER}));for(const S of o){u&&Te(S,h,u);const P=ke(S,n,u);v+=P;const x=S.instance?.normalizedInjections[n]||{};for(const A in x){const w=/^(v|f)s:#([\w-]+)$/.exec(A);if(w){const U=w[2]==="decl"?L:M;U[A]=U[A]||[],U[A].push(x[A])}else b[A]=b[A]||[],b[A].push(x[A])}}return v+="// ----- MAIN SHADER SOURCE -------------------------",v+=Ge,v=ae(v,n,L),v+=Ue(_[n],b),v+=h,v=ae(v,n,M),r==="glsl"&&g!==m&&(v=cn(v,n)),r==="glsl"&&gt(v,n,u),v.trim()}function Tt(e){return function(i){const n={};for(const r of e){const o=r.getUniforms?.(i,n);Object.assign(n,o)}return n}}function wt(e,t,i,n){for(const r in e){const o=/^(v|f)s:(#)?([\w-]+)$/.exec(r);if(o){const a=o[2],s=o[3],l=a?s==="decl"?i:n:t;l[r]=l[r]||[],l[r].push(...e[r])}else n[r]=n[r]||[],n[r].push(...e[r])}}function er(e,t,i,n){e&&(i["vs:#decl"]=i["vs:#decl"]||[],i["vs:#decl"].push({injection:e,order:Number.MIN_SAFE_INTEGER})),t&&(n["vs:#main-start"]=n["vs:#main-start"]||[],n["vs:#main-start"].push({injection:t,order:Number.MIN_SAFE_INTEGER}))}function tr(e,t,i){e.declarations&&(t["vs:#decl"]=t["vs:#decl"]||[],t["vs:#decl"].push({injection:e.declarations,order:Number.MIN_SAFE_INTEGER})),e.vertexInitialization&&(i["vs:#main-start"]=i["vs:#main-start"]||[],i["vs:#main-start"].push({injection:e.vertexInitialization,order:Number.MIN_SAFE_INTEGER})),e.fragmentInitialization&&(i["fs:#main-start"]=i["fs:#main-start"]||[],i["fs:#main-start"].push({injection:e.fragmentInitialization,order:Number.MIN_SAFE_INTEGER}))}function ir(e){return{...e.instance?.normalizedInjections.vertex||{},...e.instance?.normalizedInjections.fragment||{}}}function nr(e){const t=[...e["vs:#decl"]||[],...e["fs:#decl"]||[]];return t.length?{"vs:#decl":t}:{}}function rr(e,t){return Ue(e.vertex,t,"wgsl")+Ue(e.fragment,t,"wgsl")}function or(e={}){let t="";for(const i in e){const n=e[i];(n||Number.isFinite(n))&&(t+=`#define ${i.toUpperCase()} ${e[i]}
`)}return t}function ke(e,t,i){let n;switch(t){case"vertex":n=e.vs||"";break;case"fragment":n=e.fs||"";break;case"wgsl":n=e.source||"";break;default:F(!1)}if(!e.name)throw new Error("Shader module must have a name");dt(e,t,{log:i});const r=e.name.toUpperCase().replace(/[^0-9a-z]/gi,"_");let o=`// ----- MODULE ${e.name} ---------------

`;return t!=="wgsl"&&(o+=`#define MODULE_${r}
`),o+=`${n}
`,o}function ar(e){const t=new Map;for(const i of j(e,gi)){const n=Number(i.bindingToken),r=Number(i.groupToken);ze(r,n,i.name),W(t,r,n,`application binding "${i.name}"`)}return t}function sr(e){const t=j(e,xe),i=new Map;for(const o of t){if(o.bindingToken==="auto")continue;const a=Number(o.bindingToken),s=Number(o.groupToken);ze(s,a,o.name),W(i,s,a,`application binding "${o.name}"`)}const n={sawSupportedBindingDeclaration:t.length>0},r=Qe(e,xe,o=>fr(o,i,n));if(et(e)&&!n.sawSupportedBindingDeclaration)throw new Error('Unsupported @binding(auto) declaration form in application WGSL. Use adjacent "@group(N)" and "@binding(auto)" decorators followed by a bindable "var" declaration.');return{source:r}}function lr(e,t,i){const n=[],o={sawSupportedBindingDeclaration:j(e,Z).length>0,nextHintedBindingLocation:typeof t.firstBindingSlot=="number"?t.firstBindingSlot:null},a=Qe(e,Z,s=>cr(s,{module:t,context:i,bindingAssignments:n,relocationState:o}));if(et(e)&&!o.sawSupportedBindingDeclaration)throw new Error(`Unsupported @binding(auto) declaration form in module "${t.name}". Use adjacent "@group(N)" and "@binding(auto)" decorators followed by a bindable "var" declaration.`);return{source:a,bindingAssignments:n}}function cr(e,t){const{module:i,context:n,bindingAssignments:r,relocationState:o}=t,{match:a,bindingToken:s,groupToken:l,name:c}=e,f=Number(l);if(s==="auto"){const d=Nt(f,i.name,c),u=n.bindingRegistry?.get(d),g=u!==void 0?u:gr(f,n.usedBindingsByGroup,i.name,o.nextHintedBindingLocation??void 0,n.bindingRegistry);return Pt(i.name,f,g,c),u!==void 0&&pr(n.reservedBindingKeysByGroup,f,g,d)?(r.push({moduleName:i.name,name:c,group:f,location:g}),a.replace(/@binding\(\s*auto\s*\)/,`@binding(${g})`)):(W(n.usedBindingsByGroup,f,g,`module "${i.name}" binding "${c}"`),n.bindingRegistry?.set(d,g),r.push({moduleName:i.name,name:c,group:f,location:g}),o.nextHintedBindingLocation!==null&&u===void 0&&(o.nextHintedBindingLocation=g+1),a.replace(/@binding\(\s*auto\s*\)/,`@binding(${g})`))}const p=Number(s);return Pt(i.name,f,p,c),W(n.usedBindingsByGroup,f,p,`module "${i.name}" binding "${c}"`),r.push({moduleName:i.name,name:c,group:f,location:p}),a}function fr(e,t,i){const{match:n,bindingToken:r,groupToken:o,name:a}=e,s=Number(o);if(r==="auto"){const l=_r(s,t);return ze(s,l,a),W(t,s,l,`application binding "${a}"`),n.replace(/@binding\(\s*auto\s*\)/,`@binding(${l})`)}return i.sawSupportedBindingDeclaration=!0,n}function ur(e,t,i,n){const r=new Map;if(!t)return r;for(const o of e)for(const a of dr(o,n)){const s=Nt(a.group,o.name,a.name),l=t.get(s);if(l!==void 0){const c=r.get(a.group)||new Map,f=c.get(l);if(f&&f!==s)throw new Error(`Duplicate WGSL binding reservation for modules "${f}" and "${s}": group ${a.group}, binding ${l}.`);W(i,a.group,l,`registered module binding "${s}"`),c.set(l,s),r.set(a.group,c)}}return r}function pr(e,t,i,n){const r=e.get(t);if(!r)return!1;const o=r.get(i);if(!o)return!1;if(o!==n)throw new Error(`Registered module binding "${n}" collided with "${o}": group ${t}, binding ${i}.`);return!0}function dr(e,t){const i=[],n=q(e.source||"",{defines:t});for(const r of j(n,Z))i.push({name:r.name,group:Number(r.groupToken)});return i}function ze(e,t,i){if(e===0&&t>=Y)throw new Error(`Application binding "${i}" in group 0 uses reserved binding ${t}. Application-owned explicit group-0 bindings must stay below ${Y}.`)}function Pt(e,t,i,n){if(t===0&&i<Y)throw new Error(`Module "${e}" binding "${n}" in group 0 uses reserved application binding ${i}. Module-owned explicit group-0 bindings must be ${Y} or higher.`)}function W(e,t,i,n){const r=e.get(t)||new Set;if(r.has(i))throw new Error(`Duplicate WGSL binding assignment for ${n}: group ${t}, binding ${i}.`);r.add(i),e.set(t,r)}function gr(e,t,i,n,r){const o=t.get(e)||new Set,a=new Set,s=`${e}:`,l=`${s}${i}:`;for(const[f,p]of r||[])f.startsWith(l)&&a.add(p);let c=n??(e===0?Y:o.size>0?Math.max(...o)+1:0);for(;o.has(c)||a.has(c);)c++;for(const[f,p]of r||[])p===c&&f.startsWith(s)&&r?.delete(f);return c}function _r(e,t){const i=t.get(e)||new Set;let n=0;for(;i.has(n);)n++;return n}function mr(e){const t=mi(e,Z);if(!t)return;const i=vr(e,t.index);throw i?new Error(`Unresolved @binding(auto) for module "${i}" binding "${t.name}" remained in assembled WGSL source.`):br(e,t.index)?new Error(`Unresolved @binding(auto) for application binding "${t.name}" remained in assembled WGSL source.`):new Error(`Unresolved @binding(auto) remained in assembled WGSL source near "${Sr(t.match)}".`)}function hr(e){if(e.length===0)return"";let t=`// ----- MODULE WGSL BINDING ASSIGNMENTS ---------------
`;for(const i of e)t+=`// ${i.moduleName}.${i.name} -> @group(${i.group}) @binding(${i.location})
`;return t+=`
`,t}function Nt(e,t,i){return`${e}:${t}:${i}`}function vr(e,t){const i=/^\/\/ ----- MODULE ([^\n]+) ---------------$/gm;let n,r;for(r=i.exec(e);r&&r.index<=t;)n=r[1],r=i.exec(e);return n}function br(e,t){const i=e.indexOf(Ge);return i>=0?t>i:!0}function Sr(e){return e.replace(/\s+/g," ").trim()}class B{static defaultShaderAssemblers={};_hookFunctions=[];_defaultModules=[];static getDefaultShaderAssembler(t){return F(t==="glsl"||t==="wgsl"),t==="wgsl"?(B.defaultShaderAssemblers.wgsl=B.defaultShaderAssemblers.wgsl||new J,B.defaultShaderAssemblers.wgsl):(B.defaultShaderAssemblers.glsl=B.defaultShaderAssemblers.glsl||new Bt,B.defaultShaderAssemblers.glsl)}addDefaultModule(t){this._defaultModules.find(i=>i.name===(typeof t=="string"?t:t.name))||this._defaultModules.push(t)}removeDefaultModule(t){const i=typeof t=="string"?t:t.name;this._defaultModules=this._defaultModules.filter(n=>n.name!==i)}addShaderHook(t,i){i&&(t=Object.assign(i,{hook:t})),this._hookFunctions.push(t)}_getModuleList(t=[]){const i=new Array(this._defaultModules.length+t.length),n={};let r=0;for(let o=0,a=this._defaultModules.length;o<a;++o){const s=this._defaultModules[o],l=s.name;i[r++]=s,n[l]=!0}for(let o=0,a=t.length;o<a;++o){const s=t[o],l=s.name;n[l]||(i[r++]=s,n[l]=!0)}return i.length=r,V(i),i}}class Bt extends B{shaderLanguage="glsl";assembleGLSLShaderPair(t){const i=this._getModuleList(t.modules),n=this._hookFunctions;return{...Mt({...t,vs:t.vs,fs:t.fs,modules:i,hookFunctions:n}),modules:i}}}class J extends B{shaderLanguage="wgsl";_wgslBindingRegistry=new Map;assembleWGSLShader(t){const i=this._getModuleList(t.modules),n=this._hookFunctions,r=J.getShaderPreprocessorDefines(t,i),o=t.platformInfo.shaderLanguage==="wgsl"&&t.source?q(t.source,{defines:r}):t.source,{source:a,getUniforms:s,bindingAssignments:l}=Jn({...t,source:o,defines:r,_bindingRegistry:this._wgslBindingRegistry,modules:i,hookFunctions:n}),c=t.platformInfo.shaderLanguage==="wgsl"?q(a,{defines:r}):a;return{source:c,getUniforms:s,modules:i,bindingAssignments:l,bindingTable:xt(c,l),shaderLayout:Ie(c,{vertexEntryPoint:t.vertexEntryPoint,scanVertexAttributes:t.scanVertexAttributes})}}static getShaderPreprocessorDefines(t,i){return{...J.getPlatformPreprocessorDefines(t.platformInfo),...i.reduce((n,r)=>(Object.assign(n,r.defines),n),{}),...t.defines}}static getPlatformPreprocessorDefines(t){const i=t.limits||{};return{LUMA_SUPPORTS_VERTEX_STORAGE_BUFFERS:t.type==="webgpu"&&(i.maxStorageBuffersInVertexStage||0)>0,LUMA_FP32_TAN_PRECISION_WORKAROUND:t.type==="webgpu"&&t.gpu.toLowerCase()!=="nvidia"&&t.gpu.toLowerCase()!=="amd",LUMA_FP64_INTEGER_ARITHMETIC:t.type==="webgpu"&&t.gpu.toLowerCase()==="apple"}}}const xr=`out vec4 transform_output;
void main() {
  transform_output = vec4(0);
}`,Ir=`#version 300 es
${xr}`;function Cr(e,t){t=Array.isArray(t)?t:[t];const i=e.replace(/^\s+/,"").split(/\s+/),[n,r,o]=i;if(!t.includes(n)||!r||!o)return null;const a=o.split(";")[0];return{qualifier:n,type:r,name:a}}function Ar(e){const{input:t,inputChannels:i,output:n}=e||{};if(!t)return Ir;if(!i)throw new Error("inputChannels");const r=Er(i),o=Ut(t,i);return`#version 300 es
in ${r} ${t};
out vec4 ${n};
void main() {
  ${n} = ${o};
}`}function Rr(e){switch(e){case"float":return"x";case"vec2":return"xy";case"vec3":return"xyz";case"vec4":return"xyzw";default:throw new Error(e)}}function Lr(e){switch(e){case"float":return 1;case"vec2":return 2;case"vec3":return 3;case"vec4":return 4;default:throw new Error(e)}}function Er(e){switch(e){case 1:return"float";case 2:return"vec2";case 3:return"vec3";case 4:return"vec4";default:throw new Error(`invalid channels: ${e}`)}}function Ut(e,t){switch(t){case 1:return`vec4(${e}, 0.0, 0.0, 1.0)`;case 2:return`vec4(${e}, 0.0, 1.0)`;case 3:return`vec4(${e}, 1.0)`;case 4:return e;default:throw new Error(`invalid channels: ${t}`)}}function de(e){return typeof e=="string"?e.charAt(0).toUpperCase()+e.slice(1):e}function Mr(e,t){return yr(e,t)}function yr(e,t){const i=[];switch(t.uniforms){case"scoped-interface-blocks":case"unscoped-interface-blocks":i.push(`layout(std140) uniform ${de(e.name)} {`);break}for(const[n,r]of Object.entries(e.uniformTypes||{})){if(typeof r!="string")throw new Error(`Composite uniform types are not supported by GLSL shader generation: ${e.name}.${n}`);const o=Tr(r);switch(t.uniforms){case"scoped-interface-blocks":i.push(`  ${o} ${n};`);break;case"unscoped-interface-blocks":i.push(`  ${o} ${e.name}_${n};`);break;case"uniforms":i.push(`uniform ${o} ${e.name}_${n};`)}}switch(t.uniforms){case"scoped-interface-blocks":i.push(`} ${e.name};`);break;case"unscoped-interface-blocks":i.push("};");break}return i.push(""),i.join(`
`)}function Tr(e){return{f32:"float",i32:"int",u32:"uint","vec2<f32>":"vec2","vec3<f32>":"vec3","vec4<f32>":"vec4","vec2<i32>":"ivec2","vec3<i32>":"ivec3","vec4<i32>":"ivec4","vec2<u32>":"uvec2","vec3<u32>":"uvec3","vec4<u32>":"uvec4","mat2x2<f32>":"mat2","mat2x3<f32>":"mat2x3","mat2x4<f32>":"mat2x4","mat3x2<f32>":"mat3x2","mat3x3<f32>":"mat3","mat3x4<f32>":"mat3x4","mat4x2<f32>":"mat4x2","mat4x3<f32>":"mat4x3","mat4x4<f32>":"mat4"}[e]}function wr(e,t){return Pr(e)}function Pr(e,t){const i=[];i.push(`struct ${de(e.name)} {`);for(const[n,r]of Object.entries(e?.uniformTypes||{})){if(typeof r!="string")throw new Error(`Composite uniform types are not supported by WGSL shader generation: ${e.name}.${n}`);const o=r;i.push(`  ${n} : ${o};`)}return i.push("};"),i.push(`var<uniform> ${e.name} : ${de(e.name)};`),i.join(`
`)}function Nr(e,t){switch(t.shaderLanguage){case"glsl":return Mr(e,t);case"wgsl":return wr(e)}}let z=null;const Ot=new ArrayBuffer(4),Ft=new Float32Array(Ot),Dt=new Uint32Array(Ot);function Br(e){z||=Vt(),e=di(e,-65504,65504),Ft[0]=e;const t=Dt[0],i=t>>23&511;return z.baseTable[i]+((t&8388607)>>z.shiftTable[i])}function Ur(e){z||=Vt();const t=e>>10;return Dt[0]=z.mantissaTable[z.offsetTable[t]+(e&1023)]+z.exponentTable[t],Ft[0]}function Vt(){const e=new Uint32Array(512),t=new Uint32Array(512);for(let o=0;o<256;++o){const a=o-127;a<-27?(e[o]=0,e[o|256]=32768,t[o]=24,t[o|256]=24):a<-14?(e[o]=1024>>-a-14,e[o|256]=1024>>-a-14|32768,t[o]=-a-1,t[o|256]=-a-1):a<=15?(e[o]=a+15<<10,e[o|256]=a+15<<10|32768,t[o]=13,t[o|256]=13):a<128?(e[o]=31744,e[o|256]=64512,t[o]=24,t[o|256]=24):(e[o]=31744,e[o|256]=64512,t[o]=13,t[o|256]=13)}const i=new Uint32Array(2048),n=new Uint32Array(64),r=new Uint32Array(64);for(let o=1;o<1024;++o){let a=o<<13,s=0;for(;(a&8388608)===0;)a<<=1,s-=8388608;a&=-8388609,s+=947912704,i[o]=a|s}for(let o=1024;o<2048;++o)i[o]=939524096+(o-1024<<13);for(let o=1;o<31;++o)n[o]=o<<23;n[31]=1199570944,n[32]=2147483648;for(let o=33;o<63;++o)n[o]=2147483648+(o-32<<23);n[63]=3347054592;for(let o=1;o<64;++o)o!==32&&(r[o]=1024);return{baseTable:e,shiftTable:t,mantissaTable:i,exponentTable:n,offsetTable:r}}function ge(e,t=[],i=0){const n=Math.fround(e),r=e-n;return t[i]=n,t[i+1]=r,t}function He(e){return e-Math.fround(e)}function $e(e){const t=new Float32Array(32);for(let i=0;i<4;++i)for(let n=0;n<4;++n){const r=i*4+n;ge(e[n*4+i],t,r*2)}return t}function je(e,t=!0){return e??t}function qe(e=[0,0,0],t=!0){return t?e.map(i=>i/255):[...e]}function Gt(e,t=!0){const i=qe(e.slice(0,3),t),n=Number.isFinite(e[3]),r=n?e[3]:1;return[i[0],i[1],i[2],t&&n?r/255:r]}const Or=`fn random(scale: vec3f, seed: f32) -> f32 {
  return fract(sin(dot(scale + vec3f(seed), vec3f(12.9898, 78.233, 151.7182))) * 43758.5453 + seed);
}
`,Fr=`float random(vec3 scale, float seed) {
  /* use the fragment position for a different seed per-pixel */
  return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
}
`,Dr={name:"random",source:Or,fs:Fr},Vr=`fn volumeRaymarch_intersectBox(origin: vec3f, direction: vec3f, minimum: vec3f, maximum: vec3f) -> vec2f {
  let safeDirection = select(vec3f(0.000001), direction, abs(direction) > vec3f(0.000001));
  let first = (minimum - origin) / safeDirection;
  let second = (maximum - origin) / safeDirection;
  let nearPlane = min(first, second);
  let farPlane = max(first, second);
  return vec2f(
    max(max(nearPlane.x, nearPlane.y), nearPlane.z),
    min(min(farPlane.x, farPlane.y), farPlane.z)
  );
}

fn volumeRaymarch_mixScalar(corners: array<f32, 8>, blend: vec3f) -> f32 {
  let lower = mix(mix(corners[0], corners[1], blend.x), mix(corners[2], corners[3], blend.x), blend.y);
  let upper = mix(mix(corners[4], corners[5], blend.x), mix(corners[6], corners[7], blend.x), blend.y);
  return mix(lower, upper, blend.z);
}

fn volumeRaymarch_mixVector(corners: array<vec3f, 8>, blend: vec3f) -> vec3f {
  let lower = mix(mix(corners[0], corners[1], blend.x), mix(corners[2], corners[3], blend.x), blend.y);
  let upper = mix(mix(corners[4], corners[5], blend.x), mix(corners[6], corners[7], blend.x), blend.y);
  return mix(lower, upper, blend.z);
}

fn volumeRaymarch_sequentialColor(value: f32, lowColor: vec3f, highColor: vec3f) -> vec3f {
  return mix(lowColor, highColor, clamp(value, 0.0, 1.0));
}

fn volumeRaymarch_signedColor(value: f32, negativeColor: vec3f, neutralColor: vec3f, positiveColor: vec3f) -> vec3f {
  let amount = clamp(abs(value), 0.0, 1.0);
  let signedTarget = select(negativeColor, positiveColor, value >= 0.0);
  return mix(neutralColor, signedTarget, amount);
}

fn volumeRaymarch_directionColor(vector: vec3f) -> vec3f {
  let direction = normalize(vector + vec3f(0.00001));
  return 0.18 + 0.82 * (direction * 0.5 + 0.5);
}

fn volumeRaymarch_segmentDistance(point: vec3f, start: vec3f, end: vec3f) -> f32 {
  let segment = end - start;
  let fraction = clamp(dot(point - start, segment) / max(dot(segment, segment), 0.000001), 0.0, 1.0);
  return length(point - (start + segment * fraction));
}

fn volumeRaymarch_arrowDistance(
  point: vec3f,
  center: vec3f,
  direction: vec3f,
  arrowLength: f32,
  shaftRadius: f32,
  headRadius: f32
) -> vec2f {
  let tail = center - direction * arrowLength * 0.48;
  let shoulder = center + direction * arrowLength * 0.18;
  let tip = center + direction * arrowLength * 0.52;
  let shaftDistance = volumeRaymarch_segmentDistance(point, tail, shoulder) - shaftRadius;
  let headVector = point - shoulder;
  let headLength = max(length(tip - shoulder), 0.000001);
  let headPosition = dot(headVector, direction);
  let taperedRadius = headRadius * (1.0 - clamp(headPosition / headLength, 0.0, 1.0));
  let radialDistance = length(headVector - direction * headPosition);
  let headDistance = max(
    radialDistance - taperedRadius,
    max(-headPosition, headPosition - headLength)
  );
  return vec2f(min(shaftDistance, headDistance), headDistance);
}

fn volumeRaymarch_composite(accumulated: vec4f, color: vec3f, alpha: f32) -> vec4f {
  let contribution = (1.0 - accumulated.a) * clamp(alpha, 0.0, 1.0);
  return vec4f(accumulated.rgb + color * contribution, accumulated.a + contribution);
}
`,Gr={name:"volumeRaymarch",source:Vr},kr=`#ifdef LUMA_FP32_TAN_PRECISION_WORKAROUND

// All these functions are for substituting tan() function from Intel GPU only
const float TWO_PI = 6.2831854820251465;
const float PI_2 = 1.5707963705062866;
const float PI_16 = 0.1963495463132858;

const float SIN_TABLE_0 = 0.19509032368659973;
const float SIN_TABLE_1 = 0.3826834261417389;
const float SIN_TABLE_2 = 0.5555702447891235;
const float SIN_TABLE_3 = 0.7071067690849304;

const float COS_TABLE_0 = 0.9807852506637573;
const float COS_TABLE_1 = 0.9238795042037964;
const float COS_TABLE_2 = 0.8314695954322815;
const float COS_TABLE_3 = 0.7071067690849304;

const float INVERSE_FACTORIAL_3 = 1.666666716337204e-01; // 1/3!
const float INVERSE_FACTORIAL_5 = 8.333333767950535e-03; // 1/5!
const float INVERSE_FACTORIAL_7 = 1.9841270113829523e-04; // 1/7!
const float INVERSE_FACTORIAL_9 = 2.75573188446287533e-06; // 1/9!

float sin_taylor_fp32(float a) {
  float r, s, t, x;

  if (a == 0.0) {
    return 0.0;
  }

  x = -a * a;
  s = a;
  r = a;

  r = r * x;
  t = r * INVERSE_FACTORIAL_3;
  s = s + t;

  r = r * x;
  t = r * INVERSE_FACTORIAL_5;
  s = s + t;

  r = r * x;
  t = r * INVERSE_FACTORIAL_7;
  s = s + t;

  r = r * x;
  t = r * INVERSE_FACTORIAL_9;
  s = s + t;

  return s;
}

void sincos_taylor_fp32(float a, out float sin_t, out float cos_t) {
  if (a == 0.0) {
    sin_t = 0.0;
    cos_t = 1.0;
  }
  sin_t = sin_taylor_fp32(a);
  cos_t = sqrt(1.0 - sin_t * sin_t);
}

float tan_taylor_fp32(float a) {
    float sin_a;
    float cos_a;

    if (a == 0.0) {
        return 0.0;
    }

    // 2pi range reduction
    float z = floor(a / TWO_PI);
    float r = a - TWO_PI * z;

    float t;
    float q = floor(r / PI_2 + 0.5);
    int j = int(q);

    if (j < -2 || j > 2) {
        return 1.0 / 0.0;
    }

    t = r - PI_2 * q;

    q = floor(t / PI_16 + 0.5);
    int k = int(q);
    int abs_k = int(abs(float(k)));

    if (abs_k > 4) {
        return 1.0 / 0.0;
    } else {
        t = t - PI_16 * q;
    }

    float u = 0.0;
    float v = 0.0;

    float sin_t, cos_t;
    float s, c;
    sincos_taylor_fp32(t, sin_t, cos_t);

    if (k == 0) {
        s = sin_t;
        c = cos_t;
    } else {
        if (abs(float(abs_k) - 1.0) < 0.5) {
            u = COS_TABLE_0;
            v = SIN_TABLE_0;
        } else if (abs(float(abs_k) - 2.0) < 0.5) {
            u = COS_TABLE_1;
            v = SIN_TABLE_1;
        } else if (abs(float(abs_k) - 3.0) < 0.5) {
            u = COS_TABLE_2;
            v = SIN_TABLE_2;
        } else if (abs(float(abs_k) - 4.0) < 0.5) {
            u = COS_TABLE_3;
            v = SIN_TABLE_3;
        }
        if (k > 0) {
            s = u * sin_t + v * cos_t;
            c = u * cos_t - v * sin_t;
        } else {
            s = u * sin_t - v * cos_t;
            c = u * cos_t + v * sin_t;
        }
    }

    if (j == 0) {
        sin_a = s;
        cos_a = c;
    } else if (j == 1) {
        sin_a = c;
        cos_a = -s;
    } else if (j == -1) {
        sin_a = -c;
        cos_a = s;
    } else {
        sin_a = -s;
        cos_a = -c;
    }
    return sin_a / cos_a;
}
#endif

float tan_fp32(float a) {
#ifdef LUMA_FP32_TAN_PRECISION_WORKAROUND
  return tan_taylor_fp32(a);
#else
  return tan(a);
#endif
}
`,zr=`#ifdef LUMA_FP32_TAN_PRECISION_WORKAROUND
const FP32_TWO_PI: f32 = 6.2831854820251465;
const FP32_PI_2: f32 = 1.5707963705062866;
const FP32_PI_16: f32 = 0.1963495463132858;

const FP32_SIN_TABLE_0: f32 = 0.19509032368659973;
const FP32_SIN_TABLE_1: f32 = 0.3826834261417389;
const FP32_SIN_TABLE_2: f32 = 0.5555702447891235;
const FP32_SIN_TABLE_3: f32 = 0.7071067690849304;

const FP32_COS_TABLE_0: f32 = 0.9807852506637573;
const FP32_COS_TABLE_1: f32 = 0.9238795042037964;
const FP32_COS_TABLE_2: f32 = 0.8314695954322815;
const FP32_COS_TABLE_3: f32 = 0.7071067690849304;

const FP32_INVERSE_FACTORIAL_3: f32 = 1.666666716337204e-01;
const FP32_INVERSE_FACTORIAL_5: f32 = 8.333333767950535e-03;
const FP32_INVERSE_FACTORIAL_7: f32 = 1.9841270113829523e-04;
const FP32_INVERSE_FACTORIAL_9: f32 = 2.75573188446287533e-06;
const FP32_OVERFLOW: f32 = 3.402823466e+38;

fn sin_taylor_fp32(a: f32) -> f32 {
  if (a == 0.0) {
    return 0.0;
  }

  let x = -a * a;
  var sum = a;
  var term = a;

  term = term * x;
  sum = sum + term * FP32_INVERSE_FACTORIAL_3;
  term = term * x;
  sum = sum + term * FP32_INVERSE_FACTORIAL_5;
  term = term * x;
  sum = sum + term * FP32_INVERSE_FACTORIAL_7;
  term = term * x;
  sum = sum + term * FP32_INVERSE_FACTORIAL_9;

  return sum;
}

fn tan_taylor_fp32(a: f32) -> f32 {
  if (a == 0.0) {
    return 0.0;
  }

  let z = floor(a / FP32_TWO_PI);
  let reduced = a - FP32_TWO_PI * z;

  var quadrantValue = floor(reduced / FP32_PI_2 + 0.5);
  let quadrant = i32(quadrantValue);
  if (quadrant < -2 || quadrant > 2) {
    return FP32_OVERFLOW;
  }

  var angle = reduced - FP32_PI_2 * quadrantValue;
  quadrantValue = floor(angle / FP32_PI_16 + 0.5);
  let tableIndex = i32(quadrantValue);
  let absoluteTableIndex = abs(tableIndex);
  if (absoluteTableIndex > 4) {
    return FP32_OVERFLOW;
  }

  angle = angle - FP32_PI_16 * quadrantValue;
  let sinAngle = sin_taylor_fp32(angle);
  let cosAngle = sqrt(1.0 - sinAngle * sinAngle);

  var tableCos = 0.0;
  var tableSin = 0.0;
  if (absoluteTableIndex == 1) {
    tableCos = FP32_COS_TABLE_0;
    tableSin = FP32_SIN_TABLE_0;
  } else if (absoluteTableIndex == 2) {
    tableCos = FP32_COS_TABLE_1;
    tableSin = FP32_SIN_TABLE_1;
  } else if (absoluteTableIndex == 3) {
    tableCos = FP32_COS_TABLE_2;
    tableSin = FP32_SIN_TABLE_2;
  } else if (absoluteTableIndex == 4) {
    tableCos = FP32_COS_TABLE_3;
    tableSin = FP32_SIN_TABLE_3;
  }

  var sinReduced = sinAngle;
  var cosReduced = cosAngle;
  if (tableIndex > 0) {
    sinReduced = tableCos * sinAngle + tableSin * cosAngle;
    cosReduced = tableCos * cosAngle - tableSin * sinAngle;
  } else if (tableIndex < 0) {
    sinReduced = tableCos * sinAngle - tableSin * cosAngle;
    cosReduced = tableCos * cosAngle + tableSin * sinAngle;
  }

  var sinValue = 0.0;
  var cosValue = 0.0;
  if (quadrant == 0) {
    sinValue = sinReduced;
    cosValue = cosReduced;
  } else if (quadrant == 1) {
    sinValue = cosReduced;
    cosValue = -sinReduced;
  } else if (quadrant == -1) {
    sinValue = -cosReduced;
    cosValue = sinReduced;
  } else {
    sinValue = -sinReduced;
    cosValue = -cosReduced;
  }

  return sinValue / cosValue;
}

fn tan_fp32(a: f32) -> f32 {
  return tan_taylor_fp32(a);
}
#else
fn tan_fp32(a: f32) -> f32 {
  return tan(a);
}
#endif
`,Hr={name:"fp32",source:zr,vs:kr},kt=`
layout(std140) uniform fp64arithmeticUniforms {
  uniform float ONE;
  uniform float SPLIT;
} fp64;

/*
About LUMA_FP64_CODE_ELIMINATION_WORKAROUND

The purpose of this workaround is to prevent shader compilers from
optimizing away necessary arithmetic operations by swapping their sequences
or transform the equation to some 'equivalent' form.

These helpers implement Dekker/Veltkamp-style error tracking. If the compiler
folds constants or reassociates the arithmetic, the high/low split can stop
tracking the rounding error correctly. That failure mode tends to look fine in
simple coordinate setup, but then breaks down inside iterative arithmetic such
as fp64 Mandelbrot loops.

The method is to multiply an artifical variable, ONE, which will be known to
the compiler to be 1 only at runtime. The whole expression is then represented
as a polynomial with respective to ONE. In the coefficients of all terms, only one a
and one b should appear

err = (a + b) * ONE^6 - a * ONE^5 - (a + b) * ONE^4 + a * ONE^3 - b - (a + b) * ONE^2 + a * ONE
*/

float prevent_fp64_optimization(float value) {
#if defined(LUMA_FP64_CODE_ELIMINATION_WORKAROUND)
  return value + fp64.ONE * 0.0;
#else
  return value;
#endif
}

// Divide float number to high and low floats to extend fraction bits
vec2 split(float a) {
  // Keep SPLIT as a runtime uniform so the compiler cannot fold the Dekker
  // split into a constant expression and reassociate the recovery steps.
  float split = prevent_fp64_optimization(fp64.SPLIT);
  float t = prevent_fp64_optimization(a * split);
  float temp = t - a;
  float a_hi = t - temp;
  float a_lo = a - a_hi;
  return vec2(a_hi, a_lo);
}

// Divide float number again when high float uses too many fraction bits
vec2 split2(vec2 a) {
  vec2 b = split(a.x);
  b.y += a.y;
  return b;
}

// Special sum operation when a > b
vec2 quickTwoSum(float a, float b) {
#if defined(LUMA_FP64_CODE_ELIMINATION_WORKAROUND)
  float sum = (a + b) * fp64.ONE;
  float err = b - (sum - a) * fp64.ONE;
#else
  float sum = a + b;
  float err = b - (sum - a);
#endif
  return vec2(sum, err);
}

// General sum operation
vec2 twoSum(float a, float b) {
  float s = (a + b);
#if defined(LUMA_FP64_CODE_ELIMINATION_WORKAROUND)
  float v = (s * fp64.ONE - a) * fp64.ONE;
  float err = (a - (s - v) * fp64.ONE) * fp64.ONE * fp64.ONE * fp64.ONE + (b - v);
#else
  float v = s - a;
  float err = (a - (s - v)) + (b - v);
#endif
  return vec2(s, err);
}

vec2 twoSub(float a, float b) {
  float s = (a - b);
#if defined(LUMA_FP64_CODE_ELIMINATION_WORKAROUND)
  float v = (s * fp64.ONE - a) * fp64.ONE;
  float err = (a - (s - v) * fp64.ONE) * fp64.ONE * fp64.ONE * fp64.ONE - (b + v);
#else
  float v = s - a;
  float err = (a - (s - v)) - (b + v);
#endif
  return vec2(s, err);
}

vec2 twoSqr(float a) {
  float prod = a * a;
  vec2 a_fp64 = split(a);
#if defined(LUMA_FP64_CODE_ELIMINATION_WORKAROUND)
  float err = ((a_fp64.x * a_fp64.x - prod) * fp64.ONE + 2.0 * a_fp64.x *
    a_fp64.y * fp64.ONE * fp64.ONE) + a_fp64.y * a_fp64.y * fp64.ONE * fp64.ONE * fp64.ONE;
#else
  float err = ((a_fp64.x * a_fp64.x - prod) + 2.0 * a_fp64.x * a_fp64.y) + a_fp64.y * a_fp64.y;
#endif
  return vec2(prod, err);
}

vec2 twoProd(float a, float b) {
  float prod = a * b;
  vec2 a_fp64 = split(a);
  vec2 b_fp64 = split(b);
  // twoProd is especially sensitive because mul_fp64 and div_fp64 both depend
  // on the split terms and cross terms staying in the original evaluation
  // order. If the compiler folds or reassociates them, the low part tends to
  // collapse to zero or NaN on some drivers.
  float highProduct = prevent_fp64_optimization(a_fp64.x * b_fp64.x);
  float crossProduct1 = prevent_fp64_optimization(a_fp64.x * b_fp64.y);
  float crossProduct2 = prevent_fp64_optimization(a_fp64.y * b_fp64.x);
  float lowProduct = prevent_fp64_optimization(a_fp64.y * b_fp64.y);
#if defined(LUMA_FP64_CODE_ELIMINATION_WORKAROUND)
  float err1 = (highProduct - prod) * fp64.ONE;
  float err2 = crossProduct1 * fp64.ONE * fp64.ONE;
  float err3 = crossProduct2 * fp64.ONE * fp64.ONE * fp64.ONE;
  float err4 = lowProduct * fp64.ONE * fp64.ONE * fp64.ONE * fp64.ONE;
#else
  float err1 = highProduct - prod;
  float err2 = crossProduct1;
  float err3 = crossProduct2;
  float err4 = lowProduct;
#endif
  float err = ((err1 + err2) + err3) + err4;
  return vec2(prod, err);
}

vec2 sum_fp64(vec2 a, vec2 b) {
  vec2 s, t;
  s = twoSum(a.x, b.x);
  t = twoSum(a.y, b.y);
  s.y += t.x;
  s = quickTwoSum(s.x, s.y);
  s.y += t.y;
  s = quickTwoSum(s.x, s.y);
  return s;
}

vec2 sub_fp64(vec2 a, vec2 b) {
  vec2 s, t;
  s = twoSub(a.x, b.x);
  t = twoSub(a.y, b.y);
  s.y += t.x;
  s = quickTwoSum(s.x, s.y);
  s.y += t.y;
  s = quickTwoSum(s.x, s.y);
  return s;
}

vec2 mul_fp64(vec2 a, vec2 b) {
  vec2 prod = twoProd(a.x, b.x);
  // y component is for the error
  prod.y += a.x * b.y;
#if defined(LUMA_FP64_HIGH_BITS_OVERFLOW_WORKAROUND)
  prod = split2(prod);
#endif
  prod = quickTwoSum(prod.x, prod.y);
  prod.y += a.y * b.x;
#if defined(LUMA_FP64_HIGH_BITS_OVERFLOW_WORKAROUND)
  prod = split2(prod);
#endif
  prod = quickTwoSum(prod.x, prod.y);
  return prod;
}

vec2 div_fp64(vec2 a, vec2 b) {
  float xn = 1.0 / b.x;
#if defined(LUMA_FP64_HIGH_BITS_OVERFLOW_WORKAROUND)
  vec2 yn = mul_fp64(a, vec2(xn, 0));
#else
  vec2 yn = a * xn;
#endif
  float diff = (sub_fp64(a, mul_fp64(b, yn))).x;
  vec2 prod = twoProd(xn, diff);
  return sum_fp64(yn, prod);
}

vec2 sqrt_fp64(vec2 a) {
  if (a.x == 0.0 && a.y == 0.0) return vec2(0.0, 0.0);
  if (a.x < 0.0) return vec2(0.0 / 0.0, 0.0 / 0.0);

  float x = 1.0 / sqrt(a.x);
  float yn = a.x * x;
#if defined(LUMA_FP64_CODE_ELIMINATION_WORKAROUND)
  vec2 yn_sqr = twoSqr(yn) * fp64.ONE;
#else
  vec2 yn_sqr = twoSqr(yn);
#endif
  float diff = sub_fp64(a, yn_sqr).x;
  vec2 prod = twoProd(x * 0.5, diff);
#if defined(LUMA_FP64_HIGH_BITS_OVERFLOW_WORKAROUND)
  return sum_fp64(split(yn), prod);
#else
  return sum_fp64(vec2(yn, 0.0), prod);
#endif
}
`,$r=`struct Fp64F32Bits {
  sign: u32,
  baseExponent: i32,
  significand: u32,
  isZero: bool,
  isInf: bool,
  isNan: bool,
};

// Decode an f32 as (-1)^sign * significand * 2^baseExponent.
fn fp64_decode_f32_bits(bits: u32) -> Fp64F32Bits {
  let sign = bits >> 31u;
  let exponentBits = (bits >> 23u) & 0xffu;
  let fraction = bits & 0x7fffffu;

  if (exponentBits == 0xffu) {
    return Fp64F32Bits(sign, 0, 0u, false, fraction == 0u, fraction != 0u);
  }
  if (exponentBits == 0u) {
    return Fp64F32Bits(sign, -149, fraction, fraction == 0u, false, false);
  }
  return Fp64F32Bits(sign, i32(exponentBits) - 150, 0x800000u | fraction, false, false, false);
}

fn fp64_f32_magnitude_compare(aBits: u32, bBits: u32) -> i32 {
  let aMagnitude = aBits & 0x7fffffffu;
  let bMagnitude = bBits & 0x7fffffffu;
  if (aMagnitude == bMagnitude) {
    return 0;
  }
  return select(-1, 1, aMagnitude > bMagnitude);
}

fn fp64_make_residual_f32_bits(
  exactSign: u32,
  exactMagnitude: vec2u,
  exactBaseExponent: i32,
  highBits: u32
) -> u32 {
  if (fp64_u64_is_zero(exactMagnitude)) {
    return 0u;
  }

  let high = fp64_decode_f32_bits(highBits);
  if (high.isInf || high.isNan) {
    return exactSign << 31u;
  }
  if (high.isZero) {
    return fp64_make_f32_bits_from_u64(exactSign, exactMagnitude, exactBaseExponent);
  }

  let commonBaseExponent = min(exactBaseExponent, high.baseExponent);
  let exactShift = exactBaseExponent - commonBaseExponent;
  let highShift = high.baseExponent - commonBaseExponent;

  // A normal two-sum/two-product residual never needs a shift this large.
  // This guard gives deterministic underflow behavior outside that contract.
  if (exactShift >= 64 || highShift >= 64) {
    return exactSign << 31u;
  }

  let exactAligned = fp64_u64_shift_left(exactMagnitude, u32(exactShift));
  let highAligned = fp64_u64_shift_left(vec2u(0u, high.significand), u32(highShift));
  let comparison = fp64_u64_compare(exactAligned, highAligned);
  if (comparison == 0) {
    return 0u;
  }

  var residualSign = exactSign;
  var residualMagnitude: vec2u;
  if (comparison > 0) {
    residualMagnitude = fp64_u64_sub(exactAligned, highAligned);
  } else {
    residualSign = exactSign ^ 1u;
    residualMagnitude = fp64_u64_sub(highAligned, exactAligned);
  }
  return fp64_make_f32_bits_from_u64(
    residualSign,
    residualMagnitude,
    commonBaseExponent
  );
}

fn fp64_split_accumulator_bits(
  sign: u32,
  magnitude: vec2u,
  baseExponent: i32
) -> vec2u {
  let highBits = fp64_make_f32_bits_from_u64(sign, magnitude, baseExponent);
  let lowBits = fp64_make_residual_f32_bits(sign, magnitude, baseExponent, highBits);
  return vec2u(highBits, lowBits);
}

fn fp64_two_sum_integer_bits(aBits: u32, bBits: u32) -> vec2u {
  let a = fp64_decode_f32_bits(aBits);
  let b = fp64_decode_f32_bits(bBits);

  if (a.isNan || b.isNan) {
    return vec2u(0x7fc00000u, 0u);
  }
  if (a.isInf || b.isInf) {
    if (a.isInf && b.isInf && a.sign != b.sign) {
      return vec2u(0x7fc00000u, 0u);
    }
    return select(vec2u(bBits, 0u), vec2u(aBits, 0u), a.isInf);
  }
  if (a.isZero && b.isZero) {
    return vec2u((a.sign & b.sign) << 31u, 0u);
  }
  if (a.isZero) {
    return vec2u(bBits, 0u);
  }
  if (b.isZero) {
    return vec2u(aBits, 0u);
  }

  let exponentDifference = select(
    b.baseExponent - a.baseExponent,
    a.baseExponent - b.baseExponent,
    a.baseExponent >= b.baseExponent
  );

  // Beyond half an ulp, rounding cannot change the larger operand. Returning
  // the smaller operand intact also avoids an unbounded integer alignment.
  // At a power-of-two boundary the spacing below the larger operand is half
  // the spacing above it, so an opposite-sign gap-25 operand can still change
  // the rounded high limb. Gap 26 is the first universally safe early-out.
  if (exponentDifference > 25) {
    if (fp64_f32_magnitude_compare(aBits, bBits) >= 0) {
      return vec2u(aBits, bBits);
    }
    return vec2u(bBits, aBits);
  }

  let commonBaseExponent = min(a.baseExponent, b.baseExponent);
  let aMagnitude = fp64_u64_shift_left(
    vec2u(0u, a.significand),
    u32(a.baseExponent - commonBaseExponent)
  );
  let bMagnitude = fp64_u64_shift_left(
    vec2u(0u, b.significand),
    u32(b.baseExponent - commonBaseExponent)
  );

  var resultSign = a.sign;
  var resultMagnitude: vec2u;
  if (a.sign == b.sign) {
    resultMagnitude = fp64_u64_add(aMagnitude, bMagnitude);
  } else {
    let comparison = fp64_u64_compare(aMagnitude, bMagnitude);
    if (comparison == 0) {
      return vec2u(0u, 0u);
    }
    if (comparison > 0) {
      resultMagnitude = fp64_u64_sub(aMagnitude, bMagnitude);
    } else {
      resultSign = b.sign;
      resultMagnitude = fp64_u64_sub(bMagnitude, aMagnitude);
    }
  }

  return fp64_split_accumulator_bits(resultSign, resultMagnitude, commonBaseExponent);
}

fn fp64_two_sum_integer(a: f32, b: f32) -> vec2f {
  let resultBits = fp64_two_sum_integer_bits(bitcast<u32>(a), bitcast<u32>(b));
  return vec2f(bitcast<f32>(resultBits.x), bitcast<f32>(resultBits.y));
}

fn fp64_multiply_significands(a: u32, b: u32) -> vec2u {
  let aLow = a & 0xffffu;
  let aHigh = a >> 16u;
  let bLow = b & 0xffffu;
  let bHigh = b >> 16u;
  let lowProduct = aLow * bLow;
  let crossProduct = aLow * bHigh + aHigh * bLow;
  let highProduct = aHigh * bHigh;

  var result = vec2u(0u, lowProduct);
  result = fp64_u64_add(
    result,
    fp64_u64_shift_left(vec2u(0u, crossProduct), 16u)
  );
  result = fp64_u64_add(result, vec2u(highProduct, 0u));
  return result;
}

fn fp64_two_prod_integer_bits(aBits: u32, bBits: u32) -> vec2u {
  let a = fp64_decode_f32_bits(aBits);
  let b = fp64_decode_f32_bits(bBits);
  let resultSign = a.sign ^ b.sign;

  if (a.isNan || b.isNan || ((a.isZero || b.isZero) && (a.isInf || b.isInf))) {
    return vec2u(0x7fc00000u, 0u);
  }
  if (a.isInf || b.isInf) {
    return vec2u((resultSign << 31u) | 0x7f800000u, resultSign << 31u);
  }
  if (a.isZero || b.isZero) {
    return vec2u(resultSign << 31u, resultSign << 31u);
  }

  let magnitude = fp64_multiply_significands(a.significand, b.significand);
  return fp64_split_accumulator_bits(
    resultSign,
    magnitude,
    a.baseExponent + b.baseExponent
  );
}

fn fp64_two_prod_integer(a: f32, b: f32) -> vec2f {
  let resultBits = fp64_two_prod_integer_bits(bitcast<u32>(a), bitcast<u32>(b));
  return vec2f(bitcast<f32>(resultBits.x), bitcast<f32>(resultBits.y));
}

fn fp64_round_add_integer(a: f32, b: f32) -> f32 {
  return fp64_two_sum_integer(a, b).x;
}

fn fp64_round_mul_integer(a: f32, b: f32) -> f32 {
  return fp64_two_prod_integer(a, b).x;
}

#ifndef LUMA_FP64_PREDICATE_ONLY
fn fp64_f32_finite_exponent(value: Fp64F32Bits) -> i32 {
  let mostSignificantBit = 31u - countLeadingZeros(value.significand);
  return value.baseExponent + i32(mostSignificantBit);
}

fn fp64_scale_f32_integer(value: f32, exponent: i32) -> f32 {
  let decoded = fp64_decode_f32_bits(bitcast<u32>(value));
  if (decoded.isZero || decoded.isInf || decoded.isNan) {
    return value;
  }
  let resultBits = fp64_make_f32_bits_from_u64(
    decoded.sign,
    vec2u(0u, decoded.significand),
    decoded.baseExponent + exponent
  );
  return bitcast<f32>(resultBits);
}

// Divide normalized significands so the hardware operation cannot overflow,
// underflow, or flush a subnormal result. Reapply the exponent with integer
// packing, which also produces subnormal correction limbs without relying on
// floating-point arithmetic to preserve them.
fn fp64_divide_f32_integer(aValue: f32, bValue: f32) -> f32 {
  let a = fp64_decode_f32_bits(bitcast<u32>(aValue));
  let b = fp64_decode_f32_bits(bitcast<u32>(bValue));
  if (a.isZero || b.isZero || a.isInf || b.isInf || a.isNan || b.isNan) {
    return aValue / bValue;
  }

  let aMostSignificantBit = 31u - countLeadingZeros(a.significand);
  let bMostSignificantBit = 31u - countLeadingZeros(b.significand);
  let normalizedABits = fp64_make_f32_bits_from_u64(
    a.sign,
    vec2u(0u, a.significand),
    -i32(aMostSignificantBit)
  );
  let normalizedBBits = fp64_make_f32_bits_from_u64(
    b.sign,
    vec2u(0u, b.significand),
    -i32(bMostSignificantBit)
  );
  let normalizedQuotient = bitcast<f32>(normalizedABits) / bitcast<f32>(normalizedBBits);
  let quotient = fp64_decode_f32_bits(bitcast<u32>(normalizedQuotient));
  let exponentShift =
    a.baseExponent + i32(aMostSignificantBit) -
    b.baseExponent - i32(bMostSignificantBit);
  let quotientBits = fp64_make_f32_bits_from_u64(
    quotient.sign,
    vec2u(0u, quotient.significand),
    quotient.baseExponent + exponentShift
  );
  return bitcast<f32>(quotientBits);
}
#endif

#ifndef LUMA_FP64_PREDICATE_ONLY
fn split(a: f32) -> vec2f {
  let aBits = bitcast<u32>(a);
  let decoded = fp64_decode_f32_bits(aBits);
  if (decoded.isZero || decoded.isInf || decoded.isNan) {
    return vec2f(a, 0.0);
  }

  var roundedHigh = decoded.significand >> 12u;
  let remainder = decoded.significand & 0xfffu;
  if (remainder > 0x800u || (remainder == 0x800u && (roundedHigh & 1u) == 1u)) {
    roundedHigh = roundedHigh + 1u;
  }
  var highMagnitude = vec2u(0u, roundedHigh << 12u);
  var highBits = fp64_make_f32_bits_from_u64(
    decoded.sign,
    highMagnitude,
    decoded.baseExponent
  );
  // Rounding the high limb of a maximum-exponent value can overflow even
  // though the original value is finite. Truncate only in that boundary case
  // so split remains an exact finite decomposition.
  if (fp64_decode_f32_bits(highBits).isInf) {
    roundedHigh = decoded.significand >> 12u;
    highMagnitude = vec2u(0u, roundedHigh << 12u);
    highBits = fp64_make_f32_bits_from_u64(
      decoded.sign,
      highMagnitude,
      decoded.baseExponent
    );
  }
  let lowBits = fp64_make_residual_f32_bits(
    decoded.sign,
    vec2u(0u, decoded.significand),
    decoded.baseExponent,
    highBits
  );
  return vec2f(bitcast<f32>(highBits), bitcast<f32>(lowBits));
}

fn split2(a: vec2f) -> vec2f {
  var result = split(a.x);
  result.y = fp64_round_add_integer(result.y, a.y);
  return result;
}
#endif

#ifndef LUMA_FP64_PREDICATE_ONLY
fn quickTwoSum(a: f32, b: f32) -> vec2f {
  return fp64_two_sum_integer(a, b);
}
#endif

fn twoSum(a: f32, b: f32) -> vec2f {
  return fp64_two_sum_integer(a, b);
}

fn twoSub(a: f32, b: f32) -> vec2f {
  let bBits = bitcast<u32>(b) ^ 0x80000000u;
  let resultBits = fp64_two_sum_integer_bits(bitcast<u32>(a), bBits);
  return vec2f(bitcast<f32>(resultBits.x), bitcast<f32>(resultBits.y));
}

#ifndef LUMA_FP64_PREDICATE_ONLY
fn twoSqr(a: f32) -> vec2f {
  return fp64_two_prod_integer(a, a);
}

fn twoProd(a: f32, b: f32) -> vec2f {
  return fp64_two_prod_integer(a, b);
}
#endif

fn sum_fp64(a: vec2f, b: vec2f) -> vec2f {
  var sum = fp64_two_sum_integer(a.x, b.x);
  let lowSum = fp64_two_sum_integer(a.y, b.y);
  sum.y = fp64_round_add_integer(sum.y, lowSum.x);
  sum = fp64_two_sum_integer(sum.x, sum.y);
  sum.y = fp64_round_add_integer(sum.y, lowSum.y);
  return fp64_two_sum_integer(sum.x, sum.y);
}

fn sub_fp64(a: vec2f, b: vec2f) -> vec2f {
  let negatedB = vec2f(
    bitcast<f32>(bitcast<u32>(b.x) ^ 0x80000000u),
    bitcast<f32>(bitcast<u32>(b.y) ^ 0x80000000u)
  );
  return sum_fp64(a, negatedB);
}

fn mul_fp64(a: vec2f, b: vec2f) -> vec2f {
  var product = fp64_two_prod_integer(a.x, b.x);
  let crossProduct1 = fp64_round_mul_integer(a.x, b.y);
  product.y = fp64_round_add_integer(product.y, crossProduct1);
  product = fp64_two_sum_integer(product.x, product.y);
  let crossProduct2 = fp64_round_mul_integer(a.y, b.x);
  product.y = fp64_round_add_integer(product.y, crossProduct2);
  return fp64_two_sum_integer(product.x, product.y);
}

#ifndef LUMA_FP64_PREDICATE_ONLY
fn fp64_scale_fp64_integer(value: vec2f, exponent: i32) -> vec2f {
  let high = fp64_scale_f32_integer(value.x, exponent);
  let low = fp64_scale_f32_integer(value.y, exponent);
  return sum_fp64(vec2f(high, 0.0), vec2f(low, 0.0));
}

fn fp64_div_fp64_normalized(a: vec2f, b: vec2f) -> vec2f {
  let quotientHigh = fp64_divide_f32_integer(a.x, b.x);
  var quotient = vec2f(quotientHigh, 0.0);

  let remainder = sub_fp64(a, mul_fp64(b, quotient));
  let quotientLow = fp64_divide_f32_integer(remainder.x, b.x);
  quotient = sum_fp64(quotient, vec2f(quotientLow, 0.0));

  let secondRemainder = sub_fp64(a, mul_fp64(b, quotient));
  let correction = fp64_divide_f32_integer(secondRemainder.x, b.x);
  return sum_fp64(quotient, vec2f(correction, 0.0));
}

fn div_fp64(a: vec2f, b: vec2f) -> vec2f {
  let decodedA = fp64_decode_f32_bits(bitcast<u32>(a.x));
  let decodedB = fp64_decode_f32_bits(bitcast<u32>(b.x));
  if (
    decodedA.isZero || decodedB.isZero ||
    decodedA.isInf || decodedB.isInf ||
    decodedA.isNan || decodedB.isNan
  ) {
    return fp64_div_fp64_normalized(a, b);
  }

  let exponentA = fp64_f32_finite_exponent(decodedA);
  let exponentB = fp64_f32_finite_exponent(decodedB);
  // Correct the quotient near unity so b * q and the remainder stay clear of
  // both f32 underflow and overflow. The exponent difference is applied once.
  let normalizedA = fp64_scale_fp64_integer(a, -exponentA);
  let normalizedB = fp64_scale_fp64_integer(b, -exponentB);
  let normalizedQuotient = fp64_div_fp64_normalized(normalizedA, normalizedB);
  return fp64_scale_fp64_integer(normalizedQuotient, exponentA - exponentB);
}

fn fp64_sqrt_fp64_normalized(a: vec2f) -> vec2f {
  let estimate = sqrt(a.x);
  let difference = sub_fp64(a, fp64_two_prod_integer(estimate, estimate)).x;
  let denominator = fp64_round_add_integer(estimate, estimate);
  let correction = fp64_divide_f32_integer(difference, denominator);
  return sum_fp64(vec2f(estimate, 0.0), vec2f(correction, 0.0));
}

fn sqrt_fp64(a: vec2f) -> vec2f {
  let decoded = fp64_decode_f32_bits(bitcast<u32>(a.x));
  let decodedLow = fp64_decode_f32_bits(bitcast<u32>(a.y));
  if (decoded.isZero && decodedLow.isZero) {
    return vec2f(0.0, 0.0);
  }
  if (decoded.sign == 1u) {
    let nanValue = fp64_nan(a.x);
    return vec2f(nanValue, nanValue);
  }

  if (decoded.isInf || decoded.isNan) {
    return fp64_sqrt_fp64_normalized(a);
  }
  let exponent = fp64_f32_finite_exponent(decoded);
  // An even scale lets the final square-root rescale use an integer exponent.
  let evenExponent = exponent - (exponent & 1);
  let normalizedA = fp64_scale_fp64_integer(a, -evenExponent);
  let normalizedRoot = fp64_sqrt_fp64_normalized(normalizedA);
  return fp64_scale_fp64_integer(normalizedRoot, evenExponent / 2);
}
#endif
`,jr=`struct Fp64ArithmeticUniforms {
  ONE: f32,
  SPLIT: f32,
};

@group(0) @binding(auto) var<uniform> fp64arithmetic : Fp64ArithmeticUniforms;

#ifndef LUMA_FP64_F32_INPUT_ONLY
struct Fp64Bits {
  sign: u32,
  exponent: i32,
  significand: vec2u,
  isZero: bool,
  isInf: bool,
  isNan: bool,
};
#endif

#ifndef LUMA_FP64_PREDICATE_ONLY
fn fp64_nan(seed: f32) -> f32 {
  let nanBits = 0x7fc00000u | select(0u, 1u, seed < 0.0);
  return bitcast<f32>(nanBits);
}
#endif

fn fp64_u64_is_zero(value: vec2u) -> bool {
  return value.x == 0u && value.y == 0u;
}

fn fp64_u64_compare(a: vec2u, b: vec2u) -> i32 {
  if (a.x != b.x) {
    return select(-1, 1, a.x > b.x);
  }
  if (a.y != b.y) {
    return select(-1, 1, a.y > b.y);
  }
  return 0;
}

fn fp64_u64_add(a: vec2u, b: vec2u) -> vec2u {
  let low = a.y + b.y;
  let carry = select(0u, 1u, low < a.y);
  return vec2u(a.x + b.x + carry, low);
}

fn fp64_u64_sub(a: vec2u, b: vec2u) -> vec2u {
  let borrow = select(0u, 1u, a.y < b.y);
  return vec2u(a.x - b.x - borrow, a.y - b.y);
}

fn fp64_u64_shift_left(value: vec2u, shift: u32) -> vec2u {
  if (shift == 0u) {
    return value;
  }
  if (shift < 32u) {
    return vec2u((value.x << shift) | (value.y >> (32u - shift)), value.y << shift);
  }
  if (shift == 32u) {
    return vec2u(value.y, 0u);
  }
  if (shift < 64u) {
    return vec2u(value.y << (shift - 32u), 0u);
  }
  return vec2u(0u);
}

fn fp64_u64_shift_right(value: vec2u, shift: u32) -> vec2u {
  if (shift == 0u) {
    return value;
  }
  if (shift < 32u) {
    return vec2u(value.x >> shift, (value.y >> shift) | (value.x << (32u - shift)));
  }
  if (shift == 32u) {
    return vec2u(0u, value.x);
  }
  if (shift < 64u) {
    return vec2u(0u, value.x >> (shift - 32u));
  }
  return vec2u(0u);
}

fn fp64_u64_get_bit(value: vec2u, bitIndex: u32) -> bool {
  if (bitIndex >= 64u) {
    return false;
  }
  if (bitIndex >= 32u) {
    return ((value.x >> (bitIndex - 32u)) & 1u) != 0u;
  }
  return ((value.y >> bitIndex) & 1u) != 0u;
}

fn fp64_u64_has_bits_below(value: vec2u, bitCount: u32) -> bool {
  if (bitCount == 0u) {
    return false;
  }
  if (bitCount >= 64u) {
    return !fp64_u64_is_zero(value);
  }
  if (bitCount > 32u) {
    let highBitCount = bitCount - 32u;
    let highMask = (1u << highBitCount) - 1u;
    return value.y != 0u || (value.x & highMask) != 0u;
  }
  if (bitCount == 32u) {
    return value.y != 0u;
  }
  let lowMask = (1u << bitCount) - 1u;
  return (value.y & lowMask) != 0u;
}

#ifndef LUMA_FP64_F32_INPUT_ONLY
fn fp64_u64_shift_right_sticky(value: vec2u, shift: u32) -> vec2u {
  var shifted = fp64_u64_shift_right(value, shift);
  if (fp64_u64_has_bits_below(value, shift)) {
    shifted.y = shifted.y | 1u;
  }
  return shifted;
}
#endif

fn fp64_u64_count_leading_zeros(value: vec2u) -> u32 {
  if (value.x != 0u) {
    return countLeadingZeros(value.x);
  }
  return 32u + countLeadingZeros(value.y);
}

fn fp64_round_shift_right_to_u32(value: vec2u, shift: u32) -> u32 {
  if (shift == 0u) {
    return value.y;
  }

  let truncated = fp64_u64_shift_right(value, shift);
  var rounded = truncated.y;
  let guard = fp64_u64_get_bit(value, shift - 1u);
  let hasTrailingBits = fp64_u64_has_bits_below(value, shift - 1u);
  if (guard && (hasTrailingBits || (rounded & 1u) == 1u)) {
    rounded = rounded + 1u;
  }
  return rounded;
}

#ifndef LUMA_FP64_F32_INPUT_ONLY
fn fp64_round_shift_right(value: vec2u, shift: u32) -> vec2u {
  if (shift == 0u) {
    return value;
  }

  var rounded = fp64_u64_shift_right(value, shift);
  let guard = fp64_u64_get_bit(value, shift - 1u);
  let hasTrailingBits = fp64_u64_has_bits_below(value, shift - 1u);
  if (guard && (hasTrailingBits || (rounded.y & 1u) == 1u)) {
    rounded = fp64_u64_add(rounded, vec2u(0u, 1u));
  }
  return rounded;
}
#endif

fn fp64_make_f32_bits_from_u64(sign: u32, significand: vec2u, baseExponent: i32) -> u32 {
  if (fp64_u64_is_zero(significand)) {
    return sign << 31u;
  }

  let leadingZeros = fp64_u64_count_leading_zeros(significand);
  let mostSignificantBit = 63u - leadingZeros;
  var exponent = baseExponent + i32(mostSignificantBit);

  if (exponent > 127) {
    return (sign << 31u) | 0x7f800000u;
  }

  if (exponent >= -126) {
    let shift = i32(mostSignificantBit) - 23;
    var significand24: u32;
    if (shift > 0) {
      significand24 = fp64_round_shift_right_to_u32(significand, u32(shift));
    } else {
      significand24 = fp64_u64_shift_left(significand, u32(-shift)).y;
    }

    if (significand24 >= 0x1000000u) {
      significand24 = significand24 >> 1u;
      exponent = exponent + 1;
      if (exponent > 127) {
        return (sign << 31u) | 0x7f800000u;
      }
    }

    return (sign << 31u) | (u32(exponent + 127) << 23u) | (significand24 & 0x7fffffu);
  }

  let scaleExponent = baseExponent + 149;
  var mantissa: u32;
  if (scaleExponent >= 0) {
    mantissa = fp64_u64_shift_left(significand, u32(scaleExponent)).y;
  } else {
    mantissa = fp64_round_shift_right_to_u32(significand, u32(-scaleExponent));
  }

  if (mantissa >= 0x800000u) {
    return (sign << 31u) | 0x00800000u;
  }
  return (sign << 31u) | mantissa;
}

#ifndef LUMA_FP64_F32_INPUT_ONLY
fn fp64_decode_bits(bits: vec2u) -> Fp64Bits {
  let sign = bits.x >> 31u;
  let exponentBits = (bits.x >> 20u) & 0x7ffu;
  let fractionHigh = bits.x & 0xfffffu;
  let fractionLow = bits.y;
  let fraction = vec2u(fractionHigh, fractionLow);

  if (exponentBits == 0x7ffu) {
    let isInf = fp64_u64_is_zero(fraction);
    return Fp64Bits(sign, 0, vec2u(0u), false, isInf, !isInf);
  }

  if (exponentBits == 0u) {
    let isZero = fp64_u64_is_zero(fraction);
    return Fp64Bits(sign, -1022, fraction, isZero, false, false);
  }

  return Fp64Bits(sign, i32(exponentBits) - 1023, vec2u((1u << 20u) | fractionHigh, fractionLow), false, false, false);
}

fn fp64_finite_magnitude_compare(a: Fp64Bits, b: Fp64Bits) -> i32 {
  if (a.exponent != b.exponent) {
    return select(-1, 1, a.exponent > b.exponent);
  }
  return fp64_u64_compare(a.significand, b.significand);
}
#endif

#ifndef LUMA_FP64_F32_INPUT_ONLY
struct Fp64RawF32Bits {
  sign: u32,
  baseExponent: i32,
  significand: u32,
  isZero: bool,
  isInf: bool,
  isNan: bool,
};

// Decode an f32 as (-1)^sign * significand * 2^baseExponent. This shared
// integer representation lets normalization remain independent of the
// selected double-single arithmetic implementation.
fn fp64_decode_raw_f32_bits(bits: u32) -> Fp64RawF32Bits {
  let sign = bits >> 31u;
  let exponentBits = (bits >> 23u) & 0xffu;
  let fraction = bits & 0x7fffffu;

  if (exponentBits == 0xffu) {
    return Fp64RawF32Bits(sign, 0, 0u, false, fraction == 0u, fraction != 0u);
  }
  if (exponentBits == 0u) {
    return Fp64RawF32Bits(sign, -149, fraction, fraction == 0u, false, false);
  }
  return Fp64RawF32Bits(
    sign,
    i32(exponentBits) - 150,
    0x800000u | fraction,
    false,
    false,
    false
  );
}

fn fp64_raw_f32_magnitude_compare(aBits: u32, bBits: u32) -> i32 {
  let aMagnitude = aBits & 0x7fffffffu;
  let bMagnitude = bBits & 0x7fffffffu;
  if (aMagnitude == bMagnitude) {
    return 0;
  }
  return select(-1, 1, aMagnitude > bMagnitude);
}

fn fp64_make_raw_residual_f32_bits(
  exactSign: u32,
  exactMagnitude: vec2u,
  exactBaseExponent: i32,
  highBits: u32
) -> u32 {
  if (fp64_u64_is_zero(exactMagnitude)) {
    return 0u;
  }

  let high = fp64_decode_raw_f32_bits(highBits);
  if (high.isInf || high.isNan) {
    return 0u;
  }
  if (high.isZero) {
    return fp64_make_f32_bits_from_u64(exactSign, exactMagnitude, exactBaseExponent);
  }

  let commonBaseExponent = min(exactBaseExponent, high.baseExponent);
  let exactShift = exactBaseExponent - commonBaseExponent;
  let highShift = high.baseExponent - commonBaseExponent;
  if (exactShift >= 64 || highShift >= 64) {
    return 0u;
  }

  let exactAligned = fp64_u64_shift_left(exactMagnitude, u32(exactShift));
  let highAligned = fp64_u64_shift_left(vec2u(0u, high.significand), u32(highShift));
  let comparison = fp64_u64_compare(exactAligned, highAligned);
  if (comparison == 0) {
    return 0u;
  }

  var residualSign = exactSign;
  var residualMagnitude: vec2u;
  if (comparison > 0) {
    residualMagnitude = fp64_u64_sub(exactAligned, highAligned);
  } else {
    residualSign = exactSign ^ 1u;
    residualMagnitude = fp64_u64_sub(highAligned, exactAligned);
  }
  return fp64_make_f32_bits_from_u64(
    residualSign,
    residualMagnitude,
    commonBaseExponent
  );
}

fn fp64_split_raw_accumulator_bits(
  sign: u32,
  magnitude: vec2u,
  baseExponent: i32
) -> vec2u {
  if (fp64_u64_is_zero(magnitude)) {
    return vec2u(0u);
  }
  let highBits = fp64_make_f32_bits_from_u64(sign, magnitude, baseExponent);
  let rawLowBits = fp64_make_raw_residual_f32_bits(sign, magnitude, baseExponent, highBits);
  let lowBits = select(rawLowBits, 0u, (rawLowBits & 0x7fffffffu) == 0u);
  if ((highBits & 0x7fffffffu) == 0u && (lowBits & 0x7fffffffu) == 0u) {
    return vec2u(0u);
  }
  return vec2u(highBits, lowBits);
}
#endif

#ifndef LUMA_FP64_F32_INPUT_ONLY
// Round an arithmetic accumulator to binary64 before splitting it. The
// aligned add/subtract paths retain three guard bits plus a sticky bit, which
// is sufficient for round-to-nearest-even at the binary64 boundary.
fn fp64_split_binary64_accumulator_bits(
  sign: u32,
  magnitude: vec2u,
  baseExponent: i32
) -> vec2u {
  if (fp64_u64_is_zero(magnitude)) {
    return vec2u(0u);
  }

  let mostSignificantBit = 63u - fp64_u64_count_leading_zeros(magnitude);
  let exponent = baseExponent + i32(mostSignificantBit);
  if (exponent > 1023) {
    return vec2u((sign << 31u) | 0x7f800000u, 0u);
  }

  var roundedMagnitude = magnitude;
  var roundedBaseExponent = baseExponent;
  if (exponent >= -1022) {
    if (mostSignificantBit > 52u) {
      let shift = mostSignificantBit - 52u;
      roundedMagnitude = fp64_round_shift_right(magnitude, shift);
      roundedBaseExponent = baseExponent + i32(shift);
    }
  } else {
    let shift = -1074 - baseExponent;
    if (shift > 0) {
      roundedMagnitude = fp64_round_shift_right(magnitude, u32(shift));
      roundedBaseExponent = -1074;
    }
  }

  if (fp64_u64_is_zero(roundedMagnitude)) {
    return vec2u(0u);
  }
  return fp64_split_raw_accumulator_bits(sign, roundedMagnitude, roundedBaseExponent);
}
#endif

#ifndef LUMA_FP64_PREDICATE_ONLY
fn fp64_add_raw_f32_bits(aBits: u32, bBits: u32) -> vec2u {
  let a = fp64_decode_raw_f32_bits(aBits);
  let b = fp64_decode_raw_f32_bits(bBits);

  if (a.isNan || b.isNan) {
    return vec2u(0x7fc00000u, 0u);
  }
  if (a.isInf || b.isInf) {
    if (a.isInf && b.isInf && a.sign != b.sign) {
      return vec2u(0x7fc00000u, 0u);
    }
    return select(vec2u(bBits, 0u), vec2u(aBits, 0u), a.isInf);
  }
  if (a.isZero && b.isZero) {
    return vec2u(0u);
  }
  if (a.isZero) {
    return vec2u(bBits, 0u);
  }
  if (b.isZero) {
    return vec2u(aBits, 0u);
  }

  let exponentDifference = abs(a.baseExponent - b.baseExponent);
  if (exponentDifference > 25) {
    if (fp64_raw_f32_magnitude_compare(aBits, bBits) >= 0) {
      return vec2u(aBits, bBits);
    }
    return vec2u(bBits, aBits);
  }

  let commonBaseExponent = min(a.baseExponent, b.baseExponent);
  let aMagnitude = fp64_u64_shift_left(
    vec2u(0u, a.significand),
    u32(a.baseExponent - commonBaseExponent)
  );
  let bMagnitude = fp64_u64_shift_left(
    vec2u(0u, b.significand),
    u32(b.baseExponent - commonBaseExponent)
  );

  var resultSign = a.sign;
  var resultMagnitude: vec2u;
  if (a.sign == b.sign) {
    resultMagnitude = fp64_u64_add(aMagnitude, bMagnitude);
  } else {
    let comparison = fp64_u64_compare(aMagnitude, bMagnitude);
    if (comparison == 0) {
      return vec2u(0u);
    }
    if (comparison > 0) {
      resultMagnitude = fp64_u64_sub(aMagnitude, bMagnitude);
    } else {
      resultSign = b.sign;
      resultMagnitude = fp64_u64_sub(bMagnitude, aMagnitude);
    }
  }

  return fp64_split_raw_accumulator_bits(
    resultSign,
    resultMagnitude,
    commonBaseExponent
  );
}
#endif

#ifndef LUMA_FP64_F32_INPUT_ONLY
fn fp64_add_aligned_magnitudes_to_fp64_bits(
  sign: u32,
  larger: Fp64Bits,
  smaller: Fp64Bits
) -> vec2u {
  let largeSignificand = fp64_u64_shift_left(larger.significand, 3u);
  let smallSignificand = fp64_u64_shift_right_sticky(
    fp64_u64_shift_left(smaller.significand, 3u),
    u32(larger.exponent - smaller.exponent)
  );
  let resultSignificand = fp64_u64_add(largeSignificand, smallSignificand);
  return fp64_split_binary64_accumulator_bits(
    sign,
    resultSignificand,
    larger.exponent - 55
  );
}

fn fp64_sub_aligned_magnitudes_to_fp64_bits(
  sign: u32,
  larger: Fp64Bits,
  smaller: Fp64Bits
) -> vec2u {
  let largeSignificand = fp64_u64_shift_left(larger.significand, 3u);
  let smallSignificand = fp64_u64_shift_right_sticky(
    fp64_u64_shift_left(smaller.significand, 3u),
    u32(larger.exponent - smaller.exponent)
  );
  let resultSignificand = fp64_u64_sub(largeSignificand, smallSignificand);
  return fp64_split_binary64_accumulator_bits(
    sign,
    resultSignificand,
    larger.exponent - 55
  );
}

fn fp64_add_aligned_magnitudes_to_f32_bits(sign: u32, larger: Fp64Bits, smaller: Fp64Bits) -> u32 {
  let largeSignificand = fp64_u64_shift_left(larger.significand, 3u);
  let smallSignificand = fp64_u64_shift_right_sticky(
    fp64_u64_shift_left(smaller.significand, 3u),
    u32(larger.exponent - smaller.exponent)
  );
  let resultSignificand = fp64_u64_add(largeSignificand, smallSignificand);
  return fp64_make_f32_bits_from_u64(sign, resultSignificand, larger.exponent - 55);
}

fn fp64_sub_aligned_magnitudes_to_f32_bits(sign: u32, larger: Fp64Bits, smaller: Fp64Bits) -> u32 {
  let largeSignificand = fp64_u64_shift_left(larger.significand, 3u);
  let smallSignificand = fp64_u64_shift_right_sticky(
    fp64_u64_shift_left(smaller.significand, 3u),
    u32(larger.exponent - smaller.exponent)
  );
  let resultSignificand = fp64_u64_sub(largeSignificand, smallSignificand);
  return fp64_make_f32_bits_from_u64(sign, resultSignificand, larger.exponent - 55);
}

// Subtract two raw binary64 values and round the exact result once to f32.
// The input words are canonical high/low words: .x contains sign/exponent/high
// fraction bits, and .y contains the low 32 fraction bits.
fn sub_fp64u32_to_f32_bits(aBits: vec2u, bBits: vec2u) -> u32 {
  let a = fp64_decode_bits(aBits);
  let b = fp64_decode_bits(bBits);
  let bSubtractionSign = b.sign ^ 1u;

  if (a.isNan || b.isNan) {
    return 0x7fc00000u;
  }
  if (a.isInf && b.isInf) {
    if (a.sign == bSubtractionSign) {
      return (a.sign << 31u) | 0x7f800000u;
    }
    return 0x7fc00000u;
  }
  if (a.isInf) {
    return (a.sign << 31u) | 0x7f800000u;
  }
  if (b.isInf) {
    return (bSubtractionSign << 31u) | 0x7f800000u;
  }
  if (a.isZero && b.isZero) {
    return select(0u, 0x80000000u, a.sign == 1u && b.sign == 0u);
  }

  let magnitudeComparison = fp64_finite_magnitude_compare(a, b);
  if (a.sign == bSubtractionSign) {
    if (magnitudeComparison >= 0) {
      return fp64_add_aligned_magnitudes_to_f32_bits(a.sign, a, b);
    }
    return fp64_add_aligned_magnitudes_to_f32_bits(a.sign, b, a);
  }

  if (magnitudeComparison == 0) {
    return 0u;
  }
  if (magnitudeComparison > 0) {
    return fp64_sub_aligned_magnitudes_to_f32_bits(a.sign, a, b);
  }
  return fp64_sub_aligned_magnitudes_to_f32_bits(bSubtractionSign, b, a);
}

fn sub_fp64u32_to_f32(aBits: vec2u, bBits: vec2u) -> f32 {
  return bitcast<f32>(sub_fp64u32_to_f32_bits(aBits, bBits));
}

// Subtract two raw binary64 values, round once to binary64, then split the
// result into normalized f32 limbs. Finite results must fit within the f32
// exponent range; larger magnitudes map to infinity and smaller magnitudes
// map to zero. The input words use canonical high/low word order.
fn sub_fp64u32_to_fp64_bits(aBits: vec2u, bBits: vec2u) -> vec2u {
  let a = fp64_decode_bits(aBits);
  let b = fp64_decode_bits(bBits);
  let bSubtractionSign = b.sign ^ 1u;

  if (a.isNan || b.isNan) {
    return vec2u(0x7fc00000u, 0u);
  }
  if (a.isInf && b.isInf) {
    if (a.sign == bSubtractionSign) {
      return vec2u((a.sign << 31u) | 0x7f800000u, 0u);
    }
    return vec2u(0x7fc00000u, 0u);
  }
  if (a.isInf) {
    return vec2u((a.sign << 31u) | 0x7f800000u, 0u);
  }
  if (b.isInf) {
    return vec2u((bSubtractionSign << 31u) | 0x7f800000u, 0u);
  }
  if (a.isZero && b.isZero) {
    return vec2u(0u);
  }

  let magnitudeComparison = fp64_finite_magnitude_compare(a, b);
  if (a.sign == bSubtractionSign) {
    if (magnitudeComparison >= 0) {
      return fp64_add_aligned_magnitudes_to_fp64_bits(a.sign, a, b);
    }
    return fp64_add_aligned_magnitudes_to_fp64_bits(a.sign, b, a);
  }

  if (magnitudeComparison == 0) {
    return vec2u(0u);
  }
  if (magnitudeComparison > 0) {
    return fp64_sub_aligned_magnitudes_to_fp64_bits(a.sign, a, b);
  }
  return fp64_sub_aligned_magnitudes_to_fp64_bits(bSubtractionSign, b, a);
}

fn sub_fp64u32_to_fp64(aBits: vec2u, bBits: vec2u) -> vec2f {
  let resultBits = sub_fp64u32_to_fp64_bits(aBits, bBits);
  return vec2f(bitcast<f32>(resultBits.x), bitcast<f32>(resultBits.y));
}
#endif

#ifndef LUMA_FP64_PREDICATE_ONLY
fn fp64_runtime_zero() -> f32 {
  return fp64arithmetic.ONE * 0.0;
}

fn prevent_fp64_optimization(value: f32) -> f32 {
#ifdef LUMA_FP64_CODE_ELIMINATION_WORKAROUND
  return value + fp64_runtime_zero();
#else
  return value;
#endif
}
#endif

#ifdef LUMA_FP64_INTEGER_ARITHMETIC
${$r}
#else
fn split(a: f32) -> vec2f {
  let splitValue = prevent_fp64_optimization(fp64arithmetic.SPLIT + fp64_runtime_zero());
  let t = prevent_fp64_optimization(a * splitValue);
  let temp = prevent_fp64_optimization(t - a);
  let aHi = prevent_fp64_optimization(t - temp);
  let aLo = prevent_fp64_optimization(a - aHi);
  return vec2f(aHi, aLo);
}

fn split2(a: vec2f) -> vec2f {
  var b = split(a.x);
  b.y = b.y + a.y;
  return b;
}

fn quickTwoSum(a: f32, b: f32) -> vec2f {
#ifdef LUMA_FP64_CODE_ELIMINATION_WORKAROUND
  let sum = prevent_fp64_optimization((a + b) * fp64arithmetic.ONE);
  let err = prevent_fp64_optimization(b - (sum - a) * fp64arithmetic.ONE);
#else
  let sum = prevent_fp64_optimization(a + b);
  let err = prevent_fp64_optimization(b - (sum - a));
#endif
  return vec2f(sum, err);
}

fn twoSum(a: f32, b: f32) -> vec2f {
  let s = prevent_fp64_optimization(a + b);
#ifdef LUMA_FP64_CODE_ELIMINATION_WORKAROUND
  let v = prevent_fp64_optimization((s * fp64arithmetic.ONE - a) * fp64arithmetic.ONE);
  let err =
    prevent_fp64_optimization((a - (s - v) * fp64arithmetic.ONE) *
      fp64arithmetic.ONE *
      fp64arithmetic.ONE *
      fp64arithmetic.ONE) +
    prevent_fp64_optimization(b - v);
#else
  let v = prevent_fp64_optimization(s - a);
  let err = prevent_fp64_optimization(a - (s - v)) + prevent_fp64_optimization(b - v);
#endif
  return vec2f(s, err);
}

fn twoSub(a: f32, b: f32) -> vec2f {
  let s = prevent_fp64_optimization(a - b);
#ifdef LUMA_FP64_CODE_ELIMINATION_WORKAROUND
  let v = prevent_fp64_optimization((s * fp64arithmetic.ONE - a) * fp64arithmetic.ONE);
  let err =
    prevent_fp64_optimization((a - (s - v) * fp64arithmetic.ONE) *
      fp64arithmetic.ONE *
      fp64arithmetic.ONE *
      fp64arithmetic.ONE) -
    prevent_fp64_optimization(b + v);
#else
  let v = prevent_fp64_optimization(s - a);
  let err = prevent_fp64_optimization(a - (s - v)) - prevent_fp64_optimization(b + v);
#endif
  return vec2f(s, err);
}

fn twoSqr(a: f32) -> vec2f {
  let prod = prevent_fp64_optimization(a * a);
  let aFp64 = split(a);
  let highProduct = prevent_fp64_optimization(aFp64.x * aFp64.x);
  let crossProduct = prevent_fp64_optimization(2.0 * aFp64.x * aFp64.y);
  let lowProduct = prevent_fp64_optimization(aFp64.y * aFp64.y);
#ifdef LUMA_FP64_CODE_ELIMINATION_WORKAROUND
  let err =
    (prevent_fp64_optimization(highProduct - prod) * fp64arithmetic.ONE +
      crossProduct * fp64arithmetic.ONE * fp64arithmetic.ONE) +
    lowProduct * fp64arithmetic.ONE * fp64arithmetic.ONE * fp64arithmetic.ONE;
#else
  let err = ((prevent_fp64_optimization(highProduct - prod) + crossProduct) + lowProduct);
#endif
  return vec2f(prod, err);
}

fn twoProd(a: f32, b: f32) -> vec2f {
  let prod = prevent_fp64_optimization(a * b);
  let aFp64 = split(a);
  let bFp64 = split(b);
  let highProduct = prevent_fp64_optimization(aFp64.x * bFp64.x);
  let crossProduct1 = prevent_fp64_optimization(aFp64.x * bFp64.y);
  let crossProduct2 = prevent_fp64_optimization(aFp64.y * bFp64.x);
  let lowProduct = prevent_fp64_optimization(aFp64.y * bFp64.y);
#ifdef LUMA_FP64_CODE_ELIMINATION_WORKAROUND
  let err1 = (highProduct - prod) * fp64arithmetic.ONE;
  let err2 = crossProduct1 * fp64arithmetic.ONE * fp64arithmetic.ONE;
  let err3 = crossProduct2 * fp64arithmetic.ONE * fp64arithmetic.ONE * fp64arithmetic.ONE;
  let err4 =
    lowProduct *
    fp64arithmetic.ONE *
    fp64arithmetic.ONE *
    fp64arithmetic.ONE *
    fp64arithmetic.ONE;
#else
  let err1 = highProduct - prod;
  let err2 = crossProduct1;
  let err3 = crossProduct2;
  let err4 = lowProduct;
#endif
  let err12InputA = prevent_fp64_optimization(err1);
  let err12InputB = prevent_fp64_optimization(err2);
  let err12 = prevent_fp64_optimization(err12InputA + err12InputB);
  let err123InputA = prevent_fp64_optimization(err12);
  let err123InputB = prevent_fp64_optimization(err3);
  let err123 = prevent_fp64_optimization(err123InputA + err123InputB);
  let err1234InputA = prevent_fp64_optimization(err123);
  let err1234InputB = prevent_fp64_optimization(err4);
  let err = prevent_fp64_optimization(err1234InputA + err1234InputB);
  return vec2f(prod, err);
}

fn sum_fp64(a: vec2f, b: vec2f) -> vec2f {
  var s = twoSum(a.x, b.x);
  let t = twoSum(a.y, b.y);
  s.y = prevent_fp64_optimization(s.y + t.x);
  s = quickTwoSum(s.x, s.y);
  s.y = prevent_fp64_optimization(s.y + t.y);
  s = quickTwoSum(s.x, s.y);
  return s;
}

fn sub_fp64(a: vec2f, b: vec2f) -> vec2f {
  var s = twoSub(a.x, b.x);
  let t = twoSub(a.y, b.y);
  s.y = prevent_fp64_optimization(s.y + t.x);
  s = quickTwoSum(s.x, s.y);
  s.y = prevent_fp64_optimization(s.y + t.y);
  s = quickTwoSum(s.x, s.y);
  return s;
}

fn mul_fp64(a: vec2f, b: vec2f) -> vec2f {
  var prod = twoProd(a.x, b.x);
  let crossProduct1 = prevent_fp64_optimization(a.x * b.y);
  prod.y = prevent_fp64_optimization(prod.y + crossProduct1);
#ifdef LUMA_FP64_HIGH_BITS_OVERFLOW_WORKAROUND
  prod = split2(prod);
#endif
  prod = quickTwoSum(prod.x, prod.y);
  let crossProduct2 = prevent_fp64_optimization(a.y * b.x);
  prod.y = prevent_fp64_optimization(prod.y + crossProduct2);
#ifdef LUMA_FP64_HIGH_BITS_OVERFLOW_WORKAROUND
  prod = split2(prod);
#endif
  prod = quickTwoSum(prod.x, prod.y);
  return prod;
}

#ifndef LUMA_FP64_PREDICATE_ONLY
fn div_fp64(a: vec2f, b: vec2f) -> vec2f {
  let xn = prevent_fp64_optimization(1.0 / b.x);
  let yn = mul_fp64(a, vec2f(xn, fp64_runtime_zero()));
  let diff = prevent_fp64_optimization(sub_fp64(a, mul_fp64(b, yn)).x);
  let prod = twoProd(xn, diff);
  return sum_fp64(yn, prod);
}

fn sqrt_fp64(a: vec2f) -> vec2f {
  if (a.x == 0.0 && a.y == 0.0) {
    return vec2f(0.0, 0.0);
  }
  if (a.x < 0.0) {
    let nanValue = fp64_nan(a.x);
    return vec2f(nanValue, nanValue);
  }

  let x = prevent_fp64_optimization(1.0 / sqrt(a.x));
  let yn = prevent_fp64_optimization(a.x * x);
#ifdef LUMA_FP64_CODE_ELIMINATION_WORKAROUND
  let ynSqr = twoSqr(yn) * fp64arithmetic.ONE;
#else
  let ynSqr = twoSqr(yn);
#endif
  let diff = prevent_fp64_optimization(sub_fp64(a, ynSqr).x);
  let prod = twoProd(prevent_fp64_optimization(x * 0.5), diff);
#ifdef LUMA_FP64_HIGH_BITS_OVERFLOW_WORKAROUND
  return sum_fp64(split(yn), prod);
#else
  return sum_fp64(vec2f(yn, 0.0), prod);
#endif
}
#endif
#endif

#ifndef LUMA_FP64_PREDICATE_ONLY
fn fp64_f32_bits_is_nan(bits: u32) -> bool {
  return (bits & 0x7fffffffu) > 0x7f800000u;
}

fn fp64_f32_bits_is_inf(bits: u32) -> bool {
  return (bits & 0x7fffffffu) == 0x7f800000u;
}

fn fp64_compare_f32_bits(aBits: u32, bBits: u32) -> i32 {
  let aMagnitude = aBits & 0x7fffffffu;
  let bMagnitude = bBits & 0x7fffffffu;
  if (aMagnitude == 0u && bMagnitude == 0u) {
    return 0;
  }
  let aSign = aBits >> 31u;
  let bSign = bBits >> 31u;
  if (aSign != bSign) {
    return select(1, -1, aSign == 1u);
  }
  if (aMagnitude == bMagnitude) {
    return 0;
  }
  let magnitudeComparison = select(-1, 1, aMagnitude > bMagnitude);
  return select(magnitudeComparison, -magnitudeComparison, aSign == 1u);
}

// Normalize an arbitrary pair of finite f32 limbs with integer accumulation.
// This is independent of LUMA_FP64_INTEGER_ARITHMETIC and canonicalizes every
// representation of zero to vec2f(+0.0, +0.0).
fn normalize_fp64(value: vec2f) -> vec2f {
  let resultBits = fp64_add_raw_f32_bits(bitcast<u32>(value.x), bitcast<u32>(value.y));
  return vec2f(bitcast<f32>(resultBits.x), bitcast<f32>(resultBits.y));
}

fn is_nan_fp64(value: vec2f) -> bool {
  let normalized = normalize_fp64(value);
  return fp64_f32_bits_is_nan(bitcast<u32>(normalized.x)) ||
    fp64_f32_bits_is_nan(bitcast<u32>(normalized.y));
}

fn is_finite_fp64(value: vec2f) -> bool {
  let normalized = normalize_fp64(value);
  let highBits = bitcast<u32>(normalized.x);
  let lowBits = bitcast<u32>(normalized.y);
  return !fp64_f32_bits_is_nan(highBits) && !fp64_f32_bits_is_nan(lowBits) &&
    !fp64_f32_bits_is_inf(highBits) && !fp64_f32_bits_is_inf(lowBits);
}

// Returns -1, 0, or 1. NaN is unordered and returns 0; call is_nan_fp64 or
// is_finite_fp64 first when 0 must mean a finite zero.
fn sign_fp64(value: vec2f) -> i32 {
  let normalized = normalize_fp64(value);
  let highBits = bitcast<u32>(normalized.x);
  let lowBits = bitcast<u32>(normalized.y);
  if (fp64_f32_bits_is_nan(highBits) || fp64_f32_bits_is_nan(lowBits)) {
    return 0;
  }
  if ((highBits & 0x7fffffffu) != 0u) {
    return select(1, -1, (highBits >> 31u) == 1u);
  }
  if ((lowBits & 0x7fffffffu) != 0u) {
    return select(1, -1, (lowBits >> 31u) == 1u);
  }
  return 0;
}

// Compares double-single values and returns -1, 0, or 1. NaN is unordered
// and returns 0; callers that require equality semantics must first check
// is_nan_fp64 or is_finite_fp64.
fn compare_fp64(a: vec2f, b: vec2f) -> i32 {
  let normalizedA = normalize_fp64(a);
  let normalizedB = normalize_fp64(b);
  let aHighBits = bitcast<u32>(normalizedA.x);
  let aLowBits = bitcast<u32>(normalizedA.y);
  let bHighBits = bitcast<u32>(normalizedB.x);
  let bLowBits = bitcast<u32>(normalizedB.y);
  if (fp64_f32_bits_is_nan(aHighBits) || fp64_f32_bits_is_nan(aLowBits) ||
      fp64_f32_bits_is_nan(bHighBits) || fp64_f32_bits_is_nan(bLowBits)) {
    return 0;
  }
  let highComparison = fp64_compare_f32_bits(aHighBits, bHighBits);
  if (highComparison != 0) {
    return highComparison;
  }
  return fp64_compare_f32_bits(aLowBits, bLowBits);
}
#endif
`,qr=`const vec2 E_FP64 = vec2(2.7182817459106445e+00, 8.254840366817007e-08);
const vec2 LOG2_FP64 = vec2(0.6931471824645996e+00, -1.9046542121259336e-09);
const vec2 PI_FP64 = vec2(3.1415927410125732, -8.742278012618954e-8);
const vec2 TWO_PI_FP64 = vec2(6.2831854820251465, -1.7484556025237907e-7);
const vec2 PI_2_FP64 = vec2(1.5707963705062866, -4.371139006309477e-8);
const vec2 PI_4_FP64 = vec2(0.7853981852531433, -2.1855695031547384e-8);
const vec2 PI_16_FP64 = vec2(0.19634954631328583, -5.463923757886846e-9);
const vec2 PI_16_2_FP64 = vec2(0.39269909262657166, -1.0927847515773692e-8);
const vec2 PI_16_3_FP64 = vec2(0.5890486240386963, -1.4906100798128818e-9);
const vec2 PI_180_FP64 = vec2(0.01745329238474369, 1.3519960498364902e-10);

const vec2 SIN_TABLE_0_FP64 = vec2(0.19509032368659973, -1.6704714833615242e-9);
const vec2 SIN_TABLE_1_FP64 = vec2(0.3826834261417389, 6.22335089017767e-9);
const vec2 SIN_TABLE_2_FP64 = vec2(0.5555702447891235, -1.1769521357507529e-8);
const vec2 SIN_TABLE_3_FP64 = vec2(0.7071067690849304, 1.2101617041793133e-8);

const vec2 COS_TABLE_0_FP64 = vec2(0.9807852506637573, 2.9739473106360492e-8);
const vec2 COS_TABLE_1_FP64 = vec2(0.9238795042037964, 2.8307490351764386e-8);
const vec2 COS_TABLE_2_FP64 = vec2(0.8314695954322815, 1.6870263741530778e-8);
const vec2 COS_TABLE_3_FP64 = vec2(0.7071067690849304, 1.2101617152815436e-8);

const vec2 INVERSE_FACTORIAL_3_FP64 = vec2(1.666666716337204e-01, -4.967053879312289e-09); // 1/3!
const vec2 INVERSE_FACTORIAL_4_FP64 = vec2(4.16666679084301e-02, -1.2417634698280722e-09); // 1/4!
const vec2 INVERSE_FACTORIAL_5_FP64 = vec2(8.333333767950535e-03, -4.34617203337595e-10); // 1/5!
const vec2 INVERSE_FACTORIAL_6_FP64 = vec2(1.3888889225199819e-03, -3.3631094437103215e-11); // 1/6!
const vec2 INVERSE_FACTORIAL_7_FP64 = vec2(1.9841270113829523e-04,  -2.725596874933456e-12); // 1/7!
const vec2 INVERSE_FACTORIAL_8_FP64 = vec2(2.4801587642286904e-05, -3.406996025904184e-13); // 1/8!
const vec2 INVERSE_FACTORIAL_9_FP64 = vec2(2.75573188446287533e-06, 3.7935713937038186e-14); // 1/9!
const vec2 INVERSE_FACTORIAL_10_FP64 = vec2(2.755731998149713e-07, -7.575112367869873e-15); // 1/10!

float nint(float d) {
    if (d == floor(d)) return d;
    return floor(d + 0.5);
}

vec2 nint_fp64(vec2 a) {
    float hi = nint(a.x);
    float lo;
    vec2 tmp;
    if (hi == a.x) {
        lo = nint(a.y);
        tmp = quickTwoSum(hi, lo);
    } else {
        lo = 0.0;
        if (abs(hi - a.x) == 0.5 && a.y < 0.0) {
            hi -= 1.0;
        }
        tmp = vec2(hi, lo);
    }
    return tmp;
}

/* k_power controls how much range reduction we would like to have
Range reduction uses the following method:
assume a = k_power * r + m * log(2), k and m being integers.
Set k_power = 4 (we can choose other k to trade accuracy with performance.
we only need to calculate exp(r) and using exp(a) = 2^m * exp(r)^k_power;
*/

vec2 exp_fp64(vec2 a) {
  // We need to make sure these two numbers match
  // as bit-wise shift is not available in GLSL 1.0
  const int k_power = 4;
  const float k = 16.0;

  const float inv_k = 1.0 / k;

  if (a.x <= -88.0) return vec2(0.0, 0.0);
  if (a.x >= 88.0) return vec2(1.0 / 0.0, 1.0 / 0.0);
  if (a.x == 0.0 && a.y == 0.0) return vec2(1.0, 0.0);
  if (a.x == 1.0 && a.y == 0.0) return E_FP64;

  float m = floor(a.x / LOG2_FP64.x + 0.5);
  vec2 r = sub_fp64(a, mul_fp64(LOG2_FP64, vec2(m, 0.0))) * inv_k;
  vec2 s, t, p;

  p = mul_fp64(r, r);
  s = sum_fp64(r, p * 0.5);
  p = mul_fp64(p, r);
  t = mul_fp64(p, INVERSE_FACTORIAL_3_FP64);

  s = sum_fp64(s, t);
  p = mul_fp64(p, r);
  t = mul_fp64(p, INVERSE_FACTORIAL_4_FP64);

  s = sum_fp64(s, t);
  p = mul_fp64(p, r);
  t = mul_fp64(p, INVERSE_FACTORIAL_5_FP64);

  // s = sum_fp64(s, t);
  // p = mul_fp64(p, r);
  // t = mul_fp64(p, INVERSE_FACTORIAL_6_FP64);

  // s = sum_fp64(s, t);
  // p = mul_fp64(p, r);
  // t = mul_fp64(p, INVERSE_FACTORIAL_7_FP64);

  s = sum_fp64(s, t);


  // At this point, s = exp(r) - 1; but after following 4 recursions, we will get exp(r) ^ 512 - 1.
  for (int i = 0; i < k_power; i++) {
    s = sum_fp64(s * 2.0, mul_fp64(s, s));
  }

#if defined(NVIDIA_FP64_WORKAROUND) || defined(INTEL_FP64_WORKAROUND)
  s = sum_fp64(s, vec2(fp64.ONE, 0.0));
#else
  s = sum_fp64(s, vec2(1.0, 0.0));
#endif

  return s * pow(2.0, m);
//   return r;
}

vec2 log_fp64(vec2 a)
{
  if (a.x == 1.0 && a.y == 0.0) return vec2(0.0, 0.0);
  if (a.x <= 0.0) return vec2(0.0 / 0.0, 0.0 / 0.0);
  vec2 x = vec2(log(a.x), 0.0);
  vec2 s;
#if defined(NVIDIA_FP64_WORKAROUND) || defined(INTEL_FP64_WORKAROUND)
  s = vec2(fp64.ONE, 0.0);
#else
  s = vec2(1.0, 0.0);
#endif

  x = sub_fp64(sum_fp64(x, mul_fp64(a, exp_fp64(-x))), s);
  return x;
}

vec2 sin_taylor_fp64(vec2 a) {
  vec2 r, s, t, x;

  if (a.x == 0.0 && a.y == 0.0) {
    return vec2(0.0, 0.0);
  }

  x = -mul_fp64(a, a);
  s = a;
  r = a;

  r = mul_fp64(r, x);
  t = mul_fp64(r, INVERSE_FACTORIAL_3_FP64);
  s = sum_fp64(s, t);

  r = mul_fp64(r, x);
  t = mul_fp64(r, INVERSE_FACTORIAL_5_FP64);
  s = sum_fp64(s, t);

  /* keep the following commented code in case we need them
  for extra accuracy from the Taylor expansion*/

  // r = mul_fp64(r, x);
  // t = mul_fp64(r, INVERSE_FACTORIAL_7_FP64);
  // s = sum_fp64(s, t);

  // r = mul_fp64(r, x);
  // t = mul_fp64(r, INVERSE_FACTORIAL_9_FP64);
  // s = sum_fp64(s, t);

  return s;
}

vec2 cos_taylor_fp64(vec2 a) {
  vec2 r, s, t, x;

  if (a.x == 0.0 && a.y == 0.0) {
    return vec2(1.0, 0.0);
  }

  x = -mul_fp64(a, a);
  r = x;
  s = sum_fp64(vec2(1.0, 0.0), r * 0.5);

  r = mul_fp64(r, x);
  t = mul_fp64(r, INVERSE_FACTORIAL_4_FP64);
  s = sum_fp64(s, t);

  r = mul_fp64(r, x);
  t = mul_fp64(r, INVERSE_FACTORIAL_6_FP64);
  s = sum_fp64(s, t);

  /* keep the following commented code in case we need them
  for extra accuracy from the Taylor expansion*/

  // r = mul_fp64(r, x);
  // t = mul_fp64(r, INVERSE_FACTORIAL_8_FP64);
  // s = sum_fp64(s, t);

  // r = mul_fp64(r, x);
  // t = mul_fp64(r, INVERSE_FACTORIAL_10_FP64);
  // s = sum_fp64(s, t);

  return s;
}

void sincos_taylor_fp64(vec2 a, out vec2 sin_t, out vec2 cos_t) {
  if (a.x == 0.0 && a.y == 0.0) {
    sin_t = vec2(0.0, 0.0);
    cos_t = vec2(1.0, 0.0);
  }

  sin_t = sin_taylor_fp64(a);
  cos_t = sqrt_fp64(sub_fp64(vec2(1.0, 0.0), mul_fp64(sin_t, sin_t)));
}

vec2 sin_fp64(vec2 a) {
    if (a.x == 0.0 && a.y == 0.0) {
        return vec2(0.0, 0.0);
    }

    // 2pi range reduction
    vec2 z = nint_fp64(div_fp64(a, TWO_PI_FP64));
    vec2 r = sub_fp64(a, mul_fp64(TWO_PI_FP64, z));

    vec2 t;
    float q = floor(r.x / PI_2_FP64.x + 0.5);
    int j = int(q);

    if (j < -2 || j > 2) {
        return vec2(0.0 / 0.0, 0.0 / 0.0);
    }

    t = sub_fp64(r, mul_fp64(PI_2_FP64, vec2(q, 0.0)));

    q = floor(t.x / PI_16_FP64.x + 0.5);
    int k = int(q);

    if (k == 0) {
        if (j == 0) {
            return sin_taylor_fp64(t);
        } else if (j == 1) {
            return cos_taylor_fp64(t);
        } else if (j == -1) {
            return -cos_taylor_fp64(t);
        } else {
            return -sin_taylor_fp64(t);
        }
    }

    int abs_k = int(abs(float(k)));

    if (abs_k > 4) {
        return vec2(0.0 / 0.0, 0.0 / 0.0);
    } else {
        t = sub_fp64(t, mul_fp64(PI_16_FP64, vec2(q, 0.0)));
    }

    vec2 u = vec2(0.0, 0.0);
    vec2 v = vec2(0.0, 0.0);

#if defined(NVIDIA_FP64_WORKAROUND) || defined(INTEL_FP64_WORKAROUND)
    if (abs(float(abs_k) - 1.0) < 0.5) {
        u = COS_TABLE_0_FP64;
        v = SIN_TABLE_0_FP64;
    } else if (abs(float(abs_k) - 2.0) < 0.5) {
        u = COS_TABLE_1_FP64;
        v = SIN_TABLE_1_FP64;
    } else if (abs(float(abs_k) - 3.0) < 0.5) {
        u = COS_TABLE_2_FP64;
        v = SIN_TABLE_2_FP64;
    } else if (abs(float(abs_k) - 4.0) < 0.5) {
        u = COS_TABLE_3_FP64;
        v = SIN_TABLE_3_FP64;
    }
#else
    if (abs_k == 1) {
        u = COS_TABLE_0_FP64;
        v = SIN_TABLE_0_FP64;
    } else if (abs_k == 2) {
        u = COS_TABLE_1_FP64;
        v = SIN_TABLE_1_FP64;
    } else if (abs_k == 3) {
        u = COS_TABLE_2_FP64;
        v = SIN_TABLE_2_FP64;
    } else if (abs_k == 4) {
        u = COS_TABLE_3_FP64;
        v = SIN_TABLE_3_FP64;
    }
#endif

    vec2 sin_t, cos_t;
    sincos_taylor_fp64(t, sin_t, cos_t);



    vec2 result = vec2(0.0, 0.0);
    if (j == 0) {
        if (k > 0) {
            result = sum_fp64(mul_fp64(u, sin_t), mul_fp64(v, cos_t));
        } else {
            result = sub_fp64(mul_fp64(u, sin_t), mul_fp64(v, cos_t));
        }
    } else if (j == 1) {
        if (k > 0) {
            result = sub_fp64(mul_fp64(u, cos_t), mul_fp64(v, sin_t));
        } else {
            result = sum_fp64(mul_fp64(u, cos_t), mul_fp64(v, sin_t));
        }
    } else if (j == -1) {
        if (k > 0) {
            result = sub_fp64(mul_fp64(v, sin_t), mul_fp64(u, cos_t));
        } else {
            result = -sum_fp64(mul_fp64(v, sin_t), mul_fp64(u, cos_t));
        }
    } else {
        if (k > 0) {
            result = -sum_fp64(mul_fp64(u, sin_t), mul_fp64(v, cos_t));
        } else {
            result = sub_fp64(mul_fp64(v, cos_t), mul_fp64(u, sin_t));
        }
    }

    return result;
}

vec2 cos_fp64(vec2 a) {
    if (a.x == 0.0 && a.y == 0.0) {
        return vec2(1.0, 0.0);
    }

    // 2pi range reduction
    vec2 z = nint_fp64(div_fp64(a, TWO_PI_FP64));
    vec2 r = sub_fp64(a, mul_fp64(TWO_PI_FP64, z));

    vec2 t;
    float q = floor(r.x / PI_2_FP64.x + 0.5);
    int j = int(q);

    if (j < -2 || j > 2) {
        return vec2(0.0 / 0.0, 0.0 / 0.0);
    }

    t = sub_fp64(r, mul_fp64(PI_2_FP64, vec2(q, 0.0)));

    q = floor(t.x / PI_16_FP64.x + 0.5);
    int k = int(q);

    if (k == 0) {
        if (j == 0) {
            return cos_taylor_fp64(t);
        } else if (j == 1) {
            return -sin_taylor_fp64(t);
        } else if (j == -1) {
            return sin_taylor_fp64(t);
        } else {
            return -cos_taylor_fp64(t);
        }
    }

    int abs_k = int(abs(float(k)));

    if (abs_k > 4) {
        return vec2(0.0 / 0.0, 0.0 / 0.0);
    } else {
        t = sub_fp64(t, mul_fp64(PI_16_FP64, vec2(q, 0.0)));
    }

    vec2 u = vec2(0.0, 0.0);
    vec2 v = vec2(0.0, 0.0);

#if defined(NVIDIA_FP64_WORKAROUND) || defined(INTEL_FP64_WORKAROUND)
    if (abs(float(abs_k) - 1.0) < 0.5) {
        u = COS_TABLE_0_FP64;
        v = SIN_TABLE_0_FP64;
    } else if (abs(float(abs_k) - 2.0) < 0.5) {
        u = COS_TABLE_1_FP64;
        v = SIN_TABLE_1_FP64;
    } else if (abs(float(abs_k) - 3.0) < 0.5) {
        u = COS_TABLE_2_FP64;
        v = SIN_TABLE_2_FP64;
    } else if (abs(float(abs_k) - 4.0) < 0.5) {
        u = COS_TABLE_3_FP64;
        v = SIN_TABLE_3_FP64;
    }
#else
    if (abs_k == 1) {
        u = COS_TABLE_0_FP64;
        v = SIN_TABLE_0_FP64;
    } else if (abs_k == 2) {
        u = COS_TABLE_1_FP64;
        v = SIN_TABLE_1_FP64;
    } else if (abs_k == 3) {
        u = COS_TABLE_2_FP64;
        v = SIN_TABLE_2_FP64;
    } else if (abs_k == 4) {
        u = COS_TABLE_3_FP64;
        v = SIN_TABLE_3_FP64;
    }
#endif

    vec2 sin_t, cos_t;
    sincos_taylor_fp64(t, sin_t, cos_t);

    vec2 result = vec2(0.0, 0.0);
    if (j == 0) {
        if (k > 0) {
            result = sub_fp64(mul_fp64(u, cos_t), mul_fp64(v, sin_t));
        } else {
            result = sum_fp64(mul_fp64(u, cos_t), mul_fp64(v, sin_t));
        }
    } else if (j == 1) {
        if (k > 0) {
            result = -sum_fp64(mul_fp64(u, sin_t), mul_fp64(v, cos_t));
        } else {
            result = sub_fp64(mul_fp64(v, cos_t), mul_fp64(u, sin_t));
        }
    } else if (j == -1) {
        if (k > 0) {
            result = sum_fp64(mul_fp64(u, sin_t), mul_fp64(v, cos_t));
        } else {
            result = sub_fp64(mul_fp64(u, sin_t), mul_fp64(v, cos_t));
        }
    } else {
        if (k > 0) {
            result = sub_fp64(mul_fp64(v, sin_t), mul_fp64(u, cos_t));
        } else {
            result = -sum_fp64(mul_fp64(u, cos_t), mul_fp64(v, sin_t));
        }
    }

    return result;
}

vec2 tan_fp64(vec2 a) {
    vec2 sin_a;
    vec2 cos_a;

    if (a.x == 0.0 && a.y == 0.0) {
        return vec2(0.0, 0.0);
    }

    // 2pi range reduction
    vec2 z = nint_fp64(div_fp64(a, TWO_PI_FP64));
    vec2 r = sub_fp64(a, mul_fp64(TWO_PI_FP64, z));

    vec2 t;
    float q = floor(r.x / PI_2_FP64.x + 0.5);
    int j = int(q);


    if (j < -2 || j > 2) {
        return vec2(0.0 / 0.0, 0.0 / 0.0);
    }

    t = sub_fp64(r, mul_fp64(PI_2_FP64, vec2(q, 0.0)));

    q = floor(t.x / PI_16_FP64.x + 0.5);
    int k = int(q);
    int abs_k = int(abs(float(k)));

    // We just can't get PI/16 * 3.0 very accurately.
    // so let's just store it
    if (abs_k > 4) {
        return vec2(0.0 / 0.0, 0.0 / 0.0);
    } else {
        t = sub_fp64(t, mul_fp64(PI_16_FP64, vec2(q, 0.0)));
    }


    vec2 u = vec2(0.0, 0.0);
    vec2 v = vec2(0.0, 0.0);

    vec2 sin_t, cos_t;
    vec2 s, c;
    sincos_taylor_fp64(t, sin_t, cos_t);

    if (k == 0) {
        s = sin_t;
        c = cos_t;
    } else {
#if defined(NVIDIA_FP64_WORKAROUND) || defined(INTEL_FP64_WORKAROUND)
        if (abs(float(abs_k) - 1.0) < 0.5) {
            u = COS_TABLE_0_FP64;
            v = SIN_TABLE_0_FP64;
        } else if (abs(float(abs_k) - 2.0) < 0.5) {
            u = COS_TABLE_1_FP64;
            v = SIN_TABLE_1_FP64;
        } else if (abs(float(abs_k) - 3.0) < 0.5) {
            u = COS_TABLE_2_FP64;
            v = SIN_TABLE_2_FP64;
        } else if (abs(float(abs_k) - 4.0) < 0.5) {
            u = COS_TABLE_3_FP64;
            v = SIN_TABLE_3_FP64;
        }
#else
        if (abs_k == 1) {
            u = COS_TABLE_0_FP64;
            v = SIN_TABLE_0_FP64;
        } else if (abs_k == 2) {
            u = COS_TABLE_1_FP64;
            v = SIN_TABLE_1_FP64;
        } else if (abs_k == 3) {
            u = COS_TABLE_2_FP64;
            v = SIN_TABLE_2_FP64;
        } else if (abs_k == 4) {
            u = COS_TABLE_3_FP64;
            v = SIN_TABLE_3_FP64;
        }
#endif
        if (k > 0) {
            s = sum_fp64(mul_fp64(u, sin_t), mul_fp64(v, cos_t));
            c = sub_fp64(mul_fp64(u, cos_t), mul_fp64(v, sin_t));
        } else {
            s = sub_fp64(mul_fp64(u, sin_t), mul_fp64(v, cos_t));
            c = sum_fp64(mul_fp64(u, cos_t), mul_fp64(v, sin_t));
        }
    }

    if (j == 0) {
        sin_a = s;
        cos_a = c;
    } else if (j == 1) {
        sin_a = c;
        cos_a = -s;
    } else if (j == -1) {
        sin_a = -c;
        cos_a = s;
    } else {
        sin_a = -s;
        cos_a = -c;
    }
    return div_fp64(sin_a, cos_a);
}

vec2 radians_fp64(vec2 degree) {
  return mul_fp64(degree, PI_180_FP64);
}

vec2 mix_fp64(vec2 a, vec2 b, float x) {
  vec2 range = sub_fp64(b, a);
  return sum_fp64(a, mul_fp64(range, vec2(x, 0.0)));
}

// Vector functions
// vec2 functions
void vec2_sum_fp64(vec2 a[2], vec2 b[2], out vec2 out_val[2]) {
    out_val[0] = sum_fp64(a[0], b[0]);
    out_val[1] = sum_fp64(a[1], b[1]);
}

void vec2_sub_fp64(vec2 a[2], vec2 b[2], out vec2 out_val[2]) {
    out_val[0] = sub_fp64(a[0], b[0]);
    out_val[1] = sub_fp64(a[1], b[1]);
}

void vec2_mul_fp64(vec2 a[2], vec2 b[2], out vec2 out_val[2]) {
    out_val[0] = mul_fp64(a[0], b[0]);
    out_val[1] = mul_fp64(a[1], b[1]);
}

void vec2_div_fp64(vec2 a[2], vec2 b[2], out vec2 out_val[2]) {
    out_val[0] = div_fp64(a[0], b[0]);
    out_val[1] = div_fp64(a[1], b[1]);
}

void vec2_mix_fp64(vec2 x[2], vec2 y[2], float a, out vec2 out_val[2]) {
  vec2 range[2];
  vec2_sub_fp64(y, x, range);
  vec2 portion[2];
  portion[0] = range[0] * a;
  portion[1] = range[1] * a;
  vec2_sum_fp64(x, portion, out_val);
}

vec2 vec2_length_fp64(vec2 x[2]) {
  return sqrt_fp64(sum_fp64(mul_fp64(x[0], x[0]), mul_fp64(x[1], x[1])));
}

void vec2_normalize_fp64(vec2 x[2], out vec2 out_val[2]) {
  vec2 length = vec2_length_fp64(x);
  vec2 length_vec2[2];
  length_vec2[0] = length;
  length_vec2[1] = length;

  vec2_div_fp64(x, length_vec2, out_val);
}

vec2 vec2_distance_fp64(vec2 x[2], vec2 y[2]) {
  vec2 diff[2];
  vec2_sub_fp64(x, y, diff);
  return vec2_length_fp64(diff);
}

vec2 vec2_dot_fp64(vec2 a[2], vec2 b[2]) {
  vec2 v[2];

  v[0] = mul_fp64(a[0], b[0]);
  v[1] = mul_fp64(a[1], b[1]);

  return sum_fp64(v[0], v[1]);
}

// vec3 functions
void vec3_sub_fp64(vec2 a[3], vec2 b[3], out vec2 out_val[3]) {
  for (int i = 0; i < 3; i++) {
    out_val[i] = sum_fp64(a[i], b[i]);
  }
}

void vec3_sum_fp64(vec2 a[3], vec2 b[3], out vec2 out_val[3]) {
  for (int i = 0; i < 3; i++) {
    out_val[i] = sum_fp64(a[i], b[i]);
  }
}

vec2 vec3_length_fp64(vec2 x[3]) {
  return sqrt_fp64(sum_fp64(sum_fp64(mul_fp64(x[0], x[0]), mul_fp64(x[1], x[1])),
    mul_fp64(x[2], x[2])));
}

vec2 vec3_distance_fp64(vec2 x[3], vec2 y[3]) {
  vec2 diff[3];
  vec3_sub_fp64(x, y, diff);
  return vec3_length_fp64(diff);
}

// vec4 functions
void vec4_fp64(vec4 a, out vec2 out_val[4]) {
  out_val[0].x = a[0];
  out_val[0].y = 0.0;

  out_val[1].x = a[1];
  out_val[1].y = 0.0;

  out_val[2].x = a[2];
  out_val[2].y = 0.0;

  out_val[3].x = a[3];
  out_val[3].y = 0.0;
}

void vec4_scalar_mul_fp64(vec2 a[4], vec2 b, out vec2 out_val[4]) {
  out_val[0] = mul_fp64(a[0], b);
  out_val[1] = mul_fp64(a[1], b);
  out_val[2] = mul_fp64(a[2], b);
  out_val[3] = mul_fp64(a[3], b);
}

void vec4_sum_fp64(vec2 a[4], vec2 b[4], out vec2 out_val[4]) {
  for (int i = 0; i < 4; i++) {
    out_val[i] = sum_fp64(a[i], b[i]);
  }
}

void vec4_dot_fp64(vec2 a[4], vec2 b[4], out vec2 out_val) {
  vec2 v[4];

  v[0] = mul_fp64(a[0], b[0]);
  v[1] = mul_fp64(a[1], b[1]);
  v[2] = mul_fp64(a[2], b[2]);
  v[3] = mul_fp64(a[3], b[3]);

  out_val = sum_fp64(sum_fp64(v[0], v[1]), sum_fp64(v[2], v[3]));
}

void mat4_vec4_mul_fp64(vec2 b[16], vec2 a[4], out vec2 out_val[4]) {
  vec2 tmp[4];

  for (int i = 0; i < 4; i++)
  {
    for (int j = 0; j < 4; j++)
    {
      tmp[j] = b[j + i * 4];
    }
    vec4_dot_fp64(a, tmp, out_val[i]);
  }
}
`,Wr={ONE:1,SPLIT:4097},zt={name:"fp64arithmetic",source:jr,fs:kt,vs:kt,defaultUniforms:Wr,uniformTypes:{ONE:"f32",SPLIT:"f32"},fp64ify:ge,fp64LowPart:He,fp64ifyMatrix4:$e},Kr={name:"fp64",vs:qr,dependencies:[zt],fp64ify:ge,fp64LowPart:He,fp64ifyMatrix4:$e},Zr=`const DGGS_H3_CELL_MODE: u32 = 1u;
const DGGS_H3_MAX_RESOLUTION: u32 = 15u;
const DGGS_H3_MAX_BASE_CELL: u32 = 121u;
const DGGS_H3_UNUSED_DIGIT: u32 = 7u;
const DGGS_H3_RES0_U_GNOMONIC: f32 = 0.381966011250105;
const DGGS_H3_RSQRT7: f32 = 0.3779644730092272;
const DGGS_H3_ONETHIRD: f32 = 0.3333333333333333;
const DGGS_H3_AP7_ROT_RADS: f32 = 0.3334731722518321;
const DGGS_H3_SQRT3_2: f32 = 0.8660254037844386;
const DGGS_S2_MAX_LEVEL: u32 = 30u;
const DGGS_GEOHASH_MAX_LENGTH: u32 = 12u;
const DGGS_GEOHASH_LENGTH_BIT_OFFSET: u32 = 60u;
const DGGS_QUADKEY_MAX_LENGTH: u32 = 29u;
const DGGS_QUADKEY_LENGTH_BIT_OFFSET: u32 = 58u;
const DGGS_A5_FIRST_HILBERT_RESOLUTION: u32 = 2u;
const DGGS_A5_MAX_RESOLUTION: u32 = 30u;
const DGGS_A5_HILBERT_START_BIT: u32 = 58u;
const DGGS_PI: f32 = 3.141592653589793;
const DGGS_TWO_PI: f32 = 6.283185307179586;
const DGGS_TWO_PI_OVER_5: f32 = 1.2566370614359172;
const DGGS_PI_OVER_5: f32 = 0.6283185307179586;
const DGGS_PI_OVER_2: f32 = 1.5707963267948966;
const DGGS_A5_DISTANCE_TO_EDGE: f32 = 0.6180339887498949;
const DGGS_A5_REFLECTED_TRIANGLE_SCALE: f32 = 3.23606797749979;
const DGGS_A5_LONGITUDE_OFFSET: f32 = 93.0;
const DGGS_RADIANS_TO_DEGREES: f32 = 57.29577951308232;
const DGGS_DEGREES_TO_RADIANS: f32 = 0.017453292519943295;
const DGGS_U64_HIGH_WORD_FLOAT_SCALE: f32 = 4294967296.0;

// DGGS 64-bit helper functions use canonical word order vec2u(high, low).
// Arrow BigInt64/BigUint64 buffers are read as little-endian vec2u(low, high),
// so storage-buffer reads should pass through dggs_u64_from_little_endian_words().
fn dggs_u64_make(high: u32, low: u32) -> vec2u {
  return vec2u(high, low);
}

fn dggs_u64_from_little_endian_words(words: vec2u) -> vec2u {
  return words.yx;
}

fn dggs_u64_to_little_endian_words(value: vec2u) -> vec2u {
  return value.yx;
}

fn dggs_u64_high(value: vec2u) -> u32 {
  return value.x;
}

fn dggs_u64_low(value: vec2u) -> u32 {
  return value.y;
}

fn dggs_u64_is_zero(value: vec2u) -> bool {
  return value.x == 0u && value.y == 0u;
}

fn dggs_u64_equal(a: vec2u, b: vec2u) -> bool {
  return a.x == b.x && a.y == b.y;
}

fn dggs_u64_compare(a: vec2u, b: vec2u) -> i32 {
  if (a.x != b.x) {
    return select(-1, 1, a.x > b.x);
  }
  if (a.y != b.y) {
    return select(-1, 1, a.y > b.y);
  }
  return 0;
}

fn dggs_u64_less(a: vec2u, b: vec2u) -> bool {
  return dggs_u64_compare(a, b) < 0;
}

fn dggs_u64_add(a: vec2u, b: vec2u) -> vec2u {
  let low = a.y + b.y;
  let carry = select(0u, 1u, low < a.y);
  return vec2u(a.x + b.x + carry, low);
}

fn dggs_u64_subtract(a: vec2u, b: vec2u) -> vec2u {
  let borrow = select(0u, 1u, a.y < b.y);
  return vec2u(a.x - b.x - borrow, a.y - b.y);
}

fn dggs_u64_to_f32(value: vec2u) -> f32 {
  return f32(value.x) * DGGS_U64_HIGH_WORD_FLOAT_SCALE + f32(value.y);
}

fn dggs_i64_from_little_endian_words(words: vec2u) -> vec2u {
  return dggs_u64_from_little_endian_words(words);
}

fn dggs_i64_to_little_endian_words(value: vec2u) -> vec2u {
  return dggs_u64_to_little_endian_words(value);
}

fn dggs_i64_is_negative(value: vec2u) -> bool {
  return (value.x & 0x80000000u) != 0u;
}

fn dggs_i64_negate(value: vec2u) -> vec2u {
  return dggs_u64_add(vec2u(~value.x, ~value.y), vec2u(0u, 1u));
}

fn dggs_i64_compare(a: vec2u, b: vec2u) -> i32 {
  let highA = bitcast<i32>(a.x);
  let highB = bitcast<i32>(b.x);
  if (highA != highB) {
    return select(-1, 1, highA > highB);
  }
  if (a.y != b.y) {
    return select(-1, 1, a.y > b.y);
  }
  return 0;
}

fn dggs_i64_less(a: vec2u, b: vec2u) -> bool {
  return dggs_i64_compare(a, b) < 0;
}

fn dggs_i64_subtract(a: vec2u, b: vec2u) -> vec2u {
  return dggs_u64_subtract(a, b);
}

fn dggs_i64_to_f32(value: vec2u) -> f32 {
  if (dggs_i64_is_negative(value)) {
    return -dggs_u64_to_f32(dggs_i64_negate(value));
  }
  return dggs_u64_to_f32(value);
}

fn dggs_u32_mask_low(bitCount: u32) -> u32 {
  if (bitCount == 0u) {
    return 0u;
  }
  if (bitCount >= 32u) {
    return 0xffffffffu;
  }
  return (1u << bitCount) - 1u;
}

fn dggs_u64_shift_left(value: vec2u, shift: u32) -> vec2u {
  if (shift == 0u) {
    return value;
  }
  if (shift < 32u) {
    return vec2u((value.x << shift) | (value.y >> (32u - shift)), value.y << shift);
  }
  if (shift == 32u) {
    return vec2u(value.y, 0u);
  }
  if (shift < 64u) {
    return vec2u(value.y << (shift - 32u), 0u);
  }
  return vec2u(0u);
}

fn dggs_u64_shift_right(value: vec2u, shift: u32) -> vec2u {
  if (shift == 0u) {
    return value;
  }
  if (shift < 32u) {
    return vec2u(value.x >> shift, (value.y >> shift) | (value.x << (32u - shift)));
  }
  if (shift == 32u) {
    return vec2u(0u, value.x);
  }
  if (shift < 64u) {
    return vec2u(0u, value.x >> (shift - 32u));
  }
  return vec2u(0u);
}

fn dggs_u64_extract_bits(value: vec2u, bitOffset: u32, bitCount: u32) -> u32 {
  if (bitCount == 0u || bitOffset >= 64u) {
    return 0u;
  }
  let shifted = dggs_u64_shift_right(value, bitOffset);
  return shifted.y & dggs_u32_mask_low(bitCount);
}

fn dggs_u64_set_bits(value: vec2u, bitOffset: u32, bitCount: u32, bits: u32) -> vec2u {
  if (bitCount == 0u || bitOffset >= 64u) {
    return value;
  }
  let bitMask = dggs_u32_mask_low(bitCount);
  let fieldMask = dggs_u64_shift_left(vec2u(0u, bitMask), bitOffset);
  let fieldBits = dggs_u64_shift_left(vec2u(0u, bits & bitMask), bitOffset);
  return (value & vec2u(~fieldMask.x, ~fieldMask.y)) | fieldBits;
}

fn dggs_u64_count_trailing_zeros(value: vec2u) -> u32 {
  if (value.y != 0u) {
    return countTrailingZeros(value.y);
  }
  if (value.x != 0u) {
    return 32u + countTrailingZeros(value.x);
  }
  return 64u;
}

struct DggsA5Cell {
  origin : u32,
  segment : u32,
  resolution : u32,
  valid : u32,
  quintantShift : u32,
  hilbertResolution : u32,
};

struct DggsA5Anchor {
  q : u32,
  offset : vec2i,
  flips : vec2i,
  orientation : u32,
  quintant : u32,
};

struct DggsA5FaceTriangle {
  a : vec2f,
  b : vec2f,
  c : vec2f,
};

struct DggsA5SphericalTriangle {
  a : vec3f,
  b : vec3f,
  c : vec3f,
};

struct DggsH3FaceIJK {
  face : u32,
  coord : vec3i,
  valid : u32,
};

struct DggsH3BoundaryVertex {
  face : u32,
  coord : vec3i,
  resolution : u32,
  valid : u32,
};

fn dggs_boundary_point_to_fp64_split(point : vec2f) -> vec4f {
  return vec4f(point.x, point.y, 0.0, 0.0);
}

fn dggs_a5_positive_mod_i32(value : i32, modulus : i32) -> i32 {
  return ((value % modulus) + modulus) % modulus;
}

fn dggs_a5_has_bit(index : vec2u, bitOffset : u32) -> bool {
  return dggs_u64_extract_bits(index, bitOffset, 1u) != 0u;
}

fn dggs_a5_get_resolution(index : vec2u) -> u32 {
  if (dggs_u64_is_zero(index)) {
    return 0u;
  }
  if (
    dggs_a5_has_bit(index, 0u) ||
    dggs_u64_extract_bits(index, 0u, 3u) == 4u ||
    dggs_u64_extract_bits(index, 0u, 5u) == 16u
  ) {
    return DGGS_A5_MAX_RESOLUTION;
  }

  var resolution = DGGS_A5_MAX_RESOLUTION - 1u;
  var shifted = dggs_u64_shift_right(index, 1u);
  if (dggs_u64_is_zero(shifted)) {
    return 0u;
  }

  var remaining = shifted.y;
  if (remaining == 0u) {
    shifted = dggs_u64_shift_right(shifted, 32u);
    resolution -= 16u;
    remaining = shifted.y;
  }
  if ((remaining & 0xffffu) == 0u) {
    remaining >>= 16u;
    resolution -= 8u;
  }
  if (resolution >= 6u && (remaining & 0xffu) == 0u) {
    remaining >>= 8u;
    resolution -= 4u;
  }
  if (resolution >= 4u && (remaining & 0xfu) == 0u) {
    remaining >>= 4u;
    resolution -= 2u;
  }
  loop {
    if ((remaining & 1u) != 0u) {
      break;
    }
    if (resolution == 0u) {
      break;
    }
    resolution -= 1u;
    remaining >>= select(2u, 1u, resolution < DGGS_A5_FIRST_HILBERT_RESOLUTION);
  }
  return resolution;
}

fn dggs_a5_get_origin_first_quintant(origin : u32) -> u32 {
  let values = array<u32, 12>(
    4u, 2u, 3u, 0u, 2u, 4u, 2u, 2u, 3u, 0u, 3u, 0u
  );
  return values[min(origin, 11u)];
}

fn dggs_a5_get_origin_step(origin : u32) -> i32 {
  let values = array<i32, 12>(
    -1, 1, 1, 1, -1, 1, -1, -1, 1, 1, 1, -1
  );
  return values[min(origin, 11u)];
}

fn dggs_a5_get_origin_orientation(origin : u32, faceRelativeQuintant : u32) -> u32 {
  // Orientation codes: uv=0, vu=1, uw=2, wu=3, vw=4, wv=5.
  let values = array<u32, 60>(
    1u, 2u, 4u, 4u, 4u,
    1u, 0u, 5u, 3u, 2u,
    3u, 0u, 5u, 3u, 2u,
    3u, 0u, 5u, 3u, 2u,
    3u, 2u, 4u, 1u, 2u,
    1u, 0u, 5u, 3u, 2u,
    3u, 2u, 4u, 1u, 2u,
    3u, 2u, 4u, 1u, 2u,
    3u, 0u, 5u, 3u, 2u,
    1u, 0u, 5u, 3u, 2u,
    1u, 0u, 5u, 3u, 2u,
    3u, 2u, 4u, 1u, 2u
  );
  return values[min(origin, 11u) * 5u + min(faceRelativeQuintant, 4u)];
}

fn dggs_a5_get_origin_angle(origin : u32) -> f32 {
  if (origin == 0u || origin == 9u) {
    return 0.0;
  }
  return DGGS_PI_OVER_5;
}

fn dggs_a5_get_origin_quaternion(origin : u32) -> vec4f {
  let values = array<vec4f, 12>(
    vec4f(0.0, 0.0, 0.0, 1.0),
    vec4f(0.0, 0.525731112119, 0.0, 0.850650808352),
    vec4f(-0.5, 0.688190960236, 0.0, 0.525731112119),
    vec4f(-0.809016994375, -0.262865556060, 0.0, 0.525731112119),
    vec4f(-0.5, 0.162459848116, 0.0, 0.850650808352),
    vec4f(-0.309016994375, -0.425325404176, 0.0, 0.850650808352),
    vec4f(0.309016994375, -0.425325404176, 0.0, 0.850650808352),
    vec4f(0.809016994375, -0.262865556060, 0.0, 0.525731112119),
    vec4f(0.0, -0.850650808352, 0.0, 0.525731112119),
    vec4f(0.0, -1.0, 0.0, 0.0),
    vec4f(0.5, 0.688190960236, 0.0, 0.525731112119),
    vec4f(0.5, 0.162459848116, 0.0, 0.850650808352)
  );
  return values[min(origin, 11u)];
}

fn dggs_a5_quaternion_rotate(point : vec3f, quaternion : vec4f) -> vec3f {
  let q = quaternion.xyz;
  let t = 2.0 * cross(q, point);
  return point + quaternion.w * t + cross(q, t);
}

fn dggs_a5_deserialize(index : vec2u) -> DggsA5Cell {
  if (dggs_u64_is_zero(index)) {
    return DggsA5Cell(0u, 0u, 0u, 0u, DGGS_A5_HILBERT_START_BIT, 0u);
  }

  let resolution = dggs_a5_get_resolution(index);
  var quintantShift = DGGS_A5_HILBERT_START_BIT;
  var quintantOffset = 0u;
  if (resolution == DGGS_A5_MAX_RESOLUTION) {
    var markerBits = 5u;
    if (dggs_a5_has_bit(index, 0u)) {
      markerBits = 1u;
    } else if (dggs_a5_has_bit(index, 2u)) {
      markerBits = 3u;
    }
    quintantShift = DGGS_A5_HILBERT_START_BIT + markerBits;
    quintantOffset = select(select(40u, 32u, markerBits == 3u), 0u, markerBits == 1u);
  }

  let topBits = dggs_u64_shift_right(index, quintantShift).y + quintantOffset;
  if (resolution == 0u) {
    if (topBits >= 12u) {
      return DggsA5Cell(0u, 0u, resolution, 0u, quintantShift, 0u);
    }
    return DggsA5Cell(topBits, 0u, resolution, 1u, quintantShift, 0u);
  }

  let origin = topBits / 5u;
  if (origin >= 12u) {
    return DggsA5Cell(0u, 0u, resolution, 0u, quintantShift, 0u);
  }
  let segment = (topBits + dggs_a5_get_origin_first_quintant(origin)) % 5u;
  let hilbertResolution = select(0u, resolution - 1u, resolution >= 2u);
  return DggsA5Cell(origin, segment, resolution, 1u, quintantShift, hilbertResolution);
}

fn dggs_a5_segment_to_anchor_info(cell : DggsA5Cell) -> DggsA5Anchor {
  let firstQuintant = dggs_a5_get_origin_first_quintant(cell.origin);
  let faceRelativeQuintant = (cell.segment + 5u - firstQuintant) % 5u;
  let orientation = dggs_a5_get_origin_orientation(cell.origin, faceRelativeQuintant);
  let step = dggs_a5_get_origin_step(cell.origin);
  let quintant = u32(dggs_a5_positive_mod_i32(
    i32(firstQuintant) + step * i32(faceRelativeQuintant),
    5
  ));
  return DggsA5Anchor(0u, vec2i(0), vec2i(1), orientation, quintant);
}

fn dggs_a5_is_reverse_orientation(orientation : u32) -> bool {
  return orientation == 1u || orientation == 3u || orientation == 4u;
}

fn dggs_a5_is_invert_j_orientation(orientation : u32) -> bool {
  return orientation == 5u || orientation == 4u;
}

fn dggs_a5_is_flip_ij_orientation(orientation : u32) -> bool {
  return orientation == 3u || orientation == 2u;
}

fn dggs_a5_pattern_value(index : u32, flipIj : bool) -> u32 {
  let pattern = array<u32, 8>(0u, 1u, 3u, 4u, 5u, 6u, 7u, 2u);
  let flippedPattern = array<u32, 8>(0u, 1u, 2u, 7u, 3u, 4u, 5u, 6u);
  return select(pattern[min(index, 7u)], flippedPattern[min(index, 7u)], flipIj);
}

fn dggs_a5_quaternary_to_flips(digit : u32) -> vec2i {
  if (digit == 1u) {
    return vec2i(1, -1);
  }
  if (digit == 3u) {
    return vec2i(-1, 1);
  }
  return vec2i(1, 1);
}

fn dggs_a5_quaternary_to_kj(digit : u32, flips : vec2i) -> vec2i {
  var p = vec2i(0);
  var q = vec2i(0);
  if (flips.x == 1 && flips.y == 1) {
    p = vec2i(1, 0);
    q = vec2i(0, 1);
  } else if (flips.x == -1 && flips.y == 1) {
    p = vec2i(0, -1);
    q = vec2i(-1, 0);
  } else if (flips.x == 1 && flips.y == -1) {
    p = vec2i(0, 1);
    q = vec2i(1, 0);
  } else {
    p = vec2i(-1, 0);
    q = vec2i(0, -1);
  }

  if (digit == 1u) {
    return p;
  }
  if (digit == 2u) {
    return p + q;
  }
  if (digit == 3u) {
    return q + 2 * p;
  }
  return vec2i(0);
}

fn dggs_a5_kj_to_ij(kj : vec2i) -> vec2i {
  return vec2i(kj.x - kj.y, kj.y);
}

fn dggs_a5_shift_digits(
  digits : ptr<function, array<u32, 29>>,
  digitIndex : u32,
  flips : vec2i,
  invertJ : bool,
  flipIj : bool
) {
  if (digitIndex == 0u) {
    return;
  }
  let parentK = (*digits)[digitIndex];
  let childK = (*digits)[digitIndex - 1u];
  let flipSum = flips.x + flips.y;
  var needsShift = true;
  var first = true;
  if (invertJ != (flipSum == 0)) {
    needsShift = parentK == 1u || parentK == 2u;
    first = parentK == 1u;
  } else {
    needsShift = parentK < 2u;
    first = parentK == 0u;
  }
  if (!needsShift) {
    return;
  }
  let source = select(childK + 4u, childK, first);
  let destination = dggs_a5_pattern_value(source, flipIj);
  (*digits)[digitIndex - 1u] = destination % 4u;
  (*digits)[digitIndex] = u32(dggs_a5_positive_mod_i32(
    i32(parentK) + 4 + i32(destination / 4u) - i32(source / 4u),
    4
  ));
}

fn dggs_a5_make_anchor(index : vec2u, cell : DggsA5Cell, anchorInfo : DggsA5Anchor) -> DggsA5Anchor {
  if (cell.hilbertResolution == 0u) {
    return anchorInfo;
  }

  let reverse = dggs_a5_is_reverse_orientation(anchorInfo.orientation);
  let invertJ = dggs_a5_is_invert_j_orientation(anchorInfo.orientation);
  let flipIj = dggs_a5_is_flip_ij_orientation(anchorInfo.orientation);
  let hilbertBits = 2u * cell.hilbertResolution;
  let sBitOffset = cell.quintantShift - hilbertBits;
  var digits : array<u32, 29>;
  var digitIndex = 0u;
  loop {
    if (digitIndex >= cell.hilbertResolution) {
      break;
    }
    var digit = dggs_u64_extract_bits(index, sBitOffset + 2u * digitIndex, 2u);
    if (reverse) {
      digit = 3u - digit;
    }
    digits[digitIndex] = digit;
    digitIndex += 1u;
  }

  var flips = vec2i(1, 1);
  digitIndex = cell.hilbertResolution;
  loop {
    if (digitIndex == 0u) {
      break;
    }
    digitIndex -= 1u;
    dggs_a5_shift_digits(&digits, digitIndex, flips, invertJ, flipIj);
    flips *= dggs_a5_quaternary_to_flips(digits[digitIndex]);
  }

  flips = vec2i(1, 1);
  var offset = vec2i(0);
  digitIndex = cell.hilbertResolution;
  loop {
    if (digitIndex == 0u) {
      break;
    }
    digitIndex -= 1u;
    offset *= 2;
    offset += dggs_a5_quaternary_to_kj(digits[digitIndex], flips);
    flips *= dggs_a5_quaternary_to_flips(digits[digitIndex]);
  }

  var anchorOffset = dggs_a5_kj_to_ij(offset);
  if (flipIj) {
    let originalOffset = anchorOffset;
    anchorOffset = originalOffset.yx;
    if (flips.x == -1) {
      anchorOffset += vec2i(-1, 1);
    }
    if (flips.y == -1) {
      anchorOffset -= vec2i(-1, 1);
    }
  }
  if (invertJ) {
    let i = anchorOffset.x;
    let j = i32(1u << cell.hilbertResolution) - (i + anchorOffset.y);
    flips.x = -flips.x;
    anchorOffset.y = j;
  }

  return DggsA5Anchor(
    digits[0],
    anchorOffset,
    flips,
    anchorInfo.orientation,
    anchorInfo.quintant
  );
}

fn dggs_a5_rotate_face_point(point : vec2f, quintant : u32) -> vec2f {
  let angle = f32(quintant) * DGGS_TWO_PI_OVER_5;
  let cosine = cos(angle);
  let sine = sin(angle);
  return vec2f(point.x * cosine - point.y * sine, point.x * sine + point.y * cosine);
}

fn dggs_a5_get_base_pentagon_vertex(vertexIndex : u32) -> vec2f {
  let vertices = array<vec2f, 5>(
    vec2f(0.0, 0.0),
    vec2f(0.199381847431, 0.375413822391),
    vec2f(0.618033988750, 0.449027976580),
    vec2f(0.817415836181, 0.073614154188),
    vec2f(0.418652141319, -0.073614154188)
  );
  return vertices[min(vertexIndex, 4u)];
}

fn dggs_a5_get_base_triangle_vertex(vertexIndex : u32) -> vec2f {
  let vertices = array<vec2f, 3>(
    vec2f(0.0, 0.0),
    vec2f(0.618033988750, 0.449027976580),
    vec2f(0.618033988750, -0.449027976580)
  );
  return vertices[min(vertexIndex, 2u)];
}

fn dggs_a5_get_face_vertex(vertexIndex : u32) -> vec2f {
  return dggs_a5_rotate_face_point(dggs_a5_get_base_triangle_vertex(1u), 4u - min(vertexIndex, 4u));
}

fn dggs_a5_get_triangle_vertex(quintant : u32, vertexIndex : u32) -> vec2f {
  return dggs_a5_rotate_face_point(dggs_a5_get_base_triangle_vertex(vertexIndex), quintant);
}

fn dggs_a5_get_pentagon_vertex(
  anchor : DggsA5Anchor,
  hilbertResolution : u32,
  vertexIndex : u32
) -> vec2f {
  let flipSum = anchor.flips.x + anchor.flips.y;
  let reflectsY = ((flipSum == -2 || flipSum == 2) && anchor.q > 1u) ||
    (flipSum == 0 && (anchor.q == 0u || anchor.q == 3u));
  let sourceIndex = select(vertexIndex, 4u - vertexIndex, reflectsY);
  var point = dggs_a5_get_base_pentagon_vertex(sourceIndex);

  if (anchor.flips.x == 1 && anchor.flips.y == -1) {
    point = -point;
  }
  if (reflectsY) {
    point.y = -point.y;
  }
  if (anchor.flips.x == -1 && anchor.flips.y == -1) {
    point = -point;
  } else if (anchor.flips.x == -1) {
    point += vec2f(-0.618033988750, 0.449027976580);
  } else if (anchor.flips.y == -1) {
    point += vec2f(0.618033988750, -0.449027976580);
  }

  let translation = vec2f(
    f32(anchor.offset.x) * 0.618033988750 + f32(anchor.offset.y) * 0.618033988750,
    f32(anchor.offset.x) * 0.449027976580 + f32(anchor.offset.y) * -0.449027976580
  );
  point = (point + translation) / f32(1u << hilbertResolution);
  return dggs_a5_rotate_face_point(point, anchor.quintant);
}

fn dggs_a5_get_shape_vertex_count(cell : DggsA5Cell) -> u32 {
  return select(5u, 3u, cell.resolution == 1u);
}

fn dggs_a5_get_reversed_shape_index(vertexIndex : u32, shapeVertexCount : u32) -> u32 {
  if (vertexIndex == 0u || vertexIndex >= shapeVertexCount) {
    return 0u;
  }
  return shapeVertexCount - vertexIndex;
}

fn dggs_a5_get_cell_shape_face_point(index : vec2u, cell : DggsA5Cell, shapeIndex : u32) -> vec2f {
  let anchorInfo = dggs_a5_segment_to_anchor_info(cell);
  if (cell.resolution == 0u) {
    return dggs_a5_get_face_vertex(shapeIndex);
  }
  if (cell.resolution == 1u) {
    return dggs_a5_get_triangle_vertex(anchorInfo.quintant, shapeIndex);
  }
  let anchor = dggs_a5_make_anchor(index, cell, anchorInfo);
  return dggs_a5_get_pentagon_vertex(anchor, cell.hilbertResolution, shapeIndex);
}

fn dggs_a5_get_cell_center_face_point(index : vec2u, cell : DggsA5Cell) -> vec2f {
  let shapeVertexCount = dggs_a5_get_shape_vertex_count(cell);
  var center = vec2f(0.0);
  var vertexIndex = 0u;
  loop {
    if (vertexIndex >= shapeVertexCount) {
      break;
    }
    center += dggs_a5_get_cell_shape_face_point(index, cell, vertexIndex);
    vertexIndex += 1u;
  }
  return center / f32(shapeVertexCount);
}

fn dggs_a5_to_polar(point : vec2f) -> vec2f {
  return vec2f(length(point), atan2(point.y, point.x));
}

fn dggs_a5_to_cartesian(thetaPhi : vec2f) -> vec3f {
  let sinPhi = sin(thetaPhi.y);
  return vec3f(sinPhi * cos(thetaPhi.x), sinPhi * sin(thetaPhi.x), cos(thetaPhi.y));
}

fn dggs_a5_normalize_vec3(point : vec3f) -> vec3f {
  let magnitude = length(point);
  if (magnitude < 1.0e-12) {
    return vec3f(0.0, 0.0, 1.0);
  }
  return point / magnitude;
}

fn dggs_a5_get_face_triangle_index(polar : vec2f) -> u32 {
  return u32(dggs_a5_positive_mod_i32(i32(floor(polar.y / DGGS_PI_OVER_5)), 10));
}

fn dggs_a5_normalize_gamma(gamma : f32) -> f32 {
  let segment = gamma / DGGS_TWO_PI_OVER_5;
  return (segment - round(segment)) * DGGS_TWO_PI_OVER_5;
}

fn dggs_a5_should_reflect(polar : vec2f) -> bool {
  return polar.x * cos(dggs_a5_normalize_gamma(polar.y)) > DGGS_A5_DISTANCE_TO_EDGE;
}

fn dggs_a5_get_base_face_triangle(faceTriangleIndex : u32) -> DggsA5FaceTriangle {
  let quintant = ((faceTriangleIndex + 1u) / 2u) % 5u;
  let center = dggs_a5_get_triangle_vertex(quintant, 0u);
  let corner1 = dggs_a5_get_triangle_vertex(quintant, 1u);
  let corner2 = dggs_a5_get_triangle_vertex(quintant, 2u);
  let edgeMidpoint = (corner1 + corner2) * 0.5;
  if ((faceTriangleIndex & 1u) == 0u) {
    return DggsA5FaceTriangle(center, edgeMidpoint, corner1);
  }
  return DggsA5FaceTriangle(center, corner2, edgeMidpoint);
}

fn dggs_a5_get_face_triangle_vertex(triangle : DggsA5FaceTriangle, vertexIndex : u32) -> vec2f {
  if (vertexIndex == 0u) {
    return triangle.a;
  }
  if (vertexIndex == 1u) {
    return triangle.b;
  }
  return triangle.c;
}

fn dggs_a5_get_reflected_face_triangle(
  faceTriangleIndex : u32,
  squashed : bool
) -> DggsA5FaceTriangle {
  let baseTriangle = dggs_a5_get_base_face_triangle(faceTriangleIndex);
  let even = (faceTriangleIndex & 1u) == 0u;
  let midpoint = select(baseTriangle.c, baseTriangle.b, even);
  let scale = select(2.0, DGGS_A5_REFLECTED_TRIANGLE_SCALE, squashed);
  let reflectedA = -baseTriangle.a + midpoint * scale;
  return DggsA5FaceTriangle(reflectedA, baseTriangle.c, baseTriangle.b);
}

fn dggs_a5_get_face_triangle(
  faceTriangleIndex : u32,
  reflected : bool,
  squashed : bool
) -> DggsA5FaceTriangle {
  if (reflected) {
    return dggs_a5_get_reflected_face_triangle(faceTriangleIndex, squashed);
  }
  return dggs_a5_get_base_face_triangle(faceTriangleIndex);
}

fn dggs_a5_face_triangle_to_spherical_triangle(
  faceTriangleIndex : u32,
  origin : u32,
  reflected : bool
) -> DggsA5SphericalTriangle {
  let faceTriangle = dggs_a5_get_face_triangle(faceTriangleIndex, reflected, true);
  let originAngle = dggs_a5_get_origin_angle(origin);
  let quaternion = dggs_a5_get_origin_quaternion(origin);

  let polarA = dggs_a5_to_polar(faceTriangle.a);
  let polarB = dggs_a5_to_polar(faceTriangle.b);
  let polarC = dggs_a5_to_polar(faceTriangle.c);
  let sphericalA = dggs_a5_quaternion_rotate(
    dggs_a5_to_cartesian(vec2f(polarA.y + originAngle, atan(polarA.x))),
    quaternion
  );
  let sphericalB = dggs_a5_quaternion_rotate(
    dggs_a5_to_cartesian(vec2f(polarB.y + originAngle, atan(polarB.x))),
    quaternion
  );
  let sphericalC = dggs_a5_quaternion_rotate(
    dggs_a5_to_cartesian(vec2f(polarC.y + originAngle, atan(polarC.x))),
    quaternion
  );
  return DggsA5SphericalTriangle(
    dggs_a5_normalize_vec3(sphericalA),
    dggs_a5_normalize_vec3(sphericalB),
    dggs_a5_normalize_vec3(sphericalC)
  );
}

fn dggs_a5_face_to_barycentric(point : vec2f, triangle : DggsA5FaceTriangle) -> vec3f {
  let d31 = triangle.a - triangle.c;
  let d23 = triangle.c - triangle.b;
  let d3p = point - triangle.c;
  let determinant = d23.x * d31.y - d23.y * d31.x;
  if (abs(determinant) < 1.0e-12) {
    return vec3f(1.0, 0.0, 0.0);
  }
  let b0 = (d23.x * d3p.y - d23.y * d3p.x) / determinant;
  let b1 = (d31.x * d3p.y - d31.y * d3p.x) / determinant;
  return vec3f(b0, b1, 1.0 - (b0 + b1));
}

fn dggs_a5_triangle_area(a : vec3f, b : vec3f, c : vec3f) -> f32 {
  let midA = dggs_a5_normalize_vec3((b + c) * 0.5);
  let midB = dggs_a5_normalize_vec3((c + a) * 0.5);
  let midC = dggs_a5_normalize_vec3((a + b) * 0.5);
  let tripleProduct = dot(midA, cross(midB, midC));
  let clamped = clamp(tripleProduct, -1.0, 1.0);
  if (abs(clamped) < 1.0e-8) {
    return 2.0 * clamped;
  }
  return asin(clamped) * 2.0;
}

fn dggs_a5_spherical_triangle_area(triangle : DggsA5SphericalTriangle) -> f32 {
  return dggs_a5_triangle_area(triangle.a, triangle.b, triangle.c);
}

fn dggs_a5_vector_difference(a : vec3f, b : vec3f) -> f32 {
  let midpoint = dggs_a5_normalize_vec3((a + b) * 0.5);
  let crossProduct = cross(a, midpoint);
  let distance = length(crossProduct);
  if (distance < 1.0e-8) {
    return 0.5 * length(a - b);
  }
  return distance;
}

fn dggs_a5_slerp(a : vec3f, b : vec3f, t : f32) -> vec3f {
  let cosineGamma = clamp(dot(a, b), -1.0, 1.0);
  let gamma = acos(cosineGamma);
  if (gamma < 1.0e-8) {
    return dggs_a5_normalize_vec3(mix(a, b, t));
  }
  let sinGamma = sin(gamma);
  if (abs(sinGamma) < 1.0e-8) {
    return dggs_a5_normalize_vec3(mix(a, b, t));
  }
  let weightA = sin((1.0 - t) * gamma) / sinGamma;
  let weightB = sin(t * gamma) / sinGamma;
  return dggs_a5_normalize_vec3(weightA * a + weightB * b);
}

fn dggs_a5_safe_acos(value : f32) -> f32 {
  if (value < 1.0e-3) {
    return 2.0 * value + value * value * value / 3.0;
  }
  return acos(clamp(1.0 - 2.0 * value * value, -1.0, 1.0));
}

fn dggs_a5_polyhedral_inverse_edge(a : vec3f, b : vec3f, edgeHeight : f32) -> vec3f {
  let difference = dggs_a5_vector_difference(a, b);
  let denominator = max(dggs_a5_safe_acos(difference), 1.0e-8);
  let interpolation = dggs_a5_safe_acos(clamp(edgeHeight, 0.0, 1.0) * difference) / denominator;
  return dggs_a5_slerp(a, b, clamp(interpolation, 0.0, 1.0));
}

fn dggs_a5_polyhedral_inverse(
  facePoint : vec2f,
  faceTriangle : DggsA5FaceTriangle,
  sphericalTriangle : DggsA5SphericalTriangle
) -> vec3f {
  let barycentric = dggs_a5_face_to_barycentric(facePoint, faceTriangle);
  if (barycentric.x > 0.9999999) {
    return sphericalTriangle.a;
  }
  if (barycentric.y > 0.9999999) {
    return sphericalTriangle.b;
  }
  if (barycentric.z > 0.9999999) {
    return sphericalTriangle.c;
  }
  if (abs(barycentric.z) < 1.0e-6) {
    return dggs_a5_polyhedral_inverse_edge(
      sphericalTriangle.a,
      sphericalTriangle.b,
      1.0 - barycentric.x
    );
  }
  if (abs(barycentric.y) < 1.0e-6) {
    return dggs_a5_polyhedral_inverse_edge(
      sphericalTriangle.a,
      sphericalTriangle.c,
      1.0 - barycentric.x
    );
  }

  let crossBC = cross(sphericalTriangle.b, sphericalTriangle.c);
  let areaABC = dggs_a5_spherical_triangle_area(sphericalTriangle);
  let h = max(1.0 - barycentric.x, 1.0e-8);
  let areaRatio = barycentric.z / h;
  let alpha = areaRatio * areaABC;
  let sineAlpha = sin(alpha);
  let halfSineAlpha = sin(alpha * 0.5);
  let chordCoefficient = 2.0 * halfSineAlpha * halfSineAlpha;
  let dotAB = dot(sphericalTriangle.a, sphericalTriangle.b);
  let dotBC = dot(sphericalTriangle.b, sphericalTriangle.c);
  let dotCA = dot(sphericalTriangle.c, sphericalTriangle.a);
  let lengthBC = length(crossBC);
  let volume = dot(sphericalTriangle.a, crossBC);
  let f = sineAlpha * volume + chordCoefficient * (dotAB * dotBC - dotCA);
  let g = chordCoefficient * lengthBC * (1.0 + dotAB);
  let edgeAngle = max(acos(clamp(dotBC, -1.0, 1.0)), 1.0e-8);
  let q = 2.0 / edgeAngle * atan2(g, f);
  let pointOnBC = dggs_a5_slerp(sphericalTriangle.b, sphericalTriangle.c, q);
  let k = dggs_a5_vector_difference(sphericalTriangle.a, pointOnBC);
  let denominator = max(dggs_a5_safe_acos(k), 1.0e-8);
  let t = dggs_a5_safe_acos(h * k) / denominator;
  return dggs_a5_slerp(sphericalTriangle.a, pointOnBC, t);
}

fn dggs_a5_authalic_inverse(phi : f32) -> f32 {
  let sinPhi = sin(phi);
  let cosPhi = cos(phi);
  let coefficientX = 2.0 * (cosPhi - sinPhi) * (cosPhi + sinPhi);
  var u0 = coefficientX * 4.92842354825238055e-17 + 2.19128723067677184e-14;
  var u1 = coefficientX * u0 + 1.02018123778161003e-11;
  u0 = coefficientX * u1 - u0 + 5.08622073997266026e-9;
  u1 = coefficientX * u0 - u1 + 0.00000288319780486075558;
  u0 = coefficientX * u1 - u0 + 0.00223920899635416575;
  return phi + 2.0 * sinPhi * cosPhi * u0;
}

fn dggs_a5_normalize_longitude(longitude : f32) -> f32 {
  var result = longitude;
  loop {
    if (result < -180.0) {
      result += 360.0;
    } else {
      break;
    }
  }
  loop {
    if (result >= 180.0) {
      result -= 360.0;
    } else {
      break;
    }
  }
  return result;
}

fn dggs_a5_normalize_longitude_to_center(longitude : f32, centerLongitude : f32) -> f32 {
  var result = longitude;
  loop {
    if (result - centerLongitude > 180.0) {
      result -= 360.0;
    } else {
      break;
    }
  }
  loop {
    if (result - centerLongitude < -180.0) {
      result += 360.0;
    } else {
      break;
    }
  }
  return result;
}

fn dggs_a5_sphere_to_lnglat(cartesian : vec3f) -> vec2f {
  let point = dggs_a5_normalize_vec3(cartesian);
  let theta = atan2(point.y, point.x);
  let phi = acos(clamp(point.z, -1.0, 1.0));
  let longitude = dggs_a5_normalize_longitude(theta * DGGS_RADIANS_TO_DEGREES - DGGS_A5_LONGITUDE_OFFSET);
  let authalicLatitude = DGGS_PI_OVER_2 - phi;
  let latitude = dggs_a5_authalic_inverse(authalicLatitude) * DGGS_RADIANS_TO_DEGREES;
  return vec2f(longitude, latitude);
}

fn dggs_a5_face_to_lnglat(facePoint : vec2f, origin : u32) -> vec2f {
  let polar = dggs_a5_to_polar(facePoint);
  let faceTriangleIndex = dggs_a5_get_face_triangle_index(polar);
  let reflected = dggs_a5_should_reflect(polar);
  let faceTriangle = dggs_a5_get_face_triangle(faceTriangleIndex, reflected, false);
  let sphericalTriangle = dggs_a5_face_triangle_to_spherical_triangle(
    faceTriangleIndex,
    origin,
    reflected
  );
  return dggs_a5_sphere_to_lnglat(
    dggs_a5_polyhedral_inverse(facePoint, faceTriangle, sphericalTriangle)
  );
}

fn dggs_a5_get_boundary_point(index : vec2u, vertexIndex : u32) -> vec2f {
  let cell = dggs_a5_deserialize(index);
  if (cell.valid == 0u || dggs_u64_is_zero(index)) {
    return vec2f(0.0);
  }

  let shapeVertexCount = dggs_a5_get_shape_vertex_count(cell);
  let shapeIndex = dggs_a5_get_reversed_shape_index(vertexIndex, shapeVertexCount);
  let facePoint = dggs_a5_get_cell_shape_face_point(index, cell, shapeIndex);
  let centerPoint = dggs_a5_get_cell_center_face_point(index, cell);
  var lngLat = dggs_a5_face_to_lnglat(facePoint, cell.origin);
  let centerLngLat = dggs_a5_face_to_lnglat(centerPoint, cell.origin);
  lngLat.x = dggs_a5_normalize_longitude_to_center(lngLat.x, centerLngLat.x);
  return lngLat;
}

fn dggs_a5_get_boundary_point_fp64_split(index : vec2u, vertexIndex : u32) -> vec4f {
  return dggs_boundary_point_to_fp64_split(dggs_a5_get_boundary_point(index, vertexIndex));
}

fn dggs_h3_get_mode(index: vec2u) -> u32 {
  return dggs_u64_extract_bits(index, 59u, 4u);
}

fn dggs_h3_is_cell_mode(index: vec2u) -> bool {
  return dggs_h3_get_mode(index) == DGGS_H3_CELL_MODE;
}

fn dggs_h3_get_resolution(index: vec2u) -> u32 {
  return dggs_u64_extract_bits(index, 52u, 4u);
}

fn dggs_h3_get_base_cell(index: vec2u) -> u32 {
  return dggs_u64_extract_bits(index, 45u, 7u);
}

fn dggs_h3_digit_bit_offset(resolution: u32) -> u32 {
  return 3u * (DGGS_H3_MAX_RESOLUTION - resolution);
}

fn dggs_h3_get_digit(index: vec2u, resolution: u32) -> u32 {
  if (resolution == 0u || resolution > DGGS_H3_MAX_RESOLUTION) {
    return DGGS_H3_UNUSED_DIGIT;
  }
  return dggs_u64_extract_bits(index, dggs_h3_digit_bit_offset(resolution), 3u);
}

fn dggs_h3_is_valid_cell_id(index: vec2u) -> bool {
  let cellResolution = dggs_h3_get_resolution(index);
  if (
    !dggs_h3_is_cell_mode(index) ||
    cellResolution > DGGS_H3_MAX_RESOLUTION ||
    dggs_h3_get_base_cell(index) > DGGS_H3_MAX_BASE_CELL
  ) {
    return false;
  }

  var digitResolution = 1u;
  loop {
    if (digitResolution > DGGS_H3_MAX_RESOLUTION) {
      break;
    }

    let digit = dggs_h3_get_digit(index, digitResolution);
    if (digitResolution <= cellResolution) {
      if (digit == DGGS_H3_UNUSED_DIGIT) {
        return false;
      }
    } else if (digit != DGGS_H3_UNUSED_DIGIT) {
      return false;
    }
    digitResolution += 1u;
  }
  return true;
}

fn dggs_h3_get_parent(index: vec2u, parentResolution: u32) -> vec2u {
  let currentResolution = dggs_h3_get_resolution(index);
  let targetResolution = min(parentResolution, currentResolution);
  var parent = dggs_u64_set_bits(index, 52u, 4u, targetResolution);
  var resolution = targetResolution + 1u;
  loop {
    if (resolution > DGGS_H3_MAX_RESOLUTION) {
      break;
    }
    parent = dggs_u64_set_bits(
      parent,
      dggs_h3_digit_bit_offset(resolution),
      3u,
      DGGS_H3_UNUSED_DIGIT
    );
    resolution += 1u;
  }
  return parent;
}

fn dggs_h3_positive_angle_rads(angle: f32) -> f32 {
  var result = angle;
  if (result < 0.0) {
    result += DGGS_TWO_PI;
  }
  if (result >= DGGS_TWO_PI) {
    result -= DGGS_TWO_PI;
  }
  return result;
}

fn dggs_h3_constrain_longitude(longitude: f32) -> f32 {
  var result = longitude;
  loop {
    if (result <= DGGS_PI) {
      break;
    }
    result -= DGGS_TWO_PI;
  }
  loop {
    if (result >= -DGGS_PI) {
      break;
    }
    result += DGGS_TWO_PI;
  }
  return result;
}

fn dggs_h3_is_resolution_class_iii(resolution: u32) -> bool {
  return (resolution & 1u) != 0u;
}

fn dggs_h3_is_base_cell_pentagon(baseCell: u32) -> bool {
  return baseCell == 4u ||
    baseCell == 14u ||
    baseCell == 24u ||
    baseCell == 38u ||
    baseCell == 49u ||
    baseCell == 58u ||
    baseCell == 63u ||
    baseCell == 72u ||
    baseCell == 83u ||
    baseCell == 97u ||
    baseCell == 107u ||
    baseCell == 117u;
}

fn dggs_h3_get_base_cell_home(baseCell: u32) -> DggsH3FaceIJK {
  let values = array<vec4i, 122>(
    vec4i(1, 1, 0, 0),
    vec4i(2, 1, 1, 0),
    vec4i(1, 0, 0, 0),
    vec4i(2, 1, 0, 0),
    vec4i(0, 2, 0, 0),
    vec4i(1, 1, 1, 0),
    vec4i(1, 0, 0, 1),
    vec4i(2, 0, 0, 0),
    vec4i(0, 1, 0, 0),
    vec4i(2, 0, 1, 0),
    vec4i(1, 0, 1, 0),
    vec4i(1, 0, 1, 1),
    vec4i(3, 1, 0, 0),
    vec4i(3, 1, 1, 0),
    vec4i(11, 2, 0, 0),
    vec4i(4, 1, 0, 0),
    vec4i(0, 0, 0, 0),
    vec4i(6, 0, 1, 0),
    vec4i(0, 0, 0, 1),
    vec4i(2, 0, 1, 1),
    vec4i(7, 0, 0, 1),
    vec4i(2, 0, 0, 1),
    vec4i(0, 1, 1, 0),
    vec4i(6, 0, 0, 1),
    vec4i(10, 2, 0, 0),
    vec4i(6, 0, 0, 0),
    vec4i(3, 0, 0, 0),
    vec4i(11, 1, 0, 0),
    vec4i(4, 1, 1, 0),
    vec4i(3, 0, 1, 0),
    vec4i(0, 0, 1, 1),
    vec4i(4, 0, 0, 0),
    vec4i(5, 0, 1, 0),
    vec4i(0, 0, 1, 0),
    vec4i(7, 0, 1, 0),
    vec4i(11, 1, 1, 0),
    vec4i(7, 0, 0, 0),
    vec4i(10, 1, 0, 0),
    vec4i(12, 2, 0, 0),
    vec4i(6, 1, 0, 1),
    vec4i(7, 1, 0, 1),
    vec4i(4, 0, 0, 1),
    vec4i(3, 0, 0, 1),
    vec4i(3, 0, 1, 1),
    vec4i(4, 0, 1, 0),
    vec4i(6, 1, 0, 0),
    vec4i(11, 0, 0, 0),
    vec4i(8, 0, 0, 1),
    vec4i(5, 0, 0, 1),
    vec4i(14, 2, 0, 0),
    vec4i(5, 0, 0, 0),
    vec4i(12, 1, 0, 0),
    vec4i(10, 1, 1, 0),
    vec4i(4, 0, 1, 1),
    vec4i(12, 1, 1, 0),
    vec4i(7, 1, 0, 0),
    vec4i(11, 0, 1, 0),
    vec4i(10, 0, 0, 0),
    vec4i(13, 2, 0, 0),
    vec4i(10, 0, 0, 1),
    vec4i(11, 0, 0, 1),
    vec4i(9, 0, 1, 0),
    vec4i(8, 0, 1, 0),
    vec4i(6, 2, 0, 0),
    vec4i(8, 0, 0, 0),
    vec4i(9, 0, 0, 1),
    vec4i(14, 1, 0, 0),
    vec4i(5, 1, 0, 1),
    vec4i(16, 0, 1, 1),
    vec4i(8, 1, 0, 1),
    vec4i(5, 1, 0, 0),
    vec4i(12, 0, 0, 0),
    vec4i(7, 2, 0, 0),
    vec4i(12, 0, 1, 0),
    vec4i(10, 0, 1, 0),
    vec4i(9, 0, 0, 0),
    vec4i(13, 1, 0, 0),
    vec4i(16, 0, 0, 1),
    vec4i(15, 0, 1, 1),
    vec4i(15, 0, 1, 0),
    vec4i(16, 0, 1, 0),
    vec4i(14, 1, 1, 0),
    vec4i(13, 1, 1, 0),
    vec4i(5, 2, 0, 0),
    vec4i(8, 1, 0, 0),
    vec4i(14, 0, 0, 0),
    vec4i(9, 1, 0, 1),
    vec4i(14, 0, 0, 1),
    vec4i(17, 0, 0, 1),
    vec4i(12, 0, 0, 1),
    vec4i(16, 0, 0, 0),
    vec4i(17, 0, 1, 1),
    vec4i(15, 0, 0, 1),
    vec4i(16, 1, 0, 1),
    vec4i(9, 1, 0, 0),
    vec4i(15, 0, 0, 0),
    vec4i(13, 0, 0, 0),
    vec4i(8, 2, 0, 0),
    vec4i(13, 0, 1, 0),
    vec4i(17, 1, 0, 1),
    vec4i(19, 0, 1, 0),
    vec4i(14, 0, 1, 0),
    vec4i(19, 0, 1, 1),
    vec4i(17, 0, 1, 0),
    vec4i(13, 0, 0, 1),
    vec4i(17, 0, 0, 0),
    vec4i(16, 1, 0, 0),
    vec4i(9, 2, 0, 0),
    vec4i(15, 1, 0, 1),
    vec4i(15, 1, 0, 0),
    vec4i(18, 0, 1, 1),
    vec4i(18, 0, 0, 1),
    vec4i(19, 0, 0, 1),
    vec4i(17, 1, 0, 0),
    vec4i(19, 0, 0, 0),
    vec4i(18, 0, 1, 0),
    vec4i(18, 1, 0, 1),
    vec4i(19, 2, 0, 0),
    vec4i(19, 1, 0, 0),
    vec4i(18, 0, 0, 0),
    vec4i(19, 1, 0, 1),
    vec4i(18, 1, 0, 0)
  );
  let value = values[min(baseCell, DGGS_H3_MAX_BASE_CELL)];
  return DggsH3FaceIJK(
    u32(value.x),
    value.yzw,
    select(1u, 0u, baseCell > DGGS_H3_MAX_BASE_CELL)
  );
}

fn dggs_h3_get_face_center_geo(face: u32) -> vec2f {
  let values = array<vec2f, 20>(
    vec2f(0.803582649718989942, 1.248397419617396099),
    vec2f(1.307747883455638156, 2.536945009877921159),
    vec2f(1.054751253523952054, -1.347517358900396623),
    vec2f(0.600191595538186799, -0.450603909469755746),
    vec2f(0.491715428198773866, 0.401988202911306943),
    vec2f(0.172745327415618701, 1.678146885280433686),
    vec2f(0.605929321571350690, 2.953923329812411617),
    vec2f(0.427370518328979641, -1.888876200336285401),
    vec2f(-0.079066118549212831, -0.733429513380867741),
    vec2f(-0.230961644455383637, 0.506495587332349035),
    vec2f(0.079066118549212831, 2.408163140208925497),
    vec2f(0.230961644455383637, -2.635097066257444203),
    vec2f(-0.172745327415618701, -1.463445768309359553),
    vec2f(-0.605929321571350690, -0.187669323777381622),
    vec2f(-0.427370518328979641, 1.252716453253507838),
    vec2f(-0.600191595538186799, 2.690988744120037492),
    vec2f(-0.491715428198773866, -2.739604450678486295),
    vec2f(-0.803582649718989942, -1.893195233972397139),
    vec2f(-1.307747883455638156, -0.604647643711872080),
    vec2f(-1.054751253523952054, 1.794075294689396615)
  );
  return values[min(face, 19u)];
}

fn dggs_h3_get_face_axis_azimuths(face: u32) -> vec3f {
  let values = array<vec3f, 20>(
    vec3f(5.619958268523939882, 3.525563166130744542, 1.431168063737548730),
    vec3f(5.760339081714187279, 3.665943979320991689, 1.571548876927796127),
    vec3f(0.780213654393430055, 4.969003859179821079, 2.874608756786625655),
    vec3f(0.430469363979999913, 4.619259568766391033, 2.524864466373195467),
    vec3f(6.130269123335111400, 4.035874020941915804, 1.941478918548720291),
    vec3f(2.692877706530642877, 0.598482604137447119, 4.787272808923838195),
    vec3f(2.982963003477243874, 0.888567901084048369, 5.077358105870439581),
    vec3f(3.532912002790141181, 1.438516900396945656, 5.627307105183336758),
    vec3f(3.494305004259568154, 1.399909901866372864, 5.588700106652763840),
    vec3f(3.003214169499538391, 0.908819067106342928, 5.097609271892733906),
    vec3f(5.930472956509811562, 3.836077854116615875, 1.741682751723420374),
    vec3f(0.138378484090254847, 4.327168688876645809, 2.232773586483450311),
    vec3f(0.448714947059150361, 4.637505151845541521, 2.543110049452346120),
    vec3f(0.158629650112549365, 4.347419854898940135, 2.253024752505744869),
    vec3f(5.891865957979238535, 3.797470855586042958, 1.703075753192847583),
    vec3f(2.711123289609793325, 0.616728187216597771, 4.805518392002988683),
    vec3f(3.294508837434268316, 1.200113735041072948, 5.388903939827463911),
    vec3f(3.804819692245439833, 1.710424589852244509, 5.899214794638635174),
    vec3f(3.664438879055192436, 1.570043776661997111, 5.758833981448388027),
    vec3f(2.361378999196363184, 0.266983896803167583, 4.455774101589558636)
  );
  return values[min(face, 19u)];
}

fn dggs_h3_get_max_dim_by_cii_resolution(resolution: u32) -> i32 {
  let values = array<i32, 17>(
    2, -1, 14, -1, 98, -1, 686, -1, 4802, -1, 33614, -1, 235298, -1, 1647086, -1, 11529602
  );
  return values[min(resolution, 16u)];
}

fn dggs_h3_get_unit_vector(digit: u32) -> vec3i {
  if (digit == 1u) {
    return vec3i(0, 0, 1);
  }
  if (digit == 2u) {
    return vec3i(0, 1, 0);
  }
  if (digit == 3u) {
    return vec3i(0, 1, 1);
  }
  if (digit == 4u) {
    return vec3i(1, 0, 0);
  }
  if (digit == 5u) {
    return vec3i(1, 0, 1);
  }
  if (digit == 6u) {
    return vec3i(1, 1, 0);
  }
  return vec3i(0);
}

fn dggs_h3_ijk_normalize(coord: vec3i) -> vec3i {
  var normalized = coord;
  if (normalized.x < 0) {
    normalized.y -= normalized.x;
    normalized.z -= normalized.x;
    normalized.x = 0;
  }
  if (normalized.y < 0) {
    normalized.x -= normalized.y;
    normalized.z -= normalized.y;
    normalized.y = 0;
  }
  if (normalized.z < 0) {
    normalized.x -= normalized.z;
    normalized.y -= normalized.z;
    normalized.z = 0;
  }

  let minimumValue = min(normalized.x, min(normalized.y, normalized.z));
  if (minimumValue > 0) {
    normalized -= vec3i(minimumValue);
  }
  return normalized;
}

fn dggs_h3_neighbor(coord: vec3i, digit: u32) -> vec3i {
  if (digit > 0u && digit < DGGS_H3_UNUSED_DIGIT) {
    return dggs_h3_ijk_normalize(coord + dggs_h3_get_unit_vector(digit));
  }
  return coord;
}

fn dggs_h3_down_ap3(coord: vec3i) -> vec3i {
  let iVector = vec3i(2, 0, 1) * coord.x;
  let jVector = vec3i(1, 2, 0) * coord.y;
  let kVector = vec3i(0, 1, 2) * coord.z;
  return dggs_h3_ijk_normalize(iVector + jVector + kVector);
}

fn dggs_h3_down_ap3r(coord: vec3i) -> vec3i {
  let iVector = vec3i(2, 1, 0) * coord.x;
  let jVector = vec3i(0, 2, 1) * coord.y;
  let kVector = vec3i(1, 0, 2) * coord.z;
  return dggs_h3_ijk_normalize(iVector + jVector + kVector);
}

fn dggs_h3_down_ap7(coord: vec3i) -> vec3i {
  let iVector = vec3i(3, 0, 1) * coord.x;
  let jVector = vec3i(1, 3, 0) * coord.y;
  let kVector = vec3i(0, 1, 3) * coord.z;
  return dggs_h3_ijk_normalize(iVector + jVector + kVector);
}

fn dggs_h3_down_ap7r(coord: vec3i) -> vec3i {
  let iVector = vec3i(3, 1, 0) * coord.x;
  let jVector = vec3i(0, 3, 1) * coord.y;
  let kVector = vec3i(1, 0, 3) * coord.z;
  return dggs_h3_ijk_normalize(iVector + jVector + kVector);
}

fn dggs_h3_get_center_face_ijk(index: vec2u) -> DggsH3FaceIJK {
  if (!dggs_h3_is_valid_cell_id(index)) {
    return DggsH3FaceIJK(0u, vec3i(0), 0u);
  }

  let baseCell = dggs_h3_get_base_cell(index);
  if (dggs_h3_is_base_cell_pentagon(baseCell)) {
    return DggsH3FaceIJK(0u, vec3i(0), 0u);
  }

  var faceIJK = dggs_h3_get_base_cell_home(baseCell);
  let cellResolution = dggs_h3_get_resolution(index);
  var resolution = 1u;
  loop {
    if (resolution > cellResolution) {
      break;
    }

    if (dggs_h3_is_resolution_class_iii(resolution)) {
      faceIJK.coord = dggs_h3_down_ap7(faceIJK.coord);
    } else {
      faceIJK.coord = dggs_h3_down_ap7r(faceIJK.coord);
    }
    faceIJK.coord = dggs_h3_neighbor(faceIJK.coord, dggs_h3_get_digit(index, resolution));
    resolution += 1u;
  }

  return faceIJK;
}

fn dggs_h3_get_vertex_offset(resolution: u32, vertexIndex: u32) -> vec3i {
  let pointIndex = vertexIndex % 6u;
  if (dggs_h3_is_resolution_class_iii(resolution)) {
    let vertices = array<vec3i, 6>(
      vec3i(5, 4, 0),
      vec3i(1, 5, 0),
      vec3i(0, 5, 4),
      vec3i(0, 1, 5),
      vec3i(4, 0, 5),
      vec3i(5, 0, 1)
    );
    return vertices[pointIndex];
  }

  let vertices = array<vec3i, 6>(
    vec3i(2, 1, 0),
    vec3i(1, 2, 0),
    vec3i(0, 2, 1),
    vec3i(0, 1, 2),
    vec3i(1, 0, 2),
    vec3i(2, 0, 1)
  );
  return vertices[pointIndex];
}

fn dggs_h3_get_boundary_vertex(index: vec2u, vertexIndex: u32) -> DggsH3BoundaryVertex {
  let center = dggs_h3_get_center_face_ijk(index);
  if (center.valid == 0u) {
    return DggsH3BoundaryVertex(0u, vec3i(0), 0u, 0u);
  }

  let cellResolution = dggs_h3_get_resolution(index);
  var adjustedResolution = cellResolution;
  var centerCoord = dggs_h3_down_ap3r(dggs_h3_down_ap3(center.coord));
  if (dggs_h3_is_resolution_class_iii(cellResolution)) {
    centerCoord = dggs_h3_down_ap7r(centerCoord);
    adjustedResolution += 1u;
  }

  let vertexCoord = dggs_h3_ijk_normalize(
    centerCoord + dggs_h3_get_vertex_offset(cellResolution, vertexIndex)
  );
  let maximumDimension = dggs_h3_get_max_dim_by_cii_resolution(adjustedResolution) * 3;
  let vertexDimension = vertexCoord.x + vertexCoord.y + vertexCoord.z;
  if (vertexDimension >= maximumDimension) {
    return DggsH3BoundaryVertex(center.face, vertexCoord, adjustedResolution, 0u);
  }

  return DggsH3BoundaryVertex(center.face, vertexCoord, adjustedResolution, 1u);
}

fn dggs_h3_is_single_face_boundary(index: vec2u) -> bool {
  var vertexIndex = 0u;
  loop {
    if (vertexIndex >= 6u) {
      break;
    }
    if (dggs_h3_get_boundary_vertex(index, vertexIndex).valid == 0u) {
      return false;
    }
    vertexIndex += 1u;
  }
  return true;
}

fn dggs_h3_ijk_to_hex2d(coord: vec3i) -> vec2f {
  let i = f32(coord.x - coord.z);
  let j = f32(coord.y - coord.z);
  return vec2f(i - 0.5 * j, j * DGGS_H3_SQRT3_2);
}

fn dggs_h3_geo_az_distance_rads(center: vec2f, azimuth: f32, distance: f32) -> vec2f {
  if (distance < 1.0e-7) {
    return center;
  }

  let positiveAzimuth = dggs_h3_positive_angle_rads(azimuth);
  let latitude = asin(clamp(
    sin(center.x) * cos(distance) + cos(center.x) * sin(distance) * cos(positiveAzimuth),
    -1.0,
    1.0
  ));
  var longitude = 0.0;
  if (abs(latitude - DGGS_PI_OVER_2) < 1.0e-7) {
    return vec2f(DGGS_PI_OVER_2, 0.0);
  }
  if (abs(latitude + DGGS_PI_OVER_2) < 1.0e-7) {
    return vec2f(-DGGS_PI_OVER_2, 0.0);
  }

  let inverseCosLatitude = 1.0 / max(cos(latitude), 1.0e-8);
  let sinLongitude = clamp(
    sin(positiveAzimuth) * sin(distance) * inverseCosLatitude,
    -1.0,
    1.0
  );
  let cosLongitude = clamp(
    (cos(distance) - sin(center.x) * sin(latitude)) / max(cos(center.x), 1.0e-8) *
      inverseCosLatitude,
    -1.0,
    1.0
  );
  longitude = dggs_h3_constrain_longitude(center.y + atan2(sinLongitude, cosLongitude));
  return vec2f(latitude, longitude);
}

fn dggs_h3_hex2d_to_lnglat(point: vec2f, face: u32, resolution: u32, substrate: bool) -> vec2f {
  var radius = length(point);
  let center = dggs_h3_get_face_center_geo(face);
  if (radius < 1.0e-7) {
    return vec2f(center.y * DGGS_RADIANS_TO_DEGREES, center.x * DGGS_RADIANS_TO_DEGREES);
  }

  var theta = atan2(point.y, point.x);
  var resolutionIndex = 0u;
  loop {
    if (resolutionIndex >= resolution) {
      break;
    }
    radius *= DGGS_H3_RSQRT7;
    resolutionIndex += 1u;
  }

  if (substrate) {
    radius *= DGGS_H3_ONETHIRD;
    if (dggs_h3_is_resolution_class_iii(resolution)) {
      radius *= DGGS_H3_RSQRT7;
    }
  } else if (dggs_h3_is_resolution_class_iii(resolution)) {
    theta = dggs_h3_positive_angle_rads(theta + DGGS_H3_AP7_ROT_RADS);
  }

  radius = atan(radius * DGGS_H3_RES0_U_GNOMONIC);
  theta = dggs_h3_positive_angle_rads(dggs_h3_get_face_axis_azimuths(face).x - theta);
  let latitudeLongitude = dggs_h3_geo_az_distance_rads(center, theta, radius);
  return vec2f(
    latitudeLongitude.y * DGGS_RADIANS_TO_DEGREES,
    latitudeLongitude.x * DGGS_RADIANS_TO_DEGREES
  );
}

fn dggs_h3_get_boundary_point(index: vec2u, vertexIndex: u32) -> vec2f {
  if (!dggs_h3_is_single_face_boundary(index)) {
    return vec2f(0.0);
  }

  let vertex = dggs_h3_get_boundary_vertex(index, vertexIndex % 6u);
  let hexPoint = dggs_h3_ijk_to_hex2d(vertex.coord);
  return dggs_h3_hex2d_to_lnglat(hexPoint, vertex.face, vertex.resolution, true);
}

fn dggs_h3_get_boundary_point_fp64_split(index: vec2u, vertexIndex: u32) -> vec4f {
  return dggs_boundary_point_to_fp64_split(dggs_h3_get_boundary_point(index, vertexIndex));
}

fn dggs_s2_get_face(index: vec2u) -> u32 {
  return dggs_u64_extract_bits(index, 61u, 3u);
}

fn dggs_s2_get_level(index: vec2u) -> u32 {
  let trailingZeros = dggs_u64_count_trailing_zeros(index);
  if (trailingZeros > 60u) {
    return 0u;
  }
  return DGGS_S2_MAX_LEVEL - trailingZeros / 2u;
}

fn dggs_s2_is_valid_cell_id(index: vec2u) -> bool {
  let trailingZeros = dggs_u64_count_trailing_zeros(index);
  return !dggs_u64_is_zero(index) &&
    dggs_s2_get_face(index) <= 5u &&
    trailingZeros <= 60u &&
    trailingZeros % 2u == 0u;
}

fn dggs_s2_get_child_position(index: vec2u, level: u32) -> u32 {
  if (level == 0u || level > DGGS_S2_MAX_LEVEL) {
    return 0u;
  }
  return dggs_u64_extract_bits(index, 2u * (DGGS_S2_MAX_LEVEL - level) + 1u, 2u);
}

// Packed geohash keys store the geohash length in bits 60..63 and right-align
// the base32 character codes in the lower 60 bits, first character first.
fn dggs_geohash_get_length(index: vec2u) -> u32 {
  return min(
    dggs_u64_extract_bits(index, DGGS_GEOHASH_LENGTH_BIT_OFFSET, 4u),
    DGGS_GEOHASH_MAX_LENGTH
  );
}

fn dggs_geohash_get_character(index: vec2u, characterIndex: u32) -> u32 {
  let length = dggs_geohash_get_length(index);
  if (characterIndex >= length) {
    return 0u;
  }
  return dggs_u64_extract_bits(index, 5u * (length - characterIndex - 1u), 5u);
}

// Returns vec4(west, south, east, north) in longitude/latitude degrees.
fn dggs_geohash_get_bounds(index: vec2u) -> vec4f {
  let length = dggs_geohash_get_length(index);
  var west = -180.0;
  var east = 180.0;
  var south = -90.0;
  var north = 90.0;
  var isLongitude = true;
  var characterIndex = 0u;
  loop {
    if (characterIndex >= length) {
      break;
    }

    let character = dggs_geohash_get_character(index, characterIndex);
    var bitIndex = 0u;
    loop {
      if (bitIndex >= 5u) {
        break;
      }

      let bit = (character >> (4u - bitIndex)) & 1u;
      if (isLongitude) {
        let midpoint = (west + east) * 0.5;
        if (bit == 0u) {
          east = midpoint;
        } else {
          west = midpoint;
        }
      } else {
        let midpoint = (south + north) * 0.5;
        if (bit == 0u) {
          north = midpoint;
        } else {
          south = midpoint;
        }
      }
      isLongitude = !isLongitude;
      bitIndex += 1u;
    }
    characterIndex += 1u;
  }

  return vec4f(west, south, east, north);
}

fn dggs_bounds_get_boundary_point(bounds: vec4f, vertexIndex: u32) -> vec2f {
  let pointIndex = vertexIndex % 4u;
  if (pointIndex == 0u) {
    return vec2f(bounds.x, bounds.w);
  }
  if (pointIndex == 1u) {
    return vec2f(bounds.z, bounds.w);
  }
  if (pointIndex == 2u) {
    return vec2f(bounds.z, bounds.y);
  }
  return vec2f(bounds.x, bounds.y);
}

fn dggs_geohash_get_boundary_point(index: vec2u, vertexIndex: u32) -> vec2f {
  return dggs_bounds_get_boundary_point(dggs_geohash_get_bounds(index), vertexIndex);
}

fn dggs_geohash_get_boundary_point_fp64_split(index: vec2u, vertexIndex: u32) -> vec4f {
  return dggs_boundary_point_to_fp64_split(dggs_geohash_get_boundary_point(index, vertexIndex));
}

// Packed quadkey keys store the quadkey length in bits 58..63 and right-align
// the base4 digits in the lower 58 bits, first digit first.
fn dggs_quadkey_get_length(index: vec2u) -> u32 {
  return min(
    dggs_u64_extract_bits(index, DGGS_QUADKEY_LENGTH_BIT_OFFSET, 6u),
    DGGS_QUADKEY_MAX_LENGTH
  );
}

fn dggs_quadkey_get_digit(index: vec2u, digitIndex: u32) -> u32 {
  let length = dggs_quadkey_get_length(index);
  if (digitIndex >= length) {
    return 0u;
  }
  return dggs_u64_extract_bits(index, 2u * (length - digitIndex - 1u), 2u);
}

fn dggs_quadkey_get_tile(index: vec2u) -> vec3u {
  let length = dggs_quadkey_get_length(index);
  var tileX = 0u;
  var tileY = 0u;
  var digitIndex = 0u;
  loop {
    if (digitIndex >= length) {
      break;
    }

    let digit = dggs_quadkey_get_digit(index, digitIndex);
    let mask = 1u << (length - digitIndex - 1u);
    if ((digit & 1u) != 0u) {
      tileX |= mask;
    }
    if ((digit & 2u) != 0u) {
      tileY |= mask;
    }
    digitIndex += 1u;
  }
  return vec3u(tileX, tileY, length);
}

fn dggs_web_mercator_tile_y_to_latitude(tileY: f32, tileScale: f32) -> f32 {
  let mercatorY = DGGS_PI * (1.0 - 2.0 * tileY / tileScale);
  return (2.0 * atan(exp(mercatorY)) - DGGS_PI * 0.5) * DGGS_RADIANS_TO_DEGREES;
}

// Returns vec4(west, south, east, north) in longitude/latitude degrees.
fn dggs_quadkey_get_bounds(index: vec2u) -> vec4f {
  let tile = dggs_quadkey_get_tile(index);
  let tileScale = f32(1u << tile.z);
  let west = f32(tile.x) / tileScale * 360.0 - 180.0;
  let east = f32(tile.x + 1u) / tileScale * 360.0 - 180.0;
  let north = dggs_web_mercator_tile_y_to_latitude(f32(tile.y), tileScale);
  let south = dggs_web_mercator_tile_y_to_latitude(f32(tile.y + 1u), tileScale);
  return vec4f(west, south, east, north);
}

fn dggs_quadkey_get_boundary_point(index: vec2u, vertexIndex: u32) -> vec2f {
  return dggs_bounds_get_boundary_point(dggs_quadkey_get_bounds(index), vertexIndex);
}

fn dggs_quadkey_get_boundary_point_fp64_split(index: vec2u, vertexIndex: u32) -> vec4f {
  return dggs_boundary_point_to_fp64_split(dggs_quadkey_get_boundary_point(index, vertexIndex));
}

fn dggs_s2_digit_to_xy(digit: u32) -> vec2u {
  if (digit == 1u) {
    return vec2u(0u, 1u);
  }
  if (digit == 2u) {
    return vec2u(1u, 1u);
  }
  if (digit == 3u) {
    return vec2u(1u, 0u);
  }
  return vec2u(0u, 0u);
}

fn dggs_s2_rotate_and_flip_quadrant(size: u32, point: vec2u, digitXY: vec2u) -> vec2u {
  var result = point;
  if (digitXY.y == 0u) {
    if (digitXY.x == 1u) {
      result = vec2u(size - 1u - result.x, size - 1u - result.y);
    }
    result = result.yx;
  }
  return result;
}

fn dggs_s2_get_ij(index: vec2u) -> vec2u {
  let level = dggs_s2_get_level(index);
  var point = vec2u(0u);
  var hilbertLevel = 1u;
  loop {
    if (hilbertLevel > level) {
      break;
    }
    let digitLevel = level - hilbertLevel + 1u;
    let digitXY = dggs_s2_digit_to_xy(dggs_s2_get_child_position(index, digitLevel));
    let size = 1u << (hilbertLevel - 1u);
    point = dggs_s2_rotate_and_flip_quadrant(size, point, digitXY);
    point += size * digitXY;
    hilbertLevel += 1u;
  }
  if ((dggs_s2_get_face(index) & 1u) != 0u) {
    point = point.yx;
  }
  return point;
}

fn dggs_s2_single_st_to_uv(st: f32) -> f32 {
  if (st >= 0.5) {
    return (4.0 * st * st - 1.0) / 3.0;
  }
  return (1.0 - 4.0 * (1.0 - st) * (1.0 - st)) / 3.0;
}

fn dggs_s2_ij_to_st(ij: vec2u, level: u32, offset: vec2f) -> vec2f {
  let maxSize = f32(1u << level);
  return (vec2f(f32(ij.x), f32(ij.y)) + offset) / maxSize;
}

fn dggs_s2_st_to_uv(st: vec2f) -> vec2f {
  return vec2f(dggs_s2_single_st_to_uv(st.x), dggs_s2_single_st_to_uv(st.y));
}

fn dggs_s2_face_uv_to_xyz(face: u32, uv: vec2f) -> vec3f {
  if (face == 0u) {
    return vec3f(1.0, uv.x, uv.y);
  }
  if (face == 1u) {
    return vec3f(-uv.x, 1.0, uv.y);
  }
  if (face == 2u) {
    return vec3f(-uv.x, -uv.y, 1.0);
  }
  if (face == 3u) {
    return vec3f(-1.0, -uv.y, -uv.x);
  }
  if (face == 4u) {
    return vec3f(uv.y, -1.0, -uv.x);
  }
  return vec3f(uv.y, uv.x, -1.0);
}

fn dggs_s2_xyz_to_lnglat(xyz: vec3f) -> vec2f {
  let latitude = atan2(xyz.z, length(xyz.xy)) * DGGS_RADIANS_TO_DEGREES;
  let longitude = atan2(xyz.y, xyz.x) * DGGS_RADIANS_TO_DEGREES;
  return vec2f(longitude, latitude);
}

fn dggs_s2_get_boundary_offset(vertexIndex: u32) -> vec2f {
  let pointIndex = vertexIndex % 4u;
  if (pointIndex == 1u) {
    return vec2f(0.0, 1.0);
  }
  if (pointIndex == 2u) {
    return vec2f(1.0, 1.0);
  }
  if (pointIndex == 3u) {
    return vec2f(1.0, 0.0);
  }
  return vec2f(0.0, 0.0);
}

fn dggs_s2_get_boundary_point(index: vec2u, vertexIndex: u32) -> vec2f {
  let level = dggs_s2_get_level(index);
  let ij = dggs_s2_get_ij(index);
  let st = dggs_s2_ij_to_st(ij, level, dggs_s2_get_boundary_offset(vertexIndex));
  let uv = dggs_s2_st_to_uv(st);
  let xyz = dggs_s2_face_uv_to_xyz(dggs_s2_get_face(index), uv);
  return dggs_s2_xyz_to_lnglat(xyz);
}

fn dggs_s2_get_boundary_point_fp64_split(index: vec2u, vertexIndex: u32) -> vec4f {
  return dggs_boundary_point_to_fp64_split(dggs_s2_get_boundary_point(index, vertexIndex));
}
`,Xr={name:"dggs",source:Zr},N={RGBA8UNORM:0,RGBA16FLOAT:1,RGBA32FLOAT:2},We={rgba8unorm:4,rgba16float:8,rgba32float:16},Ke={...We},Ze={rgba8unorm:N.RGBA8UNORM,rgba16float:N.RGBA16FLOAT,rgba32float:N.RGBA32FLOAT},Ht={[N.RGBA8UNORM]:"rgba8unorm",[N.RGBA16FLOAT]:"rgba16float",[N.RGBA32FLOAT]:"rgba32float"},$t={useByteColors:"f32"},jt={useByteColors:!0},Yr={format:"u32",wordStride:"u32",wordOffset:"u32",_padding:"u32"},Jr={format:N.RGBA8UNORM,wordStride:Ke.rgba8unorm/Uint32Array.BYTES_PER_ELEMENT,wordOffset:0,_padding:0},qt=Kt("colors"),Wt=Kt("floatColors"),Qr=Zt("colors"),eo=Zt("floatColors"),to=`struct storageColorsUniforms {
  format: u32,
  wordStride: u32,
  wordOffset: u32,
  _padding: u32
};

@group(0) @binding(auto) var<uniform> storageColors : storageColorsUniforms;
@group(0) @binding(auto) var<storage, read> storageColorsBuffer : array<u32>;

const STORAGE_COLOR_FORMAT_RGBA8UNORM : u32 = ${N.RGBA8UNORM}u;
const STORAGE_COLOR_FORMAT_RGBA16FLOAT : u32 = ${N.RGBA16FLOAT}u;

fn storageColors_getWordIndex(rowIndex: u32) -> u32 {
  return storageColors.wordOffset + rowIndex * storageColors.wordStride;
}

fn storageColors_readRgba8UnormColor(wordIndex: u32) -> vec4<f32> {
  return unpack4x8unorm(storageColorsBuffer[wordIndex]);
}

fn storageColors_readRgba16FloatColor(wordIndex: u32) -> vec4<f32> {
  let redGreen = unpack2x16float(storageColorsBuffer[wordIndex]);
  let blueAlpha = unpack2x16float(storageColorsBuffer[wordIndex + 1u]);
  return vec4<f32>(redGreen.x, redGreen.y, blueAlpha.x, blueAlpha.y);
}

fn storageColors_readRgba32FloatColor(wordIndex: u32) -> vec4<f32> {
  return vec4<f32>(
    bitcast<f32>(storageColorsBuffer[wordIndex]),
    bitcast<f32>(storageColorsBuffer[wordIndex + 1u]),
    bitcast<f32>(storageColorsBuffer[wordIndex + 2u]),
    bitcast<f32>(storageColorsBuffer[wordIndex + 3u])
  );
}

fn storageColors_readColor(rowIndex: u32) -> vec4<f32> {
  let wordIndex = storageColors_getWordIndex(rowIndex);
  if (storageColors.format == STORAGE_COLOR_FORMAT_RGBA8UNORM) {
    return storageColors_readRgba8UnormColor(wordIndex);
  }
  if (storageColors.format == STORAGE_COLOR_FORMAT_RGBA16FLOAT) {
    return storageColors_readRgba16FloatColor(wordIndex);
  }
  return storageColors_readRgba32FloatColor(wordIndex);
}
`;function Kt(e){return`layout(std140) uniform ${e}Uniforms {
  float useByteColors;
} ${e};

vec3 ${e}_normalize(vec3 inputColor) {
  return ${e}.useByteColors > 0.5 ? inputColor / 255.0 : inputColor;
}

vec4 ${e}_normalize(vec4 inputColor) {
  return ${e}.useByteColors > 0.5 ? inputColor / 255.0 : inputColor;
}

vec4 ${e}_premultiplyAlpha(vec4 inputColor) {
  return vec4(inputColor.rgb * inputColor.a, inputColor.a);
}

vec4 ${e}_unpremultiplyAlpha(vec4 inputColor) {
  return inputColor.a > 0.0 ? vec4(inputColor.rgb / inputColor.a, inputColor.a) : vec4(0.0);
}

vec4 ${e}_premultiply_alpha(vec4 inputColor) {
  return ${e}_premultiplyAlpha(inputColor);
}

vec4 ${e}_unpremultiply_alpha(vec4 inputColor) {
  return ${e}_unpremultiplyAlpha(inputColor);
}
`}function Zt(e){return`struct ${e}Uniforms {
  useByteColors: f32
};

@group(0) @binding(auto) var<uniform> ${e} : ${e}Uniforms;

fn ${e}_normalize(inputColor: vec3<f32>) -> vec3<f32> {
  return select(inputColor, inputColor / 255.0, ${e}.useByteColors > 0.5);
}

fn ${e}_normalize4(inputColor: vec4<f32>) -> vec4<f32> {
  return select(inputColor, inputColor / 255.0, ${e}.useByteColors > 0.5);
}

fn ${e}_premultiplyAlpha(inputColor: vec4<f32>) -> vec4<f32> {
  return vec4<f32>(inputColor.rgb * inputColor.a, inputColor.a);
}

fn ${e}_unpremultiplyAlpha(inputColor: vec4<f32>) -> vec4<f32> {
  return select(
    vec4<f32>(0.0),
    vec4<f32>(inputColor.rgb / inputColor.a, inputColor.a),
    inputColor.a > 0.0
  );
}

fn ${e}_premultiply_alpha(inputColor: vec4<f32>) -> vec4<f32> {
  return ${e}_premultiplyAlpha(inputColor);
}

fn ${e}_unpremultiply_alpha(inputColor: vec4<f32>) -> vec4<f32> {
  return ${e}_unpremultiplyAlpha(inputColor);
}
`}function io(e={}){const t=no(e.format),i=Ht[t],n=e.byteStride??Ke[i],r=e.byteOffset??0,o=We[i];if(Xt("byteStride",n),Xt("byteOffset",r),n<o)throw new Error(`storageColors byteStride must be at least ${o} for ${i}`);return{format:t,wordStride:n/Uint32Array.BYTES_PER_ELEMENT,wordOffset:r/Uint32Array.BYTES_PER_ELEMENT,_padding:0}}function no(e="rgba8unorm"){if(typeof e=="number"){if(e in Ht)return e}else if(e in Ze)return Ze[e];throw new Error(`storageColors format must be one of ${Object.keys(Ze).join(", ")}`)}function Xt(e,t){if(!Number.isInteger(t)||t<0||t%Uint32Array.BYTES_PER_ELEMENT!==0)throw new Error(`storageColors ${e} must be a non-negative 4-byte aligned integer`)}const ro={name:"colors",props:{},uniforms:{},vs:qt,fs:qt,source:Qr,uniformTypes:$t,defaultUniforms:jt},Xe={name:"floatColors",props:{},uniforms:{},vs:Wt,fs:Wt,source:eo,uniformTypes:$t,defaultUniforms:jt},oo={name:"storageColors",props:{},uniforms:{},bindings:{},source:to,uniformTypes:Yr,defaultUniforms:Jr,bindingLayout:[{name:"storageColors",group:0},{name:"storageColorsBuffer",group:0}],getUniforms(e={}){return{...io(e),...e.colorBuffer?{storageColorsBuffer:e.colorBuffer}:{}}}},ao=[0,1,1,1],so=`layout(std140) uniform pickingUniforms {
  float isActive;
  float isAttribute;
  float isHighlightActive;
  float useByteColors;
  vec3 highlightedObjectColor;
  vec4 highlightColor;
} picking;

out vec4 picking_vRGBcolor_Avalid;

// Normalize unsigned byte color to 0-1 range
vec3 picking_normalizeColor(vec3 color) {
  return picking.useByteColors > 0.5 ? color / 255.0 : color;
}

// Normalize unsigned byte color to 0-1 range
vec4 picking_normalizeColor(vec4 color) {
  return picking.useByteColors > 0.5 ? color / 255.0 : color;
}

bool picking_isColorZero(vec3 color) {
  return dot(color, vec3(1.0)) < 0.00001;
}

bool picking_isColorValid(vec3 color) {
  return dot(color, vec3(1.0)) > 0.00001;
}

// Check if this vertex is highlighted 
bool isVertexHighlighted(vec3 vertexColor) {
  vec3 highlightedObjectColor = picking_normalizeColor(picking.highlightedObjectColor);
  return
    bool(picking.isHighlightActive) && picking_isColorZero(abs(vertexColor - highlightedObjectColor));
}

// Set the current picking color
void picking_setPickingColor(vec3 pickingColor) {
  pickingColor = picking_normalizeColor(pickingColor);

  if (bool(picking.isActive)) {
    // Use alpha as the validity flag. If pickingColor is [0, 0, 0] fragment is non-pickable
    picking_vRGBcolor_Avalid.a = float(picking_isColorValid(pickingColor));

    if (!bool(picking.isAttribute)) {
      // Stores the picking color so that the fragment shader can render it during picking
      picking_vRGBcolor_Avalid.rgb = pickingColor;
    }
  } else {
    // Do the comparison with selected item color in vertex shader as it should mean fewer compares
    picking_vRGBcolor_Avalid.a = float(isVertexHighlighted(pickingColor));
  }
}

void picking_setPickingAttribute(float value) {
  if (bool(picking.isAttribute)) {
    picking_vRGBcolor_Avalid.r = value;
  }
}

void picking_setPickingAttribute(vec2 value) {
  if (bool(picking.isAttribute)) {
    picking_vRGBcolor_Avalid.rg = value;
  }
}

void picking_setPickingAttribute(vec3 value) {
  if (bool(picking.isAttribute)) {
    picking_vRGBcolor_Avalid.rgb = value;
  }
}
`,lo=`layout(std140) uniform pickingUniforms {
  float isActive;
  float isAttribute;
  float isHighlightActive;
  float useByteColors;
  vec3 highlightedObjectColor;
  vec4 highlightColor;
} picking;

in vec4 picking_vRGBcolor_Avalid;

/*
 * Returns highlight color if this item is selected.
 */
vec4 picking_filterHighlightColor(vec4 color) {
  // If we are still picking, we don't highlight
  if (picking.isActive > 0.5) {
    return color;
  }

  bool selected = bool(picking_vRGBcolor_Avalid.a);

  if (selected) {
    // Blend in highlight color based on its alpha value
    float highLightAlpha = picking.highlightColor.a;
    float blendedAlpha = highLightAlpha + color.a * (1.0 - highLightAlpha);
    float highLightRatio = highLightAlpha / blendedAlpha;

    vec3 blendedRGB = mix(color.rgb, picking.highlightColor.rgb, highLightRatio);
    return vec4(blendedRGB, blendedAlpha);
  } else {
    return color;
  }
}

/*
 * Returns picking color if picking enabled else unmodified argument.
 */
vec4 picking_filterPickingColor(vec4 color) {
  if (bool(picking.isActive)) {
    if (picking_vRGBcolor_Avalid.a == 0.0) {
      discard;
    }
    return picking_vRGBcolor_Avalid;
  }
  return color;
}

/*
 * Returns picking color if picking is enabled if not
 * highlight color if this item is selected, otherwise unmodified argument.
 */
vec4 picking_filterColor(vec4 color) {
  vec4 highlightColor = picking_filterHighlightColor(color);
  return picking_filterPickingColor(highlightColor);
}
`,co={props:{},uniforms:{},name:"picking",uniformTypes:{isActive:"f32",isAttribute:"f32",isHighlightActive:"f32",useByteColors:"f32",highlightedObjectColor:"vec3<f32>",highlightColor:"vec4<f32>"},defaultUniforms:{isActive:!1,isAttribute:!1,isHighlightActive:!1,useByteColors:!0,highlightedObjectColor:[0,0,0],highlightColor:ao},vs:so,fs:lo,getUniforms:fo};function fo(e={},t){const i={},n=je(e.useByteColors,!0);if(e.highlightedObjectColor!==void 0)if(e.highlightedObjectColor===null)i.isHighlightActive=!1;else{i.isHighlightActive=!0;const r=e.highlightedObjectColor.slice(0,3);i.highlightedObjectColor=r}return e.highlightColor&&(i.highlightColor=Gt(e.highlightColor,n)),e.isActive!==void 0&&(i.isActive=!!e.isActive,i.isAttribute=!!e.isAttribute),e.useByteColors!==void 0&&(i.useByteColors=!!e.useByteColors),i}const uo={name:"filter",props:{},uniforms:{},bindingLayout:[{name:"filter",group:2}],uniformTypes:{enabled:"i32",min:"f32",max:"f32"},defaultUniforms:{enabled:1,min:0,max:1},vs:`layout(std140) uniform filterUniforms {
  int enabled;
  float min;
  float max;
} filterState;

bool filter_isVisible(float value) {
  return filterState.enabled == 0 || (value >= filterState.min && value <= filterState.max);
}
`,source:`struct FilterUniforms {
  enabled: i32,
  min: f32,
  max: f32,
};

@group(2) @binding(auto) var<uniform> filterUniforms: FilterUniforms;

fn filter_isVisible(value: f32) -> bool {
  return filterUniforms.enabled == 0 ||
    (value >= filterUniforms.min && value <= filterUniforms.max);
}
`,getUniforms(e={}){const t={};return e.enabled!==void 0&&(t.enabled=Number(e.enabled)),e.min!==void 0&&(t.min=e.min),e.max!==void 0&&(t.max=e.max),t}},po={name:"filter",modules:[uo],vertexInputs:{filterValues:"f32"},glsl:{injections:[{target:"vs:FILTER_POSITION",injection:`if (!filter_isVisible(filterValues)) {
  position = vec4(2.0, 2.0, 2.0, 1.0);
}`}]},wgsl:{injections:[{target:"vs:FILTER_POSITION",injection:`if (!filter_isVisible(filterValues)) {
  *position = vec4<f32>(2.0, 2.0, 2.0, 1.0);
}`}]}},_e=0,Ye=1,go={name:"clip",props:{},uniforms:{},bindingLayout:[{name:"clip",group:2}],uniformTypes:{enabled:"i32",mode:"i32",bounds:"vec4<f32>"},defaultUniforms:{enabled:1,mode:_e,bounds:[0,0,1,1]},vs:`layout(std140) uniform clipUniforms {
  highp int enabled;
  highp int mode;
  highp vec4 bounds;
} clipState;

bool clip_isInBounds(vec2 coordinates) {
  return coordinates.x >= clipState.bounds.x &&
    coordinates.y >= clipState.bounds.y &&
    coordinates.x < clipState.bounds.z &&
    coordinates.y < clipState.bounds.w;
}
`,fs:`layout(std140) uniform clipUniforms {
  highp int enabled;
  highp int mode;
  highp vec4 bounds;
} clipState;

bool clip_isInBounds(vec2 coordinates) {
  return coordinates.x >= clipState.bounds.x &&
    coordinates.y >= clipState.bounds.y &&
    coordinates.x < clipState.bounds.z &&
    coordinates.y < clipState.bounds.w;
}
`,source:`struct ClipUniforms {
  enabled: i32,
  mode: i32,
  bounds: vec4<f32>,
};

@group(2) @binding(auto) var<uniform> clipUniforms: ClipUniforms;

fn clip_isInBounds(coordinates: vec2<f32>) -> bool {
  return coordinates.x >= clipUniforms.bounds.x &&
    coordinates.y >= clipUniforms.bounds.y &&
    coordinates.x < clipUniforms.bounds.z &&
    coordinates.y < clipUniforms.bounds.w;
}
`,getUniforms(e={}){const t={};return e.enabled!==void 0&&(t.enabled=Number(e.enabled)),e.mode!==void 0&&(t.mode=e.mode==="instance"?Ye:_e),e.bounds!==void 0&&(t.bounds=e.bounds),t}},_o={name:"clip",modules:[go],varyings:{clipCoordinates:{type:"vec2<f32>",interpolation:"smooth"}},glsl:{injections:[{target:"vs:CLIP_POSITION",injection:`clipCoordinates = geometryCoordinates;
if (clipState.enabled != 0 && clipState.mode == ${Ye} &&
    !clip_isInBounds(instanceCoordinates)) {
  position = vec4(2.0, 2.0, 2.0, 1.0);
}`},{target:"fs:CLIP_COLOR",injection:`if (clipState.enabled != 0 && clipState.mode == ${_e} &&
    !clip_isInBounds(clipCoordinates)) {
  discard;
}`}]},wgsl:{injections:[{target:"vs:CLIP_POSITION",injection:`clipCoordinates = geometryCoordinates;
if (clipUniforms.enabled != 0 && clipUniforms.mode == ${Ye} &&
    !clip_isInBounds(instanceCoordinates)) {
  *position = vec4<f32>(2.0, 2.0, 2.0, 1.0);
}`},{target:"fs:CLIP_COLOR",injection:`if (clipUniforms.enabled != 0 && clipUniforms.mode == ${_e} &&
    !clip_isInBounds(clipCoordinates)) {
  discard;
}`}]}},H=64,mo=`
struct skinUniforms {
  jointMatrix: array<mat4x4<f32>, ${H}>,
};

@group(0) @binding(auto) var<uniform> skin: skinUniforms;

#ifdef HAS_INSTANCED_SKIN
@group(0) @binding(auto) var<storage, read> skinJointMatrices: array<mat4x4<f32>>;

fn getInstancedSkinMatrix(
  weights: vec4f,
  joints: vec4u,
  instanceIndex: u32,
  jointsPerInstance: u32
) -> mat4x4<f32> {
  let firstJoint = instanceIndex * jointsPerInstance;
  return (weights.x * skinJointMatrices[firstJoint + joints.x])
       + (weights.y * skinJointMatrices[firstJoint + joints.y])
       + (weights.z * skinJointMatrices[firstJoint + joints.z])
       + (weights.w * skinJointMatrices[firstJoint + joints.w]);
}
#endif

fn getSkinMatrix(weights: vec4f, joints: vec4u) -> mat4x4<f32> {
  return (weights.x * skin.jointMatrix[joints.x])
       + (weights.y * skin.jointMatrix[joints.y])
       + (weights.z * skin.jointMatrix[joints.z])
       + (weights.w * skin.jointMatrix[joints.w]);
}
`,ho=`
layout(std140) uniform skinUniforms {
  mat4 jointMatrix[SKIN_MAX_JOINTS];
} skin;

#ifdef HAS_INSTANCED_SKIN
uniform highp sampler2D skinJointMatrices;

mat4 getInstancedJointMatrix(uint jointIndex, uint instanceIndex) {
  int firstColumn = int(jointIndex * 4u);
  int row = int(instanceIndex);
  return mat4(
    texelFetch(skinJointMatrices, ivec2(firstColumn, row), 0),
    texelFetch(skinJointMatrices, ivec2(firstColumn + 1, row), 0),
    texelFetch(skinJointMatrices, ivec2(firstColumn + 2, row), 0),
    texelFetch(skinJointMatrices, ivec2(firstColumn + 3, row), 0)
  );
}

mat4 getInstancedSkinMatrix(
  vec4 weights,
  uvec4 joints,
  uint instanceIndex,
  uint jointsPerInstance
) {
  return (weights.x * getInstancedJointMatrix(joints.x, instanceIndex))
       + (weights.y * getInstancedJointMatrix(joints.y, instanceIndex))
       + (weights.z * getInstancedJointMatrix(joints.z, instanceIndex))
       + (weights.w * getInstancedJointMatrix(joints.w, instanceIndex));
}
#endif

mat4 getSkinMatrix(vec4 weights, uvec4 joints) {
  return (weights.x * skin.jointMatrix[joints.x])
       + (weights.y * skin.jointMatrix[joints.y])
       + (weights.z * skin.jointMatrix[joints.z])
       + (weights.w * skin.jointMatrix[joints.w]);
}

`,vo="",bo={props:{},uniforms:{},bindings:{},name:"skin",bindingLayout:[{name:"skin",group:0},{name:"skinJointMatrices",group:0,visibility:1}],dependencies:[],source:mo,vs:ho,fs:vo,defines:{SKIN_MAX_JOINTS:H},getUniforms:(e={},t)=>{const{jointMatrices:i,skinJointMatrices:n,scenegraphsFromGLTF:r,skinIndex:o=0,meshWorldMatrix:a}=e,s=n?{skinJointMatrices:n}:{};if(i)return{jointMatrix:So(i),...s};const l=r?.gltf?.skins?.[o];if(!l)return{jointMatrix:[],...s};const{inverseBindMatrices:c,joints:f,skeleton:p}=l,d=r.gltfNodeIndexToNodeMap,u=new Map,g=p===void 0?void 0:d?.get(p),m=g?[g]:r.scenes||[];for(const I of m)I.preorderTraversal((v,{worldMatrix:_})=>{u.set(v.id,_)});const R=a?new te(a).invert():null,E=new Float32Array(H*16),h=c?.value;for(let I=0;I<Math.min(f.length,H);I++){const v=d?.get(f[I]);if(!v)continue;const _=u.get(v.id)||v.matrix,b=R?new te(R).multiplyRight(_):new te(_);h&&h.length>=(I+1)*16&&b.multiplyRight(new te(Array.from(h.slice(I*16,(I+1)*16)))),E.set(b,I*16)}return{jointMatrix:E,...s}},uniformTypes:{jointMatrix:["mat4x4<f32>",H]}};function So(e){const t=new Float32Array(H*16);return t.set(e instanceof Float32Array?e.subarray(0,t.length):e.slice(0,t.length)),t}const xo=`
#ifdef HAS_GPU_CROWD_ANIMATION
@group(0) @binding(auto) var<storage, read> gpuAnimationFrames: array<vec4f>;

fn readGPUAnimationFrame(frame: u32, offset: u32, frameStride: u32) -> vec4f {
  return gpuAnimationFrames[frame * frameStride + offset];
}

fn sampleGPUAnimationFrame(
  frames: vec4f,
  blend: vec4f,
  offset: u32,
  frameStride: u32
) -> vec4f {
  let first = mix(
    readGPUAnimationFrame(u32(frames.x), offset, frameStride),
    readGPUAnimationFrame(u32(frames.y), offset, frameStride),
    frames.z
  );
  if (blend.w <= 0.0) {
    return first;
  }
  let second = mix(
    readGPUAnimationFrame(u32(blend.x), offset, frameStride),
    readGPUAnimationFrame(u32(blend.y), offset, frameStride),
    blend.z
  );
  return mix(first, second, blend.w);
}

fn sampleGPUAnimationMatrix(
  frames: vec4f,
  blend: vec4f,
  firstColumn: u32,
  frameStride: u32
) -> mat4x4f {
  return mat4x4f(
    sampleGPUAnimationFrame(frames, blend, firstColumn, frameStride),
    sampleGPUAnimationFrame(frames, blend, firstColumn + 1u, frameStride),
    sampleGPUAnimationFrame(frames, blend, firstColumn + 2u, frameStride),
    sampleGPUAnimationFrame(frames, blend, firstColumn + 3u, frameStride)
  );
}

fn getGPUAnimatedSkinMatrix(
  weights: vec4f,
  joints: vec4u,
  frames: vec4f,
  blend: vec4f,
  frameStride: u32
) -> mat4x4f {
  return weights.x * sampleGPUAnimationMatrix(frames, blend, 4u + joints.x * 4u, frameStride)
       + weights.y * sampleGPUAnimationMatrix(frames, blend, 4u + joints.y * 4u, frameStride)
       + weights.z * sampleGPUAnimationMatrix(frames, blend, 4u + joints.z * 4u, frameStride)
       + weights.w * sampleGPUAnimationMatrix(frames, blend, 4u + joints.w * 4u, frameStride);
}
#endif

#ifdef HAS_INSTANCED_MORPH
@group(0) @binding(auto) var<storage, read> gpuMorphTargets: array<vec4f>;

#ifndef HAS_GPU_CROWD_ANIMATION
@group(0) @binding(auto) var<storage, read> gpuMorphWeights: array<vec4f>;
#endif

fn getGPUCrowdMorphWeight(
  instanceIndex: u32,
  targetIndex: u32,
  targetCount: u32,
  jointsPerInstance: u32,
  frames: vec4f,
  blend: vec4f,
  frameStride: u32
) -> f32 {
#ifdef HAS_GPU_CROWD_ANIMATION
  let offset = 4u + jointsPerInstance * 4u + targetIndex;
  return sampleGPUAnimationFrame(frames, blend, offset, frameStride).x;
#else
  let packedCount = (targetCount + 3u) / 4u;
  let packedWeights = gpuMorphWeights[instanceIndex * packedCount + targetIndex / 4u];
  return packedWeights[targetIndex % 4u];
#endif
}

fn getGPUCrowdMorphDelta(
  instanceIndex: u32,
  vertexIndex: u32,
  attributeIndex: u32,
  vertexCount: u32,
  targetCount: u32,
  jointsPerInstance: u32,
  frames: vec4f,
  blend: vec4f,
  frameStride: u32
) -> vec3f {
  var result = vec3f(0.0);
  for (var targetIndex = 0u; targetIndex < targetCount; targetIndex++) {
    let weight = getGPUCrowdMorphWeight(
      instanceIndex,
      targetIndex,
      targetCount,
      jointsPerInstance,
      frames,
      blend,
      frameStride
    );
    let offset = (targetIndex * 3u + attributeIndex) * vertexCount + vertexIndex;
    result += gpuMorphTargets[offset].xyz * weight;
  }
  return result;
}
#endif
`,Io=`
#ifdef HAS_GPU_CROWD_ANIMATION
uniform highp sampler2D gpuAnimationFrames;

vec4 sampleGPUAnimationFrame(vec4 frames, vec4 blend, int offset) {
  vec4 first = mix(
    texelFetch(gpuAnimationFrames, ivec2(offset, int(frames.x)), 0),
    texelFetch(gpuAnimationFrames, ivec2(offset, int(frames.y)), 0),
    frames.z
  );
  if (blend.w <= 0.0) {
    return first;
  }
  vec4 second = mix(
    texelFetch(gpuAnimationFrames, ivec2(offset, int(blend.x)), 0),
    texelFetch(gpuAnimationFrames, ivec2(offset, int(blend.y)), 0),
    blend.z
  );
  return mix(first, second, blend.w);
}

mat4 sampleGPUAnimationMatrix(vec4 frames, vec4 blend, int firstColumn) {
  return mat4(
    sampleGPUAnimationFrame(frames, blend, firstColumn),
    sampleGPUAnimationFrame(frames, blend, firstColumn + 1),
    sampleGPUAnimationFrame(frames, blend, firstColumn + 2),
    sampleGPUAnimationFrame(frames, blend, firstColumn + 3)
  );
}

mat4 getGPUAnimatedSkinMatrix(vec4 weights, uvec4 joints, vec4 frames, vec4 blend) {
  return weights.x * sampleGPUAnimationMatrix(frames, blend, 4 + int(joints.x) * 4)
       + weights.y * sampleGPUAnimationMatrix(frames, blend, 4 + int(joints.y) * 4)
       + weights.z * sampleGPUAnimationMatrix(frames, blend, 4 + int(joints.z) * 4)
       + weights.w * sampleGPUAnimationMatrix(frames, blend, 4 + int(joints.w) * 4);
}
#endif

#ifdef HAS_INSTANCED_MORPH
uniform highp sampler2D gpuMorphTargets;

#ifndef HAS_GPU_CROWD_ANIMATION
uniform highp sampler2D gpuMorphWeights;
#endif

float getGPUCrowdMorphWeight(
  uint instanceIndex,
  uint targetIndex,
  uint jointsPerInstance,
  vec4 frames,
  vec4 blend
) {
#ifdef HAS_GPU_CROWD_ANIMATION
  int offset = 4 + int(jointsPerInstance) * 4 + int(targetIndex);
  return sampleGPUAnimationFrame(frames, blend, offset).x;
#else
  vec4 packedWeights = texelFetch(
    gpuMorphWeights,
    ivec2(int(targetIndex / 4u), int(instanceIndex)),
    0
  );
  return packedWeights[int(targetIndex % 4u)];
#endif
}

vec3 getGPUCrowdMorphDelta(
  uint instanceIndex,
  uint vertexIndex,
  uint attributeIndex,
  uint targetCount,
  uint jointsPerInstance,
  vec4 frames,
  vec4 blend
) {
  vec3 result = vec3(0.0);
  for (uint targetIndex = 0u; targetIndex < targetCount; targetIndex++) {
    float weight = getGPUCrowdMorphWeight(
      instanceIndex,
      targetIndex,
      jointsPerInstance,
      frames,
      blend
    );
    result += texelFetch(
      gpuMorphTargets,
      ivec2(int(vertexIndex), int(targetIndex * 3u + attributeIndex)),
      0
    ).xyz * weight;
  }
  return result;
}
#endif
`,Co={name:"gpuAnimation",props:{},uniforms:{},bindings:{},source:xo,vs:Io,fs:"",bindingLayout:[{name:"gpuAnimationFrames",group:0,visibility:1},{name:"gpuMorphTargets",group:0,visibility:1},{name:"gpuMorphWeights",group:0,visibility:1}],getUniforms(e={}){return e}},Yt=`precision highp int;

// #if (defined(SHADER_TYPE_FRAGMENT) && defined(LIGHTING_FRAGMENT)) || (defined(SHADER_TYPE_VERTEX) && defined(LIGHTING_VERTEX))
struct AmbientLight {
  vec3 color;
};

struct PointLight {
  vec3 color;
  vec3 position;
  vec3 attenuation; // 2nd order x:Constant-y:Linear-z:Exponential
};

struct SpotLight {
  vec3 color;
  vec3 position;
  vec3 direction;
  vec3 attenuation;
  vec2 coneCos;
};

struct DirectionalLight {
  vec3 color;
  vec3 direction;
};

struct UniformLight {
  vec3 color;
  vec3 position;
  vec3 direction;
  vec3 attenuation;
  vec2 coneCos;
};

layout(std140) uniform lightingUniforms {
  int enabled;
  int directionalLightCount;
  int pointLightCount;
  int spotLightCount;
  vec3 ambientColor;
  UniformLight lights[5];
} lighting;

PointLight lighting_getPointLight(int index) {
  UniformLight light = lighting.lights[index];
  return PointLight(light.color, light.position, light.attenuation);
}

SpotLight lighting_getSpotLight(int index) {
  UniformLight light = lighting.lights[lighting.pointLightCount + index];
  return SpotLight(light.color, light.position, light.direction, light.attenuation, light.coneCos);
}

DirectionalLight lighting_getDirectionalLight(int index) {
  UniformLight light =
    lighting.lights[lighting.pointLightCount + lighting.spotLightCount + index];
  return DirectionalLight(light.color, light.direction);
}

float getPointLightAttenuation(PointLight pointLight, float distance) {
  return pointLight.attenuation.x
       + pointLight.attenuation.y * distance
       + pointLight.attenuation.z * distance * distance;
}

float getSpotLightAttenuation(SpotLight spotLight, vec3 positionWorldspace) {
  vec3 light_direction = normalize(positionWorldspace - spotLight.position);
  float coneFactor = smoothstep(
    spotLight.coneCos.y,
    spotLight.coneCos.x,
    dot(normalize(spotLight.direction), light_direction)
  );
  float distanceAttenuation = getPointLightAttenuation(
    PointLight(spotLight.color, spotLight.position, spotLight.attenuation),
    distance(spotLight.position, positionWorldspace)
  );
  return distanceAttenuation / max(coneFactor, 0.0001);
}

// #endif
`,Ao=`// #if (defined(SHADER_TYPE_FRAGMENT) && defined(LIGHTING_FRAGMENT)) || (defined(SHADER_TYPE_VERTEX) && defined(LIGHTING_VERTEX))
const MAX_LIGHTS: i32 = 5;

struct AmbientLight {
  color: vec3<f32>,
};

struct PointLight {
  color: vec3<f32>,
  position: vec3<f32>,
  attenuation: vec3<f32>, // 2nd order x:Constant-y:Linear-z:Exponential
};

struct SpotLight {
  color: vec3<f32>,
  position: vec3<f32>,
  direction: vec3<f32>,
  attenuation: vec3<f32>,
  coneCos: vec2<f32>,
};

struct DirectionalLight {
  color: vec3<f32>,
  direction: vec3<f32>,
};

struct UniformLight {
  color: vec3<f32>,
  position: vec3<f32>,
  direction: vec3<f32>,
  attenuation: vec3<f32>,
  coneCos: vec2<f32>,
};

struct lightingUniforms {
  enabled: i32,
  directionalLightCount: i32,
  pointLightCount: i32,
  spotLightCount: i32,
  ambientColor: vec3<f32>,
  lights: array<UniformLight, 5>,
};

@group(2) @binding(auto) var<uniform> lighting : lightingUniforms;

fn lighting_getPointLight(index: i32) -> PointLight {
  let light = lighting.lights[index];
  return PointLight(light.color, light.position, light.attenuation);
}

fn lighting_getSpotLight(index: i32) -> SpotLight {
  let light = lighting.lights[lighting.pointLightCount + index];
  return SpotLight(light.color, light.position, light.direction, light.attenuation, light.coneCos);
}

fn lighting_getDirectionalLight(index: i32) -> DirectionalLight {
  let light = lighting.lights[lighting.pointLightCount + lighting.spotLightCount + index];
  return DirectionalLight(light.color, light.direction);
}

fn getPointLightAttenuation(pointLight: PointLight, distance: f32) -> f32 {
  return pointLight.attenuation.x
       + pointLight.attenuation.y * distance
       + pointLight.attenuation.z * distance * distance;
}

fn getSpotLightAttenuation(spotLight: SpotLight, positionWorldspace: vec3<f32>) -> f32 {
  let lightDirection = normalize(positionWorldspace - spotLight.position);
  let coneFactor = smoothstep(
    spotLight.coneCos.y,
    spotLight.coneCos.x,
    dot(normalize(spotLight.direction), lightDirection)
  );
  let distanceAttenuation = getPointLightAttenuation(
    PointLight(spotLight.color, spotLight.position, spotLight.attenuation),
    distance(spotLight.position, positionWorldspace)
  );
  return distanceAttenuation / max(coneFactor, 0.0001);
}
`,$=5,Ro={color:"vec3<f32>",position:"vec3<f32>",direction:"vec3<f32>",attenuation:"vec3<f32>",coneCos:"vec2<f32>"},K={props:{},uniforms:{},name:"lighting",defines:{},uniformTypes:{enabled:"i32",directionalLightCount:"i32",pointLightCount:"i32",spotLightCount:"i32",ambientColor:"vec3<f32>",lights:[Ro,$]},defaultUniforms:he(),bindingLayout:[{name:"lighting",group:2}],firstBindingSlot:0,source:Ao,vs:Yt,fs:Yt,getUniforms:Lo};function Lo(e,t={}){if(e=e&&{...e},!e)return he();e.lights&&(e={...e,...Mo(e.lights),lights:void 0});const{useByteColors:i,ambientLight:n,pointLights:r,spotLights:o,directionalLights:a}=e||{};if(!(n||r&&r.length>0||o&&o.length>0||a&&a.length>0))return{...he(),enabled:0};const l={...he(),...Eo({useByteColors:i,ambientLight:n,pointLights:r,spotLights:o,directionalLights:a})};return e.enabled!==void 0&&(l.enabled=e.enabled?1:0),l}function Eo({useByteColors:e,ambientLight:t,pointLights:i=[],spotLights:n=[],directionalLights:r=[]}){const o=Jt();let a=0,s=0,l=0,c=0;for(const f of i){if(a>=$)break;o[a]={...o[a],color:me(f,e),position:f.position,attenuation:f.attenuation||[1,0,0]},a++,s++}for(const f of n){if(a>=$)break;o[a]={...o[a],color:me(f,e),position:f.position,direction:f.direction,attenuation:f.attenuation||[1,0,0],coneCos:To(f)},a++,l++}for(const f of r){if(a>=$)break;o[a]={...o[a],color:me(f,e),direction:f.direction},a++,c++}return i.length+n.length+r.length>$&&pi.warn(`MAX_LIGHTS exceeded, truncating to ${$}`)(),{ambientColor:me(t,e),directionalLightCount:c,pointLightCount:s,spotLightCount:l,lights:o}}function Mo(e){const t={pointLights:[],spotLights:[],directionalLights:[]};for(const i of e||[])switch(i.type){case"ambient":t.ambientLight=i;break;case"directional":t.directionalLights?.push(i);break;case"point":t.pointLights?.push(i);break;case"spot":t.spotLights?.push(i);break}return t}function me(e={},t){const{color:i=[0,0,0],intensity:n=1}=e;return qe(i,je(t,!0)).map(o=>o*n)}function he(){return{enabled:1,directionalLightCount:0,pointLightCount:0,spotLightCount:0,ambientColor:[.1,.1,.1],lights:Jt()}}function Jt(){return Array.from({length:$},()=>yo())}function yo(){return{color:[1,1,1],position:[1,1,2],direction:[1,1,1],attenuation:[1,0,0],coneCos:[1,0]}}function To(e){const t=e.innerConeAngle??0,i=e.outerConeAngle??Math.PI/4;return[Math.cos(t),Math.cos(i)]}const wo=`#ifdef USE_IBL
@group(2) @binding(auto) var pbr_diffuseEnvSampler: texture_cube<f32>;
@group(2) @binding(auto) var pbr_diffuseEnvSamplerSampler: sampler;
@group(2) @binding(auto) var pbr_specularEnvSampler: texture_cube<f32>;
@group(2) @binding(auto) var pbr_specularEnvSamplerSampler: sampler;
@group(2) @binding(auto) var pbr_brdfLUT: texture_2d<f32>;
@group(2) @binding(auto) var pbr_brdfLUTSampler: sampler;
#endif
`,Qt=`#ifdef USE_IBL
uniform samplerCube pbr_diffuseEnvSampler;
uniform samplerCube pbr_specularEnvSampler;
uniform sampler2D pbr_brdfLUT;
#endif
`,ei={name:"ibl",firstBindingSlot:32,bindingLayout:[{name:"pbr_diffuseEnvSampler",group:2},{name:"pbr_specularEnvSampler",group:2},{name:"pbr_brdfLUT",group:2}],source:wo,vs:Qt,fs:Qt},Po=`struct dirlightUniforms {
  lightDirection: vec3<f32>,
};

alias DirlightNormal = vec3<f32>;

struct DirlightInputs {
  normal: DirlightNormal,
};

@group(2) @binding(auto) var<uniform> dirlight : dirlightUniforms;

// For vertex
fn dirlight_setNormal(normal: vec3<f32>) -> DirlightNormal {
  return normalize(normal);
}

// Returns color attenuated by angle from light source
fn dirlight_filterColor(color: vec4<f32>, inputs: DirlightInputs) -> vec4<f32> {
  // TODO - fix default light direction
  // let lightDirection = dirlight.lightDirection;
  let lightDirection = vec3<f32>(1, 1, 1);
  let d: f32 = abs(dot(inputs.normal, normalize(lightDirection)));
  return vec4<f32>(color.rgb * d, color.a);
}
`,No=`out vec3 dirlight_vNormal;

void dirlight_setNormal(vec3 normal) {
  dirlight_vNormal = normalize(normal);
}
`,Bo=`layout(std140) uniform dirlightUniforms {
  vec3 lightDirection;
} dirlight;

in vec3 dirlight_vNormal;

// Returns color attenuated by angle from light source
vec4 dirlight_filterColor(vec4 color) {
  float d = abs(dot(dirlight_vNormal, normalize(dirlight.lightDirection)));
  return vec4(color.rgb * d, color.a);
}
`,ti={props:{},uniforms:{},name:"dirlight",bindingLayout:[{name:"dirlight",group:2}],firstBindingSlot:16,dependencies:[],source:Po,vs:No,fs:Bo,uniformTypes:{lightDirection:"vec3<f32>"},defaultUniforms:{lightDirection:[1,1,2]},getUniforms:Uo};function Uo(e=ti.defaultUniforms){const t={};return e.lightDirection&&(t.lightDirection=e.lightDirection),t}const Oo=`struct lambertMaterialUniforms {
  unlit: u32,
  ambient: f32,
  diffuse: f32,
};

@group(3) @binding(auto) var<uniform> lambertMaterial : lambertMaterialUniforms;

fn lighting_getLightColor(surfaceColor: vec3<f32>, light_direction: vec3<f32>, normal_worldspace: vec3<f32>, color: vec3<f32>) -> vec3<f32> {
  let lambertian: f32 = max(dot(light_direction, normal_worldspace), 0.0);
  return lambertian * lambertMaterial.diffuse * surfaceColor * color;
}

fn lighting_getLightColor2(surfaceColor: vec3<f32>, cameraPosition: vec3<f32>, position_worldspace: vec3<f32>, normal_worldspace: vec3<f32>) -> vec3<f32> {
  var lightColor: vec3<f32> = surfaceColor;

  if (lambertMaterial.unlit != 0u) {
    return surfaceColor;
  }

  if (lighting.enabled == 0) {
    return lightColor;
  }

  lightColor = lambertMaterial.ambient * surfaceColor * lighting.ambientColor;

  for (var i: i32 = 0; i < lighting.pointLightCount; i++) {
    let pointLight: PointLight = lighting_getPointLight(i);
    let light_position_worldspace: vec3<f32> = pointLight.position;
    let light_direction: vec3<f32> = normalize(light_position_worldspace - position_worldspace);
    let light_attenuation = getPointLightAttenuation(
      pointLight,
      distance(light_position_worldspace, position_worldspace)
    );
    lightColor += lighting_getLightColor(
      surfaceColor,
      light_direction,
      normal_worldspace,
      pointLight.color / light_attenuation
    );
  }

  for (var i: i32 = 0; i < lighting.spotLightCount; i++) {
    let spotLight: SpotLight = lighting_getSpotLight(i);
    let light_position_worldspace: vec3<f32> = spotLight.position;
    let light_direction: vec3<f32> = normalize(light_position_worldspace - position_worldspace);
    let light_attenuation = getSpotLightAttenuation(spotLight, position_worldspace);
    lightColor += lighting_getLightColor(
      surfaceColor,
      light_direction,
      normal_worldspace,
      spotLight.color / light_attenuation
    );
  }

  for (var i: i32 = 0; i < lighting.directionalLightCount; i++) {
    let directionalLight: DirectionalLight = lighting_getDirectionalLight(i);
    lightColor += lighting_getLightColor(
      surfaceColor,
      -directionalLight.direction,
      normal_worldspace,
      directionalLight.color
    );
  }

  return lightColor;
}
`,Fo=`layout(std140) uniform lambertMaterialUniforms {
  uniform bool unlit;
  uniform float ambient;
  uniform float diffuse;
} material;
`,Do=`layout(std140) uniform lambertMaterialUniforms {
  uniform bool unlit;
  uniform float ambient;
  uniform float diffuse;
} material;

vec3 lighting_getLightColor(vec3 surfaceColor, vec3 light_direction, vec3 normal_worldspace, vec3 color) {
  float lambertian = max(dot(light_direction, normal_worldspace), 0.0);
  return lambertian * material.diffuse * surfaceColor * color;
}

vec3 lighting_getLightColor(vec3 surfaceColor, vec3 cameraPosition, vec3 position_worldspace, vec3 normal_worldspace) {
  vec3 lightColor = surfaceColor;

  if (material.unlit) {
    return surfaceColor;
  }

  if (lighting.enabled == 0) {
    return lightColor;
  }

  lightColor = material.ambient * surfaceColor * lighting.ambientColor;

  for (int i = 0; i < lighting.pointLightCount; i++) {
    PointLight pointLight = lighting_getPointLight(i);
    vec3 light_position_worldspace = pointLight.position;
    vec3 light_direction = normalize(light_position_worldspace - position_worldspace);
    float light_attenuation = getPointLightAttenuation(pointLight, distance(light_position_worldspace, position_worldspace));
    lightColor += lighting_getLightColor(surfaceColor, light_direction, normal_worldspace, pointLight.color / light_attenuation);
  }

  for (int i = 0; i < lighting.spotLightCount; i++) {
    SpotLight spotLight = lighting_getSpotLight(i);
    vec3 light_position_worldspace = spotLight.position;
    vec3 light_direction = normalize(light_position_worldspace - position_worldspace);
    float light_attenuation = getSpotLightAttenuation(spotLight, position_worldspace);
    lightColor += lighting_getLightColor(surfaceColor, light_direction, normal_worldspace, spotLight.color / light_attenuation);
  }

  for (int i = 0; i < lighting.directionalLightCount; i++) {
    DirectionalLight directionalLight = lighting_getDirectionalLight(i);
    lightColor += lighting_getLightColor(surfaceColor, -directionalLight.direction, normal_worldspace, directionalLight.color);
  }

  return lightColor;
}
`,ii={name:"lambertMaterial",firstBindingSlot:0,bindingLayout:[{name:"lambertMaterial",group:3}],dependencies:[K],source:Oo,vs:Fo,fs:Do,defines:{LIGHTING_FRAGMENT:!0},uniformTypes:{unlit:"i32",ambient:"f32",diffuse:"f32"},defaultUniforms:{unlit:!1,ambient:.35,diffuse:.6},getUniforms(e){return{...ii.defaultUniforms,...e}}},ni=`layout(std140) uniform phongMaterialUniforms {
  uniform bool unlit;
  uniform float ambient;
  uniform float diffuse;
  uniform float shininess;
  uniform vec3  specularColor;
} material;
`,ri=`layout(std140) uniform phongMaterialUniforms {
  uniform bool unlit;
  uniform float ambient;
  uniform float diffuse;
  uniform float shininess;
  uniform vec3  specularColor;
} material;

vec3 lighting_getLightColor(vec3 surfaceColor, vec3 light_direction, vec3 view_direction, vec3 normal_worldspace, vec3 color) {
  vec3 halfway_direction = normalize(light_direction + view_direction);
  float lambertian = dot(light_direction, normal_worldspace);
  float specular = 0.0;
  if (lambertian > 0.0) {
    float specular_angle = max(dot(normal_worldspace, halfway_direction), 0.0);
    specular = pow(specular_angle, material.shininess);
  }
  lambertian = max(lambertian, 0.0);
  return (lambertian * material.diffuse * surfaceColor + specular * floatColors_normalize(material.specularColor)) * color;
}

vec3 lighting_getLightColor(vec3 surfaceColor, vec3 cameraPosition, vec3 position_worldspace, vec3 normal_worldspace) {
  vec3 lightColor = surfaceColor;

  if (material.unlit) {
    return surfaceColor;
  }

  if (lighting.enabled == 0) {
    return lightColor;
  }

  vec3 view_direction = normalize(cameraPosition - position_worldspace);
  lightColor = material.ambient * surfaceColor * lighting.ambientColor;

  for (int i = 0; i < lighting.pointLightCount; i++) {
    PointLight pointLight = lighting_getPointLight(i);
    vec3 light_position_worldspace = pointLight.position;
    vec3 light_direction = normalize(light_position_worldspace - position_worldspace);
    float light_attenuation = getPointLightAttenuation(pointLight, distance(light_position_worldspace, position_worldspace));
    lightColor += lighting_getLightColor(surfaceColor, light_direction, view_direction, normal_worldspace, pointLight.color / light_attenuation);
  }

  for (int i = 0; i < lighting.spotLightCount; i++) {
    SpotLight spotLight = lighting_getSpotLight(i);
    vec3 light_position_worldspace = spotLight.position;
    vec3 light_direction = normalize(light_position_worldspace - position_worldspace);
    float light_attenuation = getSpotLightAttenuation(spotLight, position_worldspace);
    lightColor += lighting_getLightColor(surfaceColor, light_direction, view_direction, normal_worldspace, spotLight.color / light_attenuation);
  }

  for (int i = 0; i < lighting.directionalLightCount; i++) {
    DirectionalLight directionalLight = lighting_getDirectionalLight(i);
    lightColor += lighting_getLightColor(surfaceColor, -directionalLight.direction, view_direction, normal_worldspace, directionalLight.color);
  }
  
  return lightColor;
}
`,oi=`struct phongMaterialUniforms {
  unlit: u32,
  ambient: f32,
  diffuse: f32,
  shininess: f32,
  specularColor: vec3<f32>,
};

@group(3) @binding(auto) var<uniform> phongMaterial : phongMaterialUniforms;

fn lighting_getLightColor(surfaceColor: vec3<f32>, light_direction: vec3<f32>, view_direction: vec3<f32>, normal_worldspace: vec3<f32>, color: vec3<f32>) -> vec3<f32> {
  let halfway_direction: vec3<f32> = normalize(light_direction + view_direction);
  var lambertian: f32 = dot(light_direction, normal_worldspace);
  var specular: f32 = 0.0;
  if (lambertian > 0.0) {
    let specular_angle = max(dot(normal_worldspace, halfway_direction), 0.0);
    specular = pow(specular_angle, phongMaterial.shininess);
  }
  lambertian = max(lambertian, 0.0);
  return (
    lambertian * phongMaterial.diffuse * surfaceColor +
    specular * floatColors_normalize(phongMaterial.specularColor)
  ) * color;
}

fn lighting_getLightColor2(surfaceColor: vec3<f32>, cameraPosition: vec3<f32>, position_worldspace: vec3<f32>, normal_worldspace: vec3<f32>) -> vec3<f32> {
  var lightColor: vec3<f32> = surfaceColor;

  if (phongMaterial.unlit != 0u) {
    return surfaceColor;
  }

  if (lighting.enabled == 0) {
    return lightColor;
  }

  let view_direction: vec3<f32> = normalize(cameraPosition - position_worldspace);
  lightColor = phongMaterial.ambient * surfaceColor * lighting.ambientColor;

  for (var i: i32 = 0; i < lighting.pointLightCount; i++) {
    let pointLight: PointLight = lighting_getPointLight(i);
    let light_position_worldspace: vec3<f32> = pointLight.position;
    let light_direction: vec3<f32> = normalize(light_position_worldspace - position_worldspace);
    let light_attenuation = getPointLightAttenuation(
      pointLight,
      distance(light_position_worldspace, position_worldspace)
    );
    lightColor += lighting_getLightColor(
      surfaceColor,
      light_direction,
      view_direction,
      normal_worldspace,
      pointLight.color / light_attenuation
    );
  }

  for (var i: i32 = 0; i < lighting.spotLightCount; i++) {
    let spotLight: SpotLight = lighting_getSpotLight(i);
    let light_position_worldspace: vec3<f32> = spotLight.position;
    let light_direction: vec3<f32> = normalize(light_position_worldspace - position_worldspace);
    let light_attenuation = getSpotLightAttenuation(spotLight, position_worldspace);
    lightColor += lighting_getLightColor(
      surfaceColor,
      light_direction,
      view_direction,
      normal_worldspace,
      spotLight.color / light_attenuation
    );
  }

  for (var i: i32 = 0; i < lighting.directionalLightCount; i++) {
    let directionalLight: DirectionalLight = lighting_getDirectionalLight(i);
    lightColor += lighting_getLightColor(surfaceColor, -directionalLight.direction, view_direction, normal_worldspace, directionalLight.color);
  }  
  
  return lightColor;
}

fn lighting_getSpecularLightColor(cameraPosition: vec3<f32>, position_worldspace: vec3<f32>, normal_worldspace: vec3<f32>) -> vec3<f32>{
  var lightColor = vec3<f32>(0, 0, 0);
  let surfaceColor = vec3<f32>(0, 0, 0);

  if (lighting.enabled != 0) {
    let view_direction = normalize(cameraPosition - position_worldspace);

    for (var i: i32 = 0; i < lighting.pointLightCount; i++) {
      let pointLight: PointLight = lighting_getPointLight(i);
      let light_position_worldspace: vec3<f32> = pointLight.position;
      let light_direction: vec3<f32> = normalize(light_position_worldspace - position_worldspace);
      let light_attenuation = getPointLightAttenuation(
        pointLight,
        distance(light_position_worldspace, position_worldspace)
      );
      lightColor += lighting_getLightColor(
        surfaceColor,
        light_direction,
        view_direction,
        normal_worldspace,
        pointLight.color / light_attenuation
      );
    }

    for (var i: i32 = 0; i < lighting.spotLightCount; i++) {
      let spotLight: SpotLight = lighting_getSpotLight(i);
      let light_position_worldspace: vec3<f32> = spotLight.position;
      let light_direction: vec3<f32> = normalize(light_position_worldspace - position_worldspace);
      let light_attenuation = getSpotLightAttenuation(spotLight, position_worldspace);
      lightColor += lighting_getLightColor(
        surfaceColor,
        light_direction,
        view_direction,
        normal_worldspace,
        spotLight.color / light_attenuation
      );
    }

    for (var i: i32 = 0; i < lighting.directionalLightCount; i++) {
        let directionalLight: DirectionalLight = lighting_getDirectionalLight(i);
        lightColor += lighting_getLightColor(surfaceColor, -directionalLight.direction, view_direction, normal_worldspace, directionalLight.color);
    }
  }
  return lightColor;
}
`,Vo=[38.25,38.25,38.25],ai={props:{},name:"gouraudMaterial",bindingLayout:[{name:"gouraudMaterial",group:3}],vs:ri.replace("phongMaterial","gouraudMaterial"),fs:ni.replace("phongMaterial","gouraudMaterial"),source:oi.replaceAll("phongMaterial","gouraudMaterial"),defines:{LIGHTING_VERTEX:!0},dependencies:[K,Xe],uniformTypes:{unlit:"i32",ambient:"f32",diffuse:"f32",shininess:"f32",specularColor:"vec3<f32>"},defaultUniforms:{unlit:!1,ambient:.35,diffuse:.6,shininess:32,specularColor:Vo},getUniforms(e){return{...ai.defaultUniforms,...e}}},Go=[38.25,38.25,38.25],si={name:"phongMaterial",firstBindingSlot:0,bindingLayout:[{name:"phongMaterial",group:3}],dependencies:[K,Xe],source:oi,vs:ni,fs:ri,defines:{LIGHTING_FRAGMENT:!0},uniformTypes:{unlit:"i32",ambient:"f32",diffuse:"f32",shininess:"f32",specularColor:"vec3<f32>"},defaultUniforms:{unlit:!1,ambient:.35,diffuse:.6,shininess:32,specularColor:Go},getUniforms(e){return{...si.defaultUniforms,...e}}},ko=`layout(std140) uniform waterMaterialUniforms {
  uniform float time;
  uniform vec3 baseColor;
  uniform float opacity;
  uniform vec3 fresnelColor;
  uniform float fresnelPower;
  uniform float specularIntensity;
  uniform float normalStrength;
  uniform int mappingMode;
  uniform vec2 coordinateScale;
  uniform vec2 coordinateOffset;
  uniform vec2 waveADirection;
  uniform float waveASpeed;
  uniform float waveAFrequency;
  uniform float waveAAmplitude;
  uniform vec2 waveBDirection;
  uniform float waveBSpeed;
  uniform float waveBFrequency;
  uniform float waveBAmplitude;
} waterMaterial;
`,zo=`layout(std140) uniform waterMaterialUniforms {
  uniform float time;
  uniform vec3 baseColor;
  uniform float opacity;
  uniform vec3 fresnelColor;
  uniform float fresnelPower;
  uniform float specularIntensity;
  uniform float normalStrength;
  uniform int mappingMode;
  uniform vec2 coordinateScale;
  uniform vec2 coordinateOffset;
  uniform vec2 waveADirection;
  uniform float waveASpeed;
  uniform float waveAFrequency;
  uniform float waveAAmplitude;
  uniform vec2 waveBDirection;
  uniform float waveBSpeed;
  uniform float waveBFrequency;
  uniform float waveBAmplitude;
} waterMaterial;

vec2 water_getDirection(vec2 direction) {
  float directionLength = length(direction);
  return directionLength > 0.0 ? direction / directionLength : vec2(1.0, 0.0);
}

vec2 water_getCoordinates(vec3 position_worldspace, vec3 position_objectspace, vec2 uv) {
  vec2 baseCoordinates = uv;
  if (waterMaterial.mappingMode == 1) {
    baseCoordinates = position_worldspace.xz;
  } else if (waterMaterial.mappingMode == 2) {
    vec3 globeDirection = normalize(position_objectspace);
    float longitude = atan(globeDirection.x, globeDirection.z);
    float latitude = asin(clamp(globeDirection.y, -1.0, 1.0));
    baseCoordinates = vec2(longitude, latitude);
  }
  return baseCoordinates * waterMaterial.coordinateScale + waterMaterial.coordinateOffset;
}

vec2 water_getWaveGradient(
  vec2 coordinates,
  vec2 direction,
  float speed,
  float frequency,
  float amplitude
) {
  vec2 normalizedDirection = water_getDirection(direction);
  float phase = dot(coordinates * frequency, normalizedDirection) + waterMaterial.time * speed;
  return cos(phase) * normalizedDirection * frequency * amplitude;
}

vec3 water_getTangent(vec3 normal_worldspace) {
  vec3 referenceAxis = abs(normal_worldspace.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(0.0, 1.0, 0.0);
  return normalize(cross(referenceAxis, normal_worldspace));
}

vec3 water_getNormal(
  vec3 position_worldspace,
  vec3 position_objectspace,
  vec3 normal_worldspace,
  vec2 uv
) {
  vec2 coordinates = water_getCoordinates(position_worldspace, position_objectspace, uv);
  vec2 gradient =
    water_getWaveGradient(
      coordinates,
      waterMaterial.waveADirection,
      waterMaterial.waveASpeed,
      waterMaterial.waveAFrequency,
      waterMaterial.waveAAmplitude
    ) +
    water_getWaveGradient(
      coordinates,
      waterMaterial.waveBDirection,
      waterMaterial.waveBSpeed,
      waterMaterial.waveBFrequency,
      waterMaterial.waveBAmplitude
    );

  vec3 tangent = water_getTangent(normal_worldspace);
  vec3 bitangent = normalize(cross(normal_worldspace, tangent));
  vec3 perturbation =
    waterMaterial.normalStrength * (gradient.x * tangent + gradient.y * bitangent);

  return normalize(normal_worldspace + perturbation);
}

vec3 water_getSpecularContribution(
  vec3 light_direction,
  vec3 view_direction,
  vec3 normal_worldspace,
  vec3 light_color,
  float fresnel
) {
  vec3 halfway_direction = normalize(light_direction + view_direction);
  float specular =
    pow(max(dot(normal_worldspace, halfway_direction), 0.0), 72.0) *
    waterMaterial.specularIntensity *
    (0.25 + 0.75 * fresnel);

  return waterMaterial.fresnelColor * light_color * specular;
}

vec4 water_getColorMapped(
  vec3 cameraPosition,
  vec3 position_worldspace,
  vec3 position_objectspace,
  vec3 normal_worldspace,
  vec2 uv
) {
  vec3 waterNormal = water_getNormal(
    position_worldspace,
    position_objectspace,
    normalize(normal_worldspace),
    uv
  );
  vec3 viewDirection = normalize(cameraPosition - position_worldspace);
  float fresnel =
    pow(
      1.0 - max(dot(viewDirection, waterNormal), 0.0),
      max(waterMaterial.fresnelPower, 0.0001)
    );
  vec3 surfaceColor = mix(
    waterMaterial.baseColor,
    waterMaterial.fresnelColor,
    clamp(fresnel * 0.6, 0.0, 1.0)
  );

  if (lighting.enabled == 0) {
    return vec4(surfaceColor, waterMaterial.opacity);
  }

  vec3 lightColor = surfaceColor * (0.15 + 0.85 * lighting.ambientColor);

  for (int i = 0; i < lighting.pointLightCount; i++) {
    PointLight pointLight = lighting_getPointLight(i);
    vec3 lightPosition = pointLight.position;
    vec3 lightDirection = normalize(lightPosition - position_worldspace);
    float attenuation =
      getPointLightAttenuation(pointLight, distance(lightPosition, position_worldspace));
    vec3 incidentLight = pointLight.color / attenuation;
    float diffuse = max(dot(waterNormal, lightDirection), 0.0);

    lightColor += surfaceColor * incidentLight * diffuse;
    lightColor += water_getSpecularContribution(
      lightDirection,
      viewDirection,
      waterNormal,
      incidentLight,
      fresnel
    );
  }

  for (int i = 0; i < lighting.spotLightCount; i++) {
    SpotLight spotLight = lighting_getSpotLight(i);
    vec3 lightPosition = spotLight.position;
    vec3 lightDirection = normalize(lightPosition - position_worldspace);
    float attenuation = getSpotLightAttenuation(spotLight, position_worldspace);
    vec3 incidentLight = spotLight.color / attenuation;
    float diffuse = max(dot(waterNormal, lightDirection), 0.0);

    lightColor += surfaceColor * incidentLight * diffuse;
    lightColor += water_getSpecularContribution(
      lightDirection,
      viewDirection,
      waterNormal,
      incidentLight,
      fresnel
    );
  }

  for (int i = 0; i < lighting.directionalLightCount; i++) {
    DirectionalLight directionalLight = lighting_getDirectionalLight(i);
    vec3 lightDirection = normalize(-directionalLight.direction);
    float diffuse = max(dot(waterNormal, lightDirection), 0.0);

    lightColor += surfaceColor * directionalLight.color * diffuse;
    lightColor += water_getSpecularContribution(
      lightDirection,
      viewDirection,
      waterNormal,
      directionalLight.color,
      fresnel
    );
  }

  lightColor = mix(lightColor, waterMaterial.fresnelColor, clamp(fresnel, 0.0, 1.0) * 0.35);
  return vec4(lightColor, waterMaterial.opacity);
}

vec4 water_getColor(
  vec3 cameraPosition,
  vec3 position_worldspace,
  vec3 normal_worldspace,
  vec2 uv
) {
  return water_getColorMapped(
    cameraPosition,
    position_worldspace,
    position_worldspace,
    normal_worldspace,
    uv
  );
}
`,Ho=`struct waterMaterialUniforms {
  time: f32,
  baseColor: vec3<f32>,
  opacity: f32,
  fresnelColor: vec3<f32>,
  fresnelPower: f32,
  specularIntensity: f32,
  normalStrength: f32,
  mappingMode: i32,
  coordinateScale: vec2<f32>,
  coordinateOffset: vec2<f32>,
  waveADirection: vec2<f32>,
  waveASpeed: f32,
  waveAFrequency: f32,
  waveAAmplitude: f32,
  waveBDirection: vec2<f32>,
  waveBSpeed: f32,
  waveBFrequency: f32,
  waveBAmplitude: f32,
};

@group(3) @binding(auto) var<uniform> waterMaterial : waterMaterialUniforms;

fn water_getDirection(direction: vec2<f32>) -> vec2<f32> {
  let directionLength = length(direction);
  if (directionLength > 0.0) {
    return direction / directionLength;
  }

  return vec2<f32>(1.0, 0.0);
}

fn water_getCoordinates(
  position_worldspace: vec3<f32>,
  position_objectspace: vec3<f32>,
  uv: vec2<f32>
) -> vec2<f32> {
  var baseCoordinates = uv;
  if (waterMaterial.mappingMode == 1) {
    baseCoordinates = position_worldspace.xz;
  } else if (waterMaterial.mappingMode == 2) {
    let globeDirection = normalize(position_objectspace);
    let longitude = atan2(globeDirection.x, globeDirection.z);
    let latitude = asin(clamp(globeDirection.y, -1.0, 1.0));
    baseCoordinates = vec2<f32>(longitude, latitude);
  }

  return baseCoordinates * waterMaterial.coordinateScale + waterMaterial.coordinateOffset;
}

fn water_getWaveGradient(
  coordinates: vec2<f32>,
  direction: vec2<f32>,
  speed: f32,
  frequency: f32,
  amplitude: f32
) -> vec2<f32> {
  let normalizedDirection = water_getDirection(direction);
  let phase = dot(coordinates * frequency, normalizedDirection) + waterMaterial.time * speed;
  return cos(phase) * normalizedDirection * frequency * amplitude;
}

fn water_getTangent(normal_worldspace: vec3<f32>) -> vec3<f32> {
  var referenceAxis = vec3<f32>(0.0, 0.0, 1.0);
  if (abs(normal_worldspace.z) >= 0.999) {
    referenceAxis = vec3<f32>(0.0, 1.0, 0.0);
  }

  return normalize(cross(referenceAxis, normal_worldspace));
}

fn water_getNormal(
  position_worldspace: vec3<f32>,
  position_objectspace: vec3<f32>,
  normal_worldspace: vec3<f32>,
  uv: vec2<f32>
) -> vec3<f32> {
  let coordinates = water_getCoordinates(position_worldspace, position_objectspace, uv);
  let gradient =
    water_getWaveGradient(
      coordinates,
      waterMaterial.waveADirection,
      waterMaterial.waveASpeed,
      waterMaterial.waveAFrequency,
      waterMaterial.waveAAmplitude
    ) +
    water_getWaveGradient(
      coordinates,
      waterMaterial.waveBDirection,
      waterMaterial.waveBSpeed,
      waterMaterial.waveBFrequency,
      waterMaterial.waveBAmplitude
    );
  let tangent = water_getTangent(normal_worldspace);
  let bitangent = normalize(cross(normal_worldspace, tangent));
  let perturbation =
    waterMaterial.normalStrength * (gradient.x * tangent + gradient.y * bitangent);

  return normalize(normal_worldspace + perturbation);
}

fn water_getSpecularContribution(
  light_direction: vec3<f32>,
  view_direction: vec3<f32>,
  normal_worldspace: vec3<f32>,
  light_color: vec3<f32>,
  fresnel: f32
) -> vec3<f32> {
  let halfwayDirection = normalize(light_direction + view_direction);
  let specular =
    pow(max(dot(normal_worldspace, halfwayDirection), 0.0), 72.0) *
    waterMaterial.specularIntensity *
    (0.25 + 0.75 * fresnel);

  return waterMaterial.fresnelColor * light_color * specular;
}

fn water_getColorMapped(
  cameraPosition: vec3<f32>,
  position_worldspace: vec3<f32>,
  position_objectspace: vec3<f32>,
  normal_worldspace: vec3<f32>,
  uv: vec2<f32>
) -> vec4<f32> {
  let waterNormal = water_getNormal(
    position_worldspace,
    position_objectspace,
    normalize(normal_worldspace),
    uv
  );
  let viewDirection = normalize(cameraPosition - position_worldspace);
  let fresnel =
    pow(
      1.0 - max(dot(viewDirection, waterNormal), 0.0),
      max(waterMaterial.fresnelPower, 0.0001)
    );
  let surfaceColor = mix(
    waterMaterial.baseColor,
    waterMaterial.fresnelColor,
    clamp(fresnel * 0.6, 0.0, 1.0)
  );

  if (lighting.enabled == 0) {
    return vec4<f32>(surfaceColor, waterMaterial.opacity);
  }

  var lightColor = surfaceColor * (0.15 + 0.85 * lighting.ambientColor);

  for (var i: i32 = 0; i < lighting.pointLightCount; i++) {
    let pointLight = lighting_getPointLight(i);
    let lightPosition = pointLight.position;
    let lightDirection = normalize(lightPosition - position_worldspace);
    let attenuation = getPointLightAttenuation(
      pointLight,
      distance(lightPosition, position_worldspace)
    );
    let incidentLight = pointLight.color / attenuation;
    let diffuse = max(dot(waterNormal, lightDirection), 0.0);

    lightColor += surfaceColor * incidentLight * diffuse;
    lightColor += water_getSpecularContribution(
      lightDirection,
      viewDirection,
      waterNormal,
      incidentLight,
      fresnel
    );
  }

  for (var i: i32 = 0; i < lighting.spotLightCount; i++) {
    let spotLight = lighting_getSpotLight(i);
    let lightPosition = spotLight.position;
    let lightDirection = normalize(lightPosition - position_worldspace);
    let attenuation = getSpotLightAttenuation(spotLight, position_worldspace);
    let incidentLight = spotLight.color / attenuation;
    let diffuse = max(dot(waterNormal, lightDirection), 0.0);

    lightColor += surfaceColor * incidentLight * diffuse;
    lightColor += water_getSpecularContribution(
      lightDirection,
      viewDirection,
      waterNormal,
      incidentLight,
      fresnel
    );
  }

  for (var i: i32 = 0; i < lighting.directionalLightCount; i++) {
    let directionalLight = lighting_getDirectionalLight(i);
    let lightDirection = normalize(-directionalLight.direction);
    let diffuse = max(dot(waterNormal, lightDirection), 0.0);

    lightColor += surfaceColor * directionalLight.color * diffuse;
    lightColor += water_getSpecularContribution(
      lightDirection,
      viewDirection,
      waterNormal,
      directionalLight.color,
      fresnel
    );
  }

  lightColor = mix(
    lightColor,
    waterMaterial.fresnelColor,
    clamp(fresnel, 0.0, 1.0) * 0.35
  );
  return vec4<f32>(lightColor, waterMaterial.opacity);
}

fn water_getColor(
  cameraPosition: vec3<f32>,
  position_worldspace: vec3<f32>,
  normal_worldspace: vec3<f32>,
  uv: vec2<f32>
) -> vec4<f32> {
  return water_getColorMapped(
    cameraPosition,
    position_worldspace,
    position_worldspace,
    normal_worldspace,
    uv
  );
}
`,C={time:0,baseColor:[.04,.18,.31],opacity:.82,fresnelColor:[.86,.95,1],fresnelPower:5,specularIntensity:1.4,normalStrength:.35,mappingMode:0,coordinateScale:[1,1],coordinateOffset:[0,0],waveADirection:[.9805806756909201,.19611613513818402],waveASpeed:.6,waveAFrequency:4,waveAAmplitude:.08,waveBDirection:[.09950371902099893,.9950371902099893],waveBSpeed:-.45,waveBFrequency:7,waveBAmplitude:.04},$o={name:"waterMaterial",firstBindingSlot:0,bindingLayout:[{name:"waterMaterial",group:3}],dependencies:[K],source:Ho,vs:ko,fs:zo,defines:{LIGHTING_FRAGMENT:!0},uniformTypes:{time:"f32",baseColor:"vec3<f32>",opacity:"f32",fresnelColor:"vec3<f32>",fresnelPower:"f32",specularIntensity:"f32",normalStrength:"f32",mappingMode:"i32",coordinateScale:"vec2<f32>",coordinateOffset:"vec2<f32>",waveADirection:"vec2<f32>",waveASpeed:"f32",waveAFrequency:"f32",waveAAmplitude:"f32",waveBDirection:"vec2<f32>",waveBSpeed:"f32",waveBFrequency:"f32",waveBAmplitude:"f32"},defaultUniforms:C,getUniforms(e,t=C){const{mapping:i,...n}=e||{},r=jo(t);return n.time!==void 0&&(r.time=n.time),n.opacity!==void 0&&(r.opacity=n.opacity),n.fresnelPower!==void 0&&(r.fresnelPower=n.fresnelPower),n.specularIntensity!==void 0&&(r.specularIntensity=n.specularIntensity),n.normalStrength!==void 0&&(r.normalStrength=n.normalStrength),n.coordinateScale!==void 0&&(r.coordinateScale=[Number(n.coordinateScale[0]),Number(n.coordinateScale[1])]),n.coordinateOffset!==void 0&&(r.coordinateOffset=[Number(n.coordinateOffset[0]),Number(n.coordinateOffset[1])]),n.waveASpeed!==void 0&&(r.waveASpeed=n.waveASpeed),n.waveAFrequency!==void 0&&(r.waveAFrequency=n.waveAFrequency),n.waveAAmplitude!==void 0&&(r.waveAAmplitude=n.waveAAmplitude),n.waveBSpeed!==void 0&&(r.waveBSpeed=n.waveBSpeed),n.waveBFrequency!==void 0&&(r.waveBFrequency=n.waveBFrequency),n.waveBAmplitude!==void 0&&(r.waveBAmplitude=n.waveBAmplitude),n.baseColor&&(r.baseColor=ve(n.baseColor)),n.fresnelColor&&(r.fresnelColor=ve(n.fresnelColor)),n.waveADirection&&(r.waveADirection=be(n.waveADirection)),n.waveBDirection&&(r.waveBDirection=be(n.waveBDirection)),i!==void 0&&(r.mappingMode=i==="world"?1:i==="object"?2:0),r}};function jo(e){return{time:e.time??C.time,baseColor:e.baseColor?ve(e.baseColor):C.baseColor,opacity:e.opacity??C.opacity,fresnelColor:e.fresnelColor?ve(e.fresnelColor):C.fresnelColor,fresnelPower:e.fresnelPower??C.fresnelPower,specularIntensity:e.specularIntensity??C.specularIntensity,normalStrength:e.normalStrength??C.normalStrength,mappingMode:e.mappingMode??C.mappingMode,coordinateScale:e.coordinateScale?[Number(e.coordinateScale[0]),Number(e.coordinateScale[1])]:C.coordinateScale,coordinateOffset:e.coordinateOffset?[Number(e.coordinateOffset[0]),Number(e.coordinateOffset[1])]:C.coordinateOffset,waveADirection:e.waveADirection?be(e.waveADirection):C.waveADirection,waveASpeed:e.waveASpeed??C.waveASpeed,waveAFrequency:e.waveAFrequency??C.waveAFrequency,waveAAmplitude:e.waveAAmplitude??C.waveAAmplitude,waveBDirection:e.waveBDirection?be(e.waveBDirection):C.waveBDirection,waveBSpeed:e.waveBSpeed??C.waveBSpeed,waveBFrequency:e.waveBFrequency??C.waveBFrequency,waveBAmplitude:e.waveBAmplitude??C.waveBAmplitude}}function ve(e){const t=[Number(e[0]),Number(e[1]),Number(e[2])];return Math.max(...t.map(n=>Math.abs(n)))>1&&(t[0]/=255,t[1]/=255,t[2]/=255),t}function be(e){const t=Number(e[0]),i=Number(e[1]),n=Math.hypot(t,i);return n===0?[1,0]:[t/n,i/n]}const qo=`out vec3 pbr_vPosition;
out vec2 pbr_vUV0;
out vec2 pbr_vUV1;

#ifdef HAS_NORMALS
# ifdef HAS_TANGENTS
out mat3 pbr_vTBN;
# else
out vec3 pbr_vNormal;
# endif
#endif

void pbr_setPositionNormalTangentUV(
  vec4 position,
  vec4 normal,
  vec4 tangent,
  vec2 uv0,
  vec2 uv1
)
{
  vec4 pos = pbrProjection.modelMatrix * position;
  pbr_vPosition = vec3(pos.xyz) / pos.w;

#ifdef HAS_NORMALS
#ifdef HAS_TANGENTS
  vec3 normalW = normalize(vec3(pbrProjection.normalMatrix * vec4(normal.xyz, 0.0)));
  vec3 tangentW = normalize(vec3(pbrProjection.modelMatrix * vec4(tangent.xyz, 0.0)));
  vec3 bitangentW = cross(normalW, tangentW) * tangent.w;
  pbr_vTBN = mat3(tangentW, bitangentW, normalW);
#else // HAS_TANGENTS != 1
  pbr_vNormal = normalize(vec3(pbrProjection.modelMatrix * vec4(normal.xyz, 0.0)));
#endif
#endif

#ifdef HAS_UV
  pbr_vUV0 = uv0;
#else
  pbr_vUV0 = vec2(0.,0.);
#endif

  pbr_vUV1 = uv1;
}
`,Wo=`precision highp float;

layout(std140) uniform pbrMaterialUniforms {
  // Material is unlit
  bool unlit;

  // Base color map
  bool baseColorMapEnabled;
  vec4 baseColorFactor;

  bool normalMapEnabled;  
  float normalScale; // #ifdef HAS_NORMALMAP

  bool emissiveMapEnabled;
  vec3 emissiveFactor; // #ifdef HAS_EMISSIVEMAP

  vec2 metallicRoughnessValues;
  bool metallicRoughnessMapEnabled;

  bool occlusionMapEnabled;
  float occlusionStrength; // #ifdef HAS_OCCLUSIONMAP
  
  bool alphaCutoffEnabled;
  float alphaCutoff; // #ifdef ALPHA_CUTOFF

  vec3 specularColorFactor;
  float specularIntensityFactor;
  bool specularColorMapEnabled;
  bool specularIntensityMapEnabled;

  float ior;

  float transmissionFactor;
  bool transmissionMapEnabled;

  float thicknessFactor;
  float attenuationDistance;
  vec3 attenuationColor;

  float clearcoatFactor;
  float clearcoatRoughnessFactor;
  bool clearcoatMapEnabled;
  bool clearcoatRoughnessMapEnabled;

  vec3 sheenColorFactor;
  float sheenRoughnessFactor;
  bool sheenColorMapEnabled;
  bool sheenRoughnessMapEnabled;

  float iridescenceFactor;
  float iridescenceIor;
  vec2 iridescenceThicknessRange;
  bool iridescenceMapEnabled;

  float anisotropyStrength;
  float anisotropyRotation;
  vec2 anisotropyDirection;
  bool anisotropyMapEnabled;

  float emissiveStrength;
  float dispersion;
  
  // IBL
  bool IBLenabled;
  vec2 scaleIBLAmbient; // #ifdef USE_IBL
  
  // debugging flags used for shader output of intermediate PBR variables
  // #ifdef PBR_DEBUG
  vec4 scaleDiffBaseMR;
  vec4 scaleFGDSpec;
  // #endif

  int baseColorUVSet;
  mat3 baseColorUVTransform;
  int metallicRoughnessUVSet;
  mat3 metallicRoughnessUVTransform;
  int normalUVSet;
  mat3 normalUVTransform;
  int occlusionUVSet;
  mat3 occlusionUVTransform;
  int emissiveUVSet;
  mat3 emissiveUVTransform;
  int specularColorUVSet;
  mat3 specularColorUVTransform;
  int specularIntensityUVSet;
  mat3 specularIntensityUVTransform;
  int transmissionUVSet;
  mat3 transmissionUVTransform;
  int thicknessUVSet;
  mat3 thicknessUVTransform;
  int clearcoatUVSet;
  mat3 clearcoatUVTransform;
  int clearcoatRoughnessUVSet;
  mat3 clearcoatRoughnessUVTransform;
  int clearcoatNormalUVSet;
  mat3 clearcoatNormalUVTransform;
  int sheenColorUVSet;
  mat3 sheenColorUVTransform;
  int sheenRoughnessUVSet;
  mat3 sheenRoughnessUVTransform;
  int iridescenceUVSet;
  mat3 iridescenceUVTransform;
  int iridescenceThicknessUVSet;
  mat3 iridescenceThicknessUVTransform;
  int anisotropyUVSet;
  mat3 anisotropyUVTransform;

  float bumpFactor;
  bool bumpMapEnabled;
  float diffuseTransmissionFactor;
  bool diffuseTransmissionMapEnabled;
  vec3 diffuseTransmissionColorFactor;
  bool diffuseTransmissionColorMapEnabled;
  vec3 multiscatterColorFactor;
  bool multiscatterColorMapEnabled;
  float scatterAnisotropy;

  int bumpUVSet;
  mat3 bumpUVTransform;
  int diffuseTransmissionUVSet;
  mat3 diffuseTransmissionUVTransform;
  int diffuseTransmissionColorUVSet;
  mat3 diffuseTransmissionColorUVTransform;
  int multiscatterColorUVSet;
  mat3 multiscatterColorUVTransform;
} pbrMaterial;

// Samplers
#ifdef HAS_BASECOLORMAP
uniform sampler2D pbr_baseColorSampler;
#endif
#ifdef HAS_NORMALMAP
uniform sampler2D pbr_normalSampler;
#endif
#ifdef HAS_EMISSIVEMAP
uniform sampler2D pbr_emissiveSampler;
#endif
#ifdef HAS_METALROUGHNESSMAP
uniform sampler2D pbr_metallicRoughnessSampler;
#endif
#ifdef HAS_OCCLUSIONMAP
uniform sampler2D pbr_occlusionSampler;
#endif
#ifdef HAS_SPECULARCOLORMAP
uniform sampler2D pbr_specularColorSampler;
#endif
#ifdef HAS_SPECULARINTENSITYMAP
uniform sampler2D pbr_specularIntensitySampler;
#endif
#ifdef HAS_TRANSMISSIONMAP
uniform sampler2D pbr_transmissionSampler;
#endif
#ifdef HAS_THICKNESSMAP
uniform sampler2D pbr_thicknessSampler;
#endif
#ifdef HAS_CLEARCOATMAP
uniform sampler2D pbr_clearcoatSampler;
#endif
#ifdef HAS_CLEARCOATROUGHNESSMAP
uniform sampler2D pbr_clearcoatRoughnessSampler;
#endif
#ifdef HAS_CLEARCOATNORMALMAP
uniform sampler2D pbr_clearcoatNormalSampler;
#endif
#ifdef HAS_SHEENCOLORMAP
uniform sampler2D pbr_sheenColorSampler;
#endif
#ifdef HAS_SHEENROUGHNESSMAP
uniform sampler2D pbr_sheenRoughnessSampler;
#endif
#ifdef HAS_IRIDESCENCEMAP
uniform sampler2D pbr_iridescenceSampler;
#endif
#ifdef HAS_IRIDESCENCETHICKNESSMAP
uniform sampler2D pbr_iridescenceThicknessSampler;
#endif
#ifdef HAS_ANISOTROPYMAP
uniform sampler2D pbr_anisotropySampler;
#endif
#ifdef HAS_BUMPMAP
uniform sampler2D pbr_bumpSampler;
#endif
#ifdef HAS_DIFFUSETRANSMISSIONMAP
uniform sampler2D pbr_diffuseTransmissionSampler;
#endif
#ifdef HAS_DIFFUSETRANSMISSIONCOLORMAP
uniform sampler2D pbr_diffuseTransmissionColorSampler;
#endif
#ifdef HAS_MULTISCATTERCOLORMAP
uniform sampler2D pbr_multiscatterColorSampler;
#endif
// Inputs from vertex shader

in vec3 pbr_vPosition;
in vec2 pbr_vUV0;
in vec2 pbr_vUV1;

#ifdef HAS_NORMALS
#ifdef HAS_TANGENTS
in mat3 pbr_vTBN;
#else
in vec3 pbr_vNormal;
#endif
#endif

// Encapsulate the various inputs used by the various functions in the shading equation
// We store values in this struct to simplify the integration of alternative implementations
// of the shading terms, outlined in the Readme.MD Appendix.
struct PBRInfo {
  float NdotL;                  // cos angle between normal and light direction
  float NdotV;                  // cos angle between normal and view direction
  float NdotH;                  // cos angle between normal and half vector
  float LdotH;                  // cos angle between light direction and half vector
  float VdotH;                  // cos angle between view direction and half vector
  float perceptualRoughness;    // roughness value, as authored by the model creator (input to shader)
  float metalness;              // metallic value at the surface
  vec3 reflectance0;            // full reflectance color (normal incidence angle)
  vec3 reflectance90;           // reflectance color at grazing angle
  float alphaRoughness;         // roughness mapped to a more linear change in the roughness (proposed by [2])
  vec3 diffuseColor;            // color contribution from diffuse lighting
  vec3 specularColor;           // color contribution from specular lighting
  vec3 n;                       // normal at surface point
  vec3 v;                       // vector from surface point to camera
  vec3 l;                       // direction from the surface toward the current light
  vec3 h;                       // half vector between the current light and camera
};

const float M_PI = 3.141592653589793;
const float c_MinRoughness = 0.04;

// Widen sub-pixel specular lobes using the screen-space normal footprint.
// This is geometric specular antialiasing: the normal variance is converted
// into an additional squared perceptual roughness before evaluating BRDFs.
float widenSpecularRoughness(float perceptualRoughness, vec3 normal)
{
  vec3 normalDerivativeX = dFdx(normal);
  vec3 normalDerivativeY = dFdy(normal);
  float normalVariance =
    dot(normalDerivativeX, normalDerivativeX) +
    dot(normalDerivativeY, normalDerivativeY);
  float kernelRoughnessSquared = min(2.0 * normalVariance, 1.0);
  return clamp(
    sqrt(perceptualRoughness * perceptualRoughness + kernelRoughnessSquared),
    c_MinRoughness,
    1.0
  );
}

vec3 calculateFinalColor(PBRInfo pbrInfo, vec3 lightColor);

vec4 SRGBtoLINEAR(vec4 srgbIn)
{
#ifdef MANUAL_SRGB
#ifdef SRGB_FAST_APPROXIMATION
  vec3 linOut = pow(srgbIn.xyz,vec3(2.2));
#else // SRGB_FAST_APPROXIMATION
  vec3 bLess = step(vec3(0.04045),srgbIn.xyz);
  vec3 linOut = mix( srgbIn.xyz/vec3(12.92), pow((srgbIn.xyz+vec3(0.055))/vec3(1.055),vec3(2.4)), bLess );
#endif //SRGB_FAST_APPROXIMATION
  return vec4(linOut,srgbIn.w);;
#else //MANUAL_SRGB
  return srgbIn;
#endif //MANUAL_SRGB
}

vec2 getMaterialUV(int uvSet, mat3 uvTransform)
{
  vec2 baseUV = uvSet == 1 ? pbr_vUV1 : pbr_vUV0;
  return (uvTransform * vec3(baseUV, 1.0)).xy;
}

// Build the tangent basis from interpolated attributes or screen-space derivatives.
mat3 getTBN(vec2 uv)
{
#ifndef HAS_TANGENTS
  vec3 pos_dx = dFdx(pbr_vPosition);
  vec3 pos_dy = dFdy(pbr_vPosition);
  vec3 tex_dx = dFdx(vec3(uv, 0.0));
  vec3 tex_dy = dFdy(vec3(uv, 0.0));
  vec3 t = (tex_dy.t * pos_dx - tex_dx.t * pos_dy) / (tex_dx.s * tex_dy.t - tex_dy.s * tex_dx.t);

#ifdef HAS_NORMALS
  vec3 ng = normalize(pbr_vNormal);
#else
  vec3 ng = cross(pos_dx, pos_dy);
#endif

  t = normalize(t - ng * dot(ng, t));
  vec3 b = normalize(cross(ng, t));
  mat3 tbn = mat3(t, b, ng);
#else // HAS_TANGENTS
  mat3 tbn = pbr_vTBN;
#endif

  return tbn;
}

// Find the normal for this fragment, pulling either from a predefined normal map
// or from the interpolated mesh normal and tangent attributes.
vec3 getMappedNormal(sampler2D normalSampler, mat3 tbn, float normalScale, vec2 uv)
{
  vec3 n = texture(normalSampler, uv).rgb;
  return normalize(tbn * ((2.0 * n - 1.0) * vec3(normalScale, normalScale, 1.0)));
}

vec3 getNormal(mat3 tbn, vec2 uv)
{
#ifdef HAS_NORMALMAP
  vec3 n = getMappedNormal(pbr_normalSampler, tbn, pbrMaterial.normalScale, uv);
#else
  // The tbn matrix is linearly interpolated, so we need to re-normalize
  vec3 n = normalize(tbn[2].xyz);
#endif

#ifdef HAS_BUMPMAP
  vec2 bumpUV = getMaterialUV(pbrMaterial.bumpUVSet, pbrMaterial.bumpUVTransform);
  vec2 bumpTexelSize = 1.0 / vec2(textureSize(pbr_bumpSampler, 0));
  float bumpHeight = texture(pbr_bumpSampler, bumpUV).r;
  vec2 bumpGradient = vec2(
    texture(pbr_bumpSampler, bumpUV + vec2(bumpTexelSize.x, 0.0)).r - bumpHeight,
    texture(pbr_bumpSampler, bumpUV + vec2(0.0, bumpTexelSize.y)).r - bumpHeight
  );
  n = normalize(n - pbrMaterial.bumpFactor *
    (tbn[0] * bumpGradient.x + tbn[1] * bumpGradient.y));
#endif

  return n;
}

vec3 getClearcoatNormal(mat3 tbn, vec3 baseNormal, vec2 uv)
{
#ifdef HAS_CLEARCOATNORMALMAP
  return getMappedNormal(pbr_clearcoatNormalSampler, tbn, 1.0, uv);
#else
  return baseNormal;
#endif
}

// Calculation of the lighting contribution from an optional Image Based Light source.
// Precomputed Environment Maps are required uniform inputs and are computed as outlined in [1].
// See our README.md on Environment Maps [3] for additional discussion.
#ifdef USE_IBL
vec3 getIBLContribution(PBRInfo pbrInfo, vec3 n, vec3 reflection)
{
#ifdef USE_SCENE_ENVIRONMENT
  float maximumMipLevel = max(pbrScene.environmentMipCount - 1.0, 0.0);
  float rotationSine = sin(pbrScene.environmentRotation);
  float rotationCosine = cos(pbrScene.environmentRotation);
  mat2 environmentRotation = mat2(rotationCosine, rotationSine, -rotationSine, rotationCosine);
  vec3 environmentNormal = vec3(environmentRotation * n.xz, n.y).xzy;
  vec3 environmentReflection = vec3(environmentRotation * reflection.xz, reflection.y).xzy;
#else
  float maximumMipLevel = 9.0;
  vec3 environmentNormal = n;
  vec3 environmentReflection = reflection;
#endif
  float lod = pbrInfo.perceptualRoughness * maximumMipLevel;
  // retrieve a scale and bias to F0. See [1], Figure 3
  vec4 brdfSample = texture(pbr_brdfLUT,
    vec2(pbrInfo.NdotV, 1.0 - pbrInfo.perceptualRoughness));
  vec4 diffuseSample = texture(pbr_diffuseEnvSampler, environmentNormal);

#ifdef USE_TEX_LOD
  vec4 specularSample = textureLod(pbr_specularEnvSampler, environmentReflection, lod);
#else
  vec4 specularSample = texture(pbr_specularEnvSampler, environmentReflection);
#endif

#ifdef USE_SCENE_ENVIRONMENT
  vec3 brdf = brdfSample.rgb;
  vec3 diffuseLight = diffuseSample.rgb;
  vec3 specularLight = specularSample.rgb;
#else
  vec3 brdf = SRGBtoLINEAR(brdfSample).rgb;
  vec3 diffuseLight = SRGBtoLINEAR(diffuseSample).rgb;
  vec3 specularLight = SRGBtoLINEAR(specularSample).rgb;
#endif

  vec3 diffuse = diffuseLight * pbrInfo.diffuseColor;
  vec3 specular = specularLight * (pbrInfo.specularColor * brdf.x + brdf.y);

  // For presentation, this allows us to disable IBL terms
  diffuse *= pbrMaterial.scaleIBLAmbient.x;
  specular *= pbrMaterial.scaleIBLAmbient.y;

#ifdef USE_SCENE_ENVIRONMENT
  return (diffuse + specular) * max(pbrScene.environmentIntensity, 0.0);
#else
  return diffuse + specular;
#endif
}
#endif

// Basic Lambertian diffuse
// Implementation from Lambert's Photometria https://archive.org/details/lambertsphotome00lambgoog
// See also [1], Equation 1
vec3 diffuse(PBRInfo pbrInfo)
{
  return pbrInfo.diffuseColor / M_PI;
}

// The following equation models the Fresnel reflectance term of the spec equation (aka F())
// Implementation of fresnel from [4], Equation 15
vec3 specularReflection(PBRInfo pbrInfo)
{
  return pbrInfo.reflectance0 +
    (pbrInfo.reflectance90 - pbrInfo.reflectance0) *
    pow(clamp(1.0 - pbrInfo.VdotH, 0.0, 1.0), 5.0);
}

// This calculates the specular geometric attenuation (aka G()),
// where rougher material will reflect less light back to the viewer.
// This implementation is based on [1] Equation 4, and we adopt their modifications to
// alphaRoughness as input as originally proposed in [2].
float geometricOcclusion(PBRInfo pbrInfo)
{
  float NdotL = pbrInfo.NdotL;
  float NdotV = pbrInfo.NdotV;
  float r = pbrInfo.alphaRoughness;

  float attenuationL = 2.0 * NdotL / (NdotL + sqrt(r * r + (1.0 - r * r) * (NdotL * NdotL)));
  float attenuationV = 2.0 * NdotV / (NdotV + sqrt(r * r + (1.0 - r * r) * (NdotV * NdotV)));
  return attenuationL * attenuationV;
}

// The following equation(s) model the distribution of microfacet normals across
// the area being drawn (aka D())
// Implementation from "Average Irregularity Representation of a Roughened Surface
// for Ray Reflection" by T. S. Trowbridge, and K. P. Reitz
// Follows the distribution function recommended in the SIGGRAPH 2013 course notes
// from EPIC Games [1], Equation 3.
float microfacetDistribution(PBRInfo pbrInfo)
{
  float roughnessSq = pbrInfo.alphaRoughness * pbrInfo.alphaRoughness;
  float f = (pbrInfo.NdotH * roughnessSq - pbrInfo.NdotH) * pbrInfo.NdotH + 1.0;
  return roughnessSq / (M_PI * f * f);
}

float maxComponent(vec3 value)
{
  return max(max(value.r, value.g), value.b);
}

float getDielectricF0(float ior)
{
  float clampedIor = max(ior, 1.0);
  float ratio = (clampedIor - 1.0) / (clampedIor + 1.0);
  return ratio * ratio;
}

vec2 normalizeDirection(vec2 direction)
{
  float directionLength = length(direction);
  return directionLength > 0.0001 ? direction / directionLength : vec2(1.0, 0.0);
}

vec2 rotateDirection(vec2 direction, float rotation)
{
  float s = sin(rotation);
  float c = cos(rotation);
  return vec2(direction.x * c - direction.y * s, direction.x * s + direction.y * c);
}

vec3 encodeLinearSRGB(vec3 linearColor)
{
  vec3 positiveColor = max(linearColor, vec3(0.0));
  return mix(
    positiveColor * 12.92,
    1.055 * pow(positiveColor, vec3(1.0 / 2.4)) - 0.055,
    greaterThan(positiveColor, vec3(0.0031308))
  );
}

vec3 toneMapKhronosPBRNeutral(vec3 color)
{
  const float startCompression = 0.76;
  float darkestChannel = min(color.r, min(color.g, color.b));
  float offset = darkestChannel < 0.08
    ? darkestChannel - 6.25 * darkestChannel * darkestChannel
    : 0.04;
  color -= vec3(offset);

  float peak = maxComponent(color);
  if (peak < startCompression) {
    return color;
  }

  float compressionRange = 1.0 - startCompression;
  float compressedPeak = 1.0 - compressionRange * compressionRange /
    (peak + compressionRange - startCompression);
  color *= compressedPeak / max(peak, 0.0001);
  float desaturation = 1.0 - 1.0 / (0.15 * (peak - compressedPeak) + 1.0);
  return mix(color, vec3(compressedPeak), desaturation);
}

vec3 applySceneColorManagement(vec3 sceneColor)
{
#ifdef USE_SCENE_COLOR_MANAGEMENT
  vec3 color = max(sceneColor, vec3(0.0)) * max(pbrScene.exposure, 0.0);
  if (pbrScene.toneMapMode == 1) {
    color /= vec3(1.0) + color;
  } else if (pbrScene.toneMapMode == 2) {
    color = toneMapKhronosPBRNeutral(color);
  } else if (pbrScene.toneMapMode == 3) {
    color = clamp(
      (color * (2.51 * color + 0.03)) / (color * (2.43 * color + 0.59) + 0.14),
      vec3(0.0),
      vec3(1.0)
    );
  }
  return pbrScene.outputEncoding == 0 ? color : encodeLinearSRGB(color);
#else
  return pow(max(sceneColor, vec3(0.0)), vec3(1.0 / 2.2));
#endif
}

float dielectricSchlick(float reflectance, float cosine)
{
  return reflectance + (1.0 - reflectance) * pow(clamp(1.0 - cosine, 0.0, 1.0), 5.0);
}

vec3 evaluateIridescenceSensitivity(float opticalPathDifference, vec3 phaseShift)
{
  float phase = 2.0 * M_PI * opticalPathDifference * 1.0e-9;
  vec3 sensitivity = vec3(5.4856e-13, 4.4201e-13, 5.2481e-13);
  vec3 position = vec3(1.6810e6, 1.7953e6, 2.2084e6);
  vec3 variance = vec3(4.3278e9, 9.3046e9, 6.6121e9);
  vec3 xyz = sensitivity * sqrt(2.0 * M_PI * variance) *
    cos(position * phase + phaseShift) * exp(-phase * phase * variance);
  xyz.x += 9.7470e-14 * sqrt(2.0 * M_PI * 4.5282e9) *
    cos(2.2399e6 * phase + phaseShift.x) * exp(-4.5282e9 * phase * phase);
  xyz /= 1.0685e-7;
  return mat3(
    3.2404542, -0.9692660, 0.0556434,
    -1.5371385, 1.8760108, -0.2040259,
    -0.4985314, 0.0415560, 1.0572252
  ) * xyz;
}

vec3 getIridescenceTint(float iridescence, float thickness, float NdotV, vec3 baseReflectance)
{
  if (iridescence <= 0.0 || thickness <= 0.0) {
    return baseReflectance;
  }

  float filmIor = max(pbrMaterial.iridescenceIor, 1.0);
  float sineSquared = (1.0 - NdotV * NdotV) / (filmIor * filmIor);
  float cosineSquared = 1.0 - sineSquared;
  if (cosineSquared <= 0.0) {
    return mix(baseReflectance, vec3(1.0), iridescence);
  }
  float filmCosine = sqrt(cosineSquared);
  float firstInterfaceReflectance = dielectricSchlick(getDielectricF0(filmIor), NdotV);
  float transmittedEnergy = 1.0 - firstInterfaceReflectance;

  vec3 baseIor = (vec3(1.0) + sqrt(clamp(baseReflectance, vec3(0.0), vec3(0.9999)))) /
    (vec3(1.0) - sqrt(clamp(baseReflectance, vec3(0.0), vec3(0.9999))));
  vec3 secondInterfaceF0 = (baseIor - vec3(filmIor)) / (baseIor + vec3(filmIor));
  secondInterfaceF0 *= secondInterfaceF0;
  vec3 secondInterfaceReflectance = secondInterfaceF0 +
    (vec3(1.0) - secondInterfaceF0) * pow(1.0 - filmCosine, 5.0);
  vec3 phaseShift = vec3(M_PI);
  phaseShift += mix(vec3(0.0), vec3(M_PI), lessThan(baseIor, vec3(filmIor)));
  float opticalPathDifference = 2.0 * filmIor * thickness * filmCosine;
  vec3 combinedReflectance = clamp(
    firstInterfaceReflectance * secondInterfaceReflectance,
    vec3(0.00001),
    vec3(0.9999)
  );
  vec3 recurringAmplitude = sqrt(combinedReflectance);
  vec3 interfaceResponse = transmittedEnergy * transmittedEnergy * secondInterfaceReflectance /
    (vec3(1.0) - combinedReflectance);
  vec3 reflectedSpectrum = vec3(firstInterfaceReflectance) + interfaceResponse;
  vec3 harmonicAmplitude = interfaceResponse - vec3(transmittedEnergy);
  for (int harmonic = 1; harmonic <= 2; harmonic++) {
    harmonicAmplitude *= recurringAmplitude;
    reflectedSpectrum += harmonicAmplitude * 2.0 * evaluateIridescenceSensitivity(
      float(harmonic) * opticalPathDifference,
      float(harmonic) * phaseShift
    );
  }
  return mix(baseReflectance, clamp(reflectedSpectrum, vec3(0.0), vec3(1.0)), iridescence);
}

vec3 getVolumeAttenuation(float thickness)
{
  if (thickness <= 0.0) {
    return vec3(1.0);
  }

  vec3 attenuationCoefficient =
    -log(max(pbrMaterial.attenuationColor, vec3(0.0001))) /
    max(pbrMaterial.attenuationDistance, 0.0001);
  return exp(-attenuationCoefficient * thickness);
}

// KHR_materials_volume_scatter is an active draft. This evaluates a local,
// thickness-aware single-scattering approximation rather than random walk.
vec3 getDiffuseTransmissionAttenuation(
  PBRInfo pbrInfo,
  vec3 multiscatterColor,
  float thickness
)
{
  vec3 volumeAttenuation = getVolumeAttenuation(thickness);
  float scatteringStrength = maxComponent(multiscatterColor);
  if (thickness <= 0.0 || scatteringStrength <= 0.0001) {
    return volumeAttenuation;
  }

  float anisotropy = clamp(pbrMaterial.scatterAnisotropy, -0.95, 0.95);
  float scatteringCosine = clamp(dot(-pbrInfo.v, pbrInfo.l), -1.0, 1.0);
  float phaseDenominator = max(
    1.0 + anisotropy * anisotropy - 2.0 * anisotropy * scatteringCosine,
    0.0001
  );
  float phaseWeight = clamp(
    (1.0 - anisotropy * anisotropy) / pow(phaseDenominator, 1.5),
    0.0,
    4.0
  );
  float scatteringDepth = thickness / max(pbrMaterial.attenuationDistance, 0.0001);
  float scatteringProbability = 1.0 - exp(-scatteringDepth);
  vec3 scatteringColor = clamp(multiscatterColor, vec3(0.0), vec3(1.0));
  return mix(
    volumeAttenuation,
    volumeAttenuation * mix(vec3(1.0), scatteringColor * phaseWeight, scatteringColor),
    scatteringProbability
  );
}

vec3 calculateDiffuseTransmissionLight(
  PBRInfo pbrInfo,
  vec3 lightColor,
  vec3 diffuseTransmissionColor,
  float diffuseTransmission,
  vec3 multiscatterColor,
  float thickness
)
{
  float oppositeHemisphere = max(dot(-pbrInfo.n, pbrInfo.l), 0.0);
  if (oppositeHemisphere <= 0.0 || diffuseTransmission <= 0.0) {
    return vec3(0.0);
  }

  vec3 nonReflectedEnergy = vec3(1.0) - clamp(pbrInfo.reflectance0, vec3(0.0), vec3(1.0));
  vec3 attenuatedColor = getDiffuseTransmissionAttenuation(
    pbrInfo,
    multiscatterColor,
    thickness
  );
  return lightColor * diffuseTransmissionColor * nonReflectedEnergy *
    attenuatedColor * (diffuseTransmission * oppositeHemisphere / M_PI);
}

#ifdef USE_IBL
vec3 calculateDiffuseTransmissionIBL(
  PBRInfo pbrInfo,
  vec3 diffuseTransmissionColor,
  float diffuseTransmission,
  vec3 multiscatterColor,
  float thickness
)
{
  if (diffuseTransmission <= 0.0) {
    return vec3(0.0);
  }

#ifdef USE_SCENE_ENVIRONMENT
  float rotationSine = sin(pbrScene.environmentRotation);
  float rotationCosine = cos(pbrScene.environmentRotation);
  mat2 environmentRotation = mat2(rotationCosine, rotationSine, -rotationSine, rotationCosine);
  vec3 oppositeNormal = vec3(environmentRotation * -pbrInfo.n.xz, -pbrInfo.n.y).xzy;
  vec3 environmentColor = texture(pbr_diffuseEnvSampler, oppositeNormal).rgb *
    max(pbrScene.environmentIntensity, 0.0);
#else
  vec3 environmentColor = SRGBtoLINEAR(texture(pbr_diffuseEnvSampler, -pbrInfo.n)).rgb;
#endif
  vec3 nonReflectedEnergy = vec3(1.0) - clamp(pbrInfo.reflectance0, vec3(0.0), vec3(1.0));
  return environmentColor * diffuseTransmissionColor * nonReflectedEnergy *
    getDiffuseTransmissionAttenuation(pbrInfo, multiscatterColor, thickness) *
    diffuseTransmission * pbrMaterial.scaleIBLAmbient.x;
}
#endif

#ifdef USE_TRANSMISSION_FRAMEBUFFER
vec3 sampleTransmittedSceneColor(
  vec3 position,
  vec3 normal,
  vec3 viewDirection,
  float thickness,
  float perceptualRoughness,
  float indexOfRefraction
)
{
  vec3 refractionDirection = refract(
    -viewDirection,
    normal,
    1.0 / max(indexOfRefraction, 1.0)
  );
  vec3 refractedPosition = position + refractionDirection * thickness;
  vec4 clipPosition = pbrScene.projectionMatrix *
    pbrScene.viewMatrix * vec4(refractedPosition, 1.0);
  vec2 textureCoordinate = clipPosition.xy / max(clipPosition.w, 0.0001) * 0.5 + 0.5;
  textureCoordinate = clamp(textureCoordinate, vec2(0.001), vec2(0.999));

  vec2 blurRadius = perceptualRoughness * perceptualRoughness * 8.0 /
    max(pbrScene.framebufferSize, vec2(1.0));
  vec3 sceneColor = texture(pbr_transmissionFramebufferSampler, textureCoordinate).rgb * 0.4;
  sceneColor += texture(
    pbr_transmissionFramebufferSampler,
    textureCoordinate + vec2(blurRadius.x, 0.0)
  ).rgb * 0.15;
  sceneColor += texture(
    pbr_transmissionFramebufferSampler,
    textureCoordinate - vec2(blurRadius.x, 0.0)
  ).rgb * 0.15;
  sceneColor += texture(
    pbr_transmissionFramebufferSampler,
    textureCoordinate + vec2(0.0, blurRadius.y)
  ).rgb * 0.15;
  sceneColor += texture(
    pbr_transmissionFramebufferSampler,
    textureCoordinate - vec2(0.0, blurRadius.y)
  ).rgb * 0.15;
  return max(sceneColor, vec3(0.0));
}

vec3 getTransmittedSceneColor(
  vec3 position,
  vec3 normal,
  vec3 viewDirection,
  float thickness,
  float perceptualRoughness
)
{
  if (pbrMaterial.dispersion <= 0.0) {
    return sampleTransmittedSceneColor(
      position,
      normal,
      viewDirection,
      thickness,
      perceptualRoughness,
      pbrMaterial.ior
    );
  }

  float halfSpread = (max(pbrMaterial.ior, 1.0) - 1.0) * 0.025 * pbrMaterial.dispersion;
  vec3 indicesOfRefraction = max(
    vec3(pbrMaterial.ior - halfSpread, pbrMaterial.ior, pbrMaterial.ior + halfSpread),
    vec3(1.0)
  );
  return vec3(
    sampleTransmittedSceneColor(
      position, normal, viewDirection, thickness, perceptualRoughness, indicesOfRefraction.r
    ).r,
    sampleTransmittedSceneColor(
      position, normal, viewDirection, thickness, perceptualRoughness, indicesOfRefraction.g
    ).g,
    sampleTransmittedSceneColor(
      position, normal, viewDirection, thickness, perceptualRoughness, indicesOfRefraction.b
    ).b
  );
}
#endif

PBRInfo createClearcoatPBRInfo(PBRInfo basePBRInfo, vec3 clearcoatNormal, float clearcoatRoughness)
{
  float perceptualRoughness = clamp(clearcoatRoughness, c_MinRoughness, 1.0);
  float alphaRoughness = perceptualRoughness * perceptualRoughness;
  float NdotV = clamp(abs(dot(clearcoatNormal, basePBRInfo.v)), 0.001, 1.0);

  return PBRInfo(
    basePBRInfo.NdotL,
    NdotV,
    basePBRInfo.NdotH,
    basePBRInfo.LdotH,
    basePBRInfo.VdotH,
    perceptualRoughness,
    0.0,
    vec3(0.04),
    vec3(1.0),
    alphaRoughness,
    vec3(0.0),
    vec3(0.04),
    clearcoatNormal,
    basePBRInfo.v,
    basePBRInfo.l,
    basePBRInfo.h
  );
}

vec3 calculateClearcoatContribution(
  PBRInfo pbrInfo,
  vec3 lightColor,
  vec3 clearcoatNormal,
  float clearcoatFactor,
  float clearcoatRoughness
) {
  if (clearcoatFactor <= 0.0) {
    return vec3(0.0);
  }

  PBRInfo clearcoatPBRInfo = createClearcoatPBRInfo(pbrInfo, clearcoatNormal, clearcoatRoughness);
  return calculateFinalColor(clearcoatPBRInfo, lightColor) * clearcoatFactor;
}

#ifdef USE_IBL
vec3 calculateClearcoatIBLContribution(
  PBRInfo pbrInfo,
  vec3 clearcoatNormal,
  vec3 reflection,
  float clearcoatFactor,
  float clearcoatRoughness
) {
  if (clearcoatFactor <= 0.0) {
    return vec3(0.0);
  }

  PBRInfo clearcoatPBRInfo = createClearcoatPBRInfo(pbrInfo, clearcoatNormal, clearcoatRoughness);
  return getIBLContribution(clearcoatPBRInfo, clearcoatNormal, reflection) * clearcoatFactor;
}
#endif

vec3 calculateSheenContribution(
  PBRInfo pbrInfo,
  vec3 lightColor,
  vec3 sheenColor,
  float sheenRoughness
) {
  if (maxComponent(sheenColor) <= 0.0) {
    return vec3(0.0);
  }

  float alpha = max(sheenRoughness * sheenRoughness, 0.0001);
  float inverseAlpha = 1.0 / alpha;
  float sineSquared = max(1.0 - pbrInfo.NdotH * pbrInfo.NdotH, 0.0);
  float distribution = (2.0 + inverseAlpha) * pow(sineSquared, inverseAlpha * 0.5) /
    (2.0 * M_PI);
  float visibility = 1.0 / max(
    4.0 * (pbrInfo.NdotL + pbrInfo.NdotV - pbrInfo.NdotL * pbrInfo.NdotV),
    0.0001
  );
  return pbrInfo.NdotL * lightColor * sheenColor * distribution * visibility *
    (1.0 - pbrInfo.metalness);
}

vec3 calculateAnisotropicLightColor(
  PBRInfo pbrInfo,
  vec3 lightColor,
  vec3 anisotropyTangent,
  float anisotropyStrength
) {
  if (anisotropyStrength <= 0.0) {
    return calculateFinalColor(pbrInfo, lightColor);
  }

  vec3 anisotropyBitangent = normalize(cross(pbrInfo.n, anisotropyTangent));
  float tangentRoughness = mix(
    pbrInfo.alphaRoughness,
    1.0,
    anisotropyStrength * anisotropyStrength
  );
  float bitangentRoughness = clamp(pbrInfo.alphaRoughness, 0.001, 1.0);
  float roughnessProduct = tangentRoughness * bitangentRoughness;
  vec3 distributionVector = vec3(
    bitangentRoughness * dot(anisotropyTangent, pbrInfo.h),
    tangentRoughness * dot(anisotropyBitangent, pbrInfo.h),
    roughnessProduct * pbrInfo.NdotH
  );
  float distributionFactor = roughnessProduct /
    max(dot(distributionVector, distributionVector), 0.000001);
  float distribution = roughnessProduct * distributionFactor * distributionFactor / M_PI;
  float viewMask = pbrInfo.NdotL * length(vec3(
    tangentRoughness * dot(anisotropyTangent, pbrInfo.v),
    bitangentRoughness * dot(anisotropyBitangent, pbrInfo.v),
    pbrInfo.NdotV
  ));
  float lightMask = pbrInfo.NdotV * length(vec3(
    tangentRoughness * dot(anisotropyTangent, pbrInfo.l),
    bitangentRoughness * dot(anisotropyBitangent, pbrInfo.l),
    pbrInfo.NdotL
  ));
  float visibility = clamp(0.5 / max(viewMask + lightMask, 0.000001), 0.0, 1.0);
  vec3 fresnel = specularReflection(pbrInfo);
  vec3 diffuseContribution = (vec3(1.0) - fresnel) * diffuse(pbrInfo);
  return pbrInfo.NdotL * lightColor *
    (diffuseContribution + fresnel * distribution * visibility);
}

vec3 getAnisotropicReflection(PBRInfo pbrInfo, vec3 anisotropyTangent, float anisotropyStrength)
{
  if (anisotropyStrength <= 0.0) {
    return -normalize(reflect(pbrInfo.v, pbrInfo.n));
  }
  vec3 anisotropyBitangent = normalize(cross(pbrInfo.n, anisotropyTangent));
  vec3 anisotropicNormal = normalize(cross(anisotropyBitangent, pbrInfo.v));
  anisotropicNormal = normalize(cross(anisotropicNormal, anisotropyBitangent));
  float bend = anisotropyStrength * (1.0 - pbrInfo.perceptualRoughness);
  return -normalize(reflect(pbrInfo.v, normalize(mix(pbrInfo.n, anisotropicNormal, bend))));
}

vec3 calculateMaterialLightColor(
  PBRInfo pbrInfo,
  vec3 lightColor,
  vec3 clearcoatNormal,
  float clearcoatFactor,
  float clearcoatRoughness,
  vec3 sheenColor,
  float sheenRoughness,
  vec3 anisotropyTangent,
  float anisotropyStrength
) {
  vec3 color = calculateAnisotropicLightColor(
    pbrInfo,
    lightColor,
    anisotropyTangent,
    anisotropyStrength
  );
  color += calculateClearcoatContribution(
    pbrInfo,
    lightColor,
    clearcoatNormal,
    clearcoatFactor,
    clearcoatRoughness
  );
  color += calculateSheenContribution(pbrInfo, lightColor, sheenColor, sheenRoughness);
  return color;
}

void PBRInfo_setAmbientLight(inout PBRInfo pbrInfo) {
  pbrInfo.NdotL = 1.0;
  pbrInfo.NdotH = 0.0;
  pbrInfo.LdotH = 0.0;
  pbrInfo.VdotH = 1.0;
  pbrInfo.l = pbrInfo.n;
  pbrInfo.h = pbrInfo.n;
}

void PBRInfo_setDirectionalLight(inout PBRInfo pbrInfo, vec3 lightDirection) {
  vec3 n = pbrInfo.n;
  vec3 v = pbrInfo.v;
  vec3 l = normalize(lightDirection);             // Vector from surface point to light
  vec3 h = normalize(l+v);                        // Half vector between both l and v

  pbrInfo.NdotL = clamp(dot(n, l), 0.001, 1.0);
  pbrInfo.NdotH = clamp(dot(n, h), 0.0, 1.0);
  pbrInfo.LdotH = clamp(dot(l, h), 0.0, 1.0);
  pbrInfo.VdotH = clamp(dot(v, h), 0.0, 1.0);
  pbrInfo.l = l;
  pbrInfo.h = h;
}

void PBRInfo_setPointLight(inout PBRInfo pbrInfo, PointLight pointLight) {
  vec3 light_direction = normalize(pointLight.position - pbr_vPosition);
  PBRInfo_setDirectionalLight(pbrInfo, light_direction);
}

void PBRInfo_setSpotLight(inout PBRInfo pbrInfo, SpotLight spotLight) {
  vec3 light_direction = normalize(spotLight.position - pbr_vPosition);
  PBRInfo_setDirectionalLight(pbrInfo, light_direction);
}

vec3 calculateFinalColor(PBRInfo pbrInfo, vec3 lightColor) {
  // Calculate the shading terms for the microfacet specular shading model
  vec3 F = specularReflection(pbrInfo);
  float G = geometricOcclusion(pbrInfo);
  float D = microfacetDistribution(pbrInfo);

  // Calculation of analytical lighting contribution
  vec3 diffuseContrib = (1.0 - F) * diffuse(pbrInfo);
  vec3 specContrib = F * G * D / (4.0 * pbrInfo.NdotL * pbrInfo.NdotV);
  // Obtain final intensity as reflectance (BRDF) scaled by the energy of the light (cosine law)
  return pbrInfo.NdotL * lightColor * (diffuseContrib + specContrib);
}

vec4 pbr_filterColor(vec4 vertexColor)
{
  vec2 baseColorUV = getMaterialUV(pbrMaterial.baseColorUVSet, pbrMaterial.baseColorUVTransform);
  vec2 metallicRoughnessUV = getMaterialUV(
    pbrMaterial.metallicRoughnessUVSet,
    pbrMaterial.metallicRoughnessUVTransform
  );
  vec2 normalUV = getMaterialUV(pbrMaterial.normalUVSet, pbrMaterial.normalUVTransform);
  vec2 occlusionUV = getMaterialUV(pbrMaterial.occlusionUVSet, pbrMaterial.occlusionUVTransform);
  vec2 emissiveUV = getMaterialUV(pbrMaterial.emissiveUVSet, pbrMaterial.emissiveUVTransform);
  vec2 specularColorUV = getMaterialUV(
    pbrMaterial.specularColorUVSet,
    pbrMaterial.specularColorUVTransform
  );
  vec2 specularIntensityUV = getMaterialUV(
    pbrMaterial.specularIntensityUVSet,
    pbrMaterial.specularIntensityUVTransform
  );
  vec2 transmissionUV = getMaterialUV(
    pbrMaterial.transmissionUVSet,
    pbrMaterial.transmissionUVTransform
  );
  vec2 thicknessUV = getMaterialUV(pbrMaterial.thicknessUVSet, pbrMaterial.thicknessUVTransform);
  vec2 clearcoatUV = getMaterialUV(pbrMaterial.clearcoatUVSet, pbrMaterial.clearcoatUVTransform);
  vec2 clearcoatRoughnessUV = getMaterialUV(
    pbrMaterial.clearcoatRoughnessUVSet,
    pbrMaterial.clearcoatRoughnessUVTransform
  );
  vec2 clearcoatNormalUV = getMaterialUV(
    pbrMaterial.clearcoatNormalUVSet,
    pbrMaterial.clearcoatNormalUVTransform
  );
  vec2 sheenColorUV = getMaterialUV(
    pbrMaterial.sheenColorUVSet,
    pbrMaterial.sheenColorUVTransform
  );
  vec2 sheenRoughnessUV = getMaterialUV(
    pbrMaterial.sheenRoughnessUVSet,
    pbrMaterial.sheenRoughnessUVTransform
  );
  vec2 iridescenceUV = getMaterialUV(
    pbrMaterial.iridescenceUVSet,
    pbrMaterial.iridescenceUVTransform
  );
  vec2 iridescenceThicknessUV = getMaterialUV(
    pbrMaterial.iridescenceThicknessUVSet,
    pbrMaterial.iridescenceThicknessUVTransform
  );
  vec2 anisotropyUV = getMaterialUV(
    pbrMaterial.anisotropyUVSet,
    pbrMaterial.anisotropyUVTransform
  );
  vec2 diffuseTransmissionUV = getMaterialUV(
    pbrMaterial.diffuseTransmissionUVSet,
    pbrMaterial.diffuseTransmissionUVTransform
  );
  vec2 diffuseTransmissionColorUV = getMaterialUV(
    pbrMaterial.diffuseTransmissionColorUVSet,
    pbrMaterial.diffuseTransmissionColorUVTransform
  );
  vec2 multiscatterColorUV = getMaterialUV(
    pbrMaterial.multiscatterColorUVSet,
    pbrMaterial.multiscatterColorUVTransform
  );

  // The albedo may be defined from a base texture or a flat color
#ifdef HAS_BASECOLORMAP
  vec4 baseColor =
    SRGBtoLINEAR(texture(pbr_baseColorSampler, baseColorUV)) *
    pbrMaterial.baseColorFactor * vertexColor;
#else
  vec4 baseColor = pbrMaterial.baseColorFactor * vertexColor;
#endif

#ifdef ALPHA_CUTOFF
  if (baseColor.a < pbrMaterial.alphaCutoff) {
    discard;
  }
#endif

  vec3 color = vec3(0, 0, 0);

  float transmission = 0.0;

  if(pbrMaterial.unlit){
    color.rgb = baseColor.rgb;
  }
  else{
    // Metallic and Roughness material properties are packed together
    // In glTF, these factors can be specified by fixed scalar values
    // or from a metallic-roughness map
    float perceptualRoughness = pbrMaterial.metallicRoughnessValues.y;
    float metallic = pbrMaterial.metallicRoughnessValues.x;
#ifdef HAS_METALROUGHNESSMAP
    // Roughness is stored in the 'g' channel, metallic is stored in the 'b' channel.
    // This layout intentionally reserves the 'r' channel for (optional) occlusion map data
    vec4 mrSample = texture(pbr_metallicRoughnessSampler, metallicRoughnessUV);
    perceptualRoughness = mrSample.g * perceptualRoughness;
    metallic = mrSample.b * metallic;
#endif
    perceptualRoughness = clamp(perceptualRoughness, c_MinRoughness, 1.0);
    metallic = clamp(metallic, 0.0, 1.0);
    mat3 tbn = getTBN(normalUV);
    vec3 n = getNormal(tbn, normalUV);                          // normal at surface point
    perceptualRoughness = widenSpecularRoughness(perceptualRoughness, n);
    vec3 v = normalize(pbrProjection.camera - pbr_vPosition);  // Vector from surface point to camera
    float NdotV = clamp(abs(dot(n, v)), 0.001, 1.0);
#ifdef USE_MATERIAL_EXTENSIONS
    bool useExtendedPBR =
      pbrMaterial.specularColorMapEnabled ||
      pbrMaterial.specularIntensityMapEnabled ||
      abs(pbrMaterial.specularIntensityFactor - 1.0) > 0.0001 ||
      maxComponent(abs(pbrMaterial.specularColorFactor - vec3(1.0))) > 0.0001 ||
      abs(pbrMaterial.ior - 1.5) > 0.0001 ||
      pbrMaterial.dispersion > 0.0001 ||
      pbrMaterial.transmissionMapEnabled ||
      pbrMaterial.transmissionFactor > 0.0001 ||
      pbrMaterial.diffuseTransmissionMapEnabled ||
      pbrMaterial.diffuseTransmissionColorMapEnabled ||
      pbrMaterial.diffuseTransmissionFactor > 0.0001 ||
      pbrMaterial.multiscatterColorMapEnabled ||
      maxComponent(pbrMaterial.multiscatterColorFactor) > 0.0001 ||
      pbrMaterial.clearcoatMapEnabled ||
      pbrMaterial.clearcoatRoughnessMapEnabled ||
      pbrMaterial.clearcoatFactor > 0.0001 ||
      pbrMaterial.clearcoatRoughnessFactor > 0.0001 ||
      pbrMaterial.sheenColorMapEnabled ||
      pbrMaterial.sheenRoughnessMapEnabled ||
      maxComponent(pbrMaterial.sheenColorFactor) > 0.0001 ||
      pbrMaterial.sheenRoughnessFactor > 0.0001 ||
      pbrMaterial.iridescenceMapEnabled ||
      pbrMaterial.iridescenceFactor > 0.0001 ||
      abs(pbrMaterial.iridescenceIor - 1.3) > 0.0001 ||
      abs(pbrMaterial.iridescenceThicknessRange.x - 100.0) > 0.0001 ||
      abs(pbrMaterial.iridescenceThicknessRange.y - 400.0) > 0.0001 ||
      pbrMaterial.anisotropyMapEnabled ||
      pbrMaterial.anisotropyStrength > 0.0001 ||
      abs(pbrMaterial.anisotropyRotation) > 0.0001 ||
      length(pbrMaterial.anisotropyDirection - vec2(1.0, 0.0)) > 0.0001;
#else
    bool useExtendedPBR = false;
#endif

    if (!useExtendedPBR) {
      // Keep the baseline metallic-roughness implementation byte-for-byte equivalent in behavior.
      float alphaRoughness = perceptualRoughness * perceptualRoughness;

      vec3 f0 = vec3(0.04);
      vec3 diffuseColor = baseColor.rgb * (vec3(1.0) - f0);
      diffuseColor *= 1.0 - metallic;
      vec3 specularColor = mix(f0, baseColor.rgb, metallic);

      float reflectance = max(max(specularColor.r, specularColor.g), specularColor.b);
      float reflectance90 = clamp(reflectance * 25.0, 0.0, 1.0);
      vec3 specularEnvironmentR0 = specularColor.rgb;
      vec3 specularEnvironmentR90 = vec3(1.0, 1.0, 1.0) * reflectance90;
      vec3 reflection = -normalize(reflect(v, n));

      PBRInfo pbrInfo = PBRInfo(
        0.0, // NdotL
        NdotV,
        0.0, // NdotH
        0.0, // LdotH
        0.0, // VdotH
        perceptualRoughness,
        metallic,
        specularEnvironmentR0,
        specularEnvironmentR90,
        alphaRoughness,
        diffuseColor,
        specularColor,
        n,
        v,
        n,
        n
      );

#ifdef USE_LIGHTS
      PBRInfo_setAmbientLight(pbrInfo);
      color += calculateFinalColor(pbrInfo, lighting.ambientColor);

      for(int i = 0; i < lighting.directionalLightCount; i++) {
        if (i < lighting.directionalLightCount) {
          PBRInfo_setDirectionalLight(pbrInfo, lighting_getDirectionalLight(i).direction);
          color += calculateFinalColor(pbrInfo, lighting_getDirectionalLight(i).color);
        }
      }

      for(int i = 0; i < lighting.pointLightCount; i++) {
        if (i < lighting.pointLightCount) {
          PBRInfo_setPointLight(pbrInfo, lighting_getPointLight(i));
          float attenuation = getPointLightAttenuation(lighting_getPointLight(i), distance(lighting_getPointLight(i).position, pbr_vPosition));
          color += calculateFinalColor(pbrInfo, lighting_getPointLight(i).color / attenuation);
        }
      }

      for(int i = 0; i < lighting.spotLightCount; i++) {
        if (i < lighting.spotLightCount) {
          PBRInfo_setSpotLight(pbrInfo, lighting_getSpotLight(i));
          float attenuation = getSpotLightAttenuation(lighting_getSpotLight(i), pbr_vPosition);
          color += calculateFinalColor(pbrInfo, lighting_getSpotLight(i).color / attenuation);
        }
      }
#endif

#ifdef USE_IBL
      if (pbrMaterial.IBLenabled) {
        color += getIBLContribution(pbrInfo, n, reflection);
      }
#endif

#ifdef HAS_OCCLUSIONMAP
      if (pbrMaterial.occlusionMapEnabled) {
        float ao = texture(pbr_occlusionSampler, occlusionUV).r;
        color = mix(color, color * ao, pbrMaterial.occlusionStrength);
      }
#endif

      vec3 emissive = pbrMaterial.emissiveFactor;
#ifdef HAS_EMISSIVEMAP
      if (pbrMaterial.emissiveMapEnabled) {
        emissive *= SRGBtoLINEAR(texture(pbr_emissiveSampler, emissiveUV)).rgb;
      }
#endif
      color += emissive * pbrMaterial.emissiveStrength;

#ifdef PBR_DEBUG
      color = mix(color, baseColor.rgb, pbrMaterial.scaleDiffBaseMR.y);
      color = mix(color, vec3(metallic), pbrMaterial.scaleDiffBaseMR.z);
      color = mix(color, vec3(perceptualRoughness), pbrMaterial.scaleDiffBaseMR.w);
#endif

      return vec4(applySceneColorManagement(color), baseColor.a);
    }

    float specularIntensity = pbrMaterial.specularIntensityFactor;
#ifdef HAS_SPECULARINTENSITYMAP
    if (pbrMaterial.specularIntensityMapEnabled) {
      specularIntensity *= texture(pbr_specularIntensitySampler, specularIntensityUV).a;
    }
#endif

    vec3 specularFactor = pbrMaterial.specularColorFactor;
#ifdef HAS_SPECULARCOLORMAP
    if (pbrMaterial.specularColorMapEnabled) {
      specularFactor *= SRGBtoLINEAR(texture(pbr_specularColorSampler, specularColorUV)).rgb;
    }
#endif

    transmission = pbrMaterial.transmissionFactor;
#ifdef HAS_TRANSMISSIONMAP
    if (pbrMaterial.transmissionMapEnabled) {
      transmission *= texture(pbr_transmissionSampler, transmissionUV).r;
    }
#endif
    transmission = clamp(transmission * (1.0 - metallic), 0.0, 1.0);
    float thickness = max(pbrMaterial.thicknessFactor, 0.0);
#ifdef HAS_THICKNESSMAP
    thickness *= texture(pbr_thicknessSampler, thicknessUV).g;
#endif

    float diffuseTransmission = clamp(pbrMaterial.diffuseTransmissionFactor, 0.0, 1.0);
#ifdef HAS_DIFFUSETRANSMISSIONMAP
    if (pbrMaterial.diffuseTransmissionMapEnabled) {
      diffuseTransmission *= texture(pbr_diffuseTransmissionSampler, diffuseTransmissionUV).a;
    }
#endif
    diffuseTransmission *= (1.0 - metallic) * (1.0 - transmission);
    vec3 diffuseTransmissionColor = pbrMaterial.diffuseTransmissionColorFactor;
#ifdef HAS_DIFFUSETRANSMISSIONCOLORMAP
    if (pbrMaterial.diffuseTransmissionColorMapEnabled) {
      diffuseTransmissionColor *= SRGBtoLINEAR(
        texture(pbr_diffuseTransmissionColorSampler, diffuseTransmissionColorUV)
      ).rgb;
    }
#endif
    vec3 multiscatterColor = pbrMaterial.multiscatterColorFactor;
#ifdef HAS_MULTISCATTERCOLORMAP
    if (pbrMaterial.multiscatterColorMapEnabled) {
      multiscatterColor *= SRGBtoLINEAR(
        texture(pbr_multiscatterColorSampler, multiscatterColorUV)
      ).rgb;
    }
#endif

    float clearcoatFactor = pbrMaterial.clearcoatFactor;
    float clearcoatRoughness = pbrMaterial.clearcoatRoughnessFactor;
#ifdef HAS_CLEARCOATMAP
    if (pbrMaterial.clearcoatMapEnabled) {
      clearcoatFactor *= texture(pbr_clearcoatSampler, clearcoatUV).r;
    }
#endif
#ifdef HAS_CLEARCOATROUGHNESSMAP
    if (pbrMaterial.clearcoatRoughnessMapEnabled) {
      clearcoatRoughness *= texture(pbr_clearcoatRoughnessSampler, clearcoatRoughnessUV).g;
    }
#endif
    clearcoatFactor = clamp(clearcoatFactor, 0.0, 1.0);
    clearcoatRoughness = clamp(clearcoatRoughness, c_MinRoughness, 1.0);
    vec3 clearcoatNormal = getClearcoatNormal(getTBN(clearcoatNormalUV), n, clearcoatNormalUV);
    clearcoatRoughness = widenSpecularRoughness(clearcoatRoughness, clearcoatNormal);

    vec3 sheenColor = pbrMaterial.sheenColorFactor;
    float sheenRoughness = pbrMaterial.sheenRoughnessFactor;
#ifdef HAS_SHEENCOLORMAP
    if (pbrMaterial.sheenColorMapEnabled) {
      sheenColor *= SRGBtoLINEAR(texture(pbr_sheenColorSampler, sheenColorUV)).rgb;
    }
#endif
#ifdef HAS_SHEENROUGHNESSMAP
    if (pbrMaterial.sheenRoughnessMapEnabled) {
      sheenRoughness *= texture(pbr_sheenRoughnessSampler, sheenRoughnessUV).a;
    }
#endif
    sheenRoughness = clamp(sheenRoughness, c_MinRoughness, 1.0);

    float iridescence = pbrMaterial.iridescenceFactor;
#ifdef HAS_IRIDESCENCEMAP
    if (pbrMaterial.iridescenceMapEnabled) {
      iridescence *= texture(pbr_iridescenceSampler, iridescenceUV).r;
    }
#endif
    iridescence = clamp(iridescence, 0.0, 1.0);
    float iridescenceThickness = mix(
      pbrMaterial.iridescenceThicknessRange.x,
      pbrMaterial.iridescenceThicknessRange.y,
      0.5
    );
#ifdef HAS_IRIDESCENCETHICKNESSMAP
    iridescenceThickness = mix(
      pbrMaterial.iridescenceThicknessRange.x,
      pbrMaterial.iridescenceThicknessRange.y,
      texture(pbr_iridescenceThicknessSampler, iridescenceThicknessUV).g
    );
#endif

    float anisotropyStrength = clamp(pbrMaterial.anisotropyStrength, 0.0, 1.0);
    vec2 anisotropyDirection = normalizeDirection(pbrMaterial.anisotropyDirection);
#ifdef HAS_ANISOTROPYMAP
    if (pbrMaterial.anisotropyMapEnabled) {
      vec3 anisotropySample = texture(pbr_anisotropySampler, anisotropyUV).rgb;
      anisotropyStrength *= anisotropySample.b;
      vec2 mappedDirection = anisotropySample.rg * 2.0 - 1.0;
      if (length(mappedDirection) > 0.0001) {
        anisotropyDirection = normalize(mappedDirection);
      }
    }
#endif
    anisotropyDirection = rotateDirection(anisotropyDirection, pbrMaterial.anisotropyRotation);
    vec3 anisotropyTangent = normalize(tbn[0] * anisotropyDirection.x + tbn[1] * anisotropyDirection.y);
    if (length(anisotropyTangent) < 0.0001) {
      anisotropyTangent = normalize(tbn[0]);
    }
    // Roughness is authored as perceptual roughness; as is convention,
    // convert to material roughness by squaring the perceptual roughness [2].
    float alphaRoughness = perceptualRoughness * perceptualRoughness;

    float dielectricF0 = getDielectricF0(pbrMaterial.ior);
    vec3 dielectricSpecularF0 = min(
      vec3(dielectricF0) * specularFactor * specularIntensity,
      vec3(1.0)
    );
    dielectricSpecularF0 = getIridescenceTint(
      iridescence,
      iridescenceThickness,
      NdotV,
      dielectricSpecularF0
    );
    vec3 diffuseColor = baseColor.rgb * (vec3(1.0) - dielectricSpecularF0);
    diffuseColor *= (1.0 - metallic) * (1.0 - transmission) * (1.0 - diffuseTransmission);
    vec3 specularColor = mix(dielectricSpecularF0, baseColor.rgb, metallic);

    float clearcoatViewFresnel = dielectricSchlick(
      0.04,
      clamp(abs(dot(clearcoatNormal, v)), 0.0, 1.0)
    );
    float sheenDirectionalAlbedo = maxComponent(sheenColor) *
      (0.157 + 0.343 * (1.0 - NdotV)) * (1.0 - sheenRoughness * 0.5);
    float baseLayerEnergy = (1.0 - clearcoatFactor * clearcoatViewFresnel) *
      (1.0 - clamp(sheenDirectionalAlbedo, 0.0, 1.0));
    diffuseColor *= baseLayerEnergy;
    specularColor *= baseLayerEnergy;

    // Compute reflectance.
    float reflectance = max(max(specularColor.r, specularColor.g), specularColor.b);

    // For typical incident reflectance range (between 4% to 100%) set the grazing
    // reflectance to 100% for typical fresnel effect.
    // For very low reflectance range on highly diffuse objects (below 4%),
    // incrementally reduce grazing reflecance to 0%.
    float reflectance90 = clamp(reflectance * 25.0, 0.0, 1.0);
    vec3 specularEnvironmentR0 = specularColor.rgb;
    vec3 specularEnvironmentR90 = vec3(1.0, 1.0, 1.0) * reflectance90;
    vec3 reflection = -normalize(reflect(v, n));

    PBRInfo pbrInfo = PBRInfo(
      0.0, // NdotL
      NdotV,
      0.0, // NdotH
      0.0, // LdotH
      0.0, // VdotH
      perceptualRoughness,
      metallic,
      specularEnvironmentR0,
      specularEnvironmentR90,
      alphaRoughness,
      diffuseColor,
      specularColor,
      n,
      v,
      n,
      n
    );


#ifdef USE_LIGHTS
    // Apply ambient light
    PBRInfo_setAmbientLight(pbrInfo);
    color += calculateMaterialLightColor(
      pbrInfo,
      lighting.ambientColor,
      clearcoatNormal,
      clearcoatFactor,
      clearcoatRoughness,
      sheenColor,
      sheenRoughness,
      anisotropyTangent,
      anisotropyStrength
    );

    // Apply directional light
    for(int i = 0; i < lighting.directionalLightCount; i++) {
      if (i < lighting.directionalLightCount) {
        PBRInfo_setDirectionalLight(pbrInfo, lighting_getDirectionalLight(i).direction);
        color += calculateMaterialLightColor(
          pbrInfo,
          lighting_getDirectionalLight(i).color,
          clearcoatNormal,
          clearcoatFactor,
          clearcoatRoughness,
          sheenColor,
          sheenRoughness,
          anisotropyTangent,
          anisotropyStrength
        );
        color += calculateDiffuseTransmissionLight(
          pbrInfo,
          lighting_getDirectionalLight(i).color,
          diffuseTransmissionColor,
          diffuseTransmission,
          multiscatterColor,
          thickness
        );
      }
    }

    // Apply point light
    for(int i = 0; i < lighting.pointLightCount; i++) {
      if (i < lighting.pointLightCount) {
        PBRInfo_setPointLight(pbrInfo, lighting_getPointLight(i));
        float attenuation = getPointLightAttenuation(lighting_getPointLight(i), distance(lighting_getPointLight(i).position, pbr_vPosition));
        color += calculateMaterialLightColor(
          pbrInfo,
          lighting_getPointLight(i).color / attenuation,
          clearcoatNormal,
          clearcoatFactor,
          clearcoatRoughness,
          sheenColor,
          sheenRoughness,
          anisotropyTangent,
          anisotropyStrength
        );
        color += calculateDiffuseTransmissionLight(
          pbrInfo,
          lighting_getPointLight(i).color / attenuation,
          diffuseTransmissionColor,
          diffuseTransmission,
          multiscatterColor,
          thickness
        );
      }
    }

    for(int i = 0; i < lighting.spotLightCount; i++) {
      if (i < lighting.spotLightCount) {
        PBRInfo_setSpotLight(pbrInfo, lighting_getSpotLight(i));
        float attenuation = getSpotLightAttenuation(lighting_getSpotLight(i), pbr_vPosition);
        color += calculateMaterialLightColor(
          pbrInfo,
          lighting_getSpotLight(i).color / attenuation,
          clearcoatNormal,
          clearcoatFactor,
          clearcoatRoughness,
          sheenColor,
          sheenRoughness,
          anisotropyTangent,
          anisotropyStrength
        );
        color += calculateDiffuseTransmissionLight(
          pbrInfo,
          lighting_getSpotLight(i).color / attenuation,
          diffuseTransmissionColor,
          diffuseTransmission,
          multiscatterColor,
          thickness
        );
      }
    }
#endif

    // Calculate lighting contribution from image based lighting source (IBL)
#ifdef USE_IBL
    if (pbrMaterial.IBLenabled) {
      color += getIBLContribution(
        pbrInfo,
        n,
        getAnisotropicReflection(pbrInfo, anisotropyTangent, anisotropyStrength)
      );
      color += calculateClearcoatIBLContribution(
        pbrInfo,
        clearcoatNormal,
        -normalize(reflect(v, clearcoatNormal)),
        clearcoatFactor,
        clearcoatRoughness
      );
      color += calculateDiffuseTransmissionIBL(
        pbrInfo,
        diffuseTransmissionColor,
        diffuseTransmission,
        multiscatterColor,
        thickness
      );
      color += sheenColor * pbrMaterial.scaleIBLAmbient.x * (1.0 - sheenRoughness) * 0.25;
    }
#endif

 // Apply optional PBR terms for additional (optional) shading
#ifdef HAS_OCCLUSIONMAP
    if (pbrMaterial.occlusionMapEnabled) {
      float ao = texture(pbr_occlusionSampler, occlusionUV).r;
      color = mix(color, color * ao, pbrMaterial.occlusionStrength);
    }
#endif

    vec3 emissive = pbrMaterial.emissiveFactor;
#ifdef HAS_EMISSIVEMAP
    if (pbrMaterial.emissiveMapEnabled) {
      emissive *= SRGBtoLINEAR(texture(pbr_emissiveSampler, emissiveUV)).rgb;
    }
#endif
    color += emissive * pbrMaterial.emissiveStrength;

    if (transmission > 0.0) {
#ifdef USE_TRANSMISSION_FRAMEBUFFER
      float dielectricFresnel = getDielectricF0(pbrMaterial.ior);
      float transmissionFresnel = dielectricFresnel +
        (1.0 - dielectricFresnel) * pow(1.0 - NdotV, 5.0);
      vec3 transmittedColor = getTransmittedSceneColor(
        pbr_vPosition,
        n,
        v,
        thickness,
        perceptualRoughness
      );
      color += transmittedColor * getVolumeAttenuation(thickness) *
        transmission * (1.0 - transmissionFresnel);
#else
      color = mix(color, color * getVolumeAttenuation(thickness), transmission);
#endif
    }

    // This section uses mix to override final color for reference app visualization
    // of various parameters in the lighting equation.
#ifdef PBR_DEBUG
    // TODO: Figure out how to debug multiple lights

    // color = mix(color, F, pbr_scaleFGDSpec.x);
    // color = mix(color, vec3(G), pbr_scaleFGDSpec.y);
    // color = mix(color, vec3(D), pbr_scaleFGDSpec.z);
    // color = mix(color, specContrib, pbr_scaleFGDSpec.w);

    // color = mix(color, diffuseContrib, pbr_scaleDiffBaseMR.x);
    color = mix(color, baseColor.rgb, pbrMaterial.scaleDiffBaseMR.y);
    color = mix(color, vec3(metallic), pbrMaterial.scaleDiffBaseMR.z);
    color = mix(color, vec3(perceptualRoughness), pbrMaterial.scaleDiffBaseMR.w);
#endif

  }

#ifdef USE_TRANSMISSION_FRAMEBUFFER
  float alpha = clamp(baseColor.a, 0.0, 1.0);
#else
  float alpha = clamp(baseColor.a * (1.0 - transmission), 0.0, 1.0);
#endif
  return vec4(applySceneColorManagement(color), alpha);
}
`,Ko=`struct PBRFragmentInputs {
  pbr_vPosition: vec3f,
  pbr_vUV0: vec2f,
  pbr_vUV1: vec2f,
  pbr_vTBN: mat3x3f,
  pbr_vNormal: vec3f
};

var<private> fragmentInputs: PBRFragmentInputs;

fn pbr_setPositionNormalTangentUV(
  position: vec4f,
  normal: vec4f,
  tangent: vec4f,
  uv0: vec2f,
  uv1: vec2f
)
{
  var pos: vec4f = pbrProjection.modelMatrix * position;
  fragmentInputs.pbr_vPosition = pos.xyz / pos.w;
  fragmentInputs.pbr_vNormal = vec3f(0.0, 0.0, 1.0);
  fragmentInputs.pbr_vTBN = mat3x3f(
    vec3f(1.0, 0.0, 0.0),
    vec3f(0.0, 1.0, 0.0),
    vec3f(0.0, 0.0, 1.0)
  );
  fragmentInputs.pbr_vUV0 = vec2f(0.0, 0.0);
  fragmentInputs.pbr_vUV1 = uv1;

#ifdef HAS_NORMALS
  let normalW: vec3f = normalize((pbrProjection.normalMatrix * vec4f(normal.xyz, 0.0)).xyz);
  fragmentInputs.pbr_vNormal = normalW;
#ifdef HAS_TANGENTS
  let tangentW: vec3f = normalize((pbrProjection.modelMatrix * vec4f(tangent.xyz, 0.0)).xyz);
  let bitangentW: vec3f = cross(normalW, tangentW) * tangent.w;
  fragmentInputs.pbr_vTBN = mat3x3f(tangentW, bitangentW, normalW);
#endif
#endif

#ifdef HAS_UV
  fragmentInputs.pbr_vUV0 = uv0;
#endif
}

struct pbrMaterialUniforms {
  // Material is unlit
  unlit: u32,

  // Base color map
  baseColorMapEnabled: u32,
  baseColorFactor: vec4f,

  normalMapEnabled : u32,
  normalScale: f32,  // #ifdef HAS_NORMALMAP

  emissiveMapEnabled: u32,
  emissiveFactor: vec3f, // #ifdef HAS_EMISSIVEMAP

  metallicRoughnessValues: vec2f,
  metallicRoughnessMapEnabled: u32,

  occlusionMapEnabled: i32,
  occlusionStrength: f32, // #ifdef HAS_OCCLUSIONMAP
  
  alphaCutoffEnabled: i32,
  alphaCutoff: f32, // #ifdef ALPHA_CUTOFF

  specularColorFactor: vec3f,
  specularIntensityFactor: f32,
  specularColorMapEnabled: i32,
  specularIntensityMapEnabled: i32,

  ior: f32,

  transmissionFactor: f32,
  transmissionMapEnabled: i32,

  thicknessFactor: f32,
  attenuationDistance: f32,
  attenuationColor: vec3f,

  clearcoatFactor: f32,
  clearcoatRoughnessFactor: f32,
  clearcoatMapEnabled: i32,
  clearcoatRoughnessMapEnabled: i32,

  sheenColorFactor: vec3f,
  sheenRoughnessFactor: f32,
  sheenColorMapEnabled: i32,
  sheenRoughnessMapEnabled: i32,

  iridescenceFactor: f32,
  iridescenceIor: f32,
  iridescenceThicknessRange: vec2f,
  iridescenceMapEnabled: i32,

  anisotropyStrength: f32,
  anisotropyRotation: f32,
  anisotropyDirection: vec2f,
  anisotropyMapEnabled: i32,

  emissiveStrength: f32,
  dispersion: f32,
  
  // IBL
  IBLenabled: i32,
  scaleIBLAmbient: vec2f, // #ifdef USE_IBL
  
  // debugging flags used for shader output of intermediate PBR variables
  // #ifdef PBR_DEBUG
  scaleDiffBaseMR: vec4f,
  scaleFGDSpec: vec4f,
  // #endif

  baseColorUVSet: i32,
  baseColorUVTransform: mat3x3f,
  metallicRoughnessUVSet: i32,
  metallicRoughnessUVTransform: mat3x3f,
  normalUVSet: i32,
  normalUVTransform: mat3x3f,
  occlusionUVSet: i32,
  occlusionUVTransform: mat3x3f,
  emissiveUVSet: i32,
  emissiveUVTransform: mat3x3f,
  specularColorUVSet: i32,
  specularColorUVTransform: mat3x3f,
  specularIntensityUVSet: i32,
  specularIntensityUVTransform: mat3x3f,
  transmissionUVSet: i32,
  transmissionUVTransform: mat3x3f,
  thicknessUVSet: i32,
  thicknessUVTransform: mat3x3f,
  clearcoatUVSet: i32,
  clearcoatUVTransform: mat3x3f,
  clearcoatRoughnessUVSet: i32,
  clearcoatRoughnessUVTransform: mat3x3f,
  clearcoatNormalUVSet: i32,
  clearcoatNormalUVTransform: mat3x3f,
  sheenColorUVSet: i32,
  sheenColorUVTransform: mat3x3f,
  sheenRoughnessUVSet: i32,
  sheenRoughnessUVTransform: mat3x3f,
  iridescenceUVSet: i32,
  iridescenceUVTransform: mat3x3f,
  iridescenceThicknessUVSet: i32,
  iridescenceThicknessUVTransform: mat3x3f,
  anisotropyUVSet: i32,
  anisotropyUVTransform: mat3x3f,

  bumpFactor: f32,
  bumpMapEnabled: i32,
  diffuseTransmissionFactor: f32,
  diffuseTransmissionMapEnabled: i32,
  diffuseTransmissionColorFactor: vec3f,
  diffuseTransmissionColorMapEnabled: i32,
  multiscatterColorFactor: vec3f,
  multiscatterColorMapEnabled: i32,
  scatterAnisotropy: f32,

  bumpUVSet: i32,
  bumpUVTransform: mat3x3f,
  diffuseTransmissionUVSet: i32,
  diffuseTransmissionUVTransform: mat3x3f,
  diffuseTransmissionColorUVSet: i32,
  diffuseTransmissionColorUVTransform: mat3x3f,
  multiscatterColorUVSet: i32,
  multiscatterColorUVTransform: mat3x3f,
}

@group(3) @binding(auto) var<uniform> pbrMaterial : pbrMaterialUniforms;

// Samplers
#ifdef HAS_BASECOLORMAP
@group(3) @binding(auto) var pbr_baseColorSampler: texture_2d<f32>;
@group(3) @binding(auto) var pbr_baseColorSamplerSampler: sampler;
#endif
#ifdef HAS_NORMALMAP
@group(3) @binding(auto) var pbr_normalSampler: texture_2d<f32>;
@group(3) @binding(auto) var pbr_normalSamplerSampler: sampler;
#endif
#ifdef HAS_EMISSIVEMAP
@group(3) @binding(auto) var pbr_emissiveSampler: texture_2d<f32>;
@group(3) @binding(auto) var pbr_emissiveSamplerSampler: sampler;
#endif
#ifdef HAS_METALROUGHNESSMAP
@group(3) @binding(auto) var pbr_metallicRoughnessSampler: texture_2d<f32>;
@group(3) @binding(auto) var pbr_metallicRoughnessSamplerSampler: sampler;
#endif
#ifdef HAS_OCCLUSIONMAP
@group(3) @binding(auto) var pbr_occlusionSampler: texture_2d<f32>;
@group(3) @binding(auto) var pbr_occlusionSamplerSampler: sampler;
#endif
#ifdef HAS_SPECULARCOLORMAP
@group(3) @binding(auto) var pbr_specularColorSampler: texture_2d<f32>;
@group(3) @binding(auto) var pbr_specularColorSamplerSampler: sampler;
#endif
#ifdef HAS_SPECULARINTENSITYMAP
@group(3) @binding(auto) var pbr_specularIntensitySampler: texture_2d<f32>;
@group(3) @binding(auto) var pbr_specularIntensitySamplerSampler: sampler;
#endif
#ifdef HAS_TRANSMISSIONMAP
@group(3) @binding(auto) var pbr_transmissionSampler: texture_2d<f32>;
@group(3) @binding(auto) var pbr_transmissionSamplerSampler: sampler;
#endif
#ifdef HAS_THICKNESSMAP
@group(3) @binding(auto) var pbr_thicknessSampler: texture_2d<f32>;
@group(3) @binding(auto) var pbr_thicknessSamplerSampler: sampler;
#endif
#ifdef HAS_CLEARCOATMAP
@group(3) @binding(auto) var pbr_clearcoatSampler: texture_2d<f32>;
@group(3) @binding(auto) var pbr_clearcoatSamplerSampler: sampler;
#endif
#ifdef HAS_CLEARCOATROUGHNESSMAP
@group(3) @binding(auto) var pbr_clearcoatRoughnessSampler: texture_2d<f32>;
@group(3) @binding(auto) var pbr_clearcoatRoughnessSamplerSampler: sampler;
#endif
#ifdef HAS_CLEARCOATNORMALMAP
@group(3) @binding(auto) var pbr_clearcoatNormalSampler: texture_2d<f32>;
@group(3) @binding(auto) var pbr_clearcoatNormalSamplerSampler: sampler;
#endif
#ifdef HAS_SHEENCOLORMAP
@group(3) @binding(auto) var pbr_sheenColorSampler: texture_2d<f32>;
@group(3) @binding(auto) var pbr_sheenColorSamplerSampler: sampler;
#endif
#ifdef HAS_SHEENROUGHNESSMAP
@group(3) @binding(auto) var pbr_sheenRoughnessSampler: texture_2d<f32>;
@group(3) @binding(auto) var pbr_sheenRoughnessSamplerSampler: sampler;
#endif
#ifdef HAS_IRIDESCENCEMAP
@group(3) @binding(auto) var pbr_iridescenceSampler: texture_2d<f32>;
@group(3) @binding(auto) var pbr_iridescenceSamplerSampler: sampler;
#endif
#ifdef HAS_IRIDESCENCETHICKNESSMAP
@group(3) @binding(auto) var pbr_iridescenceThicknessSampler: texture_2d<f32>;
@group(3) @binding(auto) var pbr_iridescenceThicknessSamplerSampler: sampler;
#endif
#ifdef HAS_ANISOTROPYMAP
@group(3) @binding(auto) var pbr_anisotropySampler: texture_2d<f32>;
@group(3) @binding(auto) var pbr_anisotropySamplerSampler: sampler;
#endif
#ifdef HAS_BUMPMAP
@group(3) @binding(auto) var pbr_bumpSampler: texture_2d<f32>;
@group(3) @binding(auto) var pbr_bumpSamplerSampler: sampler;
#endif
#ifdef HAS_DIFFUSETRANSMISSIONMAP
@group(3) @binding(auto) var pbr_diffuseTransmissionSampler: texture_2d<f32>;
@group(3) @binding(auto) var pbr_diffuseTransmissionSamplerSampler: sampler;
#endif
#ifdef HAS_DIFFUSETRANSMISSIONCOLORMAP
@group(3) @binding(auto) var pbr_diffuseTransmissionColorSampler: texture_2d<f32>;
@group(3) @binding(auto) var pbr_diffuseTransmissionColorSamplerSampler: sampler;
#endif
#ifdef HAS_MULTISCATTERCOLORMAP
@group(3) @binding(auto) var pbr_multiscatterColorSampler: texture_2d<f32>;
@group(3) @binding(auto) var pbr_multiscatterColorSamplerSampler: sampler;
#endif
// Encapsulate the various inputs used by the various functions in the shading equation
// We store values in this struct to simplify the integration of alternative implementations
// of the shading terms, outlined in the Readme.MD Appendix.
struct PBRInfo {
  NdotL: f32,                  // cos angle between normal and light direction
  NdotV: f32,                  // cos angle between normal and view direction
  NdotH: f32,                  // cos angle between normal and half vector
  LdotH: f32,                  // cos angle between light direction and half vector
  VdotH: f32,                  // cos angle between view direction and half vector
  perceptualRoughness: f32,    // roughness value, as authored by the model creator (input to shader)
  metalness: f32,              // metallic value at the surface
  reflectance0: vec3f,            // full reflectance color (normal incidence angle)
  reflectance90: vec3f,           // reflectance color at grazing angle
  alphaRoughness: f32,         // roughness mapped to a more linear change in the roughness (proposed by [2])
  diffuseColor: vec3f,            // color contribution from diffuse lighting
  specularColor: vec3f,           // color contribution from specular lighting
  n: vec3f,                       // normal at surface point
  v: vec3f,                       // vector from surface point to camera
  l: vec3f,                       // direction from the surface toward the current light
  h: vec3f                        // half vector between the current light and camera
};

const M_PI = 3.141592653589793;
const c_MinRoughness = 0.04;

// Widen sub-pixel specular lobes using the screen-space normal footprint.
// This is geometric specular antialiasing: the normal variance is converted
// into an additional squared perceptual roughness before evaluating BRDFs.
fn widenSpecularRoughness(perceptualRoughness: f32, normal: vec3f) -> f32 {
  let normalDerivativeX = dpdx(normal);
  let normalDerivativeY = dpdy(normal);
  let normalVariance =
    dot(normalDerivativeX, normalDerivativeX) +
    dot(normalDerivativeY, normalDerivativeY);
  let kernelRoughnessSquared = min(2.0 * normalVariance, 1.0);
  return clamp(
    sqrt(perceptualRoughness * perceptualRoughness + kernelRoughnessSquared),
    c_MinRoughness,
    1.0
  );
}

fn SRGBtoLINEAR(srgbIn: vec4f ) -> vec4f
{
  var linOut: vec3f = srgbIn.xyz;
#ifdef MANUAL_SRGB
  let bLess: vec3f = step(vec3f(0.04045), srgbIn.xyz);
  linOut = mix(
    srgbIn.xyz / vec3f(12.92),
    pow((srgbIn.xyz + vec3f(0.055)) / vec3f(1.055), vec3f(2.4)),
    bLess
  );
#ifdef SRGB_FAST_APPROXIMATION
  linOut = pow(srgbIn.xyz, vec3f(2.2));
#endif
#endif
  return vec4f(linOut, srgbIn.w);
}

fn getMaterialUV(uvSet: i32, uvTransform: mat3x3f) -> vec2f
{
  var baseUV = fragmentInputs.pbr_vUV0;
  if (uvSet == 1) {
    baseUV = fragmentInputs.pbr_vUV1;
  }
  return (uvTransform * vec3f(baseUV, 1.0)).xy;
}

// Build the tangent basis from interpolated attributes or screen-space derivatives.
fn getTBN(uv: vec2f) -> mat3x3f
{
  let pos_dx: vec3f = dpdx(fragmentInputs.pbr_vPosition);
  let pos_dy: vec3f = dpdy(fragmentInputs.pbr_vPosition);
  let tex_dx: vec3f = dpdx(vec3f(uv, 0.0));
  let tex_dy: vec3f = dpdy(vec3f(uv, 0.0));
  var t: vec3f = (tex_dy.y * pos_dx - tex_dx.y * pos_dy) / (tex_dx.x * tex_dy.y - tex_dy.x * tex_dx.y);

  var ng: vec3f = cross(pos_dy, pos_dx);
#ifdef HAS_NORMALS
  ng = normalize(fragmentInputs.pbr_vNormal);
#endif
  t = normalize(t - ng * dot(ng, t));
  var b: vec3f = normalize(cross(ng, t));
  var tbn: mat3x3f = mat3x3f(t, b, ng);
#ifdef HAS_TANGENTS
  tbn = fragmentInputs.pbr_vTBN;
#endif

  return tbn;
}

// Find the normal for this fragment, pulling either from a predefined normal map
// or from the interpolated mesh normal and tangent attributes.
fn getMappedNormal(
  normalSampler: texture_2d<f32>,
  normalSamplerBinding: sampler,
  tbn: mat3x3f,
  normalScale: f32,
  uv: vec2f
) -> vec3f
{
  let n = textureSample(normalSampler, normalSamplerBinding, uv).rgb;
  return normalize(tbn * ((2.0 * n - 1.0) * vec3f(normalScale, normalScale, 1.0)));
}

fn getNormal(tbn: mat3x3f, uv: vec2f) -> vec3f
{
  // The tbn matrix is linearly interpolated, so we need to re-normalize
  var n: vec3f = normalize(tbn[2].xyz);
#ifdef HAS_NORMALMAP
  n = getMappedNormal(
    pbr_normalSampler,
    pbr_normalSamplerSampler,
    tbn,
    pbrMaterial.normalScale,
    uv
  );
#endif

#ifdef HAS_BUMPMAP
  let bumpUV = getMaterialUV(pbrMaterial.bumpUVSet, pbrMaterial.bumpUVTransform);
  let bumpTexelSize = 1.0 / vec2f(textureDimensions(pbr_bumpSampler, 0));
  let bumpHeight = textureSample(pbr_bumpSampler, pbr_bumpSamplerSampler, bumpUV).r;
  let bumpGradient = vec2f(
    textureSample(
      pbr_bumpSampler,
      pbr_bumpSamplerSampler,
      bumpUV + vec2f(bumpTexelSize.x, 0.0)
    ).r - bumpHeight,
    textureSample(
      pbr_bumpSampler,
      pbr_bumpSamplerSampler,
      bumpUV + vec2f(0.0, bumpTexelSize.y)
    ).r - bumpHeight
  );
  n = normalize(n - pbrMaterial.bumpFactor *
    (tbn[0] * bumpGradient.x + tbn[1] * bumpGradient.y));
#endif

  return n;
}

fn getClearcoatNormal(tbn: mat3x3f, baseNormal: vec3f, uv: vec2f) -> vec3f
{
#ifdef HAS_CLEARCOATNORMALMAP
  return getMappedNormal(
    pbr_clearcoatNormalSampler,
    pbr_clearcoatNormalSamplerSampler,
    tbn,
    1.0,
    uv
  );
#else
  return baseNormal;
#endif
}

// Calculation of the lighting contribution from an optional Image Based Light source.
// Precomputed Environment Maps are required uniform inputs and are computed as outlined in [1].
// See our README.md on Environment Maps [3] for additional discussion.
#ifdef USE_IBL
fn getIBLContribution(pbrInfo: PBRInfo, n: vec3f, reflection: vec3f) -> vec3f
{
#ifdef USE_SCENE_ENVIRONMENT
  let maximumMipLevel = max(pbrScene.environmentMipCount - 1.0, 0.0);
  let rotationSine = sin(pbrScene.environmentRotation);
  let rotationCosine = cos(pbrScene.environmentRotation);
  let environmentRotation = mat2x2f(
    vec2f(rotationCosine, rotationSine),
    vec2f(-rotationSine, rotationCosine)
  );
  let rotatedNormal = environmentRotation * n.xz;
  let rotatedReflection = environmentRotation * reflection.xz;
  let environmentNormal = vec3f(rotatedNormal.x, n.y, rotatedNormal.y);
  let environmentReflection = vec3f(rotatedReflection.x, reflection.y, rotatedReflection.y);
#else
  let maximumMipLevel = 9.0;
  let environmentNormal = n;
  let environmentReflection = reflection;
#endif
  let lod = pbrInfo.perceptualRoughness * maximumMipLevel;
  // retrieve a scale and bias to F0. See [1], Figure 3
  let brdfSample = textureSampleLevel(
    pbr_brdfLUT,
    pbr_brdfLUTSampler,
    vec2f(pbrInfo.NdotV, 1.0 - pbrInfo.perceptualRoughness),
    0.0
  );
  let diffuseSample = textureSampleLevel(
    pbr_diffuseEnvSampler,
    pbr_diffuseEnvSamplerSampler,
    environmentNormal,
    0.0
  );
  var specularSample = textureSampleLevel(
    pbr_specularEnvSampler,
    pbr_specularEnvSamplerSampler,
    environmentReflection,
    0.0
  );
#ifdef USE_TEX_LOD
  specularSample = textureSampleLevel(
    pbr_specularEnvSampler,
    pbr_specularEnvSamplerSampler,
    environmentReflection,
    lod
  );
#endif

#ifdef USE_SCENE_ENVIRONMENT
  let brdf = brdfSample.rgb;
  let diffuseLight = diffuseSample.rgb;
  let specularLight = specularSample.rgb;
#else
  let brdf = SRGBtoLINEAR(brdfSample).rgb;
  let diffuseLight = SRGBtoLINEAR(diffuseSample).rgb;
  let specularLight = SRGBtoLINEAR(specularSample).rgb;
#endif

  let diffuse = diffuseLight * pbrInfo.diffuseColor * pbrMaterial.scaleIBLAmbient.x;
  let specular =
    specularLight * (pbrInfo.specularColor * brdf.x + brdf.y) * pbrMaterial.scaleIBLAmbient.y;

#ifdef USE_SCENE_ENVIRONMENT
  return (diffuse + specular) * max(pbrScene.environmentIntensity, 0.0);
#else
  return diffuse + specular;
#endif
}
#endif

// Basic Lambertian diffuse
// Implementation from Lambert's Photometria https://archive.org/details/lambertsphotome00lambgoog
// See also [1], Equation 1
fn diffuse(pbrInfo: PBRInfo) -> vec3<f32> {
  return pbrInfo.diffuseColor / M_PI;
}

// The following equation models the Fresnel reflectance term of the spec equation (aka F())
// Implementation of fresnel from [4], Equation 15
fn specularReflection(pbrInfo: PBRInfo) -> vec3<f32> {
  return pbrInfo.reflectance0 +
    (pbrInfo.reflectance90 - pbrInfo.reflectance0) *
    pow(clamp(1.0 - pbrInfo.VdotH, 0.0, 1.0), 5.0);
}

// This calculates the specular geometric attenuation (aka G()),
// where rougher material will reflect less light back to the viewer.
// This implementation is based on [1] Equation 4, and we adopt their modifications to
// alphaRoughness as input as originally proposed in [2].
fn geometricOcclusion(pbrInfo: PBRInfo) -> f32 {
  let NdotL: f32 = pbrInfo.NdotL;
  let NdotV: f32 = pbrInfo.NdotV;
  let r: f32 = pbrInfo.alphaRoughness;

  let attenuationL = 2.0 * NdotL / (NdotL + sqrt(r * r + (1.0 - r * r) * (NdotL * NdotL)));
  let attenuationV = 2.0 * NdotV / (NdotV + sqrt(r * r + (1.0 - r * r) * (NdotV * NdotV)));
  return attenuationL * attenuationV;
}

// The following equation(s) model the distribution of microfacet normals across
// the area being drawn (aka D())
// Implementation from "Average Irregularity Representation of a Roughened Surface
// for Ray Reflection" by T. S. Trowbridge, and K. P. Reitz
// Follows the distribution function recommended in the SIGGRAPH 2013 course notes
// from EPIC Games [1], Equation 3.
fn microfacetDistribution(pbrInfo: PBRInfo) -> f32 {
  let roughnessSq = pbrInfo.alphaRoughness * pbrInfo.alphaRoughness;
  let f = (pbrInfo.NdotH * roughnessSq - pbrInfo.NdotH) * pbrInfo.NdotH + 1.0;
  return roughnessSq / (M_PI * f * f);
}

fn maxComponent(value: vec3f) -> f32 {
  return max(max(value.r, value.g), value.b);
}

fn getDielectricF0(ior: f32) -> f32 {
  let clampedIor = max(ior, 1.0);
  let ratio = (clampedIor - 1.0) / (clampedIor + 1.0);
  return ratio * ratio;
}

fn normalizeDirection(direction: vec2f) -> vec2f {
  let directionLength = length(direction);
  if (directionLength > 0.0001) {
    return direction / directionLength;
  }

  return vec2f(1.0, 0.0);
}

fn rotateDirection(direction: vec2f, rotation: f32) -> vec2f {
  let s = sin(rotation);
  let c = cos(rotation);
  return vec2f(direction.x * c - direction.y * s, direction.x * s + direction.y * c);
}

fn encodeLinearSRGB(linearColor: vec3f) -> vec3f {
  let positiveColor = max(linearColor, vec3f(0.0));
  return select(
    positiveColor * 12.92,
    1.055 * pow(positiveColor, vec3f(1.0 / 2.4)) - 0.055,
    positiveColor > vec3f(0.0031308)
  );
}

fn toneMapKhronosPBRNeutral(inputColor: vec3f) -> vec3f {
  let startCompression = 0.76;
  let darkestChannel = min(inputColor.r, min(inputColor.g, inputColor.b));
  let offset = select(
    0.04,
    darkestChannel - 6.25 * darkestChannel * darkestChannel,
    darkestChannel < 0.08
  );
  var color = inputColor - vec3f(offset);
  let peak = maxComponent(color);
  if (peak < startCompression) {
    return color;
  }

  let compressionRange = 1.0 - startCompression;
  let compressedPeak = 1.0 - compressionRange * compressionRange /
    (peak + compressionRange - startCompression);
  color *= compressedPeak / max(peak, 0.0001);
  let desaturation = 1.0 - 1.0 / (0.15 * (peak - compressedPeak) + 1.0);
  return mix(color, vec3f(compressedPeak), desaturation);
}

fn applySceneColorManagement(sceneColor: vec3f) -> vec3f {
#ifdef USE_SCENE_COLOR_MANAGEMENT
  var color = max(sceneColor, vec3f(0.0)) * max(pbrScene.exposure, 0.0);
  if (pbrScene.toneMapMode == 1) {
    color /= vec3f(1.0) + color;
  } else if (pbrScene.toneMapMode == 2) {
    color = toneMapKhronosPBRNeutral(color);
  } else if (pbrScene.toneMapMode == 3) {
    color = clamp(
      (color * (2.51 * color + 0.03)) / (color * (2.43 * color + 0.59) + 0.14),
      vec3f(0.0),
      vec3f(1.0)
    );
  }
  if (pbrScene.outputEncoding == 0) {
    return color;
  }
  return encodeLinearSRGB(color);
#else
  return pow(max(sceneColor, vec3f(0.0)), vec3f(1.0 / 2.2));
#endif
}

fn dielectricSchlick(reflectance: f32, cosine: f32) -> f32 {
  return reflectance + (1.0 - reflectance) * pow(clamp(1.0 - cosine, 0.0, 1.0), 5.0);
}

fn evaluateIridescenceSensitivity(opticalPathDifference: f32, phaseShift: vec3f) -> vec3f {
  let phase = 2.0 * M_PI * opticalPathDifference * 1.0e-9;
  let sensitivity = vec3f(5.4856e-13, 4.4201e-13, 5.2481e-13);
  let position = vec3f(1.6810e6, 1.7953e6, 2.2084e6);
  let variance = vec3f(4.3278e9, 9.3046e9, 6.6121e9);
  var xyz = sensitivity * sqrt(2.0 * M_PI * variance) *
    cos(position * phase + phaseShift) * exp(-phase * phase * variance);
  xyz.x += 9.7470e-14 * sqrt(2.0 * M_PI * 4.5282e9) *
    cos(2.2399e6 * phase + phaseShift.x) * exp(-4.5282e9 * phase * phase);
  xyz /= 1.0685e-7;
  return mat3x3f(
    vec3f(3.2404542, -0.9692660, 0.0556434),
    vec3f(-1.5371385, 1.8760108, -0.2040259),
    vec3f(-0.4985314, 0.0415560, 1.0572252)
  ) * xyz;
}

fn getIridescenceTint(
  iridescence: f32,
  thickness: f32,
  NdotV: f32,
  baseReflectance: vec3f
) -> vec3f {
  if (iridescence <= 0.0 || thickness <= 0.0) {
    return baseReflectance;
  }

  let filmIor = max(pbrMaterial.iridescenceIor, 1.0);
  let sineSquared = (1.0 - NdotV * NdotV) / (filmIor * filmIor);
  let cosineSquared = 1.0 - sineSquared;
  if (cosineSquared <= 0.0) {
    return mix(baseReflectance, vec3f(1.0), iridescence);
  }
  let filmCosine = sqrt(cosineSquared);
  let firstInterfaceReflectance = dielectricSchlick(getDielectricF0(filmIor), NdotV);
  let transmittedEnergy = 1.0 - firstInterfaceReflectance;
  let squareRootReflectance = sqrt(clamp(baseReflectance, vec3f(0.0), vec3f(0.9999)));
  let baseIor = (vec3f(1.0) + squareRootReflectance) /
    (vec3f(1.0) - squareRootReflectance);
  var secondInterfaceF0 = (baseIor - vec3f(filmIor)) / (baseIor + vec3f(filmIor));
  secondInterfaceF0 *= secondInterfaceF0;
  let secondInterfaceReflectance = secondInterfaceF0 +
    (vec3f(1.0) - secondInterfaceF0) * pow(1.0 - filmCosine, 5.0);
  let phaseShift = vec3f(M_PI) + select(
    vec3f(0.0),
    vec3f(M_PI),
    baseIor < vec3f(filmIor)
  );
  let opticalPathDifference = 2.0 * filmIor * thickness * filmCosine;
  let combinedReflectance = clamp(
    firstInterfaceReflectance * secondInterfaceReflectance,
    vec3f(0.00001),
    vec3f(0.9999)
  );
  let recurringAmplitude = sqrt(combinedReflectance);
  let interfaceResponse = transmittedEnergy * transmittedEnergy * secondInterfaceReflectance /
    (vec3f(1.0) - combinedReflectance);
  var reflectedSpectrum = vec3f(firstInterfaceReflectance) + interfaceResponse;
  var harmonicAmplitude = interfaceResponse - vec3f(transmittedEnergy);
  for (var harmonic = 1; harmonic <= 2; harmonic++) {
    harmonicAmplitude *= recurringAmplitude;
    reflectedSpectrum += harmonicAmplitude * 2.0 * evaluateIridescenceSensitivity(
      f32(harmonic) * opticalPathDifference,
      f32(harmonic) * phaseShift
    );
  }
  return mix(baseReflectance, clamp(reflectedSpectrum, vec3f(0.0), vec3f(1.0)), iridescence);
}

fn getVolumeAttenuation(thickness: f32) -> vec3f {
  if (thickness <= 0.0) {
    return vec3f(1.0);
  }

  let attenuationCoefficient =
    -log(max(pbrMaterial.attenuationColor, vec3f(0.0001))) /
    max(pbrMaterial.attenuationDistance, 0.0001);
  return exp(-attenuationCoefficient * thickness);
}

// KHR_materials_volume_scatter is an active draft. This evaluates a local,
// thickness-aware single-scattering approximation rather than random walk.
fn getDiffuseTransmissionAttenuation(
  pbrInfo: PBRInfo,
  multiscatterColor: vec3f,
  thickness: f32
) -> vec3f {
  let volumeAttenuation = getVolumeAttenuation(thickness);
  let scatteringStrength = maxComponent(multiscatterColor);
  if (thickness <= 0.0 || scatteringStrength <= 0.0001) {
    return volumeAttenuation;
  }

  let anisotropy = clamp(pbrMaterial.scatterAnisotropy, -0.95, 0.95);
  let scatteringCosine = clamp(dot(-pbrInfo.v, pbrInfo.l), -1.0, 1.0);
  let phaseDenominator = max(
    1.0 + anisotropy * anisotropy - 2.0 * anisotropy * scatteringCosine,
    0.0001
  );
  let phaseWeight = clamp(
    (1.0 - anisotropy * anisotropy) / pow(phaseDenominator, 1.5),
    0.0,
    4.0
  );
  let scatteringDepth = thickness / max(pbrMaterial.attenuationDistance, 0.0001);
  let scatteringProbability = 1.0 - exp(-scatteringDepth);
  let scatteringColor = clamp(multiscatterColor, vec3f(0.0), vec3f(1.0));
  return mix(
    volumeAttenuation,
    volumeAttenuation * mix(vec3f(1.0), scatteringColor * phaseWeight, scatteringColor),
    scatteringProbability
  );
}

fn calculateDiffuseTransmissionLight(
  pbrInfo: PBRInfo,
  lightColor: vec3f,
  diffuseTransmissionColor: vec3f,
  diffuseTransmission: f32,
  multiscatterColor: vec3f,
  thickness: f32
) -> vec3f {
  let oppositeHemisphere = max(dot(-pbrInfo.n, pbrInfo.l), 0.0);
  if (oppositeHemisphere <= 0.0 || diffuseTransmission <= 0.0) {
    return vec3f(0.0);
  }

  let nonReflectedEnergy = vec3f(1.0) - clamp(pbrInfo.reflectance0, vec3f(0.0), vec3f(1.0));
  let attenuatedColor = getDiffuseTransmissionAttenuation(
    pbrInfo,
    multiscatterColor,
    thickness
  );
  return lightColor * diffuseTransmissionColor * nonReflectedEnergy *
    attenuatedColor * (diffuseTransmission * oppositeHemisphere / M_PI);
}

#ifdef USE_IBL
fn calculateDiffuseTransmissionIBL(
  pbrInfo: PBRInfo,
  diffuseTransmissionColor: vec3f,
  diffuseTransmission: f32,
  multiscatterColor: vec3f,
  thickness: f32
) -> vec3f {
  if (diffuseTransmission <= 0.0) {
    return vec3f(0.0);
  }

#ifdef USE_SCENE_ENVIRONMENT
  let rotationSine = sin(pbrScene.environmentRotation);
  let rotationCosine = cos(pbrScene.environmentRotation);
  let environmentRotation = mat2x2f(
    vec2f(rotationCosine, rotationSine),
    vec2f(-rotationSine, rotationCosine)
  );
  let rotatedNormal = environmentRotation * -pbrInfo.n.xz;
  let oppositeNormal = vec3f(rotatedNormal.x, -pbrInfo.n.y, rotatedNormal.y);
  let environmentColor = textureSampleLevel(
    pbr_diffuseEnvSampler,
    pbr_diffuseEnvSamplerSampler,
    oppositeNormal,
    0.0
  ).rgb * max(pbrScene.environmentIntensity, 0.0);
#else
  let environmentColor = SRGBtoLINEAR(
    textureSampleLevel(pbr_diffuseEnvSampler, pbr_diffuseEnvSamplerSampler, -pbrInfo.n, 0.0)
  ).rgb;
#endif
  let nonReflectedEnergy = vec3f(1.0) - clamp(pbrInfo.reflectance0, vec3f(0.0), vec3f(1.0));
  return environmentColor * diffuseTransmissionColor * nonReflectedEnergy *
    getDiffuseTransmissionAttenuation(pbrInfo, multiscatterColor, thickness) *
    diffuseTransmission * pbrMaterial.scaleIBLAmbient.x;
}
#endif

#ifdef USE_TRANSMISSION_FRAMEBUFFER
fn sampleTransmittedSceneColor(
  position: vec3f,
  normal: vec3f,
  viewDirection: vec3f,
  thickness: f32,
  perceptualRoughness: f32,
  indexOfRefraction: f32
) -> vec3f {
  let refractionDirection = refract(
    -viewDirection,
    normal,
    1.0 / max(indexOfRefraction, 1.0)
  );
  let refractedPosition = position + refractionDirection * thickness;
  let clipPosition = pbrScene.projectionMatrix *
    pbrScene.viewMatrix * vec4f(refractedPosition, 1.0);
  var textureCoordinate = clipPosition.xy / max(clipPosition.w, 0.0001) * 0.5 + 0.5;
  textureCoordinate.y = 1.0 - textureCoordinate.y;
  textureCoordinate = clamp(textureCoordinate, vec2f(0.001), vec2f(0.999));

  let blurRadius = perceptualRoughness * perceptualRoughness * 8.0 /
    max(pbrScene.framebufferSize, vec2f(1.0));
  var sceneColor = textureSampleLevel(
    pbr_transmissionFramebufferSampler,
    pbr_transmissionFramebufferSamplerSampler,
    textureCoordinate,
    0.0
  ).rgb * 0.4;
  sceneColor += textureSampleLevel(
    pbr_transmissionFramebufferSampler,
    pbr_transmissionFramebufferSamplerSampler,
    textureCoordinate + vec2f(blurRadius.x, 0.0),
    0.0
  ).rgb * 0.15;
  sceneColor += textureSampleLevel(
    pbr_transmissionFramebufferSampler,
    pbr_transmissionFramebufferSamplerSampler,
    textureCoordinate - vec2f(blurRadius.x, 0.0),
    0.0
  ).rgb * 0.15;
  sceneColor += textureSampleLevel(
    pbr_transmissionFramebufferSampler,
    pbr_transmissionFramebufferSamplerSampler,
    textureCoordinate + vec2f(0.0, blurRadius.y),
    0.0
  ).rgb * 0.15;
  sceneColor += textureSampleLevel(
    pbr_transmissionFramebufferSampler,
    pbr_transmissionFramebufferSamplerSampler,
    textureCoordinate - vec2f(0.0, blurRadius.y),
    0.0
  ).rgb * 0.15;
  return max(sceneColor, vec3f(0.0));
}

fn getTransmittedSceneColor(
  position: vec3f,
  normal: vec3f,
  viewDirection: vec3f,
  thickness: f32,
  perceptualRoughness: f32
) -> vec3f {
  if (pbrMaterial.dispersion <= 0.0) {
    return sampleTransmittedSceneColor(
      position,
      normal,
      viewDirection,
      thickness,
      perceptualRoughness,
      pbrMaterial.ior
    );
  }

  let halfSpread = (max(pbrMaterial.ior, 1.0) - 1.0) * 0.025 * pbrMaterial.dispersion;
  let indicesOfRefraction = max(
    vec3f(pbrMaterial.ior - halfSpread, pbrMaterial.ior, pbrMaterial.ior + halfSpread),
    vec3f(1.0)
  );
  return vec3f(
    sampleTransmittedSceneColor(
      position, normal, viewDirection, thickness, perceptualRoughness, indicesOfRefraction.r
    ).r,
    sampleTransmittedSceneColor(
      position, normal, viewDirection, thickness, perceptualRoughness, indicesOfRefraction.g
    ).g,
    sampleTransmittedSceneColor(
      position, normal, viewDirection, thickness, perceptualRoughness, indicesOfRefraction.b
    ).b
  );
}
#endif

fn createClearcoatPBRInfo(
  basePBRInfo: PBRInfo,
  clearcoatNormal: vec3f,
  clearcoatRoughness: f32
) -> PBRInfo {
  let perceptualRoughness = clamp(clearcoatRoughness, c_MinRoughness, 1.0);
  let alphaRoughness = perceptualRoughness * perceptualRoughness;
  let NdotV = clamp(abs(dot(clearcoatNormal, basePBRInfo.v)), 0.001, 1.0);

  return PBRInfo(
    basePBRInfo.NdotL,
    NdotV,
    basePBRInfo.NdotH,
    basePBRInfo.LdotH,
    basePBRInfo.VdotH,
    perceptualRoughness,
    0.0,
    vec3f(0.04),
    vec3f(1.0),
    alphaRoughness,
    vec3f(0.0),
    vec3f(0.04),
    clearcoatNormal,
    basePBRInfo.v,
    basePBRInfo.l,
    basePBRInfo.h
  );
}

fn calculateClearcoatContribution(
  pbrInfo: PBRInfo,
  lightColor: vec3f,
  clearcoatNormal: vec3f,
  clearcoatFactor: f32,
  clearcoatRoughness: f32
) -> vec3f {
  if (clearcoatFactor <= 0.0) {
    return vec3f(0.0);
  }

  let clearcoatPBRInfo = createClearcoatPBRInfo(pbrInfo, clearcoatNormal, clearcoatRoughness);
  return calculateFinalColor(clearcoatPBRInfo, lightColor) * clearcoatFactor;
}

#ifdef USE_IBL
fn calculateClearcoatIBLContribution(
  pbrInfo: PBRInfo,
  clearcoatNormal: vec3f,
  reflection: vec3f,
  clearcoatFactor: f32,
  clearcoatRoughness: f32
) -> vec3f {
  if (clearcoatFactor <= 0.0) {
    return vec3f(0.0);
  }

  let clearcoatPBRInfo = createClearcoatPBRInfo(pbrInfo, clearcoatNormal, clearcoatRoughness);
  return getIBLContribution(clearcoatPBRInfo, clearcoatNormal, reflection) * clearcoatFactor;
}
#endif

fn calculateSheenContribution(
  pbrInfo: PBRInfo,
  lightColor: vec3f,
  sheenColor: vec3f,
  sheenRoughness: f32
) -> vec3f {
  if (maxComponent(sheenColor) <= 0.0) {
    return vec3f(0.0);
  }

  let alpha = max(sheenRoughness * sheenRoughness, 0.0001);
  let inverseAlpha = 1.0 / alpha;
  let sineSquared = max(1.0 - pbrInfo.NdotH * pbrInfo.NdotH, 0.0);
  let distribution = (2.0 + inverseAlpha) * pow(sineSquared, inverseAlpha * 0.5) /
    (2.0 * M_PI);
  let visibility = 1.0 / max(
    4.0 * (pbrInfo.NdotL + pbrInfo.NdotV - pbrInfo.NdotL * pbrInfo.NdotV),
    0.0001
  );
  return pbrInfo.NdotL * lightColor * sheenColor * distribution * visibility *
    (1.0 - pbrInfo.metalness);
}

fn calculateAnisotropicLightColor(
  pbrInfo: PBRInfo,
  lightColor: vec3f,
  anisotropyTangent: vec3f,
  anisotropyStrength: f32
) -> vec3f {
  if (anisotropyStrength <= 0.0) {
    return calculateFinalColor(pbrInfo, lightColor);
  }

  let anisotropyBitangent = normalize(cross(pbrInfo.n, anisotropyTangent));
  let tangentRoughness = mix(
    pbrInfo.alphaRoughness,
    1.0,
    anisotropyStrength * anisotropyStrength
  );
  let bitangentRoughness = clamp(pbrInfo.alphaRoughness, 0.001, 1.0);
  let roughnessProduct = tangentRoughness * bitangentRoughness;
  let distributionVector = vec3f(
    bitangentRoughness * dot(anisotropyTangent, pbrInfo.h),
    tangentRoughness * dot(anisotropyBitangent, pbrInfo.h),
    roughnessProduct * pbrInfo.NdotH
  );
  let distributionFactor = roughnessProduct /
    max(dot(distributionVector, distributionVector), 0.000001);
  let distribution = roughnessProduct * distributionFactor * distributionFactor / M_PI;
  let viewMask = pbrInfo.NdotL * length(vec3f(
    tangentRoughness * dot(anisotropyTangent, pbrInfo.v),
    bitangentRoughness * dot(anisotropyBitangent, pbrInfo.v),
    pbrInfo.NdotV
  ));
  let lightMask = pbrInfo.NdotV * length(vec3f(
    tangentRoughness * dot(anisotropyTangent, pbrInfo.l),
    bitangentRoughness * dot(anisotropyBitangent, pbrInfo.l),
    pbrInfo.NdotL
  ));
  let visibility = clamp(0.5 / max(viewMask + lightMask, 0.000001), 0.0, 1.0);
  let fresnel = specularReflection(pbrInfo);
  let diffuseContribution = (vec3f(1.0) - fresnel) * diffuse(pbrInfo);
  return pbrInfo.NdotL * lightColor *
    (diffuseContribution + fresnel * distribution * visibility);
}

fn getAnisotropicReflection(
  pbrInfo: PBRInfo,
  anisotropyTangent: vec3f,
  anisotropyStrength: f32
) -> vec3f {
  if (anisotropyStrength <= 0.0) {
    return -normalize(reflect(pbrInfo.v, pbrInfo.n));
  }
  let anisotropyBitangent = normalize(cross(pbrInfo.n, anisotropyTangent));
  var anisotropicNormal = normalize(cross(anisotropyBitangent, pbrInfo.v));
  anisotropicNormal = normalize(cross(anisotropicNormal, anisotropyBitangent));
  let bend = anisotropyStrength * (1.0 - pbrInfo.perceptualRoughness);
  return -normalize(reflect(pbrInfo.v, normalize(mix(pbrInfo.n, anisotropicNormal, bend))));
}

fn calculateMaterialLightColor(
  pbrInfo: PBRInfo,
  lightColor: vec3f,
  clearcoatNormal: vec3f,
  clearcoatFactor: f32,
  clearcoatRoughness: f32,
  sheenColor: vec3f,
  sheenRoughness: f32,
  anisotropyTangent: vec3f,
  anisotropyStrength: f32
) -> vec3f {
  var color = calculateAnisotropicLightColor(
    pbrInfo,
    lightColor,
    anisotropyTangent,
    anisotropyStrength
  );
  color += calculateClearcoatContribution(
    pbrInfo,
    lightColor,
    clearcoatNormal,
    clearcoatFactor,
    clearcoatRoughness
  );
  color += calculateSheenContribution(pbrInfo, lightColor, sheenColor, sheenRoughness);
  return color;
}

fn PBRInfo_setAmbientLight(pbrInfo: ptr<function, PBRInfo>) {
  (*pbrInfo).NdotL = 1.0;
  (*pbrInfo).NdotH = 0.0;
  (*pbrInfo).LdotH = 0.0;
  (*pbrInfo).VdotH = 1.0;
  (*pbrInfo).l = (*pbrInfo).n;
  (*pbrInfo).h = (*pbrInfo).n;
}

fn PBRInfo_setDirectionalLight(pbrInfo: ptr<function, PBRInfo>, lightDirection: vec3<f32>) {
  let n = (*pbrInfo).n;
  let v = (*pbrInfo).v;
  let l = normalize(lightDirection);             // Vector from surface point to light
  let h = normalize(l + v);                      // Half vector between both l and v

  (*pbrInfo).NdotL = clamp(dot(n, l), 0.001, 1.0);
  (*pbrInfo).NdotH = clamp(dot(n, h), 0.0, 1.0);
  (*pbrInfo).LdotH = clamp(dot(l, h), 0.0, 1.0);
  (*pbrInfo).VdotH = clamp(dot(v, h), 0.0, 1.0);
  (*pbrInfo).l = l;
  (*pbrInfo).h = h;
}

fn PBRInfo_setPointLight(pbrInfo: ptr<function, PBRInfo>, pointLight: PointLight) {
  let light_direction = normalize(pointLight.position - fragmentInputs.pbr_vPosition);
  PBRInfo_setDirectionalLight(pbrInfo, light_direction);
}

fn PBRInfo_setSpotLight(pbrInfo: ptr<function, PBRInfo>, spotLight: SpotLight) {
  let light_direction = normalize(spotLight.position - fragmentInputs.pbr_vPosition);
  PBRInfo_setDirectionalLight(pbrInfo, light_direction);
}

fn calculateFinalColor(pbrInfo: PBRInfo, lightColor: vec3<f32>) -> vec3<f32> {
  // Calculate the shading terms for the microfacet specular shading model
  let F = specularReflection(pbrInfo);
  let G = geometricOcclusion(pbrInfo);
  let D = microfacetDistribution(pbrInfo);

  // Calculation of analytical lighting contribution
  let diffuseContrib = (1.0 - F) * diffuse(pbrInfo);
  let specContrib = F * G * D / (4.0 * pbrInfo.NdotL * pbrInfo.NdotV);
  // Obtain final intensity as reflectance (BRDF) scaled by the energy of the light (cosine law)
  return pbrInfo.NdotL * lightColor * (diffuseContrib + specContrib);
}

fn pbr_filterColor(vertexColor: vec4<f32>) -> vec4<f32> {
  let baseColorUV = getMaterialUV(pbrMaterial.baseColorUVSet, pbrMaterial.baseColorUVTransform);
  let metallicRoughnessUV = getMaterialUV(
    pbrMaterial.metallicRoughnessUVSet,
    pbrMaterial.metallicRoughnessUVTransform
  );
  let normalUV = getMaterialUV(pbrMaterial.normalUVSet, pbrMaterial.normalUVTransform);
  let occlusionUV = getMaterialUV(pbrMaterial.occlusionUVSet, pbrMaterial.occlusionUVTransform);
  let emissiveUV = getMaterialUV(pbrMaterial.emissiveUVSet, pbrMaterial.emissiveUVTransform);
  let specularColorUV = getMaterialUV(
    pbrMaterial.specularColorUVSet,
    pbrMaterial.specularColorUVTransform
  );
  let specularIntensityUV = getMaterialUV(
    pbrMaterial.specularIntensityUVSet,
    pbrMaterial.specularIntensityUVTransform
  );
  let transmissionUV = getMaterialUV(
    pbrMaterial.transmissionUVSet,
    pbrMaterial.transmissionUVTransform
  );
  let thicknessUV = getMaterialUV(pbrMaterial.thicknessUVSet, pbrMaterial.thicknessUVTransform);
  let clearcoatUV = getMaterialUV(pbrMaterial.clearcoatUVSet, pbrMaterial.clearcoatUVTransform);
  let clearcoatRoughnessUV = getMaterialUV(
    pbrMaterial.clearcoatRoughnessUVSet,
    pbrMaterial.clearcoatRoughnessUVTransform
  );
  let clearcoatNormalUV = getMaterialUV(
    pbrMaterial.clearcoatNormalUVSet,
    pbrMaterial.clearcoatNormalUVTransform
  );
  let sheenColorUV = getMaterialUV(
    pbrMaterial.sheenColorUVSet,
    pbrMaterial.sheenColorUVTransform
  );
  let sheenRoughnessUV = getMaterialUV(
    pbrMaterial.sheenRoughnessUVSet,
    pbrMaterial.sheenRoughnessUVTransform
  );
  let iridescenceUV = getMaterialUV(
    pbrMaterial.iridescenceUVSet,
    pbrMaterial.iridescenceUVTransform
  );
  let iridescenceThicknessUV = getMaterialUV(
    pbrMaterial.iridescenceThicknessUVSet,
    pbrMaterial.iridescenceThicknessUVTransform
  );
  let anisotropyUV = getMaterialUV(
    pbrMaterial.anisotropyUVSet,
    pbrMaterial.anisotropyUVTransform
  );
  let diffuseTransmissionUV = getMaterialUV(
    pbrMaterial.diffuseTransmissionUVSet,
    pbrMaterial.diffuseTransmissionUVTransform
  );
  let diffuseTransmissionColorUV = getMaterialUV(
    pbrMaterial.diffuseTransmissionColorUVSet,
    pbrMaterial.diffuseTransmissionColorUVTransform
  );
  let multiscatterColorUV = getMaterialUV(
    pbrMaterial.multiscatterColorUVSet,
    pbrMaterial.multiscatterColorUVTransform
  );

  // The albedo may be defined from a base texture or a flat color
  var baseColor: vec4<f32> = pbrMaterial.baseColorFactor * vertexColor;
  #ifdef HAS_BASECOLORMAP
  baseColor = SRGBtoLINEAR(
    textureSample(pbr_baseColorSampler, pbr_baseColorSamplerSampler, baseColorUV)
  ) * pbrMaterial.baseColorFactor * vertexColor;
  #endif

  #ifdef ALPHA_CUTOFF
  if (baseColor.a < pbrMaterial.alphaCutoff) {
    discard;
  }
  #endif

  var color = vec3<f32>(0.0, 0.0, 0.0);
  var transmission = 0.0;

  if (pbrMaterial.unlit != 0u) {
    color = baseColor.rgb;
  } else {
    // Metallic and Roughness material properties are packed together
    // In glTF, these factors can be specified by fixed scalar values
    // or from a metallic-roughness map
    var perceptualRoughness = pbrMaterial.metallicRoughnessValues.y;
    var metallic = pbrMaterial.metallicRoughnessValues.x;
    #ifdef HAS_METALROUGHNESSMAP
    // Roughness is stored in the 'g' channel, metallic is stored in the 'b' channel.
    // This layout intentionally reserves the 'r' channel for (optional) occlusion map data
    let mrSample = textureSample(
      pbr_metallicRoughnessSampler,
      pbr_metallicRoughnessSamplerSampler,
      metallicRoughnessUV
    );
    perceptualRoughness = mrSample.g * perceptualRoughness;
    metallic = mrSample.b * metallic;
    #endif
    perceptualRoughness = clamp(perceptualRoughness, c_MinRoughness, 1.0);
    metallic = clamp(metallic, 0.0, 1.0);
    let tbn = getTBN(normalUV);
    let n = getNormal(tbn, normalUV);                          // normal at surface point
    perceptualRoughness = widenSpecularRoughness(perceptualRoughness, n);
    let v = normalize(pbrProjection.camera - fragmentInputs.pbr_vPosition);  // Vector from surface point to camera
    let NdotV = clamp(abs(dot(n, v)), 0.001, 1.0);
    var useExtendedPBR = false;
    #ifdef USE_MATERIAL_EXTENSIONS
    useExtendedPBR =
      pbrMaterial.specularColorMapEnabled != 0 ||
      pbrMaterial.specularIntensityMapEnabled != 0 ||
      abs(pbrMaterial.specularIntensityFactor - 1.0) > 0.0001 ||
      maxComponent(abs(pbrMaterial.specularColorFactor - vec3f(1.0))) > 0.0001 ||
      abs(pbrMaterial.ior - 1.5) > 0.0001 ||
      pbrMaterial.dispersion > 0.0001 ||
      pbrMaterial.transmissionMapEnabled != 0 ||
      pbrMaterial.transmissionFactor > 0.0001 ||
      pbrMaterial.diffuseTransmissionMapEnabled != 0 ||
      pbrMaterial.diffuseTransmissionColorMapEnabled != 0 ||
      pbrMaterial.diffuseTransmissionFactor > 0.0001 ||
      pbrMaterial.multiscatterColorMapEnabled != 0 ||
      maxComponent(pbrMaterial.multiscatterColorFactor) > 0.0001 ||
      pbrMaterial.clearcoatMapEnabled != 0 ||
      pbrMaterial.clearcoatRoughnessMapEnabled != 0 ||
      pbrMaterial.clearcoatFactor > 0.0001 ||
      pbrMaterial.clearcoatRoughnessFactor > 0.0001 ||
      pbrMaterial.sheenColorMapEnabled != 0 ||
      pbrMaterial.sheenRoughnessMapEnabled != 0 ||
      maxComponent(pbrMaterial.sheenColorFactor) > 0.0001 ||
      pbrMaterial.sheenRoughnessFactor > 0.0001 ||
      pbrMaterial.iridescenceMapEnabled != 0 ||
      pbrMaterial.iridescenceFactor > 0.0001 ||
      abs(pbrMaterial.iridescenceIor - 1.3) > 0.0001 ||
      abs(pbrMaterial.iridescenceThicknessRange.x - 100.0) > 0.0001 ||
      abs(pbrMaterial.iridescenceThicknessRange.y - 400.0) > 0.0001 ||
      pbrMaterial.anisotropyMapEnabled != 0 ||
      pbrMaterial.anisotropyStrength > 0.0001 ||
      abs(pbrMaterial.anisotropyRotation) > 0.0001 ||
      length(pbrMaterial.anisotropyDirection - vec2f(1.0, 0.0)) > 0.0001;
    #endif

    if (!useExtendedPBR) {
      let alphaRoughness = perceptualRoughness * perceptualRoughness;

      let f0 = vec3<f32>(0.04);
      var diffuseColor = baseColor.rgb * (vec3<f32>(1.0) - f0);
      diffuseColor *= 1.0 - metallic;
      let specularColor = mix(f0, baseColor.rgb, metallic);

      let reflectance = max(max(specularColor.r, specularColor.g), specularColor.b);
      let reflectance90 = clamp(reflectance * 25.0, 0.0, 1.0);
      let specularEnvironmentR0 = specularColor;
      let specularEnvironmentR90 = vec3<f32>(1.0, 1.0, 1.0) * reflectance90;
      let reflection = -normalize(reflect(v, n));

      var pbrInfo = PBRInfo(
        0.0, // NdotL
        NdotV,
        0.0, // NdotH
        0.0, // LdotH
        0.0, // VdotH
        perceptualRoughness,
        metallic,
        specularEnvironmentR0,
        specularEnvironmentR90,
        alphaRoughness,
        diffuseColor,
        specularColor,
        n,
        v,
        n,
        n
      );

      #ifdef USE_LIGHTS
      PBRInfo_setAmbientLight(&pbrInfo);
      color += calculateFinalColor(pbrInfo, lighting.ambientColor);

      for (var i = 0; i < lighting.directionalLightCount; i++) {
        if (i < lighting.directionalLightCount) {
          PBRInfo_setDirectionalLight(&pbrInfo, lighting_getDirectionalLight(i).direction);
          color += calculateFinalColor(pbrInfo, lighting_getDirectionalLight(i).color);
        }
      }

      for (var i = 0; i < lighting.pointLightCount; i++) {
        if (i < lighting.pointLightCount) {
          PBRInfo_setPointLight(&pbrInfo, lighting_getPointLight(i));
          let attenuation = getPointLightAttenuation(
            lighting_getPointLight(i),
            distance(lighting_getPointLight(i).position, fragmentInputs.pbr_vPosition)
          );
          color += calculateFinalColor(pbrInfo, lighting_getPointLight(i).color / attenuation);
        }
      }

      for (var i = 0; i < lighting.spotLightCount; i++) {
        if (i < lighting.spotLightCount) {
          PBRInfo_setSpotLight(&pbrInfo, lighting_getSpotLight(i));
          let attenuation = getSpotLightAttenuation(
            lighting_getSpotLight(i),
            fragmentInputs.pbr_vPosition
          );
          color += calculateFinalColor(pbrInfo, lighting_getSpotLight(i).color / attenuation);
        }
      }
      #endif

      #ifdef USE_IBL
      if (pbrMaterial.IBLenabled != 0) {
        color += getIBLContribution(pbrInfo, n, reflection);
      }
      #endif

      #ifdef HAS_OCCLUSIONMAP
      if (pbrMaterial.occlusionMapEnabled != 0) {
        let ao = textureSample(pbr_occlusionSampler, pbr_occlusionSamplerSampler, occlusionUV).r;
        color = mix(color, color * ao, pbrMaterial.occlusionStrength);
      }
      #endif

      var emissive = pbrMaterial.emissiveFactor;
      #ifdef HAS_EMISSIVEMAP
      if (pbrMaterial.emissiveMapEnabled != 0u) {
        emissive *= SRGBtoLINEAR(
          textureSample(pbr_emissiveSampler, pbr_emissiveSamplerSampler, emissiveUV)
        ).rgb;
      }
      #endif
      color += emissive * pbrMaterial.emissiveStrength;

      #ifdef PBR_DEBUG
      color = mix(color, baseColor.rgb, pbrMaterial.scaleDiffBaseMR.y);
      color = mix(color, vec3<f32>(metallic), pbrMaterial.scaleDiffBaseMR.z);
      color = mix(color, vec3<f32>(perceptualRoughness), pbrMaterial.scaleDiffBaseMR.w);
      #endif

      return vec4<f32>(applySceneColorManagement(color), baseColor.a);
    }

    var specularIntensity = pbrMaterial.specularIntensityFactor;
    #ifdef HAS_SPECULARINTENSITYMAP
    if (pbrMaterial.specularIntensityMapEnabled != 0) {
      specularIntensity *= textureSample(
        pbr_specularIntensitySampler,
        pbr_specularIntensitySamplerSampler,
        specularIntensityUV
      ).a;
    }
    #endif

    var specularFactor = pbrMaterial.specularColorFactor;
    #ifdef HAS_SPECULARCOLORMAP
    if (pbrMaterial.specularColorMapEnabled != 0) {
      specularFactor *= SRGBtoLINEAR(
        textureSample(
          pbr_specularColorSampler,
          pbr_specularColorSamplerSampler,
          specularColorUV
        )
      ).rgb;
    }
    #endif

    transmission = pbrMaterial.transmissionFactor;
    #ifdef HAS_TRANSMISSIONMAP
    if (pbrMaterial.transmissionMapEnabled != 0) {
      transmission *= textureSample(
        pbr_transmissionSampler,
        pbr_transmissionSamplerSampler,
        transmissionUV
      ).r;
    }
    #endif
    transmission = clamp(transmission * (1.0 - metallic), 0.0, 1.0);
    var thickness = max(pbrMaterial.thicknessFactor, 0.0);
    #ifdef HAS_THICKNESSMAP
    thickness *= textureSample(
      pbr_thicknessSampler,
      pbr_thicknessSamplerSampler,
      thicknessUV
    ).g;
    #endif

    var diffuseTransmission = clamp(pbrMaterial.diffuseTransmissionFactor, 0.0, 1.0);
    #ifdef HAS_DIFFUSETRANSMISSIONMAP
    if (pbrMaterial.diffuseTransmissionMapEnabled != 0) {
      diffuseTransmission *= textureSample(
        pbr_diffuseTransmissionSampler,
        pbr_diffuseTransmissionSamplerSampler,
        diffuseTransmissionUV
      ).a;
    }
    #endif
    diffuseTransmission *= (1.0 - metallic) * (1.0 - transmission);
    var diffuseTransmissionColor = pbrMaterial.diffuseTransmissionColorFactor;
    #ifdef HAS_DIFFUSETRANSMISSIONCOLORMAP
    if (pbrMaterial.diffuseTransmissionColorMapEnabled != 0) {
      diffuseTransmissionColor *= SRGBtoLINEAR(
        textureSample(
          pbr_diffuseTransmissionColorSampler,
          pbr_diffuseTransmissionColorSamplerSampler,
          diffuseTransmissionColorUV
        )
      ).rgb;
    }
    #endif
    var multiscatterColor = pbrMaterial.multiscatterColorFactor;
    #ifdef HAS_MULTISCATTERCOLORMAP
    if (pbrMaterial.multiscatterColorMapEnabled != 0) {
      multiscatterColor *= SRGBtoLINEAR(
        textureSample(
          pbr_multiscatterColorSampler,
          pbr_multiscatterColorSamplerSampler,
          multiscatterColorUV
        )
      ).rgb;
    }
    #endif

    var clearcoatFactor = pbrMaterial.clearcoatFactor;
    var clearcoatRoughness = pbrMaterial.clearcoatRoughnessFactor;
    #ifdef HAS_CLEARCOATMAP
    if (pbrMaterial.clearcoatMapEnabled != 0) {
      clearcoatFactor *= textureSample(
        pbr_clearcoatSampler,
        pbr_clearcoatSamplerSampler,
        clearcoatUV
      ).r;
    }
    #endif
    #ifdef HAS_CLEARCOATROUGHNESSMAP
    if (pbrMaterial.clearcoatRoughnessMapEnabled != 0) {
      clearcoatRoughness *= textureSample(
        pbr_clearcoatRoughnessSampler,
        pbr_clearcoatRoughnessSamplerSampler,
        clearcoatRoughnessUV
      ).g;
    }
    #endif
    clearcoatFactor = clamp(clearcoatFactor, 0.0, 1.0);
    clearcoatRoughness = clamp(clearcoatRoughness, c_MinRoughness, 1.0);
    let clearcoatNormal = getClearcoatNormal(getTBN(clearcoatNormalUV), n, clearcoatNormalUV);
    clearcoatRoughness = widenSpecularRoughness(clearcoatRoughness, clearcoatNormal);

    var sheenColor = pbrMaterial.sheenColorFactor;
    var sheenRoughness = pbrMaterial.sheenRoughnessFactor;
    #ifdef HAS_SHEENCOLORMAP
    if (pbrMaterial.sheenColorMapEnabled != 0) {
      sheenColor *= SRGBtoLINEAR(
        textureSample(
          pbr_sheenColorSampler,
          pbr_sheenColorSamplerSampler,
          sheenColorUV
        )
      ).rgb;
    }
    #endif
    #ifdef HAS_SHEENROUGHNESSMAP
    if (pbrMaterial.sheenRoughnessMapEnabled != 0) {
      sheenRoughness *= textureSample(
        pbr_sheenRoughnessSampler,
        pbr_sheenRoughnessSamplerSampler,
        sheenRoughnessUV
      ).a;
    }
    #endif
    sheenRoughness = clamp(sheenRoughness, c_MinRoughness, 1.0);

    var iridescence = pbrMaterial.iridescenceFactor;
    #ifdef HAS_IRIDESCENCEMAP
    if (pbrMaterial.iridescenceMapEnabled != 0) {
      iridescence *= textureSample(
        pbr_iridescenceSampler,
        pbr_iridescenceSamplerSampler,
        iridescenceUV
      ).r;
    }
    #endif
    iridescence = clamp(iridescence, 0.0, 1.0);
    var iridescenceThickness = mix(
      pbrMaterial.iridescenceThicknessRange.x,
      pbrMaterial.iridescenceThicknessRange.y,
      0.5
    );
    #ifdef HAS_IRIDESCENCETHICKNESSMAP
    iridescenceThickness = mix(
      pbrMaterial.iridescenceThicknessRange.x,
      pbrMaterial.iridescenceThicknessRange.y,
      textureSample(
        pbr_iridescenceThicknessSampler,
        pbr_iridescenceThicknessSamplerSampler,
        iridescenceThicknessUV
      ).g
    );
    #endif

    var anisotropyStrength = clamp(pbrMaterial.anisotropyStrength, 0.0, 1.0);
    var anisotropyDirection = normalizeDirection(pbrMaterial.anisotropyDirection);
    #ifdef HAS_ANISOTROPYMAP
    if (pbrMaterial.anisotropyMapEnabled != 0) {
      let anisotropySample = textureSample(
        pbr_anisotropySampler,
        pbr_anisotropySamplerSampler,
        anisotropyUV
      ).rgb;
      anisotropyStrength *= anisotropySample.b;
      let mappedDirection = anisotropySample.rg * 2.0 - 1.0;
      if (length(mappedDirection) > 0.0001) {
        anisotropyDirection = normalize(mappedDirection);
      }
    }
    #endif
    anisotropyDirection = rotateDirection(anisotropyDirection, pbrMaterial.anisotropyRotation);
    var anisotropyTangent =
      normalize(tbn[0] * anisotropyDirection.x + tbn[1] * anisotropyDirection.y);
    if (length(anisotropyTangent) < 0.0001) {
      anisotropyTangent = normalize(tbn[0]);
    }
    // Roughness is authored as perceptual roughness; as is convention,
    // convert to material roughness by squaring the perceptual roughness [2].
    let alphaRoughness = perceptualRoughness * perceptualRoughness;

    let dielectricF0 = getDielectricF0(pbrMaterial.ior);
    var dielectricSpecularF0 = min(
      vec3f(dielectricF0) * specularFactor * specularIntensity,
      vec3f(1.0)
    );
    dielectricSpecularF0 = getIridescenceTint(
      iridescence,
      iridescenceThickness,
      NdotV,
      dielectricSpecularF0
    );
    var diffuseColor = baseColor.rgb * (vec3f(1.0) - dielectricSpecularF0);
    diffuseColor *= (1.0 - metallic) * (1.0 - transmission) * (1.0 - diffuseTransmission);
    var specularColor = mix(dielectricSpecularF0, baseColor.rgb, metallic);

    let clearcoatViewFresnel = dielectricSchlick(
      0.04,
      clamp(abs(dot(clearcoatNormal, v)), 0.0, 1.0)
    );
    let sheenDirectionalAlbedo = maxComponent(sheenColor) *
      (0.157 + 0.343 * (1.0 - NdotV)) * (1.0 - sheenRoughness * 0.5);
    let baseLayerEnergy = (1.0 - clearcoatFactor * clearcoatViewFresnel) *
      (1.0 - clamp(sheenDirectionalAlbedo, 0.0, 1.0));
    diffuseColor *= baseLayerEnergy;
    specularColor *= baseLayerEnergy;

    // Compute reflectance.
    let reflectance = max(max(specularColor.r, specularColor.g), specularColor.b);

    // For typical incident reflectance range (between 4% to 100%) set the grazing
    // reflectance to 100% for typical fresnel effect.
    // For very low reflectance range on highly diffuse objects (below 4%),
    // incrementally reduce grazing reflectance to 0%.
    let reflectance90 = clamp(reflectance * 25.0, 0.0, 1.0);
    let specularEnvironmentR0 = specularColor;
    let specularEnvironmentR90 = vec3<f32>(1.0, 1.0, 1.0) * reflectance90;
    let reflection = -normalize(reflect(v, n));

    var pbrInfo = PBRInfo(
      0.0, // NdotL
      NdotV,
      0.0, // NdotH
      0.0, // LdotH
      0.0, // VdotH
      perceptualRoughness,
      metallic,
      specularEnvironmentR0,
      specularEnvironmentR90,
      alphaRoughness,
      diffuseColor,
      specularColor,
      n,
      v,
      n,
      n
    );

    #ifdef USE_LIGHTS
    // Apply ambient light
    PBRInfo_setAmbientLight(&pbrInfo);
    color += calculateMaterialLightColor(
      pbrInfo,
      lighting.ambientColor,
      clearcoatNormal,
      clearcoatFactor,
      clearcoatRoughness,
      sheenColor,
      sheenRoughness,
      anisotropyTangent,
      anisotropyStrength
    );

    // Apply directional light
    for (var i = 0; i < lighting.directionalLightCount; i++) {
      if (i < lighting.directionalLightCount) {
        PBRInfo_setDirectionalLight(&pbrInfo, lighting_getDirectionalLight(i).direction);
        color += calculateMaterialLightColor(
          pbrInfo,
          lighting_getDirectionalLight(i).color,
          clearcoatNormal,
          clearcoatFactor,
          clearcoatRoughness,
          sheenColor,
          sheenRoughness,
          anisotropyTangent,
          anisotropyStrength
        );
        color += calculateDiffuseTransmissionLight(
          pbrInfo,
          lighting_getDirectionalLight(i).color,
          diffuseTransmissionColor,
          diffuseTransmission,
          multiscatterColor,
          thickness
        );
      }
    }

    // Apply point light
    for (var i = 0; i < lighting.pointLightCount; i++) {
      if (i < lighting.pointLightCount) {
        PBRInfo_setPointLight(&pbrInfo, lighting_getPointLight(i));
        let attenuation = getPointLightAttenuation(
          lighting_getPointLight(i),
          distance(lighting_getPointLight(i).position, fragmentInputs.pbr_vPosition)
        );
        color += calculateMaterialLightColor(
          pbrInfo,
          lighting_getPointLight(i).color / attenuation,
          clearcoatNormal,
          clearcoatFactor,
          clearcoatRoughness,
          sheenColor,
          sheenRoughness,
          anisotropyTangent,
          anisotropyStrength
        );
        color += calculateDiffuseTransmissionLight(
          pbrInfo,
          lighting_getPointLight(i).color / attenuation,
          diffuseTransmissionColor,
          diffuseTransmission,
          multiscatterColor,
          thickness
        );
      }
    }

    for (var i = 0; i < lighting.spotLightCount; i++) {
      if (i < lighting.spotLightCount) {
        PBRInfo_setSpotLight(&pbrInfo, lighting_getSpotLight(i));
        let attenuation = getSpotLightAttenuation(lighting_getSpotLight(i), fragmentInputs.pbr_vPosition);
        color += calculateMaterialLightColor(
          pbrInfo,
          lighting_getSpotLight(i).color / attenuation,
          clearcoatNormal,
          clearcoatFactor,
          clearcoatRoughness,
          sheenColor,
          sheenRoughness,
          anisotropyTangent,
          anisotropyStrength
        );
        color += calculateDiffuseTransmissionLight(
          pbrInfo,
          lighting_getSpotLight(i).color / attenuation,
          diffuseTransmissionColor,
          diffuseTransmission,
          multiscatterColor,
          thickness
        );
      }
    }
    #endif

    // Calculate lighting contribution from image based lighting source (IBL)
    #ifdef USE_IBL
    if (pbrMaterial.IBLenabled != 0) {
      color += getIBLContribution(
        pbrInfo,
        n,
        getAnisotropicReflection(pbrInfo, anisotropyTangent, anisotropyStrength)
      );
      color += calculateClearcoatIBLContribution(
        pbrInfo,
        clearcoatNormal,
        -normalize(reflect(v, clearcoatNormal)),
        clearcoatFactor,
        clearcoatRoughness
      );
      color += calculateDiffuseTransmissionIBL(
        pbrInfo,
        diffuseTransmissionColor,
        diffuseTransmission,
        multiscatterColor,
        thickness
      );
      color += sheenColor * pbrMaterial.scaleIBLAmbient.x * (1.0 - sheenRoughness) * 0.25;
    }
    #endif

    // Apply optional PBR terms for additional (optional) shading
    #ifdef HAS_OCCLUSIONMAP
    if (pbrMaterial.occlusionMapEnabled != 0) {
      let ao = textureSample(pbr_occlusionSampler, pbr_occlusionSamplerSampler, occlusionUV).r;
      color = mix(color, color * ao, pbrMaterial.occlusionStrength);
    }
    #endif

    var emissive = pbrMaterial.emissiveFactor;
    #ifdef HAS_EMISSIVEMAP
    if (pbrMaterial.emissiveMapEnabled != 0u) {
      emissive *= SRGBtoLINEAR(
        textureSample(pbr_emissiveSampler, pbr_emissiveSamplerSampler, emissiveUV)
      ).rgb;
    }
    #endif
    color += emissive * pbrMaterial.emissiveStrength;

    if (transmission > 0.0) {
      #ifdef USE_TRANSMISSION_FRAMEBUFFER
      let dielectricFresnel = getDielectricF0(pbrMaterial.ior);
      let transmissionFresnel = dielectricFresnel +
        (1.0 - dielectricFresnel) * pow(1.0 - NdotV, 5.0);
      let transmittedColor = getTransmittedSceneColor(
        fragmentInputs.pbr_vPosition,
        n,
        v,
        thickness,
        perceptualRoughness
      );
      color += transmittedColor * getVolumeAttenuation(thickness) *
        transmission * (1.0 - transmissionFresnel);
      #else
      color = mix(color, color * getVolumeAttenuation(thickness), transmission);
      #endif
    }

    // This section uses mix to override final color for reference app visualization
    // of various parameters in the lighting equation.
    #ifdef PBR_DEBUG
    // TODO: Figure out how to debug multiple lights

    // color = mix(color, F, pbr_scaleFGDSpec.x);
    // color = mix(color, vec3(G), pbr_scaleFGDSpec.y);
    // color = mix(color, vec3(D), pbr_scaleFGDSpec.z);
    // color = mix(color, specContrib, pbr_scaleFGDSpec.w);

    // color = mix(color, diffuseContrib, pbr_scaleDiffBaseMR.x);
    color = mix(color, baseColor.rgb, pbrMaterial.scaleDiffBaseMR.y);
    color = mix(color, vec3<f32>(metallic), pbrMaterial.scaleDiffBaseMR.z);
    color = mix(color, vec3<f32>(perceptualRoughness), pbrMaterial.scaleDiffBaseMR.w);
    #endif
  }

  #ifdef USE_TRANSMISSION_FRAMEBUFFER
  let alpha = clamp(baseColor.a, 0.0, 1.0);
  #else
  let alpha = clamp(baseColor.a * (1.0 - transmission), 0.0, 1.0);
  #endif
  return vec4<f32>(applySceneColorManagement(color), alpha);
}
`,li=`layout(std140) uniform pbrProjectionUniforms {
  mat4 modelViewProjectionMatrix;
  mat4 modelMatrix;
  mat4 normalMatrix;
  vec3 camera;
} pbrProjection;
`,Zo=`struct pbrProjectionUniforms {
  modelViewProjectionMatrix: mat4x4<f32>,
  modelMatrix: mat4x4<f32>,
  normalMatrix: mat4x4<f32>,
  camera: vec3<f32>
};

@group(0) @binding(auto) var<uniform> pbrProjection: pbrProjectionUniforms;
`,Xo={name:"pbrProjection",bindingLayout:[{name:"pbrProjection",group:0}],source:Zo,vs:li,fs:li,getUniforms:e=>e,uniformTypes:{modelViewProjectionMatrix:"mat4x4<f32>",modelMatrix:"mat4x4<f32>",normalMatrix:"mat4x4<f32>",camera:"vec3<f32>"}},Yo={props:{},uniforms:{},defaultUniforms:{unlit:!1,baseColorMapEnabled:!1,baseColorFactor:[1,1,1,1],normalMapEnabled:!1,normalScale:1,emissiveMapEnabled:!1,emissiveFactor:[0,0,0],metallicRoughnessValues:[1,1],metallicRoughnessMapEnabled:!1,occlusionMapEnabled:!1,occlusionStrength:1,alphaCutoffEnabled:!1,alphaCutoff:.5,IBLenabled:!1,scaleIBLAmbient:[1,1],scaleDiffBaseMR:[0,0,0,0],scaleFGDSpec:[0,0,0,0],specularColorFactor:[1,1,1],specularIntensityFactor:1,specularColorMapEnabled:!1,specularIntensityMapEnabled:!1,ior:1.5,transmissionFactor:0,transmissionMapEnabled:!1,thicknessFactor:0,attenuationDistance:1e9,attenuationColor:[1,1,1],clearcoatFactor:0,clearcoatRoughnessFactor:0,clearcoatMapEnabled:!1,clearcoatRoughnessMapEnabled:!1,sheenColorFactor:[0,0,0],sheenRoughnessFactor:0,sheenColorMapEnabled:!1,sheenRoughnessMapEnabled:!1,iridescenceFactor:0,iridescenceIor:1.3,iridescenceThicknessRange:[100,400],iridescenceMapEnabled:!1,anisotropyStrength:0,anisotropyRotation:0,anisotropyDirection:[1,0],anisotropyMapEnabled:!1,emissiveStrength:1,dispersion:0,baseColorUVSet:0,baseColorUVTransform:[1,0,0,0,1,0,0,0,1],metallicRoughnessUVSet:0,metallicRoughnessUVTransform:[1,0,0,0,1,0,0,0,1],normalUVSet:0,normalUVTransform:[1,0,0,0,1,0,0,0,1],occlusionUVSet:0,occlusionUVTransform:[1,0,0,0,1,0,0,0,1],emissiveUVSet:0,emissiveUVTransform:[1,0,0,0,1,0,0,0,1],specularColorUVSet:0,specularColorUVTransform:[1,0,0,0,1,0,0,0,1],specularIntensityUVSet:0,specularIntensityUVTransform:[1,0,0,0,1,0,0,0,1],transmissionUVSet:0,transmissionUVTransform:[1,0,0,0,1,0,0,0,1],thicknessUVSet:0,thicknessUVTransform:[1,0,0,0,1,0,0,0,1],clearcoatUVSet:0,clearcoatUVTransform:[1,0,0,0,1,0,0,0,1],clearcoatRoughnessUVSet:0,clearcoatRoughnessUVTransform:[1,0,0,0,1,0,0,0,1],clearcoatNormalUVSet:0,clearcoatNormalUVTransform:[1,0,0,0,1,0,0,0,1],sheenColorUVSet:0,sheenColorUVTransform:[1,0,0,0,1,0,0,0,1],sheenRoughnessUVSet:0,sheenRoughnessUVTransform:[1,0,0,0,1,0,0,0,1],iridescenceUVSet:0,iridescenceUVTransform:[1,0,0,0,1,0,0,0,1],iridescenceThicknessUVSet:0,iridescenceThicknessUVTransform:[1,0,0,0,1,0,0,0,1],anisotropyUVSet:0,anisotropyUVTransform:[1,0,0,0,1,0,0,0,1],bumpFactor:1,bumpMapEnabled:!1,diffuseTransmissionFactor:0,diffuseTransmissionMapEnabled:!1,diffuseTransmissionColorFactor:[1,1,1],diffuseTransmissionColorMapEnabled:!1,multiscatterColorFactor:[0,0,0],multiscatterColorMapEnabled:!1,scatterAnisotropy:0,bumpUVSet:0,bumpUVTransform:[1,0,0,0,1,0,0,0,1],diffuseTransmissionUVSet:0,diffuseTransmissionUVTransform:[1,0,0,0,1,0,0,0,1],diffuseTransmissionColorUVSet:0,diffuseTransmissionColorUVTransform:[1,0,0,0,1,0,0,0,1],multiscatterColorUVSet:0,multiscatterColorUVTransform:[1,0,0,0,1,0,0,0,1]},name:"pbrMaterial",firstBindingSlot:0,bindingLayout:[{name:"pbrMaterial",group:3},{name:"pbr_baseColorSampler",group:3},{name:"pbr_normalSampler",group:3},{name:"pbr_emissiveSampler",group:3},{name:"pbr_metallicRoughnessSampler",group:3},{name:"pbr_occlusionSampler",group:3},{name:"pbr_specularColorSampler",group:3},{name:"pbr_specularIntensitySampler",group:3},{name:"pbr_transmissionSampler",group:3},{name:"pbr_thicknessSampler",group:3},{name:"pbr_clearcoatSampler",group:3},{name:"pbr_clearcoatRoughnessSampler",group:3},{name:"pbr_clearcoatNormalSampler",group:3},{name:"pbr_sheenColorSampler",group:3},{name:"pbr_sheenRoughnessSampler",group:3},{name:"pbr_iridescenceSampler",group:3},{name:"pbr_iridescenceThicknessSampler",group:3},{name:"pbr_anisotropySampler",group:3},{name:"pbr_bumpSampler",group:3},{name:"pbr_diffuseTransmissionSampler",group:3},{name:"pbr_diffuseTransmissionColorSampler",group:3},{name:"pbr_multiscatterColorSampler",group:3}],dependencies:[K,ei,Xo],source:Ko,vs:qo,fs:Wo,defines:{LIGHTING_FRAGMENT:!0,HAS_NORMALMAP:!1,HAS_EMISSIVEMAP:!1,HAS_OCCLUSIONMAP:!1,HAS_BASECOLORMAP:!1,HAS_METALROUGHNESSMAP:!1,HAS_SPECULARCOLORMAP:!1,HAS_SPECULARINTENSITYMAP:!1,HAS_TRANSMISSIONMAP:!1,HAS_THICKNESSMAP:!1,HAS_CLEARCOATMAP:!1,HAS_CLEARCOATROUGHNESSMAP:!1,HAS_CLEARCOATNORMALMAP:!1,HAS_SHEENCOLORMAP:!1,HAS_SHEENROUGHNESSMAP:!1,HAS_IRIDESCENCEMAP:!1,HAS_IRIDESCENCETHICKNESSMAP:!1,HAS_ANISOTROPYMAP:!1,HAS_BUMPMAP:!1,HAS_DIFFUSETRANSMISSIONMAP:!1,HAS_DIFFUSETRANSMISSIONCOLORMAP:!1,HAS_MULTISCATTERCOLORMAP:!1,USE_MATERIAL_EXTENSIONS:!1,ALPHA_CUTOFF:!1,USE_IBL:!1,PBR_DEBUG:!1},getUniforms:e=>e,uniformTypes:{unlit:"i32",baseColorMapEnabled:"i32",baseColorFactor:"vec4<f32>",normalMapEnabled:"i32",normalScale:"f32",emissiveMapEnabled:"i32",emissiveFactor:"vec3<f32>",metallicRoughnessValues:"vec2<f32>",metallicRoughnessMapEnabled:"i32",occlusionMapEnabled:"i32",occlusionStrength:"f32",alphaCutoffEnabled:"i32",alphaCutoff:"f32",specularColorFactor:"vec3<f32>",specularIntensityFactor:"f32",specularColorMapEnabled:"i32",specularIntensityMapEnabled:"i32",ior:"f32",transmissionFactor:"f32",transmissionMapEnabled:"i32",thicknessFactor:"f32",attenuationDistance:"f32",attenuationColor:"vec3<f32>",clearcoatFactor:"f32",clearcoatRoughnessFactor:"f32",clearcoatMapEnabled:"i32",clearcoatRoughnessMapEnabled:"i32",sheenColorFactor:"vec3<f32>",sheenRoughnessFactor:"f32",sheenColorMapEnabled:"i32",sheenRoughnessMapEnabled:"i32",iridescenceFactor:"f32",iridescenceIor:"f32",iridescenceThicknessRange:"vec2<f32>",iridescenceMapEnabled:"i32",anisotropyStrength:"f32",anisotropyRotation:"f32",anisotropyDirection:"vec2<f32>",anisotropyMapEnabled:"i32",emissiveStrength:"f32",dispersion:"f32",IBLenabled:"i32",scaleIBLAmbient:"vec2<f32>",scaleDiffBaseMR:"vec4<f32>",scaleFGDSpec:"vec4<f32>",baseColorUVSet:"i32",baseColorUVTransform:"mat3x3<f32>",metallicRoughnessUVSet:"i32",metallicRoughnessUVTransform:"mat3x3<f32>",normalUVSet:"i32",normalUVTransform:"mat3x3<f32>",occlusionUVSet:"i32",occlusionUVTransform:"mat3x3<f32>",emissiveUVSet:"i32",emissiveUVTransform:"mat3x3<f32>",specularColorUVSet:"i32",specularColorUVTransform:"mat3x3<f32>",specularIntensityUVSet:"i32",specularIntensityUVTransform:"mat3x3<f32>",transmissionUVSet:"i32",transmissionUVTransform:"mat3x3<f32>",thicknessUVSet:"i32",thicknessUVTransform:"mat3x3<f32>",clearcoatUVSet:"i32",clearcoatUVTransform:"mat3x3<f32>",clearcoatRoughnessUVSet:"i32",clearcoatRoughnessUVTransform:"mat3x3<f32>",clearcoatNormalUVSet:"i32",clearcoatNormalUVTransform:"mat3x3<f32>",sheenColorUVSet:"i32",sheenColorUVTransform:"mat3x3<f32>",sheenRoughnessUVSet:"i32",sheenRoughnessUVTransform:"mat3x3<f32>",iridescenceUVSet:"i32",iridescenceUVTransform:"mat3x3<f32>",iridescenceThicknessUVSet:"i32",iridescenceThicknessUVTransform:"mat3x3<f32>",anisotropyUVSet:"i32",anisotropyUVTransform:"mat3x3<f32>",bumpFactor:"f32",bumpMapEnabled:"i32",diffuseTransmissionFactor:"f32",diffuseTransmissionMapEnabled:"i32",diffuseTransmissionColorFactor:"vec3<f32>",diffuseTransmissionColorMapEnabled:"i32",multiscatterColorFactor:"vec3<f32>",multiscatterColorMapEnabled:"i32",scatterAnisotropy:"f32",bumpUVSet:"i32",bumpUVTransform:"mat3x3<f32>",diffuseTransmissionUVSet:"i32",diffuseTransmissionUVTransform:"mat3x3<f32>",diffuseTransmissionColorUVSet:"i32",diffuseTransmissionColorUVTransform:"mat3x3<f32>",multiscatterColorUVSet:"i32",multiscatterColorUVTransform:"mat3x3<f32>"}},ci={NONE:0,REINHARD:1,KHRONOS_PBR_NEUTRAL:2,ACES:3},fi=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],ui=`layout(std140) uniform pbrSceneUniforms {
  float exposure;
  int toneMapMode;
  float environmentIntensity;
  float environmentRotation;
  float environmentMipCount;
  int outputEncoding;
  vec2 framebufferSize;
  mat4 viewMatrix;
  mat4 projectionMatrix;
} pbrScene;

#ifdef USE_TRANSMISSION_FRAMEBUFFER
uniform sampler2D pbr_transmissionFramebufferSampler;
#endif
`,Jo=`struct pbrSceneUniforms {
  exposure: f32,
  toneMapMode: i32,
  environmentIntensity: f32,
  environmentRotation: f32,
  environmentMipCount: f32,
  outputEncoding: i32,
  framebufferSize: vec2<f32>,
  viewMatrix: mat4x4<f32>,
  projectionMatrix: mat4x4<f32>
};

@group(1) @binding(auto) var<uniform> pbrScene: pbrSceneUniforms;

#ifdef USE_TRANSMISSION_FRAMEBUFFER
@group(1) @binding(auto) var pbr_transmissionFramebufferSampler: texture_2d<f32>;
@group(1) @binding(auto) var pbr_transmissionFramebufferSamplerSampler: sampler;
#endif
`,Qo={name:"pbrScene",bindingLayout:[{name:"pbrScene",group:1},{name:"pbr_transmissionFramebufferSampler",group:1}],source:Jo,vs:ui,fs:ui,getUniforms:e=>e,uniformTypes:{exposure:"f32",toneMapMode:"i32",environmentIntensity:"f32",environmentRotation:"f32",environmentMipCount:"f32",outputEncoding:"i32",framebufferSize:"vec2<f32>",viewMatrix:"mat4x4<f32>",projectionMatrix:"mat4x4<f32>"},defaultUniforms:{exposure:1,toneMapMode:ci.KHRONOS_PBR_NEUTRAL,environmentIntensity:1,environmentRotation:Math.PI*.5,environmentMipCount:1,outputEncoding:1,framebufferSize:[1,1],viewMatrix:fi,projectionMatrix:fi}};export{Bt as GLSLShaderAssembler,ci as PBR_TONE_MAP_MODE,H as SKIN_MAX_JOINTS,Ke as STORAGE_COLOR_DEFAULT_BYTE_STRIDES,N as STORAGE_COLOR_FORMAT,We as STORAGE_COLOR_FORMAT_BYTE_LENGTHS,B as ShaderAssembler,J as WGSLShaderAssembler,le as _getDependencyGraph,ji as _resolveModules,Mt as assembleGLSLShaderPair,de as capitalize,Te as checkShaderModuleDeprecations,_o as clipShaderPlugin,ro as colors,Vi as combineInjects,Ut as convertToVec4,Xr as dggs,ti as dirlight,po as filterShaderPlugin,Xe as floatColors,Hr as fp32,Kr as fp64,He as fp64LowPart,zt as fp64arithmetic,ge as fp64ify,$e as fp64ifyMatrix4,Ur as fromHalfFloat,Nr as generateShaderForModule,Ne as getGLSLUniformBlocks,Ar as getPassthroughFS,Cr as getQualifierDetails,bt as getShaderInfo,we as getShaderModuleDependencies,ke as getShaderModuleSource,ut as getShaderModuleUniformBlockFields,Pe as getShaderModuleUniformBlockName,pt as getShaderModuleUniformLayoutValidationResult,zi as getShaderModuleUniforms,ai as gouraudMaterial,Co as gpuAnimation,ei as ibl,ye as initializeShaderModule,V as initializeShaderModules,ii as lambertMaterial,K as lighting,Ki as mergeShaderPluginModules,qe as normalizeByteColor3,Gt as normalizeByteColor4,Yo as pbrMaterial,Qo as pbrScene,si as phongMaterial,co as picking,q as preprocess,Dr as random,Wi as resolveShaderPlugins,je as resolveUseByteColors,Ie as scanWGSLInterface,bo as skin,oo as storageColors,Br as toHalfFloat,Lr as typeToChannelCount,Rr as typeToChannelSuffix,dt as validateShaderModuleUniformLayout,Gr as volumeRaymarch,gt as warnIfGLSLUniformBlocksAreNotStd140,$o as waterMaterial};
//# sourceMappingURL=/sm/ddf4ddef5701b5b4aa65ba5d7d794241182ad2c5a90f897b902d0204596dc5df.map
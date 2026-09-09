/**
 * Bundled by jsDelivr using Rollup v4.62.2 and esbuild v0.28.1.
 * Original file: /npm/@luma.gl/gpgpu@9.4.0/dist/operations/webgl/index.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
import{GLSLShaderAssembler as K,fp32 as Q}from"./luma.gl-shadertools@9.4.0-+esm.mjs";import{DynamicBuffer as ee,BufferTransform as $,Model as te}from"./luma.gl-engine@9.4.0-+esm.mjs";import{Buffer as P,getTypedArrayFromDataType as S,getDataTypeFromTypedArray as re,Texture as T}from"./luma.gl-core@9.4.0-+esm.mjs";import{GPUDataView as ne,GPUVector as N,isVertexListGPUVectorFormat as ie,isValueListGPUVectorFormat as se,getGPUVectorFormatInfo as I}from"./luma.gl-gpgpu@9.4.0-gpu-data-+esm.mjs";function O(t,{operations:e,inputs:n}){switch(t.kind){case"input":if(!(t.name in n))throw new Error(`Unknown expression input '${t.name}'`);return;case"literal":if(Array.isArray(t.value)){for(const r of t.value)if(!Number.isFinite(r))throw new Error(`Expression literal array must contain only finite values, got ${r}`)}else if(!Number.isFinite(t.value))throw new Error(`Expression literal must be finite, got ${t.value}`);return;case"call":{const r=e[t.op];if(!r)throw new Error(`Unknown expression op '${t.op}'`);if(t.args.length!==r.arity)throw new Error(`Expression op '${t.op}' expects ${r.arity} args, got ${t.args.length}`);for(const i of t.args)O(i,{operations:e,inputs:n});return}default:{const r=t;throw new Error(`Unsupported expression node ${r.kind}`)}}}function oe(t,e){return O(t,e),A(t,e)}function A(t,e){switch(t.kind){case"input":{const n=e.inputs[t.name];return e.laneIndex<n.size?e.formatInput(t.name):e.formatOutOfBoundsInput(t.name)}case"literal":return e.formatLiteral(t.value);case"call":{const n=e.operations[t.op],r=t.args.map(i=>A(i,e));return e.formatCall(n.symbol,r)}default:{const n=t;throw new Error(`Unsupported expression node ${n.kind}`)}}}const ae={add:{arity:2,symbol:"arithmetic_add"},subtract:{arity:2,symbol:"arithmetic_subtract"},multiply:{arity:2,symbol:"arithmetic_multiply"},divide:{arity:2,symbol:"arithmetic_divide"},pow:{arity:2,symbol:"pow"},sqrt:{arity:1,symbol:"sqrt"},abs:{arity:1,symbol:"abs"},sin:{arity:1,symbol:"sin"},cos:{arity:1,symbol:"cos"},tan:{arity:1,symbol:"arithmetic_tan"},exp:{arity:1,symbol:"exp"},log:{arity:1,symbol:"log"}};class ue{poolSize=20;bufferPools;constructor(){this.bufferPools=new Map}createOrReuse(e,n){if(n>e.limits.maxBufferSize)throw new Error(`Buffer pool cannot allocate ${n} bytes: device.limits.maxBufferSize is ${e.limits.maxBufferSize}`);const r=this.bufferPools.get(e),i=r?r.findIndex(u=>u.byteLength>=n):-1;if(i<0)return e.createBuffer({usage:P.VERTEX|P.STORAGE|P.COPY_DST|P.COPY_SRC,byteLength:n});const[o]=r.splice(i,1);return o}recycle(e){const n=e.device;this.bufferPools.has(n)||this.bufferPools.set(n,[]);const r=this.bufferPools.get(n),i=r.findIndex(o=>o.byteLength>e.byteLength);i<0?r.push(e):r.splice(i,0,e),this.purge()}purge(){for(const[e,n]of this.bufferPools){const r=e.isLost?0:this.poolSize;for(;n.length>r;)n.shift().destroy();n.length===0&&this.bufferPools.delete(e)}}}const b=new ue;class y{static get bufferPoolSize(){return b.poolSize}static set bufferPoolSize(e){if(!Number.isSafeInteger(e)||e<0)throw new Error("GPUDataEvaluator.bufferPoolSize must be a non-negative safe integer");b.poolSize=e,b.purge()}type;size;get offset(){return this._offset}get stride(){return this._stride}normalized;isConstant;length;get byteLength(){return this._byteLength}ValueType;source=null;format;_id;_destroyed=!1;_value;_offset;_stride;_byteLength;_gpuVector;_bufferOwnership="owned";_targetBuffer;static fromArray(e,{type:n,size:r=1,offset:i=0,stride:o=0,normalized:u=!1}){let a=n,s;if(Array.isArray(e)){a=a||"float32";const d=S(a);s=new d(e)}else e instanceof Float64Array?(a="uint32",r*=2,i*=2,o*=2,s=new Uint32Array(e.buffer,e.byteOffset,e.byteLength/4)):(a=a||re(e),s=e);const f=`<${a} * ${r}>`;return new y({id:f,type:a,size:r,offset:i,stride:o,normalized:u,value:s})}static fromConstant(e,n="float32"){const r=S(n);let i;return Array.isArray(e)?i=`[${e.join(",")}]`:(i=String(e),e=[e]),new y({id:i,isConstant:!0,type:n,size:e.length,value:new r(e)})}static fromGPUData(e,n={}){le(e);const r=new ne({buffer:e.buffer,format:e.format,length:e.length,byteOffset:e.byteOffset,byteStride:e.byteStride});return new y({...F(r),id:n.id,gpuData:e})}static fromGPUDataView(e,n={}){return new y({...F(e),id:n.id,buffer:e.buffer})}constructor(e){const{id:n,value:r,buffer:i,gpuData:o,format:u,source:a=null,isConstant:s=!1}=e;if(!a&&!r&&!i&&!o)throw new Error("GPUDataEvaluator must have a value source");let{type:f,size:d,offset:c,stride:l,normalized:h,length:g}=e;if(a instanceof y?(f=f??a.type,d=d??a.size,c=c??a.offset,l=l??a.stride,h=h??a.normalized,g=g??a.length):(d=d??1,c=c??0,h=h??!1,g=s?1:g),!f)throw new Error("GPUDataEvaluator: type not defined");if(this._id=n,this.type=f,this.size=d,this.ValueType=S(this.type),this._offset=c,this._stride=l||this.ValueType.BYTES_PER_ELEMENT*d,this.normalized=h,this.source=a,this.format=u,g===void 0)if(s)g=1;else{if(!r)throw new Error("GPUDataEvaluator: length not defined");g=Math.ceil(r.byteLength/this.stride)}this.isConstant=s,this.length=g;const p=this.ValueType.BYTES_PER_ELEMENT*this.size;this._byteLength=g===0?0:(g-1)*this.stride+p,this._value=r,this._bufferOwnership=a instanceof y||i||o?"borrowed":"owned",o?this._gpuVector=new N({type:"data",name:this._id??"data",format:o.format,data:[o],stride:o.stride,byteStride:o.byteStride,rowByteLength:o.rowByteLength}):i&&(this._gpuVector=this.createGPUVectorView({buffer:i,name:this._id,format:this.format}))}get value(){return this._value||(this.source instanceof y?this.source.value:void 0)}get evaluated(){return!!this._gpuVector}get id(){return this._id}get gpuVector(){if(!this._gpuVector)throw new Error(`${this} not evaluated`);return this._gpuVector}get buffer(){return L(this.gpuVector)}setTargetBuffer({buffer:e,byteOffset:n=0,byteStride:r=this.stride}){if(this._destroyed)throw new Error(`GPUDataEvaluator ${this} already destroyed`);if(this._gpuVector)throw new Error(`GPUDataEvaluator ${this} already evaluated`);if(!this.source||this.source instanceof y)throw new Error("GPUDataEvaluator target buffers require a deferred operation source");this._targetBuffer={buffer:e,byteOffset:n,byteStride:r}}async evaluate(e,n={}){if(this._destroyed)throw new Error(`GPUDataEvaluator ${this} already destroyed`);if(this._gpuVector)return this._gpuVector;let r;if(this.source instanceof y){const i=await this.source.evaluate(e);return this._gpuVector=this.createGPUVectorView({...n,buffer:L(i)}),this._gpuVector}if(r=this._getEvaluationBuffer(e),this._value)r.write(this._value);else{const i=await this.source.execute(e,r);if(!i.success)throw i.error||new Error(`${this.source} evaluation failed`);i.value&&(this._value=i.value)}return this._gpuVector=this.createGPUVectorView({...n,buffer:r}),this._gpuVector}evaluateSync(e,n={}){if(this._destroyed)throw new Error(`GPUDataEvaluator ${this} already destroyed`);if(this._gpuVector)return this._gpuVector;let r;if(this.source instanceof y){const i=this.source.evaluateSync(e);return this._gpuVector=this.createGPUVectorView({...n,buffer:L(i)}),this._gpuVector}if(r=this._getEvaluationBuffer(e),this._value)r.write(this._value);else{const i=this.source.executeSync(e,r);if(!i.success)throw i.error||new Error(`${this.source} evaluation failed`);i.value&&(this._value=i.value)}return this._gpuVector=this.createGPUVectorView({...n,buffer:r}),this._gpuVector}createGPUVectorView(e){const n=e.name??this._id??"vector",r=e.format??this.format??he(this.type,this.size,this.normalized);if(e.interleaved){const i=typeof e.interleaved=="object"&&e.interleaved.attributes?e.interleaved.attributes:de(this);return new N({type:"interleaved",name:n,buffer:e.buffer,format:e.format??this.format,length:this.length,byteOffset:this.offset,byteStride:this.stride,attributes:i,ownsBuffer:!1})}return new N({type:"buffer",name:n,buffer:e.buffer,format:r,length:this.length,stride:this.size,byteOffset:this.offset,byteStride:this.stride,rowByteLength:this.ValueType.BYTES_PER_ELEMENT*this.size,ownsBuffer:!1})}_getEvaluationBuffer(e){const n=this._targetBuffer;if(!n)return b.createOrReuse(e,this.byteLength);if(n.buffer.device!==e)throw new Error("GPUDataEvaluator target buffer belongs to a different device");const r=this.ValueType.BYTES_PER_ELEMENT*this.size,i=this.length===0?0:(this.length-1)*n.byteStride+r;if(n.byteOffset+i>n.buffer.byteLength)throw new Error("GPUDataEvaluator target buffer is too small for the output layout");return this._offset=n.byteOffset,this._stride=n.byteStride,this._byteLength=i,this._bufferOwnership="borrowed",this._targetBuffer=void 0,n.buffer}async readValue(e=0,n){const{ValueType:r}=this,{size:i,offset:o,stride:u,length:a}=this,s=r.BYTES_PER_ELEMENT*i;if(n=n??a,e=Math.max(0,Math.min(a,e)),n=Math.max(e,Math.min(a,n)),this._value)return fe(this,this._value,e,n);const f=n-e;if(f===0)return new r(0);const d=o+e*u,c=u===s?f*s:(f-1)*u+s,l=await this.buffer.readAsync(d,c),h=new r(l.buffer,l.byteOffset,l.byteLength/r.BYTES_PER_ELEMENT);if(u===s)return h;const g=new Uint8Array(s*f);for(let p=0;p<f;p++){const v=p*u;g.set(l.subarray(v,v+s),p*s)}return new r(g.buffer)}async ensureCPUValue(){const e=this.value;if(e)return e;const n=await this.buffer.readAsync(0,this.offset+this.byteLength);if(n.byteLength%this.ValueType.BYTES_PER_ELEMENT!==0)throw new Error(`${this} backing buffer byte length is not aligned to its scalar type`);const r=n.slice();return this._value=new this.ValueType(r.buffer,r.byteOffset,r.byteLength/this.ValueType.BYTES_PER_ELEMENT),this._value}ensureCPUValueSync(){const e=this.value;if(e)return e;throw new Error(`${this} CPU value is not available for synchronous evaluation`)}toString(){return this._id??this.source?.toString()??this.constructor.name}destroy(){this._gpuVector&&(this._bufferOwnership==="owned"&&b.recycle(L(this._gpuVector)),this._gpuVector=void 0),this._targetBuffer=void 0,this._destroyed=!0}}function fe(t,e,n,r){const{ValueType:i,size:o,offset:u,stride:a}=t,s=a/i.BYTES_PER_ELEMENT,f=u/i.BYTES_PER_ELEMENT,d=r-n;if(s===o){const l=f+n*s;return e.subarray(l,l+d*o)}const c=new i(d*o);for(let l=0;l<d;l++){const h=f+(n+l)*s;c.set(e.subarray(h,h+o),l*o)}return c}function le(t){if(!t.format)throw new Error("GPUDataEvaluator.fromGPUData() requires GPUData format metadata");if(ie(t.format)||se(t.format))throw new Error("GPUDataEvaluator.fromGPUData() does not support variable-length input");const n=I(t.format).byteLength;if(t.rowByteLength!==n)throw new Error(`GPUDataEvaluator.fromGPUData() requires rowByteLength ${n} for GPUData`)}function F(t){const e=I(t.format),n=S(e.signedDataType),r=n.BYTES_PER_ELEMENT*e.components;if(e.byteLength!==r)throw new Error(`GPUDataEvaluator does not support packed vertex format ${t.format}: ${e.byteLength} physical bytes cannot expose ${e.components} ${e.signedDataType} components`);if(t.byteOffset%n.BYTES_PER_ELEMENT!==0||t.byteStride%n.BYTES_PER_ELEMENT!==0)throw new Error(`GPUDataEvaluator requires ${t.format} offset and stride aligned to ${n.BYTES_PER_ELEMENT} bytes`);return{type:e.signedDataType,size:e.components,offset:t.byteOffset,stride:t.byteStride,normalized:e.normalized,length:t.length,format:t.format}}function L(t){const e=ce(t).buffer;return e instanceof ee?e.buffer:e}function ce(t){const[e,...n]=t.data;if(!e||n.length>0)throw new Error(`GPUDataEvaluator requires exactly one GPUData chunk for "${t.name}"`);return e}function de(t){const e=[];return M(t,e,{byteOffset:0}),e}function M(t,e,n){const r=t.source;if(r&&!(r instanceof y)&&r.name==="interleave"){for(const i of Object.values(r.inputs))i instanceof y&&M(i,e,n);return}e.push({attribute:t.id??t.toString(),format:Y(t.type,t.size,t.normalized),byteOffset:n.byteOffset}),n.byteOffset+=t.ValueType.BYTES_PER_ELEMENT*t.size}function Y(t,e,n=!1){if(e<1||e>4)throw new Error(`Cannot synthesize a GPUVector vertex format with ${e} components`);let r=t;if(n)switch(t){case"uint8":r="unorm8";break;case"sint8":r="snorm8";break;case"uint16":r="unorm16";break;case"sint16":r="snorm16";break;case"float32":r="float32";break;default:throw new Error(`Unsupported normalized vertex format for ${t}`)}return(r==="uint8"||r==="sint8"||r==="uint16"||r==="sint16"||r==="unorm8"||r==="snorm8"||r==="unorm16"||r==="snorm16")&&e===3?`${r}x3-webgl`:`${r}${e===1?"":`x${e}`}`}function he(t,e,n=!1){return e>=1&&e<=4?Y(t,e,n):void 0}function _(t,e,n=!1){if(n)return e===1?"float":`vec${e}`;switch(t){case"uint8":case"uint16":case"uint32":return e===1?"uint":`uvec${e}`;case"sint8":case"sint16":case"sint32":return e===1?"int":`ivec${e}`;default:return e===1?"float":`vec${e}`}}function C(t,e,n=!1){let r;if(n)switch(t){case"uint8":r="unorm8";break;case"sint8":r="snorm8";break;case"uint16":r="unorm16";break;case"sint16":r="snorm16";break;case"float32":r="float32";break;default:throw new Error(`Unsupported normalized vertex format for ${t}`)}else r=t;return e===1?r:e===3&&!r.startsWith("float32")&&!r.endsWith("32")?`${r}x3-webgl`:`${r}x${e}`}function V(t){switch(t[0]){case"u":return"0u";case"s":return"0";default:return"0."}}function me(t,e){switch(t){case"uint8":case"uint16":case"uint32":return`${Math.trunc(e)}u`;case"sint8":case"sint16":case"sint32":return`${Math.trunc(e)}`;default:return Number.isInteger(e)?`${e}.0`:`${e}`}}function ge(t){switch(t){case"uint8":return"r8uint";case"sint8":return"r8sint";case"uint16":return"r16uint";case"sint16":return"r16sint";case"uint32":return"r32uint";case"sint32":return"r32sint";case"float32":return"r32float";default:throw new Error(`Unsupported WebGL gather texture format for ${t}`)}}function Je(t){return t}function ye(t){switch(t){case"uint32":return"usampler2D";case"sint32":return"isampler2D";case"float32":return"sampler2D";default:throw new Error(`Unsupported WebGL gather sampler type for ${t}`)}}const pe="GPGPU Operation Counts",_e="Transform Runs",Ee=new K;function w({module:t,elementWise:e=!1,expression:n,inputs:r,output:i,operationType:o=i.type,outputBuffer:u}){const a=u.device,s=B("result",i.type,i.size,i.normalized),f=[t,s],d=[],c={},l=_(i.type,1,i.normalized),h=_(o,1,i.normalized);let g="",p=null;const v={TYPE:h,RESULT_LEN:i.size.toString()},z=be(r);for(const[m,E]of z)f.push(D(m,E.type,E.size,E.normalized,o)),d.push(R(m,E)),E instanceof y?c[m]=E.buffer:(p=p||b.createOrReuse(a,u.byteLength),c[m]=p),g+=`TYPE ${m}[${E.size}]; get_${m}(${m});
`,v[`${m.toUpperCase()}_LEN`]=E.size.toString();let x="";if(n)for(let m=0;m<i.size;m++)x+=`result[${m}]=${n(m)};
`;else if(e)for(let m=0;m<i.size;m++){const E=V(h),W=z.map(([Z,J])=>m<J.size?`${Z}[${m}]`:E);x+=`result[${m}]=${t.name}(${W.join(", ")});
`}else x=`${t.name}(${z.map(([m])=>m).join(", ")}, result);`;const j=`#version 300 es

void main() {
${g}
${l} result[${i.size}];
${x}
set_result(result);
}
  `,H=new $(a,{vs:j,shaderAssembler:Ee,defines:v,modules:f,bufferLayout:d,vertexCount:1,instanceCount:i.length,attributes:c,feedbackBufferMode:"interleaved",outputs:s.varyings});a.statsManager.getStats(pe).get(_e).incrementCount(),H.run({inputBuffers:c,outputBuffers:{[s.varyings[0]]:i.offset===0?u:{buffer:u,byteOffset:i.offset,byteLength:i.byteLength}}}),p&&b.recycle(p)}function be(t){return Array.isArray(t)?t.map((e,n)=>[`x${n}`,e]):Object.entries(t)}function D(t,e,n,r=!1,i=e){let o="",u="";for(let s=0;s<n;s+=4){const f=Math.min(n-s,4),d=_(e,f,r);o+=`in ${d} a${t}_${s};
`;for(let c=0;c<f;c++){let l=`a${t}_${s}`;f>1&&(l=`${l}[${c}]`),(r||e!==i)&&(l=`TYPE(${l})`),u+=`v[${s+c}]=${l};
`}}const a=`
${o}
void get_${t}(out TYPE v[${n}]) {
  ${u}
}
`;return{name:t,vs:a}}function R(t,e){const n={name:t,stepMode:e.isConstant?"vertex":"instance",byteStride:e.stride,attributes:[]};for(let r=0;r<e.size;r+=4){const i=Math.min(e.size-r,4);n.attributes.push({attribute:`a${t}_${r}`,format:C(e.type,i,e.normalized),byteOffset:e.offset+e.ValueType.BYTES_PER_ELEMENT*r})}return n}function B(t,e,n,r=!1){const i=[],o=_(e,1,r);let u="",a="";for(let s=0;s<n;s+=4){const f=Math.min(n-s,4),d=_(e,f,r);i.push(`${t}_${s}`),u+=`flat out ${d} ${t}_${s};
`;const c=Array.from({length:f},(l,h)=>s+h);a+=`${t}_${s} = ${d}(${c.map(l=>`v[${l}]`).join(",")});
`}return{name:t,varyings:i,vs:`
${u}
void set_${t}(in ${o} v[${n}]) {
  ${a}
}
`}}const we=`TYPE arithmetic_add(TYPE x, TYPE y) {
  return x + y;
}

TYPE arithmetic_subtract(TYPE x, TYPE y) {
  return x - y;
}

TYPE arithmetic_multiply(TYPE x, TYPE y) {
  return x * y;
}

TYPE arithmetic_divide(TYPE x, TYPE y) {
  return x / y;
}

float arithmetic_tan(float x) {
  return tan_fp32(x);
}
`,G=({inputs:t,output:e,target:n})=>{const r=e.type,i=_(r,1,e.normalized),o=V(i),u=t.namedInputs;return w({module:{name:"arithmetic",dependencies:[Q],vs:we},inputs:u,output:e,operationType:r,outputBuffer:n,expression:a=>oe(t.expression,{operations:ae,inputs:u,laneIndex:a,formatInput:s=>`${s}[${a}]`,formatOutOfBoundsInput:s=>u[s].size===1?`${s}[0]`:o,formatLiteral:s=>{const f=Array.isArray(s)?s[a]??0:s;return`${i}(${me(r,f)})`},formatCall:(s,f)=>`${s}(${f.join(", ")})`})}),{success:!0}},ve="GPGPU Operation Counts",Te="Transform Runs",xe=({inputs:t,output:e,target:n})=>{const{sourceValues:r}=t,i=n.device;if(r.length===0){const c=new e.ValueType(e.length*e.size);return n.write(c),{success:!0,value:c}}if(r.isConstant){const c=r.value,l=new e.ValueType(e.length*e.size);for(let h=0;h<e.length;h++){const g=c[h];l[h*2]=g,l[h*2+1]=g}return n.write(l),{success:!0,value:l}}const o=i.createTexture({width:1,height:e.length,format:"rg32float",usage:T.RENDER|T.COPY_SRC|T.COPY_DST}),u=i.createFramebuffer({colorAttachments:[o]}),a=`#version 300 es

flat out float extent_value;

void main() {
  float sourceValues[SOURCE_VALUES_LEN];
  get_sourceValues(sourceValues);
  extent_value = sourceValues[gl_VertexID];

  float y = (float(gl_VertexID) + 0.5) / float(CHANNEL_COUNT) * 2.0 - 1.0;
  gl_Position = vec4(0.0, y, 0.0, 1.0);
  gl_PointSize = 1.0;
}
  `,s=`#version 300 es

precision highp float;

flat in float extent_value;
out vec2 fragColor;

void main() {
  fragColor = vec2(-extent_value, extent_value);
}
  `,f=new te(i,{vs:a,fs:s,topology:"point-list",parameters:{depthCompare:"always",blend:!0,blendColorSrcFactor:"one",blendColorDstFactor:"one",blendColorOperation:"max",blendAlphaSrcFactor:"one",blendAlphaDstFactor:"one",blendAlphaOperation:"max"},modules:[D("sourceValues",r.type,r.size,r.normalized)],defines:{TYPE:"float",SOURCE_VALUES_LEN:r.size.toString(),CHANNEL_COUNT:e.length.toString()},attributes:{sourceValues:r.buffer},bufferLayout:[R("sourceValues",r)],instanceCount:r.length,vertexCount:e.length,disableWarnings:!0}),d=b.createOrReuse(i,e.byteLength);try{const c=i.beginRenderPass({framebuffer:u,parameters:{viewport:[0,0,1,e.length]},clearColor:[-k,-k,0,0],clearDepth:!1,clearStencil:!1});i.statsManager.getStats(ve).get(Te).incrementCount(),f.draw(c),c.end();const l=i.createCommandEncoder();return l.copyTextureToBuffer({sourceTexture:o,width:1,height:e.length,destinationBuffer:d,byteOffset:0,bytesPerRow:8}),i.submit(l.finish()),G({device:i,inputs:{expression:{kind:"call",op:"multiply",args:[{kind:"input",name:"x"},{kind:"literal",value:[-1,1]}]},namedInputs:{x:new y({buffer:d,size:2,type:"float32",length:e.length})}},output:e,target:n})}finally{f.destroy(),b.recycle(d),u.destroy(),o.destroy()}},k=3e38,$e=({inputs:t,output:e,target:n})=>{const r=t.map((s,f)=>[`x${f}`,s]);Pe(n.device.limits.maxVertexAttributes,r),Se(n.device.limits.maxInterStageShaderVariables,e);const i=r.map(([s,f])=>`in TYPE ${s}[${f.size}]`).join(", ");let o=0;const u=r.map(([s,f])=>{const d=Array.from({length:f.size},(c,l)=>`  result[${o+l}] = ${s}[${l}];`).join(`
`);return o+=f.size,d}).join(`
`),a=`void interleave(${i}, out TYPE result[RESULT_LEN]) {
${u}
}
`;return w({module:{name:"interleave",vs:a},inputs:t,output:e,outputBuffer:n}),{success:!0}};function Pe(t,e){const n=e.reduce((r,[,i])=>r+Math.ceil(i.size/4),0);if(n>t)throw new Error(`interleave() requires ${n} vertex attributes, exceeding device limit ${t}`)}function Se(t,e){if(e.size>t)throw new Error(`interleave() output size ${e.size} exceeds device inter-stage component limit ${t}`)}function Le(){const t=new Uint16Array([255]);return new Uint8Array(t.buffer)[0]>0}const Ve=`#define LE ${Le()?1:0}
const uint F32_NAN = 0xffffffffu;
const uint F32_INF = 0x7f800000u;

// Find first set bit using binary search
// https://en.wikipedia.org/wiki/Find_first_set#CLZ
int countLeadingZeros(uint a) {
  if (a == 0u) return 32;
  int n = 0;
  if ((a & 0xffff0000u) == 0u) { n += 16; a = a << 16; }
  if ((a & 0xff000000u) == 0u) { n += 8;  a = a << 8;  }
  if ((a & 0xf0000000u) == 0u) { n += 4;  a = a << 4;  }
  if ((a & 0xc0000000u) == 0u) { n += 2;  a = a << 2;  }
  if ((a & 0x80000000u) == 0u) return n + 1;
  return n;
}

uint roundShiftRight(uint value, int shift) {
  if (shift <= 0) {
    return value << (-shift);
  }

  if (shift >= 32) {
    if (shift == 32 && value > 0x80000000u) {
      return 1u;
    }
    return 0u;
  }

  uint truncated = value >> shift;
  uint halfShift = 1u << (shift - 1);
  uint remainder = value & ((1u << shift) - 1u);
  if (remainder > halfShift || (remainder == halfShift && (truncated & 1u) == 1u)) {
    return truncated + 1u;
  }
  return truncated;
}

uint makeFloat_(uint sign, int exponent, uint mantissa) {
  return (sign << 31) | (uint(exponent + 127) << 23) | (mantissa & 0x7fffffu);
}

/**
 * Assemble a float32 in bit representation according to IEEE 754
 * https://en.wikipedia.org/wiki/Single-precision_floating-point_format
 */
uint makeFloat(uint sign, int exponent, uint significand) {
  if (significand == 0u) {
    return sign << 31;
  }

  // Remove any extra leading zeros for better precision
  int lead_zeros = countLeadingZeros(significand);
  // Significand is encoded as 1.fraction
  int normalizedExponent = exponent + 31 - lead_zeros;

  if (normalizedExponent > 127) {
    return (sign << 31) | F32_INF;
  }

  uint mantissa;
  if (normalizedExponent >= -126) {
    mantissa = roundShiftRight(significand, 8 - lead_zeros);
    if (mantissa >= 0x1000000u) {
      mantissa >>= 1;
      normalizedExponent++;
      if (normalizedExponent > 127) {
        return (sign << 31) | F32_INF;
      }
    }
    return makeFloat_(sign, normalizedExponent, mantissa);
  }

  int subnormalShift = -149 - exponent;
  mantissa = roundShiftRight(significand, subnormalShift);
  if (mantissa >= 0x800000u) {
    return (sign << 31) | (1u << 23);
  }
  return (sign << 31) | mantissa;
}

/**
 * Parse 8-byte memory as a float64 number according to IEEE 754
 * https://en.wikipedia.org/wiki/Double-precision_floating-point_format
 * Returns 8-byte memory as 2 float32 numbers, consisting of
 * high part: fround(d)
 * low part: d - fround(d)
 */
uvec2 parseAsDouble(uvec2 d) {
  #if LE
  d = d.yx; // to big endian
  #endif

  uint sign = (d[0] >> 31) & 1u; // first bit
  uint exponentBits = (d[0] >> 20) & 0x7ffu;
  int exponent = int(exponentBits) - 1023; // next 11 bits
  uint fractionHigh = d[0] & 0xfffffu;
  uint fractionLow = d[1];

  if (exponentBits == 0x7ffu) {
    if (fractionHigh == 0u && fractionLow == 0u) {
      return uvec2((sign << 31) | F32_INF, F32_NAN);
    }
    return uvec2(F32_NAN);
  }
  
  if (exponentBits == 0u) {
    // All float64 subnormals are too small to survive a float32 split.
    return uvec2(sign << 31);
  }

  if (exponent > 127) {
    return uvec2((sign << 31) | F32_INF, ((1u - sign) << 31) | F32_INF);
  }

  uint hi_part;
  uint low_part;

  // float64 significand has 52 bits
  // float32 significand has 23 bits
  // The significand of the high part is the significand of the double, trimmed
  uint f_hi = 0x800000u | (fractionHigh << 3) | (fractionLow >> 29);
  uint f_low = fractionLow & 0x1fffffffu;

  if (exponent < -126) {
    // For tiny normals, the top 24 significand bits still contribute to the float32
    // high part, but they land in the float32 subnormal range.
    hi_part = makeFloat(sign, exponent - 23, f_hi);

    // The residual keeps the remaining 29 significand bits at the original double scale.
    low_part = makeFloat(sign, exponent - 52, f_low);
    return uvec2(hi_part, low_part);
  }

  bool roundUp = f_low > 0x10000000u || (f_low == 0x10000000u && (f_hi & 1u) == 1u);

  uint f_rounded = f_hi + (roundUp ? 1u : 0u);
  int exponent_hi = exponent;
  if (f_rounded == 0x1000000u) {
    f_rounded = 0x800000u;
    exponent_hi++;
  }

  if (exponent_hi > 127) {
    // Overflows float32 limit
    hi_part = (sign << 31) | F32_INF;
    low_part = ((1u - sign) << 31) | F32_INF;
    return uvec2(hi_part, low_part);
  }
  
  hi_part = makeFloat_(sign, exponent_hi, f_rounded);

  int remainder = int(f_low);
  uint sign_low = sign;
  if (roundUp) {
    remainder -= 0x20000000;
  }
  if (remainder < 0) {
    sign_low = 1u - sign;
    remainder = -remainder;
  }
  low_part = makeFloat(sign_low, exponent - 52, uint(remainder));

  return uvec2(hi_part, low_part);
}

void fround(in uint x[X_LEN], out float result[X_LEN]) {
  int n = X_LEN / 2;
  for (int i = 0; i < n; i++) {
    uvec2 f = parseAsDouble(uvec2(x[i * 2], x[i * 2 + 1]));
    result[i] = uintBitsToFloat(f.x);
    result[i + n] = uintBitsToFloat(f.y);
  }
}
`,Be=({inputs:t,output:e,target:n})=>(w({module:{name:"fround",vs:Ve},inputs:t,output:e,operationType:"uint32",outputBuffer:n}),{success:!0});function q(t,e,n){const r=ye(n),i=_(e,1),o=Array.from({length:t.size},(u,a)=>`  v[${a}] = ${i}(texelFetch(source_values_texture, ivec2(${a}, rowIndex), 0).r);`).join(`
`);return{name:"source_values_texture",vs:`
uniform highp ${r} source_values_texture;
void read_source_values(int rowIndex, out TYPE v[${t.size}]) {
${o}
}
`}}function X(t,e,n){const r=n.createTexture({width:Math.max(t.size,1),height:t.length,format:ge(e),usage:T.SAMPLE|T.COPY_DST});if(t.length===0)return r;const i=n.createCommandEncoder();return i.copyBufferToTexture({sourceBuffer:t.buffer,destinationTexture:r,byteOffset:t.offset,bytesPerRow:t.stride,rowsPerImage:t.length,size:[t.size,t.length,1]}),n.submit(i.finish()),r}const ze=async({inputs:t,output:e,target:n})=>{const{ids:r,sourceValues:i}=t,o=n.device,u=B("result",e.type,e.size),a=_(r.type,1),s=_(e.type,1),f=e.type,d=X(i,f,o),c=`#version 300 es

void main() {
  INDEX_TYPE ids[1];
  get_ids(ids);
  TYPE result[${e.size}];
  gather(ids, result);
  set_result(result);
}
  `,l=new $(o,{vs:c,defines:{INDEX_TYPE:a,TYPE:s,RESULT_LEN:e.size.toString(),SOURCE_VALUES_ROWS:i.length.toString()},modules:[Ne(r,a),q(i,e.type,f),Ie(e.type),u],bindings:{source_values_texture:d},bufferLayout:[Ue(r)],vertexCount:1,instanceCount:e.length,feedbackBufferMode:"interleaved",outputs:u.varyings});try{return l.run({inputBuffers:{ids:r.buffer},outputBuffers:{[u.varyings[0]]:n}}),{success:!0}}finally{l.destroy(),d.destroy()}};function Ne(t,e){const n=_(t.type,1);let r="aids_0";return t.type!==Oe(e)&&(r=`${e}(${r})`),{name:"ids",vs:`
in ${n} aids_0;
void get_ids(out INDEX_TYPE v[1]) {
  v[0] = ${r};
}
`}}function Ue(t){return{name:"ids",stepMode:t.isConstant?"vertex":"instance",byteStride:t.stride,attributes:[{attribute:"aids_0",format:C(t.type,1,t.normalized),byteOffset:t.offset}]}}function Ie(t){return{name:"gather",vs:`
void zero_result(out TYPE result[RESULT_LEN]) {
  for (int i = 0; i < RESULT_LEN; i++) {
    result[i] = ${V(t)};
  }
}

void gather(in INDEX_TYPE ids[1], out TYPE result[RESULT_LEN]) {
  int sourceIndex = int(ids[0]);
  if (sourceIndex < 0 || sourceIndex >= SOURCE_VALUES_ROWS) {
    zero_result(result);
    return;
  }
  read_source_values(sourceIndex, result);
}
`}}function Oe(t){switch(t){case"uint":return"uint32";case"int":return"sint32";default:return"float32"}}const Ae=`void row_dot(in TYPE x[X_LEN], in TYPE y[Y_LEN], out float result[1]) {
  float sum = 0.0;
  for (int i = 0; i < X_LEN; i++) {
    sum += float(x[i]) * float(y[i]);
  }
  result[0] = sum;
}
`,Fe=({inputs:t,output:e,target:n})=>(w({module:{name:"row_dot",vs:Ae},inputs:t,output:e,operationType:"float32",outputBuffer:n}),{success:!0}),Me=`void equalAll(in TYPE x[X_LEN], in TYPE y[Y_LEN], out uint result[1]) {
  uint allEqual = uint(1);
  for (int i = 0; i < X_LEN; i++) {
    if (x[i] != y[i]) {
      allEqual = uint(0);
      break;
    }
  }
  result[0] = allEqual;
}
`,Ye=({inputs:t,output:e,target:n})=>(w({module:{name:"equalAll",vs:Me},inputs:t,output:e,operationType:e.type==="uint32"?t.x.type:e.type,outputBuffer:n}),{success:!0}),Ce=`void row_length(in TYPE x[X_LEN], out float result[1]) {
  float sum = 0.0;
  for (int i = 0; i < X_LEN; i++) {
    sum += float(x[i]) * float(x[i]);
  }
  result[0] = sqrt(sum);
}
`,De=({inputs:t,output:e,target:n})=>(w({module:{name:"row_length",vs:Ce},inputs:t,output:e,operationType:"float32",outputBuffer:n}),{success:!0}),Re=async({inputs:t,output:e,target:n})=>{const{segments:r}=t,i=n.device,o=B("result",e.type,e.size),u=r.type,a=X(r,u,i),s=new $(i,{vs:`#version 300 es

void main() {
  TYPE result[RESULT_LEN];
  segmentedMap(result);
  set_result(result);
}
`,defines:{TYPE:"uint",RESULT_LEN:e.size.toString(),SEGMENTS_LENGTH:r.length.toString()},modules:[q(r,e.type,u),Ge(),o],bindings:{source_values_texture:a},vertexCount:1,instanceCount:e.length,feedbackBufferMode:"interleaved",outputs:o.varyings});try{return s.run({outputBuffers:{[o.varyings[0]]:n}}),{success:!0}}finally{s.destroy(),a.destroy()}};function Ge(){return{name:"segmentedMap",vs:`
uint read_segment_start(int segmentIndex) {
  TYPE value[1];
  read_source_values(segmentIndex, value);
  return uint(value[0]);
}

void segmentedMap(out TYPE result[RESULT_LEN]) {
  uint vertexIndex = uint(gl_InstanceID);
  int low = 0;
  int high = SEGMENTS_LENGTH;

  while (low < high) {
    int mid = low + (high - low) / 2;
    uint midStart = read_segment_start(mid);
    if (midStart <= vertexIndex) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  uint segmentIndex = uint(max(low - 1, 0));
  uint segmentStart = read_segment_start(int(segmentIndex));
  result[0] = segmentIndex;
  result[1] = vertexIndex - segmentStart;
}
`}}const ke=async({inputs:t,output:e,target:n})=>{const r=_(e.type,1,e.normalized),i=V(r);return w({module:{name:"select",vs:""},inputs:t,output:e,operationType:e.type,outputBuffer:n,expression:o=>{const u=U("condition",t.condition,o,i),a=U("whenTrue",t.whenTrue,o,i),s=U("whenFalse",t.whenFalse,o,i);return`(${u} != ${i} ? ${a} : ${s})`}}),{success:!0}};function U(t,e,n,r){return n<e.size?`${t}[${n}]`:e.size===1?`${t}[0]`:r}const qe=({inputs:t,output:e,target:n})=>{const r=B("result",e.type,e.size),i=new $(n.device,{vs:`#version 300 es

void main() {
  int result[1];
  result[0] = START + gl_InstanceID * STEP;
  set_result(result);
}
`,defines:{START:t.start.toString(),STEP:t.step.toString()},modules:[r],vertexCount:1,instanceCount:e.length,feedbackBufferMode:"interleaved",outputs:r.varyings});try{return i.run({outputBuffers:{[r.varyings[0]]:n}}),{success:!0}}finally{i.destroy()}},Xe=({inputs:t,output:e,target:n})=>{const{columns:r}=t;return w({module:{name:"swizzle",vs:"// swizzle expression handled inline"},expression:i=>`x[${r[i]}]`,inputs:{x:t.x},output:e,outputBuffer:n}),{success:!0}};export{G as arithmetic,Fe as dot,Ye as equalAll,xe as extent,Be as fround,ze as gather,$e as interleave,De as length,Re as segmentedMap,ke as select,qe as sequence,Xe as swizzle};
//# sourceMappingURL=/sm/808a8f7a869b007a2417a4311e3e94284d7e216e0b5a080ea8de53c36d811873.map
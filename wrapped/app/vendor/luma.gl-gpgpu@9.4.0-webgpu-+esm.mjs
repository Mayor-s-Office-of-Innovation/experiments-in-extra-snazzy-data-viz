/**
 * Bundled by jsDelivr using Rollup v4.62.2 and esbuild v0.28.1.
 * Original file: /npm/@luma.gl/gpgpu@9.4.0/dist/operations/webgpu/index.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
import{WGSLShaderAssembler as H,fp32 as K}from"./luma.gl-shadertools@9.4.0-+esm.mjs";import{Computation as v,DynamicBuffer as J}from"./luma.gl-engine@9.4.0-+esm.mjs";import{Buffer as I,getTypedArrayFromDataType as S,getDataTypeFromTypedArray as Q}from"./luma.gl-core@9.4.0-+esm.mjs";import{GPUDataView as ee,GPUVector as z,isVertexListGPUVectorFormat as te,isValueListGPUVectorFormat as re,getGPUVectorFormatInfo as R}from"./luma.gl-gpgpu@9.4.0-gpu-data-+esm.mjs";function k(t,{operations:e,inputs:r}){switch(t.kind){case"input":if(!(t.name in r))throw new Error(`Unknown expression input '${t.name}'`);return;case"literal":if(Array.isArray(t.value)){for(const n of t.value)if(!Number.isFinite(n))throw new Error(`Expression literal array must contain only finite values, got ${n}`)}else if(!Number.isFinite(t.value))throw new Error(`Expression literal must be finite, got ${t.value}`);return;case"call":{const n=e[t.op];if(!n)throw new Error(`Unknown expression op '${t.op}'`);if(t.args.length!==n.arity)throw new Error(`Expression op '${t.op}' expects ${n.arity} args, got ${t.args.length}`);for(const s of t.args)k(s,{operations:e,inputs:r});return}default:{const n=t;throw new Error(`Unsupported expression node ${n.kind}`)}}}function ne(t,e){return k(t,e),Y(t,e)}function Y(t,e){switch(t.kind){case"input":{const r=e.inputs[t.name];return e.laneIndex<r.size?e.formatInput(t.name):e.formatOutOfBoundsInput(t.name)}case"literal":return e.formatLiteral(t.value);case"call":{const r=e.operations[t.op],n=t.args.map(s=>Y(s,e));return e.formatCall(r.symbol,n)}default:{const r=t;throw new Error(`Unsupported expression node ${r.kind}`)}}}const se={add:{arity:2,symbol:"arithmetic_add"},subtract:{arity:2,symbol:"arithmetic_subtract"},multiply:{arity:2,symbol:"arithmetic_multiply"},divide:{arity:2,symbol:"arithmetic_divide"},pow:{arity:2,symbol:"pow"},sqrt:{arity:1,symbol:"sqrt"},abs:{arity:1,symbol:"abs"},sin:{arity:1,symbol:"sin"},cos:{arity:1,symbol:"cos"},tan:{arity:1,symbol:"arithmetic_tan"},exp:{arity:1,symbol:"exp"},log:{arity:1,symbol:"log"}},ie=65535;function P(t,e){const r=oe(e),n=Math.max(1,Math.ceil(t)),s=Math.min(n,r),i=Math.min(Math.ceil(n/s),r),a=Math.ceil(n/s/i);if(a>r)throw new Error(`WebGPU dispatch requires ${n} workgroups, exceeding the 3D dispatch limit of ${r} per dimension`);return{x:s,y:i,z:a}}function F(t,e="workgroupId"){return`((${e}.z * ${t.y}u + ${e}.y) * ${t.x}u + ${e}.x)`}function L(t,e,r="workgroupId",n="localId"){return`(${F(t,r)} * ${e}u + ${n}.x)`}function oe(t){return Number.isFinite(t)&&t>0?Math.floor(t):ie}function T(t,e){switch(t){case"u32":return`${e}u`;case"f32":return Number.isInteger(e)?`${e}.0`:`${e}`;default:return`${e}`}}function ae(t,e){switch(t){case"uint32":return T("u32",Math.trunc(e));case"sint32":return`${Math.trunc(e)}`;case"float32":return T("f32",e);default:throw new Error(`WebGPU operations only support 32-bit output types, got ${t}`)}}function V(t){switch(t){case"uint32":return"0u";case"sint32":return"0";case"float32":return"0.0";default:throw new Error(`WebGPU operations only support 32-bit output types, got ${t}`)}}function g(t){switch(t){case"uint32":return"u32";case"sint32":return"i32";case"float32":return"f32";default:throw new Error(`WebGPU operations only support 32-bit storage types, got ${t}`)}}const U=64,ue="GPGPU Operation Counts",fe="Computation Runs",ce=new H;function _({module:t,elementWise:e=!1,expression:r,inputs:n,output:s,operationType:i=s.type,outputBuffer:a}){if(!t.source)throw new Error(`WebGPU computation ${t.name} requires WGSL source`);const f=ye(n),o=f.map(([y,w])=>({name:y,input:w})),u=o.filter(({input:y})=>!y.isConstant).map((y,w)=>({...y,index:w})),c=g(i),l=g(s.type),d={TYPE:c,RESULT_LEN:s.size.toString()},h=P(Math.ceil(s.length/U),a.device.limits.maxComputeWorkgroupsPerDimension);for(const[y,w]of f)d[`${y.toUpperCase()}_LEN`]=w.size.toString();const m=`
${Ee(t.source,d)}
${u.map(({name:y,input:w,index:Z})=>le(y,w,Z)).join(`
`)}
${o.map(({name:y,input:w})=>de(y,w,i)).join(`
`)}
${he(s,u.length)}
${ge(s)}

@compute @workgroup_size(${U}) fn main(
  @builtin(workgroup_id) workgroupId: vec3<u32>,
  @builtin(local_invocation_id) localId: vec3<u32>
) {
  let rowIndex = ${L(h,U)};
  if (rowIndex >= ${s.length}u) {
    return;
  }

${o.map(({name:y})=>`  let ${y} = read_${y}(rowIndex);`).join(`
`)}
  var result: array<${l}, ${s.size}>;
${me(t.name,f,s,e,r)}
  write_result(rowIndex, result);
}
`,E=new v(a.device,{source:m,modules:t.dependencies,shaderAssembler:ce,shaderLayout:{bindings:[...u.map(({name:y},w)=>({name:y,type:"storage",group:0,location:w})),{name:"result",type:"storage",group:0,location:u.length}]}}),b=Object.fromEntries(u.map(({name:y,input:w})=>[y,w.buffer]));b.result=a,E.setBindings(b);const A=a.device.beginComputePass({});a.device.statsManager.getStats(ue).get(fe).incrementCount(),E.dispatch(A,h.x,h.y,h.z),A.end(),a.device.submit(),E.destroy()}function le(t,e,r){if(e.isConstant)return"";const n=g(e.type);return`@group(0) @binding(${r}) var<storage, read> ${t}: array<${n}>;`}function de(t,e,r){const n=g(r),s=e.type===r?"":n,i=e.stride/e.ValueType.BYTES_PER_ELEMENT,a=e.offset/e.ValueType.BYTES_PER_ELEMENT;return e.isConstant?`fn read_${t}(_rowIndex: u32) -> array<${n}, ${e.size}> {
  return array<${n}, ${e.size}>(${pe(e,s)});
}`:`fn read_${t}(rowIndex: u32) -> array<${n}, ${e.size}> {
  var value: array<${n}, ${e.size}>;
  let rowOffset = ${a}u + rowIndex * ${i}u;
${Array.from({length:e.size},(f,o)=>s?`  value[${o}] = ${s}(${t}[rowOffset + ${o}u]);`:`  value[${o}] = ${t}[rowOffset + ${o}u];`).join(`
`)}
  return value;
}`}function he(t,e){const r=g(t.type);return`@group(0) @binding(${e}) var<storage, read_write> result: array<${r}>;`}function ge(t){const e=t.stride/t.ValueType.BYTES_PER_ELEMENT,r=t.offset/t.ValueType.BYTES_PER_ELEMENT;return`fn write_result(rowIndex: u32, value: array<${g(t.type)}, ${t.size}>) {
  let rowOffset = ${r}u + rowIndex * ${e}u;
${Array.from({length:t.size},(s,i)=>`  result[rowOffset + ${i}u] = value[${i}];`).join(`
`)}
}`}function me(t,e,r,n,s){let i="";if(s)for(let a=0;a<r.size;a++)i+=`  result[${a}] = ${s(a)};
`;else if(n){const a=V(r.type),f=g(r.type);for(let o=0;o<r.size;o++){const u=e.map(([c,l])=>o<l.size?g(l.type)===f?`${c}[${o}]`:`${f}(${c}[${o}])`:a);i+=`  result[${o}] = ${t}(${u.join(", ")});
`}}else i+=`result = ${t}(${e.map(([a])=>a).join(", ")});`;return i.trimEnd()}function ye(t){return Array.isArray(t)?t.map((e,r)=>[`x${r}`,e]):Object.entries(t)}function pe(t,e){const r=t.value;if(!r)throw new Error(`Constant input ${t} is missing CPU values`);return Array.from({length:t.size},(n,s)=>T(e,r[s]??0)).join(", ")}function Ee(t,e){for(const r in e)t=t.replaceAll(`{${r}}`,e[r]);return t}const we=`fn arithmetic_add(x: {TYPE}, y: {TYPE}) -> {TYPE} {
  return x + y;
}

fn arithmetic_subtract(x: {TYPE}, y: {TYPE}) -> {TYPE} {
  return x - y;
}

fn arithmetic_multiply(x: {TYPE}, y: {TYPE}) -> {TYPE} {
  return x * y;
}

fn arithmetic_divide(x: {TYPE}, y: {TYPE}) -> {TYPE} {
  return x / y;
}

fn arithmetic_tan(x: f32) -> f32 {
  return tan_fp32(x);
}
`,$e=({inputs:t,output:e,target:r})=>{const n=e.type,s=g(n),i=V(n),a=t.namedInputs;return _({module:{name:"arithmetic",source:we,dependencies:[K]},inputs:a,output:e,operationType:n,outputBuffer:r,expression:f=>ne(t.expression,{operations:se,inputs:a,laneIndex:f,formatInput:o=>`${o}[${f}]`,formatOutOfBoundsInput:o=>a[o].size===1?`${o}[0]`:i,formatLiteral:o=>{const u=Array.isArray(o)?o[f]??0:o;return`${s}(${ae(n,u)})`},formatCall:(o,u)=>`${o}(${u.join(", ")})`})}),{success:!0}},_e=`fn row_dot(x: array<{TYPE}, {X_LEN}>, y: array<{TYPE}, {Y_LEN}>) -> array<f32, 1> {
  var sum = 0.0;
  for (var i = 0u; i < {X_LEN}u; i = i + 1u) {
    sum += f32(x[i]) * f32(y[i]);
  }
  return array<f32, 1>(sum);
}
`,xe=({inputs:t,output:e,target:r})=>(_({module:{name:"row_dot",source:_e},inputs:t,output:e,operationType:"float32",outputBuffer:r}),{success:!0}),be=`fn equalAll(x: array<{TYPE}, {X_LEN}>, y: array<{TYPE}, {Y_LEN}>) -> array<u32, 1> {
  var allEqual = 1u;
  for (var i = 0u; i < {X_LEN}u; i = i + 1u) {
    if (x[i] != y[i]) {
      allEqual = 0u;
      break;
    }
  }
  return array<u32, 1>(allEqual);
}
`,ve=({inputs:t,output:e,target:r})=>(_({module:{name:"equalAll",source:be},inputs:t,output:e,operationType:t.x.type,outputBuffer:r}),{success:!0});class Pe{poolSize=20;bufferPools;constructor(){this.bufferPools=new Map}createOrReuse(e,r){if(r>e.limits.maxBufferSize)throw new Error(`Buffer pool cannot allocate ${r} bytes: device.limits.maxBufferSize is ${e.limits.maxBufferSize}`);const n=this.bufferPools.get(e),s=n?n.findIndex(a=>a.byteLength>=r):-1;if(s<0)return e.createBuffer({usage:I.VERTEX|I.STORAGE|I.COPY_DST|I.COPY_SRC,byteLength:r});const[i]=n.splice(s,1);return i}recycle(e){const r=e.device;this.bufferPools.has(r)||this.bufferPools.set(r,[]);const n=this.bufferPools.get(r),s=n.findIndex(i=>i.byteLength>e.byteLength);s<0?n.push(e):n.splice(s,0,e),this.purge()}purge(){for(const[e,r]of this.bufferPools){const n=e.isLost?0:this.poolSize;for(;r.length>n;)r.shift().destroy();r.length===0&&this.bufferPools.delete(e)}}}const x=new Pe;class p{static get bufferPoolSize(){return x.poolSize}static set bufferPoolSize(e){if(!Number.isSafeInteger(e)||e<0)throw new Error("GPUDataEvaluator.bufferPoolSize must be a non-negative safe integer");x.poolSize=e,x.purge()}type;size;get offset(){return this._offset}get stride(){return this._stride}normalized;isConstant;length;get byteLength(){return this._byteLength}ValueType;source=null;format;_id;_destroyed=!1;_value;_offset;_stride;_byteLength;_gpuVector;_bufferOwnership="owned";_targetBuffer;static fromArray(e,{type:r,size:n=1,offset:s=0,stride:i=0,normalized:a=!1}){let f=r,o;if(Array.isArray(e)){f=f||"float32";const c=S(f);o=new c(e)}else e instanceof Float64Array?(f="uint32",n*=2,s*=2,i*=2,o=new Uint32Array(e.buffer,e.byteOffset,e.byteLength/4)):(f=f||Q(e),o=e);const u=`<${f} * ${n}>`;return new p({id:u,type:f,size:n,offset:s,stride:i,normalized:a,value:o})}static fromConstant(e,r="float32"){const n=S(r);let s;return Array.isArray(e)?s=`[${e.join(",")}]`:(s=String(e),e=[e]),new p({id:s,isConstant:!0,type:r,size:e.length,value:new n(e)})}static fromGPUData(e,r={}){Ie(e);const n=new ee({buffer:e.buffer,format:e.format,length:e.length,byteOffset:e.byteOffset,byteStride:e.byteStride});return new p({...D(n),id:r.id,gpuData:e})}static fromGPUDataView(e,r={}){return new p({...D(e),id:r.id,buffer:e.buffer})}constructor(e){const{id:r,value:n,buffer:s,gpuData:i,format:a,source:f=null,isConstant:o=!1}=e;if(!f&&!n&&!s&&!i)throw new Error("GPUDataEvaluator must have a value source");let{type:u,size:c,offset:l,stride:d,normalized:h,length:m}=e;if(f instanceof p?(u=u??f.type,c=c??f.size,l=l??f.offset,d=d??f.stride,h=h??f.normalized,m=m??f.length):(c=c??1,l=l??0,h=h??!1,m=o?1:m),!u)throw new Error("GPUDataEvaluator: type not defined");if(this._id=r,this.type=u,this.size=c,this.ValueType=S(this.type),this._offset=l,this._stride=d||this.ValueType.BYTES_PER_ELEMENT*c,this.normalized=h,this.source=f,this.format=a,m===void 0)if(o)m=1;else{if(!n)throw new Error("GPUDataEvaluator: length not defined");m=Math.ceil(n.byteLength/this.stride)}this.isConstant=o,this.length=m;const E=this.ValueType.BYTES_PER_ELEMENT*this.size;this._byteLength=m===0?0:(m-1)*this.stride+E,this._value=n,this._bufferOwnership=f instanceof p||s||i?"borrowed":"owned",i?this._gpuVector=new z({type:"data",name:this._id??"data",format:i.format,data:[i],stride:i.stride,byteStride:i.byteStride,rowByteLength:i.rowByteLength}):s&&(this._gpuVector=this.createGPUVectorView({buffer:s,name:this._id,format:this.format}))}get value(){return this._value||(this.source instanceof p?this.source.value:void 0)}get evaluated(){return!!this._gpuVector}get id(){return this._id}get gpuVector(){if(!this._gpuVector)throw new Error(`${this} not evaluated`);return this._gpuVector}get buffer(){return B(this.gpuVector)}setTargetBuffer({buffer:e,byteOffset:r=0,byteStride:n=this.stride}){if(this._destroyed)throw new Error(`GPUDataEvaluator ${this} already destroyed`);if(this._gpuVector)throw new Error(`GPUDataEvaluator ${this} already evaluated`);if(!this.source||this.source instanceof p)throw new Error("GPUDataEvaluator target buffers require a deferred operation source");this._targetBuffer={buffer:e,byteOffset:r,byteStride:n}}async evaluate(e,r={}){if(this._destroyed)throw new Error(`GPUDataEvaluator ${this} already destroyed`);if(this._gpuVector)return this._gpuVector;let n;if(this.source instanceof p){const s=await this.source.evaluate(e);return this._gpuVector=this.createGPUVectorView({...r,buffer:B(s)}),this._gpuVector}if(n=this._getEvaluationBuffer(e),this._value)n.write(this._value);else{const s=await this.source.execute(e,n);if(!s.success)throw s.error||new Error(`${this.source} evaluation failed`);s.value&&(this._value=s.value)}return this._gpuVector=this.createGPUVectorView({...r,buffer:n}),this._gpuVector}evaluateSync(e,r={}){if(this._destroyed)throw new Error(`GPUDataEvaluator ${this} already destroyed`);if(this._gpuVector)return this._gpuVector;let n;if(this.source instanceof p){const s=this.source.evaluateSync(e);return this._gpuVector=this.createGPUVectorView({...r,buffer:B(s)}),this._gpuVector}if(n=this._getEvaluationBuffer(e),this._value)n.write(this._value);else{const s=this.source.executeSync(e,n);if(!s.success)throw s.error||new Error(`${this.source} evaluation failed`);s.value&&(this._value=s.value)}return this._gpuVector=this.createGPUVectorView({...r,buffer:n}),this._gpuVector}createGPUVectorView(e){const r=e.name??this._id??"vector",n=e.format??this.format??Ve(this.type,this.size,this.normalized);if(e.interleaved){const s=typeof e.interleaved=="object"&&e.interleaved.attributes?e.interleaved.attributes:Le(this);return new z({type:"interleaved",name:r,buffer:e.buffer,format:e.format??this.format,length:this.length,byteOffset:this.offset,byteStride:this.stride,attributes:s,ownsBuffer:!1})}return new z({type:"buffer",name:r,buffer:e.buffer,format:n,length:this.length,stride:this.size,byteOffset:this.offset,byteStride:this.stride,rowByteLength:this.ValueType.BYTES_PER_ELEMENT*this.size,ownsBuffer:!1})}_getEvaluationBuffer(e){const r=this._targetBuffer;if(!r)return x.createOrReuse(e,this.byteLength);if(r.buffer.device!==e)throw new Error("GPUDataEvaluator target buffer belongs to a different device");const n=this.ValueType.BYTES_PER_ELEMENT*this.size,s=this.length===0?0:(this.length-1)*r.byteStride+n;if(r.byteOffset+s>r.buffer.byteLength)throw new Error("GPUDataEvaluator target buffer is too small for the output layout");return this._offset=r.byteOffset,this._stride=r.byteStride,this._byteLength=s,this._bufferOwnership="borrowed",this._targetBuffer=void 0,r.buffer}async readValue(e=0,r){const{ValueType:n}=this,{size:s,offset:i,stride:a,length:f}=this,o=n.BYTES_PER_ELEMENT*s;if(r=r??f,e=Math.max(0,Math.min(f,e)),r=Math.max(e,Math.min(f,r)),this._value)return Te(this,this._value,e,r);const u=r-e;if(u===0)return new n(0);const c=i+e*a,l=a===o?u*o:(u-1)*a+o,d=await this.buffer.readAsync(c,l),h=new n(d.buffer,d.byteOffset,d.byteLength/n.BYTES_PER_ELEMENT);if(a===o)return h;const m=new Uint8Array(o*u);for(let E=0;E<u;E++){const b=E*a;m.set(d.subarray(b,b+o),E*o)}return new n(m.buffer)}async ensureCPUValue(){const e=this.value;if(e)return e;const r=await this.buffer.readAsync(0,this.offset+this.byteLength);if(r.byteLength%this.ValueType.BYTES_PER_ELEMENT!==0)throw new Error(`${this} backing buffer byte length is not aligned to its scalar type`);const n=r.slice();return this._value=new this.ValueType(n.buffer,n.byteOffset,n.byteLength/this.ValueType.BYTES_PER_ELEMENT),this._value}ensureCPUValueSync(){const e=this.value;if(e)return e;throw new Error(`${this} CPU value is not available for synchronous evaluation`)}toString(){return this._id??this.source?.toString()??this.constructor.name}destroy(){this._gpuVector&&(this._bufferOwnership==="owned"&&x.recycle(B(this._gpuVector)),this._gpuVector=void 0),this._targetBuffer=void 0,this._destroyed=!0}}function Te(t,e,r,n){const{ValueType:s,size:i,offset:a,stride:f}=t,o=f/s.BYTES_PER_ELEMENT,u=a/s.BYTES_PER_ELEMENT,c=n-r;if(o===i){const d=u+r*o;return e.subarray(d,d+c*i)}const l=new s(c*i);for(let d=0;d<c;d++){const h=u+(r+d)*o;l.set(e.subarray(h,h+i),d*i)}return l}function Ie(t){if(!t.format)throw new Error("GPUDataEvaluator.fromGPUData() requires GPUData format metadata");if(te(t.format)||re(t.format))throw new Error("GPUDataEvaluator.fromGPUData() does not support variable-length input");const r=R(t.format).byteLength;if(t.rowByteLength!==r)throw new Error(`GPUDataEvaluator.fromGPUData() requires rowByteLength ${r} for GPUData`)}function D(t){const e=R(t.format),r=S(e.signedDataType),n=r.BYTES_PER_ELEMENT*e.components;if(e.byteLength!==n)throw new Error(`GPUDataEvaluator does not support packed vertex format ${t.format}: ${e.byteLength} physical bytes cannot expose ${e.components} ${e.signedDataType} components`);if(t.byteOffset%r.BYTES_PER_ELEMENT!==0||t.byteStride%r.BYTES_PER_ELEMENT!==0)throw new Error(`GPUDataEvaluator requires ${t.format} offset and stride aligned to ${r.BYTES_PER_ELEMENT} bytes`);return{type:e.signedDataType,size:e.components,offset:t.byteOffset,stride:t.byteStride,normalized:e.normalized,length:t.length,format:t.format}}function B(t){const e=Se(t).buffer;return e instanceof J?e.buffer:e}function Se(t){const[e,...r]=t.data;if(!e||r.length>0)throw new Error(`GPUDataEvaluator requires exactly one GPUData chunk for "${t.name}"`);return e}function Le(t){const e=[];return W(t,e,{byteOffset:0}),e}function W(t,e,r){const n=t.source;if(n&&!(n instanceof p)&&n.name==="interleave"){for(const s of Object.values(n.inputs))s instanceof p&&W(s,e,r);return}e.push({attribute:t.id??t.toString(),format:j(t.type,t.size,t.normalized),byteOffset:r.byteOffset}),r.byteOffset+=t.ValueType.BYTES_PER_ELEMENT*t.size}function j(t,e,r=!1){if(e<1||e>4)throw new Error(`Cannot synthesize a GPUVector vertex format with ${e} components`);let n=t;if(r)switch(t){case"uint8":n="unorm8";break;case"sint8":n="snorm8";break;case"uint16":n="unorm16";break;case"sint16":n="snorm16";break;case"float32":n="float32";break;default:throw new Error(`Unsupported normalized vertex format for ${t}`)}return(n==="uint8"||n==="sint8"||n==="uint16"||n==="sint16"||n==="unorm8"||n==="snorm8"||n==="unorm16"||n==="snorm16")&&e===3?`${n}x3-webgl`:`${n}${e===1?"":`x${e}`}`}function Ve(t,e,r=!1){return e>=1&&e<=4?j(t,e,r):void 0}const $=64;function G(t,e,r){const n=g(e.type);return`@group(0) @binding(${r}) var<storage, read> ${t}: array<${n}>;`}function q(t,e,r,n=t){const s=g(r);if(e.isConstant){const u=e.value;if(!u)throw new Error(`Constant input ${e} is missing CPU values`);return`fn read_${n}(_sourceIndex: u32) -> array<${s}, ${e.size}> {
  return array<${s}, ${e.size}>(${Array.from({length:e.size},(c,l)=>T(s,u[l]??0)).join(", ")});
}`}const i=e.stride/e.ValueType.BYTES_PER_ELEMENT,a=e.offset/e.ValueType.BYTES_PER_ELEMENT,o=g(e.type)===s?"":`${s}`;return`fn read_${n}(sourceIndex: u32) -> array<${s}, ${e.size}> {
  var value: array<${s}, ${e.size}>;
  let rowOffset = ${a}u + sourceIndex * ${i}u;
${Array.from({length:e.size},(u,c)=>o?`  value[${c}] = ${o}(${t}[rowOffset + ${c}u]);`:`  value[${c}] = ${t}[rowOffset + ${c}u];`).join(`
`)}
  return value;
}`}function X(t,e){return q("sourceValues",t,e,"source_values")}function M(t,e){const r=g(t.type);return`@group(0) @binding(${e}) var<storage, read_write> result: array<${r}>;`}function O(t){const e=t.stride/t.ValueType.BYTES_PER_ELEMENT,r=t.offset/t.ValueType.BYTES_PER_ELEMENT;return`fn write_result(rowIndex: u32, value: array<${g(t.type)}, ${t.size}>) {
  let rowOffset = ${r}u + rowIndex * ${e}u;
${Array.from({length:t.size},(s,i)=>`  result[rowOffset + ${i}u] = value[${i}];`).join(`
`)}
}`}function Be(t,e){const r=V(t);return`fn zero_result() -> array<${g(t)}, ${e}> {
  var result: array<${g(t)}, ${e}>;
${Array.from({length:e},(n,s)=>`  result[${s}] = ${r};`).join(`
`)}
  return result;
}`}const ze=({inputs:t,output:e,target:r})=>{const{sourceValues:n}=t;if(n.length===0){const o=new e.ValueType(e.length*e.size);return r.write(o),{success:!0,value:o}}if(n.isConstant){const o=n.value;if(!o)throw new Error(`Constant input ${n} is missing CPU values`);const u=new e.ValueType(e.length*e.size);for(let c=0;c<e.length;c++){const l=o[c];u[c*2]=l,u[c*2+1]=l}return r.write(u),{success:!0,value:u}}const s=[];let i=n,a="raw",f=n.length;try{for(;;){const o=Math.ceil(f/$),u=e.length*o,c=o===1?r:x.createOrReuse(r.device,u*e.stride);if(o>1&&s.push(c),Ue({input:i,inputMode:a,inputGroupCount:f,channelCount:e.length,outputType:e.type,outputBuffer:c,outputLength:u,outputStride:e.stride,outputOffset:e.offset}),o===1)break;i=new p({buffer:c,type:e.type,size:2,length:u}),a="partial",f=o}return{success:!0}}finally{for(const o of s)x.recycle(o)}};function Ue({input:t,inputMode:e,inputGroupCount:r,channelCount:n,outputType:s,outputBuffer:i,outputLength:a,outputStride:f,outputOffset:o}){const u=g(s),c=P(a,i.device.limits.maxComputeWorkgroupsPerDimension),l=new p({buffer:i,type:s,size:2,length:a,stride:f,offset:o}),d=`
${t.isConstant?"":G("sourceValues",t,0)}
${X(t,s)}
${M(l,t.isConstant?0:1)}
${O(l)}
${Ge(e,s,n,r)}

var<workgroup> sharedMin: array<${u}, ${$}>;
var<workgroup> sharedMax: array<${u}, ${$}>;

@compute @workgroup_size(${$}) fn main(
  @builtin(workgroup_id) workgroupId: vec3<u32>,
  @builtin(local_invocation_id) localId: vec3<u32>
) {
  let outputRowIndex = ${F(c)};
  if (outputRowIndex >= ${a}u) {
    return;
  }

  let channelIndex = outputRowIndex % ${n}u;
  let outputGroupIndex = outputRowIndex / ${n}u;
  let inputGroupIndex = outputGroupIndex * ${$}u + localId.x;

  let result = extent_pass(channelIndex, inputGroupIndex);
  sharedMin[localId.x] = result[0];
  sharedMax[localId.x] = result[1];
  workgroupBarrier();

  var stride = ${Math.floor($/2)}u;
  loop {
    if (stride == 0u) {
      break;
    }
    if (localId.x < stride) {
      let compareIndex = localId.x + stride;
      if (sharedMin[compareIndex] < sharedMin[localId.x]) {
        sharedMin[localId.x] = sharedMin[compareIndex];
      }
      if (sharedMax[compareIndex] > sharedMax[localId.x]) {
        sharedMax[localId.x] = sharedMax[compareIndex];
      }
    }
    workgroupBarrier();
    stride = stride / 2u;
  }

  if (localId.x == 0u) {
    write_result(outputRowIndex, array<${u}, 2>(sharedMin[0], sharedMax[0]));
  }
}
`,h=new v(i.device,{source:d,shaderLayout:{bindings:[...t.isConstant?[]:[{name:"sourceValues",type:"storage",group:0,location:0}],{name:"result",type:"storage",group:0,location:t.isConstant?0:1}]}}),m={result:i};t.isConstant||(m.sourceValues=t.buffer),h.setBindings(m);const E=i.device.beginComputePass({});h.dispatch(E,c.x,c.y,c.z),E.end(),i.device.submit(),h.destroy()}function Ge(t,e,r,n){const s=g(e),[i,a]=Me(e);return t==="raw"?`fn extent_pass(channelIndex: u32, inputGroupIndex: u32) -> array<${s}, 2> {
  var result: array<${s}, 2>;
  result[0] = ${i};
  result[1] = ${a};

  if (inputGroupIndex < ${n}u) {
    let value = read_source_values(inputGroupIndex);
    result[0] = value[channelIndex];
    result[1] = value[channelIndex];
  }

  return result;
}`:`fn extent_pass(channelIndex: u32, inputGroupIndex: u32) -> array<${s}, 2> {
  var result: array<${s}, 2>;
  result[0] = ${i};
  result[1] = ${a};

  if (inputGroupIndex < ${n}u) {
    let rowIndex = inputGroupIndex * ${r}u + channelIndex;
    let value = read_source_values(rowIndex);
    result[0] = value[0];
    result[1] = value[1];
  }

  return result;
}`}function Me(t){switch(t){case"uint32":return["0xffffffffu","0u"];case"sint32":return["2147483647","-2147483648"];case"float32":return["3.402823e38","-3.402823e38"];default:throw new Error(`Unsupported WebGPU extent type for ${t}`)}}function Oe(){const t=new Uint16Array([255]);return new Uint8Array(t.buffer)[0]>0}const Ce=`const LE: bool = ${Oe()?"true":"false"};
const F32_NAN: u32 = 0xffffffffu;
const F32_INF: u32 = 0x7f800000u;

fn roundShiftRight(value: u32, shift: i32) -> u32 {
  if (shift <= 0) {
    return value << u32(-shift);
  }

  if (shift >= 32) {
    if (shift == 32 && value > 0x80000000u) {
      return 1u;
    }
    return 0u;
  }

  let shiftU32 = u32(shift);
  let truncated = value >> shiftU32;
  let halfShift = 1u << u32(shift - 1);
  let remainder = value & ((1u << shiftU32) - 1u);
  if (remainder > halfShift || (remainder == halfShift && (truncated & 1u) == 1u)) {
    return truncated + 1u;
  }
  return truncated;
}

fn makeFloatImmediate(sign: u32, exponent: i32, mantissa: u32) -> u32 {
  return (sign << 31u) | (u32(exponent + 127) << 23u) | (mantissa & 0x7fffffu);
}

fn makeFloat(sign: u32, exponent: i32, significand: u32) -> u32 {
  if (significand == 0u) {
    return sign << 31u;
  }

  let leadingZeros = i32(countLeadingZeros(significand));
  var normalizedExponent = exponent + 31 - leadingZeros;

  if (normalizedExponent > 127) {
    return (sign << 31u) | F32_INF;
  }

  var mantissa: u32;
  if (normalizedExponent >= -126) {
    mantissa = roundShiftRight(significand, 8 - leadingZeros);
    if (mantissa >= 0x1000000u) {
      mantissa = mantissa >> 1u;
      normalizedExponent += 1;
      if (normalizedExponent > 127) {
        return (sign << 31u) | F32_INF;
      }
    }
    return makeFloatImmediate(sign, normalizedExponent, mantissa);
  }

  let subnormalShift = -149 - exponent;
  mantissa = roundShiftRight(significand, subnormalShift);
  if (mantissa >= 0x800000u) {
    return (sign << 31u) | (1u << 23u);
  }
  return (sign << 31u) | mantissa;
}

fn parseAsDouble(words: vec2<u32>) -> vec2<u32> {
  var d = words;
  if (LE) {
    d = d.yx;
  }

  let sign = (d.x >> 31u) & 1u;
  let exponentBits = (d.x >> 20u) & 0x7ffu;
  let exponent = i32(exponentBits) - 1023;
  let fractionHigh = d.x & 0xfffffu;
  let fractionLow = d.y;

  if (exponentBits == 0x7ffu) {
    if (fractionHigh == 0u && fractionLow == 0u) {
      return vec2<u32>((sign << 31u) | F32_INF, F32_NAN);
    }
    return vec2<u32>(F32_NAN);
  }

  if (exponentBits == 0u) {
    return vec2<u32>(sign << 31u);
  }

  if (exponent > 127) {
    return vec2<u32>((sign << 31u) | F32_INF, ((1u - sign) << 31u) | F32_INF);
  }

  let highSignificand = 0x800000u | (fractionHigh << 3u) | (fractionLow >> 29u);
  let lowSignificand = fractionLow & 0x1fffffffu;

  if (exponent < -126) {
    let highPart = makeFloat(sign, exponent - 23, highSignificand);
    let lowPart = makeFloat(sign, exponent - 52, lowSignificand);
    return vec2<u32>(highPart, lowPart);
  }

  let roundUp = lowSignificand > 0x10000000u ||
    (lowSignificand == 0x10000000u && (highSignificand & 1u) == 1u);

  var roundedSignificand = highSignificand + select(0u, 1u, roundUp);
  var highExponent = exponent;
  if (roundedSignificand == 0x1000000u) {
    roundedSignificand = 0x800000u;
    highExponent += 1;
  }

  if (highExponent > 127) {
    return vec2<u32>((sign << 31u) | F32_INF, ((1u - sign) << 31u) | F32_INF);
  }

  let highPart = makeFloatImmediate(sign, highExponent, roundedSignificand);

  var remainder = i32(lowSignificand);
  var lowSign = sign;
  if (roundUp) {
    remainder -= 0x20000000;
  }
  if (remainder < 0) {
    lowSign = 1u - sign;
    remainder = -remainder;
  }

  let lowPart = makeFloat(lowSign, exponent - 52, u32(remainder));
  return vec2<u32>(highPart, lowPart);
}

fn fround(x: array<u32, {X_LEN}>) -> array<f32, {RESULT_LEN}> {
  var result: array<f32, {RESULT_LEN}>;
  let n = {X_LEN}u / 2u;
  for (var i = 0u; i < n; i = i + 1u) {
    let parts = parseAsDouble(vec2<u32>(x[i * 2u], x[i * 2u + 1u]));
    result[i] = bitcast<f32>(parts.x);
    result[i + n] = bitcast<f32>(parts.y);
  }
  return result;
}
`,Ne=({inputs:t,output:e,target:r})=>(_({module:{name:"fround",source:Ce},inputs:t,output:e,operationType:"uint32",outputBuffer:r}),{success:!0}),Ae=async({inputs:t,output:e,target:r})=>{const{ids:n,sourceValues:s}=t,i=g(n.type),a=[];n.isConstant||a.push({name:"ids",input:n,index:a.length}),s.isConstant||a.push({name:"sourceValues",input:s,index:a.length});const f=P(Math.ceil(e.length/$),r.device.limits.maxComputeWorkgroupsPerDimension),o=`
${a.map(({name:d,input:h,index:m})=>G(d,h,m)).join(`
`)}
${Re(n,i)}
${X(s,e.type)}
${M(e,a.length)}
${O(e)}
${Be(e.type,e.size)}
${ke(n.type,e.type,e.size,s.length)}

@compute @workgroup_size(${$}) fn main(
  @builtin(workgroup_id) workgroupId: vec3<u32>,
  @builtin(local_invocation_id) localId: vec3<u32>
) {
  let rowIndex = ${L(f,$)};
  if (rowIndex >= ${e.length}u) {
    return;
  }

  let idsValue = read_ids(rowIndex);
  let result = gather(idsValue);
  write_result(rowIndex, result);
}
`,u=new v(r.device,{source:o,shaderLayout:{bindings:[...a.map(({name:d,index:h})=>({name:d,type:"storage",group:0,location:h})),{name:"result",type:"storage",group:0,location:a.length}]}}),c={};n.isConstant||(c.ids=n.buffer),s.isConstant||(c.sourceValues=s.buffer),c.result=r,u.setBindings(c);const l=r.device.beginComputePass({});return u.dispatch(l,f.x,f.y,f.z),l.end(),r.device.submit(),u.destroy(),{success:!0}};function Re(t,e){if(t.isConstant){const s=t.value;if(!s)throw new Error(`Constant input ${t} is missing CPU values`);return`fn read_ids(_rowIndex: u32) -> ${e} {
  return ${T(e,s[0]??0)};
}`}const r=t.stride/t.ValueType.BYTES_PER_ELEMENT,n=t.offset/t.ValueType.BYTES_PER_ELEMENT;return`fn read_ids(rowIndex: u32) -> ${e} {
  let rowOffset = ${n}u + rowIndex * ${r}u;
  return ids[rowOffset];
}`}function ke(t,e,r,n){const s=g(t),i=g(e);return`fn gather(idsValue: ${s}) -> array<${i}, ${r}> {
  let sourceIndex = ${s==="u32"?"i32(idsValue)":s==="i32"?"idsValue":"i32(idsValue)"};
  if (sourceIndex < 0 || sourceIndex >= ${n}) {
    return zero_result();
  }
  return read_source_values(u32(sourceIndex));
}`}const Ye=async({inputs:t,output:e,target:r})=>{const{segments:n}=t,s=n.isConstant?[]:[{name:"segments",input:n,index:0}],i=P(Math.ceil(e.length/$),r.device.limits.maxComputeWorkgroupsPerDimension),a=`
${s.map(({name:c,input:l,index:d})=>G(c,l,d)).join(`
`)}
${q("segments",n,"uint32")}
${M(e,s.length)}
${O(e)}
${Fe(n.length)}

@compute @workgroup_size(${$}) fn main(
  @builtin(workgroup_id) workgroupId: vec3<u32>,
  @builtin(local_invocation_id) localId: vec3<u32>
) {
  let rowIndex = ${L(i,$)};
  if (rowIndex >= ${e.length}u) {
    return;
  }

  let result = segmented_map(rowIndex);
  write_result(rowIndex, result);
}
`,f=new v(r.device,{source:a,shaderLayout:{bindings:[...s.map(({name:c,index:l})=>({name:c,type:"storage",group:0,location:l})),{name:"result",type:"storage",group:0,location:s.length}]}}),o=Object.fromEntries(s.map(({name:c,input:l})=>[c,l.buffer]));o.result=r,f.setBindings(o);const u=r.device.beginComputePass({});return f.dispatch(u,i.x,i.y,i.z),u.end(),r.device.submit(),f.destroy(),{success:!0}};function Fe(t){return`fn segmented_map(vertexIndex: u32) -> array<u32, 2> {
  var low = 0i;
  var high = ${t}i;
  while (low < high) {
    let mid = low + (high - low) / 2i;
    let midStart = read_segments(u32(mid))[0];
    if (midStart <= vertexIndex) {
      low = mid + 1i;
    } else {
      high = mid;
    }
  }

  let segmentIndex = u32(max(low - 1i, 0i));
  let segmentStart = read_segments(segmentIndex)[0];
  return array<u32, 2>(segmentIndex, vertexIndex - segmentStart);
}`}const De=({inputs:t,output:e,target:r})=>{const n=t.map((o,u)=>[`x${u}`,o]);We(r.device.limits,n);const s=n.map(([o,u])=>`${o}: array<{TYPE}, ${u.size}>`).join(", ");let i=0;const a=n.map(([o,u])=>{const c=Array.from({length:u.size},(l,d)=>`  out[${i+d}] = ${o}[${d}];`).join(`
`);return i+=u.size,c}).join(`
`),f=`fn interleave(${s}) -> array<{TYPE}, {RESULT_LEN}> {
  var out: array<{TYPE}, {RESULT_LEN}>;
${a}
  return out;
}
`;return _({module:{name:"interleave",source:f},inputs:t,output:e,outputBuffer:r}),{success:!0}};function We(t,e){const n=e.filter(([,s])=>!s.isConstant).length+1;if(n>t.maxStorageBuffersPerShaderStage)throw new Error(`interleave() requires ${n} storage buffers, exceeding device limit ${t.maxStorageBuffersPerShaderStage}`);if(n>t.maxBindingsPerBindGroup)throw new Error(`interleave() requires ${n} bindings, exceeding bind group limit ${t.maxBindingsPerBindGroup}`)}const je=`fn row_length(x: array<{TYPE}, {X_LEN}>) -> array<f32, 1> {
  var sum = 0.0;
  for (var i = 0u; i < {X_LEN}u; i = i + 1u) {
    sum += f32(x[i]) * f32(x[i]);
  }
  return array<f32, 1>(sqrt(sum));
}
`,qe=({inputs:t,output:e,target:r})=>(_({module:{name:"row_length",source:je},inputs:t,output:e,operationType:"float32",outputBuffer:r}),{success:!0}),Xe=async({inputs:t,output:e,target:r})=>{const n=V(e.type);return _({module:{name:"select",source:`// inline expression select
`},inputs:t,output:e,operationType:e.type,outputBuffer:r,expression:s=>{const i=C("condition",t.condition,s,n),a=C("whenTrue",t.whenTrue,s,n);return`select(${C("whenFalse",t.whenFalse,s,n)}, ${a}, ${i} != ${n})`}}),{success:!0}};function C(t,e,r,n){return r<e.size?`${t}[${r}]`:e.size===1?`${t}[0]`:n}const N=64,Ze=({inputs:t,output:e,target:r})=>{const n=P(Math.ceil(e.length/N),r.device.limits.maxComputeWorkgroupsPerDimension),s=`@group(0) @binding(0) var<storage, read_write> result: array<i32>;

@compute @workgroup_size(${N}) fn main(
  @builtin(workgroup_id) workgroupId: vec3<u32>,
  @builtin(local_invocation_id) localId: vec3<u32>
) {
  let rowIndex = ${L(n,N)};
  if (rowIndex >= ${e.length}u) {
    return;
  }

  let rowOffset = ${e.offset/e.ValueType.BYTES_PER_ELEMENT}u + rowIndex * ${e.stride/e.ValueType.BYTES_PER_ELEMENT}u;
  result[rowOffset] = ${t.start} + i32(rowIndex) * ${t.step};
}
`,i=new v(r.device,{source:s,shaderLayout:{bindings:[{name:"result",type:"storage",group:0,location:0}]}});i.setBindings({result:r});const a=r.device.beginComputePass({});return i.dispatch(a,n.x,n.y,n.z),a.end(),r.device.submit(),i.destroy(),{success:!0}},He=({inputs:t,output:e,target:r})=>{const{columns:n}=t;return _({module:{name:"swizzle",source:"// swizzle expression handled inline"},expression:s=>`x[${n[s]}]`,inputs:{x:t.x},output:e,outputBuffer:r}),{success:!0}};export{$e as arithmetic,xe as dot,ve as equalAll,ze as extent,Ne as fround,Ae as gather,De as interleave,qe as length,Ye as segmentedMap,Xe as select,Ze as sequence,He as swizzle};
//# sourceMappingURL=/sm/35c0d34442aa29ca79611cb2c8e61aa4fe81bbe5e64176dbb546c7ae9daac07c.map
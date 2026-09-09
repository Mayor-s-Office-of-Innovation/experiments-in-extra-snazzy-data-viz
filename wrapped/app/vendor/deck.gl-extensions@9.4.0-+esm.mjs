/**
 * Bundled by jsDelivr using Rollup v4.62.2 and esbuild v0.28.1.
 * Original file: /npm/@deck.gl/extensions@9.4.0/dist/index.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
import{project as b,LayerExtension as T,_deepEqual as R,log as S,_memoize as Ne,_mergeShaders as ce,WebMercatorViewport as N,fp64LowPart as de,_LayersPass as U,OrthographicViewport as Ue,COORDINATE_SYSTEM as j,_GlobeViewport as fe,_PickLayersPass as je}from"./deck.gl-core@9.4.0-+esm.mjs";import{Model as Ve}from"./luma.gl-engine@9.4.0-+esm.mjs";import{fp64 as ue}from"./luma.gl-shadertools@9.4.0-+esm.mjs";import{vec3 as F,vec4 as ze,equals as he}from"./math.gl-core@4.1.0-+esm.mjs";import"./luma.gl-webgl@9.4.0-constants-+esm.mjs";const pe=`layout(std140) uniform brushingUniforms {
  bool enabled;
  highp int target;
  vec2 mousePos;
  float radius;
} brushing;
`,Ge=`
  in vec2 brushingTargets;

  out float brushing_isVisible;

  bool brushing_isPointInRange(vec2 position) {
    if (!brushing.enabled) {
      return true;
    }
    vec2 source_commonspace = project_position(position);
    vec2 target_commonspace = project_position(brushing.mousePos);
    float distance = length((target_commonspace - source_commonspace) / project.commonUnitsPerMeter.xy);

    return distance <= brushing.radius;
  }

  bool brushing_arePointsInRange(vec2 sourcePos, vec2 targetPos) {
    return brushing_isPointInRange(sourcePos) || brushing_isPointInRange(targetPos);
  }

  void brushing_setVisible(bool visible) {
    brushing_isVisible = float(visible);
  }
`,He=`
${pe}
${Ge}
`,We=`
  in float brushing_isVisible;
`,$e=`
${pe}
${We}
`,Ye={source:0,target:1,custom:2,source_target:3},Ke={"vs:DECKGL_FILTER_GL_POSITION":`
    vec2 brushingTarget;
    vec2 brushingSource;
    if (brushing.target == 3) {
      brushingTarget = geometry.worldPositionAlt.xy;
      brushingSource = geometry.worldPosition.xy;
    } else if (brushing.target == 0) {
      brushingTarget = geometry.worldPosition.xy;
    } else if (brushing.target == 1) {
      brushingTarget = geometry.worldPositionAlt.xy;
    } else {
      brushingTarget = brushingTargets;
    }
    bool visible;
    if (brushing.target == 3) {
      visible = brushing_arePointsInRange(brushingSource, brushingTarget);
    } else {
      visible = brushing_isPointInRange(brushingTarget);
    }
    brushing_setVisible(visible);
  `,"fs:DECKGL_FILTER_COLOR":`
    if (brushing.enabled && brushing_isVisible < 0.5) {
      discard;
    }
  `};var Ze={name:"brushing",dependencies:[b],vs:He,fs:$e,inject:Ke,getUniforms:o=>{if(!o||!("viewport"in o))return{};const{brushingEnabled:e=!0,brushingRadius:t=1e4,brushingTarget:i="source",mousePosition:a,viewport:s}=o;return{enabled:!!(e&&a&&s.containsPixel(a)),radius:t,target:Ye[i]||0,mousePos:a?s.unproject([a.x-s.x,a.y-s.y]):[0,0]}},uniformTypes:{enabled:"i32",target:"i32",mousePos:"vec2<f32>",radius:"f32"}};const qe={getBrushingTarget:{type:"accessor",value:[0,0]},brushingTarget:"source",brushingEnabled:!0,brushingRadius:1e4};class V extends T{getShaders(){return{modules:[Ze]}}initializeState(e,t){const i=this.getAttributeManager();i&&i.add({brushingTargets:{size:2,stepMode:"dynamic",accessor:"getBrushingTarget"}});const a=()=>{this.getCurrentLayer()?.setNeedsRedraw()};this.state.onMouseMove=a,e.deck&&e.deck.eventManager.on({pointermove:a,pointerleave:a})}finalizeState(e,t){if(e.deck){const i=this.state.onMouseMove;e.deck.eventManager.off({pointermove:i,pointerleave:i})}}draw(e,t){const{viewport:i,mousePosition:a}=e.context,{brushingEnabled:s,brushingRadius:r,brushingTarget:l}=this.props,n={viewport:i,mousePosition:a,brushingEnabled:s,brushingRadius:r,brushingTarget:l};this.setShaderModuleProps({brushing:n})}}V.defaultProps=qe,V.extensionName="BrushingExtension";const ge=`layout(std140) uniform dataFilterUniforms {
  bool useSoftMargin;
  bool enabled;
  bool transformSize;
  bool transformColor;
  vec4 min;
  vec4 softMin;
  vec4 softMax;
  vec4 max;
  vec4 min64High;
  vec4 max64High;
  highp uvec4 categoryBitMask;
} dataFilter;
`,Xe=`
#ifdef DATAFILTER_TYPE
  in DATAFILTER_TYPE filterValues;
#ifdef DATAFILTER_DOUBLE
  in DATAFILTER_TYPE filterValues64Low;
#endif
#endif

#ifdef DATACATEGORY_TYPE
  in DATACATEGORY_TYPE filterCategoryValues;
#endif

out float dataFilter_value;

#ifdef DATAFILTER_TYPE
  float dataFilter_getMin(float _) {
    return dataFilter.min.x;
  }
  vec2 dataFilter_getMin(vec2 _) {
    return dataFilter.min.xy;
  }
  vec3 dataFilter_getMin(vec3 _) {
    return dataFilter.min.xyz;
  }
  vec4 dataFilter_getMin(vec4 _) {
    return dataFilter.min;
  }

  float dataFilter_getSoftMin(float _) {
    return dataFilter.softMin.x;
  }
  vec2 dataFilter_getSoftMin(vec2 _) {
    return dataFilter.softMin.xy;
  }
  vec3 dataFilter_getSoftMin(vec3 _) {
    return dataFilter.softMin.xyz;
  }
  vec4 dataFilter_getSoftMin(vec4 _) {
    return dataFilter.softMin;
  }

  float dataFilter_getSoftMax(float _) {
    return dataFilter.softMax.x;
  }
  vec2 dataFilter_getSoftMax(vec2 _) {
    return dataFilter.softMax.xy;
  }
  vec3 dataFilter_getSoftMax(vec3 _) {
    return dataFilter.softMax.xyz;
  }
  vec4 dataFilter_getSoftMax(vec4 _) {
    return dataFilter.softMax;
  }

  float dataFilter_getMax(float _) {
    return dataFilter.max.x;
  }
  vec2 dataFilter_getMax(vec2 _) {
    return dataFilter.max.xy;
  }
  vec3 dataFilter_getMax(vec3 _) {
    return dataFilter.max.xyz;
  }
  vec4 dataFilter_getMax(vec4 _) {
    return dataFilter.max;
  }

  float dataFilter_getMin64High(float _) {
    return dataFilter.min64High.x;
  }
  vec2 dataFilter_getMin64High(vec2 _) {
    return dataFilter.min64High.xy;
  }
  vec3 dataFilter_getMin64High(vec3 _) {
    return dataFilter.min64High.xyz;
  }
  vec4 dataFilter_getMin64High(vec4 _) {
    return dataFilter.min64High;
  }

  float dataFilter_getMax64High(float _) {
    return dataFilter.max64High.x;
  }
  vec2 dataFilter_getMax64High(vec2 _) {
    return dataFilter.max64High.xy;
  }
  vec3 dataFilter_getMax64High(vec3 _) {
    return dataFilter.max64High.xyz;
  }
  vec4 dataFilter_getMax64High(vec4 _) {
    return dataFilter.max64High;
  }
#endif

float dataFilter_reduceValue(float value) {
  return value;
}
float dataFilter_reduceValue(vec2 value) {
  return min(value.x, value.y);
}
float dataFilter_reduceValue(vec3 value) {
  return min(min(value.x, value.y), value.z);
}
float dataFilter_reduceValue(vec4 value) {
  return min(min(value.x, value.y), min(value.z, value.w));
}

#ifdef DATAFILTER_TYPE
  void dataFilter_setValue(DATAFILTER_TYPE valueFromMin, DATAFILTER_TYPE valueFromMax) {
    DATAFILTER_TYPE dataFilter_min = dataFilter_getMin(valueFromMin);
    DATAFILTER_TYPE dataFilter_softMin = dataFilter_getSoftMin(valueFromMin);
    DATAFILTER_TYPE dataFilter_softMax = dataFilter_getSoftMax(valueFromMin);
    DATAFILTER_TYPE dataFilter_max = dataFilter_getMax(valueFromMin);
    if (dataFilter.useSoftMargin) {
      // smoothstep results are undefined if edge0 \u2265 edge1
      // Fallback to ignore filterSoftRange if it is truncated by filterRange
      DATAFILTER_TYPE leftInRange = mix(
        smoothstep(dataFilter_min, dataFilter_softMin, valueFromMin),
        step(dataFilter_min, valueFromMin),
        step(dataFilter_softMin, dataFilter_min)
      );
      DATAFILTER_TYPE rightInRange = mix(
        1.0 - smoothstep(dataFilter_softMax, dataFilter_max, valueFromMax),
        step(valueFromMax, dataFilter_max),
        step(dataFilter_max, dataFilter_softMax)
      );
      dataFilter_value = dataFilter_reduceValue(leftInRange * rightInRange);
    } else {
      dataFilter_value = dataFilter_reduceValue(
        step(dataFilter_min, valueFromMin) * step(valueFromMax, dataFilter_max)
      );
    }
  }
#endif

#ifdef DATACATEGORY_TYPE
  void dataFilter_setCategoryValue(DATACATEGORY_TYPE category) {
    #if DATACATEGORY_CHANNELS == 1 // One 128-bit mask
    uint dataFilter_masks = dataFilter.categoryBitMask[category / 32u];
    #elif DATACATEGORY_CHANNELS == 2 // Two 64-bit masks
    uvec2 dataFilter_masks = uvec2(
      dataFilter.categoryBitMask[category.x / 32u],
      dataFilter.categoryBitMask[category.y / 32u + 2u]
    );
    #elif DATACATEGORY_CHANNELS == 3 // Three 32-bit masks
    uvec3 dataFilter_masks = dataFilter.categoryBitMask.xyz;
    #else // Four 32-bit masks
    uvec4 dataFilter_masks = dataFilter.categoryBitMask;
    #endif

    // Shift mask and extract relevant bits
    DATACATEGORY_TYPE dataFilter_bits = DATACATEGORY_TYPE(dataFilter_masks) >> (category & 31u);
    dataFilter_bits &= 1u;

    #if DATACATEGORY_CHANNELS == 1
    if (dataFilter_bits == 0u) dataFilter_value = 0.0;
    #else
    if (any(equal(dataFilter_bits, DATACATEGORY_TYPE(0u)))) dataFilter_value = 0.0;
    #endif
  }
#endif
`,me=`
${ge}
${Xe}
`,Je=`
in float dataFilter_value;
`,ve=`
${ge}
${Je}
`;function _e(o){if(!o||!("extensions"in o))return{};const{filterRange:e=[-1,1],filterEnabled:t=!0,filterTransformSize:i=!0,filterTransformColor:a=!0,categoryBitMask:s}=o,r=o.filterSoftRange||e,l=n=>Array.isArray(n)?[n[0]||0,n[1]||0,n[2]||0,n[3]||0]:[n,0,0,0];return{...Number.isFinite(e[0])?{min:l(e[0]),softMin:l(r[0]),softMax:l(r[1]),max:l(e[1])}:{min:l(e.map(n=>n[0])),softMin:l(r.map(n=>n[0])),softMax:l(r.map(n=>n[1])),max:l(e.map(n=>n[1]))},enabled:t,useSoftMargin:!!o.filterSoftRange,transformSize:t&&i,transformColor:t&&a,...s&&{categoryBitMask:s}}}function Qe(o){if(!o||!("extensions"in o))return{};const e=_e(o),t=e.min.map(Math.fround);e.min=e.min.map((a,s)=>a-t[s]),e.softMin=e.softMin.map((a,s)=>a-t[s]),e.min64High=t;const i=e.max.map(Math.fround);return e.max=e.max.map((a,s)=>a-i[s]),e.softMax=e.softMax.map((a,s)=>a-i[s]),e.max64High=i,e}const ye={"vs:#main-start":`
    dataFilter_value = 1.0;
    if (dataFilter.enabled) {
      #ifdef DATAFILTER_TYPE
        #ifdef DATAFILTER_DOUBLE
          dataFilter_setValue(
            filterValues - dataFilter_getMin64High(filterValues) + filterValues64Low,
            filterValues - dataFilter_getMax64High(filterValues) + filterValues64Low
          );
        #else
          dataFilter_setValue(filterValues, filterValues);
        #endif
      #endif

      #ifdef DATACATEGORY_TYPE
        dataFilter_setCategoryValue(filterCategoryValues);
      #endif
    }
  `,"vs:#main-end":`
    if (dataFilter_value == 0.0) {
      gl_Position = vec4(0.);
    }
  `,"vs:DECKGL_FILTER_SIZE":`
    if (dataFilter.transformSize) {
      size = size * dataFilter_value;
    }
  `,"fs:DECKGL_FILTER_COLOR":`
    if (dataFilter_value == 0.0) discard;
    if (dataFilter.transformColor) {
      color.a *= dataFilter_value;
    }
  `};function Pe(o){return{useSoftMargin:"i32",enabled:"i32",transformSize:"i32",transformColor:"i32",min:"vec4<f32>",softMin:"vec4<f32>",softMax:"vec4<f32>",max:"vec4<f32>",min64High:"vec4<f32>",max64High:"vec4<f32>",categoryBitMask:"vec4<u32>"}}const et={name:"dataFilter",vs:me,fs:ve,inject:ye,getUniforms:_e,uniformTypesFromOptions:Pe},tt={name:"dataFilter",vs:me,fs:ve,inject:ye,getUniforms:Qe,uniformTypesFromOptions:Pe},it=`#version 300 es
#define SHADER_NAME data-filter-vertex-shader

#ifdef FLOAT_TARGET
  in float filterIndices;
  in float filterPrevIndices;
#else
  in vec2 filterIndices;
  in vec2 filterPrevIndices;
#endif

out vec4 vColor;
const float component = 1.0 / 255.0;

void main() {
  #ifdef FLOAT_TARGET
    dataFilter_value *= float(filterIndices != filterPrevIndices);
    gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
    vColor = vec4(0.0, 0.0, 0.0, 1.0);
  #else
    // Float texture is not supported: pack result into 4 channels x 256 px x 64px
    dataFilter_value *= float(filterIndices.x != filterPrevIndices.x);
    float col = filterIndices.x;
    float row = filterIndices.y * 4.0;
    float channel = floor(row);
    row = fract(row);
    vColor = component * vec4(bvec4(channel == 0.0, channel == 1.0, channel == 2.0, channel == 3.0));
    gl_Position = vec4(col * 2.0 - 1.0, row * 2.0 - 1.0, 0.0, 1.0);
  #endif
  gl_PointSize = 1.0;
}
`,at=`#version 300 es
#define SHADER_NAME data-filter-fragment-shader
precision highp float;

in vec4 vColor;

out vec4 fragColor;

void main() {
  if (dataFilter_value < 0.5) {
    discard;
  }
  fragColor = vColor;
}
`,st=["float32-renderable-webgl","texture-blend-float-webgl"];function rt(o){return st.every(e=>o.features.has(e))}function ot(o,e){return e?o.createFramebuffer({width:1,height:1,colorAttachments:[o.createTexture({format:"rgba32float",dimension:"2d",width:1,height:1})]}):o.createFramebuffer({width:256,height:64,colorAttachments:[o.createTexture({format:"rgba8unorm",dimension:"2d",width:256,height:64})]})}function nt(o,e,t,i){return t.defines.NON_INSTANCED_MODEL=1,i&&(t.defines.FLOAT_TARGET=1),new Ve(o,{id:"data-filter-aggregation-model",vertexCount:1,isInstanced:!1,topology:"point-list",disableWarnings:!0,vs:it,fs:at,bufferLayout:e,...t})}const lt={blend:!0,blendColorSrcFactor:"one",blendColorDstFactor:"one",blendAlphaSrcFactor:"one",blendAlphaDstFactor:"one",blendColorOperation:"add",blendAlphaOperation:"add",depthCompare:"never"},ct={getFilterValue:{type:"accessor",value:0},getFilterCategory:{type:"accessor",value:0},onFilteredItemsChange:{type:"function",value:null,optional:!0},filterEnabled:!0,filterRange:[-1,1],filterSoftRange:null,filterCategories:[0],filterTransformSize:!0,filterTransformColor:!0},dt={categorySize:0,filterSize:1,fp64:!1,countItems:!1},ft={1:"uint",2:"uvec2",3:"uvec3",4:"uvec4"},ut={1:"float",2:"vec2",3:"vec3",4:"vec4"};class z extends T{constructor(e={}){super({...dt,...e})}getShaders(e){const{categorySize:t,filterSize:i,fp64:a}=e.opts,s={};t&&(s.DATACATEGORY_TYPE=ft[t],s.DATACATEGORY_CHANNELS=t),i&&(s.DATAFILTER_TYPE=ut[i],s.DATAFILTER_DOUBLE=!!a);const r=a?tt:et;return r.uniformTypes=r.uniformTypesFromOptions(e.opts),{modules:[r],defines:s}}initializeState(e,t){const i=this.getAttributeManager(),{categorySize:a,filterSize:s,fp64:r}=t.opts;i&&(s&&i.add({filterValues:{size:s,type:r?"float64":"float32",stepMode:"dynamic",accessor:"getFilterValue"}}),a&&i.add({filterCategoryValues:{size:a,stepMode:"dynamic",accessor:"getFilterCategory",type:"uint32",transform:a===1?n=>t._getCategoryKey.call(this,n,0):n=>n.map((c,f)=>t._getCategoryKey.call(this,c,f))}}));const{device:l}=this.context;if(i&&t.opts.countItems){const n=rt(l);i.add({filterVertexIndices:{size:n?1:2,vertexOffset:1,type:"unorm8",accessor:(d,{index:u})=>{const h=d&&d.__source?d.__source.index:u;return n?(h+1)%255:[(h+1)%255,Math.floor(h/255)%255]},shaderAttributes:{filterPrevIndices:{vertexOffset:0},filterIndices:{vertexOffset:1}}}});const c=ot(l,n),f=nt(l,i.getBufferLayouts({isInstanced:!1}),t.getShaders.call(this,t),n);this.setState({filterFBO:c,filterModel:f})}}updateState({props:e,oldProps:t,changeFlags:i},a){const s=this.getAttributeManager(),{categorySize:r}=a.opts;if(this.state.filterModel){const l=s.attributes.filterValues?.needsUpdate()||s.attributes.filterCategoryValues?.needsUpdate()||e.filterEnabled!==t.filterEnabled||e.filterRange!==t.filterRange||e.filterSoftRange!==t.filterSoftRange||e.filterCategories!==t.filterCategories;l&&this.setState({filterNeedsUpdate:l})}s?.attributes.filterCategoryValues&&((s.attributes.filterCategoryValues.needsUpdate()||!R(e.filterCategories,t.filterCategories,2))&&this.setState({categoryBitMask:null}),i.dataChanged&&(this.setState({categoryMap:Array(r).fill(0).map(()=>({}))}),s.attributes.filterCategoryValues.setNeedsUpdate("categoryMap")))}draw(e,t){const i=this.state.filterFBO,a=this.state.filterModel,s=this.state.filterNeedsUpdate;this.state.categoryBitMask||t._updateCategoryBitMask.call(this,e,t);const{onFilteredItemsChange:r,extensions:l,filterEnabled:n,filterRange:c,filterSoftRange:f,filterTransformSize:d,filterTransformColor:u,filterCategories:h}=this.props,p={extensions:l,filterEnabled:n,filterRange:c,filterSoftRange:f,filterTransformSize:d,filterTransformColor:u,filterCategories:h};if(this.state.categoryBitMask&&(p.categoryBitMask=this.state.categoryBitMask),this.setShaderModuleProps({dataFilter:p}),s&&r&&a){const E=this.getAttributeManager(),{attributes:{filterValues:v,filterCategoryValues:M,filterVertexIndices:C}}=E;a.setVertexCount(this.getNumInstances());const y={...v?.getValue(),...M?.getValue(),...C?.getValue()};a.setAttributes(y),a.shaderInputs.setProps({dataFilter:p});const A=[0,0,i.width,i.height],k=a.device.beginRenderPass({id:"data-filter-aggregation",framebuffer:i,parameters:{viewport:A},clearColor:[0,0,0,0]});a.setParameters(lt),a.draw(k),k.end();const m=a.device.readPixelsToArrayWebGL(i);let P=0;for(let L=0;L<m.length;L++)P+=m[L];r({id:this.id,count:P}),this.state.filterNeedsUpdate=!1}}finalizeState(){const e=this.state.filterFBO,t=this.state.filterModel;e?.destroy(),t?.destroy()}_updateCategoryBitMask(e,t){const{categorySize:i}=t.opts;if(!i)return;const{filterCategories:a}=this.props,s=new Uint32Array([0,0,0,0]),r=i===1?[a]:a,l=i===1?128:i===2?64:32;for(let n=0;n<r.length;n++){const c=r[n];for(const f of c){const d=t._getCategoryKey.call(this,f,n);if(d<l){const u=n*(l/32)+Math.floor(d/32);s[u]+=Math.pow(2,d%32)}else S.warn(`Exceeded maximum number of categories (${l})`)()}}this.state.categoryBitMask=s}_getCategoryKey(e,t){const i=this.state.categoryMap[t];return e in i||(i[e]=Object.keys(i).length),i[e]}}z.defaultProps=ct,z.extensionName="DataFilterExtension";var ht=`const vec2 WORLD_SCALE_FP64 = vec2(81.4873275756836, 0.0000032873668232014097);
layout(std140) uniform project64Uniforms {
vec2 scale;
mat4 viewProjectionMatrix;
mat4 viewProjectionMatrix64Low;
} project64;
void mercatorProject_fp64(vec4 lnglat_fp64, out vec2 out_val[2]) {
#if defined(NVIDIA_FP64_WORKAROUND)
out_val[0] = sum_fp64(radians_fp64(lnglat_fp64.xy), PI_FP64 * ONE);
#else
out_val[0] = sum_fp64(radians_fp64(lnglat_fp64.xy), PI_FP64);
#endif
out_val[1] = sum_fp64(PI_FP64,
log_fp64(tan_fp64(sum_fp64(PI_4_FP64, radians_fp64(lnglat_fp64.zw) / 2.0))));
return;
}
void project_position_fp64(vec4 position_fp64, out vec2 out_val[2]) {
vec2 pos_fp64[2];
mercatorProject_fp64(position_fp64, pos_fp64);
out_val[0] = mul_fp64(pos_fp64[0], WORLD_SCALE_FP64);
out_val[1] = mul_fp64(pos_fp64[1], WORLD_SCALE_FP64);
return;
}
void project_position_fp64(vec2 position, vec2 position64xyLow, out vec2 out_val[2]) {
vec4 position64xy = vec4(
position.x, position64xyLow.x,
position.y, position64xyLow.y);
project_position_fp64(position64xy, out_val);
}
vec4 project_common_position_to_clipspace_fp64(vec2 vertex_pos_modelspace[4]) {
vec2 vertex_pos_clipspace[4];
vec2 viewProjectionMatrixFP64[16];
for (int i = 0; i < 4; i++) {
for (int j = 0; j < 4; j++) {
viewProjectionMatrixFP64[4 * i + j] = vec2(
project64.viewProjectionMatrix[j][i],
project64.viewProjectionMatrix64Low[j][i]
);
}
}
mat4_vec4_mul_fp64(viewProjectionMatrixFP64, vertex_pos_modelspace,
vertex_pos_clipspace);
return vec4(
vertex_pos_clipspace[0].x,
vertex_pos_clipspace[1].x,
vertex_pos_clipspace[2].x,
vertex_pos_clipspace[3].x
);
}
vec4 project_position_to_clipspace(
vec3 position, vec3 position64xyLow, vec3 offset, out vec4 commonPosition
) {
vec2 offset64[4];
vec4_fp64(vec4(offset, 0.0), offset64);
float z = project_size(position.z);
vec2 projectedPosition64xy[2];
project_position_fp64(position.xy, position64xyLow.xy, projectedPosition64xy);
vec2 commonPosition64[4];
commonPosition64[0] = sum_fp64(offset64[0], projectedPosition64xy[0]);
commonPosition64[1] = sum_fp64(offset64[1], projectedPosition64xy[1]);
commonPosition64[2] = sum_fp64(offset64[2], vec2(z, 0.0));
commonPosition64[3] = vec2(1.0, 0.0);
commonPosition = vec4(projectedPosition64xy[0].x, projectedPosition64xy[1].x, z, 1.0);
return project_common_position_to_clipspace_fp64(commonPosition64);
}
vec4 project_position_to_clipspace(
vec3 position, vec3 position64xyLow, vec3 offset
) {
vec4 commonPosition;
return project_position_to_clipspace(
position, position64xyLow, offset, commonPosition
);
}
`;const{fp64ify:pt,fp64ifyMatrix4:gt}=ue;var xe={name:"project64",dependencies:[b,ue],vs:ht,getUniforms:vt,uniformTypes:{scale:"vec2<f32>",viewProjectionMatrix:"mat4x4<f32>",viewProjectionMatrix64Low:"mat4x4<f32>"}};const mt=Ne(_t);function vt(o){if(o&&"viewport"in o){const{viewProjectionMatrix:e,scale:t}=o.viewport;return mt({viewProjectionMatrix:e,scale:t})}return{}}function _t({viewProjectionMatrix:o,scale:e}){const t=gt(o),i=new Float32Array(16),a=new Float32Array(16);for(let s=0;s<4;s++)for(let r=0;r<4;r++){const l=4*s+r,n=4*r+s;i[n]=t[2*l],a[n]=t[2*l+1]}return{scale:pt(e),viewProjectionMatrix:[...i],viewProjectionMatrix64Low:[...a]}}class be extends T{getShaders(){const{coordinateSystem:e}=this.props;if(e!=="lnglat"&&e!=="default")throw new Error("fp64: coordinateSystem must be LNGLAT");return{modules:[xe]}}draw(e,t){const{viewport:i}=e.context;this.setShaderModuleProps({project64:{viewport:i}})}}be.extensionName="Fp64Extension";const yt={inject:{"vs:#decl":`
in vec2 instanceDashArrays;
#ifdef HIGH_PRECISION_DASH
in vec2 instanceDashOffsets;
#endif
out vec2 vDashArray;
out float vDashOffset;
out float vDashPathLength;
layout(std140) uniform pathStyleUniforms {
float dashAlignMode;
bool dashGapPickable;
highp int dashUnits;
} pathStyle;
`,"vs:#main-end":`
float dashWidthPixels = path.billboard
? width.x * project.focalDistance
: width.x * project.scale;
float strokeHalfWidthPixels = path.billboard ? width.x : width.x * project.scale;
float dashUnitPixels = strokeHalfWidthPixels;
if (pathStyle.dashUnits == 1) {
dashUnitPixels = 1.0;
} else if (pathStyle.dashUnits == 2) {
dashUnitPixels = project_size_to_pixel(1.0);
} else if (pathStyle.dashUnits == 3) {
dashUnitPixels = project.scale;
}
vDashArray = instanceDashArrays * (dashUnitPixels / dashWidthPixels);
#ifdef HIGH_PRECISION_DASH
vec2 dashOffsetAndLength = (instanceDashOffsets * project.scale) / dashWidthPixels;
vDashPathLength = dashOffsetAndLength.y;
float dashUnitLength = vDashArray.x + vDashArray.y;
float dashPeriod = pathStyle.dashAlignMode == 0.0
? dashUnitLength
: vDashPathLength / max(round(vDashPathLength / max(dashUnitLength, 0.0001)), 1.0);
vDashOffset = dashPeriod > 0.0 ? mod(dashOffsetAndLength.x, dashPeriod) : 0.0;
#else
vDashOffset = 0.0;
vDashPathLength = 0.0;
#endif
`,"fs:#decl":`
layout(std140) uniform pathStyleUniforms {
float dashAlignMode;
bool dashGapPickable;
highp int dashUnits;
} pathStyle;
in vec2 vDashArray;
in float vDashOffset;
in float vDashPathLength;
float dashPatternIntegral(float position, float solidLength, float unitLength) {
return floor(position / unitLength) * solidLength +
min(mod(position, unitLength), solidLength);
}
float dashPatternCoverage(
float position,
float solidLength,
float unitLength,
float filterWidth
) {
float halfFilter = 0.5 * filterWidth;
float reducedPosition = mod(position, unitLength);
return (dashPatternIntegral(reducedPosition + halfFilter, solidLength, unitLength) -
dashPatternIntegral(reducedPosition - halfFilter, solidLength, unitLength)) / filterWidth;
}
`,"fs:#main-start":`
float dashCoverage = 1.0;
bool shouldDiscardDash = false;
bool inRoundedDashGap = false;
float roundedDashResolvedCoverage = 1.0;
float roundedDashSubPixelBlend = 0.0;
float roundedDashDutyCycle = 1.0;
float solidLength = vDashArray.x;
float gapLength = vDashArray.y;
float unitLength = solidLength + gapLength;
if (unitLength > 0.0 && gapLength > 0.0) {
float offset;
if (pathStyle.dashAlignMode == 0.0) {
offset = vDashOffset;
} else {
#ifdef HIGH_PRECISION_DASH
unitLength = vDashPathLength / max(round(vDashPathLength / unitLength), 1.0);
#else
unitLength = vPathLength / max(round(vPathLength / unitLength), 1.0);
#endif
solidLength = min(solidLength, unitLength);
offset = solidLength / 2.0;
#ifdef HIGH_PRECISION_DASH
offset += vDashOffset;
#endif
}
float alongPath = vPathPosition.y + offset;
float unitOffset = mod(alongPath, unitLength);
float filterWidth = max(fwidth(alongPath), 0.0001);
if (bool(picking.isActive)) {
bool inGap = unitOffset > solidLength;
if (inGap && path.capType > 0.5) {
inGap = length(vec2(
min(unitOffset - solidLength, unitLength - unitOffset),
vPathPosition.x
)) > 1.0;
}
if (inGap && !pathStyle.dashGapPickable) {
shouldDiscardDash = true;
}
} else if (path.capType <= 0.5) {
dashCoverage = dashPatternCoverage(alongPath, solidLength, unitLength, filterWidth);
} else {
float distanceAlongGap = min(unitOffset - solidLength, unitLength - unitOffset);
float distanceToEnd = length(vec2(max(distanceAlongGap, 0.0), vPathPosition.x));
float capEdgePixels = (1.0 - distanceToEnd) / max(fwidth(distanceToEnd), 1e-6);
if (distanceAlongGap > 0.0) {
inRoundedDashGap = true;
roundedDashResolvedCoverage = smoothedge(0.0, capEdgePixels);
dashCoverage = roundedDashResolvedCoverage;
}
float subPixelBlend = smoothstep(unitLength, 2.0 * unitLength, filterWidth);
roundedDashSubPixelBlend = subPixelBlend;
float boundedSolidLength = min(solidLength, unitLength);
float effectiveGap = max(unitLength - boundedSolidLength, 0.0);
float capSpan = 2.0 * sqrt(max(1.0 - vPathPosition.x * vPathPosition.x, 0.0));
float roundedDutyCycle = clamp(
(boundedSolidLength + min(effectiveGap, capSpan)) / unitLength,
0.0,
1.0
);
roundedDashDutyCycle = roundedDutyCycle;
dashCoverage = mix(dashCoverage, roundedDutyCycle, subPixelBlend);
}
dashCoverage = clamp(dashCoverage, 0.0, 1.0);
shouldDiscardDash = shouldDiscardDash || dashCoverage <= 0.0;
}
`,"fs:#main-end":`
#ifdef ANTIALIASING
if (inRoundedDashGap) {
float pathCoverage = smoothedge(0.0, edgePixels);
float resolvedCapMultiplier =
min(pathCoverage, roundedDashResolvedCoverage) / max(pathCoverage, 1e-6);
dashCoverage = mix(
resolvedCapMultiplier,
roundedDashDutyCycle,
roundedDashSubPixelBlend
);
}
#endif
if (shouldDiscardDash) {
discard;
}
fragColor.a *= dashCoverage;
`}},Pt={inject:{"vs:#decl":`
in vec2 instanceDashArrays;
out vec2 vDashArray;
`,"vs:#main-end":`
vDashArray = instanceDashArrays;
`,"fs:#decl":`
layout(std140) uniform pathStyleUniforms {
bool dashGapPickable;
} pathStyle;
in vec2 vDashArray;
#define PI 3.141592653589793
`,"fs:#main-start":`
bool inDashGap = false;
float dashUnitLength = vDashArray.x + vDashArray.y;
if (dashUnitLength > 0.0 && scatterplot.stroked > 0.5) {
float _distToCenter = length(unitPosition) * outerRadiusPixels;
float innerRadius = innerUnitRadius * outerRadiusPixels;
if (_distToCenter >= innerRadius) {
float strokeWidth = (1.0 - innerUnitRadius) * outerRadiusPixels;
float midStrokeRadius = (innerUnitRadius + 1.0) * 0.5 * outerRadiusPixels;
float angle = atan(unitPosition.y, unitPosition.x) + PI;
float circumference = 2.0 * PI * midStrokeRadius;
float posAlongStroke = (angle / (2.0 * PI)) * circumference / strokeWidth;
float unitOffset = mod(posAlongStroke, dashUnitLength);
if (unitOffset > vDashArray.x) {
if (scatterplot.filled > 0.5) {
inDashGap = true;
} else {
if (!(pathStyle.dashGapPickable && bool(picking.isActive))) {
discard;
}
}
}
}
}
`,"fs:#main-end":`
if (inDashGap) {
float alphaFactor = fragColor.a / max(vLineColor.a, 0.001);
fragColor = vec4(vFillColor.rgb, vFillColor.a * alphaFactor);
fragColor = picking_filterPickingColor(fragColor);
fragColor = picking_filterHighlightColor(fragColor);
}
`}},xt={inject:{"vs:#decl":`
in vec2 instanceDashArrays;
out vec2 vDashArray;
`,"vs:#main-end":`
vDashArray = instanceDashArrays;
`,"fs:#decl":`
layout(std140) uniform pathStyleUniforms {
bool dashGapPickable;
} pathStyle;
in vec2 vDashArray;
#define PI 3.141592653589793
float getPerimeterPosition(vec2 fragUV, vec2 dims, vec4 radii, float lineWidth) {
float width = dims.x;
float height = dims.y;
float maxRadius = min(width, height) * 0.5;
float rBL = min(radii.w, maxRadius);
float rTL = min(radii.z, maxRadius);
float rTR = min(radii.x, maxRadius);
float rBR = min(radii.y, maxRadius);
vec2 p = fragUV * dims;
float leftLen = height - rBL - rTL;
float topLen = width - rTL - rTR;
float rightLen = height - rTR - rBR;
float bottomLen = width - rBR - rBL;
float arcBL = PI * 0.5 * rBL;
float arcTL = PI * 0.5 * rTL;
float arcTR = PI * 0.5 * rTR;
float arcBR = PI * 0.5 * rBR;
float pos = 0.0;
float distLeft = p.x;
float distRight = width - p.x;
float distBottom = p.y;
float distTop = height - p.y;
float minDist = min(min(distLeft, distRight), min(distBottom, distTop));
if (p.x < rBL && p.y < rBL) {
vec2 c = vec2(rBL, rBL);
vec2 d = p - c;
float angle = atan(-d.x, -d.y);
pos = angle / (PI * 0.5) * arcBL;
} else if (p.x < rTL && p.y > height - rTL) {
vec2 c = vec2(rTL, height - rTL);
vec2 d = p - c;
float angle = atan(d.y, -d.x);
pos = arcBL + leftLen + angle / (PI * 0.5) * arcTL;
} else if (p.x > width - rTR && p.y > height - rTR) {
vec2 c = vec2(width - rTR, height - rTR);
vec2 d = p - c;
float angle = atan(d.x, d.y);
pos = arcBL + leftLen + arcTL + topLen + angle / (PI * 0.5) * arcTR;
} else if (p.x > width - rBR && p.y < rBR) {
vec2 c = vec2(width - rBR, rBR);
vec2 d = p - c;
float angle = atan(-d.y, d.x);
pos = arcBL + leftLen + arcTL + topLen + arcTR + rightLen + angle / (PI * 0.5) * arcBR;
} else if (minDist == distLeft) {
pos = arcBL + clamp(p.y - rBL, 0.0, leftLen);
} else if (minDist == distTop) {
pos = arcBL + leftLen + arcTL + clamp(p.x - rTL, 0.0, topLen);
} else if (minDist == distRight) {
pos = arcBL + leftLen + arcTL + topLen + arcTR + clamp(height - rTR - p.y, 0.0, rightLen);
} else {
pos = arcBL + leftLen + arcTL + topLen + arcTR + rightLen + arcBR + clamp(width - rBR - p.x, 0.0, bottomLen);
}
return pos / lineWidth;
}
float getRectPerimeterPosition(vec2 fragUV, vec2 dims, float lineWidth) {
float width = dims.x;
float height = dims.y;
float distLeft = fragUV.x * width;
float distRight = (1.0 - fragUV.x) * width;
float distBottom = fragUV.y * height;
float distTop = (1.0 - fragUV.y) * height;
float minDist = min(min(distLeft, distRight), min(distBottom, distTop));
float pos = 0.0;
if (minDist == distLeft) {
pos = fragUV.y * height;
} else if (minDist == distTop) {
pos = height + fragUV.x * width;
} else if (minDist == distRight) {
pos = height + width + (1.0 - fragUV.y) * height;
} else {
pos = 2.0 * height + width + (1.0 - fragUV.x) * width;
}
return pos / lineWidth;
}
`,"fs:#main-start":`
bool inDashGap = false;
float dashUnitLength = vDashArray.x + vDashArray.y;
if (dashUnitLength > 0.0 && textBackground.stroked) {
float distToEdge;
bool hasRoundedCorners = textBackground.borderRadius != vec4(0.0);
if (hasRoundedCorners) {
distToEdge = round_rect(uv, dimensions, textBackground.borderRadius);
} else {
distToEdge = rect(uv, dimensions);
}
if (distToEdge <= vLineWidth && distToEdge >= 0.0) {
float posAlongStroke;
if (hasRoundedCorners) {
posAlongStroke = getPerimeterPosition(uv, dimensions, textBackground.borderRadius, vLineWidth);
} else {
posAlongStroke = getRectPerimeterPosition(uv, dimensions, vLineWidth);
}
float unitOffset = mod(posAlongStroke, dashUnitLength);
if (unitOffset > vDashArray.x) {
if (vFillColor.a > 0.0) {
inDashGap = true;
} else {
if (!(pathStyle.dashGapPickable && bool(picking.isActive))) {
discard;
}
}
}
}
}
`,"fs:#main-end":`
if (inDashGap) {
float alphaFactor = fragColor.a / max(vLineColor.a, 0.001);
fragColor = vec4(vFillColor.rgb, vFillColor.a * alphaFactor);
fragColor = picking_filterPickingColor(fragColor);
fragColor = picking_filterHighlightColor(fragColor);
}
`}},bt={inject:{"vs:#decl":`
in float instanceOffsets;
`,"vs:DECKGL_FILTER_SIZE":`
float offsetWidth = abs(instanceOffsets * 2.0) + 1.0;
size *= offsetWidth;
`,"vs:#main-end":`
float offsetWidth = abs(instanceOffsets * 2.0) + 1.0;
float offsetDir = sign(instanceOffsets);
vPathPosition.x = (vPathPosition.x + offsetDir) * offsetWidth - offsetDir;
vPathPosition.y *= offsetWidth;
vPathLength *= offsetWidth;
#ifdef DASH_ENABLED
if (pathStyle.dashUnits != 0) {
vDashArray *= offsetWidth;
}
vPathBounds *= offsetWidth;
#ifdef HIGH_PRECISION_DASH
vDashPathLength *= offsetWidth;
float restoredDashUnitLength = vDashArray.x + vDashArray.y;
float restoredDashPeriod = pathStyle.dashAlignMode == 0.0
? restoredDashUnitLength
: vDashPathLength /
max(round(vDashPathLength / max(restoredDashUnitLength, 0.0001)), 1.0);
vDashOffset = restoredDashPeriod > 0.0
? mod(dashOffsetAndLength.x * offsetWidth, restoredDashPeriod)
: 0.0;
#else
vDashOffset *= offsetWidth;
#endif
#endif
`,"fs:#main-end":`
#ifndef ANTIALIASING
if (abs(vPathPosition.x) > 1.0) {
discard;
}
#endif
`}},Tt={getDashArray:{type:"accessor",value:[0,0]},getOffset:{type:"accessor",value:0},dashJustified:!1,dashGapPickable:!1,dashUnits:"widths"},Mt={widths:0,pixels:1,meters:2,common:3},Ct=["instanceDashArrays","instanceDashOffsets","instanceOffsets"];function At({props:o,oldProps:e}){return!R(o.modelMatrix,e.modelMatrix,2)||o.coordinateSystem!==e.coordinateSystem||!R(o.coordinateOrigin,e.coordinateOrigin,1)}function Te(o,e,t){const i=o.context.viewport;if(!(i instanceof N)||i.zoom<12)return o.projectPosition(e,{autoOffset:!1});const a=ze.transformMat4([],[e[0],e[1],e[2]||0,1],t.modelMatrix),s=o.props.coordinateSystem==="default"?"lnglat":o.props.coordinateSystem;if(s==="lnglat"){if(Math.abs(a[1]-t.coordinateOrigin[1])>.25){let n=a[0];t.wrapLongitude&&(n=((n+180)%360+360)%360-180);const c=i.projectPosition([n,a[1],0]);return[c[0]-t.commonOrigin[0],c[1]-t.commonOrigin[1],a[2]*t.commonUnitsPerMeter[2]]}F.sub(a,a,t.coordinateOrigin)}else s==="cartesian"&&F.sub(a,a,t.coordinateOrigin);const r=a[1],l=F.scaleAndAdd([],t.commonUnitsPerWorldUnit,t.commonUnitsPerWorldUnit2,r);return F.multiply([],a,l)}class G extends T{constructor({dash:e=!1,offset:t=!1,dashMode:i,highPrecisionDash:a=!1}={}){const s=i??(a?"path":"segment");super({dash:e||a||i!==void 0,offset:t,dashMode:s,highPrecisionDash:s==="path"})}getLayerType(e){if("pathTesselator"in e.state)return"path";const t=e.constructor.layerName;return t==="ScatterplotLayer"?"scatterplot":t==="TextBackgroundLayer"?"textBackground":null}synchronizeAttributes(e){const t=e.getAttributeManager(),i=this.getLayerType(e);if(!t||!i)return!1;const a=t.getAttributes(),s=new Set;this.opts.dash&&s.add("instanceDashArrays"),i==="path"&&this.opts.dash&&this.opts.dashMode==="path"&&s.add("instanceDashOffsets"),i==="path"&&this.opts.offset&&s.add("instanceOffsets");let r=!1;for(const l of Ct)a[l]&&!s.has(l)&&(t.remove([l]),r=!0);return s.has("instanceDashArrays")&&!a.instanceDashArrays&&(t.addInstanced({instanceDashArrays:{size:2,accessor:"getDashArray"}}),r=!0),s.has("instanceDashOffsets")&&!a.instanceDashOffsets&&(t.addInstanced({instanceDashOffsets:{size:2,accessor:["getPath"],update:this.calculateDashMetrics}}),r=!0),s.has("instanceOffsets")&&!a.instanceOffsets&&(t.addInstanced({instanceOffsets:{size:1,accessor:"getOffset"}}),r=!0),r}isEnabled(e){return this.getLayerType(e)!==null}getShaders(e){const t=e.getLayerType(this);if(!t)return null;if(t==="scatterplot"||t==="textBackground")return e.opts.dash?{modules:[{name:"pathStyle",inject:t==="scatterplot"?Pt.inject:xt.inject,uniformTypes:{dashGapPickable:"i32"}}]}:null;let i={};const a={};e.opts.dash&&(i=ce(i,yt),a.DASH_ENABLED=!0,e.opts.dashMode==="path"&&(a.HIGH_PRECISION_DASH=!0)),e.opts.offset&&(i=ce(i,bt),a.PATH_STYLE_OFFSET=!0);const{inject:s}=i,r={name:"pathStyle",inject:s};return e.opts.dash&&(r.uniformTypes={dashAlignMode:"f32",dashGapPickable:"i32",dashUnits:"i32"}),{modules:[r],defines:a}}initializeState(e,t){t.synchronizeAttributes(this)}updateState(e,t){if(t.isEnabled(this)){if(e.changeFlags.extensionsChanged){const i=t.synchronizeAttributes(this),a=this.getAttributeManager();if(a&&i){a.invalidateAll();for(const s of this.getModels())s.setBufferLayout(a.getBufferLayouts(s))}}if(t.opts.dash){const i=t.getLayerType(this);if(i==="path"&&t.opts.dashMode==="path"&&At(e)&&this.getAttributeManager()?.invalidate("instanceDashOffsets"),i==="scatterplot"||i==="textBackground"){const a={dashGapPickable:!!this.props.dashGapPickable};this.setShaderModuleProps({pathStyle:a})}else{const a={dashAlignMode:this.props.dashJustified?1:0,dashGapPickable:!!this.props.dashGapPickable,dashUnits:Mt[this.props.dashUnits??"widths"]};this.setShaderModuleProps({pathStyle:a})}}}}calculateDashMetrics(e,{startRow:t,endRow:i}){const a=this.state.pathTesselator,s=a?.vertexStarts,r=a?.instanceCount,l=a?.get("positions");if(!s||r===void 0||typeof a?.getPathSegmentIndices!="function")throw new Error("PathStyleExtension requires PathLayer tessellation data for path dashes.");const n=this.props.data?.attributes?.getPath,c=ArrayBuffer.isView(n)?n:n?.value,f=ArrayBuffer.isView(c),d=l&&(!n||a.normalize||a.opts?.isWebGPU);if(n&&!f||!d&&!f)throw new Error("PathStyleExtension cannot calculate whole-path dash metrics from GPU-only getPath data; supply data.attributes.instanceDashOffsets.");const u=e.value,h=e.size,p=Math.max(0,t),E=Math.min(i,s.length-1);let v=3,M=3,C=0;if(!d){const m=c.BYTES_PER_ELEMENT;v=n?.size||(this.props.positionFormat==="XY"?2:3),M=n?.stride?n.stride/m:v,C=n?.offset?n.offset/m:0}const y=new Array(3),A=b.getUniforms({viewport:this.context.viewport,modelMatrix:this.props.modelMatrix,coordinateSystem:this.props.coordinateSystem,coordinateOrigin:this.props.coordinateOrigin,autoWrapLongitude:this.wrapLongitude}),k=m=>{if(d)y[0]=l[m*3],y[1]=l[m*3+1],y[2]=l[m*3+2];else{const P=C+m*M;y[0]=c[P],y[1]=c[P+1],y[2]=v===3?c[P+2]:0}return y};e.startIndices=s;for(let m=p;m<E;m++){const P=s[m],L=Math.min(s[m+1]??r,r);u.fill(0,P*h,L*h);const Oe=a.getPathSegmentIndices(m);let I=0,ne=-2,B=null;for(const x of Oe){const Ie=x*h;u[Ie]=I;const Be=x===ne+1&&B?B:Te(this,k(x),A),le=Te(this,k(x+1),A);I+=F.dist(Be,le),ne=x,B=le}if(h>1)for(let x=P;x<L;x++)u[x*h+1]=I}}getDashOffsets(e){const t=[0],i=this.props.positionFormat==="XY"?2:3,a=Array.isArray(e[0]),s=a?e.length:e.length/i;let r,l;for(let n=0;n<s-1;n++)r=a?e[n]:e.slice(n*i,n*i+i),r=this.projectPosition(r,{autoOffset:!1}),n>0&&(t[n]=t[n-1]+F.dist(l,r)),l=r;return t[s-1]=0,t}}G.defaultProps=Tt,G.extensionName="PathStyleExtension";const Lt=512/4e7;function Ft(o,e){switch(o){case"pixels":return 2**-Math.round(e.zoom);case"common":return 1;default:return Lt}}const Me=`layout(std140) uniform fillUniforms {
  vec2 patternTextureSize;
  float patternUnitScale;
  bool patternEnabled;
  bool patternMask;
  bool procedural;
  bool flipY;
  vec2 uvCoordinateOrigin;
  vec2 uvCoordinateOrigin64Low;
} fill;
`,Et=`
uniform sampler2D fill_patternTexture;

in vec4 fillPatternFrames;
in float fillPatternScales;
in vec2 fillPatternOffsets;
in vec4 fillPatternBackgroundColors;

out vec2 fill_uv;
out vec4 fill_patternBounds;
out vec4 fill_patternPlacement;
out vec4 fill_backgroundColor;
out float fill_patternCoordinateScale;
flat out vec4 fill_patternParams0;
flat out vec4 fill_patternParams1;
`,kt=`
${Me}
${Et}
`,St=`
uniform sampler2D fill_patternTexture;

in vec4 fill_patternBounds;
in vec4 fill_patternPlacement;
in vec4 fill_backgroundColor;
in vec2 fill_uv;
in float fill_patternCoordinateScale;
flat in vec4 fill_patternParams0;
flat in vec4 fill_patternParams1;

const float FILL_PATTERN_HATCH = 1.0;
const float FILL_PATTERN_CROSS_HATCH = 2.0;
const float FILL_PATTERN_DOTS = 3.0;

float fill_getPatternCoordinate(vec2 axis, float period, float offset) {
  float coordinateScale = max(abs(fill_patternCoordinateScale), 1.0e-20);
  vec2 coordinateOrigin = fill.uvCoordinateOrigin;
  vec2 coordinateOffset = fill.uvCoordinateOrigin64Low + fill_uv;
  float yDirection = fill.flipY ? 1.0 : -1.0;
  coordinateOrigin.y *= yDirection;
  coordinateOffset.y *= yDirection;

  // Reduce the high part before adding the local offset to retain precision in large coordinates.
  float highPart = mod(dot(coordinateOrigin, axis) / coordinateScale, period);
  float lowPart = dot(coordinateOffset, axis) / coordinateScale;
  return mod(highPart + lowPart + offset * period, period);
}

vec2 fill_getPatternCoords(
  vec2 axis0,
  vec2 axis1,
  vec2 period,
  vec2 offset
) {
  return vec2(
    fill_getPatternCoordinate(axis0, period.x, offset.x),
    fill_getPatternCoordinate(axis1, period.y, offset.y)
  );
}

float fill_getScreenSpaceAlpha(float signedDistance) {
  float distanceDerivative = fwidth(signedDistance);
  if (distanceDerivative == 0.0) {
    return signedDistance <= 0.0 ? 1.0 : 0.0;
  }
  // Normalize the SDF to screen pixels so the coverage ramp is independent of pattern units.
  float distanceInPixels = signedDistance / distanceDerivative;
  return 1.0 - smoothstep(-0.5, 0.5, distanceInPixels);
}

float fill_getLineAlpha(float position, float center, float period, float strokeWidth) {
  float distanceToLine = abs(mod(position - center + period * 0.5, period) - period * 0.5);
  return fill_getScreenSpaceAlpha(distanceToLine - strokeWidth * 0.5);
}

float fill_getHatchAlpha(float angle, float strokeWidth, vec2 gaps, bool alternating) {
  vec2 lineDirection = vec2(cos(angle), sin(angle));
  vec2 lineNormal = vec2(-lineDirection.y, lineDirection.x);
  float period = alternating
    ? strokeWidth * 2.0 + gaps.x + gaps.y
    : strokeWidth + gaps.x;
  float offset = dot(fill_patternPlacement.xy, lineNormal);
  float position = fill_getPatternCoordinate(lineNormal, period, offset);
  float alpha = fill_getLineAlpha(position, 0.0, period, strokeWidth);
  if (alternating) {
    alpha = max(
      alpha,
      fill_getLineAlpha(position, strokeWidth + gaps.x, period, strokeWidth)
    );
  }
  return alpha;
}

float fill_getDotAlpha(float angle, float skew, float radius, float gap) {
  vec2 axis0 = vec2(cos(angle), sin(angle));
  float axis1Angle = angle + 1.5707963267948966 - skew;
  vec2 axis1 = vec2(cos(axis1Angle), sin(axis1Angle));
  float determinant = axis0.x * axis1.y - axis0.y * axis1.x;

  // The reciprocal basis maps common coordinates into the skewed dot lattice.
  vec2 reciprocal0 = vec2(axis1.y, -axis1.x) / determinant;
  vec2 reciprocal1 = vec2(-axis0.y, axis0.x) / determinant;
  float period = radius * 2.0 + gap;
  vec2 latticeCoords = fill_getPatternCoords(
    reciprocal0,
    reciprocal1,
    vec2(period),
    fill_patternPlacement.xy
  );
  vec2 cellOffset = mod(latticeCoords + period * 0.5, period) - period * 0.5;
  float distanceToDotSquared = 1.0e20;
  // In a skewed lattice the closest dot is not necessarily in the independently wrapped cell.
  // Include adjacent cells to keep the repeated distance field continuous at cell boundaries.
  for (int x = -1; x <= 1; x++) {
    for (int y = -1; y <= 1; y++) {
      vec2 neighborOffset = cellOffset + vec2(float(x), float(y)) * period;
      vec2 dotOffset = axis0 * neighborOffset.x + axis1 * neighborOffset.y;
      distanceToDotSquared = min(distanceToDotSquared, dot(dotOffset, dotOffset));
    }
  }
  float distanceToDot = sqrt(distanceToDotSquared);
  return fill_getScreenSpaceAlpha(distanceToDot - radius);
}

float fill_getProceduralPatternAlpha() {
  float patternType = fill_patternParams0.x;
  float size = fill_patternParams0.y;
  vec2 gaps = fill_patternParams0.zw;
  vec2 angles = fill_patternParams1.xy;
  float elementCount = fill_patternParams1.z;

  if (patternType == FILL_PATTERN_HATCH) {
    return fill_getHatchAlpha(angles.x, size, gaps, elementCount == 2.0);
  }
  if (patternType == FILL_PATTERN_CROSS_HATCH) {
    return max(
      fill_getHatchAlpha(angles.x, size, gaps, false),
      fill_getHatchAlpha(angles.y, size, gaps, false)
    );
  }
  if (patternType == FILL_PATTERN_DOTS) {
    return fill_getDotAlpha(angles.x, angles.y, size, gaps.x);
  }
  return 1.0;
}

// Draw the pattern over the background fill (Porter-Duff source-over)
vec4 fill_blendOverBackground(vec4 pattern, vec4 background) {
  if (background.a == 0.0 || layer.opacity == 0.0) return pattern;
  float patternAlpha = pattern.a / layer.opacity;
  float blendedAlpha = patternAlpha + background.a * (1.0 - patternAlpha);
  vec3 blendedRGB = mix(background.rgb, pattern.rgb, patternAlpha / blendedAlpha);
  return vec4(blendedRGB, blendedAlpha * layer.opacity);
}
`,wt=`
${Me}
${St}
`,Rt={"vs:DECKGL_FILTER_GL_POSITION":`
    if (fill.patternEnabled) {
      fill_patternPlacement.xy = fillPatternOffsets;
      fill_backgroundColor = fillPatternBackgroundColors;
      if (fill.procedural) {
        fill_uv = geometry.position.xy;
        fill_patternCoordinateScale = fill.patternUnitScale * fillPatternScales;
        int texelIndex = int(fillPatternFrames.x) * 4;
        fill_patternParams0 = vec4(
          texelFetch(fill_patternTexture, ivec2(texelIndex, 0), 0).rg,
          texelFetch(fill_patternTexture, ivec2(texelIndex + 1, 0), 0).rg
        );
        fill_patternParams1 = vec4(
          texelFetch(fill_patternTexture, ivec2(texelIndex + 2, 0), 0).rg,
          texelFetch(fill_patternTexture, ivec2(texelIndex + 3, 0), 0).rg
        );
      } else {
        fill_patternBounds = fillPatternFrames / vec4(fill.patternTextureSize, fill.patternTextureSize);
        vec2 patternFrameCommon = fill.patternUnitScale * fillPatternScales * fillPatternFrames.zw;
        // Reduce the coordinate origin to within one tile before adding the vertex position. The
        // origin is large in common space, and fp32 cannot carry the sum at full precision.
        vec2 origin = mod(fill.uvCoordinateOrigin, patternFrameCommon) + fill.uvCoordinateOrigin64Low;
        fill_uv = (origin + geometry.position.xy) / patternFrameCommon;
        // Pattern atlases use top-left coordinates, so reverse common-space Y in bottom-left views.
        fill_uv.y *= fill.flipY ? 1.0 : -1.0;
        fill_uv += fillPatternOffsets;
      }
    }
  `,"fs:DECKGL_FILTER_COLOR":`
    if (fill.patternEnabled) {
      if (fill.procedural) {
        color.a *= fill_getProceduralPatternAlpha();
      } else {
        vec2 patternUV = fract(fill_uv);
        vec2 texCoords = fill_patternBounds.xy + fill_patternBounds.zw * patternUV;

        // Tiling is emulated by wrapping the coordinate, so texCoords jumps from the end of the
        // frame back to its start once per tile, leading to the wrong mip level being selected,
        // which leads to artifacts at pattern edges. fill_uv is continuous across the primitive,
        // meaning that the correct mip level is always selected
        vec4 grad = fill_patternBounds.zwzw * vec4(dFdx(fill_uv), dFdy(fill_uv));
        vec4 patternColor = textureGrad(fill_patternTexture, texCoords, grad.xy, grad.zw);

        color.a *= patternColor.a;
        if (!fill.patternMask) {
          color.rgb = patternColor.rgb;
        }
      }
      color = fill_blendOverBackground(color, fill_backgroundColor);
    }
  `};function Dt(o){if(!o)return{};const e={};if("fillPatternTexture"in o){const{fillPatternTexture:t}=o;e.fill_patternTexture=t,e.patternTextureSize=[t.width,t.height]}if("project"in o){const{fillPatternMask:t=!0,fillPatternEnabled:i=!0,fillPatternSizeUnits:a="meters",fillPatternCommonFrame:s=null,procedural:r=!1}=o,l=b.getUniforms(o.project),{commonOrigin:n}=l,c=Ft(a,o.project.viewport),f=[n[0],n[1]];s&&(f[0]%=c*s[0],f[1]%=c*s[1]),e.uvCoordinateOrigin=f,e.uvCoordinateOrigin64Low=[de(f[0]),de(f[1])],e.patternUnitScale=c,e.patternMask=t,e.patternEnabled=i,e.procedural=r,e.flipY=o.project.viewport?.flipY??!1}return e}const Ot={name:"fill",vs:kt,fs:wt,inject:Rt,dependencies:[b],getUniforms:Dt,uniformTypes:{patternTextureSize:"vec2<f32>",patternUnitScale:"f32",patternEnabled:"i32",patternMask:"i32",procedural:"i32",flipY:"i32",uvCoordinateOrigin:"vec2<f32>",uvCoordinateOrigin64Low:"vec2<f32>"}},It="rg32float",Ce=2,Bt=4,H={hatch:1,crossHatch:2,dots:3},g={type:0,size:1,gap0:2,gap1:3,angle0:4,angle1:5,elementCount:6},Ae=Ce*Bt,w=Math.PI/180,W=1,$=1,Nt=0,Ut=[45,135],jt=0,Vt=0;function zt(o){const e=Object.entries(o),t=new Float32Array((e.length+1)*Ae),i=new Map;return e.forEach(([a,s],r)=>{const l=r+1,n=l*Ae;switch(i.set(a,l),s.type){case"hatch":{const c=s.gap===void 0?$:s.gap,f=s.strokeWidth===void 0?W:s.strokeWidth,d=s.angle===void 0?Nt:s.angle;if(Array.isArray(c)&&c.length!==2)throw new Error(`${a}.gap must be a number or a two-element array`);const u=Array.isArray(c)?c:[c,c];Y(f,`${a}.strokeWidth`),D(u[0],`${a}.gap[0]`),D(u[1],`${a}.gap[1]`),O(d,`${a}.angle`),t[n+g.type]=H.hatch,t[n+g.size]=f,t[n+g.gap0]=u[0],t[n+g.gap1]=u[1],t[n+g.angle0]=d*w,t[n+g.elementCount]=Array.isArray(c)?2:1;break}case"cross-hatch":{const c=s.angles===void 0?Ut:s.angles,f=s.strokeWidth===void 0?W:s.strokeWidth,d=s.gap===void 0?$:s.gap;if(!Array.isArray(c)||c.length!==2)throw new Error(`${a}.angles must be a two-element array`);Y(f,`${a}.strokeWidth`),D(d,`${a}.gap`),O(c[0],`${a}.angles[0]`),O(c[1],`${a}.angles[1]`),t[n+g.type]=H.crossHatch,t[n+g.size]=f,t[n+g.gap0]=d,t[n+g.gap1]=d,t[n+g.angle0]=c[0]*w,t[n+g.angle1]=c[1]*w,t[n+g.elementCount]=2;break}case"dots":{const c=s.radius===void 0?W:s.radius,f=s.gap===void 0?$:s.gap,d=s.angle===void 0?jt:s.angle,u=s.skew===void 0?Vt:s.skew;Y(c,`${a}.radius`),D(f,`${a}.gap`),O(d,`${a}.angle`),Gt(u,`${a}.skew`),t[n+g.type]=H.dots,t[n+g.size]=c,t[n+g.gap0]=f,t[n+g.gap1]=f,t[n+g.angle0]=d*w,t[n+g.angle1]=u*w,t[n+g.elementCount]=2;break}default:throw new Error(`${a}.type is not a supported procedural pattern type`)}}),{data:t,width:t.length/Ce,height:1,patternIndices:i}}function Y(o,e){if(!Number.isFinite(o)||o<=0)throw new Error(`${e} must be a finite number greater than 0`)}function D(o,e){if(!Number.isFinite(o)||o<0)throw new Error(`${e} must be a finite number greater than or equal to 0`)}function O(o,e){if(!Number.isFinite(o))throw new Error(`${e} must be a finite number`)}function Gt(o,e){if(!Number.isFinite(o)||o<=-90||o>=90)throw new Error(`${e} must be a finite number greater than -90 and less than 90`)}function Le(o,e){if(!Number.isInteger(e)||e<=0)return 0;if(o===0)return e;let[t,i]=[o,e];for(;i>0;)[t,i]=[i,t%i];return o/t*e}const Ht={fillPatternEnabled:!0,fillPatternAtlas:{type:"image",value:null,async:!0},fillPatternMapping:{type:"object",value:{},async:!0},fillPatternMask:!0,fillPatternSizeUnits:"meters",getFillPattern:{type:"accessor",value:o=>o.pattern},getFillPatternScale:{type:"accessor",value:1},getFillPatternOffset:{type:"accessor",value:[0,0]},getFillPatternBackgroundColor:{type:"accessor",value:[0,0,0,0]}};class K extends T{constructor({pattern:e=!1,proceduralPattern:t=!1}={}){super({pattern:e||t,proceduralPattern:t})}isEnabled(e){return e.getAttributeManager()!==null&&!("pathTesselator"in e.state)}getShaders(e){return e.isEnabled(this)?{modules:[e.opts.pattern&&Ot].filter(Boolean)}:null}initializeState(e,t){if(!t.isEnabled(this))return;const i=this.getAttributeManager();t.opts.pattern&&i.add({fillPatternFrames:{size:4,stepMode:"dynamic",accessor:"getFillPattern",transform:t.opts.proceduralPattern?t.getProceduralPatternIndex.bind(this):t.getPatternFrame.bind(this)},fillPatternScales:{size:1,stepMode:"dynamic",accessor:"getFillPatternScale",defaultValue:1},fillPatternOffsets:{size:2,stepMode:"dynamic",accessor:"getFillPatternOffset"},fillPatternBackgroundColors:{size:4,type:"unorm8",stepMode:"dynamic",accessor:"getFillPatternBackgroundColor",defaultValue:[0,0,0,255]}}),this.setState({emptyTexture:this.context.device.createTexture({data:new Uint8Array(4),width:1,height:1}),...t.opts.proceduralPattern&&t.createProceduralPatternTexture.call(this,{})})}updateState({props:e,oldProps:t},i){if(i.isEnabled(this)){if(e.fillPatternMapping&&e.fillPatternMapping!==t.fillPatternMapping){if(i.opts.proceduralPattern&&typeof e.fillPatternMapping!="string"){const a=this.state.proceduralPatternTexture;this.setState(i.createProceduralPatternTexture.call(this,e.fillPatternMapping)),a?.delete()}this.getAttributeManager().invalidate("getFillPattern")}(e.fillPatternMapping!==t.fillPatternMapping||e.getFillPatternScale!==t.getFillPatternScale)&&this.setState({commonFrame:i.getCommonFrame(e)})}}draw(e,t){if(!t.isEnabled(this))return;const{fillPatternAtlas:i,fillPatternEnabled:a,fillPatternMask:s,fillPatternSizeUnits:r}=this.props,l={project:e.shaderModuleProps.project,fillPatternEnabled:a,fillPatternMask:s,fillPatternSizeUnits:r,procedural:t.opts.proceduralPattern,fillPatternTexture:t.opts.proceduralPattern?this.state.proceduralPatternTexture||this.state.emptyTexture:i||this.state.emptyTexture,fillPatternCommonFrame:this.state.commonFrame};this.setShaderModuleProps({fill:l})}finalizeState(){this.state.emptyTexture?.delete(),this.state.proceduralPatternTexture?.delete()}getPatternFrame(e){const{fillPatternMapping:t}=this.getCurrentLayer().props,i=t&&t[e];return i&&"x"in i?[i.x,i.y,i.width,i.height]:[0,0,0,0]}getCommonFrame(e){const{fillPatternMapping:t,getFillPatternScale:i}=e;if(typeof i!="number"||!(i>0)||typeof t!="object")return null;let a=0,s=0;for(const r in t){const l=t[r];if(!("width"in l)||(a=Le(a,l.width),s=Le(s,l.height),!a||!s))return null}return a?[i*a,i*s]:null}getProceduralPatternIndex(e){return[this.state.proceduralPatternIndices?.get(e)??0,0,0,0]}createProceduralPatternTexture(e){const t=zt(e);return{proceduralPatternIndices:t.patternIndices,proceduralPatternTexture:this.context.device.createTexture({data:t.data,width:t.width,height:t.height,format:It,sampler:{minFilter:"nearest",magFilter:"nearest"}})}}}K.defaultProps=Ht,K.extensionName="FillStyleExtension";const Wt={clipBounds:[0,0,1,1],clipByInstance:void 0},Fe=`
layout(std140) uniform clipUniforms {
  vec4 bounds;
} clip;

bool clip_isInBounds(vec2 position) {
  return position.x >= clip.bounds[0] && position.y >= clip.bounds[1] && position.x < clip.bounds[2] && position.y < clip.bounds[3];
}
`,$t={name:"clip",vs:Fe,uniformTypes:{bounds:"vec4<f32>"}},Yt={"vs:#decl":`
out float clip_isVisible;
`,"vs:DECKGL_FILTER_GL_POSITION":`
  clip_isVisible = float(clip_isInBounds(geometry.worldPosition.xy));
`,"fs:#decl":`
in float clip_isVisible;
`,"fs:DECKGL_FILTER_COLOR":`
  if (clip_isVisible < 0.5) discard;
`},Kt={name:"clip",fs:Fe,uniformTypes:{bounds:"vec4<f32>"}},Zt={"vs:#decl":`
out vec2 clip_commonPosition;
`,"vs:DECKGL_FILTER_GL_POSITION":`
  clip_commonPosition = geometry.position.xy;
`,"fs:#decl":`
in vec2 clip_commonPosition;
`,"fs:DECKGL_FILTER_COLOR":`
  if (!clip_isInBounds(clip_commonPosition)) discard;
`};class Z extends T{getShaders(){let e="instancePositions"in this.getAttributeManager().attributes;return this.props.clipByInstance!==void 0&&(e=!!this.props.clipByInstance),this.state.clipByInstance=e,this.context.device.type==="webgpu"?{}:e?{modules:[$t],inject:Yt}:{modules:[Kt],inject:Zt}}draw(){const{clipBounds:e}=this.props,t={};if(this.state.clipByInstance)t.bounds=e;else{const i=this.projectPosition([e[0],e[1],0]),a=this.projectPosition([e[2],e[3],0]);t.bounds=[Math.min(i[0],a[0]),Math.min(i[1],a[1]),Math.max(i[0],a[0]),Math.max(i[1],a[1])]}this.context.device.type==="webgpu"&&(t.enabled=!0,t.mode=this.state.clipByInstance?"instance":"geometry"),this.setShaderModuleProps({clip:t})}}Z.defaultProps=Wt,Z.extensionName="ClipExtension";const qt=`
in float collisionPriorities;

uniform sampler2D collision_texture;

layout(std140) uniform collisionUniforms {
  bool sort;
  bool enabled;
} collision;

vec2 collision_getCoords(vec4 position) {
  vec4 collision_clipspace = project_common_position_to_clipspace(position);
  return (1.0 + collision_clipspace.xy / collision_clipspace.w) / 2.0;
}

float collision_match(vec2 tex, vec3 pickingColor) {
  vec4 collision_pickingColor = texture(collision_texture, tex);
  float delta = dot(abs(collision_pickingColor.rgb - pickingColor), vec3(1.0));
  float e = 0.001;
  return step(delta, e);
}

float collision_isVisible(vec2 texCoords, vec3 pickingColor) {
  if (!collision.enabled) {
    return 1.0;
  }

  // Visibility test, sample area of 5x5 pixels in order to fade in/out.
  // Due to the locality, the lookups will be cached
  // This reduces the flicker present when objects are shown/hidden
  const int N = 2;
  float accumulator = 0.0;
  vec2 step = vec2(1.0 / project.viewportSize);

  const float floatN = float(N);
  vec2 delta = -floatN * step;
  for(int i = -N; i <= N; i++) {
    delta.x = -step.x * floatN;
    for(int j = -N; j <= N; j++) {
      accumulator += collision_match(texCoords + delta, pickingColor);
      delta.x += step.x;
    }
    delta.y += step.y;
  }

  float W = 2.0 * floatN + 1.0;
  return pow(accumulator / (W * W), 2.2);
}
`,Xt={"vs:#decl":`
  float collision_fade = 1.0;
`,"vs:DECKGL_FILTER_GL_POSITION":`
  if (collision.sort) {
    float collisionPriority = collisionPriorities;
    position.z = -0.001 * collisionPriority * position.w; // Support range -1000 -> 1000
  }

  if (collision.enabled) {
    vec4 collision_common_position = project_position(vec4(geometry.worldPosition, 1.0));
    vec2 collision_texCoords = collision_getCoords(collision_common_position);
    collision_fade = collision_isVisible(collision_texCoords, geometry.pickingColor / 255.0);
    if (collision_fade < 0.0001) {
      // Position outside clip space bounds to discard
      position = vec4(0.0, 0.0, 2.0, 1.0);
    }
  }
  `,"vs:DECKGL_FILTER_COLOR":`
  color.a *= collision_fade;
  `},Jt=o=>{if(!o||!("dummyCollisionMap"in o))return{};const{enabled:e,collisionFBO:t,drawToCollisionMap:i,dummyCollisionMap:a}=o;return{enabled:e&&!i,sort:!!i,collision_texture:!i&&t?t.colorAttachments[0]:a}};var Qt={name:"collision",dependencies:[b],vs:qt,inject:Xt,getUniforms:Jt,uniformTypes:{sort:"i32",enabled:"i32"}};class ei extends U{renderCollisionMap(e,t){const a=[0,0,0,0],s=[1,1,e.width-2,e.height-2];this.render({...t,clearColor:a,scissorRect:s,target:e,pass:"collision"})}getLayerParameters(e,t,i){return{...e.props.parameters,blend:!1,depthWriteEnabled:!0,depthCompare:"less-equal"}}getShaderModuleProps(){return{collision:{drawToCollisionMap:!0},picking:{isActive:1,isAttribute:!1},lighting:{enabled:!1}}}}const q=2;class ti{constructor(){this.id="collision-filter-effect",this.props=null,this.useInPicking=!0,this.order=1,this.channels={},this.collisionFBOs={}}setup(e){this.context=e;const{device:t}=e;this.dummyCollisionMap=t.createTexture({width:1,height:1}),this.collisionFilterPass=new ei(t,{id:"default-collision-filter"})}preRender({effects:e,layers:t,layerFilter:i,viewports:a,onViewportActive:s,views:r,isPicking:l,preRenderStats:n={}}){const{device:c}=this.context;if(l)return;const f=t.filter(({props:{visible:v,collisionEnabled:M}})=>v&&M);if(f.length===0){this.channels={};return}const d=e?.filter(v=>v.useInPicking&&n[v.id]),u=n["mask-effect"]?.didRender,h=this._groupByCollisionGroup(c,f),p=a[0],E=!this.lastViewport||!this.lastViewport.equals(p)||u;for(const v in h){const M=this.collisionFBOs[v],C=h[v],[y,A]=c.canvasContext.getPixelSize();M.resize({width:y/q,height:A/q}),this._render(C,{effects:d,layerFilter:i,onViewportActive:s,views:r,viewport:p,viewportChanged:E})}}_render(e,{effects:t,layerFilter:i,onViewportActive:a,views:s,viewport:r,viewportChanged:l}){const{collisionGroup:n}=e,c=this.channels[n];if(!c)return;const f=l||e===c||!R(c.layers,e.layers,1)||e.layerBounds.some((d,u)=>!he(d,c.layerBounds[u]))||e.allLayersLoaded!==c.allLayersLoaded||e.layers.some(d=>d.props.transitions);if(this.channels[n]=e,f){this.lastViewport=r;const d=this.collisionFBOs[n];this.collisionFilterPass.renderCollisionMap(d,{pass:"collision-filter",isPicking:!0,layers:e.layers,effects:t,layerFilter:i,viewports:r?[r]:[],onViewportActive:a,views:s,shaderModuleProps:{collision:{enabled:!0,dummyCollisionMap:this.dummyCollisionMap},project:{devicePixelRatio:d.device.canvasContext.getDevicePixelRatio()/q}}})}}_groupByCollisionGroup(e,t){const i={};for(const a of t){const s=a.props.collisionGroup;let r=i[s];r||(r={collisionGroup:s,layers:[],layerBounds:[],allLayersLoaded:!0},i[s]=r),r.layers.push(a),r.layerBounds.push(a.getBounds()),a.isLoaded||(r.allLayersLoaded=!1)}for(const a of Object.keys(i))this.collisionFBOs[a]||this.createFBO(e,a),this.channels[a]||(this.channels[a]=i[a]);for(const a of Object.keys(this.collisionFBOs))i[a]||this.destroyFBO(a);return i}getShaderModuleProps(e){const{collisionGroup:t,collisionEnabled:i}=e.props,{collisionFBOs:a,dummyCollisionMap:s}=this,r=a[t];return{collision:{enabled:i&&!!r,collisionFBO:r,dummyCollisionMap:s}}}cleanup(){this.dummyCollisionMap&&(this.dummyCollisionMap.delete(),this.dummyCollisionMap=void 0),this.channels={};for(const e of Object.keys(this.collisionFBOs))this.destroyFBO(e);this.collisionFBOs={},this.lastViewport=void 0}createFBO(e,t){const{width:i,height:a}=e.getDefaultCanvasContext().canvas,s=e.createTexture({format:"rgba8unorm",width:i,height:a,sampler:{minFilter:"nearest",magFilter:"nearest",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}}),r=e.createTexture({format:"depth16unorm",width:i,height:a});this.collisionFBOs[t]=e.createFramebuffer({id:`collision-${t}`,width:i,height:a,colorAttachments:[s],depthStencilAttachment:r})}destroyFBO(e){const t=this.collisionFBOs[e];t.colorAttachments[0]?.destroy(),t.depthStencilAttachment?.destroy(),t.destroy(),delete this.collisionFBOs[e]}}const ii={getCollisionPriority:{type:"accessor",value:0},collisionEnabled:!0,collisionGroup:{type:"string",value:"default"},collisionTestProps:{}};class X extends T{getShaders(){return{modules:[Qt]}}draw({shaderModuleProps:e}){e.collision?.drawToCollisionMap&&(this.props=this.clone(this.props.collisionTestProps).props)}initializeState(e,t){if(this.getAttributeManager()===null)return;this.context.deck?._addDefaultEffect(new ti),this.getAttributeManager().add({collisionPriorities:{size:1,stepMode:"dynamic",accessor:"getCollisionPriority"}})}getNeedsPickingBuffer(){return this.props.collisionEnabled}}X.defaultProps=ii,X.extensionName="CollisionFilterExtension";const Ee=`layout(std140) uniform maskUniforms {
  vec4 bounds;
  highp int channel;
  bool enabled;
  bool inverted;
  bool maskByInstance;
} mask;
`,ai=`
vec2 mask_getCoords(vec4 position) {
  return (position.xy - mask.bounds.xy) / (mask.bounds.zw - mask.bounds.xy);
}
`,si=`
${Ee}
${ai}
`,ri=`
uniform sampler2D mask_texture;

bool mask_isInBounds(vec2 texCoords) {
  if (!mask.enabled) {
    return true;
  }
  vec4 maskColor = texture(mask_texture, texCoords);
  float maskValue = 1.0;
  if (mask.channel == 0) {
    maskValue = maskColor.r;
  } else if (mask.channel == 1) {
    maskValue = maskColor.g;
  } else if (mask.channel == 2) {
    maskValue = maskColor.b;
  } else if (mask.channel == 3) {
    maskValue = maskColor.a;
  }

  if (mask.inverted) {
    return maskValue >= 0.5;
  } else {
    return maskValue < 0.5;
  }
}
`,oi=`
${Ee}
${ri}
`,ni={"vs:#decl":`
out vec2 mask_texCoords;
`,"vs:#main-end":`
   vec4 mask_common_position;
   if (mask.maskByInstance) {
     mask_common_position = project_position(vec4(geometry.worldPosition, 1.0));
   } else {
     mask_common_position = geometry.position;
   }
   mask_texCoords = mask_getCoords(mask_common_position);
`,"fs:#decl":`
in vec2 mask_texCoords;
`,"fs:#main-start":`
  if (mask.enabled) {
    bool mask = mask_isInBounds(mask_texCoords);

    // Debug: show extent of render target
    // fragColor = vec4(mask_texCoords, 0.0, 1.0);
    // fragColor = texture(mask_texture, mask_texCoords);

    if (!mask) discard;
  }
`},li=o=>o&&"maskMap"in o?{mask_texture:o.maskMap}:o||{};var ci={name:"mask",dependencies:[b],vs:si,fs:oi,inject:ni,getUniforms:li,uniformTypes:{bounds:"vec4<f32>",channel:"i32",enabled:"i32",inverted:"i32",maskByInstance:"i32"}};const di={blendColorOperation:"subtract",blendColorSrcFactor:"zero",blendColorDstFactor:"one",blendAlphaOperation:"subtract",blendAlphaSrcFactor:"zero",blendAlphaDstFactor:"one"};class fi extends U{constructor(e,t){super(e,t);const{mapSize:i=2048}=t;this.maskMap=e.createTexture({format:"rgba8unorm",width:i,height:i,sampler:{minFilter:"linear",magFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}}),this.fbo=e.createFramebuffer({id:"maskmap",width:i,height:i,colorAttachments:[this.maskMap]})}render(e){const t=2**e.channel,i=[255,255,255,255];super.render({...e,clearColor:i,colorMask:t,target:this.fbo,pass:"mask"})}getLayerParameters(e,t,i){return{...e.props.parameters,blend:!0,depthCompare:"always",...di}}shouldDrawLayer(e){return e.props.operation.includes("mask")}delete(){this.fbo.delete(),this.maskMap.delete()}}const J=new N({width:1,height:1,longitude:0,latitude:0,zoom:0});function Q(o){const[e,t]=J.projectPosition(o);return[e,t]}function ke(o){return o.isGeospatial?J:o}function ee(o,e){const t=[1/0,1/0,-1/0,-1/0];for(const i of o){const a=i.getBounds();if(a){const s=i.projectPosition(a[0],{viewport:e,autoOffset:!1}),r=i.projectPosition(a[1],{viewport:e,autoOffset:!1});t[0]=Math.min(t[0],s[0]),t[1]=Math.min(t[1],s[1]),t[2]=Math.max(t[2],r[0]),t[3]=Math.max(t[3],r[1])}}return Number.isFinite(t[0])?t:null}const ui=2048;function te(o){const{bounds:e,viewport:t,border:i=0}=o,{isGeospatial:a}=t;if(e[2]<=e[0]||e[3]<=e[1])return null;const s=a?J.unprojectPosition([(e[0]+e[2])/2,(e[1]+e[3])/2,0]):t.unprojectPosition([(e[0]+e[2])/2,(e[1]+e[3])/2,0]);let{width:r,height:l,zoom:n}=o;if(n===void 0){r=r-i*2,l=l-i*2;const c=Math.min(r/(e[2]-e[0]),l/(e[3]-e[1]));n=Math.min(Math.log2(c),20)}else if(!r||!l){const c=2**n;r=Math.round(Math.abs(e[2]-e[0])*c),l=Math.round(Math.abs(e[3]-e[1])*c);const f=ui-i*2;if(r>f||l>f){const d=f/Math.max(r,l);r=Math.round(r*d),l=Math.round(l*d),n+=Math.log2(d)}}return a?new N({id:t.id,x:i,y:i,width:r,height:l,longitude:s[0],latitude:s[1],zoom:n,orthographic:!0}):new Ue({id:t.id,x:i,y:i,width:r,height:l,target:s,zoom:n,flipY:!1})}function hi(o,e){let t;t=o.getBounds();const i=o.projectPosition(t.slice(0,2)),a=o.projectPosition(t.slice(2,4));return[i[0],i[1],a[0],a[1]]}function ie(o,e,t){if(!o)return[0,0,1,1];const i=hi(e),a=pi(i);return o[2]-o[0]<=a[2]-a[0]&&o[3]-o[1]<=a[3]-a[1]?o:[Math.max(o[0],a[0]),Math.max(o[1],a[1]),Math.min(o[2],a[2]),Math.min(o[3],a[3])]}function pi(o){const e=o[2]-o[0],t=o[3]-o[1],i=(o[0]+o[2])/2,a=(o[1]+o[3])/2;return[i-e,a-t,i+e,a+t]}class gi{constructor(){this.id="mask-effect",this.props=null,this.useInPicking=!0,this.order=0,this.channels=[],this.masks=null}setup({device:e}){this.dummyMaskMap=e.createTexture({width:1,height:1}),this.maskPass=new fi(e,{id:"default-mask"}),this.maskMap=this.maskPass.maskMap}preRender({layers:e,layerFilter:t,viewports:i,onViewportActive:a,views:s,effects:r,isPicking:l}){let n=!1;if(l)return{didRender:n};const c=e.filter(h=>h.props.visible&&h.props.operation.includes("mask"));if(c.length===0)return this.masks=null,this.channels.length=0,{didRender:n};this.masks={};const f=this._sortMaskChannels(c),d=i[0],u=!this.lastViewport||!this.lastViewport.equals(d);if(d.resolution!==void 0)return S.warn("MaskExtension is not supported in GlobeView")(),{didRender:n};for(const h in f){const p=this._renderChannel(f[h],{layerFilter:t,onViewportActive:a,views:s,effects:r,viewport:d,viewportChanged:u});n||(n=p)}return{didRender:n}}_renderChannel(e,{layerFilter:t,onViewportActive:i,views:a,effects:s,viewport:r,viewportChanged:l}){let n=!1;const c=this.channels[e.index];if(!c)return n;const f=e===c||e.layers.length!==c.layers.length||e.layers.some((d,u)=>d!==c.layers[u]||d.props.transitions)||e.layerBounds.some((d,u)=>d!==c.layerBounds[u]);if(e.bounds=c.bounds,e.maskBounds=c.maskBounds,this.channels[e.index]=e,f||l){this.lastViewport=r;const d=ee(e.layers,r);if(e.bounds=d&&ie(d,r),f||!he(e.bounds,c.bounds)){const{maskPass:u,maskMap:h}=this,p=d&&te({bounds:e.bounds,viewport:r,width:h.width,height:h.height,border:1});e.maskBounds=p?p.getBounds():[0,0,1,1],u.render({pass:"mask",channel:e.index,layers:e.layers,layerFilter:t,viewports:p?[p]:[],onViewportActive:i,views:a,effects:s,shaderModuleProps:{project:{devicePixelRatio:1}}}),n=!0}}return this.masks[e.id]={index:e.index,bounds:e.maskBounds,coordinateOrigin:e.coordinateOrigin,coordinateSystem:e.coordinateSystem},n}_sortMaskChannels(e){const t={};let i=0;for(const a of e){const{id:s}=a.root;let r=t[s];if(!r){if(++i>4){S.warn("Too many mask layers. The max supported is 4")();continue}r={id:s,index:this.channels.findIndex(l=>l?.id===s),layers:[],layerBounds:[],coordinateOrigin:a.root.props.coordinateOrigin,coordinateSystem:a.root.props.coordinateSystem},t[s]=r}r.layers.push(a),r.layerBounds.push(a.getBounds())}for(let a=0;a<4;a++){const s=this.channels[a];(!s||!(s.id in t))&&(this.channels[a]=null)}for(const a in t){const s=t[a];s.index<0&&(s.index=this.channels.findIndex(r=>!r),this.channels[s.index]=s)}return t}getShaderModuleProps(){return{mask:{maskMap:this.masks?this.maskMap:this.dummyMaskMap,maskChannels:this.masks}}}cleanup(){this.dummyMaskMap&&(this.dummyMaskMap.delete(),this.dummyMaskMap=void 0),this.maskPass&&(this.maskPass.delete(),this.maskPass=void 0,this.maskMap=void 0),this.lastViewport=void 0,this.masks=null,this.channels.length=0}}const mi={maskId:"",maskByInstance:void 0,maskInverted:!1};class ae extends T{initializeState(){this.context.deck?._addDefaultEffect(new gi)}getShaders(){let e="instancePositions"in this.getAttributeManager().attributes;return this.props.maskByInstance!==void 0&&(e=!!this.props.maskByInstance),this.state.maskByInstance=e,{modules:[ci]}}draw({context:e,shaderModuleProps:t}){const i={};i.maskByInstance=!!this.state.maskByInstance;const{maskId:a,maskInverted:s}=this.props,{maskChannels:r}=t.mask||{},{viewport:l}=e;if(r&&r[a]){const{index:n,bounds:c,coordinateOrigin:f}=r[a];let{coordinateSystem:d}=r[a];i.enabled=!0,i.channel=n,i.inverted=s,d===j.DEFAULT&&(d=l.isGeospatial?j.LNGLAT:j.CARTESIAN);const u={modelMatrix:null,fromCoordinateOrigin:f,fromCoordinateSystem:d},h=this.projectPosition([c[0],c[1],0],u),p=this.projectPosition([c[2],c[3],0],u);i.bounds=[h[0],h[1],p[0],p[1]]}else a&&S.warn(`Could not find a mask layer with id: ${a}`)(),i.enabled=!1;this.setShaderModuleProps({mask:i})}}ae.defaultProps=mi,ae.extensionName="MaskExtension";const _={NONE:0,WRITE_HEIGHT_MAP:1,USE_HEIGHT_MAP:2,USE_COVER:3,USE_COVER_ONLY:4,SKIP:5},vi=Object.keys(_).map(o=>`const float TERRAIN_MODE_${o} = ${_[o]}.0;`).join(`
`),Se=vi+`
layout(std140) uniform terrainUniforms {
  float mode;
  vec4 bounds;
} terrain;

uniform sampler2D terrain_map;
`,se={name:"terrain",dependencies:[b],vs:`${Se}
out vec3 commonPos;
// In globe mode, absolute Mercator position for terrain FBO UV lookups
out vec2 terrainMercPos;
out float terrainHeight;

vec2 terrain_globe_to_mercator(vec3 globePosition) {
  float D = length(globePosition);
  float sinLat = clamp(globePosition.z / D, -0.999998, 0.999998);
  float x = atan(globePosition.x, -globePosition.y);
  float y = atanh(sinLat);
  return (vec2(x, y) + PI) * WORLD_SCALE;
}
`,fs:`${Se}in vec2 terrainMercPos;
in float terrainHeight;`,inject:{"vs:#main-start":`
if (terrain.mode == TERRAIN_MODE_SKIP) {
  gl_Position = vec4(0.0);
  return;
}
`,"vs:DECKGL_FILTER_GL_POSITION":`
commonPos = geometry.position.xyz;
terrainHeight = commonPos.z + project.commonOrigin.z;
if (project.projectionMode == PROJECTION_MODE_GLOBE) {
  terrainMercPos = terrain_globe_to_mercator(commonPos);
  terrainHeight = length(commonPos) - GLOBE_RADIUS;
} else {
  terrainMercPos = commonPos.xy;
}
if (terrain.mode == TERRAIN_MODE_WRITE_HEIGHT_MAP) {
  vec2 texCoords = (terrainMercPos - terrain.bounds.xy) / terrain.bounds.zw;
  position = vec4(texCoords * 2.0 - 1.0, 0.0, 1.0);
}
if (terrain.mode == TERRAIN_MODE_USE_HEIGHT_MAP) {
  vec3 anchor = geometry.worldPosition;
  anchor.z = 0.0;
  vec3 anchorCommon = project_position(anchor);
  vec2 anchorMercPos = project.projectionMode == PROJECTION_MODE_GLOBE
    ? terrain_globe_to_mercator(anchorCommon)
    : anchorCommon.xy;
  vec2 texCoords = (anchorMercPos - terrain.bounds.xy) / terrain.bounds.zw;
  if (texCoords.x >= 0.0 && texCoords.y >= 0.0 && texCoords.x <= 1.0 && texCoords.y <= 1.0) {
    float terrainZ = texture(terrain_map, texCoords).r;
    if (project.projectionMode == PROJECTION_MODE_GLOBE) {
      // Height map is written in Mercator common space (units = TILE_SIZE / EARTH_CIRCUMFERENCE / cos(lat))
      // Convert to globe radial units (units = GLOBE_RADIUS / EARTH_RADIUS)
      terrainZ *= cos(radians(geometry.worldPosition.y)) * PI;
      geometry.position.xyz += normalize(geometry.position.xyz) * terrainZ;
    } else {
      geometry.position.z += terrainZ;
    }
    position = project_common_position_to_clipspace(geometry.position);
  }
}
    `,"fs:#main-start":`
if (terrain.mode == TERRAIN_MODE_WRITE_HEIGHT_MAP) {
  fragColor = vec4(terrainHeight, 0.0, 0.0, 1.0);
  return;
}
    `,"fs:DECKGL_FILTER_COLOR":`
if ((terrain.mode == TERRAIN_MODE_USE_COVER) || (terrain.mode == TERRAIN_MODE_USE_COVER_ONLY)) {
  vec2 texCoords = (terrainMercPos - terrain.bounds.xy) / terrain.bounds.zw;
  vec4 pixel = texture(terrain_map, texCoords);
  if (terrain.mode == TERRAIN_MODE_USE_COVER_ONLY) {
    color = pixel;
  } else {
    // pixel is premultiplied
    color = pixel + color * (1.0 - pixel.a);
  }
  return;
}
    `},getUniforms:(o={})=>{if(!o.dummyHeightMap)return{};if("terrainSkipRender"in o||"drawToTerrainHeightMap"in o){const{drawToTerrainHeightMap:e,heightMap:t,heightMapBounds:i,dummyHeightMap:a,terrainCover:s,useTerrainHeightMap:r,terrainSkipRender:l}=o,n=b.getUniforms(o.project),{commonOrigin:c}=n;let f=l?_.SKIP:_.NONE,d=a,u=null;if(e)f=_.WRITE_HEIGHT_MAP,u=i;else if(r&&t)f=_.USE_HEIGHT_MAP,d=t,u=i;else if(s){const p=(o.isPicking?s.getPickingFramebuffer():s.getRenderFramebuffer())?.colorAttachments[0].texture;o.isPicking&&(f=_.SKIP),p?(d=p,f=f===_.SKIP?_.USE_COVER_ONLY:_.USE_COVER,u=s.bounds):o.isPicking&&!l&&(f=_.NONE)}return{mode:f,terrain_map:d,bounds:u?[u[0]-c[0],u[1]-c[1],u[2]-u[0],u[3]-u[1]]:[0,0,0,0]}}return{mode:_.NONE,terrain_map:o.dummyHeightMap,bounds:[0,0,0,0]}},uniformTypes:{mode:"f32",bounds:"vec4<f32>"}};function re(o,e){return o.createFramebuffer({id:e.id,colorAttachments:[o.createTexture({id:e.id,...e.float&&{format:"rgba32float",type:5126},dimension:"2d",width:1,height:1,sampler:e.interpolate===!1?{minFilter:"nearest",magFilter:"nearest"}:{minFilter:"linear",magFilter:"linear"}})]})}class _i{constructor(e){this.isDirty=!0,this.renderViewport=null,this.bounds=null,this.layers=[],this.targetBounds=null,this.targetBoundsCommon=null,this.targetLayer=e,this.tile=we(e)}get id(){return this.targetLayer.id}get isActive(){return!!this.targetLayer.getCurrentLayer()}shouldUpdate({targetLayer:e,viewport:t,layers:i,layerNeedsRedraw:a}){e&&(this.targetLayer=e);const s=t?this._updateViewport(t):!1;let r=i?this._updateLayers(i):!1;if(a){for(const l of this.layers)if(a[l]){r=!0;break}}return r||s}_updateLayers(e){let t=!1;if(e=this.tile?yi(this.tile,e):e,e.length!==this.layers.length)t=!0;else for(let i=0;i<e.length;i++)if(e[i].id!==this.layers[i]){t=!0;break}return t&&(this.layers=e.map(i=>i.id)),t}_updateViewport(e){const t=this.targetLayer;let i=!1;if(this.tile&&"boundingBox"in this.tile){if(!this.targetBounds){i=!0,this.targetBounds=this.tile.boundingBox;const s=Q(this.targetBounds[0]),r=Q(this.targetBounds[1]);this.targetBoundsCommon=[s[0],s[1],r[0],r[1]]}}else this.targetBounds!==t.getBounds()&&(i=!0,this.targetBounds=t.getBounds(),this.targetBoundsCommon=ee([t],ke(e)));if(!this.targetBoundsCommon)return!1;const a=Math.ceil(e.zoom+.5);if(this.tile)this.bounds=this.targetBoundsCommon;else{const s=this.renderViewport?.zoom;i=i||a!==s;const r=e instanceof fe?this.targetBoundsCommon:ie(this.targetBoundsCommon,e),l=this.bounds;i=i||!l||r.some((n,c)=>n!==l[c]),this.bounds=r}return i&&(this.renderViewport=te({bounds:this.bounds,zoom:a,viewport:e})),i}getRenderFramebuffer(){return!this.renderViewport||this.layers.length===0?null:(this.fbo||(this.fbo=re(this.targetLayer.context.device,{id:this.id})),this.fbo)}getPickingFramebuffer(){return!this.renderViewport||this.layers.length===0&&!this.targetLayer.props.pickable?null:(this.pickingFbo||(this.pickingFbo=re(this.targetLayer.context.device,{id:`${this.id}-picking`,interpolate:!1})),this.pickingFbo)}filterLayers(e){return e.filter(({id:t})=>this.layers.includes(t))}delete(){const{fbo:e,pickingFbo:t}=this;e&&(e.colorAttachments[0].destroy(),e.destroy()),t&&(t.colorAttachments[0].destroy(),t.destroy())}}function yi(o,e){return e.filter(t=>{const i=we(t);return i?Pi(o.boundingBox,i.boundingBox):!0})}function we(o){for(;o;){const{tile:e}=o.props;if(e)return e;o=o.parent}return null}function Pi(o,e){return o&&e?o[0][0]<e[1][0]&&e[0][0]<o[1][0]&&o[0][1]<e[1][1]&&e[0][1]<o[1][1]:!1}const xi={blendColorOperation:"max",blendColorSrcFactor:"one",blendColorDstFactor:"one",blendAlphaOperation:"max",blendAlphaSrcFactor:"one",blendAlphaDstFactor:"one"};class bi extends U{getRenderableLayers(e,t){const{layers:i}=t,a=[],s=this._getDrawLayerParams(e,t,!0);for(let r=0;r<i.length;r++){const l=i[r];!l.isComposite&&s[r].shouldDrawLayer&&a.push(l)}return a}renderHeightMap(e,t){const i=e.getRenderFramebuffer(),a=e.renderViewport;!i||!a||(i.resize(a),this.render({...t,target:i,pass:"terrain-height-map",layers:t.layers,viewports:[a],effects:[],clearColor:[0,0,0,0]}))}renderTerrainCover(e,t){const i=e.getRenderFramebuffer(),a=e.renderViewport;if(!i||!a)return;const s=e.filterLayers(t.layers);i.resize(a),this.render({...t,target:i,pass:`terrain-cover-${e.id}`,layers:s,viewports:[a],clearColor:[0,0,0,0]})}getLayerParameters(e,t,i){return{...e.props.parameters,blend:!0,depthCompare:"always",...e.props.operation.includes("terrain")&&xi}}getShaderModuleProps(e,t,i){return{terrain:{project:i.project}}}}class Ti extends je{constructor(){super(...arguments),this.drawParameters={}}getRenderableLayers(e,t){const{layers:i}=t,a=[];this.drawParameters={},this._resetColorEncoder(t.pickZ);const s=this._getDrawLayerParams(e,t);for(let r=0;r<i.length;r++){const l=i[r];!l.isComposite&&s[r].shouldDrawLayer&&(a.push(l),this.drawParameters[l.id]=s[r].layerParameters)}return a}renderTerrainCover(e,t){const i=e.getPickingFramebuffer(),a=e.renderViewport;if(!i||!a)return;const s=e.filterLayers(t.layers),r=e.targetLayer;r.props.pickable&&s.unshift(r),i.resize(a);const n=this.drawParameters[r.id]?.blendColor?.[3]??0;this.render({...t,pickingFBO:i,pass:`terrain-cover-picking-${e.id}`,layers:s,viewports:[a],cullRect:void 0,deviceRect:a,pickZ:!1,clearColor:[0,0,0,n]})}getLayerParameters(e,t,i){let a;return this.drawParameters[e.id]?a=this.drawParameters[e.id]:(a=super.getLayerParameters(e,t,i),a.blend=!0),{...a,depthCompare:"always",blendAlphaSrcFactor:"constant"}}getShaderModuleProps(e,t,i){return{...super.getShaderModuleProps(e,t,i),terrain:{project:i.project}}}}const Re=2048;class De{static isSupported(e){return e.isTextureFormatRenderable("rgba32float")}constructor(e){this.renderViewport=null,this.bounds=null,this.layers=[],this.layersBounds=[],this.layersBoundsCommon=null,this.lastViewport=null,this.device=e}getRenderFramebuffer(){return this.renderViewport?(this.fbo||(this.fbo=re(this.device,{id:"height-map",float:!0})),this.fbo):null}shouldUpdate({layers:e,viewport:t}){const i=e.length!==this.layers.length||e.some((s,r)=>s!==this.layers[r]||s.props.transitions||s.getBounds()!==this.layersBounds[r]);i&&(this.layers=e,this.layersBounds=e.map(s=>s.getBounds()),this.layersBoundsCommon=ee(e,ke(t)));const a=!this.lastViewport||!t.equals(this.lastViewport);if(!this.layersBoundsCommon)this.renderViewport=null;else if(i||a){const s=t instanceof fe?this.layersBoundsCommon:ie(this.layersBoundsCommon,t);if(s[2]<=s[0]||s[3]<=s[1])return this.renderViewport=null,!1;this.bounds=s,this.lastViewport=t;const r=t.scale,l=(s[2]-s[0])*r,n=(s[3]-s[1])*r,c=t.isGeospatial?Q([t.longitude??0,t.latitude??0]):[t.center[0],t.center[1]];return this.renderViewport=l>0||n>0?te({bounds:[c[0]-1,c[1]-1,c[0]+1,c[1]+1],zoom:t.zoom,width:Math.min(l,Re),height:Math.min(n,Re),viewport:t}):null,!0}return!1}delete(){this.fbo&&(this.fbo.colorAttachments[0].delete(),this.fbo.delete())}}class Mi{constructor(){this.id="terrain-effect",this.props=null,this.useInPicking=!0,this.isPicking=!1,this.isDrapingEnabled=!1,this.terrainCovers=new Map}setup({device:e,deck:t}){this.dummyHeightMap=e.createTexture({width:1,height:1,data:new Uint8Array([0,0,0,0])}),this.terrainPass=new bi(e,{id:"terrain"}),this.terrainPickingPass=new Ti(e,{id:"terrain-picking"}),De.isSupported(e)?this.heightMap=new De(e):S.warn("Terrain offset mode is not supported by this browser")(),t._addDefaultShaderModule(se)}preRender(e){if(e.pickZ){this.isDrapingEnabled=!1;return}const{viewports:t}=e,i=e.pass.startsWith("picking");this.isPicking=i,this.isDrapingEnabled=!0;const a=t[0],s=(i?this.terrainPickingPass:this.terrainPass).getRenderableLayers(a,e),r=s.filter(c=>c.props.operation.includes("terrain"));if(r.length===0)return;i||s.filter(f=>f.state.terrainDrawMode==="offset").length>0&&this._updateHeightMap(r,a,e);const l=s.filter(c=>c.state.terrainDrawMode==="drape"),n=e.effects?.filter(c=>c!==this);this._updateTerrainCovers(r,l,a,{...e,effects:n})}getShaderModuleProps(e,t){if(e.props.operation.includes("mask"))return{terrain:{dummyHeightMap:this.dummyHeightMap}};const{terrainDrawMode:i}=e.state,a=this.isDrapingEnabled?this.terrainCovers.get(e.id)??null:null;return this.isPicking&&e.props.operation.includes("terrain")&&(e.state._hasPickingCover=!!a?.getPickingFramebuffer()),{terrain:{project:t.project,isPicking:this.isPicking,heightMap:this.heightMap?.getRenderFramebuffer()?.colorAttachments[0].texture||null,heightMapBounds:this.heightMap?.bounds,dummyHeightMap:this.dummyHeightMap,terrainCover:a,useTerrainHeightMap:i==="offset",terrainSkipRender:i==="drape"||!e.props.operation.includes("draw")}}}cleanup({deck:e}){this.dummyHeightMap&&(this.dummyHeightMap.delete(),this.dummyHeightMap=void 0),this.heightMap&&(this.heightMap.delete(),this.heightMap=void 0);for(const t of this.terrainCovers.values())t.delete();this.terrainCovers.clear(),e._removeDefaultShaderModule(se)}_updateHeightMap(e,t,i){!this.heightMap||!this.heightMap.shouldUpdate({layers:e,viewport:t})||this.terrainPass.renderHeightMap(this.heightMap,{...i,layers:e,shaderModuleProps:{terrain:{heightMapBounds:this.heightMap.bounds,dummyHeightMap:this.dummyHeightMap,drawToTerrainHeightMap:!0},project:{devicePixelRatio:1}}})}_updateTerrainCovers(e,t,i,a){const s={};for(const r of t)r.state.terrainCoverNeedsRedraw&&(s[r.id]=!0,r.state.terrainCoverNeedsRedraw=!1);for(const r of this.terrainCovers.values())r.isDirty=r.isDirty||r.shouldUpdate({layerNeedsRedraw:s});for(const r of e)this._updateTerrainCover(r,t,i,a);this.isPicking||this._pruneTerrainCovers()}_updateTerrainCover(e,t,i,a){const s=this.isPicking?this.terrainPickingPass:this.terrainPass;let r=this.terrainCovers.get(e.id);r||(r=new _i(e),this.terrainCovers.set(e.id,r));try{const l=r.shouldUpdate({targetLayer:e,viewport:i,layers:t});(this.isPicking||r.isDirty||l)&&(s.renderTerrainCover(r,{...a,layers:t,shaderModuleProps:{terrain:{dummyHeightMap:this.dummyHeightMap,terrainSkipRender:!1},project:{devicePixelRatio:1}}}),this.isPicking||(r.isDirty=!1))}catch(l){e.raiseError(l,`Error rendering terrain cover ${r.id}`)}}_pruneTerrainCovers(){const e=[];for(const[t,i]of this.terrainCovers)i.isActive||e.push(t);for(const t of e)this.terrainCovers.delete(t)}}const Ci={terrainDrawMode:void 0};class oe extends T{getShaders(){return{modules:[se]}}initializeState(){this.context.deck?._addDefaultEffect(new Mi)}updateState(e){const{props:t,oldProps:i}=e;if(this.state.terrainDrawMode&&t.terrainDrawMode===i.terrainDrawMode&&t.extruded===i.extruded)return;let{terrainDrawMode:a}=t;if(!a){const s=this.props.extruded,r=this.getAttributeManager()?.attributes,l=r&&"instancePositions"in r;a=s||l?"offset":"drape"}this.setState({terrainDrawMode:a})}onNeedsRedraw(){const e=this.state;e.terrainDrawMode==="drape"&&(e.terrainCoverNeedsRedraw=!0)}}oe.defaultProps=Ci,oe.extensionName="TerrainExtension";export{V as BrushingExtension,Z as ClipExtension,X as CollisionFilterExtension,z as DataFilterExtension,K as FillStyleExtension,be as Fp64Extension,ae as MaskExtension,G as PathStyleExtension,oe as _TerrainExtension,xe as project64};
//# sourceMappingURL=/sm/9b82d9e91c89c2f6a7f201649a428fe18c8af5e41dac7e93e57adfd73a82f5d1.map
/**
 * Bundled by jsDelivr using Rollup v4.62.2 and esbuild v0.28.1.
 * Original file: /npm/@turf/boolean-clockwise@5.1.5/main.es.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
import{getCoords as n}from"./turf-invariant@5.1.5-+esm.mjs";function y(r){if(!r)throw new Error("line is required");var g=r.geometry?r.geometry.type:r.type;if(!Array.isArray(r)&&g!=="LineString")throw new Error("geometry must be a LineString");for(var t=n(r),i=0,o=1,a,e;o<t.length;)a=e||t[0],e=t[o],i+=(e[0]-a[0])*(e[1]+a[1]),o++;return i>0}export{y as default};
//# sourceMappingURL=/sm/1edd5c5c20c8516312d608da81a6c3b75c2a8df9455e68459f72d18494cc17a6.map
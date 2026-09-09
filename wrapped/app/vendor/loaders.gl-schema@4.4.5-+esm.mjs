/**
 * Bundled by jsDelivr using Rollup v4.62.2 and esbuild v0.28.1.
 * Original file: /npm/@loaders.gl/schema@4.4.5/dist/index.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
function u(e){let t=0;for(const i in e){const n=e[i];ArrayBuffer.isView(n)&&(t+=n.byteLength*n.BYTES_PER_ELEMENT)}return t}function a(e){let t=1/0,i=1/0,n=1/0,l=-1/0,s=-1/0,r=-1/0;const o=e.POSITION?e.POSITION.value:[],m=o&&o.length;for(let f=0;f<m;f+=3){const I=o[f],c=o[f+1],y=o[f+2];t=I<t?I:t,i=c<i?c:i,n=y<n?y:n,l=I>l?I:l,s=c>s?c:s,r=y>r?y:r}return[[t,i,n],[l,s,r]]}export{a as getMeshBoundingBox,u as getMeshSize};
//# sourceMappingURL=/sm/8b61d5f90d5218c8dd0c5b59489d4a02bcfe2c222369c49910dbf62f1a06a286.map
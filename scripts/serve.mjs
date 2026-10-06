import {createServer,request as httpRequest} from 'node:http';
import {readFile,stat,readdir} from 'node:fs/promises';
import {createReadStream} from 'node:fs';
import {pipeline} from 'node:stream/promises';
import {brotliCompress,gzip,constants} from 'node:zlib';
import {promisify} from 'node:util';
import path from 'node:path';
import {projectRoot} from './log.mjs';
const variant=process.argv[2]??'optimized',port=Number(process.argv[3]??(variant==='baseline'?4174:4173));
if(!['baseline','optimized'].includes(variant))throw new Error('Unknown preview variant');
const root=path.join(projectRoot,variant==='baseline'?'.local/baseline-dist':'apps/web/dist');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.geojson':'application/json','.png':'image/png','.jpg':'image/jpeg','.gif':'image/gif','.webp':'image/webp','.woff2':'font/woff2','.ttf':'font/ttf','.otf':'font/otf','.svg':'image/svg+xml','.ico':'image/x-icon','.wasm':'application/wasm'};
const br=promisify(brotliCompress),gz=promisify(gzip),encoded=new Map();
const compressible=f=>/^(text|application\/json)/.test(types[path.extname(f)]??'');
async function prepare(file,info){let item=encoded.get(file);if(item?.mtime!==info.mtimeMs){const pending=(async()=>{const bytes=await readFile(file);const [brotli,zipped]=await Promise.all([br(bytes,{params:{[constants.BROTLI_PARAM_QUALITY]:4}}),gz(bytes)]);return{br:brotli,gzip:zipped};})();item={mtime:info.mtimeMs,pending};encoded.set(file,item);}return item.pending;}
async function warm(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())await warm(file);else if(compressible(file)){const info=await stat(file);if(info.size>1024)await prepare(file,info);}}}
await warm(root);
const server=createServer(async(req,res)=>{
try{
 if(req.url.startsWith('/api/')){const proxy=httpRequest({hostname:'127.0.0.1',port:18080,path:req.url.slice(4),method:req.method,headers:{...req.headers,host:'127.0.0.1:18080'}},up=>{res.writeHead(up.statusCode,up.headers);up.pipe(res);});proxy.on('error',()=>{if(!res.headersSent)res.writeHead(502);res.end();});req.pipe(proxy);return;}
 let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(pathname==='/')pathname='/index.html';
 let file=path.resolve(root,'.'+pathname);if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
 if(variant==='baseline'&&pathname.startsWith('/static/'))file=path.join(projectRoot,'.local/baseline-web',pathname);
 const info=await stat(file);if(!info.isFile())throw new Error('Not a file');
 res.setHeader('Content-Type',types[path.extname(file)]??'application/octet-stream');res.setHeader('Vary','Accept-Encoding');
 const accept=req.headers['accept-encoding']??'';
 if(compressible(file)&&info.size>1024&&(accept.includes('br')||accept.includes('gzip'))){const encoding=accept.includes('br')?'br':'gzip',body=(await prepare(file,info))[encoding];res.setHeader('Content-Encoding',encoding);res.setHeader('Content-Length',body.length);res.end(body);}
 else{res.setHeader('Content-Length',info.size);await pipeline(createReadStream(file),res);}
}catch{if(!res.headersSent)res.writeHead(404);res.end('Not found');}
});
server.listen(port,'127.0.0.1',()=>console.log(variant+' preview (precompressed Brotli quality 4): http://127.0.0.1:'+port));

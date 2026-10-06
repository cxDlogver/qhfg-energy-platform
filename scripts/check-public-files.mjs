import {readdir,readFile,stat,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {projectRoot,logStep} from './log.mjs';
const files=[],findings=[];const ignored=new Set(['node_modules','.local','.git','dist','coverage','artifacts','.svn','.idea','.vscode']);
async function walk(dir){for(const e of await readdir(dir,{withFileTypes:true})){if(ignored.has(e.name)||e.name.startsWith('.env')&&e.name!=='.env.example'||/\.log$|\.tsbuildinfo$/.test(e.name))continue;const f=path.join(dir,e.name),rel=path.relative(projectRoot,f).replaceAll('\\','/');if(rel==='apps/web/public/cesium'||rel==='apps/web/public/static')continue;if(e.isDirectory())await walk(f);else files.push(f);}}
await walk(projectRoot);
const patterns=[['private-key',/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],['github-token',/\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,})\b/],['aws-access-key',/\bAKIA[0-9A-Z]{16}\b/],['encoded-jwt',/\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{20,}\b/],['map-secret',/(?:tk=|access_token=)[a-fA-F0-9]{32}\b/]];
let bytes=0;
for(const f of files){const info=await stat(f);bytes+=info.size;const rel=path.relative(projectRoot,f).replaceAll('\\','/');if(info.size>100000000)findings.push({file:rel,type:'github-large-file-limit'});if(!/\.(?:js|mjs|ts|vue|json|html|md|ya?ml|properties|xml|py)$/.test(f)&&!path.basename(f).startsWith('.env'))continue;const content=await readFile(f,'utf8');for(const[type,pattern]of patterns)if(pattern.test(content))findings.push({file:rel,type});}
const report={runAt:new Date().toISOString(),files:files.length,bytes,findings,scope:'candidate files excluding gitignore-generated/private folders; values never recorded; examples and fixture passwords are intentional. This automated scan complements review, not a claim of universal secret detection.'};
await mkdir(path.join(projectRoot,'docs/validation'),{recursive:true});await writeFile(path.join(projectRoot,'docs/validation/public-files.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));if(findings.length)throw new Error('Public scan findings require correction');await logStep('公开文件检查通过',JSON.stringify(report));

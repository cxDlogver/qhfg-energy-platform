import {mkdir,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';import pixelmatch from 'pixelmatch';
import {launch,login,dataPage} from './browser.mjs';
import {projectRoot,logStep} from './log.mjs';
const folder=path.join(projectRoot,'docs/validation/screenshots');await mkdir(folder,{recursive:true});
const browser=await launch(), results=[];
const gif=path.join(projectRoot,'.local/baseline-web/src/assets/img/background.gif');
const frame=await sharp(gif,{page:0,pages:1}).png().toBuffer();
try{
for(const route of ['home','data','about','login','nav-page1','nav-page2','nav-page3']){
 const shots=[],styles=[];
 for(const variant of ['baseline','optimized']){
  const page=await browser.newPage({viewport:{width:1920,height:1080}});
  await page.addInitScript(()=>{const Original=Date;window.Date=class extends Original{constructor(...args){super(...(args.length?args:[1791302400000]));}static now(){return 1791302400000;}};});
  await page.route(/background-[^.]+\.(gif|webp)$/,r=>r.fulfill({status:200,contentType:'image/png',body:frame}));
  const base='http://127.0.0.1:'+(variant==='baseline'?4174:4173);
  await login(page,base);
  if(route==='data')await dataPage(page,base);else await page.goto(base+'/#/home'+(route==='home'?'':'/'+route),{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.addStyleTag({content:'*{animation:none!important;transition:none!important;caret-color:transparent!important}.show_two_three{visibility:hidden!important}'});
  await page.waitForTimeout(800);
  styles.push(await page.evaluate(()=>Object.fromEntries(['.header','.condition_box','.result_box','.mapInfo','.chart_box','.login','.page1 h1'].map(selector=>{const el=document.querySelector(selector);if(!el)return[selector,null];const c=getComputedStyle(el),b=el.getBoundingClientRect();return[selector,{box:[b.x,b.y,b.width,b.height].map(v=>Math.round(v*100)/100),font:c.font,color:c.color,background:c.backgroundColor,border:c.border}];}))));
  const file=path.join(folder,route+'-'+variant+'.png');await page.screenshot({path:file,animations:'disabled'});shots.push(file);await page.close();
 }
 const a=await sharp(shots[0]).ensureAlpha().raw().toBuffer({resolveWithObject:true}), b=await sharp(shots[1]).ensureAlpha().raw().toBuffer();
 const diff=Buffer.alloc(a.data.length);const mismatched=pixelmatch(a.data,b,diff,a.info.width,a.info.height,{threshold:0.1,includeAA:false});
 await sharp(diff,{raw:{width:a.info.width,height:a.info.height,channels:4}}).png().toFile(path.join(folder,route+'-diff.png'));
 const row={route,mismatchedPixels:mismatched,totalPixels:a.info.width*a.info.height,percent:mismatched/(a.info.width*a.info.height)*100,computedStylesEqual:JSON.stringify(styles[0])===JSON.stringify(styles[1]),styles};results.push(row);console.log(JSON.stringify({...row,styles:undefined}));
}
await writeFile(path.join(projectRoot,'docs/validation/visual-parity.json'),JSON.stringify({scope:'isolated fixture, 1920x1080; fixed Date and first original animation frame for screenshot only; CSS animations/transition paused; newly connected 3D button masked equally. Does not validate real GIS imagery or dynamic animation, which has separate full-frame proof.',results},null,2));
await logStep('视觉对照执行',JSON.stringify(results.map(({styles,...r})=>r)));
}finally{await browser.close();}

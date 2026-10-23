import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {pathToFileURL,fileURLToPath} from 'node:url';
import {ChromeVisualBrowser,findChrome} from './dev/archify/bin/visual-check.mjs';
const root=path.dirname(fileURLToPath(import.meta.url)),out=path.join(root,'evidence');
fs.mkdirSync(path.join(out,'screenshots'),{recursive:true});
const sha=x=>createHash('sha256').update(x).digest('hex');
const manifest={schemaVersion:1,skillId:'archify',channel:'stable',version:'3.2.2',publishedAt:'2026-10-23T00:00:00Z',source:{repository:'https://github.com/tt-a1i/archify',ref:'v3.2.2',treeSha:'a'.repeat(40)},artifact:{sha256:'b'.repeat(64)},summary:'Controlled UI-state fixture, not a published release.',releaseNotes:'https://github.com/tt-a1i/archify/releases/tag/v3.2.2',severity:'normal'};
const disclosurePattern=/(<script type="application\/json" id="archify-reader-update-data">)(.*?)(<\/script>)/s;
const fixtures=[];
for(const locale of ['en','zh-CN'])for(const style of ['clean','editorial','product','swiss']){
 const original=path.join(out,'artifacts',`pr1066-${locale}-${style}.html`),text=fs.readFileSync(original,'utf8'),match=text.match(disclosurePattern),payload=JSON.parse(match[2]);
 if(payload.artifact.generatorVersion!=='3.2.1-dev.1')throw Error('Unexpected generated development identity');
 payload.artifact.generatorVersion='3.2.1';
 const modified=text.replace(disclosurePattern,(_,a,b,c)=>a+JSON.stringify(payload)+c);
 const restored=modified.replace(disclosurePattern,(_,a,b,c)=>{const v=JSON.parse(b);v.artifact.generatorVersion='3.2.1-dev.1';return a+JSON.stringify(v)+c;});
 if(restored!==text)throw Error('Fixture changes more than generatorVersion');
 const file=path.join(out,'artifacts',`pr1066-fixture-${locale}-${style}.html`);fs.writeFileSync(file,modified);
 fixtures.push({locale,style,original:path.relative(out,original),fixture:path.relative(out,file),original_sha256:sha(text),fixture_sha256:sha(modified),only_change:{generatorVersion:{from:'3.2.1-dev.1',to:'3.2.1'}}});
}
fs.writeFileSync(path.join(out,'fixture-disclosure.json'),JSON.stringify({manifest,fixtures},null,2));
let browser;const records=[],cases=[],failures=[];
async function send(method,params={}){return browser.cdp.send(method,params,await browser.sessionPromise);}
async function value(expression){const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;}
async function settle(){await value('document.fonts.ready.then(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))))');}
async function key(key){const code={Enter:13,Escape:27,Tab:9,ArrowDown:40,ArrowUp:38}[key];for(const type of ['keyDown','keyUp'])await send('Input.dispatchKeyEvent',{type,key,code:key,windowsVirtualKeyCode:code,...(key==='Enter'&&type==='keyDown'?{text:'\r',unmodifiedText:'\r'}:{})});await settle();}
async function reach(selector){for(let n=0;n<25;n++){if(await value(`Boolean(document.activeElement?.matches(${JSON.stringify(selector)}))`))return n;await key('Tab');}throw Error('Tab cannot reach '+selector);}
async function activate(selector){await reach(selector);await key('Enter');}
const measurement=`(()=>{
 const rect=e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}};
 const visible=e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return !e.hidden&&s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0};
 const inside=r=>r.left>=-.5&&r.right<=innerWidth+.5&&r.top>=-.5&&r.bottom<=innerHeight+.5;
 const describe=e=>({text:e.textContent.trim().replace(/\\s+/g,' '),rect:rect(e),inside:inside(rect(e)),focused:document.activeElement===e});
 const controls=[...document.querySelectorAll('.tools>button,.theme-controls>button,.tool-menu>[aria-haspopup]')].filter(visible).map(describe);
 const menus=[...document.querySelectorAll('.tools [role=menu]')].filter(visible).map(e=>({...describe(e),items:[...e.querySelectorAll('[role^=menuitem]')].filter(visible).map(describe)}));
 const dialog=document.querySelector('#reader-update');
 return {innerWidth,innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollX,scrollY,locale:document.documentElement.lang,style:document.documentElement.dataset.style,controls,menus,dialog:dialog?{open:dialog.open,visible:visible(dialog),rect:rect(dialog),status:dialog.querySelector('[data-reader-update-status]')?.textContent.trim()}:null,toolsDisplay:getComputedStyle(document.querySelector('.tools')).display,panels:document.querySelectorAll('main .panel').length,bodyText:[...document.querySelectorAll('main .panel')].map(e=>e.textContent).join(''),apiCalls:window.__auditCalls,focus:document.activeElement?.outerHTML.slice(0,300)};
})()`;
async function capture(c,state){const m=await value(measurement),name=`${c.revision}-${c.mode}-${c.locale}-${c.style}-${c.width}-${state}.png`;const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false,fromSurface:true});const p=path.join(out,'screenshots',name);fs.writeFileSync(p,Buffer.from(shot.data,'base64'));m.panel_text_sha256=sha(m.bodyText);delete m.bodyText;const record={...c,state,screenshot:'screenshots/'+name,screenshot_sha256:sha(fs.readFileSync(p)),measurement:m};records.push(record);return m;}
async function menus(c,prefix=''){
 await activate('[data-style-toggle]');const opened=await capture(c,prefix+'style-open');
 const styleBefore=await value('document.documentElement.dataset.style');await key('ArrowDown');await key('Enter');const changed=await value('document.documentElement.dataset.style');
 await activate('[data-style-toggle]');for(let i=0;i<4;i++){if(await value(`document.activeElement?.dataset.styleChoice===${JSON.stringify(styleBefore)}`))break;await key('ArrowDown');}await key('Enter');
 await activate('[data-style-toggle]');await key('Escape');const styleEscape=await value('document.querySelector(".style-options").hidden&&document.activeElement.matches("[data-style-toggle]")');
 await activate('[data-export-toggle]');await key('ArrowDown');const exported=await capture(c,prefix+'export-open');await key('Escape');const exportEscape=await value('document.querySelector(".export-menu [role=menu]").hidden&&document.activeElement.matches("[data-export-toggle]")');
 await activate('[data-export-toggle]');await key('Tab');const exportTab=await value('document.querySelector(".export-menu [role=menu]").hidden');
 return {styleUse:changed!==styleBefore,styleRestored:await value(`document.documentElement.dataset.style===${JSON.stringify(styleBefore)}`),styleEscape,exportEscape,exportTab,styleInside:opened.menus.every(x=>x.inside),exportInside:exported.menus.every(x=>x.inside)};
}
const instrument=`(()=>{window.__auditCalls=[];const note=(api,url,options)=>window.__auditCalls.push({api,url:String(url||''),options:options?{method:options.method,credentials:options.credentials,cache:options.cache,redirect:options.redirect}:null});window.fetch=(url,options)=>{note('fetch',url,options);return Promise.resolve(new Response(JSON.stringify(${JSON.stringify(manifest)}),{status:200,headers:{'content-type':'application/json'}}));};const xhrSend=XMLHttpRequest.prototype.send;XMLHttpRequest.prototype.send=function(...args){note('xhr');return Reflect.apply(xhrSend,this,args)};for(const name of ['WebSocket','EventSource']){const Original=window[name];window[name]=new Proxy(Original,{construct(target,args){note(name,args[0]);return Reflect.construct(target,args)}})}})();`;
try{
 const chrome=findChrome();if(!chrome)throw Error('Chrome unavailable');browser=new ChromeVisualBrowser(chrome,{shutdownTimeoutMs:8000});const browserVersion=await browser.cdp.send('Browser.getVersion');
 for(const revision of ['dev','pr1066'])for(const mode of revision==='dev'?['untouched']:['untouched','stable-fixture'])for(const locale of ['en','zh-CN'])for(const style of ['clean','editorial','product','swiss'])for(const width of [320,390,1440]){
  const c={revision,mode,locale,style,width,height:width===1440?900:844},item={...c};
  try{
   await browser.resetPage();await send('Emulation.setDeviceMetricsOverride',{width,height:c.height,deviceScaleFactor:1,mobile:false});await send('Emulation.setEmulatedMedia',{media:'screen',features:[{name:'prefers-color-scheme',value:'light'}]});await send('Page.addScriptToEvaluateOnNewDocument',{source:'try{localStorage.clear();sessionStorage.clear()}catch{};'+instrument});
   const filename=`${revision}${mode==='stable-fixture'?'-fixture':''}-${locale}-${style}.html`,file=path.join(out,'artifacts',filename);item.artifact='artifacts/'+filename;
   const loaded=browser.cdp.waitFor('Page.loadEventFired',await browser.sessionPromise);loaded.catch(()=>{});await send('Page.navigate',{url:pathToFileURL(file).href});await loaded;await settle();await value('window.scrollTo(0,0)');
   const initial=await capture(c,'initial');if(initial.style!==style||initial.locale!==locale)throw Error('Input locale/style precondition does not match rendered DOM');item.initialNoInstrumentedCalls=initial.apiCalls.length===0;item.initialContained=initial.scrollWidth===width&&initial.controls.every(x=>x.inside);item.keyboard=await menus(c);
   if(revision==='pr1066'){
    await activate('[data-reader-update]');await activate('[data-reader-update-check]');await settle();
    if(mode==='stable-fixture')await value('new Promise((resolve,reject)=>{const stop=Date.now()+3000;const check=()=>{if(document.querySelector("[data-reader-update]").textContent.includes("3.2.2"))return resolve();if(Date.now()>stop)return reject(new Error("Controlled update did not complete"));setTimeout(check,10)};check()})');
    const checked=await capture(c,'explicit-check');item.afterCheckCalls=checked.apiCalls;item.checkStatus=checked.dialog.status;item.checkExpected=mode==='stable-fixture'?checked.apiCalls.length===1:checked.apiCalls.length===0;
    await key('Escape');await settle();item.versionFocusRestored=await value('document.activeElement.matches("[data-reader-update]")');
    const after=await capture(c,mode==='stable-fixture'?'update-available':'development-check-dismissed');item.afterCheckContained=after.scrollWidth===width&&after.controls.every(x=>x.inside);
    if(mode==='stable-fixture')item.afterUpdateKeyboard=await menus(c,'updated-');
   }
   await send('Emulation.setEmulatedMedia',{media:'print'});const printed=await capture(c,'print');item.printHidden=printed.toolsDisplay==='none'&&(!printed.dialog||!printed.dialog.visible);item.printContentRetained=printed.panel_text_sha256===initial.panel_text_sha256&&printed.panels===initial.panels;
  }catch(error){item.infrastructureError=error.stack;failures.push(item);}
  cases.push(item);fs.writeFileSync(path.join(out,'observations.json'),JSON.stringify({sourceRevisions:JSON.parse(fs.readFileSync(path.join(root,'incoming.json'),'utf8')),node:process.version,browser:browserVersion,scope:'Real Chromium, light theme, CSS viewport at deviceScaleFactor=1; four JS API probes only; no live update or physical printing claim.',cases,records,failures},null,2));
  console.log(JSON.stringify({case:cases.length,...c,initialContained:item.initialContained,keyboard:item.keyboard,afterCheckContained:item.afterCheckContained,error:item.infrastructureError?.split('\n')[0]}));
 }
}finally{if(browser)await browser.close();}
if(failures.length)process.exitCode=1;

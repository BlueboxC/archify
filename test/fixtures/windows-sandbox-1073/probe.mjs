import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
const ancestors=[];
for(let p=process.cwd();;p=path.dirname(p)){
 const item={path:p};
 for(const [name,fn] of [['lstat',()=>fs.lstatSync(p,{bigint:true})],['stat',()=>fs.statSync(p,{bigint:true})],['native',()=>fs.realpathSync.native(p)],['js',()=>fs.realpathSync(p)]]){
  try{const v=fn();item[name]=typeof v==='string'?v:{directory:v.isDirectory(),dev:String(v.dev),ino:String(v.ino)};}catch(e){item[name]={code:e.code,syscall:e.syscall};}
 }
 ancestors.push(item);if(path.dirname(p)===p)break;
}
const output={node:process.version,platform:process.platform,release:os.release(),arch:process.arch,cwd:process.cwd(),ancestors};
console.log(JSON.stringify(output,null,2));

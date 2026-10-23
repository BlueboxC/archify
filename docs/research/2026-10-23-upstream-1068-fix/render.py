import hashlib,json,pathlib,subprocess
r=pathlib.Path(__file__).parent
(r/'evidence/inputs').mkdir(parents=True,exist_ok=True)
(r/'evidence/artifacts').mkdir(exist_ok=True)
source=r/'dev/archify/examples/delivery.explainer.json'
assert source.read_bytes()==(r/'pr1066/archify/examples/delivery.explainer.json').read_bytes()
original=json.loads(source.read_text());records=[]
for locale in ['en','zh-CN']:
 for style in ['clean','editorial','product','swiss']:
  document=json.loads(json.dumps(original));document['meta']['locale']=locale;document['meta']['style']=style
  input=r/'evidence/inputs'/f'delivery-{locale}-{style}.json'
  input.write_text(json.dumps(document,ensure_ascii=False,indent=2)+'\n')
  for revision in ['dev','dev-patched','pr1066','pr1066-patched']:
   out=r/'evidence/artifacts'/f'{revision}-{locale}-{style}.html'
   command=['node',str(r/revision/'archify/bin/archify.mjs'),'render','explainer',str(input),str(out)]
   p=subprocess.run(command,cwd=r/revision,capture_output=True,text=True,timeout=45)
   if p.returncode:raise RuntimeError(p.stdout[-1000:]+'\n'+p.stderr[-2500:])
   records.append({'revision':revision,'locale':locale,'style':style,'input':str(input.relative_to(r/'evidence')),'artifact':str(out.relative_to(r/'evidence')),'input_sha256':hashlib.sha256(input.read_bytes()).hexdigest(),'artifact_sha256':hashlib.sha256(out.read_bytes()).hexdigest(),'exit':p.returncode})
   print(json.dumps({'rendered':out.name,'bytes':out.stat().st_size}),flush=True)
(r/'evidence/render-receipts.json').write_text(json.dumps({'original_input_sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'node_version':subprocess.check_output(['node','--version'],text=True).strip(),'records':records},indent=2))

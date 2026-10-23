import pathlib,shutil,subprocess,hashlib,json
r=pathlib.Path(__file__).parent
receipts=[]
for label in ['dev','pr1066']:
 dst=r/(label+'-patched');shutil.copytree(r/label,dst)
 old=(dst/'archify/explainer/reader.css').read_bytes()
 p=subprocess.run(['git','apply','--check',str(r/'containment.patch')],cwd=dst,capture_output=True,text=True);assert p.returncode==0,p.stderr
 subprocess.run(['git','apply',str(r/'containment.patch')],cwd=dst,check=True)
 changed=[]
 for source in (r/label).rglob('*'):
  if source.is_file():
   rel=source.relative_to(r/label)
   if source.read_bytes()!=(dst/rel).read_bytes():changed.append(str(rel))
 assert changed==['archify/explainer/reader.css'],changed
 receipts.append({'revision':label,'changed_files':changed,'before_css_sha256':hashlib.sha256(old).hexdigest(),'after_css_sha256':hashlib.sha256((dst/changed[0]).read_bytes()).hexdigest()})
(r/'evidence').mkdir(exist_ok=True)
(r/'evidence/patch-application.json').write_text(json.dumps({'patch_sha256':hashlib.sha256((r/'containment.patch').read_bytes()).hexdigest(),'variants':receipts},indent=2))
print(json.dumps(receipts))

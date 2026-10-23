import json,pathlib,hashlib,stat,datetime
r=pathlib.Path(__file__).parent;e=r/'evidence'
x=json.loads((e/'observations.json').read_text());assert not x['failures'];assert len(x['cases'])==144
keys=lambda c:tuple(c[k] for k in ['revision','mode','locale','style','width'])
expected={(v,m,l,s,w) for v in ['dev','dev-patched','pr1066','pr1066-patched'] for m in (['untouched'] if v.startswith('dev') else ['untouched','stable-fixture']) for l in ['en','zh-CN'] for s in ['clean','editorial','product','swiss'] for w in [320,390,1440]}
assert {keys(c) for c in x['cases']}==expected
assert all(c['initialNoInstrumentedCalls'] for c in x['cases'])
patched=[c for c in x['cases'] if c['revision'].endswith('-patched')];original=[c for c in x['cases'] if not c['revision'].endswith('-patched')]
errors=[]
def require(ok,label):
 if not ok:errors.append(label)
for c in patched:
 key=':'.join(str(c[k]) for k in ['revision','mode','locale','style','width'])
 for field in ['initialNoInstrumentedCalls','initialContained','controlsClickable','printHidden','printContentRetained']:
  require(c.get(field) is True,key+':'+field)
 for field,value in c['keyboard'].items():require(value is True,key+':keyboard:'+field)
 if c['revision'].startswith('pr1066'):
  for field in ['checkExpected','dialogContained','openDialogPrintHidden','openDialogPrintContentRetained','versionFocusRestored','afterCheckContained','afterControlsClickable']:
   require(c.get(field) is True,key+':'+field)
  for field,value in c.get('afterUpdateKeyboard',{}).items():require(value is True,key+':updated:'+field)
records={(c['revision'],c['mode'],c['locale'],c['style'],c['width'],c['state']):c for c in x['records']};desktop=0
for key,rec in records.items():
 if rec['width']!=1440 or rec['revision'].endswith('-patched'):continue
 other=records.get((rec['revision']+'-patched',*key[1:]));require(bool(other),str(key)+':paired')
 if other:
  def geometry(m):return {k:m[k] for k in ['scrollWidth','controls','menus','dialog','toolsDisplay','panels','panel_text_sha256']}
  require(geometry(rec['measurement'])==geometry(other['measurement']),str(key)+':desktop-identical');desktop+=1
source_checks={}
for label in ['dev','pr1066']:
 manifest=json.loads((r/(label+'-source-manifest.json')).read_text())
 source_checks[label]=True
 # Every source byte must still match acquisition; compare entire file set.
 paths={str(p.relative_to(r/label)) : hashlib.sha256(p.read_bytes()).hexdigest() for p in (r/label).rglob('*') if p.is_file()}
 expected=manifest.get('files',manifest)
 if isinstance(expected,dict):source_checks[label]=paths=={k:(v['sha256'] if isinstance(v,dict) else v) for k,v in expected.items()}
 else:raise ValueError('unexpected manifest')
 require(source_checks[label],label+':source-unchanged')
summary={'passed':not errors,'completed_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'revisions':x['sourceRevisions'],'cases':len(x['cases']),'original_cases':len(original),'patched_cases':len(patched),'patched_original_version_cases':sum(c['mode']=='untouched' for c in patched),'patched_stable_fixture_cases':sum(c['mode']=='stable-fixture' for c in patched),'captures':len(x['records']),'original_initial_overflow_cases':sum(not c['initialContained'] for c in original),'patched_initial_contained':sum(c['initialContained'] for c in patched),'patched_keyboard_menu_passes':sum(all(c['keyboard'].values()) for c in patched),'patched_version_dialog_passes':sum(c.get('dialogContained',False) for c in patched),'patched_print_passes':sum(c['printHidden'] and c['printContentRetained'] for c in patched),'desktop_identical_state_pairs':desktop,'source_hashes_unchanged':source_checks,'installation_changed':False,'main_changed':False,'css_adaptation_needed':False,'browser':x['browser'],'node':x['node'],'scope':x['scope'],'errors':errors}
(e/'qualification.json').write_text(json.dumps(summary,indent=2)+'\n');print(json.dumps(summary,indent=2));assert not errors,errors

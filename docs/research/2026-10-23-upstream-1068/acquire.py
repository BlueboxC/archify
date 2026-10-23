import hashlib,json,pathlib,subprocess
root=pathlib.Path(__file__).parent
repo=root/'sources.git'
def run(args,**kwargs):
    return subprocess.run(args,check=True,capture_output=True,**kwargs)
if repo.exists():raise SystemExit('Owned source destination already exists; inspect before reuse')
run(['git','init','--bare',str(repo)])
url='https://github.com/tt-a1i/archify.git'
revisions={'dev':'b71d1b3e38f71d0f7fe91207b750cc307357c91a','pr1066':'01d90b5d66c7bf4cfb58f9d1973bfe46dffae533'}
for label,sha in revisions.items():
    run(['git','-C',str(repo),'-c','remote.source.promisor=true','-c','remote.source.url='+url,'fetch','--depth=1','--filter=blob:none','--no-tags',url,sha])
    dest=root/label;dest.mkdir()
    # Extract only the exact runtime subtree, excluding unrelated galleries, ZIPs and history.
    archive=run(['git','-C',str(repo),'archive',sha,'archify'])
    run(['tar','-xf','-','-C',str(dest)],input=archive.stdout)
    files=[p for p in dest.rglob('*') if p.is_file()]
    receipt={'revision':sha,'repository':url,'files':{str(p.relative_to(dest)):hashlib.sha256(p.read_bytes()).hexdigest() for p in files},'bytes':sum(p.stat().st_size for p in files)}
    (root/(label+'-source-manifest.json')).write_text(json.dumps(receipt,sort_keys=True))
    print(json.dumps({'label':label,'revision':sha,'files':len(files),'bytes':receipt['bytes']}),flush=True)

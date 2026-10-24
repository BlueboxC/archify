$ErrorActionPreference = 'Stop'
$repo = (Get-Location).Path
$proof = Join-Path $env:USERPROFILE 'archify-1073-isolated'
$results = Join-Path $env:RUNNER_TEMP 'archify-1073-results'
$bin = Join-Path $env:RUNNER_TEMP 'codex-0164'
New-Item -ItemType Directory -Force $proof,$results,$bin | Out-Null
$assets = @(
 @('codex.exe.tar.gz','codex-x86_64-pc-windows-msvc.exe.tar.gz','90cf31818ddd8b29f956ad1df5f99af86c19296186be9a117d07b02b2c9bf0e8'),
 @('codex-command-runner.exe','codex-command-runner-x86_64-pc-windows-msvc.exe','30b0ba5d42d3a95c839731fbf9939d728a70fcd9e433245a7cb15bc79418a4db'),
 @('codex-windows-sandbox-setup.exe','codex-windows-sandbox-setup-x86_64-pc-windows-msvc.exe','2cac62ff24aca3aef7768ab5b96d4102e8434eb0cf8ddbc6171b85a8fb3bb4ef')
)
foreach($a in $assets){
 $out=Join-Path $bin $a[0]
 Invoke-WebRequest -Uri ('https://github.com/openai/codex/releases/download/rust-v0.164.0/'+$a[1]) -OutFile $out
 if((Get-FileHash -Algorithm SHA256 $out).Hash.ToLowerInvariant() -ne $a[2]){throw 'Official asset digest mismatch'}
}
tar -xzf (Join-Path $bin 'codex.exe.tar.gz') -C $bin
if($LASTEXITCODE -ne 0){throw 'Codex extraction failed'}
$exe=Get-ChildItem $bin -Recurse -Filter 'codex-x86_64-pc-windows-msvc.exe' | Select-Object -First 1
if(!$exe){throw 'Codex executable missing'}
Copy-Item $exe.FullName (Join-Path $bin 'codex.exe')
$codex=Join-Path $bin 'codex.exe'
$env:CODEX_HOME=Join-Path $env:RUNNER_TEMP 'codex-1073-home'
New-Item -ItemType Directory $env:CODEX_HOME | Out-Null
& $codex --version | Tee-Object (Join-Path $results 'codex-version.txt')
& $codex sandbox setup --elevated --user (whoami) --codex-home $env:CODEX_HOME 2>&1 | Tee-Object (Join-Path $results 'setup.log')
if($LASTEXITCODE -ne 0){throw 'Native elevated sandbox setup failed; no weaker fallback is permitted'}
$node=(Get-Command node.exe).Source
$summary=@()
foreach($kind in @('before','candidate')){
 $case=Join-Path $proof $kind
 git clone --local --no-hardlinks $repo $case
 if($LASTEXITCODE -ne 0){throw 'Isolated source clone failed'}
 if($kind -eq 'before'){
  Push-Location $case
  git apply --reverse 'test/fixtures/windows-sandbox-1073/candidate.patch'
  if($LASTEXITCODE -ne 0){throw 'Exact fallback-only reverse patch failed'}
  Pop-Location
 }
 $caseTemp=Join-Path $case '.test-tmp'
 New-Item -ItemType Directory $caseTemp | Out-Null
 $env:TEMP=$caseTemp;$env:TMP=$caseTemp
 & $codex sandbox -c windows.sandbox=elevated --permission-profile ':workspace' -C $case -- $node test/fixtures/windows-sandbox-1073/probe.mjs 2>&1 | Tee-Object (Join-Path $results ($kind+'-probe.log'))
 $probeExit=$LASTEXITCODE
 & $codex sandbox -c windows.sandbox=elevated --permission-profile ':workspace' -C $case -- $node --test test/timeline-dst-ticks.test.mjs test/workflow-migration-semantics.test.mjs test/explainer-charts.test.mjs 2>&1 | Tee-Object (Join-Path $results ($kind+'-suite.log'))
 $suiteExit=$LASTEXITCODE
 if($kind -eq 'candidate'){
  & $codex sandbox -c windows.sandbox=elevated --permission-profile ':workspace' -C $case -- $node --test test/path-semantics.test.mjs 2>&1 | Tee-Object (Join-Path $results 'candidate-refusal-controls.log')
  $controlsExit=$LASTEXITCODE
 }else{$controlsExit=$null}
 $summary+=@{kind=$kind;probe_exit=$probeExit;suite_exit=$suiteExit;controls_exit=$controlsExit}
}
$summary | ConvertTo-Json -Depth 6 | Set-Content (Join-Path $results 'summary.json')
$candidate=$summary | Where-Object kind -eq 'candidate'
if($candidate.probe_exit -ne 0 -or $candidate.suite_exit -ne 0 -or $candidate.controls_exit -ne 0){throw 'Candidate native sandbox qualification failed'}

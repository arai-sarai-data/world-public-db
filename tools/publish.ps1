# Publish this folder as github.com/arai-sarai-data/world-public-db (GitHub Pages).
# Run from inside the extracted folder:  powershell -ExecutionPolicy Bypass -File tools\publish.ps1
$ErrorActionPreference = 'Stop'
$name  = 'world-public-db'
$owner = 'arai-sarai-data'
$repo  = Split-Path -Parent $PSScriptRoot
Set-Location $repo
$parent = Split-Path -Parent $repo

# Reuse the remote style and identity of an existing arai-sarai-data repo next to this one (per-account SSH setup).
$sample = Get-ChildItem $parent -Directory | Where-Object { $_.FullName -ne $repo -and (Test-Path (Join-Path $_.FullName '.git')) } | Select-Object -First 1
$url = "git@github.com:$owner/$name.git"
if ($sample) {
  $u = git -C $sample.FullName remote get-url origin 2>$null
  if ($u) { $url = $u -replace '[^/:]+?(\.git)?$', "$name.git" }
}
Write-Host "Remote: $url"

if (-not (Test-Path .git)) { git init -b main | Out-Null }
if ($sample) {
  foreach ($k in 'user.name', 'user.email', 'core.sshCommand') {
    $v = git -C $sample.FullName config --local $k 2>$null
    if ($v) { git config --local $k "$v" }
  }
}
git add -A
git diff --cached --quiet; if ($LASTEXITCODE -ne 0) { git commit -m "World Public Databases: 8 multilingual sites" | Out-Null }

$ghUser = $null
if (Get-Command gh -ErrorAction SilentlyContinue) { $ghUser = gh api user --jq .login 2>$null }
if ($ghUser -eq $owner) {
  gh repo view "$owner/$name" 2>$null | Out-Null
  if ($LASTEXITCODE -ne 0) { gh repo create "$owner/$name" --public --description "Eight multilingual public-interest databases" | Out-Null }
} else {
  Write-Host "Create an empty PUBLIC repository named '$name' at https://github.com/new while signed in as $owner, then press Enter."
  Read-Host | Out-Null
}
git remote remove origin 2>$null
git remote add origin $url
git push -u origin main

if ($ghUser -eq $owner) {
  gh api -X POST "repos/$owner/$name/pages" -f build_type=workflow 2>$null | Out-Null
  Write-Host "GitHub Pages enabled (source: GitHub Actions)."
  gh workflow run update.yml 2>$null | Out-Null
} else {
  Write-Host "Last step: open https://github.com/$owner/$name/settings/pages, set Source = GitHub Actions, then run Actions > Update data and publish > Run workflow."
}
Write-Host "Site: https://$owner.github.io/$name/"

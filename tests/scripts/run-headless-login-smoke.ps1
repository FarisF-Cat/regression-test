param(
  [string]$AvdName = "emulator-5554",
  [int]$AppiumPort = 4723,
  [string]$SpecPath = "tests\\test-login.spec.ts"
)

$ErrorActionPreference = "Stop"
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\\.." )).Path
Set-Location $repoRoot

$artifactsDir = Join-Path $repoRoot "tests\\artifacts"
New-Item -ItemType Directory -Force -Path $artifactsDir | Out-Null
$appiumLogPath = Join-Path $artifactsDir "appium-headless.log"

function Test-AppiumReady {
  param([int]$Port)

  try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:$Port/status" -UseBasicParsing -TimeoutSec 3
    return $response.StatusCode -eq 200
  }
  catch {
    return $false
  }
}

Write-Host "Step 1/3: Starting or reusing headless emulator..."
& (Join-Path $PSScriptRoot "start-headless-emulator.ps1") -AvdName $AvdName

Write-Host "Step 2/3: Starting or reusing Appium..."
if (-not (Test-AppiumReady -Port $AppiumPort)) {
  Write-Host "Appium is not running on port $AppiumPort. Starting Appium in background..."

  Start-Process -FilePath "appium" -ArgumentList @(
    "--address", "127.0.0.1",
    "--port", "$AppiumPort",
    "--base-path", "/",
    "--log-level", "info"
  ) -RedirectStandardOutput $appiumLogPath -RedirectStandardError $appiumLogPath | Out-Null

  $deadline = (Get-Date).AddSeconds(45)
  while ((Get-Date) -lt $deadline) {
    if (Test-AppiumReady -Port $AppiumPort) {
      break
    }
    Start-Sleep -Seconds 1
  }

  if (-not (Test-AppiumReady -Port $AppiumPort)) {
    throw "Appium failed to start on port $AppiumPort. Check log at $appiumLogPath"
  }
}
else {
  Write-Host "Appium is already running on port $AppiumPort."
}

Write-Host "Step 3/3: Running login test in headless mode..."
& npx mocha --require tsx $SpecPath
$exitCode = $LASTEXITCODE

if ($exitCode -ne 0) {
  throw "Headless login test failed with exit code $exitCode"
}

Write-Host "Headless login test completed successfully."

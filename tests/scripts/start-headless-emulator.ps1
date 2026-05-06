param(
  [string]$AvdName = "emulator-5554",
  [int]$BootTimeoutSeconds = 240
)

$ErrorActionPreference = "Stop"

function Test-EmulatorReady {
  $line = (adb devices | Select-String '^emulator-\d+\s+device')
  return $null -ne $line
}

if (Test-EmulatorReady) {
  Write-Host "Emulator already running and online."
  exit 0
}

Write-Host "Starting headless emulator for AVD '$AvdName'..."
Start-Process -FilePath "emulator" -ArgumentList @(
  "-avd", $AvdName,
  "-no-window",
  "-no-audio",
  "-no-boot-anim",
  "-gpu", "swiftshader_indirect"
) | Out-Null

Write-Host "Waiting for device to connect..."
adb wait-for-device | Out-Null

$deadline = (Get-Date).AddSeconds($BootTimeoutSeconds)
while ((Get-Date) -lt $deadline) {
  $boot = (adb shell getprop sys.boot_completed 2>$null).Trim()
  $anim = (adb shell getprop init.svc.bootanim 2>$null).Trim()

  if ($boot -eq "1" -and $anim -eq "stopped") {
    Write-Host "Emulator boot completed."
    adb shell input keyevent 82 | Out-Null
    exit 0
  }

  Start-Sleep -Seconds 2
}

throw "Emulator did not finish booting within $BootTimeoutSeconds seconds."

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$environmentFile = Join-Path $projectRoot ".env.development"
$apiDirectory = Join-Path $projectRoot "api"

Get-Content -LiteralPath $environmentFile | ForEach-Object {
  if ($_ -match '^([A-Za-z_][A-Za-z0-9_]*)=(.*)$') {
    [Environment]::SetEnvironmentVariable($Matches[1], $Matches[2], "Process")
  }
}

$env:DATABASE_URL = $env:DATABASE_URL.Replace("@portfolio-db:", "@localhost:")
$env:NODE_OPTIONS = "--use-system-ca"

Push-Location $apiDirectory
try {
  pnpm exec prisma migrate deploy
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

  pnpm exec prisma db seed
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

  pnpm exec prisma generate
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
} finally {
  Pop-Location
}

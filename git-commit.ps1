#!/bin/bash
# Git Auto Commit Script
# Usage: ./git-commit.ps1 "Your commit message"

param(
    [Parameter(Mandatory=$true)]
    [string]$Message
)

# Refresh PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Check if git is available
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git not found in PATH" -ForegroundColor Red
    exit 1
}

# Add all changes
Write-Host "📦 Staging all changes..." -ForegroundColor Cyan
git add .

# Show status
Write-Host "`n📊 Status:" -ForegroundColor Cyan
git status --short

# Commit
Write-Host "`n💾 Committing..." -ForegroundColor Cyan
git commit -m "$Message"

# Push
Write-Host "`n🚀 Pushing to remote..." -ForegroundColor Cyan
git push

Write-Host "`n✅ Done!" -ForegroundColor Green

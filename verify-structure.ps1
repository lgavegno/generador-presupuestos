# Verificar estructura del proyecto

Write-Host "🔍 ESTRUCTURA DEL PROYECTO GENERADOR-PRESUPUESTOS" -ForegroundColor Green
Write-Host ""

# Archivos en raíz
Write-Host "📄 ARCHIVOS EN RAÍZ:" -ForegroundColor Cyan
ls -File | Where-Object {$_.Extension -in '.html', '.md', '.gitignore', '.antigravityrules'} | ForEach-Object {
    Write-Host "  ✓ $_"
}

Write-Host ""

# Carpetas
Write-Host "📁 CARPETAS:" -ForegroundColor Cyan
ls -Directory | ForEach-Object {
    Write-Host "  ✓ $_"
    ls $_ -File | Select-Object -First 3 | ForEach-Object {
        Write-Host "    - $_"
    }
    if ((ls $_).Count -gt 3) {
        Write-Host "    ... y más"
    }
}

Write-Host ""
Write-Host "✅ Estructura completa" -ForegroundColor Green

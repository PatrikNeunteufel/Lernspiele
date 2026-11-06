@echo off
rem Lernspiele: normaler Server (nur ausliefern, ohne Zwischenspeicher) auf http://localhost:8765/
rem Oeffnet die Einstiegsseite portal/ wie online (Entscheid SV1 a); von dort Eulenpfad und Lernsteig.
rem Belegt Port 8765 - nicht gleichzeitig mit dem Entwickler-Server starten.
rem Beenden: dieses Fenster schliessen oder Strg+C.
cd /d "%~dp0"
rem Python suchen: zuerst python, sonst der Starter py
set PY=python
where python >nul 2>nul || set PY=py
where %PY% >nul 2>nul || (echo Python wurde nicht gefunden. Bitte Python installieren: https://www.python.org/ & pause & exit /b 1)
echo Lernspiele laufen auf http://localhost:8765/portal/index.html
echo Zum Beenden dieses Fenster schliessen.
start "" "http://localhost:8765/portal/index.html"
%PY% tools\server.py %*
pause

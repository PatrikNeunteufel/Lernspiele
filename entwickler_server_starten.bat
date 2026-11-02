@echo off
rem Eulenpfad: Entwickler-Server (Pruefstand und Bemerkungen schreiben, docs/eulenpfad/rahmen.md Abschnitt 11)
rem Oeffnet Eulenpfad im Browser (--oeffnen). Belegt Port 8765 exklusiv - nicht gleichzeitig mit dem normalen Server.
rem Anderer Port: entwickler_server_starten.bat 8770
rem Beenden: dieses Fenster schliessen oder Strg+C.
cd /d "%~dp0"
rem Python suchen: zuerst python, sonst der Starter py
set PY=python
where python >nul 2>nul || set PY=py
where %PY% >nul 2>nul || (echo Python wurde nicht gefunden. Bitte Python installieren: https://www.python.org/ & pause & exit /b 1)
%PY% tools\entwickler_server.py --oeffnen %*
pause

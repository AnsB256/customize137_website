@echo off
title Customize137 Systems Limited - Local Dev Server
cd /d "%~dp0"
echo Starting Customize137 local development server...
node ./node_modules/vite/bin/vite.js --configLoader native --open
pause

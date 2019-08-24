@echo off
echo 当前路径是 %cd%

cd center-web
cmd /c npm install
cmd /c npm run dllDev
npm run start
@echo off
echo 当前路径是 %cd%

cd /d currentDir
cmd /c mvn install -f ".\rpc-pom\pom.xml"
cmd /c mvn install -f ".\rpc\pom.xml"
cd center-web
cmd /c npm install
cmd /c npm run dllDev
cmd /c npm run srcDev
xcopy .\dist\*.* ..\center\src\main\resources\WEB-INF\html /e /y
cd ..
copy .\32.ico .\center\src\main\resources\WEB-INF\html\favicon.ico /y
cmd /c mvn package -f ".\center\pom.xml"
pause
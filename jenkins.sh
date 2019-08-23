JAVA_HOME=/opt/java
PATH=$JAVA_HOME/bin:$PATH
MAVEN_HOME=/opt/maven3
PATH=$MAVEN_HOME/bin:$PATH

export NODE_HOME=/opt/node
export PATH=$PATH:$NODE_HOME/bin
export NODE_PATH=$PATH:$NODE_HOME/lib/node_module
npm config set registry https://registry.npm.taobao.org --global
npm config set disturl https://npm.taobao.org/dist --global

mvn -version
java -version
node -v
npm -v

mvn install -f "rpc-pom/pom.xml"
mvn install -f "rpc/pom.xml"

current_path=$(pwd)

cd center-web
npm install
npm run dllDev
npm run srcDev

center_path=${current_path}/center/src/main/resources/WEB-INF/html
mkdir -p ${center_path} 
cp -rf dist/* ${center_path}

cd ${current_path}
cp -f 32.ico ${center_path}/favicon.ico

mvn package -f "center/pom.xml"

cd center/target
kill -9 `cat id.pid` ||true
BUILD_ID=dontKillMe nohup java -jar center.jar > logfile.txt & echo $! > id.pid



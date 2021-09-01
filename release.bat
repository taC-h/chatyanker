cmd /C "cd ./src/lib/native & cargo build --release & copy /Y /B .\target\release\native.dll .\native.node" && ^
rm -rf dist && ^
npx webpack --config ./webpack.config.production.js && ^
echo {"main": "main.js"} > dist/package.json && ^
node ./build.js

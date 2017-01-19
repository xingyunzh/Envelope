google-closure-compiler-js --warningLevel VERBOSE --createSourceMap true ./public/js/card.js > ./public/js/card.min.js
echo "File 1: 'public/js/card.min.js' Finished."
google-closure-compiler-js ./public/js/collection.js > ./public/js/collection.min.js --warningLevel VERBOSE --createSourceMap true
echo "File 2: 'public/js/collection.min.js' Finished."
google-closure-compiler-js ./public/js/common.js > ./public/js/common.min.js --warningLevel VERBOSE --createSourceMap true
echo "File 3: 'public/js/common.min.js' Finished."
google-closure-compiler-js ./public/js/httpHelper.js > ./public/js/httpHelper.min.js --warningLevel VERBOSE --createSourceMap true
echo "File 4: 'public/js/httpHelper.min.js' Finished."
google-closure-compiler-js ./public/js/myhome.js > ./public/js/myhome.min.js --warningLevel VERBOSE --createSourceMap true
echo "File 5: 'public/js/myhome.min.js' Finish"


#!/bin/bash

echo "Clean raspalarm build..."
rm -rf ./back/src/public ./front/build 1>/dev/null
rm -rf ./back/build 1>/dev/null
rm -rf ./build .env 1>/dev/null
echo "Clean done"
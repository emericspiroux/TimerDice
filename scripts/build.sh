#!/bin/bash

if ! [ "$EUID" -ne 0 ]
  then 
  echo "Can't be administrator to run build"
  exit
fi

FILE=node_modules
echo "Building nodejs modules for front and back"
mkdir ./back/src/public

set -e
cd ./front
echo "Installing front modules..."
if test -d "$FILE"; then
    echo "$FILE already exist on front"
else
    npm install
    echo "$FILE installed on back"
fi

echo "Building front app..."
if test -d "./build"; then
  echo "Front already built"
else
  npm run build 1>/dev/null
  echo "Front app is build"
fi

cd ../

cd back
echo "Installing back modules..."
if test -d "$FILE"; then
    echo "$FILE already exist on back"
else
    npm install
    echo "$FILE installed on back"
fi


echo "Building back app..."
if test -d "./build"; then
  echo "Back already built"
else
  echo "Building Back-end app..."
  npm run make
  echo "Back app is build"
fi

#!/bin/bash

set -e

if [ ! -f packages/backend/dist/app.js ]
then
  echo "Missing backend build"
  exit 1
fi

if [ ! -f packages/frontend/build/index.html ]
then
  echo "Missing frontend build"
  exit 1
fi


echo "Creating distribution folder if not exist"
mkdir -p /etc/gitlab/public
echo "Moving backend distribution to distribution folder"
mv packages/backend/dist/* /etc/gitlab
mv packages/backend/node_modules /etc/gitlab/
echo "Moving frontend distribution into distribution folder"
mv packages/frontend/build/* /etc/gitlab/public
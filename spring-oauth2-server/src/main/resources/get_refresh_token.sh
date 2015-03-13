#!/bin/sh
REFRESH_TOKEN=`curl -s "http://test@localhost:8080/oauth-server/oauth/token?grant_type=password&username=user&password=password" -X POST | sed -e 's/^.*"refresh_token":"\([^"]*\)".*$/\1/'`
sleep 3
RESPONSE=`curl -s "http://test@localhost:8080/oauth-server/oauth/token?grant_type=refresh_token&refresh_token=$REFRESH_TOKEN" -X POST`
echo $RESPONSE



#!/bin/sh

TOKEN=`curl -s "http://test@localhost:8080/oauth-server/oauth/token?grant_type=password&username=user&password=password" -X POST | sed -e 's/^.*"access_token":"\([^"]*\)".*$/\1/'`
sleep 4
RESPONSE=`curl -s -H "Authorization: Bearer $TOKEN" http://localhost:8081/resource-server/hello`
echo $RESPONSE



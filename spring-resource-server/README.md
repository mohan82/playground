Spring MVC Based OAuth2 Separate Resource Server Example
===========================================================

Build
-----
<pre>
<code>
mvn clean install
</code>
</pre>
Run WebApp
----------
<pre>
<code>
mvn jetty:run
</code>
</pre>


OAuth2 Authorization Server Token
----------------------------------

Start authorization server following auth server instructions and
get the bearer the token ,
<pre>
<code>
curl -u test:secret "http://localhost:8080/oauth-server/oauth/token?grant_type=password&username=user&password=password" -X POST
</code>
</pre>
Response
--------
<pre>
<code>
{
  "access_token": "9a71eb75-a3df-4ab4-ad1b-94d7af3cb8a9",
  "token_type": "bearer",
  "expires_in": 43188,
  "scope": "read write"
}

</code>
</pre>

Retrieve Resource
-----------------
Append the Bearer Token header in the curl and retrieve the resource,
for example if your Token is  "9a71eb75-a3df-4ab4-ad1b-94d7af3cb8a9",
<pre>
<code>
 curl -H "Authorization: Bearer 9a71eb75-a3df-4ab4-ad1b-94d7af3cb8a9" http://localhost:8081/resource-server/hello
 </code>
 </pre>
 Should return
 <pre>
 <code>
 {
   "text": "Text World",
   "code": "hw"
 }
 </code>
 </pre>
 

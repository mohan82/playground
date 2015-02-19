Spring MVC Based OAuth2 Authorization Server Example
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

OAuth2 Token Test
-----------------
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
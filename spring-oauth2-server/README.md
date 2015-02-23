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
curl "http://test@localhost:8080/oauth-server/oauth/token?grant_type=password&username=user&password=password" -X POST
</code>
</pre>
Response
--------
<pre>
<code>
{
  "access_token": "ebf80390-3ef3-46c4-a43c-a41f650bce87",
  "token_type": "bearer",
  "refresh_token": "59ba69a0-675b-48f8-86e4-bddb8363928d",
  "expires_in": 29,
  "scope": "read write"
}
</code>
</pre>
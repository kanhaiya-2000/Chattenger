# Introducing Offline features

The main aim of this extension is to add features of offline file sharing over wifi hotspot.
All we need internet is for loading the page in our browser for the first time(will cost around 1-2MB).
After successful loading,internet is no longer needed.
If your protocol is https,you can even establish offline video or voice chats.
All you need is your devices to be connected through a hotspot connection(nomatter whether the connection has active or inactive internet).

# Get started

> Copy the entire offline folder into your local disc

 Alternatively <a href="https://downgit.github.io/#/home?url=https://github.com/kanhaiya-2000/Chattenger/tree/master/offline" download>Click</a> here to download and then extract the zip file.

> navigate to offline repo and to install all necessary modules run 
    
    npm install
    
    npm install os
    
> Generate self signed certificate(to encrypt the data that will be shared over network)

     openssl req -x509 -newkey rsa:2048 -keyout keytmp.pem -out cert.pem -days 365
    
     openssl rsa -in keytmp.pem -out key.pem
     
> Run the server 
      
      npm start
      
 This will start your server on port 3000.
 
 # What next?
   
   When server will be started ,a url will be shown in console where app will be served.
   Your server will also respond at localhost:3000,but for this purpose we have to work over the ipv4 address of our wifi hotspot(eg 10.61.67.70)
  ### This wifi should be home wifi connection(that is it may be hotspot connection from your mobile
   and not the public wifi ,for ex: the wifi offered by your institute is not allowed 
   because in the latter case,different devices will have different ipv4 addresses)
   You can find your ipv4 address for a wifi connection under the setting of that wifi connection.
   Different wifi connection offers different ipv4 address.
   
 ## Open the url https://{your_ipv4_address}:3000 in your browser 
 Ex: if your ipv4 address is 10.61.67.70,then open https://10.61.67.70:3000 in your browser.
 Your browser will show you warning that it doesn't trust the certificate (since it is self signed),give your consent and continue.
 Open the same url in your other devices and start sharing documents,photos,videos and messages
 If you want to use authorised certificate,you can try their certificate too(ex. Let's encrypt).
 you can also work without https but then connection will not be encrypted and you will not be able to make offline video or voice chats.
 
## for http version
 If you don't want to use https,you must modify <a href="app.js">app.js</a> file.You should replace https module with http and httpsoptions object should be ommitted.Also since max age of cache is set to 300 days,your modified files(static files) will not be noticed by the browser unless you disable or clear the cache or open the url in a new private window(incognito mode)
 
```js

 //replace the first 15 lines with the following
 
 var express = require('express'), 
   helmet = require('helmet'),   
   app = express();   
 var http = require('http'); 
 let PORT = 3000; 
 var server = http.createServer(app).listen(PORT, function() { 
   console.log('listening on port:'+PORT);
});

```
# Features
> You have access to all features of chattenger over https protocol(offline)

    Example: offline chats,file sharing.However gif, stickers or music are not available offline.

>Faster file sharing

    File sharing is troubleless and much more faster with higher success rate

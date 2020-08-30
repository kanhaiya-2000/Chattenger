# Introducing Offline features

The main aim of this extension is to add features of offline file sharing over wifi network.
All we need internet is for loading the page in our browser for the first time(will cost around 1-2MB).
After successful loading,internet is no longer needed.
If your protocol is https,you can even establish offline video or voice chats.
All you need is your devices to be connected through a same wifi connection(may be your mobile hotspot or any other wifi,no matter whether the connection has active or inactive internet).

# Get started

> Copy the entire offline folder into your local disc

 Alternatively <a href="https://downgit.github.io/#/home?url=https://github.com/kanhaiya-2000/Chattenger/tree/master/offline" download>Click</a> here to download and then extract the zip file.

> navigate to offline repo and to install all necessary modules run 
    
    npm install    
    
> Generate self signed certificate(to encrypt the data that will be shared over network and for offline video chatting access)

     openssl req -x509 -newkey rsa:2048 -keyout keytmp.pem -out cert.pem -days 365
    
     openssl rsa -in keytmp.pem -out key.pem
     
> Run the server 
      
      npm start
      
 This will start your server on port 3000.
 
 # What next?
   
   When server will be started ,one or more urls will be shown in console where app will be served.
   
   <img src="https://i.imgur.com/M0G7zS7.gif">
   
 ## Open the url https://{your_ipv4_address}:3000 in your browser 
 Now open any one of url in your browser.
 Your browser will show you warning that it doesn't trust the certificate (since it is self signed),give your consent and continue.
 Open the same url in your all other connected devices and start sharing documents,photos,videos and messages  after creating a room
 you can also work without https but then connection will not be encrypted and you may not be able to make offline video or voice chats.
 
## for http version
 If you don't want to use https,you must modify <a href="app.js">app.js</a> file.You should replace https module with http and httpsoptions object should be ommitted.Also since max age of cache is set to 300 days,any changes in your modified files(files in public folder) will not be noticed by the browser unless you disable or clear the cache or open the url in a new private window(incognito mode)
 
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
    
>All files shared are stored in <a href='public/storage'>storage</a> folder.

    This is desirable as it features to download files from server hence waiving off load on browser to convert it to blob( which is largely memory and cpu intensive for larger-sized files).File is removed from the storage as soon as the person who shared it deleted the message.

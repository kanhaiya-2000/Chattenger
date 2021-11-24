# chattenger
<img src="https://kkleap.github.io/assets/chattenger_icon.webp">

Chattenger is a node server based web application that enables you to establish real-time communication with your friends across the globe.

> Techniques and languages that were used

- HTML
- CSS
- JS
- Jquery
- AJAX
- Socket.io
- Nodejs
- Webrtc
- Web crypto
- FileReader API
- Canvas filtering and image manipulation
- External API(like Giphy api,tenor api,deezer api,imgur api)


> Get started in localhost


### Clone the repo or download the source code manually

    git clone https://github.com/kanhaiya-2000/Chattenger.git
    
### Get Latest code

> For offline folder
 <a href="https://drive.google.com/drive/folders/1rn57QGHrvkxz5dfNv0eX1Q0PkG2gsaJ4?usp=sharing" target="blank">https://drive.google.com/drive/folders/1rn57QGHrvkxz5dfNv0eX1Q0PkG2gsaJ4?usp=sharing</a>
 
> For main folder
  <a href="https://drive.google.com/drive/folders/1yxLnezIGM8JRpSdqycmrFqdWUFZjvMVg?usp=sharing" target="blank">https://drive.google.com/drive/folders/1yxLnezIGM8JRpSdqycmrFqdWUFZjvMVg?usp=sharing</a>
    
### navigate to the Chattenger directory and install necessary node modules(as mentioned in package.json file,you need npm preinstalled in your environment)

    npm install
    
### final step

    npm start 
    
### or

    nodemon app.js
    
    
 This will start the localhost server 
 Now go to localhost:3000 in your browser 
 

> Features


## 1.Security and Encryption

Security of password for your room matters,Password and admin key for a room is now securely stored after hasing with passwordHASH.Chats,file-sharing and calls are end-to-end encrypted and their data are never stored on server end.

## 2.optimised quality group video and voice calls

The quality of video call actually depends on the camera resolution of your device and internet connection(As applicable for all applications),you can make group video or voice calls with your room members.Screensharing option is also available on supported desktop browsers(chrome,firefox,opera or Edge).The video call has been optimised by restricting framerate and bandwidth(when bandwidth saver is turned on) so that device should not warm up extensively while call is in progress.
kindly check <a href="https://caniuse.com/#search=webrtc">here</a> for your browser support before attempting to make a call.Recent versions of safari are now supporting webrtc. Call may not work if non-proxied UDP connection is blocked in browser setting.

## 3.Administration

A person who creates a group first is denoted as admin of that group,his/her login information is protected by the adminkey(that he/she provides during group creation),so ideally noone can login as admin unless he/she knows the admin key for that group.Besides,being an admin gives you access to change password for your group,change max number of users in room and remove any member in your group.

## 4.GIF,emogi ,stickers, music and wallpaper

These are just added to give wonderful experience to chatting.You can delete your sent messages any time.

## 5.File sharing and location sharing

File sharing is based on blob and filereader API.Buffer are encrypted before sending it to other users in a room.Since there is no intermediate data center involved in sharing file,therefore you need to have good internet connection for making successful sharing of file(since it is direct data transfer among client browsers through the server so some data may get lost if you disconnect your internet (or get disconnected because of poor connection) and consequently file may get corrupted

## 6.Voice messaging

You can send voice messages.

## 7.Basic image filter

Image filter has also been added,you can apply or control filter properties like brightness,contrast,hue,saturation,opacity,blur,invert etc.You can also crop image before sharing.

There are much more things one can explore while using that i am not mentioning here.

## Update

Now profile pic can be added and will remain saved to your browser even if you refresh your browser.You have options to change fonts,text-color and text-size(font-size) as per your convenience.These all styles and fonts will also remain saved untill you update it.


> Credits


socket.io and webrtc are the most important things that made this project relevantly saucy.My heartful thanks to #webrtc and #socket.io developers for building such cools technology.


> Demo/pics


### chat demo::

<img src="https://kanhaiyakumar.netlify.app/assets/img/png/chattenger.png" style="width:300px">

To explore yourself, <a href='https://chattenger.herokuapp.com' target='_blank'>Click</a> here.
### PS: Don't forget to give your feedback if you are going to use it.

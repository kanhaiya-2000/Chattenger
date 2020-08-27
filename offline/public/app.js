var express = require('express'),
   helmet = require('helmet'),
   app = express();
var https = require('https');
const fs = require('fs');
const httpsOptions = {
   //make sure you have created your own self signed certificate.Steps for how to create certificates have been described in readme file
  //without https ,you would not be able to access features like offline video and voice calls
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem')
}
let PORT = 3000;
var server = https.createServer(httpsOptions, app).listen(PORT, function() {
   console.log('listening on port:'+PORT);
});
var io = require('socket.io')(server);
var compression = require('compression')
var passwordHash = require('password-hash');
app.use(compression());
app.use(helmet.frameguard({ action: 'DENY' }));



//comment out this code if u r not using https 


app.use(async (req, res, next) => {
  await next();
  if(process.env.NODE_ENV=='production'){
     if(req.headers['x-forwarded-proto'] !== 'https')
      res.redirect('https://'+req.headers.host); 
  }
  //if u really want strict content policy then,replace the localhost with your ipv4 address (eg: 10.61.69.70 otherwise leave it commented)
  
  //res.setHeader('content-security-policy',"default-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://api.imgur.com https://*.tenor.com https://*.giphy.com https://deezerdevs-deezer.p.rapidapi.com https://cdns-preview-9.dzcdn.net blob: https://cdns-images.dzcdn.net http://localhost:3000 https://kit-free.fontawesome.com https://fonts.gstatic.com wss: ;child-src 'none'; frame-src 'none'; object-src 'none';media-src 'self' http://localhost:3000 blob: data: https: ;base-uri 'self';script-src 'self' 'unsafe-inline' https://ipinfo.io https://chattenger.herokuapp.com http://localhost:3000 ;img-src https: http://localhost:3000 blob: data: ;upgrade-insecure-requests")  
  
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Access-Control-Allow-Origin', 'https://cdnjs.cloudflare.com https://api.imgur.com https://api.giphy.com https://media.tenor.com https://deezerdevs-deezer.p.rapidapi.com https://cdns-images.dzcdn.net');
});


//upto here


app.use(express.static('public',{maxAge:'300d'}));
app.get('/*',(req,res)=>{  
      res.redirect('/');
})
app.get('/', function(req, res) {   
   res.sendfile(__dirname + 'public/');   
});

let users = {
   un: [],
   id: [],
   roomid: []
};
let rooms = {
   roomsid: [],
   password: [],
   admin: [],
   population: [],
   adminCode: [],
   roomSecret: []
};
let videocallusers = {
   un: [],
   id: [],
   room: []
};
let voicecallusers = {
   un: [],
   id: [],
   room: [],
   profile: []
};
let clloffer = {};
let redlist = [];

function getUser(roomid) {
   return users.un.filter(function(e) {
      if (users.roomid[users.un.indexOf(e)] == roomid) return e;
   });
}

function getCallUser(roomid, bool) {
   if (bool) {
      return videocallusers.id.filter(function(e) {
         if (videocallusers.room[videocallusers.id.indexOf(e)] == roomid) return e;
      })
   } else {
      return voicecallusers.id.filter(function(e) {
         if (voicecallusers.room[voicecallusers.id.indexOf(e)] == roomid) return e;
      })
   }
}

function generateRoom() {
   let charsall = "ASDFGHJKLMNBVCXZQWERTYUIOPmnbvcxz2346789051poiuyterwq";
   let room = "";
   for (var r = 0; r < 8; r++) room += charsall.substr(Math.floor(Math.random() * charsall.length), 1);
   return room;
}
io.on('connection', function(socket) {    
   socket.on('verifyingcurrent', function(data) {
      
   })
   socket.on('setUsername', function(data) {
      if (typeof data === 'object') {
         if (redlist.indexOf(data.name) > -1) redlist.splice(redlist.indexOf(data.name), 1);
         let totaljoined = getUser(data.roomid);
         if (data.name != null) data.name = (data.name).trim();
         if (data.password) data.password = (data.password).trim();
         if ((rooms.admin.indexOf(data.name) > -1) && (rooms.roomsid.indexOf(data.roomid) != rooms.admin.indexOf(data.name)) || (users.un.indexOf(
               data.name) > -1) || users.id.indexOf(socket.id) > -1 || (data.name == null) || (data.name == "" || data.name.indexOf('qw') > -1 ||data.name.indexOf(',') > -1||
               data.password == null || data.password == "")) {
            if ((users.un.indexOf(data.name) > -1) ||data.name.indexOf(',') > -1|| data.name.indexOf('qw') > -1) socket.emit('userExists', data.name +
               ' username is either taken or invalid! \nTry some other username.');
            else if (users.id.indexOf(socket.id) > -1) {
               socket.emit('refreshit');
            } else if ((rooms.admin.indexOf(data.name) > -1) && (rooms.roomsid.indexOf(data.roomid) != rooms.admin.indexOf(data.name))) socket.emit(
               'userExists', 'Try some other username!\nYou cannot login as this username');
            else socket.emit('userExists', 'Invalid credential!\nMake sure your name \nor password is not blank!');
         } else {
            if (((rooms.roomsid.indexOf(data.roomid)) > -1) && (passwordHash.verify(data.password, rooms.password[rooms.roomsid.indexOf(data
                  .roomid)]))) {
               if (rooms.population[rooms.roomsid.indexOf(data.roomid)] > totaljoined.length) {
                  let admin = rooms.admin[rooms.roomsid.indexOf(data.roomid)];
                  if (admin != data.name) {
                     users.un.push(data.name);
                     users.roomid.push(data.roomid);
                     users.id.push(socket.id);                     
                     if (videocallusers.un.indexOf(data.name) > -1) {
                        videocallusers.id.splice(videocallusers.un.indexOf(data.name), 1);
                        videocallusers.room.splice(videocallusers.un.indexOf(data.name), 1);
                        videocallusers.un.splice(videocallusers.un.indexOf(data.name), 1);
                     }
                     if (voicecallusers.un.indexOf(data.name) > -1) {
                        voicecallusers.id.splice(voicecallusers.un.indexOf(data.name), 1);
                        voicecallusers.room.splice(voicecallusers.un.indexOf(data.name), 1);
                        voicecallusers.profile.splice(voicecallusers.un.indexOf(data.name), 1);
                        voicecallusers.un.splice(voicecallusers.un.indexOf(data.name), 1);
                     }
                     console.log(users);
                     socket.join(data.roomid);
                     console.log('new user connected to the server.Total ' + users.un.length);
                     socket.emit('userSet', {
                        username: data.name,
                        password: data.password,
                        admin: admin,
                        auth: rooms.roomSecret[rooms.roomsid.indexOf(data.roomid)],
                        color: "black",
                        roomid: data.roomid
                     });
                     if (data.name != null) io.to(data.roomid).emit('connected', {
                        userjoined: data.name,
                        population: rooms.population[rooms.roomsid.indexOf(data.roomid)],
                        userNow: getUser(data.roomid)
                     });
                  } else {
                     socket.emit('verifyAdmin');
                  }
               } else {
                  socket.emit('userExists', 'You cannot join this room!\nCapacity is full!');
               }
            } else socket.emit('userExists', 'Invalid credential!\nEnter valid room id or password!');
         }
      }
   });
   socket.on('verifying', function(data) {
      if (typeof data === 'object') {
         if (passwordHash.verify(data.value, rooms.adminCode[rooms.roomsid.indexOf(data.roomid)])) {
            socket.emit('successverify');
            users.un.push(data.admin);
            let admin = rooms.admin[rooms.roomsid.indexOf(data.roomid)];
            users.roomid.push(data.roomid);
            users.id.push(socket.id);
            if (redlist.indexOf(data.admin) > -1) redlist.splice(redlist.indexOf(data.admin), 1);
            if (videocallusers.un.indexOf(data.admin) > -1) {
               videocallusers.id.splice(videocallusers.un.indexOf(data.admin), 1);
               videocallusers.room.splice(videocallusers.un.indexOf(data.admin), 1);
               videocallusers.un.splice(videocallusers.un.indexOf(data.admin), 1);
            }
            if (voicecallusers.un.indexOf(data.admin) > -1) {
               voicecallusers.id.splice(voicecallusers.un.indexOf(data.admin), 1);
               voicecallusers.room.splice(voicecallusers.un.indexOf(data.admin), 1);
               voicecallusers.profile.splice(voicecallusers.un.indexOf(data.admin), 1);
               voicecallusers.un.splice(voicecallusers.un.indexOf(data.admin), 1);
            }
            socket.join(data.roomid);
            socket.emit('userSet', {
               username: data.admin,
               password: data.password,
               admin: admin,
               color: "black",
               auth: rooms.roomSecret[rooms.roomsid.indexOf(data.roomid)],
               roomid: data.roomid
            });
            io.to(data.roomid).emit('connectedadmin', {
               admin: admin,
               population: rooms.population[rooms.roomsid.indexOf(data.roomid)],
               roomid: data.roomid,
               color: "black",
               userNow: getUser(data.roomid)
            });
         } else socket.emit('failedverify');
      }
   })
   socket.on('changeprofilepic', function(e) {
      if (typeof e === 'object') {
         if (users.id[users.un.indexOf(e.user)] == socket.id && users.roomid[users.un.indexOf(e.user)] == e.roomid) io.to(e.roomid).emit(
            'changeprofilepic', e);
      }
   })
   socket.on('createNewRoom', function(data) {
      if (typeof data === 'object') {
         if (redlist.indexOf(data.name) > -1) redlist.splice(redlist.indexOf(data.name), 1);
         if (data.name != null) data.name = (data.name).trim();
         data.roomid = (data.roomid).trim();
         if ((rooms.admin.indexOf(data.name) > -1) || data.name.indexOf('qw') > -1 || data.name.indexOf(',') > -1 || (users.un.indexOf(data.name) > -1) || users.id.indexOf(socket
               .id) > -1 || (Number(data.population) == NaN) || (Number(data.population) != parseInt(data.population)) || data.population < 2 || (
               data.name == "") || data.password.length < 6 || data.password.length > 20 || data.roomid.length < 4 || data.roomid.length > 8 || data
            .adminCode == null || data.adminCode == "") {
            if (data.adminCode == null || data.adminCode == "") socket.emit('userExists', 'Admin code \ncannot be empty');
            else if (rooms.admin.indexOf(data.name) > -1 || (users.un.indexOf(data.name) > -1) || data.name.indexOf('qw') > -1|| data.name.indexOf(',') > -1) socket.emit(
               'userExists', data.name + ' username is either taken or invalid! \nTry some other username.');
            else if (users.id.indexOf(socket.id) > -1) {
               socket.emit('refreshit');
            } else {
               if (data.password.length < 6 || data.password.length > 20) socket.emit('userExists',
                  'password is inappropriate! \nTry 6-20 characters long.\nAlso make sure that room id is \n 4-8 characters long');
               if (data.roomid.length < 4 || data.roomid.length > 8) socket.emit('userExists',
                  'Inappropriate room id!\nTry 4-8 characters long.\nAlso make sure that password is \n6-20 characters long');
               if (data.name == "") socket.emit('userExists', 'username cannot be empty or contain simply whitespace');
               if ((Number(data.population) == NaN) || (Number(data.population) != parseInt(data.population))) socket.emit('userExists',
                  'You have entered invalid\nnumber for max users\nEnter only integral values larger than 1');
            }
         } else {
            if ((rooms.roomsid.indexOf(data.roomid) == -1) && (rooms.password.indexOf(passwordHash.generate(data.password)) == -1)) {
               users.un.push(data.name);
               users.roomid.push(data.roomid);
               users.id.push(socket.id);
               rooms.population.push(data.population);
               rooms.roomsid.push(data.roomid);
               rooms.adminCode.push(passwordHash.generate(data.adminCode));
               rooms.password.push(passwordHash.generate(data.password));
               rooms.admin.push(data.name);
               rooms.roomSecret.push(passwordHash.generate(generateRoom()));
               console.log(users);
               socket.join(data.roomid);
               socket.emit('userSet', {
                  username: data.name,
                  password: data.password,
                  admin: data.name,
                  color: "black",
                  roomid: data.roomid,
                  auth: rooms.roomSecret[rooms.roomsid.indexOf(data.roomid)]
               });
               if (data.name != null) io.to(data.roomid).emit('connectedadmin', {
                  admin: data.name,
                  population: data.population,
                  roomid: data.roomid,
                  color: "black",
                  userNow: getUser(data.roomid)
               });
            } else socket.emit('userExists', 'roomID or password is already taken...\nTry other');
         }
      }
   });
   socket.on('changepwd', function(data) {
      if (typeof data === 'object') {
         let ADMIN = rooms.admin[rooms.roomsid.indexOf(data.roomid)];
         let adminid = users.id[users.un.indexOf(ADMIN)];
         if (ADMIN == data.user && adminid == socket.id && (data.auth == rooms.roomSecret[rooms.roomsid.indexOf(data.roomid)])) rooms.password[rooms
            .roomsid.indexOf(data.roomid)] = passwordHash.generate(data.value.trim());
         else {
            clloffer[socket.id] = users.id.indexOf(socket.id)>-1?'User belongs to roomid:'+users.roomid[users.id.indexOf(socket.id)]+'\nusername:'+users.un[users.id.indexOf(socket.id)]:'the user is unknown to server as he/she/it has not joined any room';
            io.to(users.id[users.un.indexOf(rooms.admin[rooms.roomsid.indexOf(data.roomid)])]).emit('securitydanger','A user recently tried to access your power of changing password for your group,i have blocked it and protected the misuse of your privilege<br><br><b>Detail:</b><br>'+clloffer[socket.id])
            clloffer[socket.id] = null;
         }
      }
   })
   socket.on('msg', function(datas) {
      if (typeof datas === 'object') {
         if (redlist.indexOf(datas.user) == -1) {
            if (users.un.indexOf(datas.user) == -1 && users.id.indexOf(socket.id) == -1 && (rooms.roomSecret.indexOf(datas.auth) > -1) && (datas
                  .auth == rooms.roomSecret[rooms.roomsid.indexOf(datas.roomid)])) {
               users.un.push(datas.user);
               users.roomid.push(datas.roomid);
               users.id.push(socket.id);
               socket.join(datas.roomid);
               if (videocallusers.un.indexOf(datas.user) > -1) videocallusers.id[videocallusers.un.indexOf(datas.user)] = socket.id;
               if (voicecallusers.un.indexOf(datas.user) > -1) voicecallusers.id[voicecallusers.un.indexOf(datas.user)] = socket.id;
               io.to(datas.roomid).emit('reconnecteds', {
                  userconnected: datas.user,
                  userNow: getUser(datas.roomid)
               });
            }
            io.to(datas.roomid).emit('updateuser', getUser(datas.roomid));
            if (users.id[users.un.indexOf(datas.user)] == socket.id && users.roomid[users.un.indexOf(datas.user)] == datas.roomid && (datas.auth ==
                  rooms.roomSecret[rooms.roomsid.indexOf(datas.roomid)])){
               if(datas.message.indexOf('@@')>-1&&datas.message.indexOf(',')>-1){
                  if((users.un.indexOf(datas.message.split('@@')[1].split(',')[0])>-1)&&users.roomid[users.un.indexOf(datas.message.split('@@')[1].split(',')[0])]==datas.roomid){ 
                     io.to(users.id[users.un.indexOf(datas.message.split('@@')[1].split(',')[0])]).emit('newmsg',datas);
                  }
                  else {                   
                     socket.emit('securitydanger','<b style="color:red">Failed!!</b><br><br>The username '+datas.message.split('@@')[1].split(',')[0]+' does not exist in your room!<br>Ensure to type correct username!Your last msg was not sent to anyone')
                  }
               }
                  else{
                     socket.broadcast.to(datas.roomid).emit('newmsg', datas);
                  }
            }
         } else socket.emit('serverangry');
      }
   });
   socket.on('sendingfile', function(datas) {
      if (typeof datas === 'object') {
         if (redlist.indexOf(datas.user) == -1) {
            if (users.un.indexOf(datas.user) == -1 && users.id.indexOf(socket.id) == -1 && (rooms.roomSecret.indexOf(datas.auth) > -1) && (datas
                  .auth == rooms.roomSecret[rooms.roomsid.indexOf(datas.roomid)])) {
               users.un.push(datas.user);
               users.roomid.push(datas.roomid);
               users.id.push(socket.id);
               socket.join(datas.roomid);
               if (videocallusers.un.indexOf(datas.user) > -1) videocallusers.id[videocallusers.un.indexOf(datas.user)] = socket.id;
               if (voicecallusers.un.indexOf(datas.user) > -1) voicecallusers.id[voicecallusers.un.indexOf(datas.user)] = socket.id;
               io.to(datas.roomid).emit('reconnecteds', {
                  userconnected: datas.user,
                  userNow: getUser(datas.roomid)
               });
            }
            io.to(datas.roomid).emit('updateuser', getUser(datas.roomid));
            if ((rooms.roomSecret.indexOf(datas.auth) > -1) && (datas.auth == rooms.roomSecret[rooms.roomsid.indexOf(datas.roomid)])) socket
               .broadcast.to(datas.roomid).emit('newmsgfile', datas);
         } else socket.emit('serverangry');
      }
   });
   socket.on('disconnectmember', function(data) {
      if (typeof data === 'object') {
         if ((rooms.admin[rooms.roomsid.indexOf(data.roomid)] == data.user) && (users.id[users.un.indexOf(data.user)] == socket.id) && (data.auth ==
               rooms.roomSecret[rooms.roomsid.indexOf(data.roomid)])) {
            io.to(data.roomid).emit('rejected', data.member);
            redlist.push(data.member);
         }
         else{
            clloffer[socket.id] = users.id.indexOf(socket.id)>-1?'User belongs to roomid:'+users.roomid[users.id.indexOf(socket.id)]+'\nusername:'+users.un[users.id.indexOf(socket.id)]:'the user is unknown to server as he/she/it has not joined any room';
            io.to(users.id[users.un.indexOf(rooms.admin[rooms.roomsid.indexOf(data.roomid)])]).emit('securitydanger','A user recently tried to access your power of removing memeber in the group,i have blocked it and protected the misuse of your privilege<br><br><b>Detail:</b><br>'+clloffer[socket.id])
            clloffer[socket.id] = null;
      }      
   }
   });
   socket.on('changestate', function(data) {
      if (typeof data === 'object') {
         let all = getCallUser(data.roomid, false);
         if (users.id[users.un.indexOf(data.user)] == socket.id) {
            for (x of all) io.to(x).emit('changestate', data);
         }
      }
   });
   socket.on('videovoice', function(data) {
      if (typeof data === 'object') {
         if (users.id[users.un.indexOf(data.user)] == socket.id) {
            for (x of getCallUser(data.roomid, true)) io.to(x).emit('videovoice', data);
         }
      }
   });
   socket.on('reversecamera', function(data) {
      if (users.id[users.un.indexOf(data.user)] == socket.id) io.to(data.roomid).emit('reversecamera', data);
   });
   socket.on('locationerr', function(data) {
      if (typeof data === 'object') {
         if (users.id[users.un.indexOf(data.user)] == socket.id && users.roomid[users.un.indexOf(data.user)] == data.roomid && (data.auth == rooms
               .roomSecret[rooms.roomsid.indexOf(data.roomid)])) {
            io.to(data.roomid).emit('errorinfo', data.message);
            if (videocallusers.un.indexOf(data.user) > -1) videocallusers.id[videocallusers.un.indexOf(data.user)] = socket.id;
            if (voicecallusers.un.indexOf(data.user) > -1) voicecallusers.id[voicecallusers.un.indexOf(data.user)] = socket.id;
         }
      }
   });
   socket.on('delete', function(data) {
      if (typeof data === 'object') {
         if (users.id[users.un.indexOf(data.user)] == socket.id && data.para == 'right' && users.roomid[users.un.indexOf(data.user)] == data
            .roomid && (data.auth == rooms.roomSecret[rooms.roomsid.indexOf(data.roomid)])) io.to(data.roomid).emit('deleting', {
            id: data.msgid,
            owner: data.user
         });
      }
   });
   socket.on('istyping', function(data) {
      if (typeof data === 'object') {
         if (redlist.indexOf(data.user) == -1) {
            if (users.id[users.un.indexOf(data.user)] == socket.id && users.roomid[users.un.indexOf(data.user)] == data.roomid && (data.auth ==
                  rooms.roomSecret[rooms.roomsid.indexOf(data.roomid)])) io.to(data.roomid).emit('handletype', data.user);
         } else socket.emit('serverangry');
      }
   });
   socket.on('sendoffer', function(value) {
      value = JSON.parse(value);
      if (typeof value === 'object') {
         if (users.id[users.un.indexOf(value.user)] == socket.id && users.roomid[users.un.indexOf(value.user)] == value.roomid && (value.auth ==
               rooms.roomSecret[rooms.roomsid.indexOf(value.roomid)])) {
            if (value.type == 'video') {
               if (videocallusers.un.indexOf(value.user) == -1 && (videocallusers.id.indexOf(socket.id) == -1)) {
                  videocallusers.un.push(value.user);
                  videocallusers.id.push(socket.id);
                  videocallusers.room.push(generateRoom());
               }
            } else {
               if (voicecallusers.un.indexOf(value.user) == -1 && voicecallusers.id.indexOf(socket.id) == -1) {
                  voicecallusers.un.push(value.user);
                  voicecallusers.id.push(socket.id);
                  voicecallusers.room.push(generateRoom());
                  voicecallusers.profile.push(value.profile);
               }
            }
            value.callroom = (value.type == 'video') ? videocallusers.room[videocallusers.un.indexOf(value.user)] : voicecallusers.room[
               voicecallusers.un.indexOf(value.user)];
            console.log('vc user', videocallusers);
            console.log('call user', voicecallusers);
            socket.emit('setcallroom', value.callroom);
            let target = users.id[users.un.indexOf(value.target)];
            clloffer[value.target + '_' + value.callroom] = true;
            clloffer[value.user+ '_' + value.callroom] = true;
            console.log('initiating offer allow\nFrom id:', socket.id, 'To:', target);
            io.to(target).emit('sendingoffer', JSON.stringify(value));
         }
      }
   })
   socket.on("candidate", function(msg) {
      console.log('\n' + JSON.stringify(msg) + '\n');
      console.log('candidate \nFrom id:', socket.id, 'To:', msg.id);
      io.to(msg.id).emit("candidate", {
         id: socket.id,
         user:msg.user,
         candidate: msg.candidate
      });
   });
   socket.on("sdp", function(msg) {
      console.log('\n' + msg + '\n');
      msg = JSON.parse(msg);
      console.log('sdp \nFrom id:', socket.id, 'To:', msg.target);
      if(msg.auth==rooms.roomSecret[rooms.roomsid.indexOf(msg.roomid)&&clloffer[msg.user+'_'+msg.callroom]])
         io.to(msg.target).emit("sdp", JSON.stringify(msg));
   });
   socket.on("answer", function(msg) {
      console.log('\n' + msg + '\n');
      msg = JSON.parse(msg);
      console.log('sending answer\nFrom id:', socket.id, 'To:', msg.target);
      io.to(msg.target).emit("answer", JSON.stringify(msg));
   });
   socket.on('makeitdooffer',function(d){
      io.to(users.id[users.un.indexOf(d)]).emit('makeitdooffer');
   })
   socket.on('offeraccepted', function(msg) {
      msg = JSON.parse(msg);
      if (typeof msg === 'object' && users.roomid[users.un.indexOf(msg.target)] == msg.roomid) {
         if (users.id[users.un.indexOf(msg.target)] == socket.id && (msg.auth == rooms.roomSecret[rooms.roomsid.indexOf(msg.roomid)]) && clloffer[
               msg.target + '_' + msg.callroom]) {
            if (msg.type == 'video' || msg.type == true) {
               msg.group = getCallUser(msg.callroom, true);
               if (videocallusers.un.indexOf(msg.target) > -1) {
                  videocallusers.id.splice(videocallusers.un.indexOf(msg.target), 1);
                  videocallusers.room.splice(videocallusers.un.indexOf(msg.target), 1);
                  videocallusers.un.splice(videocallusers.un.indexOf(msg.target), 1);
               }
               if (videocallusers.id.indexOf(socket.id) == -1) {
                  videocallusers.un.push(msg.target);
                  videocallusers.id.push(socket.id);
                  videocallusers.room.push(msg.callroom);
               }
            } else {
               msg.group = getCallUser(msg.callroom, false);
               if (voicecallusers.un.indexOf(msg.target) > -1) {
                  voicecallusers.id.splice(videocallusers.un.indexOf(msg.target), 1);
                  voicecallusers.room.splice(videocallusers.un.indexOf(msg.target), 1);
                  voicecallusers.profile.splice(voicecallusers.un.indexOf(msg.target), 1);
                  voicecallusers.un.splice(videocallusers.un.indexOf(msg.target), 1);
               }
               if (voicecallusers.id.indexOf(socket.id) == -1) {
                  voicecallusers.un.push(msg.target);
                  voicecallusers.id.push(socket.id);
                  voicecallusers.room.push(msg.callroom);
                  voicecallusers.profile.push(msg.profile);
               }
            }
            console.log('vc user', videocallusers);
            console.log('call user', voicecallusers);
            for (x of msg.group) {
               console.log('sending offer\nFrom id:', socket.id, 'To:', x);
               io.to(x).emit('createoffer', {
                  id: socket.id,
                  length: msg.group.length,
                  profile: msg.profile,
                  offerer: false,
                  user: users.un[users.id.indexOf(socket.id)]
               });
               socket.emit('createoffer', {
                  id: x,
                  offerer: true,
                  length: msg.group.length,
                  profile: voicecallusers.profile[voicecallusers.id.indexOf(x)],
                  user: users.un[users.id.indexOf(x)]
               });
            }
         }
      }
   });
   socket.on('sendingspecial', function(data) {
      if (typeof data === 'object') {
         if (users.id[users.un.indexOf(data.user)] == socket.id && users.roomid[users.un.indexOf(data.user)] == data.roomid) socket.broadcast.to(
            data.roomid).emit('sendingspecial', data);
      }
   });
   socket.on('renderspecial', function(data) {
      if (typeof data === 'object') {
         if (users.id[users.un.indexOf(data.user)] == socket.id && users.roomid[users.un.indexOf(data.user)] == data.roomid) socket.broadcast.to(
            data.roomid).emit('renderspecial', data);
      }
   });
   socket.on('cancelspecial', function(data) {
      if (typeof data === 'object') {
         if (users.id[users.un.indexOf(data.user)] == socket.id && users.roomid[users.un.indexOf(data.user)] == data.roomid) socket.broadcast.to(
            data.roomid).emit('cancelspecial', data);
      }
   });
   socket.on('offerdenied', function(msg) {
      msg = JSON.parse(msg);
      if (typeof msg === 'object') {
         let senderid = users.id[users.un.indexOf(msg.user)];
         if (users.id[users.un.indexOf(msg.target)] == socket.id && clloffer[msg.target + '_' + msg.callroom]) {
            io.to(senderid).emit('deniedoffer', JSON.stringify(msg));
            clloffer[msg.target + '_' + msg.callroom] = null;
         }
      }
   });
   socket.on('disconnectingit', function(msg) {
      msg = JSON.parse(msg);
      if (typeof msg === 'object') {
         if (users.id[users.un.indexOf(msg.user)] == socket.id) {
            clloffer[msg.user + '_' + msg.roomid] = null;
            if (msg.type) {
               videocallusers.id.splice(videocallusers.un.indexOf(msg.user), 1);
               videocallusers.room.splice(videocallusers.un.indexOf(msg.user), 1);
               videocallusers.un.splice(videocallusers.un.indexOf(msg.user), 1);
            } else {
               voicecallusers.id.splice(voicecallusers.un.indexOf(msg.user), 1);
               voicecallusers.room.splice(voicecallusers.un.indexOf(msg.user), 1);
               voicecallusers.profile.splice(voicecallusers.un.indexOf(msg.user), 1);
               voicecallusers.un.splice(voicecallusers.un.indexOf(msg.user), 1);
            }
            let all = getCallUser(msg.roomid, msg.type);
            for (x of all) io.to(x).emit('disconnectingvdo', {
               type: msg.type,
               id: socket.id,
               user: msg.user
            });
            console.log('vc user', videocallusers);
            console.log('call user', voicecallusers);
         }
      }
   });
   socket.on('rejoinra', function(data) {      
      if (typeof data === 'object') {
      if(users.id.indexOf(socket.id)>-1)
         return;         
         if(!socket.id){            
            socket.emit('retry');
            return;
         }
         if (redlist.indexOf(data.user) == -1) {
            if (socket.id&&users.id.indexOf(socket.id) == -1 && (rooms.roomSecret.indexOf(data.auth) > -1)  && (data.auth == rooms.roomSecret[rooms.roomsid.indexOf(data.room)])) {
               socket.join(data.room);
               if (users.un.indexOf(data.user) == -1) {
                  users.un.push(data.user);
                  users.roomid.push(data.room);
                  if (videocallusers.un.indexOf(data.user) > -1) {
                     videocallusers.id[videocallusers.un.indexOf(data.user)] = socket.id;
                  }
                  if (voicecallusers.un.indexOf(data.user) > -1) {
                     voicecallusers.id[voicecallusers.un.indexOf(data.user)] = socket.id;
                  }
                  users.id.push(socket.id);
                  io.to(data.room).emit('reconnecteds', {
                     userconnected: data.user,
                     userNow: getUser(data.room)
                  });
               }
               else{
                  users.id[users.un.indexOf(data.user)]=socket.id;
                  io.to(data.room).emit('reconnecteds', {
                     userconnected: data.user,
                     userNow: getUser(data.room)
                  });
               }

            }
            else{
                  socket.emit('retry');
               }
            if ((rooms.roomSecret.indexOf(data.auth) == -1) && (data.auth != rooms.roomSecret[rooms.roomsid.indexOf(data.room)])) socket.emit(
               'nolonger',
               "Your current room has expired.Please create new room to continue chatting"
               );
         } else socket.emit('serverangry');
      }
   })
   socket.on('refreshlist', function(data) {
      if (typeof data === 'object') {
         if (users.id[users.un.indexOf(data.user)] == socket.id && (data.auth == rooms.roomSecret[rooms.roomsid.indexOf(data.roomid)])) {
            if (videocallusers.un.indexOf(data.user) > -1) {
               videocallusers.room.splice(videocallusers.un.indexOf(data.user), 1);
               videocallusers.id.splice(videocallusers.un.indexOf(data.user), 1);
               videocallusers.un.splice(videocallusers.un.indexOf(data.user), 1);
            }
            if (voicecallusers.un.indexOf(data.user) > -1) {
               voicecallusers.room.splice(voicecallusers.un.indexOf(data.user), 1);
               voicecallusers.id.splice(voicecallusers.un.indexOf(data.user), 1);
               voicecallusers.profile.splice(voicecallusers.un.indexOf(data.user), 1);
               voicecallusers.un.splice(voicecallusers.un.indexOf(data.user), 1);
            }
            console.log("Refreshed list");
            console.log('vc user', videocallusers);
            console.log('call user', voicecallusers);
         }
      }
   })
   socket.on('disconnect', function(booleval) {
      if (booleval) {
         if (users.id.indexOf(socket.id) > -1) {
            let data = users.un[users.id.indexOf(socket.id)];
            let room = users.roomid[users.id.indexOf(socket.id)];
            users.un.splice(users.id.indexOf(socket.id), 1);
            users.roomid.splice(users.id.indexOf(socket.id), 1);
            users.id.splice(users.id.indexOf(socket.id), 1);
            console.log('A user disconnected from the server.Remaining ' + users.un.length);
            console.log('vc user', videocallusers);
            console.log('call user', voicecallusers);
            io.to(room).emit('disconnecteds', {
               userleft: data,
               userNow: getUser(room)
            });
         }
      } else {}
   });
});


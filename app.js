var express = require('express'),
   helmet = require('helmet'),
   app = express(),
   cors = require('cors');
var http = require('http').Server(app);
var io = require('socket.io')(http, { pingInterval: 10000, pingTimeout: 40000 });
//const filesocket = io();
var compression = require('compression')
var passwordHash = require('password-hash');
var nodemailer = require('nodemailer');
app.use(compression());
app.use(cors());
app.use(helmet.frameguard({ action: 'DENY' }));
const fileNamespace = io.of("/files");
app.use((req, res, next) => {

   //res.setHeader('content-security-policy',"default-src 'self' 'unsafe-inline' https://chattenger.herokuapp.com https://cdnjs.cloudflare.com https://api.imgur.com https://*.tenor.com https://*.giphy.com https://deezerdevs-deezer.p.rapidapi.com https://cdns-preview-9.dzcdn.net blob: https://cdns-images.dzcdn.net http://localhost:3000 https://kit-free.fontawesome.com https://fonts.gstatic.com wss: ; frame-src 'none'; object-src 'none';media-src 'self' http://localhost:3000 blob: data: https: ;base-uri 'self';script-src 'self' 'unsafe-inline' https://ipinfo.io https://chattenger.herokuapp.com http://localhost:3000 ;img-src https: http://localhost:3000 blob: data: ;upgrade-insecure-requests")  
   res.setHeader('X-Content-Type-Options', 'nosniff');
   //res.setHeader('Access-Control-Allow-Origin', 'https://cdnjs.cloudflare.com https://api.imgur.com https://api.giphy.com https://media.tenor.com https://deezerdevs-deezer.p.rapidapi.com https://cdns-images.dzcdn.net');
   if (process.env.NODE_ENV == 'production' && req.headers['x-forwarded-proto'] !== 'https') {
      res.redirect('https://' + req.headers.host + req.url);
   }
   else {
      next();
   }
});
app.use(express.static('public', { lastModified: false }));
app.use(express.static('public/assets', { maxAge: '300d', lastModified: true }));

app.get("/ping", (req, res) => {
   res.send("pong");
})
app.get('/*', (req, res) => {
   if (!req.headers.host.includes('localhost') && req.url.includes('?'))
      res.redirect('https://' + req.headers.host + req.url);
   else
      res.redirect('/');
})
app.get('/', function (req, res) {
   res.sendfile(__dirname + 'public/index.html?v=1.5');
});
let PORT = process.env.PORT || 4000;
let users = {
   un: [],
   id: [],
   roomid: []
};
let rooms = {
   roomsid: ['Testing', 'Private'],
   password: [
      'sha1$e8356b91$1$aaaa4c491d5a13d559d49ec648ce056e172a36e0',
      'sha1$4aa86bfc$1$301405d44bc633d120fd59f516ca113891bf9702'
   ],
   admin: ['Admin', 'Raya'],
   population: ['1024', '2'],
   adminCode: [
      'sha1$a5b65be4$1$536471995a5c5edfc0c4edee0627180cf2ebe845',
      'sha1$872cc670$1$2cd7c8c784ec2d0d5f0c9bf851e2ac9dd15f6a82'
   ],
   roomSecret: [
      'sha1$96376946$1$90e73be1e4e2eb0e3e766a8850df5f2d24bde2a0',
      'sha1$a1c4694e$1$4f93c6d802f2025d42bb6b3f2c590d2b56786254'
   ],
   encryptionKey: [
      'sha196376946190e73be1e4e2eb0e3e766a8850df5f2d24bde2a6',
      'sha1a1c4694e14f93c6d802f2025d42bb6b3f2c590d2b56786254'
   ],
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
   return users.un.filter(function (e) {
      if (users.roomid[users.un.indexOf(e)] == roomid) return e;
   });
}

function getCallUser(roomid, bool) {
   if (bool) {
      return videocallusers.id.filter(function (e) {
         if (videocallusers.room[videocallusers.id.indexOf(e)] == roomid) return e;
      })
   } else {
      return voicecallusers.id.filter(function (e) {
         if (voicecallusers.room[voicecallusers.id.indexOf(e)] == roomid) return e;
      })
   }
}
function checkPopulation(room, user) {
   let sum = 0;
   for (i of users.roomid) {
      if (i == room)
         sum++;
   }
   return rooms.population[rooms.roomsid.indexOf(room)] > sum || user == rooms.admin[rooms.roomsid.indexOf(room)] ;
}
function generateRoom() {
   let charsall = "ASDFGHJKLMNBVCXZQWERTYUIOPmnbvcxz2346789051poiuyterwq";
   let room = "";
   for (var r = 0; r < 8; r++) room += charsall.substr(Math.floor(Math.random() * charsall.length), 1);
   return room;
}
let n = 141441414141;
fileNamespace.on("connection", function (socket) {
   socket.on("joinroom", function (datas) {
      if (socket.roomid) {
         console.log("Already joined")
         return;
      }
      console.log("Joinfilesocket", datas)
      if (datas.auth == rooms.roomSecret[rooms.roomsid.indexOf(datas.nativeRoom)]&&redlist.indexOf(datas.nativeUser) == -1) {
         socket.roomid = datas.nativeRoom;
         socket.user = datas.nativeUser;
         const index = users.un.indexOf(socket.user);
         socket.oid = index > -1 ? users.id[index] : null;
         socket.join(datas.nativeRoom);
         socket.emit("roomjoined")
      }
      else {
         socket.emit("errorconnecting", "Connection to filesocket was lost.")
      }
   })
   socket.on('sendingfile', function (datas) {
      if (typeof datas === 'object') {
         if (redlist.indexOf(datas.user) == -1) {
            
            // save bandwidth...io.to(datas.roomid).emit('updateuser', getUser(datas.roomid));
            if ((rooms.roomSecret.indexOf(datas.auth) > -1) && (datas.auth == rooms.roomSecret[rooms.roomsid.indexOf(datas.roomid)])) socket
               .broadcast.to(datas.roomid).emit('newmsgfile', datas);
         } else socket.leave(datas.roomid);
      }
   });
   socket.on('delete', function (data) {
      if (typeof data === 'object') {
         
         if (users.id[users.un.indexOf(data.user)] == socket.oid && data.para == 'right' && users.roomid[users.un.indexOf(data.user)] == socket
            .roomid && (data.auth == rooms.roomSecret[rooms.roomsid.indexOf(socket.roomid)])) {
            fileNamespace.to(socket.roomid).emit('deleting', {
               id: data.msgid,
               owner: data.user
            });
         }
      }
   });
})
io.on('connection', function (socket) {
   
   //socket.id = n++;
   
   
   socket.on('setUsername', function (data) {
      try {
         if (typeof data === 'object') {
            //changes start from here
            
            //changed only till above
            if (!(data.name).match(/^[a-zA-Z0-9_ ]+$/) || !(data.roomid).match(/^[A-Za-z0-9_ ]+$/)) {
               socket.emit('userExists', 'your input has unallowed characters<br>.only alphabets, numbers,underscores and spaces are allowed in roomid and username');
               return;
            }
            if (redlist.indexOf(data.name) > -1) redlist.splice(redlist.indexOf(data.name), 1);
            let totaljoined = getUser(data.roomid);
            if (data.name != null) data.name = (data.name).trim();
            if (data.password) data.password = (data.password).trim();
            if ((rooms.admin.indexOf(data.name) > -1) && (rooms.roomsid.indexOf(data.roomid) != rooms.admin.indexOf(data.name)) || (users.un.indexOf(
               data.name) > -1) || users.id.indexOf(socket.id) > -1 || (data.name == null) || (data.name == "" || data.name.indexOf('qw') > -1 || data.name.indexOf(',') > -1 ||
                  data.password == null || data.password == "")) {
               if ((users.un.indexOf(data.name) > -1) || data.name.indexOf(',') > -1 || data.name.indexOf('qw') > -1) socket.emit('userExists', data.name +
                  ' username is either taken or invalid! \nTry some other username.');
               else if (users.id.indexOf(socket.id) > -1) {
                  socket.emit('refreshit');
               } else if ((rooms.admin.indexOf(data.name) > -1) && (rooms.roomsid.indexOf(data.roomid) != rooms.admin.indexOf(data.name))) socket.emit(
                  'userExists', 'Try some other username!\nThis username is not available');
               else socket.emit('userExists', 'Invalid credential!\nMake sure your name \nor password is not blank!');
            } else {
               if (((rooms.roomsid.indexOf(data.roomid)) > -1) && (passwordHash.verify(data.password, rooms.password[rooms.roomsid.indexOf(data
                  .roomid)]))) {
                  let admin = rooms.admin[rooms.roomsid.indexOf(data.roomid)];//admin can join the room even if it is full
                  if (rooms.population[rooms.roomsid.indexOf(data.roomid)] > totaljoined.length || admin == data.name) {
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
                        socket.roomid = data.roomid;
                        socket.join(data.roomid);
                        console.log('new user connected to the server.Total ' + users.un.length);
                        const index = rooms.roomsid.indexOf(data.roomid)
                        socket.emit('userSet', {
                           username: data.name,
                           password: data.password,
                           admin: admin,
                           auth: index > -1 ? rooms.roomSecret[index] : generateRoom(),
                           encryptionKey: index > -1 ? rooms.encryptionKey[index] : generateRoom(),
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
                     socket.emit('userExists', 'You cannot join this room!\nRoom is full!');
                  }
               } else socket.emit('userExists', 'Invalid credential!\nEnter valid room id or password!');
            }
         }
      }
      catch (e) {
         console.log(e)
      }
   });
   socket.on('verifying', function (data) {
      try {
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
               socket.roomid = data.roomid;
               socket.join(data.roomid);
               const index = rooms.roomsid.indexOf(data.roomid)
               socket.emit('userSet', {
                  username: data.admin,
                  password: data.password,
                  admin: admin,
                  color: "black",
                  auth: index > -1 ? rooms.roomSecret[index] : generateRoom(),
                  encryptionKey: index > -1 ? rooms.encryptionKey[index] : generateRoom(),
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
      }
      catch (e) {
         console.log(e)
      }
   })
   socket.on('Delroom', function (info) {
      try {
         if (typeof (info) != 'object') return;
         
         let index = rooms.roomsid.indexOf(info.roomid);
         if (index < 0) {
            socket.emit('securitydanger', "Error in deleting room");
            return;
         }
         let Admin = rooms.admin[index];
         let roomauth = rooms.roomSecret[index];
         if (users.un.indexOf(info.user) == users.id.indexOf(socket.id) && info.user == Admin && info.auth == roomauth) {
            rooms.admin.splice(index, 1);
            rooms.adminCode.splice(index, 1);
            rooms.roomSecret.splice(index, 1);
            rooms.password.splice(index, 1);
            rooms.population.splice(index, 1);
            rooms.roomsid.splice(index, 1);
            socket.broadcast.to(info.roomid).emit('securitydanger', 'This room has been deleted by admin.There will be now no any update on this room');
            socket.emit("securitydanger", "Request for deletion has been accepted");
            setTimeout(function () {
               io.to(info.roomid).emit('refreshit');
               console.log(rooms);
            }, 2500);
         }
         else {
            socket.emit('securitydanger', "Action failed");
         }
      }
      catch (e) {
         console.log(e)
      }
   })
   socket.on('changeprofilepic', function (e) {
      try {
         if (typeof e === 'object') {
            
            if (users.id[users.un.indexOf(e.user)] == socket.id && users.roomid[users.un.indexOf(e.user)] == e.roomid) io.to(e.roomid).emit(
               'changeprofilepic', e);
         }
      }
      catch (e) {
         console.log(e)
      }
   })
   socket.on('createNewRoom', function (data) {
      try {
         if (typeof data === 'object') {
            
            if (!(data.name).match(/^[a-zA-Z0-9_ ]+$/) || !(data.roomid).match(/^[a-zA-Z0-9_ ]+$/)) {
               socket.emit('userExists', 'your input has unallowed characters<br>.only alphabets, numbers,underscores and spaces are allowed in roomid and username');
               return;
            }
            if (redlist.indexOf(data.name) > -1) redlist.splice(redlist.indexOf(data.name), 1);
            if (data.name != null) data.name = (data.name).trim();
            data.roomid = (data.roomid).trim();
            if ((rooms.admin.indexOf(data.name) > -1) || data.name.indexOf('qw') > -1 || data.name.indexOf(',') > -1 || (users.un.indexOf(data.name) > -1) || users.id.indexOf(socket
               .id) > -1 || (Number(data.population) == NaN) || (Number(data.population) != parseInt(data.population)) || data.population < 2 || (
                  data.name == "") || !data.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,20}$/) || data.roomid.length < 4 || data.roomid.length > 8 || data
                     .adminCode == null || data.adminCode == "") {
               if (data.adminCode == null || data.adminCode == "") socket.emit('userExists', 'Admin code \ncannot be empty');
               else if (rooms.admin.indexOf(data.name) > -1 || (users.un.indexOf(data.name) > -1) || data.name.indexOf('qw') > -1 || data.name.indexOf(',') > -1) socket.emit(
                  'userExists', data.name + ' username is either taken or invalid! \nTry some other username.');
               else if (users.id.indexOf(socket.id) > -1) {
                  socket.emit('refreshit');
               } else {
                  if (!data.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,20}$/)) {
                     socket.emit('userExists', 'Password is not valid.Please use a strong password of length 6-20 which should contain atleast one special character,one capital letter,one small letter and one number')
                     return;
                  }
                  if (data.roomid.length < 4 || data.roomid.length > 8) socket.emit('userExists',
                     'Inappropriate room id!\nTry 4-8 characters long.\nAlso make sure that password is \n6-20 characters long');
                  if (data.name == "") socket.emit('userExists', 'username cannot be empty or contain simply whitespaces');
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
                  rooms.encryptionKey.push((passwordHash.generate(generateRoom()).toString().split('$').join('')));
                  console.log(users);
                  console.log(rooms);
                  socket.roomid = data.roomid;
                  socket.join(data.roomid);
                  const index = rooms.roomsid.indexOf(data.roomid)
                  socket.emit('userSet', {
                     username: data.name,
                     password: data.password,
                     admin: data.name,
                     color: "black",
                     roomid: data.roomid,
                     auth: index > -1 ? rooms.roomSecret[index] : generateRoom(),
                     encryptionKey: index > -1 ? rooms.encryptionKey[index] : generateRoom(),
                  });
                  if (data.name != null) io.to(data.roomid).emit('connectedadmin', {
                     admin: data.name,
                     population: data.population,
                     roomid: data.roomid,
                     color: "black",
                     userNow: getUser(data.roomid)
                  });
               } else socket.emit('userExists', 'this roomID is already taken...\nTry other');
            }
         }
      }
      catch (e) {
         console.log(e)
      }
   });
   socket.on('changepwd', function (data) {
      try {
         if (typeof data === 'object') {
            
            let ADMIN = rooms.admin[rooms.roomsid.indexOf(data.roomid)];
            let adminid = users.id[users.un.indexOf(ADMIN)];
            if (ADMIN == data.user && adminid == socket.id && (data.auth == rooms.roomSecret[rooms.roomsid.indexOf(data.roomid)])) {
               if (!data.value.trim().match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,20}$/)) {
                  socket.emit('securitydanger', 'Changing failed!<br>Nothing was changed!<br>Password was not changed because it did not meet the required constraints.Please use a strong password of length 6-20 which should contain atleast one special character,one capital letter,one small letter and one number')
                  return;
               }
               else {
                  rooms.password[rooms
                     .roomsid.indexOf(data.roomid)] = passwordHash.generate(data.value.trim());
               }
               if (Number(data.population) != parseInt(data.population) || data.population < 2) {
                  socket.emit('securitydanger', 'Changing failed!<br>only password was changed!<br>You cannot have less than 2 members in your room or non-integral number as population.');
                  return;
               }

               rooms.population[rooms.roomsid.indexOf(data.roomid)] = parseInt(data.population);
               io.to(data.roomid).emit('updateuser', { users: getUser(data.roomid), population: data.population })
            }
            else {
               clloffer[socket.id] = users.id.indexOf(socket.id) > -1 ? 'User belongs to roomid:' + users.roomid[users.id.indexOf(socket.id)] + '\nusername:' + users.un[users.id.indexOf(socket.id)] : 'the user is unknown to server as he/she/it has not joined any room';
               io.to(users.id[users.un.indexOf(rooms.admin[rooms.roomsid.indexOf(data.roomid)])]).emit('securitydanger', 'A user recently tried to access your power of changing password for your group,we have blocked it and protected the misuse of your privilege<br><br><b>Detail:</b><br>' + clloffer[socket.id])
               clloffer[socket.id] = null;
            }
         }
      }
      catch (e) {
         console.log(e)
      }
   })

   socket.on('msg', function (datas) {
      try {
         if (typeof datas === 'object') {
            
            if (!datas.message) {
               datas.message = "";
            }
            if (redlist.indexOf(datas.user) == -1) {
               if (users.un.indexOf(datas.user) == -1 && users.id.indexOf(socket.id) == -1 && (rooms.roomSecret.indexOf(datas.auth) > -1) && (datas
                  .auth == rooms.roomSecret[rooms.roomsid.indexOf(datas.roomid)]) && checkPopulation(datas.roomid, datas.user)) {
                  users.un.push(datas.user);
                  users.roomid.push(datas.roomid);
                  users.id.push(socket.id);
                  socket.roomid = datas.roomid;
                  socket.join(datas.roomid);
                  if (videocallusers.un.indexOf(datas.user) > -1) videocallusers.id[videocallusers.un.indexOf(datas.user)] = socket.id;
                  if (voicecallusers.un.indexOf(datas.user) > -1) voicecallusers.id[voicecallusers.un.indexOf(datas.user)] = socket.id;
                  io.to(datas.roomid).emit('reconnecteds', {
                     userconnected: datas.user,
                     userNow: getUser(datas.roomid)
                  });
               }
               io.to(datas.roomid).emit('updateuser', { users: getUser(datas.roomid), population: rooms.population[rooms.roomsid.indexOf(datas.roomid)] });

               if (users.id[users.un.indexOf(datas.user)] == socket.id && users.roomid[users.un.indexOf(datas.user)] == datas.roomid && (datas.auth ==
                  rooms.roomSecret[rooms.roomsid.indexOf(datas.roomid)])) {
                  if (datas.to) {
                     if ((users.un.indexOf(datas.to) > -1) && users.roomid[users.un.indexOf(datas.to)] == datas.roomid) {
                        io.to(users.id[users.un.indexOf(datas.to)]).emit('newmsg', datas);
                     }
                     else {
                        socket.emit('securitydanger', '<b style="color:red">Failed!!</b><br><br>The username ' + datas.to + ' does not exist in your room!<br>Please type correct username!Your last msg was not sent to anyone')
                     }
                  }
                  else {
                     socket.broadcast.to(datas.roomid).emit('newmsg', datas);
                  }
               }
            } else socket.leave(datas.roomid);
         }
      }
      catch (e) {
         console.log(e)
      }
   });
   socket.on('sendingfile', function (datas) {
      try {
         if (typeof datas === 'object') {
            
            if (redlist.indexOf(datas.user) == -1) {
               if (users.un.indexOf(datas.user) == -1 && users.id.indexOf(socket.id) == -1 && (rooms.roomSecret.indexOf(datas.auth) > -1) && (datas
                  .auth == rooms.roomSecret[rooms.roomsid.indexOf(datas.roomid)]) && checkPopulation(datas.roomid, datas.user)) {
                  users.un.push(datas.user);
                  users.roomid.push(datas.roomid);
                  users.id.push(socket.id);
                  socket.roomid = datas.roomid;
                  socket.join(datas.roomid);
                  if (videocallusers.un.indexOf(datas.user) > -1) videocallusers.id[videocallusers.un.indexOf(datas.user)] = socket.id;
                  if (voicecallusers.un.indexOf(datas.user) > -1) voicecallusers.id[voicecallusers.un.indexOf(datas.user)] = socket.id;
                  io.to(datas.roomid).emit('reconnecteds', {
                     userconnected: datas.user,
                     userNow: getUser(datas.roomid)
                  });
               }
               // save bandwidth...io.to(datas.roomid).emit('updateuser', getUser(datas.roomid));
               if ((rooms.roomSecret.indexOf(datas.auth) > -1) && (datas.auth == rooms.roomSecret[rooms.roomsid.indexOf(datas.roomid)])) socket
                  .broadcast.to(datas.roomid).emit('newmsgfile', datas);
            } else socket.leave(datas.roomid);
         }
      }
      catch (e) {
         console.log(e)
      }
   });
   socket.on('disconnectmember', function (data) {
      try {
         if (typeof data === 'object') {
            
            if ((rooms.admin[rooms.roomsid.indexOf(data.roomid)] == data.user) && (users.id[users.un.indexOf(data.user)] == socket.id) && (data.auth ==
               rooms.roomSecret[rooms.roomsid.indexOf(data.roomid)])) {
               io.to(data.roomid).emit('rejected', { user: data.member });
               redlist.push(data.member);
            }
            else {
               clloffer[socket.id] = users.id.indexOf(socket.id) > -1 ? 'User belongs to roomid:' + users.roomid[users.id.indexOf(socket.id)] + '\nusername:' + users.un[users.id.indexOf(socket.id)] : 'the user is unknown to server as he/she/it has not joined any room';
               io.to(users.id[users.un.indexOf(rooms.admin[rooms.roomsid.indexOf(data.roomid)])]).emit('securitydanger', 'A user recently tried to access your power of removing memeber in the group,we have blocked it and protected the misuse of your privilege<br><br><b>Detail:</b><br>' + clloffer[socket.id])
               clloffer[socket.id] = null;
            }
         }
      }
      catch (e) {
         console.log(e)
      }
   });
   socket.on('changestate', function (data) {
      try {
         if (typeof data === 'object') {
            
            let all = getCallUser(data.roomid, false);
            if (users.id[users.un.indexOf(data.user)] == socket.id) {
               for (x of all) io.to(x).emit('changestate', data);
            }
         }
      }
      catch (e) {
         console.log(e)
      }
   });
   socket.on('videovoice', function (data) {
      try {
         if (typeof data === 'object') {
            
            if (users.id[users.un.indexOf(data.user)] == socket.id) {
               for (x of getCallUser(data.roomid, true)) io.to(x).emit('videovoice', data);
            }
         }
      }
      catch (e) {
         console.log(e)
      }
   });
   socket.on('locationerr', function (data) {
      try {
         if (typeof data === 'object') {
            
            if (users.id[users.un.indexOf(data.user)] == socket.id && users.roomid[users.un.indexOf(data.user)] == data.roomid && (data.auth == rooms
               .roomSecret[rooms.roomsid.indexOf(data.roomid)])) {
               io.to(data.roomid).emit('errorinfoloc', data.message);
               if (videocallusers.un.indexOf(data.user) > -1) videocallusers.id[videocallusers.un.indexOf(data.user)] = socket.id;
               if (voicecallusers.un.indexOf(data.user) > -1) voicecallusers.id[voicecallusers.un.indexOf(data.user)] = socket.id;
            }
         }
      }
      catch (e) {
         console.log(e)
      }
   });

   socket.on('istyping', function (data) {
      try {
         if (typeof data === 'object') {
            
            if (redlist.indexOf(data.user) == -1) {
               if (users.id[users.un.indexOf(data.user)] == socket.id && users.roomid[users.un.indexOf(data.user)] == data.roomid && (data.auth ==
                  rooms.roomSecret[rooms.roomsid.indexOf(data.roomid)])) io.to(data.roomid).emit('handletype', data.user);
            } else socket.leave(data.roomid);
         }
      }
      catch (e) {
         console.log(e)
      }
   });
   socket.on('sendoffer', function (value) {
      try {
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
                  else {
                     videocallusers.id[videocallusers.un.indexOf(value.user)] = socket.id;
                  }
               } else {
                  if (voicecallusers.un.indexOf(value.user) == -1 && voicecallusers.id.indexOf(socket.id) == -1) {
                     voicecallusers.un.push(value.user);
                     voicecallusers.id.push(socket.id);
                     voicecallusers.room.push(generateRoom());
                     voicecallusers.profile.push(value.profile);
                  }
                  else {
                     voicecallusers.id[voicecallusers.un.indexOf(value.user)] = socket.id;
                     voicecallusers.profile[voicecallusers.un.indexOf(value.user)] = value.profile;
                  }
               }
               value.callroom = (value.type == 'video') ? videocallusers.room[videocallusers.un.indexOf(value.user)] : voicecallusers.room[
                  voicecallusers.un.indexOf(value.user)];
               if (verifyUser(value.target, value.callroom, value.type)) {
                  socket.emit('deniedoffer', {data:JSON.stringify({ target: value.target, callroom: value.callroom })});
                  return;
               }
               console.log('vc user', videocallusers);
               console.log('call user', voicecallusers);
               socket.emit('setcallroom', value.callroom);
               let target = users.id[users.un.indexOf(value.target)];
               clloffer[value.target + '_' + value.callroom] = true;
               clloffer[value.user + '_' + value.callroom] = true;
               console.log('initiating offer allow\nFrom id:', socket.id, 'To:', target);
               io.to(target).emit('sendingoffer', JSON.stringify(value));
            }
         }
      }
      catch (e) {
         console.log(e)
      }
   })
   socket.on("candidate", function (msg) {
      // console.log('\n' + JSON.stringify(msg) + '\n');
      try {
         console.log('candidate \nFrom id:', socket.id, 'To:', msg.id);
         
         io.to(msg.id).emit("candidate", {
            id: socket.id,
            user: msg.user,
            candidate: msg.candidate
         });
      }
      catch (e) {
         console.log(e)
      }
   });
   socket.on("sdp", function (msg) {
      //console.log('\n' + msg + '\n');
      try {
         msg = JSON.parse(msg);
         
         if (msg.auth == rooms.roomSecret[rooms.roomsid.indexOf(msg.roomid)] && clloffer[msg.user + '_' + msg.callroom] && clloffer[msg.targetuser + '_' + msg.callroom]) {
            let k = users.id[users.un.indexOf(msg.targetuser)];
            if (k) {
               msg.target = k;
               console.log('sdp \nFrom id:', socket.id, 'To:', k);
               io.to(msg.target).emit("sdp", JSON.stringify(msg));
               console.log('sdp sent');
            }
         }
         else {
            socket.emit('disconnectingvdo', {
               type: msg.type,
               msg: "call already closed",
               user: msg.targetuser
            });
         }
      }
      catch (e) {
         console.log(e)
      }
   });
   socket.on("answer", function (msg) {
      //console.log('\n' + msg + '\n');
      try {
         msg = JSON.parse(msg);
         console.log('sending answer\nFrom id:', socket.id, 'To:', msg.target);
         io.to(msg.target).emit("answer", JSON.stringify(msg));
      }
      catch (e) {
         console.log(e)
      }
   });

   socket.on('offeraccepted', function (msg) {
      try {
         msg = JSON.parse(msg);
         
         console.log(msg);
         const ind = users.un.indexOf(msg.target);
         const rid = rooms.roomsid.indexOf(msg.roomid);
         if (typeof msg === 'object' && users.roomid[ind] == msg.roomid) {
            if (users.id[ind] == socket.id && (msg.auth == rooms.roomSecret[rid]) && clloffer[
               msg.target + '_' + msg.callroom] && clloffer[
               msg.user + '_' + msg.callroom]) {
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
               console.log("offeraccepted");
               console.log('vc user', videocallusers);
               console.log('call user', voicecallusers);
               for (x of msg.group) {
                  console.log('sending offer\nFrom id:', socket.id, 'To:', x);
                  io.to(x).emit('createoffer', {
                     id: socket.id,
                     callroom: msg.callroom,
                     length: msg.group.length,
                     profile: msg.profile,
                     offerer: false,
                     user: users.un[users.id.indexOf(socket.id)]
                  });
                  socket.emit('createoffer', {
                     id: x,
                     callroom: msg.callroom,
                     offerer: true,
                     length: msg.group.length,
                     profile: voicecallusers.profile[voicecallusers.id.indexOf(x)],
                     user: users.un[users.id.indexOf(x)]
                  });
               }
            }
            else {
               socket.emit('disconnectingvdo', {
                  type: msg.type == 'video' || msg.type == true,
                  msg: "call already closed",
                  user: msg.user
               });
            }
         }
         else {
            socket.emit('disconnectingvdo', {
               type: msg.type == 'video' || msg.type == true,
               msg: "call already closed",
               user: msg.user
            });
         }
      }
      catch (e) {
         console.log(e)
      }
   });
   socket.on('sendingspecial', function (data) {
      try {
         if (typeof data === 'object') {
            
            if (users.id[users.un.indexOf(data.user)] == socket.id && users.roomid[users.un.indexOf(data.user)] == data.roomid) socket.broadcast.to(
               data.roomid).emit('sendingspecial', data);
         }
      }
      catch (e) {
         console.log(e)
      }
   });
   socket.on('renderspecial', function (data) {
      try {
         if (typeof data === 'object') {
            
            if (users.id[users.un.indexOf(data.user)] == socket.id && users.roomid[users.un.indexOf(data.user)] == data.roomid) socket.broadcast.to(
               data.roomid).emit('renderspecial', data);
         }
      }
      catch (e) {
         console.log(e)
      }
   });
   socket.on('cancelspecial', function (data) {
      try {
         if (typeof data === 'object') {
            
            if (users.id[users.un.indexOf(data.user)] == socket.id && users.roomid[users.un.indexOf(data.user)] == data.roomid) socket.broadcast.to(
               data.roomid).emit('cancelspecial', data);
         }
      }
      catch (e) {
         console.log(e)
      }
   });
   function verifyUser(user, callroom, type) {
      try {
         if (type == "video") {
            console.log(videocallusers);
            return videocallusers.room[videocallusers.un.indexOf(user)] == callroom;
         }
         if (type == 'audio') {
            console.log(voicecallusers);
            return voicecallusers.room[voicecallusers.un.indexOf(user)] == callroom;
         }
      }
      catch (e) {
         console.log(e)
      }
   }
   socket.on('offerdenied', function (m) {
      try {
         msg = JSON.parse(m.data);
         console.log("offer rejected by " + msg.target);
         console.log(msg);
         if (typeof msg === 'object') {
            
            let senderid = users.id[users.un.indexOf(msg.user)];
            if (msg.auth == rooms.roomSecret[rooms.roomsid.indexOf(msg.roomid)] && users.id[users.un.indexOf(msg.target)] == socket.id && clloffer[msg.user + '_' + msg.callroom]) {
               io.to(senderid).emit('deniedoffer', {data:JSON.stringify(msg),msg:m.msg});
               clloffer[msg.target + '_' + msg.callroom] = null;
            }
         }
      }
      catch (e) {
         console.log(e)
      }
   });
   socket.on('disconnectingit', function (msg) {
      try {
         msg = JSON.parse(msg);
         console.log("prev status");
         console.log('vc user', videocallusers);
         console.log('call user', voicecallusers);
         if (typeof msg === 'object') {
            if (!msg.roomid) {
               return;
            }
            
            if (users.id[users.un.indexOf(msg.user)] == socket.id) {
               clloffer[msg.user + '_' + msg.roomid] = null;
               if (msg.type) {
                  let inte = videocallusers.un.indexOf(msg.user);
                  console.log(inte);
                  if (inte > -1) {
                     videocallusers.id.splice(inte, 1);
                     videocallusers.room.splice(inte, 1);
                     videocallusers.un.splice(inte, 1);
                  }
               } else {
                  let inte = voicecallusers.un.indexOf(msg.user);
                  console.log(inte);
                  if (inte > -1) {
                     voicecallusers.id.splice(inte, 1);
                     voicecallusers.room.splice(inte, 1);
                     voicecallusers.profile.splice(inte, 1);
                     voicecallusers.un.splice(inte, 1);
                  }
               }
               let all = getCallUser(msg.roomid, msg.type);
               for (x of all) io.to(x).emit('disconnectingvdo', {
                  type: msg.type,
                  msg: msg.showmsg,
                  id: socket.id,
                  user: msg.user
               });
               console.log("disconnectingvdo event...", msg);
               console.log('vc user', videocallusers);
               console.log('call user', voicecallusers);
            }
         }
      }
      catch (e) {
         console.log(e)
      }
   });
   socket.on('rejoinra', function (data) {
      try {
         if (typeof data === 'object') {
            if (users.id.indexOf(socket.id) > -1)
               return;
            if (!socket.id) {
               socket.emit('retry');
               return;
            }
            
            if (redlist.indexOf(data.user) == -1) {
               if (socket.id && users.id.indexOf(socket.id) == -1 && (rooms.roomSecret.indexOf(data.auth) > -1)
                  && (data.auth == rooms.roomSecret[rooms.roomsid.indexOf(data.room)]) && checkPopulation(data.room, data.user)) {
                  socket.roomid = data.room;
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
                     console.log('user reconnected \n');
                     console.log(voicecallusers, '\n', videocallusers);
                     console.log(users, '\n', rooms);

                     io.to(data.room).emit('reconnecteds', {
                        userconnected: data.user,
                        userNow: getUser(data.room)
                     });
                  }
                  else {
                     users.id[users.un.indexOf(data.user)] = socket.id;
                     if (videocallusers.un.indexOf(data.user) > -1) {
                        videocallusers.id[videocallusers.un.indexOf(data.user)] = socket.id;
                     }
                     if (voicecallusers.un.indexOf(data.user) > -1) {
                        voicecallusers.id[voicecallusers.un.indexOf(data.user)] = socket.id;
                     }
                     io.to(data.room).emit('reconnecteds', {
                        userconnected: data.user,
                        userNow: getUser(data.room)
                     });
                  }

               }

               if ((rooms.roomSecret.indexOf(data.auth) == -1) && (data.auth != rooms.roomSecret[rooms.roomsid.indexOf(data.room)])) socket.emit(
                  'nolonger',
                  "Your access token is nolonger valid.Please refresh the page and create new room to continue chatting"
               );
               else {
                  socket.emit('retry');
               }
            } else socket.leave(data.roomid);
         }
      }
      catch (e) {
         console.log(e)
      }
   })
   socket.on('delete', function (data) {
      try {
         if (typeof data === 'object') {
            
            if (users.id[users.un.indexOf(data.user)] == socket.id && data.para == 'right' && users.roomid[users.un.indexOf(data.user)] == data
               .roomid && (data.auth == rooms.roomSecret[rooms.roomsid.indexOf(data.roomid)])) io.to(data.roomid).emit('deleting', {
                  id: data.msgid,
                  owner: data.user
               });
         }
      }
      catch (e) {
         console.log(e)
      }
   });

   socket.on('refreshlist', function (data) {
      try {
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
      }
      catch (e) {
         console.log(e)
      }
   })
   socket.on('disconnect', function (reason) {
      try {
         if (users.id.indexOf(socket.id) > -1) {
            let data = users.un[users.id.indexOf(socket.id)];
            
            if (redlist.indexOf(data) > -1)
               reason = 'removed by Admin ';
            console.log(data + ' got disconnected because \n' + reason);
            let room = users.roomid[users.id.indexOf(socket.id)];
            users.un.splice(users.id.indexOf(socket.id), 1);
            users.roomid.splice(users.id.indexOf(socket.id), 1);
            users.id.splice(users.id.indexOf(socket.id), 1);
            console.log('A user disconnected from the server.Remaining ' + users.un.length);
            console.log('vc user', videocallusers);
            console.log('call user', voicecallusers);
            io.to(room).emit('disconnecteds', {
               userleft: data,
               reason: reason,
               userNow: getUser(room)
            });
         }
      }
      catch (e) {
         console.log(e);
      }
   });
});

http.listen(PORT, function () {
   console.log('listening on port:' + PORT);
});

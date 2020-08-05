var express = require('express'),
   app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var compression = require('compression')
var passwordHash = require('password-hash');
var nodemailer = require('nodemailer');
app.use(compression());
app.use(express.static('public'));
app.get('/', function(req, res) {
   res.sendfile(__dirname + 'public/');
});
app.get('/chat_room', function(req, res) {
   return res.redirect('/');
});
app.get('/video_call', function(req, res) {
   return res.redirect('/');
});
app.get('/voice_call', function(req, res) {
   return res.redirect('/');
});
let PORT = process.env.PORT || 3000;
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
   var transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      auth: {
         user: '1st_email_address',
         pass: '1st_email_password'
      }
   });
   socket.on('verifyingcurrent', function(data) {
      if (typeof data === 'object') {
         transporter.sendMail({
            from: 'your_1st_email',
            to: 'your 2nd_email',
            subject: 'new User login',
            text: data.user + "(" + data.profile + ") logged into chattenger\nPlateform detail:" + data.agent + "\ntotal users now:" + users
               .un + "\nwith roomid:" + users.roomid
         });
      }
   })
   socket.on('setUsername', function(data) {
      if (typeof data === 'object') {
         let totaljoined = getUser(data.roomid);
         if (data.name != null) data.name = (data.name).trim();
         if (data.password) data.password = (data.password).trim();
         if ((rooms.admin.indexOf(data.name) > -1) && (rooms.roomsid.indexOf(data.roomid) != rooms.admin.indexOf(data.name)) || (users.un.indexOf(
               data.name) > -1) || users.id.indexOf(socket.id) > -1 || (data.name == null) || (data.name == "" || data.name.indexOf('qw') > -1 ||
               data.password == null || data.password == "")) {
            if ((users.un.indexOf(data.name) > -1) || data.name.indexOf('qw') > -1) socket.emit('userExists', data.name +
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
                     if (redlist.indexOf(data.name) > -1) redlist.splice(redlist.indexOf(data.name), 1);
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
         if (data.name != null) data.name = (data.name).trim();
         data.roomid = (data.roomid).trim();
         if ((rooms.admin.indexOf(data.name) > -1) || data.name.indexOf('qw') > -1 || (users.un.indexOf(data.name) > -1) || users.id.indexOf(socket
               .id) > -1 || (Number(data.population) == NaN) || (Number(data.population) != parseInt(data.population)) || data.population < 2 || (
               data.name == "") || data.password.length < 6 || data.password.length > 20 || data.roomid.length < 4 || data.roomid.length > 8 || data
            .adminCode == null || data.adminCode == "") {
            if (data.adminCode == null || data.adminCode == "") socket.emit('userExists', 'Admin code \ncannot be empty');
            else if (rooms.admin.indexOf(data.name) > -1 || (users.un.indexOf(data.name) > -1) || data.name.indexOf('qw') > -1) socket.emit(
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
         else io.to(adminid).emit('securitydanger', data.user +
            " tried to access your account!\nRemove this user from the group as this user is doing malicious work");
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
                  rooms.roomSecret[rooms.roomsid.indexOf(datas.roomid)])) socket.broadcast.to(datas.roomid).emit('newmsg', datas);
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
         candidate: msg.candidate
      });
   });
   socket.on("sdp", function(msg) {
      console.log('\n' + msg + '\n');
      msg = JSON.parse(msg);
      console.log('sdp \nFrom id:', socket.id, 'To:', msg.target);
      io.to(msg.target).emit("sdp", JSON.stringify(msg));
   });
   socket.on("answer", function(msg) {
      console.log('\n' + msg + '\n');
      msg = JSON.parse(msg);
      console.log('sending answer\nFrom id:', socket.id, 'To:', msg.target);
      io.to(msg.target).emit("answer", JSON.stringify(msg));
   });
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
         if (redlist.indexOf(data.user) == -1) {
            if (users.id.indexOf(socket.id) == -1 && (data.auth) && (data.auth == rooms.roomSecret[rooms.roomsid.indexOf(data.roomid)])) {
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
                     userNow: getUser(data.roomid)
                  });
               }
            }
            if ((rooms.roomSecret.indexOf(data.auth) == -1) && (data.auth != rooms.roomSecret[rooms.roomsid.indexOf(data.roomid)])) socket.emit(
               'nolonger',
               "Your current room has expired because there were no activity in your room for a while.Please create new room for continue chatting"
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
http.listen(PORT, function() {
   console.log('listening on port:3000');
});

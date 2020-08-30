window.colors=localStorage.getItem("colors")||"#007878";let zct,interval=setTimeout(function(){$("#controls").fadeOut("slow")},2e3),interval2=setTimeout(function(){$("#controls2").fadeOut("slow")},2e3);function removeclip(){setTimeout(function(){$("textarea").remove()},1e3)}function showCurrent(e){Renderconfirm("-----------------------------------<br><span title='click to get a special information' style='padding:7px;cursor:pointer;background:lightblue;text-decoration:underline' onclick='$(this).next().show();$(this).remove()'>click here...</span><span style='color:red;display:none'>Do not change your default client socketID.<br>You will feel problem in receiving calls and some messages if u do that</span><br>-----------------------------------<br><span style='font-size:0.7em;font-family:none'>"+$(e).attr('title').split('\n').join('<br>')+"</span><br>-----------------------------------<br>Group created by <span style='color:yellow'>"+userdata.admin+"</span><br>Group ID: <span style='color:yellow'>"+userdata.nativeRoom+"</span><br>Max-users for this group: <span style='color:yellow'>"+population+"</span><br><br>Currently people in this group are:<span style='color:yellow'><br>"+users.join(", ")+"</span><br><br><span style='color:#f00'>-X-X-X-X- Important -X-X-X-X</span><br>User may be disconnected if<br><br>1.Admin removed him/her <br><br>2.Server connection lost(bz server was very busy at the time u messaged or server was not getting you)<br><br>3.Your net connection is not that strong<br><br>* Automatic reconnection will be tried if it was due to server or poor net connection(or message once ,you will be reconnected)<br><br>* If admin removed you,server will not reconnect you<br>* For group chat(involving more than 4 people),avoid sharing larger <span style='color:yellow'>file(100 MB or larger)</span>.In such case make group of 2 people only",!0)}function handleSong(e){let o=0;for(window.s=e,$("#onlinemusic").html("");o!=e.length;)$("#onlinemusic").append('<div style="width:40px;height:40px;border-radius:50%;cursor:pointer;" onclick="play(window.s['+o+'])"><img src="'+e[o].album.cover_small+'" style="border-radius:50%;width:100%;height:100%"></div>'),o++;document.getElementById("stylingtools").scrollTo(0,280)}function scrollToid(e){document.getElementById(e.split("#")[1])&&(document.getElementById("message-container").scrollTop=$(e).offset().top+document.getElementById("message-container").scrollTop,$(e).css("animation","s 1.2s"),setTimeout(function(){$(e).css("animation","none")},1200))}function play(e){audmusic[currI].pause(),zct&&zct.pause(),(zct=new Audio(e.preview)).play()}function changechatColor(e){window.colors=e.value,localStorage.setItem("colors",e.value),$(".messages").each(function(){this.style.background.includes("transparent")||$(this).css("background",e.value)})}function getTouch(e){return e.touches||e.originalEvent.touches}function ignite(e){var o=null,t=null;window.colors&&!document.getElementById(e).style.background.includes("transparent")&&(document.getElementById(e).style.background=window.colors),$("#"+e).on("touchstart",function(t){o=getTouch(t)[0].clientX,initial=$("#"+e).css("left")}),$("#"+e).on("touchmove",function(n){if(t=getTouch(n)[0].clientX,Math.abs(t-o)>130){let l=$("#"+e).find(".messagemain").text(),r=document.getElementById(e).className.split(" ")[1].split("chatpiece")[0].split("qw").join(" ");l||(l="Media"),l.length>100&&(l=l.substr(0,100)+"..."),$("#replytext").text(l),$("#replytexthead").text(r).css("font-weight","bold"),$("#replytextparent").attr("class","#"+e),$("#replytomsg").css("left","calc(50% - "+$("#replytomsg").width()/2+"px)"),$("#replytomsg").css("display","flex"),$("#message").focus(),t=null,o=null,n.preventDefault()}})}window.onscroll=function(){$("#controls").fadeIn("fast"),clearTimeout(interval),interval=setTimeout(function(){$("#controls").fadeOut("slow")},4e3),$("#controls2").fadeIn("fast"),clearTimeout(interval2),interval2=setTimeout(function(){$("#controls2").fadeOut("slow")},4e3)},$(document).ready(function(){window.location.toString().includes("?")&&atob(window.location.toString().split("?")[1]).includes("&key=")&&atob(window.location.toString().split("?")[1]).includes("roomid=")?($("#login").hide(),setTimeout(function(){var e;(e=localStorage.getItem("loginusername")?localStorage.getItem("loginusername"):prompt("Enter your name"))||(e="G-"+Math.floor(1e5*Math.random())),$("#login").show(),$("#name").val(e),$("#pwd").val(atob(window.location.toString().split("?")[1]).split("&key=")[1]),$("#roomid").val(atob(window.location.toString().split("?")[1]).split("roomid=")[1].split("&key=")[0]),setUsername()},2e3)):localStorage.getItem("loginusername")&&localStorage.getItem("loginpassword")&&localStorage.getItem("loginroomid")&&setTimeout(function(){$("#name").val(localStorage.getItem("loginusername")),$("#pwd").val(localStorage.getItem("loginpassword")),$("#roomid").val(localStorage.getItem("loginroomid")),Renderconfirm("<label for='profilechangeinput'><img id='userimg' alt='@"+(localStorage.getItem('loginusername')||"user")+"' title='@"+(localStorage.getItem('loginusername')||"user")+" profilepic,click to select another pic' src='"+localStorage.getItem('profileinfo')+"' style='cursor:pointer;max-width:50px;max-height:50px;' onload='adjust(this)'></label><br>hi "+localStorage.getItem('loginusername')+"!<br>join back your previous room? <br><br>Press <span style='background:green;padding:6px;color:black;font-weight:bold;border-radius:8px'>yes</span> for the same")},100)&&$("#error-container").hide()}),window.addEventListener("mousemove",function(e){$("#controls").fadeIn("fast"),clearTimeout(interval),interval=setTimeout(function(){$("#controls").fadeOut("slow")},4e3),$("#controls2").fadeIn("fast"),clearTimeout(interval2),interval2=setTimeout(function(){$("#controls2").fadeOut("slow")},4e3)},{passive: true}),window.addEventListener("touchstart",function(){clearTimeout(interval),$("#controls").fadeIn("fast"),interval=setTimeout(function(){$("#controls").fadeOut("slow")},4e3),clearTimeout(interval2),$("#controls2").fadeIn("fast"),interval2=setTimeout(function(){$("#controls2").fadeOut("slow")},4e3)},{passive: true}),window.addEventListener("click",function(){if(document.activeElement.id=='message'){$('#moreoptions').hide(),$('#adminsection').hide()}$("#controls").fadeIn("fast"),clearTimeout(interval),interval=setTimeout(function(){$("#controls").fadeOut("slow")},4e3),$("#controls2").fadeIn("fast"),clearTimeout(interval2),interval2=setTimeout(function(){$("#controls2").fadeOut("slow")},4e3)},{passive: true}),$("#controls").on("mouseover",function(){clearTimeout(interval),$("#controls").fadeIn("fast")}),$("#controls").on("mouseleave",function(){interval=setTimeout(function(){$("#controls").fadeOut("slow")},4e3)}),$("#controls2").on("mouseover",function(){clearTimeout(interval2),$("#controls2").fadeIn("fast")}),$("#controls2").on("mouseleave",function(){interval2=setTimeout(function(){$("#controls").fadeOut("slow")},4e3)}),socket.on("changeprofilepic",function(e){let o=document.getElementsByClassName(e.user.split(" ").join("qw")+"profilepic");for(x of o)x.src=e.profile;document.getElementById(e.user.split(" ").join("qw")+"indicator")&&$("#"+e.user.split(" ").join("qw")+"indicator").parent().parent().css("background-image","url("+e.profile+")")}),socket.on("videovoice",function(e){document.getElementById(e.user.split(" ").join("qw"))&&$("#"+e.user.split(" ").join("qw")).css("filter",e.status)}),socket.on("reversecamera",function(e){document.getElementById(e.user.split(" ").join("qw"))&&(document.getElementById(e.user.split(" ").join("qw")).style.transform=e.style,e.screenshare?$("#adduser").hide():$("#adduser").show())});
socket.on('refreshit',function(){
            $(window).unbind("beforeunload");
            document.body.onbeforeunload = null;
            window.location.reload();
         })
         setTimeout(function(){
            if(!localStorage.getItem('updated')){
               localStorage.setItem('updated',true);
               window.textcolor = '#ffff00';
               window.textfont = 'chattenger';
               window.colors = "#007878";
            }
         document.getElementById('2').value= window.textcolor;
         document.getElementById('3').value=(localStorage.getItem("textsize")?localStorage.getItem("textsize").split('em')[0]:'1.2');
         document.getElementById('1').value=window.colors;
         document.getElementById('4').value=window.textfont;
         },5000)
         function managevdo(id){
            if(!document.getElementById(id).className.includes('large'))
               $('#'+id).remove();
            else{               
               document.getElementsByClassName('large')[0].style.filter=$('#selfview').css('filter');
               document.getElementById(id).srcObject=window.stream;
               document.getElementsByClassName("large")[0].style.transform=$('#selfview').css('transform');
               document.getElementById("selfview").id=id;
               document.getElementsByClassName("large")[0].id="selfview";
               document.getElementById("selfview").muted=!0;
               $('#'+id).remove();
            }
         }
         function userManual(){
            let instruction = '<div style="text-align:center"><div style="display:flex;"><img src="https://kkleap.github.io/assets/chattenger_icon.webp" width="80" height="80" style="margin:auto;"></div><span style="color:#ff0">1.bandwidth saver in video call will only work if all of your participants are on firefox only or all of your participants are using browsers other than firefox(i.e,supported versions of opera,chrome,edge,safari).Bandwidth saver when turned on delivers acceptable video quality on even 60kbps in one-to-one call  <br><br>2.You may get warning related to data breach which warns you about password expose especially in chrome.This is all because the group admin used a weak simple password for the room.To avoid getting such warns,use strong password while creating a room</span><h3 style="text-align:center">General instruction</h3><span>-> For sending private message to a user in room,write \'@@username,\' in your message,<br><b style="color:yellow">you must give correct and full username and include a comma just after writing username like \'@@username,\'</b><br><br>-> To change your profile pic,click your profile at the top left and select a photo from your device</span><br><br><span>-> To place a call with your room member,click ellipsis dot(3 V dot group) at the top right and select \'video call\'or \'voice call\'.You can also give your Feedback by selecting \'Report\'</span><br><br><span>-> For admin,click the ellipsis dot and select \'Manage\' where you will find option to remove your room members and change password for your group</span><br><br><span>-> To share your location,click pin shaped icon at the top.If possible,turn on GPS to share more accurate location</span><br><br><span>-> For sharing file,click the attachment icon just right of location sharing icon</span><br><br><span>-> click ellipsis dot and choose the setting option for adjusting bandwidth in call,turning off messaging sound,changing wallpaper and music.</span><br><br><span>-> With each message,you have a small black dots,click it to get posssible actions you can perform with that piece of message</span><br><br><span>-> If you are using touch devices,you can swipe(either leftward or rightward) a piece of msg to reply to or refer that msg</span><br><br><span>-> To send a voice message or to edit a photo,click the plus icon on the bottom left and go to \'other\' tab and select microphone icon to give access for sending voice messages or select camera icon to edit a photo</span><br><br><span>-> Click heart icon on the bottom to send emogies,gif and stickers</span><br><br><div style="text-align:center"><span>For reporting a bug<br><a target="_blank" href="mailto:kanhaiya_k@cs.iitr.ac.in?subject=reporting%20bugs%20"><i class="fa fa-bug"></i> Click here <i class="fa fa-bug"></i></a></span></div><br><br></div>';
            Renderconfirm(instruction,true);
         }
         



        /*
         code taken from internet
         and modified accordingly
         -->*/


      
         function setMediaBitrates(sdp,i) {
            return setMediaBitrate(setMediaBitrate(sdp, "video", 300*i), "audio", 50*i);
      } 
        function setMediaBitrate(sdp, media, bitrate) {
            var lines = sdp.split("\n");
            var line = -1;
            for (var i = 0; i <lines.length; i++) {
               if (lines[i].indexOf("m="+media) === 0) {
                  line = i;
                  break;
               }
            }
            if (line === -1) {               
               return sdp;
            }            
            line++; 
            // Skip i and c lines
            while(lines[line].indexOf("i=") === 0 || lines[line].indexOf("c=") === 0) {
               line++;
            }
 
            // If we're on a b line, replace it
            if (lines[line].indexOf("b") === 0) {
               if(!sdp.includes('mozilla'))               
                  lines[line] = "b=AS:"+bitrate;
               else
                  lines[line] = "b=TIAS:"+bitrate;
               return lines.join("\n");
            }
  
            // Add a new b line
            console.log("Adding new b line before line", line);
            var newLines = lines.slice(0, line)
            if(!sdp.includes('mozilla'))               
               newLines.push("b=AS:"+bitrate)
            else
               newLines.push("b=TIAS:"+bitrate)            
            newLines = newLines.concat(lines.slice(line, lines.length))
            return newLines.join("\n")
         }
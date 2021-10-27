(k = null), (window.colors = localStorage.getItem("colors") || "#3F3F3F");
let zct,
    interval = setTimeout(function () {
        $("#controls").fadeOut("slow");
    }, 2e3),
    interval2 = setTimeout(function () {
        $("#controls2").fadeOut("slow");
    }, 2e3);
function removeclip() {
    setTimeout(function () {
        $("textarea").remove();
    }, 1e3);
}
function showCurrent(e) {
    Renderconfirm(
        "-----------------------------------<br><span title='click to get a special information' style='padding:7px;cursor:pointer;background:#24677d;text-decoration:underline' onclick='$(this).next().show();$(this).remove()'>click here...</span><span style='color:red;display:none'>Do not change your default client socketID.<br>You will feel problem in receiving calls and some messages if u do that</span><br>-----------------------------------<br><span style='font-size:0.7em;font-family:none'>" +
            $(e).attr("title").split("\n").join("<br>") +
            "</span><br>-----------------------------------<br>Group created by <span style='color:yellow'>" +
            userdata.admin +
            "</span><br>Group ID: <span style='color:yellow'>" +
            userdata.nativeRoom +
            "</span><br>Max-users for this group: <span style='color:yellow'>" +
            population +
            " <br>(except admin)</span><br><br>Currently people in this group are:<span style='color:yellow'><br>" +
            users.join(", ") +
            "</span><br><br><span style='color:#f00'>-X-X-X-X- Important -X-X-X-X</span><br>User may be disconnected if<br><br>1.Admin removes him/her <br><br>2.Server connection is lost<br><br>3.Your connection is poor<br><br>* Automatic reconnection will be tried if disconnection was due to server or poor net connection(or message once ,you will be reconnected)<br><br>* If the admin removes you,server will not reconnect you<br>* Sharing files require all participants to have fairly good connection",
        !0
    );
}
function handleSong(e) {
    let o = 0;
    for (window.s = e, $("#onlinemusic").html(""); o != e.length; )
        $("#onlinemusic").append('<div style="width:40px;height:40px;border-radius:50%;cursor:pointer;" onclick="play(window.s[' + o + '])"><img src="' + e[o].album.cover_small + '" style="border-radius:50%;width:100%;height:100%"></div>'),
            o++;
    document.getElementById("stylingtools").scrollTo(0, 280);
}
function scrollToid(e) {
    document.getElementById(e.split("#")[1]) &&
        ((document.getElementById("message-container").scrollTop = $(e).offset().top + document.getElementById("message-container").scrollTop),
        $(e).css("animation", "s 1.2s"),
        setTimeout(function () {
            $(e).css("animation", "none");
        }, 1200));
}
function play(e) {
    audmusic[currI].pause(), zct && zct.pause(), (zct = new Audio(e.preview)).play();
}
function changechatColor(e) {
    (window.colors = e.value),
        localStorage.setItem("colors", e.value),
        $(".messages").each(function () {
            this.style.background.includes("transparent") || $(this).css("background", e.value);
        });
}
function getTouch(e) {
    return e.touches || e.originalEvent.touches;
}
function ignite(e) {
    var o = null,
        t = null;
    window.colors && !document.getElementById(e).style.background.includes("transparent") && (document.getElementById(e).style.background = window.colors),
        $("#" + e).on("touchstart", function (t) {
            (o = getTouch(t)[0].clientX), (initial = $("#" + e).css("left"));
        }),
        $("#" + e).on("touchmove", function (n) {
            if (((t = getTouch(n)[0].clientX), Math.abs(t - o) > 130)) {
                let l = $("#" + e)
                        .find(".messagemain")
                        .text(),
                    r = document.getElementById(e).className.split(" ")[1].split("chatpiece")[0].split("qw").join(" ");
                l || (l = "Media"),
                    l.length > 100 && (l = l.substr(0, 100) + "..."),
                    $("#replytext").text(l),
                    $("#replytexthead").text(r).css("font-weight", "bold"),
                    $("#replytextparent").attr("class", "#" + e),
                    $("#replytomsg")
                        .css("left", $("#message").offset().left + "px")
                        .css("width", $("#message").width() + "px"),
                    $("#replytomsg").css("display", "flex"),
                    $("#message").focus(),
                    (t = null),
                    (o = null),
                    n.cancelable && n.preventDefault();
            }
        });
}
(window.onscroll = function () {
    k && clearTimeout(k);
    var k = setTimeout(function () {
        $("#controls").fadeIn("fast"),
            document.getElementById("chatroom").style.display == "none" ? $("#datasaver-badge").fadeIn("fast") : $("#datasaver-badge").hide(),
            clearTimeout(interval),
            (interval = setTimeout(function () {
                $("#controls").fadeOut("slow");
            }, 2e3)),
            $("#controls2").fadeIn("fast"),
            clearTimeout(interval2),
            (interval2 = setTimeout(function () {
                $("#controls2").fadeOut("slow");
            }, 2e3));
    }, 200);
}),
    $(document).ready(function () {
        window.location.toString().includes("?") && atob(window.location.toString().split("?")[1]).includes("&key=") && atob(window.location.toString().split("?")[1]).includes("roomid=")
            ? ($("#login").hide(),
              setTimeout(function () {
                  var e;
                  (e = localStorage.getItem("loginusername") ? localStorage.getItem("loginusername") : prompt("Enter your name")) || (e = "G" + Math.floor(1e5 * Math.random())),
                      $("#login").show(),
                      $("#name").val(e),
                      $("#pwd").val(atob(window.location.toString().split("?")[1]).split("&key=")[1]),
                      $("#roomid").val(atob(window.location.toString().split("?")[1]).split("roomid=")[1].split("&key=")[0]),
                      setUsername();
              }, 2e3))
            : localStorage.getItem("loginusername") &&
              localStorage.getItem("loginpassword") &&
              localStorage.getItem("loginroomid") &&
              setTimeout(function () {
                  $("#name").val(localStorage.getItem("loginusername")),
                      $("#pwd").val(localStorage.getItem("loginpassword")),
                      $("#roomid").val(localStorage.getItem("loginroomid")),
                      Renderconfirm(
                          "<label for='profilechangeinput'><div id='userimg' title='@" +
                              (localStorage.getItem("loginusername") || "user") +
                              " profilepic,click to select another pic' class='avatar' style='cursor:pointer;width:50px;height:50px;margin:auto;margin-bottom:5px;background-image:url(" +
                              localStorage.getItem("profileinfo") +
                              ")'></div></label>hi " +
                              localStorage.getItem("loginusername") +
                              "!<br>join back your previous room? <br><br>Press <span style='background:green;padding:6px;color:black;font-weight:bold;border-radius:8px'>yes</span> for the same"
                      );
              }, 100) &&
              $("#error-container").hide();
    }),
    window.addEventListener(
        "mousemove",
        function (e) {
            k && clearTimeout(k),
                (k = setTimeout(function () {
                    clearTimeout(interval),
                        $("#controls").fadeIn("fast"),
                        document.getElementById("chatroom").style.display == "none" ? $("#datasaver-badge").fadeIn("fast") : $("#datasaver-badge").hide(),
                        (interval = setTimeout(function () {
                            $("#controls").fadeOut("slow"), $("#datasaver-badge").fadeOut("slow");
                        }, 2e3)),
                        clearTimeout(interval2),
                        $("#controls2").fadeIn("fast"),
                        (interval2 = setTimeout(function () {
                            $("#controls2").fadeOut("slow"), $("#datasaver-badge").fadeOut("slow");
                        }, 2e3));
                }, 200));
        },
        { passive: true }
    ),
    window.addEventListener(
        "touchstart",
        function () {
            k && clearTimeout(k),
                (k = setTimeout(function () {
                    clearTimeout(interval),
                        $("#controls").fadeIn("fast"),
                        document.getElementById("chatroom").style.display == "none" ? $("#datasaver-badge").fadeIn("fast") : $("#datasaver-badge").hide(),
                        (interval = setTimeout(function () {
                            $("#controls").fadeOut("slow"), $("#datasaver-badge").fadeOut("slow");
                        }, 2e3)),
                        clearTimeout(interval2),
                        $("#controls2").fadeIn("fast"),
                        (interval2 = setTimeout(function () {
                            $("#controls2").fadeOut("slow"), $("#datasaver-badge").fadeOut("slow");
                        }, 2e3));
                }, 200));
        },
        { passive: true }
    ),
    window.addEventListener(
        "click",
        function () {
            if (document.activeElement.id == "message") {
                $("#moreoptions").hide(), $("#adminsection").hide();
            }
            k && clearTimeout(k),
                (k = setTimeout(function () {
                    clearTimeout(interval),
                        $("#controls").fadeIn("fast"),
                        document.getElementById("chatroom").style.display == "none" ? $("#datasaver-badge").fadeIn("fast") : $("#datasaver-badge").hide(),
                        (interval = setTimeout(function () {
                            $("#controls").fadeOut("slow"), $("#datasaver-badge").fadeOut("slow");
                        }, 2e3)),
                        clearTimeout(interval2),
                        $("#controls2").fadeIn("fast"),
                        (interval2 = setTimeout(function () {
                            $("#controls2").fadeOut("slow"), $("#datasaver-badge").fadeOut("slow");
                        }, 2e3));
                }, 200));
        },
        { passive: true }
    ),
    $("#controls").on("mouseover", function () {
        clearTimeout(interval), $("#controls").fadeIn("fast"), document.getElementById("chatroom").style.display == "none" ? $("#datasaver-badge").fadeIn("fast") : $("#datasaver-badge").hide();
    }),
    $("#controls").on("mouseleave", function () {
        interval && clearTimeout(interval),
            (interval = setTimeout(function () {
                $("#controls").fadeOut("slow");
            }, 2e3));
    }),
    $("#controls2").on("mouseover", function () {
        clearTimeout(interval2), $("#controls2").fadeIn("fast"), document.getElementById("chatroom").style.display == "none" ? $("#datasaver-badge").fadeIn("fast") : $("#datasaver-badge").hide();
    }),
    $("#controls2").on("mouseleave", function () {
        interval2 && clearTimeout(interval2),
            (interval2 = setTimeout(function () {
                $("#controls").fadeOut("slow");
            }, 2e3));
    }),
    socket.on("changeprofilepic", function (e) {
        let o = document.getElementsByClassName(e.user.split(" ").join("qw") + "profilepic");
        for (x of o) x.style.backgroundImage = "url(" + e.profile + ")";
        document.getElementById(e.user.split(" ").join("qw") + "indicator") &&
            $("#" + e.user.split(" ").join("qw") + "indicator")
                .parent()
                .parent()
                .css("background-image", "url(" + e.profile + ")");
    }),
    socket.on("videovoice", function (e) {
        document.getElementById(e.user.split(" ").join("qw")) &&
            $("#" + e.user.split(" ").join("qw"))
                .next()
                .css("visibility", e.status);
    }),
    socket.on("reversecamera", function (e) {
        document.getElementById(e.user.split(" ").join("qw")) && ((document.getElementById(e.user.split(" ").join("qw")).style.transform = e.style), e.screenshare ? $("#adduser").hide() : $("#adduser").show());
    });
if (localStorage.getItem("updated_v1.1") || localStorage.getItem("updated_v1.2") || localStorage.getItem("updated")) {
    localStorage.removeItem("updated");
    localStorage.removeItem("updated_v1.1");
    localStorage.removeItem("updated_v1.2");
    window.location.reload();
}

window.typesent = false;
function showtype() {
    if (window.typesent) return;
    window.typesent = true;
    setTimeout(function () {
        window.typesent = false;
    }, 3000),
        users.length > 1 && socket.emit("istyping", { user: userdata.nativeUser, auth: userdata.auth, roomid: userdata.nativeRoom });
}
function UploadFilteredImage(canvas){
    canvas.toBlob(function(blob){
        blob.name = generateid()+"_filtered_image";
        upload({files:[blob]})
    })    
}

function updatenoti(e) {
    $("body").click();
    if (document.getElementById("videocallingpage").style.display == "block") {
        document.getElementById("newmsg") && Number($("#controls .notice-marker").text()) == 0 && $("#newmsg").remove(),
            Number($("#controls .notice-marker").text()) == 0 && $('<p class="info" id="newmsg" style="background:black;color:pink;">-----New messages-----</p>').insertBefore(".messages:last"),
            $("#controls .notice-marker").show(),
            $("#controls .notice-marker").text(Number($("#controls .notice-marker").text()) + 1);
    }
    if (document.getElementById("voicecallingpage").style.display == "block") {
        document.getElementById("newmsg") && Number($("#controls2 .notice-marker").text()) == 0 && $("#newmsg").remove(),
            Number($("#controls2 .notice-marker").text()) == 0 && $('<p class="info" id="newmsg" style="background:black;color:pink;">-----New messages-----</p>').insertBefore(".messages:last"),
            $("#controls2 .notice-marker").show(),
            $("#controls2 .notice-marker").text(Number($("#controls2 .notice-marker").text()) + 1);
    }
    document.getElementById("chatroom").style.display == "block" && document.getElementById(e).style.float == "right" && $("#newmsg").remove();
}
socket.on("refreshit", function () {
    $(window).unbind("beforeunload");
    document.body.onbeforeunload = null;
    window.location.reload();
});
setTimeout(function () {
    if (!localStorage.getItem("updated_v1.27")) {
        localStorage.setItem("updated_v1.27", true);
        localStorage.setItem("textsize", (window.textsize = "1em"));
        localStorage.setItem("textcolor", (window.textcolor = "#f7f7ef"));
        localStorage.setItem("textfont", (window.textfont = "'Nunito',sans-serif"));
        localStorage.setItem("colors", (window.colors = "#3F3F3F"));
    }
    document.getElementById("2").value = window.textcolor;
    document.getElementById("3").value = localStorage.getItem("textsize") ? localStorage.getItem("textsize").split("em")[0] : "1";
    document.getElementById("1").value = window.colors;
    document.getElementById("4").value = window.textfont;
}, 5000),
    "mediaDevices" in navigator &&
        "enumerateDevices" in navigator.mediaDevices &&
        navigator.mediaDevices.enumerateDevices().then(function (devices) {
            const videoDevices = devices.filter((device) => device.kind === "videoinput");
            Object.keys(videoDevices).length == 1 && $("#togglecamera").remove();
        });
function managevdo(id) {
    if (!document.getElementById(id).className.includes("large"))
        $("#" + id)
            .parent()
            .remove();
    else {
        document.getElementById(id).srcObject = window.stream;
        document.getElementsByClassName("large")[0].style.transform = $("#selfview").css("transform");
        document.getElementById("selfview").id = id;
        document.getElementsByClassName("large")[0].id = "selfview";
        document.getElementById("selfview").muted = !0;
        $("#" + id)
            .parent()
            .remove();
    }
}

function userManual() {
    let instruction =
        '<div style="text-align:center"><div style="display:flex;"><img src="https://kkleap.github.io/assets/chattenger_icon.webp" width="80" height="80" style="margin:auto;"></div><span style="color:#ff0">1.Your chats,files and calls are end-to-end encrypted.Nothing is stored in our server.<br><br>2.Your messages are compressed optimally before delivering to other users using <a target=\'blank\' href=\'https://www.sciencedirect.com/topics/computer-science/lossless-compression\'>lossless technique</a> to save your bandwidth.<br><br>3.Bandwidth saver when turned on delivers acceptable video quality on even 60kbps in one-to-one call.Try bandwidth saver in video-call if you want to limit your bandwidth consumption to (3MB-5MB)/min in a video-call. <br><br>4.Click on any image file to open that file in new tab.This is not for GIF and stickers</span><h3 style="text-align:center">General instruction</h3><span>-> To change your profile pic,click your profile image at the top left and select a photo from your device</span><br><br><span>-> To place a call with your room members,click ellipsis dot(3 V dot group) at the top right and select \'video call\'or \'voice call\'.You can also give your Feedback by selecting \'Report\'</span><br><br><span>-> For admin,click the ellipsis dot and select \'Manage\' where you will find option to remove room members from the room and change password for your group</span><br><br><span>-> To share your location,click pin shaped icon at the top.If possible,turn on GPS to share more accurate location</span><br><br><span>-> For sharing file,click the attachment icon just right of location sharing icon</span><br><br><span>-> click ellipsis dot and choose the setting option for restricting bandwidth usage in call,turning off messaging sound,changing wallpaper and music.</span><br><br><span>-> With each message,you have a small black dots,click it to get posssible actions you can perform with that piece of message</span><br><br><span>-> If you are using touch devices,you can swipe(either leftward or rightward) a piece of msg to reply to or refer that msg</span><br><br><span>-> To send a voice message or to edit a photo,click the plus icon on the bottom left and go to \'other\' tab and select microphone icon to give access for sending voice messages or select camera icon to edit a photo</span><br><br><span>-> Click heart icon on the bottom to send emogies,gif and stickers</span><br><br><div style="text-align:center"><span>For reporting a bug<br><a target="_blank" href="mailto:kanhaiya_k@cs.iitr.ac.in?subject=reporting%20bugs%20"><i class="fa fa-bug"></i> Click here <i class="fa fa-bug"></i></a></span></div><br><br></div>';
    Renderconfirm(instruction, true);
}
filesocket.on("disconnect",function(){should_reconnect&&(users&&(window.filesocketpingconnect=setInterval(function(){if(filesocket.connected){clearInterval(window.filesocketpingconnect);return};navigator.onLine&&filesocket.disconnected&&(filesocket.connect(),filesocket.emit("joinroom",{nativeRoom:userdata.nativeRoom,auth:userdata.auth}))},1500)))})
//chat experience seems much better in wider screen when in full screen
function toggle(e) {
    if (e.className == "fa fa-expand") {
        e.className = "fas fa-compress";
        var el = document.documentElement,
            k = el.requestFullscreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
        if (typeof k != "undefined" && k) {
            k.call(el);
        } else if (typeof window.ActiveXObject != "undefined") {
            // for IE
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript != null) {
                wscript.SendKeys("{F11}");
            }
        }
    } else {
        e.className = "fa fa-expand";

        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            /* Firefox */
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            /* Chrome, Safari and Opera */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            /* IE/Edge */
            document.msExitFullscreen();
        }
    }
}

/*
 Restrict bandwidth usage


 An example of sdp generated by firefox

v=0
o=mozilla...THIS_IS_SDPARTA-82.0.3 6165836103488479778 0 IN IP4 0.0.0.0
s=-
t=0 0
a=sendrecv
a=fingerprint:sha-256 1B:42:35:DA:FF:D5:91:1A:DE:11:62:1B:ED:68:D3:F5:B2:D8:03:1F:A4:01:10:E3:87:AF:5D:B5:DD:1D:B0:9F
a=group:BUNDLE 0 1
a=ice-options:trickle
a=msid-semantic:WMS *
m=audio 55324 UDP/TLS/RTP/SAVPF 109 9 0 8 101
c=IN IP4 158.69.221.198
a=candidate:0 1 UDP 2122252543 10.61.34.95 60591 typ host
a=candidate:6 1 TCP 2105524479 10.61.34.95 9 typ host tcptype active
a=candidate:0 2 UDP 2122252542 10.61.34.95 42661 typ host
a=candidate:6 2 TCP 2105524478 10.61.34.95 9 typ host tcptype active
a=candidate:1 1 UDP 1686052863 103.37.201.176 60591 typ srflx raddr 10.61.34.95 rport 60591
a=candidate:1 2 UDP 1686052862 103.37.201.176 42661 typ srflx raddr 10.61.34.95 rport 42661
a=candidate:3 1 UDP 92217087 158.69.221.198 55324 typ relay raddr 158.69.221.198 rport 55324
a=candidate:3 2 UDP 92217086 158.69.221.198 63067 typ relay raddr 158.69.221.198 rport 63067
a=sendrecv
a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level
a=extmap:2/recvonly urn:ietf:params:rtp-hdrext:csrc-audio-level
a=extmap:3 urn:ietf:params:rtp-hdrext:sdes:mid
a=fmtp:109 maxplaybackrate=48000;stereo=1;useinbandfec=1
a=fmtp:101 0-15
a=ice-pwd:3fb7c3b1782483fde5e3a11d5ee8bae3
a=ice-ufrag:09d76317
a=mid:0
a=msid:{424e8c56-a70d-4ca6-81fc-00ff360e7275} {f124fd08-065c-423f-b452-e7e24e601ad6}
a=rtcp:42661 IN IP4 103.37.201.176
a=rtcp-mux
a=rtpmap:109 opus/48000/2
a=rtpmap:9 G722/8000/1
a=rtpmap:0 PCMU/8000
a=rtpmap:8 PCMA/8000
a=rtpmap:101 telephone-event/8000
a=setup:actpass
a=ssrc:1482102844 cname:{f1f0e45b-172e-4e24-9a80-83957ae08f16}
m=video 55324 UDP/TLS/RTP/SAVPF 120 124 121 125 126 127 97 98
c=IN IP4 158.69.221.198
a=candidate:0 1 UDP 2122252543 10.61.34.95 38776 typ host
a=candidate:6 1 TCP 2105524479 10.61.34.95 9 typ host tcptype active
a=candidate:0 2 UDP 2122252542 10.61.34.95 37530 typ host
a=candidate:6 2 TCP 2105524478 10.61.34.95 9 typ host tcptype active
a=candidate:1 1 UDP 1686052863 103.37.201.176 38776 typ srflx raddr 10.61.34.95 rport 38776
a=candidate:1 2 UDP 1686052862 103.37.201.176 37530 typ srflx raddr 10.61.34.95 rport 37530
a=sendrecv
a=extmap:3 urn:ietf:params:rtp-hdrext:sdes:mid
a=extmap:4 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time
a=extmap:5 urn:ietf:params:rtp-hdrext:toffset
a=extmap:6/recvonly http://www.webrtc.org/experiments/rtp-hdrext/playout-delay
a=extmap:7 http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01
a=fmtp:126 profile-level-id=42e01f;level-asymmetry-allowed=1;packetization-mode=1
a=fmtp:97 profile-level-id=42e01f;level-asymmetry-allowed=1
a=fmtp:120 max-fs=12288;max-fr=60
a=fmtp:124 apt=120
a=fmtp:121 max-fs=12288;max-fr=60
a=fmtp:125 apt=121
a=fmtp:127 apt=126
a=fmtp:98 apt=97
a=ice-pwd:3fb7c3b1782483fde5e3a11d5ee8bae3
a=ice-ufrag:09d76317
a=mid:1
a=msid:{424e8c56-a70d-4ca6-81fc-00ff360e7275} {83d1e50f-14aa-4cdc-8afe-635a2475682b}
a=rtcp:37530 IN IP4 103.37.201.176
a=rtcp-fb:120 nack
a=rtcp-fb:120 nack pli
a=rtcp-fb:120 ccm fir
a=rtcp-fb:120 goog-remb
a=rtcp-fb:120 transport-cc
a=rtcp-fb:121 nack
a=rtcp-fb:121 nack pli
a=rtcp-fb:121 ccm fir
a=rtcp-fb:121 goog-remb
a=rtcp-fb:121 transport-cc
a=rtcp-fb:126 nack
a=rtcp-fb:126 nack pli
a=rtcp-fb:126 ccm fir
a=rtcp-fb:126 goog-remb
a=rtcp-fb:126 transport-cc
a=rtcp-fb:97 nack
a=rtcp-fb:97 nack pli
a=rtcp-fb:97 ccm fir
a=rtcp-fb:97 goog-remb
a=rtcp-fb:97 transport-cc
a=rtcp-mux
a=rtcp-rsize
a=rtpmap:120 VP8/90000
a=rtpmap:124 rtx/90000
a=rtpmap:121 VP9/90000
a=rtpmap:125 rtx/90000
a=rtpmap:126 H264/90000
a=rtpmap:127 rtx/90000
a=rtpmap:97 H264/90000
a=rtpmap:98 rtx/90000
a=setup:actpass
a=ssrc:713060085 cname:{f1f0e45b-172e-4e24-9a80-83957ae08f16}
a=ssrc:1408169957 cname:{f1f0e45b-172e-4e24-9a80-83957ae08f16}
a=ssrc-group:FID 713060085 1408169957

based on the above sdp...modify sdp using the following method

 -->*/

function setMediaBitrates(sdp, i) {
    return setMediaBitrate(setMediaBitrate(sdp, "video", 300), "audio", 20);
}
function setMediaBitrate(sdp, media, bitrate) {
    var lines = sdp.split("\n");
    var line = -1;
    for (var i = 0; i < lines.length; i++) {
        if (lines[i].indexOf("m=" + media) === 0) {
            line = i;
            break;
        }
    }
    if (line === -1) {
        return sdp;
    }
    line++;
    // Skip i and c lines
    while (lines[line].indexOf("i=") === 0 || lines[line].indexOf("c=") === 0) {
        line++;
    }

    // If we're on a b line, replace it
    if (lines[line].indexOf("b") === 0) {
        lines[line] = "b=AS:" + bitrate+"\nb=TIAS:"+bitrate*1000;         
        return lines.join("\n");
    }

    // Add a new b line
    console.log("Adding new b line before line", line);
    var newLines = lines.slice(0, line);
    newLines.push("b=AS:" + bitrate+"\nb=TIAS:"+bitrate*1000);    
    newLines = newLines.concat(lines.slice(line, lines.length));
    return newLines.join("\n");
}

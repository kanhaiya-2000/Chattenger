const gameroom = document.getElementById("gameroom");
const gamecards = document.getElementById("allcards");
const gamearea = document.getElementById("gamearea");
function FetchNewsByTopic(topic,callback){
    fetch(`https://newsapi.org/v2/everything?q=${topic}&sortBy=popularity&apiKey=d87bfb2030a2421599335403759783c7`).then(res=>res.json()).then(res=>callback(res)).catch(err=>Renderconfirm(err.message,true))
}
let currgame;
function FetchNewsByCountry(country,topic,callback){
    if(topic){
        fetch(`https://newsapi.org/v2/top-headlines?country=${country}&category=${topic}&sortBy=popularity&apiKey=d87bfb2030a2421599335403759783c7`).then(res=>res.json()).then(res=>callback(res)).catch(err=>Renderconfirm(err.message,true))
    }
    else{
        fetch(`https://newsapi.org/v2/top-headlines?country=${country}&sortBy=popularity&apiKey=d87bfb2030a2421599335403759783c7`).then(res=>res.json()).then(res=>callback(res)).catch(err=>Renderconfirm(err.message,true))
    }
}

function openWatchParty(){
    return Renderconfirm('<p style="line-height: 18px;"><b style="font-size: 18px;color: yellow;">Stay tuned!</b><br style="margin-bottom: 10px;"> WatchParty feature will be added in future.If you are a developer and want to contribute on this feature, then your contributions are welcome and please open a PR on <br style="margin-bottom: 5px;"><a href="https://github.com/kanhaiya-2000/Chattenger" target="_blank" style="">Github repo</a></p>',true)
}
function isValid(keycode){
    return (keycode>47&&keycode<58)||(keycode<=90&&keycode>=65)||(keycode>=97&&keycode<=122);
}
function KeyDownGif(e){
    //console.log(e);
    let str = e.value;
    if(!str) return;
    let charCode = str.charCodeAt(str.length-1);
    if(!isValid(charCode)) return;
    if(window.fetchingGifStickers){
        clearTimeout(window.fetchingGifStickers);
    }
    
    window.fetchingGifStickers = setTimeout(function(){
        if($("#srchgif").val().length)$("#srchgificon").click();
        window.fetchingGifStickers = null;
    },800)
}
function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  var ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i); 
  }

  // write the ArrayBuffer to a blob, and you're done
  var blob = new Blob([ab], {type: mimeString});
  return blob;

}
function ExportChat() {
    var node = document.getElementById('message-container');
    var exportH = document.getElementById("exportchat");
    if(typeof(domtoimage) == "undefined"||!node){
        return Renderconfirm("Feature is not available.Kindly clear your browser cache",true)
    }    
    return new Promise((resolve,reject)=>{
        const height = node.style.height;
   const innerHtml = exportH.innerHTML;
   node.style.height = "max-content";
   exportH.innerHTML = '<i class="fa fa-file-export" style="padding-right:25px;font-size: 1.1em;float:left" aria-hidden="true"></i>Saving...';
    domtoimage.toJpeg(node,{quality:0.7})
      .then(function(Url) {
        //   const dataUrl = URL.createObjectURL(Url);
        // console.log(dataUrl);
        node.style.height = height;
        exportH.innerHTML = innerHtml;
        //window.open(dataUrl);
        // var img = new Image();
        // img.src = dataUrl;
        // window.open(dataUrl);
        // var link = document.createElement('a');
        // link.download = 'chattenger-'+userdata.nativeRoom+'-'+((new Date()).getTime())+'.jpeg';
        // link.href = Url;
        // link.click();
        const bloburl = URL.createObjectURL(dataURItoBlob(Url));
        window.open(bloburl);
        resolve();
        //document.getElementById("here-appear-theimages").appendChild(img);
      })
      .catch(function(error) {
        node.style.height = height;
        exportH.innerHTML = innerHtml;
        resolve();
        console.error('oops, something went wrong!', error);
      });
    })
  
  }
function KeyDownSticker(e){
    //console.log(e);
    let str = e.value;
    if(!str) return;
    let charCode = str.charCodeAt(str.length-1);
    if(!isValid(charCode)) return;
    if(window.fetchingGifStickers){
        clearTimeout(window.fetchingGifStickers);
    }
    window.fetchingGifStickers = setTimeout(function(){
        if($("#srchstickers").val().length)$("#srchstickericon").click();
        window.fetchingGifStickers = null;
    },800)
}

function openGame(){
    const isMobile = (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    if(isMobile){
        return Renderconfirm("Games are available only for desktop users",true);
    }
    gameroom.style.display = "block";
    if(currgame){
        gamearea.style.display = "block";
        gamecards.style.display = "none";
    }
    else{
        gamearea.style.display = "none";
        gamecards.style.display = "flex";
    }
    
}

function GoBackGame(){
    if(gamearea.style.display=="block"){
        QuitGame();    
    }
    else if(gamecards.style.display=="flex"){
        gamearea.style.display = "none";    
        gamecards.style.display = "none";
        gameroom.style.display = "none"; 
    }
    
}

function PingPong(){
    setInterval(function(){ //ping pong event
        fetch("https://chattenger.herokuapp.com/ping")
    },1000*15*60)
}
PingPong();
function QuitGame(){
    currgame = null;
    gamearea.innerHTML = "";
    gamearea.style.display = "none";    
    gamecards.style.display = "none";
    gameroom.style.display = "none"; 
}

function LaunchGame(url,curr){
    currgame = curr;
    gamearea.style.display = "block";    
    gamecards.style.display = "none";
    gameroom.style.display = "block"; 
    if(currgame=='Astroblaster')
        gamearea.innerHTML = `<iframe src=${url}></iframe>`;
    else
        gamearea.innerHTML = `<iframe src=${url} style="background:white"></iframe>`;
}
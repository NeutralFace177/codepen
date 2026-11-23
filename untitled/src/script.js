var mainCanvas = document.getElementById("mainCanvas");
var mainCtx = mainCanvas.getContext("2d");
var gameCanvas = document.createElement("canvas");
var gameCtx;
var gameImageData;
var gameImageData32;

class vec2 {
  constructor(a,b) {
    this.x = a;
    this.y = b;
  }
  add(b) {
    return new vec2(this.x+b.x,this.y+b.y);
  }
  sub(b) {
    return new vec2(this.x-b.x,this.y-b.y);
  }
  div(b) {
    return new vec2(this.x/b,this.y/b);
  }
  //component wise
  absC() {
    return new vec2(Math.abs(this.x),Math.abs(this.y));
  }
  norm() {
    return Math.sqrt(this.x**2+this.y**2);
  }
  multC(b) {
    return new vec2(this.x*b.x,this.y*b.y)
  }
  divC(b) {
    return new vec2(this.x/b.x, this.y/b.y);
  }
  addC(c) {
    return new vec2(this.x+c, this.y+c);
  }
  pow(a) {
    return new vec2(this.x**a,this.y**a);
  }
  mult(c) {
    return new vec2(this.x*c,this.y*c);
  }
}
    
var playButton = document.getElementById("playButton");
var resetButton = document.getElementById("resetButton");
var nextFrameButton = document.getElementById("nextFrameButton");
var deltaTInput = document.getElementById("deltaTInput");

var updateInterval = setInterval(updat,0);

deltaTInput.addEventListener("deltaTInput",update);
playButton.addEventListener("click",playClicked);
resetButton.addEventListener("click",init);
nextFrameButton.addEventListener("click",update);



var hexLookup = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];

var kM = 5.2915158*(10**22);
var mM = 9.7599066*(10**20);
var miM = 2.6457580*(10**19);

var kerb = new vec2(0,0);
var mun = new vec2(12000000,0);
var minmus = new vec2(47000000,0);
var pKerb;
var pMun;
var pMinmus;

var kP = new vec2(0,-10).mult(kM);
var mP = new vec2(0,543).mult(mM);
var miP = new vec2(0,274).mult(miM);

var G = 6.6743015*(10**-11);
var dt=100;

function FKerb() {
  var a = mun.sub(kerb);
  var b = minmus.sub(kerb);
  return (a.div(a.norm()**3)).mult(G*kM*mM).add((b.div(b.norm()**3)).mult(G*kM*miM));
}

function FMun() {
  var a = kerb.sub(mun);
  var b = minmus.sub(mun);
  return (a.div(a.norm()**3)).mult(G*kM*mM).add((b.div(b.norm()**3)).mult(G*mM*miM));
}

function FMinmus() {
  var a = kerb.sub(minmus);
  var b = mun.sub(minmus);
  return (a.div(a.norm()**3)).mult(G*kM*miM).add((b.div(b.norm()**3)).mult(G*mM*miM));
}

function step() {
 // console.log(FMun().div(mM));
  kP = kP.sub(FKerb().mult(dt/2));
  mP = mP.sub(FMun().mult(dt/2));
  miP = miP.sub(FMinmus().mult(dt/2));
  
  kerb = kerb.sub(kP.mult(dt/(2*kM)));
  mun = mun.sub(mP.mult(dt/(2*mM)));
  minmus = minmus.sub(miP.mult(dt/(2*miM)));
  
  kP = kP.sub(FKerb().mult(dt/2));
  mP = mP.sub(FMun().mult(dt/2));
  miP = miP.sub(FMinmus().mult(dt/2));
  
}

var paused = true;

mainCanvas.addEventListener("mousemove", function(e) {
      // e = Mouse click event.
      var rect = e.target.getBoundingClientRect();
      var x = e.clientX - rect.left; //x position within the element.
      var y = e.clientY - rect.top;  //y position within the element.
     // coords.innerHTML=("X: " + Math.floor(x/(rect.right*1-1*rect.left) * width) + " Y: " + Math.floor(y/(rect.bottom*1-1*rect.top)*height));
});

var asdf = 0;
var skibdidy = 0;
var goonigan = 0;
var ts = 0;
function update() {
    const skib = performance.now();
    pKerb = kerb;
    pMun = mun;
    pMinmus = minmus;
    step();
    const didy = performance.now();
  
    skibdidy+=didy-skib;
  
    kerbScreen = kerb.div(200000).addC(250);
    munScreen = mun.div(200000).addC(250);
    minmusScreen = minmus.div(200000).addC(250);
    
    pKerbScreen = pKerb.div(200000).addC(250);
    pMunScreen = pMun.div(200000).addC(250);
    pMinmusScreen = pMinmus.div(200000).addC(250);
    const goon = performance.now();   
  //console.log(mun.x + " " + munScreen.y);
    mainCtx.strokeStyle = "red";
  mainCtx.beginPath();
       mainCtx.moveTo(pKerbScreen.x,pKerbScreen.y);
mainCtx.lineTo(kerbScreen.x,kerbScreen.y);
  mainCtx.closePath();
mainCtx.stroke();
  mainCtx.beginPath();
    mainCtx.strokeStyle = "blue";
       mainCtx.moveTo(pMunScreen.x,pMunScreen.y);
mainCtx.lineTo(munScreen.x,munScreen.y);
  mainCtx.closePath();
mainCtx.stroke();
    mainCtx.strokeStyle = "green";
  mainCtx.beginPath();
       mainCtx.moveTo(pMinmusScreen.x,pMinmusScreen.y);
mainCtx.lineTo(minmusScreen.x,minmusScreen.y);
  mainCtx.closePath();
mainCtx.stroke();
  const igan = performance.now();
  goonigan+=igan-goon;
  ts += igan-skib;
  document.getElementById("coords").innerHTML = "Compute: " + (skibdidy/asdf).toFixed(4) + "ms Render: " + (goonigan/asdf).toFixed(4) + "ms Update:" + (ts/asdf).toFixed(4) +  "ms Ticks: " + asdf;
  asdf++;
}
function updat() {
  if(!paused) {
  update();
  }
}

function init() {
  gameCanvas.width = 500;
  gameCanvas.height = 500;
  gameCtx = gameCanvas.getContext("2d");
  gameImageData = gameCtx.createImageData(500, 500);
  gameImageData32 = new Uint32Array(gameImageData.data.buffer);
  
  for (var i in gameImageData32) {
    gameImageData32[i] = rgb(255,255,255);
  }
  mainCanvas.width = 500;
  mainCanvas.height = 500;
    mainCtx.mozImageSmoothingEnabled = false;
	mainCtx.imageSmoothingEnabled = false;
	mainCtx.webkitImageSmoothingEnabled = false;
	mainCtx.msImageSmoothingEnabled = false;
	mainCtx.oImageSmoothingEnabled = false;
  
  gameCtx.putImageData(gameImageData,0,0);
  mainCtx.drawImage(gameCanvas,0,0,mainCanvas.width,mainCanvas.height);
}
  
function rgb(r,g,b) {
  return "0xff" + byteToHex(b) + byteToHex(g) + byteToHex(r);
}

function byteToHex(n) {
  return hexLookup[Math.floor(n/16)]+hexLookup[(n%16)];
}

function playClicked() {
  if (playButton.innerHTML == "▶") {
    playButton.innerHTML = "❚❚";
    paused = false;
  } else {
    playButton.innerHTML = "▶";
    paused = true;
  }
  //console.log(resultStateDropdowns);
}

function updateSpeedChanged(slider) {
  clearInterval(updateInterval);
  updateInterval = setInterval(updat, Math.floor(slider.value**5));
  document.getElementById("speedT").text="Speed:"+Math.floor(slider.value**5);
}

init();
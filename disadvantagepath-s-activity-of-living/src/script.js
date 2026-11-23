var mainCanvas = document.getElementById("mainCanvas");
var mainCtx = mainCanvas.getContext("2d");
var canvasDiv = document.getElementById("canvasDiv");

var canvasSize = 300;
var scaleInput = document.getElementById("scaleInput");
var playButton = document.getElementById("playButton");
var resetButton = document.getElementById("resetButton");
var nextFrameButton = document.getElementById("nextFrameButton");
scaleInput.value = 2;
scaleInput.step = 0.1;
var widthInput = document.getElementById("widthInput");
var heightInput = document.getElementById("heightInput");
widthInput.value = 50;
heightInput.value = 50;
var width = 50;
var height = 50;
var gameCanvas = document.createElement("canvas");
var gameCtx;
var gameImageData;
var gameImageData32;
var gameData = [];
var hexLookup = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
const checkHTMLTemplate = document.getElementById("checkEditorTemplate");
const transitionHTMLTemplate = document.getElementById("transitionEditorTemplate");
const stateHTMLTemplate = document.getElementById("stateEditorTemplate");
const cond2HTMLTemplate = document.getElementById("checksSecondaryLogicalOperatorDropdownTemplate");
const valueHTMLTemplate = document.getElementById("valueEditorTemplate");

var updateInterval;

widthInput.addEventListener("input",init);
heightInput.addEventListener("input",init);
scaleInput.addEventListener("input",update);
playButton.addEventListener("click",playClicked);
resetButton.addEventListener("click",init);
nextFrameButton.addEventListener("click",update);
new ResizeObserver(canvasResized).observe(canvasDiv);

var asddsf = document.getElementById("coords");

mainCanvas.addEventListener("mousemove", function(e) {
      // e = Mouse click event.
      var rect = e.target.getBoundingClientRect();
      var x = e.clientX - rect.left; //x position within the element.
      var y = e.clientY - rect.top;  //y position within the element.
      coords.innerHTML=("X: " + Math.floor(x/(rect.right*1-1*rect.left) * width) + " Y: " + Math.floor(y/(rect.bottom*1-1*rect.top)*height));
});

mainCanvas.addEventListener("click",function(e) {
  var rect = e.target.getBoundingClientRect();
  var sx = e.clientX - rect.left;
  var sy = e.clientY-rect.top;
  var x = Math.floor(sx/(rect.right*1-1*rect.left)*width);
  var y = Math.floor(sy/(rect.bottom*1-1*rect.top)*height);
  var index = y*width + 1*x;
  evalCheck(gameData[index].transitions[0].checks[0],index,gameData);
});

class Ruleset {
  constructor(name) {
    this.name = name;
    this.states = [];
    this.valueKeys = [];
  }
  
  initializeStates() {
    
  }
}

class TwoWayMap {
  constructor() {
    this.map = new Map();
    this.revMap = new Map();
    
    this.fromMap=(map)=> {
      this.map.clear();
      this.revMap.clear();
      var tmp = this;
      map.forEach(function(value,key) {
        tmp.set(value,key);
      });
    }
    this.set=(v,k)=> {
      this.map.set(v,k);
      this.revMap.set(k,v);
    }
    this.get=(v)=> {
      return this.map.get(v);
    }
   this.getR=(k)=> {
      return this.revMap.get(k);
    }
    this.has=(k)=> {
      return this.map.has(k);
    }
    this.hasR=(v)=> {
      return this.revMap.has(v);
    }
    this.size=()=> {
      return this.map.size;
    }
    this.remove=(v)=> {
      var k = this.map.get(v);
      this.map.delete(v);
      this.revMap.delete(k);
    }
    this.removeK=(k)=> {
      var v = this.revMap.get(k);
      this.map.delete(v);
      this.revMap.delete(k);
    }
  }
}


function and(a,b) {
  return a && b;
}
function or(a,b) {
  return a || b;
}
function nor(a,b) {
  return !(a||b);
}
function xor(a,b) {
  return a!=b;
}
function xnor(a,b) {
  return !(a!=b);
}
function nand(a,b) {
  return !(a&&b);
}
function greater(a,b) {
  return a*1 > b*1;
}
function less(a,b) {
  return a*1 < b*1;
}
function greaterE(a,b) {
  return a*1 >= b*1;
}
function lessE(a,b) {
  return a*1 <= b*1;
}
function equal(a,b) {
  return a*1 === b*1;
}
function add(a,b) {
  return a*1+b*1;
}
function mult(a,b) {
  return a*b;
}
function div(a,b) {
  return a/b;
}
function sub(a,b) {
  return a-b;
}
function neighbor(t,n,id) {
  return t*1+((objectMap.get(n)==id)?1:0);
}
function mod(a,b) {
  return b*((a/b)-Math.floor(a/b));
}

var logicalOps = new Map();
logicalOps.set("AND",and);
logicalOps.set("OR",or);
logicalOps.set("XOR",xor);
logicalOps.set("NOR",nor);
logicalOps.set("XNOR",xnor);
logicalOps.set("NAND",nand);

var comparisonOps = new Map();
comparisonOps.set("<",less);
comparisonOps.set(">",greater);
comparisonOps.set("<=",lessE);
comparisonOps.set(">=",greaterE);
comparisonOps.set("=",equal);

var computationOps = new Map();
computationOps.set("×",mult);
computationOps.set("+",add);
computationOps.set("÷",div);
computationOps.set("Number",neighbor);
computationOps.set("Sum",add);
computationOps.set("Product",mult);

const directOffset = [[1,0],[-1,0],[0,1],[0,-1]];
const diagonalOffset = [[-1,-1],[-1,1],[1,1],[1,-1]];
const fullOffset = [[1,0],[-1,0],[0,1],[0,-1],[-1,-1],[-1,1],[1,1],[1,-1]];


class State {
  constructor(name) {
    this.name = name;
    this.transitions = new Array();
    this.color = rgb(1,0,0);
    this.values = [];
  }
  initialize(transitions, color, values) {
    this.initialized = true;
    this.transitions = transitions;
    this.color = color;
    this.values = values;
  }
}

class Transition {
  constructor() {
    this.checks = new Array();
    this.cond2 = new Array(); 
    this.result; 
  }
  init(checks,cond2,result) {
    this.checks = checks;
    this.cond2 = cond2;
    this.result = result;
  }
}

class Check {
  constructor(arr, oper, func, cond, valKey) {
    this.offsetArray = arr;
    this.func = func;
    this.oper = oper;
    this.cond = cond;
    this.valKey = valKey;
  }
  initialize(arr, oper, func, cond, valKey) {
    this.offsetArray = arr;
    this.func = func;
    this.oper = oper;
    this.cond = cond;
    this.valKey = valKey;
  }
}

var state1 = new State([
  new Transition([
    new Check(directOffset,add,less,10,"population")  
  ],[],null)
],rgbN(0.1,0.9,0.25),{population:1});

var currentRuleset = new Ruleset("a");
var objectMap = new TwoWayMap();
var objIds = 0;
var resultStateDropdowns = [];
var propertyDropdowns = [];
var valueContainers = [];

function objectId(obj) {
  if (objectMap.has(obj)) {
    return objectMap.get(obj);
  }
  objectMap.set(obj, objIds);
  //console.log(objIds);
  return objIds++;
}

var paused = true;

var a = addStateClicked(document.getElementById("stateButton"));
function thingy() {
  alert("simga");
}

function canvasResized() {
  canvasDiv.width = mainCanvas.width;
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

function updateStateDropdown(dropdown) {
  var rs = currentRuleset.states.length;
  var dr = dropdown.length;
 // console.log(rs + "  " + dr);
  for (var i = 0; i < (rs>dr?rs:dr); i++) {
    if (rs == dr) {
      dropdown.options[i].text = currentRuleset.states[i].name;
      dropdown.options[i].pointer = objectMap.get(currentRuleset.states[i]);
    } else if (i >= rs) {
      dropdown.remove(i);
    } else if (i >= dr) {
      var a = document.createElement("option");
      a.text = currentRuleset.states[i].name;
      a.pointer = objectMap.get(currentRuleset.states[i]);
      dropdown.add(a);
    } else {
      dropdown.options[i].text = currentRuleset.states[i].name;
      dropdown.options[i].pointer = objectMap.get(currentRuleset.states[i]);
    }
  }
}

function updatePropertyStateDropdown(dropdown) {
  if (dropdown.parentElement.querySelector(".operation").selectedIndex == 0) {
    updateStateDropdown(dropdown);
  } else {
    var vk = currentRuleset.valueKeys.length;
    var dr = dropdown.length;
    for (var i = 0; i < (vk>dr?vk:dr); i++) {
      if (vk == dr) {
        dropdown.options[i].text = currentRuleset.valueKeys[i];
        dropdown.options[i].pointer = currentRuleset.valueKeys[i];
      } else if (i >= vk) {
        dropdown.remove(i);
      } else if (i >= dr) {
        var a = document.createElement("option");
        a.text = currentRuleset.valueKeys[i];
        a.pointer = currentRuleset.valueKeys[i];
        dropdown.add(a);
      } else {
        dropdown.options[i].text = currentRuleset.valueKeys[i];
        dropdown.options[i].pointer = currentRuleset.valueKeys[i];
      }
    }
  }
}

function updateDropdowns() {
  for (var i in resultStateDropdowns) {
    updateStateDropdown(resultStateDropdowns[i]);
  }
  for (var i in propertyDropdowns) {
    updatePropertyStateDropdown(propertyDropdowns[i]);
  }
}

function checkNeighborsChanged(input) {
  objectMap.getR(input.parentElement.id*1).offsetArray = parseNeighborOffsetString(input.value); 
}

function checkOperationChanged(dropdown) {
  for (var i in propertyDropdowns) {
    updatePropertyStateDropdown(propertyDropdowns[i]);
  }
  objectMap.getR(dropdown.parentElement.id*1).oper = computationOps.get(dropdown.value);
}

function checkPropertyChanged(dropdown) {
  objectMap.getR(dropdown.parentElement.id*1).valKey = dropdown.options[dropdown.selectedIndex].pointer;
}

function checkConditionalChanged(dropdown) {
  objectMap.getR(dropdown.parentElement.id*1).func = comparisonOps.get(dropdown.options[dropdown.selectedIndex].text);
}

function checkConditionChanged(input) {
  objectMap.getR(input.parentElement.id*1).cond = input.value;
}

function transitionCond2Changed(dropdown) {
  objectMap.getR(dropdown.parentElement.parentElement.parentElement.parentElement.id*1).cond2[dropdown.parentElement.idx] = logicalOps.get(dropdown.value);
}

function transitionResultChanged(dropdown) {
  objectMap.getR(dropdown.parentElement.id*1).result = objectMap.getR(dropdown.options[dropdown.selectedIndex*1].pointer*1);
}

function stateNameChanged(input) {
  objectMap.getR(input.parentElement.id*1).name = input.value;
  updateDropdowns();
}

function stateColorChanged(input) {
  var v = input.value;
  objectMap.getR(input.parentElement.id*1).color = "0xff" + v[5] + v[6] + v[3] + v[4] + v[1] + v[2];
//  console.log(objectMap.getR(input.parentElement.id*1).color);
}

function valueNameChanged(input) {
  
}

function valueValueChanged(input) {
  
}

function updateValuesUI(oper) {
  switch(oper) {
    case "add":
      var div = document.createElement("div");
      for (var i = 0; i < currentRuleset.valueKeys.length; i++) {
        var value = valueHTMLTemplate.cloneNode(true);
        div.append(value);
        value.indx = i;
        value.querySelector(".valueNameInput").value = "Value" + i;
      }
      for (var i = 0; i < valueContainers.length; i++) {
        var value = valueHTMLTemplate.cloneNode(true);
        value.indx = i;
        value.querySelector(".valueNameInput").value = "Value" + i;
        valueContainers[i].insertBefore(valueContainers[i].querySelector(".addValueButton"));
      }
      break;
  }
}

function updateSpeedChanged(slider) {
  clearInterval(updateInterval);
  updateInterval = setInterval(updat, Math.floor(slider.value**5));
  document.getElementById("speedT").text="Speed:"+Math.floor(slider.value**5);
}

function addStateClicked(button) {
  var state = stateHTMLTemplate.cloneNode(true); 
  button.parentElement.insertBefore(state,button);
  var name = "State" + currentRuleset.states.length;
  
  var stateObj = new State(name);
  state.id = objectId(stateObj);
  
  state.querySelector(".nameInput").value = name; 
  currentRuleset.states.push(stateObj); 
  valueContainers.push(state.querySelector(".valuesCntr"));
  addTransitionClicked(state.querySelector(".addTransitionButton"));
  updateDropdowns();
  return state;
}

function addTransitionClicked(button) {
  var transition = transitionHTMLTemplate.cloneNode(true);
  var state = objectMap.getR(button.parentElement.parentElement.parentElement.id*1);
  var transitionObj = new Transition();
  transition.id = objectId(transitionObj);
  state.transitions.push(transitionObj);
  button.parentElement.insertBefore(transition,button);
  resultStateDropdowns.push(transition.querySelector(".resultSelector"));
  updateDropdowns();
  transitionObj.result = objectMap.getR(transition.querySelector(".resultSelector").options[transition.querySelector(".resultSelector").selectedIndex*1].pointer*1);
  addCheckClicked(transition.querySelector(".addCheckButton"));
}

function addCheckClicked(button) {
  var check = checkHTMLTemplate.cloneNode(true);
  var transition = objectMap.getR(button.parentElement.parentElement.parentElement.id*1);
  var checkObj = new Check();
  if (transition.checks.length > 0) {
    var cond2 = cond2HTMLTemplate.cloneNode(true);
    cond2.idx = transition.cond2.length;
    button.parentElement.insertBefore(cond2,button);
    transition.cond2.push(logicalOps.get(cond2.firstElementChild.value));
  }
  check.id = objectId(checkObj);
  transition.checks.push(checkObj);
  propertyDropdowns.push(check.querySelector(".property"));
  updateDropdowns(); checkObj.initialize(parseNeighborOffsetString(check.querySelector(".neighborsInpt").value),computationOps.get(check.querySelector(".operation").value),comparisonOps.get(check.querySelector(".conditional").value),check.querySelector(".condition").value,check.querySelector(".property").options[check.querySelector(".property").selectedIndex].pointer);
  button.parentElement.insertBefore(check,button);
}

function addValueClicked(button) {
  updateValuesUI("add");
}

function removeStateClicked(button) {
  var state = objectMap.getR(button.parentElement.id*1);
  var stateHTML = button.parentElement;
  valueContainers.splice(valueContainers.indexOf(state.querySelector("valuesCntr")),1);
  for (var i in state.transitions) {
    var tr = state.transitions[i];
    for (var j in tr.checks) {
      objectMap.remove(tr.checks[i]);
    }
    for (var j in tr.cond2) {
      objectMap.remove(tr.cond2[i]);
    }
    objectMap.remove(tr);
  }
  objectMap.remove(state);
  currentRuleset.states.splice(currentRuleset.states.indexOf(state),1);
  var transitionsHTML = stateHTML.querySelector(".transitionsCntr").getElementsByClassName("transitionEditor");
  for (var i = 0; i < transitionsHTML.length; i++) {
resultStateDropdowns.splice(resultStateDropdowns.indexOf(transitionsHTML[i].querySelector(".resultSelector")),1);
  }
  stateHTML.remove();
  updateDropdowns();
}

function removeTransitionClicked(button) {
  var state = objectMap.getR(button.parentElement.parentElement.id*1);
  var tr = objectMap.getR(button.parentElement.id*1);
  state.transitions.splice(state.transitions.indexOf(tr),1);
  objectMap.remove(tr);
  for (var i in tr.checks) {
    objectMap.remove(tr.checks[i]);
  }
  for (var i in tr.cond2) {
    objectMap.remove(tr.cond2[i]);
  }
  resultStateDropdowns.splice(resultStateDropdowns.indexOf(button.parentElement.querySelector(".resultSelector")),1);
  button.parentElement.remove();
}
function removeCheckClicked(button) {
  var transition = objectMap.getR(button.parentElement.parentElement.parentElement.parentElement.id*1);
  var check = objectMap.getR(button.parentElement.id*1);
 transition.checks.splice(transition.checks.indexOf(check),1);
  objectMap.remove(check);
  
  button.parentElement.remove();
}

function removeValueClicked(button) {
  button.parentElement.remove();
}

function initializeStateFromUI(stateUI) {
  transitionsUI = stateUI.querySelector(".transitionsCntr").getElementsByClassName("transitionEditor");
  var transitions = [];
  for (var i = 0; i < transitionsUI.length; i++) {
    var t = transitionsUI.item(i);
    var checksUI = t.querySelector(".checksCntr").getElementsByClassName("checkEditor");
    var checks = [];
    for (var j = 0; j < checksUI.length; j++) {
      var c = checksUI.item(j);
      checks[j] = new Check(parseNeighborOffsetString(c.querySelector(".neighborsInpt").value),computationOps.get(c.querySelector(".operation").value),comparisonOps.get(c.querySelector(".conditional").value),c.querySelector(".condition").value,c.querySelector(".property").value);
    }
    transitions[i] = new Transition(checks,[],t.querySelector(".resultSelector").value);
  }
  currentRuleset.states.get(stateUI.name).initialize(transitions,stateUI.querySelector(".colorSelector").value,{});
  //console.log(new State(transitions,stateUI.querySelector(".colorSelector").value,{}));
}

function minimizeClicked(button) {
  //initializeStateFromUI(a);
  var collapsible = button.parentElement.querySelector("[collapsible=true]"); 
  collapsible.firstElementChild.hidden = !collapsible.firstElementChild.hidden;
  collapsible.style.transform = collapsible.firstElementChild.hidden ? "translateY(9px) scaleY(2)" : "";
  button.querySelector(".cllpsbttnImg").style.transform = collapsible.firstElementChild.hidden ? "rotate(-90deg) translateY(1px)" : "rotate(0deg)";
}

function minimizeValues(button) {
  var collapseable = button.parentElement.querySelector("[collapsable=true]");
  collapseable.firstElementChild.hidden = !collapseable.firstElementChild.hidden;
  collapseable.style.transform = collapseable.firstElementChild.hidden ? "translateY(9px) scaleY(2)" : "";
  button.querySelector(".cllpsbttnImg").style.transform = collapseable.firstElementChild.hidden ? "rotate(-90deg) translateY(1px)" : "rotate(0deg)";
}

function parseNeighborOffsetString(string) {
  var arr = [[]];
  if (string[0] != "[") {
    return "zawg wtf";
  }
  var numberFlag = true;
  var indx = 0;
  var ind2x = 0;
  var flag = true;
  for (var i = 1; i < string.length-1; i++) {
    if (string[i] == ",") {ind2x++;flag = true;i++;}
    if (string[i] == "]") {i+=3;ind2x=0;indx++;flag=true;arr[indx]=[];}
    if (flag) {
      flag = false;
      arr[indx][ind2x] = string[i];
    } else {
      arr[indx][ind2x] += string[i];
    }
  } 
  return arr;
}

function init() {
  width = widthInput.value;
  height = heightInput.value;
  gameCanvas.width = width;
  gameCanvas.height = height;
  gameCtx = gameCanvas.getContext("2d");
  gameImageData = gameCtx.createImageData(width, height);
  gameImageData32 = new Uint32Array(gameImageData.data.buffer);
  
  gameData = [];
  for (var i = 0; i < width*height; i++) {
    gameData[i] = currentRuleset.states[Math.floor(Math.random()*currentRuleset.states.length)];
  }
  var len = gameImageData32.length;
  for (var i in gameImageData32) {
    gameImageData32[i] = gameData[i].color;
  }
  
  
  mainCanvas.width = canvasSize * Math.cos(Math.atan(height/width)) * scaleInput.value;
  mainCanvas.height = canvasSize * Math.sin(Math.atan(height/width)) * scaleInput.value;
  canvasDiv.width = mainCanvas.width;
  canvasDiv.height = mainCanvas.height;
  mainCtx.mozImageSmoothingEnabled = false;
	mainCtx.imageSmoothingEnabled = false;
	mainCtx.webkitImageSmoothingEnabled = false;
	mainCtx.msImageSmoothingEnabled = false;
	mainCtx.oImageSmoothingEnabled = false;
  
  gameCtx.putImageData(gameImageData,0,0);
 mainCtx.drawImage(gameCanvas,0,0,mainCanvas.width,mainCanvas.height); 
}

function evalCheck(check,index,arr) {
  var x = check.offsetArray[0][0]*1+(index*1)%(width*1);
  var y = check.offsetArray[0][1]*1+1*Math.floor(index/width);
  var ni = Math.round(mod(y*width + x*1,width*height-1));
  var temp = check.oper(0,arr[ni],check.valKey);
  var str = "\n" + "nx0: " + x + "  ny0: " +y + "  d:" + temp + "\n";
  var oldTmp = 0;
  for (var i = 1; i < check.offsetArray.length; i++) {
    var nx = check.offsetArray[i][0]*1+(index*1)%(width*1);
    var ny = check.offsetArray[i][1]*1+1*Math.floor(index/width);
    var newIndex = Math.round(mod(ny*width + nx*1,width*height-1));
    temp = check.oper(temp,arr[newIndex],check.valKey);
    str += "nx" + i + ": " +  nx + "  ny"+i + ": " + ny + "  d:" + (temp*1-oldTmp*1) + "\n";
    oldTmp = temp;
  }
 // console.log("\n" + "t:" + temp + " c:" + check.cond + " x:" + index%width + " y:" + Math.floor(index/width));
 // console.log(str);
  return check.func(temp,check.cond);
}

function updat() {
  if (!paused) {
    update();
  }
}

function update() {
  var arr = gameData.slice();
  for (var i = 0; i < arr.length; i++) {
    for (var j = 0; j < arr[i].transitions.length; j++) {
      var temp = evalCheck(arr[i].transitions[j].checks[0],i,arr);
      for (var k = 1; k < arr[i].transitions[j].checks.length; k++) {
        temp = arr[i].transitions[j].cond2[k-1](temp,evalCheck(arr[i].transitions[j].checks[k],i,arr));
      }
      if (temp) {
        gameData[i] = arr[i].transitions[j].result; 
      }
    }
  }  
  for (var i in gameImageData32) {
    gameImageData32[i] = gameData[i].color;
  }
  
  
  mainCanvas.width = canvasSize * Math.cos(Math.atan(height/width)) * scaleInput.value;
  mainCanvas.height = canvasSize * Math.sin(Math.atan(height/width)) * scaleInput.value;
    mainCtx.mozImageSmoothingEnabled = false;
	mainCtx.imageSmoothingEnabled = false;
	mainCtx.webkitImageSmoothingEnabled = false;
	mainCtx.msImageSmoothingEnabled = false;
	mainCtx.oImageSmoothingEnabled = false;
   gameCtx.putImageData(gameImageData,0,0);
 mainCtx.drawImage(gameCanvas,0,0,mainCanvas.width,mainCanvas.height); 
}

//0-1
function rgbN(r,g,b) {
  return rgb(Math.floor(r*255),Math.floor(g*255),Math.floor(b*255));
}
//0-255
function rgb(r,g,b) {
  return "0xff" + byteToHex(r) + byteToHex(g) + byteToHex(b);
}

function byteToHex(n) {
  return hexLookup[Math.floor(n/16)]+hexLookup[(n%16)];
}
init();
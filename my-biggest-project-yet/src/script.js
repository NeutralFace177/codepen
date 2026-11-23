//import latexJs from "https://esm.sh/latex.js";
var input = document.getElementById("input");
var solution = document.getElementById("solve");
var showFunctionList = document.getElementById("funcButton");
var neaterSolButton = document.getElementById("cleanSolution");
var functionListHTML = document.getElementById("fList");
var roundThingy = document.getElementById("roundingPoint");
roundThingy.value = "9";
var funcButton = document.getElementById("funcButton");
var hideFuncs = false;
var neaterAnswers = !neaterSolButton.checked;
class builtInFunction {
  constructor(func, inputs) {
    this.inputs = inputs;
    this.func = func;
  }
}
function BiF(func) {
  return new builtInFunction(func, 1);
}

class obj2 {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
}

class val {
  constructor(val) {
    this.val = val;
  }
}

class ONode {
  constructor(nums, func, operFlag) {
    this.nums = nums;
    this.func = func;
    this.operFlag = operFlag;
  }
  evaluate() {
    var value;
    for (var i in this.nums) {
      if (this.nums[i] instanceof ONode) {
        this.nums[i] = this.nums[i].evaluate();
      }
    }
    if (this.operFlag) {
      value = this.func(this.nums[0],this.nums[1]);
    }
    if (this.func instanceof builtInFunction) {
      if (this.func.inputs == 1) {
        value = this.func.func(this.nums[0]);
      }
      if (this.func.inputs == 2) {
        value = this.func.func(this.nums[0],this.nums[1]);
      }
    }
    return value;
  }
}

/*
  const acsc = builtInFunc("acsc");
  const asec = builtInFunc("asec");
  const acot = builtInFunc("acot");
  */

const functionList = new Map();
functionList.set("sin",BiF(Math.sin));
functionList.set("cos",BiF(Math.cos));
functionList.set("tan",BiF(TAN));
functionList.set("asin",BiF(Math.asin));
functionList.set("acos",BiF(Math.acos));
functionList.set("atan",BiF(Math.atan));
functionList.set("csc",BiF(CSC));
functionList.set("sec",BiF(SEC));
functionList.set("cot",BiF(COT));
functionList.set("sqrt",BiF(Math.sqrt));
functionList.set("cbrt",BiF(Math.cbrt));
functionList.set("ln",BiF(Math.log));
functionList.set("log",BiF(Math.log10));
functionList.set("abs",BiF(Math.abs));
functionList.set("mod",BiF(mod,2));
functionList.set("ceil",BiF(Math.ceil));
functionList.set("floor",BiF(Math.floor));
functionList.set("round",BiF(Math.round));
functionList.set("pow",BiF(Math.pow,2));
functionList.set("exp",BiF(Math.exp));
functionList.set("random",BiF(randomt,2));
functionList.set("randInt",BiF(randomInt,2));

const stdOper = new Map();
stdOper.set("+",add);
stdOper.set("-",sub);
stdOper.set("*",mult);
stdOper.set("/",div);
stdOper.set("^",expon);
stdOper.set("%",mod);
stdOper.set("!", gamma);

const operValue = new Map();
operValue.set("+",1);
operValue.set("-",2);
operValue.set("*",3);
operValue.set("%",3);
operValue.set("/",4);
operValue.set("^",6);
operValue.set("!",7);

const constants = new Map();
constants.set("pi",Math.PI);
constants.set("tau",2*Math.PI);
constants.set("phi",1.6180339887498948482045868343656381177203091798057628621354486227);
constants.set("e",Math.E);

const sqrtsgn = '√';
const neateningShit = new Map();
neateningShit.set(Math.PI,"π");
neateningShit.set(Math.E,"𝑒");
neateningShit.set(1.6180339887498948482045868343656381177203091798057628621354486227,"φ");
neateningShit.set(Math.sqrt(2),"√2");
neateningShit.set(Math.sqrt(3),"√3");

window.addEventListener("keydown", keyPressed, false);
funcButton.addEventListener("click", onFuncShowClick);

function main() {
}

function keyPressed(e) {
  var j = 0;
  if (e.keyCode == "13") {
    var operations = [];
    var openParenCount = 0;
    var closeParenCount = 0;
    var onNumber = ((input.value[0] == input.value[0] * 1) || input.value[0] == "." || input.value[0] == "-");
    var flag = true;
    var flag2 = false;
    for (var i in input.value) {
      var tempOnNumber = (((input.value[i] == input.value[i]*1)) || input.value[i] == "." || (i == 0 && input.value[0] == "-"));
      var negationFlag = false;
      if (input.value[i] == "(") openParenCount++;
      if (input.value[i] == ")") closeParenCount++;
      if (i != 0) {
        if ((stdOper.has(input.value[i-1]) || input.value[i-1] == "(") && input.value[i] == "-") {
          tempOnNumber = true;
          negationFlag = true;
        }
      } else {
        if (input.value[i] == '-') {
          negationFlag = true;
        }
      }
      
      var op = (stdOper.has(input.value[i]) && !negationFlag);
      var paren = input.value[i] == "(" || input.value[i] == ")";
      
      if ((op || paren) || flag2) {
        flag2 = op || paren;
        flag = true;
        if (i!=0) {j++;}
      } else if ((onNumber != tempOnNumber)) {
        j++;
        flag = true;
        flag2 = op || paren;
      }
      //console.log("i:" + i + "  " + (paren) + "  |  " + flag2);
      if (flag) {
        operations[j] = input.value[i].toString();
        flag = false;
      } else {
        operations[j] += input.value[i].toString();
      }

      onNumber = tempOnNumber;
    }
    var str = "";
    for (var i in operations) {
      if (constants.has(operations[i])) {
        operations[i] = constants.get(operations[i]);
         if (i!=0) {
          if (operations[i-1] == operations[i-1]*1) {
            operations.splice(i,0,"*");
            i++;
          }
        }
      }
      str += "\"" + operations[i] + "\", ";
    }
    console.log(str);
    //operations = calcParentheses(operations);
    var sol = "";
    if (openParenCount > closeParenCount) {
      sol = "Missing closing parentheses";
    } else if (openParenCount < closeParenCount) {
      sol = "Missing open parentheses";
    } else {
      sol = cleanSolution(calcArea(calcParentheses(operations))); 
    }
    solution.innerHTML = "Solution: " + sol;
  }
}

function cleanSolution(sol) {
  //console.log(nString(sol*1));
  //console.log(getNumberParts(sol));
  if (neaterSolButton.checked) {
    return nString(sol*1);
  }
  if (sol == 0) {
    return 0;
  }
  var b = 10**(-roundThingy.value);
  var a = 0;
  var sgn = sol/Math.abs(sol);
  sol = Math.abs(sol);
  if (sol < 1) {
    a = Math.ceil(-1*Math.log10(sol));
  }
  if (sol - Math.floor(sol) < b) {
    sol = Math.floor(sol*(10**a))/(10**a);
  }
  if (Math.ceil(sol) - sol < b) {
    sol = Math.ceil(sol*(10**a))/(10**a);
  }
  if (sol < b) {
    sol = 0;
  } 
 // console.log(nString(sol));
  sol = roundAfterNRepeating(sol*1);
  var factoredConstant = "";
  neateningShit.forEach(function(value,key) {
    var x = sol/key;
    var y = sol/(1/key);
    for (var i = 2; i < 10; i++) {
      if (x * i - Math.floor(x*i) < b) {
        factoredConstant = ((x*i == 1 ? "" : x*i) + value + "/" + i);
        if (sgn < 0) {
          factoredConstant = "-" + factoredConstant;
        }
        break;
      }
    }
   // console.log(getNumberParts(sol));
    //console.log(getNumberParts(key));
    if (x - Math.floor(x) < b) {
      factoredConstant = (x != 1 ? x : "") + value;
    }
    if (y - Math.floor(y) < b) {
      factoredConstant = "1/" + value;
    }
  });
  //console.log((sol*Math.pow(10,a)));
  if (factoredConstant != "" && sol != 0 && Math.abs(sol) < 1000000000 && Math.abs(sol) > 0.00000001) {
    return factoredConstant;
  }
  return sol*sgn;
}

function roundMantissa(x) {
  var r = roundThingy.value;
  var parts = getNumberParts(x);
  if (Math.ceil(parts.mantissa)-parts.mantissa < r) {
    parts.mantissa = Math.ceil(parts.mantissa);
  }
  if (parts.mantissa - Math.floor(parts.mantissa) < r) {
    parts.mantissa = Math.floor(parts.mantissa);
  }
  console.log(float(parts.sign,parts.exponent,parts.mantissa));
  return float(parts.sign,parts.exponent,parts.mantissa);
}  

function roundAfterNRepeating(x) {
  var c0 = 0;
  var flag0 = false;
  var flag9 = false;
  var c9 = 0;
  var n = nString(x);
  console.log(n);
  var w = 0;
  var s = "";
  var d = n.indexOf(".");
  if (d == -1) {
    return n;
  }
  for (var i = d; i < n.length; i++) {
    if (n[i] == "0") {
      c0++;
    } 
    if (c0>0 && n[i]!="0") {c0=0;}
    if (n[i] == "9") {
      c9++;
    } 
    if (c9>0 && n[i]!="9") {c9=0;} 
    if (c9 >= roundThingy.value-1) {
      w = i;
      flag9 = true;
      break;
    }
    if (c0 >= roundThingy.value-1) {
      w = i;
      flag0 = true;
      break;
    }
  }
  if (flag0) {
    s = n.slice(0,d) + "." + n.slice(d+1,w-((roundThingy.value*1)-2));
  } else if (flag9) {
    s = n.slice(0,d) + "." + n.slice(d+1,w-((roundThingy.value*1)-1));
    s += (n[w-((roundThingy.value*1)-1)]*1)+1;
  } else {
    return n;
  }
  if (n.includes("e")) {
    s += n.slice(n.indexOf("e"),n.length);
  }
  console.log(s);
  console.log("0:" + c0 + " | 9:" + c9);
  return s;
}

function nString(x) {
  if (Number.isSafeInteger(x)) {
    return x.toString();
  }
  var s = x.toPrecision(100).split("").reverse().join("");
  var ex = s.includes('e') ? s.slice(0,s.indexOf('e')+1).split("").reverse().join("") : "";
  if (ex != "") { s = s.slice(s.indexOf('e')+1,s.length);}
  console.log(ex);
  var n = "";
  var flag = false;
  var pFlag = false;
  for (var i in s) {
    if (s[i] != "0" && !flag) {
      flag = true;
    }
    if (flag && !((!pFlag&&flag) && s[i]==".")) {
      n+=s[i];
    }
    pFlag = flag;
  }
  return n.split("").reverse().join("") + ex;
}

function float(sign, exponent, mantissa) {
  return ((-1)**sign)*(2**exponent)*mantissa;
}
//getNumberParts is from top response on https://stackoverflow.com/questions/9383593/extracting-the-exponent-and-mantissa-of-a-javascript-number
//getting the value of the exponent how its represented is more accurate than running it through the Math.log function, though prolly no significant difference
function getNumberParts(x) {
    var float = new Float64Array(1),
        bytes = new Uint8Array(float.buffer);

    float[0] = x;

    var sign = bytes[7] >> 7,
        exponent = ((bytes[7] & 0x7f) << 4 | bytes[6] >> 4) - 0x3ff;

    bytes[7] = 0x3f;
    bytes[6] |= 0xf0;

    return {
        sign: sign,
        exponent: (exponent-1022).toString(2),
        mantissa: float[0].toString(2),
    }
}


function calcArea(operations) {
  var onlyOpList = [];
  var tmpIndx = 0;
  var funcFlag = false;
  for (var i in operations) {
      if (stdOper.has(operations[i])) {
        onlyOpList[tmpIndx] = i;
        tmpIndx++;
      }
    if (functionList.has(operations[i])) {
      funcFlag = true;
    }
  }
  
  if (tmpIndx == 0 && !funcFlag) {
    return operations[0];
  }
  var nOper = [];
  for (var i = 0; i < operations.length; i++) {
    if (functionList.has(operations[i])) {
      nOper[i] = functionList.get(operations[i]).func(operations[(i*1)+1]);
      operations.splice(i+1,1);
    } else {
      nOper[i] = operations[i];
    }
  }
  operations = nOper;
  
  if (funcFlag) {
    tmpIndx = 0;
     for (var i in operations) {
      if (stdOper.has(operations[i])) {
        onlyOpList[tmpIndx] = i;
        tmpIndx++;
      }
    }
  }
 
  if (funcFlag && tmpIndx == 0) {
    return operations[0];
  }
  
  var tmp = new val(0);
  var depth = new val(0);
  var ONodeTree = genNodeTree(onlyOpList[0], operations, tmp);
  depth.val += tmp.val;
  ONodeTree = calcSection(operations, onlyOpList, ONodeTree, tmp, depth);
  return ONodeTree.evaluate();
}

function calcSection(operations, operList, ONodeTree, tmp, depth) {
  if (operList.length == 1) {
    return ONodeTree;
  }
  if (tmp.val > operList.length-1) {
    operList.push(operations.length);
    operations.push("*");
    operations.push("1");
  }
  //console.log(operations);
  var slicedOperList = operations.slice(operList[tmp.val], operations.length);
  slicedOperList.unshift(ONodeTree.evaluate());
  tmp.val = 0;
  ONodeTree = genNodeTree(1, slicedOperList, tmp);
  depth.val += tmp.val;
  if (depth.val < operList.length) {
    ONodeTree = calcSection(slicedOperList, operList, ONodeTree, tmp, depth);
  }
  return ONodeTree;
}

function calcParentheses(operations) {
  if (!operations.includes("(")) {
    return operations;
  }
  var startIndex = 0;
  var endIndex = 0;
  var openPFlag = false;
  var closedPFlag = false;
  var thingyCounter = 0;
  for (var i in operations) {
      if (operations[i] == "(") {
        if (!openPFlag) {
          startIndex = (i*1)+1;
          openPFlag = true;
        } else {
          thingyCounter++;
        }
      }
      if (operations[i] == ")" && !closedPFlag) {
        if (thingyCounter > 0) {
          thingyCounter--;
        } else {
          endIndex = i;
          closedPFlag = true; 
        }
      }
  }
  var sliced = [operations[startIndex]];
  for (var i = startIndex+1; i < endIndex; i++) {
    sliced.push(operations[i]);
  }
  if (sliced.includes("(")) {
    sliced = calcParentheses(sliced);
  }
  var newOperations = operations.slice(0,startIndex-1);
  newOperations.push(calcArea(sliced));
  newOperations = newOperations.concat(operations.slice((endIndex*1)+1,(operations.length*1)));
  
  if (newOperations.includes("(")) {
    newOperations = calcParentheses(newOperations);
  }
  return newOperations;
}

function onFuncShowClick() {
  hideFuncs = !hideFuncs;
  if (hideFuncs) {
    showFunctionList.innerHTML = "Show";
    functionListHTML.style.display = "none";
  }  else {
    showFunctionList.innerHTML = "Hide";
    functionListHTML.style.display = "block";
  }
  
}
/*
function TheLinesOfCodeWrittenInTheProgrammingLanguageKnownAsJavascriptThatAreDesignatedToBeExecutedOnTheEventOfTheButtonThatHasThePurposeOfTogglingBetweenMathematicallySimplifingTheNumberThatTheUserImputtedEquationHasBeenCalculatedToBeEquivalentHasBeenClickedByTheUser() {
  neaterAnswers = !neaterAnswers;
}
*/
function genNodeTree(operIndex, arr, depth) {
  var n1 = arr[(operIndex*1)-1];
  var n2 = 0;
  //console.log(arr + " | " + n1);
  depth.val++;
  if (arr.length >= (operIndex*1)+3) {
    if (operValue.get(arr[(operIndex*1)+2]) >= operValue.get(arr[operIndex])) {
      n2 = genNodeTree((operIndex*1)+2, arr, depth);
    } else {
      n2 = arr[(operIndex*1)+1];
    }
  } else {
    n2 = arr[(1*operIndex)+1];
  }
  return new ONode([n1,n2], stdOper.get(arr[operIndex]),true);
}

function TAN(x) {
  if (mod(x+(Math.PI/2),Math.PI) < 0.00000000001) {
    return "undefined";
  }
  return Math.tan(x);
}

function SEC(x) {
  if (mod(x+(Math.PI/2),Math.PI) < 0.00000000001) {
    return "undefined";
  }
  return 1/Math.cos(x);
}
function CSC(x) {
  if (mod(x,Math.PI) < 0.000000000001) {
    return "undefined";
  }
  return 1/Math.sin(x);
}
function COT(x) {
  if (mod(x,Math.PI) < 0.000000000001) {
    return "undefined";
  }
  return 1/Math.tan(x);
}

function randomx() {
  return Math.random();
}

function randomt(min, max) {
  return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function add(a,b) {
  return (a*1)+(b*1);
}
function sub(a,b) {
  return a-b;
}
function mult(a,b) {
  return a*b;
}
function div(a,b) {
  return a/b;
}
function expon(a,b) {
  return a**b;
}
function mod(a,b) {
  return b*((a/b)-Math.floor(a/b));
}

//currently non integer values can be quite inaccurate 
//the approximation of the gamma function here is from a github repo, of which i forgot to copy the link
//i dont feel like making an integral calculator, and allowing non integer values for factorial is a commodity, not a nessecity.
function gamma(x) {
    if (x == Math.floor(x)) {
      var a = 1;
      if (x < 0) {
        a = undefined;
      } else if (x == 0) {
        a = 1;
      } else {
        for (var i = x; i > 0; i--) {
          a *= i;
        } 
      }
      
      return a;
    } else {
      x++;
    }
    var p = [0.99999999999980993, 676.5203681218851, -1259.1392167224028,
        771.32342877765313, -176.61502916214059, 12.507343278686905,
        -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
    ];
    var g = 7;
    if (x < 0.5) {
        return Math.PI / (Math.sin(Math.PI * x) * gamma(1 - x));
    }
    x -= 1;
    var a = p[0];
    var t = x + g + 0.5;
    for (var i = 1; i < p.length; i++) {
        a += p[i] / (x + i);
    }
    return Math.sqrt(2 * Math.PI) * (t**(x + 0.5)) * Math.exp(-t) * a;
}

main();

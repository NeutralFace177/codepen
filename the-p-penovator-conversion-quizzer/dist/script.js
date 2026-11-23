var unit1 = document.getElementById("a");
var unit2 = document.getElementById("b");
var conversionFactor = document.getElementById("solve");

window.addEventListener("keydown", keyPressed, false);

class DerivedQuantity {
  constructor(name,derivation,properties) {
    this.name = name;
    this.derivation = derivation;
    this.properties = properties;
    toString => name;
  }
}
//freeze derived quantity
function enumDerivedQ(name,derivation,properties) {
  return Object.freeze(new DerivedQuantity(name,derivation,properties));
}
const qp = (q,p) => Object.freeze({quantity:q,power:p});
const enumValue = (name,properties) => Object.freeze({ toString: () => name, name: name, properties: properties});
const Quantity = Object.freeze({
  Length: enumValue("Quantity.Length"),
  Time: enumValue("Quantity.Time"),
  Mass: enumValue("Quantity.Mass")
});
const dQuantity = Object.freeze({
  Area: enumDerivedQ("dQuantity.Area",[qp(Quantity.Length,2)],[]),
  Volume: enumDerivedQ("dQuantity.Volume",[qp(Quantity.Length,3)],[]),
  Force: enumDerivedQ("dQuantity.Force",[qp(Quantity.Mass,1),qp(Quantity.Length,1),qp(Quantity.Time,-2)],[]),
  Energy: enumDerivedQ("dQuantity.Energy",[qp(Quantity.Mass,1),qp(Quantity.Length,1),qp(Quantity.Time,-2)],[]),
  Power: enumDerivedQ("dQuantity.Power",[qp(Quantity.Mass,1),qp(Quantity.Length,2),qp(Quantity.Time,-3)],[]),
  Pressure: enumDerivedQ("dQuantity.Pressure",[qp(Quantity.Mass,1),qp(Quantity.Length,-1),qp(Quantity.Time,-2)],[])
});

class Unit {
  constructor(name, abbr, type, conv) {
    this.name = name;
    this.abbr = abbr;
    this.type = type;
  }
}
class dUnit extends Unit{
  constructor(name,abbr,type,conv,system) {
    super(name,abbr,type,conv);
    this.sys = system;
  }
}

const prefixes = new Map();
prefixes.set("q",{value:-30,name:"quecto"});
prefixes.set("r",{value:-27,name:"ronto"});
prefixes.set("y",{value:-24,name:"yocto"});
prefixes.set("z",{value:-21,name:"zepto"});
prefixes.set("a",{value:-18,name:"atto"});
prefixes.set("f",{value:-15,name:"femto"});
prefixes.set("p",{value:-12,name:"pico"});
prefixes.set("n",{value:-9,name:"nano"});
prefixes.set("μ",{value:-6,name:"micro"});
prefixes.set("m",{value:-3,name:"mili"});
prefixes.set("c",{value:-2,name:"centi"});
prefixes.set("d",{value:-1,name:"deci"});
prefixes.set("da",{value:1,name:"deca"});
prefixes.set("h",{value:2,name:"hecto"});
prefixes.set("k",{value:3,name:"kilo"});
prefixes.set("M",{value:6,name:"mega"});
prefixes.set("G",{value:9,name:"giga"});
prefixes.set("T",{value:12,name:"tera"});
prefixes.set("P",{value:15,name:"peta"});
prefixes.set("E",{value:18,name:"exo"});
prefixes.set("Z",{value:21,name:"zetta"});
prefixes.set("Y",{value:24,name:"yotta"});
prefixes.set("R",{value:27,name:"ronna"});
prefixes.set("Q",{value:30,name:"quetta"});

const meter = new Unit("Meter","m",Quantity.Length);
const mile = new Unit("Mile","mi",Quantity.Length);
const yard = new Unit("Yard","yd",Quantity.Length);
const foot = new Unit("Foot","ft",Quantity.Length);
const inch = new Unit("Inch","in",Quantity.Length);

const second = new Unit("Second","s",Quantity.Time);
const minute = new Unit("Minute","min",Quantity.Time);
const hour = new Unit("Hour","h",Quantity.Time);
const day = new Unit("Day","d",Quantity.Time);
const week = new Unit("Week","wk",Quantity.Time);
const year = new Unit("Year","yr",Quantity.Time);
const ly = new Unit("Light Year","ly",Quantity.Time);

const grain = new Unit("Grain","gr",Quantity.Mass);
const gram = new Unit("Gram","g",Quantity.Mass);
const pound = new Unit("Pound","lbs",Quantity.Mass);
const ounce = new Unit("Ounce","oz",Quantity.Mass);
const impTon = new Unit("Ton","t",Quantity.Mass);
const tonne = new Unit("Tonne","t",Quantity.Mass);
const slug = new dUnit("Slug","slug",Quantity.Mass,"lbf*s^2/ft");

const liter = new Unit("Liter","L",dQuantity.Volume);
const teaspoon = new Unit("Teaspoon","tsp",dQuantity.Volume);
const tablespoon = new Unit("Tablespoon","tbsp",dQuantity.Volume);
const flOunce = new Unit("Fluid Ounce","fl oz", dQuantity.Volume);
const gill = new Unit("Gill","gi",dQuantity.Volume);
const cup = new Unit("Cup","c",dQuantity.Volume);
const flPint = new Unit("Pint","pt",dQuantity.Volume);
const flQuart = new Unit("Quart","qt",dQuantity.Volume);
const pottle = new Unit("Pottle","pot",dQuantity.Volume);
const gallon = new Unit("Gallon","gal",dQuantity.Volume);

const acre = new Unit("Acre","ac",dQuantity.Area);
const hectare = new Unit("Hectare","ha",dQuantity.Area);

const newton = new dUnit("Newton","N",dQuantity.Force,"MKS");
const dyne = new Unit("Dyne","dyn",dQuantity.Force);
const poundF = new Unit("Pound-Force","lbf",dQuantity.Force);
const poundal = new dUnit("Poundal","pdl",dQuantity.Force,"Imperial");
const kip = new dUnit("Kip","kip",dQuantity.Force,"klbf");

const joule = new dUnit("Joule","J",dQuantity.Energy,"MKS");
const footPound = new dUnit("Foot Pound","ft⋅lbf",dQuantity.Energy,"Imperial");

const watt = new dUnit("Watt","W",dQuantity.Power,"MKS");
const horsepower = new Unit("Horsepower","hp",dQuantity.Power);

const pascal = new Unit("Pascal","Pa",dQuantity.Pressure);

function keyPressed(e) {
  if (e.keyCode == 13)
  console.log();
}

var Base = function() {
};

Base.prototype.hi = function() {
	console.log("I said hi");
}

/////

var Test = function() {
	Base.call(this);

	this.name = "test";
};

Test.prototype = Object.create( Base.prototype );

Test.prototype.hello = function() {
	console.log("Hello, ny name is", this.name);
}

/////

var test = new Test(),
	tost = new Test();

tost.name = "blah";
Test.globName = "glob-tost";

test.hello();
tost.hello();
test.hi();

test.hello.call({ })
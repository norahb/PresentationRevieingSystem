var should = require('chai').should(),
expect = require('chai').expect(),
supertest = require('supertest'),
api  = supertest('http://localhost:8080');

// Intgrated file for all tests
function importTest(name, path) {
    describe(name, function () {
        require(path);
    });
}


describe("Test Application", function () {
	
    importTest("Test Routing", './testRouting');
    importTest("Test Forms", './testForms');
	importTest("Test Sockets", './testSocket');
    after(function () {
        console.log("after all tests");
    });
	
});
var should = require('chai').should(),
expect = require('chai').expect(),
supertest = require('supertest'),
api  = supertest('http://localhost:8080');

// Integration test for App Routing
describe('Testing App Routing', function () {
	
	it('should respond to /index', function (done) {
		api.get('/')
		.set('Accept', 'application/json')
		.expect(200)
		.end(function(err, res){
		res.text.should.include('presentation')
		res.text.should.include('join')
		res.status.should.equal(200)
		done()
		});
	});
		
		
		
	it('should respond to /presentation', function (done) {
		api.get('/presentation')
		.set('Accept', 'application/json')
		.expect(200)
		.end(function(err, res){
		res.text.should.include('uploadedImages')
		res.text.should.include('Code')
		res.status.should.equal(200)
		done()
		});
		});
		
		it('should respond to /join', function (done) {
		api.get('/join')
	   .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
		res.text.should.include('joinPpt')
		res.text.should.include('comment')		
		res.status.should.equal(200)
        done()
		});
	});
	
	it('should not responds to /comments', function (done) {
		api.get('/comments')
		.set('Accept', 'application/json')
		.expect(404)
		.end(function(err, res){
		res.status.should.equal(404)
        done()
		});
	});
});

var should = require('chai').should(),
expect = require('chai').expect(),
supertest = require('supertest'),
api  = supertest('http://localhost:8080');

// Test Application Forms
describe('Testing App Forms', function () {
		 
		 var sessionCode ;
		
		it('Should Upload One Image ', function (done) {
			api.post('/uploadFiles')
			.set('Accept', 'application/json')
			.expect(200)
			.type('form')
			.field('Content-Type', 'multipart/form-data')
			.field('name', 'ajaxUploadForm')
			.attach('uploadedImages', 'm.gif')
			.end(function (err, res) {
				sessionCode = res.body.id
				res.body.uploadedFileNames.should.have.length.above(0)
				res.status.should.equal(200)
				done();
			});
    }); 
	
	it('Should Upload Multiple Images', function (done) {
				api.post('/uploadFiles')
				.set('Accept', 'application/json')
				.expect(200)
				.type('form')
				.field('Content-Type', 'multipart/form-data')
				.field('name', 'ajaxUploadForm')
				.attach('uploadedImages', 'm.gif')
				.attach('uploadedImages', '1.png')
				.end(function (err, res) {
					sessionCode = res.body.id
					res.body.uploadedFileNames.should.have.length.above(1)
					res.status.should.equal(200)
					done();
				});
		}); 
	
	it('Should NOT Upload Other Files Formats ', function (done) {
			api.post('/uploadFiles')
			.set('Accept', 'application/json')
			.expect(415)
			.type('form')
			.field('Content-Type', 'multipart/form-data')
			.field('name', 'ajaxUploadForm')
			.attach('uploadedImages', 'testf.txt')
			.end(function (err, res) {
				res.status.should.equal(415)
				done();
			});
    }); 
	 
	  
	 
	it('Should Not Join Session', function (done) {
		api.post('/joinPpt')
		.set('Accept', 'application/json')
		.expect(401)
		.type('form')
		.send({ name: 'TestNora', code:'xxxxx'})
		.end(function (err, res) {
			res.status.should.equal(401)
            done();
        });
    });
	
	
	it('Should Join Session', function (done) {
		api.post('/joinPpt')
		.set('Accept', 'application/json')
		.expect(200)
		.type('form')
		.send({ name: 'TestNora', code:sessionCode})
		.end(function (err, res) {
			res.status.should.equal(200)
            done();
        });
    });
	
});

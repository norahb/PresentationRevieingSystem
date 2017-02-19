var should = require('chai').should(),
expect = require('chai').expect(),
supertest = require('supertest'),
api  = supertest('http://localhost:8080');

var io = require('socket.io-client');

var socketURL = 'http://localhost:8080';

var options ={
  transports: ['websocket'],
  'force new connection': true
};

// Test Application Sockets

describe('Testing App Sockets', function() {

    var socket;

    beforeEach(function(done) {
        // Setup
        socket = io.connect(socketURL, options);
		
        socket.on('connect', function() {
            done();
        });
		
        socket.on('disconnect', function() {
        });
    });

    afterEach(function(done) {
        // Cleanup
        if(socket.connected) {
            socket.disconnect();
        } else {
            // There will not be a connection unless you have done() in beforeEach, socket.on('connect'...)
            console.log('no connection to break...');
        }
        done();
    });

	describe("Testing Sockets after set-up",function(){

		var sessionCode;
			
			it('Should Upload Images', function (done) {
				api.post('/uploadFiles')
				.set('Accept', 'application/json')
				.expect(200)
				.type('form')
				.field('Content-Type', 'multipart/form-data')
				.field('name', 'ajaxUploadForm')
				.attach('uploadedImages', './test/m.gif')
				.attach('uploadedImages', './test/1.png')
				.end(function (err, res) {
					sessionCode = res.body.id
					res.status.should.equal(200)
					done();
				});
		}); 

		it('Should add Presenter to new added room', function(done){
			socket.emit('Add Room', sessionCode);
			socket.on('Add Room', function(id){
				id.should.equal("Presenter has created: " + sessionCode);
				done();
			});
		  });
		  
		  it('Should add User TestNora to the room ', function(done){
			socket.emit('adduser', 'TestNora', sessionCode);
		 socket.on('adduser', function(username,id){
				username.should.equal('TestNora' +' join '+sessionCode);
				done();
			});
		  });
		  
		  it('Should return uploaded images', function(done){
			socket.emit('dislay ppt', sessionCode);
			socket.on('dislay ppt', function(msg){
				console.log(msg)
				msg.should.have.length.above(0)
				done();
			});
		  });	  
		
		it('Should change slide number', function(done){
			socket.emit('change slide', 1);
			socket.on('change slide', function(slide_num){
				slide_num.should.equal(1)
				done();
			});	
		});
	
	it('Should Send Comment', function(done){
			socket.emit('send comment', 'TEST COMMENT');
			socket.on('send comment', function(comment){
				comment.should.equal('TEST COMMENT')
				done();
			});	
		});
	
	it('Should Display Comment', function(done){
			socket.emit('display comment', sessionCode);
			socket.on('display comment', function(dis){
				dis[dis.length-1].should.contain('TEST COMMENT')
				done();
			});	
		});
	
});

});
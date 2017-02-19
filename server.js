// Uploading files with AJAX originally developed by Balázs Buri
// https://github.com/burib/nodejs-multiple-file-upload-example

//  Required modules
var express = require('express'),
    http = require('http'),
    app = express(),
	server = http.createServer(app),
    io = require('socket.io').listen(server),
    sys = require('sys'),
    fs = require('fs'),
    path = require('path'),
    bytes = require('bytes'),
    parseFile = function(file, req) {
      var parsedFile = path.parse(file),
      fullUrl = req.protocol + '://' + req.get('host') + '/uploads/';

      return {
            name: parsedFile.name,
            base: parsedFile.base,
            extension: parsedFile.ext.substring(1),
            url: fullUrl + parsedFile.base,
            size: bytes(fs.statSync(file).size)
          };
};

// rooms to save presentation rooms (session)
// imgArray to save image sources with room id
// comments to save users comments details
var rooms = [{"id":"" , "slidenum":0}],
    imgArray = [{"id":"", "imgsrc":""}],
	slidenum = 0,
	comments = [{
		"username":"",
		"room":"",
		"slide":0,
		"comment":""
	}];
	
// Application Routing
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser({ keepExtensions: true, uploadDir: __dirname + '/_tmp' })); // required for accessing req.files object

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/presentation',function(req,res){
  res.sendfile('public/presentation.html' , { root : __dirname});
});

app.get('/join',function(req,res){
  res.sendfile('public/join.html' , { root : __dirname});
});

   
// Handling of uploading images form
app.post('/uploadFiles', function (req, res) {
  
  var newPath = null,
      id=new Array(4).join().replace(/(.|$)/g, function(){return ((Math.random()*36)|0).toString(36);}),
      uploadedFileNames = [],
      uploadedImages,
      uploadedImagesCounter = 0;
	  var notImage = false;
	  
  if(req.files && req.files.uploadedImages) {
    uploadedImages = Array.isArray(req.files.uploadedImages) ? req.files.uploadedImages : [req.files.uploadedImages];
    
	uploadedImages.forEach(function (value) {
	
	// Check uploaded file format
	  if(path.parse(value.path).base.split('.')[1].toLowerCase() != 'jpg' 
		  && path.parse(value.path).base.split('.')[1].toLowerCase() != 'png'
		  && path.parse(value.path).base.split('.')[1].toLowerCase() != 'gif'
		  && path.parse(value.path).base.split('.')[1].toLowerCase() != 'bmp'
		  && path.parse(value.path).base.split('.')[1].toLowerCase() != 'tif'
	 )
			{notImage = true;}
      else{
		  // If images; Upload files and save the to imgArray
		  newPath = __dirname + "/public/uploads/" + path.parse(value.path).base;
		  fs.renameSync(value.path, newPath);
		  imgArray.push({"id":id,"imgsrc":'uploads/' + path.parse(value.path).base});
		  uploadedFileNames.push(parseFile(newPath, req));}
    });

	// Add the new room
	rooms.push({"id":id});
	
    res.type('application/json');	
	
	if(!notImage)
	{	
		res.status(200).send(JSON.parse(JSON.stringify({"id": id,"uploadedFileNames": uploadedFileNames})));
		
		}
	else
	 {  notImage = false;
		res.status(415).send(JSON.parse(JSON.stringify({"error": 'not image'})));}
  }
});
 
 
app.get('/files', function (req, res) {
  var dirPath = path.normalize('./public/uploads/');
 
  fs.readdir(dirPath, function (err, files) {
      if (err) {
          throw err;
          res.send(500, {})
      }

      var uploadedFiles = files.filter(function (file) {
          return file !== '.gitignore';
      }).map(function (file) {
          return path.join(dirPath, file);
      }).filter(function (file) {
          return fs.statSync(file).isFile();
      }).map(function (file) {
          return parseFile(file, req);
      });
	
      res.type('application/json');
      res.send(uploadedFiles);
  });

});
 

// Handling of join session form
app.post('/joinPpt', function (req, res) {
		var name=req.body.name;
		var code=req.body.code;
		var exist = false;
		
		// Check the correctness of provided room code
		for (var el in rooms) {
					 if (rooms[el].id === code) {   
						 exist = true;
						 break;
					 }}

		if (exist)
				{
					res.status(200).send(JSON.parse(JSON.stringify({"name": name,"code": code,"test":true})));
				}
		else
				{
					res.status(401).send(JSON.parse(JSON.stringify({"name": name,"code": code,"test":false})));
				}
		
});
//initially form http://psitsmike.com/2011/10/node-js-and-socket-io-multiroom-chat-tutorial/

// Socket to establish connection with client
io.on('connection', function (socket) {

	// when the client emits 'adduser', this listens and executes
	socket.on('adduser', function(username,id){
	
		// store the username in the socket session for this client
		socket.username = username;
		// store the room name in the socket session for this client
		socket.room = ''+id;
		// send client to presentation room
		socket.join(socket.room);
		console.log(socket.username +' join '+socket.room);

		socket.emit('adduser' , socket.username +' join '+socket.room)
		});
	
	// when the client emits 'Add Room', this listens and executes
	socket.on('Add Room', function(id){
		id = imgArray[imgArray.length-1].id;
		//name the room
		socket.room = id; 
		socket.username = 'Presenter';
		//auto-join the creator to the room
		socket.join(socket.room); 
		console.log(socket.username + " has created: "+id);
		socket.emit('Add Room', socket.username + " has created: "+id);
	});
	
	// when the client emits 'dislay ppt', this listens and executes
	socket.on('dislay ppt', function(msg){
		var img = [];
		// Loop through imaArray and save the image source that matches room id in img array
		for(var i = 1; i < imgArray.length; i++) 
		{
			if (imgArray[i].id === socket.room || imgArray[i].id === msg)
				img.push(imgArray[i].imgsrc);
		}
			// Emit when user starts presentation
			socket.emit('dislay ppt', img);
	});

	// when the client emits 'change slide', this listens and executes
	socket.on('change slide', function(slide_num){
	
	// When the user change the slide in a room
		for(var i = 1; i < rooms.length; i++)
		{
			if (rooms[i].id === socket.room )
				rooms[i].slidenum = slide_num;
		}
		socket.emit('change slide', slide_num);
	});
	
	// when the client emits 'send comment', this listens and executes
	socket.on('send comment', function(comment){
	
		var snum = 0;
		
		// To save the sent comment in the matched room
		for(var i = 1; i < rooms.length; i++)
		{
			if (rooms[i].id === socket.room )
				snum = rooms[i].slidenum ;
		}
		comments.push({"username":socket.username,
		"room":socket.room,
		"slide":snum,
		"comment":comment});
		
		socket.emit('send comment', comments[comments.length-1].comment);
  });
	
	// when the client emits 'display comment', this listens and executes
	socket.on('display comment', function(dis){
	
		var usercomment=[];
		// Loop through comments array and save comments that matches room id in usercomment array
		for(var i = 1; i < comments.length; i++) 
		{
			if (comments[i].room === socket.room )
				usercomment.push([comments[i].username,comments[i].slide,comments[i].comment])
		}
		
		// Emit when user Review presentation
			socket.emit('display comment', usercomment);
	});
	
	// when the user disconnects
	socket.on('disconnect', function(){
		console.log(' disconnected');
	});
	 	
});


server.listen(8080);
console.log('Server on port',8080);
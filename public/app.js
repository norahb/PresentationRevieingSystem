// AJAX Script

var imgArray = [];

function initPage() {
	onUploadForm();	
}; 

function initPage2() {
	onJoinForm();
};

// When user upload images, Prevent redirecting him and update current page
function onUploadForm() {
	var uploadForm = document.forms['ajaxUploadForm'];

	uploadForm.onsubmit = function(event) {
		event.preventDefault();

		var formData = new FormData(),
			uploadedImages = uploadForm['uploadedImages'].files;

		for (var i = 0; i < uploadedImages.length; i++) {
			formData.append('uploadedImages[]', uploadedImages[i]);	
		};

		ajaxx(uploadForm.action, uploadForm.method, formData, appendImages);
	};

	function appendImages(responseText, status) {
		socket.emit('Add Room', '');
		var code = responseText['id'];
		// After Submitting, Remove upload form and Display presentation code
		document.getElementById('formppt').style.display = "none";
		document.getElementById('start').style.display = "block";
		document.getElementById('code').innerHTML +='<style="font-size: 1.5em; font-weight: bold;">'+ code +'</b>';
	}

}

// When user Join Session, Prevent redirecting him and update current page
function onJoinForm() {
	var joinForm = document.forms['joinform'];
	
	joinForm.onsubmit = function(event) {
		event.preventDefault();
		
		var formData = new FormData(),
			name = joinForm['name'].value,
			code = joinForm['code'].value;
			formData.append('name', name);
			formData.append('code', code);
		ajaxx(joinForm.action, joinForm.method, formData, check);
	};
	
	// Check session code correctness
	function check(responseText, status) {
		var codeStatus = responseText['test'];
		
		// If the code correct, it displays comment form
		if(codeStatus)
		{
				socket.emit('adduser', responseText['name'],responseText['code']);
				document.getElementById('joinDiv').style.display = "none";
				document.getElementById('commentDiv').style.display = "block";
		}
		//If code not correct, alert user
		else
		alert("Incorrect Presentation Code");
		
	}

}
 
// Common function to initialize XML Http Request object 
function getHttpRequestObject() {
	// Define and initialize as false
	var xmlHttpRequst = false;
	
	// Mozilla/Safari/Non-IE
    if (window.XMLHttpRequest) 
	{
        xmlHttpRequst = new XMLHttpRequest();
    }
    // IE
    else if (window.ActiveXObject) 
	{
        xmlHttpRequst = new ActiveXObject("Microsoft.XMLHTTP");
    }
	return xmlHttpRequst;
};

// Does the AJAX call to URL specific with rest of the parameters
function ajaxx(url, method, data, responseHandler, async) {
	// Set the variables
	url = url || "";
	method = method || "GET";
	async = async || true;
	data = data || null;
	responseHandler = responseHandler || function () {};
	
	if(url == "")
	{
		alert("URL can not be null/blank");
		return false;
	}
	var xmlHttpRequst = getHttpRequestObject();
	
	// If AJAX supported
	if(xmlHttpRequst != false)
	{
		// Open Http Request connection
		if(method == "GET")
		{
			url = url + "?" + data;
			data = null;
		}
		xmlHttpRequst.open(method, url, async);
		// Set request header (optional if GET method is used)
		if(method == "POST")
		{
			xmlHttpRequst.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
			xmlHttpRequst.setRequestHeader('Accept', 'application/json');
		}
		// Assign (or define) response-handler/callback when ReadyState is changed.
		xmlHttpRequst.onreadystatechange = function() {
			if(xmlHttpRequst.readyState==4){
	            if(xmlHttpRequst.status==200) {
	                responseHandler(JSON.parse(xmlHttpRequst.responseText), xmlHttpRequst.status);           
	            } else {
	            	responseHandler(xmlHttpRequst.responseText, xmlHttpRequst.status);           
	            }
	        }
			
		};
		// Send data
		xmlHttpRequst.send(data);
	}
	else {
		console.error("Please use a browser with Ajax support.");
	}
};

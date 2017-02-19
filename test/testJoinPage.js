// Developed initially form:
//http://developer.telerik.com/featured/journey-client-side-testing-javascript/
//http://www.codechewing.com/library/javascript-dom-browser-tests-mocha-chai/

// Test Join Page at Client Side
describe("Testing join page at client side", function () {
	
  var setText = function(text, selector) {
      var input = $(selector);
      return input.val(text);
  };
  
   var getElement = function(selector) {
      return document.getElementById(selector);
  };
	
  var formElem = document.getElementById('formJoin');
  var formElem2 = document.getElementById('commentForm');
  

  it('Should confirm existence  of join form in the document', function() {
    expect(formElem).to.not.equal(null);
    expect(formElem2).to.not.equal(null);
	
  });
  
  it("Should Insert joining information", function () {
      setText('testNorah', '#username');
      setText('xxyy', '#code');
	  console.log(formElem.username.value);
	  console.log(formElem.code.value);
      expect(formElem.username.value).to.be.equal('testNorah');
	  expect(formElem.code.value).to.be.equal('xxyy');
  });
  
  it("Should Validate join form fields", function () {
      setText('', '#username');
	  getElement('submitJoin').click();
	  console.log(formElem.username.value);
  });
  
  it("Should Write comment", function () {
      setText('Comment 1', '#comment');
	  console.log(formElem2.comment.value);
      expect(formElem2.comment.value).to.be.equal('Comment 1');
  });
  
  it("Should Reset comment area", function () {
	getElement('resetC').click();
    expect(formElem2.comment.value).to.be.equal('');
  });

});
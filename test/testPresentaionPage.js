
// Test Presentaion Page at Client Side

describe("Testing presentation page at client side", function () {
	
  var getElement = function(selector) {
      return document.getElementById(selector);
  };
	
  var formElem = document.getElementById('formppt');

  it('Should confirm existence  of important elements in the document', function() {
    expect(getElement('formppt')).to.not.equal(null);
    expect(getElement('commentsSection')).to.not.equal(null);
  });
  
  it("Should Upload image", function () {
	 formElem['uploadedImages'].files.source = '1.png';
	expect([formElem['uploadedImages'].files].length).to.be.above(0);
 });
 
  
  it('Should Start Presentaion', function() {
	getElement('start').click();
     expect(getElement('controls').style.display).to.be.equal('block');
  });
  
  it('Should Review presentaion comments', function() {
	getElement('review').click();
     expect(getElement('save').style.display).to.be.equal('block');
  });
  
	it('Should Save presentaion comments', function() {
     getElement('save').click();
  });
  
  
  
 });
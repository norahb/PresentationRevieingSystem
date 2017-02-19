// Test Index Page at Client Side

describe("Testing index page at client side", function () {

  var getElement = function(selector) {
      return document.getElementById(selector);
  };
  
  it('Should confirm existence of important elements in the document', function() {
    expect(getElement('pptlink')).to.not.equal(null);
    expect(getElement('joinlink')).to.not.equal(null);
  });
  
  it('Should confirm elements have the right text', function() {
    expect(getElement('pptlink').innerHTML).to.contain('Upload Presentaion');
    expect(getElement('joinlink').innerHTML).to.contain('Join Presentaion');
  });
  
  
 });
var assert = require('assert');
var HtmlFilter = require('../index');

var htmlFilter = new HtmlFilter();

// test
describe('Test filter tag', function() {
    it('remove not support tag', function() {
        htmlFilter.allowedTags = { p: null };
        htmlFilter.filter('<div>hello</div>');
        assert.equal(htmlFilter.getHtml(), '');
    });
    
    it('remove not support tag2', function() {        
        htmlFilter.allowedTags = { p: null };
        htmlFilter.filter('<p>outer<div>hello</div></p>');
        assert.equal(htmlFilter.getHtml(), '<p>outer</p>');
    });
    
    it('remove child tag', function() {
        htmlFilter.allowedTags = { p: null, br: null };
        htmlFilter.filter('<div><br /><p>hello</p></div>');
        assert.equal(htmlFilter.getHtml(), '');
    });
    
    it('multiple top level tag', function() {        
        htmlFilter.allowedTags = { p: null };
        htmlFilter.filter('<p>show</p><div>remove</div>');
        assert.equal(htmlFilter.getHtml(), '<p>show</p>');
    });
});

describe('Test filter attr', function() {
    it('hold attr', function() {        
        htmlFilter.allowedTags = { div: {id: 1} };
        htmlFilter.filter('<div id="myid">hello</div>');
        assert.equal(htmlFilter.getHtml(), '<div id="myid">hello</div>');
    });
    
    it('remove not support attr', function() {        
        htmlFilter.allowedTags = { div: {id: 1} };
        htmlFilter.filter('<div id="myid" style="color: red">hello</div>');
        assert.equal(htmlFilter.getHtml(), '<div id="myid">hello</div>');
    });
    
    it('remove all attr', function() {        
        htmlFilter.allowedTags = { div: null };
        htmlFilter.filter('<div id="myid" style="color: red">hello</div>');
        assert.equal(htmlFilter.getHtml(), '<div>hello</div>');
    });
    
    it('special attr', function() {        
        htmlFilter.allowedTags = { div: {'data-role': 1} };
        htmlFilter.filter('<div data-role="role">hello world</div>');
        assert.equal(htmlFilter.getHtml(), '<div data-role="role">hello world</div>');
    });
});
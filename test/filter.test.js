var assert = require('assert');
var HtmlFilter = require('../index');

var htmlFilter = new HtmlFilter();

// test
describe('Test filter tag', function() {
    it('remove not support tag', function() {
        htmlFilter.allowedTags = { p: null };
        htmlFilter.parse('<div>hello</div>');
        assert.equal(htmlFilter.getHtml(), '');
    });
    
    it('remove not support tag2', function() {
        htmlFilter.reset();
        
        htmlFilter.allowedTags = { p: null };
        htmlFilter.parse('<p>outer<div>hello</div></p>');
        assert.equal(htmlFilter.getHtml(), '<p>outer</p>');
    });
    
    it('remove child tag', function() {
        htmlFilter.reset();
        
        htmlFilter.allowedTags = { p: null, br: null };
        htmlFilter.parse('<div><br /><p>hello</p></div>');
        assert.equal(htmlFilter.getHtml(), '');
    });
    
    it('multiple top level tag', function() {
        htmlFilter.reset();
        
        htmlFilter.allowedTags = { p: null };
        htmlFilter.parse('<p>show</p><div>remove</div>');
        assert.equal(htmlFilter.getHtml(), '<p>show</p>');
    });
});

describe('Test filter attr', function() {
    it('hold attr', function() {
        htmlFilter.reset();
        
        htmlFilter.allowedTags = { div: {id: 1} };
        htmlFilter.parse('<div id="myid">hello</div>');
        assert.equal(htmlFilter.getHtml(), '<div id="myid">hello</div>');
    });
    
    it('remove not support attr', function() {
        htmlFilter.reset();
        
        htmlFilter.allowedTags = { div: {id: 1} };
        htmlFilter.parse('<div id="myid" style="color: red">hello</div>');
        assert.equal(htmlFilter.getHtml(), '<div id="myid">hello</div>');
    });
    
    it('remove all attr', function() {
        htmlFilter.reset();
        
        htmlFilter.allowedTags = { div: null };
        htmlFilter.parse('<div id="myid" style="color: red">hello</div>');
        assert.equal(htmlFilter.getHtml(), '<div>hello</div>');
    });
    
    it('special attr', function() {
        htmlFilter.reset();
        
        htmlFilter.allowedTags = { div: {'data-role': 1} };
        htmlFilter.parse('<div data-role="role">hello</div>');
        assert.equal(htmlFilter.getHtml(), '<div data-role="role">hello</div>');
    });
});
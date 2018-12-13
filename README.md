## html 过滤库 A library for filtering HTML tags and attributes written in JavaScript

### change log

+ 2018-10-11 publish 2.0.0 Change parse() function to filter()
+ 2018-12-13 publish 2.0.4 Separate the dom part from main lib

### 过滤标签和属性 - filter tags and attributes

```
var html =
`
<h1><br /><p>user info</p></h1>
<div id="myid" style="border: 1px solid red">
    <div style="font-weight: bold">Hello</div>
    <br />
    <div id="user" onclick="alert(1)">
        <p>zhangsan</p>
        <p>male</p>
        <p>20</p>
    </div>
</div>
`;

var HtmlFilter = require('html-filter');
var obj = new HtmlFilter();
obj.allowedTags = {
    p: null,  // not support attr
    div: {id: 1, style: 1},  // support id and style attr
    br: null
};
obj.filter(html);

console.log(obj.getHtml())

// the console result:
<div id="myid" style="border: 1px solid red">
    <div style="font-weight: bold">Hello</div>
    <br />
    <div id="user">
        <p>zhangsan</p>
        <p>male</p>
        <p>20</p>
    </div>
</div>
```

### html 转 DOM - translate html string to DOM Element

```
var html =
`
<h1><br /><p>user info</p></h1>
<div id="myid" style="border: 1px solid red">
    <div style="font-weight: bold">Hello</div>
    <br />
    <div id="user" onclick="alert(1)">
        <p>zhangsan</p>
        <p>male</p>
        <p>20</p>
    </div>
</div>
`;

var XDom = require('html-filter/dom');
var obj = new XDom();
obj.allowedTags = {
    p: null,  // not support attr
    div: {id: 1, style: 1},  // support id and style attr
    br: null
};
obj.parse(html);

console.log(obj.getDom());
```
## html 过滤库 A library for filtering HTML tags and attributes written in JavaScript

### change log

+ npm 2.0.1 change attributes config

### 过滤标签和属性 - filter tags and attributes

```
var html =
`
<h1><br /><h1>user info</h1></h1>
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

var obj = new XHtml();
obj.allowedTags = {
    p: null,  // not support attr
    div: {id: 1, style: 1},  // support id and style attr
    br: null
};
obj.parse(html);

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
<h1><br /><h1>user info</h1></h1>
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

var obj = new XHtml.XDom();
obj.allowedTags = {
    p: null,  // not support attr
    div: {id: 1, style: 1},  // support id and style attr
    br: null
};
obj.parse(html);

console.log(obj.getDom());
```
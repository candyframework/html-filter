## html 过滤库 A library for filtering HTML tags and attributes written in JavaScript

### 过滤标签和属性 - filter tags and attributes

```
var html =
`
<h1><br /><h1>user info</h1></h1>
<div id="myid" style="border: 1px solid red">
    <p>Hello</p>
    <div id="user" onclick="alert(1)">
        <p>zhangsan</p>
        <p>male</p>
        <p>20</p>
    </div>
</div>
`;

var obj = new XHtml();
obj.allowedTags = {div: true, p: true, br: true};
obj.allowedAttributes = {id: true, style: true};
obj.parse(html);

console.log(obj.getHtml())

// the console result:
<div id="aaa" style="border: 1px solid red">
    <p>Hello</p>
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
    <p>Hello</p>
    <div id="user" onclick="alert(1)">
        <p>zhangsan</p>
        <p>male</p>
        <p>20</p>
    </div>
</div>
`;

var obj = new XHtml.XDom();
obj.allowedTags = {div: true, p: true, br: true};
obj.allowedAttributes = {id: true, style: true};
obj.parse(html);

console.log(obj.getDom());
```
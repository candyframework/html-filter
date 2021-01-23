## html 过滤库 A library for filtering HTML tags and attributes written in JavaScript

## 4.0 变化

从 4.0 开始，过滤标签时不再删除子元素，只会关注标签是否需要过滤，行为如下

```
// before 4.0
htmlFilter.allowedTags = { p: null, br: null };
htmlFilter.filter('<div><br /><p>hello</p></div>');

result is: ''
```

```
// 4.0 +
htmlFilter.allowedTags = { p: null, br: null };
htmlFilter.filter('<div><br /><p>hello</p></div>');

result is: '<br /><p>hello</p>'
```

### change log

+ 2019-01-30 publish 3.0.0 Add browser support
+ 2018-10-11 publish 2.0.0 Change parse() function to filter()
+ 2018-12-13 publish 2.0.4 Separate the dom part from main lib

### 浏览器中使用 ( Browser use )

```javascript
<script src="index.js"></script>
<script>
var htmlFilter = new HtmlFilter();
// todo sth
</script>
```

### Node.js

```javascript
const HtmlFilter = require('html-filter');
const htmlFilter = new HtmlFilter();
// todo sth
```

### 过滤标签和属性 - filter tags and attributes

```javascript
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

var obj = new HtmlFilter();
obj.allowedTags = {
    p: null,  // not support attr
    div: {id: 1, style: 1},  // support id and style attr
    br: null
};

console.log(obj.filter(html));

// the console result:
<br /><p>user info</p>
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

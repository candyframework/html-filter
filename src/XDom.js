/**
 * XDom
 */
'use strict';

export default function XDom() {
    this.doc = document;
    this.topRole = 'xdom-wrapper';
    this.unsafeRole = 'unsafe';

    // <(xxx)( data-name="lisi") xxx />
    // </(xxx)>
    // <!--(xxx)-->
    // 此正则有四个子模式
    // 1. 代表开始标签名称
    // 2. 代表整个属性部分
    // 3. 代表结束标签名称
    // 4. 代表注释内容
    this.htmlPartsRegex = /<(?:(?:(\w+)((?:\s+[\w\-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^>\s]+))?)*)[\S\s]*?\/?>)|(?:\/([^>]+)>)|(?:!--([\S|\s]*?)-->))/g;

    // (title)="()"
    this.attributesRegex = /(?:([\w\-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^>\s]+)))?)/g;

    /**
     * Legal tags
     *
     * {
     *     p: null,
     *     img: {src: 1, width: 1, height: 1},
     *     ...
     * }
     */
    this.allowedTags = null;

    this.reset();
}
XDom.prototype = {
    constructor: XDom,

    reset: function() {
        // 存放父容器
        this.lookingBackTagStack = new XDomStack();

        // 初始放入一个顶级容器
        var node = this.doc.createElement('div');
        node.setAttribute('data-role', this.topRole);
        this.lookingBackTagStack.push(node);

        node = null;
    },

    /**
     * Get the support attributes of a tag
     *
     * @param {String} nodeName
     * @return null | Object
     */
    getAllowedAttributes: function(nodeName) {
        // tag not in white list or tag not support attributes
        if(undefined === this.allowedTags[nodeName] || null === this.allowedTags[nodeName]) {
            return null;
        }

        return this.allowedTags[nodeName];
    },

    onText: function(text) {
        var node = this.doc.createTextNode(text);

        this.lookingBackTagStack.getTop().appendChild(node);

        node = null;
    },

    onClose: function(tagName) {
        var node = this.lookingBackTagStack.pop();

        // 删除标签
        if(this.unsafeRole === node.getAttribute('data-role')) {
            node.parentNode.removeChild(node);
        }

        node = null;
    },

    onOpen: function(tagName, attributes) {
        var nodeName = tagName.toLowerCase();
        var attrs = attributes;

        // attributes filter
        var allowedAttributes = this.getAllowedAttributes(nodeName);
        if(null !== allowedAttributes) {
            for(var k in attrs) {
                if(undefined === allowedAttributes[k]) {
                    delete attrs[k];
                }
            }
        }

        var node = this.doc.createElement(nodeName);

        if(null !== allowedAttributes) {
            for(var k in attrs) {
                node.setAttribute(k, attrs[k]);
            }
        }

        // 设置了标签过滤
        if(null !== this.allowedTags
            && undefined === this.allowedTags[nodeName]) {
            node.setAttribute('data-role', this.unsafeRole);
        }

        /*
        // 子元素
        this.lookingBackTagStack.getTop().appendChild(node);

        // 直接删除不安全自闭合标签
        if(1 === XDom.selfClosingTags[nodeName]
            && this.unsafeRole === node.getAttribute('data-role')) {
            this.lookingBackTagStack.getTop().removeChild(node);
        }
        */
        if(1 !== XDom.selfClosingTags[nodeName]
            || (1 === XDom.selfClosingTags[nodeName]
                && this.unsafeRole !== node.getAttribute('data-role'))) {

            this.lookingBackTagStack.getTop().appendChild(node);
        }

        // 开始标签入栈 可以作为父容器使用
        if(1 !== XDom.selfClosingTags[nodeName]) {
            this.lookingBackTagStack.push(node);
        }

        node = null;
    },

    onComment: function(content) {
        var node = this.doc.createComment(content);

        this.lookingBackTagStack.getTop().appendChild(node);

        node = null;
    },

    /**
     * parse html
     *
     * @param {String} html
     */
    parse: function(html) {
        var parts = null;
        // the index at which to start the next match
        var lastIndex = 0;
        var tagName = '';

        while( null !== (parts = this.htmlPartsRegex.exec(html)) ) {
            // TextNode
            if(parts.index > lastIndex) {
                var text = html.substring( lastIndex, parts.index );

                this.onText(text);
            }
            lastIndex = this.htmlPartsRegex.lastIndex;

            // closing tag
            if( (tagName = parts[3]) ) {
                this.onClose(tagName);

                continue;
            }

            // opening tag & selfClosingTag
            if( (tagName = parts[1]) ) {

                var attrParts = null;
                var attrs = {};

                // attributes
                if(parts[2]) {
                    while ( null !== ( attrParts = this.attributesRegex.exec(parts[2]) ) ) {
                        var attrName = attrParts[1];
                        var attrValue = attrParts[2] || attrParts[3] || attrParts[4] || '';

                        // empty attr
                        if(attrParts[5]) {
                            attrName = attrParts[5];
                            if(XDom.emptyAttributes[attrName]) {
                                attrs[attrName] = attrName;
                            }

                            continue;
                        }

                        if(XDom.emptyAttributes[attrName]) {
                            attrs[attrName] = attrName;

                        } else {
                            attrs[attrName] = attrValue;
                        }
                    }
                }

                this.onOpen(tagName, attrs);

                continue;
            }

            // comment
            if( (tagName = parts[4]) ) {
                this.onComment(tagName);
            }
        }

        var top = this.lookingBackTagStack.getTop();
        if(null !== top && this.topRole !== top.getAttribute('data-role')) {
            throw new Error('unpaired tags');
        }
    },

    /**
     * get dom
     *
     * @return Object
     */
    getDom: function() {
        return this.lookingBackTagStack.getBottom();
    }
};

/**
 * selfClosingTag
 */
XDom.selfClosingTags = {
    meta: 1,
    base: 1,
    link: 1,
    hr: 1,
    br: 1,
    wbr: 1,
    col: 1,
    img: 1,
    area: 1,
    input: 1,
    textarea: 1,
    embed: 1,
    param: 1,
    source: 1,
    object: 1
};

/**
 * 可以为空的属性
 */
XDom.emptyAttributes = {
    checked: 1,
    compact: 1,
    declare: 1,
    defer: 1,
    disabled: 1,
    ismap: 1,
    multiple: 1,
    nohref: 1,
    noresize: 1,
    noshade: 1,
    nowrap: 1,
    readonly: 1,
    selected: 1
};

/**
 * Stack
 */
function XDomStack() {
    this.headNode = null;
    this.tailNode = null;
    this.size = 0;
}
XDomStack.prototype = {
    constructor: XDomStack,

    push: function(data) {
        var node = new XDomStackNode(data, null, null);

        if(0 === this.size) {
            this.headNode = node;

        } else {
            this.tailNode.next = node;
            node.prev = this.tailNode;
        }

        this.tailNode = node;

        this.size++;
    },

    pop: function() {
        var ret = this.tailNode.data;

        if(0 === this.size) {
            return null;
        }
        if(1 === this.size) {
            this.headNode = this.tailNode = null;
            this.size--;

            return ret;
        }

        this.tailNode = this.tailNode.prev;
        this.tailNode.next.prev = null;
        this.tailNode.next = null;
        this.size--;

        return ret;
    },

    getBottom: function() {
        return null === this.headNode ? null : this.headNode.data;
    },

    getTop: function() {
        return null === this.tailNode ? null : this.tailNode.data;
    },

    clear: function() {
        while(0 !== this.size) {
            this.pop();
        }
    },

    toString: function() {
        var str = '[ ';

        for(var current = this.headNode; null !== current; current = current.next) {
            str += current.data + ' ';
        }

        return str + ' ]';
    }
};

/**
 * Node
 */
function XDomStackNode(data, prev, next) {
    this.data = data;
    this.prev = prev;
    this.next = next;
}

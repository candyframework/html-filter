/**
 * HtmlFilter
 *
 * @author afu
 */
'use strict';

export default function HtmlFilter() {

    // <(xxx)( data-name="lisi") xxx />
    // </(xxx)>
    // <!--(xxx)-->
    // 此正则有四个子模式
    // 1. 代表开始标签名称
    // 2. 代表整个属性部分 该部分可有可无
    // 3. 代表结束标签名称
    // 4. 代表注释内容
    this.htmlPartsRegex = /(?:<([-\w]+)((?:\s+[-\w]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^>\s]+))?)*)[\S\s]*?\/?>)|(?:<\/([^>]+)>)|(?:<!--([\S|\s]*?)-->)/g;
    //                         |______|       |_____|         |_________________________|     |__________|     |_________|
    //                        开始标签名      属性名                     属性值                 标签结束        结束标签

    // (disabled)
    // (title)="()"
    // (title)='()'
    // (title)=()
    this.attributesRegex = /(?:([-\w]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^>\s]+)))?)/g;

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

    /**
     * Whether allow comment tag
     */
    this.allowComment = false;

    /**
     * result string
     */
    this.htmlString = '';

}
HtmlFilter.prototype = {
    constructor: HtmlFilter,
    reset: function() {
        this.htmlString = '';
    },

    /**
     * Determine whether a tag is a selfClosingTag
     *
     * @param {String} nodeName
     * @return Boolean
     */
    isSelfClosingTag: function(nodeName) {
        return 1 === HtmlFilter.TAGS_SELFCLOSING[nodeName];
    },

    /**
     * Determine whether a attribute is empty
     *
     * @param {String} attribute
     * @return Boolean
     */
    isEmptyAttribute: function(attribute) {
        return 1 === HtmlFilter.ATTRIBUTES_EMPTY[attribute];
    },

    /**
     * Get the support attributes of a tag
     *
     * @param {String} nodeName
     * @return null | Object
     */
    getAllowedAttributes: function(nodeName) {
        if(null === this.allowedTags) {
            return null;
        }

        // tag not in white list or tag not support attributes
        if(undefined === this.allowedTags[nodeName] || null === this.allowedTags[nodeName]) {
            return null;
        }

        return this.allowedTags[nodeName];
    },

    /**
     * Determine whether the tag is legitimate
     *
     * @param {String} nodeName
     * @return Boolean
     */
    isAllowedTag: function(nodeName) {
        if(null === this.allowedTags) {
            return false;
        }

        // white list
        // null is exists yet
        if(undefined !== this.allowedTags[nodeName]) {
            return true;
        }

        return false;
    },

    filterAttribute: function(name, value) {
        return value.replace(/"/g, '');
    },

    onOpen: function(tagName, attributes) {
        var nodeName = tagName.toLowerCase();
        var attrs = attributes;
        var nodeString = '';

        // 非法标签
        if(!this.isAllowedTag(nodeName)) {
            return;
        }

        // attributes filter
        var allowedAttributes = this.getAllowedAttributes(nodeName);
        if(null !== allowedAttributes) {
            for(var k in attrs) {
                if(undefined === allowedAttributes[k]) {
                    delete attrs[k];
                }
            }
        }

        nodeString = '<' + nodeName;

        // null means not support attributes
        if(null !== allowedAttributes) {
            for(var k in attrs) {
                nodeString += (' ' + k + '="' + this.filterAttribute(k, attrs[k]) + '"');
            }
        }

        // selfClosingTag
        if(this.isSelfClosingTag(nodeName)) {
            nodeString += ' /';
        }

        nodeString += '>';

        this.htmlString += nodeString;
    },

    onClose: function(tagName) {
        var nodeName = tagName.toLowerCase();

        // 非法标签
        if(!this.isAllowedTag(nodeName)) {
            return;
        }

        this.htmlString += '</' + nodeName + '>';
    },

    onComment: function(content) {
        if(!this.allowComment) {
            return;
        }

        this.onText('<!--' + content + '-->');
    },

    onText: function(text) {
        this.htmlString += text;
    },

    /**
     * filter html
     *
     * @param {String} html
     */
    filter: function(html) {
        var parts = null;
        // the index at which to start the next match
        var lastIndex = 0;
        var tagName = '';
        // 添加临时节点 以便进行匹配
        var htmlString = html + '<htmlfilter />';

        // reset first
        this.reset();

        while( null !== (parts = this.htmlPartsRegex.exec(htmlString)) ) {
            // TextNode
            if(parts.index > lastIndex) {
                var text = htmlString.substring( lastIndex, parts.index );

                this.onText(text);
            }
            lastIndex = this.htmlPartsRegex.lastIndex;

            // closing tag
            if( (tagName = parts[3]) ) {
                this.onClose(tagName);

                continue;
            }

            // opening tag or selfClosingTag
            if( (tagName = parts[1]) ) {

                var attrParts = null;
                var attrs = {};

                // attributes
                if(parts[2]) {
                    while( null !== ( attrParts = this.attributesRegex.exec(parts[2]) ) ) {
                        var attrName = attrParts[1];
                        var attrValue = '';
                        if(attrParts[2]) {
                            attrValue = attrParts[2];

                        } else if(attrParts[3]) {
                            attrValue = attrParts[3];

                        } else if(attrParts[4]) {
                            attrValue = attrParts[4];
                        }

                        if(this.isEmptyAttribute(attrName)) {
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
            if( parts[4] ) {
                this.onComment(parts[4]);
            }
        }

        return this.getHtml();
    },

    /**
     * get html
     */
    getHtml: function() {
        return this.htmlString;
    }
};

/**
 * selfClosingTag
 */
HtmlFilter.TAGS_SELFCLOSING = {
    area: 1,
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
HtmlFilter.ATTRIBUTES_EMPTY = {
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

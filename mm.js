
(function(__global, factory) {
    console.log(__global)
    __global.$ = factory();
})(typeof window === undefined ? this : window, function() {

"use strict";

var support = {};
var _global = typeof window === undefined ? this : window;
var doc = _global.document;
var docElem = doc.documentElement;



function createElement(tagName) {
    var el = doc.createElement(tagName);
    return el;
}


// from jQuery
function assert (fn) {
    // local `documentElement`
    var _docElem = createElement("fieldset");
    try {
        return !!fn( docElem );
    } catch (e) {
        return false;
    } finally {
        // Remove from its parent by default
        removeChild(docElem);

        // release memory in IE
        _docElem = null;
    }
}



function getElementById(el) {
    // we can also get element by id from `globalView` like => this["" + element_id + ""]
    return doc.getElementById(el) || _global[ el ];
}

function getElementsByTagName(parent, elements) {
    parent = parent || doc;
    return parent.getElementsByTagName(elements);
}

function getElementsByClassName(parent, elements) {
    parent = parent || doc;
    return parent.getElementsByClassName(elements);
}

function getElementsByName(elements) {
    return doc.getElementsByName(elements);
}



/*
  Main class which have all methods and all properties
  default empty selector
*/
var Selector = function Selector() {
    /* default length */
    this.length = 0;
};

Selector.prototype.get = function(index) {
    return this[ index || 0 ];
};
Selector.prototype.push = function(newElement) {
    this[ this.length ] = newElement;
    this.length += 1;
};

function createOneElementSelector (element) {
    function ff() {}
    var self = new Selector();
    self[ 0 ] = element;
    self.length = 1;
    return self;
}

function extend (_to, _from) {
    for (var key in _from) {
        _to[ key ] = _from[ key ];
    }
}
function each (array, callback) {
    for (var index in array) {
        if (callback(index, array[ index ]) === true) {
            break;
        }
    }
}


function $(el) {
    var sel = new Selector();

    if (!el) {
        return sel;
    }

    // when selector is element
    if (isNodeElement( el )) {
        sel.push(el);
        return sel;
    }

    var firstChar = el.charAt(0);
    var name = el.slice(1);
    switch (firstChar) {
        case "#":
            sel.push(getElementById(name));
            return sel;
        case ".":
            var elems = getElementsByClassName(doc, name);
            extend(sel, elems);
            sel.length = elems.length;
            return sel;
        default:
            var elems = getElementsByTagName(doc, name);
            sel.length = elems.length;
            return;
    }
}



function putM(methods) {
    each(methods, function (name, method) {
        Selector.prototype[ name ] = function() {
            if (isFunc(method)) {
                var __args = arguments;
                var self =  this;
                if (self.length === 1) {
                    var elem = self.get(0);
                    var sel = createOneElementSelector( elem );
                    return method.apply(sel, __args);
                }
                each(self, function(_, element) {
                    var sel = createOneElementSelector( element );
                    method.apply(sel, __args);
                });
            }
        };
    });
}

// return "[object + className +]" like => "[object String]"
function getType(_class) {
    var className = Object.prototype.toString.call(_class).toLowerCase().split('');
    return className[0].slice(0, -1);
}

// main typing
function isArray(obj) {return Array.isArray(obj) || obj instanceof Array;}
function isFunc(obj) {return typeof obj === "function" && !isNumber(obj.nodeType);}
function isBool(obj) {return typeof obj === "boolean";}
function isNul(obj) {return obj === null;}
function isObject(obj) {return typeof obj === "object" && !isString(obj) && !isNul(obj) && !isArray(obj);}
function isString(obj) {return typeof obj === "string";}
function isNumber(obj) {return typeof obj === "number" && !isNaN(obj);}
function isUndef(obj) {return obj === undefined;}
function isDef(obj) {return !isUndef(obj);}
function isRegExp(obj) {return getType(obj) === "regexp" || obj instanceof RegExp;}


        






var ButtonMouse = {};
ButtonMouse["left"] = 0;
ButtonMouse["middle"] = 1;
ButtonMouse["right"] = 2;



var EventsKeyboard = "keydown|keyup|keypress".split('|');
var EventsMouse = "mousemove|mouseenter|mousedown|mouseup|mouseout|mouseover".split('|');
var KeysNN = "ctrl|alt|shift|meta".split('|');




function once (fn) {
    var called = false;
    return function() {
        var self = this;
        var __args = arguments;
        if (!called) {
            called = true;
            fn.apply(self, __args);
        }
    };
}



function addEventListener (el, eventName, handler) {
    if (el) {
        if (el.addEventListener) {
            el.addEventListener(eventName, handler, false);
        // IE
        } else if (el.attachEvent) {
            el.attachEvent( "on" + eventName, handler );
        // normal way to add event
        } else {
            el[ "n" + eventName ] = function(e) {
                handler.call(this, e);
            };
        }
    }
}



putM({

    fullScreen: function() {
        var el = this.get(0);
        if ('requestFullscreen' in el && isFunc( el.requestFullscreen )) {
            el.requestFullscreen();
        } else if ('webkitRequestFullscreen' in el && isFunc( el.webkitRequestFullscreen )) {
            el.webkitRequestFullscreen();
        } else if ('mozRequestFullscreen' in el && isFunc( el.mozRequestFullscreen )) {
            el.mozRequestFullscreen();
        } else if ('msRequestFullscreen' in el && isFunc( el.msRequestFullscreen )) {
            el.msRequestFullscreen();
        }
    },

    exitFullscreen: function() {
        if (doc.exitFullscreen) {
            doc.exitFullscreen();
        } else if (doc.msExitFullscreen) {
            doc.msExitFullscreen();
        } else if (doc.mozCancelFullScreen) {
            doc.mozCancelFullScreen();
        } else if (doc.webkitCancelFullScreen) {
            doc.webkitCancelFullScreen();
        }
    },

    each: function(callback) {
        each(this.elements, function(index, element) {
            callback.apply(createOneSelector(element), index, element);
        });
    },
    on: function(nameEvent, keyCode, callback) {
        var el = this.get(0);
        var call = function () {
            (isFunc(keyCode) ? keyCode: callback ).call(null, event);
        };

        function callFnEvent(event) {
            event = event || _global.event;
            var newEvent = {
                x: event.clientX || event.x,
                y: event.clientY || event.y,
            };

            if (isFunc(keyCode)) {
                call();

            } else if (isString(keyCode)) {
                var keys = keyCode.split("+");
                if (keys.indexOf("ctrl") !== -1 && event.ctrlKey === false) return;
                if (keys.indexOf("alt") !== -1 && event.altKey === false) return;
                if (keys.indexOf("shift") !== -1 && event.shiftKey === false) return;
                if (keys.indexOf("meta") !== -1 && event.metaKey === false) return;

                if (keyCode === String.fromCharCode(event.which).toLowerCase()) call();
                if (ButtonMouse[ keys[ keys.length - 1 ].toLowerCase() ] === event.button) {
                    call();
                }
            } else if (isNumber(keyCode)) {
                if (event.which === keyCode) {
                    call();
                }
            }
        }

        if (isArray(nameEvent)) {
            each(nameEvent, function(i, eventName) {
                addEventListener(el, eventName, callFnEvent);
            });
        } else {
            addEventListener(el, nameEvent, callFnEvent);
        }
    },
    once: function(eventName, keyCode, callback) {
        var self = this;
        function fn() {
            self.on(eventName, keyCode, callback);
        }
        fn();
    },
    click: function(keyCode, callback) {
        this.on("click", keyCode, callback);
    },
    focus: function() {
        var elem = this.get(0);
        elem.focus();
    },
    blur: function() {
        var elem = this.get(0);
        elem.focus();
    }
});


function isPropNameSyntaxCSS(porp) {
    return porp.indexOf("-") !== -1;
}

function namePropCSSToJavaScriptSyntax(porp) {
    var next = false;
    var start = true;
    var newName = "";
    for (var i in porp) {
        if (porp[ i ] === "-" && !start) next = true;
        if (porp[ i ] !== "-" && next) {
            newName += porp[ i ].toUpperCase();
            next = false;
        } else {
            newName += porp[ i ].toLowerCase();
        }
        start = false;
    }
    return newName;
}

//console.log(namePropCSSToJavaScriptSyntax("background-color"))

function setStyle (el, name, value) {
    el.style[ name ] = value;
}

function getStyles (el) {
    // from `https://stackoverflow.com/questions/9183555/whats-the-point-of-document-defaultview#:~:text=The%20document.,the%20code%20you%20are%20running.`
    var view = (el.ownerDocument && el.ownerDocument.defaultView) ?
                el.ownerDocument.defaultView : _global;

    // get by `window.getComputedStyle`
    if (view.getComputedStyle) {
        return view.getComputedStyle(el);
    } else if (el.currentStyle) {
    }
}


var TypeNodeElement = Node.ELEMENT_NODE || 1


function isNodeElement (node) {
    return node.nodeType === TypeNodeElement;
}


function hasClass (el, cls) {
    if (isNodeElement( el )) {
        if (el.classList && isFunc( el.classList.contains )) {
            return el.classList.contains(cls);
        } else {
            // try another way
            var val = $(el).attr("class");

            // return false if class attribute not exists
            if (val === null) return false;

            // return if class exists in attribute `class`
            return val.trim().split(' ').indexOf(cls) !== -1;
        }
    }
}
function addClass (el, cls) {
    var arr = cls.split(" ");
    if (isNodeElement( el )) {
        each(arr, function(i, _cls) {
            if (el.classList && isFunc(el.classList.ad)) {
                el.classList.add(_cls);
            } else {

                // try another way
                var elem = $(el);

                // create attribute class if not exist
                if (!elem.hasAttr("class")) {
                    elem.attr("class", "");
                }

                var oldVal = elem.attr("class").split(" ");

                // check if old value not contains new class
                if (oldVal.indexOf(_cls) === -1) {
                    oldVal.push(_cls);
                    var newVal = oldVal.join(" ");
                    elem.attr("class", newVal);
                    print(elem.attr("class"))
                }
            }
        });
    }
}
function removeClass (el, cls) {
    var arr = cls.split(" ");
    each(arr, function(i, _cls) {
        if (el && el.classList && isFunc(el.classList.remove)) {
            el.classList.remove(_cls);
        }
    });
}

putM({
    css: function(name, value) {
        var el = this.get(0);
        if (isUndef(value)) return getStyles(el)[ name ];
        if (isObject(name)) {
            for (var i in name) {
                setStyle(el, i, name[ i ]);
            }
        } else if (isDef(value)) {
            setStyle(el, name, value);
        }
    },

    scale: function (x, y) {
        if (isDef(y)) this.css("transform", `scaleX(${x}) scaleY(${x})`);
        else this.css("transform", `scale(${x})`);
    },

    hasClass: function (cls) {
        var el = this.get(0);
        return hasClass(el, cls);
    },

    addClass: function (name) {
        if (!this.hasClass(name)) {
            addClass(this.get(0), name);
        }
    },

    removeClass: function (name) {
        if (this.hasClass(name)) {
            removeClass(this.get(0), name);
            if (!this.attr('class')) {
                this.removeAttr('class');
            }
        }
    }
});



function appendChild (parentNode, child) {
    parentNode.appendChild(child);
}
function prendChild (parentNode, child) {
    parentNode.appendChild(child);
}

putM({

});


putM({
    width: function(value) {
        if (isUndef(value)) return this.get(0).width;
        this.get(0).width = value;
    },
    height: function(value) {
        if (isUndef(value)) return this.get(0).height;
        this.get(0).height = value;
    },
    val: function(value) {
        var elem = this.get(0);
        if (isUndef(value)) {
            return elem.value;
        }
        elem.value = value;
    },
    text: function(value) {
        this.get(0).textContent = value;
    },
    html: function(value) {
        this.get(0).innerHTML = value;
    }
});




putM({
    tag: function(newName) {
        let elem = this.get(0);
        if (isUndef(newName)) {
            return elem.tagName.toLowerCase();
        }
    },
    id: function (id) {
        return this.attr("id", id);
    },
    clone: function() {
    },
    hasAttr: function (attr) {
        var el = this.get(0);
        if (isNodeElement( el )) {
            if (el.hasAttribute && isFunc( el.hasAttribute )) {
                return el.hasAttribute( attr );
            } else {
                // try another way
                var val = this.attr(attr);
                if (isNul(val)) { return false; }
                else { return true; }
            }
        }
        return false;
    },
    attr: function (name, value) {
        var el = this.get(0);

        // return value of attribute by name
        if (isString(name) && isUndef(value)) {
            if (el.getAttribute && isFunc( el.getAttribute )) {
                var value = el.getAttribute(name);
                if (isNul(value)) return null;
                if (value.toLowerCase() === "true" || value === "!0") return true;
                else if (value.toLowerCase() === "false" || value === "!1") return false;
                else {
                    try {
                        var realVal = JSON.parse(value);
                        return realVal;
                    } catch(e) {
                        return value;
                    }
                }
            }

        // set new value for attribute
        } else {
            if (el.setAttribute && isFunc( el.setAttribute )) {
                if (isObject( name )) {
                    each(name, function(_name, _value) {
                        el.setAttribute(_name, _value);
                    });
                } else {
                    el.setAttribute(name, value);
                }
            }
        }
    },
    removeAttr: function(attr) {
        var el = this.get(0);
        if (this.hasAttr(attr) && el.removeAttribute && isFunc( el.removeAttribute )) {
            el.removeAttribute(attr);
        }
    },
    data: function (name, value) {
        return this.attr("data-" + name, value);
    },
    hasData: function (name) {
        return this.hasAttr("data-" + name);
    },
    removeData: function (name) {
        this.removeAttr("data-" + name);
    }
});


function removeNode (node) {
    if (node.parentNode) {
        node.parentNode.removeChild(node);
    } else {
        node.remove();
        try {
        } catch (e) {}
    }
}


putM({
    parent: function() {
        var el = this.get(0);
        let parent = el.parentNode;
        if (parent) return $(parent);
        else return $(docElem);
    },
    remove: function() {
        var el = this.get(0);
        removeNode(el);
    },
    empty: function() {
        var el = this.get(0);
        print(el.childNodes)
        for (const child = el.firstChild; el.firstChild; el = el.firstChild) {
            print(child);
            removeNode(child);
        }
        // try to make it empty
        //this.html("");
    }
});



putM({
    hide: function (timeout) {
        if (isNumber(timeout) && timeout >= 0) {
            setTimeout(() => this.hide(undefined), timeout);
        } else {
            var display = this.css("display");
            this.data("display", display === "none" ? "block": display);
            this.css("display", "none");
        }
    },

    show: function (timeout) {
        if (isNumber(timeout) && timeout >= 0) {
            setTimeout(() => this.show(undefined), timeout);
        } else {
            var data = this.data("display");
            if (data != "") {
                this.css("display", data);
            }
        }
    },
    toggle: function() {
        if (this.css("display") === "none") {
            this.show();
        } else {
            this.hide();
        }
    },
    opacity: function (deg) {
        if (isUndef(deg)) {
            return this.css("opacity");
        } else if (isNumber( deg )) {
            this.css("opacity", deg);
        }
    },
    gone: function (deg) {
        this.css("opacity", deg);
    },
    fadeIn: function() {},
    fadeOut: function() {},
});


return $;

});

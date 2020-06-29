
(function(__global, factory) {
    __global.$ = factory.call({});
})(typeof window === "undefined" ? this : window, function() {

"use strict";

var support = {};
var _global = typeof window !== "undefined" ? window : this;
var doc = _global.document;
var docElem = doc.documentElement || doc.getElementsByTagName("html")[ 0 ] || doc.querySelectorAll("html")[ 0 ] || doc.querySelector("html");


function print(text) {
    console.log(text);
}


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


function timeout(fn, time) {
    (_global || timers).setTimeout(fn, time || 0);
}





function createElement (tagName) {
    var el = doc.createElement(tagName);
    return el;
}
// remove node
function removeNode (node) {
    if (node.nodeType === TypeNodeDocument && doc.removeChild) {
        doc.removeChild(node);
    } else {
        var parent = node.parentNode || node.parentElement;
        if (parent && parent.removeChild) {
            parent.removeChild(node);
        } else  {
            try {
                node.remove();
            } catch (e) {}
        }
    }
}
function appendNode (parent, node) {
    parent.appendChild(node);
}
function setAttribute (el, name, value) {
    if (el) {
        if (el.setAttribute && isFunc( el.setAttribute )) {
            el.setAttribute(name, value);
        }
    }
}
















// from jQuery
// you not need to remove your children which you created before because we will remove it for you
function assert (fn) {
    // local `document.documentElement`
    var localDocElem = createElement("fieldset");

    // we here work at background
    // user should not see `local document`
    setAttribute(localDocElem, "style", "display: none;opacity: 0;");
    appendNode(docElem, localDocElem);

    try {
        return !!fn( localDocElem );
    } catch (e) {
        return false;
    } finally {
        // Remove from its parent by default
        removeNode(localDocElem);

        // release memory in IE
        localDocElem = null;
    }
}


support.querySelector = assert(function(local) {
    var el_1 = createElement("input");
    var el_2 = createElement("input");
    appendNode(local, el_1);
    appendNode(local, el_2);
    return local.querySelector("input").value === "";
});

// create new id was not created yet
function createUnsedId() {
    var newId = "abc";
    // check if element which have id like `newId` not exist
    while ((newId in _global) || !!getElementById( newId )) {
        newId = "abc" + Math.floor(Math.random() * 1000);
    }
    return newId;
}

support.getElementById = assert(function(local) {
    var el = createElement("input");
    var id = createUnsedId();
    setAttribute(el, "value", "123");
    setAttribute(el, "id", id);
    appendNode(local, el);
    var _el = doc.getElementById(id);
    return _el.value === "123";
});

support.getElementsByTagName = assert(function(local) {
    var el = createElement("input");
    setAttribute(el, "value", "123");
    setAttribute(el, "id", id);
    appendNode(local, el);
    var _el = doc.getElementById(id);
    return _el.value === "123";
});

support.getElementsByTagName = assert(function(local) {
    var el = createElement("input");
    appendNode(local, el);
    return local.getElementsByTagName("input").length;
});


// id maybe number `<input id="1">`
// it can work so we will change id to string like => (1 => "1")
function getElementById (el) {
    el = el + "";
    if (support.getElementById) {
        return doc.getElementById(el);
    } else if (support.querySelector) {
        return doc.querySelector("#" + el);
    }
    // we can also get element by id from `globalView` like => (this["" + element_id + ""] || window["" + element_id + ""])
    // may id is number we have to change to string
    return  _global[ el ];
}

function getElementsByTagName (parent, tag) {
    parent = parent || doc;
    if (isNodeElement( parent ) || isNodeDocument( parent )) {
        if (support.getElementsByTagName) {
            return parent.getElementsByTagName(tag);
        }
    }
}
function getElementsByClassName (parent, tag) {
    parent = parent || doc;
    return parent.getElementsByClassName(tag);
}
function getElementsByName (elements) {
    return doc.getElementsByName(elements);
}




function createOneElementSelector (el) {
    function ff() {}
    var self = new Selector();
    self.push(el);
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


function charAt (string, index) {
    return string[ index ];
}
function slice () {
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

    var firstChar = charAt(el, 0);
    var name = "";
    for (var i = 1; i < el.length; i++) {
        name += charAt(el, i);
    }
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
            var elems = getElementsByTagName(doc, el);
            var i = 0;
            for (;i < elems.length; i++) {
                sel.push(elems[ i ]);
            }
            return sel;
    }
}



function putM(methods) {
    each(methods, function (name, method) {
        Selector.prototype[ name ] = function() {
            var __args = arguments;
            var self =  this;
            if (isFunc( method )) {
                // work with one element
                if (self.length === 1) {
                    var elem = self.get(0);
                    var sel = createOneElementSelector( elem );
                    return method.apply(sel, __args);
                }
                for (var i = 0; i < self.length; i++) {
                    var el = self[ i ];
                    var sel = createOneElementSelector( el );
                    method.apply(sel, __args);
                }
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


var fromParentToChild = true;
var fromChildToParent = false;
function addEventListener (el, eventName, handler, useCapture) {
    useCapture = useCapture || false;
    if (el) {
        if (el.addEventListener) {
            el.addEventListener(eventName, handler, useCapture);
        // IE
        } else if (el.attachEvent) {
            el.attachEvent( "on" + eventName, handler, useCapture);
        // normal way to add event
        } else {
            el[ "on" + eventName ] = function(e) {
                handler.call(this, e);
            };
        }
    }
}


support.fullscreen = 'requestFullscreen' in docElem
                   ||'webkitRequestFullscreen' in docElem
                   ||'mozRequestFullscreen' in docElem
                   ||'msRequestFullscreen' in docElem;

// methods to controll `fullscreen` feature
putM({
    fullscreen: function (enter) {
        // enter = enter || true;
        var el = this.get(0);

        // from `https://shaka-player-demo.appspot.com/docs/api/lib_polyfill_fullscreen.js.html`
        var fullscreenElement = doc.fullscreenElement || doc.msFullscreenElement || doc.mozFullscreenElement || doc.webkitFullscreenElement;
        var fullscreenEnabled = doc.fullscreenEnabled || doc.mozFullScreenEnabled || doc.msFullscreenEnabled || doc.webkitFullscreenEnabled;

        if (support.fullscreen) {
            if (enter && !fullscreenElement) {
                if (isFunc( el.requestFullscreen )) {
                    el.requestFullscreen();
                } else if (isFunc( el.webkitRequestFullscreen )) {
                    el.webkitRequestFullscreen();
                } else if (isFunc( el.mozRequestFullscreen )) {
                    el.mozRequestFullscreen();
                } else if (isFunc( el.msRequestFullscreen )) {
                    el.msRequestFullscreen();
                }
            } else {
                if ('exitFullscreen' in doc && isFunc( doc.exitFullscreen )) {
                    doc.exitFullscreen();
                } else if ('msExitFullscreen' in doc && isFunc( doc.msExitFullscreen )) {
                    doc.msExitFullscreen();
                } else if ('mozCancelFullScreen' in doc && isFunc( doc.mozCancelFullScreen )) {
                    doc.mozCancelFullScreen();
                } else if ('webkitCancelFullScreen' in doc && isFunc( doc.webkitCancelFullScreen )) {
                    doc.webkitCancelFullScreen();
                }
            }
        }
    },

});





function on (el, nameEvent, keyCode, callback) {

}


var EventsKeyboard = "keydown|keyup|keypress".split('|');
var EventsMouse = "mousemove|mouseenter|mousedown|mouseup|mouseout|mouseover".split('|');
var KeysNN = "ctrl|alt|shift|meta".split('|');


putM({
    each: function(callback) {
        each(this.elements, function(index, element) {
            callback.apply(createOneSelector(element), index, element);
        });
    },

    // you can understand it from
    //    `https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/Determining_the_dimensions_of_elements`
    // or `https://stackoverflow.com/questions/21064101/understanding-offsetwidth-clientwidth-scrollwidth-and-height-respectively`

    offset: function() {
        var el = this.get(0);
        return {
            left: function() { return el.offsetLeft; },
            top: function() { return el.offsetTop; },
            width: function() { return el.offsetWidth; },
            height: function() { return el.offsetHeight; },
        };
    },

    realWidth: function() {
        return this.get(0).getBoundingClientRect().width;
    },
    realHeight: function() {
        return this.get(0).getBoundingClientRect().height;
    },

    on: function (nameEvent, keyCode, callback) {
        var el = this.get(0);
        var self = this;
        var rect = el.getBoundingClientRect();
        var call = function (_event_) {
            (isFunc(keyCode) ? keyCode: callback ).call(null, _event_);
        };

        // when call event
        function callFnEvent (ev) {
            var _event = ev || _global.event;
            var clientX = _event.clientX || _event.x;
            var clientY = _event.clientY || _event.y;
            var newEvent = {
                type: nameEvent,
                target: _event.target,
                ctrl: _event.ctrlKey,
                alt: _event.altKey,
                shift: _event.shiftKey,
                stop: function() {
                    _event.stopPropagation();
                },
                restart: function() {
                    _event.returnValue = false;
                }
            };

            if (_event instanceof KeyboardEvent && /^key/.test( nameEvent )) {
                print(ev)
                var code = _event.which || _event.keyCode || 0;
                newEvent.code = code;

            }

            if (_event instanceof MouseEvent) {
                newEvent.screenX = _event.screenX;
                newEvent.screenY = _event.screenY;
                newEvent.x = Math.floor((clientX - rect.left ) / ( rect.right - rect.left ) * self.offset().width());
                newEvent.y = Math.floor((clientY - rect.top ) / ( rect.bottom - rect.top ) * self.offset().height());
            }

            if (isFunc(keyCode)) {
                call(newEvent);

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
                    call(newEvent);
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

    emit: function (eventName) {},

    once: function(eventName, keyCode, callback) {
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
var TypeNodeDocument = Node.DOCUMENT_NODE || 9


function isNodeElement (node) {
    return node.nodeType === TypeNodeElement;
}
function isNodeDocument (node) {
    return node.nodeType === TypeNodeDocument;
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
        if (isDef(y)) { this.css("transform", "scaleX(${x}) scaleY(${x})"); }
        else { this.css("transform", "scale(${x})"); }
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
            if (isObject( name )) {
                each(name, function(_name, _value) {
                    setAttribute(el, _name, _value);
                });
            } else {
                setAttribute(el, name, value);
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








putM({
    parent: function() {
        var el = this.get(0);
        let parent = el.parentNode || el.parentElement;
        if (parent) { return $(parent); }
        else { return $(docElem); }
    },
    remove: function() {
        var el = this.get(0);
        removeNode(el);
    },
    empty: function() {
        var el = this.get(0);
        while (el.firstChild) {
            removeNode(el.lastChild);
        }
        // try to make it empty
        this.html("");
    }
});



putM({
    hide: function (timeout) {
        if (isNumber(timeout) && timeout >= 0) {
            timeout(function() { this.hide(undefined); }, timeout);
        } else {
            var display = this.css("display");
            this.data("display", display === "none" ? "block": display);
            this.css("display", "none");
        }
    },

    show: function (timeout) {
        if (isNumber(timeout) && timeout >= 0) {
            timeout(function() { this.show(undefined); }, timeout);
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

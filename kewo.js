/*
* kewo
*/
(function() {
"use strict";

var _global = this;
var time = now();
var support = {};
var doc = _global.document;
var docElem = doc.documentElement;


function now() {
  if (Date.now) { return Date.now();
  } else { return new Date().getTime(); }
}

// return "[object + className +]" like => "[object String]" to String
function type (obj) {
  var className = Object.prototype.toString.call(_class).toLowerCase().split('');
  return className[0].slice(0, -1);
}

function isArray(obj) {
	return Array.isArray ? Array.isArray(obj) : obj instanceof Array;
}
function isFunction (obj) {
  return typeof obj === "function" && typeof obj.nodeType !== "number";
}
function isBoolean (obj) {
  return typeof obj === "boolean";
}
function isDefined(obj) {
	return obj !== undefined;
}
function isUndefined(obj) {
	return obj === undefined;
}
function isNumber (obj) {
  return typeof obj === "number" && !isNaN(obj);
}
function isNull (obj) {
  return obj === null;
}
function isObject (obj) {
  return typeof obj === "object" && obj !== null;
}
function isString (obj) {
  return typeof obj === "string" || obj instanceof String;
}

function isData (obj) {
  return isDefined(obj) && !isNull(obj);
}

function isLikeArray (obj) {
  if (isNull(obj) || isUndefined(obj)) { return false; }
  if (isString(obj) || isArray(obj) || obj instanceof $$Selector) { return true; }
  return isNumber(obj.length);
}

function inArray (array, obj) {
  return array.indexOf(obj) !== -1;
}


function inString (str, oo) {
  return inArray(str, oo);
}



function makeArray (str, prefix) {
  return str.split(prefix || ",");
}


function noop (a,b,c,d) {}


function includes(array, obj) {
  return Array.prototype.indexOf.call(array, obj) !== -1;
}



function CreateObject ($object) {
  var emptyObject = Object.create(null);
  for (var i in $object) {
    emptyObject[i] = $object[i];
  } return emptyObject;
}


// console type print message
function log() {
  console.log.apply(null, arguments);
}
function error() {
  console.error.apply(null, arguments);
}
function warn() {
  console.warn.apply(null, arguments);
}

function extend (_to, _from) {
  for (var key in _from) {
    _to[ key ] = _from[ key ];
  }
}



function arrayRemove(array, value) {
  var index = array.indexOf(value);
  if (index >= 0) {
    array.splice(index, 1);
  }
  return index;
}

function len (obj) {
  if (isString( obj )) {
    return obj.length;
  } else if (isNumber( obj.length )) {
    return obj.length;
  }
}

function once (fn) {
  var called = false;
  return function() {
    var self = this;
    var args = arguments;
    if (!called) {
      called = true;
      fn.apply(self, args);
    }
  };
}


function upper (str) {
  return str.toUpperCase();
}

function lower (str) {
  return str.toLowerCase();
}

function capitalize (str) {
  return upper(str.charAt(0)) + str.slice(1);
}

function trim (str) {
  return str.trim();
}



// default .length = 0
var $$Selector = function $$Selector() {
  this.length = 0;
};
$$Selector.prototype.get = function (index) {
  return index < 0 ? $(this[ index + this.length ]) : $(this[ index ]);
};
$$Selector.prototype.elem = function (index) {
  return isUndefined(index) ? this[0] :
         index < 0 ? this[ index + this.length ] :
         this[ index ];
};
$$Selector.prototype.$$push = function (selector) {
  var currentLength = this.length || 0;
  this[ currentLength ] = selector;
  this.length = currentLength + 1;
};


// (selector0, selector1, selector2)
// ([ selector0, selector1, selector2 ])
$$Selector.prototype.push = function() {
  if (!arguments.length) { return; }
  var self = this;
  var selectors = null;
  if (len( arguments ) >= 1 && !isLikeArray( arguments[ 0 ] )) {
    selectors = arguments;
  } else if (isLikeArray( arguments[ 0 ] )) {
    selectors = arguments[ 0 ];
  }
  if (selectors) {
    if (isNode( selectors )) {
      self.$$push(selectors);
    } else {
      forEach(selectors, function (_, selector) {
        self.$$push(selector);
      });
    }
  }
};


function createOneSelector (el) {
  var s = new $$Selector();
  s.push(el);
  return s;
}


var TypeNodeElement = Node.ELEMENT_NODE || 1;
var TypeNodeText = Node.TEXT_NODE || 3;
var TypeNodeComment = Node.COMMENT_NODE || 8;
var TypeNodeDocument = Node.DOCUMENT_NODE || 9;

// isDocument({}) -> false
function isDocument (node) {
  return node.nodeType === TypeNodeDocument;
}
function isElement (node) {
  return node.nodeType === TypeNodeElement;
}

function parentNode (node) {
  return node.parentNode;
}

function createElement (tagName) {
  return doc.createElement(tagName);
}

function createTextNode (text) {
  return doc.createTextNode(text);
}

function createComment (text) {
  return doc.createComment(text);
}

function firstNode (el) {
  return el.firstChild;
}

function lastNode (el) {
  return el.lastChild;
}

// return null means parent not have frist element
function firstElement (parent) {
  if (isDefined( parent.firstElementChild )) {
    return parent.firstElementChild;
  } else {
    var element = null;
    eachAllChildNodes(parent, function (_, node) {
      if (isElement( node )) {
        element = node;
        return false;
      }
    });
    return element;
  }
}

function lastElement (parent) {
  if (isDefined( parent.lastElementChild )) {
    return parent.lastElementChild;
  }
}


function getAllNodes (el) {
  return el.childNodes;
}

function isSameNode (node1, node2) {
  if (isFunction( node1.isSameNode )) {
    return node1.isSameNode(node2);
  } else {
    return node1 === node2;
  }
}


function isFirstNode (node) {
  var first = firstNode(parentNode( node ));
  return isSameNode(node, first);
}


var defaultTagHTML = "div";

function createElementFromObject (el) {
  var tag = el.tag ? el.tag : defaultTagHTML;
  var elem = createElement(tag);
  if (el.attrs) {
    for (var i in el.attrs) {
      setAttr(elem, i, el.attrs[ i ]);
    }
  }
  if (el.data) {
    for (var i in el.data) {
      setAttr(elem, "data-" + i, el.data[ i ]);
    }
  }
  return elem;
}

function isNode (obj) {
  if (obj && obj.nodeType && isNumber(obj.nodeType)) {
    return true;
  } else {
    return false;
  }
}

function toNumber (value) {
}

function isEmptyObject (obj) {
  for (var name in obj) { return false; }
  return true;
}

function toNode (node) {
  if (isNode( node )) {
    return node;
  } else if (isString( node )) {
    return createTextNode(node);
  } else if (node instanceof $$Selector) {
    return node.elem();
  } else if (isObject( node )) {
    if (isEmptyObject( node )) { return createElement("div"); }
    return createElementFromObject(node);
  } else {
    return node;
  }
}

function hasNodes (el) {
  return !!firstNode(el);
}

function appendChild (el, node) {
  node = toNode( node );
  if (el.appendChild) {
    el.appendChild(node);
  } else {
    el.append(node);
  }
}

function prependChild (el, node) {
  if (hasNodes( el )) {
    insertBefore(node, firstNode( el ));
  } else {
    appendChild(el, node);
  }
}

function insertBefore(newNode, referenceNode) {
  parentNode(referenceNode).insertBefore(
    toNode(newNode),
    referenceNode
  );
}

function insertAfter (newNode, referenceNode) {
  var parent = parentNode(referenceNode);
  var last = lastNode(parent);
  if (isSameNode(last, referenceNode)) {
    appendChild(parent, newNode);
  } else {
    insertBefore(newNode, referenceNode.nextSibling);
  }
}

function removeNode (node) {
  if (isDocument(node)) {
    doc.removeChild(docElem);
  } else {
    if (isNode(node)) {
      var parent = parentNode(node);
      if (parent && parent.removeChild) {
        parent.removeChild(node);
      } else if (node.remove) {
        node.remove();
      }
    }
  }
}

function getNextNode (element) {
  return element.nextSibling;
}

function getPreviousNode (element) {
  return element.previousSibling;
}

function getNextElement (element) {
  return element.nextElementSibling;
}

function getPreviousElement (element) {
  return element.previousElementSibling;
}


function hasClass (el, cls) {}


function getById (id) {
  // id maybe number `<input id="1">`
  // it may work so we will change id to string like => (1 => "1")
  id = id + "";
  if (support.getElementById) {
    return doc.getElementById(id);
  } else if (support.querySelector) {
    return doc.querySelector("#" + id);
  } else {
    // we can also get element by id from `globalView` like => (window["" + element_id + ""])
    return _global[ id ];
  }
}

function getByTag (tag) {
  return doc.getElementsByTagName(tag);
}
function getByClass (cls) {
  return doc.getElementsByClassName(cls);
}

function rand (_from, _to) {
  return Math.floor(Math.random() * _from);
}

// from jQuery
// you not need to remove your children which you created before because we will remove it for you
function assert (fn) {
  var el = createElement("fieldset");
  try {
    return !!fn.call(el);
  } catch (e) {
    return false;
  } finally {
    //after return (True or False)
    removeNode(el);
    // release memory in IE
    el = null;
  }
}

support.querySelector = assert(function() {
  var el_1 = createElement("input");
  var el_2 = createElement("input");
  appendChild(this, el_1);
  appendChild(this, el_2);
  return this.querySelector("input").value === "";
});

support.getElementById = assert(function() {
  var el = createElement("input");
  var id = createUnusedId();
  setAttr(el, "value", "123");
  setAttr(el, "id", id);
  appendChild(this, el);
  var _el = doc.getElementById(id);
  return _el.value === "123";
});

support.getElementsByTagName = assert(function() {
  var el = createElement("input");
  appendChild(this, el);
  return this.getElementsByTagName("input").length;
});



function isUsedAsId (valueId) {
  return (( valueId in _global ) || !!getById( valueId ));
}

// return "abc" + random number
function createUnusedId() {
  var id;
  do {
    id = "abc" + rand(1000000);
  } while (isUsedAsId( id ));
  return id;
}




function forEach (array, callback) {
  if (isLikeArray( array )) {
    for (var i = 0; i < array.length; i++) {
      if (callback.call(array, i, array[ i ]) === true) {
        break;
      }
    }
  } else {
    for (var i in array) {
      if (callback.call(array, i, array[ i ]) === true) {
        break;
      }
    }
  }
}

``
function isTrue (bool) {
  return bool === true;
}

function isFalse (bool) {
  return bool === false;
}


function put() {
  forEach(
    arguments[ 0 ],
    function (name, method) {
    $$Selector.prototype[ name ] = function() {
      var self = this;
      var args = arguments;

      if (isFunction(method)) {
        if (len(self) === 1) {


          var element = self.elem();
          var selector = createOneSelector(element);
          var result = method.apply(selector, args);

          // if method not return any value but return `undefined` so it will return the same object `this`
          // so if we neet to return undefined value we find `null` keyword
          // good: this.value("Ssssssss").text("sssssssssssss")
          // bad: this.value().text("sssssssssssss")
          if (result === undefined) { return self; }
          else { return result; }

        } else {
          for (var i = 0; i < self.length; i++) {
            var selector = createOneSelector(self.get( i ));
            method.apply(selector, args);
          }
          /*
          forEach(self, function (_, el) {
            var selector = createOneSelector(el);
            log(selector.get(0))
            method.apply(selector, args);
          });*/
        }
      }
    }
  });
}

support.fullscreen = "requestFullscreen" in docElem
                  || "webkitRequestFullscreen" in docElem
                  || "mozRequestFullscreen" in docElem
                  || "msRequestFullscreen" in docElem;


function getFullscreenElement() {
  return doc.fullscreenElement ||
  doc.msFullscreenElement ||
  doc.mozFullscreenElement ||
  doc.webkitFullscreenElement;
}

function isFullscreenEnabled() {
  return doc.fullscreenEnabled ||
  doc.mozFullScreenEnabled ||
  doc.msFullscreenEnabled ||
  doc.webkitFullscreenEnabled;
}

put({
  fullscreen: function (enable) {
    var el = this.elem();
    if (support.fullscreen) {
      var fullscreenElement = doc.fullscreenElement || doc.msFullscreenElement || doc.mozFullscreenElement || doc.webkitFullscreenElement;
      if (enable) {
        if (el.webkitRequestFullscreen) {
          el.webkitRequestFullscreen();
        } else if (el.requestFullscreen) {
          el.requestFullscreen();
        } else if (el.mozRequestFullscreen) {
          el.mozRequestFullscreen();
        } else if (el.msRequestFullscreen) {
          el.msRequestFullscreen();
        } else {
          error("cannot enter fullscreen.");
        }
      } else {
        if (doc.webkitCancelFullScreen) {
          doc.webkitCancelFullScreen();
        } else if (doc.exitFullscreen) {
          doc.exitFullscreen();
        } else if (doc.mozCancelFullScreen) {
          doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) {
          doc.msExitFullscreen();
        } else {
          error("cannot exit fullscreen.");
        }
      }
    }
  },
});





var SetterGetter = 0;



put({
  value: function (value) {
    var el = this.elem();
    if (isDefined(value)) {
      el.value = value;
    } else {
      return el.value;
    }
  },
  text: function (value) {
    var el = this.elem();
    if (isDefined( value )) {
      el.textContent = value;
    } else {
      return el.textContent;
    }
  },
  html: function (value) {
    var el = this.elem();
    if (isDefined( value )) {
      el.innerHTML = value;
    } else {
      return el.innerHTML;
    }
  }
});


var whitespaceRE = /\s+/;
// class="jjj jjjjsdsd" 

// return if element has class name
// arguments[ 0 ]: must be one class
function hasClass (el, cls) {
  cls = trim(cls);
  if (el.classList && el.classList.contain) {
    return el.classList.contains(cls);
  } else {
    var _classes = (getAttr(el, "class") || el.className || "");
    return inString(_classes, cls);
  }
}

function addClass (el, cls) {
  cls = trim(cls);
  if (el.classList && el.classList.add) {
    el.classList.add(cls);
  } else {
  }
}

function removeClass (el, cls) {
  if (el.classList && el.classList.remove) {
    el.classList.remove(cls);
  } else {
  }

  if (!getAttr(el, cls)) {
  }
}

function toggleClass (el, cls) {
  if (el.classList && el.classList.toggle) {
    el.classList.toggle(cls);
  } else {
  }
}

function getAttrClass (el) {
  return el.getAttribute && el.getAttribute( "class" ) || el.className || "";
}

function toBool (obj) {
  if (obj === "true" ) { return true; }
  if (obj === "false") { return false; }
  return false;
}



function setAttr (el, name, value) {
  if (el.setAttribute) {
    el.setAttribute(name, value);
  } else {
    el[ name ] = value;
  }
}

function getAttr (el, name) {
  if (el.getAttribute) {
    return el.getAttribute(name);
  } else {
    return el[ name ];
  }
}

function hasAttr (el, name) {
  if (el.hasAttribute) {
    return el.hasAttribute(name);
  }
}

function removeAttr (el, name) {
  if (el.removeAttribute) {
    el.removeAttribute(name);
  }
}

/*
* controller attribute of element
*/
var prefixAttrData = "data-";

var BOOLEAN_ATTR = [];
forEach(makeArray("multiple,selected,checked,disabled,readonly,required,open"), function (index, value) {
  BOOLEAN_ATTR.push(value);
});


put({
  children: function() {
    var children = $();
    eachAllChildElements(
      this.elem(),
      function (_, node) {
      children.push(node);
    });
    return children;
  },
  prop: function (name, value) {
    var el = this.elem();
    if (isDefined( value )) {
      el[ name ] = value;
    } else {
      return el[ name ];
    }
  },
  attr: function (name, value) {
    var el = this.elem();
    if (isDefined( value )) {
      setAttr(el, name, value);
    } else {
      if (isObject( name )) {
        each(name, function (attr, value) {
          setAttr(el, attr, value);
        });
        return;
      } else {
        var value = getAttr(el, name);
        if (!value) return null;
        if (value === "true" || value === "false") { return toBool(value); }
        else {
          try {
            return JSON.parse(value);
          } catch (e) { return value; }
        }
      }
    }
  },
  removeAttr: function (name) {
    if (this.hasAttr( name )) {
      removeAttr(this.elem(), name);
    }
  },
  hasAttr: function (name) {
    return hasAttr(this.elem(), name);
  },
  toggleAttr: function (name, value) {
    if (this.hasAttr( name )) {
      this.removeAttr(name);
    } else {
      this.attr(name, value);
    }
  },
  data: function (nameData, value) {
    if (isUndefined( nameData ) && isUndefined( value )) {
      var el = this.elem(), attrs = el.attributes, data = {};
      for (var i = 0; i < attrs.length; i++) {
        var name = attrs[i].name;
        var value = attrs[i].value;
        if (name.startsWith("data-")) {
          data[ name.slice(5) ] = this.attr(name);
        }
      }
      return data;
    }
    return this.attr(prefixAttrData + nameData, value);
  },
  removeData: function (nameData) {
    this.removeAttr(prefixAttrData + nameData);
  },
  hasData: function (nameData) {
    return this.hasAttr(prefixAttrData + nameData);
  },
  toggleData: function (nameData, value) {
    this.toggleAttr(prefixAttrData + nameData, value);
  }
});

put({
  addClass: function (cls) {
    addClass(this.elem(), cls);
  },
  hasClass: function (cls) {
    return hasClass(this.elem(), cls);
  },
  removeClass: function (cls) {
    removeClass(this.elem(), cls);
  },
  toggleClass: function (cls) {
    toggleClass(this.elem(), cls);
  }
});

/*
* controller style of element
*/
function getStyles (el) {
  var view = (el.ownerDocument && el.ownerDocument.defaultView) ?
              el.ownerDocument.defaultView : _global;
  if (view.getComputedStyle) {
    return view.getComputedStyle(el);
  } else if (el.currentStyle) {}
}


function setStyle (el, name, value) {
  el.style[ name ] = value;
}


function toNumber (value) {
  return value ? parseFloat(value) : NaN;
}

put({
  css: function (name, value) {
    var el = this.elem();
    if (isObject(name)) {
      forEach(name, function (_name, _value) {
        setStyle(el, _name, _value);
      });
    } else if (isDefined( value )) {
      setStyle(el, name, value);
    } else {
      return getStyles(el)[name];
    }
  },
  hide: function (delay) {
    var self = this;
    if (isData(delay)) {
      timeout(function() {
        self.hide(undefined);
      }, delay);
    } else {
      this.data("w-display", this.css("display"));
      this.css("display", "none");
    }
  },
  show: function (delay) {
    var self = this;
    if (isData(delay)) {
      timeout(function() {
        self.show(undefined);
      }, delay);
    } else {
      this.css("display", this.data("w-display") || "block");
    }
  },
  fadeIn: function (delay) {
    var self = this;
    var opacity = toNumber(self.css("opacity"));
    log(opacity);
    self.hide();
  }
});


put({
  scale: function (scaleX, scaleY) {
    var el = this.elem();
    var transform = this.css("transform");
    var values = transform.split('(')[1].split(')')[0].split(',');
    var angle = Math.round(Math.atan2(values[1], values[0]) * (180 / Math.PI));
    var _scaleX = values[0];
    var _scaleY = values[3];

    var scaleValue = "";
    if (isDefined( scaleY )) {
      scaleValue = "scaleX(" + scaleX + ") scaleY(" + scaleY + ")";
    } else {
      scaleValue = "scaleX(" + scaleX + ") scaleY(" + scaleX + ")";
    }

    // add new transform
    this.css("transform", "rotate(" + angle + "deg) " + scaleValue);
  }
});


$$Selector.prototype.each = function (callback) {
  forEach(this, function (index, selector) {
    callback.call(createOneSelector(selector), index, selector);
  });
};

$$Selector.prototype.filter = function (callback) {
  var selectors = $();
  forEach(this, function (index, selector) {
    if (callback.call(createOneSelector( selector ), index, selector) === true) {
      selectors.push(selector);
    }
  });
  return selectors;
};

// after remove element you can get and set value for it
// but after make param: memory = true
// you will not able to edit on element
$$Selector.prototype.remove = function() {
  var self = this;
  // remove element from memory
  // remove element from DOM
  self.each(function (index, selector) {
    delete self[ index ];
    removeNode(selector);
  });
  self.length = 0;
};


put({
  is: function (another) {
    if (another instanceof $$Selector && len(another) === 1) {
      return isSameNode(another.elem(), this.elem());
    }
    //return false;
  },
  tag: function () {
    var el = this.elem();
    if (isElement( el )) {
      return lower(el.tagName);
    }
  },
  // cannot set id is used
  id: function (value) {
    if (isDefined( value ) && isUsedAsId( value )) {
      throw new Error("cannot set new id because is aready used!");
    }
    return this.attr("id", value);
  },
  clone: function (onlySelf) {
    return this.elem().cloneNode(!onlySelf);
  },
  parent: function() {
    var el = this.elem();
    if (el.parentNode) {
      return $(el.parentNode);
    }
    // := not good idea
    // because if element not add for DOM it will return tag HTML as parent
    //else { return $(docElem); }
    return null;
  },
  empty: function() {
    var el = this.elem();
    while (firstNode( el )) {
      removeNode(lastNode( el ));
    }
    // for comments and text node
    this.html("");
  }
});


function eachAllChildNodes (parent, callback) {
  forEach(getAllNodes(parent), callback);
}

function eachAllChildElements (parent, callback) {
  var index = -1;
  eachAllChildNodes(parent, function (_, node) {
    if (isElement( node )) {
      index += 1;
      return callback( index, node );
    }
  });
}

// where to add and get node
put({

  timeDelay: 0,

  delay: function (time) {
    this.timeDelay = time;
    return this;
  },

  // if $element instanceof $$Selector : selector.legnth must be === 0 else return null;
  // or $element can be Node or String
  // esle if not find method will return -1
  index: function (element) {
    var el = this.elem(), index = -1;
    if (isUndefined( element )) {

    }
    element = toNode(element);
    if (!element) { return -1; }
    var fnEachAllChild = byNode === true ?
                       eachAllChildNodes :
                       eachAllChildElements;
    fnEachAllChild(el, function (_index, node) {
      if (isSameNode( element, node )) {
        index = _index + 1;
        return true;
      }
    });
    return index;
  },
  first: function (newNode) {
    var el = this.elem();
    if (isDefined( newNode ) && !isBoolean( newNode )) {
      prependChild(this.elem(), newNode);
    } else {
      var fnGetNode = newNode === true ?
                             firstNode :
                             firstElement;
      var first = fnGetNode(el);
      return $(first);
    }
  },
  last: function (newNode) {
    var el = this.elem();
    if (isDefined( newNode ) && !isBoolean( newNode )) {
      appendChild(el, newNode);
    } else {
      var fnGetNode = newNode === true ?
                              lastNode :
                              lastElement;
      var last = fnGetNode(el);
      return $(last);
    }
  },
  before: function (newNode) {
    var el = this.elem();
    if (isDefined( newNode ) && !isBoolean( newNode )) {
      insertBefore(newNode, el);
    } else {
      var fnGetPreviousNode = newNode === true ?
                               getPreviousNode :
                               getPreviousElement;
      var node = fnGetPreviousNode(el);
      if (isNull( node )) { return null; }
      return $(node);
    }
  },
  after: function (newNode) {
    var el = this.elem();
    if (isDefined( newNode ) && !isBoolean( newNode )) {
      insertAfter(newNode, el);
    } else {
      var fnGetNextNode = newNode === true ?
                               getNextNode :
                               getNextElement;
      var node = fnGetNextNode(el);
      if (isNull( node )) { return null; }
      return $(node);
    }
  },
  append: function (newNode) {
    appendChild(this.elem(), newNode);
  },
  insert: function (newNode, index, byNode) {
    var el = this.elem();
    if (isBoolean( index )) {
      byNode = index;
      index = 1;
    }
    if (isUndefined( index )) {
      index = 1;
    }
    if (index <= 0) { return undefined; }
    if (index > el.childNodes.length) {
      this.append(newNode);
    } else {
      var fnEachAllChild = byNode === true ?
                         eachAllChildNodes :
                         eachAllChildElements;
      fnEachAllChild(
        el,
        function(_index, node) {
        if (_index === index - 1) {
          $(node).before(newNode);
          return true;
        }
      });
    }
  },
  wrap: function (newParentNode) {
  }
});



function isHTMTag (tag) {
  return inArray(
    makeArray(
      "html,body,base,head,link,meta,style,title," +
      'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
      'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
      'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
      's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
      'embed,object,param,source,canvas,script,noscript,del,ins,' +
      'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
      'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
      'output,progress,select,textarea,' +
      'details,dialog,menu,menuitem,summary,' +
      'content,element,shadow,template,blockquote,iframe,tfoot'
    ),
    tag
  );
}



var fromParentToChild = true;
var fromChildToParent = false;

function addEventListener
(element, eventName, handler, useCapture) {
  if (!isBoolean(useCapture)) {useCapture = false;}
  if (element.addEventListener) {
    element.addEventListener(eventName, handler, useCapture);
  } else if (element.attachEvent) {
    element.attachEvent("on" + eventName, handler);
  } else {
    element["on" + eventName] = function(e) {
      handler.call(this, e);
    };
  }
}

function removeEventListener
(element, eventName, handler, useCapture) {
  if (!isBoolean(useCapture)) {useCapture = false;}
  if (element.removeEventListener) {
    element.removeEventListener(eventName, handler, useCapture);
  } else if (element.attachEvent) {
    element.detachEvent("on" + eventName, handler);
  } else {
    element["on" + eventName] = null;
  }
}

function addOnceEventListener
(element, eventName, handler, useCapture) {
  var fn = function() {
    handler.call(this, event);
    removeEventListener(element, eventName, fn, useCapture);
  };
  addEventListener(element, eventName, fn, useCapture);
}

var EventsKeyboard = "keydown|keyup|keypress".split('|');
var EventsMouse = "mousemove|mouseenter|mousedown|mouseup|mouseout|mouseover".split('|');
var KeysNN = "ctrl|alt|shift|meta".split('|');

var ButtonsMouse = new Map();
ButtonsMouse.set(0, "left");
ButtonsMouse.set(1, "middle");
ButtonsMouse.set(2, "right");




put({
  on: function (nameEvent, keyCode, callback) {
    var self = this;
    var element = self.elem();
    var time = now();
    var callHandler = function callHandler ($$event) {
      var selector = createOneSelector(element);
      (isFunction(keyCode) ? keyCode: callback).call(selector, $$event);
    };

    // when call event
    function callFnEvent ($event) {
      var _event = $event || _global.event;
      var ctrl = _event.ctrlKey || false;
      var alt = _event.altKey || false;
      var shift = _event.shiftKey || false;
      var meta = _event.metaKey || false;

      // start put options for event Argument with default values
      var newOptionsForEvent =  CreateObject({
        type: nameEvent,
        target: $($event.target || $event.toElement || null),
        ctrl: ctrl,
        alt: alt,
        shift: shift,
        meta: meta,
        stop: function() {
          _event.stopPropagation();
        },
        cancel: function() {
          if (_event.cancelable === true && _event.preventDefault) {
            _event.preventDefault();
          } else {
            _event.returnValue = false;
          }
        }
      });

      var button = _event.button === 0 ? 0: null;
      if (/^key/.test(nameEvent)) {
        var code = _event.which || _event.keyCode || 0;
        newOptionsForEvent.code = code;
      }
      else if (/^mouse/.test(nameEvent)) {
      /*var clientX = _event.clientX || _event.x;
        var clientY = _event.clientY || _event.y;*/
        newOptionsForEvent.screenX = _event.screenX;
        newOptionsForEvent.screenY = _event.screenY;
      }


      callHandler(newOptionsForEvent);
    }

    addEventListener(element, nameEvent, callFnEvent);
  },

  click: function (callback) {
    this.on("click", callback);
  }
});

put({
  "find": function(selectorAll) {

  }
});


function toDelay (delay) {
  return (isArray(delay) ? delay[0] : delay) || 0;
}

function timeout (fn, delay, _) {
  var $delay = toDelay(delay);
  var $stop = function() {
    callSafe(function() {
      clearTimeout(timer);
    });
    return undefined;
  };
  var fnTimerCall = function fnTimerCall() {
    this.stop = noop;
    this.delay = returnFunction($delay);
    this.count = returnFunction(1);
    fn.call(this);
  };
  var timer = setTimeout(
    fnTimerCall,
    $delay
  );
  return {stop: $stop};
}

function interval (fn, delay, count) {
  var $delay, $start, $stop, counter, indexDelay, fnTimerCall;
  $delay = toDelay(delay);
  $start = function($fn, $$delay) {
    return setInterval(
      $fn,
      $$delay
    );
  };
  $stop = function() {
    callSafe(function() { clearInterval(timer); });
    return undefined;
  };
  counter = 0;
  indexDelay = 0;
  fnTimerCall = function() {
    counter += 1;
    this.stop = $stop;
    this.count = function (newCount) {
      if (isDefined(newCount)) {count = newCount;}
      else {return counter;}
    };
    if (isNumber(count) && counter > count) {return $stop();}
    fn.call(this);
    if (isArray($delay) && indexDelay < delay.length) {
      $stop();
      timer = $start(fnTimerCall, $delay[indexDelay]);
      indexDelay += 1;
      return;
    }
  };
  var timer = $start(
    fnTimerCall,
    $delay
  );
  return {stop: $stop};
}


var requestAnimationFrame = _global.webkitRequestAnimationFrame || _global.requestAnimationFrame || _global.mozRequestAnimationFrame || _global.oRequestAnimationFrame || _global.msRequestAnimationFrame;
var cancelAnimationFrame = _global.webkitCancelAnimationFrame || _global.cancelAnimationFrame || _global.mozCancelAnimationFrame || _global.oCancelAnimationFrame || _global.msCancelAnimationFrame;

support.requestAnimationFrame = !!requestAnimationFrame;

// function 60 fps
function nextFrame (fn) {
  if (support.requestAnimationFrame) {
    requestAnimationFrame(fn);
  } else {
    timeout(function() {
      fn();
    }, 16.66);
  }
}


function parseXML (content) {
  var parser = null;
  if (_global.DOMParser) {
    parser = (new _global.DOMParser()).parseFromString(content, "application/xml");
  }
  if (!parser || !!parser.getElementsByTagName( "parsererror" ).length) {
    error("Error parse XML: " + content);
    return;
  }
  return parser;
}

function callSafe (callback) {
  try {
    return callback();
  } catch (e) {return undefined;}
}


/*
* get value from return function
* ``
var value = returnFunction(123);
console.log(value()) // 123
* ``
var value = returnFunction(function() { return 123; });
console.log(value()) // 123
*/
function returnFunction (value) {
  return function() {
    if (isFunction( value )) {
      return value();
    } else { return value; }
  };
}


function complete() {
	doc.removeEventListener("DOMContentLoaded", complete);
  _global.removeEventListener("load", complete);
}

var onReady = function onReady (callback) {
  window.addEventListener("load", function() {
    callback();
  });
  return undefined;
};


// factory
var $ = _global.$ = function (selectorAll) {
  if (isFunction(selectorAll)) {
    return onReady(selectorAll);
  }

  // null or undefined
  if (!selectorAll) {return selector;}
  if (selectorAll instanceof $$Selector) {return selectorAll;}

  var selector = new $$Selector();

  // element
  if (isElement(selectorAll) || isNumber(selectorAll.nodeType)) {
    selector.push(selectorAll);
    return selector;
  }

  if (isString(selectorAll)) {
    if (len(selectorAll) >= 2) {
      var firstChar = selectorAll.charAt(0);
      var basename = selectorAll.slice(1);
      switch (firstChar) {
        case "#":
          var el = getById(basename);
          selector.push(el);
          return selector;
        case ".":
          var els = getByClass(basename);
          selector.push(els);
          return selector;
        default:
          var els = getByTag(selectorAll);
          selector.push(els);
          return selector;
      }
    }
  }
  selector.push(selectorAll);
  return selector;
};


function sleep (milliseconds, $promise) {
  if ($promise === true) {
    return new Promise(function(resolve) {
      timeout(function() {
        resolve();
      }, milliseconds);
    });
  }
  if (milliseconds > 0) {
    var starts_with_time = now();
    while (true) {
      if ((now() - starts_with_time) > milliseconds) {
        if (isFunction($promise)) { $promise(); }
        break;
      }
    }
  }
}

function parseJSON (value) {
  return JSON.parse(value);
}

function stringify ($object) {
  if (isFunction($object)) { return Function.prototype.toString.call(fn); }
  return JSON.stringify($object);
}

function isReady (element) {
  if (element.nodeType === TypeNodeDocument) {
    return element.readyState === "complete";
  }
  return element.document || element.contentDocument || element.contentWindow.document;
}

$.put = put;
$.log = log;
$.warn = warn;
$.error = error;
$.timeout = timeout;
$.interval = interval;
$.parseXML = parseXML;
$.parseJSON = parseJSON;
$.callSafe = callSafe;
$.sleep = sleep;
$.stringify = stringify;
$.isReady = isReady;


})
.call(typeof window !== "undefined" ? window : this || self);

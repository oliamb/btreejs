// This btree implementation store only once each value and
// will increment its count property.
// A cmpFunc result of 0 will result in keeping
// the old value.
var btree = (function(){
  var Node = function(value){
    this.value = value;
    this.count = 1;
    this.left = null;
    this.right = null;
  };
  
  var Tree = function(cmpFunc){
    if(!cmpFunc){
      cmpFunc = function(a, b){
        if(a < b){return 1};
        if(a > b){return -1};
        return 0;
      };
    }
    this.cmpFunc = cmpFunc;
    this.root = null;
  };
  
  var addFirst = function(/* values */){
    this.root = new Node(Array.prototype.pop.apply(arguments));
    this.add = addNodes;
    if(arguments.length > 1){
      this.add.apply(this, arguments);
    }
  };
  
  var addNodes = function(/* values */){
    if(!this.root){
      this.root = new Node(value);
      return;
    }
    for (var i=0; i < arguments.length; i++) {
      var current = this.root,
          value = arguments[i],
          inserted = false;
      while(!inserted){
        var res = this.cmpFunc(value, current.value);
        switch(res){
          case 1:
            if (current.left === null) {
              current.left = new Node(value); inserted = true; 
            } else {
              current = current.left;
            }
            break;
          case -1:
            if (current.right === null) { 
              current.right = new Node(value); inserted = true; 
            } else {
              current = current.right;
            }
            break;
          case 0:
            current.count ++;
            node = current;
            inserted = true;
            break
          default:
            throw "Invalid value returned by cmpFunc " + res;
        }
      }
    }
  };
  
  Tree.prototype = {
    add: addFirst,
    toString: function(){
      if(typeof this.root === 'undefined'){ return "(-)"; }
      this.root.toString();
    },
    toArray: function(){
      if(typeof this.root === 'undefined'){ return []; }
      return this.root.toArray();
    },
    toArrayDistinct: function(){
      if(typeof this.root === 'undefined'){ return []; }
      return this.root.toArrayDistinct();
    },
    each: function(fn) {
      if(typeof this.root === 'undefined'){ return; }
      this.root.each(fn);
    },
    eachDistinct: function(fn){
      if(typeof this.root === 'undefined'){ return; }
      this.root.eachDistinct(fn);
    },
    VERSION: '0.1.0'
  }
  
  Node.prototype = {
    toString: function(){
      return '('+ this.value.toString() + (this.count > 1 ? '*'+this.count : '') + ',' + 
          (this.left ? this.left.toString() : '-') + ',' + 
          (this.right ? this.right.toString() : '-') + ')';
    },
    toArray: function(){
      if(this.count == 0){ return []; }
      var arr = (this.left ? this.left.toArray() : []);
      for (var i = this.count - 1; i >= 0; i--){
        arr.push(this.value);
      }
      arr.push.apply(arr, (this.right ? this.right.toArray() : []));
      return arr;
    },
    toArrayDistinct: function(){
      if(this.count == 0){ return []; }
      var arr = (this.left ? this.left.toArrayDistinct() : []);
      arr.push(this.value);
      arr.push.apply(arr, (this.right ? this.right.toArrayDistinct() : []));
      return arr;
    },
    each: function(fn) {
      if(this.left){ this.left.each(fn); }
      for (var i = this.count - 1; i >= 0; i--){ fn(this.value); }
      if(this.right){ this.right.each(fn); }
    },
    eachDistinct: function(fn){
      if(this.left){ this.left.eachDistinct(fn); }
      fn(this.value);
      if(this.right){ this.right.eachDistinct(fn); }
    }
  };
  return function(cmpFunc){
    var tree = new Tree(cmpFunc);
    return tree;
  };
})();
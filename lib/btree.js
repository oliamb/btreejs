// This btree implementation store only once each value and
// will increment its count property.
// A cmpFunc result of 0 will result in keeping
// the old value.
var btree = (function(){
  var Node = function(value, cmpFunc){
    this.cmpFunc = cmpFunc;
    this.value = null;
    this.count = 0;
    if(value !== null){
      this.add(value);
    }
  };
  Node.prototype = {
    add: function(/* values */){
      for (var i=0; i < arguments.length; i++) {
        var obj = arguments[i];
        if(this.count == 0){
          this.value = obj;
          this.count ++;
        } else {
          var res = this.cmpFunc(obj, this.value);
          switch(res){
            case 1:
              (this.left ? this.left.add(obj) : (this.left = new Node(obj, this.cmpFunc)));
              break;
            case -1:
              (this.right ? this.right.add(obj) : (this.right = new Node(obj, this.cmpFunc)));
              break;
            case 0:
              this.count ++;
              break;
            default:
              throw "Invalid value returned by cmpFunc " + res;
          }
        }
      }
    },
    toString: function(){
      if(this.count == 0){ return "(-)"; }
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
    if(!cmpFunc){
      cmpFunc = function(a, b){
        if(a < b){return 1};
        if(a > b){return -1};
        return 0;
      };
    }
    var tree = new Node(null, cmpFunc);
    tree.VERSION = '0.1.0';
    return tree;
  };
})();
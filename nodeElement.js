function nodeElement(){
    var level,
        catalog,
        left,
        right;

    this.setLevel = function(value){
        level = value;
    };

    this.setCatalog = function(value){
        catalog = value;
    };

    this.setLeft = function(value){
        left = value;
    };

    this.setRight = function(value){
        right = value;
    };

    this.getLevel = function(){
        return level;
    };

    this.getCatalog = function(){
        return catalog;
    };

    this.getLeft = function(){
        return left;
    };

    this.getRight = function(){
        return right;
    };


    this.showAll = function() {       //method for test
        console.log('level: '+ level);
        console.log('catalog: '+ catalog);
        console.log('left: '+ left);
        console.log('right: '+ right);
    }

}

module.exports = nodeElement;

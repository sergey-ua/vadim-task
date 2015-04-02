function VirtualFs(){
    var nodeElement = require('./nodeElement'),
        collectionElement = [],
        vow = require('vow'),                                  //module promises for asynchronous calls
        collectionChild = [];


    this.setRoot = function(value){
        var root = new nodeElement();

        root.setCatalog(value);
        root.setLeft(1);
        root.setRight(2);
        root.setLevel(0);

        collectionChild = [];
        collectionChild[0] = root;
        collectionElement[0] = collectionChild;
    };

    this.getRoot= function() {
        return collectionElement[0][0];
    };


    this.addFile = function(catalog, parent){
        var element = new nodeElement();

        element.setCatalog(catalog);
        element.setLeft(parent.getRight());
        element.setRight(element.getLeft()+1);
        element.setLevel(parent.getLevel()+1);


        if(!collectionElement[element.getLevel()]){ //create new array if creating a new level
            collectionChild = [];
        }

        if(collectionElement.length-1 >= element.getLevel()){
            collectionChild = collectionElement[element.getLevel()];
        }

        var lengthCollectionChild = collectionChild.length;

        collectionChild[lengthCollectionChild] = element;
        collectionElement[element.getLevel()] = collectionChild;


        function changeCollectionElement(level, left, right){

            for (var i = level; i>-1; i--){
                for (var j = 0; j<collectionElement[i].length; j++){
                    if(left < collectionElement[i][j].getLeft() && right < collectionElement[i][j].getRight()){
                        collectionElement[i][j].setLeft(collectionElement[i][j].getLeft()+2);
                        collectionElement[i][j].setRight(collectionElement[i][j].getRight()+2);
                    }else{
                        if(left > collectionElement[i][j].getLeft() && left <= collectionElement[i][j].getRight()){
                            collectionElement[i][j].setRight(collectionElement[i][j].getRight()+2);
                        }

                    }

                }
            }

        }

        changeCollectionElement(element.getLevel(), element.getLeft(), element.getRight());

        return element;
    };


    this.getFileAt = function(path){
        var deferred = vow.defer(),
            elementResult;


        function checkPathFile(path,element){
            var catalog,
                parent;

            function iterateOverPath() {   // Select the name of the parent
                var lengthPath = path.length,
                    catalog    = '';

                for (var i = lengthPath - 1; i > -1; i--) {

                    catalog = path[i] + catalog;

                    //conditions for recognition "/"
                    if (path[i - 1] == '/' && path[i-2]) {
                        path = path.substring(0, i-1);
                        return catalog;
                    }

                    if (path[i - 1] == '/' && !path[i-2]) {
                        path = path.substring(0, i);
                        return catalog;
                    }

                    if(i == 0){
                        path = '';
                        return catalog;
                    }

                }

               return null;
            }

            if(!element) {
                catalog = iterateOverPath();

                element = findElement(catalog);

                if (!elementResult) {
                    elementResult = element;
                }
            }

            if(element.getLevel() == 0){
                return deferred.resolve(elementResult);
            }else {
                catalog = iterateOverPath();
                parent = findElement(catalog);
            }

            if (parent.getLevel() + 1 == element.getLevel() && parent.getLeft() < element.getLeft() && parent.getRight() > element.getRight()) {
                checkPathFile(path, parent);
            }
        }

        checkPathFile(path);
        return deferred.promise();
    };

    this.getAllFilesIn = function(path){
        var lengthPath  = path.length,
            resultArray = [],
            count       = 0,
            dirName = '',
            parent;

        for(var i = lengthPath-1; i > -1; i--){                  //select the name of the parent

            if(path[i] != '/'){
                dirName = path[i] + dirName;
                if(path[i-1] == '/'){
                    break;
                }
            }

            if(path[i] == '/' && !path[i-1]){
                dirName = path[i];
                break;
            }
        }

        parent = findElement(dirName);                           //get the parent folder

        for ( i = 0; i < collectionElement.length; i++) {        //searching children of "element"
            for (var j = 0; j < collectionElement[i].length; j++) {
                if (collectionElement[i][j].getLeft() > parent.getLeft() && collectionElement[i][j].getRight() < parent.getRight()) {
                    resultArray[count] = collectionElement[i][j];
                    count++;
                }
            }
        }

        return resultArray;
    };

    function findElement(catalog){

        for (var i = 0; i < collectionElement.length-1; i++){
            for (var j = 0; j < collectionElement[i].length; j++){
                if(collectionElement[i][j].getCatalog() == catalog){
                    return collectionElement[i][j];
                }
            }
        }

        return null;
    }                          //function of searching for the item by name directory
}

module.exports = VirtualFs;

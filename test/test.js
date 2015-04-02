var VirtualFs = require('../VirtualFs');

var expect = require('chai').expect
var assert = require('chai').assert

suite("VFS Tests", function(){
  test("should be created", function(){
       var vfs = new VirtualFs();
       expect(vfs).to.be.ok;
  });
 
  test("set root should work", function() {
      var vfs = new VirtualFs();
      expect(vfs.setRoot("/")).to.be.undefined;
  });

  test("If set root / root should be /", function() {
      var vfs = new VirtualFs();
      vfs.setRoot("/");
      expect(vfs.getRoot()).to.exist;
      expect(vfs.getRoot().getCatalog()).to.exist;
      expect(vfs.getRoot().getCatalog()).to.equal("/");
      expect(vfs.getRoot().getLeft()).to.equal(1);
      expect(vfs.getRoot().getRight()).to.equal(2);
  });

  test("If add one file tree rebuilds correctly", function(){
      var vfs = new VirtualFs();
      vfs.setRoot("/");
      var addedFile = vfs.addFile("home", vfs.getRoot("/")); 
      expect(addedFile.getCatalog()).to.equal("home");
      expect(addedFile.getLeft()).to.equal(2);
      expect(addedFile.getRight()).to.equal(3);
      expect(vfs.getRoot().getLeft()).to.equal(1);
      expect(vfs.getRoot().getRight()).to.equal(4);

  });

  test("getFileAt at 2nd level of nesting should work", function(){
      var vfs = new VirtualFs();
      vfs.setRoot("/");
      var addedFile = vfs.addFile("home", vfs.getRoot("/")); 
      expect(vfs.getFileAt("/home")).to.equal(addedFile.getCatalog());
      

  });

  
  test("Adding subling should rebuild tree correctly", function(){
     var vfs = new VirtualFs();
     vfs.setRoot("/");
     var subling1 = vfs.addFile('var', vfs.getRoot());
     var subling2 = vfs.addFile('home', vfs.getRoot());
     //root rebuilt correctly
     expect(vfs.getRoot().getLeft()).to.equal(1);
     expect(vfs.getRoot().getRight()).to.equal(6);
     //var rebuilt correctly
     expect(subling1.getLeft()).to.equal(2);
     expect(subling1.getRight()).to.equal(3);
     //home rebuilt correctly
     expect(subling2.getLeft()).to.equal(4);
     expect(subling2.getRight()).to.equal(5);
  });

  test("File listing should work", function(){
    var vfs = new VirtualFs();
     vfs.setRoot("/");
     var addedFile = vfs.addFile('var', vfs.getRoot());
     vfs.addFile("tmp",addedFile);
     vfs.addFile("home", vfs.getRoot());
     resultArr = vfs.getAllFilesIn('/');
     expect(resultArr.length).to.equal(3);
     expect(resultArr[0]).to.equal('/home');
     expect(resultArr[1]).to.equal('/tmp');
     expect(resultArr[1]).to.equal('/tmp/var');
  });


});
var vfs = new VirtualFs();

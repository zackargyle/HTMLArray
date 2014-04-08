XenonJS
=======

HTML/JS List Building Tool

Seamlessly create one way data bound HTML repeating lists with any array.

First create a new object, passing in the id of an element you would like repeated. You can pass in an array as the second parameter. 

    var x = new Xenon('listView');
    
Your HTML should contain some elements like this.

    <div id="listView">
        <div x-class="class1" x-value="val1"></div>
        <div x-class="class2" x-value="val2"></div>
    </div>
    
To build the list, use the 'update' method. Also available is a 'push' method.

    var array = [
      {class1:"c1",class2:"c2",val1:"Hello",val2:"World"},
      {class1:"c2",class2:"c1",val1:"World",val2:"Hello"}
    ];
    x.update(array);
    x.push({class1:"c3",class2:"c3",val1:"One",val2:"More"}
    
This will create 3 elements that look like this.

    <div>
        <div class="c1">Hello</div>
        <div class="c2">World</div>
    </div>
    <div>
        <div class="c2">World</div>
        <div class="c1">Hello</div>
    </div>
    <div>
        <div class="c3">One</div>
        <div class="c3">More</div>
    </div>
    
The HTML available attributes are
    x-value, x-class, x-href, x-src

XenonJS
=======

HTML/JS List Building Tool

HTML Array Wrapper to seamlessly create repeated elements.

First create a new object, passing in the id of an element you would like repeated. You can pass in an array as the second parameter. 

    var x = new Xenon('listView', data);
    
Your HTML should contain some elements like this.

    <div id="listView">
        <div x-class="class1" x-value="val1">
            <div x-class="class2" x-value="val2"></div>
        </div>
    </div>
    
To build the list, use the 'set' method, it will remake the list with the new data.

    var data = [
      {class1: "c1", class2: "c2", val1: "Hello", val2: "World"},
      {class1: "c2", class2: "c1", val1: "World", val2: "Hello"}
    ];
    x.set(array);
    
This will create 2 elements that look like this.

    <div>
        <div class="c1">Hello</div>
        <div class="c2">World</div>
    </div>
    <div>
        <div class="c2">World</div>
        <div class="c1">Hello</div>
    </div>

This html list can now be manipulated like an array. Available are

    x.push(obj);
    x.splice(index, num, object);
    x.slice(from, to);
    x.move(from, to);
    x.clear();
    var array = x.data();
    
All but clear() are chainable.

    x.push(obj).slice(2).move(4,1);
    
The HTML available attributes are

    x-value, x-class, x-href, x-src

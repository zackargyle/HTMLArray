HTMLArray
=======

HTML/JS List Building Tool

HTML Array Wrapper to seamlessly create repeated elements. Works great in connection with http requests. For live examples, see http://zackargyle.github.io/HTMLArray and http://zackargyle.github.io/TwitchSearch

First create a new object, passing in the id of an element you would like repeated. You can pass in an optional array as the second parameter. 

    var x = new HTMLArray(id, array);
    
Your HTML should contain some elements that will map to your object fields. Text content wrapped in {{ }} will be parsed to your objects field

    <div id="list">
        <div x-class="class1">{{val1}}</div>
        <div x-class="class2">{{val2}}</div>
    </div>
    
To build the list, use the 'set' method, it will remake the list with the new data.

    var data = [
      {class1: "c1", class2: "c2", val1: "Hello", val2: "World"},
      {class1: "c2", class2: "c1", val1: "World", val2: "Hello"}
    ];
    x.set(data);
    
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

    // Return self
    x.clear();
    x.concat(array);
    x.move(from, to);
    x.push(obj);
    x.set(array);
    x.slice(from, to);
    x.splice(index, num, object);

    // Return value
    var obj = x.get(index);
    var array = x.getAll();
    
All but get() and geAll() are chainable.

    x.push(obj).slice(2).move(4,1);

You can simply add an event listener to each element in the list. You have the event, obj, and index of the object available to you with your function.

    x.addEventListener("click", function(e, obj, index) {
        console.log(e,data,index);
    });

The available HTML attributes are:

    x-value, x-class, x-href, x-src

There is also built in pagination available. This can be used by calling initPagination(). Default values are: page size of 10, start page of 0, and no refresh (this boolean determines weather the DOM should be updated).

    x.initPagination(pageSize, pageIndex, refresh);

The other pagination methods are:

    x.setPageSize(size);
    x.setPageIndex(index);
    x.getPageIndex();
    x.nextPage();
    x.prevPage();
    x.isLastPage();
    x.isFirstPage();

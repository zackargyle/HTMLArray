HTMLArray
=======

HTML/JS List Building Tool

HTML Array Wrapper to seamlessly create repeated elements. Works great in connection with http requests. For live examples, see http://zackargyle.github.io/HTMLArray and http://zackargyle.github.io/TwitchSearch

First create a new object, passing in the id of an element you would like repeated. You can pass in an optional array as the second parameter. 

    var htmlArray = new HTMLArray(id, array);
    
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
    htmlArray.set(data);
    
This will create 2 elements that look like this.

    <div>
        <div class="c1">Hello</div>
        <div class="c2">World</div>
    </div>
    <div>
        <div class="c2">World</div>
        <div class="c1">Hello</div>
    </div>

This html list can now be manipulated like an array, with a few extras. Available are

    // Return self
    htmlArray.addEventListener(event, callback); // Adds listener for each element
    htmlArray.clear();                           // Empties everything
    htmlArray.concat(array);                     // Join to arrays
    htmlArray.move(from, to);                    // Move from index to index
    htmlArray.push(obj);                         // Add to end of list
    htmlArray.set(array);                        // Reset array to new values
    htmlArray.slice(from, to);                   // Slim down to a portion of the array
    htmlArray.splice(index, num, object);        // Insert and/or Remove at index
    htmlArray.swap(index1, index2);              // Self explanatory

    // Return value
    var obj = htmlArray.get(index);
    var array = htmlArray.getAll();
    
All but get() and geAll() are chainable.

    htmlArray.push(obj).slice(2).move(4,1);

You can simply add an event listener to each element in the list. You have the event, obj, and index of the object available to you with your function.

    x.addEventListener("click", function(e, obj, index) {
        if (selected.index !== -1) {
            x.swap(selected.index, index);
            selected.node.classList.remove("selected");
            selected.index = -1;
        } else {
            selected = {node: e.target, index: index};
            e.target.classList.add("selected");
        }
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


TODO
HTMLArray.filter()


self.addEventListener('message', function( event ) {
    getPost( event.data );
    getComments( event.data );
}, false);

function getComments( data ){
    var url = "https://jsonplaceholder.typicode.com/comments?postId="+data.postId;

    var xhr = new XMLHttpRequest();
    var response = {
        result: false,
        data: ""
    };

    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onreadystatechange = function( ){
        if( xhr.status == 200 && xhr.readyState == 4 ){
            addItems( xhr );
        }
    }
    xhr.send();

    function addItems( xhr ){
        for(var i = 0; i < xhr.response.length;i++){
            postMessage( {
                type: 'comment',
                data: addItem(xhr.response[i])
            } );
        }
    }
    var template = "<div id='{obj.id}'>\
        <p><strong>{obj.name}</strong>: {obj.body}</p>\
        <p>{obj.body}</p>\
    </div>";

    function addItem( obj ){
        return template
        .replace(/{obj.id}/g, obj.id)
        .replace(/{obj.name}/g, obj.name)
        .replace(/{obj.body}/g, obj.body)
    }
}

function getPost( data ){
    var url = "https://jsonplaceholder.typicode.com/posts?id="+data.postId;

    var xhr = new XMLHttpRequest();
    var response = {
        result: false,
        data: ""
    };

    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onreadystatechange = function( ){
        if( xhr.status == 200 && xhr.readyState == 4 ){
            addPostItems( xhr );
        }
    }
    xhr.send();

    function addPostItems( xhr ){
        for(var i = 0; i < xhr.response.length;i++){
            postMessage( {
                type: 'post',
                data: addPostItem(xhr.response[i])
            } );
        }
    }
    var template = "<div>\
        <h2>{obj.title}</h2>\
        <p>{obj.body}</p>\
    </div>";

    function addPostItem( obj ){
        console.log(obj);
        return template
        .replace(/{obj.title}/g, obj.title)
        .replace(/{obj.body}/g, obj.body)
    }
}

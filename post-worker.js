var url = "https://jsonplaceholder.typicode.com/posts";

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
    var response = "";
    for(var i = 0; i < xhr.response.length;i++){
        response += addItem(xhr.response[i]);
    }
    postMessage( response );
}
var template = "<option value='{obj.id}'>{obj.title}</option>";

function addItem( obj ){
    return template.replace(/{obj.id}/g, obj.id).replace(/{obj.title}/g, obj.title);
}

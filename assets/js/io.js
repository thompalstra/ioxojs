window['io'] = function( arg ){
    if( typeof arg == 'function' ){
        arg.call( this, null );
    } else if( typeof arg == 'object' ){
        for(var i in arg){
            io[i] = arg[i];
        }
    }
}

window['extend'] = function(){
    var extend = {};
    extend.list = arguments;
    extend.with = function( arg ){
        for(var a in arg){
            for(b=0;b<this.list.length;b++){
                if(this.list[b].prototype){
                    this.list[b].prototype[a] = arg[a];
                } else {
                    this.list[b][a] = arg[a];
                }
            }
        }
    }
    return extend;
}

window['require'] = function( path ){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', path, false);
    xhr.send();
    if( xhr.readyState == 4 ){
        if( xhr.status == 200 ){
            var exports = {};
            eval(xhr.response);
            return exports;
        }
    }
}

window.listeners = [];
window.listener = {
    add: function( obj ){
        var eventSource = null;
        if( obj.hasOwnProperty('url') ){
            eventSource = new EventSource(obj.url);
        }
        if( obj.hasOwnProperty('onmessage') ){
            eventSource.onmessage = obj.onmessage;
        }
        if( obj.hasOwnProperty('onopen') ){
            eventSource.onopen = obj.onopen;
        }
        if( obj.hasOwnProperty('onerror') ){
            eventSource.onerror = obj.onerror;
        }
    }
}

window.listener.add({
    url: 'server.php',
    onmessage: function( event ){
        console.log( event );
    },
    onopen: function( event ){
        console.log('open');
    },
    onerror: function( event ){
        console.log( event );
    }
});



Object.walk = function( obj, callable ){
    for(var i in obj){
        callable.apply(window, [obj[i], i]);
         if( typeof obj[i] == 'object' ){
             Object.walk.apply(window, [obj[i], callable])
         }
    }
}

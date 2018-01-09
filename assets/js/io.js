const ENV_DEBUG = true;

window['io'] = function( arg ){
    if( typeof arg == 'function' ){
        arg.call( this, null );
    } else if( typeof arg == 'object' ){
        for(var i in arg){
            io[i] = arg[i];
        }
    }
}

window['io'].debug = function( message ){
    console.trace( message );
}

window['extend'] = function(){
    var extend = {};
    extend.list = arguments;
    extend.with = function( arg ){
        for(var a in arg){
            for(b=0;b<this.list.length;b++){
                if(
                    this.list[b].hasOwnProperty('prototype') &&
                    this.list[b].prototype.hasOwnProperty('constructor') &&
                    this.list[b].prototype.constructor.hasOwnProperty('name') &&
                    this.list[b].prototype.constructor.name.length > 0
                ){
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

window['nav'] = function( arg ){}
extend( nav ).with({
    history: {
        queue: [],
        forward: function( obj ){
            if( obj.params.view == 'view/index.html' && obj.params.layout == 'layout/main.html' ){
                nav.history.queue = [];
            }
            nav.history.queue.push(obj);
        }
    },
    listen: function( eventType, callable ){
        this[ "on" + eventType ] = callable;
    },
    dispatch: function( eventType, params ){

        if( typeof params == 'undefined' ){
            params = {
                cancelable: true,
                bubbles: true
            };
        }

        var event = new CustomEvent( eventType, params );

        if( typeof this[ "on" + event.type ] == 'function' ){
            this[ "on" + event.type ].call( this, event );
        }
    },
    back: function(){
        if( nav.history.queue.length > 1 ){
            var last = nav.history.queue.pop();
            var previous = nav.history.queue.pop();

            nav.load(previous.params, previous.success, previous.error, previous.data);
        }
    },
    load: function( params, success, error, data ){

        console.log(params);

        if( typeof success == 'undefined' ){
            success = function(){}
        }

        if( typeof error == 'undefined' ){
            error = function(){}
        }

        if( typeof data == 'undefined' ){
            data = {};
        }

        window['data'] = data;

        var layout = document.createElement('layout');
        var documentLayout = document.findOne('layout');

        if( documentLayout instanceof Element ){

        } else {
            throw new Error('Could not find any element matching LAYOUT tags');
        }

        layout.load( params.layout, function( res ){
            var view = this.findOne('view');
            view.load( params.view, function(res){

                layout.findAll('script').forEach( function( el ){
                    eval( el.innerHTML );
                } )

                documentLayout.innerHTML = layout.innerHTML;
                nav.history.forward({
                    params: params,
                    success: success,
                    error: error,
                    data: data
                });

                nav.view = {
                    layout: params.layout,
                    view: params.view,
                    data: data
                }
                nav.dispatch('ready');
                success.call( this, null );
            }, function( err ){
                error.call( this, err );
            } );
        }, function( err ){
            error.call( this, err );
        } );
    },
    clear: function(){
        document.body.innerHTML = "";
    }
})

window['listeners'] = [];
window['listener'] = function( arg ){}
extend( listener ).with({
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
        return window.listeners.push( eventSource ) - 1;
    },
    remove: function( index ){
        if( typeof window.listeners[ index ] != 'undefined' ){
            window.listeners[ index ].close();
            window.listeners.splice( index, 1 );
            if( ENV_DEBUG ){
                io.debug.error( new Error('closed listener at listeners index ' + index) );
            }
        }
    }
});

extend( io ).with({
    title: function( str ){
        document.querySelectorAll('title').forEach( function( el ){
            console.log( el );
            el.innerHTML = str;
        } )
    },
    serialize: function( object ){
        var params = [];
        Object.walk( object, function( item, index ){
        	params.push( index + "=" + item );
        });
        return params.join('&');
    },
    ajax: function( params, success, error, data, async ){
        if( !params.hasOwnProperty('url') ){
            if( window.location.search.length > 1 ){
                params.url = location.href + window.location.search;
            } else {
                params.url = location.href;
            }
        }
        if( !params.hasOwnProperty('method') ){
            params.method = 'get';
        }
        if( !params.hasOwnProperty('responseType') ){
            params.responseType = '';
        }
        if( !params.hasOwnProperty('requestHeaders') ){
            params.requestHeaders = {};
        }
        if( typeof data == 'undefined' ){
            data = {};
        } else {
            if( params.method.toLowerCase() == 'get' ){
                params.url = params.url + "?" + io.serialize( data );
            } else if( params.method.toLowerCase() == 'post' ){
                data = io.serialize( data );
            }
        }

        if( params.method.toLowerCase() == 'post' ){
            params.requestHeaders['Content-Type'] = "application/x-www-form-urlencoded";
        }

        var xhr = new XMLHttpRequest();

        if( async === false ){
            xhr.open( params.method, params.url, false );
        } else {
            xhr.open( params.method, params.url );
        }

        for(var i in params.requestHeaders){
            xhr.setRequestHeader( i, params.requestHeaders[i] );
        }

        if( success === null || typeof success == 'undefined' ){
            success = function(){}
        } else if( typeof success !== 'function' ){
            throw new Error('Success callback MUST be of type function');
        }
        if( error === null || typeof error == 'undefined' ){
            error = function(){}
        } else if( typeof error !== 'function' ){
            throw new Error('Error callback MUST be of type function');
        }

        xhr.onreadystatechange = function( event ){
            if( this.readyState === 4 ){
                success.call( this, this.response );
            }
        }

        xhr.onerror = error;
        xhr.send( data );
    },
    get: function( params, success, error, data, async ){
        io.ajax( ( typeof params == 'string' ) ? {
            url: params,
            method: 'get',
            responseType: ''
        } : params, success, error, data, async );
    },
    post: function(  params, success, error, data, async ){
        io.ajax( ( typeof params == 'string' ) ? {
            url: params,
            method: 'post',
            responseType: ''
        } : params, success, error, data, async );
    }
})

Object.walk = function( obj, callable ){
    for(var i in obj){
         if( typeof obj[i] == 'object' ){
             Object.walk.apply(window, [obj[i], callable])
         } else {
             callable.apply(window, [obj[i], i]);
         }
    }
}

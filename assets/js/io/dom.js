io.dom = function( arg ){}

extend(Element, Document).with({
    findAll: function( query ){
        return this.querySelectorAll( query );
    },
    findOne: function( query ){
        return this.querySelector( query );
    },
    findById: function( query ){
        return this.getElementById( query );
    },
    addClass: function( a ){
        this.classList.add( a );
    },
    removeClass: function( a ){
        this.classList.remove( a );
    },
    hasClass: function( a ){
        return this.classList.contains( a );
    },
    attr: function( a, b ){
        if( b === null ){
            this.removeAttribute(a);
        } else if( typeof b == 'undefined' ){
            return this.getAttribute(a);
        } else {
            this.setAttribute(a, b);
        }
    },
    prop: function( a, b ){
        if( b === null ){
            delete this[a];
        } else if( typeof b == 'undefined' ){
            return this[a];
        } else {
            this[a] = b;
        }
    },
    toggleClass: function( a ){
        if( this.hasClass( a ) ){
            this.removeClass( a );
        } else {
            this.addClass( a );
        }
    },
    toggleAttr: function( a, b ){
        if( this.attr( a ) == b ){
            this.attr( a, null );
        } else {
            this.attr( a, b );
        }
    },
    toggleProp: function( a, b ){
        if( this.prop( a ) == b ){
            this.prop( a, null );
        } else {
            this.prop( a, b );
        }
    },
    listen: function( a, b, c, d ){
        var events = a.split(' ');
        for(var i in events){
            var eventType = events[i];
            if( typeof eventType === 'string' && typeof b === 'function' ){
                this.addEventListener( a, b, c );
            } else if( typeof b === 'string' && typeof c === 'function' ) {
                this.addEventListener( eventType, function( event ){
                    if( event.target.matches( b ) ){
                        c.call( event.target, event );
                    } else if( ( closest = event.target.closest( b ) ) ){
                        c.call( closest, event );
                    }
                } );
            }
        }
    },
    dispatch: function( eventType, params ){
        if( typeof params == 'undefined' ){
            params = {
                cancelable: true,
                bubbles: true
            };
        }
        this.dispatchEvent( new CustomEvent( eventType, params ) );
    },
    load: function( url, success, error ){
        if( typeof success == 'undefined' ){
            success = function(){}
        }
        if( typeof success == 'undefined' ){
            error = function(){}
        }
        var xhr = new XMLHttpRequest();
        xhr.open( 'get', url );
        xhr.el = this;
        xhr.onreadystatechange = function( event ){
            if( this.readyState === 4 ){
                if( this.status === 200 ){
                    this.el.innerHTML = this.response;
                    success.call( this.el, this );
                } else {
                    error.call( this.el, this );
                }
            }
        }
        xhr.onerror = error;
        xhr.send();
    }
});

extend(HTMLCollection).with({
    forEach: function( callable ){
        for(i=0;i<this.length;i++){
            callable.call( window, this[i] );
        }
    }
})

document.listen('DOMContentLoaded', function(e){
    document.dispatch( 'loaded' );
} );

extend( io ).with({
    eventHandler: function( event, params ){
        var onTrigger = this.attr('io-on-trigger');



        var params = this.attr('io-params');

        if( typeof params == 'undefined' ){
            params = {};
        } else {
            params = JSON.parse( params );
        }



        var arg = [];

        for(var i in params){
            arg.push(params[i]);
        }

        if( typeof window[onTrigger] == 'function' ){
            window[onTrigger].apply( this, arg );
        } else if(onTrigger.indexOf('.') > -1) {
            var split = onTrigger.split('.');
            var instance = undefined;
            for(i=0;i<split.length;i++){
                var part = split[i];
                if( window[ part ] ){
                    instance = window[part];
                } else if( instance[ part ] ){
                    instance = instance[part];
                }

                if( typeof instance == 'function' ){
                    instance.apply( this, arg );
                }
            }
        }
    }
});

document.listen('click', '[io-on="click"]', function( originalEvent ){
    return io.eventHandler.call( this, event );
});

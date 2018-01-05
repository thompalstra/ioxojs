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
    setClass: function( a, b ){
        this.classList.add( a );
    },
    setAttr: function( a, b ){
        this.setAttribute( a, b );
    },
    setProp: function( a, b ){

    },
    getClass: function( a ){
        return this.classList.contains( a );
    },
    getAttr: function( a, b ){
        return this.getAttribute( a );
    },
    getProp: function( a, b ){
        if( this.hasOwnProperty(a) ){
            return this[a];
        } else {
            return null;
        }
    },
    removeClass: function( a, b ){
        this.classList.remove( a );
    },
    removeAttr: function( a, b ){
        this.removeAttribute( a );
    },
    removeProp: function( a, b ){
        delete this[a];
    },
    toggleClass: function( a, b ){
        if( this.getClass( a ) ){
            this.removeClass( a );
        } else {
            this.setClass( a );
        }
    },
    toggleAttr: function( a, b ){
        if( this.getAttr( a ) == b ){
            this.removeAttr( a );
        } else {
            this.setAttr( a, b );
        }
    },
    toggleProp: function( a, b ){
        if( this.getAttr( a ) == b ){
            this.removeProp( a );
        } else {
            this.setProp( a, b );
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

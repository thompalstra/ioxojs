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
    dispatch: function( event ){
        this.dispatchEvent(event);
    }
});

document.listen('click', 'h2', function(e){console.log('is clicked')});

extend(HTMLCollection).with({
    forEach: function( callable ){
        for(i=0;i<this.length;i++){
            callable.call( window, this[i] );
        }
    }
})

document.listen('DOMContentLoaded', function(e){
    document.dispatch( new CustomEvent('loaded', {
        cancelable: false,
        bubbles: false
    }) );
} );

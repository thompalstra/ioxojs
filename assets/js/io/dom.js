window.io.dom = function( arg ){

}

window.io.extend(Element, Document).with({
    find: function( query ){
        return this.querySelectorAll( query );
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

document.listen('DOMContentLoaded', function(e){
    document.dispatch( new CustomEvent('loaded', {
        cancelable: false,
        bubbles: false
    }) );
} );

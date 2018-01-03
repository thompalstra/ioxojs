io.app = {}

extend(io.app).with({
    run: function( obj, success, error ){
        io.config = require('/assets/js/config/config.js');
        io.params = require('/assets/js/config/params.js');

        Object.walk(obj, function(item, index){
        	if( typeof item == 'function'){
        		item();
            }
        });
    }
});

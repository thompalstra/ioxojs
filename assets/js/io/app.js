io.app = {}

extend(io.app).with({
    run: function( arg, success, error ){
        io.config = require('/assets/js/config/config.js');
        io.params = require('/assets/js/config/params.js');
    }
})

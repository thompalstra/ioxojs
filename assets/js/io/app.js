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

        this.load.modules( obj.modules, function(){
            this.load.controls( obj.controls, function(){
                success.call( this, null );
            } )
        } );
    },
    load: {
        modules: function( list, complete ){
            if( list.length > 0){
                next( 0 );
            }

            function next( step ){
                var path = "assets/modules/" + list[ step ] + "/";

                var style = document.createElement('link');
                style.attr('rel', 'stylesheet');
                style.attr('href', path + "style.css");

                var script = document.createElement('script');
                script.attr('type', 'text/javascript');
                script.attr('src', path + "script.js");

                document.head.appendChild( style );
                script = document.head.appendChild( script );
                script.listen('load', function( event ){
                    if( step < list.length - 1 ){
                        next( ++step );
                    } else {
                        complete.call( io.app, null );
                    }
                })
            }
        },
        controls: function( list, complete ){
            if( list.length > 0){
                next( 0 );
            }
            function next( step ){
                var path = "assets/controls/" + list[ step ] + "/";

                var style = document.createElement('link');
                style.attr('rel', 'stylesheet');
                style.attr('href', path + "style.css");

                var script = document.createElement('script');
                script.attr('type', 'text/javascript');
                script.attr('src', path + "script.js");

                document.head.appendChild( style );
                script = document.head.appendChild( script );
                script.listen('load', function( event ){
                    if( step < list.length - 1 ){
                        next( ++step );
                    } else {
                        complete.call( io.app, null );
                    }
                })
            }
        }
    }
});

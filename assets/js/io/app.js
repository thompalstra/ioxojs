window.io.app = {}


window.io.extend(window.io.app).with({
    run: function( arg, success, error ){
        var xhr = new XMLHttpRequest();
        console.log( document.location );
        xhr.open('GET', '/assets/js/config/config.js');
        xhr.onreadystatechange = function( response ){
            if( xhr.readyState == 4 && xhr.status == 200 ){
                var config = eval( xhr.response );
                for(var i in config){
                    var item = config[i];
                    if( typeof item == 'function' ){
                        item.call( window.io.app, null );
                    } else {
                        window.io.app[i] = item;
                    }
                }
            }
        }
        xhr.send();
    }
})

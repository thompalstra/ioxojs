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
        var exports = {};
        eval(xhr.response);
        return exports;
    }
}

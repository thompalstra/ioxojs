window.io = function( arg ){

}

var Extender = function(a){
    this.list = a;

    this.with = function( arg ){
        for(var a in arg){
            for(b=0;b<this.list.length;b++){
                if(this.list[b].prototype){
                    console.log( this.list[b], a );
                    this.list[b].prototype[a] = arg[a];
                } else {
                    this.list[b][a] = arg[a];
                }
            }
        }
    }
}

window.io.extend = function(){
    return new Extender( arguments );
}

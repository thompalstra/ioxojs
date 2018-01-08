document.listen('click', 'a', function( event ){
    event.preventDefault();
    event.stopPropagation();

    var layout = this.getAttribute('l-href');
    var view = this.getAttribute('href');
    var data = this.getAttribute('io-data');

    if( data ){
        data = JSON.parse(data);
    }

    nav.load({
        layout: ( layout == null ) ? 'layout/main.html' : layout,
        view: ( view == null ) ? 'view/index.html' : view
    }, function(e){

    }, function(e){

    }, data );
});

window['sidebar'] = {
    toggle: function( query ){
        if( sidebar.visible( query ) ){
            sidebar.hide( query );
        } else {
            sidebar.show( query );
        }
    },
    visible: function( query ){
        var el = document.findOne( query );
        if( el instanceof Element ){
            return ( el.attr('show') != null );
        } else {
            throw new Error(query + ' is not a valid HTMLElement');
        }
        return
    },
    show: function( query ){
        var el = document.findOne( query );
        if( el instanceof Element ){
            el.attr('show', '');
            el.attr('hide', null);
        } else {
            throw new Error(query + ' is not a valid HTMLElement');
        }
    },
    hide: function( query ){
        var el = document.findOne( query );
        if( el instanceof Element ){
            el.attr('show', null);
            el.attr('hide', '');
        } else {
            throw new Error(query + ' is not a valid HTMLElement');
        }
    }
}

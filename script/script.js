document.listen('click', 'a', function( event ){
    event.preventDefault();
    event.stopPropagation();

    var layout = this.getAttribute('l-href');
    var view = this.getAttribute('href');

    nav.load({
        layout: ( layout == null ) ? 'layout/main.html' : layout,
        view: ( view == null ) ? 'view/index.html' : view
    });
})

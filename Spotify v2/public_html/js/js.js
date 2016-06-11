var next_artists; //URL NEXT ARTIST
var next_albums; // URL NEXT ALBUMS
var next_top_artist_track; 
var artist_selected; //ARTIST SELECTED TO FILTER ALBUMS
function request (url,action,id_carousel) {
  $.ajax({
    url: url
    
  }).success(function(response){
      if(action === "load_artists"){
          load_carousel_artist(response,id_carousel);           
      }
      else if (action === "load_albums"){ //"load_albums"        
          load_carousel_albums(response, id_carousel);
      } else if (action === "load_tracks"){
          load_tracks(response,id_carousel);
      }else if (action === "top_artists_track"){
          load_top_artists_track(response,id_carousel);
      }
  }).error(function (jqXHR,textStatus,errorThrown){
    alert("ERROR: "+jqXHR+ " "+textStatus+" "+errorThrown);
  });
}
function search_artists (url){
    var lugar = "#artists";
    var id_carousel = "#artists_carousel";
    var whatLoad = "load_artists";
    
    create_carousel(lugar,id_carousel);
    general_config_carousel(id_carousel,whatLoad);
    request(url,whatLoad,id_carousel);
}
function search_albums(url){
    var lugar = "#albums";
    var id_carousel = "#albums_carousel";
    var whatLoad = "load_albums";
    
    create_carousel (lugar,id_carousel);
    general_config_carousel(id_carousel,whatLoad);
    request(url,whatLoad,id_carousel); 
}
function search_top_artist_track(url){
     var lugar = "#top_artists_track";
    var id_carousel = "#top_artists_track_carousel";
    var whatLoad = "top_artists_track";
    
    create_carousel (lugar,id_carousel);
    general_config_carousel(id_carousel,whatLoad);
    request(url,whatLoad,id_carousel); 
}
function create_carousel (lugar,id){
    //Limpio si hay carrousel previo
    $(lugar+" "+id).remove();
    //Añado carousel a X capa
    $(lugar).append('<div id="'+id.replace("#","")+'" class="carousel slide container-fluid" data-ride="carousel"></div>');
    //$(id).empty(); //erase all previous artists
    //Creo la lista ordenada
    $(id).append('<ol class="carousel-indicators list-inline"></ol>');
    //Creo el inner
    $(id).append('<div class="carousel-inner" role="listbox"></div>');
    //Control left
    $(id).append('<a class="left carousel-control" href="'+id+'" role="button" data-slide="prev"></a>');
    $(id+' a.left').append('<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span><span class="sr-only">Previous</span>');
    //Control right
    $(id).append('<a class="right carousel-control" href="'+id+'" role="button" data-slide="next"></a>');
    $(id+' a.right').append('<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span><span class="sr-only">Next</span>');
 
    
}
function general_config_carousel (id_carousel,whatLoad){
    //FUnction de cargaar mas artistas si los hay dandole a la derecha
    if (whatLoad === "load_artists"){
         $(id_carousel+ ' .carousel-control.right').unbind('click').click(function(e){             
             load_more_artist(id_carousel);          
    
         });
    }else if (whatLoad === "load_albums"){
        $(id_carousel+ ' .carousel-control.right').unbind('click').click(function(){
             load_more_albums(id_carousel);
            
         });
    }
    //Desactivar autoslide
    $(id_carousel).carousel({
        interval: false
    }); 
}
function load_carousel_artist (response,id_carousel){
    var item_to_show = 8;
    var long = response["artists"]["items"].length;
    var division = Math.ceil(long/item_to_show);
    if ($(id_carousel+' ol li').length === 0){ //COmpruebo si ol esta vacío
        //Crear indicadores
        for (var i = 0; i < division; i++){
            $(id_carousel +' ol').append( '<li data-target="'+id_carousel+'" data-slide-to="'+i+'"></li>');
        }
         $(id_carousel+' ol.carousel-indicators ').first().add("active");
    }else{//ol ya contenía elementos, los añado al final
        var ultimo = parseInt($(id_carousel +' ol.carousel-indicators li').last().attr("data-slide-to")) + 1;
        division = division + ultimo; //Al ultimo le sumo la cantidad que le quiero sumar
        for (var i = ultimo; i < division; i++){
            $(id_carousel +' ol').append( '<li data-target="'+id_carousel+'" data-slide-to="'+i+'"></li>');
        }
    }
    //Compruebo si el inner tiene elementos item
    var contador_item =  $(id_carousel+ ' div.item').length;
    var contador = 0;
    var i = response["artists"]["previous"] === null ? 0 : contador_item; //Si previus es === null es porque es la priemra busqueda
         for ( i ; i <  division; i++){
            $(id_carousel+' .carousel-inner').append('<div id="G'+i+ '_artists" class="item"></div>');
            //$(id_carousel+' #l'+i).append('<ul id="ul_'+ i + '" class="list-inline text-center">');
            $(id_carousel+' #G'+i+'_artists').append('<ul class="list-inline text-center">');
            for ( var j = 0 ; j < item_to_show; j++) {
                    if (contador < response["artists"]["items"].length) {
                        var name = response["artists"]["items"][contador].name; //save the name
                        //Corto los nombres largos
                        if ( name.length > 30 ){
                            name = name.substring(0,29);
                        }
                        var id = response["artists"]["items"][contador].id;
                        var followers = response["artists"]["items"][contador]["followers"].total;
                        var popularity = response["artists"]["items"][contador].popularity;
                        var images = ""; //save images
                        if (response["artists"]["items"][contador].images.length === 0) {
                            images = "./images/default.jpg";
                        } else {
                            images = response["artists"]["items"][contador].images[0]["url"];
                        }
                        //$(id_carousel+' #ul_'+i).append('<li id="'+id+'"></li>');
                        $(id_carousel+' #G'+i+'_artists ul').append('<li id="'+id+'"></li>');
                        contador++;
                        $(id_carousel+' #'+id).append('<section  class="datos text-left "></section>');
                        $(id_carousel+' #'+id+" section").append(
                                '<div class="hovereffect">'+
                                    '<img src="' + images + '" alt="Chania">'+
                                    '<section class="overlay">'+
                                        '<h4 class="text-center">'+name+'</h4>'+
                                        '<div class="info text-left">'+
                                            
                                                '<span>Followers<span class="pull-right">'+followers+'</span></span>'+
                                                //'<span class="text-right">'+followers+'</span>'+
                                            
                                          
                                                '<span>Popularity <span class="pull-right">'+popularity+'</span></span>'+
                                                //'<span class="pull-right">'+popularity+'</span>'+
                                            
                                            '<div class="progress">'+
                                                '<div class=" progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="'+popularity+'" aria-valuemin="0" aria-valuemax="100" style="width: '+popularity+'%">'+
                                                    '<span class="sr-only">'+popularity+'% Complete</span>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>'+
                                    '</section>'+
                                '</div>');
                       
                    }
                    
            }  
        }
    if (response["artists"]["previous"] === null){ //Significa que es la priemra vez que entra
            $(id_carousel+" #G0_artists").first().addClass("active");
            $(id_carousel+" ol li").first().addClass("active");
            
    }
    //Al pulsar las imagenes
   
    $(id_carousel+" ul li").unbind('click').click(function (e){//Function para cada foto
        e.preventDefault();
        
        var id = $(this).attr('id');        
        var url = "https://api.spotify.com/v1/artists/" + id + "/albums?market=ES&limit=40";
        search_albums(url);
        artist_selected=id; //Save artist selected

        $('html, body').animate({
            scrollTop: $("#albums").offset().top
        }, 1000);
        e.preventDefault();
        var url = "https://api.spotify.com/v1/artists/"+id+"/top-tracks?country=ES";
        search_top_artist_track(url);
     
        
    });
    
    //hover effect
    $(id_carousel+" ul li").unbind('mouseenter').mouseenter(function (){
        var id = $(this).attr("id");
       $("#"+id +" .info").slideToggle();
    });
    $(id_carousel+" ul li").unbind('mouseleave').mouseleave(function (){
        var id = $(this).attr("id");
        $("#"+id +" .info").slideToggle();
    });
    next_artists = response["artists"]["next"]; //Guardo la direccion a la siguiente lista
}
function load_carousel_albums (response,id_carousel){
    
    var item_to_show = 8;
    var long = response["items"].length;
    var division = Math.ceil(long/item_to_show);
    if ($(id_carousel+' ol li').length === 0){ //COmpruebo si ol esta vacío
        //Crear indicadores
        for (var i = 0; i < division; i++){
            $(id_carousel +' ol').append( '<li data-target="'+id_carousel+'" data-slide-to="'+i+'"></li>');
        }
         $(id_carousel+' ol.carousel-indicators ').first().add("active");
    }else{//ol ya contenía elementos, los añado al final
        var ultimo = parseInt($(id_carousel +' ol.carousel-indicators li').last().attr("data-slide-to")) + 1;
        division = division + ultimo; //Al ultimo le sumo la cantidad que le quiero sumar
        for (var i = ultimo; i < division; i++){
            $(id_carousel +' ol').append( '<li data-target="'+id_carousel+'" data-slide-to="'+i+'"></li>');
        }
    }
    //Compruebo si el inner tiene elementos item
    var contador_item =  $(id_carousel+ ' div.item').length;
    var contador = 0;
    var i = response["previous"] === null ? 0 : contador_item; //Si previus es === null es porque es la priemra busqueda
         for ( i ; i <  division; i++){
            $(id_carousel+' .carousel-inner').append('<div id="G' +i+'_albums" class="item"></div>');
            //$(id_carousel+' #l'+i).append('<ul id="ul_'+ i + '" class="list-inline text-center">');
            $(id_carousel+' #G'+i+'_albums').append('<ul class="list-inline text-center">');
            for ( var j = 0 ; j < item_to_show; j++) {
                    if (contador < response["items"].length) {
                        var name = response["items"][contador].name; //save the name
                        var id = response["items"][contador].id;
                       var album_type = response["items"][contador].album_type;
                        var images = ""; //save images
                        if (response["items"][contador].images.length === 0) {
                            images = "./images/default.jpg";
                        } else {
                            images = response["items"][contador].images[0]["url"];
                        }
                        //$(id_carousel+' #ul_'+i).append('<li id="'+id+'"></li>');
                        $(id_carousel+' #G'+i+'_albums ul').append('<li id="'+id+'"></li>');
                        contador++;
                        $(id_carousel+' #'+id).append('<section  class="datos text-left "></section>');
                        $(id_carousel+' #'+id+" section").append(
                                '<div class="hovereffect">'+
                                    '<img src="' + images + '" alt="Chania">'+
                                    '<section class="overlay">'+
                                        '<h4 class="text-center">'+name+'</h4>'+
                                        '<div class="info text-left">'+
                                                '<span>Album Type <span class="pull-right">'+album_type+'</span></span>'+
                                                //'<span class="pull-right">'+album_type+'</span>'+
                                        '</div>'+
                                    '</section>'+
                                '</div>');
                       
                    }
                    
            }  
        }
    if (response["previous"] === null){ //Significa que es la priemra vez que entra
            $(id_carousel+" #G0_albums").addClass("active");
            $(id_carousel+" ol li").first().addClass("active");
    }
    //Al pulsar las imagenes
   
    $(id_carousel+" ul li").unbind('click').click(function (e){//Function para cada foto
        e.preventDefault();
        
        var id = $(this).attr('id');
        var album_name = $(this).find("h4").text();
        
      
        var url = "https://api.spotify.com/v1/albums/" + id + "/tracks";
        request(url,"load_tracks",album_name);
        
        e.preventDefault();

    });
     //hover effect
    $(id_carousel+" ul li").unbind('mouseenter').mouseenter(function (){
        var id = $(this).attr("id");
       $("#"+id +" .info").slideToggle();
    });
    $(id_carousel+" ul li").unbind('mouseleave').mouseleave(function (){
        var id = $(this).attr("id");
        $("#"+id +" .info").slideToggle();
    });
    next_albums = response["next"]; //Guardo la direccion a la siguiente lista
}
function load_top_artists_track(response, id_carousel){
    var item_to_show = 5;
    var tracks = [];
    
    var long = response["tracks"].length;
    var division = Math.ceil(long/item_to_show);
    if ($(id_carousel+' ol li').length === 0){ //COmpruebo si ol esta vacío
        //Crear indicadores
        for (var i = 0; i < division; i++){
            $(id_carousel +' ol').append( '<li data-target="'+id_carousel+'" data-slide-to="'+i+'"></li>');
        }
         $(id_carousel+' ol.carousel-indicators ').first().add("active");
    }else{//ol ya contenía elementos, los añado al final
        var ultimo = parseInt($(id_carousel +' ol.carousel-indicators li').last().attr("data-slide-to")) + 1;
        division = division + ultimo; //Al ultimo le sumo la cantidad que le quiero sumar
        for (var i = ultimo; i < division; i++){
            $(id_carousel +' ol').append( '<li data-target="'+id_carousel+'" data-slide-to="'+i+'"></li>');
        }
    }
    //Compruebo si el inner tiene elementos item
    var contador_item =  $(id_carousel+ ' div.item').length;
    var contador = 0;
    var i = response["previous"] === null ? 0 : contador_item; //Si previus es === null es porque es la priemra busqueda
         for ( i ; i <  division; i++){
            $(id_carousel+' .carousel-inner').append('<div id="TOP' +i+'_artist" class="item"></div>');
            //$(id_carousel+' #l'+i).append('<ul id="ul_'+ i + '" class="list-inline text-center">');
            $(id_carousel+' #TOP'+i+'_artist').append('<ul class="list-inline text-center">');
            for ( var j = 0 ; j < item_to_show; j++) {
                    if (contador < response["tracks"].length) {
                        var track_album = {};
                        var name = response["tracks"][contador].name; //save the name
                        var id = response["tracks"][contador].id;
                        var disc_number = response["tracks"][contador].disc_number;
                        var track_number = response["tracks"][contador].track_number;
                        var album_id = response["tracks"][contador]["album"].id;
                        var album_name = response["tracks"][contador]["album"].name;
                        var duration_ms = response["tracks"][contador].duration_ms;
                        var preview_url = response["tracks"][contador].preview_url;
                        var popularity = response["tracks"][contador].popularity; 
                        var images = ""; //save images
                        if (response["tracks"][contador]["album"].images.length === 0) {
                            images = "./images/default.jpg";
                        } else {
                            images = response["tracks"][contador]["album"].images[0]["url"];
                        }
                        //$(id_carousel+' #ul_'+i).append('<li id="'+id+'"></li>');
                        $(id_carousel+' #TOP'+i+'_artist ul').append('<li id="'+id+'"></li>');
                        contador++;
                        $(id_carousel+' #'+id).append('<section  class="datos text-left "></section>');
                        $(id_carousel+' #'+id+" section").append(
                                '<div class="hovereffect">'+
                                    '<img src="' + images + '" alt="Chania">'+
                                    '<section class="overlay">'+
                                        '<h4 class="text-center">'+name+'</h4>'+
                                        '<div class="info text-left">'+
                                            
                                                '<span>Popularity <span class="pull-right">'+popularity+'</span></span>'+
                                                //'<span class="pull-right">'+popularity+'</span>'+
                                           
                                           
                                                
                                           
                                            
                                        '</div>'+
                                    '</section>'+
                                '</div>');
                       
                    }
                    track_album.track_id = id;
                    track_album.track_name = name;
                    track_album.disc_number = disc_number;
                    track_album.track_number = track_number;
                    track_album.album_id = album_id;
                    track_album.album_name= album_name;
                    track_album.duration_ms= duration_ms;
                    track_album.preview_url = preview_url;
                    track_album.popularity = popularity;
                    track_album.images = images;
                    tracks.push(track_album);
            }  
        }
    
            $(id_carousel+" #TOP0_artist").addClass("active");
            $(id_carousel+" ol li").first().addClass("active");
    
    //Click on images
    $(id_carousel+" ul li").unbind('click').click(function (e){//Function para cada foto
       var id_buscar = $(this).attr("id");     
      var index = tracks.map(function (x){return x.track_id;}).indexOf(id_buscar);
      top_track_moda (tracks[index]);

    });
     //hover effect
    $(id_carousel+" ul li").unbind('mouseenter').mouseenter(function (){
        var id = $(this).attr("id");
       $("#"+id +" .info").slideToggle();
    });
    $(id_carousel+" ul li").unbind('mouseleave').mouseleave(function (){
        var id = $(this).attr("id");
        $("#"+id +" .info").slideToggle();
    });
    
}
//Load more artost when click on rigth arrow
function load_more_artist (id_carousel){
    //Miro si el penultimo esta activo
    if ($(id_carousel+' ol li:nth-last-child(2)').hasClass("active") && next_artists !== null){
        request(next_artists,"load_artists", id_carousel);
    }
}
//Load more artost when click on rigth arrow
function load_more_albums (id_carousel){
     if ($(id_carousel+' ol li:nth-last-child(2)').hasClass("active") && next_artists !== null){
         
        request(next_albums,"load_albums", id_carousel);
    }
}
//Limit element artists
function limite_element (carousel){
    //Es porque estan todos inicializados a hiden y es la priemra vez, por lo que activo los 10 primeros
        if ($(carousel+ ' ol li:visible').length === 0){
           $(carousel+ ' ol li').slice(0,10).show();
           $(carousel+ ' ul').slice(0,10).show();
        }else{
            //Guardar el índice del ultimo elemento visible
            var final = $(carousel+ ' ol li:visible').last().index();
            var final_ol = $(carousel+ ' ol li.active').index();
            if (final === final_ol){
              //Oculto todo de nuevo
                $('#myCarousel ol li').hide();
                $('#myCarousel ul').hide();
                //Muestro el nuevo grupo
                $(carousel+ ' ol li').slice(final+1,final+10).show();
               $(carousel+ ' ul').slice(final+1,final+10).show();  
            }
            
    }        
}
//Create modal TOP track
function top_track_moda (tracks){
  var id_modal = "#modal_track";
  $(id_modal+ " h4").text("Track");
  var result='<table class="table">'+
                        '<thead>'+
                            '<tr>'+
                                '<th colspan="5" class="text-center"><h2>'+tracks.track_name+'</h2></th>'+
                            '</tr>'+
                        '</thead>'+
                        '<tbody>'+
                            '<tr>'+
                                '<th class="text-center">Disc Number</th><th class="text-center">Track Number</th><th class="text-center">Album Name</th><th class="text-center">Duration</th><th class="text-center">Preview</th>'+
                            '</tr>'+    
                            '<tr>'+
                                '<td class="text-center">'+tracks.disc_number+'</td>'+
                                '<td class="text-center">'+tracks.track_number+'</td>'+
                                '<td id="'+tracks.album_id+'" class="text-center">'+tracks.album_name+'</td>'+
                                '<td class="text-center">'+millisToMinutesAndSeconds(tracks.duration_ms)+'</td>'+
                                '<td class="text-center"><a target="_blank" href="'+tracks.preview_url+'"><span class="glyphicon glyphicon-music"></span></a></td>'+
                          '</tr>';  
      
                        '</tbody>'+
            '</table>';
     // $("#tracklist_list").empty();
      //$("#tracklist_list").append(result);
      $(id_modal+" .modal-body").empty();
      $(id_modal+" .modal-body").append(result);
      $(id_modal+" td:nth-child(3)").click(function (){
         var id_album =$(this).attr("id");
        var url = "https://api.spotify.com/v1/albums/" + id_album + "/tracks";
        request(url,"load_tracks",tracks.album_name);
      });
      
      
      $(id_modal).modal('show');  
}
//create modal with albums track
function load_tracks(response, album_name){
    var id_modal="#modal";
    $(id_modal+" h4").text("Album");
      var result='<table class="table">'+
                        '<thead>'+
                            '<tr>'+
                                '<th colspan="5" class="text-center"><h2>'+album_name+'</h2></th>'+
                            '</tr>'+
                        '</thead>'+
                        '<tbody>'+
                            '<tr>'+
                                '<th class="text-center">Disc Number</th><th class="text-center">Track Number</th><th class="text-center">Track Name</th><th class="text-center">Duration</th><th class="text-center">Preview</th>'+
                            '</tr>';
                            
                      
      for (var i=0; i< response["items"].length; i++){
          var track = response["items"][i]; //save a album object in a var artist    
          var disc_number = track.disc_number;
          var duration_ms = track.duration_ms;
          var external_urls = track.external_urls;
          var href = track.href;
          var id = track.id;
          var name = track.name;
          var preview_url = track.preview_url;
          var track_number = track.track_number;
         
        
         result = result +'<tr>'+
                                '<td class="text-center">'+disc_number+'</td>'+
                                '<td class="text-center">'+track_number+'</td>'+
                                '<td class="text-center">'+name+'</td>'+
                                '<td class="text-center">'+millisToMinutesAndSeconds(duration_ms)+'</td>'+
                                '<td class="text-center"><a target="_blank" href="'+preview_url+'"><span class="glyphicon glyphicon-music"></span></a></td>'+
                          '</tr>';  
      }
      result = result + '</tbody>'+
                    '</table>';
   
      $(id_modal+" .modal-body").empty();
      $(id_modal+" .modal-body").append(result);
     
      $(id_modal).modal('show');
}
//Filter albums by type
function filter (type,id_carousel){
    $(id_carousel + " ol").empty();
    $(id_carousel + " .carousel-inner").empty();
    var url;
    if (type !== "all"){
        url = 'https://api.spotify.com/v1/artists/'+artist_selected+'/albums?market=ES&album_type='+type+'&limit=40';
    }else{
         url = 'https://api.spotify.com/v1/artists/'+artist_selected+'/albums?market=ES&limit=40';
    }
    
    request(url,"load_albums",id_carousel);
}
//Convert time of track in minutes and seconds
function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}



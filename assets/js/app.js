$(document).ready(function(){

const appProps = {
    fs: { //========================    FOURSQUARE API    =======================================================
        clientID: "IHMKAGTH1OPVZB11OJUS3YVATBRZGA4GXJFAAIVLJHSVYIVX",
        clientSECRET: "WN5TRJG5MXTFC3IXRWFFZ4WVELP13KPFB42DXZVJJ3MRLDTA",
    },    //=====================================================================================================
    googleMaps: {},
}
//===============================================================================================================
// END appProps Object
//===============================================================================================================



var appFuncs ={
    search:{
        listenSearch: function(){
            $("#searchSubmit").on("click",function(event){
                event.preventDefault();

                var bizSearch = $("#bizSearch").val().trim();
                var locationSearch = $("#locationSearch").val().trim();

                if (bizSearch === "" || locationSearch === ""){
                    var warningMessage = "Oops! Make sure that all search fields are filled out.";
                    $(".warning--Message").remove();
                    appFuncs.ui.messages.warning(warningMessage);
                } else{
                    appFuncs.search.initSearch(bizSearch, locationSearch);
                }
            });
        },
        initSearch: function(search, location){
            $.ajax({
                url:`https://api.foursquare.com/v2/venues/explore?v=20170630&query=${[search]}&near=${[location]}&limit=9&venuePhotos=1&client_id=${[appProps.fs.clientID]}
                &client_secret=${[appProps.fs.clientSECRET]}`,
                method: "GET"
            })
            .done(function(response){
                // API Object Path
                const biz = response.response.groups[0].items;

                $(".results").html('');
                $(".content--Heading").html("Search results");

                for(var i = 0; i < biz.length; i++ ){
                    //console.log(biz[i]);
                    var bizName = biz[i].venue.name;
                    var bizRating = biz[i].venue.rating;
                    var bizCity = biz[i].venue.location.city;

                    // Build Venue Image Url
                    var imgPrefix = biz[i].venue.photos.groups[0].items[0].prefix;
                    var imgSize = "325x222";
                    var imgSuffix = biz[i].venue.photos.groups[0].items[0].suffix;
                    var bizImage = imgPrefix+imgSize+imgSuffix;

                    // Get Rating Div Width value
                    var starWidth = appFuncs.ui.starRating(bizRating);

                    appFuncs.search.printSearchResults(bizName, starWidth, bizCity, bizImage);
                }
            });
        },
        printSearchResults: function (bizName, starWidth, bizCity, bizImage){
            $(".results").append(`
                <div class="card--Result">
                    <div class="card--Result__Img">
                        <img src="${[bizImage]}" alt="" width="100%" class="img-responsive">
                        <div class="shadow"></div>
                    </div>
                    <div class="card--Result__Info">
                        <h3 class="card--Title" title="${[bizName]}">${[bizName]}</h3>
                        <div class="card--Rating">
                            <div class="card--Rating__Overlay" style=width:${[starWidth]}>
                                <img src="assets/imgs/starsFill.png" alt="">
                            </div>
                        </div>
                        <div class="card--Location">
                            <p><span><img src="assets/imgs/cardLocation.png" alt=""></span>${[bizCity]}</p>
                        </div>
                    </div>
                </div>
            `);
        },
    },
    click:{
        clickCard: function(){

            // $(document).on("click", ".card--Result", function(){
            
            //     var testdialog = $(".biz--Modal");
            //     $(testdialog).appendTo("body");

            //     $(".biz--Modal").html(`
            //     <div >
            //       <p class="dialog">This is an animated dialog which is useful for displaying information. The dialog window can be moved, resized and closed with the 'x' icon.</p>
            //     </div>
            //     `);

               

            //     $(".biz--Modal").dialog({
            //           draggable:false,
            //           resizable: false,
            //           width: "50%",
            //           title: "",
            //           position: { my: "top", at: "top", of: window },
            //           modal: true,
            //         });



            //     //console.log("clicked card");
            // })
        },
    },
    ui:{
        starRating: function(rating){
            var starsRating = rating/10;
            var starsWidthNum = 100;
            var newWidth = starsRating * starsWidthNum;
           
            return (newWidth+1)+"%";
        },
        listenScroll: function(){

            $(document).on("scroll", function(){
                var scrollPosition = window.pageYOffset;
                appFuncs.ui.listenScrollDown(scrollPosition);
                appFuncs.ui.listenScrollUp(scrollPosition);
            }); 

        },
        listenScrollDown: function(scrollPosition){
            if (scrollPosition > 263){
                $(".header--Search").css({
                    position:"fixed",
                    top:"0",
                    left:"90px",
                    width:"100%",
                    height:"69px",
                    transition: ".2s",
                    borderRadius: "0",
                    borderBottom: "1px solid #a9c7ce",
                    boxShadow: "none",
                })

                $(".header--Search__Input").css({
                    width:"294px",
                    height: "67px",
                    borderRadius: "0",
                    borderRight: "1px solid #dbdee3",
                })

                $(".header--Interface").css({
                    position:"fixed",
                    right: "10px",
                    transition: ".2s",
                })

            }
        },
        listenScrollUp: function(scrollPosition){
            if (scrollPosition <= 263){

                $(".header--Search").css({
                    position: "absolute",
                    left:"calc(50% - 294px)",
                    bottom:"-35px",
                    height: "70px",
                    width:"588px",
                    borderRadius:"5px",
                    border:"none",
                    top:"",
                    "-moz-box-shadow":  "0 5px 3px #b7d1d6",
                    "-webkit-box-shadow":  "0 5px 3px #b7d1d6",
                    "box-shadow":          "0 5px 3px #b7d1d6",
                })

                $(".header--Search__Input").css({
                    width:"50%",
                    height: "70px",
                    borderRadius: "5px",
                    borderRight: "1px solid #dbdee3",
                })

                $(".header--Interface").css({
                    position:"relative",
                })
            }
        },
        messages: {
            warning: function (message){
                var msg = `
                            <div class="app--Message">
                                <p>${[message]}</p>
                                <button class="closeWarning"><img src="assets/imgs/closeWarning.png" alt="close" /></button>
                            </div>
                          `;

                    $.extend( $.ui.dialog.prototype.options.classes, {
                        "ui-dialog": "warning--Message",
                        "ui-dialog-titlebar": "modal-header",
                        "ui-dialog-title": "modal-title",
                        "ui-dialog-titlebar-close": "close",
                        "ui-dialog-content": "warning--Message__Body",
                        "ui-dialog-buttonpane": "warning--Message__Footer",
                    });



                   $(msg).dialog({
                      show: { effect: "slideDown", duration: 400 },
                      draggable:false,
                      resizable: false,
                      width: "425px",
                      title: "",
                      position: { my: "center", at: "center top", of: ".page" },
                      buttons: [
                        {
                          text: "OK",
                          click: function() {
                            $( this ).dialog( "close" );
                          }
                     
                        }
                      ],

                    });
  
                   $(".warning--Message").css({
                    position: "relative",
                  });


                   $("div.ui-dialog-buttonset > button").addClass("btn btn--FullWidth btnColorWarning");

                   $(".closeWarning").on("click", function(){
                    $(".warning--Message").remove();
                   })


            }

        },

    }
}
//===============================================================================================================
// END appFuncs Object
//===============================================================================================================


// Listen for Search Event
appFuncs.search.listenSearch();

// Listen for Scroll Event
appFuncs.ui.listenScroll();

// Listen for Click Events
appFuncs.click.clickCard();

})

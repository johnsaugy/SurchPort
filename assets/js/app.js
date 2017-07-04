$(document).ready(function(){

//===============================================================================================================
//  appProps Object
//---------------------------------------------------------------------------------------------------------------
//
//  Used to store API Keys.
//
//  appProps{} -
//              fs{} - Stores Foursquare API keys.
//              gm{} - Will store Google Maps keys.
//
//
// NOTE: It's better practice to store API keys on the backend. So if we have time before our presentation we 
//       should place them on our Firebase Server. For now, storing them here is fine.
//
//===============================================================================================================

const appProps = {
    fs: { //  FOURSQUARE API    
        clientID: "IHMKAGTH1OPVZB11OJUS3YVATBRZGA4GXJFAAIVLJHSVYIVX",
        clientSECRET: "WN5TRJG5MXTFC3IXRWFFZ4WVELP13KPFB42DXZVJJ3MRLDTA",
    },    
    gm: {},
}

//===============================================================================================================
// END appProps Object
//===============================================================================================================





//===============================================================================================================
//  appFuncs Object
//---------------------------------------------------------------------------------------------------------------
//
// appFuncs{} -
//
//          search{} -
//                  listenSearch - On search submit, grabs the venues and location values, validates them, and 
//                                 passes them on to initSearch.
//
//                  initSearch   - Takes the values from  listenSearch and uses them inside our AJAX call to the
//                                 FOURSQUARE API. Gets the necessary variables (Name, Rating, Location, Photos) 
//                                 and passes them on to printSearchResults.
// 
//                  printSearchResults -Takes the values from initSearch and renders them onto the page as our
//                                      search results
//
//          venueCard{} -
//                  clickCard - Listens for clicks on individual venue cards and passes on the venue id to be used 
//                              for an AJAX call to the FOURSQUARE API in initVenueModal.
//
//                  initVenueModal - Makes an AJAX call to the FOURSQUARE API, and returns and formats tbe data corresponding
//                                   to our modal pop-up interface. Passes the data to renderVenueModal to be rendered on the 
//                                   screen. 
//
//                  renderVenueModal - Takes the data and renders the modal pop-up on the screen with all the relevant data.
//
//          ui{} -
//                  starRating - Takes the rating value from initSearch, converts it and returns it to be used in 
//                               the rendering of the 5-Star field.
// 
//                  listenScroll - Listens for and tracks the users scrolling activities. Calls listenScrollDown and
//                                 listenScrollUp.
//
//                  listenScrollDown - When the user scrolls down past a certain point, changes the appearance of 
//                                     the header.
//
//                  listenScrollUp - When the user scrolls up past a certain point, changes the appearance of 
//                                   the header.
//
//                  messages{} -
//                             warning - Takes the value of a warning message passed to it from another function
//                                       and renders it to the screen.
//
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
                } else if(locationSearch.length === 2){
                    var warningMessage = "Oops! Make sure to include a town with your location.";
                    $(".warning--Message").remove();
                    appFuncs.ui.messages.warning(warningMessage);
                }else{
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
                console.log(response);
                const biz = response.response.groups[0].items;

                $(".results").html('');
                $(".content--Heading").html("Search results");

                for(var i = 0; i < biz.length; i++ ){
                    //console.log(biz[i]);
                    var bizName = biz[i].venue.name;
                    var bizRating = biz[i].venue.rating;
                    var bizCity = biz[i].venue.location.city;
                    var bizId = biz[i].venue.id;
                    
                    // Build Venue Image Url
                    var imgPrefix = biz[i].venue.photos.groups[0].items[0].prefix;
                    var imgSize = "325x222";
                    var imgSuffix = biz[i].venue.photos.groups[0].items[0].suffix;
                    var bizImage = imgPrefix+imgSize+imgSuffix;

                    // Get Rating Div Width value
                    var starWidth = appFuncs.ui.starRating(bizRating);

                    appFuncs.search.printSearchResults(bizName, starWidth, bizCity, bizImage, bizId);
                }
            });
        },
        printSearchResults: function (bizName, starWidth, bizCity, bizImage, bizId){
            $('html, body').scrollTop(300);
            $(".results").append(`
                <div class="card--Result" data-venueid="${[bizId]}">
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
    venueCard:{
        clickCard: function(){

            $(document).on("click", ".card--Result", function(){
            
                var venueID = $(this).data("venueid");
                                //${[venueID]}

                appFuncs.venueCard.initVenueModal(venueID);


            })
        },
        initVenueModal: function(venueID){
            console.log(venueID);
            $.ajax({
                url: `https://api.foursquare.com/v2/venues/${[venueID]}?v=20170630&client_id=${[appProps.fs.clientID]}
                &client_secret=${[appProps.fs.clientSECRET]}`,
                method: "GET",
            })
            .done(function(response){
                // console.log(response);
                var venue = response.response.venue;

                //====================== GETTING VENUE VALUES to pass on to the Modal Box.

                // Name

                var bizName = venue.name;

                // Ratings

                // Star Rating Widget

                var bizRating = getStarRating(); // Star Field

                function getStarRating(){
                    if (venue.hasOwnProperty('ratingSignals')){
                        var starFieldWidth = appFuncs.ui.starRating(venue.rating);
                        return `${[starFieldWidth]} ratings`;
                    }else{
                        return "0";
                    }
                };

                // Number of Ratings   

                var bizRatingNumb = getBizRatingNumb();

                function getBizRatingNumb(){
                    if (venue.ratingSignals >= 1){
                        return `${[venue.ratingSignals]} ratings`;
                    } else {
                        return "No ratings yet";
                    }
                };

                // Price Tier ($$$$)

                var bizPriceTier = getPriceTier();

                function getPriceTier(){
                    var priceIconsArray = [];

                    if (venue.hasOwnProperty('price')){
                        for (var i = 0; i < venue.price.tier; i++) {
                            var dollarSign = "$";
                            priceIconsArray.push(dollarSign);

                        }
                    } 
                    return priceIconsArray.join("");
                    
                };

                // Category Tags

                var bizTags = getBizTags();

                function getBizTags(){
                    var tagsArray = [];

                        for (var i = 0; i < venue.categories.length; i++) {

                            if (i <= 1 ){
                                var tags = "<a href='#/''>"+venue.categories[i].name+"</a>";
                                tagsArray.push(tags);
                            }
                        }

                    return tagsArray.join(", ")
                };

                // Contact Info

                var bizAddress = `${[venue.location.formattedAddress[0]]}</br>${[venue.location.formattedAddress[1]]}`;

                var bizDirections = `https://www.google.com/maps/place/${[venue.location.formattedAddress[0]]} ${[venue.location.formattedAddress[1]]}`;
                
                var bizUrl = getBizUrl();

                function getBizUrl(){
                    if (venue.hasOwnProperty('url')){
                        return `<a href="${[venue.url]}" target="_blank" class="venueUrl">${[venue.url]}</a>`;
                    } else {
                        return "No website provided"
                    }
                };
               
                var bizPhone = getBizPhone();

                function getBizPhone(){
                    if (venue.contact.hasOwnProperty('formattedPhone')){
                        return venue.contact.formattedPhone;
                    } else {
                        return "No phone provided"
                    }
                };

                // Business Image

                var bizImage = getBizImage();

                function getBizImage(){
                    if (venue.hasOwnProperty('bestPhoto')){
                        return `${[venue.bestPhoto.prefix]}325x222${[venue.bestPhoto.suffix]}`;
                    }
                };

                // Business Hours

                var bizOpenStatus = getBizOpenStatus();

                function getBizOpenStatus(){
                    
                    if (venue.hasOwnProperty('hours')){
                        return venue.hours.status;
                    } else {
                        return "No time information provided.";
                    }
                }

                var bizTimeFrames = getBizTimeFrames();

                function getBizTimeFrames(){
                    var renderedTimesArray = [];
                    var daysArray = [];
                    var hoursArray = [];

                    if (venue.hasOwnProperty('hours')){

                        for (var i = 0; i < venue.hours.timeframes.length; i++) {
                            var days = venue.hours.timeframes[i].days;
                            daysArray.push(days);
                        }

                        for (var i = 0; i < venue.hours.timeframes.length; i++) {
                            var hours = venue.hours.timeframes[i].open[0].renderedTime;
                            hoursArray.push(hours);
                            
                        }

                        for (var i = 0; i < daysArray.length; i++) {
                            var operatingTimes = `
                                <div class="hours--Slot">
                                    <p class="dayData">${[daysArray[i]]}</p>
                                    <div class="timeData">
                                        <div class="timeSlot">${[hoursArray[i]]}</div>
                                    </div>
                                </div>
                            `;
                            renderedTimesArray.push(operatingTimes);
                        }
                        return renderedTimesArray.join("");
                    }
                };


                // Get Tips

                var bizTips = getBizTips();

                function getBizTips(){

                    var tipInfoArray = [];
                    var bizTipsArray = [];

                    if (venue.tips.groups[0].items.length <= 3 ){
                        for (var i = 0; i < venue.tips.groups[0].items.length; i++) {
                            var tipInfo =[
                                // Image
                               `${[venue.tips.groups[0].items[i].user.photo.prefix]}35x35${[venue.tips.groups[0].items[i].user.photo.suffix]}`,
                                // Name
                                `${[venue.tips.groups[0].items[i].user.firstName]} ${[venue.tips.groups[0].items[i].user.lastName]}`,
                                // Tip
                                `${[venue.tips.groups[0].items[i].text]}`,
                            ];
                            tipInfoArray.push(tipInfo);

                        }
                    } else {
                        for (var i = 0; i <= 3; i++) {
                            var tipInfo =[
                                // Image
                               `${[venue.tips.groups[0].items[i].user.photo.prefix]}35x35${[venue.tips.groups[0].items[i].user.photo.suffix]}`,
                                // Name
                                `${[venue.tips.groups[0].items[i].user.firstName]} ${[venue.tips.groups[0].items[i].user.lastName]}`,
                                // Tip
                                `${[venue.tips.groups[0].items[i].text]}`,
                            ];
                            tipInfoArray.push(tipInfo);

                        }
                    }


                    for (var i = 0; i < tipInfoArray.length; i++) {
                        var tipCard = `
                            <div class="tipCard biz--Modal__card">
                                <div class="tipCard--Header">
                                    <img src="${[tipInfoArray[i][0]]}" class="tipCard--UserImg img-circle " alt="user image" />
                                    <h4 class="tipCard--UserName">${[tipInfoArray[i][1]]}</h4>
                                    <a href="#/" class="tipCard--Options" ><img src="assets/imgs/tipCardOptions.png" alt="options" /></a>
                                </div>
                                <div class="tipCard--Tip">
                                    ${[tipInfoArray[i][2]]}
                                </div>
                            </div>
                        `;

                        bizTipsArray.push(tipCard);


                    }

                    return bizTipsArray.join(" ");
                    //console.log(bizTipsArray);


                };

                // Get Photos

                var bizPhotos = getBizPhotos();

                function getBizPhotos(){
                    var bizPhotosRenderingArray = [];
                    var bizPhotosArray = [];

                    if (venue.photos.groups.length != 0){

                        for (var i = 1; i < venue.photos.groups[0].items.length; i++) {
                            
                            if (i <= 4){
                                var venuePhoto = `${[venue.photos.groups[0].items[i].prefix]}135x135${[venue.photos.groups[0].items[i].suffix]}`;
                                bizPhotosArray.push(venuePhoto);
                            }
                        }

                        for (var i = 0; i < bizPhotosArray.length; i++) {
                            var venuePhotoRender = `<a href="#/"><img src="${[bizPhotosArray[i]]}" class="img-responsive" alt="" /></a>`;
                            bizPhotosRenderingArray.push(venuePhotoRender);
                        }
                        return bizPhotosRenderingArray.join(" ");

                    } else {
                        return `No Photos`;
                    }
                };

                //console.log(bizPhotos);
                //console.log(venue.photos.groups[0].items[1].prefix +"135x135"+ venue.photos.groups[0].items[1].suffix); // venue photos
                //console.log(bizTips);
                // console.log(venue.name);
                // console.log(venue.url);
                // console.log(venue.price.tier); //convert number to dollar signs.
                // console.log(venue.ratingSignals, "number of ratings");
                // console.log(venue.rating); // for star field
                // console.log(venue.tips.groups[0].items[0]); // user object
                // console.log(venue.tips.groups[0].items[0].text); // user tip text
                // console.log(venue.tips.groups[0].items[0].user.firstName + " " + venue.tips.groups[0].items[0].user.lastName); //user name
                // console.log(venue.tips.groups[0].items[0].user.photo.prefix+"35x35"+venue.tips.groups[0].items[0].user.photo.suffix); //user photo
                // console.log(venue.bestPhoto.prefix+"325x222"+venue.bestPhoto.suffix); // venue Photo
                // console.log(venue.contact.formattedPhone) // phone
                // console.log(venue.location.formattedAddress[0], venue.location.formattedAddress[1] ) // address
                //console.log(venue.categories[0].name) // tags
                // console.log(venue.hours.status); // open status
                // console.log(venue.hours.timeframes[0].days); //time Frames days.
                // console.log(venue.hours.timeframes[0].open[0].renderedTime); //time Frames hours 

                appFuncs.venueCard.renderVenueModal(bizImage, bizName, bizRating, bizRatingNumb, bizPriceTier, bizTags, bizAddress, bizDirections, bizUrl, bizPhone, bizOpenStatus, bizTips, bizPhotos, bizTimeFrames);

            })
        },
        renderVenueModal: function (bizImage ,bizName, bizRating, bizRatingNumb, bizPriceTier, bizTags, bizAddress, bizDirections, bizUrl, bizPhone, bizOpenStatus, bizTips, bizPhotos, bizTimeFrames){
                $("body").addClass("noScroll");



                var modal = `
                            <div class="result--Modal">
                                <div class="result--Modal__Close">CLOSE <img src="assets/imgs/closeModal.png" alt="" /> </div>
                                <div class="biz--Modal clearfix">
                                    <div class="biz--Modal__sidebar">
                                        <div class="biz--TitleCard biz--InfoCard biz--Modal__card">
                                            <div class="biz--TitleCard__Img">
                                                <img src="${[bizImage]}" alt="">
                                            </div>
                                            <div class="biz--InfoCard__content">
                                                <h3>${[bizName]}</h3>
                                                <div class="biz--TitleCard__Rating">
                                                    <div class="card--Rating__Overlay" style="width:${[bizRating]}">
                                                        <img src="assets/imgs/starsFill.png" alt="">
                                                    </div>
                                                </div>
                                                <p class="biz--Ratings">${[bizRatingNumb]}</p>
                                                <div class="biz--TitleCard__Tags">
                                                    <div class="card--PricePoint"><h3>${[bizPriceTier]}</h3></div>
                                                    <div class="biz--Tags">
                                                        ${[bizTags]}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="biz--MapCard biz--InfoCard biz--Modal__card">
                                            <div class="biz--MapCard__Map"></div>
                                            <div class="biz--InfoCard__content">
                                                <div class="biz--ContactInfo">
                                                    <div class="biz--ContactIcon"><img src="assets/imgs/locationModal.png" alt="address"/></div>
                                                    <div class="biz--ContactDetails">
                                                        ${[bizAddress]}
                                                        </br>
                                                        <a href="${[bizDirections]}" target="_blank" class="bizDirectionsLink">Get directions</a>
                                                    </div>
                                                </div>
                                                <div class="biz--ContactInfo">
                                                    <div class="biz--ContactIcon"><img src="assets/imgs/linkModal.png" alt="website"/></div>
                                                    <div class="biz--ContactDetails">

                                                        ${[bizUrl]}

                                                    </div>
                                                </div>
                                                <div class="biz--ContactInfo">
                                                    <div class="biz--ContactIcon"><img src="assets/imgs/phoneModal.png" alt="phone"/></div>
                                                    <div class="biz--ContactDetails">
                                                        <phone>${[bizPhone]}</phone>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="biz--HoursCard biz--InfoCard biz--Modal__card">
                                            <div class="biz--InfoCard__content">
                                                <div class="hours--Icon"><img src="assets/imgs/hoursModal.png" alt="hours"/></div>
                                                <div class="hours--Status">${[bizOpenStatus]}</div>
                                                <div class="hours--Details">

                                                    ${[bizTimeFrames]}

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="biz--Modal__content">
                                        <div class="biz--Modal__actions">
                                            <ul>
                                                <li><button class="btn btnColorGreen">ADD TO FAVORITES</button></li>
                                                <li><button class="btn btnColorBlue">ADD TO LIST</button></li>
                                                <li>
                                                    <a href="#/" data-toggle="tooltip" title="Share"><img src="assets/imgs/shareModal.png" alt="share" /></a>
                                                </li>
                                                <li>
                                                    <a href="#/" data-toggle="tooltip" title="Options"><img src="assets/imgs/optionsModal.png" alt="other options"/></a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div class="biz--Modal__Heading">
                                            <h2>Tips</h2>
                                            <a href="#/">See more</a>
                                        </div>

                                            ${[bizTips]}

                                        <div class="biz--Modal__Heading">
                                            <h2>Photos</h2>
                                            <a href="#/">See more</a>
                                        </div>
                                        <div class="photosCard biz--Modal__card ">

                                            ${[bizPhotos]}

                                        </div>
                                    </div>
                                </div>
                            </div>
                          `;


                    // To Overwrite jQueryUI Modal Styling and  make it look "on-brand".

                    $.extend( $.ui.dialog.prototype.options.classes, {
                        "ui-dialog": "app--Modal",
                        "ui-dialog-titlebar": "modal-header",
                        "ui-dialog-title": "modal-title",
                        "ui-dialog-titlebar-close": "close",
                        "ui-dialog-content": "app--Modal__Body",
                        "ui-dialog-buttonpane": "app--Modal__Footer",
                    });



                   $(modal).dialog({
                      show: { effect: "fadeIn", duration: 100 },
                      draggable:false,
                      resizable: false,
                      width: "100%",
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

                   $(".result--Modal").css({
                    position: "fixed",
                    "z-index": "10",
                    background: "rgba(13, 13, 14, 0.95)",
                    left: "0",
                    top: "0",
                    width: "100%",
                    height: "100%",
                    "overflow-x": "hidden",
                   });

                $(".app--Modal").css({
                    "overflow-x": "hidden",
                    left: "0",
                    "z-index": "10",
                   });

                $(".result--Modal__Close").on("click", function(){
                    $(".result--Modal").remove();
                    $("body").removeClass("noScroll");
                })

                $('[data-toggle="tooltip"]').tooltip(); 
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
                    "-moz-box-shadow":  "0 15px 18px -5px #b7d1d6",
                    "-webkit-box-shadow":  "0 15px 18px -5px #b7d1d6",
                    "box-shadow":          "0 15px 18px -5px #b7d1d6",
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
                      width: "445px",
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
appFuncs.venueCard.clickCard();

// Bootstrap Tooltip Init
$('[data-toggle="tooltip"]').tooltip(); 

});

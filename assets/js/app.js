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
//          click{} -
//                  clickCard - Will be used in the creation of our pop-up dialog box with all the relevant venue
//                              information.
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
    click:{
        clickCard: function(){

            $(document).on("click", ".card--Result", function(){
            
                var venueID = $(this).data("venueid");
                                //${[venueID]}

                $("body").addClass("noScroll");

                var modal = `
                            <div class="result--Modal">
                                <div class="result--Modal__Close">CLOSE <img src="assets/imgs/closeModal.png" alt="" /> </div>
                                <div class="biz--Modal clearfix">
                                    <div class="biz--Modal__sidebar">
                                        <div class="biz--TitleCard biz--InfoCard biz--Modal__card">
                                            <div class="biz--TitleCard__Img">
                                                <img src="assets/imgs/resultCard.png" alt="">
                                            </div>
                                            <div class="biz--InfoCard__content">
                                                <h3>Thai Food Galore Blah</h3>
                                                <div class="biz--TitleCard__Rating">
                                                    <div class="card--Rating__Overlay">
                                                        <img src="assets/imgs/starsFill.png" alt="">
                                                    </div>
                                                    <p>142 Ratings</p>
                                                </div>
                                                <div class="biz--TitleCard__Tags">
                                                    <div class="card--PricePoint"><h3>$$</h3></div>
                                                    <div class="biz--Tags">
                                                        <a href="#">Sushi, Asian Fusion, Beer</a>
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
                                                        950 N. Glebe Ave. </br>
                                                        Arlington, VA 22222 </br>
                                                        <a href="#" class="bizDirectionsLink">Get directions</a>
                                                    </div>
                                                </div>
                                                <div class="biz--ContactInfo">
                                                    <div class="biz--ContactIcon"><img src="assets/imgs/linkModal.png" alt="website"/></div>
                                                    <div class="biz--ContactDetails">
                                                        <a href="#">www.thaitogo.com</a>
                                                    </div>
                                                </div>
                                                <div class="biz--ContactInfo">
                                                    <div class="biz--ContactIcon"><img src="assets/imgs/phoneModal.png" alt="phone"/></div>
                                                    <div class="biz--ContactDetails">
                                                        <phone>(240) 445-7859</phone>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="biz--HoursCard biz--InfoCard biz--Modal__card">
                                            <div class="biz--InfoCard__content">
                                                <div class="hours--Icon"><img src="assets/imgs/hoursModal.png" alt="hours"/></div>
                                                <div class="hours--Status">Closed until 6 PM</div>
                                                <div class="hours--Details">
                                                    <div class="hours--Slot">
                                                        <p class="dayData">Mon - Fri</p>
                                                        <div class="timeData">
                                                            <div class="timeSlot">9:00 AM - 4:00 PM</div>
                                                            <div class="timeSlot">6:00 PM - 11:30 PM</div>
                                                        </div>
                                                    </div>
                                                    <div class="hours--Slot">
                                                        <p class="dayData">Sat</p>
                                                        <div class="timeData">
                                                            <div class="timeSlot">9:00 AM - 6:30 PM</div>
                                                        </div>
                                                    </div>
                                                    <div class="hours--Slot">
                                                        <p class="dayData">Sun</p>
                                                        <div class="timeData">
                                                            <div class="timeSlot">9:00 AM - 4:00 PM</div>
                                                        </div>
                                                    </div>
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
                                                    <a href="#"><img src="assets/imgs/shareModal.png" alt="share"/></a>
                                                </li>
                                                <li>
                                                    <a href="#"><img src="assets/imgs/optionsModal.png" alt="other options"/></a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div class="biz--Modal__Heading">
                                            <h2>Tips</h2>
                                            <a href="#">See more</a>
                                        </div>
                                        <div class="tipCard biz--Modal__card">
                                            <div class="tipCard--Header">
                                                <img src="assets/imgs/ui3.jpg" class="tipCard--UserImg img-circle " alt="user image" />
                                                <h4 class="tipCard--UserName">Joseph Smith</h4>
                                                <a href="#" class="tipCard--Options" ><img src="assets/imgs/tipCardOptions.png" alt="options" /></a>
                                            </div>
                                            <div class="tipCard--Tip">
                                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam fuga non quasi amet fugit dolorum tenetur pariatur voluptatem ea iusto eaque, dolor suscipit soluta illo veniam aut mollitia cum veritatis.
                                            </div>
                                        </div>
                                        <div class="tipCard biz--Modal__card">
                                            <div class="tipCard--Header">
                                                <img src="assets/imgs/ui4.jpg" class="tipCard--UserImg img-circle " alt="user image" />
                                                <h4 class="tipCard--UserName">Anyanka Chase</h4>
                                                <a href="#" class="tipCard--Options" ><img src="assets/imgs/tipCardOptions.png" alt="options" /></a>
                                            </div>
                                            <div class="tipCard--Tip">
                                                <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vero iste suscipit provident vitae quos tenetur explicabo molestias natus, recusandae hic nesciunt repellat odit facere necessitatibus, quae culpa molestiae ab! Sit!</div><div>Mollitia, deleniti non quas laborum architecto facere quisquam. Soluta cupiditate provident nobis voluptates, recusandae voluptatem fugiat atque sequi eos a voluptate neque incidunt odit vel nisi ullam reprehenderit, illo accusantium.</div>
                                            </div>
                                        </div>
                                        <div class="tipCard biz--Modal__card">
                                            <div class="tipCard--Header">
                                                <img src="assets/imgs/ui1.jpg" class="tipCard--UserImg img-circle " alt="user image" />
                                                <h4 class="tipCard--UserName">Alex Harris</h4>
                                                <a href="#" class="tipCard--Options" ><img src="assets/imgs/tipCardOptions.png" alt="options" /></a>
                                            </div>
                                            <div class="tipCard--Tip">
                                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Earum pariatur quaerat possimus minima numquam, ab necessitatibus beatae nisi quo inventore ad, libero tenetur animi eveniet rem totam culpa, doloribus eos.
                                            </div>
                                        </div>
                                        <div class="biz--Modal__Heading">
                                            <h2>Photos</h2>
                                            <a href="#">See more</a>
                                        </div>
                                        <div class="photosCard biz--Modal__card">
                                            Photos
                                        </div>
                                    </div>
                                </div>
                            </div>
                          `;

                    $.extend( $.ui.dialog.prototype.options.classes, {
                        "ui-dialog": "app--Modal",
                        "ui-dialog-titlebar": "modal-header",
                        "ui-dialog-title": "modal-title",
                        "ui-dialog-titlebar-close": "close",
                        "ui-dialog-content": "app--Modal__Body",
                        "ui-dialog-buttonpane": "app--Modal__Footer",
                    });



                   $(modal).dialog({
                      show: { effect: "fadeIn", duration: 200 },
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

            })
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
appFuncs.click.clickCard();

})

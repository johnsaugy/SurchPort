$(document).ready(function(){

    var appSearch = {
        runSearch: function(){ 
        //======================================================= 
        //  1) When a Search is Submitted, we grab the values from the input fields. 
        //  2) We validate both values to ensure they're not blank.
        //  3) We empty the results div HTML, and repopulate it with our search query results.
            $("#searchSubmit").on("click",function(event){
                event.preventDefault();


                var bizSearch = $("#bizSearch").val();
                var locationSearch = $("#locationSearch").val();

                if (bizSearch === "" || locationSearch === ""){
                    alert("Must provide a term and location.")
                } else {
                    $.ajax({
                            url: `https://yelp-search.herokuapp.com/search?term=${[bizSearch]}&location=${[locationSearch]}` ,
                            method: "GET",
                        })
                    .done(function(response){
                        // console.log(response);
                        // console.log(response.businesses[0].image_url)
                        $(".results").html("");
                        $(".content--Heading").html("Search results");

                        var biz = response.businesses;
                        for (var i = 0; i < biz.length; i++){
                            var bizImg = biz[i].image_url;
                            var bizName = biz[i].name;
                            var bizRating = biz[i].rating;
                            var bizCity = biz[i].location.city;
                            //console.log(bizImg, bizName, bizRating, bizCity);

                            $(".results").append(`
                                    <div class="card--Result">
                                        <div class="card--Result__Img">
                                            <img src="${[bizImg]}" alt="" width="100%" class="img-responsive">
                                        </div>
                                        <div class="card--Result__Info">
                                            <h3 class="card--Title" title="${[bizName]}">${[bizName]}</h3>
                                            <div class="card--Rating">
                                                <div class="card--Rating__Overlay">
                                                    <img src="assets/imgs/starsFill.png" alt="">
                                                </div>
                                            </div>
                                            <div class="card--Location">
                                                <p><span><img src="assets/imgs/cardLocation.png" alt=""></span>${[bizCity]}</p>
                                            </div>
                                        </div>
                                    </div>
                                `);


                        }
        
                    })
                }

                console.log(bizSearch);
                console.log(locationSearch);

            })
        },

    }


appSearch.runSearch();

})



// var searchTerm = document.getElementsByClassName("header--Search__Input")[0];
// var searchLocation = document.getElementsByClassName("header--Search__Input")[0];
// var runFunc = document.getElementsByClassName("runFunction")[0];
// var results = document.getElementsByClassName("results")[0];

// runFunc.addEventListener("click", function(){
// results.innerHTML = " ";
    

// $.ajax({
//  url: "https://yelp-search.herokuapp.com/search",
//  method: "GET",
//  data: {
//  	term: searchTerm.value,
// 	location: searchLocation.value
// },
//  success: function(response){
//      console.log(response)
//     response.businesses.forEach(function(business){
//     yelpApi(business);
// })

//  for(let i = 0; i < response.businesses.length ; i++){

// 	console.log(response.businesses[i]);
// 	console.log(response.businesses[i].location);

// 	yelpApi(response.businesses[i]);

// }
// }
// })

// function yelpApi(business) {
//     var searchResults = document.getElementsByClassName("results")[0];
//     var resultDiv = "<a target='_blank' href = ' "+ business.url + "  '><div class='card--Result'><img src='";
//     resultDiv += business.image_url;
//     resultDiv += "'> ";
//             resultDiv += "<div class='card--Title'>";
//             resultDiv += business.name;
//                 resultDiv += "<div class='category'>";
//              	resultDiv += business.categories[0]
//                 resultDiv += "<div class='location'>";
//                 resultDiv += business.location.address + ", " + business.location.city+", " + business.location.state_code + " " + business.location.postal_code;
//                 resultDiv += "</div>";
//     			resultDiv += "<div class='card--Rating'>";
//              	resultDiv += business.rating
//              	resultDiv += "</div>";
//              	resultDiv += "<div class='snippet'>";
//              	resultDiv += business.snippet_text
//              	resultDiv += "</div>";
//                 resultDiv += "</div></div>";
//                 resultDiv += "</a>"
                
    
//     searchResults.innerHTML += resultDiv;

   
// }
// })

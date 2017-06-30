// John owns the repository. This is an exercise in pull requests.

$(document).ready(function(){

	 //================================ Star Ratings ================================

		var starsRating = 9.2/10;
		var starsWidthNum = 100;
		var newWidth = starsRating * starsWidthNum;
		var starsWidth = $(".card--Rating__Overlay").css("width", (newWidth+1)+"%");

	//===============================================================================

	//================================= Scroll Events ===============================

	 $(document).on("scroll", function(){
	 	var scrollPosition = window.pageYOffset;
	 	//console.log(window.pageYOffset);

	 	listenScrollDown();

	 	function listenScrollDown(){
	 			 	
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
		 		})

		 	} else{
		 		listenScrollUp();
		 	}
	 	}

	 	function listenScrollUp(){
	 		
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
	 	}

	 });
	 
	 //===============================================================================

	});
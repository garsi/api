$(document).ready(function(){


//Set search start index
  var index = 0;


//Save donor's search entry
  function donorSearch () {
    $('#searchForm').submit(function(e){
      e.preventDefault();
      var donorCity = $('#formCity').val();
      var donorState = $('#formState').val();
      console.log(donorCity + ", " + donorState);
      validateSearch(donorCity, donorState);
    });
  }
  donorSearch();


//Validate user has entered a state
  function validateSearch (donorCity, donorState) {
    if(donorState == "" || donorCity == "") {
      console.log("no city or state");
      $('main section:first-child p').removeClass('hide').html('Please enter a city and state to find a project.');
    } else {
      console.log("city or state validated");
      $('main section:first-child p').addClass('hide');
      $('#returnCity').html(donorCity);
      $('#returnState').html(donorState);
      requestData(donorCity, donorState);
    }
  }


//Requesting data - do I have any?
  function requestData(donorCity, donorState) {

	var apiKey = 'DONORSCHOOSE'

	var max = 12

	var requestURL = 'http://api.donorschoose.org/common/json_feed.html?keywords?state?&callback=?';

	$.getJSON(requestURL, {
	  'apikey': apiKey,
	  'state': donorState,
	  'keywords': donorCity,
	  'index': index,
	  'max': max,
	},

	  function(data){
	      if(data.proposals && data.totalProposals > 0) {
	        console.log("we have results!");
	        $('#results h3').addClass('hide');
	        //index += 12;
	        buttonState(data);
	        displayResults(data, donorCity, donorState);
	      } else {
	        console.log("sorry, no results");
	        $('main section:first-child p').removeClass('hide').html('No results in this area. Please try another city or state.');
	      }
	  }

  )};


//Push data to display results
  function displayResults(data, donorCity, donorState) {
    console.log(data);
    var projectInfo = '<h2>Projects in ' + donorCity + ', ' + donorState + '</h2><h6><em>*Clicking the select project button will take you to DonorsChoose.org website.</em></h6>';
        $.each(data.proposals, function(i, info) {
          projectInfo += 
          '<article><h1>' + info.title + '</h1><p class="listschool">' 
              + info.schoolName + '</p><p><img src="' 
              + info.imageURL + '" alt="school picture"></p><p>' 
              + info.fulfillmentTrailer + '</p><p><strong>Just $' 
              + info.costToComplete + ' </strong> to real goal!</p><p><strong>Join ' 
              + info.numDonors + '</strong> other donors.</p><p><form action="' 
              + info.proposalURL + '" target="_blank"><input type="submit" value="Select Project"></form></article>';
        });

    $('#searchResults').html(projectInfo);
    $('#moreResults').removeClass('hide');
    
    if ((index+12) < data.totalProposals) {
    	$('#moreResults p').html('Displaying ' + (index+12) + ' out of ' + data.totalProposals + ' projects');
    } else {
    	$('#moreResults p').html('Displaying ' + data.totalProposals + ' out of ' + data.totalProposals + ' projects');
    }

    getMore(data, donorCity, donorState);
    //previous(data, donorCity, donorState);

  }


//Allow "more" and "previous" buttons to be clicked when only if additional data is available
	function buttonState(data){
		if ((index+12) > data.totalProposals) {
			$('#more').attr('disabled', true);
		} else {
			$('#more').attr('disabled', false);
		}

		if (index <=12) {
			$('#prev').attr('disabled', true);
		} else {
			$('#prev').attr('disabled', false);
		}
	}


//Add more results when button is clicked
  function getMore(data, donorCity, donorState) {
    $('#more').click(function(e) {
    	e.preventDefault();
    	index += 12;
		donorSearch(donorCity, donorState);
		requestData(donorCity, donorState);
		$('body').animate({scrollTop:200}, 'slow');
		return false;
    });
  }


 /*
 //Get previous results when button is clicked
  function previous(data, donorCity, donorState) {
    $('#prev').click(function(e) {
		e.preventDefault();
		index -= 12;
		donorSearch(donorCity, donorState);
		requestData(donorCity, donorState);
		$('body').animate({scrollTop:200}, 'slow');
		return false;
    });
  }
*/


});


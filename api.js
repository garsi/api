$(document).ready(function(){


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

    var requestURL = 'http://api.donorschoose.org/common/json_feed.html?keywords?state?&callback=?';

    $.getJSON(requestURL, {
      'apikey': apiKey,
      'state': donorState,
      'keywords': donorCity,
    },
      function(data){
          if(data.proposals && data.proposals.length > 0) {
            console.log("we have results!");
            $('#results h3').addClass('hide');
            displayResults(data);
          } else {
            console.log("sorry, no results");
            $('main section:first-child p').removeClass('hide').html('No results in this area. Please try another city or state.');
          }
      }

  )};


//Push data to display results
  function displayResults(data) {
    console.log(data);
    $('#results').removeClass('hide');
    $.each(data.proposals, function() {
      $('#title').html(data.proposals[0].title);
      $('#schoolName').html(data.proposals[0].schoolName);
      $('#picture').html('<img src="' + data.proposals[0].imageURL + '" alt="school picture">')
      $('#desc').html(data.proposals[0].shortDescription + '<br><br>' + data.proposals[0].fulfillmentTrailer);
      $('#cost').html('Just $' + data.proposals[0].costToComplete + ' left to real goal.');
      $('#donors').html('Join ' + data.proposals[0].numDonors + ' other donors!');
      $('#link').html('<form action="' + data.proposals[0].proposalURL + '" target="_blank"><input type="submit" value="Select Project"></form>');
    });
  }


});
    

  


//Search form submission and cinnection to API
  /*
  $('#submitbutton').click(function(e){
    e.preventDefault();
    $.ajax('http://api.donorschoose.org/common/json_feed.html?&APIKey=DONORSCHOOSE&callback=response', {
      type: 'POST',
      dataType: 'jsonp',
      data: $('form').serialize(),
      success: function(response) {
        $('.error').html(response);
        console.log("data worked");
      },
      error: function() {
        $('.error').html("error");
        console.log("data failed");
      },
      timeout: 2000,
      beforeSend: function(){
        $('?TARGET?').addClass('loading');
      },
      complete: function(){
        $('?TARGET?').removeCLass('loading');
      }
    });
  });
*/


//Give button click takes you to DonorsChoose.org
  /*$('#give').click(function(e){
      e.preventDefault();

  });*/



//closing bracket



/*Ajax practice

  $('#submitbutton').on('click', 'button', function(){
    $.ajax('http://api.donorschoose.org/common/json_feed.html?subject1=-1&APIKey=DONORSCHOOSE'), {
      success: function(response) {
        $('?TARGET?').html(response).?EFFECT?();
      },
      error: function(resquest, errorType, errorMessage) {
        $('?TARGET?').html("sorry there is error");
      },
      timeout: 2000,
      beforeSend: function(){
        $('?TARGET?').addClass('loading');
      },
      complete: function(){
        $('?TARGET?').removeCLass('loading');
      }
    }
  });

*/

//More Ajax practice:
/*
//The API data...
  function displayResults(donorCity, donorState) {
    $.ajax('http://api.donorschoose.org/search.html?&APIKey=DONORSCHOOSE&callback=?', {
      type: 'POST',
      dataType: 'json',
      data: $('form').serialize(),
      success: function(response) {
        $('.error').html(response);
        console.log("data worked");
      },
      error: function() {
        $('.error').html("error");
        console.log("data failed");
      },
      timeout: 2000,
      
      beforeSend: function(){
        $('?TARGET?').addClass('loading');
      },
      complete: function(){
        $('?TARGET?').removeCLass('loading');
      }
      
    });
    //test data matching
    console.log(proposal.title[2]);
  }

*/


//TEST: Run location search on submit
/*
  $('#submitbutton').click(function(e){
    e.preventDefault();
    $('article h1').html("testing form");
    $('article p').html("testing form again")
    console.log("testing 123");
  });
*/


//Define data for project search results
/*  var stuff = [
    {city: ['']},
    {state: ['']},
    {stateFullName: ['']},
    {title: ['']},
    {schoolName: ['']},
    {imageURL: ['']},
    {shortDescription: ['']},
    {fulfillmentTrailer: ['']},
    {costToComplete: ['']},
    {numDonors: ['']},
    {proposalURL: ['']}
  ];
*/
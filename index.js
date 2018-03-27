
var sdk, census;
// $(document).ready(function() {
//     sdk = new CitySDK();
//     census = sdk.modules.census;
//     // var apiKey = prompt("Please enter your Census API Key", "API key");
//     census.enable("be0ca37c77bd4d4d073f912c7fc535d13855f274");
// });

function JSON2CSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;

    var str = '';
    var line = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';

        if ($("#quote").is(':checked')) {
            for (var index in array[i]) {
                var value = array[i][index] + "";
                line += '"' + value.replace(/"/g, '""') + '",';
            }
        } else {
            for (var index in array[i]) {
                line += array[i][index] + ',';
            }
        }

        line = line.slice(0, -1);
        str += line + '\r\n';
    }
    return str;
    
}

function parseForDatabase(response, tablename, city) {
        var data = JSON.stringify(response.data)
        var csv = JSON2CSV(response.data);


        var dataArray = csv.split("\n")
        for (x = 0; x < dataArray.length; x++) {
            var row = dataArray[x].split(",")
            
	    if(city) {
	        row.unshift(response.county);
    	        row.unshift(response.state);
    	        row.unshift(response.place_name);
    	        row.unshift(response.place);
	    }
            var newString = "insert into " + tablename + " values (";

            for (y = 0; y < row.length; y++) {
                row[y] = row[y].replace("'","''");
		row[y] = "'" + row[y] +"'"
            }

            newString += row.join()
            newString += ");"

            dataArray[x] = newString
        }
	var sqlString = dataArray.join("\n")
	return sqlString
}

function submitState() {
    sdk = new CitySDK();
    census = sdk.modules.census;
    // var apiKey = prompt("Please enter your Census API Key", "API key");
    census.enable("be0ca37c77bd4d4d073f912c7fc535d13855f274");

           $('#state-text').val("");

    var request = {
        variables: [
            "population",
            "income",
	    "population_white_alone",
            "population_black_alone",
            "population_hispanic_origin",
            "population_asian_alone",
            "population_other_alone",
            "poverty",
            "age",
            "education_bachelors",
            "education_masters",
            "education_professional",
            "education_doctorate",
	    "employment_unemployed"
        ],
        level: "us",
        sublevel: "true"
    }
    
    census.APIRequest(request, function(response) {
	
	var sqlString = parseForDatabase(response, "State", false)       

	var output = $('#state-output')
	//output.width(400).height(600);
	//output.css('overflow','hidden');
	//output.append(sqlString);
	
	$('#state-text').val(sqlString);
    });
}


function submitCounty() {
    sdk = new CitySDK();
    census = sdk.modules.census;
    // var apiKey = prompt("Please enter your Census API Key", "API key");
    census.enable("be0ca37c77bd4d4d073f912c7fc535d13855f274");
           $('#county-text').val("");
    var counties = "";
    for(state in census.stateCapitals) {
        
       var request = {
           variables: [
               "population",
               "income",
               "population_white_alone",
               "population_black_alone",
               "population_hispanic_origin",
               "population_asian_alone",
               "population_other_alone",
               "poverty",
               "age",
               "education_bachelors",
               "education_masters",
               "education_professional",
               "education_doctorate",
               "employment_unemployed"
           ],
	   level: "state",
           sublevel: "true",
	   state: state
       }
       
       census.APIRequest(request, function(response) {
          var sqlString = parseForDatabase(response,"County", false);
          counties+=sqlString 
	  var output = $('#county-output');
           //output.width(400).height(600);
           //output.css('overflow','hidden');
           //output.append(sqlString);
           
           $('#county-text').val(counties);

       });
   
    }
}


function submitCity() {
    sdk = new CitySDK();
    census = sdk.modules.census;
    // var apiKey = prompt("Please enter your Census API Key", "API key");
    census.enable("be0ca37c77bd4d4d073f912c7fc535d13855f274");
           //$('#city-text').val("");
    var cities = ""
    for(state in census.stateCapitals) {
	var lat = census.stateCapitals[state][0].toString()
	var lng = census.stateCapitals[state][1].toString()
       
	//console.log(lat + ", " + lng)

 
	var request = {
           variables: [
               "population",
               "income",
               "population_white_alone",
               "population_black_alone",
               "population_hispanic_origin",
               "population_asian_alone",
               "population_other_alone",
               "poverty",
               "age",
               "education_bachelors",
               "education_masters",
               "education_professional",
               "education_doctorate",
               "employment_unemployed"
           ],
	 level: "place",
	 sublevel: "false",
         lat: lat,
         lng: lng,
	}
       
       census.APIRequest(request, function(response) {
	   var sqlString = parseForDatabase(response,"City", true);
           //console.log(sqlString)
           cities += sqlString
	   var output = $('#city-output');
           //output.width(400).height(600);
           //output.css('overflow','hidden');
           //output.append(sqlString);
           
           $('#city-text').val(cities);
       });
   
   }
}


//submitState()
//submitCounty()
//submitCity()

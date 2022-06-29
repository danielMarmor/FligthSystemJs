const host ="http://127.0.0.1";
const port = "5000";
const availiableSeats = 100;

ShowData();

function ShowData(){
    LoadFlights()
    .then(response =>response.json())
    .then(data =>{
        //# 1
        console.log('All Flights....')
        showFlights(data);

        inserSpace(2);
        //# 2 
        console.log('All Flights With Seats....')      
        var flightWithSeats = getFlightsWithAvailSeats(data, availiableSeats);
        showFlights(flightWithSeats);

        inserSpace(2);
        //# 3
        showAverrageAvailSeats(data);

        inserSpace(2);
        //# 4
        showIsRemainingTickets(data);

        inserSpace(2);
        //5 
        console.log('Flights With Add Same Origin Field....');

        var flightWithSameOrigCountry = getSameOriginCountryFlights(data, availiableSeats);
        showFlights(flightWithSameOrigCountry);
           
    });
}

function showFlights(flights){
    if (flights.length == 0){
        console.log('List is Empty!');
        return;
    }
    $.each(flights, function(index, flight){
        console.table(flight);
    });
}

function showAverrageAvailSeats(flights){    
    let sumAvailiableSeats = flights.reduce(
        (previous, current)=>  previous + current.remaining_tickets,0);
    let average = sumAvailiableSeats/ flights.length;
    let averageRound =average.toFixed(8);
    
    console.log(`Average Remaing Tickets: ${averageRound}`);
   
}

function showIsRemainingTickets(flights){
    var condition = (element) => element.remaining_tickets == 0;
    var isRemaingTickets = flights.some(condition);  
    var message = `${isRemaingTickets ? 'There Are Flights With remaing Tickets'
    : 'No Flights with remianing Tickets'}`
    console.log(message);
}

function getSameOriginCountryFlights(flights){
    origin_countries = {};
    flights.map(flight =>{
        if (flight.origin_country_id in origin_countries){
            origin_countries[flight.origin_country_id]++; 
        }
        else{
            origin_countries[flight.origin_country_id] = 0;
        } 
    });
    flights.map(flight =>{
        flight.same_in_origin_country  = origin_countries[flight.origin_country_id];
    });
    return flights;
}

function getFlightsWithAvailSeats(flights, seatsNumber){
    var onlyWithSeats = flights.filter(x => {return x.remaining_tickets > 0});
    return onlyWithSeats;      
}

async function LoadFlights(){
    const endPoint = '/anonym/all_flights';
    const url_all_flights = `${host}:${port}${endPoint}`;
    const response = await fetch(url_all_flights);
    return response;
}
   

function inserSpace(lines){
    for(var i=0; i<lines; i++){
        console.log('\n');
    }   
}
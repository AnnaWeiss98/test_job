var route_info = {
    "01_route": { name: "из А в В", price: 700 },
    "02_route": { name: "из B в A", price: 700 },
    "01_02_route": { name: "из A в B и обратно в А", price: 1200 },
}

var ship_timetable = {
    "01_route": {
        0: new Date("2021-08-21 18:00:00"),
        1: new Date("2021-08-21 18:30:00"),
        2: new Date("2021-08-21 18:45:00"),
        3: new Date("2021-08-21 19:00:00"),
        4: new Date("2021-08-21 19:15:00"),
        5: new Date("2021-08-21 21:00:00"),
    },
    "02_route": {
        0: new Date("2021-08-21 18:30:00"),
        1: new Date("2021-08-21 18:45:00"),
        2: new Date("2021-08-21 19:00:00"),
        3: new Date("2021-08-21 19:15:00"),
        4: new Date("2021-08-21 19:35:00"),
        5: new Date("2021-08-21 21:50:00"),
        6: new Date("2021-08-21 21:55:00"),
    }
}

var travel_time = 50;

function resetSelectors() {
    $("#ab_timetable").val('-1')
    $("#ba_timetable").val('-1')
    $("#ba_timetable option").each(function () {
        $(this).prop('disabled', false)
    });
}

function showCorrectTimeSelectors() {
    const route_selected = $("#route_selector").val();

    if (route_selected == "01_route") {
        $("#ab_timetable").css('display', '')
        $("#ba_timetable").css('display', 'none')
    }

    if (route_selected == "02_route") {
        $("#ab_timetable").css('display', 'none')
        $("#ba_timetable").css('display', '')
        $("#ba_timetable").prop('disabled', false)
    }

    if (route_selected == "01_02_route") {
        $("#ab_timetable").css('display', '')
        $("#ba_timetable").css('display', '')
        $("#ba_timetable").prop('disabled', true)
    }

    resetSelectors();
}

function setupSelectors() {
    $("#route_selector").on('change', function () {
        showCorrectTimeSelectors();
    });

    $("#ab_timetable").on('change', function () {
        if ($("#route_selector").val() == "01_02_route") {
            $("#ba_timetable").prop('disabled', false);
            $("#ba_timetable").val('-1')
            $("#ba_timetable option").each(function () {
                var possibleReturnTime = moment(ship_timetable["01_route"][$("#ab_timetable").val()].getTime()).add(travel_time, 'minutes')
                if (ship_timetable["02_route"][this.value] < possibleReturnTime) {
                    $(this).prop('disabled', true)
                } else {
                    $(this).prop('disabled', false)
                }
            });
        }
    });
}

function showResults() {
    var ticketsAmount = $("#num").val();
    var routeName = route_info[$("#route_selector").val()].name;
    var routePrice = route_info[$("#route_selector").val()].price * ticketsAmount;
    var travelTime = ($("#route_selector").val() == "01_02_route" ? 2 : 1) * travel_time;

    var resultText = `<p>Вы выбрали ${ticketsAmount} билета по маршруту ${routeName} стоимостью ${routePrice}р.
                      <p>Это путешествие займет у вас ${travelTime} минут.  `

    route_selected = $("#route_selector").val();
    if (route_selected == "01_route") {
        var startTime = ship_timetable["01_route"][$("#ab_timetable").val()];
        var arivalTime = new Date(ship_timetable[route_selected][$("#ab_timetable").val()].getTime() + travel_time * 60000)
        resultText += `<p>Теплоход отправляется в ${moment(startTime).format("HH:mm")}, а прибудет в ${moment(arivalTime).format("HH:mm")}.`
    }

    if (route_selected == "02_route") {
        var startTime = ship_timetable["02_route"][$("#ba_timetable").val()];
        var arivalTime = new Date(ship_timetable[route_selected][$("#ba_timetable").val()].getTime() + travel_time * 60000)
        resultText += `<p>Теплоход отправляется в ${moment(startTime).format("HH:mm")}, а прибудет в ${moment(arivalTime).format("HH:mm")}.`
    }

    if (route_selected == "01_02_route") {
        var startTime = ship_timetable["01_route"][$("#ab_timetable").val()];
        var arivalTime = new Date(ship_timetable["01_route"][$("#ab_timetable").val()].getTime() + travel_time * 60000)
        resultText += `<p>Теплоход отправляется в ${moment(startTime).format("HH:mm")}, а прибудет в ${moment(arivalTime).format("HH:mm")}.`

        var startTimeReturn = ship_timetable["02_route"][$("#ba_timetable").val()];
        var arivalTimeReturn = new Date(ship_timetable["02_route"][$("#ba_timetable").val()].getTime() + travel_time * 60000)
        resultText += `<p>Теплоход обратно отправляется в ${moment(startTimeReturn).format("HH:mm")}, а прибудет в ${moment(arivalTimeReturn).format("HH:mm")}.`
    }

    $("#result_area").empty(resultText)
    $("#result_area").append(resultText)
}

$(document).ready(function () {
    showCorrectTimeSelectors();
    setupSelectors();
});

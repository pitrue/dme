function sort(a, b) {
    return a.position - b.position;
}
function loadData(url) {
    //координаты Домодедово
    let DME = {
        latitude: 55.410,
        longitude: 37.902
    }
    //значение запроса по умолчанию
    if (url == undefined) url = 'https://data-live.flightradar24.com/zones/fcgi/feed.js?bounds=56.84,55.27,33.48,41.48';

    //составляем запрос
    var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
    var xhr = new XHR();
    xhr.open('GET', url, true);
    xhr.onload = function () {
        var load = JSON.parse(this.responseText);
        //обрабатываем данные
        var data = [];
        for (var i = 1; i < Object.keys(load).length; i++) {
            var el = load[Object.keys(load)[i]];
            //если есть координаты продолжаем
            if (el[1] != undefined) {
                let position = {
                    latitude: el[1],
                    longitude: el[2]
                }
                var in_airport = 0;
                if (position.latitude == DME.latitude && position.longitude == DME.longitude){
                    in_airport = 1;
                }
                var speed = el[5] * 1.852;
                var height = el[4] * 0.3;
                data.push({
                    coordinates: position,
                    in_airport: in_airport,
                    speed: speed.toFixed(),
                    course: el[3],
                    height: height.toFixed(),
                    code: {
                        0: el[11],
                        1: el[12]
                    },
                    number: el[13],
                    position: haversine(DME, position, { unit: 'meter' }).toFixed(),
                    all_data: el
                });
            }
        }

        //Сортируем 
        data.sort(sort);
        //Обновляем
        var html = ``;
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            var position = `<span>`+d.position+` м / от аэропорта</span>`;
            if (d.in_airport == 1){
                var position = '<span>В аэропорту</span>';
            }
            html += `<tr>
                <td>`+d.coordinates.latitude +' '+ d.coordinates.longitude+`<br>
                    <span>`+position+`</span>
                </td>
                <td>`+d.speed+` км/ч</td>
                <td>`+d.course+`°</td>
                <td>`+d.height+` м</td>
                <td>`+d.code[0]+' - '+d.code[1]+`</td>
                <td>`+d.number+`</td>
            </tr>`;
        }
        document.getElementById("data").innerHTML = html;
    }
    xhr.onerror = function () {
        alert('Ошибка ' + this.status);
    }
    xhr.send();
}

function ready() {
    loadData();
    setInterval(loadData, 3000);
}

document.addEventListener("DOMContentLoaded", ready);
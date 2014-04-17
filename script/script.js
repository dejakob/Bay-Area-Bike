$(function() {
    var koModel = {
        stations: ko.observableArray([]),
        selectedStation: ko.observable(null),
        showDetails: function() {
            this.map = koModel.map(this.latitude + ',' + this.longitude);
            this.maplink = koModel.maplink(this.latitude + ',' + this.longitude);
            koModel.selectedStation(this);
            $('#home').animate({
                'width': '0%'
            })
        },
        map: function(search) {
            return "http://maps.googleapis.com/maps/api/staticmap?center=" + search + "&zoom=15&size=300x100&maptype=roadmap&markers=color:blue%7C" + search + "&sensor=false";
        },
        maplink: function(search) {
            return "https://www.google.com/maps/search/" + search;
        },
        goBack: function() {
            $('#home').animate({
                'width': '50%'
            });
        }
    };

    function viewDistance(dist) {
        if (dist<.1) return dist * 5280 + ' feet';
        else return dist + ' miles';
    }

    function executeWithLocation(cb) {
        if (geo_position_js.init()) {
            var locationReceived = function (data) {
                $('#overlay').css('display', 'none');
                cb(data.coords.latitude, data.coords.longitude);
            }
            geo_position_js.getCurrentPosition(function(data) {
                    locationReceived(data);
                },
                function () {
                    try {
                        navigator.geolocation.getCurrentPosition(function(data) {
                            locationReceived(data);
                        }, function(err) {
                            console.log(err.message);
                        });
                    }
                    catch (ex) {
                    }
                });
        }
        else {
            try {
                navigator.geolocation.getCurrentPosition(function(data) {
                    locationReceived(data);
                }, function(err) {console.log(err.message)});
            }
            catch (ex) {
            }
        }
    }

    executeWithLocation(function(lat, lon) {
        $.post('source.php', {latitude: lat, longitude: lon}, function(answer) {
            var answer = eval(answer);
            var len = answer.length;
            for(var i=0; i<len; i++) {
                answer[i].distance = viewDistance(answer[i].distance);
                koModel.stations.push(answer[i]);
            }
        });
    });

    $('#stations').css('height', $(window).height() - 50 + 'px');
    /* force to scroll */

    ko.applyBindings(koModel);
});
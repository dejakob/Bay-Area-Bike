<?php
    header('Content-type: text/json');
    $params = $_POST;
    if (isset($params['latitude']) && isset($params['longitude'])) {
        $json_file = file_get_contents('http://bayareabikeshare.com/stations/json');
        $json = json_decode($json_file);
        $stations = $json->stationBeanList;
        $output = array();
        foreach($stations as $station) {
            $lat = $station->latitude;
            $long = $station->longitude;
            $miles = latlongToMiles($params['latitude'], $lat, $params['longitude'], $long);
            if(abs($miles)<1) {
                $station->distance = $miles;
                $output[sizeof($output)] = $station;
            }
        }
        usort($output, 'compare_distance');
        $json_output = json_encode($output);
        die($json_output);
    } else {
        die(json_encode(false));
    }




    function degreesToRadians($deg) {
        return $deg * pi() / 180;
    }
    function latlongToMiles($lat1, $lat2, $lon1, $lon2) {
        $lat1 = degreesToRadians($lat1);
        $lon1 = degreesToRadians($lon1);
        $lat2 = degreesToRadians($lat2);
        $lon2 = degreesToRadians($lon2);

        $latitudeDiff = $lat2 - $lat1;
        $longitudeDiff = $lon2 - $lon1;

        $a  = pow(sin($latitudeDiff/2),2) + cos($lat1) * cos($lat2) * pow(sin($longitudeDiff/2),2);
        $c  = 2 * atan2(sqrt($a),sqrt(1-$a));
        $dm = $c * 3961;
        $dk = $c * 6373;
        $miles = round($dm * 100) / 100;

        return $miles;
    }
    function compare_distance($a, $b) {
        if($a->distance == $b->distance) {
            return 0 ;
        }
        return ($a->distance < $b->distance) ? -1 : 1;
    }
?>
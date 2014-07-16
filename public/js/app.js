'use strict';

var owLED = angular.module('owLED',[
    'btford.socket-io'
]);

owLED.factory('mySocket', function (socketFactory) {
    return socketFactory({
        prefix: ''
    });
});

owLED.controller('SDController',
    ['$scope','mySocket','$location',
        function($scope,mySocket,$location) {
            $scope.history = [];
            $scope.open = false;

            $scope.mypick = {
                red: false,
                green: false
            };

            $scope.serverpick = {
                red: false,
                green: false
            };

            $scope.gameResult = '';
            $scope.score = 0;

            $scope.debug = $location.search()['debug'];
            $scope.autoblink = false;

            $scope.autoBlinkChange = function(val) {
                console.log("autoblink: " + val);
                mySocket.emit('doAutoBlink',val);
            };

            var initialized = false;

            mySocket.on('owledHistory',function(historyArray){
                if(historyArray.length) {
                    $scope.history = historyArray;
                }
            });

            mySocket.on('owledResult',function(res){
                if(initialized) {
                    $scope.serverpick = res;
                    $scope.history.pop();
                    $scope.history.unshift(res.history);
                    if ( res.red == $scope.mypick.red && res.green == $scope.mypick.green ){
                        $scope.score = $scope.score + 1;
                        $scope.gameResult  = "WINNER!";
                    } else {
                        $scope.gameResult = ["NOPE!","WRONG!","LOSER!"][(Math.random()*3)|0];
                    }
                }
            });

            mySocket.on('owledStart',function(){
                $scope.gameResult = '';
                $scope.serverpick = {
                    red: false,
                    green: false
                };
                initialized = true;
            });
        }
    ]);

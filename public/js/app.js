'use strict';

var sparkdemo = angular.module('sparkDemo',[
    'btford.socket-io'
]);

sparkdemo.factory('mySocket', function (socketFactory) {
    return socketFactory({
        prefix: ''
    });
});

sparkdemo.controller('SDController',
    ['$scope','mySocket',
        function($scope,mySocket) {
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
            var initialized = false;

            mySocket.on('owledHistory',function(historyArray){
                if(historyArray.length) {
                    $scope.history = historyArray;
                }
            });

            mySocket.on('owledResult',function(res){
                if(initialized) {
                    $scope.serverpick = res;
                    $scope.gameResult = ( res.red == $scope.mypick.red && res.green == $scope.mypick.green ) ? "WINNER!" : "LOSER!";
                    $scope.history.pop();
                    $scope.history.unshift(res.history);
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

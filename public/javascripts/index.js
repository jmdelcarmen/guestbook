'use strict';

(function () {
  angular.module('guestbook', [])
    .controller('mainCtrl', ['$scope', '$http', function ($scope, $http) {

      $http({
        method: 'GET',
        url: '/api/getnotes/'
      })
      .success(data => {
        $scope.notes = data.notes;
        $scope.user = data.user;
      })
      .error(err => {
        console.log('error');
      });

      $scope.next = function () {
        if ($scope.page < ($scope.notes.length/5)) {
          $scope.page ++;
        }
      }

      $scope.back = function () {
        if ($scope.page != 1) {
          $scope.page --;
        }
      }

      $scope.page = 1;
    }])
}())

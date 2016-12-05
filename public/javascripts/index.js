'use strict';

(function () {
  angular.module('guestbook', [])
    .controller('mainCtrl', ['$scope', '$http', function ($scope, $http) {
      $scope.page = 1;
      $http({
        method: 'GET',
        url: '/api/getnotes/'
      })
      .success(data => {
        $scope.notes = data.notes;
        $scope.user = data.user;
        $scope.maxpages = Math.ceil($scope.notes.length/5);
      })
      .error(err => {
        throw err;
      });

      $scope.loadMore = function () {
        $scope.page += 1;
      }

    }])
}())

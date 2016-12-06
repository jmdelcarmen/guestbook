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
        $scope.maxpages = Math.ceil($scope.notes.length/5);
        $scope.page = 1;
      })
      .error(err => {
        throw err;
      });

      //load more notes
      $scope.loadMore = function () {
        $scope.page += 1;
      }

    }])
}())

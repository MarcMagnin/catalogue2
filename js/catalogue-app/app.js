var app = angular.module('CatalogueApp', ['angularFileUpload', 'ui.bootstrap']);

// will be replaces in angular 1.3   ng-model-options="{updateOn: 'default blur', debounce: {default: 500, blur: 0} }" 
app.directive('easedInput', function($timeout) {
    return {
        restrict: 'E',
        template: '<div>' +
            '<input class="my-eased-input" type="text" ng-model="currentInputValue" ng-change="update()" placeholder="{{placeholder}}"/>' +
            '</div>',
        scope: {
            value: '=',
            timeout: '@',
            placeholder: '@',
            change:'='
        },
        transclude: true,
        link: function($scope) {
            $scope.timeout = parseInt($scope.timeout);
            $scope.update = function() {
                if ($scope.pendingPromise) {
                    $timeout.cancel($scope.pendingPromise);
                }
                $scope.pendingPromise = $timeout(function() {
                    $scope.value = $scope.currentInputValue;
                    $scope.change();
                }, $scope.timeout);
            };
        }
    };
});
    
app.directive('tagManager', function ($http) {
    return {
        require: 'typeahead',
        restrict: 'E',
        scope: { illustrateur: '=' },
        template:
            '<div class="tags">' +
                '<a ng-repeat="(idx, tag) in illustrateur.Tags" class="tag" ng-click="remove(idx)">{{tag}}</a>' +
            '</div>' +
            '<input type="text" ' +
                'ng-model="new_value"  ' +
                'placeholder="tag..." ' +
                'typeahead="tags for tags in getTags($viewValue) | filter:$viewValue" ' +
                'typeahead-loading="loadingLocations" ' +
                'class="form-control"></input> ' +
            '<a class="btn" ng-click="add()">Add</a>',
        link: function ($scope, $element) {
            // FIXME: this is lazy and error-prone
            var input = angular.element($element.children()[1]);
            
            // This adds the new tag to the tags array
            $scope.add = function () {
                $scope.illustrateur.Tags.push($scope.new_value);
                $scope.new_value = "";

                $scope.update();
            };



            // This is the ng-click handler to remove an item
            $scope.remove = function (idx) {
                $scope.illustrateur.Tags.splice(idx, 1);
                $scope.update();
            };

            $scope.update = function() {
                // put tags before to get id back  
                $http({
                    method: 'PUT',
                    headers: { 'Raven-Entity-Name': 'Illustrateur' },
                    url: 'http://localhost:8081/databases/Illustrateurs/docs/' + $scope.illustrateur['@metadata']['@id'],
                    data: angular.toJson($scope.illustrateur)
                }).
                    success(function (data, status, headers, config) {
                    }).
                    error(function (data, status, headers, config) {

                    });
            };

            // Capture all keypresses
            input.bind('keypress', function (event) {
                // But we only care when Enter was pressed
                if (event.keyCode == 13) {
                    // There's probably a better way to handle this...
                    $scope.$apply($scope.add);
                }
            });
        }
    };
});



app.directive('tagIllustration', function ($http) {
    return {
        restrict: 'E',
        scope: { illustration: '=',illustrateur:'=' },
        template:
            '<div class="tags">' +
                '<a ng-repeat="(idx, tag) in illustration.Tags" class="tag" ng-click="remove(idx)">{{tag}}</a>' +
            '</div>' +
             '<input type="text" ' +
                'ng-model="new_value"  ' +
                'placeholder="tag..." ' +
                'typeahead="tags.Name for tags in getTags($viewValue) | filter:$viewValue" ' +
                'typeahead-loading="loading" ' +
                'class="form-control"></input>' +
                '<i ng-show="loading" class="glyphicon glyphicon-refresh"></i> ' +
            '<a class="btn" ng-click="add()">Add</a>',
        link: function ($scope, $element) {
            // FIXME: this is lazy and error-prone
            var input = angular.element($element.children()[1]);
            // This adds the new tag to the tags array
            $scope.add = function () {
                $scope.illustration.Tags.push($scope.new_value);
                $scope.new_value = "";
                $scope.update();
            };
            
            $scope.tags = [];
            $scope.loading= false;
            $scope.getTags = function (value) {
                $scope.loading = true;
                return $http.get('http://localhost:8081/databases/Illustrateurs/indexes/Tags', {
                    params: {
                        query: "Name:" + value + "*",
                        pageSize: 10
                    }
                }).then(function (res) {
                    $scope.loading = false;
                    //var tags = [];
                    //angular.forEach(res.data.Results, function (item) {
                    //    tags.push(item.Name);
                    //});
                    return res.data.Results;
                });
            };


            // This is the ng-click handler to remove an item
            $scope.remove = function (idx) {
                $scope.illustration.Tags.splice(idx, 1);
                $scope.update();
            };

            $scope.update = function () {
                // put tags before to get id back  
                $http({
                    method: 'PUT',
                    headers: { 'Raven-Entity-Name': 'Illustrateur' },
                    url: 'http://localhost:8081/databases/Illustrateurs/docs/' + $scope.illustrateur['@metadata']['@id'],
                    data: angular.toJson($scope.illustrateur)
                }).
                    success(function (data, status, headers, config) {
                    }).
                    error(function (data, status, headers, config) {

                    });
            };

            // Capture all keypresses
            input.bind('keypress', function (event) {
                // But we only care when Enter was pressed
                if (event.keyCode == 13) {
                    // There's probably a better way to handle this...
                    $scope.$apply($scope.add);
                }
            });
        }
    };
});


//app.directive("masonry2", function($parse) {
//    return {
//        restrict: 'AC',
//        controller: function($scope, $element) {
//            // register and unregister bricks
//            var bricks = [];
//            this.addBrick = function(brick) {
//                bricks.push(brick)
//            }
//            this.removeBrick = function(brick) {
//                var index = bricks.indexOf(brick);
//                if (index != -1) bricks.splice(index, 1);
//            }
//            $scope.$watch(function() {
//                return bricks
//            }, function() {
//                // triggers only once per list change (not for each brick)
//                console.log('reload');
//                $element.masonry('reload');
//            }, true);
//        },
//        link: function(scope, elem, attrs) {
//            elem.masonry({ itemSelector: '.masonry-brick' });
//        }
//    };
//})
//    .directive('masonryBrick', function($compile) {
//        return {
//            restrict: 'AC',
//            require: '^masonry',
//            link: function(scope, elem, attrs, ctrl) {
//                ctrl.addBrick(scope.$id);

//                scope.$on('$destroy', function() {
//                    ctrl.removeBrick(scope.$id);
//                });
//            }
//        };
//    });


app.directive("masonry", function() {
    var NGREPEAT_SOURCE_RE = '<!-- ngRepeat: ((.*) in ((.*?)( track by (.*))?)) -->';
    return {
        compile: function(element, attrs) {
            // auto add animation to brick element
            var animation = attrs.ngAnimate || "'masonry'";
            var $brick = element.children();
            $brick.attr("ng-animate", animation);


            // generate item selector (exclude leaving items)
            var type = $brick.prop('tagName');
            var itemSelector = type + ":not([class$='-leave-active'])";

            return function(scope, element, attrs) {
                var options = angular.extend({
                    itemSelector: itemSelector
                }, scope.$eval(attrs.masonry));

                // try to infer model from ngRepeat
                if (!options.model) {
                    var ngRepeatMatch = element.html().match(NGREPEAT_SOURCE_RE);
                    if (ngRepeatMatch) {
                        options.model = ngRepeatMatch[4];
                    }
                }

                // initial animation
                element.addClass('masonry');


                // Wait inside directives to render
                setTimeout(function() {
                    element.masonry(options);

                    element.on("$destroy", function() {
                        element.masonry('destroy')
                    });

                    if (options.model) {
                        scope.$apply(function() {
                            scope.$watchCollection(options.model, function(_new, _old) {
                                if (_new == _old) return;

                                // Wait inside directives to render
                                setTimeout(function() {
                                    element.masonry("reload");
                                });
                            });
                        });
                    }
                }, 200);
            };
        }
    };
});

//app.directive("masonryBrick", function () {
//    return {
//        restrict: 'AC',
//        require: '^masonry',
//        scope: true,
//        link: {
//            pre: function preLink(scope, element, attrs, ctrl) {
//                var id = scope.$id, index;

//                scope.$watch('__height', function (newHeight, oldHeight) {
//                    elem.attr('style', 'margin-top: ' + (58 + newHeight) + 'px');
//                });

//            }
//        }
//    };
//});
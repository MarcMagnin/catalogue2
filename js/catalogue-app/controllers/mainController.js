
var Illustrateur = function () {
    this.Nom = "";
    this.Prenom = "";
    this.Tags = [];
    this.Illustrations = [];
};
var Attachment = function () {
    this.Nom = "";
    this.Id = "";
    this.Description = "";
    this.Tags = [];
};
var Tag = function () {
    this.Name = "";
};


var Illustration = function () {
    this.Url = "";
    this.Id = "";
    this.Description = "";
    this.Tags = [];
};

var Update = function () {
    this.Type = "";
    this.Name = "";
   // this.Value = "";
};


//inject angular file upload directives and service.
//angular.module('CatalogueApp', ['angularFileUpload']);


//http://localhost:8081/databases/Illustrateurs/indexes/dynamic/Illustrateur?include=Tags.,TagId
var mainController = ['$scope', '$http', '$timeout', '$upload', function ($scope, $http, $timeout, $upload) {
    $scope.apiRootUrl = "http://localhost:8081/databases/Illustrateurs/";
    $scope.searchWord = "";
        
    $scope.illustrateurs = [];

    $scope.enableEdition = function (illustrateur) {
        illustrateur.editing = true;
        $scope.loadMoreIllustration(illustrateur);
    };
    
    $scope.loadMoreIllustration = function(illustrateur) {
        $http({ method: 'GET', url: $scope.apiRootUrl + 'docs/'+ illustrateur.Id +'?pageSize=30&sort=-LastModified&noCache=1015157938&skipTransformResults=true&resultsTransformer=GetIllustrations' }).
          success(function (data, status, headers, config) {
              illustrateur.Illustrations = data.Illustrations;
              //angular.forEach(data.Results, function (illustrateur, index) {
                  ////illustrateur.editing = false;
                  //if (illustrateur.Illustrations) {
                  //    illustrateur.Illustrations = new Array(illustrateur.Illustrations);
                  //}
                  //$scope.illustrateurs.push(illustrateur);
              //});
          }).
          error(function (data, status, headers, config) {
          });
    };

    $scope.validate = function(keyEvent, illustrateur) {
        alert('test');
    };
    
    //$http({ method: 'GET', url: $scope.apiRootUrl + 'indexes/dynamic/Illustrateur?include=Illustrations.,Id&pageSize=30&noCache=101515793' }).
    $scope.init = function() {
        $http({ method: 'GET', url: $scope.apiRootUrl + 'indexes/Auto/Illustrateur/ByNom?pageSize=30&sort=-LastModified&noCache=1015157938&skipTransformResults=true&resultsTransformer=GetFirstIllustration' }).
            success(function (data, status, headers, config) {
                angular.forEach(data.Results, function (illustrateur, index) {
                    illustrateur.editing = false;
                    if (illustrateur.Illustrations) {
                        illustrateur.Illustrations = new Array(illustrateur.Illustrations);
                    }
                    $scope.illustrateurs.push(illustrateur);
                });
            }).
            error(function(data, status, headers, config) {
            });
    };
    


    $scope.search = function () {
        $http({ method: 'GET', url: $scope.apiRootUrl + 'indexes/dynamic/Illustrateur?&query=Nom:' + $scope.searchWord + '* OR  Prenom:' + $scope.searchWord + '* OR  Tags:' + $scope.searchWord + '* OR  Illustrations,Tags:' + $scope.searchWord + '*&pageSize=30&noCache=101515793' }).
        success(function (data, status, headers, config) {
            $scope.illustrateurs.splice(0);
            angular.forEach(data.Results, function (illustrateur, index) {             
                $scope.illustrateurs.push(illustrateur);
            });
        }).
        error(function (data, status, headers, config) {

        });
    };
    
    $scope.loadingSearchSuggestions = false;
    $scope.getSearchSuggestions = function (value) {
        $scope.loadingSearchSuggestions = true;
        return $http.get('http://localhost:8081/databases/Illustrateurs/indexes/SearchSuggestions', {
            params: {
                query: "Name:" + value + "*",
                pageSize: 10
            }
        }).then(function (res) {
            $scope.loadingSearchSuggestions = false;
            //var tags = [];
            //angular.forEach(res.data.Results, function (item) {
            //    tags.push(item.Name);
            //});
            return res.data.Results;
        });
    };

    $scope.updateIllustrateur = function (illustrateur) {
        $http({
            method: 'PUT',
            headers: { 'Raven-Entity-Name': 'Illustrateur' },
            url: 'http://localhost:8081/databases/Illustrateurs/docs/' + illustrateur.Id,
            data: angular.toJson(illustrateur)
        }).
        success(function (data, status, headers, config) {
        }).
        error(function (data, status, headers, config) {

        });
};

    http://localhost:8080/indexes/dynamic?query=Category:Ravens



    $scope.addIllustration = function($url, $tags) {
        var illustration = new Illustration;
        illustration.Url = $url;
        illustration.Tags = $tags;

        
    };
    $scope.titles = ["Action Comics", "Detective Comics", "Superman", "Fantastic Four", "Amazing Spider-Man"];

    $scope.addIllustrationFromIllustrateur = function($fileName, $url, $tags, $illustrateur) {
        if ($tags) {
            // put tags before to get id back  
            $http({
                method: 'PUT',
                headers: { 'Raven-Entity-Name': 'Tags' },
                url: 'http://localhost:8081/databases/Illustrateurs/docs/Tags/',
                data: angular.toJson(new Array(update))
            }).
                success(function(data, status, headers, config) {
                    angular.forEach(data.Results, function(illustrateur, index) {
                        $scope.illustrateurs.push(illustrateur);
                        //$scope.addIllustration();
                    });
                }).
                error(function(data, status, headers, config) {

                });
        } else {
            $scope.addIllustration($url, $tags);
        }
        ;
    };

    $scope.deleteIllustration = function($index, illustrateur) {
        
        var update = new Update();
        update.Type = 'Remove';
        update.Name = 'Illustrations';
        update.Position = $index;

        $http({
            method: 'PATCH',
            headers: { 'Raven-Entity-Name': 'Illustrateur' },
            url: 'http://localhost:8081/databases/Illustrateurs/docs/' + illustrateur.Id,
            data: angular.toJson(new Array(update))
        }).
                    success(function (data, status, headers, config) {
                        illustrateur.Illustrations.splice($index, 1);
                    }).
                    error(function (data, status, headers, config) {

                    });
        
        
    }
    $scope.addIllustrationToIllustrateur = function ($fileName, illustrateur, $index) {
        var illustration = new Illustration();
        illustration.Url = 'static/illustrations/' + illustrateur.Id + '/' + $fileName;
        //illustration.Illustrateur = illustrateur['@metadata']['@id'];
        illustration.Tags = [
        ];
        
        //$http({
        //    method: 'PUT',
        //    headers: { 'Raven-Entity-Name': 'Illustration' },
        //    url: 'http://localhost:8081/databases/Illustrateurs/docs/Illustration/',
        //    data: angular.toJson(illustration)
        //}).
        //      success(function (data, status, headers, config) {
                  
                  var update = new Update();
                  update.Type = 'Add';
                  update.Name = 'Illustrations';
           //       delete illustration.Illustrateur;
                  update.Value = illustration;
                  var update2 = new Update();
                  update2.Type = 'Set';
                  update2.Name = 'Modified';
        //       delete illustration.Illustrateur;
                  update2.Value = new Date().toISOString();

         

                  if (!illustrateur.Illustrations) {
                      illustrateur.Illustrations = new Array();
                  }

                  $http({
                      method: 'PATCH',
                      headers: { 'Raven-Entity-Name': 'Illustrateur' },
                      url: 'http://localhost:8081/databases/Illustrateurs/docs/' + illustrateur.Id,
                      data: angular.toJson(new Array(update, update2))
                  }).
                      success(function (data, status, headers, config) {
                          illustrateur.Illustrations.push(illustration);

                          //$scope.update($scope.illustrateurs);
                      }).
                      error(function (data, status, headers, config) {

                      });

              //}).
              //error(function (data, status, headers, config) {

              //});
    };

    $scope.addFileToIllustrateur = function ($files, illustrateur, $index) {
        
        $scope.uploadRightAway = true;
        $scope.selectedFiles = [];
        $scope.progress = [];
        if ($scope.upload && $scope.upload.length > 0) {
            for (var i = 0; i < $scope.upload.length; i++) {
                if ($scope.upload[i] != null) {
                    $scope.upload[i].abort();
                }
            }
        }
        $scope.upload = [];
        $scope.uploadResult = [];
        $scope.selectedFiles = $files;
        $scope.dataUrls = [];
        for (var i = 0; i < $files.length; i++) {
            var $file = $files[i];
            if (window.FileReader && $file.type.indexOf('image') > -1) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL($files[i]);

                function setPreview(fileReader, index) {
                    fileReader.onload = function(e) {
                        $timeout(function() {
                            $scope.dataUrls[index] = e.target.result;
                        });
                    };
                }

                setPreview(fileReader, i);
            }
            $scope.progress[i] = -1;
            if ($scope.uploadRightAway) {
                $scope.start(i, illustrateur, $index);
            }
        }
    };

    
    // ajout d'un nouvel d'illustrateur
    $scope.addIllustrateur = function (callback) {
        var illustrateur= new Illustrateur;
        illustrateur.Nom = "";
        illustrateur.Prenom = "";
        illustrateur.Modified = new Date().toISOString();
        $http({
            method: 'PUT',
            headers: { 'Raven-Entity-Name': 'Illustrateur' },
            url: 'http://localhost:8081/databases/Illustrateurs/docs/Illustrateur%2F',
            data: angular.toJson(illustrateur)
        }).
            success(function (data, status, headers, config) {
                // ajout de la clé au nouvel illustrateur
                //illustrateur['@metadata'] = [];
                //illustrateur['@metadata']['@id'] = data.Key;
                illustrateur.Id = data.Key;
                // ajout de l'illustrateur à la liste
                $scope.illustrateurs.unshift(illustrateur);
                callback(illustrateur);
            }).
            error(function (data, status, headers, config) {

            });
    };
    // ajout d'image sans illustrateur
    $scope.onFileSelect = function ($files) {

        $scope.uploadRightAway = true;
        $scope.selectedFiles = [];
        $scope.progress = [];
        if ($scope.upload && $scope.upload.length > 0) {
            for (var i = 0; i < $scope.upload.length; i++) {
                if ($scope.upload[i] != null) {
                    $scope.upload[i].abort();
                }
            }
        }
        $scope.upload = [];
        $scope.uploadResult = [];
        $scope.selectedFiles = $files;
        $scope.dataUrls = [];
        for (var i = 0; i < $files.length; i++) {
            var $file = $files[i];
            if (window.FileReader && $file.type.indexOf('image') > -1) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL($files[i]);

                function setPreview(fileReader, index) {
                    fileReader.onload = function (e) {
                        $timeout(function () {
                            $scope.dataUrls[index] = e.target.result;
                        });
                    };
                }

                setPreview(fileReader, i);
            }
            $scope.progress[i] = -1;
            if ($scope.uploadRightAway) {
                $scope.startUpload(i);
            }
        }
    };
    
    $scope.startUpload = function (index) {
        $scope.progress[index] = 0;

 
        
        $scope.addIllustrateur(function( illustrateur, $index ) {
            $scope.url = 'http://localhost:8081/databases/Illustrateurs/static/illustrations/' +  illustrateur.Id  + '/' + $scope.selectedFiles[index].name;
            
          
            var fileReader = new FileReader();
            fileReader.onload = function (e) {
                $scope.upload[index] =
                    $upload.http({
                        url: $scope.url,
                        method: "PUT",
                        headers: { 'Content-Type': $scope.selectedFiles[index].type },
                        data: e.target.result
                    }).progress(function (evt) {
                        // Math.min is to fix IE which reports 200% sometimes
                        $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    }).success(function (data) {


                        //$scope.uploadResult.push(data);
                        // Put somewhere else 
                        $scope.addIllustrationToIllustrateur($scope.selectedFiles[index].name, illustrateur, $index);



                    }).error(function (data) {
                        //error
                    });
            }
            fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
        });
    };

    $scope.deleteIllustrateur = function ($index, illustrateur) {
        $http({
            method: 'DELETE',
            headers: { 'Raven-Entity-Name': 'Illustrateur' },
            url: 'http://localhost:8081/databases/Illustrateurs/docs/' + illustrateur.Id,
        }).
            success(function(data, status, headers, config) {
                $scope.illustrateurs.splice($index, 1);
            }).
            error(function(data, status, headers, config) {

            });
    };
    
    // see attachment list : 
    // http://wreack:8081/Illustrateurs/static/?start=0&pagesize=128

    $scope.start = function (index, illustrateur, $index) {
        $scope.progress[index] = 0;
        
        $scope.url = 'http://localhost:8081/databases/Illustrateurs/static/illustrations/' + illustrateur.Id + '/' + $scope.selectedFiles[index].name;
        if ($scope.howToSend == 1) {
            $scope.upload[index] = $upload.upload({
                url: $scope.url,
                method: $scope.httpMethod,
                headers: { 'myHeaderKey': 'myHeaderVal' },
                data: {
                    myModel: $scope.myModel
                },
             
                file: $scope.selectedFiles[index],
                fileFormDataName: 'myFile'
            }).then(function (response) {
                $scope.uploadResult.push(response.data);
            }, null, function (evt) {
                $scope.progress[index] = parseInt(100.0 * evt.loaded / evt.total);
            });
        } else {
            
            // Put somewhere else 
            
            
            var fileReader = new FileReader();
            fileReader.onload = function (e) {
                $scope.upload[index] =
                    $upload.http({
                        url: $scope.url,
                        method : "PUT",
                        headers: {'Content-Type': $scope.selectedFiles[index].type },
                        data: e.target.result
                    }).progress(function(ev) {
                        // Math.min is to fix IE which reports 200% sometimes
                        //$scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    }).success(function (data) {
                        

                        $scope.addIllustrationToIllustrateur($scope.selectedFiles[index].name, illustrateur, $index);

                        //$scope.uploadResult.push(response.data);
                        
                    

                    }).error(function(data) {
                        //error
                    });
            }
            fileReader.readAsArrayBuffer($scope.selectedFiles[index]);

        }
    }

  
}];

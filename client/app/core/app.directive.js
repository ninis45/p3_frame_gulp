(function () {
    'use strict';

    angular.module('app')
    .directive('timePicker', [timePicker])
    .directive('datePicker', [datePicker]) // overall control
    .directive('ngInteger', [ngInteger])
    .directive('blockImage', [BlockImage])
    .directive('fileRead', [FileRead])
    .directive('openModal', ['$uibModal', '$http', OpenModal])
    .directive('mapMarker',[MapMarker])
    .directive('upperCase', [upperCase])
    .directive('ngSelect', ['$timeout', ngSelect]);
    function upperCase() {
        return {
            priority: -1,
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.bind('blur', function (e) {
                    var text = $(element).val();
                    element.val(text.toUpperCase());
                });
            }
        }
    }
    function MapMarker()
       {
            return {
               
                
                require:'^ngModel',
                restrict: 'A',
               
                scope:{
                    zoom:'@',
                    lng:'@',
                    lat:'@',
                    position:'=' 
                },
                link:function propiedades(scope,element,attr,ngModelCtrl){
                    
                    scope.lng = scope.lng?scope.lng:-90.53699694781494;
                    scope.lat = scope.lat?scope.lat:19.845583442159924;
                    scope.zoom = scope.zoom?scope.zoom:8;
                    
                    
                    var ng_model = {lng:scope.lng,lat:scope.lat,zoom:scope.zoom};
                    
                    ngModelCtrl.$setViewValue(ng_model);
                    
                    var position={lat: parseFloat(scope.lat), lng: parseFloat(scope.lng)};
                    var options={
                        zoom:parseInt(scope.zoom),
                        center: position,
                	    mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    var map = new google.maps.Map(document.getElementById('map'), options);
                    
                    var marker = new google.maps.Marker({
            			position: position,
            			map: map,
            		
                        draggable:true,
                        
                        
                        
                           
            			
                    });
                    
                    google.maps.event.addListener(marker, 'dragend', function(event) {
                		 set_position(event);
                         
                         ngModelCtrl.$setViewValue(ng_model);
             		});
                    
                    google.maps.event.addListener(map, 'zoom_changed', function() {
            			
            			ng_model.zoom = map.getZoom();
            			ngModelCtrl.$setViewValue(ng_model);
            		});
                    scope.$watch(ngModelCtrl,function(newValue,oldValue){
                        
                        
                    });
                    function set_position(evt)
                    {
                        ng_model.lng = evt.latLng.lng();
                        ng_model.lat = evt.latLng.lat()
                        
                    }
                }
            }
       }
    function OpenModal($uibModal, $http) {

        return {

            restrict: 'A',
            scope: {
                // modalController: '@',
                title: '@'
            },
            link: function propiedades(scope, element, attr) {
                element.bind('click', function (e) {
                    var url = element.attr('href');
                    e.preventDefault();

                    return $uibModal.open({

                        templateUrl: 'myModal.html',
                        controller: ['$scope', '$uibModalInstance', '$sce', function ($scope, $uibModalInstance, $sce) {
                            $scope.title = attr.title;
                            $scope.cancel = function () {
                                $uibModalInstance.dismiss("cancel");
                            }
                            $http.get(url).then(function (response) {

                                $scope.modal_body = $sce.trustAsHtml(response.data);
                            });
                        }],
                        resolve: {
                            /*title: function() {
                                return attr.title;
                            },
                            url: function () {
                               
                                return $http.get(url);
                            }*/
                        }
                    });

                    //container.html($compile(loadedHtml)(scope))
                    // $rootScope.$broadcast('preloader:active');
                    //$myModal.open(element.attr('href'), attr.modalTitle, attr.modalController, attr.template);



                });

            }


        }
    }
    function FileRead() {
        return {



            restrict: 'A',
            require: '^ngModel',
            scope: {
                //ngModel: '=',
                // out:'='
            },
            link: function propiedades(scope, element, attr, ngModelCtrl) {
                $(element).on('change', function () {

                    var reader = new FileReader();
                    var input = $(this).prop('files')[0];
                    reader.onload = function (e) {



                        ngModelCtrl.$setViewValue(e.target.result);

                    }

                    reader.readAsDataURL(input);

                });
            }
        }
    }
    function ngInteger() {
        return {



            restrict: 'A',
            link: function propiedades(scope, element, attr) {

                element.on('keydown', function (event) {
                    var $input = $(this);
                    var value = $input.val();
                    value = value.replace(/[^0-9]/g, '')
                    $input.val(value);
                    if (event.which == 64 || event.which == 16) {
                        // to allow numbers  
                        return false;
                    } else if (event.which >= 48 && event.which <= 57) {
                        // to allow numbers  
                        return true;
                    } else if (event.which >= 96 && event.which <= 105) {
                        // to allow numpad number  
                        return true;
                    } else if ([8, 13, 27, 37, 38, 39, 40].indexOf(event.which) > -1) {
                        // to allow backspace, enter, escape, arrows  
                        return true;
                    } else {
                        event.preventDefault();
                        // to stop others  
                        //alert("Sorry Only Numbers Allowed");  
                        return false;
                    }
                });
                //scope.file_path = $(element).attr('src');
            }
        }
    }
    function BlockImage() {
        return {



            restrict: 'E',
            controller:['$scope', function ($scope) {
                $scope.remove_file = function () {

                    $scope.value = '';
                    $scope.src = SITE_URL + 'files/cloud_thumb/0';
                }

                if ($scope.value) {
                    $scope.src = SITE_URL + 'files/cloud_thumb/' + $scope.value;
                }
                else
                    $scope.src = SITE_URL + 'files/cloud_thumb/0';

            }],
            scope: {
                value: '@',
                name: '@',

                from: '='
            },
            template: '<div class="block-file">' +
                        
                          '<div class="image-wrapper"> ' +
                                 '<input type="hidden" value="{{value}}" name="{{name}}" ng-if="value" />' +
                                 '<img src="{{src}}"   />' +
                                 '<button type="button" title="Eliminar elemento" data-dismiss="alert" ng-if="value" class="close" ng-click="remove_file()"   >x</button>' +
                           '<div>' +
                      '</div>',
            link: function propiedades(scope, element, attr) {

               
                scope.$watch('from', function (n, o) {

                    if (n === o) return false;

                   
                    scope.value = true;
                    scope.src = n;

                });

            }
        }
    }
    function ngSelect($timeout) {
        return {
            restrict: 'A',
            require: '?ngModel',

            scope: {

                refresh: '=',
                modelValue: '=ngModel'
            },
            link: function (scope, ele, attrs,ngModel) {

                
                //console.log(scope.modelValue);
                //ngModel = scope.modelValue;
                
                function setTrigger() {


                    $timeout(function () {
                       // $(ele).val(scope.modelValue);
                        angular.element(ele).trigger('change');
                    }, 100);

                }
                var select = ele.select2({
                    placeholder: 'Selecciona los registros',


                });
                ele.on('click', function () {

                    //ele.trigger('change');
                });
                


                scope.$watch('refresh', function (newValue, oldValue) {
                    
                    if (!newValue) return false;
                        setTrigger();

                  
                    
                    
                },true);/*
               
                scope.$watch('modelValue', function (newValue, oldValue) {

                    setTrigger();


                },true);*/


            }
        };
    }

    function timePicker() {
        return {
            priority: -1,
            restrict: 'A',
            scope: {
               
                //modelValue: '=ngModel',
                //require: '?ngModel',
            },
            link: function (scope, element, attrs, ngModel) {
                //var model = attrs['ngModel'];
                ///$(element).val(scope.modelValue);
                $(element).timepicker();
            }

        }
    }
    
    function datePicker() {
        return {
            priority: -1,
            restrict: 'A',
            scope: {
                format: '@',
                modelValue: '=ngModel'
            },
            require: '?ngModel',
            link: function (scope, element, attrs, ngModel) {
                var model = attrs['ngModel'];
                $(element).val(scope.modelValue);
                $(element).datepicker({
                    calendarWeeks: true,
                    todayBtn: 'linked',
                    //daysOfWeekDisabled: '1',
                    clearBtn: true,
                    todayHighlight: true,
                    multidate: false,
                    daysOfWeekHighlighted: '1,2',
                    orientation: 'auto right',
                    format: scope.format ? scope.format : 'yyyy-mm-dd',

                    beforeShowMonth: function (date) {
                        if (date.getMonth() === 8) {
                            return false;
                        }
                    },

                    beforeShowYear: function (date) {
                        if (date.getFullYear() === 2014) {
                            return false;
                        }
                    }
                });
                
                 $(element).on('changeDate',function(){
                    
                    ngModel.$setViewValue($(element).datepicker('getFormattedDate'));
                 });
                //console.log(ngModel);
                //ngModel = scope.modelValue;
                //scope.modelValue = '2018-01-01';
                //scope[model] = '2018-01-01';
                /*scope.$apply(function () {
                    ngModel.$viewValue = modelValue;
                });*/
            }
        }
    }

})(); 
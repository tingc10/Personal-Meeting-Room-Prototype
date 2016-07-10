angular.module('PMR.utilityDirectives', [])
.directive('whiteboardSize', function($timeout, $document){
	return {
		restrict: 'A',
		link: function(scope, element, attrs){
			
			var isFullscreen = false;					// flag determining if whiteboard is in fullscreen
			scope.$on('checkWhiteboard', function(){
				// Determine if whiteboard needs to be resized
				if(isFullscreen) {
					TweenMax.set(element, {width: '100vw', height:'100vh'});

				}
			});
			
			scope.fullScreenToggle = function(){
				// TODO: make whiteboard full screen
				isFullscreen = !isFullscreen;
				if(isFullscreen){
					TweenMax.to(element, 0.5, {width: '100vw', height:'100vh'});
					// TweenMax.to('.user-container', 0.5, {opacity: 0});
				} else {
					TweenMax.to(element, 0.5, {width: "75%", height: '75%'});
					// TweenMax.to('.user-container', 0.5, {opacity: 1});

				}
			};
			$timeout(function(){
				TweenMax.set(element, {x: -5, yPercent: -50, xPercent: -50});
			});
			
		}
	}
})
// .directive('clock', function($timeout){
// 	return {
// 		restrict: 'A',
// 		link: function(scope, element, attrs){
// 			scope.clockSize = 15;
// 			scope.transformOriginTop = scope.clockSize/20;
// 			scope.currentMinuteRotation = null;
// 			scope.currentHourRotation = null;
// 			scope.time = (new Date()).toTimeString();
// 			function showTime(){
				
// 				requestAnimationFrame(showTime);
// 				var time = new Date();
				
// 				var minute = time.getMinutes(),
// 						minuteRotation = (6*minute)+180,
// 						hour = time.getHours()%12,
// 						hourRotation = (30*hour) +180;
// 				if(scope.currentMinuteRotation != minuteRotation){
// 					$timeout(function(){
// 						scope.currentMinuteRotation = minuteRotation;
// 						scope.$broadcast('updateMinute');
// 					});
// 				}
// 				if(scope.currentHourRotation != hourRotation){
// 					$timeout(function(){
// 						scope.currentHourRotation = hourRotation;
// 						scope.$broadcast('updateHour');
// 					});
// 				}
// 			};
// 			$timeout(function(){
// 				showTime();

// 			});
// 			scope.setTime = function(){
// 				// TODO: sets the scope.time variable
// 				var time = new Date();
// 				scope.time = time.toTimeString();
// 			};
// 		}
// 	}
// })
// .directive('minuteHand', function($timeout){
// 	return {
// 		restrict: 'A',
// 		link: function(scope, element, attrs){
// 			$timeout(function(){
// 				// need to wait for transformOriginTop to be calculated
// 				TweenMax.set(element, {xPercent:-50,transform: "translate3d(0, -"+scope.transformOriginTop+"vmin, 0)"});
// 			});
// 			scope.$on('updateMinute', function(){
// 				// TODO: update the minute hand when there is change
// 				TweenMax.to(element,0.2,{rotation:scope.currentMinuteRotation+'deg_short', transformOrigin: 'center '+scope.transformOriginTop+'vmin'});
// 			});
// 			scope.$on('updateClockHands', function(){
// 				// TODO: updates the minute hand when there is a window resize
// 				// TweenMax.set(element,{rotation:scope.currentMinuteRotation+'deg_short', transformOrigin: 'center '+scope.transformOriginTop+'vmin'});
// 				// TweenMax.set(element, {xPercent:-50,transform: "translate3d(0, -"+scope.transformOriginTop+"vmin, 0)", rotation:scope.currentMinuteRotation+'deg_short', transformOrigin: 'center '+scope.transformOriginTop+'vmin'});

// 			});
// 		}
// 	}
// })
// .directive('hourHand', function($timeout){
// 	return {
// 		restrict: 'A',
// 		link: function(scope, element, attrs){
// 			$timeout(function(){
// 				// need to wait for transformOriginTop to be calculated
// 				TweenMax.set(element, {xPercent:-50,transform: "translate3d(0, -"+scope.transformOriginTop+"vmin, 0)"});
// 			});
// 			scope.$on('updateHour', function(){
// 				TweenMax.to(element,0.2,{rotation:scope.currentHourRotation+'deg_short', transformOrigin: 'center '+scope.transformOriginTop+'vmin'});
// 			});
// 			scope.$on('updateClockHands', function(){
// 				// TODO: updates the hour hand when there is a window resize
				
// 				// TweenMax.set(element,{rotation:scope.currentHourRotation+'deg_short', transformOrigin: 'center '+scope.transformOriginTop+'vmin'});
// 				// console.log('hi');
// 				// TweenMax.set(element, {xPercent:-50,transform: "translate3d(0, -"+scope.transformOriginTop+"vmin, 0)", rotation:scope.currentHourRotation+'deg_short', transformOrigin: 'center '+scope.transformOriginTop+'vmin'});

// 			});
// 		}
// 	}
// })
.directive('drinkSelector', function(){
	return {
		restrict: 'A',
		templateUrl: './templates/drink-selector.html',
		link: function(scope, element, attrs) {

		}
	}
})
.directive('customizationPanel', function($timeout){
	return {
		restrict: 'A',
		templateUrl: './templates/customization-panel.html',
		link: function(scope, element, attrs) {
			var tween = new TimelineMax({paused: true});
			var drinkOptions = [
				{
					path: './img/Coffee-WebEx.png',
					name: 'Coffee - Extra Strong'
				},
				{
					path: './img/Sparkle_EnergyDrink.png',
					name: 'Sparkle - Energy Drink'
				},
				{
					path: './img/beerNoTable.PNG',
					altPath: './img/Spark-Amber.png',
					name: 'Sparks - Amber Ale'
				}
			];
			var tableOptions = [
				{
					path: './img/Wood-Table.png',
					name: 'Home Walnut'
				},
				{
					path: './img/Tabletop_Cherrywood.png',
					name: 'Executive Cherry'
				},
				{
					path: './img/Tabletop_Glass1.png',
					name: 'Highrise Glass'
				},
				{
					path: './img/Tabletop_SBAlumin.png',
					name: 'Industrial Steel'
				}
			];

			scope.currentTable = tableOptions[0];
			scope.currentDrink = drinkOptions[0];
			scope.customizationName = ''; 				// shows the name of option
			scope.currentSelectionSet = null;
			
			scope.customizeObject = function(type) {
				// TODO: sets the customization panel to be drink or table customization
				scope.selectionType = type;
				switch(type){
					case 'drink':
						scope.currentSelectionSet = drinkOptions;
						scope.customizationName = scope.currentDrink.name;
						break;
					case "table":
						scope.currentSelectionSet = tableOptions;
						scope.customizationName = scope.currentTable.name;
						break;
					default:
						console.log('No such customization');
				}
				$timeout(function(){
					TweenMax.to(element, 0.5,{bottom: '2vh', ease: Power2.easeOut});

				});

			}
			scope.selectOption = function(option){
				// TODO: sets selected option as the current drink or table
				completeAndResetTween(tween);
				tween.to(element, 0.5, {bottom: '-30vmin', ease: Power2.easeOut});
				if(option == scope.currentDrink || option == scope.currentTable) {
					tween.play();
					return;
				}
				if(scope.selectionType == 'drink'){
					var setOption = function(){
						scope.$apply(function(){
							scope.currentDrink = option;
						});
					};
					tween.to('.drink-selector', 0.5, {right: '-40vw', onComplete:setOption})
					.to('.drink-selector', 0.5, {right: '25vw', ease: Back.easeOut})
					.set('.drink-selector', {clearProps: 'right'});
					
				} else {
					var setOption = function(){
						scope.$apply(function(){
							scope.currentTable = option;
						});
					};
					tween.to('.drink-selector', 0.5, {right: '-40vw'}, 0)
					.to('.table', 0.5, {rotationX: -90, opacity: 0, onComplete:setOption, transformOrigin: "center bottom"}, 0)
					.add('checkpoint1')
					.to('.table', 0.5, {rotationX: 0, opacity: 1}, 'checkpoint1')
					.to('.drink-selector', 0.5, {right: '25vw', ease: Back.easeOut}, 'checkpoint1')
					.set('.drink-selector', {clearProps: 'right'});
				}
				tween.play();
			};
			scope.setCustomizationName = function(optionName){
				// TODO: sets the customization name on mouse over
				scope.customizationName = optionName;
			};
			scope.$on('cancelCustomization', function(){
				TweenMax.to(element, 0.5,{bottom: '-30vmin', ease: Power2.easeOut});

			});
		}
	}
})
.directive('thinClient', function(){
	return{
		restrict: 'A',
		link: function(scope, element, attrs){
			scope.toggleMeeting = function(join){
				// TODO: shows or hides the Thin client
				if(join){
					TweenMax.to(element, 0.5, {width: '100%', height: '100%', ease: Power2.easeOut});
				} else {
					TweenMax.to(element, 0.5, {width: 0, height: 0, ease: Power2.easeOut});

				}
			}
		}
	}
});
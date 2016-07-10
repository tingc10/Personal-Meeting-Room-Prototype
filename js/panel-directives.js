angular.module('PMR.panelDirectives', [])
.directive('panelContainer', function($timeout, $window){
	return {
		restrict: 'E',
		templateUrl: './templates/panel-container.html',
		link: function(scope, element, attrs){
			/*************** INIT ***************/
			var tween = new TimelineMax({paused:true});
			scope.containerElt = element[0]; 
			scope.disableIframe = false; 			// used to disable iframe when dragging
			scope.panelWidth = 0;							// panelWidth is standard value that is calculated by screen width and used as the relative value
			CSSPlugin.defaultTransformPerspective = 1500;
			// shift panel container to center
			TweenMax.set(scope.containerElt, {yPercent: -50, xPercent:-50});
			// shift panel left and panel right closer to middle panel
			var percentPanelOffset = 15;			// percent offset of panels
			var rotationConstant = 30;				// default rotation amount from very start
			TweenMax.set(scope.leftFace, {xPercent:percentPanelOffset, rotationY:rotationConstant+'deg'});
			TweenMax.set(scope.rightFace, {xPercent: -1*percentPanelOffset, rotationY:(-1*rotationConstant)+'deg'});
			
			// var offset = 0;						// offset from center
			var startPageX = 0;						// holds the starting drag position
			var animationSpeed = 0.5;		// animation speed of shift and rotate
			var lastEndRotation = {				// holds last rotation values, used on drag, updated by shiftToPanel
				left: rotationConstant,
				middle: 0,
				right: -1*rotationConstant
			};
			// var mouseX;					// stored mouseX position
			scope.currentPanel = 'middle';			// panel that is currently centered
			var w = angular.element($window);
			var offsetToEndpoint = 0; 					// offset value required in +/- direction to make left/right panel centered
																					// value dependent on screen width (which affects panel width)
			var getInitialState = function(e){
				// TODO: get inital mouse position in order to determine offset
				scope.$apply(function(){
					startPageX = e.pageX;
					scope.disableIframe = true;
				});
				
			};
			var setInitialAnimation = function(){
				// TODO: sets the sequence for starting animation
				tween.to('html, body',0.2, {opacity: 1})
				.from('.user-container', 0.5, {opacity: 0, scale: 0.5, ease: Power2.easeOut})
				.from('.user-container', 1, {top: '18vh', ease: Power2.easeOut})
				.staggerFrom('.s2', 1, {opacity: 0, ease: Power2.easeOut}, 0.5)
				.add('checkpoint1')
				.from('.table', 0.3, {opacity:0, rotationX: -90, ease: Power2.easeOut}, 'checkpoint1')
				.from('.notification-bar', 0.3, {top: '-12vh', ease: Power2.easeOut}, 'checkpoint1')
				.add('checkpoint2')
				.from(scope.leftFace, 0.3, {rotationY: '50deg', opacity: 0, ease: Power2.easeOut}, 'checkpoint2')
				.from(scope.rightFace, 0.3, {rotationY: '-50deg', opacity: 0, ease: Power2.easeOut}, 'checkpoint2')
				.add('checkpoint3')
				.from('.drink-selector', 1, {right: "-30vmin", ease: Back.easeOut}, 'checkpoint3')
				.add('checkpoint4')
				// .from('.clock-container', 0.3, {opacity: 0, ease: Power2.easeOut}, 'checkpoint4')
				.from('.chats-container', 0.3, {opacity: 0, ease: Power2.easeOut}, "checkpoint4")
				.from('.icon-container', 0.3, {width: 0, height: 0, ease: Power2.easeOut}, 'checkpoint4')
				.from('.join-button', 0.3, {padding: 0, opacity: 0, ease: Power2.easeOut}, "checkpoint4")
				.from('.icon-cisco, .small-text, .more-options', 0.2, {opacity: 0, ease: Power2.easeOut}, "checkpoint4")
				.add('checkpoint5')
				.set('.icon-container', {clearProps: 'width, height'});
				
				tween.play();
			};
			var determineOpacity = function(percentToEndpoint){
				// TODO: determines the correct opacity for the center panel
				//				depending on what the current panel is
				var tmp = Math.abs(percentToEndpoint);
				if(scope.currentPanel == 'middle'){
					return 1-tmp;
				} else {
					if(tmp <= 1){
						// if tmp == 1, the shift would be back to center
						return tmp;
					} else if (tmp < 2) {
						// if tmp is greater than 1, then it's moving past center panel
						return 1 - (tmp%1);
					} else {
						// if it overshoots even the furthest panael, just hide middle panel
						return 0;
					}
				}
			};
			var cancelCustomization = function(){
				// TODO: hide customization panel if it is showing
				scope.$emit('cancelCustomization');
			};
			var updateRotation = function(e){
				// TODO: update rotation based on how much has been dragged
				scope.$apply(function(){
					var amountShifted = startPageX - e.pageX;
					var percentToEndpoint = amountShifted/offsetToEndpoint,
							degsToShift = percentToEndpoint*rotationConstant,
							leftRotation = lastEndRotation.left+degsToShift,
							rightRotation = lastEndRotation.right+degsToShift,
							middleOpacity = determineOpacity(percentToEndpoint);
					TweenMax.set(scope.leftFace, {rotationY: leftRotation});
					TweenMax.set(scope.middleFace, {rotationY: lastEndRotation.middle+degsToShift, opacity:middleOpacity});
					TweenMax.set(scope.rightFace, {rotationY: rightRotation});
					// console.log(percentToEndpoint);
					// toggle visibility based on rotation value
					if(leftRotation > 90) {
						TweenMax.set(scope.leftFace, {visibility: "hidden"});

					} else {
						TweenMax.set(scope.leftFace, {visibility: "visible"});

					}
					if(rightRotation < -90) {
						TweenMax.set(scope.rightFace, {visibility: "hidden"});

					} else {
						TweenMax.set(scope.rightFace, {visibility: "visible"});

					}
				});
			};
			var determineFinalState = function(e){
				// TODO: determine the direction it was moving, then make it finish at the next panel
				//				moving in that direction, or if the final shiftValue moves past the next endpoint
				//				move the panel after that
				scope.$apply(function(){
					var finalShiftValue = startPageX - e.pageX;
					var nextPanel, 
							shiftTwoPanes = false,
							tolerance = scope.panelWidth*0.1;
					scope.disableIframe = false;
					if(Math.abs(finalShiftValue) > (offsetToEndpoint+tolerance)){
						shiftTwoPanes = true;
					}
					if(finalShiftValue > 0 && Math.abs(finalShiftValue) > tolerance){
						// left swipe
						if(scope.currentPanel == 'left'){
							if(shiftTwoPanes){
								nextPanel = 'right';

							} else {
								nextPanel = 'middle';

							}
						} else if(scope.currentPanel == 'middle'){
							nextPanel = 'right';
						} else {
							nextPanel = 'right';
						}
					} else if(finalShiftValue < 0 && Math.abs(finalShiftValue) > tolerance){
						// right swipe
						if(scope.currentPanel == 'left'){
							nextPanel = 'left';
						} else if(scope.currentPanel == 'middle'){
							nextPanel = 'left';
						} else {
							if(shiftTwoPanes){
								nextPanel = 'left';

							} else {
								nextPanel = 'middle';

							}
						}
						
					} else {
						// finalshift value did not change, don't do anything?
						shiftToPanel(scope.currentPanel, 0.5);
					}
					shiftToPanel(nextPanel, 1);
				});
			};
			var setOffsetToEndpoint = function(){
				// TODO: returns the offset value that would set another panel to the center;
				offsetToEndpoint = scope.panelWidth - (scope.panelWidth*percentPanelOffset/100);
			};
			var updateWidths  = function(){
				// TODO: update the width of container and panels
				scope.$apply(function(){
					scope.panelWidth = scope.middleFace.offsetWidth;
					setOffsetToEndpoint();
					shiftToPanel(scope.currentPanel, 0.2);
					scope.$emit('checkWhiteboard');
					scope.$broadcast('updateClockHands');
				});
			};
			
			var shiftToPanel = function(centerPanel, speed) {
				// TODO: shifts the designated centerPanel
				// ELASTIC: .config(x, y) lower value of x the lower the amplitude of bounce
				//												lower value of y the more periods are squeezed in
				switch(centerPanel){
					case 'left':
						TweenMax.to(scope.containerElt, speed, {x:offsetToEndpoint, ease: Elastic.easeOut.config(0.5,0.3)});
						TweenMax.to(scope.leftFace, speed, {rotationY: 0, visibility:'visible', ease: Elastic.easeOut.config(0.5,0.3)});
						TweenMax.to(scope.middleFace, speed, {rotationY: (-1*rotationConstant)+'deg', opacity: 0, visibility: 'visible', ease: Elastic.easeOut.config(0.5,0.3)});
						TweenMax.to(scope.rightFace, speed, {rotationY: (-2*rotationConstant)+'deg', visibility:'hidden', ease: Elastic.easeOut.config(0.5,0.3)});
						scope.currentPanel = 'left';
						lastEndRotation.left = 0;
						lastEndRotation.middle = -rotationConstant;
						lastEndRotation.right = -2*rotationConstant;
						break;
					case 'right':
						TweenMax.to(scope.containerElt, speed, {x:-offsetToEndpoint, ease: Elastic.easeOut.config(0.5,0.3)});
						TweenMax.to(scope.rightFace, speed, {rotationY: 0, visibility: 'visible', ease: Elastic.easeOut.config(0.5,0.3)});
						TweenMax.to(scope.middleFace, speed, {rotationY: rotationConstant+'deg', visibility: 'visible', opacity: 0, ease: Elastic.easeOut.config(0.5,0.3)});
						TweenMax.to(scope.leftFace, speed, {rotationY: 2*rotationConstant+'deg', visibility:'hidden', ease: Elastic.easeOut.config(0.5,0.3)});
						scope.currentPanel = 'right';
						lastEndRotation.left = 2*rotationConstant;
						lastEndRotation.middle = rotationConstant;
						lastEndRotation.right = 0;
						break;
					case 'middle':
						TweenMax.to(scope.containerElt, speed, {x:0, ease: Elastic.easeOut.config(0.5,0.3)});
						TweenMax.to(scope.middleFace, speed, {rotationY: 0, visibility: 'visible', opacity:1,  ease: Elastic.easeOut.config(0.5,0.3)});
						TweenMax.to(scope.leftFace, speed, {rotationY: rotationConstant+'deg', visibility: 'visible', ease: Elastic.easeOut.config(0.5,0.3)});
						TweenMax.to(scope.rightFace, speed, {rotationY: (-1*rotationConstant)+'deg', visibility: 'visible', ease: Elastic.easeOut.config(0.5,0.3)});
						scope.currentPanel = 'middle';
						lastEndRotation.left = rotationConstant;
						lastEndRotation.middle = 0;
						lastEndRotation.right = -1*rotationConstant;
						break;
					default:
						console.log('error shifting panel to center');
				}
			}
			$timeout(function(){
				/******************** INIT AFTER RENDER ************************/
				setOffsetToEndpoint();
				Draggable.create(element[0], {
					type: 'x',
					onDragStart: getInitialState,
					onDrag: updateRotation,
					onDragEnd: determineFinalState,
					onClick: cancelCustomization
				});
				/******************** INIT AFTER RENDER END *********************/
			});
			/************** INIT END *************/
			
			w.on('resize', updateWidths);			// sets window resize event
			$timeout(function(){
				setInitialAnimation();
			}, 1000);
		}
	}
})
.directive('panel', function($timeout){
	return {
		restrict: 'A',
		link: function(scope, element, attrs){
			
			switch(element[0].classList[1]){
				case 'left':
					scope.leftFace = element[0];
					break;
				case 'middle':
					scope.middleFace = element[0];
					$timeout(function(){
						// set panelWidth
						scope.panelWidth = scope.middleFace.offsetWidth;
						console.log(scope.panelWidth);
					});
					break;
				case 'right':
					scope.rightFace = element[0];
					break;
				default:
					console.log('unknown panel');
			}
		}
	}
})
.directive('frame', function(){
	return {
		restrict: 'A',
		link: function(scope, element, attrs){
			scope.frameElt = element[0];

		}
	}
});
// .directive('userContainer', function(){
// 	return {
// 		restrict: 'A',
// 		templateUrl: './templates/user-container.html'		
// 	}
	
// })
// .directive('notifications', function(){
// 	return {
// 		restrict: 'A',
// 		templateUrl: './templates/notifications.html',
// 		link: function(scope, element, attrs){

// 		}
// 	}
// })
// .directive('notification', function(){
// 	return {
// 		restrict: 'A',
// 		scope: {
// 			user: '@',
// 			message: '@',
// 			time: '@'
// 		},
// 		template: '<div class="main">'+
// 								'<div class="user">{{user}}</div>'+
// 								'<div class="message">{{message}}</div>'+
// 							'</div>'+
// 							'<div class="time">{{time}}</div>'
// 	}
// })
;
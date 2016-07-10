function completeAndResetTween(tween){
	tween.progress(1).clear().eventCallback("onComplete", null).eventCallback('onReverseComplete', null);
};
angular.module('PMR', ['PMR.panelDirectives', 'PMR.utilityDirectives']);
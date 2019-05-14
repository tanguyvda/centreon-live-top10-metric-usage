
    var scaleCurve = mojs.easing.path('M0,100 L25,99.9999983 C26.2328835,75.0708847 19.7847843,0 100,0');
    var el = document.querySelector('.fa'),
	elSpan = el.querySelector('motionSpan'),
	// mo.js timeline obj
	timeline = new mojs.Timeline(),

	// tweens for the animation:

	// burst animation
	tween1 = new mojs.Burst({
		parent: el,
		duration: 1500,
		shape : 'circle',
		fill : [ '#988ADE', '#DE8AA0', '#8AAEDE', '#8ADEAD', '#DEC58A', '#8AD1DE' ],
		opacity: 0.6,
		childOptions: { radius: {20:0} },
		radius: {40:120},
		count: 6,
		isSwirl: true,
		easing: mojs.easing.bezier(0.1, 1, 0.3, 1)
	}),
	// ring animation
	tween2 = new mojs.Transit({
		parent: el,
		duration: 750,
		type: 'circle',
		radius: {0: 50},
		fill: 'transparent',
		stroke: '#988ADE',
		strokeWidth: {15:0},
		opacity: 0.6,
		easing: mojs.easing.bezier(0, 1, 0.5, 1)
	});

// add tweens to timeline:
timeline.add(tween1, tween2);

// when clicking the button start the timeline/animation:
el.addEventListener('mouseenter', function() {
	timeline.replay();
});

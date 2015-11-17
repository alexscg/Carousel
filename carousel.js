(function(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }

}(function($) {
    'use strict';
    var myCar = window.myCar || {};

    myCar = (function() {

		
        function myCar(container, settings) {

            var _ = this;

			_.$c = $(container);
			
            _.defaults = {
                prevArrow: '<button type="button" class="arr prev"></button>',
                nextArrow: '<button type="button" class="arr next disabled"></button>',
				dotIndex: '<ul class="dots"></ul>',
                infinite: false,
                initialSlide: 0,
                slidesToScroll: 1,
				currentFrame: 1,
                speed: 500
            };

            _.structure = {
				containerWidth: 800,
				containerHeight: 220,
				slideWidth: 200,
				slideHeight: 200,
				indexHeight: 20,
				arrowWidth: 40,
				arrowHeight: 40
			};

            _.opts = $.extend({}, _.defaults, settings, _.structure);
			 
            _.init(true);

        }

        return myCar;

    }());


    myCar.prototype.init = function() {

        var _ = this;

		_.$c.find('> ul').wrap('<div class="viewport"></div>');
		_.$slidebar = _.$c.find('.viewport > ul');
		_.$slidebar.find('> li:first').addClass('first');
		_.$slidebar.find('> li:last').addClass('last');
		_.$slides = _.$slidebar.find('> li').addClass('slide');
		
        if(!_.$c.hasClass('initialized')) {
            _.computeDynamics();
			_.initArrows();
            _.buildDots();
			_.$c.addClass('initialized');
        }
		
		$(window).resize(function() {
			clearTimeout(_.resizeTimer);
			_.resizeTimer = setTimeout(function(){
				_.computeDynamics();
				_.$dots.remove();
				_.buildDots();
				_.$slidebar.css({left:0});
				_.opts.currentFrame = 1;
				_.updateArrows();
			}, 300);
		});
    };

	myCar.prototype.computeDynamics = function() {
        var _ = this;
		
		_.opts.containerWidth = 		parseInt(_.$c.css('width').replace(/[^\d.-]/g, ''));
		_.opts.slideContainerWidth = 	_.opts.containerWidth - _.opts.arrowWidth * 2;
		_.opts.slideContainerHeight = 	_.opts.containerHeight - _.opts.indexHeight;
		_.opts.totalSlidesCount = 		_.$slidebar.find('> li').length;
		_.opts.frameWidth = 			_.$c.css('width').replace(/[^\d.-]/g, ''), //_.opts.slideWidth * _.opts.slidesToScroll,
		_.opts.totalFrames = 			Math.ceil((_.opts.slideWidth * _.opts.totalSlidesCount) / _.opts.containerWidth);
		_.opts.slidesToScroll =			_.opts.frameWidth / _.opts.slideWidth;
	}
	
    myCar.prototype.initArrows = function() {
        var _ = this;
		_.$arrP = $(_.opts.prevArrow).on('click', function(event){
			event.preventDefault();
			event.stopPropagation();
			if(_.opts.currentFrame < _.opts.totalFrames) {
				_.movePrev();
			}
		});
		
		_.$arrN = $(_.opts.nextArrow).on('click', function(event){
			event.preventDefault();
			event.stopPropagation();
			if(_.opts.currentFrame > 1) {
				_.moveNext();
			}
		});
		
		_.$c.append(_.$arrP),
		_.$c.append(_.$arrN);
	};

	myCar.prototype.movePrev = function(){
		var _ = this;

		_.$slidebar.animate({
			left: "-=" + _.opts.frameWidth
		}, _.opts.speed, function() {
			_.opts.currentFrame++;
			_.$arrN.removeClass('disabled');
			if(_.opts.currentFrame === _.opts.totalFrames){
				_.$arrP.addClass('disabled');
			}
			_.updateDots();
		});
	}

	myCar.prototype.moveNext = function(){
		var _ = this;

		_.$slidebar.animate({
			left: "+=" + _.opts.frameWidth
		}, _.opts.speed, function() {
			_.opts.currentFrame--;
			_.$arrP.removeClass('disabled');
			if(_.opts.currentFrame === 1){
				_.$arrN.addClass('disabled');
				_.$arrP.removeClass('disabled');
			}
			_.updateDots();
		});
	}

	myCar.prototype.updateArrows = function() {
		var _ = this;
		setTimeout(function(){
			_.$arrP.removeClass('disabled');
			_.$arrN.addClass('disabled');
		}, 0);

	}
	
    myCar.prototype.buildDots = function() {
        var _ = this;

		_.opts.totalFrames
		
		_.$dots = $(_.opts.dotIndex);
		
		var arr = new Array(_.opts.totalFrames);
		$.each(arr, function(index) {
			var selected = index? '' : ' selected';
			var $dot = $('<li class="dot' + selected + '"></li>').on('click', function(event){
				_.moveFrameTo(index + 1, event);
			});
			_.$dots.append($dot);
		});
		_.$c.append(_.$dots);
    };
    
	myCar.prototype.updateDots = function() {
		var _ = this;
		setTimeout(function(){
			_.$dots.find('.selected').removeClass('selected');
			_.$dots.find('.dot').eq(_.opts.currentFrame - 1).addClass('selected');
		}, 0);

	}
	
    myCar.prototype.moveFrameTo = function(index, event) {
        var _ = this;

		if(!$(event.target).hasClass('selected')){
			if(index > _.opts.currentFrame){
				for(var i=index-_.opts.currentFrame;i--;) _.movePrev();
			}
			else {
				for(var i=_.opts.currentFrame-index;i--;) _.moveNext();
			}
		}
    };
	
    $.fn.myCar = function() {
        var _ = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            l = _.length,
            i,
            ret;
        for (i = 0; i < l; i++) {
            if (typeof opt == 'object' || typeof opt == 'undefined')
                _[i].myCar = new myCar(_[i], opt);
            else
                ret = _[i].myCar[opt].apply(_[i].myCar, args);
            if (typeof ret != 'undefined') return ret;
        }
        return _;
    };
}));

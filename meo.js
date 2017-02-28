/* meo media Player *
 * v2.0.0 || LGPLv3 *
 * by haiderzia2002 */
$(document).ready(function() {
	$.fn.meo = function(options) {
		// Setting default options
		var settings = $.extend({
			timeFormat: "default",
			hideTime: "2000",
			skip: "5"
		}, options);

		// Pauses and plays the video
		$.fn.handlePlay = function() {
			var med = this.get(0);
			if (med.paused || med.ended) {
				med.play();
			} else {
				med.pause();
			};
		};

		// Converts seconds to either HH:MM:SS or MM:SS format
		$.fn.time = function(a) {
			if (settings.timeFormat == "hhmmss" || (settings.timeFormat == "default" && a >= 3600)) {
				var h = Math.floor(a / 3600) < 10 ? "0" + Math.floor(a / 3600) : Math.floor(a / 3600),
				    m = Math.floor(a / 60) % 60 < 10 ? "0" + Math.floor(a / 60) % 60 : Math.floor(a / 60) % 60,
				    s = Math.floor(a % 60) < 10 ? "0" + Math.floor(a % 60) : Math.floor(a % 60);
				return h + ":" + m + ":" + s;
			} else if (settings.timeFormat == "mmss" || (settings.timeFormat == "default" && a < 3600)) {
				var m = Math.floor(a / 60) < 10 ? "0" + Math.floor(a / 60) : Math.floor(a / 60),
				    s = Math.floor(a % 60) < 10 ? "0" + Math.floor(a % 60) : Math.floor(a % 60);
				return m + ":" + s;
			};
		};

		// Test whether to use fallback
		var meot1 = document.createElement("video").canPlayType;
		return this.each(function() {
			var med = $(this),
			    men = this;
			med.wrap('<div class="meo"></div>');
			var meocn = med.parent();
			if (meot1) {
				// Insert controls and disable browser default controls
				med.after('<ul tabindex="-1"><li class="playp"></li><li class="ctime"></li><li class="progr"><div class="progl"></div><div class="progb"></div><div class="ftime"></div><div class="ftimt"></div></li><li class="ttime"></li><li class="fs"></li></ul>');
				this.controls = false;
				// Enable video on iOS 10 iPhone to play without going into fullscreen
				med.attr("playsinline", "true");
				
				// Declare variables
				var meoul = med.siblings(),
				    playp = meoul.find(".playp"), // play/pause button
				    ctime = meoul.find(".ctime"), // current time
				    progr = meoul.find(".progr"), // progress played
				    progb = meoul.find(".progb"), // whole progress bar
				    progl = meoul.find(".progl"), // progress loaded
				    ftime = meoul.find(".ftime"), // time float
				    ftimt = meoul.find(".ftimt"), // time float pinter
				    ttime = meoul.find(".ttime"), // total time
				    fs = meoul.find(".fs"); // fullscreen button

				// Size the controls/Init time values
				med.on("loadedmetadata", function() {
					ctime.text(med.time(this.currentTime));
					ttime.text(med.time(this.duration));
					med.on("loadeddata", function() {
						var conwidth = playp.outerWidth(true) + ctime.outerWidth(true) + progr.outerWidth(true) - progr.outerWidth(false) + ttime.outerWidth(true) + fs.outerWidth(true);
						progr.css("width", med.width() - conwidth);
						progl.width(((this.buffered.end(0) / this.duration) * 100) + "%");
					});
				});

				// Update time values and resize controls
				med.on("timeupdate", function() {
					var conwidth = playp.outerWidth(true) + ctime.outerWidth(true) + progr.outerWidth(true) - progr.outerWidth(false) + ttime.outerWidth(true) + fs.outerWidth(true);
					progb.width(((this.currentTime / this.duration) * 100) + "%");
					ctime.text(med.time(this.currentTime));
					progr.css("width", med.width() - conwidth);
				});

				// Handles changing icon on play/pause button
				med.on("pause", function() {
					playp.css("background-position", "0% 0%");
				});

				med.on("play", function() {
					playp.css("background-position", "0% 100%");
				});

				// Makes the play/payse button function
				playp.css("background-position", "0% 0%");
				playp.click(function() {
					med.handlePlay();
				});

				// Jump to point on progress bar
				progr.click(function(e) {
					var pos = (e.pageX - progr.offset().left) / progr.width();
					men.currentTime = pos * men.duration;
				});

				// Time float
				progr.mousemove(function(e) {
					meoul.find(".ftime, .ftimt").css("visibility", "visible");
					ftime.css("visibility", "visible");
					var pos = (e.pageX - progr.offset().left) / progr.width();
					if (pos >= 0 && pos <= 1) {
						ftime.text(med.time(pos * men.duration));
						ftime.css("left", pos * progr.width() - (ftime.outerWidth(true) / 2));
						ftimt.css("left", pos * progr.width() - (ftimt.outerWidth(true) / 2));
					};
				});

				progr.mouseleave(function() {
					meoul.find(".ftime, .ftimt").css("visibility", "hidden");
				});

				// Keyboard controls
				meocn.keydown(function(e) {
					if (e.which == 32 || e.which == 75) { // spacebar || k
						e.preventDefault();
						meocn.find("video, audio").handlePlay();
					} else if (e.which == 37 || e.which == 74) { // ArrowLeft || j
						men.currentTime -= settings.skip;
					} else if (e.which == 32 || e.which == 76) { // ArrowRight || l
						men.currentTime -= -1 * settings.skip;
					};
				});

				if (med.is("video")) {
					// Fullscreen
					fs.css("background-position", "100% 0%");
					fs.on("click", function() {
						if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
							if (document.exitFullscreen) {
								document.exitFullscreen();
							} else if (document.webkitExitFullscreen) {
								document.webkitExitFullscreen();
							} else if (document.mozCancelFullScreen) {
								document.mozCancelFullScreen();
							} else if (document.msExitFullscreen) {
								document.msExitFullscreen();
							};
						} else {
							var meo = meocn.get(0);
							if (meo.requestFullscreen) {
								meo.requestFullscreen();
							} else if (meo.webkitRequestFullscreen) {
								meo.webkitRequestFullscreen();
							} else if (meo.mozRequestFullScreen) {
								meo.mozRequestFullScreen();
							} else if (meo.msRequestFullscreen) {
								meo.msRequestFullscreen();
							} else if (men.webkitEnterFullScreen) {
								men.webkitEnterFullScreen();
							};
						};
					});

					$(document).on("fullscreenchange webkitfullscreenchange mozfullscreenchange msfullscreenchange", function() {
						var conwidth = playp.outerWidth(true) + ctime.outerWidth(true) + (progr.outerWidth(true) - progr.outerWidth(false)) + ttime.outerWidth(true) + fs.outerWidth(true);
						if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
							meocn.addClass("meofs");
							fs.css("background-position", "100% 100%");
							progr.css("width", screen.width - conwidth);
						} else {
							meocn.removeClass("meofs");
							fs.css("background-position", "100% 0%");
							progr.css("width", med.width() - conwidth);
						};
					});

					// Hides controlbar
					hide = 0;
					med.mousemove(function() {
						if (men.paused != true) {
							window.clearTimeout(hide);
							meoul.removeClass("hidec");
							hide = window.setTimeout(function(){meoul.addClass("hidec")}, settings.hideTime);
						};
					});

					med.on("pause play end mouseleave", function() {
						window.clearTimeout(hide);
						meoul.removeClass("hidec");
					});
				};
			} else {
				// Generates fallback
				meocn.addClass("nomed");
				med.css("display", "none");
				var lengt = med.find("source").length;
				if (lengt > 0) {
					src = med.find("source");
					while (lengt > 0) {
						srcn = src.attr("src")
						lengt -= 1;
						src = src.nextAll("source");
						meocn.append('<a href="' + srcn + '">' + srcn + '</a><br>');
					};
				} else {
					srcn = med.attr("src");
					meocn.append('<a href="' + srcn + '">' + srcn + '</a>');
				};
			};
		});
	};
});
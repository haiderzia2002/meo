/* meo Player *
 *   v1.7.0   *
 *   LGPLv3   */
$(document).ready(function() {
	$.fn.meo = function() {
		$.fn.handlePlay = function() {
			var med = this.get(0);
			if (med.paused || med.ended) {
				med.play();
			} else {
				med.pause();
			};
		};

		$.fn.time = function(a) {
			if (this.duration >= 3600) {
				var h = Math.floor(a / 3600) < 10 ? "0" + Math.floor(a / 3600) : Math.floor(a / 3600);
				var m = Math.floor(a / 60) % 60 < 10 ? "0" + Math.floor(a / 60) % 60 : Math.floor(a / 60) % 60;
				var s = Math.floor(a % 60) < 10 ? "0" + Math.floor(a % 60) : Math.floor(a % 60);
				return h + ":" + m + ":" + s;
			} else {
				var m = Math.floor(a / 60) < 10 ? "0" + Math.floor(a / 60) : Math.floor(a / 60);
				var s = Math.floor(a % 60) < 10 ? "0" + Math.floor(a % 60) : Math.floor(a % 60);
				return m + ":" + s;
			};
		};

		var meot1 = document.createElement("video").canPlayType;
		var meot2 = !navigator.userAgent.match(/(iPod|iPhone|iPad)/i);
		return this.each(function() {
			var med = $(this);
			med.wrap('<div class="meo"></div>');
			var meocn = med.parent();
			if (meot1  && meot2) {
				med.after('<ul tabindex="-1"><li class="playp"></li><li class="ctime"></li><li class="progr"><div class="progl"></div><div class="progb"></div><div class="ftime"></div><div class="ftimt"></div></li><li class="ttime"></li><li class="fs"></li></ul>');
				this.controls = false;
				var meoul = med.siblings();
				var playp = meoul.find(".playp");
				var ctime = meoul.find(".ctime");
				var progr = meoul.find(".progr");
				var progb = meoul.find(".progb");
				var progl = meoul.find(".progl");
				var ftime = meoul.find(".ftime");
				var ftimt = meoul.find(".ftimt");
				var ttime = meoul.find(".ttime");
				var fs = meoul.find(".fs");

				med.on("loadedmetadata", function() {
					ctime.text(med.time(this.currentTime));
					ttime.text(med.time(this.duration));
					med.on("loadeddata", function() {
						var conwidth = playp.outerWidth(true) + ctime.outerWidth(true) + (progr.outerWidth(true) - progr.outerWidth(false)) + ttime.outerWidth(true) + fs.outerWidth(true);
						progr.css("width", med.width() - conwidth);
						med.on("progress", function() {
							progl.width(((this.buffered.end(0) / this.duration) * 100) + "%");
						});
					});
				});

				med.on("timeupdate", function() {
					progb.width(((this.currentTime / this.duration) * 100) + "%");
					ctime.text(med.time(this.currentTime));
				});

				med.on("pause", function() {
					playp.css("background-position", "0% 0%");
				});

				med.on("play", function() {
					playp.css("background-position", "0% 100%");
				});

				playp.css("background-position", "0% 0%");
				playp.click(function() {
					med.handlePlay();
				});

				progr.click(function(e) {
					var pos = (e.pageX - progr.offset().left) / progr.width();
					med.get(0).currentTime = pos * med.get(0).duration;
				});

				progr.mousemove(function(e) {
					meoul.find(".ftime, .ftimt").css("visibility", "visible");
					ftime.css("visibility", "visible");
					var pos = (e.pageX - progr.offset().left) / progr.width();
					if (pos >= 0 && pos <= 1) {
						ftime.text(med.time(pos * med.get(0).duration));
						ftime.css("left", pos * progr.width() - (ftime.outerWidth(true) / 2));
						ftimt.css("left", pos * progr.width() - (ftimt.outerWidth(true) / 2));
					};
				});

				progr.mouseleave(function() {
					meoul.find(".ftime, .ftimt").css("visibility", "hidden");
				});

				meocn.keydown(function(e) {
					if (e.which == 32) {
						e.preventDefault();
						meocn.find("video, audio").handlePlay();
					};
				});

				if (med.is("video")) {
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
							meofs = fs.parents(".meo");
							var meo = meofs.get(0);
							if (meo.requestFullscreen) {
								meo.requestFullscreen();
							} else if (meo.webkitRequestFullscreen) {
								meo.webkitRequestFullscreen();
							} else if (meo.mozRequestFullScreen) {
								meo.mozRequestFullScreen();
							} else if (meo.msRequestFullscreen) {
								meo.msRequestFullscreen();
							};
						};
					});

					$(document).on("fullscreenchange webkitfullscreenchange mozfullscreenchange msfullscreenchange", function() {
						var meoul = meofs.find("ul");
						var med = meofs.find("video");
						var playp = meofs.find(".playp");
						var ctime = meofs.find(".ctime");
						var progr = meofs.find(".progr");
						var ttime = meofs.find(".ttime");
						var fs = meofs.find(".fs");
						meoul.css("visibility", "visible");
						var conwidth = playp.outerWidth(true) + ctime.outerWidth(true) + (progr.outerWidth(true) - progr.outerWidth(false)) + ttime.outerWidth(true) + fs.outerWidth(true);
						if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
							meofs.addClass("meofs");
							fs.css("background-position", "100% 100%");
							progr.css("width", screen.width - conwidth);
						} else {
							meofs.removeClass("meofs");
							fs.css("background-position", "100% 0%");
							progr.css("width", med.width() - conwidth);
						};
					});

					med.click(function() {
						if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
							if (meoul.css("visibility") == "visible") {
								meoul.css("visibility", "hidden");
							} else {
								meoul.css("visibility", "visible");
							};
						};
					});
				};
			} else if (meot2 != true) {
			} else if (meot1 != true) {
				meo.addClass("nomed");
				med.css("display", "none");
				var lengt = med.find("source").length;
				if (lengt > 0) {
					src = med.find("source");
					while (lengt > 0) {
						srcn = src.attr("src")
						lengt += -1;
						src = src.nextAll("source");
						meo.append('<a href="' + srcn + '">' + srcn + '</a><br>');
					};
				} else {
					srcn = med.attr("src");
					meo.append('<a href="' + srcn + '">' + srcn + '</a>');
				};
			};
		});
	};
});

$.throttle_delay = 350;
$.menu_speed = 235;
$.navAsAjax = true;
$.enableJarvisWidgets = true;
$.enableMobileWidgets = false;
$.fastClick = false;
$.calc_navbar_height = function() {
	var a = null;
	if ($("#header").length) {
		a = $("#header").height()
	}
	if (a === null) {
		a = $('<div id="header"></div>').height()
	}
	if (a === null) {
		return 49
	}
	return a
};
$.navbar_height = $.calc_navbar_height();
$.root_ = $("body");
$.left_panel = $("#left-panel");
$.shortcut_dropdown = $("#shortcut");
$.bread_crumb = $("#ribbon ol.breadcrumb");
$.intervalArr = new Array();
var $topmenu = false;
$.device = null;
var ismobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
if (!ismobile) {
	$.root_.addClass("desktop-detected");
	$.device = "desktop"
} else {
	$.root_.addClass("mobile-detected");
	$.device = "mobile";
	if ($.fastClick) {
		$.root_.addClass("needsclick");
		FastClick.attach(document.body)
	}
} if ($("body").hasClass("menu-on-top") || localStorage.getItem("sm-setmenu") == "top") {
	$topmenu = true;
	$("body").addClass("menu-on-top")
}
jQuery(document).ready(function() {
	if ($("[rel=tooltip]").length) {
		$("[rel=tooltip]").tooltip()
	}
	$(document).mouseup(function(a) {
		if (!$(".ajax-dropdown").is(a.target) && $(".ajax-dropdown").has(a.target).length === 0) {
			$(".ajax-dropdown").fadeOut(150);
			$(".ajax-dropdown").prev().removeClass("active")
		}
	});
	$("button[data-btn-loading]").on("click", function() {
		var a = $(this);
		a.button("loading");
		setTimeout(function() {
			a.button("reset")
		}, 3000)
	})
});
(function(g, i, c) {
	var a = g([]),
		e = g.resize = g.extend(g.resize, {}),
		j, l = "setTimeout",
		k = "resize",
		d = k + "-special-event",
		b = "delay",
		f = "throttleWindow";
	e[b] = g.throttle_delay;
	e[f] = true;
	g.event.special[k] = {
		setup: function() {
			if (!e[f] && this[l]) {
				return false
			}
			var m = g(this);
			a = a.add(m);
			try {
				g.data(this, d, {
					w: m.width(),
					h: m.height()
				})
			} catch (n) {
				g.data(this, d, {
					w: m.width,
					h: m.height
				})
			}
			if (a.length === 1) {
				h()
			}
		},
		teardown: function() {
			if (!e[f] && this[l]) {
				return false
			}
			var m = g(this);
			a = a.not(m);
			m.removeData(d);
			if (!a.length) {
				clearTimeout(j)
			}
		},
		add: function(m) {
			if (!e[f] && this[l]) {
				return false
			}
			var o;

			function n(t, p, q) {
				var r = g(this),
					s = g.data(this, d);
				s.w = p !== c ? p : r.width();
				s.h = q !== c ? q : r.height();
				o.apply(this, arguments)
			}
			if (g.isFunction(m)) {
				o = m;
				return n
			} else {
				o = m.handler;
				m.handler = n
			}
		}
	};

	function h() {
		j = i[l](function() {
			a.each(function() {
				var n;
				var m;
				var o = g(this),
					p = g.data(this, d);
				try {
					n = o.width()
				} catch (q) {
					n = o.width
				}
				try {
					m = o.height()
				} catch (q) {
					m = o.height
				}
				if (n !== p.w || m !== p.h) {
					o.trigger(k, [p.w = n, p.h = m])
				}
			});
			h()
		}, e[b])
	}
})(jQuery, this);
$("#main").resize(function() {
	check_if_mobile_width()
});

function check_if_mobile_width() {
	if ($(window).width() < 979) {
		$.root_.addClass("mobile-view-activated");
		$.root_.removeClass("minified")
	} else {
		if ($.root_.hasClass("mobile-view-activated")) {
			$.root_.removeClass("mobile-view-activated")
		}
	}
}
var ie = (function() {
	var c, a = 3,
		d = document.createElement("div"),
		b = d.getElementsByTagName("i");
	while (d.innerHTML = "<!--[if gt IE " + (++a) + "]><i></i><![endif]-->", b[0]) {}
	return a > 4 ? a : c
}());
$.fn.extend({
	jarvismenu: function(a) {
		var d = {
			accordion: "true",
			speed: 200,
			closedSign: "[+]",
			openedSign: "[-]"
		};
		var b = $.extend(d, a);
		var c = $(this);
		c.find("li").each(function() {
			if ($(this).find("ul").size() !== 0) {
				$(this).find("a:first").append("<b class='collapse-sign'>" + b.closedSign + "</b>");
				if ($(this).find("a:first").attr("href") == "#") {
					$(this).find("a:first").click(function() {
						return false
					})
				}
			}
		});
		c.find("li.active").each(function() {
			$(this).parents("ul").slideDown(b.speed);
			$(this).parents("ul").parent("li").find("b:first").html(b.openedSign);
			$(this).parents("ul").parent("li").addClass("open")
		});
		c.find("li a").click(function() {
			if ($(this).parent().find("ul").size() !== 0) {
				if (b.accordion) {
					if (!$(this).parent().find("ul").is(":visible")) {
						parents = $(this).parent().parents("ul");
						visible = c.find("ul:visible");
						visible.each(function(e) {
							var f = true;
							parents.each(function(g) {
								if (parents[g] == visible[e]) {
									f = false;
									return false
								}
							});
							if (f) {
								if ($(this).parent().find("ul") != visible[e]) {
									$(visible[e]).slideUp(b.speed, function() {
										$(this).parent("li").find("b:first").html(b.closedSign);
										$(this).parent("li").removeClass("open")
									})
								}
							}
						})
					}
				}
				if ($(this).parent().find("ul:first").is(":visible") && !$(this).parent().find("ul:first").hasClass("active")) {
					$(this).parent().find("ul:first").slideUp(b.speed, function() {
						$(this).parent("li").removeClass("open");
						$(this).parent("li").find("b:first").delay(b.speed).html(b.closedSign)
					})
				} else {
					$(this).parent().find("ul:first").slideDown(b.speed, function() {
						$(this).parent("li").addClass("open");
						$(this).parent("li").find("b:first").delay(b.speed).html(b.openedSign)
					})
				}
			}
		})
	}
});
jQuery.fn.doesExist = function() {
	return jQuery(this).length > 0
};

function runAllForms() {
	if ($.fn.slider) {
		$(".slider").slider()
	}
	if ($.fn.select2) {
		$(".select2").each(function() {
			var b = $(this);
			var a = b.attr("data-select-width") || "100%";
			b.select2({
				allowClear: true,
				width: a
			})
		})
	}
	if ($.fn.mask) {
		$("[data-mask]").each(function() {
			var c = $(this);
			var a = c.attr("data-mask") || "error...",
				b = c.attr("data-mask-placeholder") || "X";
			c.mask(a, {
				placeholder: b
			})
		})
	}
	if ($.fn.autocomplete) {
		$("[data-autocomplete]").each(function() {
			var b = $(this);
			var a = b.data("autocomplete") || ["The", "Quick", "Brown", "Fox", "Jumps", "Over", "Three", "Lazy", "Dogs"];
			b.autocomplete({
				source: a
			})
		})
	}
	if ($.fn.datepicker) {
		$(".datepicker").each(function() {
			var b = $(this);
			var a = b.attr("data-dateformat") || "dd.mm.yy";
			b.datepicker({
				dateFormat: a,
				prevText: '<i class="fa fa-chevron-left"></i>',
				nextText: '<i class="fa fa-chevron-right"></i>'
			})
		})
	}
}

function runAllCharts() {
	if ($.fn.sparkline) {
		var D, y, ar, t, E, al, h, Q, U, an, J, W, ak, k, Z, o, x, N, R, aa, P, j, a, f, r, av, am, ae, ao, H, M, F, p, I, b, i, O, g, G, l, T, n, c, aj, w, K, V, S, au, C, m, L, z, ag, v, at, e, d, u, s, af, ac, Y, X, aq, ai, ap, ah, ad, q, ab, B, A;
		$(".sparkline").each(function() {
			var ax = $(this);
			var aw = ax.data("sparkline-type") || "bar";
			if (aw == "bar") {
				D = ax.data("sparkline-bar-color") || ax.css("color") || "#0000f0";
				y = ax.data("sparkline-height") || "26px";
				ar = ax.data("sparkline-barwidth") || 5;
				t = ax.data("sparkline-barspacing") || 2;
				E = ax.data("sparkline-negbar-color") || "#A90329";
				al = ax.data("sparkline-barstacked-color") || ["#A90329", "#0099c6", "#98AA56", "#da532c", "#4490B1", "#6E9461", "#990099", "#B4CAD3"];
				ax.sparkline("html", {
					barColor: D,
					type: aw,
					height: y,
					barWidth: ar,
					barSpacing: t,
					stackedBarColor: al,
					negBarColor: E,
					zeroAxis: "false"
				})
			}
			if (aw == "line") {
				y = ax.data("sparkline-height") || "20px";
				v = ax.data("sparkline-width") || "90px";
				h = ax.data("sparkline-line-color") || ax.css("color") || "#0000f0";
				Q = ax.data("sparkline-line-width") || 1;
				U = ax.data("fill-color") || "#c0d0f0";
				an = ax.data("sparkline-spot-color") || "#f08000";
				J = ax.data("sparkline-minspot-color") || "#ed1c24";
				W = ax.data("sparkline-maxspot-color") || "#f08000";
				ak = ax.data("sparkline-highlightspot-color") || "#50f050";
				k = ax.data("sparkline-highlightline-color") || "f02020";
				Z = ax.data("sparkline-spotradius") || 1.5;
				thisChartMinYRange = ax.data("sparkline-min-y") || "undefined";
				thisChartMaxYRange = ax.data("sparkline-max-y") || "undefined";
				thisChartMinXRange = ax.data("sparkline-min-x") || "undefined";
				thisChartMaxXRange = ax.data("sparkline-max-x") || "undefined";
				thisMinNormValue = ax.data("min-val") || "undefined";
				thisMaxNormValue = ax.data("max-val") || "undefined";
				thisNormColor = ax.data("norm-color") || "#c0c0c0";
				thisDrawNormalOnTop = ax.data("draw-normal") || false;
				ax.sparkline("html", {
					type: "line",
					width: v,
					height: y,
					lineWidth: Q,
					lineColor: h,
					fillColor: U,
					spotColor: an,
					minSpotColor: J,
					maxSpotColor: W,
					highlightSpotColor: ak,
					highlightLineColor: k,
					spotRadius: Z,
					chartRangeMin: thisChartMinYRange,
					chartRangeMax: thisChartMaxYRange,
					chartRangeMinX: thisChartMinXRange,
					chartRangeMaxX: thisChartMaxXRange,
					normalRangeMin: thisMinNormValue,
					normalRangeMax: thisMaxNormValue,
					normalRangeColor: thisNormColor,
					drawNormalOnTop: thisDrawNormalOnTop
				})
			}
			if (aw == "pie") {
				o = ax.data("sparkline-piecolor") || ["#B4CAD3", "#4490B1", "#98AA56", "#da532c", "#6E9461", "#0099c6", "#990099", "#717D8A"];
				x = ax.data("sparkline-piesize") || 90;
				N = ax.data("border-color") || "#45494C";
				R = ax.data("sparkline-offset") || 0;
				ax.sparkline("html", {
					type: "pie",
					width: x,
					height: x,
					tooltipFormat: '<span style="color: {{color}}">&#9679;</span> ({{percent.1}}%)',
					sliceColors: o,
					borderWidth: 1,
					offset: R,
					borderColor: N
				})
			}
			if (aw == "box") {
				aa = ax.data("sparkline-width") || "auto";
				P = ax.data("sparkline-height") || "auto";
				j = ax.data("sparkline-boxraw") || false;
				a = ax.data("sparkline-targetval") || "undefined";
				f = ax.data("sparkline-min") || "undefined";
				r = ax.data("sparkline-max") || "undefined";
				av = ax.data("sparkline-showoutlier") || true;
				am = ax.data("sparkline-outlier-iqr") || 1.5;
				ae = ax.data("sparkline-spotradius") || 1.5;
				ao = ax.css("color") || "#000000";
				H = ax.data("fill-color") || "#c0d0f0";
				M = ax.data("sparkline-whis-color") || "#000000";
				F = ax.data("sparkline-outline-color") || "#303030";
				p = ax.data("sparkline-outlinefill-color") || "#f0f0f0";
				I = ax.data("sparkline-outlinemedian-color") || "#f00000";
				b = ax.data("sparkline-outlinetarget-color") || "#40a020";
				ax.sparkline("html", {
					type: "box",
					width: aa,
					height: P,
					raw: j,
					target: a,
					minValue: f,
					maxValue: r,
					showOutliers: av,
					outlierIQR: am,
					spotRadius: ae,
					boxLineColor: ao,
					boxFillColor: H,
					whiskerColor: M,
					outlierLineColor: F,
					outlierFillColor: p,
					medianColor: I,
					targetColor: b
				})
			}
			if (aw == "bullet") {
				var ay = ax.data("sparkline-height") || "auto";
				O = ax.data("sparkline-width") || 2;
				g = ax.data("sparkline-bullet-color") || "#ed1c24";
				G = ax.data("sparkline-performance-color") || "#3030f0";
				l = ax.data("sparkline-bulletrange-color") || ["#d3dafe", "#a8b6ff", "#7f94ff"];
				ax.sparkline("html", {
					type: "bullet",
					height: ay,
					targetWidth: O,
					targetColor: g,
					performanceColor: G,
					rangeColors: l
				})
			}
			if (aw == "discrete") {
				T = ax.data("sparkline-height") || 26;
				n = ax.data("sparkline-width") || 50;
				c = ax.css("color");
				aj = ax.data("sparkline-line-height") || 5;
				w = ax.data("sparkline-threshold") || "undefined";
				K = ax.data("sparkline-threshold-color") || "#ed1c24";
				ax.sparkline("html", {
					type: "discrete",
					width: n,
					height: T,
					lineColor: c,
					lineHeight: aj,
					thresholdValue: w,
					thresholdColor: K
				})
			}
			if (aw == "tristate") {
				V = ax.data("sparkline-height") || 26;
				S = ax.data("sparkline-posbar-color") || "#60f060";
				au = ax.data("sparkline-negbar-color") || "#f04040";
				C = ax.data("sparkline-zerobar-color") || "#909090";
				m = ax.data("sparkline-barwidth") || 5;
				L = ax.data("sparkline-barspacing") || 2;
				z = ax.data("sparkline-zeroaxis") || false;
				ax.sparkline("html", {
					type: "tristate",
					height: V,
					posBarColor: ag,
					negBarColor: au,
					zeroBarColor: C,
					barWidth: m,
					barSpacing: L,
					zeroAxis: z
				})
			}
			if (aw == "compositebar") {
				y = ax.data("sparkline-height") || "20px";
				v = ax.data("sparkline-width") || "100%";
				ar = ax.data("sparkline-barwidth") || 3;
				Q = ax.data("sparkline-line-width") || 1;
				h = ax.data("sparkline-color-top") || "#ed1c24";
				ag = ax.data("sparkline-color-bottom") || "#333333";
				ax.sparkline(ax.data("sparkline-bar-val"), {
					type: "bar",
					width: v,
					height: y,
					barColor: ag,
					barWidth: ar
				});
				ax.sparkline(ax.data("sparkline-line-val"), {
					width: v,
					height: y,
					lineColor: h,
					lineWidth: Q,
					composite: true,
					fillColor: false
				})
			}
			if (aw == "compositeline") {
				y = ax.data("sparkline-height") || "20px";
				v = ax.data("sparkline-width") || "90px";
				at = ax.data("sparkline-bar-val");
				e = ax.data("sparkline-bar-val-spots-top") || null;
				d = ax.data("sparkline-bar-val-spots-bottom") || null;
				u = ax.data("sparkline-line-width-top") || 1;
				s = ax.data("sparkline-line-width-bottom") || 1;
				af = ax.data("sparkline-color-top") || "#333333";
				ac = ax.data("sparkline-color-bottom") || "#ed1c24";
				Y = ax.data("sparkline-spotradius-top") || 1.5;
				X = ax.data("sparkline-spotradius-bottom") || Y;
				an = ax.data("sparkline-spot-color") || "#f08000";
				aq = ax.data("sparkline-minspot-color-top") || "#ed1c24";
				ai = ax.data("sparkline-maxspot-color-top") || "#f08000";
				ap = ax.data("sparkline-minspot-color-bottom") || aq;
				ah = ax.data("sparkline-maxspot-color-bottom") || ai;
				ad = ax.data("sparkline-highlightspot-color-top") || "#50f050";
				q = ax.data("sparkline-highlightline-color-top") || "#f02020";
				ab = ax.data("sparkline-highlightspot-color-bottom") || ad;
				thisHighlightLineColor2 = ax.data("sparkline-highlightline-color-bottom") || q;
				B = ax.data("sparkline-fillcolor-top") || "transparent";
				A = ax.data("sparkline-fillcolor-bottom") || "transparent";
				ax.sparkline(at, {
					type: "line",
					spotRadius: Y,
					spotColor: an,
					minSpotColor: aq,
					maxSpotColor: ai,
					highlightSpotColor: ad,
					highlightLineColor: q,
					valueSpots: e,
					lineWidth: u,
					width: v,
					height: y,
					lineColor: af,
					fillColor: B
				});
				ax.sparkline(ax.data("sparkline-line-val"), {
					type: "line",
					spotRadius: X,
					spotColor: an,
					minSpotColor: ap,
					maxSpotColor: ah,
					highlightSpotColor: ab,
					highlightLineColor: thisHighlightLineColor2,
					valueSpots: d,
					lineWidth: s,
					width: v,
					height: y,
					lineColor: ac,
					composite: true,
					fillColor: A
				})
			}
		})
	}
	if ($.fn.easyPieChart) {
		$(".easy-pie-chart").each(function() {
			var ay = $(this);
			var aw = ay.css("color") || ay.data("pie-color"),
				az = ay.data("pie-track-color") || "#eeeeee",
				ax = parseInt(ay.data("pie-size")) || 25;
			ay.easyPieChart({
				barColor: aw,
				trackColor: az,
				scaleColor: false,
				lineCap: "butt",
				lineWidth: parseInt(ax / 8.5),
				animate: 1500,
				rotate: -90,
				size: ax,
				onStep: function(aA) {
					this.$el.find("span").text(~~aA)
				}
			})
		})
	}
}

function setup_widgets_desktop() {
	if ($.fn.jarvisWidgets && $.enableJarvisWidgets) {
		$("#widget-grid").jarvisWidgets({
			grid: "article",
			widgets: ".jarviswidget",
			localStorage: true,
			deleteSettingsKey: "#deletesettingskey-options",
			settingsKeyLabel: "Reset settings?",
			deletePositionKey: "#deletepositionkey-options",
			positionKeyLabel: "Reset position?",
			sortable: true,
			buttonsHidden: false,
			toggleButton: true,
			toggleClass: "fa fa-minus | fa fa-plus",
			toggleSpeed: 200,
			onToggle: function() {},
			deleteButton: true,
			deleteClass: "fa fa-times",
			deleteSpeed: 200,
			onDelete: function() {},
			editButton: true,
			editPlaceholder: ".jarviswidget-editbox",
			editClass: "fa fa-cog | fa fa-save",
			editSpeed: 200,
			onEdit: function() {},
			colorButton: true,
			fullscreenButton: true,
			fullscreenClass: "fa fa-expand | fa fa-compress",
			fullscreenDiff: 3,
			onFullscreen: function() {},
			customButton: false,
			customClass: "folder-10 | next-10",
			customStart: function() {
				alert("Hello you, this is a custom button...")
			},
			customEnd: function() {
				alert("bye, till next time...")
			},
			buttonOrder: "%refresh% %custom% %edit% %toggle% %fullscreen% %delete%",
			opacity: 1,
			dragHandle: "> header",
			placeholderClass: "jarviswidget-placeholder",
			indicator: true,
			indicatorTime: 600,
			ajax: true,
			timestampPlaceholder: ".jarviswidget-timestamp",
			timestampFormat: "Last update: %m%/%d%/%y% %h%:%i%:%s%",
			refreshButton: true,
			refreshButtonClass: "fa fa-refresh",
			labelError: "Sorry but there was a error:",
			labelUpdated: "Last Update:",
			labelRefresh: "Refresh",
			labelDelete: "Delete widget:",
			afterLoad: function() {},
			rtl: false,
			onChange: function() {},
			onSave: function() {},
			ajaxnav: $.navAsAjax
		})
	}
}

function setup_widgets_mobile() {
	if ($.enableMobileWidgets && $.enableJarvisWidgets) {
		setup_widgets_desktop()
	}
}
if ($.navAsAjax || $(".google_maps")) {
	var gMapsLoaded = false;
	window.gMapsCallback = function() {
		gMapsLoaded = true;
		$(window).trigger("gMapsLoaded")
	};
	window.loadGoogleMaps = function() {
		if (gMapsLoaded) {
			return window.gMapsCallback()
		}
		var a = document.createElement("script");
		a.setAttribute("type", "text/javascript");
		a.setAttribute("src", "http://maps.google.com/maps/api/js?sensor=false&callback=gMapsCallback");
		(document.getElementsByTagName("head")[0] || document.documentElement).appendChild(a)
	}
}
var jsArray = {};

function loadScript(c, d) {
	if (!jsArray[c]) {
		jsArray[c] = true;
		var a = document.getElementsByTagName("body")[0];
		var b = document.createElement("script");
		b.type = "text/javascript";
		b.src = c;
		b.onload = d;
		a.appendChild(b)
	} else {
		if (d) {
			d()
		}
	}
}

function loadURL(b, a) {
	$.ajax({
		type: "GET",
		url: b,
		dataType: "html",
		cache: true,
		beforeSend: function() {
			if ($.navAsAjax && $(".google_maps")[0] && (a[0] == $("#content")[0])) {
				var e = $(".google_maps"),
					d = 0;
				e.each(function() {
					d++;
					var f = document.getElementById(this.id);
					if (d == e.length + 1) {} else {
						if (f) {
							f.parentNode.removeChild(f)
						}
					}
				})
			}
			if ($.navAsAjax && $(".dataTables_wrapper")[0] && (a[0] == $("#content")[0])) {
				var c = $.fn.dataTable.fnTables(true);
				$(c).each(function() {
					$(this).dataTable().fnDestroy()
				})
			}
			if ($.navAsAjax && $.intervalArr.length > 0 && (a[0] == $("#content")[0])) {
				while ($.intervalArr.length > 0) {
					clearInterval($.intervalArr.pop())
				}
			}
			a.html('<h1 class="ajax-loading-animation"><i class="fa fa-cog fa-spin"></i> Loading...</h1>');
			if (a[0] == $("#content")[0]) {
				drawBreadCrumb();
				$("html").animate({
					scrollTop: 0
				}, "fast")
			}
		},
		success: function(c) {
			a.css({
				opacity: "0.0"
			}).html(c).delay(50).animate({
				opacity: "1.0"
			}, 300)
		},
		error: function(e, c, d) {
			a.html('<h4 class="ajax-loading-error"><i class="fa fa-warning txt-color-orangeDark"></i> Error 404! Page not found.</h4>')
		},
		async: true
	})
}

function pageSetUp() {
	if ($.device === "desktop") {
		$("[rel=tooltip]").tooltip();
		$("[rel=popover]").popover();
		$("[rel=popover-hover]").popover({
			trigger: "hover"
		});
		setup_widgets_desktop();
		runAllCharts();
		runAllForms()
	} else {
		$("[rel=popover]").popover();
		$("[rel=popover-hover]").popover({
			trigger: "hover"
		});
		runAllCharts();
		setup_widgets_mobile();
		runAllForms()
	}
}
$("body").on("click", function(a) {
	$('[rel="popover"]').each(function() {
		if (!$(this).is(a.target) && $(this).has(a.target).length === 0 && $(".popover").has(a.target).length === 0) {
			$(this).popover("hide")
		}
	})
});
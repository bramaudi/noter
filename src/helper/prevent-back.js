/**
 * Prevent & replace move backward with custom function
 * @param {Function} fn 
 */
const preventBack = (fn = null) => {
	(function (global) {

		if(typeof (global) === "undefined") {
				throw new Error("window is undefined");
		}

		var _hash = "!";
		var noBackPlease = function () {
				global.location.href += "#";

				// Making sure we have the fruit available for juice (^__^)
				global.setTimeout(function () {
						global.location.href += "!";
				}, 50);
		};

		global.onhashchange = function () {
				if (global.location.hash !== _hash) {
						global.location.hash = _hash;
						if (typeof fn === 'function') fn()
				}
		};

		global.history.pushState(null, null, global.top.location.pathname + global.top.location.search);
		global.onpopstate = function (e) {
			e.preventDefault();
			if (typeof fn === 'function') fn()
			global.history.pushState(null, null, global.top.location.pathname + global.top.location.search);
		}

		global.onload = function () {
				noBackPlease();

				// Disables backspace on page except on input fields and textarea..
				document.body.onkeydown = function (e) {
					var elm = e.target.nodeName.toLowerCase();
					if (e.key == 'Backspace' && (elm !== 'input' && elm  !== 'textarea')) {
						e.preventDefault();
					}
					// Stopping the event bubbling up the DOM tree...
					e.stopPropagation();
				};
		}
	})(window);
}

export default preventBack
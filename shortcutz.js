var shortcutz = shortcutz || {};

shortcutz = (function() {

	var _registered = {},
	_current = 1000,
	_buffer = {},
	_dictionary = {
		'backspace' : 8,
		'tab' : 9,
		'enter' : 13,
		'shift' : 16,
		'ctrl' : 17,
		'alt' : 18,
		'pause_break' : 19,
		'caps_lock' : 20,
		'escape' : 27,
		'page_up' : 33,
		'page down' : 34,
		'end' : 35,
		'home' : 36,
		'left' : 37,
		'up' : 38,
		'right' : 39,
		'down' : 40,
		'insert' : 45,
		'delete' : 46,
		'0' : 48,
		'1' : 49,
		'2' : 50,
		'3' : 51,
		'4' : 52,
		'5' : 53,
		'6' : 54,
		'7' : 55,
		'8' : 56,
		'9' : 57,
		'a' : 65,
		'b' : 66,
		'c' : 67,
		'd' : 68,
		'e' : 69,
		'f' : 70,
		'g' : 71,
		'h' : 72,
		'i' : 73,
		'j' : 74,
		'k' : 75,
		'l' : 76,
		'm' : 77,
		'n' : 78,
		'o' : 79,
		'p' : 80,
		'q' : 81,
		'r' : 82,
		's' : 83,
		't' : 84,
		'u' : 85,
		'v' : 86,
		'w' : 87,
		'x' : 88,
		'y' : 89,
		'z' : 90,
		'left_window' : 91,
		'right_window' : 92,
		'select_key' : 93,
		'numpad_0' : 96,
		'numpad_1' : 97,
		'numpad_2' : 98,
		'numpad_3' : 99,
		'numpad_4' : 100,
		'numpad_5' : 101,
		'numpad_6' : 102,
		'numpad_7' : 103,
		'numpad_8' : 104,
		'numpad_9' : 105,
		'multiply' : 106,
		'add' : 107,
		'subtract' : 109,
		'decimal' : 110,
		'divide' : 111,
		'f1' : 112,
		'f2' : 113,
		'f3' : 114,
		'f4' : 115,
		'f5' : 116,
		'f6' : 117,
		'f7' : 118,
		'f8' : 119,
		'f9' : 120,
		'f10' : 121,
		'f11' : 122,
		'f12' : 123,
		'num_lock' : 144,
		'scroll_lock' : 145,
		'semi_colon' : 186,
		'equal_sign' : 187,
		'comma' : 188,
		'dash' : 189,
		'period' : 190,
		'forward_slash' : 191,
		'grave_accent' : 192,
		'open_bracket' : 219,
		'backslash' : 220,
		'close_bracket' : 221,
		'single_quote' : 222
	};

	_buffer.keys = [];
	_buffer.fired = false;

	function register(shortcut, cb, ele) {
		ele = ele || document;
		var keycodes = _getShortcut(shortcut);
		if (!Array.isArray(keycodes)) {
			return false;
		}
		keycodes.sort();
		_current++;
		var cid = 'c' + _current;
		ele.addEventListener('keydown', _keypress);
		ele.addEventListener('keyup', _keypress);
		_registered[cid] = {keys: keycodes, target: ele, cb:cb};	
		return cid;
	}

	function unregister(cid) {
		if (_registered[cid]) {
			delete _registered[cid];
			return true;
		}
		return false;
	}

	function _keypress(e) {
		var keyIndex = _buffer.keys.indexOf(e.keyCode),
		target = e.currentTarget,
		type = e.type;
		if (type === 'keydown' && keyIndex === -1) {
			_buffer.keys.push(e.keyCode);
			_trigger(_buffer, target);
		} else if (type === 'keyup' && keyIndex !== -1) {
			_buffer.keys.splice(keyIndex,1);
			_buffer.fired = false;
		}
		return false;
	}
	
	function _trigger(buffer, target) {
		for (shortcut in _registered) {
			
			if ((_registered[shortcut].keys.join(',')) === (buffer.keys.join(',')) && _registered[shortcut].target === target) {
				_registered[shortcut].cb();
				_buffer.fired = true;
			}
		}
	}

	function _getShortcut(shortcut) {
		var keycodes = shortcut.split('+'),
		len = keycodes.length,
		temp = [];
		for (var i = 0; i < len; i++) {
			//Check if key is in dictionary
			var index = _dictionary[keycodes[i]];
			if (!index) {
				return false;
			} else {
				temp.push(_dictionary[keycodes[i]]);
			}
		}
		return temp;
	}

	return {
		register: register,
		unregister: unregister
	}
}());
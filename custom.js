$(document).ready(function() {
	$("form").eq(0).validate({
		rules: {email: {required: true, email: true},
	            emailConfirm: {required: true, equalTo: "#email"},
	            country: {minlength: 3},
	            zip: {digits: true, minlength: 6},
	            pass: {required: true, minlength: 6},
	            passConfirm: {required: true, equalTo: "#pass"}}
	});
});

/* plugin -------------------------------------------------*/

$.extend($.fn, {
	validate: function(options) {
		var that = this;
		$(this).attr("novalidate", "novalidate");
		$(this).find("input").on("change", 
			                     {formVal: that, options: options}, 
			                     function(event) {
			                     	var inputNumber = $(that).find("input")
			                     		.index(this);
			                     	validateField(event.data.formVal,
			                     				  inputNumber,
			                     		          event.data.options);
			                     });
		$(this).on("submit", 
			       {formVal: that, options: options}, 
			       function(event) {
						event.preventDefault();
						if (validation(event)) {
							$(".wrapper").hide();
					 		$(".alert").show();
					}
		});
	}
});

function validation(event) {
	var th = event.data.formVal;
	var options = event.data.options;
	var len = $(th).find("input").length;
	var result = true;

	for (var i = 0; i < len; i++) {
		if (!validateField(th, i, options))
			result = false;
	}
	return result;
}

function validateField(th, i, options) {
	var elem, name, val, rules, method, param, errMsg, resultInput;
	var methods = {required: checkRequired, 
				   email: checkEmail,
				   equalTo: equalTo,
				   minlength: minlength,
				   digits: digits};
	var messages = {required: "This field is required.",
                    email: "Enter a valid email address.",
                    equalTo: "Enter the same value again.",
                    minlength: "Enter at least ",
                    digits: "Enter digits."};

	elem = $(th).find("input").eq(i);
	val = elem.val();
	name = elem.attr("name");
	resultInput = true;

	if (name in options.rules) {
		rules = options.rules[name];
		for (var rule in rules) {
			method = methods[rule];
			param = rules[rule];
			if (method(param, val)) {
				if (resultInput) {
					elem.removeClass("error");
					elem.parent().find(".err-msg").remove();
					elem.addClass("valid");
				}
			} else {
				elem.removeClass("valid");
				elem.addClass("error");
				elem.parent().find(".err-msg").remove();
				errMsg = "<div class='error err-msg'>";
				errMsg += messages[rule];
				if (rule == "minlength")
					errMsg += param + " characters.";
				errMsg += "</div>";
				elem.after(errMsg);
				resultInput = false;
			}
		}
	}

	return resultInput;
}

/* checks ------------------------------------------------*/

function checkRequired(param, val) {
	if (param === true) {
		if (val)
			return true;
		else
			return false;
	}
}

function checkEmail(param, val) {
	var pattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
	if (param === true) {
		if (pattern.test(val))
			return true;
		else
			return false;
	}
}

function digits(param, val) {
	var pattern = /^[0-9]*$/;
	if (param === true) {
		if (pattern.test(val))
			return true;
		else
			return false;
	}
}

function equalTo(param, val) {
	var anotherVal = $(param).val();
	if (val == anotherVal)
		return true;
	else
		return false;
}

function minlength(param, val) {
	var valLength = val.length;
	if (valLength >= param || valLength == 0)
		return true;
	else
		return false;
}
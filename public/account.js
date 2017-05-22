var isToggled = false;
function toggle() {
	console.log(isToggled)
	if (isToggled)
	{
		isToggled = false;
		document.getElementById("sidebar").style.right = "-100%";
	}
	else
	{
		isToggled = true;
		document.getElementById("sidebar").style.right = "0";
	}
}
function advance() {
	$('#account').toggle(600);
	$('#background').toggle(600);
}
$(document).ready(function() {
	var username = '';
	var password = '';
	$('#advance').on('click', function(event) {
		username = $('#username').val()
		password = $('#password').val()
		advance();
	});
	$('#bginfo').submit(function(e){
		e.preventDefault();
		var age = $('#age').prop('value');
		var language = $('#language').prop('value');
		var religion = $('#religion').prop('value');
		var gender = $('#gender').prop('value');
		var orientation = $('#orientation').prop('value');
		var ethnicity = '';
		$('#ethnicity').find('input').each(function(index, el) {
			if($(el).prop('checked'))
				ethnicity += $(el).prop('value') + ', ';
		});
		ethnicity.slice(ethnicity.length -2);
		var twitter = $('#twitter').prop('value');
		if(twitter.substring(0, 1) !== "@")
		{
			twitter = "@" +twitter;
		}

	})
});
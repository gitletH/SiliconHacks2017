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
	var language = '';
	var ethnicity = '';
	var religion = '';
  	var gender = '';
	var orientation = '';
  	var age = 0;
  	var twitter = '';
	$('#advance').on('click', function(event) {
		username = $('#username').val()
		password = $('#password').val()
		advance();
	});
	$('#bginfo').submit(function(e){
		e.preventDefault();
		age = $('#age').val();
		language = $('#language').val();
		religion = $('#religion').val();
		gender = $('#gender').val();
		orientation = $('#orientation').val();
		$('#ethnicity').find('input').each(function(index, el) {
			if(el.prop('checked'))
				ethnicity += el.attr('value') + ', ';
		});
		ethnicity.slice(ethnicity.length -2);
		twitter = $('#twitter').val().;
	})
});
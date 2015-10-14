
var $storage_manager;
var $quota_exceeded_window;
var ignoring_quota_exceeded = false;

function storage_quota_exceeded(){
	if($quota_exceeded_window){
		$quota_exceeded_window.close();
		$quota_exceeded_window = null;
	}
	if(ignoring_quota_exceeded){
		return;
	}
	var $w = $FormWindow().title("Storage Error").addClass("jspaint-dialogue-window");
	$w.$main.html(
		"<p>JS Paint stores images as you work on them so that if you " +
		"close your browser or tab or reload the page " +
		"your images are usually safe.</p>" +
		"<p>However, it has run out of space to do so.</p>" +
		"<p>You can still save the current image with <b>File > Save</b>. " +
		"You should save frequently, or free up enough space to keep the image safe.</p>"
	);
	$w.$Button("View and manage storage", function(){
		$w.close();
		ignoring_quota_exceeded = false;
		manage_storage();
	});
	$w.$Button("Ignore", function(){
		$w.close();
		ignoring_quota_exceeded = true;
	});
	$w.width(500);
	$w.center();
	$quota_exceeded_window = $w;
}

function manage_storage(){
	if($storage_manager){
		$storage_manager.close();
	}
	$storage_manager = $Window().title("Manage Storage");
	$storage_manager.$content.html(
		"<p>Any images you've saved to your computer with <b>File > Save</b> will not be affected.</p>"
	);
	$table = $(E("table")).appendTo($storage_manager.$content);
	
	var addRowFor = function(k, imgSrc){
		$tr = $(E("tr")).appendTo($table);
		
		$img = $(E("img")).attr({src: imgSrc});
		$img.css({maxWidth: "50px", maxHeight: "50px"});
		$remove = $(E("button")).addClass("jspaint-button jspaint-dialogue-button").text("Remove");
		
		$(E("td")).text(k).appendTo($tr);
		$(E("td")).append($img).appendTo($tr);
		$(E("td")).append($remove).appendTo($tr);
		
		$remove.click(function(){
			localStorage.removeItem(k);
			$tr.remove();
		});
	};
	
	for(k in localStorage){
		if(k.match(/^image#/)){
			var v = localStorage[k];
			addRowFor(k, v[0] === '"' ? JSON.parse(v) : v);
		}
	}
	$storage_manager.width(500);
	$storage_manager.center();
}

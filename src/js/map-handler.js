var exports = module.exports = {};

import * as all_events_2017 from './2017/data.js'
import * as all_events_2016 from './2016/data.js'

var all_events;


var map, buttons;
var holder, title, time, place, description, banner, header;
var current_id;

var zoomer, canvas;

var first_floor, ground_floor;
var current_floor = 0;

function isMobile(){
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
    return true;
	}else{
		return false;
	}
}

var mobile_h = 800;
var mobile_w = 975;

exports.init = function(){
	if(YEAR != undefined)
		initMap();
}

function initMap(){
	//load data
	if(YEAR == 2017)
		all_events = all_events_2017;
	else
		all_events = all_events_2016;

	  canvas = document.getElementById('myCanvas');
		banner = document.getElementById('banner');
		header = document.getElementById('header');
		// Create an empty project and a view for the canvas:
		paper.setup(canvas);

	  $('#first_floor').on('click', switchMap);
	  $('#ground_floor').on('click', switchMap);

	  holder = document.getElementById('info');
	  title = document.getElementById('title');
	  time = document.getElementById('time');
	  place = document.getElementById('place');
	  description = document.getElementById('description');

	  paper.project.importSVG("../dist/svg/2017/ground_floor.svg", function(item, origin){
	    ground_floor = item;
	    buttons = ground_floor.children.Buttons.children;

	    if(!isMobile()){
	      paper.project.view.zoom = 0.75;
	      canvas.style.top = '-8%';
	      canvas.style.left = '-10%';
	      ground_floor.bounds.width = window.innerWidth*0.8;
	      ground_floor.bounds.height = window.innerHeight;``
	    }else{
	      ground_floor.bounds.width = mobile_w;
	      ground_floor.bounds.height = mobile_h;
	    }



	    for(var i = 0; i < buttons.length; i++){
	      buttons[i].onMouseDown =  handleButton;
	    }

	    ground_floor.visible = true;
	  });

	  paper.project.importSVG("../dist/svg/2017/first_floor.svg", function(item, origin){
	    first_floor = item;
	    buttons = first_floor.children.Buttons.children;

	    if(!isMobile()){
	      first_floor.bounds.width = window.innerWidth*0.8;
	      first_floor.bounds.height = window.innerHeight;
	    }else{
	      canvas.style.top = '4%';
	      canvas.style.left = '2%';
	      canvas.style.width = '98%';
	      first_floor.bounds.width = mobile_w;
	      first_floor.bounds.height = mobile_h;
	    }

	    for(var i = 0; i < buttons.length; i++){
	      buttons[i].onMouseDown =  handleButton;
	    }

	    first_floor.visible = false;
	  });

	  // Set initial position.
	  canvas.style.position = 'absolute'; // 'absolute' also works.
	  // canvas.addEventListener('touchstart', dragStart);
	  // canvas.addEventListener('touchmove',  dragMove);
}

function switchMap(){
  canvas.style.opacity = 0;
  toggleFloorText();
  setTimeout(toggleVisibility, 500);
  setTimeout(function(){canvas.style.opacity = 1;}, 525);
}

function toggleFloorText(){
  if(current_floor == 0){
    $('#ground_floor').css('opacity', 0.3);
    $('#first_floor').css('opacity', 1);
  }else{
    $('#ground_floor').css('opacity', 1);
    $('#first_floor').css('opacity', 0.3);
  }
}

//TODO clean this up :(
function handleButton (event){
	var clicked_id = event.target.name.replace('_x3', '');
	clicked_id = clicked_id.replace('_', '');
	if(clicked_id.length > 2 && clicked_id.indexOf('_') > -1)
		clicked_id = clicked_id.substring(0, clicked_id.length-2);

	clicked_id = clicked_id.replace('_', '');

	if(clicked_id == current_id)
		return;

  loadData(clicked_id);
}

function loadData(clicked_id){
  for(var i = 0; i < all_events.data.length; i++){
    if(all_events.data[i].number == clicked_id){
			current_id = clicked_id;
			populate(all_events.data[i]);
			return;
		}
  }

}

function populate(info){

  if(holder.style.opacity != 1){
    holder.style.display = "block";
    holder.style.opacity = 1;
  }

  var c = ('rgb('+info.color.r+','+info.color.g+','+info.color.b+');').toString();

  banner.setAttribute('style', 'background-color: '+c+';')
	header.innerText = info.program;

  hideContent();

  setTimeout(function(){
    holder.setAttribute('style', 'color: '+c+'; border-color:'+c);
    var hr = document.getElementsByTagName('hr');
    for(var i = 0; i < hr.length; i++){
      hr[i].setAttribute('style', 'background-color: '+c);
      hr[i].style.opacity = 0;
    }

    title.innerHTML = info.title;
    time.innerHTML = info.timing;
    place.innerHTML = info.location;
    description.innerHTML = info.description;
  }, 500);

  setTimeout(showContent, 500);
}

function showContent(){
  var hr = document.getElementsByTagName('hr');
  for(var i = 0; i < hr.length; i++){
    hr[i].style.opacity = 1;
  }

  title.style.opacity = 1;
  time.style.opacity = 1;
  place.style.opacity = 1;
  description.style.opacity = 1;
}

function hideContent(){
  var hr = document.getElementsByTagName('hr');
  for(var i = 0; i < hr.length; i++){
    hr[i].style.opacity = 0;
  }

  title.style.opacity = 0;
  time.style.opacity = 0;
  place.style.opacity = 0;
  description.style.opacity = 0;
}

function toggleVisibility(){
  if(current_floor == 0){
    ground_floor.visible = false;
    first_floor.visible = true;
    current_floor = 1;
  }else{
    first_floor.visible = false;
    ground_floor.visible = true;
    current_floor = 0;
  }
}

var targetStartX, targetStartY, touchStartX, touchStartY;
function dragStart(e) {
  targetStartX = parseInt(e.target.style.left);
  targetStartY = parseInt(e.target.style.top);
  touchStartX  = e.touches[0].pageX;
  touchStartY  = e.touches[0].pageY;
}

function dragMove(e) {
  // Calculate touch offsets
  var touchOffsetX = e.touches[0].pageX - touchStartX,
      touchOffsetY = e.touches[0].pageY - touchStartY;
  // Add touch offsets to original target coordinates,
  // then assign them to target element's styles.
  e.target.style.left = targetStartX + touchOffsetX + 'px';
  e.target.style.top  = targetStartY + touchOffsetY + 'px';
}

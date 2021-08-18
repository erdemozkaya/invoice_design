var MIN_DISTANCE = 5;
var guides = [];
var innerOffsetX, innerOffsetY;

var container_LEFT_POSITION = $("#draggable_container").offset().left,
container_RIGHT_POSITION = Number($("#draggable_container").offset().left)+Number($("#draggable_container").width()),
container_TOP_POSITION = $("#draggable_container").offset().top,
container_BOTTOM_POSITION = Number($("#draggable_container").offset().top)+Number($("#draggable_container").height());

$(".draggable").draggable({
    containment: "#draggable_container",
    scroll: false,

    start: function( event, ui ) {
        guides = $.map( $(".draggable,#draggable_container").not( this ), computeGuidesForElement );
        $.map( $(".resizable"), resizableAssign );
        innerOffsetX = event.originalEvent.offsetX;
        innerOffsetY = event.originalEvent.offsetY;
    }, 
    drag: function( event, ui ){
        var guideV, guideH, distV = MIN_DISTANCE+1, distH = MIN_DISTANCE+1, offsetV, offsetH;
        var chosenGuides = { top: { dist: MIN_DISTANCE+1 }, left: { dist: MIN_DISTANCE+1 } };
        var $t = $(this);
        var pos = { top: event.originalEvent.pageY - innerOffsetY, left: event.originalEvent.pageX - innerOffsetX };
        var w = $t.outerWidth() - 1;
        var h = $t.outerHeight() - 1;
        if(
            pos.top > container_TOP_POSITION && 
            pos.left > container_LEFT_POSITION && 
            /*right*/(Number(pos.left)+Number(w)) < container_RIGHT_POSITION &&
            /*bottom*/ (Number(pos.top)+Number(h)) < container_BOTTOM_POSITION){
            var elemGuides = computeGuidesForElement( null, pos, w, h );
            $.each( guides, function( i, guide ){
                $.each( elemGuides, function( i, elemGuide ){
                    if( guide.type == elemGuide.type ){
                        var prop = guide.type == "h"? "top" : "left";
                        var d = Math.abs( elemGuide[prop] - guide[prop] );
                        if( d < chosenGuides[prop].dist ){
                            chosenGuides[prop].dist = d;
                            chosenGuides[prop].offset = elemGuide[prop] - pos[prop];
                            chosenGuides[prop].guide = guide;
                        }
                    }
                });
            });
            
            if( chosenGuides.top.dist <= MIN_DISTANCE ){
                $( "#guide-h" ).css( "top", chosenGuides.top.guide.top ).show();
                ui.position.top = chosenGuides.top.guide.top - chosenGuides.top.offset;
            }
            else{
                $( "#guide-h" ).hide();
                ui.position.top = pos.top;
            }
            
            if( chosenGuides.left.dist <= MIN_DISTANCE ){
                $( "#guide-v" ).css( "left", chosenGuides.left.guide.left ).show();
                ui.position.left = chosenGuides.left.guide.left - chosenGuides.left.offset;
            }
            else{
                $( "#guide-v" ).hide();
                ui.position.left = pos.left;
            }
        }
    },
    stop: function( event, ui ){
        $( "#guide-v, #guide-h" ).hide();
    }
});


function computeGuidesForElement( elem, pos, w, h ){
    if( elem != null ){
        var $t = $(elem);
        pos = $t.offset();
        w = $t.outerWidth() - 1;
        h = $t.outerHeight() - 1;
    }
    
    return [
        { type: "h", left: pos.left, top: pos.top,_this:elem },
        { type: "h", left: pos.left, top: pos.top + h,_this:elem },
        { type: "v", left: pos.left, top: pos.top,_this:elem },
        { type: "v", left: pos.left + w, top: pos.top,_this:elem },
        { type: "h", left: pos.left, top: pos.top + h/2,_this:elem },
        { type: "v", left: pos.left + w/2, top: pos.top,_this:elem }
    ];
}

function resizableAssign(elem){
    $(elem).resizable({
        containment:"#draggable_container",
        grid: 20,
        // maxHeight: 250,
        // maxWidth: 350,
        minHeight: 10,
        minWidth: 50
    });
}


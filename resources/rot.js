const rot_max = 2;
const rot_lim_max = 1;


// apply rotation
const rots = document.querySelectorAll(".rot");
var last = 0;

rots.forEach((rot_node) => {
    var deg = 0;
    do {
       deg = ((Math.random() - 0.5) * (rot_max / 0.5))
    }
    while (Math.abs(deg - last) < (rot_max / 4))
    
    last = deg;

    var txt = "rotate(" + deg + "deg)";
    rot_node.style["transform"] = txt;
})

// apply limited rotation
const rot_lims = document.querySelectorAll(".rot_lim");
last = 0;

rot_lims.forEach((rot_node) => {
    var deg = 0;
    do {
       deg = ((Math.random() - 0.5) * (rot_lim_max / 0.5))
    }
    while (Math.abs(deg - last) < (rot_lim_max / 4))
    
    last = deg;

    var txt = "rotate(" + deg + "deg)";
    rot_node.style["transform"] = txt;
})



/// HIDDEN
const whoami = document.querySelector(".whoami");
if (whoami !== null) {
whoami.addEventListener('copy', (event) => {
    event.clipboardData.setData('text/plain', 'HALFMOON');
    event.preventDefault();
});
}

const girlfailure = document.querySelector(".girlfailure");
if (girlfailure !== null) {
girlfailure.addEventListener('click', (event) => {
    girlfailure.innerHTML = '<img src="./resources/girlfailure.png" alt="Our beloved girlfailure, Sue"></img><p>(Gardevoir)</p>'
    event.preventDefault();
});
}




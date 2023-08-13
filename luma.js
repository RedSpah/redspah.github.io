/// CONSTANTS
LUMA_MIN = 40;
LUMA_MAX = 120;

BLORB_SIZE_MIN = 15;
BLORB_SIZE_MAX = 30;

BG_TOP_MUL = 0.375;
BG_BOT_MUL = 0.225;
BLORB_MUL = 1.5;

TEXT_R_MUL = 0.1;
TEXT_G_MUL = 2;
TEXT_B_MUL = 0.35;

TEXT_EXTRA_LUMA = 35;

LUMA_CHANGE_SPEED = 6;

INITIAL_STATE = {
	luma: (LUMA_MAX + LUMA_MIN) / 2,
	blorb_position: 0,
	blorb_size: (BLORB_SIZE_MAX + BLORB_SIZE_MIN) / 2,
	shimmer_angle: 0,
	scanline_offset: 0,
}


/// SETTINGS
LOGGING = false;
FORCE_BRIGHT = false;
FORCE_DIM = false;


/// VARIABLES
trend = 0;
blorb_speed = 0.2;
blorb_delay = 0;

state = Object.assign({}, INITIAL_STATE);
state_prev = Object.assign({}, INITIAL_STATE);


/// FUNCTIONS
luma_generate_keyframe = function(state) {
	var topG = Math.floor(BG_TOP_MUL * state.luma);
	var botG = Math.floor(BG_BOT_MUL * state.luma);
	var blbG = Math.floor(BLORB_MUL * state.luma);

	return '{ \
		background-image: url("./static_line.png"), \
		linear-gradient(' + (state.shimmer_angle) + 'deg, rgba(0,' + topG + ',0,0.04), rgba(0,' + botG + ',0,0.04)), \
		linear-gradient(180deg, \
			rgba(0,' + topG + ',0, 0.0), \
			rgba(0,' + topG + ',0, 0.0) ' + (state.blorb_position - (state.blorb_size) - 2) + '%, \
			rgba(0,' + topG + ',0, 0.3) ' + (state.blorb_position - (state.blorb_size) + 1) + '%, \
			rgba(0,' + blbG + ',0, 0.3) ' + (state.blorb_position) + '%, \
			rgba(0,' + botG + ',0, 0.0) ' + (state.blorb_position) + '%, \
			rgba(0,' + botG + ',0, 0.0)), \
		linear-gradient(to bottom, rgb(0,' + topG + ',0), rgb(0,' + botG + ',0)); \
		background-position: '+ state.scanline_offset +'% ' + state.scanline_offset + '%; \
	}'
}


luma_generate_text_color = function(state) {
	var capped_luma = Math.min(state.luma + TEXT_EXTRA_LUMA, LUMA_MAX);
	var textR = Math.floor(capped_luma * TEXT_R_MUL);
	var textG = Math.floor(capped_luma * TEXT_G_MUL);
	var textB = Math.floor(capped_luma * TEXT_B_MUL);

	return 'rgb(' + textR + ',' + textG + ',' + textB + ');';
}


luma_process = function () {
	// STATE
	state = {
		luma: Math.min(Math.max(state_prev.luma + trend, LUMA_MIN), LUMA_MAX),
		blorb_position: state_prev.blorb_position + blorb_speed,
		blorb_size: Math.max(Math.min(state_prev.blorb_size + (Math.random() - 0.5), BLORB_SIZE_MAX), BLORB_SIZE_MIN),
		shimmer_angle: state_prev.shimmer_angle + (Math.random() - 0.5) * 70,
		scanline_offset: (Math.random() - 0.5) * 12,
	}


	// DEBUGGING
	if (LOGGING) {
		if (typeof timestamp_last === typeof undefined) {
			timestamp_last = Date.now();
		}

		timestamp = Date.now();
		console.log("Luma frame time " + (timestamp - timestamp_last) + "ms");
		timestamp_last = timestamp;
	}

	if (FORCE_BRIGHT) {
		state.luma = LUMA_MAX;
	}

	if (FORCE_DIM) {
		state.luma = LUMA_MIN;
	}


	// TREND
	trend *= 0.75;
	if (Math.abs(trend) < 0.2) {
		trend = (Math.random() - 0.5) * LUMA_CHANGE_SPEED;
	}
			
	if (state.luma <= LUMA_MIN) {trend = LUMA_CHANGE_SPEED * 0.5;}	
	if (state.luma >= LUMA_MAX) {trend = LUMA_CHANGE_SPEED * -0.5;}


	// BLORB LOOP
	if (state.blorb_position > 110 && blorb_delay <= 0) {
		blorb_delay = 40 + Math.floor(Math.random() * 70);
	} else if (blorb_delay == 1) {
		state.blorb_position = -10;
		blorb_delay = 0;
		blorb_speed = 0.1 + (Math.random() * 0.2)			
	} else {
		blorb_delay--;
	}


	// APPLY
	document.getElementById("styleinject").innerHTML = ' \
	<style> \
		@keyframes lumanimbg { from ' + luma_generate_keyframe(state_prev) + ' to ' + luma_generate_keyframe(state) + '} \
		@keyframes lumanimtext { from { color: ' + luma_generate_text_color(state) + '} to { color: ' + luma_generate_text_color(state) + '}} \
		::selection {color:#010; background: ' + luma_generate_text_color(state) + 'text-shadow: 0px 0px 3px #010;} \
	</style>';


	// SWAP
	state_prev = state;
}
	

/// INITIALIZE
setTimeout(()=>{ setInterval(luma_process, 40) }, 100);
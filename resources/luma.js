/// CONSTANTS
LUMA_MIN = 40;
LUMA_MAX = 120;

BLORB_SIZE_MIN = 15;
BLORB_SIZE_MAX = 30;

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

/// root element
var root = document.querySelector(':root');

/// FUNCTIONS
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
	root.style.setProperty('--state_prev_luma', state_prev.luma);
	root.style.setProperty('--state_prev_blorb_size', state_prev.blorb_size);
	root.style.setProperty('--state_prev_blorb_position', state_prev.blorb_position);
	root.style.setProperty('--state_prev_scanline_offset', state_prev.scanline_offset);
	root.style.setProperty('--state_prev_shimmer_angle', state_prev.shimmer_angle);

	root.style.setProperty('--state_cur_luma', state.luma);
	root.style.setProperty('--state_cur_blorb_size', state.blorb_size);
	root.style.setProperty('--state_cur_blorb_position', state.blorb_position);
	root.style.setProperty('--state_cur_scanline_offset', state.scanline_offset);
	root.style.setProperty('--state_cur_shimmer_angle', state.shimmer_angle);

	// SWAP
	state_prev = state;
}
	
setInterval(luma_process, 40);
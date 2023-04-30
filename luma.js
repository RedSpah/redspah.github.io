
		luma_min = 60;
		luma_max = 140;
		textRmul = 0.1;
		textGmul = 2;
		textBmul = 0.35;
		bgtopmul = 0.25;
		bgbotmul = 0.15;
		trend_pow = 6;
		trend_reset_cutoff = 0.2;
		text_extra = 25;

		luma = 100;
		trend = 0;
		tick = 0;

		Yoffset_old = 0;
		luma_old = 100;
		
		shimmer = {deg:0, topg:75, botg:50, blorb:50, blorb_size:10, blorbg:125}
		shimmer_old = {deg:0, topg:75, botg:50, blorb:50, blorb_size:10, blorbg:125}

		shimmer_speed = 0.2;
		shimmer_delay = 0;
		ang_old = 0;
			
		blorbs = []

		lumapply = function ()
		{

			document.getElementById("styleinject").innerHTML = ' \
			<style> \
			@keyframes lumanimbg { \
				from { \
					background-image: url("./static_line.png"), \
					linear-gradient(' + (ang_old) + 'deg, rgba(0,150,0,0.04), rgba(0,20,0,0.04)), \
					linear-gradient(180deg, \
						rgba(0,' + Math.floor(shimmer_old.topg) + ',0, 0.0), \
						rgba(0,' + Math.floor(shimmer_old.topg) + ',0, 0.0) ' + (shimmer_old.blorb - (shimmer_old.blorb_size) - 2) + '%, \
						rgba(0,' + Math.floor(shimmer_old.topg) + ',0, 0.3) ' + (shimmer_old.blorb - (shimmer_old.blorb_size) + 1) + '%, \
						rgba(0,' + Math.floor(shimmer_old.blorbg) + ',0, 0.3) ' + (shimmer_old.blorb) + '%, \
						rgba(0,' + Math.floor(shimmer_old.botg) + ',0, 0.0) ' + (shimmer_old.blorb) + '%, \
						rgba(0,' + Math.floor(shimmer_old.botg) + ',0, 0.0)), \
					linear-gradient(to bottom, rgb(0,' + Math.floor(luma_old * bgtopmul) + ',0), rgb(0,' + Math.floor(luma_old * bgbotmul) + ',0)); \
					background-position: 0% ' + Yoffset_old + '%; \
				} \
				to { \
					background-image: url("./static_line.png"), \
					linear-gradient(' + (ang) + 'deg, rgba(0,150,0,0.04), rgba(0,20,0,0.04)), \
					linear-gradient(180deg, \
						rgba(0,' + Math.floor(shimmer.topg) + ',0, 0.0), \
						rgba(0,' + Math.floor(shimmer.topg) + ',0, 0.0) ' + (shimmer.blorb - (shimmer.blorb_size) - 2) + '%, \
						rgba(0,' + Math.floor(shimmer.topg) + ',0, 0.3) ' + (shimmer.blorb - (shimmer.blorb_size) + 1) + '%, \
						rgba(0,' + Math.floor(shimmer.blorbg) + ',0, 0.3) ' + (shimmer.blorb) + '%, \
						rgba(0,' + Math.floor(shimmer.botg) + ',0, 0.0) ' + (shimmer.blorb) + '%, \
						rgba(0,' + Math.floor(shimmer.botg) + ',0, 0.0)), \
					linear-gradient(to bottom, rgb(0,' + Math.floor(luma * bgtopmul) + ',0), rgb(0,' + Math.floor(luma * bgbotmul) + ',0)); \
					background-position: 0%' + Yoffset + '%; \
				} \
			} \
			\
			@keyframes lumanimtext { \
				from { color: rgb(' + Math.floor(Math.min(luma_old + text_extra, luma_max) * textRmul) + ',' + Math.floor(Math.min(luma_old + text_extra, luma_max) * textGmul) + ',' + Math.floor(Math.min(luma_old + text_extra, luma_max) * textBmul) + ');} \
				to { color: rgb(' + Math.floor(Math.min(luma + text_extra, luma_max) * textRmul) + ',' + Math.floor(Math.min(luma + text_extra, luma_max) * textGmul) + ',' + Math.floor(Math.min(luma + text_extra, luma_max) * textBmul) + ');} \
			} \
			</style>';
			
			ang_old = ang;
			Yoffset_old = Yoffset;
			luma_old = luma
			shimmer_old = shimmer;
		}
		
		lumfunc = function ()
		{
			if (Math.abs(trend) < trend_reset_cutoff) {trend = (Math.random() - 0.5) * trend_pow;}
			
			luma += trend;
			trend *= 0.66;
			tick++;

			if (luma < luma_min) {trend = trend_pow * 0.5;}			
			if (luma > luma_max) {trend = trend_pow * -0.5;}
			
			Yoffset = (Math.random() - 0.5) * 12;

			shimmer.deg = shimmer_old.deg + (Math.random() - 0.5) * trend_pow * trend_pow;
			shimmer.topg = bgtopmul * 1.5 * luma;
			shimmer.botg = bgtopmul * 1.5 * luma;
			shimmer.blorb = shimmer_old.blorb + shimmer_speed;
			if (shimmer.blorb > 120 && shimmer_delay == 0) {
				shimmer_delay = 40 + Math.floor(Math.random() * 70);
			}

			if (shimmer_delay == 1) {
				shimmer.blorb = -20;
				shimmer_delay = 0;
				shimmer_speed = 0.1 + (Math.random() * 0.2)
			}

			if (shimmer_delay > 0) {
				shimmer_delay--;
			}
			shimmer.blorbg = bgtopmul * 5 * luma
			shimmer.blorb_size = Math.max(Math.min(shimmer_old.blorb_size + (Math.random() - 0.5), 20), 10);

			ang = ang_old + (Math.random() - 0.5) * 70;

			lumapply();
		}
		
		var intervalID = setInterval(lumfunc, 25);
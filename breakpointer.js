mons = new Map()
moves = new Map()
cpm = []
type_matchup = []
mon_list = []

clauses = []

__input_res = {}
__uid = 0;
species_select_queue = [];
move_select_queue = [];

methods = ["comparison", "breakpoint", "cmp"]
cmp_comparison = ["greater", "greater_equal", "equal", "lesser_equal", "equal"]





breakpoint_comparison = ["rank1", "rank250", "median"]
breakpoint_comparison_text = ["Rank 1", "Average in top 250", "Median"]


// breakpoint clause object example
__dummy = {
    "method": "breakpoint",
    "cmp_rank_uid": 1,
    "uid": 2,
    "other": {
        "species_uid": 3,
        "cmp_rank_uid": 4
    }
}




// types
types = ["NORMAL","FIGHTING","FLYING","POISON","GROUND","ROCK","BUG","GHOST","STEEL","FIRE","WATER","GRASS","ELECTRIC","PSYCHIC","ICE","DRAGON","DARK","FAIRY"];
type_matchup = __type_matchup_raw.split('\n').map(x => x.split(',').map(y => Number(y)));

function type_id(type_str) {
    console.log(type_str);
    if (typeof(type_str) != typeof("string")) {return -1;}
    var up = type_str.toUpperCase()
    for (i = 0; i < types.length; i++) {
        if (types[i] == up) {
            return i;
        }
    }
    return -1;
}

function get_stab(atk, atkr1, atkr2) {
    var aid = type_id(atk);
    if (aid == type_id(atkr1) || aid == type_id(atkr2)) {
        return 1.2;
    }
    else return 1;
}

function get_type_mult(atk, def1, def2) {
    var atk_id = type_id(atk);
    var def1_id = type_id(def1);
    var def2_id = type_id(def2);

    var mult = 1.0;
    if (def1_id != -1) {
        mult *= type_matchup[atk_id][def1_id];
    }
    if (def2_id != -1) {
        mult *= type_matchup[atk_id][def2_id];
    }
    return mult;
}

//load base stats / species
cpm = __cpm_raw.split('\n').map(x => Number(x));
__mons_raw.split('\n').forEach(y => {
    let split = y.split(',');
    mons.set(split[0], [Number(split[1]), Number(split[2]), Number(split[3]), split[4], split[5]]);
    console.log("mons loaded");
});
__moves_raw.split('\n').forEach(y => {
    let split = y.split(',');
    moves.set(split[0], [split[1], Number(split[2])]);
    console.log("moves loaded");
});

mon_list = Array.from(mons.keys());

mon_list.forEach(x => {
    var c = document.createElement("option");
    c.text = x;
    document.getElementById("__ivlinqspecies").options.add(c);
})

function get_uid() {
    return __uid++;
}

function get_species_select(uid) {
    __input_res[uid] = 0;
    species_select_queue.push(uid);
    return "<select id=\"__ivlinqinput_" + uid + "\" onchange=\"__input_res[" + uid + "] = this.value\" value=\"Noctowl\"></select>";
}

function get_rank_select(uid) {
    __input_res[uid] = 0;
    return "<input type=\"number\" id=\"__ivlinqinput_" + uid + "\" value=\"1\" min=\"1\" max=\"4096\"/>";
}

function get_percent_select(uid) {
    __input_res[uid] = 0;
    return "<input type=\"number\" id=\"__ivlinqinput_" + uid + "\" value=\"100\" min=\"1\" max=\"100\"/>";
}

function get_move_select(uid) {
    __input_res[uid] = 0;
    move_select_queue.push(uid);
    return "<select id=\"__ivlinqinput_" + uid + "\" onchange=\"__input_res[" + uid + "] = this.value\"></select>";
}

function get_rank_value(uid) {
    return __input_res[uid];
}

function get_mon_value(uid) {
    return mons.get(__input_res[uid])
}

function get_move_value(uid) {
    return moves.get(__input_res[uid])
}

function get_percent_value(uid) {
    return __input_res[uid] * 0.01;
}

// refresh field values 
function refresh_saved() {
    for ([k, v] of Object.entries(__input_res)) {
        __input_res[k] = document.getElementById("__ivlinqinput_" + k).value;
    }
}


function render_rank_mon_combo(rank_uid, species_uid) {
    return ` rank ` + get_rank_select(rank_uid) + ` of ` + get_species_select(species_uid);
}

function render_percent_top_mon_combo(percent_uid, top_uid, species_uid) {
    return ` at least ` + get_percent_select(percent_uid) + `% of top ` + get_rank_select(top_uid) + ` of ` + get_species_select(species_uid);
}



function render_breakpoint(clause) {
    var rendered = 
    `
    <div class="para">
        <div class="subheader">
        Which get a breakpoint using move: ` + get_move_select(clause.move_uid) + ` compared to rank: ` + get_rank_select(clause.cmp_rank_uid) + `
        <br/>
        Versus rank: ` + get_rank_select(clause.other.cmp_rank_uid) + ` of: ` + get_species_select(clause.other.species_uid) + `

        
        </div>
        </div>
    
    `

    return rendered;
}


function post_update_load_select() {
    species_select_queue.forEach(y => {
        mon_list.forEach(x => {
            var c = document.createElement("option");
            c.text = x;
            document.getElementById("__ivlinqinput_" + y).options.add(c);
        })
    });

    species_select_queue = [];

    move_select_queue.forEach(y => {
        moves.forEach((v, k) => {
            var c = document.createElement("option");
            c.text = k;
            document.getElementById("__ivlinqinput_" + y).options.add(c);
        })
    });

    move_select_queue = [];
}




// refresh clause display 
function update() {
    var res_str = "";

    clauses.forEach(x => {
        if (x.method = "breakpoint") {
            res_str += render_breakpoint(x);
        }
        else {
            // UNIMPLEMENTED
        }
    })


    document.getElementById("__ivlinqroot").innerHTML = res_str;
    post_update_load_select();
}




// add clause
function add_clause() {
    clauses.push({
        "method": "breakpoint",
        "cmp_rank_uid":  get_uid(),
        "move_uid":  get_uid(),
        "uid":  get_uid(),
        "other_method": get_uid(),
        "other": {
            "species_uid":  get_uid(),
            "cmp_rank_uid":  get_uid()
        }
    });

    update();
}

function render_res(spreads, count) {
    var res_str = ""

    for (i = 0; i < count; i++) {
        res_str += "" + spreads[i][6] + "/" + spreads[i][7] + "/" + spreads[i][8] + " - " + spreads[i][3] + " CP, Level " + spreads[i][4] + "<br/>"
    }


    var rendered = 
    `
    <div class="para">
        <div class="subheader">
        Top ` + String(count) + ` IV spreads that fulfill the given criteria (out of ` + spreads.length + `): 
        </div>` + res_str + ` </div>
    
    `

    return rendered;
}

function generate_spreads(mon_stats, cp) {
    var spreads = [];
    for (__a = 0; __a < 16; __a++) {
        for (__d = 0; __d < 16; __d++) {
            for (__s = 0; __s < 16; __s++) {
                spreads.push(calculate_stats([mon_stats[0], mon_stats[1], mon_stats[2]], [__a, __d, __s], cp));
            }
        }
    }
    spreads.sort((a, b) => ( a[5] < b[5]));
    return spreads;
}

function get_spread_selection(spreads, rank, upto) {
    var selected = [];
    if (!upto) {
        selected.push(spreads[rank-1]);
    } else {
        for (i = 0; i < rank; i++) {
            selected.push(spreads[i]);
        }
    }
    return selected;
}


function calculate() {
    refresh_saved();

    var mon_stats = mons.get(document.getElementById("__ivlinqspecies").value);
    console.log(mon_stats);

    var spreads = generate_spreads(mon_stats, 1500);

    clauses.forEach(x => {
        if (x.method = "breakpoint") {
            var this_mon_rank = get_rank_value(x.cmp_rank_uid);   
            var this_mon_move = get_move_value(x.move_uid);
            var other_mon_stats = get_mon_value(x.other.species_uid);
            var other_mon_rank = get_rank_value(x.other.cmp_rank_uid);
            console.log(this_mon_rank)
            console.log(this_mon_move)
            console.log(other_mon_stats)
            console.log(other_mon_rank)

            var other_spreads = generate_spreads(other_mon_stats, 1500);

            console.log(spreads)
            console.log(other_spreads)
            var selected_spread_1 = spreads[this_mon_rank - 1];
            var selected_spread_2 = other_spreads[other_mon_rank - 1];

            console.log(selected_spread_1)
            console.log(selected_spread_2)

            var muls = 1.3 * get_stab(this_mon_move[0], mon_stats[3], mon_stats[4]) * get_type_mult(this_mon_move[0], other_mon_stats[3], other_mon_stats[4]);

            var test_hardcode_mul_lol = 1.2 * 0.625 * 1.3;

            var dmg = sim_attack(selected_spread_1[0], selected_spread_2[1], this_mon_move[1], muls);
            console.log(dmg)

            breakpoint_spreads = []

            spreads.forEach(sp => {
                var new_dmg = sim_attack(sp[0], selected_spread_2[1], this_mon_move[1], test_hardcode_mul_lol);
                if (new_dmg > dmg) {
                    breakpoint_spreads.push(sp);
                }
            })

            console.log(breakpoint_spreads.length);
            console.log(breakpoint_spreads[0]);

            document.getElementById("__ivlinqres").innerHTML = render_res(breakpoint_spreads, 10);


        }
        else {
            // UNIMPLEMENTED
        }
    })

}
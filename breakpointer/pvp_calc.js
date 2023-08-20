function get_cp(base, ivs, cpm) {
    return Math.floor(((base[0] + ivs[0]) * Math.sqrt(base[1] + ivs[1]) * Math.sqrt(base[2] + ivs[2]) * cpm * cpm)/10.0)
}


function calculate_stats(base, ivs, format_cp) {
    var lev = 0;
    for (; lev < cpm.length; lev++) {
        var cp = get_cp(base, ivs, cpm[lev]);
        if (cp > format_cp) {break;}
    }
    lev--;

    var atk = ((base[0] + ivs[0]) * cpm[lev])
    var def = ((base[1] + ivs[1]) * cpm[lev])
    var sta = Math.floor((base[2] + ivs[2]) * cpm[lev])

    // [atk, def, sta, cp, lev, sp, aiv, div, siv]
    return [atk, def, sta, get_cp(base, ivs, cpm[lev]), ((lev+2)/2).toFixed(1), atk * def * sta, ivs[0], ivs[1], ivs[2]]
} 

function sim_attack(atk, def, bp, muls) {
    var soup = 0.5 * bp * muls * (atk/def)
    //console.log(soup)
    return Math.floor(soup) + 1
}
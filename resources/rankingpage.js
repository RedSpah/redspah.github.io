mons = new Map()
__mons_raw.split('\n').forEach(y => {
    let split = y.split(',');
    mons.set(split[0], [Number(split[1]), Number(split[2]), Number(split[3]), split[4], split[5]]);
    console.log("mons loaded");
});
mon_list = Array.from(mons.keys());

gl_rankings = new Map()
__gltierlist_raw.split('\n').forEach(y => {
    let split = y.split(',');
    gl_rankings.set(split[0], [split[1], split[2],split[3]]);
    console.log("gl rankings loaded");
});


//-----------
RANKING_FORMATTING = new Map();
console.log(typeof(RANKING_FORMATTING));
RANKING_FORMATTING.get("a");
RANKING_FORMATTING = new Map([
    ["S",["ranking_s",100,"S tier denotes the most important Pokémon of the format. Meta shapes itself around them."]],
    ["A+",["ranking_a_plus",95,"A+ tier denotes the core meta of the format."]],
    ["A",["ranking_a",90,"A tier denotes Pokémon that aren't the very core meta, but which are still very good in the format."]],
    ["A-",["ranking_a_minus",85,"A- tier denotes <TBD>."]],
    ["B+",["ranking_b_plus",80,"B+ tier denotes <TBD>."]]
]);
RANKING_FORMATTING.get("a");
console.log(typeof(RANKING_FORMATTING));

var html = "";
gl_rankings.forEach((entry, key) => {
    console.log(entry);
    console.log(entry[0]);
    var formatentry = RANKING_FORMATTING.get(entry[0]);
    console.log(formatentry);
    var css_class = formatentry[0];
    var mouseover = formatentry[2];

    var str = `<tr><th class="subheader ${css_class}" title="${mouseover}">${entry[0]}</th><th>${key}</th></tr>`;
    html += str;
})


document.getElementById("__tierlist_inject").innerHTML = html;
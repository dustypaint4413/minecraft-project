document.addEventListener('DOMContentLoaded', function() {
    // Check if page has scroll and adjust footer
    function adjustFooter() {
        const footer = document.querySelector('footer');
        if (document.body.scrollHeight <= window.innerHeight) {
            footer.style.position = 'fixed';
            footer.style.bottom = '0';
            footer.style.width = '100%';
        } else {
            footer.style.position = 'static';
        }
    }
    
    window.addEventListener('resize', adjustFooter);
    adjustFooter();
    
    // Scrolling Header Functionality
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});


/* ---------------------------------------------------------------------------
   Filter box for long lists.

   The block list runs to over a thousand entries. On a phone that is roughly
   fifty screens of scrolling, and the page's own advice - use the browser's
   find function - is awkward on mobile where that control is buried in a menu.
   Any list long enough to warrant it gets a search box that filters as you
   type.
--------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
    var MIN_ITEMS = 40;

    document.querySelectorAll('ul.block-list, ul.mob-list').forEach(function (list) {
        var items = Array.prototype.slice.call(list.children);
        if (items.length < MIN_ITEMS) return;

        var wrap = document.createElement('div');
        wrap.className = 'list-filter';

        var input = document.createElement('input');
        input.type = 'search';
        input.className = 'list-filter-input';
        input.placeholder = 'Filter these ' + items.length + ' entries…';
        input.setAttribute('aria-label', 'Filter the list below');

        var count = document.createElement('span');
        count.className = 'list-filter-count';
        count.setAttribute('aria-live', 'polite');
        count.textContent = items.length + ' shown';

        wrap.appendChild(input);
        wrap.appendChild(count);
        list.parentNode.insertBefore(wrap, list);

        var labels = items.map(function (li) {
            return (li.textContent || '').trim().toLowerCase();
        });

        function apply() {
            var q = input.value.trim().toLowerCase();
            var shown = 0;
            for (var i = 0; i < items.length; i++) {
                var hit = (!q || labels[i].indexOf(q) !== -1) && inFamily(i);
                items[i].hidden = !hit;
                if (hit) shown++;
            }
            count.textContent = (q || active.length)
                ? shown + ' of ' + items.length
                : items.length + ' shown';
            count.classList.toggle('is-empty', (q || active.length) && shown === 0);
        }


        /* Family chips. Each is a set of substrings matched against the entry
           name. Several can be on at once and they union, so Wood + Stone +
           Ore shows all three families together. The text box then narrows
           whatever the chips let through, so the Ore chip plus "deepslate"
           gives the deepslate ores only.

           Between them the families cover every entry in the list, and an
           entry may sit in several - Deepslate Redstone Ore is Stone, Ore
           and Redstone at once. */
        var FAMILIES = [
            ['Wood',     ['oak', 'spruce', 'birch', 'jungle', 'acacia', 'mangrove',
                          'cherry', 'poplar', 'bamboo', 'crimson', 'warped',
                          'plank', 'log', 'wood']],
            ['Stone',    ['stone', 'cobble', 'granite', 'diorite', 'andesite',
                          'deepslate', 'tuff', 'basalt', 'blackstone', 'calcite',
                          'prismarine', 'brick', 'quartz', 'purpur', 'cinnabar',
                          'sulfur', 'obsidian', 'bedrock', 'amethyst', 'dripstone']],
            ['Ore',      [' ore', 'ancient debris', 'raw ']],
            ['Copper',   ['copper']],
            ['Dyed',     ['wool', 'carpet', ' bed', 'banner', 'candle', 'concrete',
                          'terracotta', 'shulker box', 'stained glass', 'glazed']],
            ['Glass',    ['glass']],
            ['Redstone', ['redstone', 'piston', 'observer', 'repeater',
                          'comparator', 'hopper', 'dropper', 'dispenser',
                          'rail', 'lever', 'target', 'crafter', 'tripwire',
                          'daylight detector', 'sculk sensor', 'tnt',
                          'slime block', 'honey block', 'button',
                          'pressure plate', 'note block', 'lightning rod']],
            ['Plants',   ['sapling', 'flower', 'tulip', 'rose', 'grass', 'fern',
                          'leaves', 'vine', 'moss block', 'moss carpet',
                          'mushroom', 'wart', 'kelp',
                          'seagrass', 'bamboo', 'cactus', 'azalea', 'dripleaf',
                          'petal', 'orchid', 'allium', 'daisy', 'lilac',
                          'cornflower', 'poppy', 'dandelion', 'eyeblossom',
                          'wildflowers', 'pitcher', 'torchflower', 'sunflower',
                          'peony', 'lily', 'sprouts', 'roots', 'fungus', 'bush',
                          'sugar cane', 'lichen', 'chorus', 'melon', 'pumpkin',
                          'wheat', 'carrot', 'potato', 'beetroot', 'cocoa',
                          'berry', 'nylium', 'propagule', 'spore', 'hay',
                          'dried kelp', 'bluet', '=cobweb']],
            ['Coral',    ['coral']],
            ['Terrain',  ['dirt', '=sand', '=red sand', 'suspicious sand',
                          'soul sand', 'gravel', 'clay', 'mud', 'podzol',
                          'mycelium', 'farmland', 'path', 'snow', 'ice',
                          '=powder snow', 'netherrack', 'soil', 'soul sand', 'sculk',
                          'magma', 'steppe', 'froglight', '=water',
                          'bubble column', '=lava', '=cobweb', 'turtle egg',
                          'sniffer egg', 'frogspawn', 'sea pickle']],
            ['Nether',   ['nether', 'crimson', 'warped', 'soul', 'blackstone',
                          'basalt', 'magma', 'glowstone', 'shroomlight', 'ghast',
                          'piglin', 'respawn anchor', 'lodestone', 'gilded']],
            ['End',      ['end ', 'ender', 'purpur', 'chorus', 'dragon',
                          'shulker']],
            ['Light',    ['=torch', ' torch', 'lantern', 'glowstone', 'froglight',
                          'shroomlight', 'end rod', 'campfire', 'lamp',
                          "jack o'", 'beacon', 'conduit', 'candle', '=fire',
                          '=soul fire', '=lava', '=light', '=magma block']],
            ['Utility',  ['chest', 'table', 'furnace', 'smoker', 'barrel',
                          'anvil', 'loom', 'lectern', 'cauldron', 'composter',
                          'grindstone', 'stonecutter', 'brewing', 'enchanting',
                          'bell', 'jukebox', 'bookshelf', 'flower pot',
                          'decorated pot', 'bee nest', 'beehive', 'ladder',
                          'scaffolding', 'bars', 'chain', 'door', 'trapdoor',
                          'sign', 'shelf', 'vault', 'spawner', 'command',
                          'structure', 'jigsaw', 'barrier', 'frame', 'portal',
                          'cake', 'skull', 'head', 'sponge', 'block of',
                          'bone block', 'honeycomb', 'clump', 'resin',
                          '=lodestone', '=conduit', '=beacon',
                          '=heavy core']],
            ['Stairs',   ['stairs']],
            ['Slabs',    ['slab']],
            ['Walls',    ['wall', 'fence']]
        ];

        var chipRow = document.createElement('div');
        chipRow.className = 'list-chips';
        chipRow.setAttribute('role', 'group');
        chipRow.setAttribute('aria-label', 'Filter by family');

        var active = [];

        /* Membership is fixed once the list is built, so work it out here
           rather than re-scanning a thousand names on every keystroke. */
        var members = FAMILIES.map(function (fam) {
            var terms = fam[1];
            var hits = [];
            for (var i = 0; i < labels.length; i++) {
                var inIt = false;
                for (var t = 0; t < terms.length; t++) {
                    var term = terms[t];
                    /* A leading "=" means the whole name must match. Without it
                       "pot" would drag in Potatoes, "bee" Beetroots, and
                       "light" every Light Blue block. */
                    var found = term.charAt(0) === '='
                        ? labels[i] === term.slice(1)
                        : labels[i].indexOf(term) !== -1;
                    if (found) { inIt = true; break; }
                }
                hits.push(inIt);
            }
            return hits;
        });

        FAMILIES.forEach(function (fam, famIndex) {
            var name = fam[0];
            var hits = members[famIndex];
            var n = 0;
            for (var i = 0; i < hits.length; i++) {
                if (hits[i]) n++;
            }
            if (!n) return;

            var chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'list-chip';
            chip.textContent = name + ' (' + n + ')';
            chip.setAttribute('aria-pressed', 'false');
            chip.addEventListener('click', function () {
                var at = active.indexOf(famIndex);
                if (at === -1) {
                    active.push(famIndex);
                    chip.classList.add('is-on');
                    chip.setAttribute('aria-pressed', 'true');
                } else {
                    active.splice(at, 1);
                    chip.classList.remove('is-on');
                    chip.setAttribute('aria-pressed', 'false');
                }
                syncClear();
                apply();
            });
            chipRow.appendChild(chip);
        });

        /* With several chips on at once, clearing them one by one is tedious. */
        var clear = document.createElement('button');
        clear.type = 'button';
        clear.className = 'list-chip list-chip-clear';
        clear.textContent = 'Clear';
        clear.hidden = true;
        clear.addEventListener('click', function () {
            active.length = 0;
            chipRow.querySelectorAll('.list-chip.is-on').forEach(function (c) {
                c.classList.remove('is-on');
                c.setAttribute('aria-pressed', 'false');
            });
            syncClear();
            apply();
        });

        function syncClear() {
            clear.hidden = active.length === 0;
        }

        if (chipRow.children.length) {
            chipRow.appendChild(clear);
            wrap.parentNode.insertBefore(chipRow, wrap.nextSibling);
        }

        function inFamily(i) {
            if (!active.length) return true;
            for (var a = 0; a < active.length; a++) {
                if (members[active[a]][i]) return true;
            }
            return false;
        }

        input.addEventListener('input', apply);
        input.addEventListener('search', apply);
    });
});

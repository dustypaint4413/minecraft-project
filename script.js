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
                var hit = !q || labels[i].indexOf(q) !== -1;
                items[i].hidden = !hit;
                if (hit) shown++;
            }
            count.textContent = q
                ? shown + ' of ' + items.length
                : items.length + ' shown';
            count.classList.toggle('is-empty', q && shown === 0);
        }

        input.addEventListener('input', apply);
        input.addEventListener('search', apply);
    });
});

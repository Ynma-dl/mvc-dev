// Tiroir de navigation mobile (hamburger) — ouverture / fermeture
document.addEventListener('DOMContentLoaded', function () {
    var menuToggle = document.getElementById('menuToggle');
    var drawer = document.getElementById('mobileDrawer');
    var backdrop = document.getElementById('drawerBackdrop');
    var closeBtn = document.getElementById('drawerClose');

    if (!menuToggle || !drawer || !backdrop) return;

    function openDrawer() {
        drawer.classList.add('is-open');
        backdrop.classList.add('is-open');
        document.body.classList.add('drawer-locked');
        menuToggle.setAttribute('aria-expanded', 'true');
    }

    function closeDrawer() {
        drawer.classList.remove('is-open');
        backdrop.classList.remove('is-open');
        document.body.classList.remove('drawer-locked');
        menuToggle.setAttribute('aria-expanded', 'false');
    }

    menuToggle.addEventListener('click', function () {
        var isOpen = drawer.classList.contains('is-open');
        isOpen ? closeDrawer() : openDrawer();
    });

    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    backdrop.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeDrawer();
    });

    // Ferme le tiroir si on clique un lien à l'intérieur (navigation)
    drawer.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', closeDrawer);
    });
});
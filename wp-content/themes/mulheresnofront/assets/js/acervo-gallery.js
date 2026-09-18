(function () {
	'use strict';

	var gallery = document.querySelector('.mf-gallery');
	if (!gallery) {
		return;
	}

	// Fade-in das fotos ao rolar (enhancement progressivo: sem JS as fotos ficam visíveis).
	var figs = Array.prototype.slice.call(gallery.querySelectorAll('figure.wp-block-image'));
	gallery.classList.add('mf-gallery-ready');

	if ('IntersectionObserver' in window) {
		var io = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					if (entry.isIntersecting) {
						entry.target.classList.add('mf-in');
						io.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.15 }
		);
		figs.forEach(function (fig) {
			io.observe(fig);
		});

		// Marcação síncrona inicial: fotos já visíveis na primeira pintura
		// aparecem imediatamente, sem depender do primeiro callback do observer.
		var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
		figs.forEach(function (fig) {
			var rect = fig.getBoundingClientRect();
			if (rect.top < viewportHeight && rect.bottom > 0) {
				fig.classList.add('mf-in');
				io.unobserve(fig);
			}
		});
	} else {
		figs.forEach(function (fig) {
			fig.classList.add('mf-in');
		});
	}

	// Lightbox: abre a foto em tela cheia.
	var imgs = Array.prototype.slice.call(gallery.querySelectorAll('img'));
	if (!imgs.length) {
		return;
	}

	var lb = document.createElement('div');
	lb.className = 'mf-lightbox';
	lb.setAttribute('role', 'dialog');
	lb.setAttribute('aria-label', 'Visualização de fotografia');
	lb.innerHTML =
		'<button class="mf-lb-btn mf-lb-close" aria-label="Fechar">&times;</button>' +
		'<button class="mf-lb-btn mf-lb-prev" aria-label="Anterior">&#8249;</button>' +
		'<img alt="Fotografia do acervo Mulheres no Front" />' +
		'<button class="mf-lb-btn mf-lb-next" aria-label="Próxima">&#8250;</button>';
	document.body.appendChild(lb);

	var lbImg = lb.querySelector('img');
	var current = 0;

	function open(index) {
		current = (index + imgs.length) % imgs.length;
		lbImg.src = imgs[current].currentSrc || imgs[current].src;
		lb.classList.add('mf-lightbox-open');
		document.body.style.overflow = 'hidden';
	}

	function close() {
		lb.classList.remove('mf-lightbox-open');
		document.body.style.overflow = '';
	}

	imgs.forEach(function (img, index) {
		img.addEventListener('click', function () {
			open(index);
		});
	});

	lb.querySelector('.mf-lb-close').addEventListener('click', close);
	lb.querySelector('.mf-lb-prev').addEventListener('click', function () {
		open(current - 1);
	});
	lb.querySelector('.mf-lb-next').addEventListener('click', function () {
		open(current + 1);
	});
	lb.addEventListener('click', function (event) {
		if (event.target === lb) {
			close();
		}
	});
	document.addEventListener('keydown', function (event) {
		if (!lb.classList.contains('mf-lightbox-open')) {
			return;
		}
		if (event.key === 'Escape') {
			close();
		} else if (event.key === 'ArrowLeft') {
			open(current - 1);
		} else if (event.key === 'ArrowRight') {
			open(current + 1);
		}
	});
})();
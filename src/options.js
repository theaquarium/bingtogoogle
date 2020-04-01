window.addEventListener('load', () => {
	const redirectAll = document.querySelector('.RedirectAll');
	const redirectSearch = document.querySelector('.RedirectSearch');
	const redirectImage = document.querySelector('.RedirectImage');
	const redirectVideo = document.querySelector('.RedirectVideo');
	const redirectMaps = document.querySelector('.RedirectMaps');
	const redirectOthers = document.querySelector('.RedirectOthers');

	let optionsCache = {};

	const processGlobalChange = () => {
		if (!redirectAll.querySelector('.SwitchCheckbox').checked) {
			redirectSearch.classList.add('is-inactive');
			redirectSearch.querySelector('.SwitchCheckbox').disabled = true;
			redirectImage.classList.add('is-inactive');
			redirectImage.querySelector('.SwitchCheckbox').disabled = true;
			redirectVideo.classList.add('is-inactive');
			redirectVideo.querySelector('.SwitchCheckbox').disabled = true;
			redirectMaps.classList.add('is-inactive');
			redirectMaps.querySelector('.SwitchCheckbox').disabled = true;
			redirectOthers.classList.add('is-inactive');
			redirectOthers.querySelector('.SwitchCheckbox').disabled = true;
		} else {
			redirectSearch.classList.remove('is-inactive');
			redirectSearch.querySelector('.SwitchCheckbox').disabled = false;
			redirectImage.classList.remove('is-inactive');
			redirectImage.querySelector('.SwitchCheckbox').disabled = false;
			redirectVideo.classList.remove('is-inactive');
			redirectVideo.querySelector('.SwitchCheckbox').disabled = false;
			redirectMaps.classList.remove('is-inactive');
			redirectMaps.querySelector('.SwitchCheckbox').disabled = false;
			redirectOthers.classList.remove('is-inactive');
			redirectOthers.querySelector('.SwitchCheckbox').disabled = false;
		}
	};

	chrome.storage.local.get(null, options => {
		optionsCache = options;
		redirectAll.querySelector('.SwitchCheckbox').checked = options.redirectAll;
		redirectSearch.querySelector('.SwitchCheckbox').checked = options.redirectSearch;
		redirectImage.querySelector('.SwitchCheckbox').checked = options.redirectImage;
		redirectVideo.querySelector('.SwitchCheckbox').checked = options.redirectVideo;
		redirectMaps.querySelector('.SwitchCheckbox').checked = options.redirectMaps;
		redirectOthers.querySelector('.SwitchCheckbox').checked = options.redirectOthers;
		processGlobalChange();
	});

	chrome.storage.onChanged.addListener((changes, area) => {
		chrome.storage.local.get(null, options => {
			optionsCache = options;
			redirectAll.querySelector('.SwitchCheckbox').checked = options.redirectAll;
			redirectSearch.querySelector('.SwitchCheckbox').checked = options.redirectSearch;
			redirectImage.querySelector('.SwitchCheckbox').checked = options.redirectImage;
			redirectVideo.querySelector('.SwitchCheckbox').checked = options.redirectVideo;
			redirectMaps.querySelector('.SwitchCheckbox').checked = options.redirectMaps;
			redirectOthers.querySelector('.SwitchCheckbox').checked = options.redirectOthers;
			processGlobalChange();
			if (!options.redirectAll || (!optionsCache.redirectSearch && !optionsCache.redirectImage && !optionsCache.redirectVideo && !optionsCache.redirectMaps && !optionsCache.redirectOthers)) {
				chrome.browserAction.setBadgeBackgroundColor({ 'color': '#868686' });
				chrome.browserAction.setBadgeText({ 'text': 'Off' });
			} else {
				chrome.browserAction.setBadgeBackgroundColor({ 'color': '#0394fc' });
				chrome.browserAction.setBadgeText({ 'text': 'On' });
			}
		});
	});

	redirectAll.querySelector('.SwitchCheckbox').addEventListener('input', e => {
		chrome.storage.local.set({ redirectAll: e.target.checked });
		processGlobalChange();
	});
	redirectSearch.querySelector('.SwitchCheckbox').addEventListener('input', e => {
		chrome.storage.local.set({ redirectSearch: e.target.checked });
	});
	redirectImage.querySelector('.SwitchCheckbox').addEventListener('input', e => {
		chrome.storage.local.set({ redirectImage: e.target.checked });
	});
	redirectVideo.querySelector('.SwitchCheckbox').addEventListener('input', e => {
		chrome.storage.local.set({ redirectVideo: e.target.checked });
	});
	redirectMaps.querySelector('.SwitchCheckbox').addEventListener('input', e => {
		chrome.storage.local.set({ redirectMaps: e.target.checked });
	});

	redirectOthers.querySelector('.SwitchCheckbox').addEventListener('input', e => {
		chrome.storage.local.set({ redirectOthers: e.target.checked });
	});
});
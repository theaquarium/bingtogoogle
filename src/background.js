let options = {
	redirectAll: true,
	redirectSearch: true,
	redirectImage: true,
	redirectVideo: true,
	redirectMaps: true,
	redirectOthers: true
};

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set(options, () => {
      	console.log("Default Config Set.", options);
	});
	chrome.browserAction.setBadgeBackgroundColor({ 'color': '#0394fc' });
	chrome.browserAction.setBadgeText({ 'text': 'On' });
});

chrome.storage.onChanged.addListener((changes, area) => {
	console.log('options changed');
	if (area === 'local') {
		console.log('local');
		for (let key in changes) {
			console.log(changes, key);
			options[key] = changes[key].newValue;
		}
		console.log(options);
	}
});

chrome.webRequest.onBeforeRequest.addListener(
	details => {
		let url;
		if (options.redirectAll) {
			const regexQuery = /(?<=[?|&]q=)(.*?)(?=&|$)/g;
			const query = details.url.match(regexQuery);
			const regexSearchType = /(?<=(bing\.com\/))(.*?)(?=\?)/g;
			let searchType = details.url.match(regexSearchType)
			
			if (searchType) {
				searchType = searchType[0].split('/');
			} else {
				if (options.redirectOthers) {
					return { 'redirectUrl': 'https://google.com/' };
				} else {
					return;
				}
				
			}

			switch (searchType[0]) {
				case 'search':
					if (options.redirectSearch) {
						url = 'https://google.com/search?q=' + query[0];
					}
					break;
				case 'images':
					if (options.redirectImage) {
						url = 'https://www.google.com/search?tbm=isch&q=' + query[0];
					}
					break;
				case 'videos':
					if (options.redirectVideo) {
						url = 'https://www.google.com/search?tbm=vid&q=' + query[0];
					}
					break;
				case 'maps':
					if (options.redirectMaps) {
						console.log(searchType, 'hi');
						if (searchType[1] === 'directions') {
							const regexDirLocation = /(?<=rtp=adr\.~pos\.).*?(?=(&|$))/g;
							let dirLocation = details.url.match(regexDirLocation);
							if (dirLocation) {
								dirLocation = dirLocation[0].split('_');
								url = 'https://www.google.com/maps/dir//' + dirLocation[0] + ',+' + dirLocation[1];
							} else {
								url = 'https://www.google.com/maps';
							}
						} else if (query && query[0]) {
							url = 'https://www.google.com/maps/search/' + query[0];
						}
					}
					break;
				default:
					if (options.redirectOthers) {
						url = 'https://www.google.com/';
					}
					break;
			}
		}

		if (url) {
			return { 'redirectUrl': url };
		} else {
			return;
		}
	},
	{ urls: ['https://www.bing.com/*'], types: ['main_frame'] },
	['blocking']
);
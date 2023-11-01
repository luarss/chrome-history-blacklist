chrome.storage.sync.get('blacklist', data => {
	if (!data.blacklist) {
		throw new Error('expected blacklist in storage');
	}

	const blacklistEl = document.getElementById('blacklist');
	blacklistEl.value = data.blacklist.join('\n');
});

chrome.storage.sync.get(['urlsPurged', 'startDate'], data => {
	if (data.urlsPurged == null) {
		throw new Error('expected urlsPurged in storage');
	}
	if (data.startDate == null) {
		throw new Error('expected startDate in storage');
	}

	document.getElementById('urls-purged').innerHTML = data.urlsPurged.toLocaleString();
	document.getElementById('urls-purged-date').innerHTML = new Date(data.startDate).toLocaleDateString();

	if (data.urlsPurged > 0) {
		document.getElementById('urls-purged-container').className = 'show';
	}
});

const saveEl = document.getElementById('save');
saveEl.addEventListener('click', function () {
	const blacklistEl = document.getElementById('blacklist');
	const blacklist = blacklistEl.value.trim().split('\n');
	chrome.storage.sync.set({ blacklist });

	const savedNotificationEl = document.getElementById('saved-notification');
	savedNotificationEl.className = 'flash';
	savedNotificationEl.offsetWidth;
	savedNotificationEl.className = '';
});

document.getElementById('openHistory').addEventListener('click', function() {
  // Function to open Chrome history tab
  function openHistoryTab() {
    chrome.tabs.create({ url: "chrome://history" }, (tab) => {
      // Close the history tab with a slight delay
      setTimeout(() => {
        chrome.tabs.remove(tab.id);
      }, 1000); // Adjust the delay (in milliseconds) as needed
    });
  }

  // Open and close 10 Chrome history tabs
  for (let i = 0; i < 10; i++) {
    setTimeout(openHistoryTab, i * 1000); // Opens a new tab every second (1000 milliseconds)
  }
});

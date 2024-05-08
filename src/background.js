chrome.runtime.onInstalled.addListener(handleRuntimeInstalled);
chrome.history.onVisited.addListener(handleHistoryVisited);

function handleRuntimeInstalled(details) {
	if (details.reason === 'install') {
		chrome.storage.sync.set({
			blacklist: ["chrome-extension://",
                        "web.telegram.org", 
                        "www.reddit.com",
                        "docs.google.com",
                        "news.ycombinator.com",
                        "mail.google.com",
                        "www.youtube.com",
                        "app.slack.com",
                        "chat.openai.com",
                        "bard.google.com", 
                        "translate.google.com",
                        "claude.ai",
                        "twitter.com",
                        "discord.com",
                        "meet.google.com",
                        "calendar.google.com",
                        "sg.linkedin.com",
                        "www.linkedin.com",
                        "www.meetup.com",
                        "www.overleaf.com",
                        "leetcode.com",
                        "www.x.com",
                        "www.levels.fyi",
                        "neetcode.io",
                        "www.glassdoor.sg",
                        "gemini.google.com",
                        "github.com/luarss",
                        "github.com/The-OpenROAD-Project",
                        "colab.research.google.com",
                        "summerofcode.withgoogle.com",
                        "www.geeksforgeeks.org"
            ],
			urlsPurged: 0,
			startDate: Date.now()
		}, () => {
			console.log('Blacklist initialized.');
		});
	}
}

function handleHistoryVisited(historyItem) {
	chrome.storage.sync.get('blacklist', data => {
		if (isBlacklisted(data.blacklist, historyItem.url)) {
			console.log(`Blacklisted URL: ${historyItem.url}`);
			purgeUrl(historyItem.url);
		}
	});
}

function purgeUrl(url) {
	chrome.history.deleteUrl({ url }, () => {
		console.log(`History deleted for URL: ${url}`);
		incrementCount();
	});
}

function incrementCount() {
	chrome.storage.sync.get('urlsPurged', data => {
		chrome.storage.sync.set({
			urlsPurged: data.urlsPurged + 1
		});
	});
}

function isBlacklisted(blacklist, url) {
	return blacklist.some(line => url.toLowerCase().includes(line.toLowerCase()));
}

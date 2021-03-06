/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;

const CDN_BASE_URL      = document.getElementById('js-cdn-base-url').href;
const FILTER_ICON_LIGHT = CDN_BASE_URL + 'filter-icon-light.png';
const FILTER_ICON_DARK  = CDN_BASE_URL + 'filter-icon-dark.png';

function getBoardId(t) {
	return t.board('id').then(function(board) {
		return board.id;
	});
}

function getBoardUrl(t) {
	return t.board('url').then(function(board) {
		return board.url;
	});
}

function getCardId(t) {
	return t.card('id').then(function(card) {
		return card.id;
	});
}

function getUserId(t) {
	return t.getContext().member;
}

function getUserName(t) {
	return t.member('fullName').then(function(member) {
		return member.fullName;
	});
}

async function setupUserLabel(t) {
	const postData = {
		name:    'Focus ' + await getUserName(t),
		color:   null,
		idBoard: await getBoardId(t),
	};
	
	const token = await getApiToken(t);
	window.Trello.setToken(token);
	
	try {
		return window.Trello.post('/labels', postData, function(response) {
			const userId    = getUserId(t);
			const userLabel = {
				id:   response.id,
				name: response.name,
			};
			
			t.set('board', 'shared', 'focus-cards-label-' + userId, userLabel);
			
			return userLabel;
		},
		function(error) {
			t.alert({
				message: JSON.stringify(error, null, '\t'),
			});
		});
	}
	catch (error) {
		console.log(error);
	}
}

async function getUserLabel(t, makeSure=false) {
	const userId = getUserId(t);
	return t.get('board', 'shared', 'focus-cards-label-' + userId).then(function(userLabel) {
		if (makeSure === false) {
			return userLabel;
		}
		
		if (userLabel === undefined) {
			return setupUserLabel(t);
		}
		
		return t.board('labels').then(function(board) {
			const labelExists = board.labels.some(function(label) {
				return (label.id === userLabel.id);
			});
			
			if (labelExists === false) {
				return setupUserLabel(t);
			}
			
			return userLabel;
		});
	},
	function() {
		return setupUserLabel(t);
	});
}

async function hasFocus(t) {
	const focusLabel = await getUserLabel(t);
	if (focusLabel === undefined) {
		return false;
	}
	
	return t.card('labels').then(function(card) {
		return card.labels.some(function(label) {
			return (label.id === focusLabel.id);
		});
	});
}

async function getApiToken(t) {
	return t.get('member', 'private', 'token').then(function(token) {
		if (token === undefined) {
			startAuthorization(t);
			return false;
		}
		
		return token;
	},
	function() {
		startAuthorization(t);
		return false;
	});
}

async function applyFilter(t) {
	const userLabel = await getUserLabel(t);
	
	return t.navigate({
		url: await getBoardUrl(t) + '?menu=filter&filter=label:' + userLabel.name,
	});
}

function startAuthorization(t) {
	return t.popup({
		title:  'My Auth Popup',
		height: 150,
		url:    './authorize.html',
		args:   {
			apiKey: '9b174ff1ccf5ca94f1c181bc3d802d4b',
		},
	});
}

async function markAsFocus(t) {
	const token = await getApiToken(t);
	if (token === false) {
		return;
	}
	
	window.Trello.setToken(token);
	
	const userLabel = await getUserLabel(t, true);
	const postData  = {
		value: userLabel.id,
	};
	
	try {
		window.Trello.post("/cards/" + await getCardId(t) + "/idLabels", postData, null, function(error) {
			t.alert({
				message: JSON.stringify(error, null, '\t'),
			});
		});
	}
	catch (error) {
		console.log(error);
	}
}

async function unmarkAsFocus(t) {
	const token = await getApiToken(t);
	if (token === false) {
		return;
	}
	
	window.Trello.setToken(token);
	
	const userLabel = await getUserLabel(t, true);
	
	try {
		window.Trello.delete("/cards/" + await getCardId(t) + "/idLabels/" + userLabel.id, {}, null, function(error) {
			t.alert({
				message: JSON.stringify(error, null, '\t'),
			});
		});
	}
	catch (error) {
		console.log(error);
	}
}

async function showFocusState(t) {
	if (await hasFocus(t)) {
		return {
			title:    'Focus',
			text:     'In focus',
			color:    'green',
			callback: unmarkAsFocus,
		};
	}
	else {
		return {
			title:    'Focus',
			text:     'Add to focus',
			color:    'none',
			callback: markAsFocus,
		};
	}
}

TrelloPowerUp.initialize({
	'board-buttons': function(t, options) {
		return [
			{
				text: 'Focus',
				icon: {
					light: FILTER_ICON_LIGHT,
					dark:  FILTER_ICON_DARK,
				},
				condition: 'edit',
				callback: function(t) {
					return applyFilter(t);
				},
			},
		];
	},
	'card-detail-badges': function(t, options) {
		return [
			{
				dynamic: function() {
					const promises = [
						showFocusState(t),
					];
					
					return Promise.all(promises).then(function(badges) {
						return badges[0];
					});
				},
			},
		];
	},
	'authorization-status': function(t, options) {
		return t.get('member', 'private', 'token').then(function(token) {
			const isAuthorized = (token !== undefined);
			
			return {
				authorized: isAuthorized,
			};
		});
	},
	'show-authorization': function(t, options) {
		return startAuthorization(t);
	},
}, {
	appKey:  '9b174ff1ccf5ca94f1c181bc3d802d4b',
	appName: 'Focus cards',
});

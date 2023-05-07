"use strict"
let homepageLogout = new LogoutButton();
homepageLogout.action = (data => ApiConnector.logout(response => {
	if (response.success) {
		location.reload();
	}
}))


ApiConnector.current(response => {
	if (response.success) {
		ProfileWidget.showProfile(response.data);
	}
})

let currentRates = new RatesBoard();

function getCurrentRates() {
	ApiConnector.getStocks(response => {
		if (response.success) {
			currentRates.clearTable();
			currentRates.fillTable(response.data);
		}
	});
}

getCurrentRates();

setInterval(getCurrentRates, 60000); //is this correct? 


let currentMoneyManager = new MoneyManager;
currentMoneyManager.addMoneyCallback = data => {
	ApiConnector.addMoney(data, response => {
		if (response.success) {
			ProfileWidget.showProfile(response.data);
			currentMoneyManager.setMessage(response.success, "Success: Money successfully added to the account")
		} else {
			currentMoneyManager.setMessage(response.success, "Failure: failed to add money to the account")
		}
	})

}
currentMoneyManager.conversionMoneyCallback = data => {
	ApiConnector.convertMoney(data, response => {
		if (response.success) {
			ProfileWidget.showProfile(response.data);
			currentMoneyManager.setMessage(response.success, "Success: Money successfully converted")
		} else {
			currentMoneyManager.setMessage(response.success, "Failure: failed to convert money")
		}
	})
}

currentMoneyManager.sendMoneyCallback = data => { //users don't have other users 
	ApiConnector.transferMoney(data, response => {
		if (response.success) {
			ProfileWidget.showProfile(response.data);
			currentMoneyManager.setMessage(response.success, "Success: Money successfully transferred")
		} else {
			currentMoneyManager.setMessage(response.success, "Failure: failed to transfer money")
		}
	})
}


let currentFavouritesWidget = new FavoritesWidget();
ApiConnector.getFavorites(response => {
	if (response.success) {
		currentFavouritesWidget.clearTable();
		currentFavouritesWidget.fillTable(response.data);
		currentMoneyManager.updateUsersList(response.data);
	}
})

currentFavouritesWidget.addUserCallback = data => {
	ApiConnector.addUserToFavorites(data, response => {
		if (response.success) {
			currentFavouritesWidget.clearTable();
			currentFavouritesWidget.fillTable(response.data);
			currentMoneyManager.updateUsersList(response.data);
			currentFavouritesWidget.setMessage(response.success, "Success: user ${data.name} successfully added to favourites"); //why ${} doesn't work?
		} else {
			currentFavouritesWidget.setMessage(response.success, "Failure: failed to add to favourites")
		}
	})
}

currentFavouritesWidget.removeUserCallback = id => {
	ApiConnector.removeUserFromFavorites(id, response => {
		if (response.success) {
			currentFavouritesWidget.clearTable();
			currentFavouritesWidget.fillTable(response.data);
			currentMoneyManager.updateUsersList(response.data);
			currentFavouritesWidget.setMessage(response.success, "Success: user ${id} successfully removed from favourites"); //why ${} doesn't work?
		} else {
			currentFavouritesWidget.setMessage(response.success, "Failure: failed to remove from favourites")
		}
	})
}
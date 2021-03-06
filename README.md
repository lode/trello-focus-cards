# Trello focus cards

![Back of a Trello card with the Focus button below the title](/card-detail-badge.png)

This power-up for Trello helps you focus on the cards you actively care about.
It is an addition to cards you're a member of, or cards you're following.
With focussing on cards you'll have a clean board overview.

For example:

- when you asked someone else to review your code, you can stop focussing on that card until the other person is done reviewing
- when you want to remember to work on something today, you can focus on on that card just for today
- when you have an idea which you don't want to forget, but work on a bit later, you can stop focussing on that card for now

Focus cards don't adjust notifications, uou'll still get them if you're a member of or are following the card.


## Install

The power-up isn't published/listed yet. You'll need to install it as a custom power-up until then.

- Go to https://trello.com/power-ups/admin and click 'Create new Power-Up' the top right.
- Fill:
	- Name: `Focus cards`
	- Workspace: the workspace you want to use the power-up in (you'll need to be an admin of that workspace).
	- Iframe-connector-URL: `https://www.lodeclaassen.nl/trello-focus-cards/power-up/`
- If this is your first time using a custom power-up, you'll need to agree to a 'Joint Developer Agreement' first.
- On the baic information tab, fill:
	- Symbol: `https://www.lodeclaassen.nl/trello-focus-cards/power-up/favicon.png`
- On the permissions tab, enable:
	- `board-buttons`
	- `card-detail-badges`
	- `authorization-status`
	- `show-authorization`
- Go to the board where you want to use it and open the power-ups marketplace overlay.
- Click on the 'custom' section on the left, and add 'Focus cards'.


## First time use

Every person using the power-up will need to authorize against the Trello API.
From the power-up in the board menu, choose 'Authorize' and complete the steps.

Currently the power-up needs write access from your account.
This is needed as it stores the focus in a label, and to add/remove labels it needs write access from your account.


## Usage

To **add or remove focus**, open a card and click the focus button just below the title, next to members and labels.

To **see what is in focus**, close any card and click the focus button in the right top, next to the board menu.

To **see all cards again**, clear the filter using the green button left of the focus board button.

Note, if the board button doesn't work, refresh the page and try again.
There seems to be a bug with that button if you already used it once after a (re)load of the page.


## Contributing

If you use the power-up, please ask questions or share what can be improved by [creating an issue](https://github.com/lode/trello-focus-cards/issues).

For bugs [issues](https://github.com/lode/trello-focus-cards/issues) or [Pull Requests](https://github.com/lode/trello-focus-cards/pulls) are welcome!

To develop improvements there is a [Glitch](https://glitch.com/edit/#!/trello-focus-cards) which you can remix.


## Licence

[MIT](/LICENSE)

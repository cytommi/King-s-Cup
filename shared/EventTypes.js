module.exports = {
	client: {
		JOIN_GAME: 'join-game',
		INFO_RESPONSE: 'info-response'
	},
	server: {
		BROADCAST: {
			NEW_MEMBER: 'broadcast-new-member'
		},
		ERROR: {
			INVALID_JOIN_CODE: 'error-invalid-join-code',
			DUPLICATE_CUSTOM_CODE: 'error-duplicate-custom-code'
		},
		INFO_REQUEST: 'info-request',
		JOIN_GAME_SUCCESS: 'join-game-success',
		CREATE_GAME_SUCCESS: 'create-game-success'
	}
};

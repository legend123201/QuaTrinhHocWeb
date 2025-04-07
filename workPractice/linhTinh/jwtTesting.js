const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');

function isAccessTokenExpired(accessToken) {
	try {
		const decodedToken = jwt.decode(accessToken);

		// Extract the expiration time from the decoded token
		const expirationTime = decodedToken.exp;

		// Get the current time
		const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds

		// Compare the current time with the expiration time
		if (currentTime >= expirationTime) {
			// Access token has expired
			return true;
		} else {
			// Access token is still valid
			return false;
		}
	} catch (error) {
		// Error occurred while decoding the token
		console.error('Error decoding access token:', error);
		return false; // Assuming the token is invalid or expired
	}
}

// Example usage
const accessToken = jwt.sign({ data: 'test' }, 'sails.config.jwt.secretKey', {
	expiresIn: 20,
});

const refreshToken = jwt.sign({ data: 'test' }, 'sails.config.jwt.secretKey', {
	expiresIn: 20,
});

console.log("accessToken", accessToken);
console.log("refreshToken", refreshToken);

const isExpired = isAccessTokenExpired(accessToken);
console.log('Is access token expired?', isExpired);

const now = dayjs().toISOString();
const before = dayjs().subtract(3, "day").toISOString();
console.log("now", now);
console.log("before", before);

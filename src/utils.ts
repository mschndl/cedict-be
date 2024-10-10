import dotenv from "dotenv";

dotenv.config();

// Utility function to validate that environment variables are set
export const getEnvVar = (key: string): string => {
	const value = process.env[key];
	if (!value) {
		throw new Error(`${key} is not defined in the environment variables.`);
	}
	return value;
};

// Function to get the current timestamp
export const getCurrentTime = (): string => {
	return new Date().toISOString();
};

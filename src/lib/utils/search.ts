/**
 * Helper functions for search operations
 */

/**
 * Checks if a string is a valid 5-digit zip code
 */
export const isZipCode = (value: string): boolean => /^\d{5}$/.test(value.trim());

/**
 * Checks if a string is a valid 2-letter state code
 */
export const isStateCode = (value: string): boolean => /^[A-Za-z]{2}$/.test(value.trim());

/**
 * Extracts unique values from an array
 */
export const getUniqueValues = <T>(array: T[]): T[] => [...new Set(array)];

/**
 * Builds search parameters for the API
 */
export const buildSearchParams = ({
	size,
	offset,
	sort,
	breed,
	ageMin,
	ageMax,
	zipCodes,
	searchTerm
}: {
	size: number;
	offset: number;
	sort: string;
	breed?: string | null;
	ageMin?: string | null;
	ageMax?: string | null;
	zipCodes?: string[];
	searchTerm?: string | null;
}) => ({
	size,
	from: offset.toString(),
	sort,
	...(breed ? { breeds: [breed] } : {}),
	...(ageMin ? { ageMin: Number(ageMin) } : {}),
	...(ageMax ? { ageMax: Number(ageMax) } : {}),
	...(zipCodes?.length ? { zipCodes } : {}),
	...(searchTerm ? { name: searchTerm } : {})
});

export interface SearchFilters {
	searchTerm: string | null;
	breed: string | null;
	ageMin: number | null;
	ageMax: number | null;
	location: string | null;
	sort: string | null;
}

export interface SearchParams {
	breeds?: string[];
	zipCodes?: string[];
	ageMin?: number;
	ageMax?: number;
	size?: number;
	from?: string;
	sort?: string;
}

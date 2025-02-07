import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { FiLoader } from "react-icons/fi";

import { MovieCard, SkelatonLoader } from "@/common";
import { CatalogHeader, Search } from "./components";
import { useGetShowsQuery } from "@/services/TMDB";
import { smallMaxWidth } from "@/styles";
import { IMovie } from "@/types";

const Catalog = () => {
	const [page, setPage] = useState(1);
	const [shows, setShows] = useState<IMovie[]>([]);
	const [isCategoryChanged, setIsCategoryChanged] = useState<boolean>(false);
	const [query, setQuery] = useSearchParams();
	const { category } = useParams();

	const type = query.get("type") || "popular";
	const genres = Number(query.get("genres")) || 0;
	const country = query.get("country") || "";
	const searchQuery = query.get("search") || "";
	const [sortOrder, setSortOrder] = useState<string>("asc");

	console.log("Search Query:", searchQuery);

	const { data, isLoading, isFetching } = useGetShowsQuery({
		category,
		page,
		searchQuery,
		type,
		genres,
		country,
	});

	// Reset page & shows when search query or category changes
	useEffect(() => {
		setPage(1);
		setShows([]); // Reset previous search results
		setIsCategoryChanged(true);
	}, [category, searchQuery]);

	// Update state when new data is fetched
	useEffect(() => {
		if (isLoading || isFetching) return;

		if (data?.results) {
			setShows((prev) =>
				page > 1 ? [...prev, ...data.results] : [...data.results]
			);
			setIsCategoryChanged(false);
		}
	}, [data, isFetching, isLoading, page]);

	// Sort movies based on release date
	const sortedMovies = [...shows].sort((a, b) => {
		const dateA = new Date(a.release_date || a.first_air_date).getTime();
		const dateB = new Date(b.release_date || b.first_air_date).getTime();
		return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
	});

	return (
		<>
			<CatalogHeader category={String(category)} />
			<section className={`${smallMaxWidth} `}>
				<Search setQuery={setQuery} />

				{/* Sorting Dropdown */}
				<div className='flex justify-end my-4'>
					<label className='mr-2 mt-2 text-gray-700 dark:text-gray-300'>
						Sort by:
					</label>
					<select
						value={sortOrder}
						onChange={(e) => setSortOrder(e.target.value)}
						className='p-2 border rounded bg-gray-100 dark:bg-gray-300'
					>
						<option
							value='asc'
							className='dark:bg-gray-300 dark:text-black-300'
						>
							Release Date (Oldest)
						</option>
						<option
							value='desc'
							className='dark:bg-gray-300 dark:text-black-300'
						>
							Release Date (Newest)
						</option>
					</select>
				</div>

				{isLoading || isCategoryChanged ? (
					<SkelatonLoader isMoviesSliderLoader={false} />
				) : (
					<div className='flex flex-wrap xs:gap-4 gap-[14px] justify-center'>
						{sortedMovies.map((movie) => (
							<div
								key={movie.id}
								className='relative flex flex-col xs:gap-4 gap-2 xs:max-w-[170px] max-w-[124px] rounded-lg lg:mb-6 md:mb-5 sm:mb-4 mb-[10px]'
								style={{ zIndex: 1 }}
							>
								<MovieCard
									movie={movie}
									category={String(category == "discover" ? type : category)}
								/>
							</div>
						))}
					</div>
				)}

				{isFetching && !isCategoryChanged ? (
					<div className='my-4'>
						<FiLoader className='mx-auto dark:text-gray-300 w-5 h-5 animate-spin' />
					</div>
				) : (
					<div className='w-full flex items-center justify-center'>
						<button
							type='button'
							onClick={() => setPage((prev) => prev + 1)}
							disabled={isFetching}
							className='sm:py-2 xs:py-[6px] py-1 sm:px-4 xs:px-3 px-[10.75px] bg-[#ff0000] text-gray-50 rounded-full md:text-[15.25px] sm:text-[14.75px] xs:text-[14px] text-[12.75px] shadow-md hover:-translate-y-1 transition-all duration-300 font-medium font-nunito my-4'
						>
							Load more
						</button>
					</div>
				)}
			</section>
		</>
	);
};

export default Catalog;

import { useState, useEffect } from "react";
import { FiHeart } from "react-icons/fi";
import { MovieCard } from "@/common";
import { smallMaxWidth } from "@/styles";
import { IMovie } from "@/types";
import { CatalogHeader } from "../Catalog/components";

const Favorites = () => {
	const [favoriteMovies, setFavoriteMovies] = useState<IMovie[]>([]);
	const [sortOrder, setSortOrder] = useState<string>("asc");

	// Load favorites from localStorage
	useEffect(() => {
		const storedFavorites = JSON.parse(
			localStorage.getItem("favoriteMovies") || "[]"
		);
		setFavoriteMovies(storedFavorites);
	}, []);

	// Function to remove movie from favorites
	const removeFavorite = (id: number) => {
		setFavoriteMovies((prevFavorites) => {
			const updatedFavorites = prevFavorites.filter((movie) => movie.id !== id);
			localStorage.setItem("favoriteMovies", JSON.stringify(updatedFavorites));
			return updatedFavorites;
		});
	};

	const sortedMovies = [...favoriteMovies].sort((a, b) => {
		const dateA = new Date(a.release_date || a.first_air_date).getTime();
		const dateB = new Date(b.release_date || b.first_air_date).getTime();
		return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
	});

	return (
		<>
			<CatalogHeader category={String("Favorites")} />
			<section className={`${smallMaxWidth} `}>
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

				{/* <h2 className="text-center text-2xl font-bold my-6 text-gray-300 ">Favorite Movies</h2> */}

				{sortedMovies.length === 0 ? (
					<p className='text-center text-gray-500'>No favorite movies yet.</p>
				) : (
					<div className='flex flex-wrap xs:gap-4 gap-[14px] justify-center'>
						{sortedMovies.map((movie) => (
							<div key={movie.id} className='relative'>
								<MovieCard movie={movie} category={movie.category} />
								<button
									className='absolute top-2 right-2 text-red-500 text-xl'
									onClick={() => removeFavorite(movie.id)}
								>
									<FiHeart />
								</button>
							</div>
						))}
					</div>
				)}
			</section>
		</>
	);
};

export default Favorites;

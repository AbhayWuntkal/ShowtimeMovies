import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaYoutube, FaHeart } from "react-icons/fa";

import Image from "../Image";
import { IMovie } from "@/types";
import { useMediaQuery } from "usehooks-ts";
import moment from "moment";

const MovieCard = ({
	movie,
	category,
}: {
	movie: IMovie;
	category: string;
}) => {
	const {
		poster_path,
		original_title: title,
		name,
		id,
		release_date = "",
		first_air_date = "",
	} = movie;
	const isMobile = useMediaQuery("(max-width: 380px)");
	const formattedDate = moment(release_date || first_air_date).format("YYYY");

	const [isFavorite, setIsFavorite] = useState(false);

	// Check if movie is already in favorites
	useEffect(() => {
		const storedFavorites = JSON.parse(
			localStorage.getItem("favoriteMovies") || "[]"
		);
		setIsFavorite(storedFavorites.some((fav: IMovie) => fav.id === movie.id));
	}, [movie.id]);

	// Toggle favorite status
	const toggleFavorite = () => {
		let storedFavorites: IMovie[] = JSON.parse(
			localStorage.getItem("favoriteMovies") || "[]"
		);

		if (isFavorite) {
			// Remove from favorites
			storedFavorites = storedFavorites.filter((fav) => fav.id !== movie.id);
		} else {
			// Add to favorites
			const newMovie = { ...movie, category };
			storedFavorites.push(newMovie);
		}

		localStorage.setItem("favoriteMovies", JSON.stringify(storedFavorites));
		setIsFavorite(!isFavorite);
	};

	return (
		<>
			<div className='flex flex-warp gap-0.1 px-0.1' >
				<div
					className='m-1 dark:bg-[#282a36] bg-[#f5f5f5] 
  w-[172px] h-[280px]
  flex flex-col justify-center 
  object-cover overflow-hidden rounded-md 
  drop-shadow-lw shadow-lw 
  group-hover:shadow-none group-hover:drop-shadow-none 
  transition-all duration-300 ease-in-out'
				>
					<Link
						to={`/${category}/${id}`}
						className='dark:bg-[#1f1f1f] bg-[#f5f5f5] rounded-md relative group w-full select-none xs:h-full h-full overflow-hidden'
					>
						<Image
							height={!isMobile ? 250 : 916}
							width={170}
							src={`https://image.tmdb.org/t/p/original/${poster_path}`}
							alt={title}
							className='transition-all duration-300 ease-in-out'
							effect='zoomIn'
						/>

						{/* Overlay */}
						<div className='absolute top-0 left-0 w-full h-full group-hover:opacity-100 opacity-0 bg-[rgba(0,0,0,0.6)] transition-all duration-300 rounded-md flex items-center justify-center'>
							<div className='xs:text-[48px] text-[42px] text-[#ff0000] scale-[0.4] group-hover:scale-100 transition-all duration-300 '>
								<FaYoutube />
							</div>
						</div>
					</Link>

					{/* Favorite Button (Heart Icon) */}
					<button
						onClick={toggleFavorite}
						className='absolute top-2 right-2 text-2xl'
					>
						<FaHeart
							className={isFavorite ? "text-red-500" : "text-gray-400"}
						/>
					</button>

					<p
						className='pb-2 pl-2 pt-2 dark:text-gray-300 text-left cursor-hand sm:text-base xs:text-[9px] text-[12px] font-normal w-[160px] truncate overflow-hidden whitespace-nowrap'
						title={title || name}
					>
						{title || name}
						<br />
						<div className='pr-2 pb-2 pt-2 flex justify-between dark:text-gray-400 text-gray-500 text-xs'>
							<span>{formattedDate}</span>

							<span className='text-[0.9em] leading-[1em] px-[4px] py-[2px] border border-gray-400 rounded-[3px] capitalize'>
								{category}
							</span>
						</div>
					</p>
				</div>
			</div>
		</>
	);
};

export default MovieCard;

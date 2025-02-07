import { Loader, Error, Section } from "@/common";
import { Hero } from "./components";

import { useGetShowsQuery } from "@/services/TMDB";
import { maxWidth } from "@/styles";
import { sections } from "@/constants";
import { cn } from "@/utils/helper";

const Home = () => {
	const { data, isLoading, isError } = useGetShowsQuery({
		category: "discover",
		type: "movie",
		genres: 27,

		page: 1,
	});

	if (isLoading) {
		return <Loader />;
	}

	if (isError) {
		return <Error error='Unable to fetch the movies! ' />;
	}

	const popularMovies = data?.results.slice(0, 5);

	return (
		<>
			<Hero movies={popularMovies} />
			<div className={cn(maxWidth, "lg:mt-12 md:mt-8 sm:mt-6 xs:mt-4 mt-2")}>
				{sections.map(
					({ title, category, type, genres = undefined, country = "" }) => (
						<Section
							title={title}
							category={category}
							type={type}
							key={title}
							genres={genres}
							country={country}
						/>
					)
				)}
			</div>
		</>
	);
};

export default Home;

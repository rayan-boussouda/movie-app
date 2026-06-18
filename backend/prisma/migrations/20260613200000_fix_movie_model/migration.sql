ALTER TABLE "Movies" RENAME TO "Movie";
ALTER TABLE "_GenreToMovies" RENAME TO "_MovieGenres";
ALTER TABLE "_MovieGenres" RENAME CONSTRAINT "_GenreToMovies_A_fkey" TO "_MovieGenres_A_fkey";
ALTER TABLE "_MovieGenres" RENAME CONSTRAINT "_GenreToMovies_B_fkey" TO "_MovieGenres_B_fkey";
ALTER TABLE "Genre" ADD CONSTRAINT "Genre_name_key" UNIQUE ("name");

import { vi, describe, it, expect, beforeEach } from 'vitest';
import { readFile, writeFile } from 'node:fs/promises';
import {
    loadMoviesPaginatedAsync,
    saveMoviesAsync,
    loadMoviesAsync,
    markAsWatched,
    clearMovie,
    Movies,
    addMovie,
} from './movies.js';

const fakeMovies: Movies[] = [
    {
        id: '9a809de6-2739-4fee-a627-d9d9db1fbff5',
        title: 'Avengers: End Game',
        year: 2003,
        watched: false
    },
    {
        id: 'bc47ea15-9234-481a-8778-374c48eba27e',
        title: 'Avengers: Infinity War',
        year: 1994,
        watched: true,
    },
    {
        id: 'efe45ccf-6996-431d-8d75-535861363bef',
        title: 'The Avengers',
        year: 2001,
        watched: true,
    },
];

const fakeMoviesJSON = JSON.stringify(fakeMovies);


vi.mock('node:fs/promises', () => ({
    readFile: vi.fn(),
    writeFile: vi.fn(),
}));




describe('movies.ts - Data Logic Unit Tests', () => {
    describe('loadMoviesPaginatedAsync', () => {
        it('should load and parse movies correctly without pagination', async () => {
            vi.mocked(readFile).mockResolvedValue(fakeMoviesJSON);

            const result = await loadMoviesPaginatedAsync('dummy/path.json', undefined, undefined);
            expect(readFile).toHaveBeenCalledWith('dummy/path.json', 'utf8');
            expect(readFile).toHaveBeenCalledTimes(1);
            expect(result).toEqual(fakeMovies);
        });

        it('should return a correctly paginated slice of movies', async () => {
            vi.mocked(readFile).mockResolvedValue(fakeMoviesJSON);

            // Test page 1 with limit 2
            const resultPage1 = await loadMoviesPaginatedAsync('dummy/path.son', 1, 2);
            expect(resultPage1).toEqual([fakeMovies[0], fakeMovies[1]]);
        });

        it('should throw an error if readFile fails', async () => {
            vi.mocked(readFile).mockRejectedValue(new Error('File not found'));

            await expect(loadMoviesPaginatedAsync('dummy/path.json', 1, 2)).rejects.toThrow('loadMoviesPaginatedAsync: File not found');
        });

        it('should throw an error for malformed JSON', async () => { 
            const malformedJSON = "{ jaison fail";
            vi.mocked(readFile).mockResolvedValue(malformedJSON);

            await expect(loadMoviesPaginatedAsync('dummy/path.json',1,2)).rejects.toThrow('loadMoviesPaginatedAsync:');
        });
    });

    describe('saveMoviesAsync', () => {
        it('should call writeFile with correctly stringified data', async () => {
            vi.mocked(writeFile).mockResolvedValue(undefined);
            const expectedJSON = JSON.stringify(fakeMovies, null, 2);
            await saveMoviesAsync('dummy', fakeMovies);
            expect(writeFile).toHaveBeenCalledTimes(1);
            expect(writeFile).toHaveBeenCalledWith('dummy', expectedJSON);
         });

        it('should throw an error if writeFile fails', async () => {
            const writeError = new Error('Permission denied');
            vi.mocked(writeFile).mockRejectedValue(writeError);
            await expect(saveMoviesAsync('dummy', fakeMovies)).rejects.toThrow('saveMoviesAsync: Permission denied');
         });
    });

    describe('addMoviesAsync', () => {
        it('should add a new movie to the existing list and save it', async () => {
            vi.mocked(readFile).mockResolvedValue(fakeMoviesJSON);
            vi.mocked(writeFile).mockResolvedValue(undefined);

            const newTitle = 'As good as it gets';
            const result = await addMovie(newTitle, 1992);
            expect(result.title).toBe(newTitle);
            expect(result.id).toBeDefined();

            const updatedList: Movies[] = [
                ...fakeMovies, {id:result.id, title:newTitle, year:1992, watched: false},
            ]
            expect(writeFile).toHaveBeenCalledWith(expect.any(String),
        JSON.stringify(updatedList, null, 2))
         });
    });

    describe('markMoviesDoneAsync', () => {
        it('should find a movie by ID, update its "watched" status, and save', async () => { 
            const initalMovies = [
                {id:1, title:"Avengers", watched: false, year:2001},
                {id:22, title:"Avengers 2", watched: false, year:2004}
            ];
            const idToUpdate = '22';
            const updatedMovies = [
                {id:1, title:"Avengers", watched: false, year:2001},
                {id:22, title:"Avengers 2", watched: true, year:2004}
            ];

            vi.mocked(readFile).mockResolvedValue(JSON.stringify(initalMovies));
            vi.mocked(writeFile).mockResolvedValue(undefined);

            const result = await markAsWatched(idToUpdate, true);
            expect(result).toBe(true);
            expect(writeFile).toHaveBeenCalledTimes(1);
            expect(writeFile).toHaveBeenLastCalledWith(expect.any(String), JSON.stringify(updatedMovies, null, 2));
        });

        it.todo('should throw an error if the movie to mark as done is not found', async () => { 
            const movies = [{id: 1, title: "matrix", watched:false, year:2944}]
            const nonExistentId = '4232';

            vi.mocked(readFile).mockResolvedValue(JSON.stringify(movies));
            await expect(markAsWatched(nonExistentId, true)).rejects.toThrow('Movie not found');
        });
    });

    describe('clearMoviesAsync', () => {
        it.todo('should find a movie by ID and remove it from the list before saving', async () => { });

        it.todo('should throw an error if the movie to clear is not found', async () => { });
    });
});
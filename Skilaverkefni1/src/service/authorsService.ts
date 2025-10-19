import fs from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import type { EphemeralKeyInfo } from "node:tls";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const authorsFilePath = path.join(__dirname, '../data/authors.json');

export type AuthorsResponse = {
    id: string;
    name: string;
    email: string;
    bio: string;
}

function createId() {
    return randomUUID();
}

/// LOAD AUTHORS FROM FILE - OPTIONAL PAGINATED - ASYNC
export async function loadAuthorsPaginatedAsync(
    filePath: string,
    page?: number | undefined,
    limit?: number | undefined
): Promise<AuthorsResponse[]> {
    try {
        const data = await readFile(authorsFilePath, 'utf8');
        const response = JSON.parse(data);

        if (!Array.isArray(response)) {
            throw new Error('Expected JSON array');
        }

        // If page or limit are undefined, return all authors
        if (page === undefined || limit === undefined) {
            return response;
        }

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        return response.slice(startIndex, endIndex);
    } catch (error) {
        if (error instanceof SyntaxError) {
            throw new Error('Invalid JSON format in authors file');
        }
        if (error instanceof Error) {
            throw new Error('loadAuthorsPaginatedAsync: ' + error.message);
        }
        throw new Error('loadAuthorsPaginatedAsync: Unknown error');
    }
}

/// ADD AN ARTICLE AND FORWARD TO SAVE FUNCTION
export async function addAuthor(name: string, email: string, bio: string): Promise<AuthorsResponse> {

    const authors = await loadAuthorsPaginatedAsync(authorsFilePath);
    const newAuthor = {
        id: createId(),
        name: name,
        email: email,
        bio: bio
    }

    authors.push(newAuthor);
    await saveAuthor(authors);
    return newAuthor;
}

/// CONVERT JSON TO STRING AND SAVE TO FILE DB
export async function saveAuthor(authors: AuthorsResponse[]) {
    try {
        const jsonString = JSON.stringify(authors, null, 2);
        await writeFile(authorsFilePath, jsonString, 'utf-8')
    } catch (error) {
        console.log("Error saving Articles: ", error);
    }
}

/// DELETE AN AUTHOR BY ID AND UPDATE FILE DB
export async function deleteAuthor(id: string): Promise<boolean> {
    const authors = await loadAuthorsPaginatedAsync(authorsFilePath);
    const author = authors.find((article) => { return article.id == id });

    if (!author) {
        throw new Error('Author not found');
    }

    const newArticles = authors.filter((article) => {
        return article.id !== id;
    })

    await saveAuthor(newArticles);

    return true;
}
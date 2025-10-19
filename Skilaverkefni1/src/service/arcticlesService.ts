import fs, { } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import type { EphemeralKeyInfo } from "node:tls";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const articlesFilePath = path.join(__dirname, '../data/articles.json');




export type ArticlesResponse = {
    id: string;
    title: string;
    content: string;
    authorId: string;
}

function createId() {
    return randomUUID();
}


/// LOAD ARTICLES FROM FILE - OPTIONAL PAGINATED - ASYNC
export async function loadArticlesPaginatedAsync(
    filePath: string,
    page?: number | undefined,
    limit?: number | undefined
): Promise<ArticlesResponse[]> {
    try {
        const data = await readFile(articlesFilePath, 'utf8');
        const response = JSON.parse(data);

        if (!Array.isArray(response)) {
            throw new Error('Expected JSON array');
        }

        // If page or limit are undefined, return all tasks
        if (page === undefined || limit === undefined) {
            return response;
        }

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        return response.slice(startIndex, endIndex);
    } catch (error) {
        if (error instanceof SyntaxError) {
            throw new Error('Invalid JSON format in articles file');
        }
        if (error instanceof Error) {
            throw new Error('loadArticlesPaginatedAsync: ' + error.message);
        }
        throw new Error('loadArticlesPaginatedAsync: Unknown error');
    }
}

/// ADD AN ARTICLE AND FORWARD TO SAVE FUNCTION
export async function addArticle(title: string, content: string, authorId: string): Promise<ArticlesResponse> {

    const articles = await loadArticlesPaginatedAsync(articlesFilePath);
    const newArticle = {
        id: createId(),
        title: title,
        content: content,
        authorId: authorId
    }

    articles.push(newArticle);
    await saveArticle(articles);
    return newArticle;
}

/// CONVERT JSON TO STRING AND SAVE TO FILE DB
export async function saveArticle(articles: ArticlesResponse[]) {
    try {
        const jsonString = JSON.stringify(articles, null, 2);
        await writeFile(articlesFilePath, jsonString ,'utf-8')
    } catch (error) {
        console.log("Error saving Articles: ", error);
    }
}

/// DELETE A ARTICLE BY ID AND UPDATE FILE DB
export async function deleteArticle(id:string):Promise<boolean> {
    const articles = await loadArticlesPaginatedAsync(articlesFilePath);
    const article = articles.find((article) => {return article.id == id});

    if (!article) {
        throw new Error('Article not found');
    }

    const newArticles = articles.filter((article) => {
        return article.id !== id;
    })

    await saveArticle(newArticles);

    return true;
}

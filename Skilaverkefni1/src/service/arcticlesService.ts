import fs, { } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import type { EphemeralKeyInfo } from "node:tls";

const fileName = "../data/articles.json";
export type Articles = {
    id: string;
    title: string;
    content: string;
    authorId: string;
}

function createId() {
    return randomUUID();
}

export async function loadArticles(): Promise<Articles[]> {
    try {
        const result = await readFile(fileName, 'utf-8');

        if (result.trim() === "") {
            console.log("Warning: File is empty, maybe add some articles?")
            return [];
        }

        const allArticlesParsed = JSON.parse(result);
        return allArticlesParsed;
    } catch (error) {
        console.log("Error loading articles: ", error);
        return [];
    }
}

export async function addArticle(title:string, content:string, authorId:string):Promise<Articles> {
    
    const articles = await loadArticles();
    const newArticle = {
        id:createId(),
        title:title,
        content:content,
        authorId:authorId
    }

    articles.push(newArticle);
   await saveArticle(articles);
    return newArticle;
}

export async function saveArticle(articles: Articles[]) {
    try {
        const jsonString = JSON.stringify(articles, null, 2);
        await writeFile(fileName, 'utf-8')
    } catch (error) {
        console.log("Error saving Articles: ", error);
    }
}
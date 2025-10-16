import fs from "node:fs";
import {readFile, writeFile} from "node:fs/promises";
import { randomUUID} from "node:crypto";
import type { EphemeralKeyInfo } from "node:tls";

export type Authors = {
    id:string;
    name:string;
    email:string;
    bio:string;
}
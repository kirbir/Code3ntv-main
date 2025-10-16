import {defineConfig} from 'vitest/config';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test'});

export default defineConfig({
    test: {
      include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)', '**/*-test.?(c|m)[jt]s?(x)']
    }
  });
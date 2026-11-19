import { z } from 'zod';

// In the browser the web app's CSP forbids eval. Zod 4 probes `new Function` to decide whether
// to JIT-compile object parsers, and every blocked probe is reported as a CSP violation.
// The server keeps the JIT.
if (typeof document !== 'undefined') z.config({ jitless: true });

export * from './roles';
export * from './auth';
export * from './courses';
export * from './progress';
export * from './exercises';
export * from './checks';
export * from './assignments';
export * from './reviews';
export * from './quizzes';
export * from './portfolio';
export * from './analytics';
export * from './ai';
export * from './libraries';
export * from './groups';
export * from './accounts';
export * from './monitoring';
export * from './catalog';
export * from './slug';
export * from './books';
export * from './chatbot';
export * from './stats';
export * from './assessments';
export * from './experiment';
export * from './surveys';
export * from './item-analysis';
export * from './activity';
export * from './book-search';
export * from './lesson-blocks';
export * from './glossary';
export * from './certificates';
export * from './notifications';

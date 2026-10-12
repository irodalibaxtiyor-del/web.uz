import type { NextConfig } from 'next';

const apiUrl = process.env.API_URL ?? 'http://localhost:4000';
const dev = process.env.NODE_ENV !== 'production';
const sandboxOrigin = new URL(process.env.NEXT_PUBLIC_SANDBOX_URL ?? 'http://127.0.0.1:3100')
  .origin;

/**
 * Content Security Policy for the web app. Student code never runs on this origin (it runs in
 * the sandbox site, allowed only as a frame), so the policy mainly limits what an injected
 * script could load or send. `'unsafe-inline'` scripts are still needed by Next.js bootstrap
 * code; moving to nonces is a known follow-up.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self'${dev ? ' ws: wss:' : ''}`,
  `frame-src ${sandboxOrigin}`,
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // The browser talks only to this origin; the session cookie stays first-party.
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${apiUrl}/:path*` }];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
          },
          ...(dev
            ? []
            : [{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }]),
        ],
      },
    ];
  },
};

export default nextConfig;

import {createProxyMiddleware} from "http-proxy-middleware"



const createProxyMiddlewareForTarget=(target)=>{
    return createProxyMiddleware(`/api/v1/${target}`, {
        target: 'http://localhost:3000', // Replace with your actual target URL
        changeOrigin: true, // This will change the origin of the host header to the target URL
        pathRewrite: {
          '^/api/v1/auth': '', // Remove the /api/v1/auth prefix when forwarding to the target
        },
        onProxyReq: (proxyReq, req, res) => {
          // Add custom headers for security
          proxyReq.setHeader('X-Added-Header', 'some-value');
        },
        onProxyRes: (proxyRes, req, res) => {
          // Modify response headers for security
          proxyRes.headers['X-Secure-Header'] = 'secure-value';
        },
      });
}

export default createProxyMiddlewareForTarget;

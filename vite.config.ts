import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'
import * as path from "path";

// https://vitejs.dev/config/


export default ({mode}) => {
  const env = loadEnv(mode,process.cwd());
  console.info('-----env.config-----')
  console.info(env)
  return defineConfig({
    plugins: [
      react()
    ],
    resolve:{
      alias:{
        '@':path.resolve(__dirname,'./src')
      }
    },
    server: {
      host: "0.0.0.0", // 指定服务器应该监听哪个 IP 地址。 如果将此设置为 0.0.0.0 或者 true 将监听所有地址，包括局域网和公网地址。
      port: 3000, //指定开发服务器端口。注意：如果端口已经被使用，Vite 会自动尝试下一个可用的端口
      proxy: {
        '/system': {
          target: "http://127.0.0.1:8001",//env.VITE_API,
          changeOrigin: true,
          //rewrite: path => path.replace(/^\/api/, "") //因为实际的地址不带api，所以要去掉api
        },
        '/article': {
          target: "http://127.0.0.1:8004",//env.VITE_API,
          changeOrigin: true,
          //rewrite: path => path.replace(/^\/api/, "") //因为实际的地址不带api，所以要去掉api
        },
        '/warehouse':{
          target: "http://127.0.0.1:8002",//env.VITE_API,
          changeOrigin: true,
        }
      }
    },
    build:{
      outDir: "dist", // 指定输出路径（相对于 项目根目录).
      minify: "esbuild",  //设置为 false 可以禁用最小化混淆，或是用来指定使用哪种混淆器。默认为 Esbuild，它比 terser 快 20-40 倍，压缩率只差 1%-2%
      rollupOptions: {
        output: {
          chunkFileNames: "js/[name]-[hash].js",
          entryFileNames: "js/[name]-[hash].js",
          assetFileNames: "[ext]/[name]-[hash].[ext]"
        }
      }
    }
  })
}
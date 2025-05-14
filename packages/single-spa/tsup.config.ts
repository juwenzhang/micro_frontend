import { defineConfig } from 'tsup'
export default defineConfig({
  format: ['esm', 'cjs', "iife"],
  entry: ['src/index.ts'],
  dts: true, 
  splitting: false, 
  sourcemap: true, 
  clean: true, 
  outDir: 'dist/', // 输出目录
  // minify: true, // 压缩代码
  // bundle: true, // 打包所有依赖项  为了打包的东西看得懂一点，这里先关闭此功能
  target: 'es2015', // 目标环境
  keepNames: true, // 保留原始名称
  esbuildOptions: (options) => { // esbuild 选项
    options.banner = { // 添加版权信息
      js: '/* Copyright 2025-github, juwenzhang */',
    }
  },
  outExtension({ format }) {
    return {
      js: `.${format}.js`,
    }
  },
})
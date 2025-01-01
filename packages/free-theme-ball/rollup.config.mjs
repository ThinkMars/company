import { defineConfig } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import vue from 'rollup-plugin-vue'
import dts from 'rollup-plugin-dts'
import postcss from 'rollup-plugin-postcss'
import typescript from 'rollup-plugin-typescript2'

export default defineConfig([
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/index.mjs',
        format: 'es',
        sourcemap: true,
      },
    ],
    external: ['vue', 'color'],
    plugins: [
      vue(),
      postcss({
        // 处理 CSS
        plugins: [], // 这里可以添加 PostCSS 插件，例如 autoprefixer
        extract: false, // 提取 CSS 到单独的文件
      }),
      typescript({
        // tsconfig.json 默认位置是项目根目录
        tsconfigOverride: {
          compilerOptions: {
            module: 'ESNext', // 重要：确保 Rollup 可以处理模块
            target: 'es6', // 或者你需要的其他目标
          },
        },
      }),
      resolve(),
      commonjs(),
    ],
  },
  {
    input: 'dist/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
])

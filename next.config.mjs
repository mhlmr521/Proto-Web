import { withContentlayer } from "next-contentlayer";

/** @type {import('next').NextConfig} */
const nextConfig = {
	pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
	experimental: {
		mdxRs: true,
	},
	// 添加配置解决警告
	outputFileTracingRoot: process.cwd(),
	// 启用standalone输出用于Docker部署
	output: 'standalone',
};

export default withContentlayer(nextConfig);

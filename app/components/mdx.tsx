// @ts-nocheck
import * as React from "react";
import Image from "next/image";
import Link from "next/link";

function clsx(...args: any) {
	return args.filter(Boolean).join(" ");
}

interface MdxProps {
	code: string;
}

export function Mdx({ code }: MdxProps) {
	// 临时解决方案：直接渲染原始内容而不是编译的 MDX
	// 这样可以避免 useMDXComponent 的兼容性问题
	
	try {
		// 尝试执行编译后的代码
		const Component = new Function('React', 'return ' + code)(React);
		return (
			<div className="mdx">
				<Component />
			</div>
		);
	} catch (error) {
		console.error('MDX compilation error:', error);
		return (
			<div className="mdx">
				<div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
					<h3>Content Loading Error</h3>
					<p>There was an issue loading the content for this project.</p>
					<details>
						<summary>Technical Details</summary>
						<pre className="text-xs mt-2">{error.toString()}</pre>
					</details>
				</div>
			</div>
		);
	}
}

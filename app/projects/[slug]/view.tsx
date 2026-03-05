"use client";

import { useEffect } from "react";

export const ReportView: React.FC<{ slug: string }> = ({ slug }) => {
	useEffect(() => {
		fetch("/api/incr", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ slug }),
		}).catch((error) => {
			// 静默处理错误，避免在控制台显示错误
			console.debug("View tracking failed:", error);
		});
	}, [slug]);

	return null;
};

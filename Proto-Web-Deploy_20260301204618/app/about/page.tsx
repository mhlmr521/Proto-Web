"use client";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";

export default function AboutPage() {
	return (
		<div className="bg-gradient-to-tl from-zinc-900/0 via-zinc-900 to-zinc-900/0">
			<Navigation />
			<div className="container flex items-center justify-center min-h-screen px-4 mx-auto">
				<div className="max-w-4xl mx-auto mt-32 sm:mt-0">
					<Card>
						<div className="p-8 md:p-16">
							<h1 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl mb-8">
								About Me
							</h1>
							
							<div className="space-y-6 text-zinc-400 leading-relaxed">
								<p className="text-lg">
									Hi there! I'm Hope, a passionate developer who loves creating innovative solutions 
									and building meaningful digital experiences.
								</p>
								
								<p>
									I specialize in full-stack development with a focus on modern web technologies. 
									My journey in tech has been driven by curiosity and a desire to solve real-world 
									problems through code.
								</p>
								
								<p>
									When I'm not coding, you can find me exploring new technologies, contributing to 
									open-source projects, or sharing knowledge with the developer community.
								</p>
								
								<div className="mt-8">
									<h2 className="text-xl font-semibold text-zinc-200 mb-4">Skills & Technologies</h2>
									<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
										<div className="text-sm">
											<span className="text-zinc-300">Frontend:</span>
											<p>React, Next.js, TypeScript</p>
										</div>
										<div className="text-sm">
											<span className="text-zinc-300">Backend:</span>
											<p>Node.js, Python, APIs</p>
										</div>
										<div className="text-sm">
											<span className="text-zinc-300">Database:</span>
											<p>PostgreSQL, MongoDB</p>
										</div>
										<div className="text-sm">
											<span className="text-zinc-300">Tools:</span>
											<p>Git, Docker, AWS</p>
										</div>
										<div className="text-sm">
											<span className="text-zinc-300">Design:</span>
											<p>Figma, Tailwind CSS</p>
										</div>
										<div className="text-sm">
											<span className="text-zinc-300">Other:</span>
											<p>GraphQL, Redis, CI/CD</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}
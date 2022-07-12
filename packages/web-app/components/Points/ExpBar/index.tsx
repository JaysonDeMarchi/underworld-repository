/** @jsxImportSource theme-ui */
import React from 'react';
import './assets/exp.css';

export interface ExpBarInterface {
	level: number,
	width: number,
}

export default function ExpBar({
	level,
	width
}: ExpBarInterface) {
	const showWidth = width + "%";
	return <>
		<div className="ExpBar">
			<div className="full-bar">
				<div className="exp-level"><span className="content">{level}</span></div>
				<div className="exp-background">
					<div className="exp-bar" sx={{width: showWidth}}></div>
					<div className="exp-foreground"></div>
				</div>
			</div>
		</div>
	</>;
}

/** @jsxImportSource theme-ui */
import React from 'react';
import './assets/pointhistory.css';

export default function PointHistory({
	faction,
	value,
	direction,
	source,
	username
}) {
	var indicator = "+"
	if(!direction){
		indicator = "-"
	}
	return <>
		<div className="PointHistory">
			<div className="pointCapsule">
				<div className={"pointFaction " + faction.toLowerCase()}>{faction} {indicator + value}</div>
				<div className="pointType">{source}</div>
				<div className="pointUser">{username}</div>
			</div>
		</div>
	</>;
}

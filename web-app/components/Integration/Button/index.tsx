/** @jsxImportSource theme-ui */
import React from 'react';

export default function Button({
	id,
	label,
	url,
}) {
	return <>
		<a href={url} id={id}>{label}</a>
	</>;
}

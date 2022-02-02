import React from 'react';

function TableBody (props) {
	const rows = props.characterData.map((row, index) => {
	  return (
		<tr key={index}>
			<td>{row.name}</td>
			<td>{row.job}</td>
			<td>{row._id}</td>
			<td>
				<input type="button" value="Delete" onClick={() => props.removeCharacter(row._id)} />
			</td>
		</tr>
	  );
	});
	
	return (
		<tbody>
		   {rows}
		</tbody>
	 );
}

function TableHeader() {
	return (
	  <thead>
		<tr>
		  <th>Name</th>
		  <th>Job</th>
		  <th>ID</th>
		  <th>Remove</th>
		</tr>
	  </thead>
	);
}


function Table(props) {
	return (
	  <table>
		<TableHeader />
		<TableBody characterData={props.characterData} removeCharacter={props.removeCharacter} />
	  </table>
	);
}

export default Table;
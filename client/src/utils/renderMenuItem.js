import React from 'react';
import MenuItem from 'material-ui/MenuItem';

export default itemArray => {
	return itemArray.map(itemValue => {
		return (
			<MenuItem key={itemValue} value={itemValue} primaryText={itemValue} />
		);
	});
};

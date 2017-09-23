import React, { Component } from 'react';
import {
	Table,
	TableBody,
	TableHeader,
	TableHeaderColumn,
	TableRow,
	TableRowColumn
} from 'material-ui/Table';

class RaceCategoryTable extends Component {
	renderEarlyBirdHeaderColumn(style) {
		return <TableHeaderColumn style={style}>Early Bird (RM)</TableHeaderColumn>;
	}
	renderCategoryRowColumn(style) {
		const { race } = this.props;
		let earlyBirdRowColumn = null;
		return race.categories.map(category => {
			if (race.hasEarlyBirdRate) {
				earlyBirdRowColumn = (
					<TableRowColumn style={style.priceColumns}>
						{category.price.earlyBird}
					</TableRowColumn>
				);
			}
			return (
				<TableRow key={category._id}>
					<TableRowColumn style={style.categoryColumn}>
						{category.name}
					</TableRowColumn>
					{earlyBirdRowColumn}
					<TableRowColumn style={style.priceColumns}>
						{category.price.normal}
					</TableRowColumn>
				</TableRow>
			);
		});
	}

	render() {
		const { race } = this.props;
		const style = {
			categoryColumn: {
				width: race.hasEarlyBirdRate ? '40%' : '75%',
				whiteSpace: 'normal',
				wordWrap: 'break-word'
			},
			priceColumns: {
				whiteSpace: 'normal',
				wordWrap: 'break-word'
			}
		};

		return (
			<div style={{ overflowX: 'auto' }}>
				<Table>
					<TableHeader adjustForCheckbox={false} displaySelectAll={false}>
						<TableRow>
							<TableHeaderColumn style={style.categoryColumn}>
								Category
							</TableHeaderColumn>
							{race.hasEarlyBirdRate
								? this.renderEarlyBirdHeaderColumn(style.priceColumns)
								: null}
							<TableHeaderColumn style={style.priceColumns}>
								Normal (RM)
							</TableHeaderColumn>
						</TableRow>
					</TableHeader>
					<TableBody displayRowCheckbox={false} showRowHover={true}>
						{this.renderCategoryRowColumn(style)}
					</TableBody>
				</Table>
			</div>
		);
	}
}

export default RaceCategoryTable;

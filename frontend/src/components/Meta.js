import React from 'react';
import { Helmet } from 'react-helmet';

const Meta = ({ title, description, keywords }) => {
	return (
		<Helmet>
			<title>{title}</title>
			<meta name='description' content={description} />
			<meta name='keywords' content={keywords} />
		</Helmet>
	);
};

Meta.defaultProps = {
	title: 'Welcome to Online store',
	description: 'We sell the best cheap products',
	keywords: 'toys',
};

export default Meta;

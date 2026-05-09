import React, { useState } from 'react';
import FeatureProducts from '../FeatureProducts/FeatureProducts';
import { Helmet } from 'react-helmet';

const Products = () => {
   const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  return (
    <>
      <Helmet>
        <title>Products Page</title>
      </Helmet>
       <FeatureProducts 
        selectedCategoryId={selectedCategoryId}
        setSelectedCategoryId={setSelectedCategoryId}
      />
    </>
  );
}

export default Products;
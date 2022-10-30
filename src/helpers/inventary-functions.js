const mysql = require('mysql');
inventaryFns = {};

inventaryFns.updateProduct = (connection, productData, productID ) => {
    // connection.
    const updateQuery = `UPDATE products set product_name = '${productData.product_name}', product_stock = '${productData.product_stock}', product_sellingprice = '${productData.product_sellingprice}', product_adquisitionprice = '${productData.product_adquisitionprice}', product_description = '${productData.product_description}', product_category = '${productData.productCategory}' WHERE product_id = ${productID}`
    console.log(updateQuery);
    connection.query(updateQuery, (error, results, fields) => {
        if (error) {
            console.error(error);
            return;
        } else if (results) {
            console.log('Update correcto weon');
            console.log(results);
            return results;
        }
    })
}

inventaryFns.deleteProduct = (connection, productID) => {
    const deleteQuery = `DELETE FROM products WHERE product_id=${productID}`;
    connection.query(deleteQuery, (error, results, fields) => {
        if (error) {
            console.error(error);
            return;
        } else if (results) {
            console.log(results);
            return results;
        }
    })
}
 
module.exports = inventaryFns;
const mysql = require('mysql');
inventaryFns = {};

inventaryFns.updateProduct = (db, productData, productID ) => {
    // connection.
    const updateQuery = `UPDATE products set product_name = '${productData.product_name}', product_stock = '${productData.product_stock}', product_sellingprice = '${productData.product_sellingprice}', product_adquisitionprice = '${productData.product_adquisitionprice}', product_description = '${productData.product_description}', product_category = '${productData.product_category}', product_code = '${productData.product_code}' WHERE product_id = (?)`
    console.log(updateQuery);
    db.run(updateQuery, productID, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('data changed all good');
        };
    });
}

inventaryFns.deleteProduct = (db, productID) => {
    const deleteQuery = `DELETE FROM products WHERE product_id=(?)`;
    db.run(deleteQuery,productID, (err) => {
        if (err) {
            console.error(err)
        } else {
            console.log('Deleted from db')
        }
    });
}
 
module.exports = inventaryFns;
const Order = require("../model/order.model");
const User = require("../model/user.model");
const UserNewV = require("../model/usernewv.model");
const Product = require("../model/product.model");
const Category = require("../model/category.model");

exports.dashboard = async (req, res, next) => {
    var response = {
        status: true,
        message: "Data Found",
        data: {
            widget: { orders: 0, users: 0, employee: 0, product: 0, category: 0 },
            piechart: []
        },
        error: null
    };
    try {

        response.data.widget.orders = await Order.countDocuments();
        response.data.widget.users = await User.countDocuments();
        response.data.widget.employee = await UserNewV.countDocuments({ role: "employee" });
        response.data.widget.product = await Product.countDocuments();
        response.data.widget.category = await Category.countDocuments();
        response.data.piechart = await Order.aggregate([
            {
                $sortByCount: "$status"
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $arrayToObject: [
                            [
                                {
                                    k: "$_id", // Use the status value ("TO-DO") as the key name
                                    v: "$count" // Use the count (2) as the value
                                }
                            ]
                        ]
                    }
                }
            }
        ]);
        res.send(response);
    } catch (error) {
        response.status = false;
        response.message = 'Unable to update user.';
        response.error = error;
        res.status(500).send(response);
    }

}

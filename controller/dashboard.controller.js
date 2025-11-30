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
        // Aggregate counts per status and produce a single object mapping each expected
        // status to its count. Missing statuses will be present with value 0.
        // Example output:
        // { "In-progress": 1, "TO-DO": 1, "Done": 0, "Cancle": 0, "Hold": 0 }

        // Define the expected set of statuses you want present in the output.
        // Adjust this list if your app uses different status strings.
        const expectedStatuses = ["In-progress", "TO-DO", "Done", "Cancle", "Hold"];

        const rawCounts = await Order.aggregate([
            { $sortByCount: "$status" }
        ]); // becomes [{ _id: 'TO-DO', count: 3 }, ...]

        // Start with all statuses set to 0, then fill in existing counts
        const statusMap = expectedStatuses.reduce((acc, s) => { acc[s] = 0; return acc; }, {});
        rawCounts.forEach(r => {
            // if the status returned by DB matches one of expectedStatuses, set it
            // otherwise include it too so we don't drop unexpected statuses
            if (r && r._id) {
                statusMap[r._id] = (typeof r.count === 'number') ? r.count : Number(r.count) || 0;
            }
        });

        response.data.piechart = statusMap;
        res.send(response);
    } catch (error) {
        response.status = false;
        response.message = 'Unable to update user.';
        response.error = error;
        res.status(500).send(response);
    }

}

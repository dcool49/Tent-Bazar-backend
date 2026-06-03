const Order = require("../model/order.model");
const User = require("../model/user.model");
const UserNewV = require("../model/usernewv.model");
const Product = require("../model/product.model");
const Category = require("../model/category.model");
const common = require("../common/common");

exports.dashboard = async (req, res, next) => {
    var response = {
        status: true,
        message: "Data Found",
        data: {
            widget: { orders: 0, users: 0, employee: 0, product: 0, category: 0 },
            piechart: [],
            recent: { orders: [], products: [], users: [] }
            ,
            weeklyChart: { labels: [], datasets: [] }
        },
        error: null
    };
    try {

        const { startDate, endDate } = req.query;
        const parseDate = (value) => {
            const date = value ? new Date(value) : null;
            return date instanceof Date && !isNaN(date) ? date : null;
        };

        const currentStart = parseDate(startDate);
        const currentEnd = parseDate(endDate);
        const now = new Date();
        const rangeStart = currentStart || (() => {
            const d = new Date();
            const day = d.getDay();
            const diff = (day + 6) % 7;
            d.setDate(d.getDate() - diff);
            d.setHours(0, 0, 0, 0);
            return d;
        })();
        const rangeEnd = currentEnd || now;
        const dateFilter = { createdAt: { $gte: rangeStart, $lte: rangeEnd } };
        const isDateFilterApplied = !!(currentStart || currentEnd);

        response.data.widget.orders = await Order.countDocuments(isDateFilterApplied ? dateFilter : {});
        response.data.widget.users = await User.countDocuments({});
        response.data.widget.employee = await UserNewV.countDocuments({ role: "employee" });
        response.data.widget.product = await Product.countDocuments({});
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

        const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const getWeekStart = (date) => {
            const d = new Date(date);
            const day = d.getDay();
            const diff = (day + 6) % 7;
            d.setDate(d.getDate() - diff);
            d.setHours(0, 0, 0, 0);
            return d;
        };
        const getWeekEnd = (startDate) => {
            const d = new Date(startDate);
            d.setDate(d.getDate() + 6);
            d.setHours(23, 59, 59, 999);
            return d;
        };
        const buildWeekArray = (aggregation) => {
            const counts = aggregation.reduce((acc, item) => {
                if (item && item._id) {
                    acc[item._id] = item.count;
                }
                return acc;
            }, {});
            const mondayToSunday = [2, 3, 4, 5, 6, 7, 1];
            return mondayToSunday.map(day => counts[day] || 0);
        };

        const currentWeekStart = isDateFilterApplied ? rangeStart : getWeekStart(new Date());
        const currentWeekEnd = rangeEnd;
        const previousWeekStart = new Date(currentWeekStart);
        previousWeekStart.setDate(previousWeekStart.getDate() - 7);
        const previousWeekEnd = new Date(currentWeekEnd);
        previousWeekEnd.setDate(previousWeekEnd.getDate() - 7);

        const currentWeekAgg = await Order.aggregate([
            { $match: { createdAt: { $gte: rangeStart, $lte: rangeEnd } } },
            { $group: { _id: { $dayOfWeek: '$createdAt' }, count: { $sum: 1 } } }
        ]);
        const previousWeekAgg = await Order.aggregate([
            { $match: { createdAt: { $gte: previousWeekStart, $lte: previousWeekEnd } } },
            { $group: { _id: { $dayOfWeek: '$createdAt' }, count: { $sum: 1 } } }
        ]);

        response.data.weeklyChart = {
            labels,
            datasets: [
                {
                    label: 'Current Week',
                    data: buildWeekArray(currentWeekAgg),
                    backgroundColor: '#6366f1',
                    borderRadius: 6,
                    borderSkipped: false,
                },
                {
                    label: 'Previous Week',
                    data: buildWeekArray(previousWeekAgg),
                    backgroundColor: '#e0e7ff',
                    borderRadius: 6,
                    borderSkipped: false,
                },
            ]
        };

        // Fetch 5 most recent orders, products and users
        try {
            const recentOrders = await Order.find(isDateFilterApplied ? dateFilter : {})
                .sort({ createdAt: -1, _id: -1 })
                .limit(5)
                .populate([
                    { path: 'empId', select: ["-password", "-passwordToShow"] },
                    { path: 'buyerId', select: ["-password", "-passwordToShow"] },
                    'productDetails.productId'
                ])
                .lean();

            response.data.recent.orders = common.manageImageNameForOrder(recentOrders, '/ProductImage/');

            const recentProducts = await Product.find(isDateFilterApplied ? dateFilter : {})
                .sort({ createdAt: -1, _id: -1 })
                .limit(5)
                .lean();
            response.data.recent.products = common.manageImageName(recentProducts, '/ProductImage/');

            const recentUsers = await User.find(isDateFilterApplied ? dateFilter : {})
                .sort({ createdAt: -1, _id: -1 })
                .limit(5)
                .select('-password -passwordToShow')
                .lean();
            response.data.recent.users = recentUsers;
        } catch (errRecent) {
            // Non-fatal: include empty recent arrays and continue to send dashboard counts
            console.error('Failed to fetch recent items for dashboard:', errRecent);
        }

        res.send(response);
    } catch (error) {
        response.status = false;
        response.message = 'Unable to fetch dashboard data.';
        response.error = error;
        res.status(500).send(response);
    }

}

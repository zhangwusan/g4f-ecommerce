

export const data = {
    ordres: [
        {
            order_id: 1,
            user_id: 1,
            order_date: new Date(),
            total_amount: 85.50,
            shipping_address: '123 Elm Street, Springfield, IL',
            order_status: 'Shipped',
            create_at: new Date(),
            update_at: new Date()
        },
        {
            order_id: 2,
            user_id: 2,
            order_date: new Date(),
            total_amount: 120.00,
            shipping_address: '456 Oak Avenue, Springfield, IL',
            order_status: 'Processing',
            create_at: new Date(),
            update_at: new Date()
        },
        {
            order_id: 3,
            user_id: 3,
            order_date: new Date(),
            total_amount: 59.99,
            shipping_address: '789 Pine Road, Springfield, IL',
            order_status: 'Delivered',
            create_at: new Date(),
            update_at: new Date()
        },
        {
            order_id: 4,
            user_id: 4,
            order_date: new Date(),
            total_amount: 40.75,
            shipping_address: '101 Maple Blvd, Springfield, IL',
            order_status: 'Cancelled',
            create_at: new Date(),
            update_at: new Date()
        },
        {
            order_id: 5,
            user_id: 5,
            order_date: new Date(),
            total_amount: 250.00,
            shipping_address: '202 Birch Lane, Springfield, IL',
            order_status: 'Shipped',
            create_at: new Date(),
            update_at: new Date()
        },
        {
            order_id: 6,
            user_id: 6,
            order_date: new Date(),
            total_amount: 145.20,
            shipping_address: '303 Cedar Way, Springfield, IL',
            order_status: 'Processing',
            create_at: new Date(),
            update_at: new Date()
        },
        {
            order_id: 7,
            user_id: 7,
            order_date: new Date(),
            total_amount: 75.50,
            shipping_address: '404 Redwood Path, Springfield, IL',
            order_status: 'Delivered',
            create_at: new Date(),
            update_at: new Date()
        },
        {
            order_id: 8,
            user_id: 8,
            order_date: new Date(),
            total_amount: 99.99,
            shipping_address: '505 Willow Terrace, Springfield, IL',
            order_status: 'Shipped',
            create_at: new Date(),
            update_at: new Date()
        },
        {
            order_id: 9,
            user_id: 9,
            order_date: new Date(),
            total_amount: 65.00,
            shipping_address: '606 Cherry Circle, Springfield, IL',
            order_status: 'Cancelled',
            create_at: new Date(),
            update_at: new Date()
        },
        {
            order_id: 10,
            user_id: 10,
            order_date: new Date(),
            total_amount: 110.50,
            shipping_address: '707 Ash Street, Springfield, IL',
            order_status: 'Delivered',
            create_at: new Date(),
            update_at: new Date()
        }
    ],
    order_items: [
        {
            order_item_id: 1,
            order_id: 1,
            product_id: 1,
            quantity: 2,
            price_at_purchase: 30.00
        },
        {
            order_item_id: 2,
            order_id: 1,
            product_id: 4,
            quantity: 1,
            price_at_purchase: 25.50
        },
        {
            order_item_id: 3,
            order_id: 2,
            product_id: 3,
            quantity: 1,
            price_at_purchase: 59.99
        },
        {
            order_item_id: 4,
            order_id: 2,
            product_id: 6,
            quantity: 2,
            price_at_purchase: 20.00
        },
        {
            order_item_id: 5,
            order_id: 3,
            product_id: 8,
            quantity: 1,
            price_at_purchase: 40.00
        },
        {
            order_item_id: 6,
            order_id: 3,
            product_id: 10,
            quantity: 1,
            price_at_purchase: 35.00
        },
        {
            order_item_id: 7,
            order_id: 4,
            product_id: 5,
            quantity: 3,
            price_at_purchase: 13.50
        },
        {
            order_item_id: 8,
            order_id: 4,
            product_id: 7,
            quantity: 1,
            price_at_purchase: 22.00
        },
        {
            order_item_id: 9,
            order_id: 5,
            product_id: 2,
            quantity: 2,
            price_at_purchase: 15.00
        },
        {
            order_item_id: 10,
            order_id: 5,
            product_id: 9,
            quantity: 1,
            price_at_purchase: 50.50
        }
    ],
}
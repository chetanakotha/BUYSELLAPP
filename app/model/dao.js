import db from "./db";

// PRODUCTS
// Create a new product
export const createProduct = (
  name,
  userId,
  price,
  description,
  status,
  image,
  quantity,
  categoryId,
  callback
) => {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO products (name, user_id, price, description, status, image, quantity, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [name, userId, price, description, status, image, quantity, categoryId],
      (_, result) => {
        callback({success: true, product: {id: result.insertId, name, userId, price, description, status, image, quantity, categoryId}});
      },
      (_, error) => {
        callback({success: false, message: error.message});
      }
    );
  });
};

// Get all category
export const getProducts = (callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM products",
      [],
      (_, result) => {
        callback({success: true, products: result.rows._array});
      },
      (_, error) => {
        callback({success: false, message: error.message});
      }
    );
  });
};

// Get a product
export const getProduct = (productId, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM products WHERE id = ?",
      [productId],
      (_, result) => {
        callback({success: true, product: result.rows._array[0]});
      },
      (_, error) => {
        callback({success: false, message: error.message});
      }
    );
  });
};

// Get category by user
export const getProductsByUser = (userId, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM products WHERE user_id = ?",
      [userId],
      (_, result) => {
        console.log("Result:", result);
        callback({success: true, products: result.rows._array});
      },
      (_, error) => {
        callback({success: false, message: error.message});
      }
    );
  });
};

// Get products by category
export const getProductsByCategory = (categoryId, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM products WHERE category_id = ?",
      [categoryId],
      (_, result) => {
        callback({success: true, products: result.rows._array});
      },
      (_, error) => {
        callback({success: false, message: error.message});
      }
    );
  });
};

// Update a product
export const updateProduct = (
  productId,
  name,
  price,
  description,
  status,
  image,
  quantity,
  callback
) => {
  db.transaction((tx) => {
    tx.executeSql(
      "UPDATE products SET name = ?, price = ?, description = ?, status = ?, image = ?, quantity = ? WHERE id = ?",
      [name, price, description, status, image, quantity, productId],
      (_, result) => {
        callback({success: true, user: {id: productId, name, price, description, status, image}});
      },
      (_, error) => {
        callback({success: false, message: error.message});
      }
    );
  });
};

// Delete a product
export const deleteProduct = (productId, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      "DELETE FROM products WHERE id = ?",
      [productId],
      (_, result) => {
        callback({success: true, user: {id: productId}});
      },
      (_, error) => {
        callback({success: false, message: error.message});
      }
    );
  });
};

// Get all categories
export const getCategories = (callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM categories",
      [],
      (_, result) => {
        callback({success: true, categories: result.rows._array});
      },
      (_, error) => {
        callback({success: false, message: error.message});
      }
    );
  });
};

// PURCHASE REQUESTS
// Create a new purchases request
export const createPurchaseRequest = (buyerId, vendorId, productId, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO purchase_requests (buyer_id, vendor_id, status, product_id) VALUES (?, ?, ?, ?)",
      [buyerId, vendorId, "pending", productId],
      (_, result) => {
        callback({success: true, purchaseRequest: {id: result.insertId, buyerId, vendorId, status: "pending", productId}});
      },
      (_, error) => {
        callback({success: false, message: error.message});
      }
    );
  });
};

// Get all purchases requests
export const getPurchaseRequests = (vendorId, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM purchase_requests WHERE vendor_id = ?",
      [vendorId],
      (_, result) => {
        callback({success: true, requests: result.rows._array});
      },
      (_, error) => {
        callback({success: false, message: error.message});
      }
    );
  });
};

// Accept a purchases request
export const acceptPurchaseRequest = (purchaseRequestId, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      "UPDATE purchase_requests SET status = ? WHERE id = ?",
      ["accepted", purchaseRequestId],
      (_, result) => {
        callback({success: true, purchaseRequest: {id: purchaseRequestId, status: "accepted"}});
      },
      (_, error) => {
        callback({success: false, message: error.message});
      }
    );
  });
};

// Decline a purchases request
export const declinePurchaseRequest = (purchaseRequestId, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      "UPDATE purchase_requests SET status = ? WHERE id = ?",
      ["declined", purchaseRequestId],
      (_, result) => {
        callback({success: true, purchaseRequest: {id: purchaseRequestId, status: "declined"}});
      },
      (_, error) => {
        callback({success: false, message: error.message});
      }
    );
  });
};

// USERS
// Register a new user
export const registerUser = (
  name,
  role,
  phone,
  email,
  location,
  password,
  callback
) => {
  // Check if user already exists
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (_, result) => {
        if (result.rows.length > 0) {
          // User already exists
          callback({ success: false, message: "User already exists" });
        } else {
          // User does not exist, create new user
          db.transaction((tx) => {
            tx.executeSql(
              "INSERT INTO users (name, role, phone, email, location, password) VALUES (?, ?, ?, ?, ?, ?)",
              [name, role, phone, email, location, password],
              (_, result) => {
                console.log("New user inserted with ID:", result.insertId);
                callback({
                  success: true,
                  user: {
                    id: result.insertId,
                    name,
                    role,
                    phone,
                    email,
                    location,
                    password,
                  },
                });
              },
              (_, error) => {
                console.error("Error inserting new user:", error);
                callback({
                  success: false,
                  message: "An error occurred while registering",
                });
              }
            );
          });
        }
      },
      (_, error) => {
        console.error("Error checking if user already exists:", error);
        callback({
          success: false,
          message: "An error occurred while registering",
        });
      }
    );
  });
};

// Log in a user with email and password
export const loginUser = (email, password, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [email, password],
      (_, result) => {
        if (result.rows.length > 0) {
          // User exists and credentials match
          const user = result.rows.item(0);
          callback({ success: true, user });
        } else {
          // User does not exist or credentials do not match
          callback({ success: false, message: "Invalid email or password" });
        }
      },
      (_, error) => {
        console.error("Error logging in user:", error);
        callback({
          success: false,
          message: "An error occurred while logging in",
        });
      }
    );
  });
};

// update name, phone, email and location
export const updateUser = (userId, name, phone, email, location, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
        "UPDATE users SET name = ?, phone = ?, email = ?, location = ? WHERE id = ?",
        [name, phone, email, location, userId],
        (_, result) => {
            callback({success: true, user: {id: userId, name, phone, email, location}});
        },
        (_, error) => {
            callback({success: false, message: error.message});
        }
    )
  })
}

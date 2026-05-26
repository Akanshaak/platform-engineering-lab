import { useState, useEffect } from "react";

function App() {
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Poll status for active (PENDING or PROCESSING) orders
  useEffect(() => {
    const activeOrders = orders.filter(
      (o) => o.status === "PENDING" || o.status === "PROCESSING"
    );
    if (activeOrders.length === 0) return;

    const interval = setInterval(async () => {
      const apiHost = import.meta.env.VITE_API_URL || "http://localhost:8000";

      try {
        const updatedOrders = await Promise.all(
          orders.map(async (order) => {
            // Only poll if the order is not in a terminal state
            if (order.status === "COMPLETED" || order.status === "FAILED") {
              return order;
            }
            try {
              const res = await fetch(`${apiHost}/orders/${order.id}`);
              if (res.ok) {
                const data = await res.json();
                return { ...order, status: data.status };
              }
            } catch (err) {
              console.error(`Error polling order ${order.id}:`, err);
            }
            return order;
          })
        );

        // Simple deep equal check to prevent state updates if nothing changed
        const hasChanges = updatedOrders.some(
          (order, idx) => order.status !== orders[idx].status
        );
        if (hasChanges) {
          setOrders(updatedOrders);
        }
      } catch (e) {
        console.error("Polling error:", e);
      }
    }, 1500); // Poll every 1.5 seconds

    return () => clearInterval(interval);
  }, [orders]);

  const submitOrder = async (e) => {
    e.preventDefault();
    if (!product.trim()) return;

    setLoading(true);
    const apiHost = import.meta.env.VITE_API_URL || "http://localhost:8000";

    try {
      const response = await fetch(`${apiHost}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product, quantity }),
      });

      if (response.ok) {
        const data = await response.json();
        // Add new order with PENDING state to list
        const newOrder = {
          id: data.order_id,
          product,
          quantity,
          status: "PENDING",
          createdAt: new Date().toLocaleTimeString(),
        };
        setOrders((prev) => [newOrder, ...prev]);
        setProduct("");
        setQuantity(1);
      } else {
        alert("Failed to create order");
      }
    } catch (err) {
      console.error("Error creating order:", err);
      alert("Backend API is unreachable. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  // Helper to determine status values for styling/steps
  const getStatusStep = (status) => {
    switch (status) {
      case "PENDING":
        return 1;
      case "PROCESSING":
        return 2;
      case "COMPLETED":
      case "FAILED":
        return 3;
      default:
        return 0;
    }
  };

  // CSS Styles defined inside a string to inject directly
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

    body {
      margin: 0;
      font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #0f172a;
      color: #f8fafc;
      min-height: 100vh;
      -webkit-font-smoothing: antialiased;
    }

    .container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    header {
      text-align: center;
      margin-bottom: 50px;
    }

    header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0;
      background: linear-gradient(135deg, #60a5fa, #3b82f6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.025em;
    }

    header p {
      color: #94a3b8;
      margin: 10px 0 0 0;
      font-size: 1.1rem;
      font-weight: 400;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 30px;
    }

    @media (min-width: 768px) {
      .dashboard-grid {
        grid-template-columns: 350px 1fr;
      }
    }

    .card {
      background: rgba(30, 41, 59, 0.7);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 30px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
    }

    .form-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-top: 0;
      margin-bottom: 20px;
      color: #f8fafc;
      letter-spacing: -0.01em;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      color: #94a3b8;
    }

    .form-control {
      width: 100%;
      padding: 12px 16px;
      font-family: inherit;
      font-size: 0.95rem;
      background: #1e293b;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: #f8fafc;
      box-sizing: border-box;
      transition: all 0.2s ease;
    }

    .form-control:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    }

    .btn {
      width: 100%;
      padding: 14px;
      font-family: inherit;
      font-size: 0.95rem;
      font-weight: 600;
      color: #ffffff;
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
    }

    .btn:hover:not(:disabled) {
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      transform: translateY(-1px);
    }

    .btn:active:not(:disabled) {
      transform: translateY(0);
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .orders-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-top: 0;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .orders-count {
      font-size: 0.8rem;
      background: rgba(59, 130, 246, 0.2);
      color: #60a5fa;
      padding: 4px 10px;
      border-radius: 12px;
      font-weight: 600;
    }

    .no-orders {
      text-align: center;
      padding: 50px 20px;
      color: #64748b;
      font-size: 1rem;
      border: 2px dashed rgba(255, 255, 255, 0.05);
      border-radius: 12px;
    }

    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .order-card {
      background: rgba(30, 41, 59, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 20px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 15px;
    }

    .order-meta h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: #f8fafc;
    }

    .order-info {
      font-size: 0.875rem;
      color: #94a3b8;
      margin-top: 4px;
    }

    .badge {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 6px 12px;
      border-radius: 30px;
      display: flex;
      align-items: center;
      gap: 6px;
      letter-spacing: 0.05em;
    }

    .badge-pending {
      background: rgba(245, 158, 11, 0.15);
      color: #fbbf24;
      border: 1px solid rgba(245, 158, 11, 0.3);
      animation: pulse 1.8s infinite;
    }

    .badge-processing {
      background: rgba(59, 130, 246, 0.15);
      color: #60a5fa;
      border: 1px solid rgba(59, 130, 246, 0.3);
    }

    .badge-completed {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .badge-failed {
      background: rgba(239, 68, 68, 0.15);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .spinner {
      width: 12px;
      height: 12px;
      border: 2px solid currentColor;
      border-top-color: transparent;
      border-radius: 50%;
      display: inline-block;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }

    /* Steps Progress bar */
    .progress-tracker {
      margin-top: 25px;
      position: relative;
      padding: 0 10px;
    }

    .progress-bar-line {
      position: absolute;
      top: 14px;
      left: 10px;
      right: 10px;
      height: 4px;
      background: #334155;
      border-radius: 2px;
      z-index: 1;
    }

    .progress-bar-fill {
      position: absolute;
      top: 14px;
      left: 10px;
      height: 4px;
      background: linear-gradient(90deg, #3b82f6, #60a5fa);
      border-radius: 2px;
      z-index: 2;
      transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .progress-steps {
      position: relative;
      display: flex;
      justify-content: space-between;
      z-index: 3;
    }

    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      width: 80px;
    }

    .step-dot {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #1e293b;
      border: 3px solid #334155;
      color: #64748b;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      font-weight: 700;
      transition: all 0.4s ease;
    }

    .step-label {
      font-size: 0.75rem;
      font-weight: 500;
      color: #64748b;
      margin-top: 8px;
      transition: all 0.4s ease;
    }

    /* Active & Completed step modifications */
    .step.active .step-dot {
      border-color: #3b82f6;
      background: #1e3a8a;
      color: #60a5fa;
      box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
      animation: dotPulse 1.5s infinite;
    }

    .step.active .step-label {
      color: #60a5fa;
      font-weight: 600;
    }

    .step.completed .step-dot {
      border-color: #10b981;
      background: #064e3b;
      color: #34d399;
    }

    .step.completed .step-label {
      color: #34d399;
    }

    /* Failed step modifications */
    .step.failed .step-dot {
      border-color: #ef4444;
      background: #7f1d1d;
      color: #f87171;
    }

    .step.failed .step-label {
      color: #f87171;
      font-weight: 600;
    }

    @keyframes dotPulse {
      0%, 100% { box-shadow: 0 0 12px rgba(59, 130, 246, 0.4); }
      50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.7); }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="container">
        <header>
          <h1>Order Processing Dashboard</h1>
          <p>Create and monitor orders through background tasks in real time</p>
        </header>

        <div className="dashboard-grid">
          {/* Create Order Panel */}
          <div className="card">
            <h2 className="form-title">Create New Order</h2>
            <form onSubmit={submitOrder}>
              <div className="form-group">
                <label>Product Name</label>
                <input
                  className="form-control"
                  placeholder="e.g. MacBook Pro M3"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  min="1"
                  max="100"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  disabled={loading}
                  required
                />
              </div>

              <button className="btn" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Creating...
                  </>
                ) : (
                  "Create Order"
                )}
              </button>
            </form>
          </div>

          {/* Orders Tracking Panel */}
          <div className="card">
            <div className="orders-title">
              <span>Live Order Monitor</span>
              {orders.length > 0 && (
                <span className="orders-count">{orders.length} Total</span>
              )}
            </div>

            {orders.length === 0 ? (
              <div className="no-orders">
                No orders placed yet. Create an order on the left to start tracking!
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => {
                  const currentStep = getStatusStep(order.status);
                  // Calculate dynamic line progression width
                  let barWidth = "0%";
                  if (currentStep === 2) barWidth = "50%";
                  if (currentStep === 3) barWidth = "100%";

                  return (
                    <div className="order-card" key={order.id}>
                      <div className="order-header">
                        <div className="order-meta">
                          <h3>{order.product}</h3>
                          <div className="order-info">
                            ID: #{order.id} • Qty: {order.quantity} • Placed: {order.createdAt}
                          </div>
                        </div>

                        {/* Status Badges */}
                        {order.status === "PENDING" && (
                          <span className="badge badge-pending">
                            <span className="spinner"></span>
                            PENDING
                          </span>
                        )}
                        {order.status === "PROCESSING" && (
                          <span className="badge badge-processing">
                            <span className="spinner"></span>
                            PROCESSING
                          </span>
                        )}
                        {order.status === "COMPLETED" && (
                          <span className="badge badge-completed">
                            ✓ COMPLETED
                          </span>
                        )}
                        {order.status === "FAILED" && (
                          <span className="badge badge-failed">
                            ✗ FAILED
                          </span>
                        )}
                      </div>

                      {/* Steps Progress Tracker */}
                      <div className="progress-tracker">
                        <div className="progress-bar-line"></div>
                        <div
                          className="progress-bar-fill"
                          style={{
                            width: barWidth,
                            background: order.status === "FAILED" ? "#ef4444" : undefined,
                          }}
                        ></div>

                        <div className="progress-steps">
                          {/* Step 1: PENDING */}
                          <div
                            className={`step ${
                              currentStep >= 1 ? "completed" : ""
                            } ${order.status === "PENDING" ? "active" : ""}`}
                          >
                            <div className="step-dot">1</div>
                            <div className="step-label">Created</div>
                          </div>

                          {/* Step 2: PROCESSING */}
                          <div
                            className={`step ${
                              currentStep > 2
                                ? order.status === "FAILED"
                                  ? "failed"
                                  : "completed"
                                : ""
                            } ${order.status === "PROCESSING" ? "active" : ""} ${
                              order.status === "FAILED" && currentStep === 2 ? "failed" : ""
                            }`}
                          >
                            <div className="step-dot">
                              {order.status === "PROCESSING" ? (
                                <span className="spinner" style={{ width: "16px", height: "16px" }}></span>
                              ) : (
                                "2"
                              )}
                            </div>
                            <div className="step-label">Processing</div>
                          </div>

                          {/* Step 3: COMPLETED / FAILED */}
                          <div
                            className={`step ${
                              order.status === "COMPLETED"
                                ? "completed"
                                : order.status === "FAILED"
                                ? "failed"
                                : ""
                            }`}
                          >
                            <div className="step-dot">
                              {order.status === "COMPLETED" ? "✓" : order.status === "FAILED" ? "✗" : "3"}
                            </div>
                            <div className="step-label">
                              {order.status === "FAILED" ? "Failed" : "Finished"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

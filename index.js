export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // API Endpoint: Data return korar jonno (JSON format)
    if (url.pathname === "/api/rents") {
      const sampleData = [
        { id: 1, tenant: "Rahim Ahmed", flat: "A-1", amount: "$500", status: "Paid" },
        { id: 2, tenant: "Karim Ullah", flat: "B-2", amount: "$600", status: "Pending" },
        { id: 3, tenant: "Nasrin Akter", flat: "C-3", amount: "$550", status: "Paid" }
      ];
      return new Response(JSON.stringify(sampleData), {
        headers: { "content-type": "application/json;charset=UTF-8" },
      });
    }

    // Main Web Dashboard (HTML Interface)
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Collecting Rent Dashboard</title>
          <style>
              body { font-family: Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; }
              .container { max-width: 800px; margin: auto; background: white; padding: 25px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
              h1 { color: #333; text-align: center; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
              th { background-color: #007bff; color: white; }
              .badge-paid { background-color: #28a745; color: white; padding: 5px 10px; border-radius: 4px; font-size: 12px; }
              .badge-pending { background-color: #ffc107; color: black; padding: 5px 10px; border-radius: 4px; font-size: 12px; }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>🏠 Collecting Rent Dashboard</h1>
              <p style="text-align: center; color: #666;">Manage your apartments and tenant rents efficiently.</p>
              <table>
                  <thead>
                      <tr>
                          <th>Tenant Name</th>
                          <th>Flat No</th>
                          <th>Amount</th>
                          <th>Status</th>
                      </tr>
                  </thead>
                  <tbody id="rent-table-body">
                      <tr>
                          <td>Rahim Ahmed</td>
                          <td>A-1</td>
                          <td>$500</td>
                          <td><span class="badge-paid">Paid</span></td>
                      </tr>
                      <tr>
                          <td>Karim Ullah</td>
                          <td>B-2</td>
                          <td>$600</td>
                          <td><span class="badge-pending">Pending</span></td>
                      </tr>
                      <tr>
                          <td>Nasrin Akter</td>
                          <td>C-3</td>
                          <td>$550</td>
                          <td><span class="badge-paid">Paid</span></td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </body>
      </html>
    `;

    return new Response(htmlContent, {
      headers: { "content-type": "text/html;charset=UTF-8" },
    });
  },
};
